function Particle (x, y, xVelocity, yVelocity, radius, lethal, color) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.trail = [];
    this.radius = radius;
    this.color = color;
    this.SIZE = 0;  // so it can be tracked by the camera  should really replace this with parent class / interface tbh
    this.GUARD = 0.0001;
    this.mass = this.radius;
    this.dead = false;
    this.lethal = lethal;
    this.ttl = 200;
    this.timeToDot = 1;
    this.maxTrailLength = 10;
    this.t = 0;
    this.particleGenerationTime = 75;

    this.checkBlockCollisions = function (blocks) {
        for (let block of blocks) {
            if (this.x + this.radius >= block.x && this.x - this.radius <= block.x + block.SIZE) {
                if (this.y + this.radius <= block.y && this.y + this.radius + this.yVelocity >= block.y) {  // top collision
                    this.yVelocity *= -0.5;
                    this.xVelocity /= block.friction;
                    this.y = block.y - this.radius - this.GUARD;
                    if (this.lethal == false) {this.dead = true; this.yVelocity = 0;}
                }
                if (this.y - this.radius >= block.y + block.SIZE && this.y - this.radius + this.yVelocity <= block.y + block.SIZE) {    // bottom collision
                    this.yVelocity *= -0.5;
                    this.xVelocity /= block.friction;
                    this.y = block.y + block.SIZE + this.radius + this.GUARD;
                }
            }
            if (this.y + this.radius >= block.y && this.y - this.radius <= block.y + block.SIZE) {
                if (this.x + this.radius <= block.x && this.x + this.radius + this.xVelocity >= block.x) {   // left collision
                    this.xVelocity *= -0.5;
                    this.yVelocity /= block.friction;
                    this.x = block.x - this.radius - this.GUARD;
                }
                if (this.x - this.radius >= block.x + block.SIZE && this.x - this.radius + this.xVelocity <= block.x + block.SIZE) {   // right collision
                    this.xVelocity *= -0.5;
                    this.yVelocity /= block.friction;
                    this.x = block.x + block.SIZE + this.radius + this.GUARD;
                }
            }
        }
    }
    
    this.feelGravityEffects = function (physics, gravityPoints) {
        if (this.lethal) this.yVelocity += physics.gravity;
        
        for (let point of gravityPoints) {
            let xDiff = point.x - this.x;
            let yDiff = point.y - this.y;
            let distanceFromPoint = Math.sqrt((xDiff)**2 + (yDiff)**2);
            if (distanceFromPoint <= point.radius - this.radius) {
                this.dead = true
                point.radius += 2;
                point.mass += 5000000000;
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
        for (let i = 0; i < this.trail.length; i++) {
            context.beginPath();
            let contrast = (i / this.maxTrailLength) * 255;
            context.fillStyle = "#" + contrast.toString(16) + contrast.toString(16) + contrast.toString(16);
            context.arc(this.trail[i].x + camera.xOffset, this.trail[i].y + camera.yOffset, (i/this.maxTrailLength) * this.radius, 0, Math.PI * 2, false);
            context.fill();
            context.stroke();
        }
        
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
        
        if (this.lethal) {
            this.ttl--;
            if (this.ttl <= 0) this.dead = true;
        }
        
        this.t++;
        if (this.t % this.timeToDot == 0) {
            if (this.trail.length > this.maxTrailLength) {
                //if (this.t % this.particleGenerationTime == 0) particles.push(new Particle(this.trail[0].x, this.trail[0].y, Math.random() * 5, Math.random() * 5, 10, false, "#00FFFF"));
                this.trail.splice(0, 1);
            }
            this.trail.push({x: this.x, y: this.y});
            if (this.t > 10000) this.t = 0;
        }
        
        this.draw(context, camera);
        //this.color = this.colorGen();
        this.color = "#FFFFFF";
    }
}