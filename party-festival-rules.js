
/* Serializable rules shared by the three solo championships. */
(function(root){
'use strict';
const core=typeof module!=='undefined'&&module.exports?require('./party-core.js'):root.MobPartyCore;
const league=typeof module!=='undefined'&&module.exports?require('./party-league.js'):root.MobPartyLeague;
const WORLD_POINTS=[20,15,12,10,9,8,7,6,5,4,3,2,1,1,1];
const MATCHUPS=[[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
const LIMITS={EASY:[65,85],HARD:[70,92],INFERNO:[75,100]};
const shuffle=(a,r=Math.random)=>league.sample(a,a.length,r);
function entrants(roster,selected,count,seeded=false,r=Math.random){
 if(new Set(selected).size!==selected.length||selected.length>count)throw Error('Invalid selections');
 let chosen=selected.map(id=>{const c=roster.find(c=>c.id===id);if(!c)throw Error('Missing character');return c});
 if(seeded){const high=chosen.filter(c=>core.rankValue(c.rank)>=6).length;
 chosen.push(...shuffle(roster.filter(c=>!chosen.includes(c)&&core.rankValue(c.rank)>=6),r).slice(0,Math.max(0,4-high)));}
 chosen.push(...shuffle(roster.filter(c=>!chosen.includes(c)),r).slice(0,count-chosen.length));
 if(chosen.length!==count)throw Error('Insufficient roster');
 let rows=shuffle(chosen,r);
 if(seeded){const seeds=shuffle(rows.filter(c=>core.rankValue(c.rank)>=6),r).slice(0,4);if(seeds.length<4)throw Error('Four high ranks required');
 const rest=shuffle(rows.filter(c=>!seeds.includes(c)),r);rows=Array(count);[0,8,16,24].forEach((slot,i)=>rows[slot]=seeds[i]);for(let i=0;i<count;i++)if(!rows[i])rows[i]=rest.shift();}
 return rows.map((c,i)=>({id:'festival-'+c.id,characterId:c.id,characterRank:c.rank,img:c.img,name:c.name,baseName:c.name,cpu:!selected.includes(c.id),no:selected.indexOf(c.id)+1,group:Math.floor(i/20),seed:seeded&&[0,8,16,24].includes(i)}));
}
function draw(pool,candidates,take,r=Math.random,exclude=[]){
 const available=[...new Set(pool)].filter(k=>!exclude.includes(k));
 if(available.length<take)throw Error('Not enough different games');
 const choices=league.sample(available,Math.min(candidates,available.length),r);
 return {choices,selected:league.sample(choices,take,r)};
}
function create(mode,players){
 const n={tournament:32,white:40,world:80}[mode];
 if(players.length!==n||new Set(players.map(p=>p.id)).size!==n)throw Error('Invalid entrants');
 return {mode,players,active:players.map(p=>p.id),round:0,match:0,bracket:players.map(p=>p.id),winners:[],scores:{},history:[],leg:0,game:0,lit:[],bombMilestones:0,bombQueue:0,phase:mode==='world'?'groups':'play',champion:null,whiteWins:false,revision:0};
}
function validScores(ids,scores){for(const id of ids)if(!Number.isFinite(scores[id])||scores[id]<0||scores[id]>100)throw Error('Invalid score '+id);}
function bracketPair(s){return s.bracket.slice(s.match*2,s.match*2+2);}
function bracketResult(s,totals){
 const ids=bracketPair(s);if(ids.length!==2||ids.some(id=>!Number.isFinite(totals[id])))throw Error('Invalid match');
 const record={type:'match',round:s.round,ids:[...ids],scores:{...totals}};s.history.push(record);s.revision++;
 if(totals[ids[0]]===totals[ids[1]])return {tie:true};
 const winner=totals[ids[0]]>totals[ids[1]]?ids[0]:ids[1];record.winner=winner;s.winners.push(winner);s.match++;
 if(s.winners.length===s.bracket.length/2){s.bracket=s.winners;s.winners=[];s.match=0;s.round++;if(s.bracket.length===1)s.champion=winner;}
 return {winner,champion:s.champion};
}
function whiteLimit(level,r=Math.random){const range=LIMITS[level];if(!range)throw Error('Invalid difficulty');return range[0]+Math.floor(r()*(range[1]-range[0]+1));}
function whiteResult(s,scores,limit){
 validScores(s.active,scores);const before=[...s.active];s.active=before.filter(id=>scores[id]>=limit);
 s.history.push({round:++s.round,ids:before,scores:{...scores},limit,out:before.filter(id=>!s.active.includes(id))});s.revision++;
 if(!s.active.length)s.whiteWins=true;else if(s.active.length===1)s.champion=s.active[0];
 return {survivors:[...s.active],out:before.filter(id=>!s.active.includes(id)),champion:s.champion,whiteWins:s.whiteWins};
}
function worldActive(s){if(s.phase!=='groups')return [...s.active];const pair=MATCHUPS[s.leg];return s.players.filter(p=>pair.includes(p.group)).map(p=>p.id);}
function ranked(ids,scores){return ids.map(id=>({id,points:scores[id]||0,rank:1+ids.filter(other=>(scores[other]||0)>(scores[id]||0)).length})).sort((a,b)=>b.points-a.points);}
function worldResult(s,scores,{bomb=false}={}){
 if(s.phase==='cutoff')throw Error('Use cutoff result');
 const ids=worldActive(s);validScores(ids,scores);const before=[...s.lit],earned={};
 ranked(ids,scores).forEach(row=>{earned[row.id]=(WORLD_POINTS[row.rank-1]||0)+league.scoreBonus(scores[row.id]);s.scores[row.id]=(s.scores[row.id]||0)+earned[row.id]});
 const record={phase:s.phase,leg:s.leg,game:s.game+1,ids,scores:{...scores},earned,totals:{...s.scores},bomb};s.history.push(record);s.revision++;
 if(s.phase==='groups'){s.game++;if(s.game===3){s.game=0;s.leg++;if(s.leg===6){
 const order=ranked(s.active,s.scores),border=order[19].points,above=order.filter(x=>x.points>border).map(x=>x.id),tied=order.filter(x=>x.points===border).map(x=>x.id);
 if(above.length+tied.length===20)startWorldFinal(s,[...above,...tied]);else{s.phase='cutoff';s.cut={kept:above,slots:20-above.length};s.active=tied;}
 }}return {record,phase:s.phase};}
 const top=Math.max(...Object.values(scores)),leaders=ids.filter(id=>scores[id]===top),contenders=leaders.filter(id=>before.includes(id));
 if(s.phase==='showdown'){if(leaders.length===1)s.champion=leaders[0];else s.active=leaders;return {record,champion:s.champion};}
 s.lit=ids.filter(id=>s.scores[id]>=80);
 const milestone=Math.floor(s.lit.length/5);s.bombQueue+=milestone-s.bombMilestones;s.bombMilestones=milestone;if(bomb)s.bombQueue=Math.max(0,s.bombQueue-1);
 if(contenders.length===1)s.champion=contenders[0];else if(contenders.length>1){s.phase='showdown';s.active=contenders;}
 return {record,champion:s.champion,newLit:s.lit.filter(id=>!before.includes(id))};
}
function startWorldFinal(s,ids){s.finalists=[...ids];s.qualifyingScores={...s.scores};s.active=[...ids];s.scores={};s.phase='final';s.lit=[];s.bombQueue=0;s.bombMilestones=0;}
function cutoffResult(s,scores){
 validScores(s.active,scores);const order=ranked(s.active,scores),border=order[s.cut.slots-1].points,above=order.filter(x=>x.points>border).map(x=>x.id),tied=order.filter(x=>x.points===border).map(x=>x.id);
 s.cut.kept.push(...above);s.cut.slots-=above.length;s.revision++;
 if(tied.length===s.cut.slots)startWorldFinal(s,[...s.cut.kept,...tied]);else s.active=tied;
 return s.phase;
}
const api={WORLD_POINTS,MATCHUPS,LIMITS,entrants,draw,create,bracketPair,bracketResult,whiteLimit,whiteResult,worldActive,worldResult,ranked,cutoffResult};
if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobFestivalRules=api;
})(typeof window!=='undefined'?window:null);
