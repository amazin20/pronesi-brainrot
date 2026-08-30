import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const required=[
  "SECOND_PIT_STAGE_Z=4.55",
  "SECOND_PIT_STAGE_Z_MIN=3.55",
  "SECOND_PIT_BOARD_X=.16",
  "SECOND_PIT_BOARD_SPEED=2.6",
  "SECOND_PIT_EXIT_RELEASE_Z=6.02",
  "SECOND_PIT_CARRIER_MODEL_V72=true",
  "SecondPitCarrierDeckV72",
  "SecondPitCarrierPontoonV72",
  "SecondPitCarrierThrusterRingV72",
  "SECOND_PIT_STAGE_MODEL_V85=true",
  "SecondPitStageTowerV85",
  "SecondPitStageTopV85",
  "SECOND_PIT_EXIT_MODEL_V94=true",
  "SecondPitExitCollisionDeckV94",
  "secondPitBoardingIndex=-1",
  "const crossing=secondPitBoardingIndex>=0&&carry",
  "const holdActive=approaching||crossing",
  "secondPitBoarding=approaching",
  "secondPitCrossing=crossing",
  "boardingLocked=holdActive&&i===secondPitBoardingIndex",
  "if(boardingLocked)secondPitBoardBridgeActive=true",
  "secondPitBoardBridge.visible=secondPitBoardBridgeActive",
  "ПЛАТФОРМА ЖДЁТ · ЗАХОДИ",
  "ПЛАТФОРМА ДЕРЖИТ ПЕРЕХОД",
  "full 3D route v103"
];
for(const needle of required){if(!s.includes(needle))throw new Error('missing '+needle)}
const forbidden=[
  'full 3D route v102',
  'secondPitBoarding=stageReady',
  'boardingLocked=stageReady'
];
for(const needle of forbidden){if(s.includes(needle))throw new Error('stale second-pit contract returned: '+needle)}

const boardX=.16,halfX=1.05,playerRadius=.4,brainRadius=.38;
if(halfX-playerRadius<.6)throw new Error('player boarding width too narrow');
if(halfX-brainRadius<.6)throw new Error('brainrot boarding width too narrow');
if(Math.abs(boardX)>halfX-playerRadius)throw new Error('held platform misses center carry corridor');

const pit=[5.05,5.82],halfZ=.34;
const uncovered=(pit[1]-pit[0])-2*halfZ;
if(uncovered>.12)throw new Error('platform leaves excessive Z gap '+uncovered);

const baseX=1.4,travel=1.3,boardSpeed=2.6;
const farthestX=baseX+travel;
const worstDockSeconds=(farthestX-boardX)/boardSpeed;
if(worstDockSeconds>1.05)throw new Error('boarding hold takes too long to dock '+worstDockSeconds);

const stageMinZ=3.55,exitReleaseZ=6.02;
if(stageMinZ>=pit[0])throw new Error('boarding sensor starts too late');
if(exitReleaseZ<=pit[1])throw new Error('crossing latch releases before the far bank');

console.log('second pit boarding/crossing hold v103: PASS',{centerClearance:halfX-playerRadius,uncovered,worstDockSeconds,modeledCarrier:'v72',modeledStage:'v85',modeledExit:'v94'});
