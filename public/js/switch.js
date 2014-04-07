var Switch = function(options) {
  if(!options.socket) console.log('socket is a required field');

  var instance    = StateMachine.call(this);
  instance.socket = options.socket;

  instance.toggle = function () {
    var self = this;

    if(self.state === 0) {
      self.turnOn(function () {
        console.log('turning on switch...');
        self.socket.emit('switch:on', 'on', function (data) {
          console.log(data);
          console.log('switched turned on. Lights should glow yo!');
        });
      });
    } else {
      self.turnOff(function () {
        console.log('turning off switch...');
        self.socket.emit('switch:off', 'off', function (data) {
          console.log(data);
          console.log('switched turned off. Lights should dim yo!');
        });
      });
    }
  }

  instance.socket
    .on('connect', function () {
      console.log('switch is online');
    })
    .on('disconnect', function () {
      console.log('switch is offline');
    })
    .on('light:on', function () {
      console.log('turning on switch...');
      instance.turnOn(function () {
        console.log('switch turned on over socket');
      });
    })
    .on('light:off', function () {
      console.log('turning off switch...');
      instance.turnOff(function () {
        console.log('switch turned off over socket');
      });
    });

  return instance;
};

Switch.prototype             = Object.create(StateMachine.prototype);
Switch.prototype.constructor = StateMachine;
