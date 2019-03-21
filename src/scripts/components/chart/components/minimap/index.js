import { getValuesFromArray } from 'helpers/array';
import { appendChild } from 'helpers/dom';

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

    this.render();
  }

  updateWidth(width) {
    this._width = width;
    this.render();
  }

  render() {
    const columns = getChartColumns(this._data);

    let axisColumn = getAxisColumn(this._data).slice(1);
    axisColumn = getValuesFromArray(axisColumn, maxMinimapPoints);

    let maxValue = 0;
    let minValue = Infinity;

    const dataColumns = [];

    for (let i = 0; i < columns.length; i += 1) {
      if (
        !this._visibleList.length ||
        this._visibleList.includes(columns[i][0])
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

    const paths = dataColumns.map((dataColumn) => {
      return this.renderMinimapChart(
        dataColumn.name,
        axisColumn,
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
