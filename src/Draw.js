import head from "./Head";
import basket from "./Basket";
import mouthSrc from "../assets/images/mouth.png";
import constants from "./Constants";
import media from "./Media";

const { IRIS_X1, IRIS_X2, IRIS_Y, PATH_L, PATH_W, IRIS_RADIUS } = constants;
const { headImage, basketImage } = media;

export default class Draw {
  constructor (context) {
    this.context = context;
    this.context.lineWidth = 2;
    this.countFrown = 0;
    this.countGrin = 0;
    this.mouth = new Image();
    this.mouth.src = mouthSrc;
    this.step = 0.2; // moving step
    this.x1 = IRIS_X1 + IRIS_RADIUS;
    this.x2 = IRIS_X2 + IRIS_RADIUS;
  }

  line (moveToX, moveToY, lineToX, lineToY) {
    this.context.beginPath();
    this.context.moveTo(moveToX, moveToY);
    this.context.lineTo(lineToX, lineToY);
    this.context.stroke();
  }

  circle (x, y, radius, fillStyle) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = fillStyle;
    this.context.fill();
  }

  head () {
    this.context.drawImage(headImage, 0, 0, 128, 128, head.x - 20, head.y - 20, 128, 128);
  }

  basket () {
    this.context.drawImage(basketImage, basket.x, basket.y);
  }

  grin () {
    if (this.countGrin) {
      this.countFrown = 0; // Prevent frowning from apprearing at the same time

      // Left eyebrow
      this.line(head.x + 23, head.y + 13, head.x + 40, head.y + 10);
      // Right eyebrow
      this.line(head.x + 67, head.y + 13, head.x + 50, head.y + 10);
      // Mouth
      this.context.drawImage(this.mouth, 0, 0, 37, 24, head.x + 27, head.y + 39, 37, 24); 

      // Make eyebrows stay longer
      this.countGrin += 1;
      if (this.countGrin > 50) this.countGrin = 0;
    }   
  }

  frown () {
    if (this.countFrown) {
      this.countGrin = 0; // Prevent grinning from apprearing at the same time

      // Left eyebrow
      this.line(head.x + 33, head.y + 10, head.x + 43, head.y + 20);
      // Right eyebrow
      this.line(head.x + 58, head.y + 10, head.x + 48, head.y + 20);

      // Eye motion
      // Draw the iris paths
      this.context.clearRect(head.x + IRIS_X1, head.y + IRIS_Y, PATH_L, PATH_W);
      this.context.clearRect(head.x + IRIS_X2, head.y + IRIS_Y, PATH_L, PATH_W);
      this.context.fillStyle="white";
      this.context.fillRect(head.x + IRIS_X1, head.y + IRIS_Y, PATH_L, PATH_W);
      this.context.fillRect(head.x + IRIS_X2, head.y + IRIS_Y, PATH_L, PATH_W);
      // Draw the left and right irises
      this.circle(head.x + this.x1, head.y + IRIS_Y + IRIS_RADIUS, IRIS_RADIUS, "black");
      this.circle(head.x + this.x2, head.y + IRIS_Y + IRIS_RADIUS, IRIS_RADIUS, "black");

      this.x1 += this.step;
      this.x2 += this.step;
      if (this.x1 > IRIS_X1 + PATH_L - IRIS_RADIUS || this.x1 < IRIS_X1 + IRIS_RADIUS) {
        this.step = -this.step;
      }

      this.countFrown += 1;
      if (this.countFrown > 2* (PATH_L - 2 * IRIS_RADIUS) / this.step) {
        this.x1 = IRIS_X1 + IRIS_RADIUS;
        this.x2 = IRIS_X2 + IRIS_RADIUS;
        this.step = 0.2;
        this.countFrown = 0;
      }
    }
  }

  score (score) {
    this.context.font = "20px Georgia";
    this.context.fillStyle = "blue";
    this.context.fillText("Score: " + score, 10, 300);
  }

  timer (timeLeft) {
    const minLeft = Math.floor(timeLeft / 1000 / 60);
    const secLeft = Math.floor(timeLeft / 1000 % 60);
    this.context.font = "20px Georgia";
    this.context.fillStyle = "red";
    this.context.fillText("Time Left: " + minLeft + "m " + secLeft + "s", 100, 300);
  }

  orangesInBasket (countCatch) {
    // Draw oranges in basket.
    let catchedX = basket.x + basket.width / 8; // Display 4 oranges at most, hence the radius is basket.width/8
    if (countCatch < 5 && countCatch > 0) { // If less than five, oranges will pile on.
      for (var i = 0; i < countCatch; i++) {
        // Draw the orange body
        this.circle(catchedX, basket.y, basket.width / 8, "#FF6600");
        // Draw the stub
        this.circle(catchedX, basket.y - 11, 2, "#006600");
        catchedX += basket.width / 4;
      }
    }

    if (countCatch >= 5) { // If more than five, no more oranges will show up.
      for (var i = 0; i < 4; i++) {
        // Draw the orange body
        this.circle(catchedX, basket.y, basket.width / 8, "#FF6600");
        // Draw the stub
        this.circle(catchedX, basket.y - 11, 2, "#006600");
        catchedX += basket.width / 4;
      }
    }
  }
}
