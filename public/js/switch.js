var Switch = function(lights, options) {
  var instance       = StateMachine.call(this);
  instance.socket    = options.socket;
  instance.lights    = lights || [];
  instance.elementId = options.elementId || 'switch';

  instance.lightsOn = function () {
    for(var i=0, length=instance.lights.length; i < length; i +=1) {
      instance.lights[i].turnOn();
    }
  };

  instance.lightsOff = function () {
    for(var i=0, length=instance.lights.length; i < length; i +=1) {
      instance.lights[i].turnOff();
    }
  };

  instance.element = function () {
    return document.getElementById(instance.elementId);
  };

  instance.elementOn = function () {
    instance.element().setAttribute('class', 'on');
  };

  instance.elementOff = function () {
    instance.element().setAttribute('class', 'off');
  };

  instance.toggle = function () {
    if(instance.state === 0) {
      instance.turnOn(function () {
        instance.lightsOn();
        instance.elementOn();

        instance.socket.emit('switch:on', 'on');
      });
    } else {
      instance.turnOff(function () {
        instance.lightsOff();
        instance.elementOff();

        instance.socket.emit('switch:off', 'off');
      });
    }
  }

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
      instance.turnOff(function () {
        instance.elementOff();
      });
    });

  instance.element().addEventListener('click', instance.toggle);

  return instance;
};

Switch.prototype             = Object.create(StateMachine.prototype);
Switch.prototype.constructor = StateMachine;
