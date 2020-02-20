import constants from "./Constants";
import media from "./Media";

const { CANVAS_WIDTH, CANVAS_HEIGHT, INTERVAL } = constants;

export default {
  canvas: document.createElement("canvas"),
  getContext: function () {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.backgroundImage = `url(${media.background})`;
    this.context = this.canvas.getContext("2d");

    return this.context;
  },
  start: function (run, frame) {
    frame.appendChild(this.canvas);
    this.interval = setInterval(run, INTERVAL);
  },
  resume: function(run) {
    this.interval = setInterval(run, INTERVAL);
  },
  stop: function() {
    clearInterval(this.interval);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};