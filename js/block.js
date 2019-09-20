function Block (x, y) {
    this.x = x;
    this.y = y;
    this.SIZE = 45;
    
    this.draw = function (camera) {
        context.fillStyle = "#111111";
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (physics, camera) {        
        this.draw(camera);
    }
}