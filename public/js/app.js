var app = {
  mice          : {},
  mouseListener : io.connect('http://localhost:1337'),
  addMouse      : function (userMouse) {
    console.log('adding', userMouse.id);
    app.mice[userMouse.id] = userMouse;
    userMouse.start();
    return app.mice;
  },
  getMouse      : function (id) {
    return app.mice[id];
  },
  addLocalMouse : function () {
    var mouse = new UserMouse({
      local : true,
      socket: io.connect('http://localhost:1337'),
      afterConnect: app.addMouse
    });
  }
};

app.addLocalMouse();

app.mouseListener.on('mouse:connected', function (mouse) {
  console.log('Incoming mouse ', mouse.id, app.getMouse(mouse.id) ? 'exists' : 'new');
  console.log('inspecting mouse: ', mouse);
  if(!app.getMouse(mouse.id)) {
    mouse.afterCreate = app.addMouse;
    new UserMouse(mouse);
  }
});

app.light = new Light({
  socket: io.connect('http://localhost:1337')
});

app.switch = new Switch(
  [app.light],
  {socket: io.connect('http://localhost:1337')}
);
