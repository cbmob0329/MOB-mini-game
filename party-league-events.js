/* League-wide games: all participants share a round, rather than independent solos. */
(function(root){
  'use strict';
  const shuffle=(items,random=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  function minority(votes){
    const counts=[votes.filter(v=>v.side===0).length,votes.filter(v=>v.side===1).length];
    const retry=counts[0]===counts[1]||counts.includes(0),side=counts[0]<counts[1]?0:1;
    return {counts,retry,survivors:votes.filter(v=>retry||v.side===side).map(v=>v.id),out:votes.filter(v=>!retry&&v.side!==side).map(v=>v.id)};
  }
  function groups(entrants,random=Math.random,mode='tag'){
    const teams=[...new Set(entrants.map(p=>p.teamId))];
    const size=mode==='crew'?4:mode==='king'?1:2,count=mode==='king'?20:mode==='tag'&&teams.length===20?20:10;
    if(teams.length!==count||entrants.length!==count*size||teams.some(t=>entrants.filter(p=>p.teamId===t).length!==size))throw Error('Invalid focus bomb roster');
    const ordered=shuffle(teams,random),heats=Array.from({length:5},()=>[]);
    ordered.forEach((t,i)=>{shuffle(entrants.filter(p=>p.teamId===t),random).forEach((p,j)=>heats[(i+j*2)%5].push(p));});return heats;
  }
  const BOMB_POINTS=[100,80,60,50,40,30,20,15,10,5];
  function simulateBomb(entrants,skill,random=Math.random){
    const measure=list=>rankBombRecords(list.map(p=>({p,...cpuBombRecord(skill(p),random)})),random);
    const top=measure(entrants).slice(0,10),final=measure(top.map(r=>r.p));
    const scores=Object.fromEntries(entrants.map(p=>[p.id,0]));final.forEach((r,i)=>scores[r.p.id]=BOMB_POINTS[i]);return scores;
  }
  const errorAt=elapsed=>Math.abs(Math.round(elapsed*100)-100000)/100;
  const bombRecord=elapsed=>({elapsed:Math.round(elapsed*100)/100,error:errorAt(elapsed)});
  function cpuBombRecord(score,random=Math.random){const error=Math.max(15,Math.round((100-score+random())/101*550));return bombRecord(1000+(random()<.5?-1:1)*error);}
  function rankBombRecords(records,random=Math.random){
    // Draw unique lots before sorting so even identical clock readings have a single winner.
    const ranked=shuffle(records,random).map((r,lot)=>({...r,lot})).sort((a,b)=>a.error-b.error||a.lot-b.lot);
    return ranked.map((r,i)=>({...r,tiebreak:ranked[i-1]?.error===r.error||ranked[i+1]?.error===r.error}));
  }
  const FOODS=[['🍕','ピザ','🍣','お寿司'],['🍔','ハンバーガー','🍜','ラーメン'],['🍓','いちご','🍇','ぶどう'],['🍩','ドーナツ','🍰','ケーキ'],['🍛','カレー','🍝','パスタ'],['🍦','アイス','🍮','プリン'],['🍙','おにぎり','🥪','サンドイッチ'],['🥟','ぎょうざ','🍤','エビフライ']];
  const EXTRA_FOODS=[['🍎','りんご','🍐','なし'],['🍑','もも','🍊','みかん'],['🍌','バナナ','🥝','キウイ'],['🍉','すいか','🍈','メロン'],['🍍','パイン','🥭','マンゴー'],['🍒','さくらんぼ','🫐','ブルーベリー'],['🥐','クロワッサン','🥯','ベーグル'],['🍞','食パン','🥖','フランスパン'],['🥞','パンケーキ','🧇','ワッフル'],['🍫','チョコ','🍪','クッキー'],['🍡','だんご','🍘','せんべい'],['🍵','お茶','☕','コーヒー'],['🥛','牛乳','🧃','ジュース'],['🍋','レモン','🍊','オレンジ'],['🍟','ポテト','🍿','ポップコーン'],['🌭','ホットドッグ','🌮','タコス'],['🍗','チキン','🥩','ステーキ'],['🍲','おなべ','🥗','サラダ'],['🍠','やきいも','🌽','とうもろこし'],['🥔','じゃがいも','🎃','かぼちゃ'],['🍅','トマト','🥒','きゅうり'],['🥕','にんじん','🥦','ブロッコリー'],['🍄','きのこ','🫑','ピーマン'],['🍳','目玉焼き','🥚','ゆで卵'],['🍚','ごはん','🍞','パン'],['🍜','うどん','🍝','パスタ'],['🍱','お弁当','🍔','バーガー'],['🍧','かき氷','🍨','パフェ'],['🥨','プレッツェル','🧀','チーズ'],['🥜','ナッツ','🌰','くり'],['🍯','はちみつ','🍫','チョコソース'],['🍤','天ぷら','🍢','おでん']];
  FOODS.push(...EXTRA_FOODS);
  function questionDeck(random=Math.random){let bag=[],last=null;return ()=>{if(!bag.length){bag=shuffle(FOODS,random);if(bag.length>1&&bag[bag.length-1]===last)[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]];}return last=bag.pop();};}
  function votingTeams(entrants){return [...new Set(entrants.map(p=>p.teamId))].map(id=>({id,members:entrants.filter(p=>p.teamId===id)}));}
  async function run(api){
    const {screen,esc,entrants,valid,beep}=api,random=api.random||Math.random,score=Object.fromEntries(entrants.map(p=>[p.id,0]));
    const human=entrants.some(p=>!p.cpu),sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const image=p=>`<img src="${p.img}" alt="${esc(p.name)}">`;
    function draw(title,body,kind=''){
      if(!valid())return;api.clear();
      screen.innerHTML=`<section class="league-event ${kind}"><header><small>${api.mode==='arena'?'モブくんはゲーム王 · 延長戦':api.mode==='solo'?'SOLO PLAY · CPU対戦':api.mode==='crew'?'CREW LEAGUE':api.mode==='king'?'MOB KING LEAGUE':'TAG BATTLE LEAGUE'}</small><h2>${title}</h2></header><div class="league-event-body">${body}</div></section>`;
      api.top();screen.querySelector('.league-event').style.setProperty('--event-top',Math.max(0,screen.getBoundingClientRect().top)+'px');
    }
    function preview(){if(!root?.MobPresentation||root.MobGamePreviewActive)return;screen.querySelector('.league-event-body').insertAdjacentHTML('afterbegin',root.MobPresentation.preview(api.key,entrants[0],api.key==='minorityMob'?'モブロボドクターは気まぐれ':'モブくん集中大爆弾！',esc));root.MobPresentation.mount(screen);}
    function buttons(options,onSelect=()=>{}){
      return new Promise(resolve=>{if(!valid()){resolve(-1);return;}const host=screen.querySelector('#eventActions');host.innerHTML=options.map((v,i)=>`<button type="button" data-answer="${i}">${v}</button>`).join('');let used=false;host.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(used||!valid())return;onSelect();used=true;host.querySelectorAll('button').forEach(x=>x.disabled=true);resolve(Number(b.dataset.answer));});});
    }
    async function next(label='確認して次へ →'){await buttons([label]);return valid();}
    function roster(list,out=false){return `<div class="event-roster ${out&&list.length>20?'event-roster-crowded':''}" style="--roster-rows:${Math.ceil(list.length/5)}">${list.map(p=>`<article class="${out&&!p.cpu?'human-eliminated':''}">${image(p)}<b>${esc(p.name)}</b><small>${esc(p.team)} · ${p.cpu?'CPU':'P'+p.no}${out?' · 脱落':''}</small></article>`).join('')}</div>`;}
    async function handoff(p,title,detail){draw(title,`<p class="event-call">プレイヤー ${esc(p.name)}！</p><div class="event-portrait">${image(p)}</div><p>${esc(p.team)} · P${p.no}</p><p>${detail}</p><div id="eventActions"></div>`);return next('準備OK');}
    if(api.key==='minorityMob')return (root?.MobDoctorGame||require('./party-doctor-game.js')).run(api);
    if(root?.MobGamePreviewActive){await attempt(entrants.find(p=>!p.cpu)||entrants[0],'1 SECOND STOPWATCH',true);return;}
    draw('モブくん集中大爆弾！',`<div class="bomb-logo">MOB PARTY GAME<br><b>SECRET STOP!</b></div><p>全員が順番に1秒ストップ！ CPUはまとめて高速計測。</p><p>記録は秘密。全員の計測後にTOP10を一括発表。上位10名が新しい記録で決勝へ！</p><p>決勝は10位から発表。最後の2人は3・2・1で勝者発表！</p><div id="eventActions"></div>`,'event-bomb');
    if(!(await next('準備OK · 計測へ')))return;
    async function attempt(p,label,hidden=false){
      if(p.cpu){const core=root?.MobPartyCore;return cpuBombRecord(core?core.cpuScore(core.characterRank(p,{key:'focusBombMob',title:'モブくん集中大爆弾！'},random),random):random()*100,random);}
      if(!(await handoff(p,label,'STARTを押してから1秒ちょうどでSTOP！ 1.00000秒との差が小さいほど有利です。')))return null;
      draw(label,`<p class="event-call">${esc(p.name)} · 1.00000秒を狙え！</p><div class="bomb-stopwatch"><i class="bomb-fuse"></i><span>TARGET 1.00000 s</span><output id="bombTime">0.00000</output><small>SECONDS</small></div><p id="bombMeasure">STARTで計測開始</p><div id="eventActions"></div>`,'event-bomb');
      let start=0,stop=0;
      await buttons(['START'],()=>{start=performance.now();});if(!valid())return null;
      const clock=screen.querySelector('#bombTime'),bomb=screen.querySelector('.bomb-stopwatch');
      let raf,stopped=false,timeout;
      bomb.classList.add('ticking');screen.querySelector('#bombMeasure').textContent='1秒ちょうどでSTOP！';
      const frame=now=>{if(!valid()||stopped)return;clock.textContent=hidden?'?.?????':(Math.max(0,Math.min(3000,now-start))/1000).toFixed(5);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
      const timedOut=await Promise.race([buttons(['STOP'],()=>{stop=performance.now();}).then(()=>false),new Promise(resolve=>{timeout=setTimeout(()=>resolve(true),3000);})]);
      stopped=true;clearTimeout(timeout);cancelAnimationFrame(raf);if(!valid())return null;
      const record=bombRecord(timedOut?3000:Math.min(3000,stop-start)),{elapsed,error}=record;
      clock.textContent=hidden?'?.?????':(elapsed/1000).toFixed(5);bomb.classList.remove('ticking');bomb.classList.add(hidden?'stopped':timedOut?'exploded':error<=30?'defused':'stopped');
      screen.querySelector('#bombMeasure').textContent=hidden?'記録を封印しました。全員が終わるまで秘密です！':(timedOut?'爆発！ 自動停止 / ':'')+'1.00000秒との差 '+(error/1000).toFixed(5)+'秒';beep(hidden?650:error<=30?1100:timedOut?120:450,150,.03);
      if(!(await next(hidden?'記録を保存 · 次へ →':'記録を確認 · 次へ →')))return null;return record;
    }
    async function contest(list,label){
      const records=[];
      // CPU entries are calculated together, with no individual handoffs or result pages.
      for(const p of list.filter(p=>p.cpu)){if(!valid())return [];records.push({p,...await attempt(p,label,true)});}
      if(records.length){draw(label,`<p class="event-call">CPU ${records.length}名の計測完了！</p><p>記録はすべて封印。人間プレイヤーの挑戦です！</p>`,'event-bomb');await sleep(350);}
      for(const p of list.filter(p=>!p.cpu)){if(!valid())return [];const record=await attempt(p,label,true);if(record===null)return [];records.push({p,...record});}
      return rankBombRecords(records,random);
    }
    let finalists=entrants;
    if(api.mode!=='arena'){
      const qualifying=await contest(entrants,'予選 · 秘密の1秒チャレンジ');if(!valid()||qualifying.length!==entrants.length)return;
      const top=qualifying.slice(0,10);finalists=top.map(r=>r.p);
      draw('結果発表！ TOP '+top.length,`<p>上位${top.length}名が決勝進出！ 予選の記録は決勝に持ち越しません。</p><div class="bomb-top-ten">${top.map((r,i)=>`<article class="${!r.p.cpu?'bomb-human':''}"><b>${i+1}</b>${image(r.p)}<div><strong>${esc(r.p.name)}</strong><small>${(r.elapsed/1000).toFixed(5)}秒</small></div></article>`).join('')}</div><div id="eventActions"></div>`,'event-bomb event-reveal');
      if(!(await next('TOP '+top.length+' · 決勝へ')))return;
    }
    const ranked=await contest(finalists,'FINAL · 秘密の1秒チャレンジ');if(!valid()||ranked.length!==finalists.length)return;
    ranked.forEach((r,i)=>score[r.p.id]=BOMB_POINTS[i]||0);
    draw('決勝の結果発表！',`<p class="event-call">全員の記録が揃いました！</p><p>${ranked.length}位から発表。最後の2人は運命のカウントダウン！</p><div id="eventActions"></div>`,'event-bomb');
    if(!(await next('結果を見る')))return;
    function resultCard(r,i){return `<article class="bomb-result" data-bomb-rank="${i+1}"><b class="bomb-result-rank">${i+1}位</b>${image(r.p)}<h3>${esc(r.p.name)}</h3><p>${esc(r.p.team)}</p><output>${(r.elapsed/1000).toFixed(5)}<small> 秒</small></output><p>1秒との差 ${(r.error/1000).toFixed(5)}秒</p><strong>${score[r.p.id]} pt</strong>${r.tiebreak?'<p>同じ誤差の選手間は抽選で順位確定</p>':''}</article>`;}
    for(let i=ranked.length-1;i>=2;i--){
      draw('FINAL RESULT · '+(i+1)+'位',resultCard(ranked[i],i)+'<div id="eventActions"></div>','event-bomb event-reveal');
      if(!(await next(i===2?'最後の2人へ！':i+'位を見る')))return;
    }
    const lastTwo=shuffle(ranked.slice(0,2),random);
    const versus=()=>'<div class="bomb-final-two">'+lastTwo.map(r=>`<article>${image(r.p)}<strong>${esc(r.p.name)}</strong><small>${esc(r.p.team)}</small></article>`).join('')+'</div>';
    draw('勝つのはどっちだ！？',versus()+'<p class="event-call">最後の2人、運命の瞬間です！</p><div id="eventActions"></div>','event-bomb');
    if(!(await next('優勝者を発表！')))return;
    for(const n of [3,2,1]){draw('勝つのはどっちだ！？',versus()+`<strong class="bomb-final-count" aria-live="assertive">${n}</strong>`,'event-bomb');beep(450+(3-n)*180,150,.03);await sleep(800);if(!valid())return;}
    draw('集中爆弾 · GAME WINNER!',`<div class="bomb-win-burst" aria-hidden="true">${Array.from({length:18},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>${resultCard(ranked[0],0)}${ranked[1]?`<div class="bomb-runner-up" data-bomb-rank="2">2位 · ${esc(ranked[1].p.name)} · ${(ranked[1].elapsed/1000).toFixed(5)}秒 · ${score[ranked[1].p.id]}pt</div>`:''}<p>このゲームの優勝者です！ 大会の判定は次のリザルトへ。</p><div id="eventActions"></div>`,'event-bomb bomb-game-winner');beep(1400,300,.04);
    if(!(await next('大会リザルトへ')))return;
    if(valid())api.done(score);
  }
  const api={BOMB_POINTS,simulateBomb,cpuBombRecord,minority,questionDeck,votingTeams,FOODS,groups,errorAt,bombRecord,rankBombRecords,run};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobLeagueEvents=api;
})(typeof window!=='undefined'?window:null);
