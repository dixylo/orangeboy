import constants from "./Constants";

const { CANVAS_WIDTH, CANVAS_HEIGHT, INTERVAL } = constants;

export default {
  canvas : document.createElement("canvas"),
  start : function(run, frame) {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    frame.appendChild(this.canvas);
    this.interval = setInterval(run, INTERVAL);
  },
  resume : function(run) {
    this.interval = setInterval(run, INTERVAL);
  },
  stop : function() {
    clearInterval(this.interval);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};