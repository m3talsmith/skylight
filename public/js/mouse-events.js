function UserMouse (options) {
  if(!options) throw new Error('An options hash is required for UserMouse');

  var instance = {
    local          : options.local      || false,
    clientX        : options.clientX    || 0,
    clientY        : options.clientY    || 0,
    sampleTime     : options.sampleTime || 3000,
    socket         : options.socket,
    id             : options.id,
    updateElement : function () {
      var instanceElement = instance.element();

      instanceElement.style.left = instance.clientX + 'px';
      instanceElement.style.top  = instance.clientY + 'px';
    },
    createElement : function () {
      if(!instance.element() && !instance.local) {
        var textNode        = document.createTextNode(instance.id),
            instanceElement = document.createElement('div');

        instanceElement.setAttribute('class', 'remote-user-mouse');
        instanceElement.appendChild(textNode);

        instanceElement.id         ='remote-user-mouse-' + instance.id;
        instanceElement.style.left = instance.clientX + 'px';
        instanceElement.style.top  = instance.clientY + 'px';

        document.body.appendChild(instanceElement);
      }
    },
    element : function () {
      return document.getElementById('remote-user-mouse-' + instance.id);
    },
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
      if(instance.local)  instance.sendPosition();
      if(!instance.local) instance.updateElement();
    },
    sendPosition : function () {
      if(instance.socket) {
        instance.socket.emit(
          'mouse:move',
          {x: instance.clientX, y: instance.clientY}
        );
      }
    },
    start : function () {
      if(instance.local) {
        instance.updatePosition();
        instance.samplePosition();
      } else {
        instance.createElement();
      }
    }
  };

  if(instance.socket) {
    instance.socket.on('connect', function (socket) {
      instance.id = this.socket.sessionid;
      instance.socket.emit(
        'mouse:connected',
        {x: instance.clientX, y: instance.clientY}
      );

      if(options.afterConnect) options.afterConnect(instance);
    });
  }

  if(options.afterCreate) options.afterCreate(instance);

  return instance;
};
