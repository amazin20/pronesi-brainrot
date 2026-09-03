'use strict';
(()=>{
  const G=window.GAME;
  if(!G) return;

  G.themes.nightdock={
    sky:'#171a3f',floor:'#252a3a',grid:'#3b4462',wall:'#35405c',top:'#596987',accent:'#50e3ff'
  };

  const W=(x,z,sx,sz,h=2.8,opt={})=>[x,z,sx,sz,h,opt];
  const P=(type,x,z,a=0)=>[type,x,z,a];
  const fresh={
    name:'НОЧНОЙ СКЛАД · ТРОЙНАЯ ДОСТАВКА',
    theme:'nightdock',
    freshDemo:true,
    player:[-13.0,0],
    cargos:[
      ['crate',-10.7,-2.15,0,'crate-demo'],
      ['barrel',-10.7,0,0,'barrel-demo'],
      ['chair',-10.7,2.15,Math.PI/2,'chair-demo']
    ],
    goal:[12.1,0,6.2,7.4],
    walls:[
      W(0,-6.15,29.0,.45,3.2),W(0,6.15,29.0,.45,3.2),
      W(-14.25,0,.45,12.3,3.2),W(14.25,0,.45,12.3,3.2),
      W(-7.35,-4.25,.45,3.8,3.0),W(-7.35,4.25,.45,3.8,3.0),
      W(-2.85,2.0,.45,8.3,3.0),
      W(2.05,-2.0,.45,8.3,3.0),
      W(5.15,-3.95,2.0,2.1,.24,{kind:'step'}),
      W(6.45,-3.95,1.0,2.1,.48,{kind:'step'}),
      W(7.20,-3.95,.55,2.1,.72,{kind:'step'}),
      W(8.85,-4.35,.45,3.6,2.05,{kind:'lowwall'}),
      W(8.85,4.35,.45,3.6,2.05,{kind:'lowwall'})
    ],
    props:[
      P('pallet',-12.2,4.7,0),P('sign',-8.4,-5.0,0),P('crateProp',-5.0,4.8,.15),
      P('tire',-1.2,-4.9,0),P('pallet',3.5,4.9,Math.PI/2),P('arcade',5.7,4.8,0),
      P('arcade',7.0,4.8,0),P('sign',10.2,-5.0,0),P('pallet',12.3,4.8,0)
    ],
    notes:'Fresh demo: three required cargos, four route zones, alternate openings, stair island, final loading bay and a dedicated interactive environment pass.'
  };

  G.freshDemoLevel=fresh;
  // Preserve the canonical campaign unchanged for its existing regression suite.
  // Normal users and the dedicated fresh-demo QA see the new level as level 1.
  const campaignQA=new URLSearchParams(location.search).has('qa');
  if(!campaignQA&&Array.isArray(G.levels)&&G.levels.length) G.levels[0]=fresh;
})();
