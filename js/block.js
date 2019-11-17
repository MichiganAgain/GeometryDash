function Block (x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.SIZE = 40;
    this.friction = 1.3;
    this.dead = false;
    
    this.checkConsumed = function (gravityPoints) {
        for (let point of gravityPoints) {
            let distance = Math.sqrt((point.x - (this.x + this.SIZE / 2))**2 + (point.y - (this.y + this.SIZE / 2))**2);
            if (distance <= point.radius) {
                point.radius += this.SIZE / 40;
                point.mass += 5000000000;
                this.dead = true;
            }
        }
    }
    
    this.draw = function (context, camera) {
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
    }
    
    this.update = function (context, gravityPoints, physics, camera) {
        this.checkConsumed(gravityPoints);
        this.draw(context, camera);
    }
}