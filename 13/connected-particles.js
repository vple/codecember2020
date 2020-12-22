// https://editor.p5js.org/vple/sketches/-MwozW79z

const CANVAS_WIDTH = 400,
  CANVAS_HEIGHT = 400,
  FPS = 30;

const RADIUS = 10,
  MARGIN = 0,
  ROTATION_DURATION = 1.5, // s
  FRAMES_PER_ROTATION = FPS * ROTATION_DURATION;

const RECORD_FRAMES = FRAMES_PER_ROTATION;

var canvas;

// Create a capturer that exports an animated GIF
// Notices you have to specify the path to the gif.worker.js 
// var capturer = new CCapture({
//   format: 'gif',
//   workersPath: './js/',
//   framerate: 30,
//   verbose: true,
//   // timeLimit: 1
// });

var gif = new GIF({
  // debug: true,
  quality: 0,
  workerScript: "./js/gif.worker.js"
});
gif.on('finished', function(blob) {
  window.open(URL.createObjectURL(blob));
});
console.log(gif);

function setup() {
  frameRate(FPS);
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).canvas;

  /*
  console.log(canvas.width);
  // capturer.start();
  // if (frameCount == 1) {
  console.log(capturer);
  // capturer.start();
  console.log('wtf');
  // }
  */


}

function draw() {
  background(28);

  stroke(220);
  strokeWeight(3);
  for (var x = 0; x < CANVAS_WIDTH + RADIUS; x += (2 * RADIUS + MARGIN)) {
    for (var y = 0; y < CANVAS_HEIGHT + RADIUS; y += (2 * RADIUS + MARGIN)) {
      // stroke(100);
      particle(x, y, frameCount, lineOffset(-1 / 2));
      // stroke(200);
      // particle(x, y, frameCount, lineOffset(-1));
      // particle(x, y, frameCount, () => 0);

      // particle(x, y, frameCount, circleOffset(CANVAS_WIDTH/2, CANVAS_HEIGHT/2));
    }
  }


  if (frameCount <= RECORD_FRAMES) {
    gif.addFrame(canvas, {
      delay: 1000 / FPS,
      copy: true
    });
  }

  if (frameCount == RECORD_FRAMES) {
    console.log("rendering");
    gif.render();
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
  circle(x, y, sin(time) * RADIUS);
  pop();
}

function lineOffset(slope) {
  return function(x, y) {
    return y + slope * x;
  }
}

function circleOffset(centerX, centerY) {
  return function(x, y) {
    return sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  }
}