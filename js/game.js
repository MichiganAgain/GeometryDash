var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;   // reflects value of CSS for square resolution
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
    sprite = new Sprite(200, 460);
    blocks = [];
    gravityPoints = [];
    text = [];
    camera = new Camera(sprite);
    
    for (let i = 0; i < 100; i++) {
        gravityPoints.push(new GravityPoint(i * 1000 + 1000, 200, 30, 500000000000));
    }
    for (let i = 0; i < 500; i++) {
        blocks.push(new Block(i * 40 + 200, 500));
    }
    
    text.push(new Text("Black HOLE ----->", 150, 235, 100, null));
    text.push(new Text("<----- Black HOLE", 1055, 235, 100, null));
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    sprite.update(physics, camera, blocks, gravityPoints);
    for (let block of blocks) block.update(physics, camera);
    for (let point of gravityPoints) point.update(camera);
    for (let t of text) t.update(camera);
    camera.update();
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
}
initializeWorld();