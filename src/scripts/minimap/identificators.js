import Identificators from '../identificators';

class DOMIdentificators extends Identificators {
  wrap = () => this._nameWithId('wrap');

  selector = () => this._nameWithId('selector');

  left = () => this._nameWithId('left');

  right = () => this._nameWithId('right');

  leftSelector = () => this._nameWithId('left-selector');

  rightSelector = () => this._nameWithId('right-selector');
}

export default DOMIdentificators;
