import Util from './Util';

class EntityProcessor {
  constructor ({ entityConfig, dimensions }) {
    this.dimensions = dimensions;
    this.config = entityConfig;
    this.entities = [];
    this.incubator = [];
    this.initialized = false;
    this.stepCount = 0;
  }
  step ({ renderer }) {
    this.incubator = this.limitPopulation();
    this.entities = [...this.entities, ...this.incubator];
    this.incubator = this.produceEntities();
    this.entities.sort((a, b) => b.sortRank - a.sortRank);
    this.entities.forEach(e => {
      if (e.step) e.step(this.entities, this.incubator, this.dimensions);
    });
    if (renderer) {
      this.entities.forEach(e => {
        if (e.render) e.render(renderer, this.entities);
      });
    }
    this.entities = this.entities.filter(e => e.isActive);
    this.stepCount += 1;
  }
  limitPopulation () {
    this.config.forEach(({ group, Entity, count, max, min, opts }) => {
      max = max || count;
      const existingEntities = this.entities.filter(
        e => e instanceof Entity && e.group === group
      );
      if (existingEntities.length >= max) {
        this.incubator = this.incubator.filter(
          e => !(e instanceof Entity && e.group === group)
        );
      }
    });
    return this.incubator;
  }
  produceEntities () {
    const entities = [];
    this.config.forEach(({ group, Entity, count, max, min, opts }) => {
      min = min || count;
      let limit = min;
      if (!this.initialized) {
        limit = count;
      }
      const existingEntities = this.entities.filter(
        e => e instanceof Entity && e.group === group
      );
      for (let i = existingEntities.length; i < limit; i++) {
        opts.position = Util.createVector(
          Util.random(this.dimensions.width),
          Util.random(this.dimensions.height)
        );
        opts.group = group;
        opts.ClassRef = Entity;
        entities.push(new Entity(opts));
      }
    });
    this.initialized = true;
    return entities;
  }
  click (mousePosition) {
    this.entities.map(e => e.unselect());
    const clickedEntity = this.entities.find(e => mousePosition.dist(e.position) <= e.size);
    if (clickedEntity) {
      clickedEntity.select();
    }
    return clickedEntity;
  }
}

export default EntityProcessor;
