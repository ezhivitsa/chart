
export const memo = (func) => {
  const cache = {};

  return (...args) => {
    const argKeys = args.map((a) => {
      if (typeof a === 'object') {
        return a.id || a;
      }

      return a;
    });

    const key = JSON.stringify(argKeys);

    if (cache[key]) {
      return cache[key];
    }

    const val = func(...args);
    cache[key] = val;
    return val;
  };
};

export const generateId = () => {
  return Date.now() * Math.random();
};

export const throttle = (fn, timeout) => {
  let queue = null;
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();

    if (!queue && now - lastCall > timeout) {
      lastCall = now;
      fn(...args);
      return;
    }

    if (queue) {
      clearTimeout(queue);
    }

    queue = setTimeout(() => {
      lastCall = Date.now();
      queue = null;
      fn(...args);
    }, timeout - now + lastCall);
  };
};
