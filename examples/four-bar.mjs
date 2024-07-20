import draw from "./four-bar-draw.mjs";

// Exit signal for the animation in the case that the user starts a new simulation
let exitAnimation;

// Create web worker that does the calculation of all frames
const worker = new Worker("four-bar-worker.mjs", { type: "module" });

// Start the simulation (calculate all frames) if the user hits the button
document.querySelector("#four-bar").addEventListener("submit", (e) => {
  e.preventDefault();
  exitAnimation = true;
  document.querySelector("#four-bar .canvas-wrapper").classList.add("loading");
  worker.postMessage({
    load: Number(document.querySelector("#four-bar [data-load]").value),
    speed: Number(document.querySelector("#four-bar [data-speed]").value),
  });
});

// Draw calculated frames
worker.onmessage = async (e) => {
  if (e.data.progress) {
    document.querySelector("#four-bar .progress-bar").style.width = e.data.progress * 200 + "px";
    return;
  }

  document.querySelector("#four-bar .canvas-wrapper").classList.remove("loading");
  document.querySelector("#four-bar .progress-bar").style.width = "1px";
  exitAnimation = false;
  const start = Date.now();
  const animateFrame = () => {
    const frameIndex = Math.floor(((Date.now() - start) / 1000) * e.data.fps);
    if (!e.data.frames.posB[frameIndex] || exitAnimation) return;
    draw(frameIndex, e.data);
    window.requestAnimationFrame(animateFrame);
  };
  animateFrame();
};
