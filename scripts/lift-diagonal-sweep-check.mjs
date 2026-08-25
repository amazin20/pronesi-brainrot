import assert from 'node:assert/strict';

const CEILING={minX:-1.85,maxX:1.85,minY:3.5,maxY:3.82,minZ:-14.93,maxZ:-13.58};

function segmentHitsExpandedAabb(a,b,box,r=0){
  const min={x:box.minX-r,y:box.minY-r,z:box.minZ-r};
  const max={x:box.maxX+r,y:box.maxY+r,z:box.maxZ+r};
  let t0=0,t1=1;
  for(const k of ['x','y','z']){
    const d=b[k]-a[k];
    if(Math.abs(d)<1e-9){
      if(a[k]<min[k]||a[k]>max[k]) return false;
      continue;
    }
    let lo=(min[k]-a[k])/d,hi=(max[k]-a[k])/d;
    if(lo>hi)[lo,hi]=[hi,lo];
    t0=Math.max(t0,lo); t1=Math.min(t1,hi);
    if(t0>t1) return false;
  }
  return t1>=0&&t0<=1;
}

function resolveDiagonalSweep(prev,next,r){
  if(!segmentHitsExpandedAabb(prev,next,CEILING,r)) return {...next,hit:false};
  const eps=.015;
  let lo=0,hi=1;
  for(let i=0;i<18;i++){
    const m=(lo+hi)*.5;
    const p={x:prev.x+(next.x-prev.x)*m,y:prev.y+(next.y-prev.y)*m,z:prev.z+(next.z-prev.z)*m};
    if(segmentHitsExpandedAabb(prev,p,CEILING,r)) hi=m; else lo=m;
  }
  const t=Math.max(0,lo-eps);
  return {x:prev.x+(next.x-prev.x)*t,y:prev.y+(next.y-prev.y)*t,z:prev.z+(next.z-prev.z)*t,hit:true};
}

assert.equal(segmentHitsExpandedAabb({x:2.45,y:3.05,z:-15.15},{x:1.25,y:4.15,z:-14.2},CEILING,.34),true);
assert.equal(segmentHitsExpandedAabb({x:2.4,y:4.45,z:-15.1},{x:1.1,y:4.55,z:-14.0},CEILING,.34),false);
assert.equal(segmentHitsExpandedAabb({x:2.4,y:3.1,z:-12.8},{x:1.1,y:4.2,z:-12.4},CEILING,.34),false);
const prev={x:2.5,y:3.0,z:-15.2},next={x:1.1,y:4.15,z:-14.1};
const r=resolveDiagonalSweep(prev,next,.34);
assert.equal(r.hit,true);
assert.equal(segmentHitsExpandedAabb(r,next,CEILING,.34),true);
assert.equal(segmentHitsExpandedAabb(prev,r,CEILING,.34),false);

console.log('lift-diagonal-sweep-check: PASS');
