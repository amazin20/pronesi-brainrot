import fs from 'node:fs';
const s=fs.readFileSync('index.html','utf8');
for(const needle of ['makeCrashBarrier(x,z,c)','const crashBarriers=blocks.map','new THREE.CapsuleGeometry(.46,1.95,5,10)','makeBumperPillar(x,z)','const bumperPillars=cylinders.map','new THREE.TorusGeometry(.61,.13,8,18)','new THREE.OctahedronGeometry(.18,0)','modeled static hazards']){if(!s.includes(needle))throw new Error('missing '+needle)}
for(const removed of ['blocks.forEach((p,i)=>box(p[0],.3,p[1],3,.58,2.2','cylinders.forEach(p=>cyl(p[0],.8,p[1],.65,1.6']){if(s.includes(removed))throw new Error('legacy primitive remains '+removed)}
const blockCount=(s.match(/\[-3\.05,-16\]|\[3\.05,-11\]|\[-2\.1,-6\]|\[2\.1,-1\]|\[-2\.1,4\]/g)||[]).length;
const pillarCount=(s.match(/\[3\.15,-18\]|\[-3\.15,-13\]|\[2,-8\]|\[-2,-3\]|\[2,2\]/g)||[]).length;
if(blockCount!==5)throw new Error('expected five barrier anchors, got '+blockCount);
if(pillarCount!==5)throw new Error('expected five pillar anchors, got '+pillarCount);
console.log('static obstacle model v62: PASS',{barriers:blockCount,pillars:pillarCount});
