import { appendChild } from 'helpers/dom';
import { dateToInfoString } from 'helpers/dateTime';

import {
  getChartColumns,
  getAxisColumn,
  calculateMaxValue,
} from 'components/chart/utils';

import DOMManipulator from 'dom-manipulator';
import SvgIdentificators from './identificators';

import styles from './styles.pcss';

const hoverGap = 10;
const infoWidth = 130;

class Tooltip {
  constructor(parent, data, width, height, topPadding, startDate, endDate) {
    this._parent = parent;
    this._data = data;

    this._width = width;
    this._height = height;
    this._topPadding = topPadding;

    this._chartWidth = width;
    this._chartStart = 0;

    this._startDate = startDate;
    this._endDate = endDate;

    this._visibleList = Object.keys(this._data.names);
    this._positions = this.getPositions();

    this._identificators = new SvgIdentificators();
    this._domManipulator = new DOMManipulator();

    this.addBodyEvents();
  }

  addBodyEvents() {
    document.body.addEventListener('click', this.onBodyClick);
    document.body.addEventListener('touchstart', this.onBodyClick);
  }

  onBodyClick = (e) => {
    const group = this._domManipulator.getElementById(this._identificators.group);

    if (!group.contains(e.target)) {
      this.hideTooltip();
    }
  }

  onHideInfo = () => {
    this.hideTooltip();
  }

  onGroupClick = (e) => {
    const group = this._domManipulator.getElementById(this._identificators.group);
    const { left } = group.getBoundingClientRect();

    const x = e.pageX;
    const position = this.getAxisValueByPosition(x - left);

    if (position) {
      this.showTooltip(position);
    } else {
      this.hideTooltip();
    }
  }

  updateWidth(width) {
    this._width = width;

    this.hideTooltip();
    this.render();
  }

  getAxisValueByPosition(x) {
    for (let i = 0; i < this._positions.length; i += 1) {
      const { value } = this._positions[i];
      const nextValue = i !== this._positions.length - 1
        ? this._positions[i + 1].value
        : Infinity;

      if (value <= x && x <= nextValue) {
        if (x - hoverGap <= value) {
          return this._positions[i];
        }

        if (x + hoverGap >= nextValue) {
          return this._positions[i + 1];
        }

        return null;
      }
    }

    return null;
  }

  showTooltip(position) {
    if (!this._visibleList.length) {
      return;
    }

    this._domManipulator.updateElement(
      this._identificators.line,
      {
        styles: {
          display: 'block',
          left: position.value + 1,
        },
      },
    );

    Object.keys(this._data.names).forEach((key) => {
      this._domManipulator.updateElement(
        this._identificators.point(key),
        {
          styles: {
            left: position.value + 1,
            top: position.columns[key].pos,
            display: this._visibleList.includes(key) ? 'block' : 'none',
          },
        },
      );
    });

    this._domManipulator.updateElement(
      this._identificators.infoWrap,
      { styles: { display: 'block' } },
    );

    this.renderInfo(position);
  }

  hideTooltip() {
    this._domManipulator.updateElement(
      this._identificators.line,
      { styles: { display: 'none' } },
    );

    Object.keys(this._data.names).forEach((key) => {
      this._domManipulator.updateElement(
        this._identificators.point(key),
        { styles: { display: 'none' } },
      );
    });

    this._domManipulator.updateElement(
      this._identificators.infoWrap,
      { styles: { display: 'none' } },
    );
  }

  updateVisible(visibleList) {
    this._visibleList = visibleList;
    this._positions = this.getPositions();
  }

  updateArea(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
    this._positions = this.getPositions();
  }

  getPositions() {
    const axis = getAxisColumn(this._data).slice(1);
    const columns = getChartColumns(this._data);

    const [firstValue] = axis;
    const lastValue = axis[axis.length - 1] - firstValue;

    this._chartWidth = this._width * lastValue / (this._endDate - this._startDate);
    const chartStart = this._chartWidth * (this._startDate - firstValue) / lastValue;

    const axisColumn = axis.map(v => (v - firstValue) * this._chartWidth / lastValue - chartStart);
    const maxValue = calculateMaxValue(
      this._data,
      this._startDate,
      this._endDate,
      this._visibleList,
    );

    return axisColumn.map((value, index) => {
      const columnsData = {};
      for (let i = 0; i < columns.length; i += 1) {
        const pos = this._height
          - columns[i][index + 1] * (this._height - this._topPadding) / maxValue;
        columnsData[columns[i][0]] = {
          pos,
          value: columns[i][index + 1],
        };
      }

      return {
        dateTime: axis[index],
        value,
        columns: columnsData,
      };
    });
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

  renderListItems(columns = {}) {
    return Object.keys(this._data.names).map((key) => {
      const bigText = this._domManipulator.createElement(
        'span',
        this._identificators.bigText(key),
        {
          className: styles.bigText,
          styles: {
            color: this._data.colors[key],
          },
        },
        columns[key] ? columns[key].value : '',
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
        {
          className: styles.item,
          styles: {
            display: this._visibleList.includes(key) ? 'block' : 'none',
          },
        },
        [
          bigText,
          smallText,
        ],
      );
    });
  }

  renderInfo(position = {}) {
    const title = this._domManipulator.createElement(
      'span',
      this._identificators.title,
      { className: styles.title },
      dateToInfoString(position.dateTime),
    );

    const list = this._domManipulator.createElement(
      'ul',
      this._identificators.list,
      { className: styles.list },
      this.renderListItems(position.columns),
    );

    let left = 0;
    if (typeof position.value === 'number') {
      left = position.value + 7;
      if (position.value + infoWidth >= this._width) {
        left -= infoWidth;
      }
    }

    return this._domManipulator.createElement(
      'div',
      this._identificators.infoWrap,
      {
        className: styles.info,
        styles: { left },
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
        onMouseMove: this.onGroupClick,
        onMouseLeave: this.onHideInfo,
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
