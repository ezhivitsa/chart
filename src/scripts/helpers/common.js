export const getArgKey = (a) => {
  if (a instanceof Array && a.length) {
    return `${a[0]}-${a[a.length - 1]}-${a.length}`;
  }

  if (typeof a === 'object' && a !== null) {
    return a.id || a;
  }

  return a;
};

export const getArgKeys = (args) => {
  return args.map(a => getArgKey(a));
};

export const memo = (func) => {
  const cache = {};

  return (...args) => {
    const argKeys = getArgKeys(args);
    const key = JSON.stringify(argKeys);

    if (cache[key]) {
      return cache[key];
    }

    const val = func(...args);
    cache[key] = val;
    return val;
  };
};

export const limitedMemo = (func, storeValues) => {
  const cache = {};
  const calls = [];

  return (...args) => {
    const argKeys = getArgKeys(args);
    const key = JSON.stringify(argKeys);

    if (cache[key]) {
      const pos = calls.indexOf(key);
      if (pos !== -1) {
        calls.splice(pos, 1);
      }

      calls.push(key);
      return cache[key];
    }

    const val = func(...args);
    cache[key] = val;
    calls.push(key);

    if (calls.length > storeValues) {
      const deleteKeys = calls.splice(0, Math.floor(storeValues));
      deleteKeys.forEach((deleteKey) => {
        delete cache[deleteKey];
      });
    }

    return val;
  };
};

export const generateId = () => {
  return Date.now() * Math.random();
};

export const throttle = (fn, timeout) => {
  let queue = null;
  let lastCall = 0;

  let callArguments = [];

  return (...args) => {
    const now = Date.now();

    callArguments = args;
    if (queue) {
      return;
    }

    if (now - lastCall > timeout) {
      lastCall = now;
      fn(...args);
      return;
    }

    queue = setTimeout(() => {
      lastCall = Date.now();
      queue = null;
      fn(...callArguments);
    }, timeout - now + lastCall);
  };
};

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
