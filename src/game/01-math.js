/* ------------------------------ tiny math ------------------------------ */
const V={
  v:(x=0,y=0,z=0)=>({x,y,z}), add:(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z}), sub:(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z}), mul:(a,s)=>({x:a.x*s,y:a.y*s,z:a.z*s}),
  dot:(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z, cross:(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x}), len:a=>Math.hypot(a.x,a.y,a.z),
  norm:a=>{let l=Math.hypot(a.x,a.y,a.z)||1;return{x:a.x/l,y:a.y/l,z:a.z/l}}, clampLen:(a,m)=>{let l=Math.hypot(a.x,a.y,a.z);return l>m&&l>0?{x:a.x*m/l,y:a.y*m/l,z:a.z*m/l}:{...a}},
  lerp:(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t})
};
const M4={
  I(){let o=new Float32Array(16);o[0]=o[5]=o[10]=o[15]=1;return o},
  mul(a,b){let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o},
  perspective(fovy,asp,n,f){let q=1/Math.tan(fovy/2),nf=1/(n-f),o=new Float32Array(16);o[0]=q/asp;o[5]=q;o[10]=(f+n)*nf;o[11]=-1;o[14]=2*f*n*nf;return o},
  lookAt(e,t,u){let z=V.norm(V.sub(e,t)),x=V.norm(V.cross(u,z)),y=V.cross(z,x),o=this.I();o[0]=x.x;o[1]=y.x;o[2]=z.x;o[4]=x.y;o[5]=y.y;o[6]=z.y;o[8]=x.z;o[9]=y.z;o[10]=z.z;o[12]=-V.dot(x,e);o[13]=-V.dot(y,e);o[14]=-V.dot(z,e);return o},
  TRS(p,r,s){let cx=Math.cos(r.x),sx=Math.sin(r.x),cy=Math.cos(r.y),sy=Math.sin(r.y),cz=Math.cos(r.z),sz=Math.sin(r.z);let o=this.I();
    o[0]=(cy*cz+sy*sx*sz)*s.x;o[1]=(cx*sz)*s.x;o[2]=(-sy*cz+cy*sx*sz)*s.x;
    o[4]=(-cy*sz+sy*sx*cz)*s.y;o[5]=(cx*cz)*s.y;o[6]=(sy*sz+cy*sx*cz)*s.y;
    o[8]=(sy*cx)*s.z;o[9]=(-sx)*s.z;o[10]=(cy*cx)*s.z;o[12]=p.x;o[13]=p.y;o[14]=p.z;return o},
  basis(p,x,y,z,s){let o=this.I();o[0]=x.x*s.x;o[1]=x.y*s.x;o[2]=x.z*s.x;o[4]=y.x*s.y;o[5]=y.y*s.y;o[6]=y.z*s.y;o[8]=z.x*s.z;o[9]=z.y*s.z;o[10]=z.z*s.z;o[12]=p.x;o[13]=p.y;o[14]=p.z;return o}
};
function rotate(v,r){let cx=Math.cos(r.x),sx=Math.sin(r.x),cy=Math.cos(r.y),sy=Math.sin(r.y),cz=Math.cos(r.z),sz=Math.sin(r.z);let x=v.x,y=v.y,z=v.z;let y1=y*cx-z*sx,z1=y*sx+z*cx;y=y1;z=z1;let x1=x*cy+z*sy;z=-x*sy+z*cy;x=x1;let x2=x*cz-y*sz;y=x*sz+y*cz;return{x:x2,y,z}}
function invRotate(v,r){return rotate(v,{x:-r.x,y:-r.y,z:-r.z})}
function hex(h,a=1){h=h.replace('#','');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255,a]}

