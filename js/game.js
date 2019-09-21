var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0, gravitationalConstant: 6.67408*(10**-1), maxVelocity: 50};
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
    gravityPoints = [new GravityPoint(700, 200, 30, 70000), new GravityPoint(1000, 200, 30, 70000), new GravityPoint(850, 0, 30, 70000), new GravityPoint(850, 400, 30, 70000), new GravityPoint(1000, 100, 30, 70000)];
    text = [];
    camera = new Camera(sprite);
    
    for (let i = 0; i < 500; i++) blocks.push(new Block(i * 40 + 200, 500));
    
    text.push(new Text("I am so bored right now I just want to have", 1500, 200, 100, null));
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