import { types } from 'constants';
import { memo, limitedMemo, getArgKey } from 'helpers/common';

const minLineDelta = 5;
const linesCount = 5;

const maxValueCache = {};

export const getAxisColumn = memo((data) => {
  const axis = Object.keys(data.types).find((key) => {
    return data.types[key] === types.axis;
  });

  return data.columns.find(c => c[0] === axis);
});

export const getChartColumnNames = memo((data) => {
  return Object.keys(data.types).filter((key) => {
    return data.types[key] === types.line;
  });
});

export const getChartColumns = memo((data, visibleList = []) => {
  const lines = getChartColumnNames(data);
  return data.columns.filter((c) => {
    return lines.includes(c[0]) && (!visibleList.length || visibleList.includes(c[0]));
  });
});

export const calculateData = limitedMemo((data, startDate, endDate) => {
  if (!startDate && !endDate) {
    return data;
  }

  const result = {
    types: data.types,
    names: data.names,
    colors: data.colors,
    columns: [],
  };

  const axisColumn = getAxisColumn(data);
  const indexes = [0];
  for (let i = 1; i < axisColumn.length; i += 1) {
    let addIndex = true;
    if (startDate) {
      addIndex = startDate <= axisColumn[i];
    }

    if (endDate) {
      addIndex = addIndex && endDate >= axisColumn[i];
    }

    if (addIndex) {
      indexes.push(i);
    }
  }

  for (let i = 0; i < data.columns.length; i += 1) {
    const column = data.columns[i].filter((el, index) => indexes.indexOf(index) !== -1);
    result.columns.push(column);
  }

  result.id = `${data.id}-${indexes[1]}-${indexes[indexes.length - 1]}`;

  return result;
}, 10);

export const createChartPath = limitedMemo((
  axis,
  column,
  maxValue,
  minValue,
  width,
  height,
) => {
  const [firstValue] = axis;
  const lastValue = axis[axis.length - 1] - firstValue;

  const axisColumn = axis.map(v => (v - firstValue) * width / lastValue);

  let path = `M${axisColumn[0]} ${height - (column[0] - minValue) * height / maxValue}`;
  for (let j = 1; j < column.length; j += 1) {
    path += ` L${axisColumn[j]} ${height - (column[j] - minValue) * height / maxValue}`;
  }

  return path;
}, 10);

export const findAxisValue = (axis, relativeValue) => {
  const [firstValue] = axis; // 0
  const lastValue = axis[axis.length - 1]; // 1

  const approximateValue = relativeValue * (lastValue - firstValue) + firstValue;

  for (let i = 0; i < axis.length; i += 1) {
    if (approximateValue === axis[i]) {
      return approximateValue;
    }

    if (i === axis.length - 1) {
      return axis[i];
    }

    if (approximateValue >= axis[i] && approximateValue < axis[i + 1]) {
      const halfDistance = (axis[i + 1] - axis[i]) / 2;

      if (approximateValue - halfDistance <= axis[i]) {
        return axis[i];
      }

      return axis[i + 1];
    }
  }

  return approximateValue;
};

const roundMaxValue = (maxValue) => {
  const intPart = Math.min(10, Math.floor(maxValue.toString().length / 2));
  const tens = 10 ** intPart;

  let maxChartValue = maxValue - (maxValue % tens);
  if (maxValue - maxChartValue >= tens / 2) {
    maxChartValue += tens;
  }
  return Math.max(maxChartValue, minLineDelta * (linesCount - 1));
}

const getDataMaxValues = (data, visibleList) => {
  const columns = getChartColumns(data, visibleList);
  const axisColumn = getAxisColumn(data).slice(1);

  const singleArray = [];

  for (let i = 1; i < columns[0].length; i += 1) {
    const values = columns.map(c => c[i]);
    singleArray.push(Math.max(...values));
  }

  let spikes = [];
  for (let i = 0; i < singleArray.length; i += 1) {
    const prevValue = i !== 0 ? singleArray[i - 1] : 0;
    const nextValue = i !== singleArray.length - 1 ? singleArray[i + 1] : 0;
    const value = singleArray[i];

    if (value >= prevValue && value >= nextValue) {
      spikes.push({
        x: axisColumn[i],
        value,
      });
    }
  }

  spikes = spikes.sort((s1, s2) => s2.value - s1.value);
  spikes = spikes.slice(0, 20);

  spikes.forEach((s) => {
    s.value = roundMaxValue(s.value); // eslint-disable-line
  });

  return spikes;
};

const maxValueFullCalculation = (fullData, startDate, endDate, visibleList) => {
  const data = calculateData(fullData, startDate, endDate);
  const columns = getChartColumns(data);

  let maxValue = 0;
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];

    if (!visibleList.length || visibleList.includes(column[0])) {
      const values = column.slice(1);
      const max = Math.max(...values);
      maxValue = Math.max(maxValue, max);
    }
  }

  return roundMaxValue(maxValue);
};

export const calculateMaxValue = (fullData, startDate, endDate, visibleList) => {
  const dataKey = JSON.stringify(getArgKey(fullData));
  const key = `${dataKey}-${JSON.stringify(visibleList.sort())}`;

  if (!maxValueCache[key]) {
    maxValueCache[key] = getDataMaxValues(fullData, visibleList);
  }

  const cachedValue = maxValueCache[key];
  const spikeInRange = cachedValue.find(c => c.x >= startDate && c.x <= endDate);

  if (spikeInRange) {
    const axis = getAxisColumn(fullData);
    const columns = getChartColumns(fullData, visibleList);

    const startPos = axis.indexOf(startDate);
    const startValue = roundMaxValue(Math.max(...columns.map(c => c[startPos])));

    const endPos = axis.indexOf(endDate);
    const endValue = roundMaxValue(Math.max(...columns.map(c => c[endPos])));

    return Math.max(startValue, endValue, spikeInRange.value);
  }

  return maxValueFullCalculation(fullData, startDate, endDate, visibleList);
};
