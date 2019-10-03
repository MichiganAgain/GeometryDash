var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.0, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 100};
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

function initializeWorld () {
    sprite = new Sprite(0, -100);
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    
    for (let i = 0; i < 10; i++) particles.push(new Particle(-300, i * -30 + 60, 5, 0, 10));
    
    for (let i = 0; i < 1000; i++) {
        blocks.push(new Block(i * 40, 100));
        if (i % 20 == 0) {
            //blocks.push(new Block(i * 40, 60));
            //blocks.push(new Block(i * 40, 20));
            //blocks.push(new Block(i * 40, -100));
        }
    }
    gravityPoints.push(new GravityPoint(0, -300, 50, 90000000000));
    gravityPoints.push(new GravityPoint(0, 300, 50, 90000000000));
    
    text.push(new Text("Black Hole", -120, -400, 50, null));
    text.push(new Text("Black Hole", -120, 200, 50, null));
    
    camera = new Camera(canvas, gravityPoints[0]);
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let t of text) t.update(context, camera);
    sprite.update(context, physics, camera, blocks, gravityPoints);
    for (let particle of particles) particle.update(context, physics, camera);
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