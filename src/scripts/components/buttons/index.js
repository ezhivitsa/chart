import { appendChild, setDomStyles } from 'helpers/dom';

import DOMManipulator from 'domManipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

class Buttons {
  constructor(parent, names, colors) {
    this._parent = parent;
    this._names = names;
    this._colors = colors;

    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();
  }

  renderButton(key) {
    const el = this._domManipulator.getElement('div', this._identificators.button(key));
    el.classList.add(styles.button);

    return el;
  }

  render() {
    const wrap = this._domManipulator.getElement('div', this._identificators.wrap);
    wrap.classList.add(styles.wrap);

    Object.keys(this._names).forEach((key) => {
      const element = this.renderButton(key);
      appendChild(wrap, element);
    });

    appendChild(this._parent, wrap);
  }
}

export default Buttons;
