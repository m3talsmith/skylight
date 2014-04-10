var Light = function(options) {
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
      instance.elementOff();
    })
    .on('disconnect', function () {
      instance.elementOff();
    })
    .on('light:on', function () {
      instance.turnOn(function () {
        instance.elementOn();
      });
    })
    .on('light:off', function () {
      instance.turnOn(function () {
        instance.elementOff();
      });
    });

  return instance;
};

Light.prototype             = Object.create(StateMachine.prototype);
Light.prototype.constructor = StateMachine;
