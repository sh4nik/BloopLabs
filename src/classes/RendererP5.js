import P5 from 'p5';

class Renderer {
  constructor(opts) {
    super(opts);
    this.tick = opts.tick;
    this.sketch = new P5(stage => {
      P5.disableFriendlyErrors = true;
      stage.frameRate(this.framerate);
      stage.setup = () => this.setup();
      stage.draw = () => this.draw();
      stage.mousePressed = () => this.mousePressed();
    });
  }
  setup() {
    document.getElementById('defaultCanvas0').remove();
    document.getElementById(this.renderer.containerId).appendChild(this.stats.dom);
    let cnv = this.renderer.stage.createCanvas(
      this.renderer.stage.windowWidth,
      this.renderer.stage.windowHeight
    );
    cnv.parent(this.renderer.containerId);
  }

}

export default Renderer;
