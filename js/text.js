function Text (text, x, y, size, position) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.size = size;
    this.position = position;
    
    this.draw = function (camera) {
        context.font = this.size + "px Arial";
        context.fillText(this.text, this.x + ((this.position === "absolute") ? 0: camera.xOffset), this.y + ((this.position === "absolute") ? 0: camera.yOffset));
        context.strokeText(this.text, this.x + ((this.position === "absolute") ? 0: camera.xOffset), this.y + ((this.position === "absolute") ? 0: camera.yOffset));
    }
    
    this.update = function (camera) {
        this.draw(camera);
    }
}