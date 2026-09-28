/* One portrait picker shared by solo, multi and tag league setup. */
(()=>{
  const {roster,groups}=window.MobPartyCore;
  window.MobCharacterSelect={show({screen,esc,count,index,slots=[],confirm,back,top,beep}){
    let category='すべて',preview=roster.find(c=>c.id===slots[index])||roster.find(c=>!slots.includes(c.id));
    const taken=id=>slots.some((v,i)=>i!==index&&v===id);
    const image=c=>`<img src="${c.img}" alt="${esc(c.name)}" draggable="false" class="${[11,12,13].includes(c.id)?'party-small':''}">`;
    function draw(){
      screen.innerHTML=`<div class="party-page character-picker-page"><section class="party-fighter-select shared-character-select"><button id="characterBack" class="party-back">← 戻る</button><header class="party-heading"><span class="party-eyebrow">CHARACTER SELECT · P${index+1} / ${count}</span><h1>キミの相棒を選ぼう</h1></header><div class="party-player-slots">${Array.from({length:count},(_,i)=>{const c=roster.find(c=>c.id===slots[i]);return `<span class="${i===index?'current':''}">${c?image(c):''}P${i+1}${c?' ✓':''}</span>`;}).join('')}</div><label class="character-filter">コラボ・シリーズ<select id="characterGroup">${['すべて',...groups.map(g=>g[0])].map(g=>`<option ${g===category?'selected':''}>${g}</option>`).join('')}</select></label><div class="party-roster">${roster.filter(c=>category==='すべて'||c.group===category).map(c=>`<button class="character-tile" data-character="${c.id}" aria-label="${esc(c.name)}${taken(c.id)?' 選択済み':''}" ${taken(c.id)?'disabled':''}>${image(c)}<span>${esc(c.name)}</span></button>`).join('')}<button class="character-tile" data-character="random" aria-label="ランダム選択"><img src="main/008.png" alt="" draggable="false"><span>ランダム</span></button></div><div class="party-fighter-dock"><section class="party-spotlight" aria-live="polite"><b class="party-fighter-player">P${index+1}</b><div id="partyPreview"></div><div><small id="partyGroup"></small><h2 id="partyName"></h2><p>READY TO FIGHT</p></div></section><button id="partyConfirm" class="party-primary">このキャラクターに決定 →</button></div></section></div>`;
      const panel=screen.querySelector('.shared-character-select');top();panel.style.setProperty('--picker-top',Math.max(0,panel.getBoundingClientRect().top)+'px');
      function refresh(){screen.querySelector('#partyPreview').innerHTML=image(preview);screen.querySelector('#partyName').textContent=preview.name;screen.querySelector('#partyGroup').textContent=preview.group;screen.querySelectorAll('[data-character]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.character)===preview.id)));}
      refresh();screen.querySelector('#characterBack').onclick=back;
      screen.querySelector('#characterGroup').onchange=e=>{category=e.target.value;draw();};
      screen.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>{const pool=roster.filter(c=>!taken(c.id));preview=b.dataset.character==='random'?pool[Math.floor(Math.random()*pool.length)]:roster.find(c=>c.id===Number(b.dataset.character));refresh();beep(640,45,.012);});
      let decided=false;screen.querySelector('#partyConfirm').onclick=()=>{if(decided)return;decided=true;beep(900,70,.018);confirm(preview);};
    }
    draw();
  }};
})();
