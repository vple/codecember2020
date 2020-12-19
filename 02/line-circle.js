// https://editor.p5js.org/vple/sketches/6GHS1xrww

var canvasWidth = 400,
  canvasHeight = 400,
  displayFrames = 5;

const radius = 150,
  maxSides = 50;

function setup() {
  frameRate(60);
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background(100);
  stroke(255);
  translate(canvasWidth / 2, canvasHeight / 2);

  var step = floor(((frameCount / displayFrames) + maxSides) % (2 * maxSides)),
    sides = abs(map(step, 0, 2 * maxSides - 1, -(maxSides - 1), maxSides));
  if (sides < 2) {
    sides = 2;
  }

  strokeWeight(5);
  nGon(sides, radius);
}

function nGon(n, radius) {
  let internalAngle = PI * (n - 2) / n,
    sideLength = 2 * radius * cos(internalAngle / 2);

  push();

  for (var i = 0; i < n; i++) {
    push();
    translate(-radius, 0);
    rotate(internalAngle / 2);
    line(0, 0, sideLength, 0);
    pop();
    rotate(2 * PI / n);
  }

  pop();
}