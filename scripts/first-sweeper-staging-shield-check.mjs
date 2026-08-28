import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of ['FIRST_SWEEPER_STAGING_Z_MIN=-12.42','FIRST_SWEEPER_STAGING_Z_MAX=-10.72','FIRST_SWEEPER_STAGING_HALF_X=1.74','makeFirstSweeperShieldRail','inFirstSweeperStagingRail','firstSweeperStagingSafe','!firstSweeperStagingSafe&&!firstSweeperCarryLane','ЗАЩИТНЫЙ КАРМАН','shielded sweeper staging']){if(!s.includes(needle))throw new Error('missing '+needle)}
const zMin=-12.42,zMax=-10.72,gateZ=-10.62,halfX=1.74,playerR=.4,brainR=.38,sweeperZ=-9,sweeperRadius=4.15;
if(zMax>=gateZ)throw new Error('shield must remain behind timing gate');
if(zMax-zMin<1.5)throw new Error('staging shield too short for carry pair');
if(halfX-playerR<1.3)throw new Error('player staging corridor too narrow');
if(halfX-brainR<1.3)throw new Error('brainrot staging corridor too narrow');
if(Math.abs(zMin-sweeperZ)>=sweeperRadius)throw new Error('staging no longer overlaps sweeper hazard reach; shielding invariant stale');
console.log('first sweeper staging shield: PASS',{length:zMax-zMin,playerClear:halfX-playerR,brainClear:halfX-brainR,gateGap:gateZ-zMax});
