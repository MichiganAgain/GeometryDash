function Particle (x, y, xVelocity, yVelocity, radius) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.radius = radius;
    this.mass = this.radius;
    
    this.feelGravityEffects = function (physics, gravityPoints) {
        this.yVelocity += physics.gravity;
        
        for (let point of gravityPoints) {
            let xDiff = point.x - this.x;
            let yDiff = point.y - this.y;
            let distanceFromPoint = Math.sqrt((xDiff)**2 + (yDiff)**2);

            let force = (physics.gravitationalConstant * this.mass * point.mass) / (distanceFromPoint);
            let theta = Math.atan2(yDiff, xDiff);
            this.xVelocity += force * Math.cos(theta);
            this.yVelocity += force * Math.sin(theta);
        }
    }
    
    this.adjustToMaximumVelocity = function (physics) {
        let currentVelocity = Math.sqrt(this.xVelocity**2 + this.yVelocity**2);
        if (currentVelocity > physics.maxVelocity) {
            this.xVelocity = (this.xVelocity / currentVelocity) * physics.maxVelocity;
            this.yVelocity = (this.yVelocity / currentVelocity) * physics.maxVelocity;
        }
    }
    
    this.draw = function (context, camera) {
        context.fillStyle = "#000000";
        context.lineWidth = 0;
        context.beginPath();
        context.arc(this.x + camera.xOffset, this.y + camera.yOffset, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    }
    
    this.update = function (context, physics, camera) {
        this.feelGravityEffects(physics, gravityPoints);
        this.adjustToMaximumVelocity(physics);
        
        //this.checkBlockCollisions(blocks);
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        
        this.draw(context, camera);
    }
}