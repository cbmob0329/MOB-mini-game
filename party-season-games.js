/* Three solo rounds sharing the same responsive canvas and lifecycle. */
(function(root){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const keys=['bananaBoatMob','warpedWallMob','santaClausMob'];
  const rules={
    bananaBoatMob:['海を左右にドラッグしてバナナボートを操作。空から降る30個のバナナをキャッチ！','1個4点、25個で100点。5個まで落としても満点を狙えます。','波でボートが上下し、風でバナナが流れます。風向きの予告を見て先回り！'],
    warpedWallMob:['ゲージを中央の白線で止めてダッシュ力を決定。走り始めたらオレンジラインでタップ！','ダッシュ力と踏み切りのタイミングで登れるかが決まります。失敗すると挑戦終了。','全4段階。後半ほどゲージとダッシュが速くなります。1段最大25点、登頂時の精度で得点が変わります。'],
    santaClausMob:['運びたいプレゼントをタップするとモブくんが取りに行きます。','拾ったら左右ボタンを交互に連打して、上のソリへ運ぼう！ 大きいほど重くなります。','12秒勝負。ソリに届けると大25点・中12点・小7点。最大100点。']
  };
  function wallResult(level,power,timing){const quality=power*.5+timing*.5,clear=power>=.5&&timing>=.5&&quality>=.70+level*.025;return {clear,quality,points:clear?Math.round(23+2*clamp((quality-.7)/.3)):0};}
  const bananaPoints=count=>Math.min(100,Math.max(0,count)*4);
  async function run(api){
    const {key,screen,valid}=api,kind=keys.indexOf(key);if(kind<0)return;
    screen.innerHTML=`<section class="season-shell"><header><small>${api.esc(api.player.name)}</small><h2>${api.esc(api.title)}</h2></header><div class="season-hud"><b id="seasonStatus"></b><strong id="seasonScore">0 pt</strong></div><p id="seasonHint"></p><div class="season-world"><canvas aria-label="${api.esc(api.title)}のプレイ画面"></canvas></div><div class="season-actions">${kind===1?'<button id="seasonAction">白線でSTOP</button>':kind===2?'<button data-hand="0" disabled>◀ 左</button><button data-hand="1" disabled>右 ▶</button>':'<span>海をドラッグして左右へ移動</span>'}</div></section>`;
    const canvas=screen.querySelector('canvas'),ctx=canvas.getContext('2d'),world=screen.querySelector('.season-world'),status=screen.querySelector('#seasonStatus'),scoreEl=screen.querySelector('#seasonScore'),hint=screen.querySelector('#seasonHint'),action=screen.querySelector('#seasonAction'),hands=[...screen.querySelectorAll('[data-hand]')];
    const actor=new Image();actor.src=api.player.img;
    let w=320,h=320,active=false,ended=false,time=0,last=0,score=0;
    const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(2,root.devicePixelRatio||1);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);};
    resize();const observer=new ResizeObserver(resize);observer.observe(world);
    function label(text,x,y,size=16,color='#fff'){ctx.fillStyle=color;ctx.font=`900 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(text,x,y);}
    function mob(x,y,size=40){if(actor.complete&&actor.naturalWidth)ctx.drawImage(actor,x-size/2,y-size,size,size);else{ctx.fillStyle='#ffdf5b';ctx.beginPath();ctx.arc(x,y-size/2,size/2,0,Math.PI*2);ctx.fill();}}
    function background(top,bottom){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
    function finish(note){if(ended)return;ended=true;active=false;observer.disconnect();hands.forEach(b=>b.disabled=true);if(action)action.disabled=true;status.textContent='FINISH';hint.textContent=note;setTimeout(()=>{if(valid())api.done(score,note);},850);}
    function points(n){score=clamp(Math.round(n),0,100);scoreEl.textContent=score+' pt';}
    // Banana rain: reachable consecutive lanes, announced wind and a moving sea surface.
    let boat=.5,target=.5,spawned=0,caught=0,missed=0,nextDrop=.4,previousLane=.5;
    const bananas=[];
    const seaY=()=>h*(.79+Math.sin(time*2.2)*.022);
    function wind(t){return Math.floor(t/5)%3===1?1:Math.floor(t/5)%3===2?-1:0;}
    function bananaFrame(dt){
      boat=clamp(boat+clamp(target-boat,-dt*1.8,dt*1.8),.1,.9);
      if(spawned<30&&time>=nextDrop){previousLane=clamp(previousLane+(Math.random()-.5)*.7,.13,.87);bananas.push({x:previousLane,y:-.07,dead:false});spawned++;nextDrop+=.53;}
      const breeze=wind(time),catchY=seaY()-h*.04;
      for(const b of bananas){if(b.dead)continue;const old=b.y*h;b.y+=dt*.47;b.x=clamp(b.x+dt*breeze*.035,.08,.92);if(old<catchY&&b.y*h>=catchY){b.dead=true;if(Math.abs(b.x-boat)*w<=w*.11+9){caught++;points(bananaPoints(caught));api.beep(850,40,.015);}else missed++;}}
      background('#6dd9ff','#e5fcff');label('☁',w*.18,h*.13,40,'#fff');label('☁',w*.78,h*.21,50,'#fff');
      ctx.fillStyle='#0987b9';ctx.fillRect(0,h*.53,w,h*.47);
      for(let n=0;n<5;n++){ctx.strokeStyle=n%2?'#77e7ef':'#2db8d7';ctx.lineWidth=3;ctx.beginPath();for(let x=0;x<=w;x+=5){const y=h*(.58+n*.085)+Math.sin(x/30+time*2+n)*5;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
      ctx.save();ctx.translate(boat*w,seaY());ctx.rotate(Math.sin(time*2.2)*.045);ctx.fillStyle='#ffe044';ctx.strokeStyle='#8b530c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w*.13,-12);ctx.quadraticCurveTo(-w*.07,29,w*.10,7);ctx.quadraticCurveTo(w*.16,-2,w*.13,-21);ctx.quadraticCurveTo(w*.06,8,-w*.13,-12);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#604621";ctx.lineWidth=2;for(const x of [-19,0,19]){ctx.beginPath();ctx.arc(x,0,5,Math.PI,Math.PI*2);ctx.stroke();}mob(0,-5,42);ctx.restore();
      bananas.filter(b=>!b.dead).forEach(b=>label('🍌',b.x*w,b.y*h,27));
      status.textContent=`${caught+missed} / 30 個 · MISS ${missed}`;
      const upcoming=wind(time+.9);hint.textContent=upcoming!==breeze?'もうすぐ風向きが変わる！':breeze===1?'風 → 右へ流れる！':breeze===-1?'風 ← 左へ流れる！':'波を見てバナナをキャッチ！';
      if(caught+missed===30)finish(`${caught}個キャッチ / ${missed}個落下`);
    }
    // Wall run: stop gauge, run automatically, jump once, climb and walk into the next round.
    let level=0,phase='gauge',phaseTime=0,power=0,runner=.1,jumpX=.1,result=null;
    const gaugeAt=t=>(1-Math.cos(t*(3.6+level*1.3)))/2;
    function wallTap(){if(!active||ended)return;if(phase==='gauge'){power=1-Math.abs(gaugeAt(time-phaseTime)-.5)*2;phase='run';phaseTime=time;action.textContent='オレンジ線でJUMP';}else if(phase==='run'){jumpX=runner;result=wallResult(level,power,clamp(1-Math.abs(runner-.62)/.13));phase='jump';phaseTime=time;action.disabled=true;}}
    if(action)action.onclick=wallTap;
    function wallFrame(){
      const t=time-phaseTime,ground=h*.86,top=h*(.36-level*.035);
      if(phase==='run')runner=.1+t*(.28+level*.055);
      background('#b2dcf1','#eef6f9');ctx.fillStyle='#40536c';ctx.fillRect(0,ground,w,h-ground);
      ctx.fillStyle='#27364d';ctx.beginPath();ctx.moveTo(w*.55,ground);ctx.bezierCurveTo(w*.82,ground,w*.69,top,w*.85,top);ctx.lineTo(w,top);ctx.lineTo(w,ground);ctx.fill();
      ctx.strokeStyle='#ff943f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(w*.62,ground-24);ctx.lineTo(w*.62,ground+5);ctx.stroke();label('JUMP',w*.62,ground+25,12,'#fff');
      label(`WALL ${level+1}`,w*.86,top-15,17,'#24334a');
      if(phase==='gauge'){
        const x=w*.09,y=h*.13,bw=w*.82;ctx.fillStyle='#22334e';ctx.fillRect(x,y,bw,24);ctx.fillStyle='#429a78';ctx.fillRect(x+bw*.4,y,bw*.2,24);ctx.fillStyle='#fff';ctx.fillRect(w*.5-2,y-5,4,34);ctx.fillStyle='#ffc341';ctx.fillRect(x+gaugeAt(t)*bw-4,y-5,8,34);label('中央の白線でSTOP',w*.5,y+53,15,'#1a324b');mob(w*.1,ground,40);hint.textContent='白線で止めるほどダッシュが強くなる！';if(t>8)finish('ゲージ時間切れ');
      }else if(phase==='run'){mob(runner*w,ground,40);hint.textContent=`ダッシュ力 ${Math.round(power*100)}% · オレンジ線でタップ！`;if(runner>.76){result={clear:false,points:0};jumpX=runner;phase='jump';phaseTime=time;action.disabled=true;}}
      else if(phase==='jump'){
        const u=clamp(t/.65);mob(w*(jumpX+(.88-jumpX)*u),ground-(ground-top)*(result.clear?u:Math.sin(u*Math.PI)*.55),40);
        hint.textContent=result.clear?'登れた！':'届かなかった…';
        if(t>=.65){if(!result.clear){finish(`${level}段クリア / 踏み切り失敗`);return;}points(score+result.points);phase='walk';phaseTime=time;api.beep(950,80,.02);}
      }else if(phase==='walk'){mob(w*(.85+clamp(t/.45)*.12),top,40);hint.textContent=`CLEAR! +${result.points}点`;if(t>=.45){if(level===3){finish('4段すべて登頂！');return;}level++;phase='gauge';phaseTime=time;runner=.1;action.disabled=false;action.textContent='白線でSTOP';}}
      status.textContent=`WALL ${level+1} / 4`;
    }
    // Santa: choose a rolling present, walk to it, then alternate hands to carry it home.
    let mode='choose',px=.5,py=.18,selected=null,carry=0,lastHand=-1,delivered=0;
    const sizes=[{name:'大',points:25,step:.06,size:38,color:'#e54b60'},{name:'中',points:12,step:.10,size:30,color:'#467ae1'},{name:'小',points:7,step:.15,size:24,color:'#269974'}];
    const presents=Array.from({length:9},(_,i)=>({i,type:i%3,x:.2+(i%3)*.3,y:.37+Math.floor(i/3)*.23,available:true}));
    const giftPos=g=>({x:g.x+Math.sin(time*1.5+g.i)*.024,y:g.y});
    function gift(g,x,y){const def=sizes[g.type],s=def.size;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*1.5+g.i)*.10);ctx.fillStyle=def.color;ctx.fillRect(-s/2,-s/2,s,s);ctx.fillStyle='#ffe9a4';ctx.fillRect(-3,-s/2,6,s);ctx.fillRect(-s/2,-3,s,6);ctx.restore();}
    hands.forEach(b=>b.onpointerdown=e=>{e.preventDefault();if(!active||ended||mode!=='carry')return;const hand=Number(b.dataset.hand);carry+=sizes[selected.type].step*(lastHand===hand?.4:1);lastHand=hand;});
    function santaFrame(dt){
      if(mode==='walk'){const pos=giftPos(selected),dx=pos.x-px,dy=pos.y-py,dist=Math.hypot(dx,dy),step=dt*1.7;if(dist<=step){px=pos.x;py=pos.y;mode='carry';selected.available=false;selected.start={x:px,y:py};carry=0;lastHand=-1;hands.forEach(b=>b.disabled=false);}else{px+=dx/dist*step;py+=dy/dist*step;}}
      if(mode==='carry'){const progress=clamp(carry);px=selected.start.x+(.5-selected.start.x)*progress;py=selected.start.y+(.16-selected.start.y)*progress;if(progress>=1){points(score+sizes[selected.type].points);delivered++;api.beep(950,60,.02);selected.available=true;selected.type=Math.floor(Math.random()*3);selected=null;mode='choose';hands.forEach(b=>b.disabled=true);}}
      background('#d6f0ff','#fff5ec');for(let i=0;i<20;i++){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc((i*73+time*7)%w,(i*43+time*16)%h,2,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#a32942';ctx.fillRect(w*.34,h*.06,w*.32,h*.12);ctx.strokeStyle='#e0a436';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(w*.3,h*.2);ctx.lineTo(w*.73,h*.2);ctx.stroke();label('🦌',w*.78,h*.16,30);label('SLED',w*.5,h*.125,14);
      for(const g of presents){if(!g.available)continue;const pos=giftPos(g);gift(g,pos.x*w,pos.y*h);label(`${sizes[g.type].name} ${sizes[g.type].points}`,pos.x*w,pos.y*h+31,12,'#253c53');if(g===selected){ctx.strokeStyle='#c54820';ctx.lineWidth=3;ctx.strokeRect(pos.x*w-24,pos.y*h-24,48,48);}}
      mob(px*w,py*h,37);if(mode==='carry')gift(selected,px*w,py*h-40);
      status.textContent=`${Math.max(0,12-time).toFixed(1)}秒 · ${delivered}個`;
      hint.textContent=mode==='choose'?'運ぶプレゼントをタップ！':mode==='walk'?'プレゼントを拾いに移動中':`${sizes[selected.type].name}を運搬中 · 左右を交互に連打！`;
      if(time>=12)finish(`${delivered}個をソリへ届けた！`);
    }
    function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};}
    let dragging=false;
    canvas.onpointerdown=e=>{if(!active||ended)return;e.preventDefault();const pos=point(e);if(kind===0){dragging=true;target=clamp(pos.x,.1,.9);canvas.setPointerCapture(e.pointerId);}else if(kind===1)wallTap();else if(mode!=='carry'){const near=presents.filter(g=>g.available).map(g=>({g,pos:giftPos(g)})).sort((a,b)=>Math.hypot(a.pos.x-pos.x,a.pos.y-pos.y)-Math.hypot(b.pos.x-pos.x,b.pos.y-pos.y))[0];if(near&&Math.abs(near.pos.x-pos.x)*w<=27&&Math.abs(near.pos.y-pos.y)*h<=27){selected=near.g;mode='walk';}}};
    canvas.onpointermove=e=>{if(active&&dragging&&kind===0)target=clamp(point(e).x,.1,.9);};canvas.onpointerup=canvas.onpointercancel=()=>{dragging=false;};
    const render=dt=>kind===0?bananaFrame(dt):kind===1?wallFrame():santaFrame(dt);
    render(0);await api.countdown();if(!valid()){observer.disconnect();return;}active=true;last=performance.now();
    function frame(now){if(!valid()){observer.disconnect();return;}if(ended)return;const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;render(dt);if(!ended)requestAnimationFrame(frame);}
    requestAnimationFrame(frame);
  }
  const api={keys,rules,wallResult,bananaPoints,run};if(typeof module!=='undefined')module.exports=api;if(root)root.MobSeasonGames=api;
})(typeof window!=='undefined'?window:null);
