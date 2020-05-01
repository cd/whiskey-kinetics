const ctx = document.querySelector('#canvas').getContext('2d');
const scale = 60;
const canvasHeight = 400;
const canvasWidth = 600;
const radius = 0.2;
const scaleStress = 410 / 3000;
const gapX = 300;
const gapY = 100;

// Colors
const white1 = 'rgb(246, 245, 238)';
const white2 = 'rgb(232, 231, 225)';
const gray1 = 'rgb(203, 203, 196)';
const gray2 = 'rgb(185, 185, 178)';
const black1 = 'rgb( 57, 57, 55 )';
const black2 = 'rgb( 35, 35, 34 )';

/**
 * TODO
 * @param {Particle} A
 * @param {Particle} D
 * @param {Array} frames
 * @param {number} indexFrame
 */
export default function (A, D, frames, indexFrame) {
  drawEnvironment(A);
  drawEngine(A.position.x, A.position.y);
  if (frames.stressLever[indexFrame] !== null) {
    drawSpring(
      frames.posC[indexFrame].x,
      frames.posC[indexFrame].y,
      D.position.x,
      D.position.y,
      Math.abs(frames.stressLever[indexFrame]) * scaleStress
    );
  }
  if (frames.stressEnclosure[indexFrame] !== null) {
    drawSpring(
      frames.posB[indexFrame].x,
      frames.posB[indexFrame].y,
      frames.posC[indexFrame].x,
      frames.posC[indexFrame].y,
      Math.abs(frames.stressEnclosure[indexFrame]) * scaleStress
    );
  }
  if (frames.stressEnclosureBE1[indexFrame] !== null) {
    drawSpring(
      frames.posB[indexFrame].x,
      frames.posB[indexFrame].y,
      frames.posE1[indexFrame].x,
      frames.posE1[indexFrame].y,
      Math.abs(frames.stressEnclosureBE1[indexFrame]) * scaleStress
    );
  }
  if (frames.stressEnclosureE1E2[indexFrame] !== null) {
    drawSpring(
      frames.posE1[indexFrame].x,
      frames.posE1[indexFrame].y,
      frames.posE2[indexFrame].x,
      frames.posE2[indexFrame].y,
      Math.abs(frames.stressEnclosureE1E2[indexFrame]) * scaleStress
    );
  }
  if (frames.stressEnclosureCE2[indexFrame] !== null) {
    drawSpring(
      frames.posC[indexFrame].x,
      frames.posC[indexFrame].y,
      frames.posE2[indexFrame].x,
      frames.posE2[indexFrame].y,
      Math.abs(frames.stressEnclosureCE2[indexFrame]) * scaleStress
    );
  }
  if (frames.stressEnclosureCE1[indexFrame] !== null) {
    drawSpring(
      frames.posC[indexFrame].x,
      frames.posC[indexFrame].y,
      frames.posE1[indexFrame].x,
      frames.posE1[indexFrame].y,
      Math.abs(frames.stressEnclosureCE1[indexFrame]) * scaleStress
    );
  }
  drawPoint(frames.posB[indexFrame].x, frames.posB[indexFrame].y);
  drawPoint(frames.posC[indexFrame].x, frames.posC[indexFrame].y);
  drawPoint(D.position.x, D.position.y);
  drawPoint(frames.posE1[indexFrame].x, frames.posE1[indexFrame].y);
  drawPoint(frames.posE2[indexFrame].x, frames.posE2[indexFrame].y);
  drawRope(
    frames.posE2[indexFrame].x,
    frames.posE2[indexFrame].y,
    frames.posLoad[indexFrame].x,
    frames.posLoad[indexFrame].y
  );
  drawLoad(frames.posLoad[indexFrame].x, frames.posLoad[indexFrame].y);
}

const drawEnvironment = (A) => {
  const background = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  background.addColorStop(0, white1);
  background.addColorStop(1, white2);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const ground = ctx.createLinearGradient(
    0,
    canvasHeight - A.position.y * scale - gapY,
    0,
    canvasHeight
  );
  ground.addColorStop(0, black1);
  ground.addColorStop(1, black2);
  ctx.fillStyle = ground;
  ctx.fillRect(
    0,
    canvasHeight - A.position.y * scale - gapY,
    canvasWidth,
    canvasHeight
  );
};

const drawRope = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1 * scale + gapX, canvasHeight - y1 * scale - gapY);
  ctx.lineTo(x2 * scale + gapX, canvasHeight - y2 * scale - gapY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = black2;
  ctx.stroke();
};

const drawLoad = (x, y) => {
  ctx.beginPath();
  ctx.arc(
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    radius * scale * 2,
    0,
    2 * Math.PI,
    false
  );
  const grd = ctx.createRadialGradient(
    (x - radius / 2) * scale + gapX,
    canvasHeight - (y + radius / 2) * scale - gapY,
    (radius * scale) / 2,
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    radius * scale * 2
  );
  grd.addColorStop(0, black1);
  grd.addColorStop(1, black2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = black2;
  ctx.stroke();
};

const drawEngine = (x, y) => {
  ctx.beginPath();
  ctx.arc(
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    1 * scale,
    0,
    2 * Math.PI,
    false
  );
  const grd = ctx.createRadialGradient(
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    0,
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    1 * scale // todo
  );
  grd.addColorStop(0, gray1);
  grd.addColorStop(1, gray2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = black2;
  ctx.stroke();
};

const drawPoint = (x, y) => {
  ctx.beginPath();
  ctx.arc(
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    radius * scale,
    0,
    2 * Math.PI,
    false
  );
  const grd = ctx.createRadialGradient(
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    0,
    x * scale + gapX,
    canvasHeight - y * scale - gapY,
    radius * scale
  );
  grd.addColorStop(0, gray2);
  grd.addColorStop(1, gray1);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = gray2;
  ctx.stroke();
};

const drawSpring = (x1, y1, x2, y2, colored, showRed = true) => {
  const from = [x1 * scale + gapX, canvasHeight - y1 * scale - gapY];
  const to = [x2 * scale + gapX, canvasHeight - y2 * scale - gapY];
  ctx.lineWidth = 10;
  if (showRed) {
    ctx.beginPath();
    ctx.moveTo(...from);
    ctx.lineTo(...to);
    let r = 100;
    let g = 100;
    if (colored < 155) {
      r += colored;
      g += colored;
    } else {
      r = 255;
      g = 255 - (colored - 155);
    }
    ctx.strokeStyle = `rgb(${r}, ${g}, 70)`;
    ctx.stroke();
  }
};
