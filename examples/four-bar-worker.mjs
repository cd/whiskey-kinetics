import { Particle, Vec2D, Link } from "../whiskey-kinetics.mjs";

onmessage = (e) => {
  // Rotation speed
  const speed = e.data.speed;

  // Crane mass points
  const massPointsParam = {
    dragForceFactor: 20,
  };
  const mpA = new Particle(new Vec2D(2, 0), 1, massPointsParam);
  const mpB = new Particle(new Vec2D(2, -1), 1, massPointsParam);
  const mpC = new Particle(new Vec2D(2, 1.5), 1, massPointsParam);
  const mpD = new Particle(new Vec2D(0, 0), 1, massPointsParam);
  const mpE1 = new Particle(new Vec2D(3.5, 1.5), 1, massPointsParam);
  const mpE2 = new Particle(new Vec2D(2, 4), 1, massPointsParam);

  // Load
  const mpLoad = new Particle(new Vec2D(2, 3), e.data.load, {
    dragForceFactor: 50,
  });

  // Links
  const linksParam = {
    maxTensileForce: 2500,
    tensileStiffness: 20000,
  };
  const lLever = new Link(mpC, mpD, linksParam);
  const lEnclosure = new Link(mpB, mpC, linksParam);
  const lEnclosureBE1 = new Link(mpB, mpE1, linksParam);
  const lEnclosureE1E2 = new Link(mpE1, mpE2, linksParam);
  const lEnclosureCE1 = new Link(mpC, mpE1, linksParam);
  const lEnclosureCE2 = new Link(mpC, mpE2, linksParam);

  // Rope
  const lRope = new Link(mpE2, mpLoad, { compressible: false, tensileStiffness: 300 });

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
  const steps = 50000;
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

    // Update engine power (rotate mass point B)
    mpB._position.set(new Vec2D(0, -1).rotate(time * speed).add(mpA.position));

    // Update everything else
    updateQueue.forEach((element) => {
      // Apply gravity to all mass points
      if (element.addAcceleration) {
        element.addAcceleration(new Vec2D(0, -9.81));
      }

      // Update all nessesary links and mass points
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
        lLever.springForce === null ? null : Math.abs(lLever.springForce / lLever.maxTensileForce)
      );
      frames.stressEnclosure.push(
        lEnclosure.springForce === null ? null : Math.abs(lEnclosure.springForce / lEnclosure.maxTensileForce)
      );
      frames.stressEnclosureBE1.push(
        lEnclosureBE1.springForce === null ? null : Math.abs(lEnclosureBE1.springForce / lEnclosureBE1.maxTensileForce)
      );
      frames.stressEnclosureE1E2.push(
        lEnclosureE1E2.springForce === null
          ? null
          : Math.abs(lEnclosureE1E2.springForce / lEnclosureE1E2.maxTensileForce)
      );
      frames.stressEnclosureCE1.push(
        lEnclosureCE1.springForce === null ? null : Math.abs(lEnclosureCE1.springForce / lEnclosureCE1.maxTensileForce)
      );
      frames.stressEnclosureCE2.push(
        lEnclosureCE2.springForce === null ? null : Math.abs(lEnclosureCE2.springForce / lEnclosureCE2.maxTensileForce)
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
