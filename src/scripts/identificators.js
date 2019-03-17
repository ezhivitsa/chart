import { generateId } from 'helpers/common';

class Identificators {
  constructor() {
    this._id = generateId();
  }

  _nameWithId = name => `${name}-${this._id}`;
}

export default Identificators;
