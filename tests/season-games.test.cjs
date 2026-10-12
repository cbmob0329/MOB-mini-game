const {test}=require('node:test'),assert=require('node:assert/strict');
const games=require('../party-season-games.js'),core=require('../party-core.js');
function seeded(seed){return ()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};}
test('input uses pointer timestamp, independent of frame or release latency',()=>{
  const down=games.inputSeconds({timeStamp:1450},1468,1000);
  assert.equal(down,.45);assert.equal(games.inputSeconds({timeStamp:Date.now()},1450,1000),.45);
  for(const fps of [30,60,120]){const priorFrame=Math.floor(.45*fps)/fps;assert.equal(games.gaugeValue(down,2),games.gaugeValue(.45,2));assert.ok(priorFrame<=down);}
});
test('ascending and sliding contact points remain outside the wall surface at every stage',()=>{
  for(let level=0;level<6;level++)for(const clear of [true,false])for(let ms=0;ms<=1110;ms+=5){
    const p=games.climbPose(ms/1000,level,clear,.8,.49),edge=games.wallSurface(p.height,level);
    assert.ok(p.x+.018<=edge.x+1e-8);assert.ok(Math.abs(p.y-edge.y)<1e-8);
  }
  assert.equal(games.climbPose(1.11,0,false,.8,.49).height<1e-8,true);
});
test('gift layouts are scattered and balanced; finite distance limits delivery efficiency',()=>{
  const layouts=[];
  for(let seed=1;seed<=30;seed++){
    const gifts=games.giftLayout(seeded(seed));layouts.push(JSON.stringify(gifts.map(g=>[g.x,g.y])));
    assert.deepEqual([0,1,2].map(t=>gifts.filter(g=>g.type===t).length),[4,3,4]);
    assert.ok(gifts.every(g=>g.x>=.1&&g.x<=.9&&g.y>=.34&&g.y<=.86));
    for(let i=0;i<gifts.length;i++)for(let j=i+1;j<gifts.length;j++)assert.ok(Math.hypot(gifts[i].x-gifts[j].x,gifts[i].y-gifts[j].y)>.15);
    const costs=gifts.map(g=>Math.hypot(g.x-.49,g.y-.24)*(1/3.2+1/games.giftTypes[g.type].speed)+.25);
    assert.ok(costs.reduce((a,b)=>a+b,0)>12,'all presents cannot be swept up in 12 seconds');
  }
  assert.equal(new Set(layouts).size,30);
});
test('30 bananas allow five misses for full marks and never exceed 100',()=>{
  assert.equal(games.bananaPoints(24),96);assert.equal(games.bananaPoints(25),100);assert.equal(games.bananaPoints(30),100);assert.equal(games.bananaPoints(0),0);
});
test('six continuous walls reward centered taps and accelerate strongly through 30m',()=>{
  for(let level=0;level<6;level++){
    assert.equal(games.wallResult(level,1,1,.999).clear,true);
    assert.equal(games.wallResult(level,1,0,0).clear,false);
    assert.ok(games.wallResult(level,1,.7).chance<=games.wallResult(0,1,.7).chance);
  }
  const speeds=Array.from({length:6},(_,i)=>games.runPosition(1,i)-.12);
  assert.ok(speeds[0]>.245*1.2);
  for(let i=1;i<6;i++)assert.ok(speeds[i]>speeds[i-1]+.05);
  assert.ok(speeds[5]/.29>1.97&&speeds[5]/.29<2);
  // The final guaranteed-success window is still roughly 88ms wide.
  assert.ok((.09*(1-.72)*2)/speeds[5]>.085);
  assert.ok(games.wallResult(5,1,.72,.999).clear);
  const at=t=>games.climbPose(t,5,true,1,.49).height;
  assert.ok(at(.9)-at(.8)>at(.4)-at(.3),'climbing accelerates');
});
test('Hero Bell receives one or two rank steps in Santa only',()=>{
  const ranks=['F','E','D-','D','D+','C','C+','B-','B','B+','A-','A','A+','S-','S','SS'];
  const bell=core.roster.filter(c=>c.group==='ヒーローベル');assert.equal(bell.length,4);
  for(const p of bell)for(const value of [.1,.9]){
    const base=core.characterRank(p,{key:'bananaBoatMob'},()=>value),boost=core.characterRank(p,{key:'santaClausMob'},()=>value);
    assert.equal(ranks.indexOf(boost)-ranks.indexOf(base),value<.5?1:2);
  }
  const other=core.roster[0];assert.equal(core.characterRank(other,{key:'santaClausMob'},()=>.1),core.characterRank(other,{},()=>.1));
  assert.ok(Object.values(games.rules).flat().every(s=>!s.includes('SASUKE')&&!s.includes('ヒーローベル')));
});
