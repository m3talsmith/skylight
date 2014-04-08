var Light = function(options) {
  if(!options.socket) console.log('socket is a required field');

  var instance       = StateMachine.call(this);
  instance.socket    = options.socket;
  instance.elementId = options.elementId || 'light';

  instance.element = function () {
    return document.getElementById(instance.elementId);
  };

  instance.elementOn = function () {
    instance.element().setAttribute('class', 'on');
  };

  instance.elementOff = function () {
    instance.element().setAttribute('class', 'off');
  };
  
  var superTurnOn  = instance.turnOn,
      superTurnOff = instance.turnOff;

  instance.turnOn  = function (callback) {
    instance.elementOn();
    superTurnOn(callback);
  };

  instance.turnOff = function (callback) {
    instance.elementOff();
    superTurnOff(callback);
  };

  instance.socket
    .on('connect', function () {
      console.log('light is online');
      instance.elementOff();
    })
    .on('disconnect', function () {
      console.log('light is offline');
      instance.elementOff();
    })
    .on('light:on', function () {
      console.log('turning on light...');
      instance.turnOn(function () {
        console.log('light turned on over socket');
        instance.elementOn();
      });
    })
    .on('light:off', function () {
      console.log('turning off light...');
      instance.turnOn(function () {
        console.log('light turned off over socket')
        instance.elementOff();
      });
    });

  return instance;
};

Light.prototype             = Object.create(StateMachine.prototype);
Light.prototype.constructor = StateMachine;
