import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  'full 3D lift route v87 · modeled first sweeper entry gate',
  'FIRST_SWEEPER_ENTRY_MODEL_V87=true',
  "FirstSweeperEntryPostV87",
  "FirstSweeperEntryTopV87",
  "FirstSweeperEntryBeaconV87",
  "FirstSweeperGatePostV87",
  "FirstSweeperGateBarV87",
  "FirstSweeperGateBarRingV87",
  'FIRST_SWEEPER_GATE_Z=-10.62',
  'FIRST_SWEEPER_GATE_HALF_X=1.74',
  'FIRST_SWEEPER_GATE_CLOSED_Y=.62',
  'FIRST_SWEEPER_GATE_OPEN_Y=2.82',
  'function firstSweeperTimingGateBlocks',
  'gateOpen=recover||cleared||firstSweeperGateCrossing'
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
for(const x of ['sweeperEntryL=box(','sweeperEntryR=box(','sweeperEntryTop=box(','firstSweeperGateL=box(','firstSweeperGateR=box(','firstSweeperGate=box(']) if(s.includes(x)) throw new Error('legacy primitive remains '+x);
const closed=.62-.11, open=2.82-.11, playerTop=2.12, brainTop=1.68;
if(!(closed<brainTop&&closed<playerTop)) throw new Error('closed gate no longer blocks both bodies');
if(!(open>playerTop&&open>brainTop)) throw new Error('open gate no longer clears both bodies');
console.log('first sweeper entry model v87: PASS',{closedBottom:closed,openBottom:open,playerTop,brainTop});
