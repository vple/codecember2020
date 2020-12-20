// https://editor.p5js.org/vple/sketches/kB2EuqiFw

var canvasWidth = 400,
  canvasHeight = 400;

const BACKGROUND_COLOR = 0;
const DEFAULT_STROKE_COLOR = 255;

const SCALE = 50; // How much to "zoom in" to determine Perlin noise.
const RESOLUTION = 7;
const STEP_LENGTH = 5; // How far a particle should travel in each step.
const DEFAULT_ITERATIONS = 20;

function setup() {
  frameRate(1);
  createCanvas(400, 400);
}

function draw() {
  background(BACKGROUND_COLOR);
  // stroke(0);

  let cols = canvasWidth / RESOLUTION,
    rows = canvasHeight / RESOLUTION;

  var particles = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      particles.push({
        x: i * RESOLUTION,
        y: j * RESOLUTION
      });
    }
  }

  var colors = ["#03254c", "#1167b1", "#187bcd", "#2a9df4", "#d0efff"];

  var layerParticles = [];
  for (i = 0; i < colors.length; i++) {
    layerParticles.push([]);
  }
  for (i = 0; i < particles.length; i++) {
    layerParticles[i % colors.length].push(particles[i]);
  }

  for (i = 0; i < colors.length; i++) {
    let c = color(colors[i]);
    c.setAlpha(1);
    stroke(c);
    strokeWeight(3);

    let layer = {
      particles: layerParticles[i],
      drawFunction: function(current, next) {
        // line
        // line(current.x, current.y, next.x, next.y);
        
        // bezier
        noFill();
        circle((current.x + next.x)/2, (current.y + next.y)/2, random(5, 80));
        // triangle(current.x, current.y, next.x, next.y, current.x, next.y);
      }
    };
    drawLayer(layer)
  }

  // var layer = {
  //   particles: particles,
  //   drawFunction: function(current, next) {
  //     line(current.x, current.y, next.x, next.y);
  //   }
  // };

  // strokeWeight(3);
  // stroke(DEFAULT_STROKE_COLOR, 5);
  // drawLayer(layer);

  noLoop();
}

/**
 * Transforms a coordinate on the canvas to a coordinate in the force field.
 *
 * The Perlin function is continuous on small intervals--much smaller than the discrete coordinates in the canvas space. In other words, this allows us to zoom in so we actually see continuity from Perlin noise.
 *
 * @param {object} coordinate A coordinate in the canvas coordinate system.
 */
function canvas2field(coordinate) {
  return {
    x: coordinate.x / SCALE,
    y: coordinate.y / SCALE
  };
}

/**
 * Transforms a coordinate in the force field to a coordinate on the canvas.
 *
 * @param {object} coordinate A coordinate in the force field coordinate system.
 */
function field2Canvas(coordinate) {
  return {
    x: coordinate.x * SCALE,
    y: coordinate.y * SCALE
  };
}

/**
 * Returns the angle (in radians) specified by the Perlin noise function, at the given canvas coordinate.
 *
 * @param {object} cCoordinate A coordinate in the canvas coordinate system.
 */
function cNoiseAngle(cCoordinate) {
  const fCoordinate = canvas2field(cCoordinate),
    random = noise(fCoordinate.x, fCoordinate.y);
  return random * 2 * PI;
}

/**
 * Draws a particle as it travels through the Perlin noise field.
 * Does not draw if the given coordinate is out of bounds of the canvas.
 *
 * @param {object} cCoordiante A coordinate in the canvas coordinate system.
 * @param {function(current, next): undefined} drawFunction A function that takes the current and next particle position (in canvas coordinates) and draws something.
 * @param {integer} iterations The number of steps to draw for each particle. A negative number is infinite.
 */
function drawParticle(cCoordinate, drawFunction, iterations = DEFAULT_ITERATIONS) {
  if (!isInBounds(cCoordinate)) {
    return;
  }
  if (iterations == 0) {
    return;
  }

  const angle = cNoiseAngle(cCoordinate);
  const next = {
    x: cCoordinate.x + cos(angle) * STEP_LENGTH,
    y: cCoordinate.y + sin(angle) * STEP_LENGTH
  };

  drawFunction(cCoordinate, next);

  drawParticle(next, drawFunction, iterations - 1);
}

function drawLayer(layer) {
  const particles = layer.particles || [];
  for (var i = 0; i < particles.length; i++) {
    drawParticle(particles[i], layer.drawFunction);
  }
}

function isInBounds(cCoordinate) {
  return (
    cCoordinate.x >= 0 &&
    cCoordinate.x < canvasWidth &&
    cCoordinate.y >= 0 &&
    cCoordinate.y < canvasHeight);
}