'use strict';
(()=>{
const G=window.GAME,S=G.state,C=G.camera,{V,clamp}=G,canvas=G.canvas;
if(!C||!G.render)return;
const TAU=Math.PI*2,wrap=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
let targetYaw=Number.isFinite(C.orbit)?C.orbit:-.60,appliedYaw=targetYaw;
let targetPitch=.59,appliedPitch=.59,lastT=performance.now();
C.orbitTarget=targetYaw;C.pitch=appliedPitch;C.pitchTarget=targetPitch;
let lastPointerY=0;
canvas.addEventListener('pointerdown',e=>{lastPointerY=e.clientY},{capture:true});
canvas.addEventListener('pointermove',e=>{
  const P=S.pointer;
  if(P?.down&&P.camera){
    const dy=e.clientY-lastPointerY;
    if(Math.abs(dy)<160){targetPitch=clamp(targetPitch+dy*.0038,.30,1.00);C.pitchTarget=targetPitch;}
  }
  lastPointerY=e.clientY;
},{capture:true});
const baseRender=G.render;
G.render=()=>{
  const now=performance.now(),dt=clamp((now-lastT)/1000,1/240,.05);lastT=now;
  const externalDelta=wrap((Number.isFinite(C.orbit)?C.orbit:appliedYaw)-appliedYaw);
  if(Math.abs(externalDelta)>.000001)targetYaw=wrap(targetYaw+externalDelta);
  const ay=1-Math.exp(-dt*13.5),ap=1-Math.exp(-dt*11.0);
  appliedYaw=wrap(appliedYaw+wrap(targetYaw-appliedYaw)*ay);
  appliedPitch+= (targetPitch-appliedPitch)*ap;
  C.orbit=appliedYaw;C.orbitTarget=targetYaw;C.pitch=appliedPitch;C.pitchTarget=targetPitch;
  const P=S.player;
  if(P){
    const fixedFocus=V.add(P.pos,V.v(1.4,.40,0));
    const f=P.forward||V.v(1,0,0),speed=Math.hypot(P.vel?.x||0,P.vel?.z||0);
    const lookAhead=clamp(speed*.09,0,.42);
    const focus=V.add(P.pos,V.v(f.x*lookAhead,.88,f.z*lookAhead));
    const cargo=S.grip?.body;
    const dist=cargo?clamp(7.9+Math.max(cargo.w,cargo.d)*.34,8.4,10.2):7.7;
    const horiz=dist*Math.cos(appliedPitch),height=dist*Math.sin(appliedPitch);
    const desiredEye=V.add(focus,V.v(-horiz*Math.cos(appliedYaw),height,horiz*Math.sin(appliedYaw)));
    const rendererDesired=V.add(fixedFocus,V.v(-dist*Math.cos(appliedYaw),5.15,dist*Math.sin(appliedYaw)));
    const solvePre=(wanted,fixed,k)=>({x:(wanted.x-k*fixed.x)/(1-k),y:(wanted.y-k*fixed.y)/(1-k),z:(wanted.z-k*fixed.z)/(1-k)});
    C.target=solvePre(focus,fixedFocus,.13);
    C.eye=solvePre(desiredEye,rendererDesired,.11);
  }
  baseRender();
};
const oldReset=G.rendererResetCamera;
G.rendererResetCamera=()=>{oldReset?.();targetYaw=appliedYaw=Number.isFinite(C.orbit)?C.orbit:-.60;targetPitch=appliedPitch=.59;C.orbitTarget=targetYaw;C.pitch=C.pitchTarget=targetPitch};
G.cameraControllerVersion='PLAYER_CENTERED_CAMERA_V3';
})();