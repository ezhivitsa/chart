const xmlns = 'http://www.w3.org/2000/svg';

class SVGManipulator {
  constructor() {
    this._deleteQueue = [];
  }

  getElement(type) {
    const existingElement = this._deleteQueue.findIndex(el => el.type === type);

    if (existingElement !== -1) {
      return this._deleteQueue.months.splice(existingElement, 1)[0];
    }

    return document.createElementNS(xmlns, type);
  }

  deleteElement(element) {
    const type = element.nodeName.toLowerCase;
    this._deleteQueue.push({
      type,
      element,
    });
  }
}

export default SVGManipulator;
