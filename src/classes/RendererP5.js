import P5 from 'p5';
import Util from './Util';
import Agent from './Agent';
import Edible from './Edible';

export class RendererP5 {
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

export class AgentRendererP5 extends Agent {
  render (renderer, entities) {
    if (this.age < 5) {
      this.parents.forEach(p => {
        if (p.isActive) {
          renderer.stage.strokeWeight(this.minSize / 4);
          renderer.stage.stroke(40, 100);
          renderer.stage.line(this.position.x, this.position.y, p.position.x, p.position.y);
        }
      });
    }

    renderer.stage.push();
    renderer.stage.translate(this.position.x, this.position.y);
    renderer.stage.rotate(this.velocity.heading() + renderer.stage.PI / 2);
    renderer.stage.noFill();

    let bodyColor = renderer.theme.agentBodyColor;

    if (this.selected) {
      renderer.stage.strokeWeight(this.minSize / 4);
      renderer.stage.stroke(50);
      renderer.stage.noFill();
      renderer.stage.ellipse(0, 0, this.maxSize * 3, this.maxSize * 3);
      renderer.stage.strokeWeight(this.minSize / 8);
      renderer.stage.ellipse(0, 0, this.maxSize * 4, this.maxSize * 4);
    }

    if (this.isAgro) {
      bodyColor = renderer.theme.agroAgentBodyColor;
      renderer.stage.fill(renderer.theme.agroAgentFangColor);
      renderer.stage.noStroke();
      renderer.stage.triangle(
        -this.size / 2,
        -this.size / 5,
        0,
        -this.size / 2,
        -this.size / 9,
        -this.size
      );
      renderer.stage.triangle(
        this.size / 2,
        -this.size / 5,
        0,
        -this.size / 2,
        this.size / 9,
        -this.size
      );
    }

    renderer.stage.noStroke();
    renderer.stage.fill(255, 50);
    let tailScale = this.velocity.mag();
    renderer.stage.triangle(
      0,
      0,
      (-this.size / 2) * tailScale,
      tailScale * this.size,
      (this.size / 2) * tailScale,
      tailScale * this.size
    );

    renderer.stage.strokeWeight(this.size / 8);
    renderer.stage.stroke(renderer.theme.agentOutlineColor);
    renderer.stage.fill(bodyColor);
    renderer.stage.ellipse(0, 0, this.size, this.size);

    if (this.age > this.matingAge) {
      renderer.stage.stroke(renderer.theme.agentOutlineColor);
      renderer.stage.line(0, 0, 0, -this.size / 2);
    }

    renderer.stage.strokeWeight(this.size / 8);
    renderer.stage.fill(
      Util.mapVal(this.health < 0 ? 0 : this.health, 0, this.maxHealth, 70, 255)
    );
    renderer.stage.ellipse(0, -this.size / 2, this.size / 3, this.size / 3);

    renderer.stage.pop();
  }
}

export class EdibleRendererP5 extends Edible {
  render (renderer, entities) {
    renderer.stage.stroke(renderer.theme.edibleOutlineColor);
    renderer.stage.fill(renderer.theme[this.themeElement]);
    renderer.stage.ellipse(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
}
