class Identificators {
  constructor() {
    this._id = Date.now() * Math.random();
  }

  _nameWithId = name => `${name}-${this._id}`;
}

export default Identificators;
