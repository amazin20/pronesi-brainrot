import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function number(name) {
  const m = html.match(new RegExp(`\\b${name}=(-?\\d+(?:\\.\\d+)?)`));
  if (!m) throw new Error(`Missing numeric constant ${name}`);
  return Number(m[1]);
}

function assert(ok, message) {
  if (!ok) throw new Error(message);
}

const pitMatch = html.match(/const PITS=\[\[(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\]/);
assert(pitMatch, 'First pit bounds are missing');
const pitMin = Number(pitMatch[1]);
const pitMax = Number(pitMatch[2]);
const pitWidth = pitMax - pitMin;

const baseY = number('LIFT_BASE_Y');
const travelY = number('LIFT_TRAVEL_Y');
const halfZ = number('LIFT_HALF_Z');
const dockDepth = number('LIFT_DOCK_DEPTH');

// Runtime uses sin(t * 1.35) for this lift and carry speed 3.05 m/s.
const angularSpeedMatch = html.match(/LIFT_BASE_Y\+LIFT_TRAVEL_Y\*\(\.5\+\.5\*Math\.sin\(t\*(\d+(?:\.\d+)?)\)\)/);
assert(angularSpeedMatch, 'Lift angular speed expression changed or is missing');
const angularSpeed = Number(angularSpeedMatch[1]);

const carrySpeedMatch = html.match(/sp=carry\?(\d+(?:\.\d+)?):run\?/);
assert(carrySpeedMatch, 'Carry movement speed is missing');
const carrySpeed = Number(carrySpeedMatch[1]);

// onLiftPlatform accepts player support while platform top is within 0.28 m of y=0.
// Platform top = lift Y + 0.12, so Y <= 0.16 is a safe ground-level boarding window.
const safeLiftY = 0.16;
const period = Math.PI * 2 / angularSpeed;
const dt = 0.001;
let longest = 0;
let current = 0;
for (let t = 0; t < period * 2; t += dt) {
  const y = baseY + travelY * (0.5 + 0.5 * Math.sin(t * angularSpeed));
  if (y <= safeLiftY) {
    current += dt;
    if (current > longest) longest = current;
  } else {
    current = 0;
  }
}

// Required carry travel is from the entry dock overlap to the exit dock overlap,
// not the full pit width: the platform overlaps each dock by design.
const effectiveTravel = Math.max(0, pitWidth - dockDepth * 2);
const crossingTime = effectiveTravel / carrySpeed;
const reactionAndSettleMargin = 0.22;
const requiredWindow = crossingTime + reactionAndSettleMargin;

assert(halfZ * 2 >= effectiveTravel, `Lift deck is too short for first-pit carry crossing: deck=${halfZ * 2}, travel=${effectiveTravel}`);
assert(longest >= requiredWindow, `Ground-level lift boarding window is too short: ${longest.toFixed(3)}s < ${requiredWindow.toFixed(3)}s required`);
assert(longest >= 0.65, `Carry-safe lift dwell is fragile at low FPS/input delay: ${longest.toFixed(3)}s`);

console.log('lift-carry-window-check: PASS');
console.log(JSON.stringify({
  pitWidth: +pitWidth.toFixed(3),
  effectiveTravel: +effectiveTravel.toFixed(3),
  carrySpeed,
  crossingTime: +crossingTime.toFixed(3),
  requiredWindow: +requiredWindow.toFixed(3),
  measuredGroundWindow: +longest.toFixed(3),
  margin: +(longest - requiredWindow).toFixed(3)
}, null, 2));
