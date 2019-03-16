
export const memo = (func) => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache[key]) {
      return cache[key];
    }

    const val = func(...args);
    cache[key] = val;
    return val;
  };
};
