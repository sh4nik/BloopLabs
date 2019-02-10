class Entity {
  constructor ({
    isActive = true,
    position,
    group = 'default',
    sortRank = 999
  }) {
    this.isActive = isActive;
    this.group = group;
    this.position = position;
    this.sortRank = sortRank;
  }
}

export default Entity;
