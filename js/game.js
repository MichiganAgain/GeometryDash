var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

function pageLoad () {
    resizeCanvas();
}

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;   // reflects value of CSS for square resolution
}


const physics = {gravity: 0.98, gravitationalConstant: 6.67408*(10**-11), maxVelocity: 200};
const maxParticles = 50;
var sprite;
var particles;
var blocks;
var gravityPoints;
var text;
var camera;
var animationID;
var gameRunning = false;
var startPressed = false;
var inputTimeStamp = Date.now();
var timeTorRestart = 1000000;
var mouseX = 0;
var mouseY = 0;

function shoot () {
    let xDiff = mouseX - sprite.x;
    let yDiff = mouseY - sprite.y;
    //let power = Math.sqrt(xDiff**2 + yDiff**2);
    let power = 30;
    let theta = Math.atan2(yDiff, xDiff);
    particles.push(new Particle(sprite.x + sprite.SIZE / 2, sprite.y + sprite.SIZE / 5, Math.cos(theta) * power + sprite.xVelocity, Math.sin(theta) * power + sprite.yVelocity, 10, true, "#FFFFFF"));
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", (event) => {
    mouseX = event.clientX - camera.xOffset;
    mouseY = event.clientY - camera.yOffset; 
    shoot();
});
window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX - camera.xOffset;
    mouseY = event.clientY - camera.yOffset;
});
window.addEventListener("keydown", (event) => {
    startPressed = true;
    inputTimeStamp = Date.now();
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = true;
    if (gameRunning && (event.key === "s" || event.key === "ArrowDown")) shoot();
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = true;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = true;
});
window.addEventListener("keyup", (event) => {
    inputTimeStamp = Date.now();
    if (gameRunning && (event.key === " " || event.key === "w" || event.key === "ArrowUp")) sprite.jumping = false;
    if (gameRunning && (event.key === "a" || event.key === "ArrowLeft")) sprite.movingLeft = false;
    if (gameRunning && (event.key === "d" || event.key === "ArrowRight")) sprite.movingRight = false;
});

function particleBlockCollision (particle, x, y, negate) {
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
    sprite = new Sprite(-1500, -140);
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    
    gravityPoints.push(new GravityPoint(-1000, -300, 70, 100000000000));
    gravityPoints.push(new GravityPoint(700, -400, 70, 100000000000));
    gravityPoints.push(new GravityPoint(1575, -420, 70, 100000000000));
    gravityPoints[0].teleportTo = gravityPoints[1];
    particles.push(new Particle(-1000, -490, 17, 0, 10, false, "#00FFFF"));
    
    gravityPoints[0].text.push(new Text("V Jump in to ESCAPE V", gravityPoints[0].x, gravityPoints[0].y - gravityPoints[0].radius, "Bungee Shade", 50, null, null, (t) => {
        t = (t / 180) * Math.PI;
        return 10 * Math.sin(t * 3);
    }, {x: false, y: true}));
    gravityPoints[1].text.push(new Text("Shoot black holes for fun :P", gravityPoints[1].x, gravityPoints[1].y - gravityPoints[1].radius, "Bungee Shade", 50, null, null, (t) => {
        t = (t / 180) * Math.PI;
        return 10 * Math.sin(t * 3);
    }, {x: false, y: true}));
    
    text.push(new Text("GO THIS WAY :D ->", 2500, -400, "Bungee Shade", 50, null, (t) => {
        return Math.sin(t / 10) * Math.random() * 1000;
    }, (t) => {
        t = (t / 180) * Math.PI;
        return 50 * Math.sin(t * 5);
    }, {x: true, y: false}));
    text.push(new Text("Vote for me hehe :P <3", 4000, -400, "Bungee Shade", 50, null, (t) => {
        return Math.sin(t / 10) * Math.random() * 1000;
    }, (t) => {
        t = (t / 180) * Math.PI;
        return 50 * Math.sin(t * 5);
    }, {x: true, y: true}));
    
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            blocks.push(new Block(x * 40 + 1000, y * 40 - 300, "#111111"));
            blocks.push(new Block(x * 40 + 1750, y * 40 - 300, "#111111"));
            blocks.push(new Block(x * 40 + 1000, y * 40 - 1000, "#111111"));
            blocks.push(new Block(x * 40 + 1750, y * 40 - 1000, "#111111"));
        }
    }
    
    for (let i = 0; i < 100; i++) {
        blocks.push(new Block(i * 40 + 4000, -300, "#111111"));
        blocks.push(new Block(i * 40 + 4000, -500, "#111111"));
    }
    for (let i = 0; i < 5; i++) {
        
    }
    
    for (let i = 0; i < 10; i++) blocks.push(new Block(i * 40 + 1360, 20, "#111111"));

    for (let i = -100; i < 500; i++) {
        blocks.push(new Block(i * 40, 220, "#111111"));
        if (i % 20 == 0) blocks.push(new Block(i * 40, 180, "#111111"));
    }
    for (let i = 0; i < 40; i++) {
        blocks.push(new Block(i * 40 - 2000, 0, "#111111"));
        blocks.push(new Block(i * 40 - 2000, -1000, "#111111"));
    }
    for (let i = 0; i < 26; i++) {
        blocks.push(new Block(-2000, i * 40 - 1000, "#111111"));
        blocks.push(new Block(-400, i * 40 - 1000, "#111111"));
    }

    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    animate();
}

function animate () {
    gameRunning = true;
    animationID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    camera.update(canvas);
    particleCollisions(particles);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(context, physics, camera);
        if (particles[i].dead) particles.splice(i, 1);
    }
    if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    sprite.update(context, physics, camera, blocks, gravityPoints);
    for (let t of text) t.update(context, camera);
    for (let point of gravityPoints) point.update(context, camera);
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].update(context, gravityPoints, physics, camera);
        if (blocks[i].dead) blocks.splice(i, 1);
    }
    
    if (sprite.dead) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
    
    if (Date.now() - inputTimeStamp > timeTorRestart && startPressed) {
        cancelAnimationFrame(animationID);
        gameRunning = false;
        initializeWorld();
    }
}
initializeWorld();