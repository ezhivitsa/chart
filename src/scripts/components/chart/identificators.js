import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get container() {
    return this._nameWithId('container');
  }

  get defs() {
    return this._nameWithId('defs');
  }

  get miniMapGroupWrap() {
    return this._nameWithId('minimap-group-wrap');
  }

  get chartsGroup() {
    return this._nameWithId('charts-group');
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

  get rect() {
    return this._nameWithId('rect');
  }

  pathDef = columnName => this._nameWithId(`path-def-${columnName}`);

  pathMiniMap = columnName => this._nameWithId(`path-minimap-${columnName}`);
}

export default SvgIdentificators;
