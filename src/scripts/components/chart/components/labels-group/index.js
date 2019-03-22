import { dateToString } from 'helpers/dateTime';
import { getValuesFromArray } from 'helpers/array';
import { appendChild } from 'helpers/dom';

import { getAxisColumn } from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import styles from './styles.pcss';

class LabelsGroup {
  constructor(parent, data, startDate, endDate, width) {
    this._parent = parent;
    this._data = data;

    this._width = width;
    this._chartWidth = width;
    this._chartStart = 0;

    this._maxLabels = this.getMaxLabels();

    this._startDate = startDate;
    this._endDate = endDate;

    this._actualLabels = [];
    this._labelsToDelete = [];

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();
  }

  getMaxLabels() {
    return Math.max(Math.floor(this._chartWidth / 60), 3);
  }

  getShowLabels() {
    const column = getAxisColumn(this._data);
    const labels = column.slice(1).filter((value) => {
      let addValue = true;
      if (this._startDate) {
        addValue = this._startDate <= value;
      }

      if (this._endDate) {
        addValue = addValue && this._endDate >= value;
      }

      return addValue;
    });

    return getValuesFromArray(labels, this._maxLabels);
  }

  updateArea(start, end) {
    this._startDate = start;
    this._endDate = end;

    const axisColumn = getAxisColumn(this._data).slice(1);

    const [first] = axisColumn;
    const last = axisColumn[axisColumn.length - 1];

    this._chartWidth = this._width * (last - first) / (end - start);
    this._chartStart = this._chartWidth * (start - first) / (last - first);
  }

  updateWidth(width) {
    this._width = width;
    this._maxLabels = this.getMaxLabels();

    this.updateArea(this._startDate, this._endDate);
    this.renderLegend();
  }

  renderNewLegend = () => {
    const showLabels = this.getShowLabels();

    const newActualLabels = [];
    for (let i = 0; i < showLabels.length; i += 1) {
      newActualLabels.push(showLabels[i]);

      const pos = this._labelsToDelete.indexOf(showLabels[i]);
      if (pos !== -1) {
        this._labelsToDelete.splice(pos, 1);
      }
    }

    for (let i = 0; i < this._actualLabels.length; i += 1) {
      if (!newActualLabels.includes(this._actualLabels[i])) {
        this._labelsToDelete.push(this._actualLabels[i]);
      }
    }

    this._actualLabels = newActualLabels;
  }

  renderLegend = () => {
    const showLabels = this.getShowLabels();
    this._actualLabels = showLabels;
    const showLabelLen = (this._chartWidth - 45) / (showLabels.length - 1);

    return showLabels.map((c, index) => {
      const dateTime = new Date(c);
      const dateTimeString = dateToString(dateTime);

      const translate = index * showLabelLen;
      return this._svgManipulator.createElement(
        'text',
        this._identificators.legend(dateTimeString),
        {
          attributes: {
            x: 0,
            y: 0,
          },
          styles: {
            opacity: 1,
            transform: `translateX(${translate}px)`,
          },
          className: styles.text,
        },
        dateTimeString,
      );
    });
  }

  render() {
    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.group,
      {
        styles: {
          transform: `translateX(-${this._chartStart}px)`,
        },
      },
      this.renderLegend(),
    );

    appendChild(this._parent, group);
  }
}

export default LabelsGroup;
