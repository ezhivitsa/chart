import { appendChild } from 'helpers/dom';

import DOMManipulator from 'dom-manipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

class Toggle {
  constructor(parent, text, on, onChange) {
    this._parent = parent;
    this._text = text;
    this._on = on;
    this._onChange = onChange;

    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();
  }

  onTogglrClick = () => {}

  renderToggle() {
    const indicator = this._domManipulator.createElement(
      'span',
      this._identificators.idicator,
      {
        className: [styles.indicator, this._on ? styles.on : ''],
      },
    );

    return this._domManipulator.createElement(
      'div',
      this._identificators.toggle,
      {
        className: styles.toggle,
        onClick: this.onToggleClick,
      },
      indicator,
    );
  }

  render() {
    const toggle = this.renderToggle();
    const text = this._domManipulator.createElement(
      'span',
      this._identificators.text,
      { className: styles.text },
      this._text,
    );

    const wrap = this._domManipulator.createElement(
      'div',
      this._identificators.wrap,
      { className: styles.wrap },
      [
        toggle,
        text,
      ],
    );

    appendChild(this._parent, wrap);
  }
}

export default Toggle;
