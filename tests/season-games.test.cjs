const {test}=require('node:test'),assert=require('node:assert/strict');
const games=require('../party-season-games.js'),core=require('../party-core.js');
function seeded(seed){return ()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};}
test('input uses pointer timestamp, independent of frame or release latency',()=>{
  const down=games.inputSeconds({timeStamp:1450},1468,1000);
  assert.equal(down,.45);assert.equal(games.inputSeconds({timeStamp:Date.now()},1450,1000),.45);
  for(const fps of [30,60,120]){const priorFrame=Math.floor(.45*fps)/fps;assert.equal(games.gaugeValue(down,2),games.gaugeValue(.45,2));assert.ok(priorFrame<=down);}
});
test('ascending and sliding avatars remain outside the wall surface at every stage',()=>{
  for(let level=0;level<4;level++)for(const clear of [true,false])for(let ms=0;ms<=1110;ms+=5){
    const p=games.climbPose(ms/1000,level,clear,.8,.49),edge=games.wallSurface(p.height,level);
    assert.ok(p.x+.06<=edge.x+1e-8);assert.ok(Math.abs(p.y-edge.y)<1e-8);
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
    const costs=gifts.map(g=>Math.hypot(g.x-.49,g.y-.24)*(1/.75+1/games.giftTypes[g.type].speed)+.25);
    assert.ok(costs.reduce((a,b)=>a+b,0)>18,'all presents cannot be swept up in 12 seconds');
  }
  assert.equal(new Set(layouts).size,30);
});
test('30 bananas allow five misses for full marks and never exceed 100',()=>{
  assert.equal(games.bananaPoints(24),96);assert.equal(games.bananaPoints(25),100);assert.equal(games.bananaPoints(30),100);assert.equal(games.bananaPoints(0),0);
});
test('all four walls require power and timing, with attainable perfect and imperfect finishes',()=>{
  for(let level=0;level<4;level++){
    assert.deepEqual(games.wallResult(level,1,1),{clear:true,quality:1,points:25});
    assert.equal(games.wallResult(level,1,0).clear,false);
    assert.equal(games.wallResult(level,0,1).clear,false);
  }
  const total=[1,.9,.9,.9].reduce((s,q,i)=>s+games.wallResult(i,q,q).points,0);
  assert.ok(total>=95&&total<=99,total);
  assert.equal(games.wallResult(0,.74,.74).clear,true);assert.equal(games.wallResult(3,.74,.74).clear,false);
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
