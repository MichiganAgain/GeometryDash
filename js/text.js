function Text (text, x, y, font, size, position = null, colorFunc = null, movementFunction = null, movementDirection = {x: false, y: false}) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.t = 0;
    this.font = font;
    this.size = size;
    this.position = position;
    this.colorFunc = colorFunc;
    this.movementFuntion = movementFunction;
    this.movementDirection = movementDirection;
    
    this.draw = function (context, camera) {
        this.offset = this.movementFuntion(this.t);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = this.size + "px " + this.font;
        if (this.colorFunc === null) context.fillStyle = 'red';
        else context.fillStyle = `rgb(${(this.colorFunc(this.t)) % 255},${0},${0})`;
        context.fillText(this.text, this.x + ((this.position === "absolute") ? 0 + ((this.movementDirection.x == true) ? this.offset: 0): camera.xOffset + ((this.movementDirection.x == true) ? this.offset: 0)), this.y + ((this.position === "absolute") ? 0 + ((this.movementDirection.y == true) ? this.offset: 0): camera.yOffset + ((this.movementDirection.y == true) ? this.offset: 0)));
        context.strokeText(this.text, this.x + ((this.position === "absolute") ? 0 + ((this.movementDirection.x == true) ? this.offset: 0): camera.xOffset + ((this.movementDirection.x == true) ? this.offset: 0)), this.y + ((this.position === "absolute") ? 0 + ((this.movementDirection.y == true) ? this.offset: 0): camera.yOffset + ((this.movementDirection.y == true) ? this.offset: 0)));
    }
    
    this.update = function (context, camera) {
        this.draw(context, camera);
        
        this.t++;
        this.x;
        if (this.t >= 360) this.t = 0;
    }
}