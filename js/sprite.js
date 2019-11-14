function Sprite (x, y, imageData) {
    this.x = x;
    this.y = y;
    this.imageData = imageData;
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
    this.currentFrame = 0;
    this.t = 0;
    
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
            this.yVelocity -= this.jumpForce / 20;
            this.canJumpLeft = false;
        }
        if (this.canJumpRight) {
            //this.xVelocity = this.jumpForce / 2;
            this.yVelocity -= this.jumpForce / 20;
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

            if (distanceFromPoint <= canvas.width / 2 + point.radius) {
                let force = (physics.gravitationalConstant * this.mass * point.mass) / (distanceFromPoint);
                let theta = Math.atan2(yDiff, xDiff);
                this.xVelocity += force * Math.cos(theta);
                this.yVelocity += force * Math.sin(theta);
            }

            if (distanceFromPoint < point.radius) {
                if (point.teleportTo == null) this.dead = true;
                else {
                    this.x = point.teleportTo.x;
                    this.y = point.teleportTo.y + point.teleportTo.radius + this.SIZE * 1;
                    this.yVelocity = 1;
                }
            }
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
        let imageWidth = 980 / this.imageData.frames;
        if (this.imageData.spriteSheet === false) context.drawImage(this.imageData.image, 0, 0, this.imageData.image.width, this.imageData.image.height, this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        else context.drawImage(this.imageData.image, this.currentFrame * imageWidth, 0, imageWidth, this.imageData.image.height, this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
    }
    
    this.update = function (context, physics, camera, blocks, gravityPoints) {
        if (this.jumping) this.jump();
        this.feelGravityEffects(physics, gravityPoints);
        this.adjustToMaximumVelocity(physics);
        
        if (this.imageData.spriteSheet && this.canJumpUp && (this.movingLeft || this.movingRight || Math.abs(this.xVelocity) > 0.75)) {
            this.t++;
            if (this.t % 6 === 0 && this.canJumpUp) this.currentFrame++;
            if (this.currentFrame >= this.imageData.frames) this.currentFrame = 0;
        }
        if (this.movingLeft) this.xVelocity = -this.movingVelocity;
        if (this.movingRight) this.xVelocity = this.movingVelocity;
        
        this.checkBlockCollisions(blocks);
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        camera.update(canvas);
        
        this.draw(context, camera);
        
        //if (this.t % 6 === 0) this.currentFrame++;
        if (this.currentFrame >= this.imageData.frames - 0) this.currentFrame = 0;
        if (this.t > 100) this.t = 0;
    }
}