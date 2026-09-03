'use strict';
(()=>{
  const G=window.GAME;
  if(!G) return;

  G.levels=[{
    name:'НОВЫЙ УРОВЕНЬ · ЗИГЗАГ-ДОСТАВКА',
    theme:'warehouse',
    player:[-10,0],
    cargos:[['crate',-7.4,0,0,'cargo']],
    goal:[10,0,3.8,4.8],
    walls:[
      [-1,-4.6,22,.4,2.8,{}],
      [-1,4.6,22,.4,2.8,{}],
      [-6.7,-1.45,.45,6.3,2.8,{}],
      [-3.9,1.45,.45,6.3,2.8,{}],
      [-1.1,-1.45,.45,6.3,2.8,{}],
      [1.7,1.45,.45,6.3,2.8,{}],
      [4.5,-1.45,.45,6.3,2.8,{}],
      [7.2,1.45,.45,6.3,2.8,{}],
      [0,-3.55,2.3,1.25,.28,{kind:'step'}],
      [0,-2.35,2.3,1.15,.55,{kind:'step'}],
      [0,-1.25,2.3,1.0,.82,{kind:'step'}],
      [8.6,-2.1,.45,3.7,1.85,{kind:'lowwall'}],
      [8.6,2.1,.45,3.7,1.85,{kind:'lowwall'}]
    ],
    props:[
      ['pallet',-8.5,3.2,0],
      ['sign',-5.4,-3.6,0],
      ['crateProp',-2.2,3.4,.2],
      ['tire',1.8,-3.6,0],
      ['pallet',4.8,3.3,Math.PI/2],
      ['sign',7.8,-3.5,0]
    ],
    notes:'Preview branch: completely new level layout built from scratch on the existing physics/rendering engine.'
  }];
})();
