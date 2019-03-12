export const appendChild = (parent, element) => {
  if (parent.contains(element)) {
    return;
  }

  parent.appendChild(element);
};

export const setDomStyles = (element, styles) => {
  Object.keys(styles).forEach((style) => {
    element.style[style] = styles[style]; // eslint-disable-line
  });
};
