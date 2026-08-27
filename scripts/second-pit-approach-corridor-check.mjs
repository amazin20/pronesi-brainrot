import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const need=[
  'SECOND_PIT_APPROACH_Z_MIN=3.48',
  'SECOND_PIT_APPROACH_Z_MAX=5.04',
  'SECOND_PIT_APPROACH_HALF_X=1.55',
  'function inSecondPitApproachRail',
  'if(inSecondPitApproachRail(x,z,.4))return true',
  'if(inSecondPitApproachRail(x,z,r))return true',
  "state.textContent='КОРИДОР К ПЛАТФОРМЕ · ДЕРЖИ ЦЕНТР'"
];
for(const token of need) if(!s.includes(token)) throw new Error('missing '+token);
const recoveryMax=3.55, stageMin=3.55, corridorMin=3.48, corridorMax=5.04, pitEdge=5.05, halfX=1.55, playerR=.4, brainR=.38;
if(corridorMin>recoveryMax) throw new Error('gap after sweeper recovery');
if(corridorMin>stageMin) throw new Error('gap before boarding stage');
if(corridorMax<pitEdge-.02) throw new Error('corridor does not reach pit boarding edge');
if(2*(halfX-playerR)<2.2) throw new Error('player carry corridor too narrow');
if(2*(halfX-brainR)<2.2) throw new Error('brainrot corridor too narrow');
console.log('second-pit approach corridor PASS', {corridorMin,corridorMax,usablePlayerWidth:2*(halfX-playerR),usableBrainWidth:2*(halfX-brainR)});
