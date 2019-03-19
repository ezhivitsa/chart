import { appendChild } from 'helpers/dom';

import DOMManipulator from 'dom-manipulator';
import SvgIdentificators from './identificators';

import {
  getChartColumns,
  getAxisColumn,
} from 'components/chart/utils';

import styles from './styles.pcss';

class Tooltip {
  constructor(parent, data, width, height, startDate, endDate) {
    this._parent = parent;
    this._data = data;

    this._width = width;
    this._height = height;

    this._chartWidth = width;
    this._chartStart = 0;

    this._startDate = startDate;
    this._endDate = endDate;

    this._visibleList = Object.keys(this._data.names);

    this._identificators = new SvgIdentificators();
    this._domManipulator = new DOMManipulator();
  }

  onGroupClick = (e) => {
    console.log(e);
  }

  getAxisValueByPosition(y) {

  }

  updateVisible(visibleList) {
    this._visibleList = visibleList;
  }

  updateArea(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  getPositions() {
    const axis = getAxisColumn(this._data);

    const [firstValue] = axis;
    const lastValue = axis[axis.length - 1] - firstValue;

    const chartStart = this._chartWidth * (this._startDate - firstValue) / (lastValue - firstValue);

    const axisColumn = axis.map(v => (v - firstValue) * this._width / lastValue - chartStart);
  }

  renderLine() {
    return this._domManipulator.createElement(
      'div',
      this._identificators.line,
      {
        className: styles.line,
        styles: {
          left: 100,
        },
      },
    );
  }

  renderPoints() {
    const columns = getChartColumns(this._data);
    return columns
      .map(c => c[0])
      .filter(c => this._visibleList.includes(c))
      .map((column, i) => {
        return this._domManipulator.createElement(
          'div',
          this._identificators.point(column),
          {
            className: styles.point,
            styles: {
              borderColor: this._data.colors[column],
              left: 100,
              top: i * 100 + 50,
            },
          },
        );
      });
  }

  renderListItems() {
    return this._visibleList.map((key) => {
      const bigText = this._domManipulator.createElement(
        'span',
        this._identificators.bigText(key),
        {
          className: styles.bigText,
          styles: {
            color: this._data.colors[key],
          },
        },
        '142',
      );
      const smallText = this._domManipulator.createElement(
        'span',
        this._identificators.smallText(key),
        {
          className: styles.smallText,
          styles: {
            color: this._data.colors[key],
          },
        },
        this._data.names[key],
      );

      return this._domManipulator.createElement(
        'li',
        this._identificators.listItem(key),
        { className: styles.item },
        [
          bigText,
          smallText,
        ],
      );
    });
  }

  renderInfo() {
    const title = this._domManipulator.createElement(
      'span',
      this._identificators.title,
      { className: styles.title },
      'Sat, Feb 24',
    );

    const list = this._domManipulator.createElement(
      'ul',
      this._identificators.list,
      { className: styles.list },
      this.renderListItems(),
    );

    return this._domManipulator.createElement(
      'div',
      this._identificators.infoWrap,
      {
        className: styles.info,
        styles: {
          left: 100,
        },
      },
      [
        title,
        list,
      ],
    );
  }

  render() {
    const group = this._domManipulator.createElement(
      'div',
      this._identificators.group,
      {
        onClick: this.onGroupClick,
        className: styles.wrap,
        styles: {
          width: this._width,
          height: this._height,
        },
      },
      [
        this.renderLine(),
        this.renderPoints(),
        this.renderInfo(),
      ],
    );

    appendChild(this._parent, group);
  }
}

export default Tooltip;
