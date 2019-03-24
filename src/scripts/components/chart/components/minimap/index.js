import { getValuesFromArray } from 'helpers/array';
import { appendChild } from 'helpers/dom';
import { isChrome } from 'helpers/common';

import {
  getAxisColumn,
  getChartColumns,
  createChartPath,
} from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import styles from './styles.pcss';

const maxMinimapPoints = 200;

class MiniMap {
  constructor(parent, data, width, miniMapHeight) {
    this._parent = parent;
    this._data = data;
    this._width = width;
    this._miniMapHeight = miniMapHeight;

    this._visibleList = Object.keys(data.names);

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();

    this._start = null;

    this._maxValue = 0;
    this._minValue = 0;

    this._newMaxValue = 0;
    this._newMinValue = 0;
    this._newDataColumns = [];

    let axisColumn = getAxisColumn(this._data).slice(1);
    this._axisColumn = getValuesFromArray(axisColumn, maxMinimapPoints);
  }

  renderMinimapChart(columnName, axis, column, maxValue, minValue) {
    const path = createChartPath(
      axis,
      column,
      maxValue,
      minValue,
      this._width,
      this._miniMapHeight,
    );

    const color = this._data.colors[columnName];

    const pathEl = this._svgManipulator.createElement(
      'path',
      this._identificators.path(columnName),
      {
        attributes: { d: path },
        styles: {
          stroke: color,
          opacity: this._visibleList.includes(columnName) ? 1 : 0,
          transition: isChrome ? 'all 0.3s' : 'opacity 0.3s',
        },
        className: styles.path,
      },
    );

    return pathEl;
  }

  updateVisible(visibleList, hiddenList) {
    this._visibleList = visibleList;

    hiddenList.forEach((key) => {
      this._svgManipulator.updateElement(
        this._identificators.path(key),
        { styles: { opacity: 0 } },
      );
    });

    if (isChrome) {
      this.render();
    } else {
      this.animateCharts();
    }
  }

  updateWidth(width) {
    this._width = width;
    this.render();
  }

  animateCharts() {
    const {
      maxValue,
      minValue,
      dataColumns,
    } = this.calculateMinMaxValues();

    this._newMaxValue = maxValue;
    this._newMinValue = minValue;
    this._newDataColumns = dataColumns;

    requestAnimationFrame(this.startVerticalAnimation);
  }

  startVerticalAnimation = (timestamp) => {
    if (!this._start) {
      this._start = timestamp;
    }

    let maxValue = this._maxValue;
    let minValue = this._minValue;

    const maxProgress = (this._newMaxValue - this._maxValue) / 180 * (timestamp - this._start);
    const minProgress = (this._newMinValue - this._minValue) / 180 * (timestamp - this._start);

    if (
      this._newMaxValue !== maxValue
      || this._newMinValue !== minValue
    ) {
      const maxValueSign = this._newMaxValue - this._maxValue >= 0 ? 1 : -1;
      maxValue += Math.min(
        Math.abs(this._newMaxValue - maxValue),
        Math.abs(maxProgress),
      ) * maxValueSign;

      const minValueSign = this._newMinValue - this._minValue >= 0 ? 1 : -1;
      minValue += Math.min(
        Math.abs(this._newMinValue - minValue),
        Math.abs(minProgress),
      ) * minValueSign;
    }

    this._newDataColumns.forEach((dataColumn) => {
      this.renderMinimapChart(
        dataColumn.name,
        this._axisColumn,
        dataColumn.column,
        maxValue - minValue,
        minValue,
      );
    });

    if (
      this._newMaxValue !== maxValue
      || this._newMinValue !== minValue
    ) {
      requestAnimationFrame(this.startVerticalAnimation);
    } else {
      this._start = null;
      this._maxValue = maxValue;
      this._minValue = minValue;
    }
  }

  calculateMinMaxValues() {
    const columns = getChartColumns(this._data);

    const dataColumns = [];

    let maxValue = 0;
    let minValue = Infinity;

    for (let i = 0; i < columns.length; i += 1) {
      if (
        !this._visibleList.length
        || this._visibleList.includes(columns[i][0])
      ) {
        const column = columns[i].slice(1);
        const dataColumn = getValuesFromArray(column, maxMinimapPoints);
        dataColumns.push({
          name: columns[i][0],
          column: dataColumn,
        });

        maxValue = Math.max(maxValue, ...dataColumn);
        minValue = Math.min(minValue, ...dataColumn);
      }
    }

    return {
      maxValue,
      minValue,
      dataColumns,
    };
  }

  render() {
    const {
      maxValue,
      minValue,
      dataColumns,
    } = this.calculateMinMaxValues();

    this._maxValue = maxValue;
    this._minValue = minValue;

    const paths = dataColumns.map((dataColumn) => {
      return this.renderMinimapChart(
        dataColumn.name,
        this._axisColumn,
        dataColumn.column,
        maxValue - minValue,
        minValue,
      );
    });

    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.minimapGroup,
      {},
      paths,
    );

    appendChild(this._parent, group);
  }
}

export default MiniMap;
