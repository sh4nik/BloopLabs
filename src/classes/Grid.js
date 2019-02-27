class Grid {
  constructor(opts) {
    this.cellSize = opts.cellSize || 60;
    this.dimensions = opts.dimensions;
    this.data = [];
    for (let y = 0; y < this.dimensions.height / this.cellSize; y++) {
      this.data.push([]);
      for (let x = 0; x < this.dimensions.width / this.cellSize; x++) {
        this.data[y].push([]);
      }
    }
  }
  assignToChunk(entity) {
    let previousChunk = entity.chunk;
    let chunk = {
      x: Math.floor(entity.position.x / this.cellSize),
      y: Math.floor(entity.position.y / this.cellSize)
    };
    let chunkEntities = this.data[chunk.y][chunk.x];
    let newChunk = !previousChunk || previousChunk.x !== chunk.x || previousChunk.y !== chunk.y;
    if (newChunk) {
      if (previousChunk) this.removeFromChunk(entity);
      entity.chunk = chunk;
      chunkEntities.push(entity);
    }
    return this.getEntitiesInReach(1, chunk, this.data);
  }
  removeFromChunk(entity) {
    let previousChunkEntities = this.data[entity.chunk.y][entity.chunk.x];
    this.data[entity.chunk.y][entity.chunk.x] = previousChunkEntities.filter(e => e !== entity);
    entity.chunk = null;
  }
  getEntitiesInReach(range, chunk, data) {
    let entities = [];
    let startY = Math.max(0, (chunk.y - range));
    let endY = Math.min(data.length - 1, (chunk.y + range));
    for (let row = startY; row <= endY; row++) {
      let xrange = range - Math.abs(row - chunk.y);
      let startX = Math.max(0, (chunk.x - xrange));
      let endX = Math.min(data[row].length - 1, (chunk.x + xrange));
      for (let col = startX; col <= endX; col++) {
        entities = [...entities, ...data[row][col]];
      }
    }
    return entities;
  }
}

export default Grid;
