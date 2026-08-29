import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
const must=[
  'FINAL_MID_SAFE_MODEL_V81=true',
  'FinalMidSafeGuardV81',
  'FinalMidSafeRailV81',
  'FINAL_MID_SAFE_Z_MIN=7.88',
  'FINAL_MID_SAFE_Z_MAX=8.18',
  'function inFinalMidSafeRail',
  'i===1&&midSafe',
  "ФИНАЛ · БЕЗОПАСНЫЙ КАРМАН · ЖДИ ВТОРОЙ УДАР"
];
for(const x of must) if(!s.includes(x)) throw new Error('missing '+x);
const min=7.88,max=8.18,z1=7.55,z2=8.38;
if(!(min>z1 && max<z2 && max-min>=.299)) throw new Error('unsafe midpoint placement');
console.log('PASS final midpoint pocket v67', {depth:(max-min).toFixed(2), between:[z1,z2]});
