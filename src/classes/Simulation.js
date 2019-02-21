import P5 from 'p5';
import Theme from './Theme';
import Agent from './Agent';
import EntityProcessor from './EntityProcessor';
import Util from './Util';

class Simulation {
  constructor ({ containerId, entityConfig, framerate, theme, clickHandler }) {
    this.framerate = framerate || 30;
    this.containerId = containerId || 'bl-sim';
    this.theme = theme || 'mojojojo';
    this.clickHandler = clickHandler;
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
      P5.disableFriendlyErrors = true;
      stage.frameRate(this.framerate);
      stage.setup = () => this.setup();
      stage.draw = () => this.draw();
      stage.mousePressed = () => this.mousePressed();
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
    this.stepDebug({ renderer: this.renderer, dimensions: this.dimensions });
    this.showInfo();
  }
  mousePressed () {
    const mousePosition = Util.createVector(
      this.renderer.stage.mouseX,
      this.renderer.stage.mouseY
    );
    const selectedEntity = this.ep.click(mousePosition);
    if (this.clickHandler) this.clickHandler(selectedEntity);
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
  runInMem (steps = 0) {
    for (let i = 0; i < steps; i++) {
      this.stepDebug({ dimensions: this.dimensions });
    }
    this.showInfo();
    setTimeout(() => this.render || this.runInMem(100));
  }
  stepDebug ({ renderer, dimensions }) {
    let start = this.renderer.stage.millis();
    this.ep.step({ renderer, dimensions });
    let end = this.renderer.stage.millis();
    this.lastStepDuration = end - start;
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
    this.renderer.stage.rect(5, 10, 250, 20);
    this.renderer.stage.fill(100);
    this.renderer.stage.stroke(0);
    this.renderer.stage.text(
      `Step: ${this.ep.stepCount} [${this.lastStepDuration.toFixed(2)} ms/s] Pop: ${agents.length}  Oldest: ${oldest.age}`,
      10,
      25
    );
  }
}

export default Simulation;
