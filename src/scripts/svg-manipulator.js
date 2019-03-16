import { appendChild, setDomStyles } from 'helpers/dom';
import { setSvgAttributes } from 'helpers/svg';

const xmlns = 'http://www.w3.org/2000/svg';
const xlinkns = 'http://www.w3.org/1999/xlink';

class SVGManipulator {
  constructor() {
    this._cache = {};
  }

  getElement(type, identificator) {
    if (!this._cache[identificator]) {
      this._cache[identificator] = document.createElementNS(xmlns, type);
    }

    return this._cache[identificator];
  }

  getElementById(identificator) {
    return this._cache[identificator];
  }

  createElement(type, identificator, options, children) {
    this.getElement(type, identificator);
    return this.updateElement(identificator, options, children);
  }

  updateElement(identificator, options, children) {
    const element = this.getElementById(identificator);

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
    if (element instanceof Element) {
      element.parentNode.removeChild(element);
    } else if (typeof element === 'string') {
      const el = this.getElementById(element);

      if (el) {
        el.parentNode.removeChild(el);
      }
    }
  }
}

export default SVGManipulator;
