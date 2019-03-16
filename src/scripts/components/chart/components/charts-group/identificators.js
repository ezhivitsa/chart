import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get chartsGroup() {
    return this._nameWithId('charts-group');
  }

  path = column => this._nameWithId(`path-${column}`);
}

export default SvgIdentificators;
