function myImage (x, y, width, height, position, image, cloud, movementFunction = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.position = position;
    this.cloud = cloud;
    this.movementFuntion = movementFunction;
    this.image = image;
    this.t = 0;
    
    this.draw = function (context, camera) {
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x + ((this.movementFuntion == null) ? 0: this.movementFuntion(this.t)) + ((this.position === "absolute") ? 0: (camera.xOffset - ((camera.trackedObject == sprite) ? sprite.xVelocity: 0))), this.y + ((this.position === "absolute") ? 0: (camera.yOffset - ((camera.trackedObject == sprite) ? sprite.yVelocity: 0))), this.width, this.height);
    }
    
    this.update = function (context, camera) {
        if (this.cloud) {
            if (this.t % 20 == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, 0, 4, true, "#0077FF"));
            for (let i = 0; i < 3; i++) if (Math.floor(Math.random() * 100) == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, 0, 4, true, "#0077FF"));
            this.x++;
        }
        if (this.t++ >= 360) this.t = 0;
        this.draw(context, camera);
    }
}