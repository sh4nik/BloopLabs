import * as PIXI from 'pixi.js';
import Agent from './Agent';
import Edible from './Edible';

export class RendererPixi {
  constructor ({ containerId, theme, dimensions, pre, update, post }) {
    this.containerId = containerId;
    this.theme = theme;
    this.dimensions = dimensions;
    this.sketch = null;
    this.pre = pre;
    this.update = update;
    this.post = post;
    this.app = new PIXI.Application({
      antialias: true
    });
    this.stage = this.app.stage;
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.resize(this.dimensions.width, this.dimensions.height);
    document.getElementById(this.containerId).appendChild(this.app.view);
    this.ticker = this.app.ticker.add(delta => this.draw(delta));
  }
  draw () {
    this.pre();
    let entities = this.update();
    entities.forEach(e => e.render(this));
    this.post();
  }
  start () {
    this.ticker.start();
  }
  stop () {
    this.ticker.stop();
  }
}

export class AgentRendererPixiGraphics extends Agent {
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
      let tailScale = this.velocity.mag();
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

export class AgentRendererPixiSprite extends Agent {
  render (renderer, entities) {
    if (!this.sprite) {
      this.renderer = renderer;
      this.sprite = new PIXI.Sprite(AgentRendererPixiSprite.texture);
      this.sprite.height = this.size;
      this.sprite.width = this.size;
      this.sprite.anchor.x = 0.5;
      this.sprite.anchor.y = 0.5;
      renderer.stage.addChild(this.sprite);
    }
    if (this.isActive) {
      this.sprite.rotation = this.velocity.heading() + 3.14 / 2;
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;
    } else {
      this.destroy();
    }
  }
  destroy () {
    if (this.sprite) this.renderer.stage.removeChild(this.sprite);
  }
}
AgentRendererPixiSprite.texture = PIXI.Texture.from('https://66.media.tumblr.com/8d896a79dd5b48ac92dd5dd56cbf596a/tumblr_inline_p7qgcz13Tx1rhwzwl_75sq.gif');

export class AgentRendererPixiWireframe extends Agent {
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

export class EdibleRendererPixiGraphics extends Edible {
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
