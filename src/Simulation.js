import { Stage, Ticker } from "@createjs/easeljs";
import Theme from './Theme';
import EntityProcessor from './EntityProcessor';

class Simulation {
    constructor({ canvasId, entityConfig, framerate, theme }) {
        this.renderer = {
            stage: new Stage(canvasId),
            theme: Theme.get(theme)
        };
        this.resize();
        this.applyBackgroundColor(canvasId);
        this.dimensions = {
            width: this.renderer.stage.canvas.width,
            height: this.renderer.stage.canvas.height
        };
        this.ep = new EntityProcessor({ entityConfig, dimensions: this.dimensions });
        Ticker.framerate = framerate;
    }
    render() { }
    run() {
        this.render();
        Ticker.addEventListener('tick', () => {
            this.ep.step({ renderer: this.renderer, dimensions: this.dimensions });
            this.renderer.stage.update();
        });
    }
    resize() {
        this.renderer.stage.canvas.width = window.innerWidth;
        this.renderer.stage.canvas.height = window.innerHeight;
    }
    applyBackgroundColor(canvasId) {
        document.getElementById(canvasId).style.backgroundColor = this.renderer.theme.backgroundColor;
    }
}

export default Simulation;
