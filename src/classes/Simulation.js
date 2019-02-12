import P5 from 'p5';
import Theme from './Theme';
import EntityProcessor from './EntityProcessor';

class Simulation {
  constructor ({ containerId, entityConfig, framerate, theme }) {
    this.sketch = new P5(stage => {
      this.renderer = {
        stage,
        containerId,
        theme: Theme.get(theme)
      };
      this.dimensions = {
        width: stage.windowWidth,
        height: stage.windowHeight
      };
      this.ep = new EntityProcessor({
        entityConfig,
        dimensions: this.dimensions
      });
      stage.frameRate(framerate);
      stage.setup = () => this.setup();
      stage.draw = () => this.draw();
    });
  }
  setup () {
    document.getElementById('defaultCanvas0').remove();
    let cnv = this.renderer.stage.createCanvas(
      this.renderer.stage.windowWidth,
      this.renderer.stage.windowHeight
    );
    cnv.parent(this.renderer.containerId);
  }
  draw () {
    this.renderer.stage.background(this.renderer.theme.backgroundColor);
    this.ep.step({ renderer: this.renderer, dimensions: this.dimensions });
  }
}

export default Simulation;
