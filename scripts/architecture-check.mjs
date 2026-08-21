import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const html=read('index.html'),files=fs.readdirSync('src/overhaul').filter(f=>f.endsWith('.js')).sort(),all=files.map(f=>read('src/overhaul/'+f)).join('\n');
const checks=[
['root index exists',fs.existsSync('index.html')],
['all overhaul modules loaded',files.every(f=>html.includes(`src/overhaul/${f}`))],
['legacy src/game not loaded',!html.includes('src/game/')],
['repo assets use relative paths',!/(?:src|href)="\/(?!sdk\.js)/.test(html)],
['SDK is dynamically isolated from GitHub Pages',!html.includes('src="/sdk.js"')&&/sdkScriptWanted/.test(all)&&/github\\\.io/.test(all)&&/sc\.src='\/sdk\.js'/.test(all)],
['service worker is not registered',!all.includes('serviceWorker.register')&&!html.includes('serviceWorker.register')],
['legacy scoped service workers are unregistered',/getRegistrations/.test(all)&&/reg\.unregister/.test(all)&&/pronesi-eto-physics-lab/.test(all)],
['build SHA is visible',html.includes('id="buildSha"')&&/setBuild/.test(all)],
['camera-relative movement exists',/camera\?\.forward/.test(all)&&/camera\?\.right/.test(all)],
['camera obstruction system exists',/segmentAABB/.test(all)&&/camera\.obstructions/.test(all)],
['adaptive substeps exist',/physicsSubsteps/.test(all)&&/clamp\(Math\.ceil\(worst\),1,12\)/.test(all)],
['sleeping exists',/sleepTime/.test(all)&&/sleeping=true/.test(all)],
['grip uses force not teleport',/G\.addForce/.test(all)||/b\.vel\.x\+=force\.x/.test(all)],
['grip point is local surface point',/anchorLocal/.test(all)&&/invRot2/.test(all)],
['mobile joystick and pointer are separate',/joyId/.test(all)&&/P\.id/.test(all)],
['campaign has 15 authored levels',(read('src/overhaul/03-levels.js').match(/L\('/g)||[]).length>=16],
['Pages build script exists',fs.existsSync('scripts/prepare-site.mjs')],
['bug hunt report exists',fs.existsSync('docs/BUG_HUNT_REPORT.md')]
];let fail=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)fail++}if(fail)process.exit(1);console.log(`Architecture checks passed: ${checks.length}/${checks.length}`);
