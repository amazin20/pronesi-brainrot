import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const here=path.dirname(fileURLToPath(import.meta.url));
const indexPath=process.argv[2]||path.resolve(here,'../index.html');
const selfTest=process.argv.includes('--self-test');
const source=selfTest?`
const FINAL_GAUNTLET_Z1=7.55,FINAL_GAUNTLET_Z2=8.38,FINAL_GAUNTLET_HOME_X=3.42,FINAL_GAUNTLET_IN_X=.92,FINAL_GAUNTLET_HALF_X=.68,FINAL_GAUNTLET_HALF_Z=.34,FINAL_GAUNTLET_CLEAR_Z=8.92,FINAL_GAUNTLET_SPEED=2.35;
const finalPunchers=[[-1,FINAL_GAUNTLET_Z1,0xffb12b],[1,FINAL_GAUNTLET_Z2,0xff557c]].map(([side,z,c],i)=>{});
const oldX=h.mesh.position.x,cycle=((t*FINAL_GAUNTLET_SPEED+i*Math.PI)%(Math.PI*4)+Math.PI*4)%(Math.PI*4),warning=active&&cycle<.85,attack=active&&cycle>=.85&&cycle<2.35,phase=attack?Math.sin((cycle-.85)/1.5*Math.PI):0,targetX=active?h.side*(FINAL_GAUNTLET_HOME_X-(FINAL_GAUNTLET_HOME_X-FINAL_GAUNTLET_IN_X)*phase):h.side*FINAL_GAUNTLET_HOME_X,maxStep=5.8*dt,newX=oldX+Math.max(-maxStep,Math.min(maxStep,targetX-oldX));
const minX=Math.min(oldX,newX)-FINAL_GAUNTLET_HALF_X,maxX=Math.max(oldX,newX)+FINAL_GAUNTLET_HALF_X,dir=Math.sign(vx||(-h.side))||1;
if(!attack||hitLock>0||Math.abs(z-h.z)>FINAL_GAUNTLET_HALF_Z+r||x<minX-r||x>maxX+r)return false;
`:fs.readFileSync(indexPath,'utf8');

function must(re,label){assert.match(source,re,label)}
must(/FINAL_GAUNTLET_HOME_X=3\.42,FINAL_GAUNTLET_IN_X=\.92,FINAL_GAUNTLET_HALF_X=\.68,FINAL_GAUNTLET_HALF_Z=\.34/,'final puncher collision envelope constants changed');
must(/FINAL_GAUNTLET_SPEED=2\.35/,'final puncher cycle speed changed');
must(/finalPunchers=\[\[-1,FINAL_GAUNTLET_Z1,[^\]]+\],\[1,FINAL_GAUNTLET_Z2,[^\]]+\]\]\.map/,'both alternating final punchers must exist');
must(/maxStep=5\.8\*dt,newX=oldX\+Math\.max\(-maxStep,Math\.min\(maxStep,targetX-oldX\)\)/,'frame-rate bounded puncher travel must remain enabled');
must(/minX=Math\.min\(oldX,newX\)-FINAL_GAUNTLET_HALF_X,maxX=Math\.max\(oldX,newX\)\+FINAL_GAUNTLET_HALF_X/,'swept collision envelope must cover old-to-new travel');
must(/Math\.abs\(z-h\.z\)>FINAL_GAUNTLET_HALF_Z\+r\|\|x<minX-r\|\|x>maxX\+r/,'collision test must include Z radius and swept X radius');

const HOME=3.42,INNER=.92,SPEED=2.35,MAX_SPEED=5.8;
function simulate(hz,index){const dt=1/hz,side=index?1:-1;let x=side*HOME,minAbs=Math.abs(x),maxFrame=0,attackFrames=0;for(let t=0;t<8;t+=dt){const cycle=((t*SPEED+index*Math.PI)%(Math.PI*4)+Math.PI*4)%(Math.PI*4);const attack=cycle>=.85&&cycle<2.35;const phase=attack?Math.sin((cycle-.85)/1.5*Math.PI):0;const target=side*(HOME-(HOME-INNER)*phase);const step=MAX_SPEED*dt;const next=x+Math.max(-step,Math.min(step,target-x));maxFrame=Math.max(maxFrame,Math.abs(next-x));x=next;if(attack){attackFrames++;minAbs=Math.min(minAbs,Math.abs(x))}}
assert.ok(attackFrames>=Math.floor(.55*hz),`too few attack samples at ${hz} Hz`);assert.ok(minAbs<=1.12,`puncher no longer reaches gameplay lane at ${hz} Hz: ${minAbs.toFixed(3)}`);assert.ok(maxFrame<=MAX_SPEED*dt+1e-9,`puncher exceeds bounded step at ${hz} Hz`);return{hz,index,minAbs,maxFrame};}
const rows=[];for(const hz of [20,30,60,120])for(const index of [0,1])rows.push(simulate(hz,index));
console.log('FINAL_PUNCHER_PHYSICS_CONTRACT_V65 PASS');
for(const r of rows)console.log(`${r.hz}Hz p${r.index+1}: min|x|=${r.minAbs.toFixed(3)} maxFrame=${r.maxFrame.toFixed(4)}`);
