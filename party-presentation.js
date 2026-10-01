/* Short result stings and previews rendered by the current game, not saved screenshots. */
(()=>{
  let cancelReveal=()=>{};const observers=[];const dispose=()=>{observers.splice(0).forEach(o=>o.disconnect());};
  function reveal({screen,title,subtitle='',done}){
    cancelReveal();const panel=document.createElement('div');panel.className='result-announcement';panel.setAttribute('role','status');
    const small=document.createElement('small');small.textContent='RESULT ANNOUNCEMENT';const heading=document.createElement('h2');heading.textContent=title;const detail=document.createElement('p');detail.textContent=subtitle;
    const skip=document.createElement('button');skip.textContent='結果を見る →';panel.append(small,heading,detail,skip);document.body.appendChild(panel);
    let ended=false;const timer=setTimeout(finish,1200);function finish(){if(ended)return;ended=true;clearTimeout(timer);const connected=panel.isConnected;panel.remove();if(connected)done();}
    skip.onclick=finish;cancelReveal=()=>{ended=true;clearTimeout(timer);panel.remove();};
  }
  function preview(key,character,title,esc){
    const sources=Array.from(document.querySelectorAll('script[src],link[rel="stylesheet"]')).map(el=>el.getAttribute('src')||el.getAttribute('href')).join('|');let revision=2166136261;for(const c of sources)revision=Math.imul(revision^c.charCodeAt(0),16777619)>>>0;
    const src='index.html?previewBuild='+revision+'&previewGame='+encodeURIComponent(key)+'&previewCharacter='+encodeURIComponent(character?.id||character?.img||'');
    return `<figure class="game-preview" role="img" aria-label="${esc(title)}の現在のゲーム画面"><div class="game-preview-window"><iframe data-live-preview src="${src}" title="${esc(title)}の画面プレビュー" tabindex="-1" aria-hidden="true" sandbox="allow-scripts allow-same-origin"></iframe></div><figcaption>現在のゲーム本体・素材を使った画面プレビュー</figcaption></figure>`;
  }
  function fitInstructions(screen){
    if(!screen.classList.contains('illustrated-intro'))return;
    const panels=[...screen.querySelectorAll(':scope > .panel')],start=screen.querySelector('#introStart');
    if(!start)return;
    const nav=document.createElement('div');nav.className='intro-nav';nav.hidden=true;
    const back=document.createElement('button'),next=document.createElement('button');back.textContent='← 前の説明';nav.append(back,next);screen.insertBefore(nav,start);
    let page=0,paged=false;
    const show=()=>{panels.forEach((p,i)=>p.hidden=paged&&i!==page);nav.hidden=!paged;back.disabled=page===0;next.hidden=page===panels.length-1;next.textContent=`次の説明へ (${page+1}/${panels.length}) →`;start.hidden=paged&&page!==panels.length-1;};
    back.onclick=()=>{page=Math.max(0,page-1);show();};next.onclick=()=>{page=Math.min(panels.length-1,page+1);show();};
    const fit=()=>{if(!screen.isConnected)return;screen.style.setProperty('--intro-top',Math.max(0,screen.getBoundingClientRect().top)+'px');paged=false;show();
      if(start.getBoundingClientRect().bottom>screen.getBoundingClientRect().bottom-12){paged=true;page=Math.min(page,panels.length-1);show();}
    };
    const observer=new ResizeObserver(fit);observers.push(observer);observer.observe(screen);fit();
  }
  function mount(screen){dispose();fitInstructions(screen);for(const frame of screen.querySelectorAll('[data-live-preview]')){const host=frame.parentElement;const resize=()=>{if(!frame.isConnected){observer.disconnect();return;}const w=host.clientWidth,h=host.clientHeight,s=Math.min(w/640,h/360);frame.style.cssText=`width:640px;height:360px;left:${(w-640*s)/2}px;top:${(h-360*s)/2}px;transform:scale(${s})`;};const observer=new ResizeObserver(resize);observers.push(observer);observer.observe(host);resize();}}
  window.MobPresentation={reveal,preview,mount,cancel:()=>{cancelReveal();dispose();}};
})();
