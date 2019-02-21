class Entity {
  constructor ({
    isActive = true,
    position,
    group = 'default',
    sortRank = 999,
    size = 20,
    selected = false
  }) {
    this.isActive = isActive;
    this.group = group;
    this.position = position;
    this.sortRank = sortRank;
    this.size = size;
    this.selected = selected;
  }
  select () {
    this.selected = true;
  }
  unselect () {
    this.selected = false;
  }
}

export default Entity;
