export const getValuesFromArray = (array, valuesNum) => {
  if (array.length <= valuesNum) {
    return array;
  }

  const dist = (valuesNum - 1) / (array.length - 1);
  const nums = array.map((l, num) => {
    const calc = dist * num;
    return {
      calc: Math.round(calc),
      num,
    };
  });

  const groups = {};
  for (let i = 0; i < nums.length; i += 1) {
    const { calc, num } = nums[i];
    groups[calc] = groups[calc] || [];
    groups[calc].push(num);
  }

  const result = [];
  Object.keys(groups).map((key) => {
    const pos = Math.floor((groups[key].length - 1) / 2);
    result[key] = array[groups[key][pos]];
  });
  return result;
};

export const uniq = (array = []) => {
  const result = [];

  for (let i = 0; i < array.length; i += 1) {
    if (!result.includes(array[i])) {
      result.push(array[i]);
    }
  }

  return result;
}