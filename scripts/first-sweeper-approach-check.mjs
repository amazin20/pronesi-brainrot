import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of ["FIRST_SWEEPER_TRIGGER_Z=-12.45","LIFT_ASSIST_Z_MAX=FIRST_SWEEPER_TRIGGER_Z+.30","LIFT_ASSIST_HALF_X=1.55","LIFT_ASSIST_SPEED=1.35","box(0,.035,-11.72,3.7,.07,2.62","carry-safe sweeper approach"]){if(!s.includes(needle))throw new Error('missing '+needle)}
const trigger=-12.45,sweeper=-9,warning=.72,carrySpeed=3.05,assist=1.35,assistEnd=trigger+.30;
const warningDistance=sweeper-trigger;
const warningTravel=(carrySpeed+assist)*warning;
if(assistEnd<=trigger)throw new Error('assist does not carry player through trigger');
if(warningDistance-warningTravel<.2)throw new Error('warning runway is too short at carry speed');
if(warningDistance>4.2)throw new Error('warning begins too far from visible hazard');
console.log('first sweeper carry-safe approach: PASS',{warningDistance,warningTravel,safetyMargin:warningDistance-warningTravel,assistEnd});
