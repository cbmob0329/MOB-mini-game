(()=>{
  'use strict';
  const core=window.MobPartyCore;
  window.MobPartyGames={create(api){
    const {screen,esc}=api;
    let run=0;
    const valid=()=>api.valid(run);
    const portrait=p=>`<img src="${p.img}" alt="${esc(p.name)}">`;
    const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    function shell(title,body){screen.innerHTML=`<section class="party-event"><header><small>TEAM REPRESENTATIVES</small><h2>${title}</h2><p>各チーム最大2人 · 1人最大100点</p></header>${body}</section>`;api.top();}
    async function chooseRepresentatives(teams){
      const entrants=[];
      for(const team of teams){
        if(!valid())return [];
        const needed=Math.min(2,team.members.length);
        if(team.members.length<=2||team.members.every(p=>p.cpu)){
          const offset=api.round()%team.members.length;
          entrants.push(...Array.from({length:needed},(_,i)=>({...team.members[(offset+i)%team.members.length],team:team.name})));
          continue;
        }
        shell('代表メンバーを選ぼう',`<h3>${esc(team.name)}</h3><p>${needed}人を選択してください。控えのメンバーはこの種目では加点されません。</p><div class="party-reps">${team.members.map(p=>`<button data-rep="${p.id}" aria-pressed="false">${portrait(p)}<b>${esc(p.name)}</b></button>`).join('')}</div><button id="repConfirm" class="party-primary" disabled>0 / ${needed}人</button>`);
        const chosen=new Set(),button=screen.querySelector('#repConfirm');
        screen.querySelectorAll('[data-rep]').forEach(b=>b.onclick=()=>{const id=b.dataset.rep;if(chosen.has(id))chosen.delete(id);else if(chosen.size<needed)chosen.add(id);b.setAttribute('aria-pressed',String(chosen.has(id)));button.disabled=chosen.size!==needed;button.textContent=`${chosen.size} / ${needed}人 · 決定`;});
        await new Promise(resolve=>button.onclick=resolve);
        if(!valid())return [];
        entrants.push(...team.members.filter(p=>chosen.has(p.id)).map(p=>({...p,team:team.name})));
      }
      return entrants;
    }
    function choice(options,timeout=0){
      return new Promise(resolve=>{
        const choiceRun=run;
        let settled=false,timer=null;
        const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);screen.querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true;b.onclick=null;});resolve(value);};
        screen.querySelector('#eventChoices').innerHTML=(timeout?`<div class="party-choice-clock" role="timer" aria-label="制限時間${timeout/1000}秒"><span style="animation-duration:${timeout}ms"></span><small>${timeout/1000}秒以内に選択</small></div>`:'')+options.map((text,i)=>`<button data-choice="${i}">${text}</button>`).join('');
        screen.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>finish(Number(b.dataset.choice)));
        if(timeout)timer=setTimeout(()=>{if(api.valid(choiceRun))finish(-1);else{settled=true;resolve(-1);}},timeout);
      });
    }
    function standings(slots){return `<div class="party-event-roster">${slots.map(s=>`<div class="${s.out?'out':''}">${portrait(s)}<span>${esc(s.team)}<b>${esc(s.name)}</b><em>${s.score} pt${s.out?' · FINISH':''}</em></span></div>`).join('')}</div>`;}
    async function handoff(s,title){
      shell(title,`<p class="party-event-call">${esc(s.team)} · ${esc(s.name)} の番です</p><div class="party-event-actor">${portrait(s)}</div><p>端末を受け取ったら準備OKを押してください。</p><div id="eventChoices"></div>`);
      await choice(['準備OK']);
    }
    async function reveal(s,title,message,kind,ownRun){
      if(!api.valid(ownRun))return;
      shell(title,`<div class="party-reveal ${kind}"><div class="party-event-actor">${portrait(s)}</div><strong>${esc(s.name)}</strong><p>${esc(s.team)}</p><p class="party-event-call">${message}</p></div><div id="eventChoices"></div>`);
      api.beep(kind==='danger'?140:850,160,.025);
      await pause(950);if(!api.valid(ownRun))return;
      await choice(['確認して次へ →']);
    }
    async function start(index){
      run=api.begin(index);
      const ownRun=run;
      const teams=api.teams();
      let slots=await chooseRepresentatives(teams);
      if(!api.valid(ownRun))return;
      const key=api.games[index].key;
      // Solo games get three unique guests without adding them to tournament totals.
      if(api.solo()){
        const used=new Set(slots.map(p=>p.img));
        const guests=core.roster.filter(c=>!used.has(c.img)).slice(0,3);
        slots.push(...guests.map((c,i)=>({...c,id:`guest${i}`,cpu:true,guest:true,team:`CPU ${i+1}`})));
      }
      slots=slots.map(s=>({...s,score:0,lives:2,out:false,bank:0,scouts:1}));
      api.representatives(slots.filter(s=>!s.guest).map(s=>s.id));
      shell(api.games[index].title,`${standings(slots)}<p class="party-event-call">${slots.length}人がエントリー！ スマホを順番に渡して挑戦しよう。</p><div id="eventChoices"></div>`);
      await choice(['全員準備OK · スタート']);if(!api.valid(ownRun))return;
      if(key==='deathGameChallenge')await doors(slots,ownRun);
      else if(key==='colorBridgeParty')await bridge(slots,ownRun);
      else await treasure(slots,ownRun);
      if(!api.valid(ownRun))return;
      const ordered=[...slots].sort((a,b)=>b.score-a.score);
      shell('RESULT',`<p class="party-event-call">${esc(ordered[0].name)} がトップ！ ${ordered[0].score} pt</p>${standings(ordered)}<div id="eventChoices"></div>`);
      api.beep(940,120,.025);
      await choice(['この結果で進む →']);if(!api.valid(ownRun))return;
      api.finish(index,slots.filter(s=>!s.guest));
    }
    async function doors(slots,ownRun){
      const order=[...slots].sort(()=>Math.random()-.5);
      let round=0;
      while(slots.filter(s=>!s.out).length>1&&api.valid(ownRun)){
        round++;
        const alive=order.filter(s=>!s.out),doorCount=alive.length,free=Array.from({length:doorCount},(_,i)=>i);
        const dangerous=Math.floor(Math.random()*doorCount),choices=[];
        for(const s of alive){
          if(!api.valid(ownRun))return;
          let pick;
          if(s.cpu)pick=Math.floor(Math.random()*free.length);
          else{
            shell('モブくんデスゲーム',`<p class="party-event-call">ROUND ${round} · ${esc(s.team)} / ${esc(s.name)}</p><div class="party-event-actor">${portrait(s)}</div><p>安全な扉はどれ？ 1つの扉が消滅します。</p><div id="eventChoices" class="party-door-choices"></div>`);
            pick=await choice(free.map(n=>`🚪 ${n+1}`),12000);
            if(pick<0)pick=0;
          }
          if(!api.valid(ownRun))return;
          choices.push({s,door:free.splice(pick,1)[0]});
        }
        const loser=choices.find(x=>x.door===dangerous).s;
        loser.out=true;
        const place=alive.length;
        loser.score=place===2?70:place===3?50:Math.round((slots.length-place)/Math.max(1,slots.length-3)*40);
        shell('運命の扉が開く…',`<p class="party-event-call">ROUND ${round} · 残り${alive.length}人</p><div class="party-door-reveal">🚪</div><p>誰の扉が消える…？</p>`);
        api.beep(260,130,.02);await pause(1100);if(!api.valid(ownRun))return;
        await reveal(loser,'ELIMINATED / 脱落',`${dangerous+1}番の扉が崩壊！<br>${place}位 · ${loser.score}点<br>生存者は残り${alive.length-1}人`, 'danger',ownRun);
      }
      const winner=slots.find(s=>!s.out);if(winner)winner.score=100;
    }
    async function bridge(slots,ownRun){
      for(let round=1;round<=5;round++){
        if(!api.valid(ownRun))return;
        for(const s of slots.filter(s=>!s.out)){
          if(!api.valid(ownRun))return;
          const length=round+2,route=Array.from({length},()=>Math.floor(Math.random()*3));
          let safe=true;
          if(s.cpu){const strength=core.cpuScore(s.rank);safe=Math.random()<Math.max(.18,.84+strength/550-round*.10);}
          else{
            await handoff(s,`カラーブリッジ · STAGE ${round} / 5`);if(!api.valid(ownRun))return;
            shell('モブくんカラーブリッジ',`<p class="party-event-call">STAGE ${round} / 5 · ${esc(s.name)} · ♥ ${s.lives}</p><p id="bridgeHint">${length}歩の安全なルートを順番に覚えよう</p><div class="party-bridge">${[0,1,2].map(()=>'<div>?</div>').join('')}</div><div id="eventChoices"></div>`);
            const tiles=[...screen.querySelectorAll('.party-bridge div')];
            for(let step=0;step<length;step++){
              if(!api.valid(ownRun))return;
              screen.querySelector('#bridgeHint').textContent=`記憶 ${step+1} / ${length}`;
              tiles.forEach((el,i)=>{el.textContent=i===route[step]?'○':'×';el.classList.toggle('danger',i!==route[step]);});
              await pause(Math.max(300,780-round*80));if(!api.valid(ownRun))return;
              tiles.forEach(el=>{el.textContent='?';el.classList.remove('danger');});await pause(160);
            }
            for(let step=0;step<length;step++){
              if(!api.valid(ownRun))return;
              const seconds=Math.max(1.3,3-round*.3);
              screen.querySelector('#bridgeHint').textContent=`${step+1}歩目 / ${length} · ${seconds.toFixed(1)}秒以内！`;
              const pick=await choice(['左の足場','中央の足場','右の足場'],seconds*1000);
              if(!api.valid(ownRun))return;
              if(pick!==route[step]){safe=false;break;}
              tiles[pick].textContent='✓';api.beep(500+step*70,25,.01);
              await pause(180);if(!api.valid(ownRun))return;tiles[pick].textContent='?';
            }
          }
          if(!api.valid(ownRun))return;
          if(safe)s.score+=16;else s.lives--;
          if(s.lives<=0)s.out=true;
          if(!s.cpu)await reveal(s,safe?'BRIDGE CLEAR!':'足場が崩れた！',safe?`ルート踏破！ +16点 · 合計${s.score}点`:`${s.out?'脱落！':'ライフ −1'} · 残り ♥ ${s.lives}`,safe?'success':'danger',ownRun);
        }
      }
      slots.forEach(s=>{s.score=Math.min(100,s.score+Math.max(0,s.lives)*10);s.out=true;});
    }
    async function treasure(slots,ownRun){
      for(let round=1;round<=5;round++){
        const risk=.16+round*.055,small=8+round*2,large=22+round*3;
        for(const s of slots.filter(s=>!s.out)){
          if(!api.valid(ownRun))return;
          let pick;
          let guarded=false;
          if(s.cpu)pick=s.bank>=50&&Math.random()<.20+round*.10?2:Math.random()<.40?0:1;
          else{
            await handoff(s,`お宝エスケープ · ROOM ${round} / 5`);if(!api.valid(ownRun))return;
            shell('モブくんお宝エスケープ',`<p class="party-event-call">ROOM ${round} / 5 · ${esc(s.name)}</p><div class="party-vault-track">${Array.from({length:5},(_,i)=>`<span class="${i<round?'lit':''}">${i+1}</span>`).join('')}</div><div class="party-treasure-bank">${s.bank}<small>未確定のお宝 / 上限100点</small></div><p>慎重な箱：+${small}点・罠${Math.round(risk*.3*100)}%<br>豪華な箱：+${large}点・罠${Math.round(risk*100)}%<br>罠にかかると半分で強制脱出。最終部屋は自動帰還。</p><p id="vaultHint">偵察は1回だけ。今回の罠確率を半減できます。<br>現在の最多所持：${Math.max(...slots.map(x=>x.bank))}点</p><div id="eventChoices"></div>`);
            const options=()=>[`慎重な箱 +${small}`,`豪華な箱 +${large}`,`${s.bank}点で脱出`,...(s.scouts?['偵察を使う（残り1回）']:[])];
            pick=await choice(options(),14000);
            if(pick===3){s.scouts=0;guarded=true;screen.querySelector('#vaultHint').textContent=`偵察成功！今回のみ罠確率半減：慎重${Math.round(risk*.15*100)}% / 豪華${Math.round(risk*.5*100)}%`;api.beep(650,80,.02);pick=await choice(options(),14000);}
          }
          if(!api.valid(ownRun))return;
          let message;
          let trapped=false;
          if(pick<0||pick===2){s.score=s.bank;s.out=true;message=`無事に帰還！ ${s.score}点を確保`;}
          else if(Math.random()<risk*(pick===0?.3:1)*(guarded?.5:1)){s.score=Math.floor(s.bank/2);s.out=true;trapped=true;message=`トラップ発動！ ${s.bank-s.score}点を失い、${s.score}点で脱出`;}
          else{const gain=Math.min(100-s.bank,pick===0?small:large);s.bank+=gain;s.score=s.bank;message=`${pick===0?'慎重な箱':'豪華な箱'}から +${gain}点！ 合計${s.bank}点`;if(round===5||s.bank>=100){s.out=true;message+=' · 帰還成功！';}}
          if(!s.cpu){screen.querySelector('.party-event-call').textContent=pick===2||pick<0?'出口へ向かう…':'宝箱を開封中…';await pause(700);if(!api.valid(ownRun))return;await reveal(s,trapped?'TRAP!':s.out?'ESCAPE!':'TREASURE GET!',message,trapped?'danger':'success',ownRun);}
        }
      }
    }
    return {start};
  }};
})();
