(function(root){
'use strict';
function run(api){
  const {screen,valid}=api;
  const controller=new AbortController(),signal=controller.signal;
  const shell=document.createElement('section');shell.className='season-shell approved-game';shell.dataset.phase='ready';
  shell.innerHTML=`<header><small>MOB PARTY GAMES <span>${api.esc(api.player.name)}</span></small><h2>${api.esc(api.title)}</h2></header><div class="season-hud"><b data-time>READY</b><strong data-score>0 <small>pt</small></strong></div><div class="season-world" style="display:flex;align-items:center;justify-content:center;background:#142b3e"><canvas width="800" height="880" aria-label="${api.esc(api.title)}"></canvas></div><p data-hint></p><div class="season-actions" style="justify-content:center" data-controls></div>`;
  screen.replaceChildren(shell);
  const canvas=shell.querySelector('canvas'),ctx=canvas.getContext('2d'),world=shell.querySelector('.season-world'),controls=shell.querySelector('[data-controls]'),timer=shell.querySelector('[data-time]'),scoreEl=shell.querySelector('[data-score]');
  const defs=[],TAU=Math.PI*2,W=400,H=440;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,dist=(a,b,c,d)=>Math.hypot(a-c,b-d),adiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b)),rnd=(a,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
  let time=0,score=0,fxs=[],disposed=false,active=false,ended=false,delivered=false,raf=0,last=0,observer=null,disposeStick=()=>{},assetTimer=0,resultAt=0,settleAsset=()=>{};
  const held=new Set(),sources=new Set();let pointer=null;
  const actor=new Image();
  function mob(x,y,size=55,angle=0){if(!actor.complete||!actor.naturalWidth)return;ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.imageSmoothingEnabled=false;const k=size/Math.max(actor.naturalWidth,actor.naturalHeight);ctx.drawImage(actor,-actor.naturalWidth*k/2,-actor.naturalHeight*k/2,actor.naturalWidth*k,actor.naturalHeight*k);ctx.restore()}
  function beep(freq=660,d=.07){if(!disposed&&valid())api.beep(freq,d*1000,.018)}
  function fx(x,y,label,c='#fff19b'){fxs.push({x,y,label,c,life:1});beep(label.includes('MISS')?180:750)}
  function direction(){return {x:held.axisX||0,y:held.axisY||0}}
  function end(){if(!active||ended||disposed)return;ended=true;active=false;resultAt=current.id==='pendulum_cargo'&&state.landed?performance.now()+1000:0;score=Math.round(clamp(score,0,current.max))}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();if(r)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill()}
function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);ctx.fill()}
function line(x,y,a,b,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.stroke()}
function poly(points,c){ctx.fillStyle=c;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill()}
function text(t,x,y,size=16,c='#fff',align='center'){ctx.font=`800 ${size}px system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=c;ctx.fillText(t,x,y)}
function ellipse(x,y,rx,ry,c,a=0){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,a,0,TAU);ctx.fill()}
function ring(x,y,r,c,w=2,a=0,b=TAU){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,a,b);ctx.stroke()}
function grad(x,y,a,b,stops){let g=ctx.createLinearGradient(x,y,a,b);stops.forEach(p=>g.addColorStop(...p));return g}
// Every game owns its rules, art, score and finish condition. No hidden score curve.
function space(){rect(0,0,400,440,grad(0,0,400,440,[[0,'#0a132f'],[.5,'#17284d'],[1,'#38194e']]));for(let i=0;i<75;i++){let z=(i%7+1)/7,x=(i*157.37)%400,y=(i*89.23+time*18*z)%440;circle(x,y,z*1.4,'#a7c5f0');if(i%9===0)line(x,y,x,y+z*9,'#6886b5',.6)}ctx.save();ctx.globalAlpha=.18;ellipse(330,74,106,22,'#b877fc',-.5);ctx.restore();circle(320,64,43,grad(280,20,353,100,[[0,'#7586c0'],[.45,'#465181'],[1,'#111b39']]));ring(320,64,50,'#7f83c644',2);}
// CPU-rendered 3D icosahedra: rotate vertices, perspective project, light face normals, depth sort.
const GOLDEN=(1+Math.sqrt(5))/2;
const ROCK_V=[[-1,GOLDEN,0],[1,GOLDEN,0],[-1,-GOLDEN,0],[1,-GOLDEN,0],[0,-1,GOLDEN],[0,1,GOLDEN],[0,-1,-GOLDEN],[0,1,-GOLDEN],[GOLDEN,0,-1],[GOLDEN,0,1],[-GOLDEN,0,-1],[-GOLDEN,0,1]];
const ROCK_F=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
function mesh3d(x,y,r,a,vertices,faces,gold=false){const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(a*.71+.4),sb=Math.sin(a*.71+.4);let verts=vertices.map((p,i)=>{let n=Math.hypot(...p),j=gold?1:.89+(i%4)*.045,X=p[0]/n*j,Y=p[1]/n*j,Z=p[2]/n*j,u=X*ca+Z*sa,v=-X*sa+Z*ca;return[u,Y*cb-v*sb,Y*sb+v*cb]});let ff=faces.map(f=>{let p=verts[f[0]],q=verts[f[1]],v=verts[f[2]],u=q.map((n,i)=>n-p[i]),w=v.map((n,i)=>n-p[i]);let normal=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],m=Math.hypot(...normal);normal=normal.map(n=>n/m);let light=clamp(normal[0]*-.5+normal[1]*-.65+normal[2]*.55,.04,1);return{f,z:(p[2]+q[2]+v[2])/3,light,normal}}).sort((p,q)=>p.z-q.z);ff.forEach(face=>{let l=face.light,c=gold?`rgb(${180+l*75},${107+l*135},${36+l*129})`:`rgb(${54+l*124},${61+l*127},${84+l*128})`;poly(face.f.map(i=>{let p=verts[i],k=3.6/(3.6-p[2]);return[x+p[0]*r*k,y+p[1]*r*k]}),c)})}
function rock(x,y,r,rotation=0){mesh3d(x,y,r,rotation,ROCK_V,ROCK_F)}
function crystal(x,y,r,a=0){mesh3d(x,y,r,a,[[0,-1.3,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,1.3,0]],[[0,2,1],[0,3,2],[0,4,3],[0,1,4],[5,1,2],[5,2,3],[5,3,4],[5,4,1]],true)}
defs.push({id:'meteor',title:'メテオ・スラローム',tag:'COSMIC BLASTER',seconds:12,max:100,control:'stick',buttons:[{id:'fire',label:'FIRE'}],controlHint:'移動しながらFIREで隕石を破壊。',description:'隕石群へレーザー発射！立体の岩を砕いて星くずを集めよう。',rules:'下のスティックで移動し、FIREで発射。長押しもOK。<br>隕石を砕いて＋10点。星くず＋5点。被弾−10点。',scoring:'隕石破壊×10＋星くず×5−被弾×10。0〜100点。12秒。',init(){return{x:200,y:338,rocks:[],stars:[],shots:[],shards:[],spawn:0,starSpawn:0,hits:0,got:0,kills:0,inv:0,firing:false,cool:0}},input(s,e){if(e.action!=='fire')return;if(e.kind==='buttonDown'){s.firing=true;this.fire(s)}else if(e.kind==='buttonUp'||e.kind==='buttonCancel')s.firing=false},cancel(s){s.firing=false},fire(s){if(s.cool>0)return;s.cool=.17;s.shots.push({x:s.x,y:s.y-24});beep(980,.025)},update(s,dt){let d=direction();s.x=clamp(s.x+d.x*210*dt,28,372);s.y=clamp(s.y+d.y*210*dt,90,405);s.inv=Math.max(0,s.inv-dt);s.cool=Math.max(0,s.cool-dt);if(s.firing)this.fire(s);s.spawn-=dt;s.starSpawn-=dt;if(s.spawn<=0){s.spawn=.43;s.rocks.push({x:rnd(27,373),y:-35,r:rnd(17,26),a:rnd(TAU),v:rnd(110,170)})}if(s.starSpawn<=0){s.starSpawn=1.35;s.stars.push({x:65+((s.got*91+time*57)%270),y:-20,v:110})}for(let b of s.shots){let old=b.y;b.y-=600*dt;for(let r of s.rocks){if(r.dead)continue;let nearest=clamp(r.y,b.y,old);if(dist(b.x,nearest,r.x,r.y)<r.r+4){b.dead=true;r.dead=true;s.kills++;fx(r.x,r.y,'+10','#ffe9ac');for(let i=0;i<5;i++){let a=i/5*TAU;s.shards.push({x:r.x,y:r.y,vx:Math.cos(a)*rnd(50,125),vy:Math.sin(a)*rnd(50,100),r:r.r*.32,a:r.a+i,life:.65})}break}}}for(let r of s.rocks){r.y+=r.v*dt;r.a+=dt*.65;if(!r.dead&&s.inv<=0&&dist(r.x,r.y,s.x,s.y)<r.r+14){s.hits++;s.inv=.9;r.dead=true;fx(s.x,s.y,'HIT −10','#ff9c8f')}}for(let a of s.stars){a.y+=a.v*dt;if(!a.hit&&dist(a.x,a.y,s.x,s.y)<27){a.hit=true;s.got++;fx(a.x,a.y,'+5','#fff29b')}}for(let p of s.shards){p.x+=p.vx*dt;p.y+=p.vy*dt;p.a+=dt*3;p.life-=dt}s.shards=s.shards.filter(p=>p.life>0);s.shots=s.shots.filter(b=>!b.dead&&b.y>-30);s.rocks=s.rocks.filter(r=>!r.dead&&r.y<485);s.stars=s.stars.filter(a=>!a.hit&&a.y<470);score=clamp(s.kills*10+s.got*5-s.hits*10,0,100)},draw(s){space();text('SECTOR 07 / COSMIC BLASTER',19,24,10,'#a1b6df','left');for(let a of s.stars){ctx.save();ctx.shadowColor='#ffd34e';ctx.shadowBlur=14;crystal(a.x,a.y,12,time);ctx.restore()}for(let r of s.rocks){line(r.x-r.r*.5,r.y-45,r.x,r.y,'#f2985955',r.r*.6);rock(r.x,r.y,r.r,r.a)}for(let p of s.shards){ctx.globalAlpha=p.life/.65;rock(p.x,p.y,p.r,p.a)}ctx.globalAlpha=1;for(let b of s.shots){ctx.save();ctx.shadowColor='#93f4ff';ctx.shadowBlur=14;line(b.x,b.y,b.x,b.y+16,'#67dfff',5);line(b.x,b.y,b.x,b.y+14,'#e6ffff',2);ctx.restore()}let flame=18+Math.sin(time*40)*6;poly([[s.x-9,s.y+19],[s.x,s.y+19+flame],[s.x+9,s.y+19]],'#70ddff');poly([[s.x-4,s.y+19],[s.x,s.y+32],[s.x+4,s.y+19]],'#f7faff');ellipse(s.x,s.y+13,29,11,'#2c3a66');poly([[s.x,s.y-24],[s.x+31,s.y+20],[s.x,s.y+10],[s.x-31,s.y+20]],'#c0d8f4');poly([[s.x,s.y-24],[s.x,s.y+10],[s.x-31,s.y+20]],'#6575ab');rect(s.x-4,s.y-30,8,18,'#94c6e9',3);if(s.inv<=0||Math.floor(time*16)%2)mob(s.x,s.y-6,40);if(s.inv>0)ring(s.x,s.y,36,'#ff947fa0',2);rect(14,406,226,23,'#080f27aa',7);text(`破壊 ${s.kills}   星くず ${s.got}   被弾 ${s.hits}`,127,418,11,'#c2d2ed')},summary:s=>`破壊 ${s.kills}×10＋星 ${s.got}×5−被弾 ${s.hits}×10`});
function forest(){rect(0,0,400,440,grad(0,0,0,440,[[0,'#a3d6ce'],[.52,'#d3e4b6'],[1,'#456b50']]));circle(312,61,34,'#fff2bd');for(let j=0;j<2;j++)for(let i=0;i<7;i++){let x=i*71-25+j*30;rect(x,55+j*40,11-j*3,330,j?'#649076':'#7faa8b');ellipse(x,80+j*25,45,100,j?'#71a087':'#8cb897')}poly([[0,320],[180,285],[400,322],[400,440],[0,440]],'#76986b');for(let i=0;i<22;i++)line(i*23%400,340+i*17%100,i*23%400+9,325+i*17%100,'#507859',2)}
defs.push({id:'archery',title:'ゆらゆらアーチェリー',tag:'FOREST TARGETS',seconds:7,max:100,control:'stick',buttons:[{id:'shoot',label:'SHOOT'}],controlHint:'下のスティックでMOBを移動。的の先へ照準して発射。',description:'大きさも速さも違う10枚の的。7秒ですべて撃ち抜け。',rules:'下のスティックでMOBを移動。的の先へドラッグして離すと発射。<br>SHOOTでも発射。7秒、10枚・1枚10点。',scoring:'7秒 / 的10枚 / 1枚10点。すべて壊すと100点。',init(){return{x:200,y:374,targets:Array.from({length:10},(_,i)=>({x:50+(i%5)*75,y:105+Math.floor(i/5)*124,r:[22,18,25,16,20,17,24,19,15,23][i],speed:[1.1,1.5,.8,2,1.3,1.8,.9,1.6,2.2,1.2][i],phase:i*1.8,dead:false})),shots:[],broken:0,aim:{x:200,y:130},aiming:false,cool:0}},input(s,e){if(e.kind==='stageDown'||e.kind==='stageMove'){s.aim={x:e.x,y:Math.min(330,e.y)};s.aiming=true}if(e.kind==='cancel'){s.aiming=false;return}if((e.kind==='stageUp'||(e.kind==='buttonDown'&&e.action==='shoot'))&&s.cool<=0){s.aiming=false;s.cool=.13;let a=Math.atan2(s.aim.y-s.y+6,s.aim.x-s.x);s.shots.push({x:s.x,y:s.y-6,vx:Math.cos(a)*730,vy:Math.sin(a)*730});beep(460,.025)}},update(s,dt){let move=direction();s.x=clamp(s.x+move.x*220*dt,30,370);s.y=clamp(s.y+move.y*160*dt,315,402);s.cool=Math.max(0,s.cool-dt);s.targets.forEach((a,i)=>{a.x=45+(i%5)*76+Math.sin(time*a.speed+a.phase)*20;a.y=104+Math.floor(i/5)*128+Math.sin(time*a.speed*.7+a.phase)*24});for(let b of s.shots){let ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;let dx=b.x-ox,dy=b.y-oy;for(let a of s.targets){if(a.dead)continue;let u=clamp(((a.x-ox)*dx+(a.y-oy)*dy)/(dx*dx+dy*dy||1));if(dist(ox+u*dx,oy+u*dy,a.x,a.y)<=a.r+2){a.dead=true;b.dead=true;s.broken++;score=s.broken*10;fx(a.x,a.y,'+10','#fff3a1');break}}}s.shots=s.shots.filter(b=>!b.dead&&b.y>-20&&b.x>-20&&b.x<420);if(s.broken===10)end('ALL TARGETS!')},cancel(s){s.aiming=false},draw(s){forest();text('WOODLAND ARCHERY CLUB',200,26,11,'#315d4b');text(`${s.broken} / 10`,200,52,24,'#234b3b');s.targets.forEach((a,i)=>{if(a.dead)return;line(a.x,a.y+a.r,a.x+4,328,'#856541',4);ellipse(a.x+5,a.y+7,a.r,a.r,'#47623c66');circle(a.x,a.y,a.r+3,'#75593f');circle(a.x,a.y,a.r,'#f5e9c7');circle(a.x,a.y,a.r*.74,'#ce624c');circle(a.x,a.y,a.r*.47,'#fff3d5');circle(a.x,a.y,a.r*.23,'#d65846');ring(a.x,a.y,a.r+2,'#fff4cf',1);text(i+1,a.x,a.y-a.r-11,9,'#315941')});if(s.aiming){ctx.save();ctx.setLineDash([4,7]);line(s.x,s.y-6,s.aim.x,s.aim.y,'#fff6ccbb',1);ctx.restore();ring(s.aim.x,s.aim.y,10,'#fff3b4',1)}s.shots.forEach(a=>{let n=Math.hypot(a.vx,a.vy);line(a.x,a.y,a.x-a.vx/n*20,a.y-a.vy/n*20,'#563e28',3);circle(a.x,a.y,2,'#fff5cb')});ellipse(s.x,s.y+32,40,7,'#37573d66');mob(s.x,s.y,66);ctx.save();ctx.translate(s.x+30,s.y+2);ctx.strokeStyle='#bd8143';ctx.lineWidth=5;ctx.beginPath();ctx.arc(-8,0,30,-1.2,1.2);ctx.stroke();line(3,-27,3,27,'#f5e7bb',1);ctx.restore();text('10 TARGETS · 7 SECONDS',200,428,10,'#dbedd2')},summary:s=>`${s.broken}枚 × 10点 = ${s.broken*10}点`});
function citrus(x,y,r){circle(x,y,r,'#f6a347');circle(x,y,r*.84,'#ffe4a1');for(let i=0;i<8;i++){let a=i*TAU/8;line(x+Math.cos(a)*3,y+Math.sin(a)*3,x+Math.cos(a)*r*.77,y+Math.sin(a)*r*.77,'#e7a343',2)}circle(x,y,3,'#fff0c8')}
defs.push({id:'juice',title:'ピッタリジュース',tag:'ONE PERFECT POUR',seconds:8,max:100,control:'button',actionLabel:'押して注ぐ → 離してSTOP',description:'一度きりの注ぎ勝負。細い目標線でぴたりと止めよう。',rules:'下のボタンを押している間だけ注ぐ。<br>指を離したら、その1回で採点。注ぎ直しはできません。',scoring:'目標±1%以内100点。それ以外は誤差1%ごとに4点減点。',init(){return{level:0,target:.68,pouring:false,started:false,done:false,settle:0,error:0}},input(s,e){if(s.done)return;if(e.kind==='down'&&!s.started){s.started=true;s.pouring=true}else if((e.kind==='up'||e.kind==='cancel')&&s.pouring){s.pouring=false;s.done=true;s.settle=.55;s.error=Math.abs(s.level-s.target);score=clamp(100-Math.max(0,s.error-.01)*400,0,100);fx(200,170,score>=99?'PERFECT!':'STOP','#ffde84')}},cancel(s){if(s.pouring){s.pouring=false;s.done=true;s.settle=.55;s.error=Math.abs(s.level-s.target);score=clamp(100-Math.max(0,s.error-.01)*400,0,100)}},update(s,dt){if(s.pouring){s.level=Math.min(1.08,s.level+dt*.58);if(s.level>=1.05){s.pouring=false;s.done=true;s.settle=.5;s.error=Math.abs(s.level-s.target);score=0;fx(200,180,'OVERFLOW','#ff9d6b')}}if(s.done){s.settle-=dt;if(s.settle<=0)end('ONE SHOT COMPLETE')}},timeout(s){if(!s.started){score=0;end('NO POUR')}else{if(!s.done)this.input(s,{kind:'up'});end('TIME UP')}},draw(s){rect(0,0,400,440,grad(0,0,0,440,[[0,'#f1ded0'],[1,'#e8cba7']]));for(let x=0;x<400;x+=50){line(x,0,x,315,'#dcc5b8');for(let y=30;y<320;y+=55)line(x,y,x+50,y,'#ddc4b5')}rect(24,29,144,91,'#f9f1e4',4);text('SUNNY',96,60,23,'#cc7844');text('JUICE BAR',96,88,12,'#936c50');rect(260,35,105,133,'#718c76',5);for(let i=0;i<5;i++)line(280+i*14,43,280+i*14,160,'#8da489',2);rect(0,326,400,114,'#b67d54');for(let y=340;y<440;y+=20)line(0,y,400,y,'#a26c49',1);ellipse(200,370,88,18,'#80533b44');citrus(70,345,28);citrus(328,354,34);ellipse(328,320,15,7,'#658347',-.6);mob(336,276,64);ctx.save();const cup=[[125,155],[275,155],[256,357],[145,357]];poly(cup,'#ffffff49');ctx.beginPath();cup.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.clip();let levelY=350-clamp(s.level)*184;rect(120,levelY,160,230,grad(120,levelY,280,350,[[0,'#ffcf53'],[1,'#ef952d']]));ellipse(200,levelY,75,5,'#ffe394');for(let i=0;i<15;i++){let y=levelY+((i*37+time*12)%Math.max(1,350-levelY));circle(146+i*29%106,y,1.5,'#ffeba477')}if(s.pouring)rect(192,105,16,levelY-100,'#ffc645');ctx.restore();line(125,155,145,357,'#fff9e8',3);line(275,155,256,357,'#fff9e8',3);line(145,357,256,357,'#fff9e8',4);ellipse(200,155,75,8,'#ffffff38');ring(200,155,1,'#fff',1);line(139,176,151,325,'#ffffff8a',6);const ty=350-s.target*184;line(119,ty,281,ty,'#9e4537',1);text('TARGET',299,ty,10,'#974733','left');if(s.pouring)rect(192,103,16,50,'#ffc645');rect(164,80,63,20,'#a9b5ae',5);rect(185,51,22,34,'#c4cec7',5);text('一度だけ、ぴったり。',200,405,15,'#fff2d9')},summary:s=>`目標との差 ${Math.round(s.error*1000)/10}% / 注ぐ操作は1回のみ`});
defs.push({id:'lock',title:'くるくるロック',tag:'VAULT PRECISION',seconds:0,max:10,control:'button',actionLabel:'STOP / ロック解除',description:'10段階の金庫。だんだん小さくなる光のマークを狙え。',rules:'回る針が金色のマークに重なったらSTOP。<br>1ラウンド1回、成功で1点。全10ラウンド。',scoring:'成功1回＝1点。全10ラウンド / 10点満点。各ラウンド1.5秒（全体最大18秒）。',init(){return{round:0,a:-Math.PI/2,goal:.55,width:.50,local:0,wait:0,results:[],lastHit:false}},input(s,e){if(e.kind!=='down'||s.wait>0||s.round>=10)return;let ok=Math.abs(adiff(s.a,s.goal))<=s.width/2;this.resolve(s,ok)},resolve(s,ok){if(s.wait>0||s.round>=10)return;s.results.push(ok);if(ok)score++;s.lastHit=ok;s.wait=.3;fx(200,214,ok?'+1 UNLOCK':'MISS',ok?'#fff1a7':'#f59c89')},update(s,dt){if(s.wait>0){s.wait-=dt;if(s.wait<=1e-9){s.wait=0;s.round++;if(s.round===10){end('VAULT COMPLETE');return}s.width=.50-s.round*.034;s.goal=((s.round*2.399+.55)%TAU);s.a=s.goal-Math.PI;s.local=0}return}s.local+=dt;s.a+=(2.65+s.round*.15)*dt;if(s.local>=1.5-1e-9)this.resolve(s,false)},draw(s){rect(0,0,400,440,grad(0,0,400,440,[[0,'#26343c'],[1,'#0b1725']]));for(let y=0;y<440;y+=38)line(0,y,400,y,'#56677622');rect(25,30,350,377,'#4e616b',24);rect(31,36,338,365,'#1a2935',20);rect(41,46,318,345,grad(30,40,370,410,[[0,'#617079'],[.5,'#394b56'],[1,'#21343f']]),16);[54,346].forEach(x=>[59,376].forEach(y=>{circle(x,y,5,'#b0bab9');line(x-2,y-2,x+2,y+2,'#455765',1)}));text('MOB SECURITY / MK.10',200,69,10,'#c5d2d0');mob(320,349,44);for(let i=0;i<10;i++){circle(78+i*27,101,7,i<s.results.length?(s.results[i]?'#e9cb72':'#ad7869'):'#1a303c');if(i===s.round)ring(78+i*27,101,10,'#efd586',1)}circle(200,234,113,'#122332');circle(200,231,108,grad(90,120,300,340,[[0,'#b4b9ab'],[.2,'#6b7e82'],[.6,'#354a59'],[1,'#829598']]));circle(200,231,98,'#152b3a');for(let i=0;i<60;i++){let a=i/60*TAU;line(200+Math.cos(a)*90,231+Math.sin(a)*90,200+Math.cos(a)*(i%5?86:81),231+Math.sin(a)*(i%5?86:81),'#91a5a6',i%5?1:2)}ctx.save();ctx.shadowColor='#ffd66f';ctx.shadowBlur=14;ring(200,231,88,'#ffde7d',9,s.goal-s.width/2,s.goal+s.width/2);ctx.restore();circle(200,231,68,grad(140,160,260,300,[[0,'#5d7179'],[1,'#243844']]));for(let i=0;i<3;i++){let a=s.a+i*TAU/3;line(200,231,200+Math.cos(a)*46,231+Math.sin(a)*46,'#aab4ad',11);circle(200+Math.cos(a)*46,231+Math.sin(a)*46,8,'#cad0bf')}line(200,231,200+Math.cos(s.a)*88,231+Math.sin(s.a)*88,'#fff3b8',4);circle(200,231,15,'#1d3343');circle(200,231,7,'#e4d19b');rect(125,353,150,25,'#102432',5);text(s.wait>0?(s.lastHit?'ACCESS GRANTED':'ACCESS DENIED'):`${Math.max(0,1.5-s.local).toFixed(1)} s  /  ROUND ${Math.min(10,s.round+1)}`,200,366,11,s.lastHit&&s.wait>0?'#f4de8e':'#b6c9d0')},summary:s=>`${s.results.filter(Boolean).length}回成功 / 10ラウンド（1回1点）`});
function fireball(x,y,a,r=13){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.shadowColor='#ff813c';ctx.shadowBlur=20;poly([[r,0],[-r*2,-r*.8],[-r*3.3,0],[-r*2,r*.8]],'#ef5b32aa');poly([[r,0],[-r*1.7,-r*.46],[-r*2.8,0],[-r*1.7,r*.46]],'#ffb548');circle(0,0,r,'#fc9741');circle(r*.23,-r*.14,r*.7,'#ffdb71');circle(r*.38,-r*.22,r*.36,'#fff5c9');ctx.restore()}
defs.push({id:'shield',title:'シールド360',tag:'FIRE TEMPLE',seconds:12,max:100,control:'stick',controlHint:'スティックを火球の方向へ。<br>盾を回して受け止める。',description:'四方から迫る10発の火球。青い盾で一発ずつ弾き返せ。',rules:'下のスティックを倒した方向に盾が回る。<br>火球10発を防ぐ。1発ブロックで10点。',scoring:'火球10発 / ブロック1回10点 / 最大100点。',init(){return{a:-Math.PI/2,balls:[],spawn:.4,sent:0,blocked:0,missed:0,flash:0}},update(s,dt){let d=direction();if(Math.hypot(d.x,d.y)>.15)s.a=Math.atan2(d.y,d.x);s.spawn-=dt;s.flash=Math.max(0,s.flash-dt);if(s.spawn<=0&&s.sent<10){let a=(s.sent*2.399+(s.sent%2)*.3)%TAU;s.balls.push({a,r:258,speed:215+s.sent*8,done:false});s.sent++;s.spawn=.98}for(let b of s.balls){let prev=b.r;b.r-=b.speed*dt;if(!b.done&&prev>70&&b.r<=70){b.done=true;const ok=Math.abs(adiff(b.a,s.a))<.53;if(ok){s.blocked++;score=s.blocked*10;fx(200+Math.cos(b.a)*70,223+Math.sin(b.a)*70,'+10','#91edff');b.reflect=true;b.r=72}else{s.missed++;s.flash=.24;fx(200,223,'MISS','#ff9c71')}}if(b.reflect)b.r+=b.speed*dt*2.5}s.balls=s.balls.filter(b=>b.reflect?b.r<330:!b.done);if(s.sent===10&&s.balls.length===0&&time>10.5)end('TEMPLE DEFENDED')},draw(s){rect(0,0,400,440,grad(0,0,400,440,[[0,'#322936'],[1,'#121b32']]));for(let i=0;i<8;i++){let a=i/8*TAU;poly([[200+Math.cos(a)*99,223+Math.sin(a)*99],[200+Math.cos(a+.3)*265,223+Math.sin(a+.3)*265],[200+Math.cos(a+.5)*265,223+Math.sin(a+.5)*265]],'#563d452d')}ellipse(200,235,142,133,'#161b2d');ring(200,223,129,'#696076',2);ring(200,223,111,'#544254',2);for(let i=0;i<16;i++){let a=i/16*TAU;crystal(200+Math.cos(a)*120,223+Math.sin(a)*120,4,a)}for(let x of [25,375])for(let y of [62,370]){rect(x-12,y,24,38,'#4b4657',3);ellipse(x,y,18,5,'#8b6570');fireball(x,y-11,-Math.PI/2,8)}circle(200,223,61,'#26384b');ring(200,223,54,'#4c6c80',2);mob(200,219,66);ctx.save();ctx.shadowColor='#6ce4ff';ctx.shadowBlur=18;ring(200,223,70,'#66def4',10,s.a-.53,s.a+.53);ring(200,223,76,'#c3fbff',2,s.a-.48,s.a+.48);ctx.restore();s.balls.forEach(b=>fireball(200+Math.cos(b.a)*b.r,223+Math.sin(b.a)*b.r,b.a+Math.PI,b.reflect?9:13));text('SANCTUARY / FIRE TRIAL',200,26,10,'#bfa9af');text(`${s.blocked} BLOCK   ·   ${s.missed} MISS`,200,407,13,'#c7d8e5');if(s.flash>0){ctx.globalAlpha=s.flash;rect(0,0,400,440,'#ff6244');ctx.globalAlpha=1}},summary:s=>`${s.blocked}発ブロック × 10点 / ${s.missed}発ミス`});
defs.push({id:'rally',title:'MOBラリー',tag:'DOUBLE BALL RUSH',seconds:8,max:100,control:'stick',controlHint:'スティックを左右に倒す。<br>2球とも落とさず返そう。',description:'2球同時、加速するラリー。8秒しのぎ切れば100点。',rules:'下のスティックでラケットを左右に移動。<br>2球を同時に返す。返球するたび両方が加速！',scoring:'8秒生存＝100点。落球時は生存秒数÷8×100点（四捨五入・落球時は最大99点）。',init(){return{x:200,balls:[{x:115,y:144,vx:133,vy:256,trail:[],color:'#ffdf77'},{x:287,y:218,vx:-150,vy:268,trail:[],color:'#91e7ff'}],rallies:0,lost:false}},update(s,dt){if(s.lost)return;let d=direction();s.x=clamp(s.x+d.x*430*dt,54,346);const sub=Math.max(1,Math.ceil(dt/.0035)),step=dt/sub;for(let n=0;n<sub;n++){for(let b of s.balls){const oy=b.y;b.x+=b.vx*step;b.y+=b.vy*step;if(b.x<24){b.x=48-b.x;b.vx=Math.abs(b.vx)}if(b.x>376){b.x=752-b.x;b.vx=-Math.abs(b.vx)}if(b.y<52){b.y=104-b.y;b.vy=Math.abs(b.vy)}if(b.vy>0&&oy<=355&&b.y>=355&&Math.abs(b.x-s.x)<54){b.y=710-b.y;let speed=Math.hypot(b.vx,b.vy)*1.06,angle=(b.x-s.x)/54*.72;b.vx=Math.sin(angle)*speed;b.vy=-Math.cos(angle)*speed;s.rallies++;s.balls.forEach(other=>{if(other!==b){let v=Math.hypot(other.vx,other.vy),k=1.04;other.vx*=k;other.vy*=k}});fx(b.x,351,'RALLY!','#fff4bd')}if(b.y>399){s.lost=true;score=Math.min(99,Math.round(time/8*100));fx(b.x,393,'OUT','#ff938b');end('BALL OUT');return}}}for(let b of s.balls){b.trail.push({x:b.x,y:b.y});if(b.trail.length>11)b.trail.shift()}score=time/8*100},timeout(s){score=100;end('8 SECONDS CLEAR!')},draw(s){rect(0,0,400,440,grad(0,0,400,440,[[0,'#213951'],[1,'#102037']]));for(let i=0;i<10;i++){rect(7+i*40,8,28,13,i%2?'#4c6b82':'#718296',2)}rect(9,32,382,374,'#071a2d',13);rect(17,40,366,357,grad(0,40,400,395,[[0,'#216b78'],[1,'#15536d']]),9);line(28,217,372,217,'#92c4c4',2);ring(200,217,42,'#83b8bd',1.5);line(200,51,200,344,'#6da7b4',1);rect(29,51,342,294,'#ffffff06');for(let x of[24,376])line(x,55,x,388,'#92cbcf',2);rect(118,35,164,12,'#e9bc62',4);text('DOUBLE BALL / SPEED UP',200,64,10,'#c0e1de');for(let b of s.balls){b.trail.forEach((p,i)=>{ctx.globalAlpha=i/b.trail.length*.4;circle(p.x,p.y,8*i/b.trail.length,b.color)});ctx.globalAlpha=1;ellipse(b.x+3,b.y+7,9,5,'#05273755');circle(b.x,b.y,9,b.color);circle(b.x-2,b.y-3,3,'#ffffe9')}rect(s.x-54,356,108,15,'#0a233c',7);rect(s.x-50,351,100,13,grad(0,351,0,365,[[0,'#ffe492'],[1,'#c99044']]),6);line(s.x-40,353,s.x+40,353,'#fff4c3',2);mob(s.x,393,47);rect(143,414,114,20,'#24374e',5);text(`RALLY ${s.rallies}`,200,424,10,'#c2d9e8')},summary:s=>`${s.rallies}ラリー / ${Math.min(8,time).toFixed(2)}秒生存`});

// Retained games 007, 009 and 010: one clear goal and immediate resolution.
function b7panel(label,sub,c='#a6dce9'){text(label,200,25,12,c);text(sub,200,418,12,c)}

// A responsive one-stick ship. The faint coast is visual, never a braking puzzle.
function dockingScore(s){
  if(!s.active)return 0;
  if(s.locked)return 100;
  const startDistance=Math.hypot(75-294,325-166);
  return Math.min(99,99*clamp(1-Math.hypot(s.x-294,s.y-166)/startDistance));
}
defs.push({
  id:'inertial_docking',number:7,title:'宇宙ドッキング',tag:'ORBITAL APPROACH',seconds:12,max:100,
  control:'stick',controlHint:'スティックで移動・離すとすぐ止まる',
  description:'スティックで小艇を動かし、緑の接続エリアに入れよう。',
  rules:'スティックで小艇を動かし、緑の接続エリアに入れよう。',
  scoring:'緑のエリアに入ると即100点。時間切れは接続口への近さで0〜99点。動かさないと0点。',
  init(){return{x:75,y:325,vx:0,vy:0,a:0,active:false,locked:false,resolved:false,thrustX:0,thrustY:0}},
  input(){},
  cancel(s){s.thrustX=s.thrustY=0;if(!s.resolved)s.vx=s.vy=0},
  update(s,dt){
    if(s.resolved)return;
    const d=direction(),moving=Math.hypot(d.x,d.y)>.03;
    if(moving)s.active=true;
    s.thrustX=moving?d.x:0;s.thrustY=moving?d.y:0;
    const blend=1-Math.exp(-(moving?19:27)*dt);
    s.vx=lerp(s.vx,s.thrustX*180,blend);s.vy=lerp(s.vy,s.thrustY*180,blend);
    if(!moving&&Math.hypot(s.vx,s.vy)<.5)s.vx=s.vy=0;
    s.x=clamp(s.x+s.vx*dt,28,306);s.y=clamp(s.y+s.vy*dt,52,386);
    if(s.active&&s.x>=269&&s.x<=311&&Math.abs(s.y-166)<=29){
      s.x=294;s.y=166;s.vx=s.vy=s.thrustX=s.thrustY=0;s.locked=s.resolved=true;
      score=100;end('DOCKED');return;
    }
    score=dockingScore(s);
  },
  timeout(s){s.resolved=true;s.vx=s.vy=s.thrustX=s.thrustY=0;score=dockingScore(s);end('APPROACH COMPLETE')},
  draw(s){
    rect(0,0,400,440,grad(0,0,400,440,[[0,'#070e24'],[1,'#24315a']]));
    for(let i=0;i<68;i++)circle((i*97)%400,(i*59)%420,i%7===0?1.4:.65,'#bccfe7');
    circle(-34,471,170,grad(0,300,100,440,[[0,'#7ad5e4'],[.2,'#2671ac'],[1,'#183566']]));ring(-34,471,174,'#94e5fa88',3);
    for(let i=0;i<4;i++)ellipse(20+i*22,357+i*17,36,7,'#c4eff033',.3);
    rect(351,57,16,241,'#687a92');
    for(let y of[62,233]){rect(307,y,90,47,'#204873',3);for(let x=313;x<397;x+=14)line(x,y+4,x,y+43,'#79a7c4',1);line(310,y+23,397,y+23,'#6ba9d8')}
    poly([[344,104],[382,124],[397,166],[378,209],[339,216],[320,185],[320,139]],'#d1dae4');
    poly([[344,104],[350,152],[320,185],[320,139]],'#8da3b8');rect(317,146,15,40,'#172b43',3);rect(310,150,10,32,'#9cffbc',2);
    for(let x=185;x<263;x+=22)poly([[x,161],[x+7,166],[x,171]],'#86dcca88');
    text(s.locked?'接続完了':'船型を重ねる',276,120,14,'#baffd8');
    if(!s.resolved&&Math.hypot(s.thrustX,s.thrustY)>.1){
      const a=Math.atan2(-s.thrustY,-s.thrustX),cx=s.x+Math.cos(a)*18,cy=s.y+Math.sin(a)*18;
      poly([[cx-Math.sin(a)*5,cy+Math.cos(a)*5],[s.x+Math.cos(a)*(37+Math.sin(time*70)*4),s.y+Math.sin(a)*(37+Math.sin(time*70)*4)],[cx+Math.sin(a)*5,cy-Math.cos(a)*5]],'#8ce1ff');
    }
    ctx.save();ctx.translate(s.x,s.y);
    ellipse(0,12,31,13,'#00000055');poly([[-25,-20],[-5,-12],[23,-8],[31,0],[23,8],[-5,12],[-25,20],[-18,0]],'#e1e8e9');
    poly([[-23,19],[22,8],[27,2],[-3,4]],'#758baf');rect(-19,-15,11,30,'#7189a4',3);ellipse(0,0,14,11,'#314f71');mob(0,0,26);line(4,-10,14,-5,'#c4faff',2);ctx.restore();
    b7panel('KEPLER STATION / DOCK 07','動く岩を避けて、着陸！で確定');
  },
  summary:s=>s.locked?'接続成功！ 緑のエリアに入って100点。':s.active?`接続口まで${Math.round(Math.hypot(s.x-294,s.y-166))}px。近さで採点。`:'小艇を動かしていないため0点。'
});

// Position first, then LOWER commits to one uninterrupted descent.
function cargoPose(s){return s.placed||{x:s.x+Math.sin(s.a)*s.len,y:83+Math.cos(s.a)*s.len,v:s.v+Math.cos(s.a)*s.len*s.av}}
function cargoBottom(s){
  return Math.max(...[[-38,-20],[-29,-28],[47,-28],[47,12],[38,18],[-38,18]].map(([x,y])=>x*Math.sin(s.a)+y*Math.cos(s.a)));
}
function cargoFootprint(s,p){
  const base=[[-38,18],[38,18],[47,12]].map(([x,y])=>p.x+x*Math.cos(s.a)-y*Math.sin(s.a));
  return{left:Math.min(...base),right:Math.max(...base)};
}
function cargoScore(s,p){
  const{left,right}=cargoFootprint(s,p);
  const overlap=Math.max(0,Math.min(right,337)-Math.max(left,230));
  return 100*clamp(overlap/(right-left));
}
defs.push({
  id:'pendulum_cargo',number:9,title:'吊り荷ピタッ',tag:'HARBOR GANTRY',seconds:12,max:100,
  control:'stick',controlHint:'左右で位置を合わせ、LOWERを1回',buttons:[{id:'lower',label:'LOWER ↓'}],
  description:'左右で吊り荷を緑の台座に合わせ、LOWERで降ろそう。',
  rules:'左右で吊り荷を緑の台座に合わせ、LOWERを1回押して降ろそう。',
  scoring:'着地した瞬間に終了。荷物の底が台座に重なった割合×100点。全部載ると100点。降ろさないと0点。',
  init(){return{x:107,v:0,len:128,a:0,av:0,active:false,committed:false,lower:false,landed:false,resolved:false,last:0,placed:null}},
  input(s,e){
    if(s.resolved||s.committed)return;
    if(e.action==='lower'&&e.kind==='buttonDown'){s.active=true;s.committed=s.lower=true;s.v=0;beep(410,.05)}
  },
  cancel(s){if(!s.committed)s.v=0},
  update(s,dt){
    if(s.resolved||dt<=0)return;
    let accel=0;
    if(!s.committed){
      const d=direction(),target=Math.abs(d.x)>.03?d.x*145:0;
      if(target)s.active=true;
      const old=s.v;s.v=lerp(s.v,target,1-Math.exp(-13*dt));accel=(s.v-old)/dt;
      s.x=clamp(s.x+s.v*dt,48,352);
      if((s.x===48&&s.v<0)||(s.x===352&&s.v>0))s.v=0;
    }
    const lowering=s.committed?143:0;
    s.len+=lowering*dt;
    // Damped sway makes the hanging load feel physical while remaining readable.
    s.av+=(-520/s.len*Math.sin(s.a)-accel/s.len*.30-(3.6+2*lowering/s.len)*s.av)*dt;
    s.a=clamp(s.a+s.av*dt,-.24,.24);
    let p=cargoPose(s);
    if(s.committed&&p.y+cargoBottom(s)>=351){
      s.len=(351-cargoBottom(s)-83)/Math.cos(s.a);p=cargoPose(s);
      s.last=cargoScore(s,p);s.placed={x:p.x,y:351-cargoBottom(s),v:0};
      s.v=s.av=0;s.lower=false;s.landed=s.resolved=true;score=s.last;
      end(s.last>=99.999?'CARGO PLACED':'LANDING COMPLETE');return;
    }
    score=0;
  },
  timeout(s){s.resolved=true;s.lower=false;s.v=s.av=0;score=s.landed?s.last:0;end('TIME UP')},
  draw(s){
    rect(0,0,400,440,grad(0,0,0,440,[[0,'#bbc8ce'],[.58,'#e2d8c6'],[.59,'#4a8294'],[1,'#285769']]));
    for(let i=0;i<13;i++)line((i*61+time*12)%450-30,280+i*8,(i*61+time*12)%450+13,280+i*8,'#b8d3cd44',2);
    for(let x of[23,365]){poly([[x,55],[x+13,55],[x+8,373],[x-5,373]],'#426777');line(x+2,71,x+6,370,'#80a2a4',3)}
    rect(18,61,366,20,'#718e90',3);rect(26,81,346,7,'#233f55');for(let x=27;x<370;x+=24)line(x,63,x+14,78,'#bdd0bd',2);
    rect(s.x-26,78,52,13,'#dbaf63',3);circle(s.x-18,89,5,'#273c46');circle(s.x+18,89,5,'#273c46');rect(s.x-20,34,39,31,'#416276',4);rect(s.x-17,37,33,25,'#add8d9',3);mob(s.x,49,27);
    const p=cargoPose(s);
    line(s.x-13,88,p.x-22*Math.cos(s.a),p.y-21-22*Math.sin(s.a),'#243c49',2);line(s.x+13,88,p.x+22*Math.cos(s.a),p.y-21+22*Math.sin(s.a),'#243c49',2);
    rect(0,351,400,89,'#76837f');poly([[230,351],[337,351],[352,365],[217,365]],'#b6dfb9');rect(217,365,135,18,'#536b72');
    poly([[230,351],[337,351],[345,359],[222,359]],'#7ad9a0');line(230,351,337,351,'#d2ffe1',2);
    text('ここに載せる',284,390,13,'#e7fff0');
    ellipse(p.x,351,38,5,'#18344366');
    if(!s.committed){
      for(let y=p.y+32;y<337;y+=13)line(p.x,y,p.x,y+5,'#edf6d77a',1.5);
      const footprint=cargoFootprint(s,p);line(footprint.left,338,footprint.right,338,'#fff1bb',3);text('↑ 荷物の幅',(footprint.left+footprint.right)/2,324,11,'#fff8d2');
    }
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(s.a);rect(-38,-20,76,38,'#b95c49',3);
    poly([[38,-20],[47,-28],[47,12],[38,18]],'#7b3c39');poly([[-38,-20],[-29,-28],[47,-28],[38,-20]],'#da9070');
    for(let x=-30;x<37;x+=10)line(x,-16,x,14,'#e19b77',2);rect(-15,-11,30,18,'#dfb486',1);text('MOB',0,-2,10,'#793d35');ctx.restore();
    b7panel('PORT 09 / CARGO CONTROL',s.landed?`着地 · ${Math.round(s.last)}点`:s.committed?'自動で降下中':'左右で位置合わせ → LOWERを1回','#213e50');
  },
  summary:s=>s.landed?`台座に重なった底の割合：${Math.round(s.last)}%。着地した瞬間の位置で採点。`:'荷物を着地させていないため0点。'
});

// One timing button. The flip and catch are automatic, with three scored attempts.
function pancakeMeter(s){const p=(.08+s.clock*.70)%2;return p<=1?p:2-p}
function pancakeAward(s){const error=Math.abs(pancakeMeter(s)-.5);return (100/3)*clamp(1-Math.max(0,error-.12)/.38)}
function pancakeResolve(s,points,tapped){
  if(s.resolved)return;
  s.points+=points;s.results.push(points);s.round++;score=Math.min(100,s.points);
  s.lastLabel=!tapped?'時間切れ · 0点':points>=100/3-1e-6?'PERFECT!':points<.01?'0点':`+${Math.round(points)}点`;
  if(s.round===3){s.resolved=true;s.phase='done';s.flash=0;end('THREE PANCAKES');return}
  s.phase='ready';s.clock=0;s.flash=.7;
}
defs.push({
  id:'pancake_flip_catch',number:10,title:'パンケーキ返し',tag:'COPPER PAN KITCHEN',seconds:0,rounds:3,max:100,
  control:'buttons',controlHint:'緑に来たらFLIPを1回',buttons:[{id:'flip',label:'FLIP ↑'}],
  description:'メーターの針が緑に来たらFLIPを押し、3枚返そう。',
  rules:'メーターの針が緑に来たらFLIPを押し、3枚返そう。',
  scoring:'緑で1枚33⅓点、3枚で100点。緑から離れるほど点数が少なくなる。1枚3秒、押さない回は0点。',
  init(){return{pan:200,round:0,flips:0,clock:0,phase:'ready',flight:0,points:0,pending:0,results:[],resolved:false,flash:0,lastLabel:'',cake:{x:200,y:303,a:0}}},
  input(s,e){
    if(s.resolved||s.phase!=='ready'||e.action!=='flip'||e.kind!=='buttonDown')return;
    s.pending=pancakeAward(s);s.phase='flying';s.flight=0;s.flash=0;s.flips++;
    s.cake={x:200,y:303,a:0};beep(510,.04);
  },
  cancel(){},
  update(s,dt){
    if(s.resolved)return;
    s.flash=Math.max(0,s.flash-dt);
    if(s.phase==='ready'){
      s.clock=Math.min(3,s.clock+dt);
      if(s.clock>=3-1e-9)pancakeResolve(s,0,false);
    }
    else if(s.phase==='flying'){
      s.flight=Math.min(.80,s.flight+dt);
      const u=s.flight/.80;s.cake.y=303-139*Math.sin(Math.PI*u);s.cake.a=Math.PI*u;
      if(s.flight>=.80-1e-9){
        s.cake.y=303;s.cake.a=Math.PI;
        pancakeResolve(s,s.pending,true);
        if(s.resolved)return;
      }
    }
    score=Math.min(100,s.points);
  },
  timeout(s){s.resolved=true;s.phase='done';s.flash=0;score=Math.min(100,s.points);end('TIME UP')},
  draw(s){
    rect(0,0,400,440,'#d9d1b8');
    for(let x=0;x<=400;x+=50){line(x,0,x,302,'#b9bca5',1);for(let y=0;y<300;y+=42)line(x,y,x+50,y,'#c1c2aa',1)}
    rect(27,49,155,112,'#768c88',5);rect(34,56,141,97,grad(34,56,175,153,[[0,'#c9dfd8'],[1,'#88aaa3']]),2);line(104,56,104,153,'#f2e7ce',7);line(34,106,175,106,'#f2e7ce',6);
    rect(223,74,147,10,'#99754f');for(let x of[245,286,327]){line(x,82,x,123,'#6d705c',2);ellipse(x,143,13,20,'#a77746');ellipse(x-2,139,9,15,'#cb9c60')}
    rect(0,321,400,119,'#a9855e');for(let y=336;y<440;y+=23)line(0,y,400,y,'#886c4f',1);
    rect(68,336,264,66,'#c0b9a4',7);ellipse(200,361,53,18,'#5b5f56');
    for(let i=0;i<12;i++){const a=i*TAU/12;ellipse(200+Math.cos(a)*37,358+Math.sin(a)*10,3,8,'#75c5df',a)}
    rect(20,340,37,29,'#e4ba58',4);rect(21,340,35,9,'#ffe49a',3);mob(330,294,82,Math.sin(time*3)*.04);
    line(308,310,247,323,'#665e48',10);line(307,307,246,319,'#e4b58b',6);ellipse(200,330,55,11,'#433e3355');rect(237,312,57,10,'#654934',4);ellipse(200,318,49,13,'#313a3b');ellipse(200,313,48,11,'#677477');ellipse(200,311,43,8,'#202d31');
    const c=s.cake,ry=Math.max(2,Math.abs(Math.cos(c.a))*9);
    ellipse(c.x,c.y+3,24,ry,'#995833');ellipse(c.x,c.y,24,ry,Math.cos(c.a)<0?'#d99a4f':'#f2c776');
    for(let i=0;i<5;i++)ellipse(c.x-16+i*8,c.y+Math.sin(i*2)*ry*.4,2.5,Math.max(.6,ry*.2),'#ad713d');
    if(s.phase==='ready'){
      const value=pancakeMeter(s),now=Math.abs(value-.5)<=.12;
      rect(51,176,298,76,'#fff5dcf2',12);
      text(now?'今！ FLIP':'緑で FLIP',200,191,17,now?'#237449':'#6a5945');
      rect(69,212,262,15,'#c98265',7);rect(122,212,156,15,'#e9bc65',4);rect(169,210,62,19,now?'#32b477':'#77c89a',4);
      line(200,210,200,229,'#dbffde',1.5);
      const x=69+262*value;poly([[x-6,204],[x+6,204],[x,211]],'#304e50');line(x,214,x,229,'#233f45',3);
      text('早い',83,240,10,'#8b5c4c');text('緑 = 満点',200,240,11,'#326c46');text('遅い',317,240,10,'#8b5c4c');
      if(s.flash>0)text(s.lastLabel,200,276,17,s.lastLabel==='PERFECT!'?'#2d7d4f':'#a16e34');
    }
    for(let i=0;i<3;i++){const done=i<s.results.length;circle(168+i*32,386,11,done?'#f2c776':'#8d8e7c');if(done)text(Math.round(s.results[i]),168+i*32,386,10,'#654c30')}
    b7panel('MOB BREAKFAST / PANCAKE SERVICE',s.resolved?`${s.round} / 3 枚 完了`:s.phase==='flying'?'自動で裏返し → キャッチ':`${s.round+1} / 3 枚 · あと${Math.max(0,3-s.clock).toFixed(1)}秒`,'#574c3c');
  },
  summary:s=>`ボタン操作 ${s.flips}/3回。得点：${Array.from({length:3},(_,i)=>s.results[i]===undefined?'未操作':Math.round(s.results[i])+'点').join(' / ')}。`
});

// Three retained games. Original game numbers stay fixed.
function b12Held(s,e,k){if(e.action===k)s[k]=e.kind==='buttonDown'}
function b12Metal(x,y,w,h,c='#506878'){rect(x+4,y+5,w,h,'#142d3a',5);rect(x,y,w,h,c,5);line(x+4,y+3,x+w-4,y+3,'#bdcbd1',1);for(let a of[x+6,x+w-6])circle(a,y+6,2,'#d9d8c5')}
function b12ScoreFire(s){return s.fires.reduce((n,f)=>n+1-f.hp,0)*100/3}
defs.push({id:'ballistic_firehose',number:12,title:'モブくん消防ホース',tag:'MIDNIGHT FIRE BRIGADE',seconds:15,max:100,control:'stick',buttons:[{id:'water',label:'WATER'}],controlHint:'上下でノズル角度。WATERで放水。',description:'反動と重力を読み、3階の炎の根元へ放水。',rules:'スティック上下で角度を調整し、WATERを長押し。<br>水は山なりに飛びます。炎の根元を狙おう。',scoring:'3つの窓の鎮火率 × 各33.3点。全窓を消して100点。放水は合計8秒。水がなくなった瞬間に終了。',init(){return{a:-.65,water:false,supply:8,emit:0,drops:[],fires:[105,185,265].map(y=>({y,hp:1})),used:0,finished:false}},input(s,e){if(!s.finished)b12Held(s,e,'water')},cancel(s){s.water=false},update(s,dt){
  if(s.finished)return;
  if(s.supply<=0){s.supply=0;s.water=false;s.drops=[];s.finished=true;score=b12ScoreFire(s);end('WATER EMPTY');return}
  // Stop simulation at the actual empty-supply instant, even for a long frame.
  const step=s.water?Math.min(dt,s.supply):dt;
  let d=direction();s.a=clamp(s.a+d.y*1.12*step,-1.18,-.12);
  if(s.water){
    s.a=clamp(s.a-.065*step,-1.18,-.12);
    s.supply=Math.max(0,s.supply-step);s.used=Math.min(8,s.used+step);s.emit-=step;
    while(s.emit<=0){s.emit+=1/60;s.drops.push({x:84,y:338,vx:480*Math.cos(s.a),vy:480*Math.sin(s.a),life:0})}
  }else s.emit=0;
  for(let p of s.drops){
    let ox=p.x,oy=p.y;p.vy+=260*step;p.x+=p.vx*step;p.y+=p.vy*step;p.life+=step;
    if(ox<292&&p.x>=292){
      let yy=lerp(oy,p.y,(292-ox)/(p.x-ox));
      for(let f of s.fires){let offset=Math.abs(yy-f.y);if(offset<30&&f.hp>0){let old=f.hp;f.hp=Math.max(0,f.hp-(offset<12?.016:.006));if(old>0&&f.hp===0)fx(316,f.y,'鎮火!','#9af5ef')}}
      p.dead=true;
    }
  }
  s.drops=s.drops.filter(p=>!p.dead&&p.y<415&&p.life<2);score=b12ScoreFire(s);
  if(score>99.99||s.supply===0){s.finished=true;s.water=false;s.drops=[];end(score>99.99?'ALL FIRES OUT':'WATER EMPTY')}
},draw(s){rect(0,0,400,440,grad(0,0,0,440,[[0,'#111e3a'],[1,'#536075']]));circle(72,48,24,'#ffe6b1');for(let i=0;i<8;i++){rect(i*59-20,160-(i%3)*25,48,200,'#25364b');for(let j=0;j<5;j++)rect(i*59-10,177+j*28-(i%3)*25,8,12,'#bca37455')}poly([[271,36],[382,48],[382,372],[271,365]],'#36464c');poly([[382,48],[400,27],[400,358],[382,372]],'#202f3b');for(let y=40;y<368;y+=19)line(276,y,378,y+10,'#596168',1);s.fires.forEach((f,i)=>{ellipse(326,f.y-22,42,38,'#131f2b99');rect(293,f.y-48,65,53,'#101a24',2);poly([[293,f.y-48],[301,f.y-42],[301,f.y],[293,f.y+5]],'#77828a');rect(288,f.y+3,77,9,'#92989b',2);if(f.hp>0){for(let j=0;j<6;j++){let x=303+j*9,h=(24+Math.sin(time*9+j*2)*9)*Math.sqrt(f.hp);poly([[x-8,f.y],[x-9,f.y-h*.6],[x+Math.sin(time*7+j)*5,f.y-h-13],[x+7,f.y-h*.45],[x+9,f.y]],j%2?'#ffb846':'#f36c39');poly([[x-4,f.y],[x,f.y-h*.65],[x+4,f.y]],'#ffe6a2')}}else{rect(304,f.y-40,42,34,'#537e81');text('SAFE',325,f.y-23,10,'#c7fff3')}rect(299,f.y+17,54,4,'#16232c');rect(299,f.y+17,54*(1-f.hp),4,'#81e5eb')});rect(0,386,400,54,'#303c49');for(let x=0;x<400;x+=65)line(x,389,x-22,440,'#5c6470');ellipse(77,400,60,12,'#101d31aa');ctx.beginPath();ctx.moveTo(0,419);ctx.bezierCurveTo(140,455,27,360,73,353);ctx.strokeStyle='#bb694f';ctx.lineWidth=12;ctx.stroke();mob(63,363,69,s.water?-.04:0);line(71,348,84,338,'#dfb883',10);line(78,342,84+Math.cos(s.a)*29,338+Math.sin(s.a)*29,'#a9bdc3',12);line(81,340,84+Math.cos(s.a)*30,338+Math.sin(s.a)*30,'#e3eeee',3);s.drops.forEach(p=>line(p.x,p.y,p.x-p.vx*.014,p.y-p.vy*.014,'#a3edff',3));text('MIDNIGHT / FIRE BRIGADE',18,23,10,'#c5d6df','left');text(`残水 ${Math.max(0,s.supply).toFixed(1)}s`,76,427,12,'#bce9ef')},summary:s=>`鎮火 ${s.fires.filter(f=>f.hp===0).length}/3窓・総鎮火率 ${Math.round(b12ScoreFire(s))}%`});
// One timing decision per throw; the curve is automatic and always clears the pillar.
function b13Meter(s){let t=s.phase%2;return t<=1?t:2-t}
function b13Points(v){let e=Math.abs(v-.5);return e<=.08+1e-9?100/3:e<=.19+1e-9?20:e<=.31+1e-9?10:0}
function b13Label(p){return p===100/3?'33.3':String(p)}
function b13Path(t,side,endX){let u=1-t;return{x:u*u*u*239+3*u*u*t*(side>0?340:35)+3*u*t*t*(side>0?340:50)+t*t*t*endX,y:u*u*u*362+3*u*u*t*318+3*u*t*t*110+t*t*t*75}}
function b13Launch(s){
  if(s.finished||s.disc||s.wait>0||s.round>=3)return;
  const value=b13Meter(s),points=b13Points(value),sign=value<.5?-1:1;
  const endX=200+(points===100/3?(value-.5)*175:points===20?sign*41:points===10?sign*65:sign*99);
  s.disc={t:0,x:239,y:362,endX,points,side:s.round%2?-1:1,trail:[]};
  s.thrown++;s.feedback='';beep(490,.04);
}
function b13Resolve(s,p,timeout=false){
  if(s.finished||s.round>=3)return;
  s.points.push(p);s.round++;s.disc=null;s.wait=.55;s.aimLeft=3;
  s.phase=(s.round*.31)%2;
  s.feedback=timeout?'TIME UP +0':p===100/3?'IN! +33.3':p===20?'FRAME +20':p===10?'CURVED +10':'MISS +0';
  s.feedbackColor=p===100/3?'#eaffcf':p?'#ffe3a1':'#ffd3b7';
  score=s.points.reduce((a,b)=>a+b,0);fx(200,112,s.feedback,s.feedbackColor);
  if(s.round>=3){s.finished=true;end('THREE THROWS')}
}
defs.push({
  id:'curved_disc',number:13,title:'モブくんカーブディスク',tag:'SEASIDE DISC ARENA',seconds:0,rounds:3,max:100,
  control:'buttons',buttons:[{id:'throw',label:'THROW'}],
  controlHint:'針が緑の帯に来たらTHROWを1回。',
  description:'緑の帯で投げ、柱をかわして奥のネットへ3投。',
  rules:'動く針が緑の帯に入ったらTHROWを1回。<br>ディスクは自動でカーブします。1投の待ち時間は3秒。',
  scoring:'緑の帯33.3点／すぐ隣20点／外側10点／離れすぎ・時間切れ0点。3投で100点。',
  init(){return{phase:0,round:0,thrown:0,disc:null,points:[],wait:0,aimLeft:3,throwHeld:false,finished:false,feedback:'',feedbackColor:'#eaffcf'}},
  input(s,e){
    if(e.action!=='throw')return;
    if(e.kind==='buttonUp'||e.kind==='buttonCancel'){s.throwHeld=false;return}
    if(e.kind==='buttonDown'&&!s.throwHeld){s.throwHeld=true;b13Launch(s)}
  },
  cancel(s){s.throwHeld=false},
  update(s,dt){
    if(s.finished)return;
    if(s.disc){
      let p=s.disc;p.t=Math.min(1,p.t+dt/1.3);let at=b13Path(p.t,p.side,p.endX);p.x=at.x;p.y=at.y;
      p.trail.push([p.x,p.y]);if(p.trail.length>75)p.trail.shift();
      if(p.t>=1)b13Resolve(s,p.points);
      return;
    }
    if(s.wait>0){s.wait=Math.max(0,s.wait-dt);return}
    let step=Math.min(dt,s.aimLeft);s.phase+=step*.65;s.aimLeft=Math.max(0,s.aimLeft-step);
    if(s.aimLeft===0)b13Resolve(s,0,true);
  },
  draw(s){
    rect(0,0,400,440,grad(0,0,0,440,[[0,'#95cfc9'],[.3,'#dce8cd'],[.31,'#3e9dac'],[.48,'#287c96'],[.49,'#e5c697'],[1,'#b59065']]));
    circle(326,43,26,'#fff2cc');for(let i=0;i<6;i++)line(0,139+i*10,400,141+i*10,'#ace2de55');
    poly([[95,118],[305,118],[386,393],[14,393]],'#cee1c7');
    for(let i=0;i<9;i++)line(95-i*10,118+i*34,305+i*10,118+i*34,'#9dc4ae');
    line(96,118,16,393,'#fff3ce',3);line(304,118,384,393,'#fff3ce',3);
    poly([[163,49],[240,49],[234,91],[168,91]],'#577b7e');
    for(let i=0;i<8;i++)line(167+i*10,52,172+i*8,89,'#c0e8dc',1);
    for(let y=55;y<91;y+=8)line(165,y,238,y,'#d0ebe0',1);
    line(158,48,158,103,'#f5ead7',5);line(242,48,242,103,'#f5ead7',5);line(158,48,242,48,'#f5ead7',5);
    // The dotted automatic route explains the curve without another control.
    if(!s.disc&&!s.finished){for(let i=1;i<20;i++){let p=b13Path(i/20,s.round%2?-1:1,200);ellipse(p.x,p.y,2.5,1.6,'#fff7d599')}}
    ellipse(200,273,39,12,'#436d6955');poly([[174,159],[218,159],[226,268],[174,268]],'#8c9c95');
    poly([[218,159],[235,170],[235,258],[226,268]],'#657e7b');poly([[174,159],[187,149],[235,159],[218,170]],'#c5cec0');
    for(let y=186;y<267;y+=24)line(176,y,225,y,'#c3cbbc',2);
    for(let i=0;i<3;i++){rect(126+i*52,16,44,22,i<s.points.length?'#376e69':'#ffffffa6',6);text(i<s.points.length?b13Label(s.points[i]):i+1,148+i*52,27,11,i<s.points.length?'#fff0bf':'#447a72')}
    if(s.disc){
      let p=s.disc;p.trail.forEach((v,i)=>{if(i%4===0)ellipse(v[0],v[1],4,1.5,'#ecfff08a')});
      ellipse(p.x+5,p.y+14,13,4,'#376e6955');ellipse(p.x,p.y,13,5,'#e7ad55');ellipse(p.x,p.y-2,13,4,'#fff3ac');line(p.x-5,p.y-3,p.x+5,p.y-1,'#c57a4f',2);
    }
    // Timing meter stays clear of both the pillar and the selected MOB.
    rect(45,289,310,65,'#315e59ed',10);
    text(s.disc?'CURVING…':s.wait>0?s.feedback:'緑の帯で THROW',200,303,12,s.wait>0?s.feedbackColor:'#f2f5d6');
    const mx=68,mw=264,my=326;
    rect(mx,my-8,mw,16,'#a08d78',5);
    rect(mx+mw*.19,my-8,mw*.62,16,'#bea875',4);
    rect(mx+mw*.31,my-8,mw*.38,16,'#e1c681',3);
    rect(mx+mw*.42,my-9,mw*.16,18,'#8be5a4',3);
    line(200,my-8,200,my+8,'#e8ffcd',1);
    let px=mx+b13Meter(s)*mw;
    line(px,my-12,px,my+12,'#fffce6',3);poly([[px-5,my-15],[px+5,my-15],[px,my-9]],'#fffce6');
    text('33.3',200,344,9,'#d2fac5');text('20',mx+mw*.355,344,9,'#f3dfb5');text('20',mx+mw*.645,344,9,'#f3dfb5');
    ellipse(200,415,41,9,'#5e5c4666');mob(200,386,65,s.disc?-.12:0);
    line(219,376,238,365,'#f0cb99',9);if(!s.disc)ellipse(239,362,13,5,'#ffe6a3');
    text(`THROW ${Math.min(3,s.round+1)} / 3${s.disc?' · FLIGHT':s.wait>0?' · NEXT':` · ${s.aimLeft.toFixed(1)}s`}`,200,431,11,'#f8e5c7');
  },
  summary:s=>`各投 ${s.points.map(b13Label).join(' / ')}点・ネット内 ${s.points.filter(n=>n===100/3).length}/3`
});
function b16Target(){return[37,31,29,37,49,56,54,45]}
function b16Score(s){let base=0,remain=0;for(let i=0;i<8;i++){base+=68-s.target[i]-2;remain+=s.cracked[i]?68-s.target[i]-2:Math.max(0,Math.abs(s.r[i]-s.target[i])-2)}return clamp((base-remain)/base)*100}
defs.push({id:'lathe_pottery',number:16,title:'モブくんろくろの名人',tag:'KILN HOUSE CERAMICS',seconds:15,max:100,control:'stick',buttons:[{id:'press',label:'PRESS'}],controlHint:'上下で手の高さ。PRESSでゆっくり押す。',description:'回る粘土を両手で押し、完成の輪郭へ花瓶を成形。',rules:'上下で指の高さ、PRESS長押しで粘土を押す。<br>金色の完成線へ合わせよう。周りの高さも一緒に変形します。',scoring:'8段の半径誤差を初期から改善した割合×100。全段が目標±2以内で100点。細くしすぎた段は0点。',init(){return{r:Array(8).fill(68),target:b16Target(),cracked:Array(8).fill(false),h:0,press:false,work:0}},input(s,e){b12Held(s,e,'press')},cancel(s){s.press=false},update(s,dt){let d=direction();s.h=clamp(s.h+d.y*3.8*dt,0,7);if(s.press){s.work+=dt;for(let i=0;i<8;i++){let weight=Math.max(0,1-Math.abs(i-s.h)/1.3);s.r[i]=Math.max(12,s.r[i]-weight*20*dt);if(s.r[i]<20)s.cracked[i]=true}}score=b16Score(s);if(score>=99.99)end('MASTERPIECE')},draw(s){rect(0,0,400,440,grad(0,0,0,440,[[0,'#dfd5ba'],[1,'#ae9274']]));for(let x=0;x<400;x+=52)line(x,0,x,306,'#c6b99f');rect(28,36,129,147,'#776f59',5);rect(36,44,113,130,'#a3b2a0');line(93,45,93,173,'#eee0bb',5);line(36,103,149,103,'#eee0bb',5);rect(275,59,111,11,'#8b694d');for(let i=0;i<4;i++){let x=290+i*25;ellipse(x,53,9,5,'#ad8c6a');poly([[x-9,53],[x-7,31],[x+5,31],[x+9,53]],i%2?'#9b7357':'#d3b18b');ellipse(x,31,6,3,'#685d50')}rect(0,342,400,98,'#926b51');for(let y=350;y<440;y+=23)line(0,y,400,y-4,'#aa8360');ellipse(215,396,112,20,'#594a3e55');b12Metal(157,351,118,43,'#707d75');ellipse(216,348,101,24,'#5e695f');ellipse(216,340,101,21,'#a5aea0');for(let i=0;i<8;i++){let a=i*TAU/8+time*4;line(216+Math.cos(a)*70,340+Math.sin(a)*15,216+Math.cos(a)*96,340+Math.sin(a)*20,'#d2d4b8',1)}let cx=216,top=140,dy=28;let left=s.r.map((r,i)=>[cx-r,top+i*dy]),right=s.r.map((r,i)=>[cx+r,top+i*dy]).reverse();poly([...left,...right],grad(cx-68,0,cx+68,0,[[0,'#86563b'],[.2,'#c3936a'],[.46,'#dfba89'],[.72,'#b37d54'],[1,'#7a5139']]));for(let i=0;i<8;i++){let y=top+i*dy,r=s.r[i];ellipse(cx,y,r,7,i===0?'#d0a779':'#d2a57422');if(i===0)ellipse(cx,y,r-7,4,'#71513e');line(cx-r+3,y+3,cx+r-3,y+3,s.cracked[i]?'#3a3430':'#a477542a',1);if(s.cracked[i])line(cx-8,y-6,cx+7,y+9,'#493c31',2)}ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle='#fdf0b1';ctx.lineWidth=2;for(let side of[-1,1]){ctx.beginPath();s.target.forEach((r,i)=>i?ctx.lineTo(cx+side*r,top+i*dy):ctx.moveTo(cx+side*r,top+i*dy));ctx.stroke()}ctx.restore();let y=top+s.h*dy,idx=Math.round(s.h),r=s.r[idx];rect(65,y+64,58,8,'#806044',3);line(74,y+69,74,393,'#665a47',5);line(113,y+69,113,393,'#665a47',5);mob(95,y+35,64,s.press?.04:0);line(111,y+25,cx-r-(s.press?0:10),y,'#e2bb90',8);ellipse(cx-r-(s.press?0:10),y,9,5,'#f3ce9c');line(108,y+45,cx-r-4,y+22,'#b78c64',7);ellipse(cx-r-4,y+22,8,4,'#f3ce9c');if(s.press){for(let i=0;i<6;i++){let t=(time*3+i*.17)%1;ellipse(cx-r-14-t*35,y+t*t*43,3-t*2,2,'#c49167')}}text('KILN HOUSE / HAND THROWN',200,19,10,'#715944');text('金色の輪郭へ',220,112,13,'#725b42');text(`輪郭の改善 ${Math.round(b16Score(s))}%`,217,423,13,'#fae3bf')},summary:s=>`8段の輪郭改善 ${Math.round(b16Score(s))}%・細くしすぎ ${s.cracked.filter(Boolean).length}段`});

// Requested revisions. Approved juice/rally physics remain in their original definitions.
const titles={meteor:'モブくんギャラクシー',archery:'モブくんのゆらゆらアーチェリー',juice:'モブくんのピッタリジュース',lock:'モブくんのくるくるロック',shield:'モブくんシールド360',rally:'モブくんラリー',inertial_docking:'モブくんの宇宙ドッキング',pendulum_cargo:'モブくんの吊り荷ピタッ',pancake_flip_catch:'モブくんのパンケーキ返し'};
defs.forEach((g,i)=>{g.title=titles[g.id]||g.title;g.number=g.number||i+1});
const gameById=id=>defs.find(g=>g.id===id);
gameById('lathe_pottery').seconds=10;
gameById('ballistic_firehose').seconds=10;
const meteorGame=gameById('meteor'),meteorUpdate=meteorGame.update,meteorFx=fx;
meteorGame.update=function(s,dt){const before=s.kills;this.originalUpdating=true;meteorUpdate.call(this,s,dt);this.originalUpdating=false;score=clamp(s.kills*5+s.got*2-s.hits*15,0,100)};
fx=function(x,y,label,c){if(meteorGame.originalUpdating)label=label==='+10'?'+5':label==='+5'?'+2':label==='HIT −10'?'HIT −15':label;meteorFx(x,y,label,c)};
meteorGame.rules='下部スティック＋FIRE。隕石＋5点、星くず＋2点、被弾−15点。12秒。';meteorGame.scoring='破壊×5＋星くず×2−被弾×15。0〜100点。';meteorGame.summary=s=>`破壊 ${s.kills}×5＋星 ${s.got}×2−被弾 ${s.hits}×15`;
const lockGame=gameById('lock'),lockUpdate=lockGame.update;
lockGame.update=function(s,dt){if(s.wait<=0&&s.round<10)s.a+=(2.65+s.round*.15)*.7*dt;lockUpdate.call(this,s,dt)};
const shieldGame=gameById('shield'),shieldUpdate=shieldGame.update;
shieldGame.update=function(s,dt){shieldUpdate.call(this,s,dt);for(const b of s.balls)if(!b.faster){b.speed*=1.6;b.faster=true}};

// Shared ship outline: the target and player use identical geometry and orientation.
function dockShape(x,y,color){ctx.save();ctx.translate(x,y);poly([[-25,-20],[-5,-12],[23,-8],[31,0],[23,8],[-5,12],[-25,20],[-18,0]],color);ellipse(0,0,14,11,'#314f71');ctx.restore()}
function dockAccuracy(s){return 100*clamp(1-Math.hypot(s.x-294,s.y-166)/40)}
const dockGame=gameById('inertial_docking'),dockInit=dockGame.init,dockDraw=dockGame.draw;
dockGame.init=()=>({...dockInit(),obstacleTime:0,obstacles:[{x:161,y:246,r:25},{x:223,y:113,r:22},{x:266,y:292,r:25}].map((o,i)=>({...o,bx:o.x,by:o.y,phase:i*2}))});
dockGame.buttons=[{id:'land',label:'着陸！'}];dockGame.controlHint='スティックで移動 → 着陸！で位置を確定';dockGame.rules='動く岩を避けて船の輪郭を重ね、着陸！で確定。衝突は0点で終了。';dockGame.scoring='中心誤差0pxで100点、40pxで0点。着陸ボタンか時間切れで確定。衝突は0点。';
dockGame.input=(s,e)=>{if(s.resolved||e.kind!=='buttonDown'||e.action!=='land')return;s.locked=s.resolved=true;s.vx=s.vy=0;score=dockAccuracy(s);end('LANDED')};
dockGame.update=function(s,dt){if(s.resolved)return;s.obstacleTime+=dt;for(const o of s.obstacles){o.x=o.bx+Math.sin(s.obstacleTime*1.4+o.phase)*23;o.y=o.by+Math.sin(s.obstacleTime*.9+o.phase)*13}const d=direction(),moving=Math.hypot(d.x,d.y)>.03;if(moving)s.active=true;s.thrustX=d.x;s.thrustY=d.y;s.vx=lerp(s.vx,d.x*180,1-Math.exp(-(moving?19:27)*dt));s.vy=lerp(s.vy,d.y*180,1-Math.exp(-(moving?19:27)*dt));s.x=clamp(s.x+s.vx*dt,28,340);s.y=clamp(s.y+s.vy*dt,52,386);for(const o of s.obstacles)if(Math.hypot(s.x-o.x,s.y-o.y)<o.r+23){s.collided=s.resolved=true;s.vx=s.vy=0;score=0;end('COLLISION');return}score=s.active?dockAccuracy(s):0;};
dockGame.timeout=s=>{if(s.resolved)return;s.resolved=true;s.vx=s.vy=0;score=dockAccuracy(s);end('TIME UP')};
dockGame.draw=function(s){dockDraw(s);for(const o of s.obstacles)rock(o.x,o.y,o.r,time*.3);ctx.save();ctx.globalAlpha=.65;dockShape(294,166,'#83ffbe');ctx.restore();dockShape(s.x,s.y,'#e1e8e9');mob(s.x,s.y,26);rect(100,397,270,35,'#14213e');text(s.locked?`接続完了 ${Math.round(score)}点`:'輪郭を合わせ、着陸！で確定',235,416,12,'#d1ffe3')};dockGame.summary=s=>`船型の位置一致 ${Math.round(score)}点 / 中心誤差 ${Math.hypot(s.x-294,s.y-166).toFixed(1)}px`;

function cargoWave(t){return{x:Math.sin(t*2.1)*29,y:Math.sin(t*2.7)*15}}
const cargoGame=gameById('pendulum_cargo'),cargoInit=cargoGame.init,cargoDraw=cargoGame.draw;
cargoGame.init=()=>({...cargoInit(),seaTime:0});
cargoScore=function(s,p){const {left,right}=cargoFootprint(s,p),wave=cargoWave(s.seaTime);return 100*clamp((Math.min(right,337+wave.x)-Math.max(left,230+wave.x))/(right-left))};
cargoGame.update=function(s,dt){if(s.resolved||dt<=0)return;s.seaTime+=dt;let accel=0;if(!s.committed){const d=direction(),old=s.v;s.v=lerp(s.v,d.x*145,1-Math.exp(-13*dt));accel=(s.v-old)/dt;s.x=clamp(s.x+s.v*dt,48,352)}const lower=s.committed?143:0;s.len+=lower*dt;const wind=1.35*Math.sin(s.seaTime*2.3)+.65*Math.cos(s.seaTime*4.1);s.av+=(-520/s.len*Math.sin(s.a)-accel/s.len*.3-1.5*s.av+wind)*dt;s.a=clamp(s.a+s.av*dt,-.52,.52);let p=cargoPose(s),deck=351+cargoWave(s.seaTime).y;if(s.committed&&p.y+cargoBottom(s)>=deck){s.len=(deck-cargoBottom(s)-83)/Math.cos(s.a);p=cargoPose(s);s.last=cargoScore(s,p);s.placed={x:p.x,y:deck-cargoBottom(s),v:0};s.v=s.av=0;s.lower=false;s.landed=s.resolved=true;score=s.last;end('LANDING COMPLETE');return}score=0};
cargoGame.draw=function(s){cargoDraw(s);const wave=cargoWave(s.seaTime);rect(0,310,400,130,'#245e79');for(let i=0;i<10;i++)line(0,330+i*12,400,330+i*12+Math.sin(s.seaTime+i)*5,'#8cdae155',2);poly([[220+wave.x,351+wave.y],[347+wave.x,351+wave.y],[332+wave.x,383+wave.y],[235+wave.x,383+wave.y]],'#4a4647');rect(230+wave.x,351+wave.y,107,8,'#7ad9a0');const p=cargoPose(s);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(s.a);rect(-38,-20,76,38,'#b95c49',3);text('MOB',0,0,12,'#fff2c9');ctx.restore();text('海上の台座 · 風と波を読んで1回だけ着地',200,418,11,'#e7fff0')};cargoGame.rules='左右で位置合わせ。強い横風と波で揺れる海上の台座へLOWERを1回。置いた瞬間に終了。';

const pancakeGame=gameById('pancake_flip_catch'),pancakeUpdate=pancakeGame.update,pancakeDraw=pancakeGame.draw;
pancakeAward=s=>(100/3)*clamp(1-Math.max(0,Math.abs(pancakeMeter(s)-.5)-.075)/.425);
pancakeGame.update=function(s,dt){const prior=s.phase;pancakeUpdate.call(this,s,dt);if(s.phase==='flying')s.cake.a=Math.PI*7*(s.flight/.8);if(prior==='flying'&&s.phase!=='flying')fx(200,300,s.lastLabel,'#ffd66f')};
pancakeGame.draw=function(s){pancakeDraw(s);if(s.phase==='ready'){rect(69,210,262,19,'#c98265',4);rect(180.35,210,39.3,19,'#32b477',4);const x=69+262*pancakeMeter(s);line(x,207,x,232,'#203e45',3);text(Math.abs(pancakeMeter(s)-.5)<=.075?'今！ FLIP':'中央の緑で FLIP',200,191,17,'#237449')}if(s.phase==='flying'){const u=s.flight/.8;ctx.save();ctx.translate(200,s.cake.y);ctx.rotate(s.cake.a);ellipse(0,0,34,11,'#ffdb84');ellipse(0,-3,28,8,'#d58b38');ctx.restore();for(let i=0;i<16;i++){let a=i*TAU/16+u*8;line(200+Math.cos(a)*48,s.cake.y+Math.sin(a)*30,200+Math.cos(a)*75,s.cake.y+Math.sin(a)*55,'#fff1b9aa',2)}text('SPIN × 3.5',200,90,25,'#7f4a26')}};
pancakeGame.scoring='中央±7.5%で1枚33⅓点。外れるほど減点。3枚で100点。';

// Power is locked before each throw. Each monster consumes exactly one penetration.
function discPower(v){return clamp(1-Math.abs(v-.5)*2)}
function discPercent(power){return Math.floor(power*1000+1e-9)/10}
function discPierces(power){return power>=.9-1e-12?2:power>=.85-1e-12?1:0}
function discMonsters(t){return[{id:0,x:200+Math.sin(t*5.6)*143,y:244,r:24},{id:1,x:200+Math.sin(t*6.3+1.8)*143,y:155,r:24}]}
function discContact(d,m){if(d.hitIds.includes(m.id))return false;d.hitIds.push(m.id);if(d.pierces>0){d.pierces--;return false}return true}
const discGame=gameById('curved_disc'),discInit=discGame.init,discInput=discGame.input,discUpdate=discGame.update,discDraw=discGame.draw;
discGame.init=()=>({...discInit(),power:null,powerPhase:0,powerLeft:3,monsterTime:0});
discGame.input=function(s,e){if(s.finished)return;if(s.wait>0){if(e.kind==='buttonUp'||e.kind==='buttonCancel')s.throwHeld=false;return}if(s.power===null&&e.kind==='buttonDown'&&e.action==='throw'&&!s.throwHeld){s.throwHeld=true;s.power=discPower(b13Meter({phase:s.powerPhase}));s.feedback=`POWER ${discPercent(s.power)}%`;return}discInput.call(this,s,e);if(s.disc&&s.disc.pierces===undefined){s.disc.pierces=discPierces(s.power);s.disc.hitIds=[]}};
discGame.update=function(s,dt){if(s.finished)return;s.monsterTime+=dt;if(s.power===null&&!s.disc&&s.wait<=0){s.powerPhase+=dt*.85;s.powerLeft=Math.max(0,s.powerLeft-dt);if(s.powerLeft===0){b13Resolve(s,0,true);s.powerLeft=3}return}const round=s.round,disc=s.disc;discUpdate.call(this,s,dt);if(disc&&s.disc){for(const m of discMonsters(s.monsterTime))if(Math.hypot(disc.x-m.x,disc.y-m.y)<m.r+13){if(discContact(disc,m)){b13Resolve(s,0);break}else fx(m.x,m.y,'貫通','#ffec8b')}}if(s.round!==round){s.power=null;s.powerPhase=0;s.powerLeft=3}};
discGame.draw=function(s){discDraw(s);for(const m of discMonsters(s.monsterTime)){circle(m.x,m.y,m.r,'#9a4a79');poly([[m.x-20,m.y-12],[m.x-16,m.y-36],[m.x-4,m.y-20]],'#d388ad');poly([[m.x+20,m.y-12],[m.x+16,m.y-36],[m.x+4,m.y-20]],'#d388ad');circle(m.x-8,m.y-3,6,'#fff7cb');circle(m.x+8,m.y-3,6,'#fff7cb');circle(m.x-8,m.y-3,2,'#352541');circle(m.x+8,m.y-3,2,'#352541')}if(s.power===null&&!s.disc&&s.wait<=0){rect(45,289,310,65,'#315e59');const v=b13Meter({phase:s.powerPhase});text('最初に POWER を止める',200,303,13,'#fff4d0');rect(68,319,264,15,'#92795c',4);rect(180.2,317,39.6,19,'#d9b658',3);rect(186.8,317,26.4,19,'#8be5a4',3);line(68+v*264,314,68+v*264,339,'#fff',3);text(`${discPercent(discPower(v))}% · 85%=1体 / 90%=2体`,200,345,10,'#fff4d0')}else text(`POWER ${discPercent(s.power||0)}% · 残り貫通 ${s.disc?s.disc.pierces:discPierces(s.power||0)}`,200,278,12,'#234e48')};
discGame.rules='最初のTHROWでパワー確定、次のTHROWで投げる。左右に高速移動するモンスター2体に注意。';discGame.controlHint='最初にパワー、次に投げるタイミング';discGame.description='パワーを合わせて高速移動モンスターを貫通しよう。';discGame.scoring='一致率85%以上で1体、90%以上で2体貫通。衝突して貫通が残っていなければ0点。3投最大100点。';

  const current=defs.find(d=>d.id===api.id);
  if(!current)throw new Error('Unknown approved game');
  if(current.id==='lathe_pottery')current.seconds=10;
  const state=current.init();
  let stagePointer=null;
  if(current.id==='archery'){const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}};canvas.addEventListener('pointerdown',e=>{if(!enabled()||stagePointer!==null)return;e.preventDefault();stagePointer=e.pointerId;try{canvas.setPointerCapture(stagePointer)}catch{}current.input(state,{kind:'stageDown',...point(e)})},{signal});canvas.addEventListener('pointermove',e=>{if(enabled()&&e.pointerId===stagePointer){e.preventDefault();current.input(state,{kind:'stageMove',...point(e)})}},{signal});for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,e=>{if(e.pointerId!==stagePointer)return;stagePointer=null;if(enabled())current.input(state,{kind:type==='pointerup'?'stageUp':'cancel',...point(e)})},{signal})}
  shell.querySelector('[data-hint]').textContent=current.id==='juice'?'押して注ぐ → 離してSTOP。注ぐのは1回だけ。':current.id==='rally'?'下部スティックで左右移動。2球を8秒間返そう。':current.id==='lathe_pottery'?'上下で手の高さ。PRESSを押して成形。10秒勝負。':(current.controlHint||current.scoring).replace(/<br\s*\/?>/g,' ');
  let button=null;
  const enabled=()=>active&&!ended&&!disposed&&valid();
  if(current.control==='stick'){
    const pad=document.createElement('div');pad.dataset.arcadeStick='';controls.appendChild(pad);
    disposeStick=root.MobPartyControls.stick(pad,held,enabled);
  }
  if(current.control==='button'||current.buttons){button=document.createElement('button');button.type='button';button.dataset.arcadeAction='';button.textContent=current.actionLabel||current.buttons[0].label;button.disabled=true;controls.appendChild(button)}
  function release(cancel=false){if(!sources.size)return;sources.clear();pointer=null;if(disposed)return;if(current.buttons)current.input(state,{kind:cancel?'buttonCancel':'buttonUp',action:current.buttons[0].id});else current.input(state,{kind:cancel?'cancel':'up'})}
  function stopInput(){release(true);pointer=null;stagePointer=null;held.clear();current.cancel?.(state)}
  function press(source){if(!enabled()||sources.has(source))return;const first=!sources.size;sources.add(source);if(first){if(current.buttons)current.input(state,{kind:'buttonDown',action:current.buttons[0].id});else current.input(state,{kind:'down'})}}
  function lift(source,cancel){if(!sources.delete(source))return;if(!sources.size){if(current.buttons)current.input(state,{kind:cancel?'buttonCancel':'buttonUp',action:current.buttons[0].id});else current.input(state,{kind:cancel?'cancel':'up'})}}
  if(button){
    button.addEventListener('pointerdown',e=>{if(!enabled()||pointer!==null)return;e.preventDefault();pointer=e.pointerId;try{button.setPointerCapture(pointer)}catch{}press('pointer:'+pointer)},{signal});
    const up=(e,cancel)=>{if(e.pointerId!==pointer)return;e.preventDefault();pointer=null;lift('pointer:'+e.pointerId,cancel)};
    button.addEventListener('pointerup',e=>up(e,false),{signal});for(const type of ['pointercancel','lostpointercapture'])button.addEventListener(type,e=>up(e,true),{signal});
    button.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press('key:'+e.key)}},{signal});
    button.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();lift('key:'+e.key,false)}},{signal});
    button.addEventListener('blur',()=>release(true),{signal});
  }
  function suspend(){if(disposed)return;stopInput();last=0}
  window.addEventListener('blur',suspend,{signal});document.addEventListener('visibilitychange',suspend,{signal});
  function render(){if(disposed||!valid())return;ctx.save();ctx.clearRect(0,0,W,H);current.draw(state);for(const f of fxs){ctx.globalAlpha=Math.min(1,f.life*2);text(f.label,f.x,f.y-(1-f.life)*40,19,f.c)}ctx.restore();scoreEl.innerHTML=Math.round(score)+' <small>/ '+current.max+'点</small>';timer.textContent=active?(current.seconds?Math.max(0,current.seconds-time).toFixed(1)+'秒':Math.min(current.rounds||10,(state.round||0)+1)+' / '+(current.rounds||10)+'回'):ended?'FINISH':'READY'}
  function resize(){if(disposed)return;const r=world.getBoundingClientRect(),scale=Math.max(.01,Math.min((r.width-4)/W,(r.height-4)/H));canvas.style.width=W*scale+'px';canvas.style.height=H*scale+'px';ctx.setTransform(2,0,0,2,0,0);render()}
  function dispose(){if(disposed)return;active=false;stopInput();disposed=true;shell.dataset.phase='disposed';cancelAnimationFrame(raf);raf=0;clearTimeout(assetTimer);settleAsset();actor.onload=actor.onerror=null;observer?.disconnect();disposeStick();controller.abort();if(button)button.disabled=true;shell.remove()}
  api.own(dispose);
  observer=new ResizeObserver(resize);observer.observe(world);resize();
  function complete(){if(delivered||disposed||!ended||!valid())return;delivered=true;const result=score,note=current.summary?current.summary(state):current.scoring;dispose();api.done(result,note)}
  function frame(now){raf=0;if(disposed)return;if(!valid()){dispose();return}if(document.hidden){last=0;raf=requestAnimationFrame(frame);return}let remaining=last?Math.max(0,(now-last)/1000):0;last=now;while(remaining>1e-9&&enabled()){const dt=Math.min(1/120,remaining,(current.seconds?Math.max(0,current.seconds-time):Infinity));time+=dt;remaining-=dt;current.update(state,dt);fxs.forEach(f=>f.life-=dt);fxs=fxs.filter(f=>f.life>0);if(!ended&&current.seconds&&time>=current.seconds-1e-9){time=current.seconds;if(current.timeout)current.timeout(state);else end()}if(dt===0)break}if(ended){if(now>=resultAt){complete();return}render();raf=requestAnimationFrame(frame);return}render();raf=requestAnimationFrame(frame)}
  const assetReady=new Promise(resolve=>{settleAsset=resolve;actor.onload=actor.onerror=resolve;assetTimer=setTimeout(resolve,2500);actor.src=api.player.img;if(actor.complete)resolve()});
  const ready=(async()=>{await assetReady;clearTimeout(assetTimer);if(disposed||!valid()){dispose();return}resize();if(!(await api.countdown())||disposed||!valid()){dispose();return}active=true;shell.dataset.phase='play';if(button)button.disabled=false;last=performance.now();raf=requestAnimationFrame(frame)})();
  return {dispose,ready};
}
root.MobApprovedGames={run};
})(window);
