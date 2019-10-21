function Particle (x, y, xVelocity, yVelocity, radius, color) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.radius = radius;
    this.color = color;
    this.SIZE = 0;  // so it can be tracked by the camera  should really replace this with parent class / interface tbh
    this.GUARD = 0.0001;
    this.mass = this.radius;
    this.dead = false;
    
    this.checkBlockCollisions = function (blocks) {
        for (let block of blocks) {
            if (this.x + this.radius >= block.x && this.x - this.radius <= block.x + block.SIZE) {
                if (this.y + this.radius <= block.y && this.y + this.radius + this.yVelocity >= block.y) {  // top collision
                    this.yVelocity *= -0.8;
                    this.y = block.y - this.radius - this.GUARD;
                }
                if (this.y - this.radius >= block.y + block.SIZE && this.y - this.radius + this.yVelocity <= block.y + block.SIZE) {    // bottom collision
                    this.yVelocity *= -0.8;
                    this.y = block.y + block.SIZE + this.radius + this.GUARD;
                }
            }
            if (this.y + this.radius >= block.y && this.y - this.radius <= block.y + block.SIZE) {
                if (this.x + this.radius <= block.x && this.x + this.radius + this.xVelocity >= block.x) {   // left collision
                    this.xVelocity *= -0.8;
                    this.x = block.x - this.radius - this.GUARD;
                }
                if (this.x - this.radius >= block.x + block.SIZE && this.x - this.radius + this.xVelocity <= block.x + block.SIZE) {   // right collision
                    this.xVelocity *= -0.8;
                    this.x = block.x + block.SIZE + this.radius + this.GUARD;
                }
            }
        }
    }
    
    this.feelGravityEffects = function (physics, gravityPoints) {
        //this.yVelocity += physics.gravity;
        
        for (let point of gravityPoints) {
            let xDiff = point.x - this.x;
            let yDiff = point.y - this.y;
            let distanceFromPoint = Math.sqrt((xDiff)**2 + (yDiff)**2);
            if (distanceFromPoint <= point.radius - this.radius) {
                this.dead = true
                point.radius += this.radius / 12;
                point.mass += 1000000000;
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
        context.fillStyle = this.color;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(this.x + camera.xOffset, this.y + camera.yOffset, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
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