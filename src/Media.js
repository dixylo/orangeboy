import background from "../assets/images/tree.jpg";
import basketSrc from "../assets/images/basket.png";
import ericSrc from "../assets/images/eric.png";
import Sound from "./Sound";
import intro from "../assets/audios/intro.mp3";
import outro from "../assets/audios/outro.mp3";
import ouch from "../assets/audios/ouch.mp3";
import uhoh from "../assets/audios/uhoh.mp3";
import yay from "../assets/audios/yay.mp3";
import bg from "../assets/audios/bg.mp3";

const headImage = new Image();
const basketImage = new Image();
headImage.src = ericSrc;
basketImage.src = basketSrc;

const soundIntro = new Sound(intro, false); // intro sound
const soundOutro = new Sound(outro, false); // outro sound
const soundOuch = new Sound(ouch, false);  // pain sound
const soundUhoh = new Sound(uhoh, false);  // another pain sound
const soundYay = new Sound(yay, false);   // happy sound
const soundBg = new Sound(bg, true); // background music
const sounds = [soundIntro, soundOutro, soundOuch, soundUhoh, soundYay, soundBg];

export default {
  background,
  headImage,
  basketImage,
  soundIntro,
  soundOutro,
  soundOuch,
  soundUhoh,
  soundYay,
  soundBg,
  sounds };