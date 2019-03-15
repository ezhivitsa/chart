import { appendChild, setDomStyles } from 'helpers/dom';
import { setSvgAttributes } from 'helpers/svg';

const xmlns = 'http://www.w3.org/2000/svg';
const xlinkns = 'http://www.w3.org/1999/xlink';

class SVGManipulator {
  constructor() {
    this._deleteQueue = [];
    this._cache = {};
  }

  getElement(type, identificator) {
    const existingElement = this._deleteQueue.findIndex(el => el.type === type);

    if (existingElement !== -1) {
      return this._deleteQueue.months.splice(existingElement, 1)[0];
    }

    if (!this._cache[identificator]) {
      this._cache[identificator] = document.createElementNS(xmlns, type);
    }

    return this._cache[identificator];
  }

  getElementById(identificator) {
    return this._cache[identificator];
  }

  createElement(type, identificator, options, children) {
    const element = this.getElement(type, identificator);

    if (options.className instanceof Array) {
      element.classList.add(...options.className);
    } else if (typeof options.className === 'string') {
      element.classList.add(options.className);
    }

    if (options.styles) {
      setDomStyles(element, options.styles);
    }

    setSvgAttributes(element, options.attributes);

    if (children instanceof Array) {
      children.forEach((child) => {
        appendChild(element, child);
      });
    } else if (children instanceof HTMLElement) {
      appendChild(element, children);
    } else if (typeof children === 'string') {
      element.textContent = children;
    } else if (typeof children === 'number') {
      element.textContent = children.toString();
    }

    return element;
  }

  getUseElement(link, identificator) {
    const use = this.getElement('use', identificator);
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
