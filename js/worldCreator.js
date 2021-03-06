function generateDungeon (x, y) {
    for (let i = 0; i < 50; i++) if (i % 3 === 0) blocks.push(new Block(x + i * 40, y + 0, externalImages.topDungeonBlock));
    for (let i = 0; i < 50; i++) {
        if (i % 3 === 0) blocks.push(new Block(x + i * 40, y + 40, externalImages.dungeonBlock));
        else blocks.push(new Block(x + i * 40, y + 40, externalImages.topDungeonBlock));
    }
    for (let i = 0; i < 7; i++) blocks.push(new Block(x - 40, i * 40 + y, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 160, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 240, externalImages.dungeonBlock));
    blocks.push(new Block(x - 120, y + 240, externalImages.dungeonBlock));
    blocks.push(new Block(x - 80, y + 280, externalImages.dungeonBlock));
    for (let i = 0; i < 10; i++) blocks.push(new Block(x + i * 40, y + 500, externalImages.dungeonBlock));
    for (let xx = 0; xx < 52; xx++) {
        for (let yy = 0; yy < 50; yy++) images.push(new myImage(xx * 40 + x - 40, yy * 40 + y, 40, 40, null, {image: externalImages.dungeonWall1, spriteSheet: false}, null));
    }
    images.push(new myImage(x + 40, y + 460, 40, 40, null, {image: externalImages.chest, spriteSheet: false}, null));
    
}

function initializeWorld () {
    sprite = new Sprite(0, -40, {image: externalImages.spriteImage, spriteSheet: true, frames: 4});
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    images = [];
    clouds = [];
    background = new myImage(-20, 0, canvas.width + 40, canvas.height, "absolute", {image: externalImages.backgroundImage, spriteSheet: false, frames: 0}, false, (t) => {t = (t/180) * Math.PI; return Math.sin(t/1) * 10});
    
    for (let i = 0; i < 20; i++) blocks.push(new Block(i * 40, 0, externalImages.blueDirt));
    blocks.push(new Block(200, -120, externalImages.grass));
    blocks.push(new Block(200, -80, externalImages.grass));
    blocks.push(new Block(200, -40, externalImages.grass));
	blocks.push(new Block(0, -120, externalImages.grass));
    blocks.push(new Block(0, -80, externalImages.grass));
    blocks.push(new Block(0, -40, externalImages.grass));
    images.push(new myImage(500, -75, 75, 75, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false));
    images.push(new myImage(500, -75, 75, 77, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false, t => {return Math.sin((t / 180 * Math.PI) * 10) * 1;}));
    images.push(new myImage(550, -210, 150, 150, null, {image: externalImages.speechBubble, spriteSheet: false, frames: 4}, false));
    text.push(new Text("Hey Super Meat Son :D", 620, -150, "Ariel", 10, null, null, null));
    
    gravityPoints.push(new GravityPoint(1000, -200, externalImages.redPlanet, 50, 50000000000));
	clouds.push(new Cloud(100, -300, 100, 50, {image: externalImages.cloud, spriteSheet: false, frames: 4}, false, null));
    
    generateDungeon(800, -500);
    
    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    audio.music.load();
    animate();
}