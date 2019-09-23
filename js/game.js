var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.0, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 100};
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
    sprite = new Sprite(0, -400);
    blocks = [];
    gravityPoints = [];
    text = [];
    gravityPoints.push(new GravityPoint(0, 100, 70, 500000000000));
    blocks.push(new Block(100, 100));
    blocks.push(new Block(200, 100));
    blocks.push(new Block(300, 100));
    blocks.push(new Block(400, 100));
    blocks.push(new Block(500, 100));
    
    //text.push(new Text("Black HOLE ----->", 150, 235, 100, null));
    //text.push(new Text("<----- Black HOLE", 1055, 235, 100, null));
    camera = new Camera(gravityPoints[0]);
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