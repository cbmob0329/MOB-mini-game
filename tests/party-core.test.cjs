const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../party-core.js');
function seeded(seed=7){return ()=>{seed=(seed*1664525+1014704223)>>>0;return seed/4294967296;};}
test('53 unique characters with exact-case existing assets and private ranks',()=>{
  assert.equal(core.roster.length,53);
  assert.equal(new Set(core.roster.map(c=>c.id)).size,53);
  for(const c of core.roster){const file=path.resolve(__dirname,'..',c.img);assert.ok(fs.readdirSync(path.dirname(file)).includes(path.basename(file)),c.img);assert.match(c.rank,/^(SS|S|A\+?|B\+?|C|D|E|F)(-(SS|S|A\+?|B\+?|C|D|E|F))?$/);}
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
  for(const rank of ['SS','S','A+','A','B+','B','C','D','E','F']){
    const random=seeded(51),scores=Array.from({length:10000},()=>core.cpuScore(rank,random));
    assert.ok(scores.every(n=>Number.isInteger(n)&&n>=0&&n<=100));
    const average=scores.reduce((a,b)=>a+b,0)/scores.length;
    assert.ok(average<previous,rank);previous=average;
    if(rank==='F')assert.ok(scores.some(n=>n>=70));
    if(rank==='SS')assert.ok(scores.some(n=>n>=45&&n<=55));
  }
});

test('updated BR roster and plus ranks preserve specialties and range endpoints',()=>{
  const rank=(id,game,r=.5)=>core.characterRank(core.roster.find(c=>c.id===id),game,()=>r);
  assert.deepEqual(core.roster.filter(c=>c.id>=32&&c.id<=37).map(c=>c.rank),['S','A','A','B-A+','B-A','B-A']);
  assert.equal(rank(18,{}),'B+');assert.equal(rank(19,{}),'B+');
  assert.equal(rank(17,{},0),'C');assert.equal(rank(17,{},.999),'B+');
  assert.equal(rank(35,{},0),'B');assert.equal(rank(35,{},.999),'A+');
  assert.equal(rank(20,{key:'mob50m',title:'モブくん50m走'}),'A+');
  assert.equal(rank(20,{title:'トロッコ大爆走'}),'C');
  assert.equal(rank(33,{key:'launch'}),'S');assert.equal(rank(33,{}),'A');
  assert.equal(rank(26,{title:'モブくん3Dゴルフ'},.999),'S');
  assert.equal(core.rankValue('B+'),4.5);assert.equal(core.rankValue('B-A+'),4.75);
  assert.ok(!core.roster.some(c=>c.id===8));
});

test('incomplete collaborations keep available group members and fill with nearest rank',()=>{
  const pool=[{id:1,group:'MOB STORY',rank:'A'},{id:2,group:'MOB STORY',rank:'A'},
    {id:3,group:'MOB BR',rank:'A+'},{id:4,group:'MOB SHOT',rank:'E'}];
  const [team]=core.allocateTeams(pool,3,1,()=>0);
  assert.deepEqual(team.map(c=>c.id),[1,2,3]);assert.equal(pool.length,4);
});

test('best play selects only two perfect scorers by rarity and margin, even if already awarded',()=>{
  const players=['a','b','c','d'].map(id=>({id}));
  const history=[{points:{a:100,b:100,c:100,d:99}},{points:{a:100,b:20,c:10,d:0}},{points:{a:90,b:100,c:90,d:90}}];
  const stats=core.awardStats(players,history);
  assert.deepEqual(core.bestPlayWinners(stats).map(s=>s.p.id),['a','b']);
  assert.equal(core.bestPlayWinners(core.awardStats(players,[{points:{a:99,b:90}}])).length,0);
  assert.deepEqual(core.bestPlayWinners(core.awardStats(players,[{points:{c:100}}])).map(s=>s.p.id),['c']);
  const tied=core.awardStats(players,[{points:{a:100,b:100,c:100,d:100}}]);
  assert.deepEqual(core.bestPlayWinners(tied).map(s=>s.p.id),['a','b']);
});

test('specialist awards use selected games and unmultiplied points including 3D sports',()=>{
  const games={math:{title:'算数'},golf:{title:'3Dゴルフ'},hammer:{title:'3D巨大ハンマー'}};
  const stats=core.awardStats([{id:'a'},{id:'b'}],[
    {key:'individualChoice',selections:{a:'math',b:'golf'},rawPoints:{a:80,b:90},points:{a:160,b:180}},
    {key:'hammer',rawPoints:{a:100,b:50},points:{a:200,b:100}}
  ],key=>games[key]);
  assert.deepEqual(stats.map(s=>[s.brain,s.sport,s.power,s.baseTotal]),[[80,100,100,180],[0,140,50,140]]);
  assert.equal(stats[0].perfect,1);assert.equal(stats[1].perfect,0);
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

test('CPU tags honor requested pairs in both cup and league without duplicate Marumob',()=>{
  const fixed=[[9,12],[11,13],[24,25],[26,27],[14,17],[15,16],[32,33],[35,36]];
  const has=(teams,a,b)=>teams.some(t=>t.some(c=>c.id===a)&&t.some(c=>c.id===b));
  const variants=new Set();
  for(let seed=1;seed<=50;seed++)for(const teams of [core.allocateTeams(core.roster,2,20,seeded(seed)),core.leagueCpuPairs(Array.from({length:20},()=>[]),seeded(seed))]){
    for(const [a,b] of fixed)assert.ok(has(teams,a,b),`${a} & ${b}`);
    assert.ok(has(teams,21,22)||has(teams,22,23));
    variants.add(has(teams,21,22)?21:23);
    assert.equal(new Set(teams.flat().map(c=>c.id)).size,40);
  }
  assert.equal(variants.size,2);
});

test('unavailable preferred tags fall back to collaboration, then nearest rank',()=>{
  const chars=ids=>ids.map(id=>core.roster.find(c=>c.id===id));
  assert.deepEqual(core.allocateTeams(chars([9,11,18]),2,1,()=>0)[0].map(c=>c.id),[9,11]);
  assert.deepEqual(core.allocateTeams(chars([9,22,201]),2,1,()=>0)[0].map(c=>c.id),[9,22]);
  assert.deepEqual(core.allocateTeams(chars([22,23,34]),2,1,()=>0)[0].map(c=>c.id),[22,23]);
  const human=chars([12]),pairs=core.leagueCpuPairs([human,...Array.from({length:19},()=>[])],()=>0);
  assert.equal(pairs[0][0],human[0]);assert.equal(pairs[0][1].id,9);
  assert.equal(human.length,1);assert.equal(new Set(pairs.flat().map(c=>c.id)).size,40);
  const selected=chars([9,11]),humans=[selected,...Array.from({length:19},()=>[])];
  const result=core.leagueCpuPairs(humans,()=>0);
  assert.deepEqual(result[0],selected);assert.equal(new Set(result.flat().map(c=>c.id)).size,40);
});
