export const getValuesFromArray = (array, valuesNum) => {
  if (array.length <= valuesNum) {
    return array;
  }

  const dist = valuesNum / array.length;
  const nums = array.map((l, num) => {
    const calc = num === 0 || num === array.length - 1
      ? dist * num
      : dist * num - Number.EPSILON;
    return {
      calc: Math.round(calc),
      num,
    };
  });

  const result = [];
  for (let i = 0; i < nums.length / 2 + 1; i += 1) {
    const n = nums[i];
    if (!result[n.calc]) {
      result[n.calc] = array[n.num];
    }
  }

  for (let i = nums.length - 1; i > nums.length / 2 - 1; i -= 1) {
    const n = nums[i];
    if (!result[n.calc]) {
      result[n.calc] = array[n.num];
    }
  }

  return result;
};
