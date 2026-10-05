(function(root){
  'use strict';
  const RANK_POINTS=[12,8,6,5,4,3,2,1];
  // Audited single-player games. Seconds exclude player-controlled menus/reading.
  // Upper bounds include the common countdown and automatic result transition.
  const ALLOWED=[
    {key:'archeryArcadeMob',play:7,bound:11,source:'party-approved-games.js: archery seconds=7; shared timeout'},
    {key:'juiceArcadeMob',play:8,bound:12,source:'party-approved-games.js: juice seconds=8; release or timeout'},
    {key:'rallyArcadeMob',play:8,bound:12,source:'party-approved-games.js: rally seconds=8; shared timeout'},
    {key:'potteryArcadeMob',play:10,bound:14,source:'party-approved-games.js: lathe_pottery override seconds=10'},
    {key:'firehoseArcadeMob',play:10,bound:14,source:'party-approved-games.js: ballistic_firehose override seconds=10; water exhaustion'},
    {key:'factory',play:10,bound:14,source:'game.js: startFactory endAt=now+10000; recordScreen'},
    {key:'errand',play:10,bound:14,source:'game.js: startErrand endAt=now+10000; recordScreen'},
    {key:'dontHitMob',play:10,bound:14,source:'game.js: startDontHitMob endAt=now+10000; result delay'},
    {key:'jumpingMob',play:10,bound:14,source:'game.js: startJumpingMob endAt=now+10000; 350ms result'},
    {key:'popularGame',play:10,bound:14,source:'game.js: startPopularGame endAt=now+10000; result transition'}
  ];
  const MODES=[{id:'solo40',label:'ソロ40名',size:1,teams:40},{id:'solo80',label:'ソロ80名',size:1,teams:80},{id:'tag20',label:'タッグ20チーム',size:2,teams:20},{id:'tag40',label:'タッグ40チーム',size:2,teams:40},{id:'crew20',label:'Crew20チーム',size:4,teams:20}];
  const bonus=v=>v>=100?10:v>=90?4:v>=85?3:v>=80?2:v>=75?1:0;
  const copy=o=>JSON.parse(JSON.stringify(o));
  function sample(items,n,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n)}
  function count(mode,round){const size=MODES.find(m=>m.id===mode)?.size;if(!size)throw Error('Unknown mode');return size===4?[4,2,1][(round-1)%3]:size===2?(round%3===0?1:2):1}
  function create(mode,teams,players){const spec=MODES.find(m=>m.id===mode);if(!spec||teams.length!==spec.teams||teams.some(t=>t.members.length!==spec.size)||new Set(teams.flatMap(t=>t.members)).size!==spec.teams*spec.size)throw Error('Invalid entrants');return {version:1,mode,teams:copy(teams),players:copy(players),round:0,totals:Object.fromEntries(teams.map(t=>[t.id,0])),lit:[],pending:null,last:null,champion:null,overtime:null,phase:'draw'};}
  function prepare(s,random=Math.random){if(s.champion)return null;if(s.pending)return s.pending;const pool=ALLOWED.filter(g=>g.bound<15);if(pool.length<5)throw Error('Insufficient audited candidates');const choices=sample(pool.map(g=>g.key),5,random),key=choices[Math.min(4,Math.floor(random()*5))];s.pending={id:s.round+1,choices,key,litBefore:[...s.lit],active:[...(s.overtime||s.teams.map(t=>t.id))],count:count(s.mode,s.round+1),representatives:{},points:{},completed:[],overtime:!!s.overtime};return s.pending;}
  function submit(s,id,points){const p=s.pending;if(!p||p.id!==id||s.champion)throw Error('Round already submitted');const rows=p.active.map(teamId=>{const team=s.teams.find(t=>t.id===teamId),ids=p.representatives[teamId];if(!ids||ids.length!==p.count||new Set(ids).size!==ids.length||ids.some(id=>!team.members.includes(id)))throw Error('Invalid representatives');const members=ids.map(id=>{const raw=points[id];if(!Number.isFinite(raw)||raw<0||raw>100)throw Error('Invalid base score');return{id,raw,bonus:bonus(raw)}});return{id:teamId,members,base:members.reduce((n,m)=>n+m.raw,0)}}).sort((a,b)=>b.base-a.base);
    rows.forEach(row=>{row.rank=1+rows.filter(r=>r.base>row.base).length;row.rankPoints=RANK_POINTS[row.rank-1]||0;row.bonus=row.members.reduce((n,m)=>n+m.bonus,0);row.earned=p.overtime?0:row.rankPoints+row.bonus;if(!p.overtime)s.totals[row.id]+=row.earned;row.total=s.totals[row.id];row.wasLit=p.litBefore.includes(row.id)});
    const contenders=rows.filter(r=>r.rank===1&&(p.overtime||r.wasLit)).map(r=>r.id);s.lit=s.teams.filter(t=>s.totals[t.id]>=50).map(t=>t.id);const newlyLit=s.lit.filter(id=>!p.litBefore.includes(id));
    if(contenders.length===1){s.champion=contenders[0];s.overtime=null;s.phase='champion'}else if(contenders.length>1){s.overtime=contenders;s.phase='result'}else{s.overtime=null;s.phase='result'}
    s.round=p.id;s.last={id:p.id,key:p.key,rows,newlyLit,overtime:p.overtime,champion:s.champion,tiedContenders:s.overtime};s.pending=null;return s.last;
  }
  function restore(raw){const s=copy(raw);if(s.version!==1)throw Error('Unknown save');create(s.mode,s.teams,s.players);if(!Number.isInteger(s.round)||s.round<0||s.teams.some(t=>!Number.isFinite(s.totals[t.id])||s.totals[t.id]<0))throw Error('Invalid save');const ids=new Set(s.teams.map(t=>t.id)),members=s.teams.flatMap(t=>t.members);if(s.players.length!==members.length||new Set(s.players.map(p=>p.id)).size!==members.length||members.some(id=>!s.players.some(p=>p.id===id)))throw Error('Invalid players');if(s.pending){const p=s.pending;if(p.id!==s.round+1||p.count!==count(s.mode,p.id)||p.choices.length!==5||new Set(p.choices).size!==5||p.choices.some(k=>!ALLOWED.some(g=>g.key===k))||!p.choices.includes(p.key)||p.active.some(id=>!ids.has(id)))throw Error('Invalid pending round');}return s;}
  const api={RANK_POINTS,ALLOWED,MODES,bonus,sample,count,create,prepare,submit,restore};if(typeof module!=='undefined')module.exports=api;if(root)root.MobArenaRules=api;
})(typeof window==='undefined'?null:window);
