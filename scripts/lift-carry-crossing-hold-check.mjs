import fs from 'node:fs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
function value(name){const m=source.match(new RegExp(`${name}=(-?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`));if(!m)throw new Error(`Missing ${name}`);return Number(m[1]);}
if(!source.includes("crossingCarry=carry&&Math.abs(oldY-LIFT_BASE_Y)<.12"))throw new Error('carry crossing hold condition missing');
if(!source.includes('holdForCarry=boarding||crossingCarry'))throw new Error('boarding/crossing hold merge missing');
if(!source.includes('if(holdForCarry&&requestedY>oldY)newY=oldY'))throw new Error('lift does not hold at bottom during carry crossing');
if(!source.includes("state.textContent='ЛИФТ ДЕРЖИТ ПЕРЕХОД'"))throw new Error('3D gameplay feedback for crossing hold missing');
const halfZ=value('LIFT_HALF_Z'),release=value('LIFT_EXIT_RELEASE');
const pit=source.match(/const PITS=\[\[(-?(?:\d+(?:\.\d*)?|\.\d+)),(-?(?:\d+(?:\.\d*)?|\.\d+))\]/);if(!pit)throw new Error('first pit bounds missing');
const a=Number(pit[1]),b=Number(pit[2]),center=(a+b)*.5,releaseZ=center+halfZ+release;
if(releaseZ<b+.05)throw new Error(`carry hold releases too early: ${releaseZ.toFixed(3)} < ${(b+.05).toFixed(3)}`);
if(releaseZ>b+.6)throw new Error(`carry hold extends too far past safe floor: ${releaseZ.toFixed(3)}`);
console.log(`lift carry crossing hold PASS: pitEnd=${b.toFixed(2)} releaseZ=${releaseZ.toFixed(2)} safety=${(releaseZ-b).toFixed(2)}m`);
