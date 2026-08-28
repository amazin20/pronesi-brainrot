import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function number(name) {
  const m = html.match(new RegExp(`\\b${name}=(-?(?:\\d+(?:\\.\\d+)?|\\.\\d+))`));
  if (!m) throw new Error(`Missing numeric constant ${name}`);
  return Number(m[1]);
}

function assert(ok, message) {
  if (!ok) throw new Error(message);
}

const pitMatch = html.match(/const PITS=\[\[(-?(?:\d+(?:\.\d+)?|\.\d+)),(-?(?:\d+(?:\.\d+)?|\.\d+))\]/);
assert(pitMatch, 'First pit bounds are missing');
const pitMin = Number(pitMatch[1]);
const pitMax = Number(pitMatch[2]);
const pitCenter = (pitMin + pitMax) * 0.5;

const dockDepth = number('LIFT_DOCK_DEPTH');
const dockHalfX = number('LIFT_DOCK_HALF_X');
const platformHalfX = number('LIFT_HALF_X');
const platformHalfZ = number('LIFT_HALF_Z');

const entryDockCenter = pitMin + dockDepth * 0.5;
const exitDockCenter = pitMax - dockDepth * 0.5;
const entryDockMax = entryDockCenter + dockDepth * 0.5;
const exitDockMin = exitDockCenter - dockDepth * 0.5;
const platformMin = pitCenter - platformHalfZ;
const platformMax = pitCenter + platformHalfZ;

assert(Math.abs(entryDockCenter - (-15.03)) < 0.02, `Unexpected entry dock center: ${entryDockCenter}`);
assert(Math.abs(exitDockCenter - (-13.72)) < 0.02, `Unexpected exit dock center: ${exitDockCenter}`);
assert(entryDockMax >= platformMin, `Unsupported entry gap: dock ends ${entryDockMax}, platform starts ${platformMin}`);
assert(platformMax >= exitDockMin, `Unsupported exit gap: platform ends ${platformMax}, dock starts ${exitDockMin}`);
assert(dockHalfX >= 1.7, `Dock is too narrow for carry route: ${dockHalfX}`);
assert(platformHalfX >= 1.6, `Lift platform is too narrow for carry route: ${platformHalfX}`);

assert(html.includes('function onLiftDock('), 'Lift dock support function is missing');
assert((html.match(/onLiftDock\(p\.x,p\.y,p\.z,false\)/g) || []).length >= 1, 'Player support does not include lift docks');
assert((html.match(/onLiftDock\(bp\.x,bp\.y,bp\.z,true\)/g) || []).length >= 1, 'Brainrot support does not include lift docks');
assert(html.includes('function onLiftPlatform('), 'Lift platform support function is missing');

// v62+ renders these anchors as modeled crash barriers / bumper pillars rather than
// primitive blocks. Keep checking the source anchor arrays because they are still
// the authoritative collision positions for the static hazards.
const blocksMatch = html.match(/const blocks=\[(.*?)\];/s);
assert(blocksMatch, 'Crash-barrier anchor list is missing');
assert(html.includes('function makeCrashBarrier('), 'Modeled crash-barrier builder is missing');
assert(html.includes('crashBarriers=blocks.map('), 'Crash-barrier anchors are not bound to modeled hazards');
const blockPairs = [...blocksMatch[1].matchAll(/\[(-?(?:\d+(?:\.\d+)?|\.\d+)),(-?(?:\d+(?:\.\d+)?|\.\d+))\]/g)].map(m => [Number(m[1]), Number(m[2])]);
assert(blockPairs.length >= 5, `Expected modeled crash-barrier anchors, got ${blockPairs.length}`);
for (const [x, z] of blockPairs) {
  const nearLift = Math.abs(z - pitCenter) < 2.0;
  assert(!(nearLift && Math.abs(x) < 1.8), `Crash barrier intrudes into lift carry corridor at x=${x}, z=${z}`);
}

const cylindersMatch = html.match(/const cylinders=\[(.*?)\];/s);
assert(cylindersMatch, 'Bumper-pillar anchor list is missing');
assert(html.includes('function makeBumperPillar('), 'Modeled bumper-pillar builder is missing');
assert(html.includes('cylinders.map('), 'Bumper-pillar anchors are not bound to modeled hazards');
const cylinderPairs = [...cylindersMatch[1].matchAll(/\[(-?(?:\d+(?:\.\d+)?|\.\d+)),(-?(?:\d+(?:\.\d+)?|\.\d+))\]/g)].map(m => [Number(m[1]), Number(m[2])]);
assert(cylinderPairs.length >= 5, `Expected modeled bumper-pillar anchors, got ${cylinderPairs.length}`);
for (const [x, z] of cylinderPairs) {
  const nearLift = Math.abs(z - pitCenter) < 2.0;
  assert(!(nearLift && Math.abs(x) < 1.55), `Bumper pillar intrudes into lift carry corridor at x=${x}, z=${z}`);
}

console.log('lift-route-continuity-check: PASS');
console.log(JSON.stringify({
  firstPit:[pitMin,pitMax],
  entryOverlap:+(entryDockMax-platformMin).toFixed(3),
  exitOverlap:+(platformMax-exitDockMin).toFixed(3),
  dockHalfX,
  platformHalfX,
  modeledCrashBarriers:blockPairs.length,
  modeledBumperPillars:cylinderPairs.length
}, null, 2));
