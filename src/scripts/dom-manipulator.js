import { appendChild, setDomStyles } from 'helpers/dom';

const eventFields = [
  {
    field: 'onClick',
    event: 'click',
  },
  {
    field: 'onMouseMove',
    event: 'mousemove',
  },
  {
    field: 'onMouseLeave',
    event: 'mouseleave',
  },
  {
    field: 'onMouseUp',
    event: 'mouseup',
  },
  {
    field: 'onMouseDown',
    event: 'mousedown',
  },
  {
    field: 'onTouchEnd',
    event: 'touchend',
  },
  {
    field: 'onTouchMove',
    event: 'touchmove',
  },
  {
    field: 'onTouchStart',
    event: 'touchstart',
  },
];

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

  createElement(type, identificator, options, children) {
    const element = this.getElement(type, identificator);

    if (options.className instanceof Array) {
      const classNames = options.className.filter(c => !!c);
      element.classList.add(...classNames);
    } else if (typeof options.className === 'string') {
      element.classList.add(options.className);
    }

    if (options.styles) {
      setDomStyles(element, options.styles);
    }

    eventFields.forEach((eventField) => {
      if (options[eventField.field]) {
        this.clearEvents(identificator, eventField.event);
        this.addEventListener(identificator, eventField.event, options[eventField.field]);
      }
    });

    if (children instanceof Array) {
      children.forEach((child) => {
        appendChild(element, child);
      });
    } else if (children instanceof Element) {
      appendChild(element, children);
    } else if (typeof children === 'string') {
      element.textContent = children;
    }

    return element;
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

  clearEvents(identificator, eventType) {
    const element = this._cache[identificator];
    if (!element) {
      return;
    }

    this._events[identificator] = this._events[identificator] || {};
    const events = this._events[identificator];

    if (events[eventType]) {
      events[eventType].callbacks = [];
    }
  }
}

export default DOMManipulator;
