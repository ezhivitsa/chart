import { dateToString } from 'helpers/dateTime';
import { getValuesFromArray } from 'helpers/array';
import { appendChild } from 'helpers/dom';

import { getAxisColumn } from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

const maxLabelsAllowed = 6;

class LabelsGroup {
  constructor(parent, data, width) {
    this._parent = parent;
    this._data = data;
    this._width = width;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();
  }

  getShowLabels() {
    const column = getAxisColumn(this._data);
    const labels = column.slice(1);

    return getValuesFromArray(labels, maxLabelsAllowed);
  }

  renderLegend() {
    const column = getAxisColumn(this._data);
    const showLabels = this.getShowLabels();

    const labelLen = (this._width - 45) / (column.length - 1);
    const showLabelLen = (this._width - 45) / (showLabels.length - 2);

    return column.slice(1).map((c, index) => {
      const dateTime = new Date(c);
      const dateTimeString = dateToString(dateTime);

      const position = showLabels.indexOf(c);

      return this._svgManipulator.createElement(
        'text',
        this._identificators.legend(dateTimeString),
        {
          attributes:{
            x: position !== -1 ? position * showLabelLen : (index - 1) * labelLen,
            y: 0,
          },
          styles: { opacity: position !== -1 ? 1 : 0 },
        },
        dateTimeString,
      );
    });
  }

  render() {
    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.group,
      {},
      this.renderLegend(),
    );

    appendChild(this._parent, group);
  }
}

export default LabelsGroup;
