import draw from "./draw.mjs";

// Exit signal for the animation in the case that the user starts a new simulation
let exitAnimation;

// Start the simulation (calculate all frames) if the user hits the button
window.addEventListener("submit", (e) => {
  e.preventDefault();
  exitAnimation = true;
  document.querySelector("#canvas-wrapper").classList.add("loading");
  worker.postMessage({
    mpA: { x: 2, y: 0 },
    mpB: { x: 2, y: -1 },
    mpC: { x: 2, y: 1.5, mass: 5 },
    mpD: { x: 0, y: 0 },
    mpE1: { x: 3.5, y: 1.5, mass: 5 },
    mpE2: { x: 2, y: 4, mass: 5 },
    load: document.querySelector("[data-load]").value,
    speed: document.querySelector("[data-speed]").value,
    duration: 20,
    steps: 50000,
  });
});

// Web worker that does the calculation of all frames
const worker = new Worker("worker.mjs", { type: "module" });

// Draw calculated frames
worker.onmessage = async (e) => {
  document.querySelector("#canvas-wrapper").classList.remove("loading");
  exitAnimation = false;
  const start = Date.now();
  const animateFrame = () => {
    const indexFrame = Math.floor((Date.now() - start) / 1000 / e.data.durationPerStep);
    if (indexFrame + 1 > e.data.steps || exitAnimation) return;
    draw(e.data.mpA, e.data.mpD, e.data.frames, indexFrame);
    window.requestAnimationFrame(animateFrame);
  };
  animateFrame();
};
