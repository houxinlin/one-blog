class Event {
  constructor() {
    console.log("构造");
    this.events = {};
  }

  on(eventName, fn) {
    console.log("订阅" + eventName);
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  trigger(eventName, data) {
    console.log(this.events[eventName]);
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
}

export default new Event();
