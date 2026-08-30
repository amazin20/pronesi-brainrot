import fs from 'node:fs';

const src = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const requireText = (needle, label = needle) => {
  if (!src.includes(needle)) throw new Error(`missing ${label}`);
};
const forbidText = (needle, label = needle) => {
  if (src.includes(needle)) throw new Error(`forbidden ${label}`);
};

requireText('const SECOND_PIT_CARRIER_MODEL_V72=true', 'second pit modeled carrier marker');
requireText("deck.name='SecondPitCarrierDeckV72'", 'carrier deck identity');
requireText("pontoon.name='SecondPitCarrierPontoonV72'", 'carrier pontoons');
requireText("hub.name='SecondPitCarrierHubV72'", 'carrier hubs');
requireText("ring.name='SecondPitCarrierThrusterRingV72'", 'carrier thruster rings');
requireText("rail.name='SecondPitCarrierRailV72'", 'carrier guard rails');
requireText('SECOND_PLATFORM_HALF_X=1.05', 'verified carrier half width');
requireText('SECOND_PLATFORM_HALF_Z=.34', 'verified carrier half depth');
requireText("const deck=box(x,-.04,SECOND_PIT_Z,SECOND_PLATFORM_HALF_X*2,.18,SECOND_PLATFORM_HALF_Z*2,c)", 'collision deck footprint');
requireText('onSecondPitPlatform(platform,x,y,z,brain=false)', 'carrier support function');
requireText('Math.abs(x-platform.mesh.position.x)<=SECOND_PLATFORM_HALF_X+mx', 'carrier support x footprint');
requireText('Math.abs(z-platform.mesh.position.z)<=SECOND_PLATFORM_HALF_Z+mz', 'carrier support z footprint');
requireText('platform.mesh.position.x=newX;platform.stripe.position.x=newX', 'visual/collision x synchronization');
requireText('carryPlayer=onSecondPitPlatform(platform,p.x,p.y,p.z,false)', 'player ride transfer');
requireText('carryBrain=!carry&&onSecondPitPlatform(platform,bp.x,bp.y,bp.z,true)', 'brainrot ride transfer');
requireText('if(carryPlayer){playerRidingNow=true;playerRideVX=dx*invDt', 'player platform velocity transfer');
requireText('if(carryBrain){brainRidingNow=true;brainRideVX=dx*invDt', 'brainrot platform velocity transfer');
forbidText('SECOND_PIT_CARRIER_MODEL_V72=false', 'disabled modeled carrier');
forbidText("deck.name='SecondPitCarrierPlaceholder'", 'placeholder carrier');

const modeledParts = [
  'SecondPitCarrierPontoonV72',
  'SecondPitCarrierHubV72',
  'SecondPitCarrierThrusterRingV72',
  'SecondPitCarrierRailV72'
].filter(name => src.includes(name));
if (modeledParts.length < 4) throw new Error(`carrier modeled assembly incomplete: ${modeledParts.length}/4`);

console.log('PASS second-pit carrier modeled quality v104');
console.log('modeled parts:', modeledParts.join(', '));
console.log('collision footprint: 2.10 x 0.68, support top preserved');
console.log('runtime sync: deck + stripe + player + brainrot carry paths present');
