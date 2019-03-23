import { getAxisColumn } from 'components/chart/utils';

export const getAdditionalLabels = (data, actualLabels) => {
  const axis = getAxisColumn(data).slice(1);

  const result = [];

  for (let i = 0; i < actualLabels.length - 1; i += 1) {
    const labelsInRange = axis.filter((v) => {
      return v > actualLabels[i] && v < actualLabels[i + 1];
    });

    result.push(labelsInRange[Math.floor(labelsInRange.length / 2)]);
  }

  return result;
};

export const getLabelsToRemove = (actualLabels) => {
  const result = [];

  for (let i = 1; i < actualLabels.length - 1; i += 2) {
    result.push(actualLabels[i]);
  }

  return result;
};
