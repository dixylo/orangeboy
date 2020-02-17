import head from "./Head";
import basket from "./Basket";
import constants from "./Constants";

const {
  HEAD_WIDTH, BASKET_WIDTH, dY, UPPER_BOUND, LOWER_BOUND, LEFT_BOUND, RIGHT_BOUND
} = constants;

// Listen to key events
var keysDown = {};
window.addEventListener('keydown', function(e) {
  keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
});

// Key control
export default function (mod) {
  if (37 in keysDown) { // Left Arrow
    if (basket.x > LEFT_BOUND) {  // Not moved to the bound yet
      basket.x -= basket.speed * mod;
      head.x -= head.speed * mod;
    }
    else {  // When hitting the bound
      basket.x = LEFT_BOUND;
      head.x = LEFT_BOUND + BASKET_WIDTH;
    }
  }
  if (38 in keysDown) {  // Up Arrow
    if (head.y > UPPER_BOUND) {
      basket.y -= basket.speed * mod;
      head.y -= head.speed * mod;
    }
    else {
      basket.y = UPPER_BOUND + dY;
      head.y = UPPER_BOUND;
    }
  }
  if (39 in keysDown) {  // Right Arrow
    if (basket.x < RIGHT_BOUND) {
      basket.x += basket.speed * mod;
      head.x += head.speed * mod;
    }
    else {
      basket.x = RIGHT_BOUND;
      head.x = RIGHT_BOUND - HEAD_WIDTH;
    }
  }
  if (40 in keysDown) {  // Down Arrow
    if (head.y < LOWER_BOUND) {
      basket.y += basket.speed * mod;
      head.y += head.speed * mod;
    }
    else {
      basket.y = LOWER_BOUND + dY;
      head.y = LOWER_BOUND;
    }
  }
}
