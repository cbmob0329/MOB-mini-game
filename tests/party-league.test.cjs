const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../party-league.js');
const teams=()=>Array.from({length:20},(_,i)=>({id:'L'+i,members:['a'+i,'b'+i]}));
const fresh=()=>L.create(teams(),L.program(['reaction','launch'],()=>0));
const points=(s,fn)=>Object.fromEntries(s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>[p,fn(Number(id.slice(1)),p)])));
const play=(s,fn)=>L.submit(s,points(s,fn),L.next(s,()=>0));
function qualified(){const s=fresh();for(let i=0;i<10;i++)play(s,t=>100-t*3);return s;}
function finals(){const s=qualified();for(let i=0;i<3;i++)play(s,t=>100-t*3);return s;}
test('schedule matches fixed games, tag-only third round and two bonus rounds',()=>{
  const s=fresh();assert.deepEqual(s.schedule.qualifier,['monsterBoxMob','reaction','mobSpeedRacer','ohajikiMob','reaction','reaction','reaction','reaction','deathGameChallenge','amidakujiMob']);
  assert.deepEqual(s.schedule.repechage,['longJumpMob','cardShop','bowling3DMob']);
  assert.deepEqual(s.schedule.final,['monsterBoxMob','launch','bikeJump','waterSkip','deathGameChallenge']);
  for(let i=0;i<10;i++){assert.equal(L.next(s).multiplier,[3,9].includes(i)?2:1);play(s,t=>100-t);}
});
test('40 independent entrants, direct eight and reset twelve-team repechage',()=>{
  const s=qualified();assert.equal(s.teams.flatMap(t=>t.members).length,40);assert.equal(s.direct.length,8);assert.equal(s.active.length,12);assert.ok(s.active.every(t=>!s.direct.includes(t)));assert.equal(s.phase,'repechage');assert.deepEqual(s.scores,{});assert.deepEqual(s.personal,{});
  assert.equal(s.history[3].teamPoints.L0,400);assert.equal(s.history[9].teamPoints.L0,400);
});
test('only boundary ties enter overtime, tied survivors replay until slots are resolved',()=>{
  const s=fresh();let result;for(let i=0;i<10;i++)result=play(s,t=>t<7?100:t<10?80:20);
  assert.equal(result.event.type,'cutoff');assert.equal(s.cut.slots,1);assert.equal(s.cut.kept.length,7);assert.deepEqual(s.active,['L7','L8','L9']);assert.equal(L.next(s).key,'reaction');
  play(s,()=>50);assert.equal(s.phase,'cutoff');assert.equal(s.cut.kept.length,7);
  result=play(s,t=>t===9?90:40);assert.equal(result.event.type,'qualified');assert.ok(s.direct.includes('L9'));assert.equal(s.direct.length,8);
});
test('repechage top two join the direct eight with zero carryover, including cutoff overtime',()=>{
  const s=qualified();for(let i=0;i<3;i++)play(s,t=>t<11?90:30);
  assert.equal(s.phase,'cutoff');assert.equal(s.cut.stage,'repechage');assert.equal(s.cut.slots,2);
  const r=play(s,t=>t===10?20:90);assert.equal(r.event.type,'finalists');assert.equal(s.active.length,10);assert.deepEqual(s.scores,{});assert.deepEqual(s.personal,{});assert.equal(new Set(s.active).size,10);
});
test('600 on a winning round only lights a team; it must win a later round',()=>{
  const s=finals();for(let i=0;i<3;i++){const r=play(s,t=>t===0?100:10);assert.equal(r.event.type,'round');assert.equal(s.champion,null);}
  assert.deepEqual(s.lit,['L0']);assert.equal(s.scores.L0,600);
  const r=play(s,t=>t===0?100:10);assert.equal(r.event.type,'champion');assert.equal(s.champion,'L0');assert.equal(L.next(s),null);
});
test('only already lit tied leaders enter a random championship; ties repeat',()=>{
  const s=finals();for(let i=0;i<3;i++)play(s,t=>t<2?100:10);
  const r=play(s,t=>t<3?100:10);assert.equal(r.event.type,'championship');assert.deepEqual(s.active,['L0','L1']);assert.ok(!s.active.includes('L2'));assert.equal(L.next(s,()=>0).key,'reaction');
  play(s,()=>80);assert.equal(s.phase,'championship');assert.equal(s.champion,null);play(s,t=>t===1?90:20);assert.equal(s.champion,'L1');
});
test('final continues after game ten; invalid results cannot mutate points',()=>{
  const s=finals();for(let i=0;i<12;i++)play(s,()=>10);assert.equal(s.phase,'final');assert.equal(L.next(s).round,13);assert.equal(s.champion,null);
  const saved=JSON.stringify(s);assert.throws(()=>L.submit(s,{},L.next(s)));assert.equal(JSON.stringify(s),saved);
});
