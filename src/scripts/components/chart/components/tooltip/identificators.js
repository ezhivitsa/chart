import Identificators from 'identificators';

class SvgIdentificators extends Identificators {
  get group() {
    return this._nameWithId('group');
  }

  get line() {
    return this._nameWithId('line');
  }

  point(column) {
    return this._nameWithId(`point-${column}`);
  }

  get infoWrap() {
    return this._nameWithId('info-wrap');
  }

  get title() {
    return this._nameWithId('title');
  }

  get list() {
    return this._nameWithId('list');
  }

  listItem(column) {
    return this._nameWithId(`list-item-${column}`);
  }

  bigText(column) {
    return this._nameWithId(`big-text-${column}`);
  }

  smallText(column) {
    return this._nameWithId(`small-text-${column}`);
  }
}

export default SvgIdentificators;
