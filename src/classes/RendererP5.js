import P5 from 'p5';

class RendererP5 {
  constructor ({ containerId, theme, dimensions, pre, update, post }) {
    this.containerId = containerId;
    this.theme = theme;
    this.dimensions = dimensions;
    this.sketch = null;
    this.pre = pre;
    this.update = update;
    this.post = post;
    this.sketch = new P5(stage => {
      this.stage = stage;
      P5.disableFriendlyErrors = true;
      this.stage.frameRate(30);
      this.stage.setup = () => this.setup();
      this.stage.draw = () => this.draw();
    });
  }
  setup () {
    document.getElementById('defaultCanvas0').remove();
    let cnv = this.stage.createCanvas(
      this.dimensions.width,
      this.dimensions.height
    );
    cnv.parent(this.containerId);
  }
  draw () {
    this.pre();
    this.stage.background(this.theme.backgroundColor);
    let entities = this.update();
    entities.forEach(e => e.render(this));
    this.post();
  }
  start () {
    this.stage.loop();
  }
  stop () {
    this.stage.noLoop();
  }
}

export default RendererP5;
