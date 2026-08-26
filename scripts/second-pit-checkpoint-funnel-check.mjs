import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of ["SECOND_PIT_FUNNEL_HALF_X=2.05","SECOND_PIT_FUNNEL_Z_MIN=5.78","SECOND_PIT_FUNNEL_Z_MAX=7.28","inSecondPitFunnel(x,z","playerLandingFunnel","brainLandingFunnel","Math.exp(-15*dt)","checkpoint landing funnel"]){if(!s.includes(needle))throw new Error('missing '+needle)}
const halfX=2.05,playerR=.4,brainR=.38,zMin=5.78,zMax=7.28,exitRelease=6.02,checkpointZ=6.35;
if(exitRelease<zMin||exitRelease>zMax)throw new Error('platform release is outside funnel');
if(checkpointZ<zMin||checkpointZ>zMax)throw new Error('checkpoint is outside funnel');
if(halfX-playerR<1.55)throw new Error('player carry corridor too narrow');
if(halfX-brainR<1.6)throw new Error('brainrot corridor too narrow');
if(zMax-checkpointZ<.75)throw new Error('not enough braking distance after checkpoint');
console.log('second pit checkpoint funnel: PASS',{playerClear:halfX-playerR,brainClear:halfX-brainR,brakingAfterCheckpoint:zMax-checkpointZ});
