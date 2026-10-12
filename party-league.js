/* Pure tournament rules. UI and mini-game execution live in party-league-ui.js. */
(function(root){
  'use strict';
  const draws=typeof module!=='undefined'&&module.exports?require('./party-random-games.js'):root.MobRandomGames;
  const doctor=typeof module!=='undefined'&&module.exports?require('./party-doctor-game.js'):root.MobDoctorGame;
  const TAG=['mobSpeedRacer','summonMaster','linkedCartBlast'];
  const DIVISIONS=['PB2リーグ','Realizeリーグ','Portalリーグ','DENDENリーグ'];
  const pick=(a,r)=>a[Math.floor(r()*a.length)];
  const CARRYOVER=[50,25,18,15,12,10,8,5];
  const PAIR_ROULETTE=draws.ALLOWED.map(g=>g.key);
  const CATCHERS=['catcher','plushCatcher','tokotokoCatcher','craneGame3DMob'];
  const TAG_ROULETTE=[...PAIR_ROULETTE];
  const TAG_TEAM_CHOICES=['cardShop','mobPinball','mobDice','zeroOrHundredMob'];
  const TAG_TENTH_CHOICES=['ohajikiMob','brake','mobIssen','mob50m','fruitCatchMob','findMob','lockArcadeMob','dockingArcadeMob'];
  const TAG_EIGHTH_CHOICES=['warpedWallMob','santaClausMob','monsterBoxMob'];
  function program(pool,random=Math.random,mode='tag'){
    if(!pool.length)throw Error('League needs a game pool');
    return {profile:mode==='tag'?'tag':mode,drawVersion:2,
      qualifier:mode==='tag'?['randomChoice','pairedChoice','minorityMob','randomChoice','randomChoice','individualChoice','teamChoice','individualChoice','deathGameChallenge','tripleChoice']:['reaction','randomChoice','minorityMob','randomChoice','randomChoice','individualChoice','teamChoice','dontHitMob','deathGameChallenge','amidakujiMob'],
      repechage:['randomChoice','randomChoice','bowling3DMob'],
      final:mode==='tag'?['randomChoice','randomChoice','bikeJump','randomChoice','focusBombMob','deathGameChallenge']:['monsterBoxMob','launch','bikeJump','waterSkip','focusBombMob','deathGameChallenge'],pool:pool.filter(k=>k!=='popularGame')};
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
    const tag=s.mode==='tag'&&s.schedule.profile==='tag';
    const slot=s.phase+':'+s.division+':'+s.round+':'+s.history.length;
    const scheduled=tag&&s.phase==='qualifier'&&s.round===9?'tripleChoice':s.schedule[s.phase]?.[s.round];
    const legacyRandom=!s.schedule.drawVersion&&((s.phase==='qualifier'&&[0,3,4].includes(s.round))||(s.phase==='repechage'&&s.round<2)||(tag&&s.phase==='final'&&[0,1,3].includes(s.round)));
    const randomRound=legacyRandom||['randomChoice','rouletteChoice','popularGame','pairedChoice'].includes(scheduled)||s.phase==='championship'||(!scheduled&&s.phase!=='cutoff');
    let draw=null,key=s.phase==='cutoff'?'reaction':scheduled;
    if(randomRound){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]=draws.draw(scheduled==='pairedChoice'?2:1,random));key=scheduled==='pairedChoice'?'pairedChoice':draw.selected[0];if(key==='pairedChoice')s.schedule.pairGames=[...draw.selected];}
    if(scheduled==='tripleChoice'){s.draws=s.draws||{};draw=s.draws[slot]||(s.draws[slot]={choices:[...TAG_TENTH_CHOICES],selected:sample(TAG_TENTH_CHOICES,3,random)});key='tripleChoice';}
    const choices=key==='tripleChoice'?[...draw.selected]:key==='pairedChoice'?[...s.schedule.pairGames]:key==='teamChoice'?(tag?[...TAG_TEAM_CHOICES]:['mobDice','slot']):key==='individualChoice'?(tag&&s.round===7?[...TAG_EIGHTH_CHOICES]:sample([...s.schedule.pool,'reaction','longJumpMob','brake'].filter(k=>!TAG.includes(k)&&!['deathGameChallenge','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),3,random)):null;
    if(choices&&key==='individualChoice'&&s.size===4){const extra=sample(s.schedule.pool.filter(k=>!TAG.includes(k)&&!choices.includes(k)&&!['deathGameChallenge','minorityMob','focusBombMob','individualChoice','teamChoice','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty'].includes(k)),1,random);choices.push(...extra);}
    return {key,choices,representative:tag&&s.phase==='qualifier'&&s.round===4,roulette:draw?[...draw.choices]:null,multiplier:s.phase==='qualifier'&&[3,4,6,9].includes(s.round)?2:1,winnerBonus:s.phase==='qualifier'&&s.round===8,phase:s.phase,division:s.division,round:s.round+1,active:[...s.active]};
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
      ids.forEach((id,i)=>points[id]+=scores[i]);
    }return points;
  }
  function awardRounds(history){return history.flatMap(r=>r.key!=='tripleChoice'||!r.assignments||!r.gameScores?[r]:r.choices.map((key,i)=>{
    const rawPoints={},points={};for(const [team,ids] of Object.entries(r.assignments)){const id=ids[i],raw=r.gameScores[team][i];rawPoints[id]=raw;points[id]=raw*r.multiplier;}
    return {...r,key,rawPoints,points,selections:null,choiceRound:true};
  }));}
  function submit(s,points,descriptor){
    if(!descriptor||s.champion||descriptor.phase!==s.phase||descriptor.round!==s.round+1||(s.mode==='king'&&descriptor.division!==s.division))throw Error('Stale league result');
    const triple=descriptor.key==='tripleChoice';
    if(triple){if(s.mode!=='tag'||s.phase!=='qualifier'||s.round!==9)throw Error('Invalid triple round');const expected=triplePoints(s.active.map(id=>s.teams.find(t=>t.id===id)),descriptor.choices,descriptor.assignments,descriptor.gameScores);if(Object.keys(expected).some(id=>points[id]!==expected[id]))throw Error('Triple totals do not match games');}
    const round={},individual={};
    const best=descriptor.winnerBonus?Math.max(...s.active.flatMap(id=>s.teams.find(t=>t.id===id).members.map(p=>Number(points[p])))):null;
    for(const id of s.active){
      const team=s.teams.find(t=>t.id===id);
      round[id]=team.members.reduce((sum,p)=>{const raw=Number(points[p]);if(!Number.isFinite(raw)||raw<0||raw>(triple?300:100))throw Error('Invalid participant score');individual[p]=raw*descriptor.multiplier*(descriptor.winnerBonus&&raw===best?2:1);return sum+individual[p];},0);
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
        const heats=Array.from({length:5},()=>[]),order=sample(teams,teams.length,random);
        order.forEach((t,i)=>sample(t.members,t.members.length,random).forEach((id,j)=>heats[(i+j*2)%5].push(id)));
        const winners=heats.map(ids=>sample(ids,ids.length,random).sort((a,b)=>points[b]-points[a])[0]);
        const ranked=sample(winners,5,random).sort((a,b)=>points[b]-points[a]);
        Object.keys(points).forEach(id=>points[id]=0);ranked.forEach((id,i)=>points[id]=[100,80,60,50,40][i]);
      }
      if(TAG.includes(d.key)||d.key==='treasureDuoParty'){
        const order=sample(teams,teams.length,random);for(let i=0;i<order.length;i+=2)for(let leg=0;leg<s.size;leg+=2){const pair=order.slice(i,i+2),averages=pair.map(t=>t.members.slice(leg,leg+2).reduce((n,id)=>n+points[id],0)/2);pair.forEach((t,j)=>{const shared=d.key==='summonMaster'?(j===(averages[0]>=averages[1]?0:1)?100:0):Math.round(averages[j]);t.members.slice(leg,leg+2).forEach(id=>points[id]=shared);});}
      }
      result=submit(s,points,{...d,...(d.key==='tripleChoice'?{assignments,gameScores}:{}),...(d.choices?{selections}:{}),...(d.representative?{representatives}:{})});if(d.phase===phase)lastStage=result.record;
    }while(finalStage?!s.champion:(s.phase==='cutoff'||s.phase===phase&&s.division===division));
    return {event:result.event,record:{...lastStage,active,summary:true,simulatedRounds:rounds}};
  }
  const api={TAG_TENTH_CHOICES,triplePoints,awardRounds,CARRYOVER,PAIR_ROULETTE,CATCHERS,TAG,DIVISIONS,program,create,next,ordered,submit,sample,canFastForward,fastForward};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.MobPartyLeague=api;
})(typeof window!=='undefined'?window:null);
