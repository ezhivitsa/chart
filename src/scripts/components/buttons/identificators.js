import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get wrap() {
    return this._nameWithId('wrap');
  }
}

export default DOMIdentificators;
