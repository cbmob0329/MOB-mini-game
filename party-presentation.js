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
  function mount(screen){dispose();for(const frame of screen.querySelectorAll('[data-live-preview]')){const host=frame.parentElement;const resize=()=>{if(!frame.isConnected){observer.disconnect();return;}const w=host.clientWidth,h=host.clientHeight,s=Math.min(w/640,h/360);frame.style.cssText=`width:640px;height:360px;left:${(w-640*s)/2}px;top:${(h-360*s)/2}px;transform:scale(${s})`;};const observer=new ResizeObserver(resize);observers.push(observer);observer.observe(host);resize();}}
  window.MobPresentation={reveal,preview,mount,cancel:()=>{cancelReveal();dispose();}};
})();
