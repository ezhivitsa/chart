import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get wrap() {
    return this._nameWithId('wrap');
  }

  get selector() {
    return this._nameWithId('selector');
  }

  get left() {
    return this._nameWithId('left');
  }

  get right() {
    return this._nameWithId('right');
  }

  get leftSelector() {
    return this._nameWithId('left-selector');
  }

  get rightSelector() {
    return this._nameWithId('right-selector');
  }
}

export default DOMIdentificators;
