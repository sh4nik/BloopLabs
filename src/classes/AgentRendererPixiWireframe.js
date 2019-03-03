import * as PIXI from 'pixi.js';
import Agent from './Agent';

class AgentRendererPixiWireframe extends Agent {
  render (renderer, entities) {
    if (!this.graphics) {
      this.renderer = renderer;
      this.graphics = new PIXI.Graphics();

      this.graphics.lineStyle(this.size / 8, 0x666666, 1);
      this.graphics.drawCircle(this.position.x, this.position.y, this.size / 2);

      renderer.stage.addChild(this.graphics);
    }
    if (this.isActive) {
      this.graphics.rotation = this.velocity.heading() + 3.14 / 2;
      this.graphics.x = this.position.x;
      this.graphics.y = this.position.y;
    } else {
      this.destroy();
    }
  }
  destroy () {
    if (this.graphics) this.renderer.stage.removeChild(this.graphics);
  }
}

export default AgentRendererPixiWireframe;
