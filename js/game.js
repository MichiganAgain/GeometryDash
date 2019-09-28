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
    sprite = new Sprite(0, -200);
    blocks = [];
    gravityPoints = [];
    text = [];
    for (let i = 0; i < 1000; i++) {
        blocks.push(new Block(i * 40, 100));
        if (i % 20 == 0) {
            blocks.push(new Block(i * 40, 60));
            blocks.push(new Block(i * 40, 20));
            blocks.push(new Block(i * 40, -100));
        }
    }
    gravityPoints.push(new GravityPoint(0, -300, 50, 10000000000));
    gravityPoints.push(new GravityPoint(1000, -300, 50, 100000000000));
    
    camera = new Camera(sprite);
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    sprite.update(context, physics, camera, blocks, gravityPoints);
    for (let block of blocks) block.update(context, physics, camera);
    for (let point of gravityPoints) point.update(context, camera);
    for (let t of text) t.update(context, camera);
    camera.update();
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
}
initializeWorld();