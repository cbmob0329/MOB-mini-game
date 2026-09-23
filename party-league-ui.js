(()=>{
  'use strict';
  const rules=window.MobPartyLeague,core=window.MobPartyCore;
  window.MobPartyLeagueUI={create(api){
    const {screen,esc}=api;let league=null,players=[],ticket=0,count=1,selections=[];
    const labels={qualifier:'予選',repechage:'敗者復活3ゲームマッチ',final:'決勝',cutoff:'通過決定・延長戦',championship:'優勝決定戦'};
    const on=(id,fn)=>screen.querySelector('#'+id).onclick=fn;
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
      const available=core.roster.filter(c=>!selections.some(s=>s.character===c.id)).sort(()=>Math.random()-.5);let n=0;
      for(const t of teams)while(t.members.length<2){const c=available[n%available.length],p={id:'leagueCpu'+n,no:n+1,name:c.name,img:c.img,cpu:true,characterRank:c.rank};players.push(p);t.members.push(p.id);n++;}
      api.configure(players,teams);league=rules.create(teams,rules.program(api.pool()));
      announce('20組のタッグ、開幕！','予選の上位8組が決勝直行。4戦目と10戦目はポイント2倍！ 残る12組にも敗者復活のチャンスがあります。',teams.map(t=>t.id),play);
    }
    function cards(ids){return `<div class="league-team-grid">${ids.map(id=>`<div class="league-team-card">${portraits(id)}<b>${team(id).name}</b><small>${team(id).members.map(p=>`${member(p).cpu?'CPU':'P'+member(p).no} ${esc(member(p).name)}`).join(' / ')}</small></div>`).join('')}</div>`;}
    function announce(title,text,ids,done){draw(title,`<p class="league-live">${text}</p>${cards(ids)}<button id="leagueNext" class="primary">タップして進む →</button>`);api.beep(950,120,.025);on('leagueNext',done);}
    function reveal(ids,title,text,done){let index=0;const step=()=>{if(index>=ids.length){done();return;}const id=ids[index++];draw(title,`<p class="league-live">${text}</p><div class="league-reveal"><small>進出発表 ${index} / ${ids.length}</small>${cards([id])}<strong>QUALIFIED!</strong></div><button id="leagueNext" class="primary">${index===ids.length?'全チーム決定 →':'次のチームを発表 →'}</button>`);api.beep(600+index*60,160,.025);on('leagueNext',step);};step();}
    function play(){
      if(!league)return;const descriptor=rules.next(league);if(!descriptor)return;
      const ids=[...descriptor.active],ownTicket=ticket,points={};
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
        announce(`${labels[descriptor.phase]} · GAME ${descriptor.round}`,`${api.title(descriptor.key)}${descriptor.multiplier===2?' / ポイント2倍！':''}${batches.length>1?` / 第${heat}組` :''}<br>${descriptor.phase==='final'?'600点到達で点灯。点灯済みチームの単独1位で優勝！':descriptor.phase==='cutoff'?'通過ボーダーが同点！ 反射神経で決着するまで戦います。':''}`,actual,run);
      };
      startHeat();
    }
    function results({event,record}){
      const ids=record.active,cut=record.phase==='qualifier'?8:record.phase==='repechage'?2:0;
      const teamRows=total=>[...ids].sort((a,b)=>(total[b]||0)-(total[a]||0));
      const rows=(total,round)=>teamRows(total).map((id,i)=>{
        const border=cut&&!round&&i===cut-1,qualified=cut&&teamRows(record.totals).slice(0,cut).includes(id),pts=total[id]||0;
        const tied=cut&&teamRows(total)[cut]&&(total[teamRows(total)[cut-1]]||0)===(total[teamRows(total)[cut]]||0)&&pts===(total[teamRows(total)[cut-1]]||0);
        return `<article class="league-rank ${qualified?'qualified':''} ${border?'league-border':''}"><b>${teamRows(total).findIndex(t=>(total[t]||0)===pts)+1}</b><div>${portraits(id)}<strong>${team(id).name}${record.phase==='final'&&(record.totals[id]||0)>=600?' 💡 点灯':''}</strong><small>${team(id).members.map(p=>`${esc(member(p).name)} ${round?record.points[p]||0:record.personal[p]||0}pt`).join(' ＋ ')}</small>${tied?'<em>ボーダー同点・延長対象</em>':''}</div><strong>${pts}pt</strong>${border?`<footer>── ${cut}チーム通過ボーダー ──</footer>`:''}</article>`;
      }).join('');
      const individual=total=>ids.flatMap(id=>team(id).members).sort((a,b)=>(total[b]||0)-(total[a]||0)).map((p,i)=>`<article class="league-rank"><b>${ids.flatMap(id=>team(id).members).filter(id=>(total[id]||0)>(total[p]||0)).length+1}</b><div>${picture(member(p))}<strong>${esc(member(p).name)}</strong><small>${member(p).cpu?'CPU':'P'+member(p).no}</small></div><strong>${total[p]||0}pt</strong></article>`).join('');
      const cutoffRows=teamRows(record.totals),borderText=cut?`通過ボーダー ${cut}位 · ${team(cutoffRows[cut-1]).name} ${record.totals[cutoffRows[cut-1]]||0}pt`:record.phase==='final'?`点灯チーム ${ids.filter(id=>(record.totals[id]||0)>=600).length} / ${ids.length} · 600ptで点灯`:record.phase==='cutoff'?'延長戦の得点だけで通過枠を決定':'点灯済みタッグの優勝決定戦';
      const pages=[['今回の個人順位',individual(record.points)],['今回のチーム順位',rows(record.teamPoints,true)],['ステージ個人総合',individual(record.personal)],['ステージチーム総合',rows(record.totals,false)]];let page=0;
      const show=()=>{const [title,body]=pages[page];draw(title,`<p>${labels[record.phase]} · GAME ${record.round} / ${api.title(record.key)}${record.multiplier===2?' / 2倍ポイント':''}</p><p class="league-live">${record.phase==='final'?'💡600点に達したゲームではまだ優勝できません。点灯後の1位が条件！':cut?`上位${cut}チームが通過！ 同点がボーダーをまたぐ場合は延長戦。`:'一戦ごとの勝負が運命を変える！'}</p><aside class="league-cutline">${borderText}</aside><div class="league-ranks">${body}</div><button id="leagueNext" class="primary league-continue">${page+1} / 4 · タップして次へ →</button>`);on('leagueNext',()=>{if(++page<pages.length)show();else after(event);});};show();
    }
    function after(event){
      if(event.type==='qualified')reveal(event.ids,'予選突破・8チーム発表！','長い予選を勝ち抜いたタッグを、1組ずつ発表します！',()=>announce('残る切符は、あと2枚！','ここからは敗者復活3ゲームマッチ！ 予選ポイントはゼロに戻ります。残る12組、逆転のチャンスをつかめ！',league.active,play));
      else if(event.type==='finalists')reveal(event.wildcards,'敗者復活・2チーム決定！','最後の2枠を勝ち取ったタッグが合流！',()=>announce('決勝ゲーム！！','10チームの最終決戦！ 全ポイントをリセット。600点で点灯し、その後のゲームで1位を取ったタッグが優勝！ 点灯チームが同点1位なら、そのタッグだけで優勝決定戦です。',event.ids,play));
      else if(event.type==='cutoff')announce('ボーダー同点！ 延長戦！',`あと${event.slots}枠をかけて反射神経勝負！ 同点が続けば再戦。ここまでの成績を持ち越さず、この延長戦で決めます！`,event.ids,play);
      else if(event.type==='championship')announce('同点1位！ 優勝決定戦！','点灯済みの同点首位だけが残った！ ランダムゲームで単独1位が決まるまで決戦を続けます！',event.ids,play);
      else if(event.type==='champion')champion(event.ids[0]);
      else if(event.ids.length)announce('MATCH POINT · 点灯！','600点突破！ このタッグは次のゲームから1位を取れば優勝。ほかのタッグは全力で阻止せよ！',event.ids,play);
      else play();
    }
    function champion(id){
      const stats=players.map(p=>{const scores=league.history.map(r=>r.points[p.id]).filter(v=>v!==undefined);return {p,total:scores.reduce((a,b)=>a+b,0),best:Math.max(0,...scores),perfect:league.history.filter(r=>(r.points[p.id]||0)===100*r.multiplier).length,recovery:league.history.filter(r=>r.phase==='repechage').reduce((n,r)=>n+(r.points[p.id]||0),0),played:scores.length};}).filter(s=>s.played);
      const award=(title,key,filter=()=>true)=>{const pool=stats.filter(filter);if(!pool.length)return '';const max=Math.max(...pool.map(s=>s[key]));if(max<=0)return '';return `<section class="league-award"><h2>${title}</h2>${pool.filter(s=>s[key]===max).map(s=>`<div>${picture(s.p)}<b>${esc(s.p.name)}</b><strong>${max}${key==='perfect'?'回':'pt'}</strong></div>`).join('')}</section>`;};
      announce('CHAMPIONS!!',`${team(id).name}、タッグバトルリーグを制覇！ 最高のコンビネーションに大きな拍手を！`,[id],()=>{
        draw('LEAGUE AWARDS',`${cards([id])}${award('MVP · 全大会獲得ポイント','total')}${award('大健闘賞 · 決勝進出外の最高得点','total',s=>!league.direct.concat(league.history.filter(r=>r.phase==='final').flatMap(r=>r.active)).some(t=>team(t).members.includes(s.p.id)))}${award('ベストプレイ賞','best')}${award('パーフェクト賞','perfect')}${award('敗者復活の立役者','recovery')}<button id="leagueFinal" class="primary">最終結果を見る</button>`);
        on('leagueFinal',()=>{const final=league.history.filter(r=>r.phase==='final').at(-1),totals=final?.totals||{};const ids=[id,...(final?.active||[]).filter(t=>t!==id).sort((a,b)=>(totals[b]||0)-(totals[a]||0))];draw('最終結果',`<p>優勝は点灯後の勝利で決定。ほかの決勝進出チームは決勝累計点順です。</p>${ids.map((t,i)=>`<article class="league-rank"><b>${i===0?'優勝':i+1}</b><div>${portraits(t)}<strong>${team(t).name}</strong></div><strong>${totals[t]||0}pt</strong></article>`).join('')}<button id="leagueHome" class="primary">メインメニューへ</button>`);on('leagueHome',()=>{stop();api.home();});});
      });
    }
    return {setup,stop,active:()=>!!league&&!league.champion};
  }};
})();
