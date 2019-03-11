const xmlns = 'http://www.w3.org/2000/svg';
const xlinkns = 'http://www.w3.org/1999/xlink';

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

  getUseElement(link) {
    const use = this.getElement('use');
    use.setAttributeNS(xlinkns, 'href', `#${link}`);
    return use;
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
