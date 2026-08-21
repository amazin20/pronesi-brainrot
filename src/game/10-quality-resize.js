/* ----------------------------- quality / resize ----------------------------- */
let quality=localStorage.getItem('carry_lab_quality')||((devicePixelRatio||1)>1.7?'high':'medium');
const qualityBtn=$('qualityBtn');
function updateQualityLabel(){if(qualityBtn)qualityBtn.textContent=quality.toUpperCase()}
if(qualityBtn)qualityBtn.onclick=()=>{quality=quality==='high'?'medium':quality==='medium'?'low':'high';localStorage.setItem('carry_lab_quality',quality);updateQualityLabel();resize();boom('КАЧЕСТВО '+quality.toUpperCase(),2)};updateQualityLabel();
function resize(){let cap=quality==='high'?1.8:quality==='medium'?1.35:1,d=Math.min(cap,devicePixelRatio||1);canvas.width=Math.max(1,Math.floor(innerWidth*d));canvas.height=Math.max(1,Math.floor(innerHeight*d));gl.viewport(0,0,canvas.width,canvas.height)}addEventListener('resize',resize);resize();

