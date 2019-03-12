import Identificators from '../identificators';

class SvgIdentificators extends Identificators {
  defs = () => this._nameWithId('defs');

  pathDef = columnName => this._nameWithId(`path-def-${columnName}`);

  lineDef = () => this._nameWithId('line-def');

  line = value => this._nameWithId(`line-${value}`);

  lineText = value => this._nameWithId(`line-text-${value}`);

  lineGroup = value => this._nameWithId(`line-group-${value}`);

  legend = dateTimeString => this._nameWithId(`legend-${dateTimeString}`);

  minimapGroup = () => this._nameWithId('minimap-group');

  pathMiniMap = columnName => this._nameWithId(`path-minimap-${columnName}`);
}

export default SvgIdentificators;
