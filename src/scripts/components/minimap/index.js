import { appendChild, setDomStyles } from 'helpers/dom';

import DOMManipulator from 'domManipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

const selectorTypes = {
  left: 'Left',
  center: 'Selector',
  right: 'Right',
};

const minWidth = 50;

class MiniMap {
  constructor(parent) {
    this._parent = parent;
    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();

    this._isMoveLeft = false;
    this._isMoveRight = false;
    this._isMoveSelector = false;

    this._leftPosition = 0;
    this._rightPosition = 0;
    this._width = 500;

    this._mouseDownX = 0;
    this._mouseUpX = 0;
  }

  onMousedown = position => (e) => {
    e.preventDefault();
    e.stopPropagation();

    this._mouseDownX = e.pageX || e.touches[0].pageX;
    this._mouseUpX = e.pageX || e.touches[0].pageX;

    const positions = Object.values(selectorTypes);
    positions.forEach((pos) => {
      this[`_isMove${pos}`] = pos === position;
    });
  }

  onOut = (e) => {
    if (this._temp) {
      this._leftPosition = this._temp.leftPosition;
      this._rightPosition = this._temp.rightPosition;
      this._temp = null;
    }

    const positions = Object.values(selectorTypes);
    positions.forEach((pos) => {
      this[`_isMove${pos}`] = false;
    });
  }

  onMove = (e) => {
    this._mouseUpX = e.pageX || e.touches[0].pageX;

    const left = this._domManipulator.getElementById(this._identificators.left);
    const selector = this._domManipulator.getElementById(this._identificators.selector);
    const right = this._domManipulator.getElementById(this._identificators.right);

    const isUpdate = this._isMoveLeft || this._isMoveRight || this._isMoveSelector;
    if (!left || !selector || !right || !isUpdate) {
      return;
    }

    let leftPosition = this._leftPosition;
    let rightPosition = this._rightPosition;

    if (this._isMoveLeft) {
      leftPosition += (this._mouseUpX - this._mouseDownX);
      leftPosition = Math.max(leftPosition, 0);
      leftPosition = Math.min(leftPosition, this._width - this._rightPosition - minWidth);
    }
    if (this._isMoveRight) {
      rightPosition -= (this._mouseUpX - this._mouseDownX);
      rightPosition = Math.max(rightPosition, 0);
      rightPosition = Math.min(rightPosition, this._width - this._leftPosition - minWidth);
    }

    if (this._isMoveSelector) {
      leftPosition += (this._mouseUpX - this._mouseDownX);
      leftPosition = Math.max(leftPosition, 0);
      leftPosition = Math.min(leftPosition, this._leftPosition + this._rightPosition);

      rightPosition -= (this._mouseUpX - this._mouseDownX);
      rightPosition = Math.max(rightPosition, 0);
      rightPosition = Math.min(rightPosition, this._leftPosition + this._rightPosition);
    }

    this._temp = {
      leftPosition,
      rightPosition,
    };

    setDomStyles(left, { width: leftPosition });
    setDomStyles(selector, { width: this._width - leftPosition - rightPosition });
    setDomStyles(right, { width: rightPosition });
  }

  renderSelector() {
    const selector = this._domManipulator.getElement('div', this._identificators.selector);
    selector.classList.add(styles.selector);
    this._domManipulator.addEventListener(
      this._identificators.selector,
      ['mousedown', 'touchstart'],
      this.onMousedown(selectorTypes.center),
    );
    setDomStyles(selector, { width: this._width - this._leftPosition - this._rightPosition });

    const left = this._domManipulator.getElement('div', this._identificators.leftSelector);
    left.classList.add(styles.leftSelector);
    this._domManipulator.addEventListener(
      this._identificators.leftSelector,
      ['mousedown', 'touchstart'],
      this.onMousedown(selectorTypes.left),
    );

    const right = this._domManipulator.getElement('div', this._identificators.rightSelector);
    right.classList.add(styles.rightSelector);
    this._domManipulator.addEventListener(
      this._identificators.rightSelector,
      ['mousedown', 'touchstart'],
      this.onMousedown(selectorTypes.right),
    );

    appendChild(selector, left);
    appendChild(selector, right);

    return selector;
  }

  render() {
    const wrap = this._domManipulator.getElement('div', this._identificators.wrap);
    wrap.classList.add(styles.wrap);
    this._domManipulator.addEventListener(
      this._identificators.wrap,
      'mouseleave',
      this.onOut,
    );
    this._domManipulator.addEventListener(
      this._identificators.wrap,
      ['mouseup', 'touchend'],
      this.onOut,
    );

    this._domManipulator.addEventListener(
      this._identificators.wrap,
      ['mousemove', 'touchmove'],
      this.onMove,
    );

    setDomStyles(wrap, { width: this._width });

    const selector = this.renderSelector();

    const left = this._domManipulator.getElement('div', this._identificators.left);
    left.classList.add(styles.left);
    setDomStyles(left, { width: this._leftPosition });

    const right = this._domManipulator.getElement('div', this._identificators.right);
    right.classList.add(styles.right);
    setDomStyles(right, { width: this._rightPosition });

    appendChild(wrap, left);
    appendChild(wrap, selector);
    appendChild(wrap, right);

    appendChild(this._parent, wrap);
  }
}

export default MiniMap;
