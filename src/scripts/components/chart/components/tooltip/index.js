import { appendChild } from 'helpers/dom';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import { getChartColumns } from 'components/chart/utils';

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
    this._svgManipulator = new SVGManipulator();
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

    // this._chartWidth = this._width * (last - first) / (end - start);
    // this._chartStart = this._chartWidth * (start - first) / (last - first);
  }

  renderLine() {
    return this._svgManipulator.createElement(
      'line',
      this._identificators.line,
      {
        className: styles.line,
        attributes: {
          y1: -5,
          y2: this._height - 5,
          x1: 100,
          x2: 100,
        },
      },
    );
  }

  renderPoints() {
    // const columns = getChartColumns(this._data);
    // return columns
    //   .filter(c => this._visibleList.includes(c[0]))
    //   .map((column) => {
    //       return this._svgManipulator.
    //   });
  }

  render() {
    const group = this._svgManipulator.createElement(
      'g',
      this._svgManipulator.group,
      {
        onClick: this.onGroupClick,
      },
      [
        this.renderLine(),
        // this.renderPoints(),
      ]
    );

    appendChild(this._parent, group);
  }
}

export default Tooltip;
