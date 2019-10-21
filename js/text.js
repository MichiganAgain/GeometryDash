function Text (text, x, y, size, position = null, movementFunction = null) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.t = 0;
    this.size = size;
    this.position = position;
    this.movementFuntion = movementFunction;
    
    this.draw = function (context, camera) {
        this.offset = this.movementFuntion(this.t);
        context.font = this.size + "px Arial";
        context.fillText(this.text, this.x + ((this.position === "absolute") ? 0 + this.offset: camera.xOffset + this.offset), this.y + ((this.position === "absolute") ? 0: camera.yOffset));
        context.strokeText(this.text, this.x + ((this.position === "absolute") ? 0 + this.offset: camera.xOffset + this.offset), this.y + ((this.position === "absolute") ? 0: camera.yOffset));
    }
    
    this.update = function (context, camera) {
        this.draw(context, camera);
        
        this.t++;
        this.x;
        if (this.t >= 360) this.t = 0;
    }
}