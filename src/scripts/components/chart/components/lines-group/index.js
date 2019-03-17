import { appendChild } from 'helpers/dom';

import {
  getChartColumns,
  calculateData,
  calculateMaxValue,
} from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import { lineStyles } from './styles';

const linesCount = 5;

const animationTime = 500;

class LinesGroup {
  constructor(parent, defs, data, width, height, startDate, endDate) {
    this._parent = parent;
    this._defs = defs;
    this._data = data;

    this._width = width;
    this._height = height;

    this._startDate = startDate;
    this._endDate = endDate;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();

    this._visibleList = Object.keys(data.names);
    this._lines = [];
    this._newLines = [];

    this.addLineDef();
  }

  updateVisible(visibleList) {
    this._visibleList = visibleList;
  }

  getLinesData(data) {
    const columns = getChartColumns(data);
    const maxChartValue = calculateMaxValue(columns, this._visibleList);

    const diff = maxChartValue / (linesCount - 1);
    const scale = (this._height - 20) / maxChartValue;

    return {
      diff,
      scale,
    };
  }

  addLineDef() {
    const lineDef = this._svgManipulator.createElement(
      'line',
      this._identificators.lineDef,
      {
        attributes: {
          x1: 0,
          x2: this._width,
          y1: this._height,
          y2: this._height,
          id: this._identificators.lineDef,
        },
        styles: lineStyles,
      },
    );

    appendChild(this._defs, lineDef);
  }

  renderLine(value, scale, hide) {
    const line = this._svgManipulator.getUseElement(
      this._identificators.lineDef,
      this._identificators.line(value),
    );

    const text = this._svgManipulator.createElement(
      'text',
      this._identificators.lineText(value),
      {
        attributes: {
          x: 0,
          y: this._height - 5,
        },
      },
      value,
    );

    return this._svgManipulator.createElement(
      'g',
      this._identificators.lineGroup(value),
      {
        styles: {
          transform: `translateY(-${value * scale}px)`,
          transition: 'all 0.5s',
          opacity: hide ? 0 : 1,
        },
      },
      [
        line,
        text,
      ],
    );
  }

  renderLines({ diff, scale }) {
    const result = [];

    for (let i = 0, j = 0; i < linesCount; i += 1, j += diff) {
      this._lines.push(j);
      result.push(this.renderLine(j, scale));
    }

    return result;
  }

  updateArea(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  renderNewLines = () => {
    this.removeOldLines();

    const data = calculateData(this._data, this._startDate, this._endDate);
    const { diff, scale } = this.getLinesData(data);

    const result = [];
    this._newScale = scale;

    for (let i = 0, j = 0; i < linesCount; i += 1, j += diff) {
      if (!this._lines.includes(j)) {
        if (!this._newLines.includes(j)) {
          result.push(this.renderLine(j, this._scale, true));
        }
      } else {
        const pos = this._lines.indexOf(j);
        this._lines.splice(pos, 1);
      }

      if (!this._newLines.includes(j)) {
        this._newLines.push(j);
      }
    }

    if (!this._lines.length && this._scale === this._newScale) {
      this._lines = this._newLines;
      this._newLines = [];
      return;
    }

    const group = this._svgManipulator.getElementById(this._identificators.group);
    appendChild(group, result);

    this.animateLines();
  }

  animateLines() {
    setTimeout(() => {
      this._lines.forEach((value) => {
        this.renderLine(value, this._newScale, true);
      });

      this._newLines.forEach((value) => {
        this.renderLine(value, this._newScale);
      });

      this.removeOldLinesTimeout();
    });
  }

  removeOldLinesTimeout() {
    setTimeout(() => this.removeOldLines, animationTime);
  }

  removeOldLines = () => {
    if (this._newScale) {
      this._scale = this._newScale;
      this._newScale = null;
    }

    if (this._newLines.length) {
      // this._lines.forEach((value) => {
      //   this._svgManipulator.deleteElement(this._identificators.lineGroup(value));
      // });

      this._lines = this._newLines;
      this._newLines = [];
    }
  }

  render() {
    const data = calculateData(this._data, this._startDate, this._endDate);
    const linesData = this.getLinesData(data);
    this._scale = linesData.scale;

    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.group,
      {},
      this.renderLines(linesData),
    );

    appendChild(this._parent, group);
  }
}

export default LinesGroup;
