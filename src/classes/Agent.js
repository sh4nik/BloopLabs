import Util from './Util';
import Brain from './Brain';
import Edible from './Edible';
import Entity from './Entity';
import p5 from 'p5';

class Agent extends Entity {
  constructor (opts) {
    super(opts);
    this.classRef = opts.classRef || Agent;
    this.opts = opts;
    this.sortRank = opts.sortRank || 1;
    this.age = opts.age || 0;
    this.health = opts.health || 500;
    this.healthDrain = opts.healthDrain || 1;
    this.agroDrain = opts.agroDrain || 2;
    this.healthImpact = opts.healthImpact || 1300;
    this.size = opts.size || 10;
    this.isAgro = opts.isAgro;
    this.agroRate = opts.agroRate || -0.8;
    this.maxSpeed = opts.maxSpeed || 2;
    this.velocity = Util.createVector(0, 0);
    this.acceleration = Util.createVector(0, 0);
    this.matingRate = opts.matingRate || 0.01;
    this.mutationRate = opts.mutationRate || 0.1;
    this.brain =
      opts.brain ||
      new Brain({
        inputs: [
          'nearestAgentX',
          'nearestAgentY',
          'nearestAgentIsAgro',
          'nearestEdibleX',
          'nearestEdibleY',
          'nearestEdibleIsPoison'
        ],
        outputs: ['desiredForceX', 'desiredForceY', 'acceleration', 'agro']
      });
  }
  step (entities, incubator, dimensions) {
    const env = this.prepEnvironment(entities);
    this.acceleration.mult(0);
    this.updateStats();
    this.think(env, entities);
    this.updateMovement();
    if (this.isAgro) {
      if (env.nearestAgent) this.attemptToEat(env.nearestAgent);
    } else {
      if (env.nearestEdible) this.attemptToEat(env.nearestEdible);
    }
    this.handleMating(env.agents, incubator);
    Util.wrapAround(this.position, dimensions);
  }
  render (renderer, entities) {
    renderer.stage.push();
    renderer.stage.translate(this.position.x, this.position.y);
    renderer.stage.rotate(this.velocity.heading() + renderer.stage.PI / 2);

    let bodyColor = renderer.theme.agentBodyColor;
    if (this.isAgro) {
      bodyColor = renderer.theme.agroAgentBodyColor;
    }

    renderer.stage.noStroke();
    renderer.stage.fill(255, 50);
    let tailScale = this.velocity.mag() * this.maxSpeed * 0.25;
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

    renderer.stage.stroke(renderer.theme.agentOutlineColor);
    renderer.stage.line(0, 0, 0, -this.size / 2);

    renderer.stage.strokeWeight(this.size / 8);
    renderer.stage.fill(
      this.health > 45 ? this.health : renderer.stage.color(45)
    );
    renderer.stage.ellipse(0, -this.size / 2, this.size / 3, this.size / 3);

    renderer.stage.pop();
  }
  updateMovement () {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
  }
  think (env, entities) {
    this.brain.compute(env, this, entities);
  }
  updateStats () {
    this.age += 1;
    this.health -= this.healthDrain * (this.isAgro ? this.agroDrain : 1);
    if (this.health <= 0) this.isActive = false;
  }
  attemptToEat (entity) {
    if (Util.checkCollision(this, entity)) {
      this.health += entity.eat();
    }
  }
  eat () {
    this.isActive = false;
    return this.healthImpact;
  }
  handleMating (agents, incubator) {
    if (Util.random(1) < this.matingRate) {
      let partner = this.findMate(agents);
      if (partner) {
        let child = this.mate(partner);
        if (Util.random(1) < this.mutationRate) child.brain.mutate();
        incubator.push(child);
      }
    }
  }
  applyForce (force) {
    this.acceleration.add(force);
  }
  findMate (agents) {
    let total = 0;
    agents.forEach(agent => {
      total += agent.health;
    });
    agents.forEach(agent => {
      agent.matingProbability = agent.health / total;
    });
    let x = Util.random(1);
    let index = 0;
    while (x > 0) {
      x -= agents[index].matingProbability;
      index++;
    }
    index--;
    return agents[index];
  }
  mate (partner) {
    const position = this.position.copy();
    position.x += 20;
    position.y += 20;
    return new this.classRef({
      brain: this.brain.mate(partner.brain),
      position,
      group: this.opts.group,
      healthDrain: this.opts.healthDrain,
      agroDrain: this.opts.agroDrain,
      healthImpact: this.opts.healthImpact,
      size: this.opts.size,
      agroRate: this.opts.agroRate,
      maxSpeed: this.opts.maxSpeed,
      matingRate: this.opts.matingRate,
      mutationRate: this.opts.mutationRate
    });
  }
  prepEnvironment (entities) {
    let agents = entities.filter(e => e instanceof Agent);
    let nearestAgent = null;
    let nearestAgentVector = null;
    if (agents.length) {
      nearestAgent = Util.findNearest(this, agents);
      let desiredVectorToAgent = p5.Vector.sub(
        nearestAgent.position,
        this.position
      );
      nearestAgentVector = p5.Vector.sub(desiredVectorToAgent, this.velocity);
      nearestAgentVector.normalize();
    }
    let edibles = entities.filter(e => e instanceof Edible);
    let nearestEdible = null;
    let nearestEdibleVector = null;
    if (edibles.length) {
      nearestEdible = Util.findNearest(this, edibles);
      let desiredVectorToEdible = p5.Vector.sub(
        nearestEdible.position,
        this.position
      );
      nearestEdibleVector = p5.Vector.sub(desiredVectorToEdible, this.velocity);
      nearestEdibleVector.normalize();
    }
    return {
      agents,
      nearestAgent,
      nearestAgentVector,
      edibles,
      nearestEdible,
      nearestEdibleVector
    };
  }
}

export default Agent;
