import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync('index.html','utf8');
assert.match(source,/FINAL_FINISH_CHARGE=\.55,FINAL_FINISH_HOLD_Z=10\.12,FINAL_FINISH_HOLD_STRENGTH=5\.8/);
assert.match(source,/const FINISH_Z_MIN=8\.82,FINISH_X=3\.5/);
assert.match(source,/playerMomentumX\*=Math\.exp\(-14\*dt\);playerMomentumZ\*=Math\.exp\(-14\*dt\)/);
assert.match(source,/bv\.x\*=Math\.exp\(-7\*dt\);bv\.z\*=Math\.exp\(-7\*dt\)/);
assert.match(source,/finishCharge=bothInFinish\?Math\.min\(FINAL_FINISH_CHARGE,finishCharge\+dt\):Math\.max\(0,finishCharge-dt\*2\.4\)/);

const dt=1/60;
const chargeTime=.55;
const holdZ=10.12;
const holdStrength=5.8;
const finishX=3.5;
const brainFinishX=finishX-.1;
const holdAlpha=1-Math.exp(-holdStrength*dt);

// Worst-case carry-safe residuals entering the finish after the recovery runway.
// Player keeps a strong puncher-derived lateral impulse; the loose brainrot keeps
// a separate outward impulse. The soft hold must damp both without teleporting.
let player={x:3.15,z:9.72,vx:4.7,vz:1.0};
let brain={x:3.05,z:9.74,vx:4.0,vz:1.0};
let charge=0;
let maxPlayerX=Math.abs(player.x),maxBrainX=Math.abs(brain.x);
const samples=[];

for(let frame=0;frame<Math.ceil(chargeTime/dt);frame++){
  // Approximate the same update order as runtime: residual movement first,
  // normal damping, then finish-pocket soft hold and charge accumulation.
  player.x+=player.vx*dt;
  player.z+=player.vz*dt;
  player.vx*=Math.exp(-8*dt);
  player.vz*=Math.exp(-8*dt);

  brain.x+=brain.vx*dt;
  brain.z+=brain.vz*dt;
  brain.vx*=Math.exp(-.55*dt);
  brain.vz*=Math.exp(-.55*dt);

  player.vx*=Math.exp(-14*dt);
  player.vz*=Math.exp(-14*dt);
  player.x+=(0-player.x)*holdAlpha*.55;
  player.z+=(holdZ-player.z)*holdAlpha*.42;

  brain.vx+=(-brain.x)*holdStrength*dt;
  brain.vz+=(holdZ+.12-brain.z)*holdStrength*dt;
  brain.vx*=Math.exp(-7*dt);
  brain.vz*=Math.exp(-7*dt);

  maxPlayerX=Math.max(maxPlayerX,Math.abs(player.x));
  maxBrainX=Math.max(maxBrainX,Math.abs(brain.x));
  const playerInside=player.z>9.62&&Math.abs(player.x)<finishX;
  const brainInside=brain.z>9.62&&Math.abs(brain.x)<brainFinishX;
  assert.ok(playerInside,`player escaped finish pocket on frame ${frame}`);
  assert.ok(brainInside,`brainrot escaped finish pocket on frame ${frame}`);
  charge=Math.min(chargeTime,charge+dt);
  if(frame%8===0)samples.push({frame,px:+player.x.toFixed(3),bx:+brain.x.toFixed(3),charge:+charge.toFixed(3)});
}

assert.ok(charge>=chargeTime-.001,'finish charge should complete while both remain inside');
assert.ok(maxPlayerX<finishX,'player residual momentum must stay inside finish rails');
assert.ok(maxBrainX<brainFinishX,'brainrot residual momentum must stay inside its stricter finish bound');
assert.ok(Math.abs(player.x)<1.0,'player should converge toward pocket center during charge');
assert.ok(Math.abs(brain.vx)<2.5,'brainrot outward velocity should be reversed/damped by soft hold');
assert.ok(holdAlpha<.12,'soft hold must stay gradual per frame');

console.log('finish residual-momentum regression: PASS',{maxPlayerX:+maxPlayerX.toFixed(3),maxBrainX:+maxBrainX.toFixed(3),playerEndX:+player.x.toFixed(3),brainEndVX:+brain.vx.toFixed(3),samples});
