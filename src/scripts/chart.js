import { setSvgAttributes } from './helpers/svg';
import { dateToString } from './helpers/dateTime';

import { types } from './constants';

import SVGManipulator from './svgManipulator';

const minLineDelta = 1;

const width = 500;
const height = 350;
const chartHeight = 300;

const showMaxLegend = 6;

class Chart {
  constructor(el, lines) {
    this._wrapperElement = el;
    this._linesCount = lines;

    this._svgManipulator = new SVGManipulator();

    this._addSvg();
  }

  _addSvg() {
    this._svgElement = this._svgManipulator.getElement('svg');
    this._svgElement.setAttribute('height', height);
    this._svgElement.setAttribute('width', width);
    this._svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this._wrapperElement.append(this._svgElement);
  }

  renderLine(position, value) {
    const line = this._svgManipulator.getElement('line');

    const lineHeight = (chartHeight - 30) / (this._linesCount - 1);

    setSvgAttributes(line, {
      x1: 0,
      x2: width,
      y1: chartHeight - position * lineHeight,
      y2: chartHeight - position * lineHeight,
    }, {
      stroke: '#ccc',
      strokeWidth: 2,
      opacity: '0.5',
    });

    const text = this._svgManipulator.getElement('text');
    setSvgAttributes(text, {
      x: 0,
      y: chartHeight - position * lineHeight - 5,
    }, {
      fontFamily: 'Open Sans',
      fontSize: '14px',
      fill: '#aaa',
    });
    text.textContent = value;

    this._svgElement.append(line);
    this._svgElement.append(text);
  }

  renderLines(maxValue) {
    let maxChartValue = maxValue - (maxValue % 10);
    if (maxValue % 10 >= 5) {
      maxChartValue += 10;
    }
    maxChartValue = Math.max(maxChartValue, minLineDelta * this._linesCount);

    const diff = maxChartValue / this._linesCount;
    for (let i = 0, j = 0; i < this._linesCount; i += 1, j += diff) {
      this.renderLine(i, j);
    }
  }

  renderLegend(data) {
    // const legendData = data.map((d) => {
    //   return {
    //     dateStr: dateToString(d.date),
    //     date: d.date,
    //   };
    // });

    // const resultLegend = [];
    // resultLegend.push(legendData[0].dateStr);

    // if (legendData.length > showMaxLegend) {
    //   let toDelete = legendData.length - showMaxLegend;
    // }

    const axis = Object.keys(data.types).find((key) => {
      return data.types[key] === types.axis;
    });

    const column = data.columns.find(c => c[0] === axis);
    if (column) {
      for (let i = 1; i < column.length; i += 1) {
        const dateTime = new Date(column[i]);
        const dateTimeString = dateToString(dateTime);

        const text = this._svgManipulator.getElement('text');
        setSvgAttributes(text, {
          x: i * 10,
          y: chartHeight,
        }, {
          fontFamily: 'Open Sans',
          fontSize: '14px',
          fill: '#aaa',
        });
        text.textContent = dateTimeString;
      }
    }
  }

  render(data) {
    // const values = data.map(d => d.value);
    // const maxValue = Math.max(...values);

    // this.renderLines(maxValue);
    this.renderLegend(data);
  }
}

export default Chart;
