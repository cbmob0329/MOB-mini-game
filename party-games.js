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
        screen.querySelector('#eventChoices').innerHTML=options.map((text,i)=>`<button data-choice="${i}">${text}</button>`).join('');
        screen.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>finish(Number(b.dataset.choice)));
        if(timeout)timer=setTimeout(()=>{if(api.valid(choiceRun))finish(-1);else{settled=true;resolve(-1);}},timeout);
      });
    }
    function standings(slots){return `<div class="party-event-roster">${slots.map(s=>`<div class="${s.out?'out':''}">${portrait(s)}<span>${esc(s.team)}<b>${esc(s.name)}</b><em>${s.score} pt${s.out?' · FINISH':''}</em></span></div>`).join('')}</div>`;}
    async function handoff(s,title){
      shell(title,`<p class="party-event-call">${esc(s.team)} · ${esc(s.name)} の番です</p><div class="party-event-actor">${portrait(s)}</div><p>端末を受け取ったら準備OKを押してください。</p><div id="eventChoices"></div>`);
      await choice(['準備OK']);
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
      slots=slots.map(s=>({...s,score:0,lives:2,out:false,bank:0}));
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
        shell('扉が消滅！',`<p class="party-event-call">${dangerous+1}番の扉 · ${esc(loser.name)} が脱落</p>${standings(slots)}`);
        api.beep(160,100,.02);await pause(700);
      }
      const winner=slots.find(s=>!s.out);if(winner)winner.score=100;
    }
    async function bridge(slots,ownRun){
      for(let round=1;round<=5;round++){
        if(!api.valid(ownRun))return;
        for(const s of slots.filter(s=>!s.out)){
          if(!api.valid(ownRun))return;
          const danger=Math.floor(Math.random()*3);
          let pick;
          if(s.cpu){const strength=core.cpuScore(s.rank);pick=Math.random()<.40+strength/180?(danger+1+Math.floor(Math.random()*2))%3:danger;}
          else{
            await handoff(s,`カラーブリッジ · STAGE ${round} / 5`);if(!api.valid(ownRun))return;
            shell('モブくんカラーブリッジ',`<p class="party-event-call">STAGE ${round} / 5 · ${esc(s.name)} · ♥ ${s.lives}</p><div class="party-event-actor">${portrait(s)}</div><p id="bridgeHint">危険な足場「×」の位置を覚えよう！</p><div class="party-bridge">${[0,1,2].map(i=>`<div class="${i===danger?'danger':''}">${i===danger?'×':'○'}</div>`).join('')}</div><div id="eventChoices"></div>`);
            await pause(1050);if(!api.valid(ownRun))return;
            screen.querySelectorAll('.party-bridge div').forEach(el=>{el.textContent='?';el.classList.remove('danger');});
            screen.querySelector('#bridgeHint').textContent='安全な足場へ！ 6秒以内に選ぼう。';
            pick=await choice(['左の足場','中央の足場','右の足場'],6000);
          }
          if(!api.valid(ownRun))return;
          const safe=pick>=0&&pick!==danger;
          if(safe)s.score+=16;else s.lives--;
          if(s.lives<=0)s.out=true;
          if(!s.cpu){screen.querySelector('.party-event-call').textContent=safe?'CLEAR! +16 pt':'足場が崩れた！';api.beep(safe?820:170,70,.016);await pause(420);}
        }
      }
      slots.forEach(s=>{s.score=Math.min(100,s.score+Math.max(0,s.lives)*10);s.out=true;});
    }
    async function treasure(slots,ownRun){
      for(let round=1;round<=5;round++){
        const risk=.08+round*.065;
        for(const s of slots.filter(s=>!s.out)){
          if(!api.valid(ownRun))return;
          let pick;
          if(s.cpu)pick=s.bank>=40&&Math.random()<.25+round*.08?1:0;
          else{
            await handoff(s,`お宝エスケープ · ROOM ${round} / 5`);if(!api.valid(ownRun))return;
            shell('モブくんお宝エスケープ',`<p class="party-event-call">ROOM ${round} / 5 · ${esc(s.name)}</p><div class="party-event-actor">${portrait(s)}</div><div class="party-treasure-bank">${s.bank}<small>未確定のお宝ポイント</small></div><p>次の宝箱は +20点。トラップ確率 ${Math.round(risk*100)}%。<br>トラップを引くと半分の点数で脱出します。</p><div id="eventChoices"></div>`);
            pick=await choice(['宝箱を開ける +20','今のお宝を持ち帰る'],10000);
          }
          if(!api.valid(ownRun))return;
          let message;
          if(pick!==0){s.score=s.bank;s.out=true;message=`${s.score}点を確保！`;}
          else if(Math.random()<risk){s.score=Math.floor(s.bank/2);s.out=true;message=`トラップ！ ${s.score}点で脱出`;}
          else{s.bank+=20;s.score=s.bank;message=`お宝GET! ${s.bank}点`;if(round===5)s.out=true;}
          if(!s.cpu){screen.querySelector('.party-event-call').textContent=message;api.beep(s.out?400:850,70,.016);await pause(450);}
        }
      }
    }
    return {start};
  }};
})();
