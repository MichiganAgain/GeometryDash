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
var camera;
var animationID;
var gameRunning = false;


window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (event) => {
    if (event.key == " ") sprite.jump();
});

function initializeWorld () {
    sprite = new Sprite(116, 380);
    blocks = [];
    camera = new Camera(sprite);
    
    for (let i = 0; i < 50; i++) {
        blocks.push(new Block(i * 40 + 200, 500));
        blocks.push(new Block(i * 40 + 200, 200));
        if (i % 10 == 0) blocks.push(new Block(i * 40 + 200, 455));
    }
    
    animate();
}

function animate () {
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    sprite.update(physics, camera, blocks);
    for (let block of blocks) block.update(physics, camera);
    camera.update();
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        initializeWorld();
    }
}
initializeWorld();