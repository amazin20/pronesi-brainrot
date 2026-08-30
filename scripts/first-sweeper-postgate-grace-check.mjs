import fs from 'node:fs';

const s = fs.readFileSync('index.html', 'utf8');

const required = [
  'full 3D route v103 · modeled first pit carrier',
  'FIRST_PIT_CARRIER_MODEL_V103=true',
  "pitPlatform.name='FirstPitCarrierCollisionDeckV103'",
  'firstSweeperPostGateGrace=0',
  'FIRST_SWEEPER_CARRY_GRACE=',
  'if(firstSweeperGateCrossing)firstSweeperPostGateGrace=Math.max(firstSweeperPostGateGrace,FIRST_SWEEPER_CARRY_GRACE)',
  'firstSweeperPostGateGrace=Math.max(firstSweeperPostGateGrace,FIRST_SWEEPER_CARRY_GRACE)',
  'firstSweeperPostGateGrace=Math.max(0,firstSweeperPostGateGrace-dt)',
  'firstSweeperPostGateGrace<=0',
  'SWEEPER · БЕЗОПАСНЫЙ ВЫХОД'
];
for (const token of required) {
  if (!s.includes(token)) throw new Error(`missing live v103 post-gate token: ${token}`);
}

if (s.includes('full 3D route v102 · modeled group runtime safety')) {
  throw new Error('stale v102 route banner returned after v103 first-pit carrier overhaul');
}

const graceMatch = s.match(/FIRST_SWEEPER_CARRY_GRACE=([0-9.]+)/);
if (!graceMatch) throw new Error('cannot read FIRST_SWEEPER_CARRY_GRACE from runtime');
const carryGrace = Number(graceMatch[1]);
if (!Number.isFinite(carryGrace) || carryGrace < 1.2 || carryGrace > 1.6) {
  throw new Error(`first sweeper carry grace drift: ${carryGrace}`);
}

// The live v103 runtime refreshes grace every frame while either body remains inside
// the latched gate crossing. Both bodies must clear the +0.72m release plane before
// that refresh stops, leaving one full configured grace interval for the exit lane.
let grace = 0;
for (let i = 0; i < 18; i++) {
  grace = Math.max(grace, carryGrace);
  grace = Math.max(0, grace - 0.035);
}
if (grace < carryGrace - 0.05) {
  throw new Error(`crossing refresh no longer holds grace near full duration: ${grace}`);
}

grace = Math.max(grace, carryGrace);
let frames = 0;
const dt = 0.035;
while (grace > 0 && frames < 200) {
  grace = Math.max(0, grace - dt);
  frames++;
}
const seconds = frames * dt;
if (seconds < carryGrace - dt || seconds > carryGrace + dt) {
  throw new Error(`post-gate protection duration drift: ${seconds}s for configured ${carryGrace}s`);
}

const firstHitAllowed = (i, postGateGrace, stagingSafe = false, carryLane = false) =>
  i !== 0 || (!stagingSafe && !carryLane && postGateGrace <= 0);
if (firstHitAllowed(0, carryGrace * 0.5)) throw new Error('first sweeper can hit during post-gate carry grace');
if (firstHitAllowed(0, 0, true, false)) throw new Error('first sweeper can hit inside staging shield');
if (firstHitAllowed(0, 0, false, true)) throw new Error('first sweeper can hit inside protected carry lane');
if (!firstHitAllowed(0, 0, false, false)) throw new Error('first sweeper does not reactivate after all protections expire');
if (!firstHitAllowed(1, carryGrace * 0.5)) throw new Error('second sweeper must remain independent of first-sweeper grace');

console.log('first sweeper v103 post-gate carry grace: PASS', `${seconds.toFixed(3)}s`, `configured=${carryGrace.toFixed(2)}s`);
