import constants from "./Constants";

const { BASKET_WIDTH, BASKET_HEIGHT, RIGHT_BOUND, LOWER_BOUND, dY, SPEED } = constants;

export default {
  x: RIGHT_BOUND,
  y: LOWER_BOUND + dY,
  width: BASKET_WIDTH,
  height: BASKET_HEIGHT,
  speed: SPEED,
  renew: function() {  // back to the initial position when game is restarted
    this.x = RIGHT_BOUND;
    this.y = LOWER_BOUND + dY;
    this.width = BASKET_WIDTH;
    this.height = BASKET_HEIGHT;
    this.speed = SPEED;
  }
};