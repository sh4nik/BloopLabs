import Edible from './Edible';

class Food extends Edible {
  constructor (opts) {
    super(opts);
    this.healthImpact = opts.healthImpact;
    this.size = opts.size;
  }
  getColor (theme) {
    return theme.foodColor;
  }
}

export default Food;
