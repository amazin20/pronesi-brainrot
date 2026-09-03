(()=>{'use strict';
const qs=new URLSearchParams(location.search);if(!qs.has('freshqa'))return;
const q=window.__CARRY_QA__,out=[];
const check=(ok,name)=>{out.push(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)throw new Error(name)};
const finite=s=>s.bodies.every(b=>Number.isFinite(b.x+b.y+b.z+b.yaw+b.vx+b.vy+b.vz+b.ang));
try{
  check(!!q,'QA hook exists');
  let s=q.state;
  check(s.levelCount===15,'campaign count remains 15');
  check(document.getElementById('levelLabel')?.textContent.includes('НОЧНОЙ СКЛАД'),'fresh demo is the visible first level');
  const tags=new Set(s.bodies.map(b=>b.tag));
  check(tags.has('crate-demo')&&tags.has('barrel-demo')&&tags.has('chair-demo'),'three fresh-demo cargos spawned');
  check(s.bodies.length>=20,`interactive demo environment spawned (${s.bodies.length} bodies)`);
  check(finite(s),'fresh demo starts finite');
  q.play();q.step(240);s=q.state;check(finite(s),'fresh demo survives 240 physics frames');
  const p0={...s.player};q.setKey('KeyW',true);q.step(48);q.setKey('KeyW',false);const p1=q.state.player;
  check(Math.hypot(p1.x-p0.x,p1.z-p0.z)>.15,'player moves in fresh demo');
  q.placeRequiredInGoal();check(q.goalCheck(),'all three cargos can satisfy the finish goal');
  document.body.dataset.freshQa='pass';document.title='FRESH_DEMO_QA_PASS';
  const pre=document.createElement('pre');pre.id='fresh-qa-report';pre.textContent=out.join('\n');pre.style.display='none';document.body.appendChild(pre);
}catch(e){
  document.body.dataset.freshQa='fail';document.title='FRESH_DEMO_QA_FAIL';
  const pre=document.createElement('pre');pre.id='fresh-qa-report';pre.textContent=out.concat('ERROR '+(e.stack||e)).join('\n');document.body.appendChild(pre);console.error(e);
}})();
