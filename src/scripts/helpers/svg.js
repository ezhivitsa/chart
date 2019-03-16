import { setDomStyles } from './dom';

export const setSvgAttributes = (element, attributes, styles) => {
  if (attributes) {
    Object.keys(attributes).forEach((attr) => {
      const attribute = element.getAttribute(attr);

      if (attribute !== attributes[attr]) {
        element.setAttribute(attr, attributes[attr]);
      }
    });
  }

  if (styles) {
    setDomStyles(element, styles);
  }
};
