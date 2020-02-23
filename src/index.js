import "./styles.css";
import "../assets/images/favicon.ico";
import media from "./Media";
import cover from "../assets/images/cover.jpg";
import { start, pause } from "./Control";

const divBackground = document.createElement("div");
const divContainer = document.createElement("div");
const header = document.createElement("h1");
const divCanvas = document.createElement("div");
const imgCover = document.createElement("img");
const divControl = document.createElement("div");
const divButton = document.createElement("div");
const btnStart = document.createElement("button");
const btnPause = document.createElement("button");
const divSound = document.createElement("div");
const spnLeft = document.createElement("span");
const volume = document.createElement("input");
const spnRight = document.createElement("span")
const divHowTo = document.createElement("div");

imgCover.src = cover;
btnPause.style.display = "none";
divBackground.id = "divBackground";
divContainer.id = "divContainer";
divCanvas.id = "divCanvas";
divControl.id = "divControl";
divHowTo.id = "divHowTo";
divSound.id = "divSound";
header.innerText = "Eric the Orange Boy";
btnStart.innerText = "Start Game";
btnPause.innerText = "Pause Game";
spnLeft.innerText = "Sound: Min";
spnRight.innerText = "Max";
divHowTo.innerText = "--- Use Arrow keys to move Eric ---";

volume.id = "volume";
volume.type = "range";
volume.min = "0";
volume.max = "100";

btnStart.addEventListener("click", () => start(divCanvas, btnStart, btnPause));
btnPause.addEventListener("click", () => pause(btnPause));
volume.addEventListener("change", media.adjustVolume);

divCanvas.appendChild(imgCover);
divButton.appendChild(btnStart);
divButton.appendChild(btnPause);
divSound.appendChild(spnLeft);
divSound.appendChild(volume);
divSound.appendChild(spnRight);
divControl.appendChild(divButton);
divControl.appendChild(divSound);
divContainer.appendChild(header);
divContainer.appendChild(divCanvas);
divContainer.appendChild(divHowTo);
divContainer.appendChild(divControl);
document.body.appendChild(divContainer);
document.body.appendChild(divBackground);
