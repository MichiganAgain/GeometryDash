var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.98, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 200};
var sprite;
var particles;
var blocks;
var gravityPoints;
var text;
var camera;
var animationID;
var gameRunning = false;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", function shoot (event) {
    let mouseX = event.clientX - camera.xOffset;
    let mouseY = event.clientY - camera.yOffset;
    let xDiff = mouseX - sprite.x;
    let yDiff = mouseY - sprite.y;
    //let power = Math.sqrt(xDiff**2 + yDiff**2);
    let power = 20;
    let theta = Math.atan2(yDiff, xDiff);
    particles.push(new Particle(sprite.x + sprite.SIZE / 2 - sprite.xVelocity, sprite.y + sprite.SIZE / 2 - sprite.yVelocity, Math.cos(theta) * power + sprite.xVelocity, Math.sin(theta) * power + sprite.yVelocity, 15, true, "#FF0000"));
});
window.addEventListener("keydown", (event) => {
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = true;
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = true;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = true;
});
window.addEventListener("keyup", (event) => {
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = false;
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = false;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = false;
});

function particleCollisions (particles) {
    for (let i = 0; i < particles.length; i++) {
        for (let x = i + 1; x < particles.length; x++) {
            let distance = Math.sqrt((particles[i].x - particles[x].x)**2 + (particles[i].y - particles[x].y)**2);
            if (distance < particles[i].radius + particles[x].radius) { // then a collision has happened
                const unitX = (particles[i].x - particles[x].x) / distance;
                const unitY = (particles[i].y - particles[x].y) / distance;
                
                particles[i].x += unitX * distance / 2;
                particles[i].y += unitY * distance / 2;
                particles[x].x -= unitX * distance / 2;
                particles[x].y -= unitY * distance / 2;
                
                const dp1 = (particles[i].xVelocity) * unitX + (particles[i].yVelocity * unitY);
                const dp2 = (particles[x].xVelocity) * unitX + (particles[x].yVelocity * unitY);
                
                particles[i].xVelocity -= unitX * dp1;
                particles[i].yVelocity -= unitY * dp1;
                particles[x].xVelocity -= unitX * dp2;
                particles[x].yVelocity -= unitY * dp2;
            }
        }
    }
}

function initializeWorld () {
    sprite = new Sprite(-19.5, 140);
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];

	for (let i = 0; i <= 0; i += 200) {
		for (let y = 120; y > -270; y -= 30) {
			//particles.push(new Particle(i, y, 0, 0, 10, false, "#00FFFF"));
		}
	}
    particles.push(new Particle(0, -50, 5, 0, 10, false, "#00FFFF"));
    for (let i = -100; i < 100; i++) {
        blocks.push(new Block(i * 40, 220));
        if (i % 5 == 0) blocks.push(new Block(i * 40, 180));
    }
    gravityPoints.push(new GravityPoint(0, -300, 50, 50000000000));

    text.push(new Text("GO THIS WAY :D ->", -300, 100, 50, null, (t) => {
        t = (t / 180) * Math.PI;
        return 50 * Math.sin(t * 5);
    }));
    
    camera = new Camera(canvas, sprite);
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let t of text) t.update(context, camera);
    particleCollisions(particles);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(context, physics, camera);
        if (particles[i].dead) particles.splice(i, 1);
    }
    sprite.update(context, physics, camera, blocks, gravityPoints);
    for (let block of blocks) block.update(context, physics, camera);
    for (let point of gravityPoints) point.update(context, camera);
    camera.update(canvas);
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
}
initializeWorld();