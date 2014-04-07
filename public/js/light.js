var Light = function(options) {
  if(!options.socket) console.log('socket is a required field');

  var instance    = StateMachine.call(this);
  instance.socket = options.socket;

  instance.socket
    .on('connect', function () {
      console.log('light is online');
    })
    .on('disconnect', function () {
      console.log('light is offline');
    })
    .on('light:on', function () {
      console.log('turning on light...');
      instance.turnOn(function () {
        console.log('light turned on over socket');
      });
    })
    .on('light:off', function () {
      console.log('turning off light...');
      instance.turnOn(console.log('light turned off over socket'));
    });

  return instance;
};

Light.prototype             = Object.create(StateMachine.prototype);
Light.prototype.constructor = StateMachine;
