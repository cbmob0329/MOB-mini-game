const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../party-core.js');
function seeded(seed=7){return ()=>{seed=(seed*1664525+1014704223)>>>0;return seed/4294967296;};}
test('47 unique characters with exact-case existing assets and private ranks',()=>{
  assert.equal(core.roster.length,47);
  assert.equal(new Set(core.roster.map(c=>c.id)).size,47);
  for(const c of core.roster){const file=path.resolve(__dirname,'..',c.img);assert.ok(fs.readdirSync(path.dirname(file)).includes(path.basename(file)),c.img);assert.match(c.rank,/^(SS|S|A|B|C|D|E|F)(-(SS|S|A|B|C|D|E|F))?$/);}
});
test('8 teams of 4 are unique and exclude all human selections, including collaboration selections',()=>{
  for(let seed=1;seed<=100;seed++){
    const random=seeded(seed),selected=[...core.roster].sort(()=>random()-.5).slice(0,4);
    const pool=core.roster.filter(c=>!selected.includes(c));
    const teams=core.allocateTeams(pool,4,7,random);
    assert.equal(teams.length,7);assert.ok(teams.every(t=>t.length===4));
    assert.equal(new Set(teams.flat().map(c=>c.id)).size,28);
    assert.ok(teams.flat().every(c=>!selected.includes(c)));
  }
});
test('CPU averages follow rank, with both F upsets and SS slumps',()=>{
  let previous=Infinity;
  for(const rank of ['SS','S','A','B','C','D','E','F']){
    const random=seeded(51),scores=Array.from({length:10000},()=>core.cpuScore(rank,random));
    assert.ok(scores.every(n=>Number.isInteger(n)&&n>=0&&n<=100));
    const average=scores.reduce((a,b)=>a+b,0)/scores.length;
    assert.ok(average<previous,rank);previous=average;
    if(rank==='F')assert.ok(scores.some(n=>n>=70));
    if(rank==='SS')assert.ok(scores.some(n=>n>=45&&n<=55));
  }
});
test('raw-record conversion handles descending, ascending and discrete scoring',()=>{
  const points=[v=>Math.max(0,Math.min(100,Math.round((6000-v)/3500*100))),v=>Math.max(0,Math.min(100,Math.round(v/20000*100))),v=>Math.max(0,Math.min(100,Math.round(v)*10))];
  for(const score of [0,20,50,70,100])for(const scoring of points){const raw=core.cpuRaw(score,scoring);assert.ok(Number.isFinite(raw));assert.ok(Math.abs(scoring(raw)-score)<=1);}
});
test('new games and death game use representative genre',()=>{
  for(const key of ['deathGameChallenge','colorBridgeParty','treasureEscapeParty'])assert.equal(core.genre({key,title:'',sub:''}),'代表バトル');
});

test('new CPU profiles respect base ranges and genre-specific strengths',()=>{
  const rank=(id,title,key='',r=.5)=>core.characterRank(core.roster.find(c=>c.id===id),{title,key},()=>r);
  assert.equal(rank(24,'算数'),'S');assert.equal(rank(24,'アクション'),'A');
  assert.equal(rank(25,'アクション','',0),'C');assert.equal(rank(25,'アクション','',.99),'A');
  assert.equal(rank(26,'3Dボウリング','',.99),'S');assert.equal(rank(26,'アクション','',0),'C');
  assert.equal(rank(27,'記憶ゲーム','',.99),'S');assert.equal(rank(27,'アクション','',0),'B');
  assert.equal(rank(30,'モブくん人形空を飛ぶ','launch',.99),'SS');assert.equal(rank(30,'アクション','',0),'C');
  assert.equal(rank(31,'アクション','',.1),'S');assert.equal(rank(31,'アクション','',.9),'B');
  for(const id of [101,102,103,104]){assert.equal(rank(id,'アクション','',0),'E');assert.equal(rank(id,'アクション','',.99),'D');}
});

test('league partner uses closest rank when the whole collaboration is already selected',()=>{
  const story=core.roster.filter(c=>c.group==='MOB STORY'),teams=story.map(c=>[c]);
  const pairs=core.leagueCpuPairs(teams,()=>0),remaining=core.roster.filter(c=>c.group!=='MOB STORY');
  for(const [human,cpu] of pairs){const distance=Math.abs(core.rankValue(human.rank)-core.rankValue(cpu.rank));assert.equal(distance,Math.min(...remaining.map(c=>Math.abs(core.rankValue(human.rank)-core.rankValue(c.rank)))));remaining.splice(remaining.indexOf(cpu),1);}
  for(let seed=1;seed<=50;seed++){const random=seeded(seed),pairs=core.leagueCpuPairs(Array.from({length:20},()=>[]),random);assert.ok(pairs.every(t=>t[0].group===t[1].group));assert.equal(new Set(pairs.flat().map(c=>c.id)).size,40);}
});
