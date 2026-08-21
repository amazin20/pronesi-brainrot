/* ------------------------------- lab assets ------------------------------- */
function cbox(x,y,z,hx,hy,hz){return{c:V.v(x,y,z),h:V.v(hx,hy,hz)}}
function addLabObjects(){
  body({name:'МЯЧ',tag:'ball',mass:1,x:1.0,y:.65,z:-2.55,sphere:.52,material:'rubber',color:'#ffcf3e',gripForce:380,lift:true,model:'ball'});
  body({name:'ЯЩИК A',tag:'boxA',mass:8,x:2.0,y:.6,z:-1.15,colliders:[cbox(0,0,0,.62,.58,.62)],material:'wood',color:'#d8954f',gripForce:350,lift:true,model:'box'});
  body({name:'ЯЩИК B',tag:'boxB',mass:8,x:3.45,y:.6,z:-1.15,colliders:[cbox(0,0,0,.62,.58,.62)],material:'wood',color:'#c77f43',gripForce:350,lift:true,model:'box'});
  body({name:'ДЛИННАЯ ДОСКА',tag:'plank',mass:20,x:2.2,y:.36,z:1.8,ry:.16,colliders:[cbox(0,0,0,1.85,.16,.33)],material:'wood',color:'#c88745',gripForce:330,lift:true,model:'plank',inertia:.9});
  body({name:'СТУЛ',tag:'chair',mass:10,x:4.2,y:.76,z:2.25,ry:-.2,colliders:[cbox(0,.45,0,.52,.1,.5),cbox(0,1.05,.42,.52,.55,.1),cbox(-.43,-.15,-.36,.08,.55,.08),cbox(.43,-.15,-.36,.08,.55,.08),cbox(-.43,-.15,.36,.08,.55,.08),cbox(.43,-.15,.36,.08,.55,.08)],material:'wood',color:'#56a6b8',gripForce:340,lift:true,model:'chair'});
  body({name:'ДИВАН',tag:'sofa',mass:60,x:6.1,y:.9,z:-2.35,ry:Math.PI/2,colliders:[cbox(0,-.05,0,1.55,.42,.58),cbox(0,.62,.47,1.55,.62,.12),cbox(-1.43,.28,0,.16,.55,.62),cbox(1.43,.28,0,.16,.55,.62),cbox(-1.2,-.48,-.4,.1,.25,.1),cbox(1.2,-.48,-.4,.1,.25,.1)],material:'fabric',color:'#dd5f8f',gripForce:235,lift:false,model:'sofa',inertia:1.25,throwable:false});
  body({name:'БОЧКА',tag:'barrel',mass:80,x:7.0,y:.78,z:2.25,colliders:[cbox(0,0,0,.56,.76,.56)],material:'metal',color:'#52677e',gripForce:200,lift:false,model:'barrel',inertia:.8,throwable:false});
  body({name:'ХОЛОДИЛЬНИК',tag:'fridge',mass:115,x:8.45,y:1.15,z:2.35,colliders:[cbox(0,0,0,.66,1.12,.62)],material:'metal',color:'#e7eef3',gripForce:165,lift:false,model:'fridge',inertia:1.4,throwable:false});
  body({name:'ВАЛУН',tag:'boulder',mass:150,x:9.7,y:.85,z:-2.4,sphere:.82,material:'stone',color:'#767c89',gripForce:110,lift:false,model:'boulder',throwable:false,inertia:1.3});
}
function addEnvironment(){statics.length=0;
  staticBox(14,-.35,0,30,.7,9,{color:'#d9e3e8',material:'stone',kind:'floor'});
  // outer lab walls
  staticBox(14,2.15,-4.45,30,4.3,.35,{color:'#ebf0f4'});staticBox(14,2.15,4.45,30,4.3,.35,{color:'#ebf0f4'});
  // sofa door frame: 2.05 m clear width in Z
  staticBox(11.2,1.6,-2.74,.52,3.2,3.43,{color:'#6f7c93',material:'stone'});staticBox(11.2,1.6,2.74,.52,3.2,3.43,{color:'#6f7c93',material:'stone'});staticBox(11.2,3.25,0,.52,.4,3.85,{color:'#5d6980',material:'stone'});
  // narrow corridor
  staticBox(14.3,1.25,-1.45,5.7,2.5,.35,{color:'#d7dfe8'});staticBox(14.3,1.25,1.45,5.7,2.5,.35,{color:'#d7dfe8'});
  // steps and ramp area
  staticBox(18.0,.18,0,1.25,.36,5.3,{color:'#b5c1cc'});staticBox(18.85,.36,0,.9,.72,5.3,{color:'#aebbc7'});staticBox(19.55,.54,0,.55,1.08,5.3,{color:'#a8b5c2'});
  // throw wall with side opening for player
  staticBox(21.3,1.25,-2.45,.55,2.5,4.0,{color:'#7b72d8'});staticBox(21.3,1.25,2.45,.55,2.5,4.0,{color:'#7b72d8'});
  // low ceiling test
  staticBox(24.1,2.15,0,4.2,.35,5.1,{color:'#8091a6'});
  // ramp built as steps approximation for reliable collision
  for(let i=0;i<7;i++)staticBox(26.0+i*.45,.10+i*.10,0,.5,.20+i*.20,4.6,{color:i%2?'#a8b4c2':'#b5c0cc'});
  // neon test pad end
  staticBox(29.4,.05,0,2.6,.1,3.8,{color:'#bfff4d',material:'rubber',emit:.18});
}
function resetBody(b){let spawn=spawns[b.tag];if(!spawn)return;b.pos={...spawn.p};b.prev={...spawn.p};b.vel=V.v();b.rot={...spawn.r};b.ang=V.v();if(grip.body===b)releaseGrip(false)}
const spawns={ball:{p:V.v(1,.65,-2.55),r:V.v()},boxA:{p:V.v(2,.6,-1.15),r:V.v()},boxB:{p:V.v(3.45,.6,-1.15),r:V.v()},plank:{p:V.v(2.2,.36,1.8),r:V.v(0,.16,0)},chair:{p:V.v(4.2,.76,2.25),r:V.v(0,-.2,0)},sofa:{p:V.v(6.1,.9,-2.35),r:V.v(0,Math.PI/2,0)},barrel:{p:V.v(7,.78,2.25),r:V.v()},fridge:{p:V.v(8.45,1.15,2.35),r:V.v()},boulder:{p:V.v(9.7,.85,-2.4),r:V.v()}};

