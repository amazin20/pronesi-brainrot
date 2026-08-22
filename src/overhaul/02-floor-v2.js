'use strict';
(()=>{const G=window.GAME,S=G.state,{invRot2}=G;
const WALKABLE=new Set(['step','platform','ramp']);
G.floorHeight=(x,z)=>{let top=0;for(const s of S.statics){if(!WALKABLE.has(s.kind))continue;const q=invRot2(x-s.x,z-s.z,s.yaw||0);if(Math.abs(q.x)>s.sx/2||Math.abs(q.z)>s.sz/2)continue;top=Math.max(top,s.y+s.sy/2)}return top};
G.walkableStaticKinds=WALKABLE;
})();
