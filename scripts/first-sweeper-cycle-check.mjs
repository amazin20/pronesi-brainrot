import fs from 'node:fs';
import assert from 'node:assert/strict';

const s=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
  'FIRST_SWEEPER_WARN=.72',
  'FIRST_SWEEPER_BURST=1.05',
  'FIRST_SWEEPER_RECOVER=.72',
  'FIRST_SWEEPER_BURST_SPEED=-2.65',
  "firstSweeperPhase='burst'",
  "firstSweeperPhase='recover'",
  'SWEEPER · ОКНО ПРОХОДА',
  'firstSweeperActive?FIRST_SWEEPER_BURST_SPEED:0'
]) assert.ok(s.includes(token),`missing ${token}`);

const warn=.72,burst=1.05,recover=.72,total=warn+burst+recover;
assert.ok(recover>=.65,'recovery window must remain carry-readable');
assert.ok(burst>warn,'burst should be the dominant danger phase');
assert.ok(total<2.7,'cycle should stay responsive');
console.log(`first sweeper cycle PASS: warn=${warn}s burst=${burst}s recover=${recover}s total=${total.toFixed(2)}s`);
