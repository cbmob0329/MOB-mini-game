/* Crew and individual leagues share tournament rules and the existing game adapter. */
(()=>{
  'use strict';
  const core=window.MobPartyCore,L=window.MobPartyLeague,pairedGames=[...L.TAG,'treasureDuoParty'];
  window.MobLeagueVariants={create(api){
    const {screen,esc}=api;let mode='crew',count=1,level='ALL',selections=[],players=[],teams=[],league=null,ticket=0;
    const title=()=>mode==='crew'?'Crew League':'MOB KING League',size=()=>mode==='crew'?4:1;
    const player=id=>players.find(p=>p.id===id),team=id=>teams.find(t=>t.id===id);
    const name=p=>p.baseName+(p.origin?`（${p.origin.league} ${p.origin.place}位）`:'');
    const teamName=t=>mode==='king'?name(player(t.members[0])):t.name;
    const picture=p=>`<img src="${p.img}" alt="${esc(p.baseName)}">`;
    const gameTitle=key=>key==='minorityMob'?'モブくんは少数派':key==='focusBombMob'?'モブくん集中大爆弾！':key==='individualChoice'?'個人種目選択':key==='teamChoice'?'運の種目選択':api.title(key);
    function stop(){ticket++;league=null;}
    function on(id,fn){const b=screen.querySelector('#'+id);let used=false;b.onclick=()=>{if(used)return;used=true;if(fn()===false)used=false;};}
    function draw(heading,body,kind=''){api.clear();screen.innerHTML=`<section class="tag-league variant-league variant-${mode} ${kind}"><header><small>${title()} · ${level}</small><h1>${heading}</h1></header>${body}</section>`;api.top();const el=screen.querySelector('.variant-league');el.style.setProperty('--variant-top',Math.max(0,screen.getBoundingClientRect().top)+'px');}
    function button(label='次へ →',id='variantNext'){return `<button id="${id}" class="primary variant-next">${label}</button>`;}
    function rows(ids,scores={}){return `<div class="variant-rows">${ids.map(id=>{const t=team(id),origin=mode==='king'?player(t.members[0]).origin:null;return `<article class="variant-row"><div class="variant-portraits">${t.members.map(p=>picture(player(p))).join('')}</div><div><b>${esc(mode==='king'?player(t.members[0]).baseName:t.name)}</b>${origin?`<em>${esc(origin.league)} ${origin.place}位</em>`:''}${league?.lit.includes(id)&&!league.champion?'<em>MATCH POINT · 点灯済み</em>':''}<small>${mode==='crew'?t.members.map(p=>esc(player(p).baseName)).join(' / '):player(t.members[0]).cpu?'CPU':'PLAYER '+player(t.members[0]).no}</small></div>${scores[id]!==undefined?`<strong>${scores[id]}<small>pt</small></strong>`:''}</article>`;}).join('')}</div>`;}
    function announce(heading,message,ids,next,kind=''){let page=0;const per=mode==='crew'?2:4;
      function show(){draw(heading,`<div class="league-narrator"><p>${message}</p></div>${rows(ids.slice(page*per,(page+1)*per))}<small class="variant-page">${ids.length?`${page+1} / ${Math.ceil(ids.length/per)}`:''}</small>${button(page*per+per<ids.length?'次の出場者 →':'確認して次へ →')}`,'variant-show '+kind);api.beep(kind==='league-ignition'?1250:900,90,.02);on('variantNext',()=>{if(++page*per<ids.length)show();else next();});}show();
    }
    function setup(requested='crew'){
      stop();mode=requested==='king'?'king':'crew';count=1;selections=[];
      draw(title(),`<p>${mode==='crew'?'20チーム×4名＝80名。予選10戦→上位8組が直行、敗者復活3戦で2組→決勝10組。':'80名を20名ずつ4リーグへ。各リーグ予選10戦の上位5名が決勝へ。敗者復活なし。'}</p><p>${mode==='king'?L.DIVISIONS.join(' / ')+'<br>':''}決勝は${size()*300}点で点灯。到達した次のゲーム以降の1位で優勝！</p><label>TOURNAMENT LEVEL<select id="variantLevel">${core.tournamentLevels.map(v=>`<option ${v===level?'selected':''}>${v}</option>`).join('')}</select></label><label>プレイヤー数<select id="variantCount">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===1?'selected':''}>${i}人${i===0?'（観戦）':''}</option>`).join('')}</select></label>${button('キャラクターを選ぶ','variantSelect')}<button id="variantBack" class="secondary">戻る</button>`,'variant-setup');
      on('variantSelect',()=>{count=Number(screen.querySelector('#variantCount').value);level=screen.querySelector('#variantLevel').value;select(0);});on('variantBack',api.home);
    }
    function select(index){if(index>=count){assign();return;}window.MobCharacterSelect.show({screen,esc,count,index,slots:selections.map(s=>s.character),top:api.top,beep:api.beep,back:()=>index?select(index-1):setup(mode),confirm:c=>{selections[index]={character:c.id,group:selections[index]?.group??(mode==='king'?index%4:Math.floor(index/4))};select(index+1);}});}
    function assign(){
      draw(mode==='king'?'出場する予選リーグを選ぼう':'4人のクルーを組もう',`<p>${mode==='king'?'各プレイヤーが好きなリーグを選べます。残りの枠へCPUをランダムに配置します。':'同じチーム番号の4人で出場します。空き枠はCPUで補完します。'}</p><div class="variant-assignments">${selections.map((s,i)=>`<label>P${i+1} · ${esc(core.roster.find(c=>c.id===s.character).name)}<select data-assignment="${i}">${Array.from({length:mode==='king'?4:20},(_,g)=>`<option value="${g}" ${s.group===g?'selected':''}>${mode==='king'?L.DIVISIONS[g]:'CREW '+(g+1)}</option>`).join('')}</select></label>`).join('')||'<p>CPUだけの観戦モードで開始します。</p>'}</div><p id="variantError" role="alert"></p>${button('このメンバーで開幕','variantStart')}<button id="variantBack" class="secondary">設定へ戻る</button>`,'variant-setup');
      screen.querySelectorAll('[data-assignment]').forEach(el=>el.onchange=()=>selections[Number(el.dataset.assignment)].group=Number(el.value));
      on('variantBack',()=>setup(mode));on('variantStart',()=>{if(new Set(selections.map(s=>s.character)).size!==count||selections.some(s=>selections.filter(p=>p.group===s.group).length>(mode==='king'?20:4))){screen.querySelector('#variantError').textContent='同じキャラクターは選べません。所属先の定員も確認してください。';return false;}begin();});
    }
    function begin(){
      ticket++;players=[];teams=[];const used=new Set(selections.map(s=>s.character)),available=core.roster.filter(c=>!used.has(c.id));
      const pool=core.tournamentPool(available,80-count,level),make=(c,human=false,no=0)=>{const p={id:human?'p'+no:'variantCpu'+players.length,no,name:c.name,baseName:c.name,img:c.img,cpu:!human,characterRank:c.rank};players.push(p);return p.id;};
      if(mode==='crew'){
        teams=Array.from({length:20},(_,i)=>({id:'C'+i,name:'CREW '+(i+1),members:[]}));selections.forEach((s,i)=>teams[s.group].members.push(make(core.roster.find(c=>c.id===s.character),true,i+1)));
        for(const t of teams){if(!t.members.length){const group=core.allocateTeams(pool,4,1)[0];group.forEach(c=>{pool.splice(pool.indexOf(c),1);t.members.push(make(c));});}else while(t.members.length<4){const anchor=core.roster.find(c=>c.img===player(t.members[0]).img),same=pool.filter(c=>c.group===anchor.group),choices=same.length?same:[...pool].sort((a,b)=>Math.abs(core.rankValue(a.rank)-core.rankValue(anchor.rank))-Math.abs(core.rankValue(b.rank)-core.rankValue(anchor.rank))),c=choices[0];pool.splice(pool.indexOf(c),1);t.members.push(make(c));}}
      }else{
        selections.forEach((s,i)=>{const c=core.roster.find(c=>c.id===s.character);teams.push({id:'K'+teams.length,name:c.name,division:s.group,members:[make(c,true,i+1)]});});
        const shuffled=L.sample(pool,pool.length);for(let division=0;division<4;division++)while(teams.filter(t=>t.division===division).length<20){const c=shuffled.pop();teams.push({id:'K'+teams.length,name:c.name,division,members:[make(c)]});}
      }
      const poolKeys=api.pool().filter(key=>mode!=='king'||!pairedGames.includes(key)),schedule=L.program(poolKeys);
      league=L.create(teams,schedule,{mode});api.configure(players,teams,{mode,title:title()});
      announce('開幕！ '+title(),mode==='crew'?'4人の合計得点で挑む20組の大会。代表種目は各クルー2人。タッグ専用種目は2組のペアに分かれ、全員が出場します。':'各予選リーグは同じ10種目。全4リーグの上位5名、合計20名が頂点を争います。',league.active,play);
    }
    function phaseName(record=league){return record.phase==='qualifier'?(mode==='king'?L.DIVISIONS[record.division]+' 予選':'予選'):record.phase==='repechage'?'敗者復活':record.phase==='cutoff'?'進出決定・延長戦':record.phase==='championship'?'優勝決定戦':'決勝';}
    function play(){if(!league)return;const descriptor=L.next(league);if(!descriptor)return;
      announce(`${phaseName()} · GAME ${descriptor.round}`,`${esc(gameTitle(descriptor.key))}<br>${descriptor.multiplier===2?'POINTS ×2 · 全員2倍！':descriptor.winnerBonus?'個人1位だけ POINTS ×2！':'1人最大100点'}${league.phase==='final'?`<br>${league.threshold}点で点灯 → 次戦以降の1位で優勝`:''}`,[],()=>descriptor.choices?choiceRound(descriptor):execute(descriptor));
    }
    function runGame(key,rows,descriptor,done){
      const own=ticket,finish=points=>{if(ticket===own&&league)done(Object.fromEntries(rows.flatMap(t=>t.members.map(id=>[id,core.representativeKeys.has(key)?points[id]??0:points[id]]))));};
      if(['minorityMob','focusBombMob'].includes(key)){window.MobLeagueEvents.run({mode,key,screen,esc,entrants:rows.flatMap(t=>t.members.map(id=>({...player(id),name:name(player(id)),team:teamName(t),teamId:t.id}))),valid:()=>ticket===own&&!!league,clear:api.clear,top:api.top,beep:api.beep,done:finish});return;}
      // Keep the existing two-representative rule. Human crews choose in the game; CPU crews rotate.
      const actual=mode==='crew'&&core.representativeKeys.has(key)&&rows.every(t=>t.members.every(id=>player(id).cpu))
        ?rows.map(t=>({...t,members:t.members.length<=2?t.members:[0,1].map(i=>t.members[(descriptor.round-1+i)%t.members.length])})):rows;
      api.run(key,actual,descriptor,finish);
    }
    function execute(d){
      const rows=d.active.map(team);
      if(mode!=='crew'||!pairedGames.includes(d.key)){runGame(d.key,rows,d,points=>results(L.submit(league,points,d)));return;}
      const ids=L.sample(d.active,d.active.length),points={},tasks=[];for(let i=0;i<ids.length;i+=2)for(let pair=0;pair<2;pair++)tasks.push(ids.slice(i,i+2).map(id=>({...team(id),members:team(id).members.slice(pair*2,pair*2+2)})));let cursor=0;
      function next(){if(!league)return;if(cursor===tasks.length){results(L.submit(league,points,d));return;}const batch=tasks[cursor++];announce(`PAIR MATCH ${cursor} / ${tasks.length}`,batch.map(t=>t.members.map(id=>esc(name(player(id)))).join(' ＆ ')).join('<br>VS<br>'),[],()=>runGame(d.key,batch,d,scores=>{Object.assign(points,scores);next();}));}next();
    }
    function choiceRound(d){
      const tasks=d.active.flatMap(id=>d.key==='teamChoice'?[{team:team(id),members:team(id).members}]:team(id).members.map(p=>({team:team(id),members:[p]}))),assignments={},points={};let index=0;
      function choose(){if(!league)return;if(index===tasks.length){index=0;run();return;}const t=tasks[index++],used=mode==='crew'&&d.key==='individualChoice'?t.team.members.map(p=>assignments[p]).filter(Boolean):[],remaining=d.choices.filter(k=>!used.includes(k)),choices=remaining.length?remaining:d.choices;
        const pick=key=>{t.members.forEach(id=>assignments[id]=key);choose();};
        if(t.members.every(id=>player(id).cpu)){pick(choices[Math.floor(Math.random()*choices.length)]);return;}
        draw('種目を選ぼう',`<p>${t.members.map(id=>esc(name(player(id)))).join(' / ')}</p><div class="variant-choice">${choices.map((key,i)=>button(esc(gameTitle(key)),'variantChoice'+i)).join('')}</div>`,'variant-setup');choices.forEach((key,i)=>on('variantChoice'+i,()=>pick(key)));
      }
      function run(){if(!league)return;if(index===tasks.length){results(L.submit(league,points,{...d,selections:assignments}));return;}const t=tasks[index++],key=assignments[t.members[0]],start=()=>runGame(key,[{...t.team,members:t.members}],d,scores=>{Object.assign(points,scores);run();});if(t.members.every(id=>player(id).cpu))start();else announce(gameTitle(key),t.members.map(id=>esc(name(player(id)))).join(' / '),[],start);}
      choose();
    }
    function syncOrigins(){for(const [id,origin] of Object.entries(league.origins)){const p=player(team(id).members[0]);p.origin=origin;p.name=name(p);team(id).name=p.name;}api.updatePlayers?.(players);}
    function results({event,record}){
      syncOrigins();const resume=()=>rankings(record,event);
      if(event.type==='champion'){announce('CHAMPION!!',`${esc(teamName(team(event.ids[0])))}<br>点灯後の1位！ 優勝決定！`,event.ids,resume,'league-champions');return;}
      if(event.type==='round'&&event.ids.length){announce('MATCH POINT · 点灯！',`${league.threshold}点突破！<br>次のゲーム以降、1位を取れば優勝！`,event.ids,resume,'league-ignition');return;}
      if(['qualified','finalists','divisionQualified','kingFinalists'].includes(event.type)){const ids=event.type==='kingFinalists'?event.qualified:event.wildcards||event.ids;announce('QUALIFIED · 進出決定！',mode==='king'?`${L.DIVISIONS[event.division]}の上位5名。決勝へ！`:'決勝への切符を獲得！',ids,resume,'league-qualified');return;}
      if(event.type==='cutoff'){announce('進出ボーダー同点！',`残り${event.slots}枠。該当者だけの延長戦で決めます。`,event.ids,resume);return;}
      if(event.type==='championship'){announce('優勝決定戦へ！','点灯済みの同点首位だけで、単独1位が決まるまで続けます。',event.ids,resume);return;}resume();
    }
    function rankings(record,event){let scope=0;
      function show(){const scores=scope?record.totals:record.teamPoints,ordered=[...record.active].sort((a,b)=>(scores[b]||0)-(scores[a]||0)),decider=['cutoff','championship'].includes(record.phase),visible=ordered;
        draw(scope?'総合順位':'このゲームの順位',`<div class="ranking-scope ${scope?'overall':'round'}"><small>${scope?'STAGE TOTAL':'THIS GAME'}</small><strong>${phaseName(record)}</strong><span>${scope?(decider?'この決着戦だけの得点':'このステージの累計得点'):'今回の獲得ポイントだけ'}</span></div><div class="variant-standing result-scroll-list" tabindex="0" aria-label="全出場者の順位">${visible.map(id=>`<div><b class="variant-place">#${1+ordered.filter(other=>(scores[other]||0)>(scores[id]||0)).length}</b>${rows([id],scores)}</div>`).join('')}</div><small class="variant-page">全${ordered.length}${mode==='crew'?'組':'名'} · 一覧をスクロールして確認</small>${button(scope?'大会を進める →':'総合順位を見る →')}`,'variant-show variant-results');
        on('variantNext',()=>{if(!scope){scope=1;show();}else after(event);});}show();
    }
    function after(event){if(event.type==='champion'){finale(event.ids[0]);return;}
      if(event.type==='divisionQualified'){announce('次の予選リーグへ',L.DIVISIONS[league.division]+'の予選が始まります。得点はリーグごとに集計します。',league.active,play);return;}
      if(event.type==='kingFinalists'||event.type==='finalists'){announce('FINAL · 決勝開幕！',`${mode==='king'?'4リーグの代表20名':'10クルー'}が集結！<br>得点をリセット。${league.threshold}点で点灯し、その次のゲーム以降の1位で優勝！`,league.active,play);return;}
      if(event.type==='qualified'){announce('敗者復活戦！','残る12組から上位2組が決勝へ。ここからの3戦で勝負！',league.active,play);return;}play();
    }
    function finale(winner){
      const history=league.history,stats=core.awardStats(players,history,key=>({key,title:gameTitle(key)}));
      const bestTotal=Math.max(...stats.map(s=>s.baseTotal));
      const awards=[['MVP',stats.filter(s=>s.baseTotal===bestTotal),s=>s.baseTotal],['ベストプレイ賞',core.bestPlayWinners(stats),s=>100],...['brain','sport','power'].map((key,i)=>{const best=Math.max(...stats.map(s=>s[key]));return [['頭脳王','スポーツ王','怪力王'][i],best?stats.filter(s=>s[key]===best):[],s=>s[key]];})];let index=0;
      function award(){while(index<awards.length&&!awards[index][1].length)index++;if(index>=awards.length){save();return;}const [label,winners,value]=awards[index++];let page=0;function show(){draw(label,`<p>${label==='ベストプレイ賞'?'満点から最大2名を厳選':'対象種目の基礎得点で選出'}</p><div class="variant-rows">${winners.slice(page*4,page*4+4).map(s=>`<article class="variant-row">${picture(s.p)}<b>${esc(name(s.p))}</b><strong>${value(s)}pt</strong></article>`).join('')}</div>${button()}`,'variant-show');on('variantNext',()=>{if(++page*4<winners.length)show();else award();});}show();}
      function save(){draw('優勝記念コレクション',`${rows([winner])}<p>壁紙と63×88mmカードをそれぞれ保存できます。</p>${button('壁紙・カードを作る','variantSave')}<button id="variantHome" class="secondary">ホームへ</button>`,'variant-setup');on('variantSave',()=>window.MobCollectibles.wallpaper({screen,esc,members:team(winner).members.map(player),teamName:teamName(team(winner)),competition:title(),done:()=>{stop();api.home();}}));on('variantHome',()=>{stop();api.home();});}
      const finalRecord=history.filter(r=>r.phase==='final').at(-1),ids=[winner,...(finalRecord?.active||[]).filter(id=>id!==winner).sort((a,b)=>(finalRecord.totals[b]||0)-(finalRecord.totals[a]||0))];
      announce('CHAMPIONS · '+title(),`${esc(teamName(team(winner)))}が頂点に！<br>優勝者を先頭に、決勝の累計得点順で発表します。`,ids,award,'league-champions');
    }
    return {setup,stop,active:()=>!!league&&!league.champion};
  }};
})();
