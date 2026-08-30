import fs from 'node:fs';

const src = fs.readFileSync('index.html', 'utf8');
const fail = message => { console.error(`first pit carrier continuity: FAIL — ${message}`); process.exit(1); };
const must = token => { if (!src.includes(token)) fail(`missing runtime token: ${token}`); };

must('const PIT_PLATFORM_TOP=.08,PIT_PLATFORM_HALF_X=1.45,PIT_PLATFORM_HALF_Z=.38');
must('const pitPlatform=box(0,-.04,-4.2,PIT_PLATFORM_HALF_X*2,.24,PIT_PLATFORM_HALF_Z*2,0xffd84d)');
must('function onPitPlatform(x,y,z,brain=false)');
must('function movePitPlatform(t,dt)');
must('pitPlatformStripe.position.z=newZ');
must('playerRidingNow=true');
must('brainRidingNow=true');
must('p.z+=dz');
must('bp.z+=dz');

if (!/PITS=\[\[-15\.2,-13\.55\],\[-4\.85,-3\.55\],\[5\.05,5\.82\]\]/.test(src)) fail('first moving-platform pit bounds changed without updating this contract');

const motion = src.match(/newZ=(-?\d+(?:\.\d+)?)\+Math\.sin\(t\*([\d.]+)\)\*([\d.]+)/);
if (!motion) fail('first carrier sinusoidal motion not found');
const center = Number(motion[1]);
const amplitude = Number(motion[3]);
const halfZ = .38;
const pitMin = -4.85;
const pitMax = -3.55;
const leftDockOverlap = pitMin - (center - amplitude - halfZ);
const rightDockOverlap = (center + amplitude + halfZ) - pitMax;
if (leftDockOverlap < .005 || rightDockOverlap < .005) fail(`carrier no longer reaches both dock lips: left=${leftDockOverlap.toFixed(3)} right=${rightDockOverlap.toFixed(3)}`);
if (leftDockOverlap > .08 || rightDockOverlap > .08) fail(`carrier penetrates dock too deeply: left=${leftDockOverlap.toFixed(3)} right=${rightDockOverlap.toFixed(3)}`);

const visualTop = -.04 + .24 / 2;
if (Math.abs(visualTop - .08) > 1e-9) fail(`collision top drifted from PIT_PLATFORM_TOP: ${visualTop}`);

console.log(`first pit carrier continuity: PASS — dock overlap L=${leftDockOverlap.toFixed(3)} R=${rightDockOverlap.toFixed(3)}, top=${visualTop.toFixed(2)}`);
