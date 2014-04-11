var socketUrl = 'http://localhost:1337';
var app = {
  mice : [],
  socket : io.connect(socketUrl),
  addMouse : function (userMouse) {
    if(!(app.getMouse(userMouse.id))) app.mice.push(userMouse);
    userMouse.start();
    return app.mice;
  },
  getMouse : function (id) {
    return _.find(app.mice, {id: id});
  },
  removeMouse : function (id) {
    var mouse = app.getMouse(id);
    if(mouse) mouse.stop();
    app.mice  = _.reject(app.mice, {id: id});
  }, 
  addLocalMouse : function () {
    var mouse = new UserMouse({
      local : true,
      socket: io.connect(socketUrl),
      afterConnect: app.addMouse
    });
  },
  getLocalMouse : function () {
    return _.find(app.mice, {local: true});
  },
  addRemoteMouse : function (mouse) {
    new UserMouse({
      clientX    : mouse.x,
      clientY    : mouse.y,
      id         : mouse.id,
      afterCreate: function (newMouse) {
        app.addMouse(newMouse);

        var localMouse = app.getLocalMouse()
        localMouse.socket.emit(
          'mouse:connected',
          {x: localMouse.clientX, y: localMouse.clientY}
        );
      }
    });
  }
};

app.addLocalMouse();

app.socket
  .on('mouse:connected', function (mouse) {
    if(!app.getMouse(mouse.id)) app.addRemoteMouse(mouse);
  })
  .on('mouse:move', function (mouse) {
    var knownMouse = app.getMouse(mouse.id);
    if(!knownMouse) {
      app.addRemoteMouse(mouse);
    } else if(!knownMouse.local) {
      knownMouse.updatePosition(mouse.x, mouse.y);
    }
  })
  .on('socket:disconnect', function (socket) {
    if(app.getMouse(socket.id)) app.removeMouse(socket.id);
  });


app.light = new Light({
  socket: io.connect(socketUrl)
});

app.switch = new Switch(
  [app.light],
  {socket: io.connect(socketUrl)}
);
