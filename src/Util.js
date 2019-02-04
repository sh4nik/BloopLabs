class Util {
    static random(max) {
        return Math.random() * max;
    }
    static findNearest(entity, entities) {
        return entities.filter(e => e !== entity).reduce((prev, curr) => {
            const currentIsCloser = entity.position.dist(curr.position) < entity.position.dist(prev.position);
            return currentIsCloser ? curr : prev;
        });
    }
    static wrapAround(vector, dimensions) {
        if (vector.x < 0) vector.x = dimensions.width;
        if (vector.y < 0) vector.y = dimensions.height;
        if (vector.x > dimensions.width) vector.x = 0;
        if (vector.y > dimensions.height) vector.y = 0;
    }
    static checkCollision(obj1, obj2) {
        return obj1.position.dist(obj2.position) < (obj1.size) + (obj2.size);
    }
    static roundToDecimal(i) {
        return Math.round(i * 10) / 10;
    }
}

export default Util;
