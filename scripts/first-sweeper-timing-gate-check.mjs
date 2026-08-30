import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  "full 3D route v102 · modeled group runtime safety",
  "FIRST_SWEEPER_RECOVER=.72",
  "FIRST_SWEEPER_GATE_Z=-10.62",
  "FIRST_SWEEPER_GATE_CLOSED_Y=.62",
  "FIRST_SWEEPER_GATE_OPEN_Y=2.82",
  "FIRST_SWEEPER_GATE_HALF_Y=.11",
  "function firstSweeperTimingGateBlocks",
  "if(firstSweeperTimingGateBlocks(x,z,.4))return true",
  "if(firstSweeperTimingGateBlocks(x,z,r,LIFT_GATE_BRAIN_TOP))return true",
  "gateOpen=recover||cleared||firstSweeperGateCrossing",
  "if(!firstSweeperGateCrossing&&(recover||cleared)&&gateSensor)firstSweeperGateCrossing=true",
  "gateStep=5.4*dt",
  "ВОРОТА ЗАКРЫТЫ · ДОЖДИСЬ ОКНА"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
if(!(s.indexOf('firstSweeperTimingGateBlocks')<s.indexOf('function blocked'))) throw new Error('gate collision must exist before movement blockers');
const closedY=.62,openY=2.82,halfY=.11,playerTop=2.12,brainTop=1.68,recover=.72,gateSpeed=5.4;
const closedBottom=closedY-halfY,openBottom=openY-halfY,openingTime=(openY-closedY)/gateSpeed,fullyOpenWindow=recover-openingTime;
if(!(closedBottom<brainTop&&closedBottom<playerTop)) throw new Error('closed gate must block both bodies');
if(!(openBottom>playerTop&&openBottom>brainTop)) throw new Error('open gate must clear both bodies');
if(!(openingTime<recover)) throw new Error('gate must physically clear before recovery window ends');
if(!(fullyOpenWindow>=.30)) throw new Error(`usable carry window too short: ${fullyOpenWindow.toFixed(3)}s`);
console.log('first sweeper v102 physical timing gate: PASS',{closedBottom,openBottom,playerTop,brainTop,openingTime:Number(openingTime.toFixed(3)),fullyOpenWindow:Number(fullyOpenWindow.toFixed(3)),crossingLatch:true});
