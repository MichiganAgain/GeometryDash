function Camera (trackedObject) {
    this.trackedObject = trackedObject;
    this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - canvas.width / 4;
    this.yOffset = 0;
    
    this.update = function () {
        this.xOffset = ((canvas.width / 2) - this.trackedObject.x) - canvas.width / 4;
        this.yOffset = 0;
    }
}