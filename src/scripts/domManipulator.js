class DOMManipulator {
  constructor() {
    this._cache = {};
    this._events = {};
  }

  _callCallbacks(identificator, eventType) {
    return (e) => {
      const { callbacks } = this._events[identificator][eventType];
      for (let i = 0; i < callbacks.length; i += 1) {
        callbacks[i](e);
      }
    };
  }

  getElement(type, identificator) {
    if (!this._cache[identificator]) {
      this._cache[identificator] = document.createElement(type);
    }

    return this._cache[identificator];
  }

  getElementById(identificator) {
    return this._cache[identificator];
  }

  addEventListener(identificator, eventTypes, callback) {
    const element = this._cache[identificator];
    if (!element) {
      return;
    }

    const types = eventTypes instanceof Array ? eventTypes : [eventTypes];
    types.forEach((eventType) => {
      this._events[identificator] = this._events[identificator] || {};
      const events = this._events[identificator];

      if (!events[eventType]) {
        const fn = this._callCallbacks(identificator, eventType);

        events[eventType] = {
          fn,
          callbacks: [callback],
        };

        element.addEventListener(eventType, fn);
      } else {
        const hasCallback = events[eventType].callbacks.includes(callback);
        if (!hasCallback) {
          events[eventType].callbacks.push(callback);
        }
      }
    });
  }
}

export default DOMManipulator;
