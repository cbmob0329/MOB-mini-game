(()=>{
  'use strict';
  const rules=window.MobPartyLeague,core=window.MobPartyCore;
  window.MobPartyLeagueUI={create(api){
    const {screen,esc}=api;let league=null,players=[],ticket=0,count=1,selections=[];
    const labels={qualifier:'予選',repechage:'敗者復活3ゲームマッチ',final:'決勝',cutoff:'通過決定・延長戦',championship:'優勝決定戦'};
    const gameTitle=key=>key==='individualChoice'?'3種目から選ぶ個人チャレンジ':key==='teamChoice'?'サイコロ or スロット · タッグ選択':api.title(key);
    const on=(id,fn)=>{const button=screen.querySelector('#'+id);let used=false;button.onclick=()=>{if(used)return;used=true;button.disabled=true;fn();};};
    const picture=p=>`<img src="${p.img}" alt="${esc(p.name)}">`;
    const team=id=>league.teams.find(t=>t.id===id);
    const member=id=>players.find(p=>p.id===id);
    const portraits=id=>team(id).members.map(p=>picture(member(p))).join('');
    function draw(title,body){api.clear();screen.innerHTML=`<section class="tag-league"><header><small>TAG BATTLE LEAGUE · 20 TEAMS</small><h1>${title}</h1></header>${body}</section>`;api.top();}
    function stop(){ticket++;league=null;}
    function setup(){stop();count=1;selections=[];draw('タッグバトルリーグ',`<p>20チーム・40名。予選10ゲーム → 敗者復活3ゲーム → 決勝！</p><p>決勝は600点で点灯。その次のゲーム以降に1位を取れば優勝です。10ゲームを超えても決着まで続きます。</p><label>参加するプレイヤー数<select id="leagueCount">${Array.from({length:9},(_,i)=>`<option value="${i}" ${i===1?'selected':''}>${i}人${i===0?'（CPU観戦）':''}</option>`).join('')}</select></label><button id="leagueSelect" class="primary">キャラクター・タッグを決める</button><button id="leagueBack" class="secondary">戻る</button>`);on('leagueSelect',()=>{count=Number(screen.querySelector('#leagueCount').value);choosePlayers();});on('leagueBack',api.home);}
    function choosePlayers(){
      selections=Array.from({length:count},(_,i)=>selections[i]||{character:core.roster[i].id,team:Math.floor(i/2)});
      draw('自由にタッグを組もう',`<p>同じチーム番号を選んだ2人がタッグになります。空いた枠にはCPUが入ります。各チーム2名まで。</p><div class="league-setup">${selections.map((s,i)=>`<section><h2>P${i+1}</h2><label>キャラクター<select data-char="${i}">${core.roster.map(c=>`<option value="${c.id}" ${c.id===s.character?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label><label>所属チーム<select data-team="${i}">${Array.from({length:20},(_,t)=>`<option value="${t}" ${t===s.team?'selected':''}>TEAM ${t+1}</option>`).join('')}</select></label></section>`).join('')}</div><p id="leagueSetupError" role="alert"></p><p>CPUの外見は一部重複しますが、全40名が独立した選手です。</p><button id="leagueStart" class="primary">このタッグで大会へ</button><button id="leagueBack" class="secondary">人数を変更</button>`);
      screen.querySelectorAll('[data-char]').forEach(el=>el.onchange=()=>selections[Number(el.dataset.char)].character=Number(el.value));
      screen.querySelectorAll('[data-team]').forEach(el=>el.onchange=()=>selections[Number(el.dataset.team)].team=Number(el.value));
      on('leagueBack',setup);on('leagueStart',()=>{
        if(new Set(selections.map(s=>s.character)).size!==count){screen.querySelector('#leagueSetupError').textContent='プレイヤーのキャラクターは重複せず選んでください。';return;}
        if(selections.some(s=>selections.filter(x=>x.team===s.team).length>2)){screen.querySelector('#leagueSetupError').textContent='1チームは2名までです。所属チームを変更してください。';return;}
        begin();
      });
    }
    function begin(){
      ticket++;players=[];const teams=Array.from({length:20},(_,i)=>({id:'L'+i,name:`TEAM ${i+1}`,members:[]}));
      selections.forEach((s,i)=>{const c=core.roster.find(c=>c.id===s.character),p={id:'p'+(i+1),no:i+1,name:c.name,img:c.img,cpu:false,characterRank:c.rank};players.push(p);teams[s.team].members.push(p.id);});
      const pairs=core.leagueCpuPairs(teams.map(t=>t.members.map(id=>core.roster.find(c=>c.img===players.find(p=>p.id===id).img))));let n=0;
      for(const [i,t] of teams.entries())while(t.members.length<2){const c=pairs[i][t.members.length],p={id:'leagueCpu'+n,no:n+1,name:c.name,img:c.img,cpu:true,characterRank:c.rank};players.push(p);t.members.push(p.id);n++;}
      api.configure(players,teams);league=rules.create(teams,rules.program(api.pool()));
      announce('20組のタッグ、開幕！','予選の上位8組が決勝直行。4・5・7・10戦目はポイント2倍！ 6戦目は個人で種目選択、9戦目はデスゲームの1位だけ2倍！ 残る12組にも敗者復活のチャンスがあります。',teams.map(t=>t.id),play,'opening');
    }
    function cards(ids){return `<div class="league-team-grid">${ids.map(id=>`<div class="league-team-card ${league.lit.includes(id)?'league-lit':''}">${league.lit.includes(id)?'<span class="league-lit-label">● 点灯 · 1位で優勝</span>':''}${portraits(id)}<b>${team(id).name}</b><small>${team(id).members.map(p=>`${member(p).cpu?'CPU':'P'+member(p).no} ${esc(member(p).name)}`).join(' / ')}</small></div>`).join('')}</div>`;}
    function announce(title,text,ids,done,kind='broadcast'){
      let page=0;const size=kind==='versus'||(window.visualViewport?.height||window.innerHeight||600)<520?2:4,pages=Math.max(1,Math.ceil(ids.length/size));
      const show=()=>{draw(title,`<div class="league-show-body"><div class="league-narrator"><span>LIVE COMMENTARY</span><p>${text}</p></div>${kind==='versus'?'<strong class="league-vs">VS</strong>':''}${cards(ids.slice(page*size,(page+1)*size))}</div><button id="leagueNext" class="primary">${pages>1?`${page+1} / ${pages} · `:''}${page+1<pages?'次のチーム →':'タップして進む →'}</button>`);const panel=screen.querySelector('.tag-league');panel.classList.add('league-show','league-'+kind);panel.style.setProperty('--league-top',Math.max(0,screen.getBoundingClientRect().top+(window.scrollY||0))+'px');api.beep(kind==='ignition'?1250:950,160,.025);on('leagueNext',()=>{if(++page<pages)show();else done();});};show();
    }
    function reveal(ids,title,text,done){let index=0;const step=()=>{if(index>=ids.length){done();return;}const id=ids[index++];announce(`${title}<small>進出発表 ${index} / ${ids.length}</small>`,`${text}<br><strong>QUALIFIED! ${team(id).name}</strong>`,[id],step,'qualified');};step();}
    function play(){
      if(!league)return;const descriptor=rules.next(league);if(!descriptor)return;
      if(descriptor.choices){choiceRound(descriptor);return;}
      const ids=[...descriptor.active],ownTicket=ticket,points={};
      if(rules.TAG.includes(descriptor.key)){const shuffled=rules.sample(ids,ids.length);ids.splice(0,ids.length,...shuffled);}
      // Dedicated duo games run as 2-v-2 heats. Odd fields use one CPU exhibition
      // opponent; exhibition scores never enter standings.
      const batches=rules.TAG.includes(descriptor.key)?Array.from({length:Math.ceil(ids.length/2)},(_,i)=>ids.slice(i*2,i*2+2)):[ids];let heat=0;
      const startHeat=()=>{
        if(ticket!==ownTicket||!league)return;
        if(heat>=batches.length){results(rules.submit(league,points,descriptor));return;}
        const actual=batches[heat++],rows=actual.map(team);
        if(rows.length===1&&rules.TAG.includes(descriptor.key)){
          const spare=league.teams.find(t=>!ids.includes(t.id)&&t.members.every(p=>member(p).cpu));
          if(!spare)throw Error('Missing exhibition team');rows.push(spare);
        }
        const run=()=>api.run(descriptor.key,rows,descriptor,score=>{
          if(ticket!==ownTicket||!league)return;
          for(const id of actual)for(const p of team(id).members)points[p]=score[p];
          startHeat();
        });
        if(rows.every(t=>t.members.every(p=>member(p).cpu))){run();return;}
        if(rules.TAG.includes(descriptor.key))announce(`${rows[0].name} VS ${rows[1].name}`,`${api.title(descriptor.key)} · 第${heat}試合<br>この2組が激突！ 相棒と力を合わせて勝利をつかめ！`,rows.map(t=>t.id),run,'versus');
        else announce(`${labels[descriptor.phase]} · GAME ${descriptor.round}`,`${api.title(descriptor.key)}<br>さあ、次の勝負へ！`,[],run);
      };
      const launchHeat=()=>{if(rules.TAG.includes(descriptor.key)){
        announce('タッグ対戦、開幕！',`全${batches.length}試合の対戦カードが決定！<br>相棒と力を合わせて、ライバルを打ち破れ！`,[],startHeat,'matchups');
        screen.querySelector('.league-show-body').insertAdjacentHTML('beforeend',`<div class="league-matchup-board">${batches.map((pair,i)=>`<div><small>MATCH ${i+1}</small><b>${team(pair[0]).name} <em>VS</em> ${pair[1]?team(pair[1]).name:'CPU招待チーム'}</b></div>`).join('')}</div>`);
      }else startHeat();};
      const launch=()=>announce('NEXT GAME · '+descriptor.round,`<strong class="league-game-name">${esc(api.title(descriptor.key))}</strong><br>${labels[descriptor.phase]}の次の勝負はこちら！<br>${descriptor.phase==='final'?'点灯済みのタッグは1位で優勝。ライバルは全力で阻止しよう！':'一つの記録が順位を動かす。準備ができたら、次の舞台へ！'}`,league.lit.length?league.lit:[],launchHeat,'next-game');
      if(descriptor.multiplier===2)announce('POINTS ×2',`ここが勝負の分かれ目！<br>${api.title(descriptor.key)}は全員の獲得ポイントが2倍！`,[],launch,'bonus');else if(descriptor.winnerBonus)announce('生存者だけが POINTS ×2','今回のデスゲームは個人1位だけが2倍！<br>最後の1人が200点を獲得。ほかの選手は通常点です。',[],launch,'bonus');else launch();
    }
    function choiceRound(descriptor){
      const own=ticket,points={},assignments={},rows=descriptor.active.map(team),tasks=descriptor.key==='teamChoice'?rows.map(t=>({team:t,members:t.members})):rows.flatMap(t=>t.members.map(p=>({team:t,members:[p]})));let choosing=0,playing=0;
      const valid=()=>ticket===own&&!!league;
      function runNext(){if(!valid())return;if(playing===tasks.length){results(rules.submit(league,points,{...descriptor,selections:assignments}));return;}const task=tasks[playing++],key=assignments[task.members[0]];
        const run=()=>api.run(key,[{...task.team,members:task.members}],descriptor,scores=>{if(!valid())return;task.members.forEach(p=>points[p]=scores[p]);runNext();});
        if(task.members.every(p=>member(p).cpu)){run();return;}
        announce(gameTitle(key),`${task.team.name} · ${task.members.map(p=>esc(member(p).name)).join(' ＆ ')}<br>選んだ種目で挑戦！ ${descriptor.multiplier===2?'今回の獲得ポイントは2倍！':'どの種目も100点満点。同じラウンドの成績として集計します。'}`,[task.team.id],run,'next-game');
      }
      function chooseNext(){if(!valid())return;if(choosing===tasks.length){announce('選択完了！ チャレンジ開始',`全員の出場種目が決定！<br>${descriptor.multiplier===2?'運を味方に、2倍ポイントをつかめ！':'相棒とは別の舞台で、タッグの得点を積み上げよう！'}`,[],runNext,'next-game');return;}
        const task=tasks[choosing++],used=descriptor.key==='individualChoice'?task.team.members.map(p=>assignments[p]).filter(Boolean):[],options=descriptor.choices.filter(k=>!used.includes(k));
        const pick=key=>{task.members.forEach(p=>assignments[p]=key);chooseNext();};
        if(task.members.every(p=>member(p).cpu)){pick(options[Math.floor(Math.random()*options.length)]);return;}
        draw(`GAME ${descriptor.round} · 種目を選ぼう`,`${cards([task.team.id])}<h2>${task.members.map(p=>esc(member(p).name)).join(' ＆ ')}</h2><p>${descriptor.key==='individualChoice'?'プレイヤーごとに1種目選択。同じチームの相棒が選んだ種目は選べません。':'チームの2人が同じ種目に挑戦。獲得点は2倍です。'}</p><div class="league-choice-games">${descriptor.choices.map((k,i)=>`<button id="leagueChoice${i}" class="primary" ${used.includes(k)?'disabled':''}>${esc(gameTitle(k))}${used.includes(k)?'（相棒が選択済み）':''}</button>`).join('')}</div>`);
        descriptor.choices.forEach((k,i)=>{if(!used.includes(k))on('leagueChoice'+i,()=>pick(k));});
      }
      announce(`GAME ${descriptor.round} · ${descriptor.multiplier===2?'POINTS ×2':'CHOICE CHALLENGE'}`,`${gameTitle(descriptor.key)}<br>${descriptor.choices.map(k=>esc(gameTitle(k))).join(' ／ ')}<br>${descriptor.key==='individualChoice'?'今回は各プレイヤーが好きな種目を選べます。相棒との重複はできません！':'チームで選ぶ運命の勝負。2倍ポイントで順位を動かせ！'}`,[],chooseNext,descriptor.multiplier===2?'bonus':'next-game');
    }
    function results({event,record},championShown=false){
      if(event.type==='champion'&&!championShown){announce('CHAMPION!!',`優勝決定！ ${team(event.ids[0]).name}が点灯後の首位を獲得！<br>これで全試合終了です。王者の結果を振り返りましょう！`,event.ids,()=>results({event,record},true),'champions');return;}
      const ids=record.active,cut=record.phase==='qualifier'?8:record.phase==='repechage'?2:0;
      const teamRows=total=>[...ids].sort((a,b)=>(total[b]||0)-(total[a]||0));
      const rows=(total,round)=>teamRows(total).map((id,i)=>{
        const border=cut&&!round&&i===cut-1,qualified=cut&&!round&&teamRows(record.totals).slice(0,cut).includes(id),pts=total[id]||0;
        const tied=cut&&!round&&teamRows(total)[cut]&&(total[teamRows(total)[cut-1]]||0)===(total[teamRows(total)[cut]]||0)&&pts===(total[teamRows(total)[cut-1]]||0);
        return `<article class="league-rank ${qualified?'qualified':''} ${border?'league-border':''} ${record.phase==='final'&&(record.totals[id]||0)>=600?'league-lit':''}"><b>${teamRows(total).findIndex(t=>(total[t]||0)===pts)+1}</b><div>${portraits(id)}<strong>${team(id).name}${record.phase==='final'&&(record.totals[id]||0)>=600?' 💡 点灯':''}</strong><small>${team(id).members.map(p=>`${esc(member(p).name)}${round&&record.selections?.[p]?'（'+esc(gameTitle(record.selections[p]))+'）':''} ${round?record.points[p]||0:record.personal[p]||0}pt`).join(' ＋ ')}</small>${tied?'<em>ボーダー同点・延長対象</em>':''}</div><strong>${pts}pt</strong>${border?`<footer>── ${cut}チーム通過ボーダー ──</footer>`:''}</article>`;
      }).join('');
      const individual=total=>ids.flatMap(id=>team(id).members).sort((a,b)=>(total[b]||0)-(total[a]||0)).map((p,i)=>`<article class="league-rank"><b>${ids.flatMap(id=>team(id).members).filter(id=>(total[id]||0)>(total[p]||0)).length+1}</b><div>${picture(member(p))}<strong>${esc(member(p).name)}</strong><small>${member(p).cpu?'CPU':'P'+member(p).no}</small></div><strong>${total[p]||0}pt</strong></article>`).join('');
      const cutoffRows=teamRows(record.totals),borderText=cut?`通過ボーダー ${cut}位 · ${team(cutoffRows[cut-1]).name} ${record.totals[cutoffRows[cut-1]]||0}pt`:record.phase==='final'?`点灯チーム ${ids.filter(id=>(record.totals[id]||0)>=600).length} / ${ids.length} · 600ptで点灯`:record.phase==='cutoff'?'延長戦の得点だけで通過枠を決定':'点灯済みタッグの優勝決定戦';
      const pages=[['今回のチーム順位',rows(record.teamPoints,true)],['ステージチーム総合',rows(record.totals,false)]];let page=0;
      const show=()=>{const [title,body]=pages[page];draw(title,`<p>${labels[record.phase]} · GAME ${record.round} / ${gameTitle(record.key)}${record.multiplier===2?' / 2倍ポイント':record.winnerBonus?' / 個人1位のみ2倍':''}</p>${page===1?`<p class="league-live">${record.phase==='final'?'600点で点灯。その次のゲーム以降の1位で優勝！':cut?`上位${cut}チームが通過！ ボーダー同点は延長戦。`:''}</p><aside class="league-cutline">${borderText}</aside>`:''}<div class="league-ranks">${body}</div><button id="leagueNext" class="primary league-continue">${page+1} / 2 · タップして次へ →</button>`);on('leagueNext',()=>{if(++page<pages.length){if(page===1)announce('現在の総合順位はこちら！','現在のチーム総合順位を発表！<br>今回の得点で順位はどう動いたのか。相棒と積み重ねた合計点に注目です！',[],show,'standings');else show();}else after(event);});};show();
    }
    function after(event){
      if(event.type==='qualified')reveal(event.ids,'予選突破・8チーム発表！','長い予選を勝ち抜いたタッグを、1組ずつ発表します！',()=>announce('残る切符は、あと2枚！','ここからは敗者復活3ゲームマッチ！ 予選ポイントはゼロに戻ります。残る12組、逆転のチャンスをつかめ！',league.active,play));
      else if(event.type==='finalists')reveal(event.wildcards,'敗者復活・2チーム決定！','最後の2枠を勝ち取ったタッグが合流！',()=>announce('決勝ゲーム！！','10チームの最終決戦！ 全ポイントをリセット。600点で点灯し、その後のゲームで1位を取ったタッグが優勝！ 点灯チームが同点1位なら、そのタッグだけで優勝決定戦です。',event.ids,play));
      else if(event.type==='cutoff')announce('ボーダー同点！ 延長戦！',`あと${event.slots}枠をかけて反射神経勝負！ 同点が続けば再戦。ここまでの成績を持ち越さず、この延長戦で決めます！`,event.ids,play);
      else if(event.type==='championship')announce('同点1位！ 優勝決定戦！','点灯済みの同点首位だけが残った！ ランダムゲームで単独1位が決まるまで決戦を続けます！',event.ids,play);
      else if(event.type==='champion')champion(event.ids[0]);
      else if(event.ids.length)announce('MATCH POINT · 点灯！','600点突破！ 優勝へのランプが点灯！<br>次のゲームから1位を取れば優勝。ほかのタッグは全力で阻止せよ！',event.ids,play,'ignition');
      else play();
    }
    function champion(id){
      const finalists=league.history.filter(r=>r.phase==='final').at(-1),finalIds=finalists?.active||[];
      const stats=players.map(p=>{
        const played=league.history.filter(r=>r.points[p.id]!==undefined),raw=played.map(r=>r.rawPoints?.[p.id]??r.points[p.id]/r.multiplier);
        const sum=filter=>played.filter(filter).reduce((n,r)=>n+r.points[p.id],0);
        return {p,played:played.length,total:sum(()=>true),best:Math.max(0,...raw),average:Math.round(raw.reduce((n,v)=>n+v,0)/Math.max(1,raw.length)),perfect:raw.filter(v=>v===100).length,consistent:raw.filter(v=>v>=70).length,wins:played.filter(r=>r.points[p.id]===Math.max(...Object.values(r.points))).length,recovery:sum(r=>r.phase==='repechage'),final:sum(r=>r.phase==='final'),tag:sum(r=>rules.TAG.includes(r.key)),death:sum(r=>r.key==='deathGameChallenge'),bonus:sum(r=>r.multiplier===2),choice:sum(r=>r.key==='individualChoice'),luck:sum(r=>r.key==='teamChoice'),support:played.filter(r=>r.points[p.id]>0&&r.points[p.id]<=r.points[league.teams.find(t=>t.members.includes(p.id))?.members.find(id=>id!==p.id)]).length,comeback:Math.max(0,(raw.at(-1)||0)-(raw[0]||0))};
      }).filter(s=>s.played);
      const awards=[['MVP','大会を通して、最も多くのポイントを積み上げた選手！','total','pt'],['大健闘賞','決勝には届かなくても、その活躍は輝いていた！','total','pt',s=>!finalIds.some(t=>team(t).members.includes(s.p.id))],['ベストプレイ賞','一戦で見せた最高のパフォーマンス！','best','pt'],['パーフェクト賞','100点を最も多く記録した選手！','perfect','回'],['安定感抜群賞','70点以上を最も多く積み重ねた選手！','consistent','回'],['個人首位賞','一戦ごとの個人1位を最も多く獲得！','wins','回'],['ハイアベレージ賞','倍率を除く1試合平均点のトップ！','average','pt'],['タッグの達人賞','タッグ専用ゲームで最も得点した選手！','tag','pt'],['サバイバル賞','デスゲームで最も得点を積んだ選手！','death','pt'],['勝負強さ賞','ポイント2倍の勝負どころで大活躍！','bonus','pt'],['敗者復活の立役者','敗者復活3ゲームマッチを盛り上げた選手！','recovery','pt'],['決勝の主役賞','決勝の舞台で最も多くのポイントを獲得！','final','pt'],['選択の名手賞','自分で選んだ種目で最高の記録を残した選手！','choice','pt'],['勝利の女神賞','サイコロ・スロットの選択勝負で輝いた選手！','luck','pt'],['相棒サポート賞','相棒と共に得点を重ね、チームを支えた選手！','support','回'],['大躍進賞','初戦から最終出場戦へ、最も得点を伸ばした選手！','comeback','pt']];
      const awarded=new Set();const slides=awards.flatMap(([title,text,key,unit,filter=()=>true])=>{const eligible=stats.filter(filter),fresh=eligible.filter(s=>!awarded.has(s.p.id)&&s[key]>0),pool=title==='MVP'?eligible:fresh.length?fresh:eligible,best=Math.max(0,...pool.map(s=>s[key]));if(!best)return [];const winners=pool.filter(s=>s[key]===best);winners.forEach(s=>awarded.add(s.p.id));return [{title,text:title==='MVP'?text:(fresh.length?'未受賞の選手から選出。<br>':'')+text,value:best,unit,winners}];});
      function finalResults(){const totals=finalists?.totals||{},ids=[id,...finalIds.filter(t=>t!==id).sort((a,b)=>(totals[b]||0)-(totals[a]||0))];draw('最終結果',`<p>優勝は点灯後の勝利で決定。ほかの決勝進出チームは決勝累計点順です。</p>${ids.map((t,i)=>`<article class="league-rank"><b>${i===0?'優勝':i+1}</b><div>${portraits(t)}<strong>${team(t).name}</strong></div><strong>${totals[t]||0}pt</strong></article>`).join('')}<button id="leagueHome" class="primary">NEXT · 優勝記念へ</button>`);on('leagueHome',wallpaperChoice);}
      function wallpaperChoice(){const members=team(id).members.map(member),open=()=>window.MobCollectibles.wallpaper({screen,esc,members,teamName:team(id).name,done:()=>{stop();api.home();}});if(!window.MobCollectibles){stop();api.home();return;}if(members.some(p=>!p.cpu)){open();return;}draw('王者の記念壁紙',`${cards([id])}<p>優勝チームのスマホ壁紙を作れます。</p><button id="leagueWall" class="primary">壁紙を作る</button><button id="leagueSkip" class="secondary">スキップする</button>`);on('leagueWall',open);on('leagueSkip',()=>{stop();api.home();});}
      function personalFinal(){draw('大会最終・個人総合順位',`<p>全ステージの獲得ポイントを合計。全選手の挑戦を、ここで振り返ります。</p>${[...stats].sort((a,b)=>b.total-a.total).map(s=>`<article class="league-rank"><b>${stats.filter(x=>x.total>s.total).length+1}</b><div>${picture(s.p)}<strong>${esc(s.p.name)}</strong></div><strong>${s.total}pt</strong></article>`).join('')}<button id="leagueNext" class="primary league-continue">NEXT · 個人賞発表へ</button>`);on('leagueNext',showAward);}
      let awardIndex=0,winnerPage=0;
      function showAward(){if(awardIndex>=slides.length){finalResults();return;}const a=slides[awardIndex],pageSize=a.title==='MVP'?2:4,visible=a.winners.slice(winnerPage*pageSize,winnerPage*pageSize+pageSize);announce(a.title,a.text,[],()=>{if((winnerPage+1)*pageSize<a.winners.length){winnerPage++;showAward();}else{awardIndex++;winnerPage=0;showAward();}},'award');const body=screen.querySelector('.league-show-body');body.insertAdjacentHTML('beforeend',`<div class="league-award-winners">${visible.map(s=>`<div>${picture(s.p)}<b>${esc(s.p.name)}</b><strong>${a.value}${a.unit}</strong></div>`).join('')}</div><small class="league-award-progress">AWARD ${awardIndex+1} / ${slides.length}</small>`);if(a.title==='MVP'&&window.MobCollectibles){body.querySelector('.league-award-winners').innerHTML=visible.map((s,i)=>`<canvas data-mvp="${i}" class="mvp-card" role="img"></canvas>`).join('');body.querySelectorAll('[data-mvp]').forEach(c=>{const s=visible[Number(c.dataset.mvp)];window.MobCollectibles.card(c,{...s.p,rank:'MVP',total:s.total,perfect:s.perfect,title:'TAG LEAGUE MVP'});});}}
      announce('CHAMPIONS!!',`${team(id).name}、タッグバトルリーグを制覇！<br>最高のコンビネーションに大きな拍手を！`,[id],personalFinal,'champions');
    }
    return {setup,stop,active:()=>!!league&&!league.champion};
  }};
})();
