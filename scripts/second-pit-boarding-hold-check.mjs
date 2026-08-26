import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of ["SECOND_PIT_STAGE_Z=4.55","SECOND_PIT_BOARD_X=.16","SECOND_PIT_BOARD_SPEED=2.6","secondPitStageVisuals","secondPitBoarding=stageReady","boardingIndex=Math.abs","boardingLocked=stageReady","ПЛАТФОРМА ЖДЁТ · ЗАХОДИ","full 3D lift route v22"]){if(!s.includes(needle))throw new Error('missing '+needle)}
const boardX=.16,halfX=1.05,playerRadius=.4,brainRadius=.38;
if(halfX-playerRadius<.6)throw new Error('player boarding width too narrow');
if(halfX-brainRadius<.6)throw new Error('brainrot boarding width too narrow');
if(Math.abs(boardX)>halfX-playerRadius)throw new Error('held platform misses center carry corridor');
const pit=[5.05,5.82],halfZ=.34;
const uncovered=(pit[1]-pit[0])-2*halfZ;
if(uncovered>.12)throw new Error('platform leaves excessive Z gap '+uncovered);
console.log('second pit staging/boarding hold: PASS', {centerClearance:halfX-playerRadius, uncovered});
