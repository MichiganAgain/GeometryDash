var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
    loadImages();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.98, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 200};
const maxParticles = 50;
let externalImages = {spriteImage: new Image(), spriteImageGIF: new Image(), planetImage: new Image(), blockImageGrass: new Image(), blockImageDirt: new Image(), blockImageBlueDirt: new Image(), orangeMushroom: new Image(), backgroundImage: new Image(), tree: new Image(), bushyTreeLeft: new Image(), blockImageDarkDirt: new Image(), smallBush: new Image(), cloud: new Image(), topDungeonBlock: new Image(), dungeonBlock: new Image()};
const imageCount = 15;
let imagesLoadedCount = 0;
var audio = {music: new Audio("audio/XilentftDiamondEyesAnimation.mp3")};
var mouseTrail = [];
const maxMouseTrailLength = 10;
var sprite;
var particles;
var blocks;
var gravityPoints;
var text;
var images;
var clouds;
var background;
var camera;
var focusPoint;
var animationID;
var gameRunning = false;
var startPressed = false;
var inputTimeStamp = Date.now();
var t = 0;
var countdown = Math.floor(Math.random() * 200);
var timeTorRestart = 1000000;
var mouseX = 0;
var mouseY = 0;
var clientX;
var clientY;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", (event) => {
    clientX = event.clientX;
    clientY = event.clientY;
    mouseX = event.clientX - camera.xOffset;
    mouseY = event.clientY - camera.yOffset; 
    shoot();
});
window.addEventListener("ontouchstart", (event) => {
    mouseX = event.touches[0].clientX - camera.xOffset;
    mouseY = event.touches[0].clientY - camera.yOffset;
    shoot();
});
window.addEventListener("mousemove", (event) => {
    clientX = event.clientX;
    clientY = event.clientY;
    mouseX = event.clientX - camera.xOffset;
    mouseY = event.clientY - camera.yOffset;
});
window.addEventListener("keydown", (event) => {
    startPressed = true;
    inputTimeStamp = Date.now();
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = true;
    //if (gameRunning && (event.key === "s" || event.key === "ArrowDown")) shoot();
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = true;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = true;
});
window.addEventListener("keyup", (event) => {
    inputTimeStamp = Date.now();
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = false;
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = false;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = false;
});

function loadImages () {
    audio.music.autoplay = true;
    audio.music.load();
    
    externalImages.spriteImage.src = "images/superMeatBoy.png";
    externalImages.spriteImage.onload = () => {imageLoadCheck();}
    externalImages.spriteImageGIF.src = "images/superMeatBoy.gif";
    externalImages.spriteImageGIF.onload = () => {imageLoadCheck();}
    externalImages.planetImage.src = "images/redPlanet.svg";
    externalImages.planetImage.onload = () => {imageLoadCheck();}
    externalImages.blockImageGrass.src = "images/grass.png";
    externalImages.blockImageGrass.onload = () => {imageLoadCheck();}
    externalImages.blockImageDirt.src = "images/dirt.png";
    externalImages.blockImageDirt.onload = () => {imageLoadCheck();}
    externalImages.blockImageBlueDirt.src = "images/blueDirt.png";
    externalImages.blockImageBlueDirt.onload = () => {imageLoadCheck();}
    externalImages.blockImageDarkDirt.src = "images/darkDirt.png";
    externalImages.blockImageDarkDirt.onload = () => {imageLoadCheck();}
    externalImages.topDungeonBlock.src = "images/topDungeonBlock.png";
    externalImages.topDungeonBlock.onload = () => {imageLoadCheck();}
    externalImages.dungeonBlock.src = "images/dungeonBlock.png";
    externalImages.dungeonBlock.onload = () => {imageLoadCheck();}
    externalImages.orangeMushroom.src = "images/orangeMushroom.png";
    externalImages.orangeMushroom.onload = () => {imageLoadCheck();}
    externalImages.tree.src = "images/tree.png";
    externalImages.tree.onload = () => {imageLoadCheck();}
    externalImages.smallBush.src = "images/smallBush.png";
    externalImages.smallBush.onload = () => {imageLoadCheck();}
    externalImages.bushyTreeLeft.src = "images/bushyTreeLeft.png";
    externalImages.bushyTreeLeft.onload = () => {imageLoadCheck();}
    externalImages.backgroundImage.src = "images/FlatNightBG.png";
    externalImages.backgroundImage.onload = () => {imageLoadCheck();}
    externalImages.cloud.src = "images/cloud.png";
    externalImages.cloud.onload = () => {imageLoadCheck();}
}

function imageLoadCheck () {
    imagesLoadedCount++;
    if (imagesLoadedCount == imageCount) initializeWorld();
}

function shoot () {
    let xDiff = mouseX - (sprite.x + sprite.SIZE / 2);
    let yDiff = mouseY - (sprite.y + sprite.SIZE / 2);
    //let power = Math.sqrt(xDiff**2 + yDiff**2);
    let power = 30;
    let theta = Math.atan2(yDiff, xDiff);
    particles.push(new Particle(sprite.x + sprite.SIZE / 2, sprite.y + sprite.SIZE / 5, Math.cos(theta) * power + sprite.xVelocity, Math.sin(theta) * power + sprite.yVelocity, 8, true, "#FFFFFF"));
}

// this is a really dumb function that I had to add to fix balls going through blocks  Now it messes everything up but I'm keeping it :D
function particleBlockCollision (particle, x, y, negate) { // even tho there are now two freaking particle block collision functions
    for (let block of blocks) {
        if (particle.x + particle.radius >= block.x && particle.x - particle.radius <= block.x + block.SIZE) {
                if (particle.y + particle.radius <= block.y && particle.y + particle.radius + ((negate == false) ? y: -y) >= block.y) {  // top collision
                    particle.yVelocity *= -0.5;
                    particle.y = block.y - particle.radius - particle.GUARD;
                    return true;
                }
                if (particle.y - particle.radius >= block.y + block.SIZE && particle.y - particle.radius + ((negate == false) ? y: -y) <= block.y + block.SIZE) {    // bottom collision
                    particle.yVelocity *= -0.5;
                    particle.y = block.y + block.SIZE + particle.radius + particle.GUARD;
                    return true;
                }
            }
            if (particle.y + particle.radius >= block.y && particle.y - particle.radius <= block.y + block.SIZE) {
                if (particle.x + particle.radius <= block.x && particle.x + particle.radius + ((negate == false) ? x: -x) >= block.x) {   // left collision
                    particle.xVelocity *= -0.5;
                    particle.x = block.x - particle.radius - particle.GUARD;
                    return true;
                }
                if (particle.x - particle.radius >= block.x + block.SIZE && particle.x - particle.radius + ((negate == false) ? x: -x) <= block.x + block.SIZE) {   // right collision
                    particle.xVelocity *= -0.5;
                    particle.x = block.x + block.SIZE + particle.radius + particle.GUARD;
                    return true;
                }
            }
    }
    return false;
}

function particleCollisions (particles) {
    for (let i = 0; i < particles.length; i++) {
        for (let x = i + 1; x < particles.length; x++) {
            let distance = Math.sqrt((particles[i].x - particles[x].x)**2 + (particles[i].y - particles[x].y)**2);
            if (distance < particles[i].radius + particles[x].radius) { // then a collision has happened
                const unitX = (particles[i].x - particles[x].x) / distance;
                const unitY = (particles[i].y - particles[x].y) / distance;
                
                const b1XDistance = unitX * distance / 2;
                const b1YDistance = unitX * distance / 2;
                const b2XDistance = unitX * distance / 2;
                const b2YDistance = unitX * distance / 2;
                
                if (!particleBlockCollision(particles[i], b1XDistance, b1YDistance, false)) {
                    particles[i].x += b1XDistance;
                    particles[i].y += b1YDistance;
                }
                if (!particleBlockCollision(particles[x], b2XDistance, b2YDistance, true)) {
                    particles[x].x -= b2XDistance;
                    particles[x].y -= b2YDistance;
                }
                
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
    sprite = new Sprite(-1500, -140, externalImages.spriteImage);
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    images = [];
    clouds = [];
    
    background = new myImage(-20, 0, canvas.width + 40, canvas.height, "absolute", externalImages.backgroundImage, false, (t) => {t = (t/180) * Math.PI; return Math.sin(t/1) * 10});
    images.push(new myImage(-1500, -100, 100, 100, null, externalImages.spriteImage, false));
    clouds.push(new myImage(-2000, -500, 200, 100, null, externalImages.cloud, true));
    //clouds.push(new myImage(-1500, -500, 200, 100, null, externalImages.cloud, true));
    images.push(new myImage(-1400, -30, 32, 32, null, externalImages.orangeMushroom, false));
    images.push(new myImage(-1532, -30, 32, 32, null, externalImages.orangeMushroom, false));
    images.push(new myImage(-1000, -30, 32, 32, null, externalImages.orangeMushroom, false));
    images.push(new myImage(-900, -30, 32, 32, null, externalImages.orangeMushroom, false));
    images.push(new myImage(-1350, -200, 200, 200, null, externalImages.bushyTreeLeft, false));
    images.push(new myImage(-1650, -200, 100, 200, null, externalImages.tree, false));
    images.push(new myImage(-1000, -200, 100, 200, null, externalImages.tree, false));
    images.push(new myImage(-800, -200, 100, 200, null, externalImages.tree, false));
    images.push(new myImage(-650, -228, 27*2, 14*2, null, externalImages.smallBush, false));
    images.push(new myImage(-400, -228, 27*2, 14*2, null, externalImages.smallBush, false));
    images.push(new myImage(-100, -228, 27*2, 14*2, null, externalImages.smallBush, false));
    
    gravityPoints.push(new GravityPoint(-1000, -300, externalImages.planetImage, 70, 100000000000));
    gravityPoints.push(new GravityPoint(700, -400, externalImages.planetImage, 70, 100000000000));
    gravityPoints.push(new GravityPoint(1575, -420, externalImages.planetImage, 70, 100000000000));
    gravityPoints[0].teleportTo = gravityPoints[1];
    particles.push(new Particle(-1050, -450, 7, 0, 10, false, "#00FFFF"));
    
    gravityPoints[0].text.push(new Text("Jump in to ESCAPE", gravityPoints[0].x, gravityPoints[0].y - gravityPoints[0].radius, "Erica One", 30, null, null, (t) => {
        t = (t / 180) * Math.PI;
        return 10 * Math.sin(t * 3);
    }, {x: false, y: true}));
    
    for (let i = -10; i < 100; i++) {
        blocks.push(new Block(i * 40, 0, "#111111", externalImages.blockImageBlueDirt));
        //if (i % 20 == 0) blocks.push(new Block(i * 40, -40, "#111111", externalImages.blockImageGrass));
    }
    for (let i = 0; i < 40; i++) blocks.push(new Block(i * 40 - 2000, 0, "#111111", externalImages.blockImageBlueDirt));
    for (let i = 0; i < 10; i++) blocks.push(new Block(i * 40 - 700, -200, "#111111", externalImages.blockImageGrass));
    for (let i = 0; i < 10; i++) blocks.push(new Block(i * 40 - 200, -200, "#111111", externalImages.blockImageGrass));
    for (let i = 0; i < 15; i++) blocks.push(new Block(-2000, i * -40, "#111111", externalImages.dungeonBlock));
    blocks.push(new Block(-2000, -40 * 15, "#111111", externalImages.topDungeonBlock));

    this.focusPoint = new FocusPoint({x: -3000, y: gravityPoints[0].y}, {x: sprite.x, y: sprite.y + 100}, 1000);
    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    audio.music.load();
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (t++ >= countdown) {
        t = 0;
        countdown = Math.floor(Math.random() * 500);
        particles.push(new Particle(sprite.x + (Math.random() * canvas.width) - canvas.width / 2, sprite.y - canvas.height, Math.random() * 14 - 7, Math.random() * 15 + 10, 5, false, "#FFFFFF"));
    }

    background.width = canvas.width + 40;
    background.height = canvas.height;
    background.update(context, camera);
    for (let i = 0; i < images.length; i++) {
        images[i].update(context, camera);
        if (images[i].dead) images.splice(i, 1);
    }
    sprite.update(context, physics, camera, blocks, gravityPoints);
    particleCollisions(particles);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(context, physics, camera);
        if (particles[i].dead) particles.splice(i, 1);
    }
    if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    for (let t of text) t.update(context, camera);
    for (let point of gravityPoints) point.update(context, camera);
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].update(context, gravityPoints, physics, camera);
        if (blocks[i].dead) blocks.splice(i, 1);
    }
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].update(context, camera);
        if (clouds[i].dead) clouds.splice(i, 1);
    }
    focusPoint.p2.x = sprite.x;
    focusPoint.p2.y = sprite.y;
    focusPoint.update();
    camera.update(canvas);
    
    if (focusPoint.traveling === false) camera.trackedObject = sprite;
    
    if (sprite.dead) {
        gameRunning = false;
        cancelAnimationFrame(animationID);
        initializeWorld();
    }
    
    if (Date.now() - inputTimeStamp > timeTorRestart && startPressed) {
        gameRunning = false;
        cancelAnimationFrame(animationID);
        initializeWorld();
    }
    
    mouseTrail.push({x: clientX, y: clientY});
    if (mouseTrail.length > maxMouseTrailLength) mouseTrail.splice(0, 1);
    for (let i = 0; i < mouseTrail.length; i++) {
        context.beginPath();
        let contrast = (i / maxMouseTrailLength) * 255;
        context.fillStyle = "#" + contrast.toString(16) + contrast.toString(16) + contrast.toString(16);
        context.arc(mouseTrail[i].x, mouseTrail[i].y, (i / maxMouseTrailLength) * 10, 0, Math.PI * 2, false);
        context.fill();
    }
}