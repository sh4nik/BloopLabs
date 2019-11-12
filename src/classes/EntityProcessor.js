import Util from './Util';
import Grid from './Grid';

class EntityProcessor {
  constructor ({ entityConfig, dimensions, selectHandler, entityClasses }) {
    this.dimensions = dimensions;
    this.config = entityConfig;
    this.selectHandler = selectHandler;
    this.entityClasses = entityClasses;
    this.grid = new Grid({ dimensions });
    this.entities = [];
    this.incubator = [];
    this.stepCount = 0;
  }
  step () {
    this.incubator = EntityProcessor.controlIncubator(
      this.incubator,
      this.entities,
      this.config,
      this.dimensions,
      !this.stepCount,
      this.entityClasses
    );
    this.entities = [...this.entities, ...this.incubator];
    this.incubator = [];
    this.entities.sort((a, b) => b.sortRank - a.sortRank);
    this.entities.forEach(e => {
      let chunkEntities = this.grid.assignToChunk(e);
      if (e.step) e.step(chunkEntities, this.incubator, this.dimensions);
    });
    this.entities = this.entities.filter(e => {
      if (!e.isActive) {
        this.grid.removeFromChunk(e);
        if (e.destroy) e.destroy();
      }
      return e.isActive;
    });
    this.stepCount += 1;
  }
  selectEntityAt (positionX, positionY) {
    const position = Util.createVector(positionX, positionY);
    const entityAtPosition = this.entities.find(
      e => position.dist(e.position) <= e.size
    );
    this.selectEntity(entityAtPosition);
  }
  selectEntity (entity) {
    this.entities.forEach(e => e.unselect());
    if (entity) {
      entity.select();
    }
    this.selectHandler(entity);
  }
  static isGroupEntity (entity, entityType, group) {
    return entity instanceof entityType && entity.group === group;
  }
  static controlIncubator (
    incubator,
    entities,
    entityConfig,
    dimensions,
    kickoff,
    entityClasses
  ) {
    let incubatingPopulation = [...incubator];
    entityConfig.forEach(
      ({ group, entity, count = 0, max = count, min = count, opts }) => {
        const Entity = entityClasses[entity];
        if (kickoff) min = count;
        const existingEntities = entities.filter(e =>
          EntityProcessor.isGroupEntity(e, Entity, group)
        );
        const existingIncubatees = incubatingPopulation.filter(e =>
          EntityProcessor.isGroupEntity(e, Entity, group)
        );
        const entityTotal = existingEntities.length + existingIncubatees.length;
        for (let i = entityTotal; i < min; i++) {
          opts.position = Util.createVector(
            Util.random(dimensions.width),
            Util.random(dimensions.height)
          );
          opts.group = group;
          opts.ClassRef = Entity;
          incubatingPopulation.push(new Entity(opts));
        }
        if (existingEntities.length >= max) {
          incubatingPopulation = incubatingPopulation.filter(
            e => !EntityProcessor.isGroupEntity(e, Entity, group)
          );
        }
      }
    );
    return incubatingPopulation;
  }
}

export default EntityProcessor;
