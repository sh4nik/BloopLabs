import * as PIXI from 'pixi.js';
import Edible from './Edible';

class PixiGraphicEdible extends Edible {
  render (renderer, entities) {
    if (!this.graphics) {
      this.renderer = renderer;
      this.graphics = new PIXI.Graphics();

      this.graphics.lineStyle(this.size / 8, renderer.theme.edibleOutlineColor, 1);
      this.graphics.beginFill(renderer.theme[this.themeElement], 1);
      this.graphics.drawCircle(this.position.x, this.position.y, this.size / 2);
      this.graphics.endFill();

      renderer.stage.addChild(this.graphics);
    }
    if (!this.isActive) {
      this.destroy();
    }
  }
  destroy () {
    if (this.graphics) this.renderer.stage.removeChild(this.graphics);
  }
}

export default PixiGraphicEdible;
