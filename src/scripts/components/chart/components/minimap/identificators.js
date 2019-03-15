import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get miniMapGroup() {
    return this._nameWithId('minimap-group');
  }

  path = column => this._nameWithId(`path-${column}`);
}

export default SvgIdentificators;
