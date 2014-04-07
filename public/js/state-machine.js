var StateMachine = function() {
  return {
    state: 0,
    turnOn: function (callback) {
      this.state = 1;
      if(callback) callback(this);
      if(!callback) return this;
    },
    turnOff: function (callback) {
      this.state = 0;
      if(callback) callback(this);
      if(!callback) return this;
    }
  };
};
