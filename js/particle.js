function Particle (x, y, xVelocity, yVelocity, radius) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.radius = radius;
    this.SIZE = 0;  // so it can be tracked by the camera  should really replace this with parent class / interface tbh
    this.mass = this.radius;
    this.dead = false;
    
    this.checkBlockCollisions = function (blocks) {
        for (let block of blocks) {
            if (this.x + this.radius >= block.x && this.x - this.radius <= block.x + block.SIZE) {
                if (this.y + this.radius <= block.y && this.y + this.radius + this.yVelocity >= block.y) {  // top collision
                    this.yVelocity = 0;
                    this.y = block.y - this.radius;
                }
                if (this.y - this.radius >= block.y + block.SIZE && this.y - this.radius + this.yVelocity <= block.y + block.SIZE) {    // bottom collision
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE + this.radius;
                }
            }
            if (this.y + this.radius >= block.y && this.y - this.radius <= block.y + block.SIZE) {
                if (this.x + this.radius <= block.x && this.x + this.radius + this.xVelocity >= block.x) {   // left collision
                    this.xVelocity = 0;
                    this.x = block.x - this.radius;
                }
                if (this.x - this.radius >= block.x + block.SIZE && this.x - this.radius + this.xVelocity <= block.x + block.xVelocity) {   // right collision
                    this.xVelocity = 0;
                    this.x = block.x + block.SIZE + this.radius;
                }
            }
        }
    }
    
    this.feelGravityEffects = function (physics, gravityPoints) {
        this.yVelocity += physics.gravity;
        
        for (let point of gravityPoints) {
            let xDiff = point.x - this.x;
            let yDiff = point.y - this.y;
            let distanceFromPoint = Math.sqrt((xDiff)**2 + (yDiff)**2);
            if (distanceFromPoint <= point.radius - this.radius) {
                this.dead = true
                point.radius++;
                point.mass += 5000000000
            }

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
        
        this.checkBlockCollisions(blocks);
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        
        this.draw(context, camera);
    }
}