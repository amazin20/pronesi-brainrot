import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const html=read('index.html'),all=fs.readdirSync('src/overhaul').filter(f=>f.endsWith('.js')).map(f=>read('src/overhaul/'+f)).join('\n');
const active=['00-core.js','01-math.js','02-physics.js','02-static-style-v2.js','02-floor-v2.js','02-physics-v2.js','03-levels.js','03-object-catalog-v2.js','03-world-v2.js','04-player-interaction-v2.js','05-mesh-data.js','05-renderer-v2.js','05-polish-v2.js','06-input-v2.js','07-platform.js','07-audio-v2.js','08-bootstrap.js','09-qa-v2.js'];
const legacy=['src/overhaul/04-player-interaction.js','src/overhaul/05-renderer.js','src/overhaul/06-input.js'];
const checks=[
['root index exists',fs.existsSync('index.html')],
['every V2 runtime module is loaded',active.every(f=>html.includes(`src/overhaul/${f}`))],
['obsolete interaction renderer input files are deleted',legacy.every(f=>!fs.existsSync(f))],
['legacy src/game not loaded',!html.includes('src/game/')],
['repo assets use relative paths',!/(?:src|href)="\/(?!sdk\.js)/.test(html)],
['SDK isolated from GitHub Pages',!html.includes('src="/sdk.js"')&&/sdkScriptWanted/.test(all)&&/github\\\.io/.test(all)],
['service worker is not registered',!all.includes('serviceWorker.register')&&!html.includes('serviceWorker.register')],
['build SHA visible',html.includes('id="buildSha"')&&/setBuild/.test(all)],
['camera-relative movement preserved',/camera\?\.forward/.test(read('src/overhaul/04-player-interaction-v2.js'))&&/camera\?\.right/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['V2 renderer active',/rendererVersion='V2'/.test(read('src/overhaul/05-renderer-v2.js'))],
['themed static material fallback is active',/s\.color=null/.test(read('src/overhaul/02-static-style-v2.js'))&&/s\.color\|\|th\.wall/.test(read('src/overhaul/05-renderer-v2.js'))],
['exact OBB surface picking active',/rayBodyOBB/.test(read('src/overhaul/05-renderer-v2.js'))&&/G\.pickBody=/.test(read('src/overhaul/05-renderer-v2.js'))],
['curved hero surfaces have shape-aware ray picking',/rayEllipsoid/.test(read('src/overhaul/05-polish-v2.js'))&&/rayCylinder/.test(read('src/overhaul/05-polish-v2.js'))&&/rayBodySurface/.test(read('src/overhaul/05-polish-v2.js'))],
['physical grip marker follows surface',/gripMarkerWorld/.test(all)&&/drawGripMarker/.test(read('src/overhaul/05-renderer-v2.js'))],
['surface normal from curved picker drives marker orientation',/hit\?\.normal/.test(read('src/overhaul/05-polish-v2.js'))&&/normalLocal/.test(read('src/overhaul/05-polish-v2.js'))],
['cursor drives force target not object position',/forceTarget/.test(read('src/overhaul/06-input-v2.js'))&&/err\.x\*spring/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['gesture history drives bounded throw',/hist/.test(read('src/overhaul/06-input-v2.js'))&&/computeGesture/.test(read('src/overhaul/06-input-v2.js'))&&/massFactor/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['off-center impulse path preserved',/G\.addImpulse\(b/.test(read('src/overhaul/04-player-interaction-v2.js'))&&/anchorLocal/.test(read('src/overhaul/04-player-interaction-v2.js'))],
['spatial broadphase replaces full dynamic O(n^2) candidate pass',/G\.dynamicPairs=/.test(read('src/overhaul/02-physics.js'))&&/const pairs=G\.dynamicPairs/.test(read('src/overhaul/02-physics.js'))],
['sleeping bodies use integration fast path',/if\(b\.sleeping\)continue/.test(read('src/overhaul/02-physics.js'))],
['physics material table covers cardboard ceramic glass concrete',/cardboard/.test(read('src/overhaul/02-physics.js'))&&/ceramic/.test(read('src/overhaul/02-physics.js'))&&/glass/.test(read('src/overhaul/02-physics.js'))&&/concrete/.test(read('src/overhaul/02-physics.js'))],
['floor solver only accepts explicit walkable kinds',/WALKABLE/.test(read('src/overhaul/02-floor-v2.js'))&&/step/.test(read('src/overhaul/02-floor-v2.js'))&&/platform/.test(read('src/overhaul/02-floor-v2.js'))&&!/top<=2\.4/.test(read('src/overhaul/02-floor-v2.js'))],
['vertical body stacking contacts exist',/yov<c\.depth/.test(read('src/overhaul/02-physics-v2.js'))&&/a\.pos\.y\+=/.test(read('src/overhaul/02-physics-v2.js'))],
['bounded deferred intact-to-broken destruction exists',/queueBreak/.test(read('src/overhaul/02-physics-v2.js'))&&/flushBreakQueue/.test(read('src/overhaul/02-physics-v2.js'))&&/fragment=true/.test(read('src/overhaul/02-physics-v2.js'))],
['fragile floor impact destruction exists',/b\.grounded&&f\.vy<0/.test(read('src/overhaul/02-physics-v2.js'))&&/impactEvent\(b,null,speed/.test(read('src/overhaul/02-physics-v2.js'))],
['interactive environment spawns real bodies',/spawnCatalogItem/.test(read('src/overhaul/03-world-v2.js'))&&/S\.bodies\.push/.test(read('src/overhaul/03-world-v2.js'))],
['object gallery exists',/loadObjectGallery/.test(read('src/overhaul/03-world-v2.js'))],
['camera cutaway hides blocking static wall',/currentCutaway/.test(read('src/overhaul/05-polish-v2.js'))&&/s\.visible=false/.test(read('src/overhaul/05-polish-v2.js'))],
['material audio covers fragile and office materials',/ceramic/.test(read('src/overhaul/07-audio-v2.js'))&&/glass/.test(read('src/overhaul/07-audio-v2.js'))&&/cardboard/.test(read('src/overhaul/07-audio-v2.js'))],
['campaign has 15 authored delivery levels',(read('src/overhaul/03-levels.js').match(/L\('/g)||[]).length>=16],
['Pages build script exists',fs.existsSync('scripts/prepare-site.mjs')],
['bug hunt report exists',fs.existsSync('docs/BUG_HUNT_REPORT.md')]
];let fail=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)fail++}if(fail)process.exit(1);console.log(`Architecture checks passed: ${checks.length}/${checks.length}`);
