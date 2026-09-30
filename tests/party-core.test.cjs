const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../party-core.js');
function seeded(seed=7){return ()=>{seed=(seed*1664525+1014704223)>>>0;return seed/4294967296;};}
test('98 unique characters with exact-case existing assets and private ranks',()=>{
  assert.equal(core.roster.length,98);
  assert.equal(new Set(core.roster.map(c=>c.id)).size,98);
  for(const c of core.roster){const file=path.resolve(__dirname,'..',c.img);assert.ok(fs.readdirSync(path.dirname(file)).includes(path.basename(file)),c.img);assert.match(c.rank,/^(SS|S-?|[ABCD][+-]?|E|F)(-(SS|S-?|[ABCD][+-]?|E|F))?$/);}
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
  for(const rank of ['SS','S','S-','A+','A','A-','B+','B','B-','C+','C','D+','D','D-','E','F']){
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

test('hero takes even the last CPU team slot, preferring Pink while respecting human selections',()=>{
  const character=id=>core.roster.find(c=>c.id===id);
  for(const random of [()=>0,()=>.999]){
    for(const size of [1,2,4]){const [team]=core.allocateTeams(core.roster,size,1,random);assert.ok(team.some(c=>c.id===9));if(size>=2)assert.ok(team.some(c=>c.id===12));}
    assert.deepEqual(core.leagueCpuPairs([[]],random)[0].map(c=>c.id),[9,12]);
    const teams=core.leagueCpuPairs([[character(25)],[character(12),character(13)],[]],random);
    assert.ok(teams[2].some(c=>c.id===9));assert.equal(new Set(teams.flat().map(c=>c.id)).size,6);
    const noPink=core.allocateTeams(core.roster.filter(c=>c.id!==12),2,1,random)[0];assert.equal(noPink[0].id,9);assert.equal(noPink[1].group,'MOB STORY');
    const heroHuman=core.leagueCpuPairs([[character(9),character(11)],[]],random);assert.equal(heroHuman.flat().filter(c=>c.id===9).length,1);
  }
});

test('MOB SHOT additions preserve A-minus ranges and detective/ninja specialties',()=>{
  const rank=(id,game={},r=.5)=>core.characterRank(core.roster.find(c=>c.id===id),game,()=>r);
  assert.equal(core.roster.filter(c=>c.group==='MOB SHOT').length,11);
  for(const id of [38,39]){assert.equal(rank(id,{},0),'C');assert.equal(rank(id,{},.999),'B+');}
  for(const id of [41,42]){assert.equal(rank(id,{},0),'B');assert.equal(rank(id,{},.999),'A-');}
  assert.equal(rank(40),'B');assert.equal(rank(40,{title:'算数'},0),'S');assert.equal(rank(40,{title:'記憶ゲーム'},.999),'SS');
  assert.equal(rank(42,{key:'mob50m',title:'50m走'}),'S');
  assert.equal(rank(42,{title:'トロッコ大爆走'},.999),'A-');
  assert.equal(rank(43),'A+');assert.equal(rank(44),'A');assert.equal(rank(45),'SS');
  assert.equal(core.resolveRank('A-',()=>.999),'A-');
  assert.equal(core.resolveRank('A-S',()=>0),'A');assert.equal(core.resolveRank('A-S',()=>.999),'S');
  assert.equal(core.rankValue('B-A-'),4.375);assert.equal(core.rankValue('A-'),4.75);
});

test('46–74 additions honor modified rank bounds and racer running strengths',()=>{
  const rank=(id,game={},r=0)=>core.characterRank(core.roster.find(c=>c.id===id),game,()=>r);
  const ranges=[[46,48,'D-','C+'],[49,55,'D+','B-'],[56,56,'C+','B+'],[57,58,'B+','A-'],[59,59,'C+','A+'],[60,60,'A','S-'],[61,63,'D+','B-'],[64,64,'C+','A+'],[65,74,'D','C+']];
  for(const [first,last,lo,hi] of ranges)for(let id=first;id<=last;id++){assert.equal(rank(id),lo,`id ${id} lower`);assert.equal(rank(id,{},.999),hi,`id ${id} upper`);assert.equal(core.roster.find(c=>c.id===id).img,`main/${id}.png`);}
  for(let id=65;id<=74;id++){assert.equal(rank(id,{key:'mob50m',title:'50m走'}),'B-');assert.equal(rank(id,{key:'hurdleRun'},.999),'A+');assert.equal(rank(id,{title:'トロッコ大爆走'},.999),'C+');}
  assert.equal(rank(2),'C+');assert.equal(rank(210),'D+');
  for(const value of ['D-','D+','C+','B-','S-']){assert.equal(core.resolveRank(value),value);assert.ok(Number.isFinite(core.rankValue(value)));}
  assert.equal(core.rankValue('D--C+'),2.625);assert.equal(core.rankValue('B--A+'),4.625);
  for(const [group,count] of [['MAIN CHARACTERS',20],['ヒーローベル',4],['MOB ARTIST初代',4],['モブレーサーズ',10]])assert.equal(core.roster.filter(c=>c.group===group).length,count);
});

test('tournament levels choose unique participants before pairing and preserve human picks',()=>{
  const seen=new Set();
  for(let seed=1;seed<=80;seed++){
    const pools=Object.fromEntries(core.tournamentLevels.map(level=>[level,core.tournamentPool(core.roster,40,level,seeded(seed))]));
    for(const pool of Object.values(pools))assert.equal(new Set(pool.map(c=>c.id)).size,40);
    pools.ALL.forEach(c=>seen.add(c.id));
    assert.ok(pools.NORMAL.every(c=>core.rankValue(c.rank)<6));
    assert.equal(pools.HARD.filter(c=>core.rankValue(c.rank)>=4.5).length,20);
    assert.ok(pools.INFERNO.filter(c=>core.rankValue(c.rank)>=4.5).length>=pools.HARD.filter(c=>core.rankValue(c.rank)>=4.5).length);
    assert.ok(!pools.NORMAL.some(c=>c.id===9));
    for(const level of core.tournamentLevels){
      const hero=core.roster.find(c=>c.id===9),teams=core.leagueCpuPairs([[hero],...Array.from({length:19},()=>[])],seeded(seed),level);
      assert.equal(teams[0][0],hero);assert.equal(new Set(teams.flat().map(c=>c.id)).size,40);
      const available=core.roster.filter(c=>c.id!==9),chosen=core.tournamentPool(available,28,level,seeded(seed));
      const cup=core.allocateTeams(available,4,7,seeded(seed),level).flat();
      assert.deepEqual(cup.map(c=>c.id).sort((a,b)=>a-b),chosen.map(c=>c.id).sort((a,b)=>a-b));
    }
  }
  assert.equal(seen.size,core.roster.length);
  assert.ok(Array.from({length:40},(_,i)=>core.tournamentPool(core.roster,40,'ALL',seeded(i))).some(pool=>!pool.some(c=>c.id===9)));
});

test('MOB SHOT CPU tags are preferred in cup and league, with either available Kodra partner',()=>{
  const pairs=[[38,39],[40,41],[42,44],[45,43]],has=(teams,a,b)=>teams.some(t=>t.some(c=>c.id===a)&&t.some(c=>c.id===b));
  const variants=new Set();
  for(let seed=1;seed<=40;seed++)for(const teams of [core.allocateTeams(core.roster,2,20,seeded(seed)),core.leagueCpuPairs(Array.from({length:20},()=>[]),seeded(seed))]){
    pairs.forEach(([a,b])=>assert.ok(has(teams,a,b),`${a} & ${b}`));
    assert.ok(has(teams,18,19)||has(teams,18,20));variants.add(has(teams,18,19)?19:20);
    assert.equal(new Set(teams.flat().map(c=>c.id)).size,40);
  }
  assert.equal(variants.size,2);
  for(const partner of [19,20]){const available=core.roster.filter(c=>[18,partner].includes(c.id));assert.deepEqual(core.allocateTeams(available,2,1,()=>0)[0].map(c=>c.id),[18,partner]);}
  const detective=core.roster.find(c=>c.id===40),toy=core.roster.find(c=>c.id===41);
  const teams=core.leagueCpuPairs([[detective],[toy],[]],()=>0);
  assert.equal(new Set(teams.flat().map(c=>c.id)).size,6);
  assert.equal(teams[0][1].group,'MOB SHOT');assert.equal(teams[1][1].group,'MOB SHOT');
});
