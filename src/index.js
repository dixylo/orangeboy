import "./styles.css";
import showRef from "./Reference";
import Draw from "./Draw";
import Orange from "./Orange";
import head from "./Head";
import basket from "./Basket";
import constants from "./Constants";
import media from "./Media";
import Score from "./Score";
import game from "./Game";
import control from "./Control";
import cover from "../assets/images/cover.jpg";
import "../assets/images/favicon.ico";

const { CANVAS_WIDTH, CANVAS_HEIGHT, dX } = constants;
const { background, soundBg, soundOutro, adjustVolume } = media;

const header = document.createElement("h1");
const divCanvas = document.createElement("div");
const imgCover = document.createElement("img");
const divControl = document.createElement("div");
const btnStart = document.createElement("button");
const btnPause = document.createElement("button");
const spnLeft = document.createElement("span");
const volumn = document.createElement("input");
const spnRight = document.createElement("span")
const divHowTo = document.createElement("div");
const divReference = document.createElement("div");
const btnReference = document.createElement("button");
const pReference = document.createElement("p");

imgCover.src = cover;
btnPause.style.display = "none";
header.innerText = "Eric the Orange Boy";
btnStart.innerText = "Start Game";
btnPause.innerText = "Pause Game";
spnLeft.innerText = "Sound Volumn: Min";
spnRight.innerText = "Max";
divHowTo.innerText = "Hint: Use Up Down Left Right arrows to control Eric.";
btnReference.innerText = "Show Reference";

volumn.id = "volumn";
volumn.type = "range";
volumn.min = "0";
volumn.max = "100";

btnStart.addEventListener("click", startGame);
btnPause.addEventListener("click", pauseGame);
volumn.addEventListener("change", adjustVolume);
btnReference.addEventListener("click", () => showRef(btnReference, pReference));

divCanvas.appendChild(imgCover);
divControl.appendChild(btnStart);
divControl.appendChild(btnPause);
divControl.appendChild(spnLeft);
divControl.appendChild(volumn);
divControl.appendChild(spnRight);
divReference.appendChild(btnReference);
divReference.appendChild(pReference);
document.body.appendChild(header);
document.body.appendChild(divCanvas);
document.body.appendChild(divControl);
document.body.appendChild(divHowTo);
document.body.appendChild(divReference);

let context;
let time; // current time
let score;
let draw;
let countClick = 0; // count how many times the button is clicked
const oranges = []; // used to hold orange instances

// Draw all the things on canvas
function render () {
  game.clear();
  game.canvas.style.backgroundImage = `url(${background})`;
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
  control((Date.now() - time) / 1000);
  render();
  time = Date.now();
  if (score.timeLeft <= 0) {
    game.stop();
    soundOutro.play();
    soundBg.stop();
    alert("Time is up! You scored " + score + "!");
  }
}

let isPaused = false;
function pauseGame () {
  if (!isPaused) {
    game.stop();
    soundBg.stop();
  } else {
    game.resume(run);
    soundBg.play();
  }
  isPaused = !isPaused;
  btnPause.innerHTML = isPaused ? "Resume Game" : "Pause Game";
}

// Initialize the game
function startGame () {
  if (countClick > 0) {  // Make sure all is renewed if game is restarted
    game.stop();
    game.clear();
    soundBg.stop();
    oranges.splice(0, oranges.length);
    isPaused = false;
    btnPause.innerHTML = "Pause Game";
  }
  else {
    divCanvas.removeChild(divCanvas.childNodes[0]); // Remove the cover image before entering game for 1st time
  }
  game.start(run, divCanvas);
  context = game.context;
  draw = new Draw(context);
  score = new Score(context, oranges);
  head.renew();
  basket.renew();
  btnStart.innerHTML = "Restart Game";
  btnPause.style.display = "inline";
  countClick += 1;
  soundBg.play();
}
