import fs from 'node:fs';import vm from 'node:vm';
const ctx={window:{GAME:{state:{bodies:[],statics:[]}}}};vm.createContext(ctx);for(const f of ['src/overhaul/01-math.js','src/overhaul/02-physics.js','src/overhaul/02-floor-v2.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});const G=ctx.window.GAME,S=G.state;let fail=0;const check=(ok,name)=>{console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++};
S.statics=[G.makeStatic(0,.9,0,2,1.8,2,{kind:'lowwall'})];check(Math.abs(G.floorHeight(0,0))<1e-9,'lowwall is never treated as floor');
S.statics.push(G.makeStatic(3,.25,0,2,.5,2,{kind:'step'}));check(Math.abs(G.floorHeight(3,0)-.5)<1e-9,'step contributes its top surface');
S.statics.push(G.makeStatic(-3,.4,0,2,.8,1,{kind:'platform',yaw:.5}));check(Math.abs(G.floorHeight(-3,0)-.8)<1e-9,'rotated platform contributes its top surface');
check(Math.abs(G.floorHeight(7,7))<1e-9,'empty ground remains base floor');
if(fail)process.exit(1);console.log('Walkable floor regression PASS.');
