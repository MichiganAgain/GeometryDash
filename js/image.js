function myImage (x, y, width, height, position, image, cloud, movementFunction = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.position = position;
    this.cloud = cloud;
    this.snowy = Math.floor(Math.random() * 2);
    this.movementFuntion = movementFunction;
    this.image = image;
    this.dead = false;
    this.t = 0;
    
    this.checkConsumed = function (gravityPoints) {
        for (let point of gravityPoints) {
            let distance = Math.sqrt((point.x - (this.x + this.width / 2))**2 + (point.y - (this.y + this.height / 2))**2);
            if (distance <= point.radius) {
                point.radius += ((this.width + this.height) / 2) / 40;
                point.mass += 5000000000;
                this.dead = true;
            }
        }
    }
    
    this.draw = function (context, camera) {
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x + ((this.movementFuntion == null) ? 0: this.movementFuntion(this.t)) + ((this.position === "absolute") ? 0: (camera.xOffset - ((camera.trackedObject == sprite) ? sprite.xVelocity: 0))), this.y + ((this.position === "absolute") ? 0: (camera.yOffset - ((camera.trackedObject == sprite) ? sprite.yVelocity: 0))), this.width, this.height);
    }
    
    this.update = function (context, camera) {
        this.checkConsumed(gravityPoints);
        if (this.cloud) {
            if (this.t % 20 == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, (this.snowy == 1) ? 5: 0, 4, (this.snowy == 1) ? false: true, (this.snowy == 1) ? "#FFFFFF": "#0077FF"));
            for (let i = 0; i < 3; i++) if (Math.floor(Math.random() * 100) == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, (this.snowy == 1) ? 5: 0, 4, (this.snowy == 1) ? false: true, (this.snowy == 1) ? "#FFFFFF": "#0077FF"));
            this.x++;
        }
        if (this.t++ >= 360) this.t = 0;
        this.draw(context, camera);
    }
}