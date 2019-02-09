import Util from './Util';
import Brain from './Brain';
import Edible from './Edible';
import { Shape } from '@createjs/easeljs';
import p5 from 'p5';

class Agent {
  constructor ({
    isActive = true,
    groupId,
    age = 0,
    position,
    matingRate = 0.01,
    mutationRate = 0.1,
    health = 500,
    healthDrain = 1,
    agroDrain = 2,
    healthImpact = 1300,
    size = 6,
    isAgro = false,
    agroRate = -0.8,
    brain
  }) {
    this.isActive = isActive;
    this.groupId = groupId;
    this.age = age;
    this.health = health;
    this.healthDrain = healthDrain;
    this.agroDrain = agroDrain;
    this.healthImpact = healthImpact;
    this.size = size;
    this.isAgro = isAgro;
    this.agroRate = agroRate;
    this.maxSpeed = 2;
    this.position = position;
    this.velocity = Util.createVector(0, 0);
    this.acceleration = Util.createVector(0, 0);
    this.matingRate = matingRate;
    this.mutationRate = mutationRate;
    this.brain =
      brain ||
      new Brain({
        inputs: [
          'nearestAgentX',
          'nearestAgentY',
          'nearestAgentIsAgro',
          'nearestEdibleX',
          'nearestEdibleY',
          'nearestEdibleIsPoison'
        ],
        outputs: ['desiredForceX', 'desiredForceY', 'acceleration', 'agro'],
        midLayerNodes: 8
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
  render (entities, renderer) {
    if (renderer && !this.shape) {
      this.shape = new Shape();
      renderer.stage.addChild(this.shape);
    }
    if (this.isActive) {
      this.shape.x = this.position.x;
      this.shape.y = this.position.y;
      let bodyColor = this.isAgro
        ? renderer.theme.agroAgentBodyColor
        : renderer.theme.agentBodyColor;
      this.shape.graphics
        .clear()
        .setStrokeStyle(3)
        .beginStroke(renderer.theme.agentOutlineColor)
        .beginFill(bodyColor)
        .drawCircle(0, 0, this.size);
    } else {
      renderer.stage.removeChild(this.shape);
    }
  }
  updateMovement () {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
  }
  think (env, entities) {
    this.brain.compute(env, this, entities);
  }
  seek (target) {
    let desired = p5.Vector.sub(target.position, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    this.applyForce(steer);
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
    return new Agent({
      brain: this.brain.mate(partner.brain),
      position,
      groupId: this.groupId,
      healthDrain: this.healthDrain,
      agroDrain: this.agroDrain,
      healthImpact: this.healthImpact,
      size: this.size,
      agroRate: this.agroRate,
      maxSpeed: this.maxSpeed,
      matingRate: this.matingRate,
      mutationRate: this.mutationRate
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
