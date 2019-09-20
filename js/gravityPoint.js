function GravityPoint (x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    
    this.draw = function (camera) {
        context.fillStyle = "#000000";
        context.strokeStyle = "#000000";
        context.beginPath();
        context.arc(x + camera.xOffset, y + camera.yOffset, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
    
    this.update = function (camera) {
        this.draw(camera);
    }
}