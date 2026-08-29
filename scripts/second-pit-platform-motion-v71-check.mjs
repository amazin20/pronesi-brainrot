import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const src = fs.readFileSync(file, 'utf8');

function number(name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(-?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`);
  const match = src.match(re);
  if (!match) throw new Error(`Missing numeric constant ${name}`);
  return Number(match[1]);
}

const halfX = number('SECOND_PLATFORM_HALF_X');
const baseX = number('SECOND_PLATFORM_BASE_X');
const travel = number('SECOND_PLATFORM_TRAVEL');
const boardX = number('SECOND_PIT_BOARD_X');
const boardSpeed = number('SECOND_PIT_BOARD_SPEED');

if (!src.includes('secondPitPlatforms=[[-SECOND_PLATFORM_BASE_X') || !src.includes('[SECOND_PLATFORM_BASE_X')) {
  throw new Error('Second-pit moving platforms are no longer mirrored');
}
if (!src.includes('supportedBySecondPit') || !src.includes('onSecondPitPlatform')) {
  throw new Error('Second-pit platforms are not part of runtime support');
}
if (!src.includes('playerRideVX=dx*invDt') || !src.includes('brainRideVX=dx*invDt')) {
  throw new Error('Platform horizontal velocity is not transferred to rider/carry body');
}

const omegaMatch = src.match(/Math\.sin\(t\*(\d+(?:\.\d+)?)\)/);
const omega = omegaMatch ? Number(omegaMatch[1]) : 1.55;
if (!(omega > 0.5 && omega < 3.5)) throw new Error(`Unexpected platform angular speed ${omega}`);

const carryRadius = 0.45;
const safeCenterX = Math.max(0, halfX - carryRadius);
const centerThreshold = (baseX - safeCenterX) / travel;
if (!(centerThreshold > -1 && centerThreshold < 1)) {
  throw new Error('Moving platform never exposes a finite carry-safe center window');
}

const theta = Math.asin(centerThreshold);
const safeWindow = (Math.PI - 2 * theta) / omega;
const boardTraverse = Math.abs(boardX) / boardSpeed;
if (safeWindow < 0.72) throw new Error(`Carry-safe center window too short: ${safeWindow.toFixed(3)} s`);
if (boardTraverse > safeWindow * 0.45) {
  throw new Error(`Boarding correction consumes too much safe window: ${boardTraverse.toFixed(3)} s / ${safeWindow.toFixed(3)} s`);
}

function xAt(t, side) {
  const phase = omega * t + (side > 0 ? Math.PI : 0);
  return side * baseX + Math.sin(phase) * travel;
}

for (const fps of [20, 30, 60, 120]) {
  const dt = 1 / fps;
  let maxStep = 0;
  let safeFrames = 0;
  const duration = Math.PI * 2 / omega;
  for (const side of [-1, 1]) {
    let last = xAt(0, side);
    for (let t = dt; t <= duration + 1e-9; t += dt) {
      const x = xAt(t, side);
      maxStep = Math.max(maxStep, Math.abs(x - last));
      if (Math.abs(x) <= safeCenterX) safeFrames++;
      last = x;
    }
  }
  const maxAllowedStep = Math.max(0.12, halfX * 0.18);
  if (maxStep > maxAllowedStep) {
    throw new Error(`${fps} FPS platform step too large: ${maxStep.toFixed(3)} m > ${maxAllowedStep.toFixed(3)} m`);
  }
  if (safeFrames < Math.floor(safeWindow * fps)) {
    throw new Error(`${fps} FPS undersamples carry-safe boarding window`);
  }
  console.log(`${fps} FPS: max platform step ${maxStep.toFixed(3)} m, safe frames ${safeFrames}`);
}

console.log('SECOND PIT PLATFORM MOTION V71: PASS');
console.log(`omega: ${omega.toFixed(3)} rad/s`);
console.log(`carry-safe center window: ${safeWindow.toFixed(3)} s`);
console.log(`boarding correction time: ${boardTraverse.toFixed(3)} s`);
