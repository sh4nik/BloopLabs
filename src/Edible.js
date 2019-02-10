class Edible {
  constructor ({ isActive = true, position, groupId }) {
    this.isActive = isActive;
    this.groupId = groupId;
    this.position = position;
    this.size = 4;
    this.healthImpact = 0;
  }
  render (entities, renderer) {
    renderer.stage.fill(this.getColor(renderer.theme));
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
