import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const required=[
  'FIRST_SWEEPER_STAGING_Z_MIN=-12.42',
  'FIRST_SWEEPER_STAGING_Z_MAX=-10.72',
  'FIRST_SWEEPER_STAGING_HALF_X=1.74',
  'makeFirstSweeperShieldRail',
  'inFirstSweeperStagingRail',
  'const firstSweeperStagingSafe=carry&&!firstSweeperCleared',
  'firstSweeperStagingSafe?1.25+.55*firstSweeperShieldPulse:.72',
  "state.textContent='SWEEPER · ЗАЩИТНЫЙ КАРМАН · ЖДИ ЗЕЛЁНЫЕ ВОРОТА'",
  'i!==0||(!firstSweeperStagingSafe&&!firstSweeperCarryLane&&firstSweeperPostGateGrace<=0)'
];
for(const needle of required){if(!s.includes(needle))throw new Error('missing '+needle)}
const zMin=-12.42,zMax=-10.72,gateZ=-10.62,halfX=1.74,playerR=.4,brainR=.38,sweeperZ=-9,sweeperRadius=4.15;
const length=zMax-zMin,playerClear=halfX-playerR,brainClear=halfX-brainR,gateGap=gateZ-zMax;
if(zMax>=gateZ)throw new Error('shield must remain behind timing gate');
if(length<1.5)throw new Error('staging shield too short for carry pair');
if(playerClear<1.3)throw new Error('player staging corridor too narrow');
if(brainClear<1.3)throw new Error('brainrot staging corridor too narrow');
if(Math.abs(zMin-sweeperZ)>=sweeperRadius)throw new Error('staging no longer overlaps sweeper hazard reach; shielding invariant stale');
if(gateGap<.08)throw new Error('staging pocket must leave a readable buffer before the timing gate');
console.log('first sweeper staging shield: PASS',{length,playerClear,brainClear,gateGap,carryHitShield:true,postGateGraceLinked:true});
