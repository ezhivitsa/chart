import { appendChild } from 'helpers/dom';

import Button from 'components/ui/button';

import DOMManipulator from 'dom-manipulator';
import DOMIdentificators from './identificators';

import styles from './styles.pcss';

class Buttons {
  constructor(parent, names, colors, onSelectedChanged) {
    this._parent = parent;
    this._names = names;
    this._colors = colors;

    this._onSelectedChanged = onSelectedChanged;

    this._domManipulator = new DOMManipulator();
    this._identificators = new DOMIdentificators();

    this._selectedList = Object.keys(this._names);
    this._unselectedList = [];

    this._buttons = Object.keys(this._names).map((key) => {
      return new Button(
        this.wrapper(),
        key,
        this._names[key],
        this._colors[key],
        this.onButtonClick(key),
      );
    });
  }

  onButtonClick = key => (selected) => {
    if (selected) {
      this._selectedList.push(key);

      const position = this._unselectedList.indexOf(key);
      this._unselectedList.splice(position, 1);
    } else {
      const position = this._selectedList.indexOf(key);
      this._selectedList.splice(position, 1);

      this._unselectedList.push(key);
    }

    this._onSelectedChanged(this._selectedList, this._unselectedList);
  }

  wrapper() {
    return this._domManipulator.getElement('div', this._identificators.wrap);
  }

  render() {
    const wrap = this._domManipulator.getElement('div', this._identificators.wrap);
    wrap.classList.add(styles.wrap);

    this._buttons.forEach((button) => {
      button.render();
    });

    appendChild(this._parent, wrap);
  }
}

export default Buttons;
