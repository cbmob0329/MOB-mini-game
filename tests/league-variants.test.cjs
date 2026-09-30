const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../party-league.js'),core=require('../party-core.js'),events=require('../party-league-events.js');
function fresh(mode){const size=mode==='crew'?4:1;return L.create(Array.from({length:mode==='crew'?20:80},(_,i)=>({id:'T'+i,division:Math.floor(i/20),members:Array.from({length:size},(_,j)=>'p'+(i*size+j))})),L.program(['reaction','longJumpMob','brake','golf'],()=>0),{mode});}
function play(s,score=i=>100-i%20*3){const d=L.next(s,()=>0);return L.submit(s,Object.fromEntries(s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>[p,score(Number(id.slice(1)))]))),d);}
test('KING: four independent ten-game qualifiers, top five each, origins and reset final without repechage',()=>{
  const s=fresh('king');for(let division=0;division<4;division++){
    assert.equal(s.division,division);assert.equal(s.active.length,20);for(let i=0;i<10;i++)play(s);
    const ids=Array.from({length:5},(_,i)=>'T'+(division*20+i));assert.deepEqual(s.qualifiers.slice(-5),ids);
    ids.forEach((id,i)=>assert.deepEqual(s.origins[id],{league:L.DIVISIONS[division],place:i+1}));
  }
  assert.equal(s.phase,'final');assert.equal(s.active.length,20);assert.deepEqual(s.scores,{});assert.ok(s.history.every(r=>r.phase==='qualifier'));
  for(let i=0;i<3;i++)assert.equal(play(s,t=>t===0?100:10).event.type,'round');assert.equal(s.threshold,300);assert.equal(s.champion,null);
  assert.equal(play(s,t=>t===0?100:10).event.type,'champion');assert.equal(s.champion,'T0');
});
test('KING: fifth-place cutoff uses only tied entrants and rejects a previous division callback',()=>{
  const s=fresh('king'),old=L.next(s);for(let i=0;i<10;i++)play(s,t=>t<4?100-t:t<7?50:10);
  assert.equal(s.phase,'cutoff');assert.deepEqual(s.active,['T4','T5','T6']);play(s,t=>t===6?100:0);
  assert.deepEqual(s.qualifiers,['T0','T1','T2','T3','T6']);assert.equal(s.origins.T6.place,5);assert.equal(s.division,1);
  assert.throws(()=>L.submit(s,{},old),/Stale/);
});
test('CREW: all four members contribute, eight plus two qualify, 1200 lights before later win',()=>{
  const s=fresh('crew');for(let i=0;i<10;i++)play(s);assert.equal(s.direct.length,8);assert.equal(s.active.length,12);
  assert.equal(s.history[3].teamPoints.T0,800);for(let i=0;i<3;i++)play(s);assert.equal(s.active.length,10);assert.equal(s.threshold,1200);
  for(let i=0;i<3;i++)play(s,t=>t===0?100:10);assert.deepEqual(s.lit,['T0']);assert.equal(s.champion,null);
  assert.equal(play(s,t=>t===0?100:10).event.type,'champion');
});
test('new focus bomb heats preserve all entrants and separate crew members',()=>{
  for(const mode of ['crew','king']){const s=fresh(mode),teams=s.teams.slice(0,mode==='crew'?10:20),entrants=teams.flatMap(t=>t.members.map(id=>({id,teamId:t.id}))),heats=events.groups(entrants,()=>.4,mode);
    assert.equal(heats.length,5);assert.ok(heats.every(h=>h.length===(mode==='crew'?8:4)));assert.equal(new Set(heats.flat().map(p=>p.id)).size,entrants.length);
    assert.ok(heats.every(h=>new Set(h.map(p=>p.teamId)).size===h.length));
  }
});
test('75–82 assets and strengths follow the new character settings',()=>{
  const rank=(id,game,r=.5)=>core.characterRank(core.roster.find(c=>c.id===id),game,()=>r);
  for(let id=75;id<=82;id++)assert.ok(fs.existsSync(require('path').join(__dirname,'..',core.roster.find(c=>c.id===id).img)));
  for(let id=75;id<=78;id++)assert.equal(rank(id,{title:'3Dパンチングマシン'}),'A+');
  assert.equal(rank(75,{},0),'C+');assert.equal(rank(75,{},.999),'B-');assert.equal(rank(80,{},.999),'A-');
  assert.equal(rank(81,{key:'launch'}),'S');assert.equal(rank(82,{key:'math',title:'算数チャレンジ'}),'SS');
});
function fixture(mode,humans=0,deferred=false,pool=['reaction','longJumpMob','brake','golf','summonMaster','treasureDuoParty']){
  const elements=new Map(),screen={innerHTML:'',getBoundingClientRect:()=>({top:80}),querySelector(id){if(!elements.has(id))elements.set(id,{value:0,style:{setProperty(){}}});return elements.get(id);},querySelectorAll(){return [];}};
  let players,teams;const runs=[],pending=[],window={MobPartyCore:core,MobPartyLeague:L,MobCharacterSelect:{show:o=>o.confirm(core.roster[o.index])},MobLeagueEvents:{run:o=>o.done(Object.fromEntries(o.entrants.map(p=>[p.id,100-Number(p.teamId.slice(1))])))}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-variants.js'),'utf8'),{window,Math});
  const ui=window.MobLeagueVariants.create({screen,esc:s=>s,clear(){},top(){},beep(){},home(){},title:s=>s,pool:()=>pool,configure(p,t){players=p;teams=t;},run(key,rows,d,done){runs.push({key,rows,d});const finish=()=>done(Object.fromEntries(rows.flatMap(t=>t.members.map(p=>[p,100-parseInt(t.id.slice(1))]))));deferred?pending.push(finish):finish();}});
  ui.setup(mode);screen.querySelector('#variantCount').value=humans;screen.querySelector('#variantLevel').value='ALL';screen.querySelector('#variantSelect').onclick();screen.querySelector('#variantStart').onclick();
  return {ui,screen,players,teams,runs,pending,next(){screen.querySelector('#variantNext').onclick();},until(text){for(let i=0;i<1800&&!screen.innerHTML.includes(text);i++){if(screen.innerHTML.includes('id="variantChoice0"'))screen.querySelector('#variantChoice0').onclick();else this.next();}assert.ok(screen.innerHTML.includes(text),text);}};
}
for(const mode of ['crew','king'])test(mode+' UI: complete spectator tournament reaches champion collection',()=>{
  const f=fixture(mode);assert.equal(f.players.length,80);assert.equal(new Set(f.players.map(p=>p.img)).size,80);
  f.until('CHAMPION!!');assert.doesNotMatch(f.screen.innerHTML,/MATCH POINT/);f.until('優勝記念コレクション');assert.ok(f.runs.length);
  if(mode==='king'){assert.ok(f.runs.every(r=>![...L.TAG,'treasureDuoParty'].includes(r.key)));assert.ok(f.players.filter(p=>p.origin).length===20);assert.ok(f.runs.some(r=>r.d.division===3));}
  else{const death=f.runs.find(r=>r.key==='deathGameChallenge');assert.equal(death.rows.length,20);assert.equal(death.rows.flatMap(t=>t.members).length,40);assert.ok(death.rows.every(t=>t.members.length===2));}
});
test('twenty humans get chosen characters and league/crew assignments',()=>{
  for(const mode of ['crew','king']){const f=fixture(mode,20);assert.equal(f.players.filter(p=>!p.cpu).length,20);for(let i=0;i<20;i++)assert.equal(f.players.find(p=>p.id==='p'+(i+1)).img,core.roster[i].img);assert.equal(f.teams.length,mode==='crew'?20:80);}
});
test('stopping new league discards pending game callbacks',()=>{const f=fixture('crew',0,true);for(let i=0;i<11;i++)f.next();assert.equal(f.pending.length,1);f.ui.stop();const html=f.screen.innerHTML;f.pending.shift()();assert.equal(f.screen.innerHTML,html);});
test('CREW paired events divide all eighty entrants into valid two-versus-two heats',()=>{
  const f=fixture('crew',0,false,['treasureDuoParty']);f.until('優勝記念コレクション');const heats=f.runs.filter(r=>r.key==='treasureDuoParty'&&r.d.phase==='qualifier'&&r.d.round===2);
  assert.equal(heats.length,20);assert.ok(heats.every(r=>r.rows.length===2&&r.rows.every(t=>t.members.length===2)));assert.equal(new Set(heats.flatMap(r=>r.rows.flatMap(t=>t.members))).size,80);
});
