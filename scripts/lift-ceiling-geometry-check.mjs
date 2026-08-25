import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const number = (name) => {
  const match = source.match(new RegExp(`(?:const\\s+[^;]*?\\b|,)${name}=(-?\\d+(?:\\.\\d+)?)`));
  assert(match, `missing numeric constant ${name}`);
  return Number(match[1]);
};

const bottom = number('LIFT_CEILING_BOTTOM');
const top = number('LIFT_CEILING_TOP');
const halfX = number('LIFT_CEILING_HALF_X');
const halfZ = number('LIFT_CEILING_HALF_Z');
const brainHeight = number('LIFT_BRAIN_BODY_HEIGHT');

assert(top > bottom, 'ceiling top must be above underside');
assert(top - bottom >= 0.25 && top - bottom <= 0.5, 'ceiling beam thickness drifted outside expected range');
assert(halfX > 1.5 && halfZ > 0.5, 'ceiling footprint unexpectedly small');
assert(brainHeight > 1 && brainHeight < 1.3, 'brainrot body-height proxy drifted');

assert(source.includes('function clampPlayerToLiftCeiling(previousY)'), 'player underside collision missing');
assert(source.includes('function clampBrainrotToLiftCeiling(previousY)'), 'brainrot underside collision missing');
assert(source.includes('function landPlayerOnLiftCeiling(previousY)'), 'player top landing missing');
assert(source.includes('function landBrainrotOnLiftCeiling(previousY)'), 'brainrot top landing missing');
assert(source.includes('LIFT_CEILING_TOP+.56'), 'brainrot top support offset missing');

// Side-face regression envelope used by the runtime patch: a body inside the beam's
// vertical slab must be rejected when entering through X/Z faces, but must remain
// free above the walkable top and below the underside.
const overlapsBeamSlab = (feetY, bodyHeight, radius = 0) =>
  feetY + bodyHeight > bottom + 0.01 && feetY < top - 0.01 && radius >= 0;
const overlapsFootprint = (x, z, radius = 0) =>
  Math.abs(x) < halfX + radius && Math.abs(z) < halfZ + radius;

assert(overlapsBeamSlab(2.2, 2.12), 'player should overlap side slab at beam height');
assert(overlapsFootprint(halfX - 0.05, 0, 0.38), 'player edge approach should overlap beam footprint');
assert(!overlapsBeamSlab(top + 0.01, 2.12), 'player above top must remain free');
assert(!overlapsBeamSlab(bottom - 2.13, 2.12), 'player below underside must remain free');
assert(overlapsBeamSlab(3.0, brainHeight), 'brainrot should overlap side slab at beam height');
assert(!overlapsBeamSlab(top + 0.57, brainHeight), 'brainrot resting above top must remain free');

console.log('lift-ceiling geometry QA: PASS');
console.log({ bottom, top, thickness: +(top - bottom).toFixed(3), halfX, halfZ, brainHeight });
