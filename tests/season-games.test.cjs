const {test}=require('node:test'),assert=require('node:assert/strict');
const games=require('../party-season-games.js'),core=require('../party-core.js');
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
