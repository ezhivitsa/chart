import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get container() {
    return this._nameWithId('container');
  }

  defs = () => this._nameWithId('defs');

  pathDef = columnName => this._nameWithId(`path-def-${columnName}`);

  get lineDef() {
    return this._nameWithId('line-def');
  }

  line = value => this._nameWithId(`line-${value}`);

  lineText = value => this._nameWithId(`line-text-${value}`);

  lineGroup = value => this._nameWithId(`line-group-${value}`);

  legend = dateTimeString => this._nameWithId(`legend-${dateTimeString}`);

  minimapGroup = () => this._nameWithId('minimap-group');

  pathMiniMap = columnName => this._nameWithId(`path-minimap-${columnName}`);

  get miniMapGroupWrap() {
    return this._nameWithId('minimap-group-wrap');
  }
}

export default SvgIdentificators;
