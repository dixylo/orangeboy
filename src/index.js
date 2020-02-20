import "./styles.css";
import "../assets/images/favicon.ico";
import showRef from "./Reference";
import media from "./Media";
import cover from "../assets/images/cover.jpg";
import { start, pause } from "./Control";

const header = document.createElement("h1");
const divCanvas = document.createElement("div");
const imgCover = document.createElement("img");
const divControl = document.createElement("div");
const btnStart = document.createElement("button");
const btnPause = document.createElement("button");
const spnLeft = document.createElement("span");
const volume = document.createElement("input");
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
spnLeft.innerText = "Sound Volume: Min";
spnRight.innerText = "Max";
divHowTo.innerText = "Hint: Use Up Down Left Right arrows to control Eric.";
btnReference.innerText = "Show Reference";

volume.id = "volume";
volume.type = "range";
volume.min = "0";
volume.max = "100";

btnStart.addEventListener("click", () => start(divCanvas, btnStart, btnPause));
btnPause.addEventListener("click", () => pause(btnPause));
btnReference.addEventListener("click", () => showRef(btnReference, pReference));
volume.addEventListener("change", media.adjustVolume);

divCanvas.appendChild(imgCover);
divControl.appendChild(btnStart);
divControl.appendChild(btnPause);
divControl.appendChild(spnLeft);
divControl.appendChild(volume);
divControl.appendChild(spnRight);
divReference.appendChild(btnReference);
divReference.appendChild(pReference);
document.body.appendChild(header);
document.body.appendChild(divCanvas);
document.body.appendChild(divControl);
document.body.appendChild(divHowTo);
document.body.appendChild(divReference);
