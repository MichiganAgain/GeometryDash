function Block (x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
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
        context.fillStyle = this.color;
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
        context.beginPath();
        context.rect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (context, gravityPoints, physics, camera) {
        this.checkConsumed(gravityPoints);
        this.draw(context, camera);
    }
}