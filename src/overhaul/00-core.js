'use strict';
const $=id=>document.getElementById(id);
const GAME=window.GAME={};
GAME.canvas=$('gl');
GAME.UI={
 level:$('levelLabel'),cargo:$('cargoLabel'),timer:$('timerLabel'),reset:$('resetBtn'),pauseBtn:$('pauseBtn'),hint:$('hint'),interaction:$('interaction'),interactionTitle:$('interactionTitle'),interactionText:$('interactionText'),grip:$('gripMeter'),gripFill:$('gripFill'),gripState:$('gripState'),toast:$('toast'),menu:$('menu'),play:$('playBtn'),lab:$('labBtn'),pause:$('pause'),resume:$('resumeBtn'),restartPause:$('restartPauseBtn'),complete:$('complete'),completeTitle:$('completeTitle'),completeText:$('completeText'),next:$('nextBtn'),finish:$('finish'),again:$('againBtn'),sdk:$('sdkBadge'),build:$('buildSha'),joy:$('joystick'),stick:$('stick'),jump:$('jumpBtn'),rotL:$('rotateLeftBtn'),rotR:$('rotateRightBtn')
};
GAME.C={ink:'#10172b',lime:'#c8ff4a',violet:'#7566ff',pink:'#ff5d9c',cyan:'#58d8ff',wood:'#b97846',metal:'#d8e2e7',dark:'#2c384e',skin:'#f0b791',shirt:'#655ae0',pants:'#33405d'};
GAME.state={mode:'menu',paused:false,levelIndex:0,time:0,level:null,bodies:[],statics:[],goal:null,required:[],player:null,keys:{},joy:{x:0,z:0},rotateInput:0,grip:null,pointer:null,shake:0,impactCooldown:0,best:{},completed:0,worldTime:0,lastFrame:performance.now(),build:'dev',qa:false};
try{GAME.state.best=JSON.parse(localStorage.getItem('carry_overhaul_best')||'{}')||{}}catch{GAME.state.best={}}
GAME.safeSave=()=>{try{localStorage.setItem('carry_overhaul_best',JSON.stringify(GAME.state.best))}catch{}};
GAME.formatTime=t=>{const m=Math.floor(t/60),s=t-m*60;return`${String(m).padStart(2,'0')}:${s.toFixed(1).padStart(4,'0')}`};
let toastTimer=0;GAME.toast=(text,force=2)=>{GAME.UI.toast.textContent=text;GAME.UI.toast.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>GAME.UI.toast.classList.add('hidden'),360);GAME.state.shake=Math.min(.9,GAME.state.shake+force*.025);try{if(force>6&&navigator.vibrate)navigator.vibrate(10)}catch{}};
GAME.setBuild=sha=>{const s=(sha||'dev').slice(0,12);GAME.state.build=s;GAME.UI.build.textContent=s};
GAME.setBuild(window.__BUILD_SHA__||'dev');
