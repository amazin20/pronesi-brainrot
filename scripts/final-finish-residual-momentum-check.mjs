import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync('index.html','utf8');
assert.match(source,/FINAL_FINISH_CHARGE=\.55,FINAL_FINISH_HOLD_Z=10\.12,FINAL_FINISH_HOLD_STRENGTH=5\.8,FINAL_FINISH_HOLD_MIN=\.34,FINAL_FINISH_PLAYER_MAX_PULL=1\.35,FINAL_FINISH_BRAIN_MAX_ACCEL=11\.5/);
assert.match(source,/holdStrength=FINAL_FINISH_HOLD_STRENGTH\*\(FINAL_FINISH_HOLD_MIN\+\(1-FINAL_FINISH_HOLD_MIN\)\*preProgress\)/);
assert.match(source,/playerMomentumX\*=Math\.exp\(-\(8\+6\*preProgress\)\*dt\);playerMomentumZ\*=Math\.exp\(-\(8\+6\*preProgress\)\*dt\)/);
assert.match(source,/const ax=Math\.max\(-FINAL_FINISH_BRAIN_MAX_ACCEL,Math\.min\(FINAL_FINISH_BRAIN_MAX_ACCEL,\(-bp\.x\)\*holdStrength\)\)/);
assert.match(source,/bv\.x\*=Math\.exp\(-\(4\.5\+2\.5\*preProgress\)\*dt\);bv\.z\*=Math\.exp\(-\(4\.5\+2\.5\*preProgress\)\*dt\)/);

const dt=1/60;
const chargeTime=.55;
const holdZ=10.12;
const holdStrengthBase=5.8;
const holdMin=.34;
const maxPlayerPullRate=1.35;
const maxBrainAccel=11.5;
const finishX=1.54;

// v102 only starts finish charge after both pressure stations are stable.
// A carried brainrot is already lerped into the cradle; after E placement grab()
// adds only vertical velocity, so stale puncher-scale horizontal impulses are not
// a valid finish-entry state. Use conservative pressure-plate residuals instead.
let player={x:1.34,z:10.36,vx:1.55,vz:.50};
let brain={x:1.28,z:10.38,vx:1.35,vz:.45};
let charge=0;
let maxPlayerX=Math.abs(player.x),maxBrainX=Math.abs(brain.x);
let maxPullSeen=0,maxBrainAccelSeen=0;
const samples=[];

for(let frame=0;frame<Math.ceil(chargeTime/dt);frame++){
  player.x+=player.vx*dt;
  player.z+=player.vz*dt;
  player.vx*=Math.exp(-8*dt);
  player.vz*=Math.exp(-8*dt);

  brain.x+=brain.vx*dt;
  brain.z+=brain.vz*dt;
  brain.vx*=Math.exp(-.55*dt);
  brain.vz*=Math.exp(-.55*dt);

  const preProgress=charge/chargeTime;
  const holdStrength=holdStrengthBase*(holdMin+(1-holdMin)*preProgress);
  const holdAlpha=1-Math.exp(-holdStrength*dt);
  const maxPlayerPull=maxPlayerPullRate*dt;

  player.vx*=Math.exp(-(8+6*preProgress)*dt);
  player.vz*=Math.exp(-(8+6*preProgress)*dt);
  const pullX=Math.max(-maxPlayerPull,Math.min(maxPlayerPull,(0-player.x)*holdAlpha*.55));
  const pullZ=Math.max(-maxPlayerPull,Math.min(maxPlayerPull,(holdZ-player.z)*holdAlpha*.42));
  player.x+=pullX;
  player.z+=pullZ;
  maxPullSeen=Math.max(maxPullSeen,Math.abs(pullX),Math.abs(pullZ));

  const ax=Math.max(-maxBrainAccel,Math.min(maxBrainAccel,(-brain.x)*holdStrength));
  const az=Math.max(-maxBrainAccel,Math.min(maxBrainAccel,(holdZ+.12-brain.z)*holdStrength));
  brain.vx+=ax*dt;
  brain.vz+=az*dt;
  brain.vx*=Math.exp(-(4.5+2.5*preProgress)*dt);
  brain.vz*=Math.exp(-(4.5+2.5*preProgress)*dt);
  maxBrainAccelSeen=Math.max(maxBrainAccelSeen,Math.abs(ax),Math.abs(az));

  maxPlayerX=Math.max(maxPlayerX,Math.abs(player.x));
  maxBrainX=Math.max(maxBrainX,Math.abs(brain.x));
  assert.ok(Math.abs(player.x)<finishX,`player escaped pressure cradle on frame ${frame}`);
  assert.ok(Math.abs(brain.x)<finishX,`brainrot escaped pressure cradle on frame ${frame}`);

  charge=Math.min(chargeTime,charge+dt);
  if(frame%8===0)samples.push({frame,px:+player.x.toFixed(3),bx:+brain.x.toFixed(3),charge:+charge.toFixed(3)});
}

assert.ok(charge>=chargeTime-.001,'finish charge should complete while both pressure stations remain stable');
assert.ok(maxPlayerX<finishX,'player residual momentum must stay inside charge cradle');
assert.ok(maxBrainX<finishX,'brainrot residual momentum must stay inside charge cradle');
assert.ok(Math.abs(player.vx)<.05,'player residual momentum should be nearly zero by charge completion');
assert.ok(Math.abs(brain.vx)<1.0,'brainrot outward velocity should reverse/damp during charge');
assert.ok(maxPullSeen<=maxPlayerPullRate*dt+1e-9,'player soft hold must respect per-frame pull cap');
assert.ok(maxBrainAccelSeen<=maxBrainAccel+1e-9,'brainrot hold must respect acceleration cap');

console.log('finish residual-momentum regression: PASS',{
  maxPlayerX:+maxPlayerX.toFixed(3),
  maxBrainX:+maxBrainX.toFixed(3),
  playerEndVX:+player.vx.toFixed(3),
  brainEndVX:+brain.vx.toFixed(3),
  maxPullSeen:+maxPullSeen.toFixed(4),
  maxBrainAccelSeen:+maxBrainAccelSeen.toFixed(3),
  samples
});
