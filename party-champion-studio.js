/* Champion artwork: cached portraits, vector decorations and independent format edits. */
(()=>{
  'use strict';
  const FORMATS={wallpaper:[1440,2560],card:[1260,1760]}; // Card: 63 × 88 mm at 20 pixels/mm.
  const THEMES={gold:['#080f24','#253756','#ffe6a0'],aurora:['#071e2c','#235d67','#8cffee'],royal:['#190c31','#573272','#e8bdff'],sunset:['#34182e','#a04450','#ffd595'],ice:['#e9f6ff','#b2d5e9','#173654'],rose:['#fff0f5','#e6b2cb','#60233f']};
  const EFFECTS={stars:'星のきらめき',rays:'勝利の放射光',confetti:'祝福の紙吹雪',halo:'光のリング',comets:'流星群',fireworks:'花火',bubbles:'光の泡',lightning:'稲妻',petals:'花びら',holo:'ホログラム',diamonds:'ダイヤモンド',speed:'スピードライン',none:'なし'};
  const SHAPES={crown:'王冠',star:'星',heart:'ハート',bolt:'稲妻',diamond:'宝石',laurel:'月桂樹',silhouette:'キャラシルエット'};
  const copy=value=>JSON.parse(JSON.stringify(value));
  function fitText(c,value,x,y,max,size,color){c.font=`900 ${size}px sans-serif`;while(c.measureText(value).width>max&&size>10)c.font=`900 ${--size}px sans-serif`;c.fillStyle=color;c.textAlign='center';c.fillText(value,x,y);}
  function portrait(c,img,x,y,w,h){if(!img)return;const k=Math.min(w/img.width,h/img.height);c.drawImage(img,x+(w-img.width*k)/2,y+h-img.height*k,img.width*k,img.height*k);}
  function load(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});}
  function palette(img){
    if(!img)return ['#ffd66f','#64e7dc','#fa8abb'];
    const tile=document.createElement('canvas');tile.width=tile.height=48;const c=tile.getContext('2d');c.drawImage(img,0,0,48,48);
    const pixels=c.getImageData(0,0,48,48).data,buckets=new Map();
    for(let i=0;i<pixels.length;i+=4){const rgb=[pixels[i],pixels[i+1],pixels[i+2]],hi=Math.max(...rgb),lo=Math.min(...rgb);if(pixels[i+3]<180||hi-lo<35||hi<65)continue;const key=rgb.map(v=>Math.min(255,Math.round(v/32)*32)),hex='#'+key.map(v=>v.toString(16).padStart(2,'0')).join('');buckets.set(hex,(buckets.get(hex)||0)+1);}
    return [...new Set([...buckets].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([hex])=>hex).concat(['#ffd66f','#64e7dc','#fa8abb']))].slice(0,3);
  }
  function tinted(img,color){const tile=document.createElement('canvas');tile.width=img.width;tile.height=img.height;const c=tile.getContext('2d');c.drawImage(img,0,0);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,tile.width,tile.height);return tile;}
  function stamp(c,type,x,y,size,color,silhouette){
    c.save();c.translate(x,y);c.fillStyle=c.strokeStyle=color;c.lineWidth=size*.05;
    if(type==='silhouette')portrait(c,silhouette,-size/2,-size/2,size,size);
    else if(type==='heart'){c.beginPath();c.moveTo(0,size*.4);c.bezierCurveTo(-size*.9,-size*.15,-size*.35,-size*.7,0,-size*.25);c.bezierCurveTo(size*.35,-size*.7,size*.9,-size*.15,0,size*.4);c.fill();}
    else if(type==='laurel'){for(const sign of [-1,1])for(let i=0;i<7;i++){const a=i*.25+.15;c.save();c.translate(sign*Math.cos(a)*size*.4,Math.sin(a)*size*.4-size*.15);c.rotate(sign*a);c.beginPath();c.ellipse(0,0,size*.12,size*.035,.7,0,Math.PI*2);c.fill();c.restore();}}
    else {const paths={crown:[[-.48,.3],[-.5,-.25],[-.25,0],[0,-.5],[.25,0],[.5,-.25],[.48,.3]],bolt:[[.1,-.5],[-.4,.1],[-.06,.1],[-.12,.5],[.4,-.15],[.05,-.15]],diamond:[[0,-.5],[.45,0],[0,.5],[-.45,0]]};const points=type==='star'?Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?.21:.5;return [Math.cos(a)*r,Math.sin(a)*r];}):paths[type]||paths.crown;c.beginPath();points.forEach(([px,py],i)=>i?c.lineTo(px*size,py*size):c.moveTo(px*size,py*size));c.closePath();c.fill();}
    c.restore();
  }
  function effects(c,type,W,H,accent){
    c.save();c.strokeStyle=c.fillStyle=accent;
    if(type==='rays'||type==='speed'){c.translate(W/2,H*.48);for(let i=0;i<40;i++){c.rotate(Math.PI/20);c.globalAlpha=i%2?.05:.12;c.beginPath();c.moveTo(-10,-190);c.lineTo(-45,-H);c.lineTo(30,-H);c.closePath();c.fill();}}
    else if(type==='halo'){for(let i=0;i<5;i++){c.globalAlpha=.12;c.lineWidth=2+i;c.beginPath();c.ellipse(W/2,H*.48,270+i*35,330+i*35,-.3,0,Math.PI*2);c.stroke();}}
    else if(type==='holo'){const g=c.createLinearGradient(0,0,W,H);['#8af1ff','#ffc8ee','#fff9b0','#a1ffe2','#b5a1ff'].forEach((v,i)=>g.addColorStop(i/4,v));c.globalAlpha=.18;c.fillStyle=g;c.fillRect(0,0,W,H);for(let x=-H;x<W;x+=65){c.globalAlpha=.12;c.fillStyle='#fff';c.beginPath();c.moveTo(x,0);c.lineTo(x+25,0);c.lineTo(x+H+25,H);c.lineTo(x+H,H);c.fill();}}
    else if(type==='fireworks'){for(let i=0;i<6;i++){const x=(i*273+90)%W,y=(i*319+140)%(H*.75);for(let j=0;j<24;j++){const a=j*Math.PI/12;c.globalAlpha=.45;c.lineWidth=2;c.beginPath();c.moveTo(x+Math.cos(a)*35,y+Math.sin(a)*35);c.lineTo(x+Math.cos(a)*100,y+Math.sin(a)*100);c.stroke();}}}
    else if(type!=='none')for(let i=0;i<70;i++){const x=(i*233+71)%W,y=(i*389+31)%H,s=7+i%16;c.globalAlpha=.25+(i%4)*.12;
      if(type==='confetti'){c.fillStyle=[accent,'#8affcf','#f794da'][i%3];c.save();c.translate(x,y);c.rotate(i);c.fillRect(-4,-8,8,18);c.restore();}
      else if(type==='bubbles'||type==='petals'){c.beginPath();c.ellipse(x,y,s,type==='petals'?s*.4:s,i,0,Math.PI*2);type==='bubbles'?c.stroke():c.fill();}
      else if(type==='comets'){c.beginPath();c.moveTo(x,y);c.lineTo(x-85,y-110);c.stroke();stamp(c,'star',x,y,s,accent);}
      else stamp(c,type==='lightning'?'bolt':type==='diamonds'?'diamond':'star',x,y,type==='lightning'?s*2:s,accent);
    }c.restore();
  }
  function render(canvas,model,assets,members,teamName,day,format,preview=false){
    const [fw,fh]=FORMATS[format],width=preview?Math.min(720,fw):fw,height=fh*width/fw;canvas.width=width;canvas.height=Math.round(height);
    const c=canvas.getContext('2d'),W=1000,H=height/width*1000,isCard=format==='card',s=model.settings,[top,bottom,accent]=THEMES[s.theme],light=['ice','rose'].includes(s.theme),ink=light?'#19263b':'#fff7e3';
    c.scale(width/W,width/W);const gradient=c.createLinearGradient(0,0,W,H);gradient.addColorStop(0,top);gradient.addColorStop(1,bottom);c.fillStyle=gradient;c.fillRect(0,0,W,H);
    const glow=c.createRadialGradient(500,H*.48,20,500,H*.48,590);glow.addColorStop(0,accent+'44');glow.addColorStop(1,accent+'00');c.fillStyle=glow;c.fillRect(0,0,W,H);
    if(s.silhouette!=='none')assets.images.forEach((img,i)=>{if(!img)return;c.save();c.globalAlpha=s.silhouette==='bold'?.23:.1;portrait(c,assets.silhouette(i,accent),i%2?-170:470,H*.20,720,H*.65);c.restore();});
    effects(c,s.effect,W,H,accent);
    if(s.frame!=='none'){c.strokeStyle=s.frame==='silver'?'#cddcec':s.frame==='neon'?assets.colors[0][0]:accent;c.lineWidth=9;c.strokeRect(27,27,W-54,H-54);c.globalAlpha=.5;c.lineWidth=1.5;c.strokeRect(42,42,W-84,H-84);c.globalAlpha=1;
      for(const [x,y,dx,dy] of [[60,60,1,1],[940,60,-1,1],[60,H-60,1,-1],[940,H-60,-1,-1]]){c.lineWidth=4;c.beginPath();c.moveTo(x,y+dy*64);c.lineTo(x,y);c.lineTo(x+dx*64,y);c.stroke();stamp(c,'diamond',x+dx*12,y+dy*12,9,accent);}}
    const titleY=isCard?155:270,figureTop=isCard?310:555,figureH=isCard?600:665,base=figureTop+figureH;
    fitText(c,'MOB  /  TAG BATTLE LEAGUE',500,titleY-70,820,22,ink);
    fitText(c,'CHAMPIONS',500,titleY,840,isCard?89:91,ink);
    fitText(c,teamName,500,titleY+61,790,39,accent);
    c.strokeStyle=accent;c.globalAlpha=.4;c.lineWidth=1;c.beginPath();c.moveTo(155,titleY+90);c.lineTo(845,titleY+90);c.stroke();c.globalAlpha=1;
    stamp(c,'crown',500,isCard?275:470,isCard?68:90,accent);
    c.fillStyle=light?'#15314c22':'#00000030';c.beginPath();c.ellipse(500,base+12,365,27,0,0,Math.PI*2);c.fill();
    const n=members.length,cell=Math.min(770/n,540),left=(1000-cell*n)/2;
    assets.images.forEach((img,i)=>{c.save();c.shadowColor=assets.colors[i][0];c.shadowBlur=25;portrait(c,img,left+i*cell+5,figureTop,cell-10,figureH);c.restore();});
    c.fillStyle=light?'#ffffffa8':'#071122ac';c.fillRect(83,base+48,834,isCard?214:238);
    fitText(c,day+'  /  CHAMPION EDITION',500,base+93,790,23,accent);
    members.forEach((p,i)=>fitText(c,p.name,500,base+141+i*40,790,28,ink));
    fitText(c,s.caption,500,isCard?H-140:H-192,805,27,ink);
    fitText(c,'MOB PARTY GAMES  ·  VICTORY COLLECTION',500,H-75,820,18,accent);
    const edits=model.edits[format];
    for(const action of edits){if(action.type==='stamp')stamp(c,action.shape,action.x*W,action.y*H,action.size*W,action.color,assets.silhouette(action.member,action.color));
      else {c.strokeStyle=c.fillStyle=action.color;c.lineWidth=action.size*W;c.lineCap=c.lineJoin='round';c.beginPath();action.points.forEach(([x,y],i)=>i?c.lineTo(x*W,y*H):c.moveTo(x*W,y*H));if(action.points.length===1){c.arc(action.points[0][0]*W,action.points[0][1]*H,c.lineWidth/2,0,Math.PI*2);c.fill();}else c.stroke();}}
    canvas.setAttribute('aria-label',`${teamName} 優勝記念${isCard?'カード':'壁紙'}`);return canvas;
  }
  function createModel(){return {settings:{theme:'gold',frame:'gold',effect:'stars',silhouette:'soft',caption:'TOGETHER, WE ARE THE CHAMPIONS.'},edits:{wallpaper:[],card:[]}};}
  function history(initial){let current=copy(initial),undo=[],redo=[];return {get:()=>current,commit(next){undo.push(copy(current));if(undo.length>60)undo.shift();current=copy(next);redo=[];},undo(){if(!undo.length)return;redo.push(copy(current));current=undo.pop();},redo(){if(!redo.length)return;undo.push(copy(current));current=redo.pop();},canUndo:()=>!!undo.length,canRedo:()=>!!redo.length};}
  function open({screen,esc,members,teamName,done}){
    const day=new Date().toLocaleDateString('ja-JP'),store=history(createModel());let format='wallpaper',tool='view',tab='design',active=true,assets=null,gesture=null,drawRequest=0,exporting=false;
    const state={color:'#ffd66f',size:5,shape:'crown',member:0};
    const options=(values)=>Object.entries(values).map(([value,label])=>`<option value="${value}">${esc(label)}</option>`).join('');
    screen.innerHTML=`<section class="champion-studio"><header><div><small>VICTORY COLLECTION</small><h1>王者のアトリエ</h1></div><button id="studioDone" type="button">完了</button></header><nav class="studio-formats" aria-label="画像の種類"><button data-format="wallpaper" aria-pressed="true">壁紙 <small>9:16</small></button><button data-format="card" aria-pressed="false">カード <small>63×88mm</small></button><button id="studioUndo" aria-label="1操作戻す" disabled>↶ 戻す</button><button id="studioRedo" aria-label="やり直す" disabled>↷</button></nav><div class="studio-work"><div class="studio-preview"><button id="studioZoom" type="button" aria-pressed="false">拡大</button><canvas id="studioCanvas" role="img"></canvas><span id="studioHint">プレビュー</span></div><div class="studio-controls"><nav class="studio-tabs" aria-label="編集ツール"><button data-tab="design" aria-pressed="true">デザイン</button><button data-tab="effects">演出</button><button data-tab="stamp">スタンプ</button><button data-tab="draw">手書き</button></nav><div class="studio-panel" data-panel="design"><label>テーマ<select data-setting="theme">${options({gold:'王者の金',aurora:'ネオン・オーロラ',royal:'ロイヤル',sunset:'夕焼け',ice:'アイスブルー',rose:'ローズ'})}</select></label><label>フレーム<select data-setting="frame">${options({gold:'テーマカラー',silver:'シルバー',neon:'キャラクターカラー',none:'なし'})}</select></label><label class="studio-wide">メッセージ<input id="studioCaption" maxlength="40" value="TOGETHER, WE ARE THE CHAMPIONS."></label></div><div class="studio-panel" data-panel="effects" hidden><label>エフェクト<select data-setting="effect">${options(EFFECTS)}</select></label><label>背景シルエット<select data-setting="silhouette">${options({soft:'さりげなく',bold:'くっきり',none:'なし'})}</select></label><p class="studio-wide">背景に優勝キャラクターのシルエットを重ねます。</p></div><div class="studio-panel" data-panel="stamp" hidden><label>かたち<select id="studioShape">${options(SHAPES)}</select></label><label>キャラクター<select id="studioMember">${options(Object.fromEntries(members.map((p,i)=>[i,p.name])))}</select></label><label>スタンプの大きさ<input id="studioStampSize" type="range" min="5" max="28" value="12"></label><div id="studioPalette" class="studio-palette" aria-label="キャラクターの色"></div></div><div class="studio-panel" data-panel="draw" hidden><label>ペンの色<input id="studioColor" type="color" value="#ffd66f"></label><label>線の太さ<input id="studioPenSize" type="range" min="2" max="24" value="5"></label><button id="studioClear" class="studio-wide">この画像の手書き・スタンプを消す</button></div></div></div><footer><div class="studio-save"><button id="studioSaveWallpaper" disabled>壁紙を保存</button><button id="studioSaveCard" disabled>カードを保存</button></div><p id="studioStatus" role="status">画像を準備しています…</p></footer></section>`;
    const $=id=>screen.querySelector('#'+id),canvas=$('studioCanvas'),root=screen.querySelector('.champion-studio'),status=$('studioStatus');
    root.style.setProperty('--studio-top',Math.max(0,root.getBoundingClientRect().top)+'px');
    function controls(){const model=store.get();screen.querySelectorAll('[data-setting]').forEach(el=>el.value=model.settings[el.dataset.setting]);$('studioCaption').value=model.settings.caption;$('studioUndo').disabled=!store.canUndo();$('studioRedo').disabled=!store.canRedo();}
    function paint(){if(!active||!assets)return;render(canvas,store.get(),assets,members,teamName,day,format,true);$('studioHint').textContent=tool==='draw'?'指・ペンで手書き / 1筆ずつ戻せます':tool==='stamp'?'画像をタップしてスタンプを配置':'壁紙とカードはそれぞれ編集できます';canvas.style.touchAction=tool==='view'?'auto':'none';controls();}
    function requestPaint(){if(drawRequest)return;drawRequest=requestAnimationFrame(()=>{drawRequest=0;paint();});}
    function edit(fn){if(gesture)return;const next=copy(store.get());fn(next);store.commit(next);paint();}
    function paletteButtons(){if(!assets)return;const colors=assets.colors[state.member];$('studioPalette').innerHTML=colors.map(color=>`<button type="button" data-color="${color}" style="--swatch:${color}" aria-label="色 ${color}" aria-pressed="${state.color===color}"></button>`).join('');$('studioPalette').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.color=b.dataset.color;$('studioColor').value=state.color;paletteButtons();});}
    screen.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>{if(gesture)return;format=b.dataset.format;screen.querySelectorAll('[data-format]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));paint();});
    screen.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{if(gesture)return;tab=b.dataset.tab;tool=tab==='draw'||tab==='stamp'?tab:'view';screen.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));screen.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==tab);paint();});
    screen.querySelectorAll('[data-setting]').forEach(el=>el.onchange=()=>edit(m=>m.settings[el.dataset.setting]=el.value));
    $('studioCaption').onchange=e=>edit(m=>m.settings.caption=e.target.value);
    $('studioShape').onchange=e=>state.shape=e.target.value;
    $('studioMember').onchange=e=>{state.member=Number(e.target.value);if(assets)state.color=assets.colors[state.member][0];$('studioColor').value=state.color;paletteButtons();};
    $('studioColor').oninput=e=>{state.color=e.target.value;paletteButtons();};
    $('studioPenSize').oninput=e=>state.size=Number(e.target.value);
    $('studioUndo').onclick=()=>{if(gesture)return;store.undo();paint();};$('studioRedo').onclick=()=>{if(gesture)return;store.redo();paint();};
    $('studioClear').onclick=()=>edit(m=>m.edits[format]=[]);
    $('studioZoom').onclick=()=>{if(gesture)return;const focused=root.classList.toggle('studio-focus');$('studioZoom').textContent=focused?'縮小':'拡大';$('studioZoom').setAttribute('aria-pressed',String(focused));};
    const point=e=>{const rect=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))];};
    canvas.addEventListener('pointerdown',e=>{if(!assets||tool==='view'||gesture||e.button>0)return;e.preventDefault();const [x,y]=point(e);
      if(tool==='stamp'){edit(m=>m.edits[format].push({type:'stamp',shape:state.shape,color:state.color,member:state.member,size:Number($('studioStampSize').value)/100,x,y}));return;}
      const before=copy(store.get()),stroke={type:'stroke',color:state.color,size:state.size/1000,points:[[x,y]]};gesture={id:e.pointerId,before,stroke};store.get().edits[format].push(stroke);canvas.setPointerCapture(e.pointerId);requestPaint();
    });
    canvas.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;e.preventDefault();const samples=e.getCoalescedEvents?.();for(const p of samples?.length?samples:[e])gesture.stroke.points.push(point(p));requestPaint();});
    function end(e,cancel=false){if(!gesture||gesture.id!==e.pointerId)return;const {before}=gesture,after=copy(store.get());Object.assign(store.get(),before);gesture=null;if(!cancel)store.commit(after);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);paint();}
    canvas.addEventListener('pointerup',e=>end(e));canvas.addEventListener('pointercancel',e=>end(e,true));canvas.addEventListener('lostpointercapture',e=>end(e,true));
    async function saveAs(target){if(!assets||gesture||exporting)return;exporting=true;const buttons=[$('studioSaveWallpaper'),$('studioSaveCard')];buttons.forEach(b=>b.disabled=true);status.textContent='保存画像を作成しています…';try{const output=document.createElement('canvas');render(output,store.get(),assets,members,teamName,day,target);await window.MobCollectibles.save(output,`MOB-CHAMPIONS-${target}-${day.replaceAll('/','-')}`,target==='card'?20000:null);if(active)status.textContent=target==='card'?'カードの保存を開始しました。印刷は63×88mm・拡大縮小なし。':'壁紙の保存を開始しました。1440×2560 PNG。';}catch{if(active)status.textContent='保存できませんでした。もう一度保存ボタンを押してください。';}finally{exporting=false;if(active)buttons.forEach(b=>b.disabled=false);}}
    $('studioSaveWallpaper').onclick=()=>saveAs('wallpaper');$('studioSaveCard').onclick=()=>saveAs('card');
    $('studioDone').onclick=()=>{active=false;if(drawRequest)cancelAnimationFrame(drawRequest);done();};
    Promise.all(members.map(p=>load(p.img))).then(images=>{if(!active)return;if(images.some(img=>!img)){status.textContent='画像を読み込めませんでした。再度開いてください。';return;}const cache=new Map();assets={images,colors:images.map(palette),silhouette(i,color){const key=i+color;if(!cache.has(key))cache.set(key,tinted(images[i],color));return cache.get(key);}};state.color=assets.colors[0][0];$('studioColor').value=state.color;paletteButtons();paint();$('studioSaveWallpaper').disabled=$('studioSaveCard').disabled=false;status.textContent='壁紙・カードをそれぞれ保存できます。装飾は画像ごとに保持。';}).catch(()=>{if(active)status.textContent='画像の準備に失敗しました。再度開いてください。';});
  }
  window.MobChampionStudio={open,render,createModel,history,palette,FORMATS};
})();
