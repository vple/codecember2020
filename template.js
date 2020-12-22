const FPS = 30;

const CANVAS_WIDTH = 400,
    CANVAS_HEIGHT = 400;

const BACKGROUND_COLOR = 28,
    REDRAW_BACKGROUND = true;

const EXPORT_GIF = false,
    RECORD_FRAMES = FPS * 2;

if (EXPORT_GIF) {
  let gif = new GIF({
    quality: 0,
    workerScript: "./js/gif.worker.js",
    workers: 5
  });

  gif.on('finished', function (blob) {
    window.open(URL.createObjectURL(blob));
  });
}

function setup() {
  frameRate(FPS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
  if (REDRAW_BACKGROUND) {
    background(BACKGROUND_COLOR);
  }

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