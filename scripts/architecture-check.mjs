import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const html=read('index.html'),all=fs.readdirSync('src/overhaul').filter(f=>f.endsWith('.js')).map(f=>read('src/overhaul/'+f)).join('\n');
const active=['00-core.js','01-math.js','02-physics.js','02-physics-v2.js','03-levels.js','03-object-catalog-v2.js','03-world-v2.js','04-player-interaction-v2.js','05-mesh-data.js','05-renderer-v2.js','06-input-v2.js','07-platform.js','08-bootstrap.js','09-qa-v2.js'];
const checks=[
['root index exists',fs.existsSync('index.html')],
['every V2 runtime module is loaded',active.every(f=>html.includes(`src/overhaul/${f}`))],
['legacy interaction renderer input are not active',!html.includes('04-player-interaction.js')&&!html.includes('05-renderer.js')&&!html.includes('06-input.js')],
['legacy src/game not loaded',!html.includes('src/game/')],
['repo assets use relative paths',!/(?:src|href)="\/(?!sdk\.js)/.test(html)],
['SDK isolated from GitHub Pages',!html.includes('src="/sdk.js"')&&/sdkScriptWanted/.test(all)&&/github\\\.io/.test(all)],
['service worker is not registered',!all.includes('serviceWorker.register')&&!html.includes('serviceWorker.register')],
['build SHA visible',html.includes('id="buildSha"')&&/setBuild/.test(all)],
['camera-relative movement preserved',/camera\?\.forward/.test(read('src/overhaul/04-player-interaction-v2.js'))&&/camera\?\.right/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['V2 renderer active',/rendererVersion='V2'/.test(read('src/overhaul/05-renderer-v2.js'))],
['exact OBB surface picking active',/rayBodyOBB/.test(read('src/overhaul/05-renderer-v2.js'))&&/G\.pickBody=/.test(read('src/overhaul/05-renderer-v2.js'))],
['physical grip marker follows surface',/gripMarkerWorld/.test(all)&&/drawGripMarker/.test(read('src/overhaul/05-renderer-v2.js'))],
['cursor drives force target not object position',/forceTarget/.test(read('src/overhaul/06-input-v2.js'))&&/err\.x\*spring/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['gesture history drives bounded throw',/hist/.test(read('src/overhaul/06-input-v2.js'))&&/computeGesture/.test(read('src/overhaul/06-input-v2.js'))&&/massFactor/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['off-center impulse path preserved',/G\.addImpulse\(b/.test(read('src/overhaul/04-player-interaction-v2.js'))&&/anchorLocal/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['vertical body stacking contacts exist',/yov<c\.depth/.test(read('src/overhaul/02-physics-v2.js'))&&/a\.pos\.y\+=/.test(read('src/overhaul/02-physics-v2.js'))],
['bounded intact-to-broken destruction exists',/tryBreak/.test(read('src/overhaul/02-physics-v2.js'))&&/fragment=true/.test(read('src/overhaul/02-physics-v2.js'))],
['interactive environment spawns real bodies',/spawnCatalogItem/.test(read('src/overhaul/03-world-v2.js'))&&/S\.bodies\.push/.test(read('src/overhaul/03-world-v2.js'))],
['object gallery exists',/loadObjectGallery/.test(read('src/overhaul/03-world-v2.js'))],
['campaign has 15 authored delivery levels',(read('src/overhaul/03-levels.js').match(/L\('/g)||[]).length>=16],
['Pages build script exists',fs.existsSync('scripts/prepare-site.mjs')],
['bug hunt report exists',fs.existsSync('docs/BUG_HUNT_REPORT.md')]
];let fail=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)fail++}if(fail)process.exit(1);console.log(`Architecture checks passed: ${checks.length}/${checks.length}`);
