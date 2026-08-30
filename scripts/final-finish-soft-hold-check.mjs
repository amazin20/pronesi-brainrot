import fs from 'node:fs';
import assert from 'node:assert/strict';

const s = fs.readFileSync('index.html', 'utf8');

assert.match(
  s,
  /FINAL_FINISH_CHARGE=\.55,FINAL_FINISH_HOLD_Z=10\.12,FINAL_FINISH_HOLD_STRENGTH=5\.8,FINAL_FINISH_HOLD_MIN=\.34,FINAL_FINISH_PLAYER_MAX_PULL=1\.35,FINAL_FINISH_BRAIN_MAX_ACCEL=11\.5/
);
assert.match(
  s,
  /const bothInFinish=playerPressureStable&&brainPressureStable;if\(bothInFinish&&!win\)\{const preProgress=finishCharge\/FINAL_FINISH_CHARGE,holdStrength=FINAL_FINISH_HOLD_STRENGTH\*\(FINAL_FINISH_HOLD_MIN\+\(1-FINAL_FINISH_HOLD_MIN\)\*preProgress\),holdAlpha=1-Math\.exp\(-holdStrength\*dt\),maxPlayerPull=FINAL_FINISH_PLAYER_MAX_PULL\*dt/
);
assert.match(
  s,
  /const pullX=Math\.max\(-maxPlayerPull,Math\.min\(maxPlayerPull,\(0-p\.x\)\*holdAlpha\*\.55\)\),pullZ=Math\.max\(-maxPlayerPull,Math\.min\(maxPlayerPull,\(FINAL_FINISH_HOLD_Z-p\.z\)\*holdAlpha\*\.42\)\);p\.x\+=pullX;p\.z\+=pullZ/
);
assert.match(
  s,
  /if\(!carry\)\{const ax=Math\.max\(-FINAL_FINISH_BRAIN_MAX_ACCEL,Math\.min\(FINAL_FINISH_BRAIN_MAX_ACCEL,\(-bp\.x\)\*holdStrength\)\),az=Math\.max\(-FINAL_FINISH_BRAIN_MAX_ACCEL,Math\.min\(FINAL_FINISH_BRAIN_MAX_ACCEL,\(FINAL_FINISH_HOLD_Z\+\.12-bp\.z\)\*holdStrength\)\)/
);
assert.match(s, /finishCharge=bothInFinish\?Math\.min\(FINAL_FINISH_CHARGE,finishCharge\+dt\):Math\.max\(0,finishCharge-dt\*2\.4\)/);
assert.match(s, /if\(!win&&finishProgress>=1\)\{win=true/);

const dt = 1 / 60;
const fullStrength = 5.8;
const minFraction = 0.34;
const maxPullSpeed = 1.35;
const maxBrainAccel = 11.5;

function step(progress, x, z) {
  const holdStrength = fullStrength * (minFraction + (1 - minFraction) * progress);
  const holdAlpha = 1 - Math.exp(-holdStrength * dt);
  const maxPull = maxPullSpeed * dt;
  const pullX = Math.max(-maxPull, Math.min(maxPull, (0 - x) * holdAlpha * 0.55));
  const pullZ = Math.max(-maxPull, Math.min(maxPull, (10.12 - z) * holdAlpha * 0.42));
  return { holdStrength, holdAlpha, pullX, pullZ, x: x + pullX, z: z + pullZ };
}

const farEarly = step(0, 1.8, 9.72);
const farLate = step(1, 1.8, 9.72);
const nearEarly = step(0, 0.18, 10.04);
const nearLate = step(1, 0.18, 10.04);
assert.ok(farEarly.holdStrength < farLate.holdStrength, 'hold must ramp with charge progress');
assert.ok(farEarly.holdAlpha < farLate.holdAlpha, 'per-frame correction must ramp gradually');
assert.ok(Math.abs(farEarly.pullX) <= maxPullSpeed * dt + 1e-12, 'early X correction must respect player pull cap');
assert.ok(Math.abs(farLate.pullX) <= maxPullSpeed * dt + 1e-12, 'late X correction must respect player pull cap');
assert.ok(Math.abs(farLate.pullZ) <= maxPullSpeed * dt + 1e-12, 'late Z correction must respect player pull cap');
assert.ok(Math.abs(farEarly.x) < 1.8 && farEarly.z > 9.72 && farEarly.z < 10.12, 'early hold should gently move player toward center/hold Z');
assert.ok(Math.abs(nearLate.pullX) > Math.abs(nearEarly.pullX), 'late charge should stabilize near-center offsets more strongly');
assert.ok(Math.abs(nearLate.pullZ) > Math.abs(nearEarly.pullZ), 'late charge should stabilize near-target Z offsets more strongly');
assert.ok(farLate.holdAlpha < 0.1, 'single-frame hold must remain soft at 60 Hz');

const brainX = 2.4;
const brainZ = 9.6;
const rawAx = (-brainX) * farLate.holdStrength;
const rawAz = (10.12 + 0.12 - brainZ) * farLate.holdStrength;
const ax = Math.max(-maxBrainAccel, Math.min(maxBrainAccel, rawAx));
const az = Math.max(-maxBrainAccel, Math.min(maxBrainAccel, rawAz));
assert.ok(Math.abs(ax) <= maxBrainAccel && Math.abs(az) <= maxBrainAccel, 'brainrot soft hold must cap acceleration');
assert.ok(ax < 0 && az > 0, 'brainrot acceleration should point toward the finish hold target');

console.log('finish pressure-cradle soft-hold regression: PASS', { farEarly, farLate, nearEarly, nearLate, ax, az });
