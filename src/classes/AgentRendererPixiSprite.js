import * as PIXI from 'pixi.js';
import Agent from './Agent';

class AgentRendererPixiSprite extends Agent {
  render (renderer, entities) {
    if (!this.sprite) {
      this.renderer = renderer;
      this.sprite = new PIXI.Sprite(AgentRendererPixiSprite.texture);
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

export default AgentRendererPixiSprite;
