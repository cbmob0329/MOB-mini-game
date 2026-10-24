/* Pure tournament rules. UI and mini-game execution live in party-league-ui.js. */
(function(root){
  'use strict';
  const draws=typeof module!=='undefined'&&module.exports?require('./party-random-games.js'):root.MobRandomGames;
  const doctor=typeof module!=='undefined'&&module.exports?require('./party-doctor-game.js'):root.MobDoctorGame;
  const TAG=['mobSpeedRacer','summonMaster'];
  const DIVISIONS=['PB2リーグ','Realizeリーグ','Portalリーグ','DENDENリーグ'];
  const pick=(a,r)=>a[Math.floor(r()*a.length)];
  const CARRYOVER=[100,75,50,30,25,20,15,10,...Array(10).fill(5)];
  const RANK_POINTS=[12,8,6,5,4,3,2,1];
  const scoreBonus=v=>Math.floor(v/100)*10+((v%100)>=90?7:(v%100)>=80?5:(v%100)>=70?4:(v%100)>=60?3:(v%100)>=50?2:(v%100)>=40?1:0);
  const PAIR_ROULETTE=draws.ALLOWED.map(g=>g.key);
  const CATCHERS=['catcher','plushCatcher'];
  const TAG_ROULETTE=[...PAIR_ROULETTE];
  const TAG_TEAM_CHOICES=['cardShop','mobPinball','mobDice','zeroOrHundredMob'];
  const TAG_TENTH_CHOICES=['ohajikiMob','brake','errand','mob50m','juiceArcadeMob','lockArcadeMob','dockingArcadeMob','waterSkip','cleaningMob'];
  const TAG_EIGHTH_CHOICES=['warpedWallMob','santaClausMob','monsterBoxMob','ropeSwingMob','mobIssen'];
  function program(pool,random=Math.random,mode='tag'){
    if(!pool.length)throw Error('League needs a game pool');
    return {profile:mode==='tag'?'tag':mode,drawVersion:2,
      qualifier:mode==='tag'?['randomChoice','pairedChoice','minorityMob','randomChoice','randomChoice','individualChoice','teamChoice','individualChoice','deathGameChallenge','tripleChoice']:['reaction','randomChoice','minorityMob','randomChoice','randomChoice','individualChoice','teamChoice','dontHitMob','deathGameChallenge','amidakujiMob'],
      repechage:['randomChoice','randomChoice','bowling3DMob'],
      final:mode==='tag'?['randomChoice','randomChoice','randomChoice','randomChoice','focusBombMob','deathGameChallenge']:['monsterBoxMob','launch','bikeJump','waterSkip','focusBombMob','deathGameChallenge'],pool:pool.filter(k=>k!=='popularGame'&&!draws.RETIRED.includes(k))};
  }
  function create(teams,schedule,options={}){
    const mode=options.mode||'tag',size=mode==='crew'?4:mode==='king'?1:2,count=mode==='king'?80:mode==='tag'&&teams.length===30?30:20;
    if(teams.length!==count||new Set(teams.flatMap(t=>t.members)).size!==count*size||teams.some(t=>t.members.length!==size))throw Error(`${count} distinct teams of ${size} required`);
    if(options.scoring==='rank'&&(mode!=='tag'||count!==20))throw Error('Rank mode requires twenty tag teams');
    if(mode==='king'&&DIVISIONS.some((_,i)=>teams.filter(t=>t.division===i).length!==20))throw Error('Four leagues of twenty required');
    return {teams,schedule,mode,size,directSlots:mode==='tag'&&count===30?18:8,scoring:options.scoring==='rank'?'rank':'raw',bombMilestones:0,bombQueue:0,threshold:options.scoring==='rank'?80:size*300,division:0,origins:{},qualifiers:[],phase:options.scoring==='rank'?'final':'qualifier',round:0,active:teams.filter(t=>mode!=='king'||t.division===0).map(t=>t.id),scores:{},personal:{},lit:[],direct:[],history:[],champion:null,cut:null};
  }
  function ordered(s,ids=s.active,scores=s.scores){return ids.map(id=>({id,points:scores[id]||0})).sort((a,b)=>b.points-a.points);}
  function next(s,random=Math.random){
    if(s.champion)return null;
    s.schedule.pool=s.schedule.pool.filter(k=>!draws.RETIRED.includes(k));
    for(const [slot,draw] of Object.entries(s.draws||{}))if(draw.choices.some(k=>draws.RETIRED.includes(k)))delete s.draws[slot];
    const tag=s.mode==='tag'&&s.schedule.profile==='tag';
    const slot=s.phase+':'+s.division+':'+s.round+':'+s.history.length;
    const qualifierRound=s.phase==='qualifier'||s.scoring==='rank'&&s.phase==='final'&&s.round<10;
    const forcedBomb=s.phase==='final'&&(s.bombQueue||0)>0;
    let scheduled=forcedBomb?'focusBombMob':tag&&qualifierRound&&s.round===9?'tripleChoice':s.scoring==='rank'&&s.phase==='final'?(s.round<10?s.schedule.qualifier[s.round]:s.round<13?s.schedule.repechage[s.round-10]:s.schedule.final[s.round-13]||'randomChoice'):s.schedule[s.phase]?.[s.round];
    if(tag&&qualifierRound&&scheduled==='teamChoice')scheduled='teamRoulette';
    const legacyRandom=!s.schedule.drawVersion&&((s.phase==='qualifier'&&[0,3,4].includes(s.round))||(s.phase==='repechage'&&s.round<2)||(tag&&s.phase==='final'&&[0,1,3].includes(s.round)));
    const randomRound=legacyRandom||['randomChoice','rouletteChoice','popularGame','pairedChoice'].includes(scheduled)||s.phase==='championship'||(!scheduled&&s.phase!=='cutoff');
    let draw=null,key=s.phase==='cutoff'?'reaction':scheduled;
    if(randomRound){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]=draws.draw(scheduled==='pairedChoice'?2:1,random));key=scheduled==='pairedChoice'?'pairedChoice':draw.selected[0];if(key==='pairedChoice')s.schedule.pairGames=[...draw.selected];}
    if(scheduled==='teamRoulette'){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]={choices:[...TAG_TEAM_CHOICES],selected:[pick(TAG_TEAM_CHOICES,random)]});key=draw.selected[0];}
    if(!forcedBomb&&tag&&qualifierRound&&s.round===7){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]={choices:[...TAG_EIGHTH_CHOICES],selected:sample(TAG_EIGHTH_CHOICES,2,random)});}
    if(scheduled==='tripleChoice'){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]={choices:[...TAG_TENTH_CHOICES],selected:sample(TAG_TENTH_CHOICES,3,random)});key='tripleChoice';}
    const choices=key==='tripleChoice'?[...draw.selected]:key==='pairedChoice'?[...s.schedule.pairGames]:key==='teamChoice'?(tag?[...TAG_TEAM_CHOICES]:['mobDice','slot']):key==='individualChoice'?(tag&&s.round===7?[...draw.selected]:sample([...s.schedule.pool,'reaction','longJumpMob','brake'].filter(k=>!TAG.includes(k)&&!['deathGameChallenge','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),3,random)):null;
    if(choices&&key==='individualChoice'&&s.size===4){const extra=sample(s.schedule.pool.filter(k=>!TAG.includes(k)&&!choices.includes(k)&&!['deathGameChallenge','minorityMob','focusBombMob','individualChoice','teamChoice','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),1,random);choices.push(...extra);}
    return {key,choices,forcedBomb,sequence:s.history.length,stageLabel:s.scoring==='rank'?(s.round<10?'予選種目':s.round<13?'敗者復活種目':'決勝種目'):null,representative:!forcedBomb&&tag&&qualifierRound&&s.round===4,roulette:draw?[...draw.choices]:null,multiplier:!forcedBomb&&qualifierRound&&(s.scoring==='rank'?s.round===9:[3,4,6,9].includes(s.round))?2:1,winnerBonus:s.scoring!=='rank'&&!forcedBomb&&qualifierRound&&s.round===8,phase:s.phase,division:s.division,round:s.round+1,active:[...s.active]};
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
      if(s.mode==='tag'){s.qualifierTotals={...s.scores};s.qualifierPlaces=Object.fromEntries(ids.map(id=>[id,1+Object.values(s.qualifierTotals).filter(v=>v>(s.qualifierTotals[id]||0)).length]));s.finalCarryover=Object.fromEntries(ids.map(id=>[id,CARRYOVER[s.qualifierPlaces[id]-1]||0]));}
      s.direct=[...ids];reset(s,'repechage',s.teams.map(t=>t.id).filter(id=>!ids.includes(id)));
      return {type:'qualified',ids:[...ids]};
    }
    reset(s,'final',[...s.direct,...ids]);if(s.mode==='tag')s.scores={...(s.finalCarryover||{})};s.lit=[];
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
  function triplePoints(teams,choices,assignments,gameScores){
    if(!Array.isArray(choices)||choices.length!==3||new Set(choices).size!==3||choices.some(k=>!TAG_TENTH_CHOICES.includes(k)))throw Error('Invalid triple games');
    const points={};for(const t of teams){t.members.forEach(id=>points[id]=0);const ids=assignments?.[t.id],scores=gameScores?.[t.id];
      if(!Array.isArray(ids)||ids.length!==3||ids.some(id=>!t.members.includes(id))||!Array.isArray(scores)||scores.length!==3||scores.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>100))throw Error('Invalid triple assignment or score');
      ids.forEach((id,i)=>points[id]+=scores[i]*(i===2?1.5:1));
    }return points;
  }
  function awardRounds(history){return history.flatMap(r=>r.key!=='tripleChoice'||!r.assignments||!r.gameScores?[r]:r.choices.map((key,i)=>{
    const rawPoints={},points={};for(const [team,ids] of Object.entries(r.assignments)){const id=ids[i],raw=r.gameScores[team][i];rawPoints[id]=raw;points[id]=raw*r.multiplier*(i===2?1.5:1);}
    return {...r,key,rawPoints,points,selections:null,choiceRound:true};
  }));}
  function submit(s,points,descriptor){
    if(!descriptor||descriptor.sequence!=null&&descriptor.sequence!==s.history.length||s.champion||descriptor.phase!==s.phase||descriptor.round!==s.round+1||(s.mode==='king'&&descriptor.division!==s.division))throw Error('Stale league result');
    const triple=descriptor.key==='tripleChoice';
    if(triple){if(s.mode!=='tag'||!(s.phase==='qualifier'||s.scoring==='rank'&&s.phase==='final')||s.round!==9)throw Error('Invalid triple round');const expected=triplePoints(s.active.map(id=>s.teams.find(t=>t.id===id)),descriptor.choices,descriptor.assignments,descriptor.gameScores);if(Object.keys(expected).some(id=>points[id]!==expected[id]))throw Error('Triple totals do not match games');}
    const round={},individual={};
    const best=descriptor.winnerBonus?Math.max(...s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>Number(points[p])))):null;
    for(const id of s.active){
      const team=s.teams.find(t=>t.id===id);
      round[id]=team.members.reduce((sum,p)=>{const raw=Number(points[p]);if(!Number.isFinite(raw)||raw<0||raw>(triple?350:100))throw Error('Invalid participant score');individual[p]=raw*descriptor.multiplier*(descriptor.winnerBonus&&raw===best?2:1);return sum+individual[p];},0);
    }
    const beforeLit=[...s.lit],earned={...round},rankDetails={};
    if(s.scoring==='rank'){for(const id of s.active){const rank=1+Object.values(round).filter(v=>v>round[id]).length,rankPoints=RANK_POINTS[rank-1]||0,bonus=s.teams.find(t=>t.id===id).members.reduce((n,p)=>n+scoreBonus(individual[p]),0);earned[id]=rankPoints+bonus;rankDetails[id]={rank,rankPoints,bonus,earned:earned[id]};}}
    if(!['cutoff','championship'].includes(s.phase)){
      for(const [id,v] of Object.entries(earned))s.scores[id]=(s.scores[id]||0)+v;
      for(const [id,v] of Object.entries(individual))s.personal[id]=(s.personal[id]||0)+v;
    }
    const record={...descriptor,rawPoints:{...points},points:individual,teamPoints:round,earned,rankDetails,totals:{...(['cutoff','championship'].includes(s.phase)?round:s.scores)},personal:{...(['cutoff','championship'].includes(s.phase)?individual:s.personal)},litBefore:beforeLit};s.history.push(record);if(descriptor.forcedBomb)s.bombQueue=Math.max(0,s.bombQueue-1);else s.round++;
    let event={type:'round',ids:[]};
    if(s.phase==='qualifier'&&s.round===10)event=cut(s,s.active,s.scores,s.mode==='king'?5:(s.directSlots||8),[],'qualifier');
    else if(s.phase==='repechage'&&s.round===3)event=cut(s,s.active,s.scores,2,[],'repechage');
    else if(s.phase==='cutoff')event=cut(s,s.active,round,s.cut.slots,s.cut.kept,s.cut.stage);
    else if(s.phase==='final'||s.phase==='championship'){
      // Focus bomb crowns the individual winner's team, even if another pair totals more.
      const best=Math.max(...Object.values(round)),leaders=descriptor.key==='focusBombMob'
        ?s.active.filter(id=>s.teams.find(t=>t.id===id).members.some(p=>points[p]===100))
        :s.active.filter(id=>round[id]===best);
      const contenders=s.phase==='championship'?leaders:leaders.filter(id=>beforeLit.includes(id));
      if(s.phase==='final'){s.lit=s.active.filter(id=>(s.scores[id]||0)>=s.threshold);if(s.scoring==='rank'){const milestone=Math.floor(s.lit.length/5),previous=s.bombMilestones||0;s.bombQueue=(s.bombQueue||0)+Math.max(0,milestone-previous);s.bombMilestones=milestone;}}
      if(contenders.length===1){s.champion=contenders[0];event={type:'champion',ids:contenders};}
      else if(contenders.length>1){s.phase='championship';s.active=contenders;s.round=0;event={type:'championship',ids:contenders};}
      else event={type:'round',ids:s.lit.filter(id=>!beforeLit.includes(id))};
    }
    return {event,record};
  }
  function canFastForward(s,players){return !s.champion&&['qualifier','repechage','final','championship'].includes(s.phase)&&s.active.every(id=>s.teams.find(t=>t.id===id).members.every(id=>players.find(p=>p.id===id)?.cpu));}
  function fastForward(s,players,score,random=Math.random,representativeKeys=new Set()){
    if(!canFastForward(s,players))throw Error('Only a CPU-only active stage can be summarized');
    const phase=s.phase,division=s.division,finalStage=['final','championship'].includes(phase),active=[...s.active];let result,lastStage,rounds=0;
    do{
      if(++rounds>200)throw Error('CPU stage did not resolve');
      const d=next(s,random),points={},selections={},representatives={},assignments={},gameScores={},teams=d.active.map(id=>s.teams.find(t=>t.id===id));
      if(d.key==='tripleChoice'){
        for(const t of teams){assignments[t.id]=d.choices.map(()=>pick(t.members,random));gameScores[t.id]=d.choices.map((key,i)=>score(key,players.find(p=>p.id===assignments[t.id][i]),random));}
        Object.assign(points,triplePoints(teams,d.choices,assignments,gameScores));
      }else for(const t of teams){const used=[];for(const [i,id] of t.members.entries()){
        let key=d.key;if(d.choices){const options=d.choices.filter(k=>!['individualChoice','pairedChoice'].includes(d.key)||!used.includes(k));key=d.key==='teamChoice'&&i?selections[t.members[0]]:pick(options.length?options:d.choices,random);used.push(key);selections[id]=key;}
        const selected=d.representative?i===(d.round-1)%t.members.length:t.members.length<=2||[0,1].some(j=>(d.round-1+j)%t.members.length===i);
        if(d.representative&&selected)representatives[t.id]=id;points[id]=(d.representative||representativeKeys.has(key))&&!selected?0:score(key,players.find(p=>p.id===id),random);
      }}
      if(d.key==='minorityMob')Object.assign(points,doctor.simulate(teams,random));
      if(d.key==='deathGameChallenge'){
        let alive=sample(teams.flatMap(t=>t.members.length>2?[0,1].map(i=>t.members[(d.round-1+i)%t.members.length]):t.members),999,random);Object.keys(points).forEach(id=>points[id]=0);
        while(alive.length>1){const before=alive.length,target=[30,15,5,3,1].find(n=>n<before)||1;alive.splice(0,before-target).forEach(id=>points[id]=before===2?70:target>=30?10:target>=15?30:target>=5?50:target>=3?65:80);}points[alive[0]]=100;
      }
      if(d.key==='focusBombMob'){
        const events=typeof module!=='undefined'&&module.exports?require('./party-league-events.js'):root.MobLeagueEvents;
        const cast=teams.flatMap(t=>t.members.map(id=>players.find(p=>p.id===id)));
        Object.assign(points,events.simulateBomb(cast,p=>score('focusBombMob',p,random),random));
      }
      if(TAG.includes(d.key)||d.key==='treasureDuoParty'){
        const order=sample(teams,teams.length,random);for(let i=0;i<order.length;i+=2)for(let leg=0;leg<s.size;leg+=2){const pair=order.slice(i,i+2),averages=pair.map(t=>t.members.slice(leg,leg+2).reduce((n,id)=>n+points[id],0)/2);pair.forEach((t,j)=>{const shared=d.key==='summonMaster'?(j===(averages[0]>=averages[1]?0:1)?100:0):Math.round(averages[j]);t.members.slice(leg,leg+2).forEach(id=>points[id]=shared);});}
      }
      result=submit(s,points,{...d,...(d.key==='tripleChoice'?{assignments,gameScores}:{}),...(d.choices?{selections}:{}),...(d.representative?{representatives}:{})});if(d.phase===phase)lastStage=result.record;
    }while(finalStage?!s.champion:(s.phase==='cutoff'||s.phase===phase&&s.division===division));
    return {event:result.event,record:{...lastStage,active,summary:true,simulatedRounds:rounds}};
  }
  const api={RANK_POINTS,scoreBonus,TAG_TENTH_CHOICES,triplePoints,awardRounds,CARRYOVER,PAIR_ROULETTE,CATCHERS,TAG,DIVISIONS,program,create,next,ordered,submit,sample,canFastForward,fastForward};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.MobPartyLeague=api;
})(typeof window!=='undefined'?window:null);
