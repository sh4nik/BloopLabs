import * as PIXI from 'pixi.js';

class RendererPixi {
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

export default RendererPixi;
