import { appendChild } from 'helpers/dom';
import { generateId, throttle } from 'helpers/common';

import SVGManipulator from 'svg-manipulator';
import DOMManipulator from 'dom-manipulator';

import MiniMapSelector from 'components/minimap-selector';
import Buttons from 'components/buttons';
import MiniMap from './components/minimap';
import ChartsGroup from './components/charts-group';
import LabelsGroup from './components/labels-group';
import LinesGroup from './components/lines-group';
import Tooltip from './components/tooltip';

import {
  getAxisColumn,
  findAxisValue,
} from './utils';

import SvgIdentificators from './identificators';

import styles from './styles.pcss';

const width = 500;
const height = 350;
const chartHeight = 300;
const miniMapHeight = 50;
const legendHeight = 20;
const miniMapPadding = 10;
const chartTopPaddingHeight = 20;

const yAxisWidth = 50;

class Chart {
  constructor(el, data, lines, nightMode) {
    this._wrapperElement = el;
    this._linesCount = lines;

    this._startDate = null;
    this._endDate = null;

    this._data = data;
    this._data.id = generateId();

    this._nightMode = nightMode;

    this._svgManipulator = new SVGManipulator();
    this._domManipulator = new DOMManipulator();
    this._identificators = new SvgIdentificators();

    this.onSelectorUpdateThrottle = throttle(this.onSelectorUpdate, 30);
    this.onSelectedChangedThrottle = throttle(this.onSelectedChanged, 100);

    this.addSvg();
    this.addDefs();

    this._minimap = new MiniMap(
      this.miniMapGroup(),
      this._data,
      width,
      miniMapHeight,
    );
    this._chartsGroup = new ChartsGroup(
      this.chartsGroup(),
      this._data,
      width - yAxisWidth,
      chartHeight - chartTopPaddingHeight,
    );
    this._buttons = new Buttons(
      this._wrapperElement,
      this._data.names,
      this._data.colors,
      this.onSelectedChangedThrottle,
    );

    this._minimapSelector = new MiniMapSelector(
      this._wrap,
      this.onSelectorUpdateThrottle,
    );

    this._legend = new LabelsGroup(
      this.labelsGroup(),
      this._data,
      width - yAxisWidth,
    );

    this._lines = new LinesGroup(
      this.linesGroup(),
      this._defs,
      this._data,
      width,
      chartHeight,
      this._startDate,
      this._endDate,
    );

    this._tooltip = new Tooltip(
      this._wrap,
      this._data,
      width - yAxisWidth,
      chartHeight,
      this._startDate,
      this._endDate,
    );

    this.renderNewLinesThrottle = throttle(this._lines.renderNewLines, 500);
    this.renderLegendThrottle = throttle(this._legend.renderLegend, 300);
  }

  onSelectedChanged = (visibleList, hiddenList) => {
    this._minimap.updateVisible(visibleList, hiddenList);

    this._chartsGroup.updateVisible(visibleList, hiddenList);
    this._chartsGroup.render();

    this._lines.updateVisible(visibleList);
    this._lines.renderNewLines();

    this._tooltip.updateVisible(visibleList);
  }

  onSelectorUpdate = (start, end) => {
    const axisColumn = getAxisColumn(this._data).slice(1);

    this._startDate = findAxisValue(axisColumn, start);
    this._endDate = findAxisValue(axisColumn, end);

    this._chartsGroup.updateArea(this._startDate, this._endDate);

    this._lines.updateArea(this._startDate, this._endDate);
    this.renderNewLinesThrottle();

    this._legend.updateArea(this._startDate, this._endDate);
    this.renderLegendThrottle();

    this._tooltip.updateArea(this._startDate, this._endDate);
  }

  miniMapGroup() {
    return this._svgManipulator.createElement(
      'g',
      this._identificators.miniMapGroupWrap,
      {
        styles: {
          transform: `translateY(${height + miniMapPadding / 2}px)`,
        },
      },
    );
  }

  chartsGroup() {
    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.chartsGroupWrap,
      {
        styles: { transform: `translateY(${chartTopPaddingHeight}px)` },
      },
    );

    const svg = this._svgManipulator.createElement(
      'svg',
      this._identificators.chartsGroup,
      {
        attributes: {
          x: yAxisWidth,
          width: width - yAxisWidth,
          height: chartHeight,
        },
      },
      group,
    );

    appendChild(this._svgElement, svg);

    return group;
  }

  labelsGroup() {
    return this._svgManipulator.createElement(
      'g',
      this._identificators.labelsGroup,
      {
        styles: {
          transform: `translate(${yAxisWidth}px, ${chartHeight + legendHeight}px)`,
        },
      },
    );
  }

  linesGroup() {
    return this._svgManipulator.createElement(
      'g',
      this._identificators.linesGroup,
      { className: styles.lines },
    );
  }

  addSvg() {
    this._svgElement = this._svgManipulator.createElement(
      'svg',
      this._identificators.container,
      {
        attributes: {
          height: height + miniMapHeight + miniMapPadding,
          width,
          viewBox: `0 0 ${width} ${height + miniMapHeight + miniMapPadding}`,
        },
        className: styles.wrapSvg,
      },
    );
    this._wrap = this._domManipulator.createElement(
      'div',
      this._identificators.wrap,
      {
        styles: { width },
        className: styles.wrap,
      },
      this._svgElement,
    );

    this._wrapperElement.append(this._wrap);
  }

  addDefs() {
    this._defs = this._svgManipulator.getElement('defs', this._identificators.defs);
    this._svgElement.append(this._defs);
  }

  renderGroups() {
    appendChild(this._svgElement, [
      this.linesGroup(),
      this.labelsGroup(),
      this.miniMapGroup(),
    ]);
  }

  setNightMode(on) {
    this._nightMode = on;
  }

  render() {
    this.renderGroups();

    this._chartsGroup.render();
    this._legend.render();
    this._minimap.render();
    this._minimapSelector.render();
    this._buttons.render();
    this._lines.render();
    this._tooltip.render();
  }
}

export default Chart;
