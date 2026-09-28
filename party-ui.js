/* Party front end. Match rules and game execution remain in game.js. */
(()=>{
  'use strict';
  const settings={sound:true,motion:!matchMedia('(prefers-reduced-motion: reduce)').matches};
  try{const saved=JSON.parse(localStorage.getItem('mob-party-settings'));for(const key of Object.keys(settings))if(typeof saved?.[key]==='boolean')settings[key]=saved[key];}catch(_){}
  function applySettings(){document.documentElement.dataset.partyMotion=settings.motion?'on':'off';}
  applySettings();
  const {groups,roster,genre,allocateTeams}=window.MobPartyCore;
  window.MobPartyUI={settings,create(api){
    const {screen,esc}=api;
    const originals=api.players.map(p=>({...p}));
    let count=1,selected=[];
    const image=(c,cls='')=>`<img class="${cls}" src="${c.img}" alt="${esc(c.name)}" draggable="false">`;
    const on=(id,fn)=>screen.querySelector(`#${id}`).addEventListener('click',fn);
    function draw(html){screen.innerHTML=`<div class="party-page">${html}</div>`;api.gameTop();}
    function heading(step,title,description){return `<header class="party-heading"><span class="party-eyebrow">${step}</span><h1>${title}</h1><p>${description}</p></header>`;}
    function back(fn,label='戻る'){on('partyBack',fn);}
    const backButton='<button id="partyBack" class="party-back" type="button">← 戻る</button>';
    function home(){
      api.players.forEach((p,i)=>(delete p.characterRank,Object.assign(p,originals[i])));
      selected=[];
      draw(`<section class="party-title">
        <div class="party-orbit" aria-hidden="true"></div>
        <span class="party-eyebrow">EVERYONE IS THE MAIN CHARACTER</span>
        <h1><span>MOB</span>PARTY GAME<span class="party-title-star" aria-hidden="true">✦</span></h1>
        <p class="party-tagline">今日は、どんなゲームで遊ぶ？</p>
        <div class="party-cast">${image(roster[0],'party-red')}${image(roster[1],'party-blue')}<span class="party-stage-label">LET’S PARTY!</span></div>
        <div class="party-menu">
          <button id="partySolo" class="party-menu-button solo"><span class="party-menu-icon">01</span><span><small>SOLO PLAY</small><b>ソロプレイ</b><em>ひとりで、自己ベストに挑戦。</em></span><span aria-hidden="true">↗</span></button>
          <button id="partyMulti" class="party-menu-button multi"><span class="party-menu-icon">02</span><span><small>MULTI PLAY</small><b>マルチプレイ</b><em>2〜4人で、いっしょに熱くなろう。</em></span><span aria-hidden="true">↗</span></button>
          <button id="partyLeague" class="party-menu-button league"><span class="party-menu-icon">03</span><span><small>TAG BATTLE LEAGUE</small><b>タッグバトルリーグ</b><em>20チーム・40名 / プレイヤー最大8名</em></span><span>↗</span></button><button id="partyKing" class="party-menu-button league"><span class="party-menu-icon">♛</span><span><small>5 GAMES / 500 POINTS</small><b>MOB GAME KING</b><em>歴代TOP20へ挑戦・記念トレカ制作</em></span><span>↗</span></button><button id="partySettings" class="party-settings-link">⚙ 設定</button>
        </div>
        <footer class="party-footer"><span><b>${api.activeIndices().length}</b> MINI GAMES</span><span>1台で交代プレイ</span><button id="partyGuide">遊び方を見る ↗</button></footer>
      </section>`);
      on('partySolo',()=>{count=1;selectCharacter();});
      on('partyLeague',api.league);on('partyKing',api.king);on('partyMulti',chooseCount);on('partySettings',showSettings);on('partyGuide',api.guide);
    }
    function chooseCount(){
      draw(`${backButton}${heading('01 / PLAYERS','何人で遊ぶ？','1台の端末を順番に交代して遊べます。')}<div class="party-counts">${[2,3,4].map(n=>`<button data-count="${n}"><span>${n}</span><b>人でプレイ</b></button>`).join('')}</div><p class="party-note">次は、ひとりずつキャラクターを選ぼう。</p>`);
      back(api.home);screen.querySelectorAll('[data-count]').forEach(b=>b.onclick=()=>{count=Number(b.dataset.count);selected=[];selectCharacter();});
    }
    function selectCharacter(){
      window.MobCharacterSelect.show({screen,esc,count,index:selected.length,slots:selected,top:api.gameTop,beep:api.beep,
        back:()=>{if(selected.length){selected.pop();selectCharacter();}else if(count>1)chooseCount();else api.home();},
        confirm:c=>{selected.push(c.id);const p=api.players.find(p=>p.id==='p'+selected.length);p.img=c.img;p.name=c.name;p.characterRank=c.rank;if(selected.length<count)selectCharacter();else chooseStyle();}
      });
    }
    function chooseStyle(){
      draw(`${backButton}${heading('03 / LET’S PLAY','どんなパーティーにする？','好きなゲームをひとつ。あるいは、チームでカップに挑戦。')}<div class="party-team">${selected.map(id=>image(roster.find(c=>c.id===id))).join('')}</div><div class="party-style-grid"><button id="partySingle"><small>ONE GAME</small><b>ゲームを選んで1プレイ</b><span>好きな種目を見つけて、すぐにスタート ↗</span></button><button id="partyCup"><small>TEAM CHALLENGE</small><b>MOB PARTY CUP</b><span>8チームで競う、合計スコアの大会 ↗</span></button></div><button id="partyAdvanced" class="party-back">その他の対戦ルール →</button>`);
      back(()=>{selected.pop();selectCharacter();});on('partySingle',()=>{api.configure(count,false);library(1);});on('partyCup',cupLength);on('partyAdvanced',api.advanced);
    }
    function cupLength(){
      draw(`${backButton}${heading('MOB PARTY CUP','目指せ、パーティーの頂点。',`自チーム＋CPU7チーム。1ゲーム最大${count*100}点を積み重ねよう。`)}<div class="party-counts">${[10,20].map(n=>`<button data-rounds="${n}"><span>${n}</span><b>ゲーム</b></button>`).join('')}<button data-rounds="0"><span>＋</span><b>カスタム</b></button></div><p class="party-note">次の画面でプレイするゲームと順番を選びます。</p>`);
      back(chooseStyle);screen.querySelectorAll('[data-rounds]').forEach(b=>b.onclick=()=>{
        const entrants=api.configure(count,true);
        let available=roster.filter(c=>!selected.includes(c.id));
        const cpu=entrants.filter(p=>p.cpu);
        const teams=allocateTeams(available,count,cpu.length/count);
        teams.flat().forEach((c,i)=>{cpu[i].name=c.name;cpu[i].img=c.img;cpu[i].characterRank=c.rank;});
        library(Number(b.dataset.rounds),true);
      });
    }
    function library(target,cup=false){
      const indices=!cup&&count===1?api.freeIndices():api.eligibleIndices(),queue=[];let selectedGenre="すべて",composing=false;
      draw(`${backButton}${heading(cup?'CUP / GAME SELECT':'ONE GAME / GAME SELECT',cup?'大会のプログラムを作ろう':'今日は、どれで遊ぶ？',cup?`遊ぶ順番に${target?target+'ゲーム':'1〜50ゲーム'}を選択。重複もOK。`:'ゲーム名・番号・キーワードで検索できます。')}<div class="party-search"><label for="partySearch">ゲームを探す</label><input id="partySearch" type="search" placeholder="例：ホッケー、記憶、140" autocomplete="off"><span id="partyFound" role="status"></span></div><div class="party-genres" role="group" aria-label="ゲームジャンル">${["すべて",...new Set(indices.map(i=>genre(api.games[i])))].map(name=>`<button data-genre="${name}" aria-pressed="${name===selectedGenre}">${name}</button>`).join('')}</div>${cup?'<section class="party-queue"><div id="partyQueue" aria-live="polite"></div><div class="party-queue-actions"><button id="partyRandomFill">おまかせで選ぶ</button><button id="partyUndo">ひとつ戻す</button></div><button id="partyLaunch" class="party-primary" disabled>ゲームを選択してください</button></section>':''}<div id="partyGames" class="party-games"></div>`);
      back(cup?cupLength:chooseStyle);
      const list=screen.querySelector('#partyGames');
      function updateQueue(){if(!cup)return;screen.querySelector('#partyQueue').textContent=queue.length?queue.map((i,n)=>`${n+1}. ${api.games[i].title}`).join(' / '):'まだゲームが選ばれていません';const launch=screen.querySelector('#partyLaunch');launch.disabled=target?queue.length!==target:queue.length===0;launch.textContent=`${queue.length}${target?` / ${target}`:''}ゲーム · このプログラムで進む →`;screen.querySelector('#partyUndo').disabled=!queue.length;list.querySelectorAll('button').forEach(b=>b.disabled=queue.length>=(target||50));}
      function filter(){const q=screen.querySelector('#partySearch').value.trim().normalize('NFKC').toLowerCase();const found=indices.filter(i=>{const g=api.games[i];return (selectedGenre==='すべて'||genre(g)===selectedGenre)&&`${g.no} ${g.title} ${g.sub}`.normalize('NFKC').toLowerCase().includes(q);});screen.querySelector('#partyFound').textContent=`${found.length} / ${indices.length} GAMES`;list.innerHTML=found.length?found.map(i=>{const g=api.games[i];return `<button data-game="${i}"><small>GAME ${String(g.no).padStart(3,'0')}</small><b>${esc(g.title)}</b><span>${esc(g.sub)}</span><em>${cup?'＋ プログラムに追加':'遊び方を確認 →'}</em></button>`;}).join(''):'<p class="party-empty">見つかりませんでした。別のキーワードで探してみよう。</p>';list.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.game);if(cup){if(queue.length<(target||50)){queue.push(i);updateQueue();api.beep(660,35,.01);}}else if(count===1)api.free(i);else api.launch([i]);});updateQueue();}
      const search=screen.querySelector('#partySearch');
      search.addEventListener('compositionstart',()=>composing=true);
      search.addEventListener('compositionend',()=>{composing=false;filter();});
      search.addEventListener('input',()=>{if(!composing)filter();});
      screen.querySelectorAll('[data-genre]').forEach(b=>b.onclick=()=>{selectedGenre=b.dataset.genre;screen.querySelectorAll('[data-genre]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));filter();});
      filter();
      if(cup){on('partyUndo',()=>{queue.pop();updateQueue();});on('partyRandomFill',()=>{const shuffled=[...indices].sort(()=>Math.random()-.5);while(queue.length<(target||10))queue.push(shuffled[queue.length%shuffled.length]);updateQueue();});on('partyLaunch',()=>api.launch([...queue]));}
    }
    function showSettings(){
      draw(`${backButton}${heading('SETTINGS','遊びやすさを、自分好みに。','設定はこの端末に保存されます。')}<section class="party-options">${[['sound','効果音','決定音やゲーム中の電子音'],['motion','画面のアニメーション','登場演出やスポットライトの動き']].map(([key,label,desc])=>`<div><span><b>${label}</b><small>${desc}</small></span><button data-setting="${key}" role="switch" aria-label="${label}" aria-checked="${settings[key]}">${settings[key]?'ON':'OFF'}</button></div>`).join('')}</section><p class="party-note" id="partySaveStatus" role="status">音量は端末の音量ボタンでも調整できます。</p>`);
      back(api.home);screen.querySelectorAll('[data-setting]').forEach(b=>b.onclick=()=>{const key=b.dataset.setting;settings[key]=!settings[key];b.setAttribute('aria-checked',String(settings[key]));b.textContent=settings[key]?'ON':'OFF';applySettings();try{localStorage.setItem('mob-party-settings',JSON.stringify(settings));}catch(_){screen.querySelector('#partySaveStatus').textContent='このブラウザでは設定を保存できません。現在の画面には適用されます。';}if(key==='sound'&&settings.sound)api.beep();});
    }
    function otherGames(){
      // Keep the selected portraits and player count while resetting match scores.
      if(!selected.length)return false;
      api.configure(count,false);library(1);return true;
    }
    return {home,otherGames};
  }};
})();
