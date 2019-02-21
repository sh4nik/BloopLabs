class Entity {
  constructor({
    isActive = true,
    position,
    group = 'default',
    sortRank = 999,
    size = 20
  }) {
    this.isActive = isActive;
    this.group = group;
    this.position = position;
    this.sortRank = sortRank;
    this.size = size;
  }
}

export default Entity;
