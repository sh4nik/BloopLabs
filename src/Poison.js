import Edible from './Edible';

class Poison extends Edible {
  constructor (opts) {
    super(opts);
    this.healthImpact = opts.healthImpact;
    this.size = opts.size;
  }
  getColor (theme) {
    return theme.poisonColor;
  }
}

export default Poison;
