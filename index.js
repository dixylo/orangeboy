window.onload = function () {
  document.getElementById("btnStart").addEventListener("click", startGame);
  document.getElementById("btnPause").addEventListener("click", pauseGame);
  document.getElementById("btnShowRef").addEventListener("click", showRef);


// Show Reference
var showCtrl = 0;
function showRef() {
  if (showCtrl == 0) {
    var refList = "<ol><li>The \"Eric\" image. URL: http://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/images/21267.jpg?itok=hTskv8zO</li><li>The \"basket\" image. URL: http://1.bp.blogspot.com/_9Xm1rX4MS1M/TUtNRLY3GqI/AAAAAAABKcs/RvF0s63sQCQ/w1200-h630-p-k-no-nu/Apple%2BBasket%2B-2A.jpg</li><li>The \"orange\" image. URL: https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Orange-Whole-%26-Split.jpg/800px-Orange-Whole-%26-Split.jpg</li><li>The \"background\" image. URL: http://images.all-free-download.com/images/graphiclarge/a_tree_vector_156141.jpg</li><li>The background music. Hidden Catch Normal Sub, Composer: Unknown, URL: https://www.youtube.com/watch?v=EvbNmFEKegA</li><li>The outro music. South Park Series End Song, Composer: Primus, URL: https://www.youtube.com/watch?v=yXA6maPNFVo</li></ol>";
    document.getElementById("divRef").innerHTML = refList;
    document.getElementById("btnShowRef").innerHTML = "Collaps List";
    showCtrl = 1;
  }
  else {
    document.getElementById("divRef").innerHTML = "";
    document.getElementById("btnShowRef").innerHTML = "Show References";
    showCtrl = 0;
  }
}

// Game Part Starts Here
var canvasWidth = 800;
var canvasHeight = 500;
var ctx;
var divCanvas = document.getElementById("divCanvas");
var time; // current time
var countClick = 0; // count how many times the button is clicked
var timeLeft; // in milliseconds
var minLeft;
var secLeft;

var interval = 10; // interval of updating the canvas, in milliseconds
var speed = 200; // speed of moving Eric and basket

var boxes = []; // used to hold orange instances
var countCatch; // score for catching oranges
var countHit; // count of being hit
var score;

var bornRadius = 6; // born radius of an orange, in px
var ripeRadius = 30; // radius of a ripe orange, in px
var stubRadius = 3; // radius of the stub, in px
var stubOffset = 25; // distance between the center of an orange and of its stub
var growTime = 5; // growing time of an orange, in seconds
var ripeTime = 4; // riping time of an orange, in seconds
var hangTime = 3; // hanging time of an orange, in seconds
var fallTime = 6; // falling time of an orange, in seconds

var basketWidth = 116; // basket and head geometrics are used to detect collision only, not reflecting real shapes
var basketHeight = 1;
var headWidth = 85;
var headHeight = 1;
var dX = (basketWidth + headWidth) / 2;  // horizontal distance between the basket and head centers
var dY = 50;  // vertical distance between basket.y and head.y
var upperBound = canvasHeight * 2/3;  // the uppermost the head can reach
var lowerBound = canvasHeight - 115;  // the lowermost the head can reach, 115 being an offset considering Eric is 128px tall
var leftBound = 10;  // the leftmost the left end of the basket can reach
var rightBound = canvasWidth - leftBound - basketWidth;  // the rightmost the left end of the basket can reach
var basketImg = new Image();
var headImg = new Image();
var mouthImg = new Image();
basketImg.src = "assets/images/basket.png";
headImg.src = "assets/images/eric.png";
mouthImg.src = "assets/images/mouth.png";
var soundIntro = new sound("assets/audios/intro.mp3", false); // intro sound
var soundOutro = new sound("assets/audios/outro.mp3", false); // outro sound
var soundOuch = new sound("assets/audios/ouch.mp3", false);  // pain sound
var soundUhoh = new sound("assets/audios/uhoh.mp3", false);  // another pain sound
var soundYay = new sound("assets/audios/yay.mp3", false);   // happy sound
var soundBg = new sound("assets/audios/bg.mp3", true); // background music

// head object, defining the initial position
var head = {
  x: rightBound - headWidth,
  y: lowerBound,
  width: headWidth,
  height: headHeight,
  speed: speed,
  renew: function() {  // back to the initial position when game is restarted
    this.x = rightBound - headWidth;
    this.y = lowerBound;
    this.width = headWidth;
    this.height = headHeight;
    this.speed = speed;
  }
};

// basket object, defining the initial position
var basket = {
  x: rightBound,
  y: lowerBound + dY,
  width: basketWidth,
  height: basketHeight,
  speed: speed,
  renew: function() {  // back to the initial position when game is restarted
    this.x = rightBound;
    this.y = lowerBound + dY;
    this.width = basketWidth;
    this.height = basketHeight;
    this.speed = speed;
  }
};

// listen to key events
var keysDown = {};
window.addEventListener('keydown', function(e) {
  keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
  delete keysDown[e.keyCode];
});

// key control
function update(mod) {
    if (37 in keysDown) { // Left Arrow
      if (basket.x > leftBound) {  // not moved to the bound yet
        basket.x -= basket.speed * mod;
        head.x -= head.speed * mod;
      }
      else {  // when hitting the bound
        basket.x = leftBound;
        head.x = leftBound + basketWidth;
      }
    }
    if (38 in keysDown) {  // Up Arrow
      if (head.y > upperBound) {
        basket.y -= basket.speed * mod;
        head.y -= head.speed * mod;
      }
      else {
        basket.y = upperBound + dY;
        head.y = upperBound;
      }
    }
    if (39 in keysDown) {  // Right Arrow
      if (basket.x < rightBound) {
        basket.x += basket.speed * mod;
        head.x += head.speed * mod;
      }
      else {
        basket.x = rightBound;
        head.x = rightBound - headWidth;
      }
    }
    if (40 in keysDown) {  // Down Arrow
      if (head.y < lowerBound) {
        basket.y += basket.speed * mod;
        head.y += head.speed * mod;
      }
      else {
        basket.y = lowerBound + dY;
        head.y = lowerBound;
      }
    }
}

function drawCircle(x, y, radius, fillStyle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

// create the orange class
function orange(x, y) {
  this.x = x;  // the center x
  this.y = y;  // the center y
  var g = 0; // used to control the speed of orange color shifting
  var tick = 0; // used to indicate different phases of an orange
  var radius = 6; // orange radius, in px;
  this.update = function() {  // update the moving phase of an orange
    if (tick < growTime * 1000 / interval) {  // growing phase
      drawCircle(this.x, this.y, radius, "green");
      tick += 1;
      radius += (ripeRadius - bornRadius) / (growTime * 1000 / interval);
    }
    // riping phase
    else if (tick >= growTime * 1000 / interval && tick < (growTime + ripeTime) * 1000 / interval) {
      var colorEvolve = "rgb(" + Math.floor(34 * g) + ", " + (128 - Math.floor(g)) + ", 0)"; // gradually shift the color
      drawCircle(this.x, this.y, ripeRadius, colorEvolve);

      // Draw the stub
      //drawCircle(this.x, this.y - stubOffset, stubRadius, "#006600");

      g += 0.03;  // control the speed of color shifting
      tick += 1;
    }
    // hanging phase
    else if (tick >= (growTime + ripeTime) * 1000 / interval && tick < (growTime + ripeTime + hangTime) * 1000 / interval) {
      // create a 3D effect by radial gradient
      var orangeGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, ripeRadius);
      orangeGrad.addColorStop(0,"#FF7510");
      orangeGrad.addColorStop(1,"#E65C00");
      drawCircle(this.x, this.y, ripeRadius, orangeGrad);

      // Draw the stub
      //drawCircle(this.x, this.y - stubOffset, stubRadius, "#006600");

      tick += 1;
    }
    // falling phase
    else if (tick >= (growTime + ripeTime + hangTime) * 1000 / interval && tick < (growTime + ripeTime + hangTime + fallTime) * 1000 / interval) {
      orangeGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, ripeRadius);
      orangeGrad.addColorStop(0,"#FF7510");
      orangeGrad.addColorStop(1,"#E65C00");
      drawCircle(this.x, this.y, ripeRadius, orangeGrad);

      // Draw the stub
      drawCircle(this.x, this.y - stubOffset, stubRadius, "#006600");

      this.y += (canvasHeight - ripeRadius - y) / (fallTime * 1000 / interval); // calculate the update step by dividing the distance btw the born and final postions w/ falltime
      tick += 1;
    }
    // on-ground phase
    else {
      orangeGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, ripeRadius);
      orangeGrad.addColorStop(0,"#FF7510");
      orangeGrad.addColorStop(1,"#E65C00");
      drawCircle(this.x, this.y, ripeRadius, orangeGrad);

      // Draw the stub
      drawCircle(this.x, this.y - stubOffset, stubRadius, "#006600");
    }
  }
}

// draw all the things on canvas
function render() {
  gameArea.clear();
  gameArea.canvas.style.backgroundImage = "url('assets/images/tree.jpg')";
  //Check if we should generate a new orange to start move
  if (Math.random() < 0.005) {  // control the frequency of generating new oranges
    xi = Math.floor(Math.random() * canvasWidth);  // generate oranges across the canvas
    yi = Math.floor(Math.random() * canvasHeight / 5);  // generate oranges only in the upper fifth of the canvas
    boxes.push(new orange(xi,yi));  // store the generated orange instance
  }

  // Update the position of the oranges
  for (var i = boxes.length - 1; i >= 0; i--) {
    boxes[i].update();
  }

  // Draw Eric the collector
  ctx.drawImage(headImg, 0, 0, 128, 128, head.x - 20, head.y - 20, 128, 128);

  // Draw oranges in basket.
  if (countCatch < 5 && countCatch > 0) { // If less than five, oranges will pile on.
    var catchedX = basket.x + basket.width / 8; // Display 4 oranges at most, hence the radius is basket.width/8
    for (var i = 0; i < countCatch; i++) {
      // Draw the orange body
      drawCircle(catchedX, basket.y, basket.width / 8, "#FF6600");
      // Draw the stub
      drawCircle(catchedX, basket.y - 11, 2, "#006600");
      catchedX += basket.width / 4;
    }
  }
  if (countCatch >= 5) { // If more than five, no more oranges will show up.
    catchedX = basket.x + basket.width / 8;
    for (var i = 0; i < 4; i++) {
      // Draw the orange body
      drawCircle(catchedX, basket.y, basket.width / 8, "#FF6600");
      // Draw the stub
      drawCircle(catchedX, basket.y - 11, 2, "#006600");
      catchedX += basket.width / 4;
    }
  }

  // Switch the side of the basket: Head left, basket left; vice versa.
  if (head.x + head.width / 2 >= canvasWidth / 2) {
    basket.x = head.x + head.width / 2 - basket.width / 2 + dX;
  }
  else {
    basket.x = head.x + head.width / 2 - basket.width / 2 - dX;
  }

  // Draw the basket
  ctx.drawImage(basketImg, basket.x, basket.y);

  checkCatch(basket.x, basket.y, basket.width, basket.height); // Check that an orange is catched
  checkHit(head.x, head.y, head.width, head.height); // Check that an orange hits the head
  // Draw frowning
  if (countFrown > 0) { // Make frowning stay longer
    drawFrown();
  }
  if (countGrin > 0) { // Make grinning stay longer
    drawGrin();
  }
  if (glanceTrigger == 1) { // start a glance
    eyeMotion(); // Eye motion
  }

  writeScore(score);	// Update score
  countDown(); // Update time left
}

// check Eric catched a orange
function checkCatch(x,y,w,h) {
  for (var i = 0; i < boxes.length; i++) {
    var xi = boxes[i].x - ripeRadius;
    var yi = boxes[i].y - ripeRadius;
    var wi = 2 * ripeRadius;
    var hi = 2 * ripeRadius;
    // check collision
    if (intersect(x, y, w, h, xi, yi, wi, hi)) {
      soundYay.play();
      countCatch += 1;
      score += 1;
      boxes.splice(i, 1);  // if collided, remove the orange
      drawGrin();
    }
  }
}

// check Eric is hit on the head by an orange
function checkHit(x,y,w,h) {
  for (var i = 0; i < boxes.length; i++) {
    var xi = boxes[i].x - ripeRadius;
    var yi = boxes[i].y - ripeRadius;
    var wi = 2 * ripeRadius;
    var hi = 2 * ripeRadius;
    // check collision
    if (intersect(x, y, w, h, xi, yi, wi, hi)) {
      if (countHit % 2 == 0) {  // to alternatively play pain sounds
        soundOuch.play();
      }
      else {  // to alternatively play pain sounds
        soundUhoh.play();
      }
      score -= 1;  // if hit, one mark is deducted
      countHit += 1;
      boxes.splice(i, 1);  // if collided, remove the orange
      drawFrown();
      glanceTrigger = 1;
    }
  }
}

function drawLine(moveToX, moveToY, lineToX, lineToY) {
  ctx.beginPath();
  ctx.moveTo(moveToX, moveToY);
  ctx.lineTo(lineToX, lineToY);
  ctx.stroke();
}

// Draw frowning
var countFrown = 0;
function drawFrown() {
  countGrin = 0; // Prevent grinning from apprearing at the same time
  ctx.lineWidth = 2;
  // Left eyebrow
  drawLine(head.x + 33, head.y + 10, head.x + 43, head.y + 20);
  // Right eyebrow
  drawLine(head.x + 58, head.y + 10, head.x + 48, head.y + 20);
  // Make eyebrows stay longer
  countFrown += 1;
  if (countFrown > 50) {
    countFrown = 0;
  }
}

// Draw grinning
var countGrin = 0;
function drawGrin() {
  countFrown = 0; // Prevent frowning from apprearing at the same time
  ctx.lineWidth = 2;
  // Left eyebrow
  drawLine(head.x + 23, head.y + 13, head.x + 40, head.y + 10);
  // Right eyebrow
  drawLine(head.x + 67, head.y + 13, head.x + 50, head.y + 10);
  // Mouth
  ctx.drawImage(mouthImg, 0, 0, 37, 24, head.x + 27, head.y + 39, 37, 24);

  // Make eyebrows stay longer
  countGrin += 1;
  if (countGrin > 50) {
    countGrin = 0;
  }
}

// Eye motion
var iX1 = 27; // x Offset of the left iris
var iX2 = 49; // x Offset of the right iris
var iY = 26; // y Offset of the irises
var step = 0.2; // moving step
var pathL = 15; // path length
var pathW = 4; // path width
var iR = 2; // iris radius
var x1 = iX1 + iR;
var x2 = iX2 + iR;
var glanceTrigger = 0;
var delayTick = 0;
function eyeMotion() {
    // Draw the iris paths
    ctx.clearRect(head.x + iX1, head.y + iY, pathL, pathW);
    ctx.clearRect(head.x + iX2, head.y + iY, pathL, pathW);
    ctx.fillStyle="white";
    ctx.fillRect(head.x + iX1, head.y + iY, pathL, pathW);
    ctx.fillRect(head.x + iX2, head.y + iY, pathL, pathW);
    // Draw the left and right irises
    drawCircle(head.x + x1, head.y + iY + iR, iR, "black");
    drawCircle(head.x + x2, head.y + iY + iR, iR, "black");

    x1 = x1 + step;
    x2 = x2 + step;
    if (x1 > iX1 + pathL - iR || x1 < iX1 + iR) {
      step = -step;
    }

  if (delayTick > 2* (pathL - 2 * iR) / step) {
    x1 = iX1 + iR;
    x2 = iX2 + iR;
    step = 0.2;
    delayTick = 0;
    glanceTrigger = 0;
  }
  delayTick += 1;
}

// collision checking
function intersect(x, y, w, h, xi, yi, wi, hi) { // parameters are the sets of coordinates and sizes of two square objects
  // hitting happens if the centers come less than half of the widths and heights of the two objects
  if (Math.abs((x+w/2)-(xi+wi/2))<(w+wi)/2 && Math.abs((y+h/2)-(yi+hi/2))<(h+hi)/2)
    return true;  // if collided, return true
  else return false;
}

// Define the sound class
function sound(src, isLooped) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  if (isLooped) { this.sound.loop = true; }

  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.volume = document.getElementById("vol").value / 100;  // control volume
    this.sound.play();
  }
  this.volume = function(){
    this.sound.volume = document.getElementById("vol").value / 100;  // control volume
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// Adjust the sound volume
function adjustVol() {
  soundIntro.volume();
  soundOutro.volume();
  soundOuch.volume();
  soundUhoh.volume();
  soundYay.volume();
  soundBg.volume();
}

// score updating
function writeScore(score) {
  ctx.font = "20px Georgia";
  ctx.fillStyle = "blue";
  ctx.fillText("Score: " + score, 10, 300);
}

// countdown
function countDown() {
  minLeft = Math.floor(timeLeft / 1000 / 60);
  secLeft = Math.floor(timeLeft / 1000 % 60);
  timeLeft -= interval;
  ctx.font = "20px Georgia";
  ctx.fillStyle = "red";
  ctx.fillText("Time Left: " + minLeft + "m " + secLeft + "s", 100, 300);
}

// capsule the key control and object drawing
function run() {
  update((Date.now() - time) / 1000);
  render();
  time = Date.now();
  if (timeLeft <= 0) {
    gameArea.stop();
    soundOutro.play();
    soundBg.stop();
    alert("Time is up! You scored " + score + "!");
  }
}

// game area object
var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    divCanvas.appendChild(this.canvas);
    // this.frameNo = 0;
    this.interval = setInterval(run, interval);
  },
  resume : function() {
    this.interval = setInterval(run, interval);
  },
  stop : function() {
    clearInterval(this.interval);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

var isPaused = false;
function pauseGame() {
  if (!isPaused) {
    gameArea.stop();
    soundBg.stop();
  } else {
    gameArea.resume();
    soundBg.play();
  }
  isPaused = !isPaused;
  document.getElementById("btnPause").innerHTML = isPaused ? "Resume Game" : "Pause Game";
}

// initialize the game
function startGame() {
  if (countClick > 0) {  // make sure all is renewed if game is restarted
    gameArea.stop();
    gameArea.clear();
    boxes.splice(0, boxes.length);
    isPaused = false;
    document.getElementById("btnPause").innerHTML = "Pause Game";
  }
  else {
  divCanvas.removeChild(divCanvas.childNodes[0]); // remove the cover image before entering game for 1st time
  }
  gameArea.start();
  ctx = gameArea.context;
  basket.renew();
  head.renew();
  countCatch = 0;
  countHit = 0;
  score = 0;
  timeLeft = 7 * 60 * 1000; // time limit: 7 min
  document.getElementById("btnStart").innerHTML = "Restart Game";
  document.getElementById("btnPause").style.display = "inline";
  countClick += 1;
  soundBg.play();
}
}