var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;   // reflects value of CSS for square resolution
}


var physics = {gravity: 0.98};
var sprite;
var blocks;
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
    sprite = new Sprite(100, 380);
    blocks = [];
    text = [];
    camera = new Camera(sprite);
    
    for (let i = 0; i < 500; i++) {
        blocks.push(new Block(i * 40 + 200, 500));
        blocks.push(new Block(i * 40 + 200, 200));
    }
    
    text.push(new Text("HOW FAR CAN YOU GET XD", 1500, 200, 100, null));
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    sprite.update(physics, camera, blocks);
    for (let block of blocks) block.update(physics, camera);
    for (let t of text) t.update(camera);
    camera.update();
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
}
initializeWorld();