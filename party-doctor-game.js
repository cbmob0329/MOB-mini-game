/* Shared rules for interactive and CPU-only Doctor rounds. The legacy key remains for saved leagues. */
(function(root){
'use strict';
const title='モブロボドクターは気まぐれ';
const shuffle=(a,random)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const points=(chosen,secret)=>100-Math.abs(chosen-secret);
const hint=secret=>secret>=50?'アップ':'ダウン';
function deal(count,random=Math.random){
  const secret=1+Math.floor(random()*99),pool=shuffle(Array.from({length:99},(_,i)=>i+1).filter(n=>n!==secret),random);
  // Each nine-card hand is unique internally; larger rosters reuse decoys across teams.
  const cards=Array.from({length:count},(_,t)=>shuffle([secret,...Array.from({length:8},(_,j)=>pool[(t*8+j)%98])],random));
  return {secret,hint:hint(secret),cards};
}
function cpuChoice(cards,direction,random=Math.random){const candidates=cards.filter(n=>direction==='アップ'?n>=50:n<50);return candidates[Math.floor(random()*candidates.length)];}
function teamsFor(entrants){const groups=new Map();for(const p of entrants){const id=p.teamId??p.id;if(!groups.has(id))groups.set(id,{id,name:p.team||p.name,members:[]});groups.get(id).members.push(p);}return [...groups.values()];}
function simulate(teams,random=Math.random){const round=deal(teams.length,random),scores={};teams.forEach((t,i)=>{const earned=points(cpuChoice(round.cards[i],round.hint,random),round.secret);t.members.forEach(p=>scores[typeof p==='object'?p.id:p]=earned);});return scores;}
const robot=`<svg class="doctor-robot" viewBox="0 0 160 150" aria-label="モブロボドクター" role="img"><path d="M27 137L36 99 66 87H96L126 99 137 137" fill="#e9f1ed" stroke="#6f9e9b" stroke-width="3"/><path d="M62 91L79 132 101 91M79 132V148" fill="#b9d9d4" stroke="#47726f" stroke-width="3"/><path d="M49 107L60 136M113 107L105 136" stroke="#456560" stroke-width="3"/><path d="M79 25V8" stroke="#94c2b5" stroke-width="5"/><circle cx="79" cy="8" r="6" fill="#ffc969"/><rect x="26" y="49" width="13" height="31" rx="5" fill="#d6aa64"/><rect x="121" y="49" width="13" height="31" rx="5" fill="#d6aa64"/><rect x="34" y="28" width="92" height="66" rx="23" fill="#b7d2c9" stroke="#537d73" stroke-width="4"/><path d="M41 37L50 17 64 30 78 15 90 29 109 19 119 39" fill="#f0f3e5"/><rect x="44" y="46" width="72" height="26" rx="10" fill="#103733" stroke="#e1ba75" stroke-width="3"/><path d="M52 59H70M90 59H108" stroke="#a0f7d0" stroke-width="5" stroke-linecap="round"/><path d="M65 80Q79 92 96 80" fill="none" stroke="#44695c" stroke-width="3"/><circle cx="109" cy="115" r="6" fill="#f6b85d"/><path d="M37 127L15 109M124 124L145 102" stroke="#c8ded2" stroke-width="12" stroke-linecap="round"/></svg>`;
async function run(api){
  const {screen,esc,valid}=api,random=api.random||Math.random,teams=teamsFor(api.entrants),round=deal(teams.length,random),answers=[],scores={};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms)),range=round.hint==='アップ'?'50〜99':'1〜49';
  function draw(body,{speech='今回は'+round.hint+'じゃ！',number='??',compact=false}={}){
    if(!valid())return;api.clear();
    screen.innerHTML=`<section class="doctor-game ${compact?'doctor-compact':''}"><header><small>MOB LABORATORY / SECRET NUMBER</small><h2>${title}</h2></header><div class="doctor-lab">${robot}<div class="doctor-console"><div class="doctor-dialogue" role="status">${speech}</div><div class="doctor-machine"><i></i><strong>${number}</strong><i></i><small>SECRET NUMBER / 01—99</small></div></div></div><div class="doctor-body">${body}</div></section>`;
    api.top();screen.querySelector('.doctor-game').style.setProperty('--doctor-top',Math.max(0,screen.getBoundingClientRect().top)+'px');
  }
  async function next(label){if(!valid())return false;const host=screen.querySelector('#doctorActions');host.innerHTML=`<button type="button">${label}</button>`;await new Promise(resolve=>{host.querySelector('button').onclick=e=>{if(!valid())return;e.currentTarget.disabled=true;resolve();};});return valid();}
  draw(`<p class="doctor-instruction">機械が選んだ秘密の数字を当てよう。<br><b>${round.hint}は${range}のヒント。</b></p><div class="doctor-sample" aria-hidden="true"><span>17</span><span>?</span><span>86</span></div><p class="doctor-rule">9枚の中に必ず正解が1枚。<br>ピッタリ100点 ／ それ以外は100−誤差。<br>例：正解64・選択30 → 66点</p><div id="doctorActions"></div>`);
  if(!(await next('数字を選びに行く')))return;
  for(let i=0;i<teams.length;i++){
    if(!valid())return;const team=teams[i],human=team.members.some(p=>!p.cpu);let chosen;
    if(human){
      draw(`<div class="doctor-turn"><small>TEAM ${i+1} / ${teams.length}</small><h3>${esc(team.name)}</h3></div><div class="doctor-members">${team.members.map(p=>`<img src="${esc(p.img)}" alt="${esc(p.name)}">`).join('')}</div><p class="doctor-instruction">このチームで相談して1枚選びます。<br>準備ができたらカードを開こう。</p><div id="doctorActions"></div>`);
      if(!(await next('準備OK · カードを開く')))return;
      draw(`<div class="doctor-turn"><small>TEAM ${i+1} / ${teams.length} · ${range}がヒント</small><h3>${esc(team.name)}</h3></div><div class="doctor-cards">${round.cards[i].map(n=>`<button type="button" class="doctor-card" data-number="${n}" aria-pressed="false"><small>MOB LAB</small><strong>${n}</strong><span>NUMBER CARD</span></button>`).join('')}</div><p class="doctor-selection" role="status">1枚をタップして選択</p><div id="doctorActions"><button type="button" disabled>この数字で決定</button></div>`);
      await new Promise(resolve=>{const confirm=screen.querySelector('#doctorActions button');screen.querySelectorAll('.doctor-card').forEach(card=>{card.onclick=()=>{if(!valid())return;chosen=Number(card.dataset.number);screen.querySelectorAll('.doctor-card').forEach(c=>c.setAttribute('aria-pressed',String(c===card)));screen.querySelector('.doctor-selection').textContent=chosen+'を選択中';confirm.disabled=false;};});confirm.onclick=()=>{if(!valid()||chosen==null)return;confirm.disabled=true;resolve();};});
    }else chosen=cpuChoice(round.cards[i],round.hint,random);
    if(!valid())return;answers.push({team,chosen,points:points(chosen,round.secret)});
  }
  draw(`<div class="doctor-ready"><strong>全${teams.length}チーム 選択完了</strong><span>秘密の数字、まもなく公開。</span></div><p class="doctor-instruction">端末をみんなに見せてください。<br>ボタンを押すとドクターが発表します。</p><div id="doctorActions"></div>`,{speech:'全員決まったようじゃな…'});
  if(!(await next('みんなで結果を見る')))return;
  draw('<div class="doctor-suspense" role="status">秘密の数字を照合中<span>● ● ●</span></div>',{speech:'ワシの選んだ数字は・・',number:'··'});
  api.beep(260,140,.02);await sleep(650);if(!valid())return;api.beep(360,140,.02);await sleep(850);if(!valid())return;
  draw('<p class="doctor-revealed">近い数字を選べたかな？</p><div id="doctorActions"></div>',{speech:'ワシの選んだ数字は・・'+round.secret+'じゃ！',number:String(round.secret)});api.beep(950,180,.025);
  if(!(await next('みんなの得点を見る')))return;
  answers.forEach(a=>a.team.members.forEach(p=>scores[p.id]=a.points));
  const ranked=[...answers].sort((a,b)=>b.points-a.points);
  for(let offset=0;offset<ranked.length;offset+=20){
    draw(`<p class="doctor-result-heading">正解 ${round.secret} ／ 各メンバーの獲得ポイント</p><div class="doctor-results">${ranked.slice(offset,offset+20).map(a=>`<article class="${a.points===100?'exact':''}"><div><b>${esc(a.team.name)}</b><small>選択 ${a.chosen} · ${a.points===100?'ピッタリ！':'誤差 '+Math.abs(a.chosen-round.secret)}</small></div><strong>${a.points}<small>pt</small></strong></article>`).join('')}</div><div id="doctorActions"></div>`,{compact:true,speech:'ピッタリも、惜しい数字も得点じゃ！',number:String(round.secret)});
    if(!(await next(offset+20<ranked.length?'次のチームの得点を見る':'結果を確定する')))return;
  }
  if(valid())api.done(scores);
}
const api={title,points,hint,deal,cpuChoice,teamsFor,simulate,run};if(typeof module!=='undefined')module.exports=api;if(root)root.MobDoctorGame=api;
})(typeof window!=='undefined'?window:null);
