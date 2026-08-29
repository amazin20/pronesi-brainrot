import fs from 'node:fs';
const src=fs.readFileSync(process.argv[2]||'index.html','utf8');
const required=['SECOND_PIT_CARRIER_MODEL_V72','SecondPitCarrierDeckV72','SecondPitCarrierPontoonV72','SecondPitCarrierHubV72','SecondPitCarrierThrusterRingV72','SecondPitCarrierRailV72','makeSecondPitCarrier(x,c,i)'];
for(const token of required)if(!src.includes(token))throw new Error(`Missing modeled carrier token: ${token}`);
if(!src.includes('const secondPitPlatforms=[[-SECOND_PLATFORM_BASE_X')||!src.includes('SECOND_PLATFORM_BASE_X,0x44e7ff'))throw new Error('Mirrored second-pit carriers missing');
if(!src.includes('platform.mesh.position.x=newX')||!src.includes('playerRideVX=dx*invDt')||!src.includes('brainRideVX=dx*invDt'))throw new Error('Carrier motion/rider transfer contract changed');
console.log('SECOND PIT CARRIER MODEL V72: PASS');
