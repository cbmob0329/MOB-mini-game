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
    const heats=api.mode==='arena'?[]:groups(entrants,random,api.mode),finalists=[];
    if(root?.MobGamePreviewActive){await attempt(entrants.find(p=>!p.cpu)||entrants[0],'1 SECOND STOPWATCH');return;}
    if(api.mode!=='arena'){draw('モブくん集中大爆弾！',`<div class="bomb-logo">1.00000<br><b>SECOND</b></div><p>${heats[0].length}人×5グループ。爆弾型ストップウォッチを1秒ちょうどで止め、一番近い1人が勝ち上がり！</p><p>STARTで計測開始、STOPで停止。3秒で爆発・自動停止。予選敗退は0点。決戦は1位から100・80・60・50・40点。</p><p>0.00001秒単位で判定。同じ誤差の場合だけ抽選で順位確定。決戦の記録は5位から発表！${api.mode==='solo'?'CPU相手に1位を目指そう！':'点灯済みチームの選手が1位なら優勝！'}</p><div id="eventActions"></div>`,'event-bomb');
    preview();if(!(await next('5グループの勝負へ →')))return;}
    async function attempt(p,label,hidden=false){
      if(p.cpu){const core=root?.MobPartyCore;return cpuBombRecord(core?core.cpuScore(core.characterRank(p,{key:'focusBombMob',title:'モブくん集中大爆弾！'},random),random):random()*100,random);}
      if(!(await handoff(p,label,'STARTを押してから1秒ちょうどでSTOP！ 1.00000秒との差が小さいほど有利です。')))return null;
      draw(label,`<p class="event-call">${esc(p.name)} · 1.00000秒を狙え！</p><div class="bomb-stopwatch"><i class="bomb-fuse"></i><span>TARGET 1.00000 s</span><output id="bombTime">0.00000</output><small>SECONDS</small></div><p id="bombMeasure">STARTで計測開始</p><div id="eventActions"></div>`,'event-bomb');
      let start=0,stop=0;
      await buttons(['START'],()=>{start=performance.now();});if(!valid())return null;
      const clock=screen.querySelector('#bombTime'),bomb=screen.querySelector('.bomb-stopwatch');
      let raf,stopped=false,timeout;
      bomb.classList.add('ticking');screen.querySelector('#bombMeasure').textContent='1秒ちょうどでSTOP！';
      const frame=now=>{if(!valid()||stopped)return;clock.textContent=(Math.max(0,Math.min(3000,now-start))/1000).toFixed(5);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
      const timedOut=await Promise.race([buttons(['STOP'],()=>{stop=performance.now();}).then(()=>false),new Promise(resolve=>{timeout=setTimeout(()=>resolve(true),3000);})]);
      stopped=true;clearTimeout(timeout);cancelAnimationFrame(raf);if(!valid())return null;
      const record=bombRecord(timedOut?3000:Math.min(3000,stop-start)),{elapsed,error}=record;
      clock.textContent=hidden?'?.?????':(elapsed/1000).toFixed(5);bomb.classList.remove('ticking');bomb.classList.add(hidden?'stopped':timedOut?'exploded':error<=30?'defused':'stopped');
      screen.querySelector('#bombMeasure').textContent=hidden?'記録を保存しました。5位から順に発表！':(timedOut?'爆発！ 自動停止 / ':'')+'1.00000秒との差 '+(error/1000).toFixed(5)+'秒';beep(hidden?650:error<=30?1100:timedOut?120:450,150,.03);
      if(!(await next(hidden?'記録を保存 · 次へ →':'記録を確認 · 次へ →')))return null;return record;
    }
    async function contest(list,label,hidden=false){
      const records=[];
      for(const p of list){if(!valid())return [];const record=await attempt(p,label,hidden);if(record===null)return [];records.push({p,...record});}
      return rankBombRecords(records,random);
    }
    if(api.mode==='arena'){
      draw('集中大爆弾 · 優勝決定戦',`<p class="event-call">1.00000秒に近いのは誰だ！</p><p>延長戦の出場者で一斉に記録比較。1〜5位は100・80・60・50・40点、6位以下は0点。チームは代表の合計で勝負。延長戦の得点は累計に加算しません。</p><div id="eventActions"></div>`,'event-bomb');if(!(await next('準備OK · 集中爆弾へ')))return;
      const ranked=await contest(entrants,'集中大爆弾 · 延長戦');if(!valid()||ranked.length!==entrants.length)return;
      ranked.forEach((r,i)=>score[r.p.id]=[100,80,60,50,40][i]||0);api.done(score);return;
    }
    for(let i=0;i<heats.length;i++){
      if(!valid())return;draw('GROUP '+(i+1)+' / 5',`<p>この${heats[i].length}人から1人だけが決戦へ！</p>${roster(heats[i])}<div id="eventActions"></div>`,'event-bomb');if(!(await next('グループ開始 →')))return;
      const ranked=await contest(heats[i],'GROUP '+(i+1));if(!valid()||!ranked.length)return;finalists.push(ranked[0].p);
      draw('決戦進出！',`<p class="event-call">${esc(ranked[0].p.name)}が勝ち上がり！</p>${roster([ranked[0].p])}${ranked[0].tiebreak?'<p>同じ誤差のため、抽選で進出者を決定しました。</p>':''}<p>ほかの${heats[i].length-1}人は0ポイント。挑戦に拍手を！</p><div id="eventActions"></div>`,'event-reveal');if(!(await next()))return;
    }
    draw('5人の優勝決定戦！',`<p>最後の一撃。最も1.00000秒に近いのは誰だ！？ 記録は5位から発表！</p>${roster(finalists)}<div id="eventActions"></div>`,'event-bomb');if(!(await next('最終決戦へ →')))return;
    const ranked=await contest(finalists,'FINAL · 集中大爆弾',true);if(!valid()||ranked.length!==5)return;
    ranked.forEach((r,i)=>score[r.p.id]=[100,80,60,50,40][i]);
    draw('決戦の結果発表！',`<p class="event-call">全員の記録が揃いました。</p><p>5位から1人ずつ発表。1.00000秒に一番近いのは…？</p><div id="eventActions"></div>`,'event-suspense');
    if(!(await next('5位の記録を見る →')))return;
    for(let i=4;i>=0;i--){
      draw(`${i+1}位の記録は…！`,`<strong class="event-countdown">${i+1}</strong><p class="event-call">${i===0?'いよいよ1位の発表！':'運命の記録を公開…'}</p>`,'event-suspense');
      beep(450+(4-i)*100,120,.025);await sleep(human?850:250);if(!valid())return;
      const r=ranked[i];
      draw(`FINAL RESULT · ${i+1}位`,`<article class="bomb-result" data-bomb-rank="${i+1}"><b class="bomb-result-rank">${i+1}位</b>${image(r.p)}<h3>${esc(r.p.name)}</h3><p>${esc(r.p.team)}</p><output>${(r.elapsed/1000).toFixed(5)}<small> 秒</small></output><p>1.00000秒との差 <b>${(r.error/1000).toFixed(5)}秒</b></p><strong>${score[r.p.id]} pt</strong>${r.tiebreak?'<p>同じ誤差の選手間は抽選で順位確定</p>':''}</article><div id="eventActions"></div>`,'event-bomb event-reveal');
      if(!(await next(i>0?`${i}位の記録を見る →`:'大会リザルトへ →')))return;
    }
    api.done(score);
  }
  const api={cpuBombRecord,minority,questionDeck,votingTeams,FOODS,groups,errorAt,bombRecord,rankBombRecords,run};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobLeagueEvents=api;
})(typeof window!=='undefined'?window:null);
