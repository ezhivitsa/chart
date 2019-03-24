import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get container() {
    return this._nameWithId('container');
  }

  get defs() {
    return this._nameWithId('defs');
  }

  get miniMapGroup() {
    return this._nameWithId('minimap-group');
  }

  get miniMapGroupWrap() {
    return this._nameWithId('minimap-group-wrap');
  }

  get chartsGroup() {
    return this._nameWithId('charts-group');
  }

  get chartsGroupWrap() {
    return this._nameWithId('charts-group-wrap');
  }

  get labelsGroup() {
    return this._nameWithId('labels-group');
  }

  get linesGroup() {
    return this._nameWithId('lines-group');
  }

  get wrap() {
    return this._nameWithId('wrap');
  }

  get labelsGroupWrap() {
    return this._nameWithId('labels-group-wrap');
  }
}

export default SvgIdentificators;
