const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../party-league.js');
const teams=()=>Array.from({length:20},(_,i)=>({id:'L'+i,members:['a'+i,'b'+i]}));
const fresh=()=>L.create(teams(),L.program(['reaction','launch'],()=>0));
const points=(s,fn)=>Object.fromEntries(s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>[p,fn(Number(id.slice(1)),p)])));
const play=(s,fn)=>L.submit(s,points(s,fn),L.next(s,()=>0));
function qualified(){const s=fresh();for(let i=0;i<10;i++)play(s,t=>100-t*3);return s;}
function finals(){const s=qualified();for(let i=0;i<3;i++)play(s,t=>100-t*3);return s;}
test('schedule matches fixed games, minority third round and four bonus rounds',()=>{
  const s=fresh();assert.deepEqual(s.schedule.qualifier,['reaction','reaction','minorityMob','rouletteChoice','catcher','individualChoice','teamChoice','individualChoice','deathGameChallenge','amidakujiMob']);
  assert.deepEqual(s.schedule.repechage,['longJumpMob','cardShop','bowling3DMob']);
  assert.deepEqual(s.schedule.final,['monsterBoxMob','launch','bikeJump','waterSkip','focusBombMob','deathGameChallenge']);
  for(let i=0;i<10;i++){assert.equal(L.next(s).multiplier,[3,4,6,9].includes(i)?2:1);play(s,t=>100-t);}
});
test('40 independent entrants, direct eight and reset twelve-team repechage',()=>{
  const s=qualified();assert.equal(s.teams.flatMap(t=>t.members).length,40);assert.equal(s.direct.length,8);assert.equal(s.active.length,12);assert.ok(s.active.every(t=>!s.direct.includes(t)));assert.equal(s.phase,'repechage');assert.deepEqual(s.scores,{});assert.deepEqual(s.personal,{});
  assert.equal(s.history[3].teamPoints.L0,400);assert.equal(s.history[9].teamPoints.L0,400);
});
test('game 6 offers three unique individual games and death round doubles only the winner',()=>{
  const s=fresh();s.round=5;const d=L.next(s,()=>.4);assert.equal(d.choices.length,3);assert.equal(new Set(d.choices).size,3);assert.ok(d.choices.every(k=>!L.TAG.includes(k)));
  s.round=8;const scores=points(s,()=>50);scores.a0=100;const r=L.submit(s,scores,L.next(s));assert.equal(r.record.points.a0,200);assert.equal(r.record.points.b0,50);assert.equal(r.record.teamPoints.L0,250);assert.equal(r.record.rawPoints.a0,100);
});
test('random matchup shuffle preserves all twenty distinct teams',()=>{
  const original=teams().map(t=>t.id),order=L.sample(original,20,()=>.25);assert.equal(order.length,20);assert.deepEqual([...order].sort(),[...original].sort());assert.notDeepEqual(order,original);
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

test('edited tag pools, round-four roulette and eighth individual choices stay scoped to tag',()=>{
  const seen={first:new Set(),fifth:new Set(),final1:new Set(),final2:new Set(),final4:new Set()};
  for(let i=0;i<100;i++){const p=L.program(['reaction'],()=>i/100);seen.first.add(p.qualifier[0]);seen.fifth.add(p.qualifier[4]);seen.final1.add(p.final[0]);seen.final2.add(p.final[1]);seen.final4.add(p.final[3]);assert.equal(p.qualifier[3],'rouletteChoice');}
  assert.equal(seen.first.size,3);assert.equal(seen.fifth.size,4);assert.equal(seen.final1.size,3);assert.equal(seen.final2.size,3);assert.equal(seen.final4.size,2);
  const s=fresh();s.round=3;const d=L.next(s,()=>.99);assert.equal(d.key,'ropeSwingMob');assert.equal(d.roulette.length,5);assert.equal(L.next(s,()=>0).key,d.key);assert.equal(d.multiplier,2);
  s.round=4;assert.equal(L.next(s).roulette,null);s.round=6;assert.deepEqual(L.next(s).choices,['cardShop','mobPinball','mobDice','zeroOrHundredMob']);
  s.round=7;const eighth=L.next(s);assert.equal(eighth.key,'individualChoice');assert.deepEqual(eighth.choices,['warpedWallMob','santaClausMob','monsterBoxMob']);assert.equal(eighth.multiplier,1);
  for(const mode of ['crew','king']){const p=L.program(['reaction'],()=>0,mode);assert.equal(p.qualifier[3],'ohajikiMob');assert.equal(p.qualifier[7],'dontHitMob');assert.equal(p.profile,undefined);}
});
test('CPU summary keeps eighth-round teammates in different fixed games',()=>{
 const s=fresh(),players=s.teams.flatMap(t=>t.members.map(id=>({id,cpu:true})));let seed=11;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};L.fastForward(s,players,()=>Math.floor(random()*100),random);const r=s.history.find(r=>r.phase==='qualifier'&&r.round===8);for(const t of s.teams){assert.notEqual(r.selections[t.members[0]],r.selections[t.members[1]]);assert.ok(t.members.every(id=>['warpedWallMob','santaClausMob','monsterBoxMob'].includes(r.selections[id])));}
});
