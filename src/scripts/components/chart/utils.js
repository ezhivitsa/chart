import { types } from 'constants';
import { memo } from 'helpers/common';

const minLineDelta = 1;
const linesCount = 5;

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

export const getChartColumns = memo((data) => {
  const lines = getChartColumnNames(data);
  return data.columns.filter(c => lines.includes(c[0]));
});

export const calculateData = (data, startDate, endDate) => {
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

  return result;
};

export const createChartPath = (axis, column, maxValue, minValue, width, height) => {
  const [firstValue] = axis;
  const lastValue = axis[axis.length - 1] - firstValue;

  const axisColumn = axis.map(v => (v - firstValue) * width / lastValue);

  let path = `M${axisColumn[0]} ${height - (column[0] - minValue) * height / maxValue}`;
  for (let j = 1; j < column.length; j += 1) {
    path += ` L${axisColumn[j]} ${height - (column[j] - minValue) * height / maxValue}`;
  }

  return path;
};

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
      return axis[i];
    }
  }

  return approximateValue;
};

export const calculateMaxValue = (columns, visibleList) => {
  let maxValue = 0;
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];

    if (visibleList.includes(column[0])) {
      const values = column.slice(1);
      const max = Math.max(...values);
      maxValue = Math.max(maxValue, max);
    }
  }

  const intPart = Math.min(10, Math.floor(maxValue.toString().length / 2));
  const tens = 10 ** intPart;

  let maxChartValue = maxValue - (maxValue % tens);
  if (maxValue - maxChartValue >= tens / 2) {
    maxChartValue += tens;
  }
  maxChartValue = Math.max(maxChartValue, minLineDelta * linesCount);

  return maxChartValue;
};
