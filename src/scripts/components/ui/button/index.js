import { appendChild } from 'helpers/dom';

import DOMManipulator from 'domManipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

class Buttons {
  constructor(parent, key, name, color, onClick) {
    this._parent = parent;
    this._key = key;
    this._name = name;
    this._color = color;
    this._onClick = onClick;

    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();
  }

  onButtonClick = (e) => {
    const checkbox = this._domManipulator.getElementById(this._identificators.checkbox);
    const unchecked = checkbox.classList.contains(styles.unchecked);

    if (unchecked) {
      checkbox.classList.remove(styles.unchecked);
      checkbox.classList.add(styles.checked);
    } else {
      checkbox.classList.add(styles.unchecked);
      checkbox.classList.remove(styles.checked);
    }

    this._onClick(unchecked);
  }

  renderButton() {
    const circle = this._domManipulator.createElement(
      'span',
      this._identificators.circle,
      {
        className: styles.circle,
        styles: {
          borderColor: this._color,
        },
      },
    );

    const icon = this._domManipulator.createElement(
      'i',
      this._identificators.icon,
      { className: [styles.icon, 'fas', 'fa-check'] },
    );

    const checkbox = this._domManipulator.createElement(
      'span',
      this._identificators.checkbox,
      {
        className: styles.checkbox,
        styles: {
          background: this._color,
        },
      },
      [
        circle,
        icon,
      ],
    );

    const text = this._domManipulator.createElement(
      'span',
      this._identificators.text,
      { className: styles.buttonText },
      this._name,
    );

    const el = this._domManipulator.createElement(
      'div',
      this._identificators.button,
      {
        className: styles.button,
        onClick: this.onButtonClick,
      },
      [
        checkbox,
        text,
      ],
    );

    return el;
  }

  render() {
    const element = this.renderButton();
    appendChild(this._parent, element);
  }
}

export default Buttons;
