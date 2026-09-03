'use strict';
(()=>{
  const G=window.GAME,S=G.state;
  if(!G?.loadLevel||!G?.spawnCatalogItem) return;

  const oldLoad=G.loadLevel;
  const spawn=(id,x,z,yaw=0,opt={})=>G.spawnCatalogItem(id,x,z,{yaw,...opt});
  const onTop=(id,support,dx=0,dz=0,yaw=0)=>{
    const def=G.objectById?.[id];
    if(!def||!support) return null;
    const q=G.rot2(dx,dz,support.yaw||0);
    const y=support.pos.y+support.h/2+def.h/2+.015;
    return spawn(id,support.pos.x+q.x,support.pos.z+q.z,yaw,{y,force:true});
  };

  function decorateFreshDemo(){
    if(!S.level?.freshDemo) return;

    // LOADING DOCK: stacked cargo and tools frame the starting area.
    for(const p of [
      [-12.4,-4.6,0],[-11.0,-4.65,.15],[-9.5,-4.7,-.1],
      [-12.3,4.55,0],[-10.7,4.65,-.12],[-9.1,4.6,.12]
    ]) spawn('pallet_box',p[0],p[1],p[2]);
    for(const p of [[-12.1,-4.55,.08],[-10.3,4.55,-.08]]) spawn('large_crate',p[0],p[1],p[2]);
    spawn('toolbox',-8.7,-4.75,.1);
    spawn('sack',-8.8,4.75,-.15);
    spawn('cone',-8.0,-3.0,0);
    spawn('cone',-8.0,3.0,0);

    // OFFICE / BREAK AREA: real physical furniture plus fragile clutter.
    const deskA=spawn('coffee_table',-.4,4.55,0);
    const deskB=spawn('coffee_table',1.1,-4.55,Math.PI);
    if(deskA){
      onTop('office_monitor',deskA,-.16,0,0);
      onTop('keyboard',deskA,.13,-.08,0);
      onTop('mug',deskA,.34,.08,0);
    }
    if(deskB){
      onTop('laptop',deskB,-.13,0,Math.PI);
      onTop('desk_phone',deskB,.30,.08,Math.PI);
      onTop('glass',deskB,-.34,.09,0);
    }
    spawn('wood_chair',-1.35,4.2,-.25);
    spawn('wood_chair',2.0,-4.15,.35);
    spawn('plantpot',-2.0,5.0,0);
    spawn('trashcan',2.45,-4.85,0);

    // STORAGE AISLES: shelves and loose physical pieces make the middle zone dense.
    const shelfA=spawn('shelf_unit',4.0,4.75,Math.PI);
    const shelfB=spawn('shelf_unit',7.7,4.75,Math.PI);
    if(shelfA){
      onTop('book',shelfA,-.25,0,0);
      onTop('binder',shelfA,.18,0,0);
    }
    if(shelfB){
      onTop('bottle',shelfB,-.22,0,0);
      onTop('jar',shelfB,.20,0,0);
    }
    spawn('metal_crate',4.0,-4.75,.05);
    spawn('wood_crate',5.25,-4.8,-.08);
    spawn('pipe',6.2,-4.85,.75);
    spawn('plank',7.3,-4.75,-.55);
    spawn('material_roll',7.9,-3.05,.2);
    spawn('bucket',4.4,3.15,0);
    spawn('mop',5.05,3.15,1.1);

    // FINAL BAY: visual goal framing without blocking the 6.2 x 7.4 finish zone.
    spawn('watercooler',10.1,-5.0,0);
    spawn('plantpot',10.1,5.0,0);
    spawn('nightstand',13.1,-5.0,0);
    spawn('dresser',13.0,5.0,Math.PI);
    spawn('cone',9.55,-2.65,0);
    spawn('cone',9.55,2.65,0);

    // Keep the player/cargo presentation explicit for this one-level demo.
    if(G.UI?.level) G.UI.level.textContent='НОЧНОЙ СКЛАД · ТРОЙНАЯ ДОСТАВКА';
    if(G.UI?.cargo) G.UI.cargo.textContent='КОРОБКА + БОЧКА + КРЕСЛО';
  }

  G.loadLevel=(index,opt={})=>{
    const level=oldLoad(index,opt);
    decorateFreshDemo();
    return level;
  };
})();
