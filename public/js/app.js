var socketUrl = 'http://localhost:1337';
var app = {
  mice : [],
  mouseListener : io.connect(socketUrl),
  addMouse : function (userMouse) {
    console.log('adding', userMouse.id);
    if(!(_.find(app.mice, {id: userMouse.id}))) app.mice.push(userMouse);
    userMouse.start();
    return app.mice;
  },
  getMouse : function (id) {
    return _.find(app.mice, {id: id});
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

app.mouseListener
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
  });


app.light = new Light({
  socket: io.connect(socketUrl)
});

app.switch = new Switch(
  [app.light],
  {socket: io.connect(socketUrl)}
);
