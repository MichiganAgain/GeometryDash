function GravityPoint (x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.time = Math.floor(Math.random() * 360);
    
    this.setRadius = function (x) {
        // using f(x) = |3sin(10x) + this.radius|  //stretch in y-axis SF 3// //shift in y-axis + this.radius// //stretch in x-axis SF 1/10//
        x = (x / 180) * Math.PI;
        return Math.abs(3 * Math.sin(x * 10) + this.radius);
    }
    
    this.draw = function (camera) {
        context.fillStyle = "#000000";
        context.lineWidth = 0;
        context.beginPath();
        context.arc(x + camera.xOffset, y + camera.yOffset, this.setRadius(this.time), 0, 2 * Math.PI, false);
        context.fill();
    }
    
    this.update = function (camera) {
        this.time++;
        if (this.time % 360 == 0) this.time = 0;
        
        this.draw(camera);
    }
}