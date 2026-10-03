const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../party-league-events.js'),L=require('../party-league.js');
const entrants=Array.from({length:40},(_,i)=>({id:'p'+i,teamId:'L'+Math.floor(i/2),team:'TEAM '+Math.floor(i/2),name:'Player '+i,img:'icon/01.png',cpu:i>0,no:i+1}));
test('bomb records retain five decimal seconds and exact ties always get unique places',()=>{
  assert.deepEqual(E.bombRecord(1000.014),{elapsed:1000.01,error:.01});
  assert.equal(E.errorAt(999.99),.01);
  const records=[1000.02,999.99,1000.01,1000,3000].map((time,i)=>({p:{id:i},...E.bombRecord(time)}));
  const ranked=E.rankBombRecords(records,()=>0);
  assert.deepEqual(ranked.map(r=>r.error),[0,.01,.01,.02,2000]);
  assert.equal(new Set(ranked.map(r=>r.p.id)).size,5);
  assert.equal(ranked.filter(r=>r.tiebreak).length,2);
  assert.equal(E.rankBombRecords(records.map(r=>({...r,...E.bombRecord(3000)})),()=>0).length,5);
});
test('bomb final announces fifth to first even when every CPU has the same record',async()=>{
  const pages=[],button={dataset:{answer:'0'},set onclick(fn){queueMicrotask(fn);}},host={innerHTML:'',querySelectorAll:()=>[button]};
  const screen={set innerHTML(value){pages.push(value);},getBoundingClientRect:()=>({top:0}),querySelector:sel=>sel==='#eventActions'?host:{style:{setProperty(){}},textContent:''}};
  const window={};vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-events.js'),'utf8'),{window,setTimeout:fn=>queueMicrotask(fn)});
  let scores;
  await window.MobLeagueEvents.run({key:'focusBombMob',mode:'tag',screen,entrants:entrants.slice(0,20).map(p=>({...p,cpu:true})),esc:String,valid:()=>true,beep(){},clear(){},top(){},random:()=>.5,done:value=>{scores=value;}});
  assert.deepEqual(pages.filter(p=>p.includes('data-bomb-rank')).map(p=>Number(p.match(/data-bomb-rank="(\d)"/)[1])),[5,4,3,2,1]);
  assert.deepEqual(Object.values(scores).filter(v=>v>0).sort((a,b)=>b-a),[100,80,60,50,40]);
  assert.ok(pages.some(p=>p.includes('同じ誤差の選手間は抽選')));
});
test('minority keeps the smaller side, and never eliminates on equal or unanimous votes',()=>{
  const votes=n=>Array.from({length:40},(_,i)=>({id:'p'+i,side:i<n?0:1}));
  for(const n of [0,20,40]){const r=E.minority(votes(n));assert.equal(r.retry,true);assert.equal(r.survivors.length,40);assert.equal(r.out.length,0);}
  for(const n of [1,2,15,39]){const r=E.minority(votes(n));assert.equal(r.retry,false);assert.equal(r.survivors.length,Math.min(n,40-n));assert.equal(r.out.length,40-r.survivors.length);assert.deepEqual(r.counts,[n,40-n]);}
});

test('minority awards every elimination stage, ignores retries and submits all points to the league',async()=>{
  const sequence=[],pages=[];
  // Each round draws one food, followed by one vote per survivor.
  for(const [count,minority] of [[40,20],[40,40],[40,19],[19,9],[9,4],[4,1]]){
    sequence.push(.1,...Array.from({length:count},(_,i)=>i<minority?.1:.9));
  }
  const button={dataset:{answer:'0'},set onclick(fn){queueMicrotask(fn);}},host={innerHTML:'',querySelectorAll:()=>[button]};
  const screen={set innerHTML(value){pages.push(value);},getBoundingClientRect:()=>({top:0}),querySelector:sel=>sel==='#eventActions'?host:{style:{setProperty(){}},textContent:''}};
  const window={};vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-events.js'),'utf8'),{window,setTimeout:fn=>queueMicrotask(fn)});
  let scores;
  await window.MobLeagueEvents.run({key:'minorityMob',screen,entrants:entrants.map(p=>({...p,cpu:true})),esc:String,valid:()=>true,beep(){},clear(){},top(){},random(){assert.ok(sequence.length,'unexpected extra round');return sequence.shift();},done:value=>{scores=value;}});
  assert.equal(sequence.length,0);assert.equal(Object.keys(scores).length,40);
  assert.equal(scores.p0,100);
  for(let i=1;i<40;i++)assert.equal(scores['p'+i],i<4?80:i<9?60:i<19?40:20);
  assert.ok(pages.some(p=>p.includes('脱落者は20ポイント獲得')));
  assert.ok(pages.some(p=>p.includes('脱落者は80ポイント獲得')));
  assert.ok(pages.every(p=>!p.includes('脱落者は0点')));
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,members:['p'+i*2,'p'+(i*2+1)]}));
  const state=L.create(teams,L.program(['reaction']));state.round=2;
  const {record}=L.submit(state,scores,L.next(state));
  assert.equal(record.points.p39,20);assert.equal(record.teamPoints.L19,40);
  assert.equal(record.teamPoints.L0,180);assert.equal(state.personal.p39,20);
});
test('bomb has five four-player heats with each entrant once and teammates separated',()=>{
  for(const r of [0,.25,.99]){const heats=E.groups(entrants.slice(0,20),()=>r);assert.equal(heats.length,5);assert.ok(heats.every(g=>g.length===4&&new Set(g.map(p=>p.teamId)).size===4));assert.equal(new Set(heats.flat().map(p=>p.id)).size,20);}
  assert.throws(()=>E.groups(entrants));
  assert.equal(E.errorAt(1000),0);assert.equal(E.errorAt(999),1);assert.equal(E.errorAt(1001),1);
  assert.equal(E.errorAt(750),250);assert.equal(E.errorAt(1250),250);assert.equal(E.errorAt(3000),2000);
});
test('bomb individual winner crowns their already lit team despite a different team-total leader',()=>{
  const teams=Array.from({length:20},(_,i)=>({id:'L'+i,members:['p'+i*2,'p'+(i*2+1)]}));
  for(const previouslyLit of [true,false]){
    const s=L.create(teams,L.program(['reaction']));s.phase='final';s.round=s.schedule.final.indexOf('focusBombMob');s.active=teams.slice(0,10).map(t=>t.id);s.scores={L0:590,L1:700};s.lit=previouslyLit?['L0','L1']:['L1'];
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
  for(const [phase,round,key,count] of [['qualifier',2,'minorityMob',40],['final',4,'focusBombMob',20]]){
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

test('new ignition precedes results; championship takes priority with no ignition',()=>{
  const h=uiHarness();h.record.phase='final';h.record.litBefore=[];
  h.ui.results({event:{type:'round',ids:['L2']},record:h.record});
  assert.match(h.html(),/MATCH POINT · 点灯/);assert.doesNotMatch(h.html(),/class="league-rank /);
  h.next();assert.match(h.html(),/このゲームだけの順位/);assert.match(h.html(),/今回獲得したポイントのみ/);
  h.next();h.next();assert.match(h.html(),/決勝の総合順位/);
  const winner=uiHarness();winner.record.phase='final';winner.record.litBefore=['L0'];
  winner.ui.results({event:{type:'champion',ids:['L0']},record:winner.record});
  winner.next();assert.match(winner.html(),/CHAMPION!!/);assert.doesNotMatch(winner.html(),/MATCH POINT/);
  winner.next();assert.match(winner.html(),/このゲームだけの順位/);
});

test('minority waits for shared-result button before any countdown or result disclosure',async()=>{
  let html='',handler,timers=0,randomCalls=0,valid=true;
  const button={dataset:{answer:'0'},set onclick(fn){handler=fn;}},host={innerHTML:'',querySelectorAll:()=>[button]};
  const screen={set innerHTML(value){html=value;},getBoundingClientRect:()=>({top:0}),querySelector:sel=>sel==='#eventActions'?host:{style:{setProperty(){}},textContent:''}};
  const window={};vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-events.js'),'utf8'),{window,setTimeout:fn=>{timers++;queueMicrotask(fn);}});
  const run=window.MobLeagueEvents.run({key:'minorityMob',screen,entrants:entrants.map(p=>({...p,cpu:true})),esc:String,valid:()=>valid,beep(){},clear(){},top(){},random:()=>++randomCalls===2?.1:.9,done(){}});
  handler();for(let i=0;i<10;i++)await Promise.resolve();
  assert.match(html,/全ての票が揃いました/);assert.match(host.innerHTML,/みんなで結果を見る/);assert.equal(timers,0);assert.doesNotMatch(html,/voteCountdown|票<\/strong>/);
  handler();for(let i=0;i<12;i++)await Promise.resolve();
  assert.match(html,/投票結果/);assert.equal(timers,0);
  handler();for(let i=0;i<8;i++)await Promise.resolve();
  assert.match(html,/elimination-results/);assert.equal((html.match(/<article /g)||[]).length,4);
  handler();valid=false;await run;
});
