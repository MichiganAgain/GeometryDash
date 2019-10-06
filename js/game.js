var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.98, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 100};
var sprite;
var particles;
var blocks;
var gravityPoints;
var text;
var camera;
var animationID;
var gameRunning = false;


window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (event) => {
    if (gameRunning && event.key == " ") sprite.jumping = true;
});
window.addEventListener("keyup", (event) => {
    if (gameRunning && event.key == " ") sprite.jumping = false;
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
    sprite = new Sprite(-840, 60);
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    
    for (let i = 0; i < 9; i++) particles.push(new Particle(-1000, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(-800, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(-600, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(0, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(1000, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(800, i * -30 + 120, 0, 0, 10));
    for (let i = 0; i < 9; i++) particles.push(new Particle(600, i * -30 + 120, 0, 0, 10));
    
    for (let i = -40; i < 40; i++) {
        blocks.push(new Block(i * 40, 100));
    }
    gravityPoints.push(new GravityPoint(0, -300, 50, 90000000000));
    //gravityPoints.push(new GravityPoint(0, 300, 50, 90000000000));
    //gravityPoints.push(new GravityPoint(500, 300, 50, 90000000000));
    
    camera = new Camera(canvas, sprite);
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let t of text) t.update(context, camera);
    sprite.update(context, physics, camera, blocks, gravityPoints);
    particleCollisions(particles);
    for (let particle of particles) particle.update(context, physics, camera);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(context, physics, camera);
        if (particles[i].dead) particles.splice(i, 1);
    }
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