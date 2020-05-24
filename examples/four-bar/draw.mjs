const ctx = document.querySelector('#canvas').getContext('2d');
const scale = 60;
const canvasHeight = 400;
const canvasWidth = 600;
const radius = 0.2;
const scaleStress = 765 / 3000;
const gapX = 300;
const gapY = 100;

// Colors
const white1 = 'white';
const white2 = 'white';
const gray1 = 'rgb(194, 194, 194)';
const gray2 = 'rgb(161, 161, 161)';
const black1 = 'rgb(56, 56, 56)';
const black2 = 'rgb(41, 41, 41)';

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
  drawGrid();
  ctx.strokeStyle = white2;
  ctx.moveTo(0, canvasHeight - A.position.y * scale - gapY);
  ctx.lineTo(canvasWidth, canvasHeight - A.position.y * scale - gapY);
};

const drawGrid = () => {
  const gridsize = 50;
  const totalX = Math.floor(canvasWidth / gridsize) + 1;
  const totalY = Math.floor(canvasHeight / gridsize) + 1;
  const gap = gridsize / 2;
  ctx.strokeStyle = gray1;
  for (let index = 0; index < totalX; index++) {
    const x = index * gridsize;
    ctx.moveTo(x - gap, 0);
    ctx.lineTo(x - gap, canvasHeight);
  }
  for (let index = 0; index < totalY; index++) {
    const y = index * gridsize;
    ctx.moveTo(0, y - gap);
    ctx.lineTo(canvasWidth, y - gap);
  }
  ctx.lineWidth = 1;
  ctx.stroke();
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
  ctx.lineWidth = 2;
  ctx.strokeStyle = black1;
  ctx.setLineDash([10]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0 * scale + gapX, canvasHeight - 0 * scale - gapY);
  ctx.lineTo(0.5 * scale + gapX, canvasHeight + 0.5 * scale - gapY);
  ctx.lineTo(-0.5 * scale + gapX, canvasHeight + 0.5 * scale - gapY);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
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
  grd.addColorStop(0, white1);
  grd.addColorStop(1, white1);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = black1;
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
    let r = 0;
    let g = 0;
    let b = 255;
    if (colored <= 255) {
      g += colored;
      b -= colored;
    } else if (colored <= 510) {
      r = colored - 255;
      g = 255;
      b = 0;
    } else {
      r = 255;
      g = 765 - colored;
      b = 0;
    }
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.stroke();
  }
};
