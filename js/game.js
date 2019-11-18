var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
    loadImages();
    document.getElementById("loading-ring").style.display = "none";
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}

let externalImages = {spriteImage: new Image(), superMeatBoy: new Image(), redPlanet: new Image(), grass: new Image(), dirt: new Image(), blueDirt: new Image(), orangeMushroom: new Image(), backgroundImage: new Image(), tree: new Image(), bushyTreeLeft: new Image(), darkDirt: new Image(), smallBush: new Image(), cloud: new Image(), topDungeonBlock: new Image(), dungeonBlock: new Image(), speechBubble: new Image(), dungeonWall1: new Image(), chest: new Image()};
const imageCount = 18;
let imagesLoadedCount = 0;
var audio = {music: new Audio("audio/XilentftDiamondEyesAnimation.mp3")};

const physics = {gravity: 0.98, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 200};
const maxParticles = 50;
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
    
    externalImages.spriteImage.src = "images/superMeatBoySpriteSheet.png";
    externalImages.spriteImage.onload = () => {imageLoadCheck();}
    externalImages.superMeatBoy.src = "images/superMeatBoy.png";
    externalImages.superMeatBoy.onload = () => {imageLoadCheck();}
    externalImages.redPlanet.src = "images/redPlanet.svg";
    externalImages.redPlanet.onload = () => {imageLoadCheck();}
    externalImages.grass.src = "images/grass.png";
    externalImages.grass.onload = () => {imageLoadCheck();}
    externalImages.dirt.src = "images/dirt.png";
    externalImages.dirt.onload = () => {imageLoadCheck();}
    externalImages.blueDirt.src = "images/blueDirt.png";
    externalImages.blueDirt.onload = () => {imageLoadCheck();}
    externalImages.darkDirt.src = "images/darkDirt.png";
    externalImages.darkDirt.onload = () => {imageLoadCheck();}
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
    externalImages.speechBubble.src = "images/speechBubble.png";
    externalImages.speechBubble.onload = () => {imageLoadCheck();}
    externalImages.dungeonWall1.src = "images/dungeonWall1.png";
    externalImages.dungeonWall1.onload = () => {imageLoadCheck();}
    externalImages.chest.src = "images/chest.png";
    externalImages.chest.onload = () => {imageLoadCheck();}
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