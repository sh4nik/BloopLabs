import { Shape } from '@createjs/easeljs';

class Edible {
  constructor ({ isActive = true, position, groupId }) {
    this.isActive = isActive;
    this.groupId = groupId;
    this.position = position;
    this.size = 4;
    this.healthImpact = 0;
  }
  render (entities, renderer) {
    if (renderer && !this.shape) {
      this.shape = new Shape();
      renderer.stage.addChild(this.shape);
      this.shape.graphics
        .setStrokeStyle(2)
        .beginStroke(renderer.theme.edibleOutlineColor)
        .beginFill(this.getColor(renderer.theme))
        .drawCircle(0, 0, this.size);
      renderer.stage.setChildIndex(this.shape, 0);
    }
    if (this.isActive) {
      this.shape.x = this.position.x;
      this.shape.y = this.position.y;
    } else {
      renderer.stage.removeChild(this.shape);
    }
  }
  eat () {
    this.isActive = false;
    return this.healthImpact;
  }
}

export default Edible;
