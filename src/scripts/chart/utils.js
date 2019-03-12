import { types } from 'constants';

export const getAxisColumn = (data) => {
  const axis = Object.keys(data.types).find((key) => {
    return data.types[key] === types.axis;
  });

  return data.columns.find(c => c[0] === axis);
};

export const getChartColumnNames = (data) => {
  return Object.keys(data.types).filter((key) => {
    return data.types[key] === types.line;
  });
};

export const getChartColumns = (data) => {
  const lines = getChartColumnNames(data);
  return data.columns.filter(c => lines.includes(c[0]));
};

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
      addIndex = startDate.getTime() <= axisColumn[i];
    }

    if (endDate) {
      addIndex = addIndex && endDate.getTime() >= axisColumn[i];
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
