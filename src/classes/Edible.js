import Entity from './Entity';

class Edible extends Entity {
  constructor (opts) {
    super(opts);
    this.size = opts.size || 6;
    this.healthImpact = opts.healthImpact || 0;
    this.themeElement = opts.themeElement;
  }
  render (renderer, entities) {
    renderer.stage.fill(renderer.theme[this.themeElement]);
    renderer.stage.ellipse(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
  eat () {
    this.isActive = false;
    return this.healthImpact;
  }
}

export default Edible;
