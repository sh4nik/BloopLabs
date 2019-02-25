import * as PIXI from 'pixi.js';
import Theme from './Theme';
import Agent from './Agent';
import EntityProcessor from './EntityProcessor';
import Stats from 'stats.js';

class SimulationPIXI {
  constructor ({ containerId, entityConfig, framerate, theme, clickHandler }) {
    this.framerate = framerate || 30;
    this.containerId = containerId || 'bl-sim';
    this.theme = theme || 'mojojojo';
    this.clickHandler = clickHandler;
    this.render = true;
    this.stats = new Stats();
    this.statsPanelPopulation = this.stats.addPanel(new Stats.Panel('POP', '#d9f', '#203'));
    // Note: RAM panel missing in mobile
    this.stats.showPanel(0);
    this.container = document.getElementById(this.containerId);
    this.app = new PIXI.Application();
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.app.view);
    this.container.appendChild(this.stats.dom);
    this.app.ticker.add(delta => this.draw(delta));
    this.renderer = {
      stage: this.app.stage,
      theme: Theme.get(this.theme)
    };
    this.app.renderer.backgroundColor = this.renderer.theme.backgroundColor;
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.ep = new EntityProcessor({
      entityConfig,
      dimensions: this.dimensions
    });
  }
  draw () {
    this.step({ renderer: this.renderer, dimensions: this.dimensions });
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

export default SimulationPIXI;
