var Switch = function(lights, options) {
  if(!options.socket) console.log('socket is a required field');

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
        console.log('turning on switch...');
        instance.lightsOn();
        instance.elementOn();

        instance.socket.emit('switch:on', 'on', function (data) {
          console.log(data);
          console.log('switched turned on. Lights should glow yo!');
        });
      });
    } else {
      instance.turnOff(function () {
        console.log('turning off switch...');
        instance.lightsOff();
        instance.elementOff();

        instance.socket.emit('switch:off', 'off', function (data) {
          console.log(data);
          console.log('switched turned off. Lights should dim yo!');
        });
      });
    }
  }

  instance.socket
    .on('connect', function () {
      console.log('switch is online');
      instance.elementOff();
    })
    .on('disconnect', function () {
      console.log('switch is offline');
      instance.elementOff();
    })
    .on('light:on', function () {
      console.log('turning on switch...');
      instance.turnOn(function () {
        console.log('switch turned on over socket');
        instance.elementOn();
      });
    })
    .on('light:off', function () {
      console.log('turning off switch...');
      instance.turnOff(function () {
        console.log('switch turned off over socket');
        instance.elementOff();
      });
    });

  instance.element().addEventListener('click', instance.toggle);

  return instance;
};

Switch.prototype             = Object.create(StateMachine.prototype);
Switch.prototype.constructor = StateMachine;
