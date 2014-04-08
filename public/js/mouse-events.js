function UserMouse (options) {
  if(!options) throw new Error('An options hash is required for UserMouse');

  var instance = {
    local          : options.local      || false,
    clientX        : options.clientX    || 0,
    clientY        : options.clientY    || 0,
    sampleTime     : options.sampleTime || 3000,
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
    }
  };

  return instance;
};
