/* -------------------------------- rendering -------------------------------- */
function part(bodyObj,lp,ls,lr,color,rough=.7,metal=.05,meshObj=meshes.box,emit=0){let p=V.add(bodyObj.pos,rotate(lp,bodyObj.rot)),r=V.add(bodyObj.rot,lr);drawMat(meshObj,p,ls,r,color,rough,metal,emit)}
function shadowAt(p,scale,alpha=.13){gl.depthMask(false);drawMat(meshes.sphere,V.v(p.x,.025,p.z),V.v(scale,.025,scale*.7),V.v(), '#1a2238',1,0,0,alpha);gl.depthMask(true)}
function drawCargo(b){let selected=b.hover||b.selected;if(b.model!=='boulder')shadowAt(b.pos,Math.min(1.3,.28+Math.pow(b.mass,.22)*.24),selected?.19:.11);
  if(b.model==='ball'){drawMat(meshes.sphere,b.pos,V.v(.52,.52,.52),b.rot,'#ffc934',.32,.02);for(let i=0;i<5;i++){let a=i*Math.PI*2/5+worldTime*.02;part(b,V.v(Math.cos(a)*.43,.18,Math.sin(a)*.43),V.v(.10,.10,.10),V.v(),'#ff6b5a',.42,.02,meshes.sphere)} }
  else if(b.model==='box'){part(b,V.v(),V.v(1.24,1.16,1.24),V.v(),b.color,.72,.02,meshes.boxSoft);part(b,V.v(0,.02,-.626),V.v(.20,1.03,.025),V.v(),'#efc675',.78);part(b,V.v(0,.595,0),V.v(.22,.025,1.02),V.v(),'#efc675',.78);for(const x of [-.48,.48])for(const z of [-.48,.48])part(b,V.v(x,-.47,z),V.v(.12,.12,.12),V.v(),'#8e5c35',.68)}
  else if(b.model==='plank'){part(b,V.v(),V.v(3.7,.32,.66),V.v(),b.color,.72,.02,meshes.boxSoft);for(let i=-3;i<=3;i++)part(b,V.v(i*.43,.165,-.05),V.v(.018,.018,.52),V.v(0,0,.05*Math.sin(i)),'#9e6134',.82);part(b,V.v(-1.45,.19,0),V.v(.34,.05,.52),V.v(),'#8b949f',.36,.72)}
  else if(b.model==='chair'){part(b,V.v(0,.45,0),V.v(1.04,.20,1.0),V.v(),'#58aabc',.62);for(const x of [-.42,.42])for(const z of [-.36,.36])part(b,V.v(x,-.13,z),V.v(.13,1.12,.13),V.v(),'#365e6b',.55,.08);for(const x of [-.43,.43])part(b,V.v(x,1.03,.41),V.v(.12,1.12,.13),V.v(),'#365e6b',.55,.08);for(let y=.70;y<1.4;y+=.22)part(b,V.v(0,y,.42),V.v(.88,.10,.10),V.v(),'#72bfd0',.58)}
  else if(b.model==='sofa'){part(b,V.v(0,-.08,0),V.v(3.1,.72,1.15),V.v(), '#cf4f82',.92,.01,meshes.boxSoft);part(b,V.v(0,.62,.48),V.v(3.05,1.16,.25),V.v(), '#c84a7c',.94,.01,meshes.boxSoft);for(const x of [-1.02,0,1.02]){part(b,V.v(x,.33,-.05),V.v(.92,.24,.91),V.v(), '#ed75a3',.96,.01,meshes.boxSoft);part(b,V.v(x,.78,.36),V.v(.90,.68,.18),V.v(-.08,0,0), '#e46a9b',.96,.01,meshes.boxSoft)}for(const x of [-1.43,1.43])part(b,V.v(x,.28,0),V.v(.30,1.10,1.18),V.v(), '#bc416f',.94,.01,meshes.boxSoft);for(const x of [-1.20,1.20])for(const z of [-.38,.38])part(b,V.v(x,-.55,z),V.v(.14,.30,.14),V.v(),'#5d463c',.56)}
  else if(b.model==='barrel'){drawMat(meshes.cyl,b.pos,V.v(1.10,1.52,1.10),b.rot,'#65758a',.38,.72);for(const y of [-.55,0,.55])part(b,V.v(0,y,0),V.v(1.18,.085,1.18),V.v(),'#283648',.28,.86,meshes.cyl);part(b,V.v(0,.78,0),V.v(.88,.04,.88),V.v(),'#738399',.3,.75,meshes.cyl)}
  else if(b.model==='fridge'){part(b,V.v(),V.v(1.32,2.24,1.24),V.v(), '#e9f0f4',.28,.38,meshes.boxSoft);part(b,V.v(0,.43,-.625),V.v(1.15,1.18,.035),V.v(),'#d9e3ea',.24,.42);part(b,V.v(0,-.65,-.625),V.v(1.15,.73,.035),V.v(),'#d4dee6',.24,.42);part(b,V.v(.48,.47,-.69),V.v(.055,.72,.07),V.v(),'#657486',.22,.84,meshes.boxSoft);part(b,V.v(.48,-.58,-.69),V.v(.055,.43,.07),V.v(),'#657486',.22,.84,meshes.boxSoft);part(b,V.v(-.35,.90,-.69),V.v(.18,.10,.03),V.v(),'#67d9ff',.18,.25,meshes.boxSoft,.2);for(let x=-.4;x<=.4;x+=.2)part(b,V.v(x,-1.04,.58),V.v(.09,.06,.03),V.v(),'#4e5e6f',.4,.8)}
  else if(b.model==='boulder'){shadowAt(b.pos,.95,.15);drawMat(meshes.boulder,b.pos,V.v(.82,.82,.82),b.rot,'#747b87',.95,.02);for(let i=0;i<5;i++){let a=i*1.27;part(b,V.v(Math.cos(a)*.55,.18*Math.sin(i*2.1),Math.sin(a)*.55),V.v(.12,.07,.17),V.v(),'#59616d',.98,.01,meshes.sphere)}}
  if(selected){gl.depthMask(false);drawMat(meshes.sphere,V.v(b.pos.x,.035,b.pos.z),V.v(1.0+.02*b.mass,.025,1.0+.02*b.mass),V.v(),b.selected?'#c8ff4a':'#58d8ff',.5,0,.7,.22);gl.depthMask(true)}
}
function drawStatic(s){if(!s.visible)return;let meshObj=s.kind==='floor'?meshes.box:meshes.boxSoft;drawMat(meshObj,V.v(s.x,s.y,s.z),V.v(s.sx,s.sy,s.sz),V.v(),s.color,s.rough,s.metal,s.emit)}
function drawEnvironment(){for(const s of statics)drawStatic(s);
  // floor markings and mats
  for(let x=0;x<30;x+=2){drawMat(meshes.box,V.v(x+.7,.012,-3.78),V.v(1.3,.018,.035),V.v(),x%4?'#f5f7fa':'#c8ff4a',.8,0);drawMat(meshes.box,V.v(x+.7,.012,3.78),V.v(1.3,.018,.035),V.v(),x%4?'#f5f7fa':'#c8ff4a',.8,0)}
  // wall panels and windows
  for(let x=1;x<29;x+=3.3){drawMat(meshes.boxSoft,V.v(x,2.15,-4.28),V.v(2.35,1.62,.045),V.v(),'#f7f9fb',.82,.02);drawMat(meshes.boxSoft,V.v(x,2.25,-4.22),V.v(1.35,.72,.04),V.v(),'#8dd9ff',.22,.12,.04)}
  // ceiling pipes on far wall
  drawBetween(V.v(3,3.65,-4.08),V.v(27,3.65,-4.08),.10,'#667488',.3,.75);for(let x=4;x<28;x+=4)drawBetween(V.v(x,3.65,-4.08),V.v(x,2.95,-4.08),.07,'#69778a',.3,.72);
  // shelving at spawn
  for(const z of [-3.45,3.45]){for(const x of [1.1,4.4,7.7]){for(const yy of [.48,1.55,2.6])drawMat(meshes.boxSoft,V.v(x,yy,z),V.v(2.5,.10,.58),V.v(),'#566579',.38,.76);for(const xx of [-1.15,1.15])drawMat(meshes.boxSoft,V.v(x+xx,1.52,z),V.v(.10,3.0,.10),V.v(),'#3e4c60',.34,.82)}}
  // lab signs
  drawMat(meshes.boxSoft,V.v(10.87,2.8,0),V.v(.06,.55,1.35),V.v(),'#c8ff4a',.38,.06,.12);drawMat(meshes.boxSoft,V.v(20.97,2.75,.72),V.v(.06,.50,1.15),V.v(),'#ff6b9e',.38,.05,.08);
  // finish/test pad arrows
  for(let z=-1.2;z<=1.2;z+=.6)drawMat(meshes.box,V.v(29.4,.12,z),V.v(.55,.025,.12),V.v(0,.45,0),'#273228',.7,0);
}
function solveElbow(S,H,side){let mid=V.mul(V.add(S,H),.5),d=V.len(V.sub(H,S)),bend=Math.sqrt(Math.max(0,.38*.38-(d*.5)*(d*.5))),right=V.v(Math.cos(player.yaw),0,-Math.sin(player.yaw));return V.add(mid,V.add(V.mul(right,side*bend*.35),V.v(0,-bend*.85,0)))}
function drawHand(p,side,grabbing){drawMat(meshes.boxSoft,p,V.v(.14,.10,.17),V.v(0,player.yaw,0),'#f2b895',.68,.01);if(grabbing){let r=V.v(Math.cos(player.yaw),0,-Math.sin(player.yaw));for(let i=0;i<4;i++){let q=V.add(p,V.add(V.mul(r,(i-1.5)*.035),V.v(0,-.04,.05)));drawBetween(q,V.add(q,V.v(0,-.08,.02)),.025,'#e8ab8a',.7)}}}
function drawPlayer(){let p=player.pos,f=V.v(Math.sin(player.yaw),0,Math.cos(player.yaw)),r=V.v(Math.cos(player.yaw),0,-Math.sin(player.yaw)),bob=player.onGround?Math.abs(Math.sin(player.walk))*0.035:0,str=player.strain,base=V.add(p,V.v(0,bob,0));shadowAt(base,.48,.12);
  let hip=V.add(base,V.add(V.mul(f,-player.lean*.18),V.v(0,.0,0))),chest=V.add(hip,V.add(V.mul(f,-player.lean*.25),V.v(0,.58,0))),head=V.add(chest,V.v(0,.58,0));
  // legs with procedural knees
  let phase=Math.sin(player.walk),step=(player.onGround?phase:0)*.25*(1-str*.65);for(const side of [-1,1]){let H=V.add(hip,V.mul(r,side*.18)),foot=V.add(base,V.add(V.mul(r,side*.18),V.add(V.mul(f,side*step),V.v(0,-.83,0)))),knee=V.lerp(H,foot,.48);knee=V.add(knee,V.add(V.mul(f,.12+Math.abs(step)*.3),V.v(0,-.02,0)));drawBetween(H,knee,.13,'#3d4966',.78);drawBetween(knee,foot,.12,'#465474',.78);drawMat(meshes.boxSoft,V.add(foot,V.mul(f,.09)),V.v(.24,.13,.38),V.v(0,player.yaw,0),'#f4f6fb',.52,.05)}
  // torso, jacket details, neck/head
  drawMat(meshes.boxSoft,chest,V.v(.72,.82,.43),V.v(0,player.yaw,player.lean*.12),'#665bdf',.72,.03);drawMat(meshes.boxSoft,V.add(chest,V.add(V.mul(f,.225),V.v(0,.02,0))),V.v(.09,.68,.035),V.v(0,player.yaw,0),'#a99fff',.58,.02);drawMat(meshes.boxSoft,V.add(hip,V.v(0,-.32,0)),V.v(.68,.16,.42),V.v(0,player.yaw,0),'#262f49',.62,.08);drawMat(meshes.cyl,V.add(chest,V.v(0,.42,0)),V.v(.16,.18,.16),V.v(), '#eab08e',.7);drawMat(meshes.sphere,head,V.v(.33,.36,.32),V.v(0,player.yaw,0),'#f2b895',.72,.01);
  // hair cap + face
  drawMat(meshes.sphere,V.add(head,V.add(V.mul(f,-.02),V.v(0,.15,0))),V.v(.34,.23,.33),V.v(0,player.yaw,0),'#2b2630',.86,.02);for(const side of [-1,1])drawMat(meshes.sphere,V.add(head,V.add(V.mul(r,side*.12),V.add(V.mul(f,.295),V.v(0,.02,0)))),V.v(.035,.05,.025),V.v(),'#20283a',.4,.05);drawMat(meshes.boxSoft,V.add(head,V.add(V.mul(f,.31),V.v(0,-.09,0))),V.v(.10,.025,.018),V.v(0,player.yaw,0),'#c97870',.65);
  // arms + IK
  let SL=V.add(chest,V.add(V.mul(r,-.43),V.v(0,.20,0))),SR=V.add(chest,V.add(V.mul(r,.43),V.v(0,.20,0))),swing=Math.sin(player.walk)*.22;
  let HL,HR;if(grip.body&&grip.handL&&grip.handR){HL=grip.handL;HR=grip.handR}else{HL=V.add(SL,V.add(V.mul(f,-.10-swing),V.v(0,-.58,0)));HR=V.add(SR,V.add(V.mul(f,-.10+swing),V.v(0,-.58,0)))}let EL=solveElbow(SL,HL,-1),ER=solveElbow(SR,HR,1);drawBetween(SL,EL,.105,'#665bdf',.72);drawBetween(EL,HL,.09,'#edb38f',.68);drawBetween(SR,ER,.105,'#665bdf',.72);drawBetween(ER,HR,.09,'#edb38f',.68);drawHand(HL,-1,!!grip.body);drawHand(HR,1,!!grip.body);
}

