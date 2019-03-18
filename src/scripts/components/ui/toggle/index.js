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

  onToggleClick = () => {
    const toggle = this._domManipulator.getElementById(this._identificators.toggle);
    const isOn = toggle.classList.contains(styles.on);
    if (isOn) {
      toggle.classList.remove(styles.on);
    } else {
      toggle.classList.add(styles.on);
    }

    this._onChange(!isOn);
  }

  renderToggle() {
    const indicator = this._domManipulator.createElement(
      'span',
      this._identificators.idicator,
      { className: styles.indicator },
    );

    return this._domManipulator.createElement(
      'div',
      this._identificators.toggle,
      {
        className: [styles.toggle, this._on ? styles.on : ''],
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
