import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const src = fs.readFileSync(file, 'utf8');

function number(name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(-?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`);
  const match = src.match(re);
  if (!match) throw new Error(`Missing numeric constant ${name}`);
  return Number(match[1]);
}

function pit(index) {
  const match = src.match(/const PITS=\[(.*?)\];/s);
  if (!match) throw new Error('Missing PITS definition');
  const pairs = [...match[1].matchAll(/\[(-?(?:\d+(?:\.\d*)?|\.\d+)),(-?(?:\d+(?:\.\d*)?|\.\d+))\]/g)]
    .map(([, a, b]) => [Number(a), Number(b)]);
  if (!pairs[index]) throw new Error(`Missing pit ${index}`);
  return pairs[index];
}

const [pitStart, pitEnd] = pit(2);
const halfX = number('SECOND_PLATFORM_HALF_X');
const halfZ = number('SECOND_PLATFORM_HALF_Z');
const baseX = number('SECOND_PLATFORM_BASE_X');
const travel = number('SECOND_PLATFORM_TRAVEL');

const motion = src.match(/Math\.sin\(t\*(\d+(?:\.\d+)?)\)/g)?.find(x => src.includes(`SECOND_PLATFORM_TRAVEL*${x}`));
const omegaMatch = motion?.match(/t\*(\d+(?:\.\d+)?)/);
const omega = omegaMatch ? Number(omegaMatch[1]) : 1.55;

if (!src.includes('secondPitPlatforms=[[-SECOND_PLATFORM_BASE_X') || !src.includes('[SECOND_PLATFORM_BASE_X')) {
  throw new Error('Second pit platforms are not mirrored around the center lane');
}
if (!src.includes('supportedBySecondPit') || !src.includes('onSecondPitPlatform')) {
  throw new Error('Second pit support is not wired into runtime collision/support');
}
if (!src.includes('playerRideVX=dx*invDt') || !src.includes('brainRideVX=dx*invDt')) {
  throw new Error('Moving-platform momentum is not transferred to player and brainrot');
}

const pitCenter = (pitStart + pitEnd) * 0.5;
const halfPitZ = (pitEnd - pitStart) * 0.5;
const playerSupportMarginZ = 0.08;
const brainSupportMarginZ = 0.15;
const playerDockOverlap = halfZ + playerSupportMarginZ - halfPitZ;
const brainDockOverlap = halfZ + brainSupportMarginZ - halfPitZ;

if (playerDockOverlap <= 0) throw new Error(`Player support has a Z gap of ${(-playerDockOverlap).toFixed(3)} m`);
if (brainDockOverlap <= 0) throw new Error(`Brainrot support has a Z gap of ${(-brainDockOverlap).toFixed(3)} m`);
if (Math.abs(pitCenter - 5.435) > 1e-6) throw new Error(`Unexpected second pit center ${pitCenter}`);

const closestCenterX = Math.abs(baseX - travel);
const centerCoverage = halfX - closestCenterX;
if (centerCoverage < 0.75) {
  throw new Error(`Platform does not provide a carry-safe center lane: coverage=${centerCoverage.toFixed(3)} m`);
}

const safeCenterLimit = Math.min(0.55, halfX - 0.45);
const threshold = (baseX - safeCenterLimit) / travel;
if (!(threshold > -1 && threshold < 1)) throw new Error('No finite center boarding window');
const theta = Math.asin(threshold);
const centerWindow = (Math.PI - 2 * theta) / omega;
const requiredCarryWindow = 0.72;
if (centerWindow < requiredCarryWindow) {
  throw new Error(`Center boarding window too short: ${centerWindow.toFixed(3)} s < ${requiredCarryWindow.toFixed(3)} s`);
}

console.log('SECOND PIT CARRY WINDOW: PASS');
console.log(`pit Z: ${pitStart.toFixed(2)}..${pitEnd.toFixed(2)} (center ${pitCenter.toFixed(3)})`);
console.log(`player edge support overlap: ${playerDockOverlap.toFixed(3)} m`);
console.log(`brainrot edge support overlap: ${brainDockOverlap.toFixed(3)} m`);
console.log(`center-lane platform coverage: ${centerCoverage.toFixed(3)} m`);
console.log(`carry-safe center window: ${centerWindow.toFixed(3)} s`);
