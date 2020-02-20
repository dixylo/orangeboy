// Define the sound class
export default class Sound {
  constructor (src, isLooped) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    if (isLooped) { this.sound.loop = true; }

    document.body.appendChild(this.sound);
  }

  play () {
    this.sound.volume = document.getElementById("volumn").value / 100;  // control volume
    this.sound.play();
  }

  volume () {
    this.sound.volume = document.getElementById("volumn").value / 100;  // control volume
  }

  stop () {
    this.sound.pause();
  }
}
