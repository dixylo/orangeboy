const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const INTERVAL = 10; // interval of updating the canvas, in milliseconds
const SPEED = 200; // speed of moving Eric and basket
const GROW_TIME = 5; // growing time of an orange, in seconds
const RIPE_TIME = 4; // riping time of an orange, in seconds
const HANG_TIME = 3; // hanging time of an orange, in seconds
const FALL_TIME = 6; // falling time of an orange, in seconds
const BORN_RADIUS = 6; // born radius of an orange, in px
const RIPE_RADIUS = 30; // radius of a ripe orange, in px
const STUB_RADIUS = 3; // radius of the stub, in px
const STUB_OFFSET = 25; // distance between the center of an orange and of its stub
const BASKET_WIDTH = 116; // basket and head geometrics are used to detect collision only, not reflecting real shapes
const BASKET_HEIGHT = 1;
const HEAD_WIDTH = 85;
const HEAD_HEIGHT = 1;
const dX = (BASKET_WIDTH + HEAD_WIDTH) / 2;  // horizontal distance between the basket and head centers
const dY = 50;  // vertical distance between basket.y and head.y
const UPPER_BOUND = CANVAS_HEIGHT * 2/3;  // the uppermost the head can reach
const LOWER_BOUND = CANVAS_HEIGHT - 115;  // the lowermost the head can reach, 115 being an offset considering Eric is 128px tall
const LEFT_BOUND = 10;  // the leftmost the left end of the basket can reach
const RIGHT_BOUND = CANVAS_WIDTH - LEFT_BOUND - BASKET_WIDTH;  // the rightmost the left end of the basket can reach
const IRIS_X1 = 27; // x Offset of the left iris
const IRIS_X2 = 49; // x Offset of the right iris
const IRIS_Y = 26; // y Offset of the irises
const PATH_L = 15; // path length
const PATH_W = 4; // path width
const IRIS_RADIUS = 2; // iris radius

export default {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  INTERVAL,
  SPEED,
  GROW_TIME,
  RIPE_TIME,
  HANG_TIME,
  FALL_TIME,
  BORN_RADIUS,
  RIPE_RADIUS,
  STUB_RADIUS,
  STUB_OFFSET,
  BASKET_WIDTH,
  BASKET_HEIGHT,
  HEAD_WIDTH,
  HEAD_HEIGHT,
  dX,
  dY,
  UPPER_BOUND,
  LOWER_BOUND,
  LEFT_BOUND,
  RIGHT_BOUND,
  IRIS_X1,
  IRIS_X2,
  IRIS_Y,
  PATH_L,
  PATH_W,
  IRIS_RADIUS
};