function initializeWorld () {
    sprite = new Sprite(-1500, -140, {image: externalImages.spriteImage, spriteSheet: true, frames: 4});
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    images = [];
    clouds = [];
    
    background = new myImage(-20, 0, canvas.width + 40, canvas.height, "absolute", {image: externalImages.backgroundImage, spriteSheet: false, frames: 0}, false, (t) => {t = (t/180) * Math.PI; return Math.sin(t/1) * 10});
    images.push(new myImage(-1500, -100, 100, 100, null, {image: externalImages.spriteImage, spriteSheet: true, frames: 4}, false));
    clouds.push(new myImage(-2000, -500, 200, 100, null, {image: externalImages.cloud, spriteSheet: false, frames: 0}, true));
    //clouds.push(new myImage(-1500, -500, 200, 100, null, externalImages.cloud, true));
    images.push(new myImage(-1400, -30, 32, 32, null, {image: externalImages.orangeMushroom, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-1532, -30, 32, 32, null, {image: externalImages.orangeMushroom, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-1000, -30, 32, 32, null, {image: externalImages.orangeMushroom, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-900, -30, 32, 32, null, {image: externalImages.orangeMushroom, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-1350, -200, 200, 200, null, {image: externalImages.bushyTreeLeft, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-1650, -200, 100, 200, null, {image: externalImages.tree, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-1000, -200, 100, 200, null, {image: externalImages.tree, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-800, -200, 100, 200, null, {image: externalImages.tree, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-650, -228, 27*2, 14*2, null, {image: externalImages.smallBush, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-400, -228, 27*2, 14*2, null, {image: externalImages.smallBush, spriteSheet: false, frames: 0}, false));
    images.push(new myImage(-100, -228, 27*2, 14*2, null, {image: externalImages.smallBush, spriteSheet: false, frames: 0}, false));
    
    gravityPoints.push(new GravityPoint(-1000, -300, externalImages.planetImage, 70, 100000000000));
    gravityPoints.push(new GravityPoint(700, -400, externalImages.planetImage, 70, 100000000000));
    gravityPoints.push(new GravityPoint(1575, -420, externalImages.planetImage, 70, 100000000000));
    gravityPoints[0].teleportTo = gravityPoints[1];
    particles.push(new Particle(-1050, -450, 7, 0, 10, false, "#00FFFF"));
    
//    gravityPoints[0].text.push(new Text("Jump in to ESCAPE", gravityPoints[0].x, gravityPoints[0].y - gravityPoints[0].radius, "Erica One", 30, null, null, (t) => {
//        t = (t / 180) * Math.PI;
//        return 10 * Math.sin(t * 3);
//    }, {x: false, y: true}));
    
    for (let i = -10; i < 100; i++) {
        blocks.push(new Block(i * 40, 0, "#111111", externalImages.blockImageBlueDirt));
        //if (i % 20 == 0) blocks.push(new Block(i * 40, -40, "#111111", externalImages.blockImageGrass));
    }
    for (let i = 0; i < 40; i++) blocks.push(new Block(i * 40 - 2000, 0, "#111111", externalImages.blockImageBlueDirt));
    for (let i = 0; i < 10; i++) blocks.push(new Block(i * 40 - 700, -200, "#111111", externalImages.blockImageGrass));
    for (let i = 0; i < 10; i++) blocks.push(new Block(i * 40 - 200, -200, "#111111", externalImages.blockImageGrass));

    this.focusPoint = new FocusPoint({x: -3000, y: gravityPoints[0].y}, {x: sprite.x, y: sprite.y + 100}, 1000);
    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    audio.music.load();
    animate();
}