import constants from "./Constants";

const { HEAD_WIDTH, HEAD_HEIGHT, RIGHT_BOUND, LOWER_BOUND, SPEED } = constants;

// head object, defining the initial position
export default {
  x: RIGHT_BOUND - HEAD_WIDTH,
  y: LOWER_BOUND,
  width: HEAD_WIDTH,
  height: HEAD_HEIGHT,
  speed: SPEED,
  renew: function() {  // back to the initial position when game is restarted
    this.x = RIGHT_BOUND - HEAD_WIDTH;
    this.y = LOWER_BOUND;
    this.width = HEAD_WIDTH;
    this.height = HEAD_HEIGHT;
    this.speed = SPEED;
  }
};