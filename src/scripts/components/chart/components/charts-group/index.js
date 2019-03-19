import { appendChild } from 'helpers/dom';

import {
  getAxisColumn,
  getChartColumns,
  createChartPath,
  calculateMaxValue,
} from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import styles from './styles.pcss';

class ChartsGroup {
  constructor(parent, data, width, height) {
    this._parent = parent;
    this._data = data;
    this._width = width;
    this._height = height;

    this._maxValue = 0;

    this._chartWidth = width;
    this._chartStart = 0;
    this._visibleList = Object.keys(data.names);

    this._start = null;

    this._startDate = null;
    this._endDate = null;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();
  }

  renderChart(columnName, axis, column, maxValue, noAnimation) {
    const path = createChartPath(
      axis,
      column,
      maxValue,
      0,
      this._chartWidth,
      this._height,
    );

    const color = this._data.colors[columnName];

    const pathEl = this._svgManipulator.createElement(
      'path',
      this._identificators.path(columnName),
      {
        attributes: { d: path },
        styles: {
          stroke: color,
          ...(noAnimation ? { transition: 'none' } : {}),
        },
        className: styles.path,
      },
    );

    return pathEl;
  }

  updateArea(start, end) {
    this._startDate = start;
    this._endDate = end;

    const axisColumn = getAxisColumn(this._data).slice(1);

    const [first] = axisColumn;
    const last = axisColumn[axisColumn.length - 1];

    // first ~ 0
    // last ~ this._chartWidth
    // start ~ ?

    this._chartWidth = this._width * (last - first) / (end - start);
    this._chartStart = this._chartWidth * (start - first) / (last - first);

    requestAnimationFrame(this.startVerticalAnimation);

    this._svgManipulator.updateElement(
      this._identificators.chartsGroup,
      {
        styles: { transform: `translateX(-${this._chartStart}px)` },
      },
    );
  }

  updateVisible(visibleList, hiddenList) {
    this._visibleList = visibleList;

    Object.keys(this._data.names).forEach((key) => {
      this._svgManipulator.updateElement(
        this._identificators.path(key),
        {
          styles: {
            opacity: visibleList.includes(key) ? 1 : 0,
            transition: 'all 0.5s',
          },
        },
      );
    });
  }

  startVerticalAnimation = (timestamp) => {
    if (!this._start) {
      this._start = timestamp;
    }

    const progress = Math.floor((timestamp - this._start) / 2);

    const axisColumn = getAxisColumn(this._data).slice(1);
    const originalColumns = getChartColumns(this._data);

    this._newMaxValue = calculateMaxValue(
      this._data,
      this._startDate,
      this._endDate,
      this._visibleList,
    );

    let maxValue = this._maxValue;
    if (this._newMaxValue !== maxValue) {
      const sign = this._newMaxValue > maxValue ? 1 : -1;

      maxValue += Math.min(
        Math.abs(this._newMaxValue - maxValue),
        progress,
      ) * sign;
    }

    originalColumns.forEach((column, index) => {
      this.renderChart(
        column[0],
        axisColumn,
        column.slice(1),
        maxValue,
        true,
      );
    });

    if (this._newMaxValue !== maxValue) {
      requestAnimationFrame(this.startVerticalAnimation);
    } else {
      this._start = null;
      this._maxValue = maxValue;
    }
  }

  render() {
    const originalColumns = getChartColumns(this._data);
    const axisColumn = getAxisColumn(this._data).slice(1);

    this._maxValue = calculateMaxValue(
      this._data,
      this._startDate,
      this._endDate,
      this._visibleList,
    );

    const paths = originalColumns.map((column, index) => {
      return this.renderChart(
        column[0],
        axisColumn,
        column.slice(1),
        this._maxValue,
      );
    });

    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.chartsGroup,
      {
        styles: { transform: `translateX(-${this._chartStart}px)` },
      },
      paths,
    );

    appendChild(this._parent, group);
  }
}

export default ChartsGroup;
