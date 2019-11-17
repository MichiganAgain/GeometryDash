function myImage (x, y, width, height, position, imageData, cloud, movementFunction = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.position = position;
    this.cloud = cloud;
    this.snowy = Math.floor(Math.random() * 2);
    this.movementFuntion = movementFunction;
    this.imageData = imageData;
    this.currentFrame = 0;
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
        if (this.imageData.spriteSheet === true) {
            let imageWidth = this.imageData.image.width / this.imageData.frames;
            context.drawImage(this.imageData.image, this.currentFrame * imageWidth, 0, imageWidth, this.imageData.image.height, this.x + ((this.movementFuntion == null) ? 0: this.movementFuntion(this.t)) + ((this.position === "absolute") ? 0: (camera.xOffset - ((camera.trackedObject == sprite) ? sprite.xVelocity: 0))), this.y + ((this.position === "absolute") ? 0: (camera.yOffset - ((camera.trackedObject == sprite) ? sprite.yVelocity: 0))), this.width, this.height);
        } else context.drawImage(this.imageData.image, 0, 0, this.imageData.image.width, this.imageData.image.height, this.x + ((this.movementFuntion == null) ? 0: this.movementFuntion(this.t)) + ((this.position === "absolute") ? 0: (camera.xOffset - ((camera.trackedObject == sprite) ? sprite.xVelocity: 0))), this.y + ((this.position === "absolute") ? 0: (camera.yOffset - ((camera.trackedObject == sprite) ? sprite.yVelocity: 0))), this.width, this.height);
    }
    
    this.update = function (context, camera) {
        this.checkConsumed(gravityPoints);
        
        if (this.imageData.spriteSheet) {
            if (this.t > 0 && this.t % 6 === 0) this.currentFrame++;
            if (this.currentFrame >= this.imageData.frames) this.currentFrame = 0;
        }
        if (this.cloud) {
            if (this.t % 20 == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, (this.snowy == 1) ? 5: 0, 4, (this.snowy == 1) ? false: true, (this.snowy == 1) ? "#FFFFFF": "#0077FF"));
            for (let i = 0; i < 3; i++) if (Math.floor(Math.random() * 100) == 0) particles.push(new Particle((this.x + this.width / 2) + (Math.random() * this.width - this.width / 2), this.y + this.height / 2, 0, (this.snowy == 1) ? 5: 0, 4, (this.snowy == 1) ? false: true, (this.snowy == 1) ? "#FFFFFF": "#0077FF"));
            this.x++;
        }
        if (this.t++ >= 360) this.t = 0;
        this.draw(context, camera);
    }
}