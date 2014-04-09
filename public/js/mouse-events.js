function UserMouse (options) {
  if(!options) throw new Error('An options hash is required for UserMouse');

  var instance = {
    local          : options.local      || false,
    clientX        : options.clientX    || 0,
    clientY        : options.clientY    || 0,
    sampleTime     : options.sampleTime || 3000,
    socket         : options.socket,
    id             : options.id,
    samplePosition : function () {
      document.addEventListener('mousemove', function (mouseEvent) {
        document.removeEventListener('mousemove');
        instance.updatePosition(mouseEvent.clientX, mouseEvent.clientY);
        setTimeout(instance.sampleTime, instance.samplePosition);
      });
    },
    updatePosition : function (x, y) {
      instance.clientX = x;
      instance.clientY = y;
      if(instance.local) instance.sendPosition();
    },
    sendPosition : function () {
      if(instance.socket) {
        instance.socket.emit(
          'mouse:move',
          {x: instance.clientX, y: instance.clientY},
          function (data) { console.log(data); }
        );
      }
    },
    start : function () {
      if(instance.local) instance.sendPosition();
    }
  };

  if(instance.socket) {
    instance.socket.on('connect', function (socket) {
      instance.id = this.socket.sessionid;
      instance.socket.emit(
        'mouse:connected',
        {x: instance.clientX, y: instance.clientY}
      );
      console.log(instance.id, 'connected with', options);
      if(options.afterConnect) options.afterConnect(instance);
    });
  }

  if(options.afterCreate) options.afterCreate(instance);

  return instance;
};
