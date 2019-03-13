import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get wrap() {
    return this._nameWithId('wrap');
  }

  button = key => this._nameWithId(`button-${key}`);
}

export default DOMIdentificators;
