import { appendChild, setDomStyles } from 'helpers/dom';

import DOMManipulator from 'dom-manipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

const selectorTypes = {
  left: 'Left',
  center: 'Selector',
  right: 'Right',
};

const simulateClick = (elem) => {
	// Create our event (with options)
	const evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	const canceled = !elem.dispatchEvent(evt);
};

class MiniMapSelector {
  constructor(parent, width, minWidth, onUpdate) {
    this._parent = parent;
    this._onUpdate = onUpdate;

    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();

    this._isMoveLeft = false;
    this._isMoveRight = false;
    this._isMoveSelector = false;

    this._leftPosition = 0;
    this._rightPosition = 0;
    this._width = width;

    this._mouseDownX = 0;
    this._mouseUpX = 0;

    this._minWidth = Math.max(minWidth, 40);
  }

  onMousedown = position => (e) => {
    e.preventDefault();
    e.stopPropagation();

    this._mouseDownX = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
    this._mouseUpX = this._mouseDownX;

    const positions = Object.values(selectorTypes);
    positions.forEach((pos) => {
      this[`_isMove${pos}`] = pos === position;
    });

    simulateClick(document.body);
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
    this._mouseUpX = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;

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
      leftPosition = Math.min(leftPosition, this._width - this._rightPosition - this._minWidth);
    }
    if (this._isMoveRight) {
      rightPosition -= (this._mouseUpX - this._mouseDownX);
      rightPosition = Math.max(rightPosition, 0);
      rightPosition = Math.min(rightPosition, this._width - this._leftPosition - this._minWidth);
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

    this._onUpdate(
      leftPosition / this._width,
      1 - rightPosition / this._width,
    );
  }

  updateWidth(width) {
    this._leftPosition = this._leftPosition / this._width * width;
    this._rightPosition = this._rightPosition / this._width * width;

    this._width = width;

    this.render();
  }

  renderSelector() {
    const left = this._domManipulator.createElement(
      'div',
      this._identificators.leftSelector,
      {
        className: styles.leftSelector,
        onMouseDown: this.onMousedown(selectorTypes.left),
        onTouchStart: this.onMousedown(selectorTypes.left),
      },
    );

    const right = this._domManipulator.createElement(
      'div',
      this._identificators.rightSelector,
      {
        className: styles.rightSelector,
        onMouseDown: this.onMousedown(selectorTypes.right),
        onTouchStart: this.onMousedown(selectorTypes.right),
      },
    );

    const selector = this._domManipulator.createElement(
      'div',
      this._identificators.selector,
      {
        className: styles.selector,
        onMouseDown: this.onMousedown(selectorTypes.center),
        onTouchStart: this.onMousedown(selectorTypes.center),
        styles: { width: this._width - this._leftPosition - this._rightPosition },
      },
      [
        left,
        right,
      ],
    );

    return selector;
  }

  render() {
    const selector = this.renderSelector();

    const left = this._domManipulator.createElement(
      'div',
      this._identificators.left,
      {
        className: styles.left,
        styles: { width: this._leftPosition },
      },
    );

    const right = this._domManipulator.createElement(
      'div',
      this._identificators.right,
      {
        className: styles.right,
        styles: { width: this._rightPosition },
      },
    );

    const wrap = this._domManipulator.createElement(
      'div',
      this._identificators.wrap,
      {
        className: styles.wrap,
        styles: { width: this._width },
        onMouseLeave: this.onOut,
        onMouseUp: this.onOut,
        onTouchEnd: this.onOut,
        onMouseMove: this.onMove,
        onTouchMove: this.onMove,
      },
      [
        left,
        selector,
        right,
      ],
    );

    appendChild(this._parent, wrap);
  }
}

export default MiniMapSelector;
