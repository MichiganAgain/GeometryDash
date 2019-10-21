function GravityPoint (x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.SIZE = 0;  // so it can be tracked by the camera  should really replace this with parent class / interface tbh
    this.mass = mass;
    this.time = Math.floor(Math.random() * 360);
    
    this.setRadius = function (x) {
        // using f(x) = |3sin(5x) + this.radius|  //stretch in y-axis SF 3// //shift in y-axis + this.radius// //stretch in x-axis SF 1/5//
        x = (x / 180) * Math.PI;
        return Math.abs(7 * Math.sin(x * 5) + this.radius);
    }
    
    this.draw = function (context, camera) {
        context.fillStyle = "#000000";
        context.lineWidth = 0;
        context.beginPath();
        context.arc(this.x + camera.xOffset, this.y + camera.yOffset, this.setRadius(this.time), 0, 2 * Math.PI, false);
        context.fill();
    }
    
    this.update = function (context, camera) {
        this.time++;
        if (this.time % 360 == 0) this.time = 0;
        
        this.draw(context, camera);
    }
}