const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../party-core.js');
function engine(){
  const element={addEventListener(){},removeEventListener(){},classList:{add(){},remove(){},contains(){return false;}},querySelector(){return null;},querySelectorAll(){return [];},style:{setProperty(){}},setAttribute(){},removeAttribute(){}};
  const document={addEventListener(){},getElementById(){return element;},querySelector(){return element;},querySelectorAll(){return [];},documentElement:element,body:element};
  const window={MobPartyCore:core,MobPartyUI:{create(){return {};}},MobPartyGames:{create(){return {};}},addEventListener(){}};
  const context=vm.createContext({window,document,console,Math,performance:{now:()=>0},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},Image:class{},URL,localStorage:{getItem(){return null;},setItem(){}}});
  let source=fs.readFileSync(require.resolve('../game.js'),'utf8');
  source=source.replace(/renderHome\(\);\r?\n\}\)\(\);/,`window.__test={GAMES,MODES,PLAYERS,performancePoints,rankRecords,applyPoints,applyConfiguredBattle,participants,freshState,simulateOneCpu,teamTotals,setState(s){state=s},getState(){return state}};})();`);
  vm.runInContext(source,context);return window.__test;
}
test('158 games have records; new games score directly on a 100-point scale',()=>{
  const e=engine(),state=e.freshState();assert.equal(e.GAMES.length,158);
  for(const g of e.GAMES)assert.ok(state.records[g.key],g.key);
  for(const key of ['colorBridgeParty','treasureEscapeParty']){const i=e.GAMES.findIndex(g=>g.key===key);assert.ok(i>=0);assert.equal(e.performancePoints(i,80),80);}
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
