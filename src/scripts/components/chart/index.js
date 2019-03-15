import { setSvgAttributes } from 'helpers/svg';
import { dateToString } from 'helpers/dateTime';
import { appendChild, setDomStyles } from 'helpers/dom';
import { getValuesFromArray } from 'helpers/array';

import SVGManipulator from 'svgManipulator';

import MiniMapSelector from 'components/minimapSelector';
import Buttons from 'components/buttons';
import MiniMap from './components/minimap';

import {
  lineStyles,
  labelStyles,
  yAxisTextStyles,
} from './styles';

import {
  calculateData,
  getAxisColumn,
  getChartColumns,
} from './utils';

import SvgIdentificators from './identificators';

import styles from './styles.pcss';

const minLineDelta = 1;

const width = 500;
const height = 350;
const chartHeight = 300;
const miniMapHeight = 100;

const maxLabelsAllowed = 6;

class Chart {
  constructor(el, data, lines) {
    this._wrapperElement = el;
    this._linesCount = lines;

    this._startDate = null;
    // this._endDate = null;
    this._endDate = new Date(1544572800000);

    this._originalData = data;
    this._data = calculateData(data, this._startDate, this._endDate);
    this._lines = [];

    this._maxValue = 1;

    this._svgManipulator = new SVGManipulator();
    this._identificators = new SvgIdentificators();

    this._minimapSelector = new MiniMapSelector(this._wrapperElement);
    this._minimap = new MiniMap(
      this.miniMapGroup(),
      this._originalData,
      width,
      height,
      miniMapHeight,
    );
    this._buttons = new Buttons(
      this._wrapperElement,
      this._data.names,
      this._data.colors,
      this.onSelectedChanged,
    );

    this.addSvg();
    this.addDefs();
    this.addChartDefs();
  }

  setMaxValue(value) {
    this._maxValue = value;
  }

  getYScale() {
    return (chartHeight - 20) / this._maxValue;
  }

  onSelectedChanged = (visibleList, hiddenList) => {
    this._minimap.updateVisible(visibleList, hiddenList);
  }

  miniMapGroup() {
    return this._svgManipulator.getElement('g', this._identificators.miniMapGroupWrap);
  }

  addSvg() {
    this._svgElement = this._svgManipulator.createElement(
      'svg',
      this._identificators.container,
      {
        attributes: {
          height: height + miniMapHeight,
          width,
          viewBox: `0 0 ${width} ${height + miniMapHeight}`,
        },
        className: styles.wrap,
      }
    );
    this._wrapperElement.append(this._svgElement);
  }

  addDefs() {
    this._defs = this._svgManipulator.getElement('defs', this._identificators.defs());
    this._svgElement.append(this._defs);
  }

  addChartDefs() {
    let axisColumn = getAxisColumn(this._originalData).slice(1);
    const [firstValue] = axisColumn;
    const lastValue = axisColumn[axisColumn.length - 1] - firstValue;

    axisColumn = axisColumn.map(v => (v - firstValue) * width / lastValue);

    const columns = getChartColumns(this._originalData);

    for (let i = 0; i < columns.length; i += 1) {
      const [columnName] = columns[i];
      const color = this._originalData.colors[columnName];

      const column = columns[i].slice(1);
      const maxValue = Math.max(...column);

      let path = `M${axisColumn[0]} ${column[0] * miniMapHeight / maxValue}`;
      for (let j = 1; j < column.length; j += 1) {
        path += ` L${axisColumn[j]} ${column[j] * miniMapHeight / maxValue}`;
      }

      const pathEl = this._svgManipulator.getElement(
        'path',
        this._identificators.pathDef(columnName),
      );
      setSvgAttributes(pathEl, {
        d: path,
        id: this._identificators.pathDef(columnName),
      }, {
        stroke: color,
      });

      appendChild(this._defs, pathEl);
    }
  }

  renderLine(position, value) {
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
          y: chartHeight - 5,
        },
      },
      value,
    );

    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.lineGroup(value),
      {
        styles: {
          transform: `translateY(-${value * this.getYScale()}px)`,
        },
      },
      [
        line,
        text,
      ],
    );

    appendChild(this._svgElement, group);
  }

  addLineDef() {
    const lineDef = this._svgManipulator.createElement(
      'line',
      this._identificators.lineDef,
      {
        attributes: {
          x1: 0,
          x2: width,
          y1: chartHeight,
          y2: chartHeight,
          id: this._identificators.lineDef,
        },
        styles: lineStyles,
      },
    );

    appendChild(this._defs, lineDef);
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

    this.setMaxValue(maxValue);

    const diff = maxChartValue / (this._linesCount - 1);
    for (let i = 0, j = 0; i < this._linesCount; i += 1, j += diff) {
      this.renderLine(i, j);
    }
  }

  getShowLabels() {
    const column = getAxisColumn(this._data);
    const labels = column.slice(1);

    return getValuesFromArray(labels, maxLabelsAllowed);
  }

  renderLegend() {
    const column = getAxisColumn(this._data);
    const showLabels = this.getShowLabels();

    const labelLen = (width - 45) / (column.length - 1);
    const showLabelLen = (width - 45) / (showLabels.length - 2);

    for (let i = 1; i < column.length; i += 1) {
      const dateTime = new Date(column[i]);
      const dateTimeString = dateToString(dateTime);

      const text = this._svgManipulator.getElement(
        'text',
        this._identificators.legend(dateTimeString),
      );
      const position = showLabels.indexOf(column[i]);

      setSvgAttributes(text, {
        x: position !== -1 ? position * showLabelLen : (i - 1) * labelLen,
        y: height,
      }, {
        ...labelStyles,
        opacity: position !== -1 ? 1 : 0,
      });
      text.textContent = dateTimeString;

      this._svgElement.append(text);
    }
  }

  renderMiniMap() {
    appendChild(this._svgElement, this.miniMapGroup());
  }

  render() {
    this.renderLines();
    this.renderLegend();
    this.renderMiniMap();

    this._minimap.render();
    this._minimapSelector.render();
    this._buttons.render();
  }
}

export default Chart;
