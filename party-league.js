/* Pure tournament rules. UI and mini-game execution live in party-league-ui.js. */
(function(root){
  'use strict';
  const TAG=['mobSpeedRacer','summonMaster','linkedCartBlast'];
  const DIVISIONS=['PB2リーグ','Realizeリーグ','Portalリーグ','DENDENリーグ'];
  const pick=(a,r)=>a[Math.floor(r()*a.length)];
  function program(pool,random=Math.random){
    if(!pool.length)throw Error('League needs a game pool');
    const any=()=>pick(pool,random);
    return {
      qualifier:['reaction',any(),'minorityMob',pick(['ohajikiMob','toyOnOff'],random),pick(['catcher','plushCatcher'],random),'individualChoice','teamChoice','dontHitMob','deathGameChallenge','amidakujiMob'],
      repechage:[pick(['longJumpMob','bungeeMob','overlap'],random),pick(['cardShop','mobPinball','mobDice'],random),'bowling3DMob'],
      final:['monsterBoxMob','launch','bikeJump','waterSkip','deathGameChallenge','focusBombMob'],pool:[...pool]
    };
  }
  function create(teams,schedule,options={}){
    const mode=options.mode||'tag',size=mode==='crew'?4:mode==='king'?1:2,count=mode==='king'?80:20;
    if(teams.length!==count||new Set(teams.flatMap(t=>t.members)).size!==count*size||teams.some(t=>t.members.length!==size))throw Error(`${count} distinct teams of ${size} required`);
    if(mode==='king'&&DIVISIONS.some((_,i)=>teams.filter(t=>t.division===i).length!==20))throw Error('Four leagues of twenty required');
    return {teams,schedule,mode,size,threshold:size*300,division:0,origins:{},qualifiers:[],phase:'qualifier',round:0,active:teams.filter(t=>mode!=='king'||t.division===0).map(t=>t.id),scores:{},personal:{},lit:[],direct:[],history:[],champion:null,cut:null};
  }
  function ordered(s,ids=s.active,scores=s.scores){return ids.map(id=>({id,points:scores[id]||0})).sort((a,b)=>b.points-a.points);}
  function next(s,random=Math.random){
    if(s.champion)return null;
    const tiePool=s.mode==='tag'?s.schedule.pool:s.schedule.pool.filter(k=>!TAG.includes(k)&&k!=='treasureDuoParty');
    const key=s.phase==='cutoff'?'reaction':s.phase==='championship'?(pick(tiePool,random)||'reaction'):(s.schedule[s.phase][s.round]||pick(s.schedule.pool,random));
    const choices=key==='teamChoice'?['mobDice','slot']:key==='individualChoice'?sample([...s.schedule.pool,'reaction','longJumpMob','brake'].filter(k=>!TAG.includes(k)&&!['deathGameChallenge','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),3,random):null;
    if(choices&&key==='individualChoice'&&s.size===4){const extra=sample(s.schedule.pool.filter(k=>!TAG.includes(k)&&!choices.includes(k)&&!['deathGameChallenge','minorityMob','focusBombMob','individualChoice','teamChoice','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),1,random);choices.push(...extra);}
    return {key,choices,multiplier:s.phase==='qualifier'&&[3,4,6,9].includes(s.round)?2:1,winnerBonus:s.phase==='qualifier'&&s.round===8,phase:s.phase,division:s.division,round:s.round+1,active:[...s.active]};
  }
  function sample(items,count,random=Math.random){const a=[...new Set(items)];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,count);}
  function reset(s,phase,ids){s.phase=phase;s.round=0;s.active=[...ids];s.scores={};s.personal={};}
  function advanceCut(s,ids,stage){
    if(s.mode==='king'){
      const division=s.division,orderedIds=[...ids].sort((a,b)=>(s.scores[b]||0)-(s.scores[a]||0));
      orderedIds.forEach((id,i)=>s.origins[id]={league:DIVISIONS[division],place:1+orderedIds.filter(other=>(s.scores[other]||0)>(s.scores[id]||0)).length});s.qualifiers.push(...orderedIds);
      if(division<3){s.division++;reset(s,'qualifier',s.teams.filter(t=>t.division===s.division).map(t=>t.id));return {type:'divisionQualified',ids:orderedIds,division};}
      reset(s,'final',s.qualifiers);s.lit=[];return {type:'kingFinalists',ids:[...s.qualifiers],qualified:orderedIds,division};
    }
    if(stage==='qualifier'){
      s.direct=[...ids];reset(s,'repechage',s.teams.map(t=>t.id).filter(id=>!ids.includes(id)));
      return {type:'qualified',ids:[...ids]};
    }
    reset(s,'final',[...s.direct,...ids]);s.lit=[];
    return {type:'finalists',ids:[...s.active],wildcards:[...ids]};
  }
  function cut(s,ids,points,slots,kept,stage){
    const rows=ordered(s,ids,points),border=rows[slots-1].points;
    const above=rows.filter(r=>r.points>border).map(r=>r.id),tied=rows.filter(r=>r.points===border).map(r=>r.id);
    const remaining=slots-above.length,secured=[...kept,...above];
    if(tied.length===remaining)return advanceCut(s,[...secured,...tied],stage);
    s.cut={stage,slots:remaining,kept:secured};s.phase='cutoff';s.active=tied;s.round=0;
    return {type:'cutoff',ids:[...tied],slots:remaining,stage};
  }
  function submit(s,points,descriptor){
    if(!descriptor||s.champion||descriptor.phase!==s.phase||descriptor.round!==s.round+1||(s.mode==='king'&&descriptor.division!==s.division))throw Error('Stale league result');
    const round={},individual={};
    const best=descriptor.winnerBonus?Math.max(...s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>Number(points[p])))):null;
    for(const id of s.active){
      const team=s.teams.find(t=>t.id===id);
      round[id]=team.members.reduce((sum,p)=>{const raw=Number(points[p]);if(!Number.isFinite(raw)||raw<0||raw>100)throw Error('Invalid participant score');individual[p]=raw*descriptor.multiplier*(descriptor.winnerBonus&&raw===best?2:1);return sum+individual[p];},0);
    }
    const beforeLit=[...s.lit];
    if(!['cutoff','championship'].includes(s.phase)){
      for(const [id,v] of Object.entries(round))s.scores[id]=(s.scores[id]||0)+v;
      for(const [id,v] of Object.entries(individual))s.personal[id]=(s.personal[id]||0)+v;
    }
    const record={...descriptor,rawPoints:{...points},points:individual,teamPoints:round,totals:{...(['cutoff','championship'].includes(s.phase)?round:s.scores)},personal:{...(['cutoff','championship'].includes(s.phase)?individual:s.personal)},litBefore:beforeLit};s.history.push(record);s.round++;
    let event={type:'round',ids:[]};
    if(s.phase==='qualifier'&&s.round===10)event=cut(s,s.active,s.scores,s.mode==='king'?5:8,[],'qualifier');
    else if(s.phase==='repechage'&&s.round===3)event=cut(s,s.active,s.scores,2,[],'repechage');
    else if(s.phase==='cutoff')event=cut(s,s.active,round,s.cut.slots,s.cut.kept,s.cut.stage);
    else if(s.phase==='final'||s.phase==='championship'){
      // Focus bomb crowns the individual winner's team, even if another pair totals more.
      const best=Math.max(...Object.values(round)),leaders=descriptor.key==='focusBombMob'
        ?s.active.filter(id=>s.teams.find(t=>t.id===id).members.some(p=>points[p]===100))
        :s.active.filter(id=>round[id]===best);
      const contenders=s.phase==='championship'?leaders:leaders.filter(id=>beforeLit.includes(id));
      if(s.phase==='final')s.lit=s.active.filter(id=>(s.scores[id]||0)>=s.threshold);
      if(contenders.length===1){s.champion=contenders[0];event={type:'champion',ids:contenders};}
      else if(contenders.length>1){s.phase='championship';s.active=contenders;s.round=0;event={type:'championship',ids:contenders};}
      else event={type:'round',ids:s.lit.filter(id=>!beforeLit.includes(id))};
    }
    return {event,record};
  }
  const api={TAG,DIVISIONS,program,create,next,ordered,submit,sample};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.MobPartyLeague=api;
})(typeof window!=='undefined'?window:null);
