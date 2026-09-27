const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../party-layout.js');
test('shared contrast repair replaces white/yellow on white and preserves legible colour pairs',()=>{
  for(const fg of [[255,255,255],[255,223,119],[220,225,230]])assert.equal(L.readable(fg,[255,255,255]),'#171f2b');
  assert.equal(L.readable([23,31,43],[255,255,255]),null);
  assert.equal(L.readable([255,255,255],[28,41,59]),null);
  assert.equal(L.readable([20,25,35],[28,41,59]),'#ffffff');
  assert.ok(L.ratio([23,31,43],[255,255,255])>=4.5);
});
test('repechage can select the renamed two-circle overlap, never the removed master game',()=>{
  const L=require('../party-league.js');
  const program=L.program(['reaction'],()=>.999);
  assert.equal(program.repechage[0],'overlap');
  assert.ok(!program.repechage.includes('overlapMaster'));
});
