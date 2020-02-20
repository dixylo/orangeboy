import constants from "./Constants";
import media from "./Media";
import game from "./Game";
import Draw from "./Draw";
import Score from "./Score";
import Orange from "./Orange";
import head from "./Head";
import basket from "./Basket";
import move from "./Move";

const { CANVAS_WIDTH, CANVAS_HEIGHT, dX } = constants;
const { soundBg, soundOutro } = media;

const context = game.getContext();
const oranges = []; // used to hold orange instances
const draw = new Draw(context);
const score = new Score(context, oranges);
let time = 0; // current time
let countClick = 0; // count how many times the button is clicked
let isPaused = false;

// Draw all the things on canvas
function render () {
  game.clear();
  // Check if we should generate a new orange to start move
  if (Math.random() < 0.005) {  // Control the frequency of generating new oranges
    const xi = Math.floor(Math.random() * CANVAS_WIDTH);  // Generate oranges across the canvas
    const yi = Math.floor(Math.random() * CANVAS_HEIGHT / 5);  // Generate oranges only in the upper fifth of the canvas
    oranges.push(new Orange(context, xi, yi));  // Store the generated orange instance
  }

  // Update the position of the oranges
  for (var i = oranges.length - 1; i >= 0; i--) {
    oranges[i].update();
  }

  draw.head(); // Draw Eric the collector
  draw.orangesInBasket(score.countCatch); // Draw oranges in basket.

  // Switch the side of the basket: Head left, basket left; vice versa.
  basket.x = head.x + head.width / 2 >= CANVAS_WIDTH / 2 ?
    head.x + head.width / 2 - basket.width / 2 + dX :
    head.x + head.width / 2 - basket.width / 2 - dX;

  draw.basket(); // Draw the basket

  score.checkCatch(basket.x, basket.y, basket.width, basket.height); // Check that an orange is catched
  score.checkHit(head.x, head.y, head.width, head.height); // Check that an orange hits the head
  score.display(); // Update score
  score.countDown(); // Update time left
}

// Capsule the key control and object drawing
function run () {
  move((Date.now() - time) / 1000);
  render();
  time = Date.now();
  if (score.timeLeft <= 0) {
    game.stop();
    soundOutro.play();
    soundBg.stop();
    alert("Time is up! You scored " + score.score + "!");
  }
}

export function start (divCanvas, btnStart, btnPause) {
  if (countClick > 0) {  // Make sure all is renewed if game is restarted
    game.stop();
    game.clear();
    head.reset();
    basket.reset();
    soundBg.stop();
    score.reset();
    oranges.splice(0, oranges.length);
    isPaused = false;
    btnPause.innerHTML = "Pause Game";
  }
  else {
    divCanvas.removeChild(divCanvas.childNodes[0]); // Remove the cover image before entering game for 1st time
  }
  game.start(run, divCanvas);
  btnStart.innerHTML = "Restart Game";
  btnPause.style.display = "inline";
  countClick += 1;
  soundBg.play();
}

export function pause (btnPause) {
  if (isPaused) {
    game.resume(run);
    soundBg.play();
  } else {
    game.stop();
    soundBg.stop();
  }
  isPaused = !isPaused;
  btnPause.innerHTML = isPaused ? "Resume Game" : "Pause Game";
}
