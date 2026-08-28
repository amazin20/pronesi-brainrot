import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of [
  "FIRST_SWEEPER_TRIGGER_Z=-12.45",
  "LIFT_ASSIST_Z_MAX=FIRST_SWEEPER_TRIGGER_Z+.30",
  "LIFT_ASSIST_HALF_X=1.55",
  "LIFT_ASSIST_SPEED=1.35",
  "box(0,.035,-11.72,3.7,.07,2.62",
  "FIRST_SWEEPER_STAGING_Z_MIN=-12.42",
  "FIRST_SWEEPER_STAGING_Z_MAX=-10.72",
  "FIRST_SWEEPER_STAGING_HALF_X=1.74",
  "function makeFirstSweeperShieldRail",
  "inFirstSweeperStagingRail"
]){
  if(!s.includes(needle))throw new Error('missing '+needle);
}
const trigger=-12.45,sweeper=-9,warning=.72,carrySpeed=3.05,assist=1.35,assistEnd=trigger+.30;
const stagingMin=-12.42,stagingMax=-10.72,stagingHalfX=1.74,playerRadius=.4,brainRadius=.38;
const warningDistance=sweeper-trigger;
const warningTravel=(carrySpeed+assist)*warning;
const playerClearance=stagingHalfX-playerRadius;
const brainClearance=stagingHalfX-brainRadius;
if(assistEnd<=trigger)throw new Error('assist does not carry player through trigger');
if(warningDistance-warningTravel<.2)throw new Error('warning runway is too short at carry speed');
if(warningDistance>4.2)throw new Error('warning begins too far from visible hazard');
if(stagingMin>trigger+.05)throw new Error('shielded staging starts too late for trigger handoff');
if(stagingMax<=-10.8)throw new Error('shielded staging does not reach timing gate pocket');
if(playerClearance<1.25||brainClearance<1.25)throw new Error('shielded staging corridor is too narrow for carry route');
console.log('first sweeper v64 shielded approach: PASS',{warningDistance,warningTravel,safetyMargin:warningDistance-warningTravel,assistEnd,stagingLength:stagingMax-stagingMin,playerClearance,brainClearance});
