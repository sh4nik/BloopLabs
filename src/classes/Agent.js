import Util from './Util';
import Brain from './Brain';
import Edible from './Edible';
import Entity from './Entity';
import P5 from 'p5';

class Agent extends Entity {
  constructor (opts) {
    super(opts);
    this.ClassRef = opts.ClassRef || Agent;
    this.parents = opts.parents || [];
    this.opts = opts;
    this.sortRank = opts.sortRank || 1;
    this.age = opts.age || 0;
    this.health = (opts.health || 500) + Util.randomBetween(0, 50);
    this.maxHealth = opts.maxHealth || this.health * 4;
    this.healthDrain = opts.healthDrain || 3;
    this.agroDrain = opts.agroDrain || 1;
    this.healthImpact = opts.healthImpact || 1300;
    this.growthRate = opts.growthRate || 0.01;
    this.maxSize = opts.maxSize || opts.size || 30;
    this.minSize = opts.minSize || this.maxSize / 2;
    this.size = this.minSize;
    this.isAgro = opts.isAgro;
    this.agroRate = opts.agroRate || -0.8;
    this.maxSpeed = opts.maxSpeed || 2.2;
    this.maxSteering = opts.maxSteering || 0.1;
    this.velocity = Util.createVector(
      Util.randomBetween(-1, 1),
      Util.randomBetween(-1, 1)
    );
    this.acceleration = Util.createVector(
      Util.randomBetween(-1, 1),
      Util.randomBetween(-1, 1)
    );
    this.matingAge = opts.matingAge || 200;
    this.matingRate = opts.matingRate || 0.05;
    this.cloningRate = opts.cloningRate || 0.2;
    this.mutationRate = opts.mutationRate || 0.6;
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
    this.updateStats();
    this.grow();
    this.acceleration.mult(0);
    this.brain.compute(env, this, entities);
    this.updateMovement();
    this.attemptToEat(this.isAgro ? env.nearestAgent : env.nearestEdible);
    this.handleMating(env.agents, incubator);
    Util.wrapAround(this.position, dimensions);
  }
  updateMovement () {
    this.velocity.add(this.acceleration.limit(this.maxSteering));
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
  }
  seek (target) {
    let desired = P5.Vector.sub(target.position, this.position);
    desired.setMag(this.maxSpeed);
    let steering = P5.Vector.sub(desired, this.velocity);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }
  updateStats () {
    this.age += 1;
    this.health = this.health > this.maxHealth ? this.maxHealth : this.health;
    this.health -= this.healthDrain * (this.isAgro ? this.agroDrain : 1);
    if (this.health <= 0) this.isActive = false;
  }
  grow () {
    if (this.size < this.maxSize) this.size += this.growthRate;
  }
  attemptToEat (entity) {
    if (entity && Util.checkCollision(this, entity)) {
      this.health += entity.eat();
    }
  }
  eat () {
    this.isActive = false;
    return this.healthImpact;
  }
  handleMating (agents, incubator) {
    if (this.age > this.matingAge && Util.random(1) < this.matingRate) {
      let partner;
      if (Util.random(1) < this.cloningRate) {
        partner = this;
      } else {
        partner = this.findMate(
          agents.filter(a => a.age > a.matingAge && a !== this)
        );
      }
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
    if (!agents || !agents.length) return null;
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
    const parents = [this];
    if (this !== partner) parents.push(partner);
    const position = this.position.copy();
    position.x += 20;
    position.y += 20;
    return new this.ClassRef({
      ClassRef: this.ClassRef,
      parents,
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
    if (agents.length > 1) {
      nearestAgent = Util.findNearest(this, agents);
      let desiredVectorToAgent = P5.Vector.sub(
        nearestAgent.position,
        this.position
      );
      nearestAgentVector = P5.Vector.sub(desiredVectorToAgent, this.velocity);
      nearestAgentVector.normalize();
    }
    let edibles = entities.filter(e => e instanceof Edible);
    let nearestEdible = null;
    let nearestEdibleVector = null;
    if (edibles.length) {
      nearestEdible = Util.findNearest(this, edibles);
      let desiredVectorToEdible = P5.Vector.sub(
        nearestEdible.position,
        this.position
      );
      nearestEdibleVector = P5.Vector.sub(desiredVectorToEdible, this.velocity);
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
