import head from "./Head";
import Draw from "./Draw";
import constants from "./Constants";
import media from "./Media";

const { INTERVAL, RIPE_RADIUS } = constants;
const { soundYay, soundOuch, soundUhoh } = media;

export default class Score {
  constructor (context, oranges) {
    this.draw = new Draw(context);
    this.oranges = oranges;
    this.score = 0;
    this.countCatch = 0;
    this.countHit = 0;
    this.timeLeft = 7 * 60 * 1000; // time limit: 7 min
  }

  // collision checking
  intersect(x, y, w, h, xi, yi, wi, hi) { // parameters are the sets of coordinates and sizes of two square objects
    // hitting happens if the centers come less than half of the widths and heights of the two objects
    if (Math.abs((x+w/2)-(xi+wi/2))<(w+wi)/2 && Math.abs((y+h/2)-(yi+hi/2))<(h+hi)/2)
      return true;  // if collided, return true
    else return false;
  }

  // check Eric catched a orange
  checkCatch(x, y, w, h) {
    for (var i = 0; i < this.oranges.length; i++) {
      const xi = this.oranges[i].x - RIPE_RADIUS;
      const yi = this.oranges[i].y - RIPE_RADIUS;
      const wi = 2 * RIPE_RADIUS;
      const hi = 2 * RIPE_RADIUS;
      // check collision
      if (this.intersect(x, y, w, h, xi, yi, wi, hi)) {
        soundYay.play();
        this.countCatch += 1;
        this.score += 1;
        this.oranges.splice(i, 1);  // if collided, remove the orange
        this.draw.countGrin = 1;
      }
    }

    this.draw.grin(head); // keep grinning
  }

  // check Eric is hit on the head by an orange
  checkHit(x, y, w, h) {
    for (var i = 0; i < this.oranges.length; i++) {
      const xi = this.oranges[i].x - RIPE_RADIUS;
      const yi = this.oranges[i].y - RIPE_RADIUS;
      const wi = 2 * RIPE_RADIUS;
      const hi = 2 * RIPE_RADIUS;
      // check collision
      if (this.intersect(x, y, w, h, xi, yi, wi, hi)) {
        if (this.countHit % 2 == 0) {  // to alternatively play pain sounds
          soundOuch.play();
        }
        else {  // to alternatively play pain sounds
          soundUhoh.play();
        }
        this.score -= 1;  // if hit, one mark is deducted
        this.countHit += 1;
        this.oranges.splice(i, 1);  // if collided, remove the orange
        this.draw.countFrown = 1;
      }
    }

    this.draw.frown(head); // keep frowning
  }

  // score updating
  display () {
    this.draw.score(this.score);
  }

  // countdown
  countDown () {
    this.draw.timer(this.timeLeft);
    this.timeLeft -= INTERVAL;
  }

  reset () {
    this.score = 0;
    this.countCatch = 0;
    this.countHit = 0;
    this.timeLeft = 7 * 60 * 1000;
  }
}
