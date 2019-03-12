import { setDomStyles } from './dom';

export const setSvgAttributes = (element, attributes, styles) => {
  if (attributes) {
    Object.keys(attributes).forEach((attr) => {
      element.setAttribute(attr, attributes[attr]);
    });
  }

  if (styles) {
    setDomStyles(element, styles);
  }
};
