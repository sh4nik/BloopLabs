import Theme from './Theme';
import Agent from './Agent';
import EntityProcessor from './EntityProcessor';
import Stats from 'stats.js';
import { RendererP5 } from './RendererP5';

class Simulation {
  constructor ({ containerId, entityConfig, framerate, theme, clickHandler }) {
    this.framerate = framerate || 30;
    this.containerId = containerId || 'bl-sim';
    this.theme = Theme.get(theme || 'mojojojo');
    this.clickHandler = clickHandler;
    this.render = true;
    this.stats = new Stats();
    this.statsPanelPopulation = this.stats.addPanel(new Stats.Panel('POP', '#d9f', '#203'));
    // Note: RAM panel missing in mobile
    this.stats.showPanel(this.stats.dom.childNodes.length - 1);
    document.getElementById(this.containerId).appendChild(this.stats.dom);
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.ep = new EntityProcessor({
      entityConfig,
      dimensions: this.dimensions
    });
    this.renderer = new RendererP5({
      containerId: this.containerId,
      theme: this.theme,
      dimensions: this.dimensions,
      pre: () => this.pre(),
      update: () => this.update(),
      post: () => this.post()
    });
  }
  toggleRenderer () {
    this.render = !this.render;
    if (!this.render) {
      this.renderer.stop();
      this.runInMem();
    } else {
      this.renderer.start();
    }
  }
  step () {
    this.pre();
    this.update();
    this.post();
  }
  runInMem (steps = 0) {
    for (let i = 0; i < steps; i++) {
      this.step();
    }
    setTimeout(() => this.render || this.runInMem(1));
  }
  pre () {
    this.stats.begin();
  }
  post () {
    this.stats.end();
    this.updateStats();
  }
  update () {
    this.ep.step({ dimensions: this.dimensions });
    return this.ep.entities;
  }
  updateStats () {
    this.statsPanelPopulation.update(this.ep.entities.filter(e => e instanceof Agent).length, 100);
  }
}

export default Simulation;
