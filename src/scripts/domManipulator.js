class DOMManipulator {
  constructor() {
    this._cache = {};
  }

  getElement(type, identificator) {
    if (!this._cache[identificator]) {
      this._cache[identificator] = document.createElement(type);
    }

    return this._cache[identificator];
  }
}

export default DOMManipulator;
