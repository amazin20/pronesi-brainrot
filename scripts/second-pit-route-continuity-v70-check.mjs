import fs from 'node:fs';

const s=fs.readFileSync('index.html','utf8');
const need=[
  'SECOND_SWEEPER_RECOVERY_Z_MAX=3.55',
  'SECOND_PIT_APPROACH_Z_MIN=3.48',
  'SECOND_PIT_APPROACH_Z_MAX=5.04',
  'SECOND_PIT_STAGE_Z_MIN=3.55',
  'SECOND_PIT_STAGE_HALF_X=1.55',
  'SECOND_PIT_BOARD_X=.16',
  'SECOND_PIT_BOARD_BRIDGE_Z=5.055',
  'SECOND_PIT_BOARD_BRIDGE_HALF_X=1.45',
  'SECOND_PIT_BOARD_BRIDGE_HALF_Z=.18',
  'SECOND_PIT_EXIT_BRIDGE_Z=5.80',
  'SECOND_PIT_EXIT_BRIDGE_HALF_X=1.75',
  'SECOND_PIT_EXIT_BRIDGE_HALF_Z=.28',
  'SECOND_PIT_EXIT_RELEASE_Z=6.02',
  'SECOND_PIT_CHECKPOINT_CAPTURE_Z_MIN=6.02',
  'secondPitBoardBridgeActive=true',
  'secondPitBoardBridge.visible=secondPitBoardBridgeActive',
  'const crossing=secondPitBoardingIndex>=0&&carry',
  "state.textContent='ПЛАТФОРМА ДЕРЖИТ ПЕРЕХОД'"
];
for(const token of need) if(!s.includes(token)) throw new Error('missing '+token);

const recoveryMax=3.55;
const approachMin=3.48,approachMax=5.04,approachHalfX=1.55;
const stageMin=3.55,stageHalfX=1.55;
const pitMin=5.05,pitMax=5.82,pitZ=(pitMin+pitMax)/2;
const platformHalfX=1.05,platformHalfZ=.34,dockX=.16;
const boardZ=5.055,boardHalfX=1.45,boardHalfZ=.18;
const exitZ=5.80,exitHalfX=1.75,exitHalfZ=.28,exitRelease=6.02;
const captureMin=6.02;
const playerR=.4,brainR=.38;

const boardMin=boardZ-boardHalfZ,boardMax=boardZ+boardHalfZ;
const platformMin=pitZ-platformHalfZ,platformMax=pitZ+platformHalfZ;
const exitMin=exitZ-exitHalfZ,exitMax=exitZ+exitHalfZ;
const dockPlatformMinX=dockX-platformHalfX,dockPlatformMaxX=dockX+platformHalfX;

if(approachMin>recoveryMax) throw new Error('gap after second sweeper recovery');
if(approachMin>stageMin) throw new Error('approach starts after boarding stage');
if(approachMax<pitMin-.02) throw new Error('approach corridor stops before pit edge');
if(boardMax<platformMin || boardMin>platformMax) throw new Error('boarding bridge does not overlap moving platform in Z');
if(exitMax<platformMin || exitMin>platformMax) throw new Error('exit bridge does not overlap moving platform in Z');
if(captureMin>exitMax+.001) throw new Error('gap between exit bridge and checkpoint capture');
if(exitRelease>exitMax+.001) throw new Error('crossing releases beyond physical exit bridge');
if(dockPlatformMinX>boardHalfX || dockPlatformMaxX<-boardHalfX) throw new Error('docked moving platform misses boarding bridge in X');
if(2*(approachHalfX-playerR)<2.2) throw new Error('player carry approach too narrow');
if(2*(stageHalfX-brainR)<2.2) throw new Error('brainrot boarding stage too narrow');
if(boardHalfX<stageHalfX-playerR) throw new Error('boarding bridge too narrow for centered carry lane');
if(exitHalfX<stageHalfX-playerR) throw new Error('exit bridge too narrow for centered carry lane');

console.log('second-pit full route continuity v70 PASS', {
  recoveryToApproachOverlap:+(recoveryMax-approachMin).toFixed(3),
  approachToPitMargin:+(approachMax-pitMin).toFixed(3),
  boardPlatformOverlap:+(Math.min(boardMax,platformMax)-Math.max(boardMin,platformMin)).toFixed(3),
  platformExitOverlap:+(Math.min(exitMax,platformMax)-Math.max(exitMin,platformMin)).toFixed(3),
  exitCaptureOverlap:+(exitMax-captureMin).toFixed(3),
  usablePlayerApproachWidth:+(2*(approachHalfX-playerR)).toFixed(2),
  usableBrainStageWidth:+(2*(stageHalfX-brainR)).toFixed(2)
});
