import { Particle, Vec2D, Link } from "../../whiskey-kinetics.mjs";

onmessage = (e) => {
  // Crane mass points
  const mpA = new Particle(new Vec2D(e.data.mpA.x, e.data.mpA.y));
  const mpB = new Particle(new Vec2D(e.data.mpB.x, e.data.mpB.y));
  const mpC = new Particle(new Vec2D(e.data.mpC.x, e.data.mpC.y), e.data.mpC.mass);
  const mpD = new Particle(new Vec2D(e.data.mpD.x, e.data.mpD.y));
  const mpE1 = new Particle(new Vec2D(e.data.mpE1.x, e.data.mpE1.y), e.data.mpE1.mass);
  const mpE2 = new Particle(new Vec2D(e.data.mpE2.x, e.data.mpE2.y), e.data.mpE2.mass);

  // Load
  const mpLoad = new Particle(new Vec2D(2, 3), e.data.load);

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
  const speed = e.data.speed;

  // Simulation data
  const duration = e.data.duration;
  const steps = e.data.steps;
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

  // Simulation is done
  postMessage({ frames, durationPerStep, duration, steps, mpA: e.data.mpA, mpD: e.data.mpD });
};
