import Entity from './Entity';

class Edible extends Entity {
  constructor (opts) {
    super(opts);
    this.size = opts.size || 8;
    this.healthImpact = opts.healthImpact || 0;
    this.themeElement = opts.themeElement;
  }
  eat () {
    this.isActive = false;
    return this.healthImpact;
  }
}

export default Edible;
