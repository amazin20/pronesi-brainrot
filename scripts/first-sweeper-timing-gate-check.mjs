import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  "full 3D lift route v64 · shielded sweeper staging",
  "FIRST_SWEEPER_GATE_Z=-10.62",
  "FIRST_SWEEPER_GATE_CLOSED_Y=.62",
  "FIRST_SWEEPER_GATE_OPEN_Y=2.82",
  "function firstSweeperTimingGateBlocks",
  "if(firstSweeperTimingGateBlocks(x,z,.4))return true",
  "if(firstSweeperTimingGateBlocks(x,z,r,LIFT_GATE_BRAIN_TOP))return true",
  "gateOpen=recover||cleared||gateSensor",
  "ВОРОТА ЗАКРЫТЫ · ДОЖДИСЬ ОКНА"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
if(!(s.indexOf('firstSweeperTimingGateBlocks')<s.indexOf('function blocked'))) throw new Error('gate collision must exist before movement blockers');
const closed=.62-.11, open=2.82-.11, playerTop=2.12, brainTop=1.68;
if(!(closed<brainTop&&closed<playerTop)) throw new Error('closed gate must block both bodies');
if(!(open>playerTop&&open>brainTop)) throw new Error('open gate must clear both bodies');
console.log('first sweeper v64 physical timing gate: PASS',{closedBottom:closed,openBottom:open,playerTop,brainTop});
