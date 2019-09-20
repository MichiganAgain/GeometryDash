function Sprite (x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.movingVelocity = 8;
    this.jumpForce = 15;
    this.SIZE = 39;
    this.GUARD = 0.0001;
    this.canJump = false;
    this.jumping = false;
    this.dead = false;
    
    this.jump = function () {
        if (this.canJump) {
            this.yVelocity = -this.jumpForce;
            this.canJump = false;
        }
    }
    
    this.checkBlockCollisions = function (blocks) {
        this.canJump = false;
        for (let block of blocks) { // can get away with this as if there is a side collision sprite dies anyway lol
            if ((this.x + this.SIZE >= block.x || this.x + this.SIZE + this.xVelocity >= block.x) && ((this.x <= block.x + block.SIZE) || this.x + this.xVelocity <= block.x + block.SIZE)) {
                if (this.y + this.SIZE <= block.y && this.y + this.SIZE + this.yVelocity >= block.y) {  // top collision
                    this.yVelocity = 0;
                    this.y = block.y - this.SIZE - this.GUARD;
                    this.canJump = true;
                }
                if (this.y >= block.y + block.SIZE && this.y + this.yVelocity <= block.y + block.SIZE) {   // bottom collision
                    this.yVelocity = 0;
                    this.y = block.y + block.SIZE;
                    this.dead = true;
                }
            }
            if (this.y + this.SIZE >= block.y && this.y <= block.y + block.SIZE) {
                if (this.x + this.SIZE <= block.x && this.x + this.SIZE + this.xVelocity >= block.x) {  // left collision
                    this.xVelocity = 0;
                    this.x = block.x - this.SIZE;
                    this.dead = true;
                }
                if (this.x >= block.x + block.SIZE && this.x + this.xVelocity <= block.x + block.SIZE) {    // right collision
                    this.xVelocity = 0;
                    this.x = block.x + block.SIZE;
                    this.dead = true;
                }
            }
        }
    }
    
    this.draw = function (camera) {
        context.fillStyle = "#555555";
        context.fillRect(this.x + camera.xOffset, this.y + camera.yOffset, this.SIZE, this.SIZE);
        context.stroke();
    }
    
    this.update = function (physics, camera, blocks) {
        this.yVelocity += physics.gravity;
        if (this.jumping && this.canJump) this.jump();
        
        this.checkBlockCollisions(blocks);
        
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        
        this.xVelocity = this.movingVelocity;
        this.draw(camera);
    }
}