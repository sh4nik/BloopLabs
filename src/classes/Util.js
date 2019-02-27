import P5 from 'p5';

class Util {
  static random (max) {
    return Math.random() * max;
  }
  static findNearest (entity, entities) {
    return entities
      .filter(e => e !== entity)
      .reduce((prev, curr) => {
        if (!prev) return curr;
        const currentIsCloser =
          entity.position.dist(curr.position) <
          entity.position.dist(prev.position);
        return currentIsCloser ? curr : prev;
      }, null);
  }
  static wrapAround (vector, dimensions) {
    if (vector.x < 0) vector.x = dimensions.width;
    if (vector.y < 0) vector.y = dimensions.height;
    if (vector.x > dimensions.width) vector.x = 0;
    if (vector.y > dimensions.height) vector.y = 0;
  }
  static checkCollision (obj1, obj2) {
    return obj1.position.dist(obj2.position) < obj1.size / 2 + obj2.size / 2;
  }
  static roundToDecimal (i) {
    return Math.round(i * 10) / 10;
  }
  static createVector (x, y) {
    return Util._p5.createVector(x, y);
  }
  static mapVal (val, valMin, valMax, min, max) {
    return Util._p5.map(val, valMin, valMax, min, max);
  }
}

Util._p5 = new P5();

export default Util;
