function Camera (canvas, trackedObject) {
    this.trackedObject = trackedObject;
    this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - canvas.width / 4;
    this.yOffset = 0;
    this.zoom = 1;
    
    this.update = function (canvas) {
        this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - (trackedObject.SIZE / 2);
        //this.yOffset = this.findOffsetY(trackedObject.x) + ((canvas.height / 2) - this.trackedObject.y) - (trackedObject.SIZE / 2) + (canvas.height / 7);
        this.yOffset = ((canvas.height / 2) - this.trackedObject.y) - (trackedObject.SIZE / 2) + (canvas.height / 7);
    }
    
    this.findOffsetY = function (x) {
        //using f(x) = 300sin(x/100)   ie stretch parrallel to x-axis S.F 100 + y-axis S.F 300
        return 20 * Math.sin(x / 100);
    }
}

function FocusPoint (p1, p2, frames) {  // where p1 is the start point and p2 is freakin common sense lmao
    this.p1 = p1;
    this.p2 = p2;
    this.frames = frames;
    this.progress = 0;
    this.velocity = 10;
    this.distance = Math.sqrt((p1.x - p2.x)**2, (p1.y - p2.y));
    this.x = p1.x;
    this.y = p1.y;
    this.SIZE = 0;
    this.traveling = true;
    
    this.f = function (x) { // y = f(x)
        return (this.gradient * x) + (this.gradient * -(p1.x)) + p1.y;
    }
    
    this.update = function () {
        if (this.traveling) {
            this.x = p1.x + (p2.x - p1.x) * this.progress;
            this.y = p1.y + (p2.y - p1.y) * this.progress;
            this.progress += this.velocity / this.distance;
        }
    }
}