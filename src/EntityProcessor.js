class EntityProcessor {
    constructor({ entityConfig, dimensions }) {
        this.dimensions = dimensions;
        this.config = entityConfig;
        this.entities = [];
        this.incubator = [];
        this.initialized = false;
    }
    step({ renderer }) {
        this.incubator = this.limitPopulation();
        this.entities = [...this.entities, ...this.incubator];
        this.incubator = this.produceEntities();
        this.entities.forEach(e => {
            if (e.step) e.step(this.entities, this.incubator, this.dimensions);
        });
        if (renderer) {
            this.entities.forEach(e => {
                if (e.render) e.render(this.entities, renderer);
            });
        }
        this.entities = this.entities.filter(e => e.isActive);
    }
    limitPopulation() {
        this.config.forEach(({ groupId, Entity, count, max, min, opts }) => {
            max = max || count;
            const existingEntities = this.entities.filter(e => e instanceof Entity && e.groupId === groupId);
            if (existingEntities.length >= max) {
                this.incubator = this.incubator.filter(e => !(e instanceof Entity && e.groupId === groupId));
            }
        });
        return this.incubator;
    }
    produceEntities() {
        const entities = [];
        this.config.forEach(({ groupId, Entity, count, max, min, opts }) => {
            min = min || count;
            let limit = min;
            if (!this.initialized) {
                limit = count;
            }
            const existingEntities = this.entities.filter(e => e instanceof Entity && e.groupId === groupId);
            for (let i = existingEntities.length; i < limit; i++) {
                opts.position = _p5.createVector(
                    Util.random(this.dimensions.width),
                    Util.random(this.dimensions.height)
                );
                opts.groupId = groupId;
                entities.push(new Entity(opts));
            }
        });
        this.initialized = true;
        return entities;
    }
}

export default EntityProcessor;
