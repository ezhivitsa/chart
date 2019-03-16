import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get group() {
    return this._nameWithId('group');
  }

  get lineDef() {
    return this._nameWithId('line-def');
  }

  line = value => this._nameWithId(`line-${value}`);

  lineText = value => this._nameWithId(`line-text-${value}`);

  lineGroup = value => this._nameWithId(`line-group-${value}`);
}

export default SvgIdentificators;
