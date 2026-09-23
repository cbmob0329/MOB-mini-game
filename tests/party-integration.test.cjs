const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../party-core.js');
function engine(){
  const element={addEventListener(){},removeEventListener(){},classList:{add(){},remove(){},contains(){return false;}},querySelector(){return null;},querySelectorAll(){return [];},style:{setProperty(){}},setAttribute(){},removeAttribute(){}};
  const document={addEventListener(){},getElementById(){return element;},querySelector(){return element;},querySelectorAll(){return [];},documentElement:element,body:element};
  const pending=[];
  const window={MobPartyCore:core,MobPartyLeague:require('../party-league.js'),MobPartyLeagueUI:{create(api){window.leagueAdapter=api;return {stop(){}};}},MobPartyUI:{create(){return {};}},MobPartyGames:{create(){return {};}},addEventListener(){}};
  const context=vm.createContext({window,document,console,Math,performance:{now:()=>0},setTimeout:fn=>{pending.push(fn);return pending.length;},clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},Image:class{},URL,localStorage:{getItem(){return null;},setItem(){}}});
  let source=fs.readFileSync(require.resolve('../game.js'),'utf8');
  source=source.replace(/renderHome\(\);\r?\n\}\)\(\);/,`window.__test={GAMES,MODES,PLAYERS,masteryPoints,scoreRuleForGame,activeGameIndices,performancePoints,rankRecords,applyPoints,applyConfiguredBattle,participants,freshState,simulateOneCpu,teamTotals,setState(s){state=s},getState(){return state}};})();`);
  vm.runInContext(source,context);return {...window.__test,league:window.leagueAdapter,flush(){while(pending.length)pending.shift()();}};
}

test('league adapter supports 40 entrants and freely assigned eight humans',()=>{
  const e=engine(),players=Array.from({length:40},(_,i)=>({id:i<8?'p'+(i+1):'leagueCpu'+i,name:'Player '+i,cpu:i>=8,characterRank:'A'}));
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,name:'Team '+i,members:[players[i].id,players[39-i].id]}));
  [teams[0].members[1],teams[7].members[0]]=[teams[7].members[0],teams[0].members[1]];
  e.league.configure(players,teams);
  assert.equal(e.participants().length,40);assert.equal(e.participants().filter(p=>!p.cpu).length,8);
  assert.deepEqual(Array.from(e.MODES.configured.teams.L0),['p1','p8']);
  assert.deepEqual(Array.from(e.MODES.configured.teams.L7),['leagueCpu39','leagueCpu32']);
  assert.equal(e.getState().competitionStarted,true);
});

test('CPU tag heats return four finite scores and team-shared results',()=>{
  const e=engine(),players=Array.from({length:40},(_,i)=>({id:'leagueCpu'+i,name:'CPU '+i,cpu:true,characterRank:'A'}));
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,name:'Team '+i,members:players.slice(i*2,i*2+2).map(p=>p.id)}));
  e.league.configure(players,teams);
  for(const key of require('../party-league.js').TAG){
    let result=null;e.league.run(key,teams.slice(0,2),{round:3},scores=>result=scores);e.flush();
    assert.equal(Object.keys(result).length,4,key);
    for(const t of teams.slice(0,2)){assert.equal(result[t.members[0]],result[t.members[1]],key);assert.ok(result[t.members[0]]>=0&&result[t.members[0]]<=100,key);}
    if(key==='summonMaster')assert.equal(Object.values(result).reduce((a,b)=>a+b,0),200);
  }
});
test('158 games have records; new games score directly on a 100-point scale',()=>{
  const e=engine(),state=e.freshState();assert.equal(e.GAMES.length,158);
  for(const g of e.GAMES)assert.ok(state.records[g.key],g.key);
  for(const key of ['colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty']){const i=e.GAMES.findIndex(g=>g.key===key);assert.ok(i>=0);assert.equal(e.performancePoints(i,80),80);}
});
test('fast CPU death game keeps the exact elimination distribution',()=>{
  const e=engine(),players=Array.from({length:40},(_,i)=>({id:'leagueCpu'+i,name:'CPU '+i,cpu:true,characterRank:'A'}));
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,name:'Team '+i,members:players.slice(i*2,i*2+2).map(p=>p.id)}));
  e.league.configure(players,teams);let result;e.league.run('deathGameChallenge',teams,{round:9},scores=>result=scores);e.flush();
  const counts={};Object.values(result).forEach(n=>counts[n]=(counts[n]||0)+1);
  assert.deepEqual(counts,{10:10,30:15,50:10,65:2,80:2,100:1});
});
test('8-team cup has 32 participants; representatives alone score and omitted players stay unchanged',()=>{
  const e=engine();e.applyConfiguredBattle({type:'team',rule:'score',teamCount:8,teamSize:4,assignments:Array.from({length:8},(_,i)=>({players:i?0:4,cpus:i?4:0}))});
  assert.equal(e.participants().length,32);assert.equal(new Set(e.participants().map(p=>p.id)).size,32);
  const state=e.getState(),ids=Object.values(e.MODES.configured.teams).flatMap(team=>team.slice(0,2));
  state.partyRepresentatives=ids;
  const i=e.GAMES.findIndex(g=>g.key==='colorBridgeParty');ids.forEach(id=>state.records.colorBridgeParty[id]=80);
  const ranked=e.rankRecords(i);assert.equal(ranked.length,16);e.applyPoints(i,ranked);
  assert.ok(Object.values(e.teamTotals()).every(n=>n===160));assert.equal(state.total.p3,0);assert.equal(state.total.p4,0);
});
test('10 teams of 2 produce 20 distinct participants',()=>{
  const e=engine();e.applyConfiguredBattle({type:'team',rule:'score',teamCount:10,teamSize:2,assignments:Array.from({length:10},(_,i)=>({players:i?0:2,cpus:i?2:0}))});
  assert.equal(e.participants().length,20);assert.equal(Object.keys(e.MODES.configured.teams).length,10);assert.ok(e.participants().every(Boolean));
});
test('rank-based CPU record generation yields finite records and scores for every game',()=>{
  const e=engine();const p=e.PLAYERS.find(p=>p.cpu);p.characterRank='SS';
  for(let i=0;i<e.GAMES.length;i++){e.simulateOneCpu(i,p);const raw=e.getState().records[e.GAMES[i].key][p.id],points=e.performancePoints(i,raw);assert.ok(Number.isFinite(raw),e.GAMES[i].key);assert.ok(Number.isFinite(points)&&points>=0&&points<=100,e.GAMES[i].key);}
});

test('removed boxing is absent from records, catalog and selection pools; later games keep their legacy IDs',()=>{
  const e=engine();assert.ok(!e.GAMES.some(g=>g.key==='boxing3DMob'));
  assert.ok(!('boxing3DMob' in e.freshState().records));assert.ok(!e.GAMES.some(g=>g.key==='hockey3DMob'));assert.ok(!('hockey3DMob' in e.freshState().records));
  assert.equal(e.activeGameIndices().length,158);
  assert.equal(e.GAMES.find(g=>g.key==='punchMachine3DMob').legacy,167);
  assert.equal(e.GAMES.find(g=>g.key==='treasureEscapeParty').legacy,181);
});

test('mastery scoring preserves full marks but never rounds a near miss into 100',()=>{
  const {masteryPoints:score}=engine();
  for(const target of [990,105,.995]){
    assert.equal(score(0,target),0);assert.equal(score(target,target),100);
    assert.equal(score(target*2,target),100);assert.ok(score(target-.00001,target)<100);
    let previous=0;for(let i=0;i<=100;i++){const points=score(target*i/100,target);assert.ok(points>=previous&&points<=100);previous=points;}
  }
  assert.ok(score(833,990,1.8)<80);assert.ok(score(100,105,1.6)<100);
});

// Evaluate the actual scoring expressions used by each playable implementation.
test('brake rewards close stops while keeping crashes and distant stops at zero',()=>{
  const e=engine(),index=e.GAMES.findIndex(g=>g.key==='brake');
  for(const [gap,expected] of [[0,100],[.5,100],[.6,99],[3,95],[6,85],[10,70],[20,30],[30,0],[999,0]])assert.equal(e.performancePoints(index,gap),expected,`gap ${gap}`);
  let previous=100;for(let tenth=0;tenth<=300;tenth++){const score=e.performancePoints(index,tenth/10);assert.ok(score<=previous&&score>=0);previous=score;}
});
function gameScore(name,pattern,variables){
  const source=fs.readFileSync(require.resolve('../game.js'),'utf8');
  const start=source.indexOf('async function start'+name+'('),end=source.indexOf('\nasync function ',start+1);
  const match=source.slice(start,end).match(pattern);assert.ok(match,name);
  return vm.runInNewContext(match[1],{...variables,Math,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),masteryPoints:engine().masteryPoints});
}
test('a spare cannot award full marks',()=>{
  const bowling=(knocked,shot)=>gameScore('Bowling3DMob',/const score=([^;]+);/,{knocked,shot});
  assert.equal(bowling(10,1),100);assert.equal(bowling(10,2),85);assert.equal(bowling(9,2),81);

});
test('climbing full marks require fast completion without wrong-side inputs',()=>{
  const score=(index,sec,mistakes)=>gameScore('BuildingClimb3DMob',/score=(index>=10[^;]+);/,{index,sec,mistakes});
  assert.equal(score(10,6,0),100);assert.ok(score(10,7,0)<100);assert.ok(score(10,6,1)<100);assert.ok(score(9,5,0)<70);
});
test('shot-put perfect distance is reachable at multiple frame rates but not with partial charge',()=>{
  function distance(charge,angle,dt){let y=1.35,z=.15,vy=Math.sin(angle*Math.PI/180)*(8.5+charge*10.8),vz=-Math.cos(angle*Math.PI/180)*(8.5+charge*10.8);while(y>.25){vy-=9.8*dt;y+=vy*dt;z+=vz*dt;}return (-z-1)*2.8;}
  for(const dt of [1/120,1/60,.025]){
    const best=Math.max(...Array.from({length:25},(_,i)=>{const angle=43.4+i*.05;return gameScore('ShotPut3DMob',/const score=([^;]+);/,{distance:distance(1,angle,dt),charge:1,angle});}));assert.equal(best,100);
    assert.ok(gameScore('ShotPut3DMob',/const score=([^;]+);/,{distance:distance(.8,44,dt),charge:.8,angle:44})<80);
  }
});
