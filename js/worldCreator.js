function generateDungeon (x, y) {
    for (let i = 0; i < 30; i++) if (i % 3 === 0) blocks.push(new Block(x + i * 40, y + 0, externalImages.topDungeonBlock));
    for (let i = 0; i < 30; i++) {
        if (i % 3 === 0) blocks.push(new Block(x + i * 40, y + 40, externalImages.dungeonBlock));
        else blocks.push(new Block(x + i * 40, y + 40, externalImages.topDungeonBlock));
    }
    for (let i = 0; i < 7; i++) blocks.push(new Block(x - 40, i * 40 + y, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 160, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 240, externalImages.dungeonBlock));
    blocks.push(new Block(x - 120, y + 240, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 280, externalImages.dungeonBlock));
    for (let i = 0; i < 10; i++) blocks.push(new Block(x + i * 40, y + 500, externalImages.dungeonBlock));
    for (let xx = 0; xx < 32; xx++) {
        for (let yy = 0; yy < 30; yy++) images.push(new myImage(xx * 40 + x - 40, yy * 40 + y, 40, 40, null, {image: externalImages.dungeonWall1, spriteSheet: false}, false, null));
    }
    images.push(new myImage(x + 40, y + 460, 40, 40, null, {image: externalImages.chest, spriteSheet: false}, false, null));
    
}

function initializeWorld () {
    sprite = new Sprite(0, -40, {image: externalImages.spriteImage, spriteSheet: true, frames: 4});
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    images = [];
    clouds = [];
    background = new myImage(-20, 0, canvas.width + 40, canvas.height, "absolute", {image: externalImages.backgroundImage, spriteSheet: false, frames: 0}, false, false, (t) => {t = (t/180) * Math.PI; return Math.sin(t/1) * 10});

    for (let i = 0; i < 20; i++) blocks.push(new Block(i * 40, 0, externalImages.blueDirt));
    blocks.push(new Block(120, -40, externalImages.blueDirt));
    images.push(new myImage(500, -75, 75, 75, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false, false));
    images.push(new myImage(500, -75, 75, 77, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false, false, t => {return Math.sin((t / 180 * Math.PI) * 10) * 1;}));
    images.push(new myImage(550, -210, 150, 150, null, {image: externalImages.speechBubble, spriteSheet: false, frames: 4}, false, false));
    text.push(new Text("Hey Super Meat Son :D", 620, -150, "Ariel", 10, null, null, null));
    
    gravityPoints.push(new GravityPoint(1000, -200, externalImages.redPlanet, 50, 50000000000));
    
    generateDungeon(800, -500);
    
    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    audio.music.load();
    animate();
}