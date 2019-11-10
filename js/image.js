function myImage (x, y, width, height, position, image, movementFunction = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.position = position;
    this.movementFuntion = movementFunction;
    this.image = image;
    this.t = 0;
    
    this.draw = function (context, camera) {
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x + ((this.movementFuntion == null) ? 0: this.movementFuntion(this.t)) + ((this.position === "absolute") ? 0: (camera.xOffset - sprite.xVelocity)), this.y + ((this.position === "absolute") ? 0: (camera.yOffset - sprite.yVelocity)), this.width, this.height);
    }
    
    this.update = function (context, camera) {
        if (this.t++ >= 360) this.t = 0;
        this.draw(context, camera);
    }
}