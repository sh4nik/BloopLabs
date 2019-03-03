import Edible from './Edible';

class EdibleRendererP5 extends Edible {
  render (renderer, entities) {
    renderer.stage.stroke(renderer.theme.edibleOutlineColor);
    renderer.stage.fill(renderer.theme[this.themeElement]);
    renderer.stage.ellipse(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
}

export default EdibleRendererP5;
