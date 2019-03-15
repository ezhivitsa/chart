import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get button() {
    return this._nameWithId('button');
  }

  get checkbox() {
    return this._nameWithId('check');
  }

  get text() {
    return this._nameWithId('text');
  }

  get icon() {
    return this._nameWithId('icon');
  }

  get circle() {
    return this._nameWithId('circle');
  }
}

export default DOMIdentificators;
