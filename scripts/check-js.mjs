import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const files=fs.readdirSync('src/game').filter(f=>f.endsWith('.js')).sort();
let failed=false;
for(const file of files){
  const path=`src/game/${file}`;
  const r=spawnSync(process.execPath,['--check',path],{stdio:'inherit'});
  if(r.status!==0) failed=true;
}
if(failed) process.exit(1);
console.log(`Checked ${files.length} JavaScript modules.`);
