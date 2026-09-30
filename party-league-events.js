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
    const size=mode==='crew'?4:mode==='king'?1:2,count=mode==='king'?20:10;
    if(teams.length!==count||entrants.length!==count*size||teams.some(t=>entrants.filter(p=>p.teamId===t).length!==size))throw Error('Invalid focus bomb roster');
    const ordered=shuffle(teams,random),heats=Array.from({length:5},()=>[]);
    ordered.forEach((t,i)=>{shuffle(entrants.filter(p=>p.teamId===t),random).forEach((p,j)=>heats[(i+j*2)%5].push(p));});return heats;
  }
  const errorAt=(elapsed,period,phase)=>Math.round(Math.abs(Math.sin(elapsed/period*Math.PI*2+phase))*50000);
  const FOODS=[['🍕','ピザ','🍣','お寿司'],['🍔','ハンバーガー','🍜','ラーメン'],['🍓','いちご','🍇','ぶどう'],['🍩','ドーナツ','🍰','ケーキ'],['🍛','カレー','🍝','パスタ'],['🍦','アイス','🍮','プリン'],['🍙','おにぎり','🥪','サンドイッチ'],['🥟','ぎょうざ','🍤','エビフライ']];
  async function run(api){
    const {screen,esc,entrants,valid,beep}=api,random=api.random||Math.random,score=Object.fromEntries(entrants.map(p=>[p.id,0]));
    const human=entrants.some(p=>!p.cpu),sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const image=p=>`<img src="${p.img}" alt="${esc(p.name)}">`;
    function draw(title,body,kind=''){
      if(!valid())return;api.clear();
      screen.innerHTML=`<section class="league-event ${kind}"><header><small>${api.mode==='crew'?'CREW LEAGUE':api.mode==='king'?'MOB KING LEAGUE':'TAG BATTLE LEAGUE'}</small><h2>${title}</h2></header><div class="league-event-body">${body}</div></section>`;
      api.top();screen.querySelector('.league-event').style.setProperty('--event-top',Math.max(0,screen.getBoundingClientRect().top)+'px');
    }
    function buttons(options){
      return new Promise(resolve=>{if(!valid()){resolve(-1);return;}const host=screen.querySelector('#eventActions');host.innerHTML=options.map((v,i)=>`<button type="button" data-answer="${i}">${v}</button>`).join('');let used=false;host.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(used||!valid())return;used=true;host.querySelectorAll('button').forEach(x=>x.disabled=true);resolve(Number(b.dataset.answer));});});
    }
    async function next(label='確認して次へ →'){await buttons([label]);return valid();}
    function roster(list,out=false){return `<div class="event-roster ${out&&list.length>20?'event-roster-crowded':''}" style="--roster-rows:${Math.ceil(list.length/5)}">${list.map(p=>`<article class="${out&&!p.cpu?'human-eliminated':''}">${image(p)}<b>${esc(p.name)}</b><small>${esc(p.team)} · ${p.cpu?'CPU':'P'+p.no}${out?' · 脱落':''}</small></article>`).join('')}</div>`;}
    async function handoff(p,title,detail){draw(title,`<p class="event-call">プレイヤー ${esc(p.name)}！</p><div class="event-portrait">${image(p)}</div><p>${esc(p.team)} · P${p.no}</p><p>${detail}</p><div id="eventActions"></div>`);return next('準備OK');}
    if(api.key==='minorityMob'){
      draw('モブくんは少数派',`<div class="food-preview" aria-hidden="true">🍕 VS 🍣</div><p>2つの食べ物から、選ぶ人が少ないと思う方へ投票！</p><p>多数派は脱落。最後の1〜2人は100点。脱落者も勝ち残った段階に応じて20・40・60・80点（上限80点）を獲得！同数・全員同じなら再投票し、得点段階は進みません。</p><p>選ぶ時はスマホをほかの人に見られないように！</p><div id="eventActions"></div>`);
      if(!(await next('全員準備OK · 投票開始')))return;
      let alive=[...entrants],round=0,lastFood=-1,eliminationStage=0;
      while(alive.length>2&&valid()){
        round++;let fi=Math.floor(random()*(FOODS.length-1));if(fi>=lastFood&&lastFood>=0)fi++;lastFood=fi;const f=FOODS[fi],votes=[];
        for(const p of alive){
          if(!valid())return;
          let side=random()<.5?0:1;
          if(!p.cpu){
            if(!(await handoff(p,'秘密の投票 · ROUND '+round,'準備OKを押すと選択肢が出ます。ほかの人に画面を見せずに選んでください。')))return;
            draw('どちらが少数派？',`<p>${esc(p.name)} · 残り${alive.length}人</p><p>選択は秘密。少ないと思う方を選ぼう！</p><div id="eventActions" class="food-options"></div>`);
            side=await buttons([`<span role="img" aria-label="${f[1]}">${f[0]}</span><b>${f[1]}</b>`,`<span role="img" aria-label="${f[3]}">${f[2]}</span><b>${f[3]}</b>`]);
          }
          if(!valid())return;votes.push({id:p.id,side});
          // Replace the choice immediately so the next person cannot read it.
          if(!p.cpu)draw('投票を受け付けました',`<p class="event-call">選択は秘密です。</p><p>次のプレイヤーへ端末を渡してください。</p>`);
        }
        if(!valid())return;const result=minority(votes);
        draw('全ての票が揃いました！',`<p class="event-call">端末をみんなに見せて、結果を確認しよう！</p><div id="eventActions"></div>`,'event-suspense');
        if(!(await next('みんなで結果を見る')))return;
        draw('結果発表！',`<p class="event-call">どちらが少数派？</p><strong id="voteCountdown" class="event-countdown">3</strong>`,'event-suspense');
        for(const n of [3,2,1]){if(!valid())return;screen.querySelector('#voteCountdown').textContent=n;beep(380+n*140,100,.025);await sleep(human?850:180);}
        if(!valid())return;
        draw('投票結果！',`<div class="vote-totals"><div><span>${f[0]}</span><b>${f[1]}</b><strong>${result.counts[0]}票</strong></div><div><span>${f[2]}</span><b>${f[3]}</b><strong>${result.counts[1]}票</strong></div></div><p class="event-call">${result.retry?'脱落なし！ 別のお題でもう一度！':'多数派は脱落！ 少数派の'+result.survivors.length+'人が勝ち残り！'}</p><div id="eventActions"></div>`,'event-reveal');
        beep(result.retry?480:180,200,.03);if(!(await next(result.retry?'次のお題へ →':'脱落者を発表 →')))return;
        if(result.retry)continue;
        const losers=alive.filter(p=>result.out.includes(p.id));alive=alive.filter(p=>result.survivors.includes(p.id));
        const earned=Math.min(80,++eliminationStage*20);losers.forEach(p=>score[p.id]=earned);
        for(let page=0;page<losers.length;page+=4){
          draw('ELIMINATED · 脱落者発表',`<p>ROUND ${round} · 残り${alive.length}人 · 脱落者は${earned}ポイント獲得</p><div class="elimination-results">${losers.slice(page,page+4).map(p=>`<article class="${p.cpu?'':'human-eliminated'}">${image(p)}<span><b>${esc(p.name)}</b><small>${esc(p.team)} · ${p.cpu?'CPU':'P'+p.no}</small></span><strong>${earned}<small> pt</small></strong></article>`).join('')}</div><p class="event-note">${page+1}〜${Math.min(page+4,losers.length)} / ${losers.length}人</p><div id="eventActions"></div>`,'event-eliminated');
          if(!(await next(page+4<losers.length?'次の脱落者を見る →':'確認して次へ →')))return;
        }
      }
      if(!valid())return;alive.forEach(p=>score[p.id]=100);
      draw('少数派の勝者！',`<p class="event-call">${alive.length===2?'2人が同率1位！':'最後の1人！'} 100ポイント獲得！</p>${roster(alive)}<div id="eventActions"></div>`,'event-reveal');
      if(await next('大会リザルトへ →'))api.done(score);return;
    }
    const heats=groups(entrants,random,api.mode),finalists=[];
    draw('モブくん集中大爆弾！',`<div class="bomb-logo">MOB PARTY<br><b>GAME</b></div><p>${heats[0].length}人×5グループ。ゲージを中央で止め、一番近い1人が勝ち上がり！</p><p>予選敗退は0点。勝ち上がった5人の決戦は、1位から100・80・60・50・40点。</p><p>誤差は0.001単位。同じ誤差なら該当者だけ再挑戦。点灯済みチームの選手が1位なら、そのチームが優勝！</p><div id="eventActions"></div>`,'event-bomb');
    if(!(await next('5グループの勝負へ →')))return;
    async function attempt(p,label){
      if(p.cpu){const core=root?.MobPartyCore;return core?Math.round((100-core.cpuScore(core.characterRank(p,{key:'focusBombMob',title:'モブくん集中大爆弾！'},random),random)+random())/101*50000):Math.floor(random()*50001);}
      if(!(await handoff(p,label,'準備OKでゲージが動きます。中央の線を狙い、STOPを1回押してください。')))return null;
      draw(label,`<p class="event-call">${esc(p.name)} · 中央を狙え！</p><div class="bomb-logo">MOB PARTY<br><b>GAME</b></div><div class="bomb-gauge" role="img" aria-label="中央の線を狙う移動ゲージ"><i class="bomb-center"></i><i id="bombNeedle"></i><b>CENTER</b></div><p id="bombMeasure">誤差 0.001 単位で判定</p><div id="eventActions"></div>`,'event-bomb');
      const needle=screen.querySelector('#bombNeedle'),start=performance.now(),period=850+random()*200,phase=random()*Math.PI*2;
      let raf,stopped=false;
      const frame=now=>{if(!valid()||stopped)return;needle.style.left=(50+50*Math.sin((now-start)/period*Math.PI*2+phase))+'%';raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
      await buttons(['STOP']);stopped=true;cancelAnimationFrame(raf);if(!valid())return null;
      const elapsed=performance.now()-start,error=errorAt(elapsed,period,phase);needle.style.left=(50+50*Math.sin(elapsed/period*Math.PI*2+phase))+'%';
      screen.querySelector('#bombMeasure').textContent='中央からの誤差 '+(error/1000).toFixed(3);beep(error<2000?1100:450,150,.03);
      if(!(await next('記録を確認 · 次へ →')))return null;return error;
    }
    async function contest(list,label){
      const records=[];
      for(const p of list){if(!valid())return [];const error=await attempt(p,label);if(error===null)return [];records.push({p,error});}
      records.sort((a,b)=>a.error-b.error);const ordered=[];
      for(let i=0;i<records.length;){let j=i+1;while(j<records.length&&records[j].error===records[i].error)j++;
        if(j-i===1)ordered.push(records[i]);else{
          draw('0.001まで同点！',`<p>該当する${j-i}人だけで再挑戦。中央への集中力で決着をつけよう！</p>${roster(records.slice(i,j).map(r=>r.p))}<div id="eventActions"></div>`,'event-suspense');
          if(!(await next('同点決着戦へ →')))return [];ordered.push(...await contest(records.slice(i,j).map(r=>r.p),label+' · 同点決着戦'));
        }i=j;
      }return ordered;
    }
    for(let i=0;i<heats.length;i++){
      if(!valid())return;draw('GROUP '+(i+1)+' / 5',`<p>この${heats[i].length}人から1人だけが決戦へ！</p>${roster(heats[i])}<div id="eventActions"></div>`,'event-bomb');if(!(await next('グループ開始 →')))return;
      const ranked=await contest(heats[i],'GROUP '+(i+1));if(!valid()||!ranked.length)return;finalists.push(ranked[0].p);
      draw('決戦進出！',`<p class="event-call">${esc(ranked[0].p.name)}が勝ち上がり！</p>${roster([ranked[0].p])}<p>ほかの${heats[i].length-1}人は0ポイント。挑戦に拍手を！</p><div id="eventActions"></div>`,'event-reveal');if(!(await next()))return;
    }
    draw('5人の優勝決定戦！',`<p>最後の一撃。最も中央に近いのは誰だ！？</p>${roster(finalists)}<div id="eventActions"></div>`,'event-bomb');if(!(await next('最終決戦へ →')))return;
    const ranked=await contest(finalists,'FINAL · 集中大爆弾');if(!valid()||ranked.length!==5)return;
    ranked.forEach((r,i)=>score[r.p.id]=[100,80,60,50,40][i]);api.done(score);
  }
  const api={minority,groups,errorAt,run};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobLeagueEvents=api;
})(typeof window!=='undefined'?window:null);
