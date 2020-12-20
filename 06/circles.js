// https://editor.p5js.org/vple/sketches/bM7SlsQI2

const CANVAS_WIDTH = 400,
  CANVAS_HEIGHT = 400,
  FPS = 20;

const LAYERS = 20,
  THICKNESS = 6,
  MIN_FRAMES_PER_REVOLUTION = FPS * 3,
  MIN_ANGLE = 0,
  MAX_ANGLE = 0.85 // expressed as a percentage of a full circle
;

const CENTER_OFFSET = 10,
  MARGIN = 2;

var layers = [];

function setup() {
  frameRate(FPS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  for (var i = 0; i < LAYERS; i++) {
    // revolutions per frame
    let rpf = random(0, 1 / MIN_FRAMES_PER_REVOLUTION);

    let layer = {
      index: i,
      radius: layerRadius(i),
      speed: random([-1, 1]) * TWO_PI * rpf,
      angle: random(0, MAX_ANGLE * TWO_PI),
      color: color(128)
    };
    layers.push(layer);
  }
}

function draw() {
  background(28);

  translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  noFill();

  strokeWeight(1);
  // stroke(255, 0, 0);
  // arc(0, 0, 2*CENTER_OFFSET, 2*CENTER_OFFSET, 0, TWO_PI);

  strokeWeight(THICKNESS);
  stroke(255);

  for (var i = 0; i < LAYERS; i++) {
    let layer = layers[i];
    // stroke(255 - 30*(frameCount * layer.speed / TWO_PI));
    stroke(layer.color);
    arc(0, 0, 2 * layer.radius, 2 * layer.radius, frameCount * layer.speed, layer.angle + frameCount * layer.speed);
    layer.speed = 
      layer.speed + acceleration(layer, frameCount)/5000;
    
    layer.color.setRed(
      max(30, min(255, red(layer.color) + 10 * acceleration(layer, frameCount)))
    );
    layer.color.setGreen(
      max(30, min(255, green(layer.color) + 5 * acceleration(layer, frameCount)))
    );
    layer.color.setBlue(
      max(30, min(255, blue(layer.color) + 20 * acceleration(layer, frameCount)))
    );
  }
}

function layerRadius(layerNumber) {
  return CENTER_OFFSET + (layerNumber * THICKNESS) + (layerNumber * MARGIN);
}

function acceleration(layer, frameCount) {
  return (noise(layer.index, frameCount / FPS) - 0.5);
}