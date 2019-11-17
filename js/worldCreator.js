function initializeWorld () {
    sprite = new Sprite(0, -40, {image: externalImages.spriteImage, spriteSheet: true, frames: 4});
    particles = [];
    blocks = [];
    gravityPoints = [];
    text = [];
    images = [];
    clouds = [];
    background = new myImage(-20, 0, canvas.width + 40, canvas.height, "absolute", {image: externalImages.backgroundImage, spriteSheet: false, frames: 0}, false, (t) => {t = (t/180) * Math.PI; return Math.sin(t/1) * 10});

    for (let i = 0; i < 20; i++) blocks.push(new Block(i * 40, 0, externalImages.blockImageBlueDirt));
    blocks.push(new Block(120, -40, externalImages.blockImageBlueDirt));
    images.push(new myImage(500, -75, 75, 75, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false));
    images.push(new myImage(500, -75, 75, 77, null, {image: externalImages.superMeatBoy, spriteSheet: false, frames: 4}, false, t => {return Math.sin((t / 180 * Math.PI) * 10) * 1;}));
    images.push(new myImage(550, -210, 150, 150, null, {image: externalImages.speechBubble, spriteSheet: false, frames: 4}, false));
    text.push(new Text("Hey Super Meat Son :D", 620, -150, "Ariel", 10, null, null, null));
    Text
    
    camera = new Camera(canvas, sprite);
    inputTimeStamp = Date.now();
    startPressed = false;
    audio.music.load();
    animate();
}