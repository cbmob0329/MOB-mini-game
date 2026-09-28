const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../party-league-events.js'),L=require('../party-league.js');
const entrants=Array.from({length:40},(_,i)=>({id:'p'+i,teamId:'L'+Math.floor(i/2),team:'TEAM '+Math.floor(i/2),name:'Player '+i,img:'icon/01.png',cpu:i>0,no:i+1}));
test('minority keeps the smaller side, and never eliminates on equal or unanimous votes',()=>{
  const votes=n=>Array.from({length:40},(_,i)=>({id:'p'+i,side:i<n?0:1}));
  for(const n of [0,20,40]){const r=E.minority(votes(n));assert.equal(r.retry,true);assert.equal(r.survivors.length,40);assert.equal(r.out.length,0);}
  for(const n of [1,2,15,39]){const r=E.minority(votes(n));assert.equal(r.retry,false);assert.equal(r.survivors.length,Math.min(n,40-n));assert.equal(r.out.length,40-r.survivors.length);assert.deepEqual(r.counts,[n,40-n]);}
});
test('bomb has five four-player heats with each entrant once and teammates separated',()=>{
  for(const r of [0,.25,.99]){const heats=E.groups(entrants.slice(0,20),()=>r);assert.equal(heats.length,5);assert.ok(heats.every(g=>g.length===4&&new Set(g.map(p=>p.teamId)).size===4));assert.equal(new Set(heats.flat().map(p=>p.id)).size,20);}
  assert.throws(()=>E.groups(entrants));
  assert.equal(E.errorAt(0,1000,0),0);assert.equal(E.errorAt(250,1000,0),50000);assert.equal(E.errorAt(500,1000,0),0);
});
test('bomb individual winner crowns their already lit team despite a different team-total leader',()=>{
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,members:['p'+i*2,'p'+(i*2+1)]}));
  for(const previouslyLit of [true,false]){
    const s=L.create(teams,L.program(['reaction']));s.phase='final';s.round=5;s.active=teams.slice(0,10).map(t=>t.id);s.scores={L0:590,L1:700};s.lit=previouslyLit?['L0','L1']:['L1'];
    const points=Object.fromEntries(entrants.slice(0,20).map(p=>[p.id,0]));Object.assign(points,{p0:100,p2:80,p3:60,p4:50,p6:40});
    const result=L.submit(s,points,L.next(s));assert.equal(result.record.teamPoints.L1,140);assert.equal(result.record.teamPoints.L0,100);
    assert.equal(s.champion,previouslyLit?'L0':null);assert.ok(s.lit.includes('L0'));
  }
});
function uiHarness(){
  let nodes=new Map(),html='';const screen={get innerHTML(){return html},set innerHTML(v){html=v},getBoundingClientRect:()=>({top:80}),querySelector(sel){if(!nodes.has(sel))nodes.set(sel,{style:{setProperty(){}},classList:{add(){}},insertAdjacentHTML(){}});return nodes.get(sel);}};
  const runs=[],context={window:{MobPartyLeague:L,MobPartyCore:{},MobLeagueEvents:{run:api=>runs.push(api)},innerHeight:640},console};
  let source=fs.readFileSync(require.resolve('../party-league-ui.js'),'utf8').replace('return {setup,stop,active:', 'return {seed(s,p){league=s;players=p;},results,play,setup,stop,active:');vm.runInNewContext(source,context);
  const ui=context.window.MobPartyLeagueUI.create({screen,esc:String,clear(){nodes=new Map()},top(){},beep(){},title:k=>k});
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,name:'TEAM '+i,members:['p'+i*2,'p'+(i*2+1)]}));
  const state=L.create(teams,L.program(['reaction']));ui.seed(state,entrants);
  const record={phase:'qualifier',round:10,key:'amidakujiMob',multiplier:2,active:teams.map(t=>t.id),totals:Object.fromEntries(teams.map((t,i)=>[t.id,1000-i*10])),teamPoints:{},points:{},personal:{},litBefore:[]};
  return {ui,state,record,runs,html:()=>html,next:()=>screen.querySelector('#leagueNext').onclick()};
}
test('all eight qualification reveals precede either ranking page',()=>{
  const h=uiHarness();h.ui.results({event:{type:'qualified',ids:h.state.active.slice(0,8)},record:h.record});
  for(let i=1;i<=8;i++){assert.match(h.html(),new RegExp('進出発表 '+i+' / 8'));assert.doesNotMatch(h.html(),/class="league-rank/);h.next();}
  assert.match(h.html(),/今回のチーム順位/);h.next();assert.match(h.html(),/現在の総合順位はこちら/);h.next();assert.match(h.html(),/ステージチーム総合/);
});
test('repechage winners are revealed before standings',()=>{
  const h=uiHarness();h.record.phase='repechage';h.record.round=3;h.ui.results({event:{type:'finalists',wildcards:['L8','L9'],ids:h.state.active.slice(0,10)},record:h.record});
  for(let i=1;i<=2;i++){assert.match(h.html(),new RegExp('進出発表 '+i+' / 2'));assert.doesNotMatch(h.html(),/class="league-rank/);h.next();}assert.match(h.html(),/今回のチーム順位/);
});
test('lit finals reveal suspense then champion or continuation before scores',()=>{
  for(const type of ['champion','round','championship']){const h=uiHarness();h.record.phase='final';h.record.litBefore=['L0','L1'];h.ui.results({event:{type,ids:type==='round'?[]:['L0']},record:h.record});assert.match(h.html(),/さあ、これで決まるのか/);assert.doesNotMatch(h.html(),/class="league-rank/);h.next();assert.match(h.html(),type==='champion'?/CHAMPION!!/:/勝負はまだ続きます/);h.next();assert.match(h.html(),/今回のチーム順位/);}
});
test('league launches the shared event for all active entrants and rejects a stopped callback',()=>{
  for(const [phase,round,key,count] of [['qualifier',2,'minorityMob',40],['final',5,'focusBombMob',20]]){
    const h=uiHarness();h.state.phase=phase;h.state.round=round;if(phase==='final')h.state.active=h.state.active.slice(0,10);
    h.ui.play();h.next();h.next();assert.equal(h.runs.length,1);const event=h.runs[0];assert.equal(event.key,key);assert.equal(event.entrants.length,count);assert.equal(event.valid(),true);
    const points=Object.fromEntries(event.entrants.map((p,i)=>[p.id,key==='minorityMob'?i===0?100:0:[100,80,60,50,40][i]||0]));event.done(points);assert.equal(h.state.history.length,1);
    h.ui.stop();assert.equal(event.valid(),false);event.done(points);assert.equal(h.state.history.length,1);
  }
});
test('secured teams and overtime are announced before cutoff standings',()=>{
  const h=uiHarness();h.state.cut={kept:['L0','L1'],slots:6};h.ui.results({event:{type:'cutoff',ids:['L2','L3'],slots:6},record:h.record});
  assert.match(h.html(),/進出確定チーム発表/);h.next();h.next();assert.match(h.html(),/ボーダー同点！ 延長戦！/);h.next();assert.match(h.html(),/現在の総合順位|今回のチーム順位/);
});
