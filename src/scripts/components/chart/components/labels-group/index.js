import { dateToString } from 'helpers/dateTime';
import { getValuesFromArray, uniq } from 'helpers/array';
import { appendChild } from 'helpers/dom';

import { getAxisColumn } from 'components/chart/utils';

import SVGManipulator from 'svg-manipulator';
import SvgIdentificators from './identificators';

import { getAdditionalLabels, getLabelsToRemove } from './utils';

import styles from './styles.pcss';

const animationTime = 500;

class LabelsGroup {
  constructor(parent, data, startDate, endDate, width) {
    this._parent = parent;
    this._data = data;

    this._width = width;
    this._chartWidth = width;
    this._chartStart = 0;

    this._maxLabels = this.getMaxLabels();

    this._startDate = startDate;
    this._endDate = endDate;

    this._actualLabels = [];
    this._labelsToDelete = [];

    this._timeout = null;

    this._identificators = new SvgIdentificators();
    this._svgManipulator = new SVGManipulator();
  }

  getMaxLabels(chartWidth = this._chartWidth) {
    return Math.max(Math.floor(chartWidth / 60), 3);
  }

  getShowLabels() {
    const column = getAxisColumn(this._data);
    const labels = column.slice(1);

    return getValuesFromArray(labels, this._maxLabels);
  }

  updateArea(start, end) {
    this._startDate = start;
    this._endDate = end;

    const axisColumn = getAxisColumn(this._data).slice(1);

    const [first] = axisColumn;
    const last = axisColumn[axisColumn.length - 1];

    const newChartWidth = this._width * (last - first) / (end - start);
    this._chartStart = newChartWidth * (start - first) / (last - first);

    if (this._chartWidth !== newChartWidth) {
      // add new labels and hide old
      this._chartWidth = newChartWidth;

      this._maxLabels = this.getMaxLabels();
      this.renderNewLegend();
    }

    this.updateStartPosition();
  }

  updateStartPosition() {
    this._svgManipulator.updateElement(
      this._identificators.group,
      {
        styles: { transform: `translateX(-${this._chartStart}px)` },
      },
    );
  }

  updateWidth(width) {
    this._width = width;
    this._maxLabels = this.getMaxLabels();

    this.updateArea(this._startDate, this._endDate);
  }

  renderNewLegend = () => {
    let additionalLabels = [];
    let removeLabels = [];

    if (this._maxLabels - this._actualLabels.length >= this._actualLabels.length - 1) {
      additionalLabels = getAdditionalLabels(this._data, this._actualLabels);

      for (let i = 0; i < additionalLabels.length; i += 1) {
        const pos = this._labelsToDelete.indexOf(additionalLabels[i]);
        if (pos !== -1) {
          this._labelsToDelete.splice(pos, 1);
        }
      }
    }

    if (this._maxLabels < this._actualLabels.length) {
      removeLabels = getLabelsToRemove(this._actualLabels);
    }

    this._actualLabels.push(...additionalLabels);
    this._actualLabels = uniq(this._actualLabels);
    this._actualLabels.sort();

    const showLabelLen = (this._chartWidth - 45) / (this._actualLabels.length - 1);
    const labelEls = this._actualLabels.map((label, index) => {
      return this.renderLabel(
        label,
        index,
        showLabelLen,
        additionalLabels.includes(label) || removeLabels.includes(label),
      );
    });

    this._labelsToDelete.push(...removeLabels);
    this._labelsToDelete = uniq(this._labelsToDelete);

    appendChild(
      this._svgManipulator.getElementById(this._identificators.group),
      labelEls,
    );

    if (additionalLabels.length || removeLabels.length) {
      this.animateLabels();
    }
  }

  animateLabels = () => {
    setTimeout(() => {
      this.renderLabels(this._actualLabels, this._chartWidth);
      this.removeOldLabelsTimeout();
    }, 20);

    setTimeout(() => {
      for (let i = 0; i < this._labelsToDelete.length; i += 1) {
        const pos = this._actualLabels.indexOf(this._labelsToDelete[i]);
        if (pos !== -1) {
          this._actualLabels.splice(pos, 1);
        }
      }
    }, 50);
  }

  renderLabel(label, index, showLabelLen, hidden) {
    const dateTime = new Date(label);
    const dateTimeString = dateToString(dateTime);

    const translate = index * showLabelLen;

    return this._svgManipulator.createElement(
      'text',
      this._identificators.legend(label),
      {
        attributes: {
          x: 0,
          y: 0,
        },
        styles: {
          opacity: hidden ? 0 : 1,
          transform: `translateX(${translate}px)`,
        },
        className: styles.text,
      },
      dateTimeString,
    );
  }

  renderLabels(labels, chartWidth, isHidden) {
    const showLabelLen = (chartWidth - 45) / (labels.length - 1);

    const labelEls = labels.map((label, index) => {
      return this.renderLabel(
        label,
        index,
        showLabelLen,
        isHidden || this._labelsToDelete.includes(label),
      );
    });

    appendChild(
      this._svgManipulator.getElementById(this._identificators.group),
      labelEls,
    );
  }

  renderLegend = (chartWidth = this._chartWidth) => {
    const showLabels = this.getShowLabels();
    this._actualLabels = showLabels;
    const showLabelLen = (chartWidth - 45) / (showLabels.length - 1);

    return showLabels.map((c, index) => {
      return this.renderLabel(c, index, showLabelLen);
    });
  }

  removeOldLabelsTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(this.removeOldLabels, animationTime);
  }

  removeOldLabels = () => {
    if (this._labelsToDelete.length) {
      this._labelsToDelete.forEach((value) => {
        this._svgManipulator.deleteElement(this._identificators.legend(value));

        const pos = this._actualLabels.indexOf(value);
        if (pos !== -1) {
          this._actualLabels.splice(pos, 1);
        }
      });
      this._labelsToDelete = [];
    }
  }

  render() {
    const group = this._svgManipulator.createElement(
      'g',
      this._identificators.group,
      {
        styles: {
          transform: `translateX(-${this._chartStart}px)`,
        },
      },
      this.renderLegend(),
    );

    appendChild(this._parent, group);
  }
}

export default LabelsGroup;
