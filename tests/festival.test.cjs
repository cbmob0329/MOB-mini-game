
const {test}=require('node:test'),assert=require('node:assert/strict'),R=require('../party-festival-rules'),C=require('../party-core'),L=require('../party-league');
const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const roster=(mode,selected=[])=>R.entrants(C.roster,selected,{tournament:32,white:40,world:80}[mode],mode==='tournament',rng(18));
test('32 unique entrants preserve humans and place at least four high-rank seeds in different quarters',()=>{
 const p=roster('tournament',[1,12]);assert.equal(new Set(p.map(p=>p.id)).size,32);assert.equal(p.filter(p=>!p.cpu).length,2);
 for(const slot of [0,8,16,24]){assert.ok(C.rankValue(p[slot].characterRank)>=6);assert.ok(p[slot].seed)}
});
test('roulette takes distinct games; overtime excludes prior games',()=>{
 const pool=Array.from({length:20},(_,i)=>'g'+i),d=R.draw(pool,10,3,rng(2));assert.equal(d.choices.length,10);assert.equal(new Set(d.selected).size,3);
 const extra=R.draw(pool,5,1,rng(8),d.selected);assert.ok(extra.choices.every(k=>!d.selected.includes(k)));
});
test('tournament ties never eliminate players, and all 31 wins reach one champion',()=>{
 const s=R.create('tournament',roster('tournament'));let pair=R.bracketPair(s);
 assert.ok(R.bracketResult(s,Object.fromEntries(pair.map(id=>[id,80]))).tie);assert.equal(s.match,0);
 let games=0;while(!s.champion){pair=R.bracketPair(s);R.bracketResult(s,{[pair[0]]:100,[pair[1]]:90});games++}
 assert.equal(games,31);assert.equal(s.round,5);
});
test('White inclusive lines and both terminal outcomes',()=>{
 for(const [level,[lo,hi]] of Object.entries(R.LIMITS)){assert.equal(R.whiteLimit(level,()=>0),lo);assert.equal(R.whiteLimit(level,()=>.99999),hi)}
 const s=R.create('white',roster('white')),ids=[...s.active];const a=R.whiteResult(s,Object.fromEntries(ids.map((id,i)=>[id,i===0?75:74])),75);assert.equal(a.champion,ids[0]);assert.equal(a.out.length,39);
 const all=R.create('white',roster('white'));assert.ok(R.whiteResult(all,Object.fromEntries(all.active.map(id=>[id,64])),65).whiteWins);
});
test('World group schedule covers every pair, 40 per fixture, three appearances per player',()=>{
 const s=R.create('world',roster('world'));const counts={};const seen=new Set();
 for(let leg=0;leg<6;leg++){s.leg=leg;const ids=R.worldActive(s);assert.equal(ids.length,40);for(const id of ids)counts[id]=(counts[id]||0)+1;seen.add(R.MATCHUPS[leg].join(':'))}
 assert.equal(seen.size,6);assert.ok(Object.values(counts).every(n=>n===3));
});
test('World adds exact 40-person rank points and score bonuses; tied cutoff uses extra game',()=>{
 const s=R.create('world',roster('world'));const ids=R.worldActive(s);let points=Object.fromEntries(ids.map((id,i)=>[id,100-i]));
 const result=R.worldResult(s,points);assert.equal(result.record.earned[ids[0]],30);assert.equal(result.record.earned[ids[1]],22);assert.equal(result.record.earned[ids[14]],6);assert.equal(result.record.earned[ids[15]],5);
 const tied=R.create('world',roster('world'));for(let i=0;i<18;i++)R.worldResult(tied,Object.fromEntries(R.worldActive(tied).map(id=>[id,50])));
 assert.equal(tied.phase,'cutoff');assert.equal(tied.active.length,80);
 R.cutoffResult(tied,Object.fromEntries(tied.active.map((id,i)=>[id,100-i])));
 assert.equal(tied.phase,'final');assert.equal(tied.active.length,20);assert.deepEqual(tied.scores,{});
});
test('World champion takes precedence over ignition; each five lights queues one bomb',()=>{
 const s=R.create('world',roster('world'));s.phase='final';s.active=s.active.slice(0,20);s.finalists=[...s.active];s.active.slice(0,5).forEach(id=>s.scores[id]=79);
 let points=Object.fromEntries(s.active.map((id,i)=>[id,i===19?100:80]));let r=R.worldResult(s,points);assert.equal(s.lit.length,5);assert.equal(s.bombQueue,1);assert.equal(s.champion,null);
 points=Object.fromEntries(s.active.map((id,i)=>[id,i===0?100:70]));r=R.worldResult(s,points,{bomb:true});assert.equal(s.champion,s.active[0]);assert.equal(s.bombQueue,0);
});
test('30 and 40 tag teams use requested qualification sizes, monotonic bounded carryovers, and rank mode',()=>{
 for(const count of [20,30,40]){const teams=Array.from({length:count},(_,i)=>({id:'t'+i,members:['a'+i,'b'+i]}));
 const s=L.create(teams,L.program(['reaction'])),cfg=L.TAG_SIZES[count];assert.equal(s.directSlots,cfg.direct);assert.equal(s.revivalSlots,cfg.revival);assert.equal(s.carryover.length,cfg.direct);assert.equal(Math.max(...s.carryover),100);assert.ok(s.carryover.every((n,i)=>!i||s.carryover[i-1]>=n));
 s.round=9;s.schedule.profile='test';s.schedule.qualifier[9]='reaction';let d=L.next(s);L.submit(s,Object.fromEntries(teams.flatMap((t,i)=>t.members.map(id=>[id,100-i]))),d);
 assert.equal(s.direct.length,cfg.direct);s.round=2;d=L.next(s);L.submit(s,Object.fromEntries(s.active.flatMap((id,i)=>s.teams.find(t=>t.id===id).members.map(p=>[p,100-i]))),d);
 assert.equal(s.active.length,cfg.direct+cfg.revival);assert.equal(s.phase,'final');assert.ok(s.active.slice(cfg.direct).every(id=>!s.scores[id]));
 const rank=L.create(teams,L.program(['reaction']),{scoring:'rank'});assert.equal(rank.phase,'final');assert.equal(rank.active.length,count);assert.equal(rank.threshold,80);
 }
});
