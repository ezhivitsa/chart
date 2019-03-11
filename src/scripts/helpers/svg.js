export const setSvgStyles = (element, styles) => {
  Object.keys(styles).forEach((style) => {
    element.style[style] = styles[style]; // eslint-disable-line
  });
};

export const setSvgAttributes = (element, attributes, styles) => {
  if (attributes) {
    Object.keys(attributes).forEach((attr) => {
      element.setAttribute(attr, attributes[attr]);
    });
  }

  if (styles) {
    setSvgStyles(element, styles);
  }
};
