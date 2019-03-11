import {
  setSvgAttributes,
  setSvgStyles,
} from './helpers/svg';
import { dateToString } from './helpers/dateTime';

import {
  lineStyles,
  labelStyles,
  yAxisTextStyles,
} from './styles';

import SVGManipulator from './svgManipulator';

import {
  calculateData,
  getAxisColumn,
  getChartColumns,
} from './utils';

const minLineDelta = 1;

const width = 500;
const height = 350;
const chartHeight = 300;

const maxLabelsAllowed = 6;

const lineDefId = 'lineDefId';

class Chart {
  constructor(el, data, lines) {
    this._wrapperElement = el;
    this._linesCount = lines;

    this._startDate = null;
    // this._endDate = null;
    this._endDate = new Date(1544572800000);

    this._data = calculateData(data, this._startDate, this._endDate);
    this._lines = [];

    this._maxValue = 1;

    this._svgManipulator = new SVGManipulator();

    this.addSvg();
    this.addDefs();
  }

  setMaxValue(value) {
    this._maxValue = value;
  }

  getYScale() {
    return (chartHeight - 20) / this._maxValue;
  }

  addSvg() {
    this._svgElement = this._svgManipulator.getElement('svg');
    this._svgElement.setAttribute('height', height);
    this._svgElement.setAttribute('width', width);
    this._svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this._wrapperElement.append(this._svgElement);
  }

  addDefs() {
    this._defs = this._svgManipulator.getElement('defs');
    this._svgElement.append(this._defs);
  }

  renderLine(position, value) {
    const line = this._svgManipulator.getUseElement(lineDefId);

    const text = this._svgManipulator.getElement('text');
    setSvgAttributes(text, {
      x: 0,
      y: chartHeight - 5,
    }, yAxisTextStyles);
    text.textContent = value;

    const group = this._svgManipulator.getElement('g');
    setSvgStyles(group, {
      transform: `translateY(-${value * this.getYScale()}px)`,
    });

    group.appendChild(line);
    group.appendChild(text);

    this._svgElement.appendChild(group);
  }

  addLineDef() {
    const lineDef = this._svgManipulator.getElement('line');

    setSvgAttributes(lineDef, {
      x1: 0,
      x2: width,
      y1: chartHeight,
      y2: chartHeight,
      id: lineDefId,
    }, lineStyles);

    this._defs.appendChild(lineDef);
  }

  renderLines() {
    this.addLineDef();

    const columns = getChartColumns(this._data);
    let maxValue = 0;
    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      const values = column.splice(1);
      const max = Math.max(...values);
      maxValue = Math.max(maxValue, max);
    }

    const intPart = Math.min(10, Math.floor(maxValue.toString().length / 2));
    const tens = 10 ** intPart;

    let maxChartValue = maxValue - (maxValue % tens);
    if (maxValue - maxChartValue >= tens / 2) {
      maxChartValue += tens;
    }
    maxChartValue = Math.max(maxChartValue, minLineDelta * this._linesCount);

    console.log(maxValue, maxChartValue)
    this.setMaxValue(maxValue);

    const diff = maxChartValue / (this._linesCount - 1);
    for (let i = 0, j = 0; i < this._linesCount; i += 1, j += diff) {
      this.renderLine(i, j);
    }
  }

  getShowLabels() {
    const column = getAxisColumn(this._data);
    const labels = column.slice(1);

    const dist = maxLabelsAllowed / labels.length;
    const nums = labels.map((l, num) => {
      const calc = num === 0 || num === labels.length - 1
        ? dist * num
        : dist * num - Number.EPSILON;
      return {
        calc: Math.round(calc),
        num,
      };
    });

    const result = [];
    for (let i = 0; i < nums.length; i += 1) {
      const n = nums[i];
      if (!result[n.calc]) {
        result[n.calc] = labels[n.num];
      }
    }

    return result;
  }

  renderLegend() {
    const column = getAxisColumn(this._data);
    const showLabels = this.getShowLabels();

    const labelLen = (width - 50) / (column.length - 2);

    for (let i = 1; i < column.length; i += 1) {
      const dateTime = new Date(column[i]);
      const dateTimeString = dateToString(dateTime);

      const text = this._svgManipulator.getElement('text');
      const position = showLabels.indexOf(column[i]);

      setSvgAttributes(text, {
        x: (i - 1) * labelLen,
        y: height,
      }, {
        ...labelStyles,
        opacity: position !== -1 ? 1 : 0,
      });
      text.textContent = dateTimeString;

      this._svgElement.append(text);
    }
  }

  render() {
    this.renderLines();
    this.renderLegend();
  }
}

export default Chart;
