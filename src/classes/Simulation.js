import P5 from 'p5';
import Theme from './Theme';
import Agent from './Agent';
import EntityProcessor from './EntityProcessor';
import Util from './Util';
import Stats from 'stats.js';

class Simulation {
  constructor ({ containerId, entityConfig, framerate, theme, clickHandler }) {
    this.framerate = framerate || 30;
    this.containerId = containerId || 'bl-sim';
    this.theme = theme || 'mojojojo';
    this.clickHandler = clickHandler;
    this.render = true;
    this.stats = new Stats();
    this.statsPanelPopulation = this.stats.addPanel(new Stats.Panel('POP', '#d9f', '#203'));
    // Note: RAM panel missing in mobile
    this.stats.showPanel(this.stats.dom.childNodes.length - 1);
    this.sketch = new P5(stage => {
      this.renderer = {
        stage,
        containerId: this.containerId,
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
    document.getElementById(this.renderer.containerId).appendChild(this.stats.dom);
    let cnv = this.renderer.stage.createCanvas(
      this.renderer.stage.windowWidth,
      this.renderer.stage.windowHeight
    );
    cnv.parent(this.renderer.containerId);
  }
  draw () {
    this.renderer.stage.background(this.renderer.theme.backgroundColor);
    this.step({ renderer: this.renderer, dimensions: this.dimensions });
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
      this.step({ dimensions: this.dimensions });
    }
    setTimeout(() => this.render || this.runInMem(100));
  }
  step ({ renderer, dimensions }) {
    this.stats.begin();
    this.ep.step({ renderer, dimensions });
    this.stats.end();
    this.updateStats();
  }
  updateStats () {
    this.statsPanelPopulation.update(this.ep.entities.filter(e => e instanceof Agent).length, 100);
  }
}

export default Simulation;
