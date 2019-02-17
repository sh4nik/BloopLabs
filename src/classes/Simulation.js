import P5 from 'p5';
import Theme from './Theme';
import Agent from './Agent';
import EntityProcessor from './EntityProcessor';

class Simulation {
  constructor ({ containerId, entityConfig, framerate, theme }) {
    this.framerate = framerate || 30;
    this.containerId = containerId || 'bl-sim';
    this.theme = theme || 'mojojojo';
    this.render = true;
    this.sketch = new P5(stage => {
      this.renderer = {
        stage,
        containerId,
        theme: Theme.get(this.theme)
      };
      this.dimensions = {
        width: stage.windowWidth,
        height: stage.windowHeight
      };
      this.ep = new EntityProcessor({
        entityConfig,
        dimensions: this.dimensions
      });
      stage.frameRate(this.framerate);
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
    this.showInfo();
  }
  toggleRenderer () {
    this.render = !this.render;
    if (!this.render) {
      this.renderer.stage.noLoop();
      this.runInMem();
    } else {
      this.renderer.stage.loop();
    }
  }
  runInMem () {
    this.ep.step({ dimensions: this.dimensions });
    this.showInfo();
    setTimeout(() => this.render || this.runInMem());
  }
  showInfo () {
    let agents = this.ep.entities.filter(e => e instanceof Agent);
    let oldest = 0;
    if (agents.length) {
      oldest = agents.reduce((prev, curr) => {
        const currentIsOlder = curr.age > prev.age;
        return currentIsOlder ? curr : prev;
      });
    }
    this.renderer.stage.fill(30);
    this.renderer.stage.rect(5, 10, 200, 20);
    this.renderer.stage.fill(100);
    this.renderer.stage.stroke(0);
    this.renderer.stage.text(
      `Step: ${this.ep.stepCount} Pop: ${agents.length}  Oldest: ${oldest.age}`,
      10,
      25
    );
  }
}

export default Simulation;
