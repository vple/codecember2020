// https://editor.p5js.org/vple/sketches/-MwozW79z

const CANVAS_WIDTH = 16*30,
  CANVAS_HEIGHT = 9*30,
  FPS = 60;

const RADIUS = 10,
  MARGIN = 0,
  ROTATION_DURATION = 1.5, // s
  FRAMES_PER_ROTATION = FPS * ROTATION_DURATION;

function setup() {
  frameRate(FPS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
  background(28);

  stroke(220);
  strokeWeight(3);
  for (var x = 0; x < CANVAS_WIDTH + RADIUS; x += (2 * RADIUS + MARGIN)) {
    for (var y = 0; y < CANVAS_HEIGHT + RADIUS; y += (2 * RADIUS + MARGIN)) {
      // stroke(100);
      particle(x, y, frameCount, lineOffset(-1/2));
      // stroke(200);
      // particle(x, y, frameCount, lineOffset(-1));
      // particle(x, y, frameCount, () => 0);
      
      // particle(x, y, frameCount, circleOffset(CANVAS_WIDTH/2, CANVAS_HEIGHT/2));
    }
  }
}

function particle(x, y, t, offsetFn) {
  push();
  translate(x, y);
  let time = (TWO_PI * t / FRAMES_PER_ROTATION) + offsetFn(x, y);
  // time = time + noise(x, y, time/50);
  strokeWeight(3);
  stroke(220);
  point(RADIUS * cos(time), RADIUS * sin(time));
  noFill();
  stroke(color("#b19cd9"));
  strokeWeight(2);
  // circle(RADIUS * cos(time), RADIUS * sin(time), RADIUS);
  circle(x, y, sin(time/3.7) * RADIUS);
  pop();
}

function lineOffset(slope) {
  return function(x, y) {
    return y + slope * x;
  }
}

function circleOffset(centerX, centerY) {
  return function(x, y) {
    return sqrt((x - centerX)**2 + (y - centerY)**2);
  }
}