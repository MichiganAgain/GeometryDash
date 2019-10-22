function Sprite (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.movingVelocity = 7;
    this.mass = 10;
    this.jumpForce = 15;
    this.SIZE = 39;
    this.GUARD = 0.0001;
    this.canJumpUp = false;
    this.canJumpDown = false;
    this.canJumpLeft = false;
    this.canJumpRight = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.jumping = false;
    this.dead = false;
    
    this.jump = function () {
        if (this.canJumpUp) {
            this.yVelocity = -this.jumpForce;
            this.canJumpUp = false;
        }
        if (this.canJumpDown) {
            this.yVelocity = this.jumpForce;
            this.canJumpDown = false;
        }
        if (this.canJumpLeft) {
                //this.xVelocity = -this.jumpForce / 2;
                this.canJumpLeft = false;
        }
        if (this.canJumpRight) {
                //this.xVelocity = this.jumpForce / 2;
                this.canJumpRight = false;
        }
    }
    
    this.checkBlockCollisions = function (blocks) {
        this.canJumpUp = false;
        this.canJumpDown = false;
        this.canJumpLeft = false;
        this.canJumpRight = false;
        for (let block of blocks) { // can get away with this as if there is a side collision sprite dies anyway lol
            if (this.x + this.SIZE >= block.x && this.x <= block.x + block.SIZE) {
                if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {  // top collision
                    this.yVelocity = 0;
                    if (!(this.movingLeft || this.movingRight)) this.xVelocity /= block.friction;
                    this.y = block.y - this.SIZE - this.GUARD;
                    this.canJumpUp = true;
                }
                if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {   // bottom collision
                    this.yVelocity = 0;
                    if (!(this.movingLeft || this.movingRight)) this.xVelocity /= block.friction;
                    this.y = block.y + block.SIZE + this.GUARD;
                    this.canJumpDown = true;
                    this.dead = false;
                }
            }
            if (this.y + this.SIZE >= block.y && this.y <= block.y + block.SIZE) {
                if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {  // left collision
                    this.xVelocity = 0;
                    if (!(this.movingLeft || this.movingRight)) this.yVelocity /= block.friction;
                    this.x = block.x - this.SIZE - this.GUARD;
                    this.canJumpLeft = true;
                    this.dead = false;
                }
                if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {    // right collision
                    this.xVelocity = 0;
                    if (!(this.movingLeft || this.movingRight)) this.yVelocity /= block.friction;
                    this.x = block.x + block.SIZE + this.GUARD;
                    this.canJumpRight = true;
                    this.dead = false;
                }
            }
        }
    }
    
    this.feelGravityEffects = function (physics, gravityPoints) {
        this.yVelocity += physics.gravity;
        
        for (let point of gravityPoints) {
            let xDiff = point.x - (this.x + (this.SIZE / 2));
            let yDiff = point.y - (this.y + (this.SIZE / 2));
            let distanceFromPoint = Math.sqrt((xDiff)**2 + (yDiff)**2);

            if (distanceFromPoint <= 3000) {
                let force = (physics.gravitationalConstant * this.mass * point.mass) / (distanceFromPoint);
                let theta = Math.atan2(yDiff, xDiff);
                this.xVelocity += force * Math.cos(theta);
                this.yVelocity += force * Math.sin(theta);
            }

            if (distanceFromPoint < point.radius) this.dead = true;
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
        context.fillStyle = "#555555";
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (context, physics, camera, blocks, gravityPoints) {
        //if (this.canJump) this.xVelocity = this.movingVelocity;
        if (this.jumping) this.jump();
        this.feelGravityEffects(physics, gravityPoints);
        this.adjustToMaximumVelocity(physics);
        if (this.movingLeft) this.xVelocity = -this.movingVelocity;
        if (this.movingRight) this.xVelocity = this.movingVelocity;
        
        this.checkBlockCollisions(blocks);
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        camera.update(canvas);
        //this.x = -19.5;
        //this.y = -19.5 + 200;
        this.draw(context, camera);
    }
}