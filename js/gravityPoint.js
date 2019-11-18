function GravityPoint (x, y, image, radius, mass) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.radius = radius;
    this.SIZE = 0;  // so it can be tracked by the camera  should really replace this with parent class / interface tbh
    this.mass = mass;
    this.teleportTo = null;
    this.time = Math.floor(Math.random() * 360);
    this.text = [];
    
    this.setRadius = function (x) {
        // using f(x) = |7sin(5x) + this.radius|  //stretch in y-axis SF 7// //shift in y-axis + this.radius// //stretch in x-axis SF 1/5//
        x = (x / 180) * Math.PI;
        return Math.abs(3 * Math.sin(x * 3) + this.radius);
    }
    
    this.draw = function (context, camera) {
//        context.fillStyle = "#000000";
//        context.lineWidth = 0;
//        context.beginPath();
//        context.arc(this.x + camera.xOffset, this.y + camera.yOffset, this.setRadius(this.time), 0, 2 * Math.PI, false);
//        context.fill();
        context.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x + camera.xOffset - this.setRadius(this.time), this.y + camera.yOffset - this.setRadius(this.time), this.setRadius(this.time) * 2, this.setRadius(this.time) * 2);
    }
    
    this.update = function (context, camera) {
        this.time++;
        if (this.time % 360 == 0) this.time = 0;

        this.draw(context, camera);
        for (let t of this.text) {
            t.y = this.y - this.radius - 50;
            t.x = this.x;
            t.update(context, camera);
        }
    }
}