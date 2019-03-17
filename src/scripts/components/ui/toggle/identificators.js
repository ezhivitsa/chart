import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get wrap() {
    return this._nameWithId('wrap');
  }

  get toggle() {
    return this._nameWithId('toggle');
  }

  get text() {
    return this._nameWithId('text');
  }

  get indicator() {
    return this._nameWithId('inidcator');
  }
}

export default DOMIdentificators;
