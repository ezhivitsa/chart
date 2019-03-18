import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get group() {
    return this._nameWithId('group');
  }

  get line() {
    return this._nameWithId('line');
  }
}

export default SvgIdentificators;
