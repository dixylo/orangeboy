import Draw from "./Draw";
import constants from "./Constants";

const {
  CANVAS_HEIGHT, INTERVAL, GROW_TIME, RIPE_TIME, HANG_TIME, FALL_TIME, BORN_RADIUS, RIPE_RADIUS, STUB_RADIUS, STUB_OFFSET
} = constants;

// create the orange class
export default class Orange {
  constructor (context, x, y) {
    this.context = context
    this.x = x;  // the center x
    this.y = y;  // the center y
    this.bornY = y;
    this.g = 0; // used to control the speed of orange color shifting
    this.tick = 0; // used to indicate different phases of an orange
    this.radius = 6; // orange radius, in px;
    this.draw = new Draw(context);
  }

  update () {  // update the moving phase of an orange
    if (this.tick < GROW_TIME * 1000 / INTERVAL) {  // growing phase
      this.draw.circle(this.x, this.y, this.radius, "green");
      this.tick += 1;
      this.radius += (RIPE_RADIUS - BORN_RADIUS) / (GROW_TIME * 1000 / INTERVAL);
    }
    // riping phase
    else if (this.tick >= GROW_TIME * 1000 / INTERVAL && this.tick < (GROW_TIME + RIPE_TIME) * 1000 / INTERVAL) {
      const colorEvolve = "rgb(" + Math.floor(34 * this.g) + ", " + (128 - Math.floor(this.g)) + ", 0)"; // gradually shift the color
      this.draw.circle(this.x, this.y, RIPE_RADIUS, colorEvolve);

      this.g += 0.03;  // control the speed of color shifting
      this.tick += 1;
    }
    // hanging phase
    else if (this.tick >= (GROW_TIME + RIPE_TIME) * 1000 / INTERVAL && this.tick < (GROW_TIME + RIPE_TIME + HANG_TIME) * 1000 / INTERVAL) {
      // create a 3D effect by radial gradient
      this.draw.circle(this.x, this.y, RIPE_RADIUS, this.ripeOrangeGradient(this.y));

      this.tick += 1;
    }
    // falling phase
    else if (this.tick >= (GROW_TIME + RIPE_TIME + HANG_TIME) * 1000 / INTERVAL && this.tick < (GROW_TIME + RIPE_TIME + HANG_TIME + FALL_TIME) * 1000 / INTERVAL) {
      this.draw.circle(this.x, this.y, RIPE_RADIUS, this.ripeOrangeGradient(this.y));

      // Draw the stub
      this.draw.circle(this.x, this.y - STUB_OFFSET, STUB_RADIUS, "#006600");

      this.y += (CANVAS_HEIGHT - RIPE_RADIUS - this.bornY) / (FALL_TIME * 1000 / INTERVAL); // calculate the update step by dividing the distance btw the born and final postions w/ falltime
      this.tick += 1;
    }
    // on-ground phase
    else {
      this.draw.circle(this.x, this.y, RIPE_RADIUS, this.ripeOrangeGradient(this.y));

      // Draw the stub
      this.draw.circle(this.x, this.y - STUB_OFFSET, STUB_RADIUS, "#006600");
    }
  }

  ripeOrangeGradient (positionY) {
    const gradient = this.context.createRadialGradient(this.x, positionY, 0, this.x, positionY, RIPE_RADIUS);
    gradient.addColorStop(0,"#FF7510");
    gradient.addColorStop(1,"#E65C00");

    return gradient;
  }
}
