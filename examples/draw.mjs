const white = "rgb(255, 255, 255)";
const gray = "rgb(194, 194, 194)";
const black = "rgb(56, 56, 56)";

export default class TCanvas {
  constructor(ctx, scale = 1, dx = 0, dy = 0) {
    this._ctx = ctx;
    this._canvasWidth = ctx.canvas.width;
    this._canvasHeight = ctx.canvas.height;
    this._scale = scale;
    this._dx = dx;
    this._dy = dy;
  }

  clear() {
    this._ctx.fillStyle = white;
    this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
    return this;
  }

  drawGrid() {
    const gridsize = 50;
    const totalX = Math.floor(this._canvasWidth / gridsize) + 1;
    const totalY = Math.floor(this._canvasHeight / gridsize) + 1;
    const gap = gridsize / 2;
    this._ctx.strokeStyle = gray;
    for (let index = 0; index < totalX; index++) {
      const x = index * gridsize;
      this._ctx.moveTo(x - gap, 0);
      this._ctx.lineTo(x - gap, this._canvasHeight);
    }
    for (let index = 0; index < totalY; index++) {
      const y = index * gridsize;
      this._ctx.moveTo(0, y - gap);
      this._ctx.lineTo(this._canvasWidth, y - gap);
    }
    this._ctx.lineWidth = 1;
    this._ctx.stroke();
    return this;
  }

  drawParticle(x, y, r = 7, style = {}) {
    this._ctx.beginPath();
    this._ctx.arc(
      x * this._scale + this._dx,
      this._canvasHeight - y * this._scale - this._dy,
      r,
      0,
      2 * Math.PI,
      false
    );
    this._ctx.fillStyle = white;
    if (style.fill) {
      this._ctx.fillStyle = black;
    }
    if (style.dash) {
      this._ctx.setLineDash([10]);
    }
    this._ctx.fill();
    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = black;
    this._ctx.stroke();
    this._ctx.setLineDash([]);
    return this;
  }

  drawBearingFixed(x, y, orientation, size = 30) {
    this._ctx.beginPath();
    this._ctx.moveTo(x * this._scale + this._dx, this._canvasHeight - y * this._scale - this._dy);
    if (orientation === "top") {
      this._ctx.lineTo(
        x * this._scale + this._dx + size / 2,
        this._canvasHeight - y * this._scale - this._dy - size / 2
      );
      this._ctx.lineTo(
        x * this._scale + this._dx - size / 2,
        this._canvasHeight - y * this._scale - this._dy - size / 2
      );
    } else if (orientation === "right") {
      this._ctx.lineTo(
        x * this._scale + this._dx + size / 2,
        this._canvasHeight - y * this._scale - this._dy - size / 2
      );
      this._ctx.lineTo(
        x * this._scale + this._dx + size / 2,
        this._canvasHeight - y * this._scale - this._dy + size / 2
      );
    } else if (orientation === "left") {
      this._ctx.lineTo(
        x * this._scale + this._dx - size / 2,
        this._canvasHeight - y * this._scale - this._dy - size / 2
      );
      this._ctx.lineTo(
        x * this._scale + this._dx - size / 2,
        this._canvasHeight - y * this._scale - this._dy + size / 2
      );
    } else if (orientation === "bottom") {
      this._ctx.lineTo(
        x * this._scale + this._dx + size / 2,
        this._canvasHeight - y * this._scale - this._dy + size / 2
      );
      this._ctx.lineTo(
        x * this._scale + this._dx - size / 2,
        this._canvasHeight - y * this._scale - this._dy + size / 2
      );
    }
    this._ctx.closePath();
    this._ctx.fillStyle = gray;
    this._ctx.strokeStyle = black;
    this._ctx.lineWidth = 4;
    this._ctx.stroke();
    this._ctx.fill();
  }

  drawLink(x1, y1, x2, y2, style = {}) {
    if (style.stress === null) return;
    this._ctx.beginPath();
    this._ctx.moveTo(x1 * this._scale + this._dx, this._canvasHeight - y1 * this._scale - this._dy);
    this._ctx.lineTo(x2 * this._scale + this._dx, this._canvasHeight - y2 * this._scale - this._dy);
    if (typeof style.stress === "number") {
      this._ctx.lineWidth = 8;
      this._ctx.strokeStyle = TCanvas.getColorCodeByStress(style.stress);
    } else {
      this._ctx.lineWidth = 2;
      this._ctx.strokeStyle = black;
    }
    if (style.lineWidth) {
      this._ctx.lineWidth = style.lineWidth;
    }
    this._ctx.stroke();
    return this;
  }

  static getColorCodeByStress(stress) {
    const colored = stress * 765;
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
    } else if (colored <= 765) {
      r = 255;
      g = 765 - colored;
      b = 0;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }
}
