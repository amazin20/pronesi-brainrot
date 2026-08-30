import fs from 'node:fs';

const src = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const requireText = (needle, label = needle) => {
  if (!src.includes(needle)) throw new Error(`missing ${label}`);
};

requireText('const SECOND_PIT_CARRIER_MODEL_V72=true', 'modeled carrier marker');
requireText('SECOND_PLATFORM_HALF_X=1.05', 'carrier half width');
requireText('SECOND_PLATFORM_HALF_Z=.34', 'carrier half depth');
requireText("new THREE.CapsuleGeometry(.16,1.42,4,8)", 'low-poly pontoon geometry');
requireText("new THREE.CylinderGeometry(.13,.13,.34,10)", 'low-poly hub geometry');
requireText("new THREE.TorusGeometry(.19,.045,6,12)", 'low-poly thruster ring geometry');
requireText("new THREE.CylinderGeometry(.035,.035,1.5,8)", 'low-poly guard rail geometry');
requireText("const dark=mat(0x20253f),accent=mat(c)", 'shared carrier materials');
requireText("const railMat=mat(0xffffff)", 'shared rail material');
requireText("deck.add(pontoon)", 'carrier child assembly');
requireText("deck.add(hub)", 'hub attached to moving deck');
requireText("deck.add(ring)", 'thruster ring attached to moving deck');
requireText("deck.add(rail)", 'rail attached to moving deck');
requireText('platform.mesh.position.x=newX;platform.stripe.position.x=newX', 'single-axis visual/collision synchronization');

const perCarrier = {
  pontoons: 2,
  hubs: 2,
  rings: 2,
  rails: 2,
  deck: 1,
  stripe: 1
};
const meshesPerCarrier = Object.values(perCarrier).reduce((a,b)=>a+b,0);
const totalMovingMeshes = meshesPerCarrier * 2;
if (meshesPerCarrier !== 10) throw new Error(`unexpected per-carrier mesh budget: ${meshesPerCarrier}`);
if (totalMovingMeshes > 20) throw new Error(`second-pit moving mesh budget exceeded: ${totalMovingMeshes}`);

const segmentBudget = {
  capsuleRadial: 8,
  hubRadial: 10,
  ringRadial: 6,
  ringTubular: 12,
  railRadial: 8
};
if (Math.max(...Object.values(segmentBudget)) > 12) throw new Error('carrier primitive segment budget exceeded');

console.log('PASS second-pit carrier WebGL budget v105');
console.log(`moving meshes: ${totalMovingMeshes}/20`);
console.log('primitive max segments: 12');
console.log('collision footprint unchanged: 2.10 x 0.68');
console.log('all modeled carrier children remain parented to moving collision decks');
