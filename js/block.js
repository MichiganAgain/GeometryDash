function Block (x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.SIZE = 40;
    this.friction = 1.3;
    
    this.draw = function (context, camera) {
        context.fillStyle = this.color;
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
        context.beginPath();
        context.rect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (context, physics, camera) {        
        this.draw(context, camera);
    }
}