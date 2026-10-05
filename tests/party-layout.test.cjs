const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../party-layout.js');

test('fixed-world camera keeps every lower slot visible at narrow mobile viewports',()=>{
  for(const [width,height] of [[320,270],[350,230],[640,470]]){
    const c=L.worldCamera({worldWidth:360,worldHeight:1420,viewportWidth:width,viewportHeight:height,focusY:1332,anchor:.55});
    assert.ok((1280-c.y)*c.scale>=0);
    assert.ok((1384-c.y)*c.scale<=height);
    assert.ok(Math.abs(360*c.scale-width)<.001);
  }
});
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
  assert.equal(program.repechage[0],'randomChoice');
  assert.ok(require('../party-random-games.js').ALLOWED.some(g=>g.key==='overlap'));
  assert.ok(!program.repechage.includes('overlapMaster'));
});

test('front flip world frame includes ground and rotated apex at mobile and desktop sizes',()=>{for(const [w,h] of [[320,170],[350,210],[900,560]]){const low=Math.min(0,338-h*.45-100),c=L.fitWorldFrame({worldWidth:1860,viewportWidth:w,viewportHeight:h,minY:low,maxY:372,focusX:72});assert.ok(low*c.scale+c.offsetY>=0);assert.ok(372*c.scale+c.offsetY<=h);assert.ok(c.cameraX>=0);}});
