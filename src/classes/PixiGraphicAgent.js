import * as PIXI from 'pixi.js';
import Agent from './Agent';

class PixiGraphicAgent extends Agent {
  render (renderer, entities) {
    if (!this.graphicsContainer) {
      this.renderer = renderer;
      this.graphicsContainer = new PIXI.Container();

      this.selection = new PIXI.Graphics();
      this.tail = new PIXI.Graphics();
      this.body = new PIXI.Graphics();
      this.ridge = new PIXI.Graphics();
      this.head = new PIXI.Graphics();

      this.graphicsContainer.addChild(this.selection);
      this.graphicsContainer.addChild(this.tail);
      this.graphicsContainer.addChild(this.body);
      this.graphicsContainer.addChild(this.ridge);
      this.graphicsContainer.addChild(this.head);
      renderer.stage.addChild(this.graphicsContainer);
    }
    if (this.isActive) {
      let bodyColor = this.isAgro ? renderer.theme.agroAgentBodyColor : renderer.theme.agentBodyColor;

      // Selection
      if (this.selected) {
        this.graphics.lineStyle(this.minSize / 4, 0x555555, 1);
        this.graphics.drawCircle(0, 0, this.maxSize * 3);
        this.graphics.lineStyle(this.minSize / 8, 0x555555, 1);
        this.graphics.drawCircle(0, 0, this.maxSize * 4);
      }

      // Tail
      this.tail.clear();
      this.tail.lineStyle(0);
      this.tail.beginFill(0x777777, 0.3);
      let tailScale = this.velocity.mag() * 0.5;
      this.tail.moveTo(0, 0);
      this.tail.lineTo((-this.size) * tailScale, tailScale * this.size * 2);
      this.tail.lineTo((this.size) * tailScale, tailScale * this.size * 2);
      this.tail.lineTo(0, 0);
      this.tail.endFill();

      // Body
      this.body.clear();
      this.body.lineStyle(this.minSize / 8, renderer.theme.agentOutlineColor, 1);
      this.body.beginFill(bodyColor, 1);
      this.body.drawCircle(0, 0, this.size / 2);
      this.body.endFill();

      // Ridge
      this.ridge.clear();
      this.ridge.lineStyle(2, renderer.theme.agentOutlineColor, 1);
      this.ridge.moveTo(0, 0);
      this.ridge.lineTo(0, -this.size / 2);

      // Head
      this.head.clear();
      this.head.lineStyle(this.size / 8, renderer.theme.agentOutlineColor, 1);
      this.head.beginFill(0xffffff, 1);
      this.head.drawCircle(0, -this.size / 2, this.size / 6);
      this.head.endFill();

      // Container
      this.graphicsContainer.rotation = this.velocity.heading() + 3.14 / 2;
      this.graphicsContainer.x = this.position.x;
      this.graphicsContainer.y = this.position.y;
    } else {
      this.destroy();
    }
  }
  destroy () {
    if (this.graphicsContainer) this.renderer.stage.removeChild(this.graphicsContainer);
  }
}

export default PixiGraphicAgent;
