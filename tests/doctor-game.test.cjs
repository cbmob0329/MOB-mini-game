const {test}=require('node:test'),assert=require('node:assert/strict'),D=require('../party-doctor-game.js'),L=require('../party-league.js');
const seeded=seed=>()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
test('all secret numbers have five unique cards, with different decoys per team',()=>{
 for(let secret=1;secret<=99;secret++){const rng=seeded(secret);let first=true;const r=D.deal(20,()=>first?(first=false,(secret-.5)/99):rng());assert.equal(r.secret,secret);const decoys=[];for(const hand of r.cards){assert.equal(hand.length,5);assert.equal(new Set(hand).size,5);assert.equal(hand.filter(n=>n===secret).length,1);assert.ok(hand.every(n=>n>=1&&n<=99));decoys.push(...hand.filter(n=>n!==secret));}assert.equal(new Set(decoys).size,80);assert.equal(r.hint,secret>=50?'アップ':'ダウン');}
});
test('scoring, CPU clues, crew and solo grouping use the same round rules',()=>{
 assert.equal(D.points(30,64),66);for(let n=1;n<=99;n++)assert.equal(D.points(n,n),100);assert.equal(D.points(1,99),2);assert.equal(D.points(99,1),2);
 for(let seed=1;seed<=50;seed++){const rng=seeded(seed),r=D.deal(20,rng);r.cards.forEach(c=>{const choice=D.cpuChoice(c,r.hint,rng);assert.ok(c.includes(choice));assert.equal(D.hint(choice),r.hint);});}
 for(const size of [1,2,4]){const entrants=Array.from({length:20*size},(_,i)=>({id:'p'+i,teamId:'t'+Math.floor(i/size),name:'P'+i,cpu:true})),teams=D.teamsFor(entrants),scores=D.simulate(teams,seeded(92));assert.equal(teams.length,20);assert.equal(Object.keys(scores).length,entrants.length);teams.forEach(t=>assert.equal(new Set(t.members.map(p=>scores[p.id])).size,1));assert.ok(Object.values(scores).every(n=>n>=2&&n<=100));}
});
test('CPU-only league no longer uses elimination points for the doctor',()=>{
 const teams=Array.from({length:20},(_,i)=>({id:'t'+i,members:['p'+i*2,'p'+(i*2+1)]})),players=teams.flatMap(t=>t.members.map(id=>({id,cpu:true}))),s=L.create(teams,L.program(['reaction']));s.round=2;
 L.fastForward(s,players,(key,p)=>100-Math.floor(Number(p.id.slice(1))/2)*3,seeded(9));const record=s.history.find(r=>r.key==='minorityMob');assert.ok(record);assert.ok(Object.values(record.points).every(n=>n>=2&&n<=100));teams.forEach(t=>assert.equal(record.points[t.members[0]],record.points[t.members[1]]));
});
