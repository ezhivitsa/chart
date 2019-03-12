import { appendChild, setDomStyles } from 'helpers/dom';

import DOMManipulator from '../domManipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

class MiniMap {
  constructor(parent) {
    this._parent = parent;
    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();
  }

  renderSelector() {
    const selector = this._domManipulator.getElement('div', this._identificators.selector());
    selector.classList.add(styles.selector);
    setDomStyles(selector, { width: '50px' });

    const left = this._domManipulator.getElement('div', this._identificators.leftSelector());
    left.classList.add(styles.leftSelector);

    const right = this._domManipulator.getElement('div', this._identificators.rightSelector());
    right.classList.add(styles.rightSelector);

    appendChild(selector, left);
    appendChild(selector, right);

    return selector;
  }

  render() {
    const wrap = this._domManipulator.getElement('div', this._identificators.wrap());
    wrap.classList.add(styles.wrap);
    setDomStyles(wrap, { width: '500px' });

    const selector = this.renderSelector();

    const left = this._domManipulator.getElement('div', this._identificators.left());
    left.classList.add(styles.left);
    setDomStyles(left, { width: '50px' });

    const right = this._domManipulator.getElement('div', this._identificators.right());
    right.classList.add(styles.right);
    setDomStyles(right, { width: '400px' });

    appendChild(wrap, left);
    appendChild(wrap, selector);
    appendChild(wrap, right);

    appendChild(this._parent, wrap);
  }
}

export default MiniMap;
