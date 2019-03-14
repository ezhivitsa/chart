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

  onButtonClick = (key) => {
    return (e) => {
      const checkbox = this._domManipulator.getElementById(this._identificators.checkbox(key));

      if (checkbox.classList.contains(styles.unchecked)) {
        checkbox.classList.remove(styles.unchecked);
        checkbox.classList.add(styles.checked);
      } else {
        checkbox.classList.add(styles.unchecked);
        checkbox.classList.remove(styles.checked);
      }
    };
  }

  renderButton(key) {
    const el = this._domManipulator.getElement('div', this._identificators.button(key));
    el.classList.add(styles.button);
    this._domManipulator.addEventListener(
      this._identificators.button(key),
      'click',
      this.onButtonClick(key),
    );

    const checkbox = this._domManipulator.getElement(
      'span',
      this._identificators.checkbox(key),
    );
    checkbox.classList.add(styles.checkbox);
    setDomStyles(checkbox, {
      background: this._colors[key],
    });

    const circle = this._domManipulator.getElement('span', this._identificators.circle(key));
    setDomStyles(circle, {
      borderColor: this._colors[key],
    });
    circle.classList.add(styles.circle);

    const icon = this._domManipulator.getElement('i', this._identificators.icon(key));
    icon.classList.add(styles.icon, 'fas', 'fa-check');

    appendChild(checkbox, icon);
    appendChild(checkbox, circle);

    const text = this._domManipulator.getElement(
      'span',
      this._identificators.text(key),
    );
    text.classList.add(styles.buttonText);
    text.textContent = this._names[key];

    appendChild(el, checkbox);
    appendChild(el, text);

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
