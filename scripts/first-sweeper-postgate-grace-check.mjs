import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  "full 3D lift route v69 · physical second sweeper shield and recovery",
  "firstSweeperPostGateGrace=0",
  "firstSweeperPostGateGrace=.55",
  "firstSweeperPostGateGrace=Math.max(0,firstSweeperPostGateGrace-dt)",
  "i!==0||firstSweeperPostGateGrace<=0",
  "SWEEPER · БЕЗОПАСНЫЙ ВЫХОД"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
let grace=.55, dt=.035, frames=0;
while(grace>0&&frames<100){grace=Math.max(0,grace-dt);frames++}
const seconds=frames*dt;
if(seconds<.52||seconds>.60) throw new Error('grace duration drift '+seconds);
const firstHitAllowed=(i,grace)=>i!==0||grace<=0;
if(firstHitAllowed(0,.3)) throw new Error('first sweeper must not hit during post-gate grace');
if(!firstHitAllowed(1,.3)) throw new Error('second sweeper must stay active');
if(!firstHitAllowed(0,0)) throw new Error('first sweeper must reactivate after grace');
console.log('first sweeper v71 post-gate grace: PASS',seconds.toFixed(3)+'s');
