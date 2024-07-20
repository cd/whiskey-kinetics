import { Particle, Vec2D, Link } from "../../whiskey-kinetics.mjs";

onmessage = (e) => {
  // Rotation speed
  const speed = e.data.speed;

  // Crane mass points
  const mpA = new Particle(new Vec2D(2, 0), 5);
  const mpB = new Particle(new Vec2D(2, -1), 5);
  const mpC = new Particle(new Vec2D(2, 1.5), 5);
  const mpD = new Particle(new Vec2D(0, 0), 5);
  const mpE1 = new Particle(new Vec2D(3.5, 1.5), 5);
  const mpE2 = new Particle(new Vec2D(2, 4), 5);

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

  // Create update queue
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

  // Simulation parameters
  const duration = 20;
  const steps = 500000;
  const durationPerStep = duration / steps;

  // Animation parameters
  const fps = 60;
  const denominator = Math.round(steps / duration / fps);

  // Frame data for the animation
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

  for (let i = 1; i < steps; i++) {
    // Timestamp
    const time = i * durationPerStep;

    // Engine power (rotate mass point B)
    mpB._position.set(new Vec2D(0, -1).rotate(time * speed).add(mpA.position));

    // Update all nessesary links and mass points
    updateQueue.forEach((element) => {
      element.update(time);
    });

    // Record frame data
    if (i % denominator === 0) {
      frames.posB.push([mpB.position.x, mpB.position.y]);
      frames.posC.push([mpC.position.x, mpC.position.y]);
      frames.posE1.push([mpE1.position.x, mpE1.position.y]);
      frames.posE2.push([mpE2.position.x, mpE2.position.y]);
      frames.posLoad.push([mpLoad.position.x, mpLoad.position.y]);
      frames.stressLever.push(
        lLever.springForce === null ? null : Math.abs(lLever.springForce / lLever.maxSpringForce)
      );
      frames.stressEnclosure.push(
        lEnclosure.springForce === null ? null : Math.abs(lEnclosure.springForce / lEnclosure.maxSpringForce)
      );
      frames.stressEnclosureBE1.push(
        lEnclosureBE1.springForce === null ? null : Math.abs(lEnclosureBE1.springForce / lEnclosureBE1.maxSpringForce)
      );
      frames.stressEnclosureE1E2.push(
        lEnclosureE1E2.springForce === null
          ? null
          : Math.abs(lEnclosureE1E2.springForce / lEnclosureE1E2.maxSpringForce)
      );
      frames.stressEnclosureCE1.push(
        lEnclosureCE1.springForce === null ? null : Math.abs(lEnclosureCE1.springForce / lEnclosureCE1.maxSpringForce)
      );
      frames.stressEnclosureCE2.push(
        lEnclosureCE2.springForce === null ? null : Math.abs(lEnclosureCE2.springForce / lEnclosureCE2.maxSpringForce)
      );
    }

    // Send progress every 10%
    if (i % (steps / 10) === 0) {
      postMessage({ progress: i / steps });
    }
  }

  // Simulation is done
  postMessage({ frames, fps, posA: [mpA.position.x, mpA.position.y], posD: [mpD.position.x, mpD.position.y] });
};
