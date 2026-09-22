(function(root){
  'use strict';
  function rank(rows){let last,place;return rows.sort((a,b)=>b.points-a.points).map((row,i)=>{if(i===0||row.points!==last)place=i+1;last=row.points;return {...row,rank:place};});}
  function pages({players,teams,names,round,total,ranked}){
    const individuals=scores=>rank(players.filter(p=>Object.hasOwn(scores,p.id)).map(p=>({p,points:scores[p.id]||0})));
    const squads=(scores,current)=>rank(Object.entries(teams).map(([key,ids])=>{const members=ids.map(id=>players.find(p=>p.id===id)).filter(Boolean).map(p=>({p,points:scores[p.id]||0,bench:current&&!Object.hasOwn(scores,p.id)}));return {key,name:names[key]||key,members,points:members.reduce((sum,m)=>sum+m.points,0)};}));
    return [{title:'このゲームの個人順位',label:'ROUND / INDIVIDUAL',rows:ranked?ranked.map(r=>({p:r.p,points:r.points,rank:r.rank})):individuals(round)},{title:'このゲームのチーム順位',label:'ROUND / TEAM',team:true,rows:squads(round,true)},{title:'個人総合順位',label:'OVERALL / INDIVIDUAL',rows:individuals(Object.fromEntries(players.map(p=>[p.id,total[p.id]||0])))},{title:'チーム総合順位',label:'OVERALL / TEAM',team:true,rows:squads(total,false)}];
  }
  function show({screen,esc,model,game,round,done,beep,top}){
    let page=0;
    const avatar=p=>`<img src="${esc(p.img)}" alt="${esc(p.name)}" draggable="false">`;
    function draw(){
      const data=model[page],leaders=data.rows.filter(r=>r.rank===1);
      screen.innerHTML=`<section class="party-results"><header><small>ROUND ${round} COMPLETE · ${esc(game)}</small><div class="party-results-steps">${model.map((m,i)=>`<span class="${i===page?'active':''}" ${i===page?'aria-current="step"':''}>0${i+1}</span>`).join('')}</div><p>${data.label}</p><h2>${data.title}</h2><div class="party-result-leader"><b>${leaders.length>1?'JOINT LEADERS':'LEADER'}</b><span>${leaders.map(r=>esc(data.team?r.name:r.p.name)).join(' / ')}</span><strong>${leaders[0]?.points??0}<small> PT</small></strong></div></header><div class="party-result-list">${data.rows.map((r,i)=>data.team?`<article class="party-squad-result ${r.rank===1?'first':''}" style="--entry:${Math.min(i,7)*45}ms"><div class="party-squad-title"><b>#${r.rank}</b><h3>${esc(r.name)}</h3><strong>${r.points}<small> PT</small></strong></div><div class="party-squad-members">${r.members.map(m=>`<div>${avatar(m.p)}<span>${esc(m.p.name)}<small>${m.bench?'控え / 今回は不参加':m.p.cpu?'CPU':`PLAYER ${m.p.no}`}</small></span><b>${m.bench?'—':m.points+' pt'}</b></div>`).join('')}</div></article>`:`<article class="party-person-result ${r.rank===1?'first':''}" style="--entry:${Math.min(i,7)*45}ms"><b>#${r.rank}</b>${avatar(r.p)}<span>${esc(r.p.name)}<small>${r.p.cpu?'CPU':`PLAYER ${r.p.no}`}</small></span><strong>${r.points}<small> PT</small></strong></article>`).join('')}</div><footer><button id="partyResultNext" type="button">${page<3?`タップで次へ · ${model[page+1].title}`:'タップで次の画面へ'} <b>${page+1} / 4 →</b></button></footer></section>`;
      top();beep(500+page*110,55,.012);
      const panel=screen.querySelector('.party-results'),button=screen.querySelector('#partyResultNext');
      let origin=null,locked=false;const opened=performance.now();
      const next=()=>{if(locked||performance.now()-opened<300)return;locked=true;if(page<3){page++;draw();}else done();};
      button.addEventListener('click',next);
      panel.addEventListener('pointerdown',e=>{origin={x:e.clientX,y:e.clientY,scroll:window.scrollY};});
      panel.addEventListener('pointerup',e=>{if(e.target.closest('button')||!origin)return;const start=origin;origin=null;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)<10&&Math.abs(window.scrollY-start.scroll)<10)next();});
      panel.addEventListener('pointercancel',()=>origin=null);
    }
    draw();
  }
  const api={rank,pages,show};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MobPartyResults=api;
})(typeof window!=='undefined'?window:globalThis);
