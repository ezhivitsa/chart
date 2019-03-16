import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get group() {
    return this._nameWithId('group');
  }

  legend = dateTimeString => this._nameWithId(`legend-${dateTimeString}`);
}

export default SvgIdentificators;
