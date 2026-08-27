import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  "full 3D lift route v39 · latched sweeper safe crossing",
  "firstSweeperGateCrossing=false",
  "if(!firstSweeperGateCrossing&&(recover||cleared)&&gateSensor)firstSweeperGateCrossing=true",
  "if(firstSweeperGateCrossing&&p.z>FIRST_SWEEPER_GATE_Z+.72&&bp.z>FIRST_SWEEPER_GATE_Z+.72)firstSweeperGateCrossing=false",
  "gateOpen=recover||cleared||gateSensor||firstSweeperGateCrossing",
  "ВОРОТА ДЕРЖАТ ПРОХОД · ПРОНЕСИ БРЕЙНРОТ"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
const gateZ=-10.62, release=gateZ+.72;
function simulate({phase='warning',playerZ=gateZ,brainZ=gateZ,latch=false,sensor=true}){
  const recover=phase==='recover', cleared=phase==='cleared';
  if(!latch&&(recover||cleared)&&sensor) latch=true;
  if(latch&&playerZ>release&&brainZ>release) latch=false;
  return {latch,open:recover||cleared||sensor||latch};
}
let q=simulate({phase:'recover',sensor:true});
if(!q.latch||!q.open) throw new Error('safe-window entry must latch gate open');
q=simulate({phase:'warning',playerZ:gateZ+.56,brainZ:gateZ+.28,latch:q.latch,sensor:false});
if(!q.latch||!q.open) throw new Error('gate must stay open mid-crossing after phase changes');
q=simulate({phase:'burst',playerZ:release+.05,brainZ:release-.04,latch:q.latch,sensor:false});
if(!q.latch||!q.open) throw new Error('gate must wait for both bodies');
q=simulate({phase:'burst',playerZ:release+.05,brainZ:release+.05,latch:q.latch,sensor:false});
if(q.latch||q.open) throw new Error('gate may relock only after both bodies clear release plane');
console.log('first sweeper gate crossing latch: PASS');
