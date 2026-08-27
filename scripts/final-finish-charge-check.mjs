import assert from 'node:assert/strict';

const FINAL_RECOVERY_Z_MAX = 9.62;
const FINAL_FINISH_CHARGE = 0.55;
const FINISH_X = 3.5;
const DECAY_RATE = 2.4;
const DT = 1 / 60;

function inFinish(body, brainrot = false) {
  const margin = brainrot ? 0.1 : 0;
  return body.z > FINAL_RECOVERY_Z_MAX && Math.abs(body.x) < FINISH_X - margin;
}

function stepCharge(charge, player, brainrot, dt = DT) {
  const both = inFinish(player) && inFinish(brainrot, true);
  return both
    ? Math.min(FINAL_FINISH_CHARGE, charge + dt)
    : Math.max(0, charge - dt * DECAY_RATE);
}

function simulate(seconds, player, brainrot, start = 0) {
  let charge = start;
  const frames = Math.ceil(seconds / DT);
  for (let i = 0; i < frames; i++) charge = stepCharge(charge, player, brainrot);
  return charge;
}

const insidePlayer = { x: 0, z: 10.05 };
const insideBrainrot = { x: 0.2, z: 10.1 };
const outsidePlayer = { x: 0, z: 9.55 };
const outsideBrainrot = { x: 3.45, z: 10.1 };

assert.equal(inFinish(insidePlayer), true, 'player must fit inside the finish pocket');
assert.equal(inFinish(insideBrainrot, true), true, 'brainrot must fit inside the finish pocket');
assert.equal(inFinish(outsidePlayer), false, 'recovery runway must not count as finish');
assert.equal(inFinish(outsideBrainrot, true), false, 'brainrot side margin must be respected');

const almost = simulate(FINAL_FINISH_CHARGE - 0.08, insidePlayer, insideBrainrot);
assert.ok(almost < FINAL_FINISH_CHARGE, 'finish must not trigger before stable hold completes');

const completed = simulate(FINAL_FINISH_CHARGE + 0.08, insidePlayer, insideBrainrot);
assert.equal(completed, FINAL_FINISH_CHARGE, 'stable hold must reach the exact charge cap');

const partial = simulate(0.32, insidePlayer, insideBrainrot);
assert.ok(partial > 0.25 && partial < FINAL_FINISH_CHARGE, 'partial stable hold must accumulate charge');
const decayed = simulate(0.2, outsidePlayer, insideBrainrot, partial);
assert.ok(decayed < partial, 'charge must decay when either participant leaves');
assert.ok(decayed >= 0, 'charge must never become negative');

const recoverToZero = simulate(1, outsidePlayer, insideBrainrot, FINAL_FINISH_CHARGE);
assert.equal(recoverToZero, 0, 'an interrupted finish must fully reset after enough time');

console.log('final-finish-charge-check: PASS');
console.log(JSON.stringify({
  finishChargeSeconds: FINAL_FINISH_CHARGE,
  finishHalfWidth: FINISH_X,
  finishEntryZ: FINAL_RECOVERY_Z_MAX,
  decayRate: DECAY_RATE,
  framesToCharge: Math.ceil(FINAL_FINISH_CHARGE / DT)
}, null, 2));
