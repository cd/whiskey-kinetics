import TCanvas from "./draw.mjs";

// Create canvas object
const tcanvas = new TCanvas(document.querySelector("#four-bar canvas").getContext("2d"), 60, 300, 100);

export default function (frameIndex, data) {
  // Clear canvas and draw grid
  tcanvas.clear().drawGrid();

  // Draw engine
  tcanvas.drawParticle(data.posA[0], data.posA[1], 60, { dash: true });

  // Draw bearing
  tcanvas.drawBearingFixed(data.posD[0], data.posD[1], "bottom");

  // Draw lever
  tcanvas.drawLink(data.frames.posC[frameIndex][0], data.frames.posC[frameIndex][1], data.posD[0], data.posD[1], {
    stress: data.frames.stressLever[frameIndex],
  });

  // Draw enclosure
  tcanvas.drawLink(
    data.frames.posB[frameIndex][0],
    data.frames.posB[frameIndex][1],
    data.frames.posC[frameIndex][0],
    data.frames.posC[frameIndex][1],
    { stress: data.frames.stressEnclosure[frameIndex] }
  );

  // Draw enclosures
  tcanvas.drawLink(
    data.frames.posB[frameIndex][0],
    data.frames.posB[frameIndex][1],
    data.frames.posC[frameIndex][0],
    data.frames.posC[frameIndex][1],
    { stress: data.frames.stressEnclosure[frameIndex] }
  );
  tcanvas.drawLink(
    data.frames.posB[frameIndex][0],
    data.frames.posB[frameIndex][1],
    data.frames.posE1[frameIndex][0],
    data.frames.posE1[frameIndex][1],
    { stress: data.frames.stressEnclosureBE1[frameIndex] }
  );
  tcanvas.drawLink(
    data.frames.posE1[frameIndex][0],
    data.frames.posE1[frameIndex][1],
    data.frames.posE2[frameIndex][0],
    data.frames.posE2[frameIndex][1],
    { stress: data.frames.stressEnclosureE1E2[frameIndex] }
  );
  tcanvas.drawLink(
    data.frames.posC[frameIndex][0],
    data.frames.posC[frameIndex][1],
    data.frames.posE1[frameIndex][0],
    data.frames.posE1[frameIndex][1],
    { stress: data.frames.stressEnclosureCE1[frameIndex] }
  );
  tcanvas.drawLink(
    data.frames.posC[frameIndex][0],
    data.frames.posC[frameIndex][1],
    data.frames.posE2[frameIndex][0],
    data.frames.posE2[frameIndex][1],
    { stress: data.frames.stressEnclosureCE2[frameIndex] }
  );

  // Draw bearing point
  tcanvas.drawParticle(data.posD[0], data.posD[1]);

  // Draw rope
  tcanvas.drawLink(
    data.frames.posE2[frameIndex][0],
    data.frames.posE2[frameIndex][1],
    data.frames.posLoad[frameIndex][0],
    data.frames.posLoad[frameIndex][1]
  );

  // Draw particles
  tcanvas.drawParticle(data.frames.posB[frameIndex][0], data.frames.posB[frameIndex][1]);
  tcanvas.drawParticle(data.frames.posC[frameIndex][0], data.frames.posC[frameIndex][1]);
  tcanvas.drawParticle(data.frames.posE1[frameIndex][0], data.frames.posE1[frameIndex][1]);
  tcanvas.drawParticle(data.frames.posE2[frameIndex][0], data.frames.posE2[frameIndex][1]);

  // Draw load
  tcanvas.drawParticle(data.frames.posLoad[frameIndex][0], data.frames.posLoad[frameIndex][1], 20, {
    fill: true,
  });
}
