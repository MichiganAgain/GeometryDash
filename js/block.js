function Block (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 40;
    this.friction = 1.03;
    
    this.draw = function (context, camera) {
        context.fillStyle = "#111111";
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (context, physics, camera) {        
        this.draw(context, camera);
    }
}