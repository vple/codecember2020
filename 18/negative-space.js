// https://editor.p5js.org/vple/sketches/42nw6apUo

const FPS = 30;

const CANVAS_WIDTH = 400,
    CANVAS_HEIGHT = 400;

const BACKGROUND_COLOR = 28,
    REDRAW_BACKGROUND = true;

const PERIOD_1_1 = {
  // Time it takes to animate an entire period, in seconds.
  duration: 2,
  // Maps the current "time", [0, 1), to the current mode.
  // Time is normalized so that a period has length 1.
  modeFn: (t) => floor(2 * t),
  // Determines the duration of the current mode.
  // Result should be normalized such that the sum of the durations for each mode equals 1.
  modeDurationFn: () => .5,
  // Start time of each subinterval, normalized to a period of 1. In other words:
  // subintervalStart[i+1] - subintervalStart[i] = modeDurationFn(i)
  // Should include an ending 1.
  subintervalStart: [0, .5, 1]
};

const PERIOD_1_1_1 = {
  // Time it takes to animate an entire period, in seconds.
  duration: 3,
  // Maps the current "time", [0, 1), to the current mode.
  // Time is normalized so that a period has length 1.
  modeFn: (t) => floor(3 * t),
  // Determines the duration of the current mode.
  // Result should be normalized such that the sum of the durations for each mode equals 1.
  modeDurationFn: () => 1/3,
  // Start time of each subinterval, normalized to a period of 1. In other words:
  // subintervalStart[i+1] - subintervalStart[i] = modeDurationFn(i)
  // Should include an ending 1.
  subintervalStart: [0, 1/3, 2/3, 1]
};

const PERIOD_1_1_1_1 = {
  // Time it takes to animate an entire period, in seconds.
  duration: 4,
  // Maps the current "time", [0, 1), to the current mode.
  // Time is normalized so that a period has length 1.
  modeFn: (t) => floor(4 * t),
  // Determines the duration of the current mode.
  // Result should be normalized such that the sum of the durations for each mode equals 1.
  modeDurationFn: () => .25,
  // Start time of each subinterval, normalized to a period of 1. In other words:
  // subintervalStart[i+1] - subintervalStart[i] = modeDurationFn(i)
  // Should include an ending 1.
  subintervalStart: [0, 0.25, 0.5, 0.75, 1]
};

// See comments in PERIOD_1_1 for expected values.
const PERIOD_CONFIG = PERIOD_1_1_1;

const UNIT_PIXELS = 30;

const EXPORT_GIF = false,
    RECORD_FRAMES = FPS * PERIOD_CONFIG.duration;

let gif = new GIF({
  debug: true,
  quality: 0,
  workerScript: "./gif.worker.js",
  workers: 5
});

gif.on('finished', function (blob) {
  window.open(URL.createObjectURL(blob));
});

function setup() {
  frameRate(FPS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
  // ortho(-CANVAS_WIDTH/2, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, -CANVAS_HEIGHT/2);
}

var px = CANVAS_WIDTH/4, py = CANVAS_HEIGHT/2;

function draw() {
  translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
  const rows = CANVAS_WIDTH / UNIT_PIXELS,
      cols = CANVAS_HEIGHT / UNIT_PIXELS;

  const intervalFrames = FPS * PERIOD_CONFIG.duration,
      intervalFraction = (frameCount % intervalFrames) / intervalFrames,
      mode = PERIOD_CONFIG.modeFn(intervalFraction);
  const subintervalTime = intervalFraction - PERIOD_CONFIG.subintervalStart[mode],
      subintervalFraction = subintervalTime / PERIOD_CONFIG.modeDurationFn(mode);

  noStroke();
  switch (mode) {
    case 0:
    case 2:
      background(0);
      fill(255);
      for (let i = -2; i <= rows+2; i++) {
        direction = 1;
        // direction = 2*(i%2) - 1;
        for (let j = (i + mode) % 2 - 2; j <= cols+2; j += 2) {
          x = j * UNIT_PIXELS;
          y = i * UNIT_PIXELS;

          transform(
              x, y,
              subintervalFraction,
              (percentage) => {
                translate(2 * direction * UNIT_PIXELS * percentage, 0);
                rotateZ(-HALF_PI * percentage);
              },
              () => square(-UNIT_PIXELS / 2, -UNIT_PIXELS / 2, UNIT_PIXELS)
          );
        }
      }
      break;
    case 1:
      background(255);
      fill(0);
      // for (let i = 0; i <= rows; i++) {
      //   for (let j = (i + mode) % 2; j <= cols; j += 2) {
      //     x = j * UNIT_PIXELS;
      //     y = i * UNIT_PIXELS;
      //     rotateSquare(x, y, UNIT_PIXELS, HALF_PI, subintervalFraction);
      //   }
      // }

      for (let i = -2; i <= rows+2; i++) {
        direction = -1;
        // direction = 2*(i%2) - 1;
        for (let j = (i + mode) % 2 - 2; j <= cols*2; j += 2) {
          x = j * UNIT_PIXELS;
          y = i * UNIT_PIXELS;

          transform(
              x, y,
              subintervalFraction,
              (percentage) => {
                // translate(0, 2 * direction * UNIT_PIXELS * percentage);
                translate(4 * direction * UNIT_PIXELS * percentage, 2 * direction * UNIT_PIXELS * percentage);
                rotateZ(-HALF_PI * percentage);
              },
              () => square(-UNIT_PIXELS / 2, -UNIT_PIXELS / 2, UNIT_PIXELS)
          );
        }
      }
      break;
    case 3:
      background(255);
      fill(0);
      for (let i = 0; i <= rows; i++) {
        for (let j = (i + mode) % 2; j <= cols; j += 2) {
          x = j * UNIT_PIXELS;
          y = i * UNIT_PIXELS;
          // direction = 2*(i%2) - 1;
          direction = i % 2;
          translateSquare(x, y, UNIT_PIXELS, 2 * direction * UNIT_PIXELS, 0, subintervalFraction);
        }
      }
      break;
    default:
      throw("unexpected!");
  }

  strokeWeight(1);
  stroke("#00f");
  noFill();

  let s = ((frameCount/(2*intervalFrames))%1);
  // line(px, 0, px, CANVAS_HEIGHT);
  push();
  translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  rotate(TWO_PI * frameCount/intervalFrames);
  square(-30, -30, 60);
  pop();
  // if (mode !== 1) {
  //   px = (px + CANVAS_WIDTH/intervalFrames/2) % CANVAS_WIDTH;
  //   // px = (px + CANVAS_WIDTH * frameCount / (4 * intervalFrames)) % CANVAS_WIDTH;
  // }
  // line(CANVAS_WIDTH * s, 0, CANVAS_WIDTH * s, CANVAS_HEIGHT);
  // // point(px, py);
  // let r = noise(px, py, frameCount/intervalFrames);
  // px += 3 * cos(r*TWO_PI);
  // py += 3 * sin(r*TWO_PI);

  if (EXPORT_GIF) {
    if (frameCount <= RECORD_FRAMES) {
      gif.addFrame(canvas, {
        delay: 1000 / FPS,
        copy: true
      });
    }
    if (frameCount === RECORD_FRAMES) {
      gif.render();
    }
  }
}

/**
 * Draws a rotating square.
 *
 * The square is centered at (x, y) and has the specified side length.
 * Starts at a rotation of 0, and is drawn at an angle equal to rotationAmount * rotationPercentage, rotating counterclockwise.
 *
 * @param x  the center x coordinate
 * @param y  the center y coordinate
 * @param length  the side length of the square
 * @param rotationAmount  the total amount to rotate
 * @param rotationPercentage  the percentage to rotate the square
 */
function rotateSquare(x, y, length, rotationAmount, rotationPercentage) {
  push();
  translate(x, y);
  rotateZ(-rotationAmount * rotationPercentage);
  // rotateX(-rotationAmount * rotationPercentage);
  square(-length / 2, -length / 2, length);
  // box(length);
  pop();
}

/**
 * Draws a (frame of a) square being translated.
 *
 * @param x  the center x coordinate of the square
 * @param y  the center y coordinate of the square
 * @param length  the side length of the square
 * @param xOffset  the x offset to move the square to
 * @param yOffset  the y offset to move the square to
 * @param percentage  the fraction of the animation that has completed
 */
function translateSquare(x, y, length, xOffset, yOffset, percentage) {
  push();
  let cx = x + xOffset * percentage,
      cy = y + yOffset * percentage;
  translate(cx, cy);
  square(-length / 2, -length / 2, length);
  pop();
}

function transform(x, y, percentage, transformationFn, drawFn) {
  push();
  translate(x, y);
  transformationFn(percentage);
  drawFn();
  pop();
}