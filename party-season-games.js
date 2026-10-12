/* Responsive mini-games: input clocks and physical positions are shared with drawing. */
(function(root){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const balance=root?.MobGameBalance||(typeof module!=='undefined'?require('./party-game-balance.js'):null);
  const keys=['bananaBoatMob','warpedWallMob','santaClausMob'];
  const rules={
    bananaBoatMob:['下部のスティックを左右に倒してバナナボートを操作。船の幅に合わせてキャッチ！','1個4点、全30個。25個取れば100点です。','後半ほど落下が速くなります。波と横風を読み、次のバナナへ先回りしよう。'],
    warpedWallMob:['自動で走るモブくんがオレンジ線の中央に来たらタップ！ 中央に近いほど登頂しやすくなります。','5m → 10m → 15m → 20m → 25m → 30m。壁を進むごとに走る速度がアップ！ 登る時も加速し、そのまま次の壁へ進みます。','6つの壁を連続で攻略。登頂数とタイミング精度で最大100点。滑り落ちると終了です。'],
    santaClausMob:['散らばったプレゼントを選んでタップ。重さとソリまでの距離を考えて選ぼう！','拾ったら左右ボタンを交互に連打。重い箱ほど運搬が遅くなり、連打を速めすぎても速度には上限があります。','12秒勝負。届けると大25点・中12点・小7点、最大100点。箱は補充されず、運びかけでは得点になりません。']
  };
  function wallResult(level,power,timing,roll=.5){const chance=clamp((timing-(.28+.18*clamp(level/5)))/.26),clear=roll<chance;return {clear,chance,quality:timing,points:clear?23+2*timing:0};}
  const bananaPoints=count=>Math.min(100,Math.max(0,count)*4);
  const gaugeValue=(elapsed,level)=>(1-Math.cos(Math.max(0,elapsed)*(3.6+level*1.3)))/2;
  const runPosition=(elapsed,level)=>.12+Math.max(0,elapsed)*(.30+level*.055);
  const wallSurface=(height,level)=>({x:.57+.29*(1-Math.pow(1-clamp(height),2.4)),y:.85-(.26+level*.028)*clamp(height)});
  // The whole avatar stays on the exposed side of the same curve used to paint the wall.
  function climbPose(elapsed,level,clear,quality,from){
    if(elapsed<.16)return {x:from+(.552-from)*clamp(elapsed/.16),y:.85,height:0,angle:-.08};
    const u=clamp((elapsed-.16)/.95),height=clear?Math.pow(u,1.75):Math.sin(u*Math.PI)*clamp(quality*.78,.08,.77),surface=wallSurface(height,level);
    return {x:surface.x-.018,y:surface.y,height,angle:clear||u<.5?-.22:-.10};
  }
  function inputSeconds(event,now,origin){const stamp=Number(event?.timeStamp);return Math.max(0,((Number.isFinite(stamp)&&Math.abs(stamp-now)<1000?stamp:now)-origin)/1000);}
  const giftTypes=[{name:'大',points:25,speed:.28},{name:'中',points:12,speed:.35},{name:'小',points:7,speed:.47}];
  function giftLayout(random=Math.random){
    const list=[];
    for(let i=0;i<11;i++){
      let best=null,bestDistance=-1;
      for(let j=0;j<160;j++){
        const p={x:.11+random()*.78,y:.34+random()*.51},d=list.length?Math.min(...list.map(q=>Math.hypot(p.x-q.x,p.y-q.y))):1;
        if(d>bestDistance){best=p;bestDistance=d;}if(d>=.185)break;
      }
      list.push(best);
    }
    // Put two large boxes in the middle and two farther out; no endless close-range refill.
    const byDistance=[...list].sort((a,b)=>Math.hypot(a.x-.49,a.y-.24)-Math.hypot(b.x-.49,b.y-.24));
    return list.map((p,i)=>({i,...p,type:[3,5,8,10].includes(byDistance.indexOf(p))?0:[1,6,9].includes(byDistance.indexOf(p))?1:2,available:true,angle:(random()-.5)*.55,vx:(random()-.5)*.016,vy:(random()-.5)*.009}));
  }
  function bananaPlan(random=Math.random){let x=.5,at=.55;return Array.from({length:30},(_,id)=>{const section=Math.floor(id/10),sign=x<.25?1:x>.75?-1:random()<.52?-1:1;x=clamp(x+sign*(.20+random()*.18),.12,.88);const b={id,x,y:-.09,at,speed:.52+section*.065,vx:0,dead:false};at+=.52-section*.045;return b;});}
  async function run(api){
    const {key,screen,valid}=api,kind=keys.indexOf(key);if(kind<0)return;
    const themes=['ocean','wall','snow'],tags=['TROPICAL CATCH','VERTICAL CHALLENGE','MIDNIGHT DELIVERY'];
    screen.innerHTML=`<section class="season-shell season-${themes[kind]}"><header><small>${tags[kind]} <span>${api.esc(api.player.name)}</span></small><h2>${api.esc(api.title)}</h2></header><div class="season-hud"><b id="seasonStatus"></b><strong id="seasonScore">0 <small>pt</small></strong></div><p id="seasonHint" role="status"></p><div class="season-world"><canvas aria-label="${api.esc(api.title)}のプレイ画面"></canvas></div><div class="season-actions">${kind===1?'<button id="seasonAction">オレンジ線でタップ<span>中央に近いほど登頂しやすい</span></button>':kind===2?'<button data-hand="0" disabled>◀ 左<span>交互に連打</span></button><button data-hand="1" disabled>右 ▶<span>ソリへ運ぶ</span></button>':'<div class="season-pad-caption"><b>STEER</b><span>左右に倒して移動</span></div><div id="seasonStick"></div><div class="season-pad-caption"><b>30 BANANAS</b><span>25個で100点</span></div>'}</div></section>`;
    const canvas=screen.querySelector('canvas'),ctx=canvas.getContext('2d'),world=screen.querySelector('.season-world'),status=screen.querySelector('#seasonStatus'),scoreEl=screen.querySelector('#seasonScore'),hint=screen.querySelector('#seasonHint'),action=screen.querySelector('#seasonAction'),hands=[...screen.querySelectorAll('[data-hand]')];
    let w=320,h=320,active=false,ended=false,time=0,last=0,origin=0,score=0,endTitle='FINISH';
    const actor=new Image();let crop={x:0,y:0,w:1,h:1};
    const actorReady=new Promise(resolve=>{actor.onload=()=>{crop={x:0,y:0,w:actor.naturalWidth,h:actor.naturalHeight};try{const c=document.createElement('canvas');c.width=c.height=128;const cctx=c.getContext('2d',{willReadFrequently:true});cctx.drawImage(actor,0,0,128,128);const a=cctx.getImageData(0,0,128,128).data;let l=128,t=128,r=0,b=0;for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(a[(y*128+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}if(r>l&&b>t)crop={x:l/128*actor.naturalWidth,y:t/128*actor.naturalHeight,w:(r-l+1)/128*actor.naturalWidth,h:(b-t+1)/128*actor.naturalHeight};}catch(_){}resolve();};actor.onerror=resolve;actor.src=api.player.img;});
    const art=root.MobSeasonArt.create(ctx,actor,()=>crop);
    let redraw=()=>{};
    const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(2,root.devicePixelRatio||1);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);redraw();};
    resize();const observer=new ResizeObserver(resize);observer.observe(world);
    const held=new Set(),disposeStick=kind===0?root.MobPartyControls.stick(screen.querySelector('#seasonStick'),held,()=>active&&!ended):()=>{};
    const particles=[];
    function burst(x,y,color,text){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*.3,vy:-.12-Math.random()*.18,life:.6,max:.6,size:2+Math.random()*2,color});if(text)particles.push({x,y:y-.05,vx:0,vy:-.08,life:.9,max:.9,text,color});if(particles.length>100)particles.splice(0,particles.length-100);}
    function points(n){score=clamp(Math.round(n),0,100);scoreEl.innerHTML=score+' <small>pt</small>';scoreEl.animate?.([{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:180});}
    function finish(note,title='FINISH'){if(ended)return;ended=true;active=false;endTitle=title;observer.disconnect();disposeStick();hands.forEach(b=>b.disabled=true);if(action)action.disabled=true;status.textContent='FINISH';hint.textContent=note;setTimeout(()=>{if(valid())api.done(score,note);},1100);}
    const nowTime=event=>inputSeconds(event,performance.now(),origin);
    // Catching area matches the basket at the center; the stick has acceleration and no teleport.
    let boat=.5,velocity=0,spawned=0,caught=0,missed=0,combo=0;
    const plan=bananaPlan(api.random||Math.random),bananas=[];
    const wind=t=>Math.floor(t/4)%3===1?1:Math.floor(t/4)%3===2?-1:0;
    const seaHeight=t=>.82+Math.sin(t*2.5)*.023;
    function bananaFrame(dt){
      const breeze=wind(time),axis=held.axisX||0,desired=axis*.94;
      velocity+=clamp(desired-velocity,-dt*7,dt*7);boat=clamp(boat+(velocity+breeze*.018)*dt,.14,.86);
      while(spawned<30&&time>=plan[spawned].at)bananas.push({...plan[spawned++]});
      const catchY=seaHeight(time)-.125,previousCatch=seaHeight(Math.max(0,time-dt))-.125;
      for(const b of bananas){if(b.dead)continue;const old=b.y;b.vx=breeze*.042;b.y+=dt*b.speed;b.x=clamp(b.x+b.vx*dt,.08,.92);if(old<previousCatch&&b.y>=catchY){b.dead=true;if(Math.abs(b.x-boat)<=.15){caught++;combo++;points(bananaPoints(caught));burst(boat,catchY,'#fff49d',combo>=3?`${combo} COMBO`:'+4');api.beep(750+Math.min(combo,8)*45,35,.015);}else{missed++;combo=0;burst(b.x,seaHeight(time),'#b6f5ff','MISS');}}}
      status.textContent=`CATCH ${caught} / 30 · MISS ${missed}`;
      const upcoming=wind(time+.7);hint.textContent=upcoming!==breeze?'風向きが変わる！ 次の落下位置を見よう':breeze===1?'横風 → · スティックで先回り！':breeze===-1?'横風 ← · 船の中央でキャッチ！':spawned>=20?'ラスト10個！ 落下スピードUP':'下部スティックで操作 · 次のバナナへ！';
      art.ocean({w,h,time,boat,velocity,bananas,seaY:seaHeight(time)*h,catchY:catchY*h,breeze});
      if(caught+missed===30)finish(`${caught}個キャッチ / ${missed}個落下`,score===100?'PERFECT CATCH!':'CATCH FINISH!');
    }
    let precisionSum=0,clears=0;
    let level=0,phase='run',phaseTime=0,runner=.12,jumpX=.12,result=null,pose={x:.12,y:.85,height:0};
    const riseAt=n=>Array.from({length:n},(_,i)=>.26+i*.028).reduce((a,b)=>a+b,0);
    let camera={x:0,y:0},worldPose={x:.12,y:.85};
    function beginClimb(at,x,outcome){phase='climb';phaseTime=at;jumpX=Math.min(.51,x);result=outcome;action.disabled=true;}
    function wallTap(event){
      if(!active||ended||phase!=='run')return;event?.preventDefault();const at=nowTime(event);
      runner=runPosition(at-phaseTime,level);const timing=clamp(1-Math.abs(runner-.49)/.09);
      beginClimb(at,runner,wallResult(level,1,timing,(api.random||Math.random)()));
      api.beep(550+timing*450,35,.015);time=Math.max(time,at);wallFrame();art.effects({w,h,particles,ended,endTitle,score});
    }
    if(action){action.onpointerdown=wallTap;action.onkeydown=e=>{if(!e.repeat&&(e.key==='Enter'||e.key===' '))wallTap(e);};}
    function wallFrame(){
      let t=Math.max(0,time-phaseTime),pan=0;
      if(phase==='run'){runner=runPosition(t,level);pose={x:Math.min(.51,runner),y:.85,height:0};hint.textContent='オレンジ線の中央でタップ！';if(runner>.535){beginClimb(time,.51,{clear:false,quality:0,points:0});t=0;}}
      if(phase==='climb'){
        pose=climbPose(t,level,result.clear,result.quality,jumpX);hint.textContent=result.clear?'加速して駆け上がる！':'タイミングが外れた… 滑り落ちる！';
        if(t>=1.11){if(!result.clear){burst(.51,.85,'#f3b577','SLIP');finish(clears+'段クリア / '+(clears*5)+'mまで登頂','TRY AGAIN');}else{precisionSum+=result.points;clears++;const previous=score;points(balance.wallTotal(clears,precisionSum));result.awarded=score-previous;phase='walk';phaseTime=time;t=0;api.beep(950,80,.02);}}
      }
      if(phase==='walk'){
        const u=clamp(t/1.15),surface=wallSurface(1,level);pan=u*u*(3-2*u);
        pose={x:.842+u*.278,y:surface.y,height:1};hint.textContent=(level+1)*5+'m CLEAR! +'+result.awarded+'点 · 次の壁へ';
        if(u===1){if(level===5){finish('30mまで6つの壁を連続登頂！','ALL WALLS CLEAR!');}else{level++;phase='run';phaseTime=time;runner=.12;pose={x:.12,y:.85,height:0};pan=0;action.disabled=false;}}
      }
      camera={x:level+pan,y:-riseAt(level)-pan*(.26+level*.028)};
      worldPose={x:level+pose.x,y:pose.y-riseAt(level),angle:pose.angle||0};
      status.textContent=(level+1)*5+'m / 30m · CLEAR '+clears+'/6';
      art.wall({w,h,time,level,phase,pose:worldPose,camera,clears,result,surface:wallSurface,riseAt});
    }
    // Finite, irregular gifts. Distance, mass and bounded walking speed determine the cost.
    let mode='choose',px=.49,py=.24,selected=null,buffer=0,lastHand=-1,lastTap=-Infinity,delivered=0,unloadAt=0;
    const presents=giftLayout(api.random||Math.random),sizes=giftTypes;
    hands.forEach(b=>b.onpointerdown=e=>{e.preventDefault();if(!active||ended||mode!=='carry')return;const at=nowTime(e),hand=Number(b.dataset.hand);if(at>=12||hand===lastHand||at-lastTap<.085)return;lastTap=at;lastHand=hand;buffer=Math.min(.24,buffer+.16);b.animate?.([{transform:'translateY(2px)'},{transform:'translateY(0)'}],{duration:100});});
    function moveGifts(dt){for(const g of presents){if(!g.available||g===selected)continue;const speed=g.type===0?.35:1;g.x+=g.vx*dt*speed;g.y+=g.vy*dt*speed;g.angle+=g.vx*dt*2;const collision=presents.some(other=>other!==g&&other.available&&Math.hypot(g.x-other.x,g.y-other.y)<.17);if(g.x<.10||g.x>.90||collision)g.vx*=-1;if(g.y<.34||g.y>.86||collision)g.vy*=-1;g.x=clamp(g.x,.10,.90);g.y=clamp(g.y,.34,.86);}}
    function santaFrame(dt){
      // End before processing movement: an undelivered gift cannot score after the deadline.
      if(time>=12&&!ended){finish(`${delivered}個をソリへ届けた！`,'DELIVERY FINISH');dt=0;}
      if(!ended){moveGifts(dt);
        if(mode==='walk'){const dx=selected.x-px,dy=selected.y-py,d=Math.hypot(dx,dy),step=dt*3.2;if(d<=step){px=selected.x;py=selected.y;mode='carry';selected.available=false;buffer=0;lastHand=-1;lastTap=-Infinity;hands.forEach(b=>b.disabled=false);api.beep(600,30,.01);}else{px+=dx/d*step;py+=dy/d*step;}}
        else if(mode==='carry'){const drive=Math.min(buffer,dt);buffer=Math.max(0,buffer-dt);const dx=.49-px,dy=.24-py,d=Math.hypot(dx,dy),step=drive*sizes[selected.type].speed;if(d<=step+.001){px=.49;py=.24;mode='unload';unloadAt=time;hands.forEach(b=>b.disabled=true);}else{px+=dx/d*step;py+=dy/d*step;}}
        else if(mode==='unload'&&time-unloadAt>=.25){points(score+sizes[selected.type].points);delivered++;burst(.49,.22,'#eeba55','+'+sizes[selected.type].points);api.beep(950,60,.02);selected=null;mode='choose';}
      }
      if(!ended){status.textContent=`${Math.max(0,12-time).toFixed(1)}秒 · DELIVERED ${delivered}`;hint.textContent=mode==='choose'?'重さ × 距離で選ぼう · 箱をタップ':mode==='walk'?'箱へ移動中 · 運ぶ距離も見ておこう':mode==='unload'?'ソリへ積み込み中…':`${sizes[selected.type].name} ${sizes[selected.type].points}点 · 左右を交互に連打！`;}
      art.snow({w,h,time,presents,selected,px,py,mode,buffer,delivered,score});
    }
    canvas.onpointerdown=e=>{if(!active||ended)return;if(kind===1){wallTap(e);return;}if(kind!==2||mode==='carry'||mode==='unload'||nowTime(e)>=12)return;e.preventDefault();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const near=presents.filter(g=>g.available).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(near&&Math.abs(near.x-x)*w<=25&&Math.abs(near.y-y)*h<=25){selected=near;mode='walk';}};
    const render=dt=>{for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(!p.text)p.vy+=dt*.28;if(p.life<=0)particles.splice(i,1);}if(kind===0)bananaFrame(dt);else if(kind===1)wallFrame(dt);else santaFrame(dt);art.effects({w,h,particles,ended,endTitle,score});};
    redraw=()=>{if(valid()&&!ended)render(0);};
    render(0);await actorReady;if(!valid()){observer.disconnect();disposeStick();return;}render(0);await api.countdown();if(!valid()){observer.disconnect();disposeStick();return;}active=true;origin=last=performance.now();
    function frame(now){if(!valid()){observer.disconnect();disposeStick();return;}if(ended)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;time=(now-origin)/1000;render(dt);if(!ended)requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  }
  const api={keys,rules,wallResult,bananaPoints,gaugeValue,runPosition,wallSurface,climbPose,inputSeconds,giftLayout,giftTypes,bananaPlan,run};if(typeof module!=='undefined')module.exports=api;if(root)root.MobSeasonGames=api;
})(typeof window!=='undefined'?window:null);
