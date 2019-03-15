import { getValuesFromArray } from 'helpers/array';
import { appendChild, setDomStyles } from 'helpers/dom';
import { setSvgAttributes } from 'helpers/svg';

import {
  getAxisColumn,
  getChartColumns,
} from 'components/chart/utils';

import SVGManipulator from 'svgManipulator';
import SvgIdentificators from './identificators';

import styles from './styles.pcss';

const maxMinimapPoints = 200;

class MiniMap {
  constructor(parent, data, width, height, miniMapHeight) {
    this._parent = parent;
    this._data = data;
    this._width = width;
    this._height = height;
    this._miniMapHeight = miniMapHeight;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();
  }

  renderMinimapChart(columnName, axis, column, maxValue, minValue) {
    const [firstValue] = axis;
    const lastValue = axis[axis.length - 1] - firstValue;

    const axisColumn = axis.map(v => (v - firstValue) * this._width / lastValue);

    const color = this._data.colors[columnName];

    let path = `M${axisColumn[0]} ${(column[0] - minValue) * this._miniMapHeight / maxValue}`;
    for (let j = 1; j < column.length; j += 1) {
      path += ` L${axisColumn[j]} ${(column[j] - minValue) * this._miniMapHeight / maxValue}`;
    }

    const pathEl = this._svgManipulator.createElement(
      'path',
      this._identificators.path(columnName),
      {
        attributes: { d: path },
        styles: { stroke: color },
        className: styles.path,
      },
    );

    return pathEl;
  }

  updateVisible(visibleList, hidenList) {
    visibleList.forEach((key) => {
      const pathEl = this._svgManipulator.getElementById(this._identificators.path(key));
      setDomStyles(pathEl, {
        opacity: 1,
      });
    });

    hidenList.forEach((key) => {
      const pathEl = this._svgManipulator.getElementById(this._identificators.path(key));
      setDomStyles(pathEl, {
        opacity: 0,
      });
    });
  }

  render() {
    const group = this._svgManipulator.getElement('g', this._identificators.minimapGroup);

    setDomStyles(group, {
      transform: `translateY(${this._height}px)`,
    });

    const columns = getChartColumns(this._data);

    let axisColumn = getAxisColumn(this._data).slice(1);
    axisColumn = getValuesFromArray(axisColumn, maxMinimapPoints);

    let maxValue = 0;
    let minValue = Infinity;

    const dataColumns = [];

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i].slice(1);
      const dataColumn = getValuesFromArray(column, maxMinimapPoints);
      dataColumns.push(dataColumn);

      maxValue = Math.max(maxValue, ...dataColumn);
      minValue = Math.min(minValue, ...dataColumn);
    }

    for (let i = 0; i < columns.length; i += 1) {
      const path = this.renderMinimapChart(
        columns[i][0],
        axisColumn,
        dataColumns[i],
        maxValue - minValue,
        minValue,
      );
      appendChild(group, path);
    }

    appendChild(this._parent, group);
  }
}

export default MiniMap;
