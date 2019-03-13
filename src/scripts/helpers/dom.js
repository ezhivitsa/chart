const provertiesInPx = ['width', 'height'];

export const appendChild = (parent, element) => {
  if (parent.contains(element)) {
    return;
  }

  parent.appendChild(element);
};

export const setDomStyles = (element, styles) => {
  Object.keys(styles).forEach((style) => {
    let value = styles[style].toString();
    if (provertiesInPx.includes(style)) {
      if (value.substring(value.length - 2).toLowerCase() !== 'px') {
        value += 'px';
      }
    }

    element.style[style] = value; // eslint-disable-line
  });
};
