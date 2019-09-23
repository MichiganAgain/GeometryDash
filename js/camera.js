function Camera (trackedObject) {
    this.trackedObject = trackedObject;
    this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - canvas.width / 4;
    this.yOffset = 0;
    
    this.update = function () {
        this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - (trackedObject.SIZE / 2);
        //this.yOffset = this.findOffsetY(trackedObject.x);
        this.yOffset = ((canvas.height / 2) - this.trackedObject.y) - (trackedObject.SIZE / 2);
    }
    
    this.findOffsetY = function (x) {
        //using f(x) = 300sin(x/100)   ie stretch parrallel to x-axis S.F 100 + y-axis S.F 300
        return 20 * Math.sin(x / 100);
    }
}