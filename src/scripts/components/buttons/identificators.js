import Identificators from 'identificators';

class DOMIdentificators extends Identificators {
  get wrap() {
    return this._nameWithId('wrap');
  }

  button = key => this._nameWithId(`button-${key}`);

  checkbox = key => this._nameWithId(`check-${key}`);

  text = key => this._nameWithId(`text-${key}`);

  icon = key => this._nameWithId(`icon-${key}`);

  circle = key => this._nameWithId(`circle-${key}`);
}

export default DOMIdentificators;
