import Particle from "../../src/Particle.mjs";
import Vec2D from "../../src/Vec2D.mjs";
import Link from "../../src/Link.mjs";
import draw from "./draw.mjs";

// Simulation
const simulate = () => {
  // Crane mass points
  const mpA = new Particle(new Vec2D(2, 0));
  const mpB = new Particle(new Vec2D(2, -1));
  const mpC = new Particle(new Vec2D(2, 1.5), 10);
  const mpD = new Particle(new Vec2D(0, 0));
  const mpE1 = new Particle(new Vec2D(3.5, 1.5), 10);
  const mpE2 = new Particle(new Vec2D(2, 4), 10);

  // Load
  const mpLoad = new Particle(new Vec2D(2, 3), document.querySelector("[data-load]").value);

  // Links
  const lLever = new Link(mpC, mpD);
  const lEnclosure = new Link(mpB, mpC);
  const lEnclosureBE1 = new Link(mpB, mpE1);
  const lEnclosureE1E2 = new Link(mpE1, mpE2);
  const lEnclosureCE1 = new Link(mpC, mpE1);
  const lEnclosureCE2 = new Link(mpC, mpE2);

  // Rope
  const lRope = new Link(mpE2, mpLoad, false);
  lRope._springConstant = 500;

  // Update queue
  const updateQueue = [
    lEnclosure,
    lLever,
    lEnclosureBE1,
    lEnclosureE1E2,
    lEnclosureCE1,
    lEnclosureCE2,
    lRope,
    mpC,
    mpE1,
    mpE2,
    mpLoad,
  ];

  // Storage data for animation
  const frames = {
    posB: [],
    posC: [],
    posE1: [],
    posE2: [],
    posLoad: [],
    stressLever: [],
    stressEnclosure: [],
    stressEnclosureBE1: [],
    stressEnclosureE1E2: [],
    stressEnclosureCE1: [],
    stressEnclosureCE2: [],
  };

  // Rotation speed
  const speed = document.querySelector("[data-speed]").value;

  // Simulation data
  const duration = document.querySelector("[data-duration]").value;
  const steps = document.querySelector("[data-steps]").value;
  const durationPerStep = duration / steps;

  for (let index = 1; index < steps; index++) {
    // Timestamp
    const time = index * durationPerStep;

    // Engine power (rotate mass point B)
    mpB._position.set(new Vec2D(0, -1).rotate(time * speed).add(mpA.position));

    // Update all nessesary links and mass points
    updateQueue.forEach((element) => {
      element.update(time);
    });

    // Record data
    frames.posB.push(mpB.position.clone());
    frames.posC.push(mpC.position.clone());
    frames.posE1.push(mpE1.position.clone());
    frames.posE2.push(mpE2.position.clone());
    frames.posLoad.push(mpLoad.position.clone());
    frames.stressLever.push(lLever.destroyed ? null : lLever.springForce);
    frames.stressEnclosure.push(lEnclosure.destroyed ? null : lEnclosure.springForce);
    frames.stressEnclosureBE1.push(lEnclosureBE1.destroyed ? null : lEnclosureBE1.springForce);
    frames.stressEnclosureE1E2.push(lEnclosureE1E2.destroyed ? null : lEnclosureE1E2.springForce);
    frames.stressEnclosureCE1.push(lEnclosureCE1.destroyed ? null : lEnclosureCE1.springForce);
    frames.stressEnclosureCE2.push(lEnclosureCE2.destroyed ? null : lEnclosureCE2.springForce);
  }

  // Loading finished
  document.querySelector("#canvas-wrapper").classList.remove("loading");

  const start = Date.now();
  const animate = () => {
    // Calc frame / array index
    const indexFrame = Math.floor((Date.now() - start) / 1000 / durationPerStep);

    // Return if animation finished
    if (indexFrame + 1 >= steps) return;

    // Draw canvas
    draw(mpA, mpD, frames, indexFrame);

    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);
};

window.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector("#canvas-wrapper").classList.add("loading");
  window.setTimeout(simulate, 500);
});

simulate();
