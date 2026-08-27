import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  "liftRouteUnlocked=false",
  "const routeLock=liftRouteUnlocked&&carry",
  "holdForCarry=boarding||crossingCarry||routeLock",
  "p.z>LIFT_Z+LIFT_HALF_Z+LIFT_EXIT_RELEASE",
  "ЛИФТ ЗАФИКСИРОВАН · ПРОНЕСИ БРЕЙНРОТ",
  "full 3D lift route v37 · latched carry crossing"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
const gate=s.indexOf('liftSafetyOpen=docked||holdForCarry');
const lock=s.indexOf('const routeLock=liftRouteUnlocked&&carry');
if(lock<0||gate<lock) throw new Error('route lock must feed safety gate state');
console.log('first lift route lock invariants: PASS');
