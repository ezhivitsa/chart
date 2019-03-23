import { appendChild } from 'helpers/dom';

import { calculateMaxValue } from 'components/chart/utils';

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

    this._startTimeout = null;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();

    this._visibleList = Object.keys(data.names);

    this._actualLines = [];
    this._linesToDelete = [];

    this.addLineDef();
  }

  updateVisible(visibleList) {
    this._visibleList = visibleList;
  }

  updateWidth(width) {
    this._width = width;
    this.addLineDef();
  }

  getLinesData() {
    const maxChartValue = calculateMaxValue(
      this._data,
      this._startDate,
      this._endDate,
      this._visibleList,
    );

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
      value > 10000 ? `${Math.round(value / 100) / 10}K` : value,
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
      this._actualLines.push(j);
      result.push(this.renderLine(j, scale));
    }

    return result;
  }

  updateArea(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
  }

  renderNewLines = () => {
    const { diff, scale } = this.getLinesData();

    this._newScale = scale;

    const newActualLines = [];
    for (let i = 0, j = 0; i < linesCount; i += 1, j += diff) {
      newActualLines.push(j);

      const pos = this._linesToDelete.indexOf(j);
      if (pos !== -1) {
        this._linesToDelete.splice(pos, 1);
      }
    }

    for (let i = 0; i < this._actualLines.length; i += 1) {
      if (!newActualLines.includes(this._actualLines[i])) {
        this._linesToDelete.push(this._actualLines[i]);
      }
    }

    const addNewLines = newActualLines.filter(line => !this._actualLines.includes(line));

    const actualLinesEls = addNewLines.map((line) => {
      return this.renderLine(line, this._scale, true);
    });

    if (addNewLines.length) {
      this._actualLines = newActualLines;

      const group = this._svgManipulator.getElementById(this._identificators.group);
      appendChild(group, actualLinesEls);

      this.animateLines();

      this._startTimeout = null;
      this._oldScale = this._scale;
      requestAnimationFrame(this.setScale);
    }
  }

  animateLines() {
    setTimeout(() => {
      this._linesToDelete.forEach((value) => {
        this.renderLine(value, this._newScale, true);
      });

      this._actualLines.forEach((value) => {
        this.renderLine(value, this._newScale);
      });

      this.removeOldLinesTimeout();
    }, 20);
  }

  setScale = (timestamp) => {
    if (!this._startTimeout) {
      this._startTimeout = timestamp;
    }

    const progress = (this._newScale - this._oldScale) / 360 * (timestamp - this._startTimeout);

    if (this._scale !== this._newScale) {
      this._scale = this._oldScale + Math.min(
        this._newScale - this._oldScale,
        progress,
      );

      requestAnimationFrame(this.setScale);
    } else {
      this._oldScale = null;
      this._startTimeout = null;
    }
  }

  removeOldLinesTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(this.removeOldLines, animationTime);
  }

  removeOldLines = () => {
    this._timeout = null;

    if (this._linesToDelete.length) {
      this._linesToDelete.forEach((value) => {
        this._svgManipulator.deleteElement(this._identificators.lineGroup(value));
      });
      this._linesToDelete = [];
    }
  }

  render() {
    const linesData = this.getLinesData();
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
