/* Scenic illustration only. No game state, input handlers, timers or world coordinates. */
(()=>{
 'use strict';
 const palettes={reaction:['#081c2c','#344a67','#7ce8da'],memory:['#182d3d','#a7865e','#f7d99b'],puzzle:['#0d243e','#41677e','#a7eee6'],launch:['#79b7cd','#e6ccb0','#fff2b6'],stack:['#335879','#e6b692','#fff0c1'],breakdance:['#16172e','#55375d','#f3cd8e'],factory:['#143744','#799b98','#f4cb76'],catcher:['#2c315b','#b47791','#ffe4a8'],tidy:['#476977','#d7b998','#fff1cb'],ski:['#88bdcf','#d6e7e7','#fff3cf']};
 const selectors={reaction:['.reaction-zone'],memory:[':scope'],puzzle:['.number-game-shell'],launch:['.gauge-wrap','.flight-viewport'],stack:['.stack-stage'],breakdance:['.n1990-shell','.n1990-choice4'],factory:['.factory-room','.factory-belt'],catcher:['.ufo-glass','.ufo-marquee'],tidy:['.tidy-room'],ski:['.ski-stage']};
 const cache=new Map(),stats={renders:0,totalMs:0,maxMs:0};let observers=[],generation=0;
 const round=(c,x,y,w,h,r,fill,stroke)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}};
 function scene(canvas,key,{detail=true,tile=false,cover=false,machine=false}={}){
  const c=canvas.getContext('2d'),W=canvas.width,H=canvas.height,sy=H/600; c.save();c.scale(W/600,H/600);
  const [dark,mid,light]=palettes[key]||palettes.reaction;
  const grad=(x,y,a,b,stops)=>{const g=c.createLinearGradient(x,y,a,b);stops.forEach(([p,v])=>g.addColorStop(p,v));return g};
  const rect=(x,y,w,h,color,r=0,stroke)=>round(c,x,y,w,h,r,color,stroke);
  const path=(pts,color,stroke)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(color){c.fillStyle=color;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}};
  const line=(x,y,a,b,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke()};
  const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
  const text=(s,x,y,size,color,align='left')=>{c.font=`800 ${size}px system-ui,sans-serif`;c.fillStyle=color;c.textAlign=align;c.fillText(s,x,y)};
  const glow=(x,y,r,color)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)};
  const bolt=(x,y)=>{ellipse(x,y,3,3,'#132634');ellipse(x-.5,y-.8,1,1,'#c7e0dd')};
  const panel=(x,y,w,h,color=mid)=>{rect(x,y+6,w,h,'#071a2866',8);rect(x,y,w,h,grad(x,y,x+w,y+h,[[0,light],[.035,color],[1,dark]]),8,'#ffffff44');line(x+9,y+8,x+w-9,y+8,'#ffffff45',2);for(const [a,b] of [[x+7,y+7],[x+w-7,y+7],[x+7,y+h-7],[x+w-7,y+h-7]])bolt(a,b)};
  const windowBox=(x,y,w,h)=>{rect(x-5,y-5,w+10,h+10,'#112d3c',3);rect(x,y,w,h,grad(x,y,x,y+h,[[0,'#719aad'],[1,'#d9dbb8']]),2);line(x+w/2,y,x+w/2,y+h,'#233e4a',5);line(x,y+h*.45,x+w,y+h*.45,'#233e4a',5);path([[x+8,y+8],[x+w*.6,y+8],[x+w*.35,y+h-8],[x+8,y+h-8]],'#ffffff18')};
  const perspectiveFloor=(y,base,accent)=>{rect(0,y,600,600-y,grad(0,y,0,600,[[0,base],[1,dark]]));for(let x=-900;x<1500;x+=150)line(300,y,x,600,accent,1);for(let i=1;i<7;i++){const yy=y+(600-y)*Math.pow(i/6,1.6);line(0,yy,600,yy,accent,1)}};
  rect(0,0,600,600,grad(0,0,0,600,[[0,dark],[.55,mid],[1,dark]]));
  if(machine){
   rect(0,0,600,600,grad(0,0,600,0,[[0,'#253f4b'],[.5,'#648087'],[1,'#223d49']]));for(let x=22;x<580;x+=37){rect(x,33,30,533,grad(x,0,x+30,0,[[0,'#2c4550'],[.45,'#657d83'],[.57,'#859998'],[1,'#2a424c']]),11);ellipse(x+15,41,10,5,'#96a9a6');ellipse(x+15,558,10,5,'#172f3d');}for(const y of [0,571]){panel(0,y,600,28,'#7b8d85');for(let x=8;x<600;x+=36)path([[x,y+5],[x+16,y+5],[x+28,y+22],[x+12,y+22]],'#dcbb718c');}rect(5,45,13,509,'#193d49',4);rect(583,45,12,509,'#183744',4);for(let y=58;y<555;y+=65){bolt(11,y);bolt(589,y)}c.restore();return;
  }
  if(tile){
   rect(2,3,596,594,grad(0,0,600,600,[[0,'#fef0ce'],[.42,'#e5cba1'],[1,'#a77957']]),22);rect(11,12,578,571,null,16,'#fff8e0');rect(20,20,560,550,null,12,'#6c534a');for(let i=0;i<4;i++){line(32,42+i*5,135,42+i*5,'#85695744',2);line(465,550-i*5,568,550-i*5,'#85695744',2)}ellipse(300,470,155,35,'#513c3c1c');c.restore();return;
  }
  if(key==='reaction'){
   rect(0,0,600,440,grad(0,0,0,440,[[0,'#09212d'],[1,'#204150']]));
   for(let y=10;y<430;y+=32)for(let x=(y/32%2)*-50;x<600;x+=95){rect(x+2,y,90,28,(x+y)%3?'#254853':'#2a4b57',2);line(x+4,y+2,x+88,y+2,'#72959122')}
   perspectiveFloor(428,'#294c57','#71949c30');path([[0,0],[105,0],[80,444],[0,510]],'#101f2d');path([[600,0],[500,0],[522,443],[600,510]],'#111e31');
   for(const x of [22,512]){panel(x,116,66,269,'#31445f');rect(x+8,136,50,73,'#152839',5);for(let i=0;i<4;i++)rect(x+10,237+i*22,46,4,'#111c2b',1);rect(x+23,349,21,18,'#dcca93',4);glow(x+34,140,90,'#71e7d626')}
   rect(133,34,334,73,'#071a2b',8,'#648991');rect(144,43,312,54,'#183241',4);text('MOB  ·  REACTION',300,77,22,'#bef4e1','center');line(154,96,446,96,'#8bddcb',2);
   line(60,0,60,90,'#06141e',4);line(540,0,540,81,'#06141e',4);path([[27,94],[92,94],[83,75],[38,75]],'#526475');path([[508,85],[573,85],[565,67],[515,67]],'#536275');
   path([[45,98],[77,98],[239,432],[0,432]],'#cfedd414');path([[521,90],[556,90],[600,434],[363,434]],'#a8deec10');
   ellipse(300,481,185,23,'#719caa1c');ellipse(300,481,100,10,'#8edacc14');for(let i=0;i<9;i++)line(165+i*31,520,172+i*31,531,'#b8a77a66',3);
  }else if(key==='memory'){
   rect(0,0,600,418,grad(0,0,600,420,[[0,'#142b37'],[1,'#2f5360']]));for(const x of [22,455]){panel(x,120,125,290,'#405660');for(let y=139;y<391;y+=54){rect(x+12,y,101,42,'#233e4b',3,'#8fa39855');rect(x+45,y+17,33,5,'#c4ad7b',2);text(String((y-139)/54+1).padStart(2,'0'),x+20,y+28,12,'#81968f')}}
   perspectiveFloor(415,'#8b795e','#d7c6a132');path([[0,600],[120,470],[475,470],[600,600]],'#a98a62');rect(124,468,350,12,'#debd85',3);line(121,481,478,481,'#473d37',3);for(let i=0;i<6;i++)line(115,499+i*17,485,499+i*17,'#e8c59422');
   windowBox(205,67,190,102);path([[250,0],[350,0],[366,37],[234,37]],'#a5a287');rect(239,37,122,8,'#ffefbe',4);glow(300,120,220,'#fff1b524');
   for(const [x,y,col] of [[38,486,'#8e9b87'],[489,498,'#a37a6b'],[461,539,'#8288a1']]){panel(x,y,82,47,col);rect(x+28,y+13,27,15,'#ead6a5',2)}
   text('COLLECTION ROOM',300,452,16,'#e2d9b9','center');
  }else if(key==='puzzle'){
   rect(0,0,600,390,grad(0,0,0,390,[[0,'#0b2035'],[1,'#315366']]));for(let i=0;i<63;i++)ellipse((i*173+22)%600,(i*71+17)%310,1+(i%3)*.5,1+(i%3)*.5,'#c7e9ed77');
   path([[40,48],[196,48],[232,186],[40,220]],'#719aab24','#789eaa');path([[560,48],[404,48],[368,186],[560,220]],'#719aab24','#789eaa');ellipse(89,101,34,34,'#a5c7c733');path([[0,239],[165,192],[435,192],[600,239],[600,600],[0,600]],grad(0,200,0,600,[[0,'#58727a'],[.08,'#233b4d'],[1,'#112636']]));
   panel(75,245,450,270,'#385d6e');for(let x=104;x<502;x+=33){rect(x,539,20,8,x%2?'#91cdbb':'#d9b17b',3);line(x+10,555,x+10,580,'#577985',2)}for(const x of [18,558])for(let y=300;y<510;y+=30)rect(x,y,24,12,y%60?'#97c1b9':'#ecbd87',3);glow(300,310,180,'#b9efe519');text('SEQUENCE  /  01—12',300,223,18,'#d6ede0','center');
  }else if(key==='launch'||key==='stack'||key==='ski'){
   rect(0,0,600,600,grad(0,0,0,600,[[0,key==='stack'?'#6493aa':'#79b8ce'],[.6,key==='stack'?'#e5bea0':'#d5e7de'],[1,'#becdbf']]));glow(467,86,140,'#fff3c96b');ellipse(467,86,31,31,'#fff3cb');
   for(const [x,y,w] of [[55,82,80],[236,130,110],[455,178,96]]){ellipse(x,y,w,13,'#fff9e63b');ellipse(x-15,y-9,w*.53,17,'#fff9e637')}
   for(let layer=0;layer<3;layer++){const y=242+layer*70,points=[[-20,600],[-20,y+87]];for(let i=0;i<9;i++)points.push([i*90-40,y+(i%2?-(45+((i*31+layer*21)%70)):55)]);points.push([650,600]);path(points,['#88b5bb','#6a989f','#4f7885'][layer]);if(key==='ski')for(let i=1;i<8;i+=2){const x=i*90-40,yy=y-(45+((i*31+layer*21)%70));path([[x-48,yy+70],[x,yy],[x+42,yy+67],[x+8,yy+48],[x-7,yy+57]],['#e1eee4','#d9e9e3','#c6dedc'][layer])}}
   if(key==='ski'){
    path([[0,447],[114,415],[280,490],[455,447],[600,480],[600,600],[0,600]],'#e9eee0');for(let i=0;i<12;i++){const x=i*61-20,y=407+(i*29)%92,h=26+i%4*12;rect(x-2,y,4,h,'#45616c');path([[x-18,y+26],[x,y-h],[x+18,y+26]],'#416b74');path([[x-12,y+15],[x,y-h+5],[x+12,y+15]],'#759da0')}
    for(const x of [56,537]){rect(x,130,5,225,'#476e7c');line(x-20,148,x+25,148,'#466873',4)}line(0,141,600,164,'#456873',2);for(const x of [129,382]){line(x,149,x,174,'#456873',2);rect(x-15,174,30,23,'#b97360',5,'#e4d1bb');rect(x-11,178,22,8,'#b6d1d5',2)}
   }else if(key==='stack'){
    rect(0,452,600,148,grad(0,452,0,600,[[0,'#b79478'],[1,'#68534a']]));for(let y=466;y<600;y+=28)for(let x=-20;x<600;x+=86){rect(x+(y%56?40:0),y,80,23,'#e5bf9066',3)}
    for(const x of [35,488]){rect(x,103,13,352,'#415c68');for(let y=119;y<440;y+=39){line(x,y,x+57,y+35,'#577281',3);line(x+57,y,x,y+35,'#577281',3)}rect(x+53,103,10,352,'#4e6570');rect(x-17,84,95,22,'#ecc78d',3)}
    line(54,70,518,70,'#516a71',4);for(let i=0;i<13;i++){const x=61+i*36;line(x,70,x,84+i%2*8,'#738081',1);ellipse(x,85+i%2*8,5,7,i%2?'#fff4c4':'#f0bc94')}
    panel(173,519,254,52,'#526875');text('BUILD IT HIGH',300,552,22,'#f4dfb0','center');
   }else{
    perspectiveFloor(422,'#71858a','#d5d1b745');path([[0,523],[230,437],[393,437],[600,523],[600,600],[0,600]],'#3e5b68');path([[255,444],[370,444],[541,600],[88,600]],'#899c99');for(let y=462;y<600;y+=38)rect(298,y,12,18,'#fff0b6',2);
    for(const x of [26,505]){panel(x,269,69,173,'#566e79');rect(x+10,294,49,57,'#1c3b4e',4);for(let j=0;j<3;j++)ellipse(x+20+j*16,375,4,4,['#b6e5c2','#e4c075','#b4d7e2'][j]);line(x+34,269,x+34,226,'#5c7984',4);ellipse(x+34,223,7,7,'#ffda9f')}
    text('MOB  SKYPORT',300,400,20,'#edf5df','center');
   }
  }else if(key==='breakdance'){
   rect(0,0,600,600,grad(0,0,600,600,[[0,'#15192c'],[.5,'#3b3153'],[1,'#122638']]));for(const x of [34,490]){panel(x,213,76,284,'#262c43');for(const y of [258,365,452]){ellipse(x+38,y,29,29,'#070f1c');ellipse(x+38,y,21,21,'#3c465d');ellipse(x+38,y,10,10,'#172339');ellipse(x+32,y-7,3,3,'#7c91a5')}}
   perspectiveFloor(427,'#526777','#8acac329');for(let x=0;x<600;x+=60)for(let y=455;y<600;y+=39)rect(x+2,y+1,56,34,(x/60+y)%2?'#6e89991b':'#b68cbe16',2);
   for(const [x,col] of [[101,'#f8bddd'],[500,'#96ddd6']]){path([[x-9,42],[x+9,42],[x+151,500],[x-171,500]],col+'12');panel(x-18,26,36,29,'#8d8290');ellipse(x,54,11,3,col);glow(x,90,90,col+'25')}
   rect(178,62,244,66,'#121a2c',7,'#ba9ca9');text('CLUB',300,108,38,'#fbe0a2','center');text('DANCE  ·  FLOOR',300,552,19,'#a9dbd5','center');
  }else if(key==='factory'){
   rect(0,0,600,475,grad(0,0,0,475,[[0,'#1a3946'],[1,'#597d80']]));for(let x=18;x<600;x+=108){rect(x,0,12,467,'#274651');line(x+10,0,x+10,468,'#8baaa44d',2)}
   for(const x of [151,343])windowBox(x,53,151,120);for(let y=32;y<255;y+=69){line(0,y,120,y,'#869e9855',13);line(0,y-4,120,y-4,'#b3c4ad44',2)}line(118,24,118,256,'#96aaa288',17);line(112,24,112,256,'#c4ccb744',3);
   for(const x of [48,285,535]){line(x,0,x,24,'#162d39',3);path([[x-34,50],[x+34,50],[x+18,26],[x-18,26]],'#b9b897');rect(x-28,50,56,5,'#ffedb8',2);glow(x,98,87,'#fff3cb20')}
   perspectiveFloor(432,'#79948c','#c1c6a935');for(let x=10;x<600;x+=32)path([[x,434],[x+16,434],[x+30,453],[x+14,453]],'#e9bd7780');for(const [x,y] of [[30,288],[425,280]]){panel(x,y,137,127,'#57736f');rect(x+18,y+20,99,46,'#173642',5);for(let i=0;i<3;i++){ellipse(x+33+i*34,y+94,8,8,['#b1d3b3','#d8ad6b','#ba7d6e'][i]);ellipse(x+31+i*34,y+91,2,2,'#fff5c777')}}
   text('MOB  WORKSHOP',308,212,20,'#d3ddc4','center');line(220,230,397,230,'#c2bd8c55',2);
  }else if(key==='catcher'){
   rect(0,0,600,600,grad(0,0,0,600,[[0,'#3b3b63'],[.58,'#93809c'],[1,'#e1b59e']]));for(let y=20;y<490;y+=36)for(let x=20;x<600;x+=45){ellipse(x,y,2,2,'#fff1d431');if((x+y)%3===0)line(x-3,y,x+3,y,'#fff1d431')}
   path([[0,0],[83,40],[83,462],[0,551]],'#252d4c');path([[600,0],[519,40],[519,462],[600,551]],'#262e4d');for(const x of [26,550]){rect(x,16,20,518,grad(x,0,x+20,0,[[0,'#7789a0'],[.4,'#c7d1cf'],[1,'#5d687e']]),4);rect(x+6,47,6,368,'#f6d49e',3);glow(x+9,255,62,'#f7d69d25')}
   rect(83,45,434,108,'#454967',8,'#bfa9aa');text('MOB  PRIZE  CLUB',300,97,25,'#ffe6af','center');text('COLLECT A LITTLE HAPPINESS',300,127,12,'#cccde0','center');perspectiveFloor(468,'#ddb29e','#9f747152');
   path([[69,168],[99,168],[343,461],[305,461]],'#f8fff313');path([[438,169],[455,169],[523,246],[523,270]],'#f8fff31c');for(let x=105;x<518;x+=37)ellipse(x,174,3,3,'#fde3b6');
  }else if(key==='tidy'){
   rect(0,0,600,390,grad(0,0,0,390,[[0,'#c2ccb8'],[1,'#e0cfaa']]));for(let x=0;x<600;x+=52)rect(x,0,1,390,'#77978920');rect(0,373,600,15,'#8e7760');rect(0,388,600,212,grad(0,388,0,600,[[0,'#b79474'],[1,'#8a6f5d']]));for(let y=401;y<600;y+=27){line(0,y,600,y,'#604f4035',2);for(let x=(y%54?0:76);x<600;x+=150)line(x,y,x,y+27,'#69564533',1)}
   windowBox(220,55,177,171);rect(205,52,15,201,'#688c8b',5);rect(397,52,15,201,'#688c8b',5);for(let x=207;x<411;x+=6)if(x<220||x>397)line(x,57,x,247,'#a1b4a26b');path([[222,228],[397,228],[586,462],[351,462]],'#fff2bd26');rect(198,234,221,10,'#8d775a',3);
   panel(37,88,96,105,'#b18e6c');rect(50,103,70,72,'#718e88',2);path([[57,164],[77,134],[99,151],[115,123],[115,168]],'#c3c7a3');ellipse(74,121,7,7,'#e5c88f');
   rect(480,141,7,236,'#715e50');path([[441,148],[524,148],[509,88],[457,88]],'#efe0b4','#b89e74');ellipse(483,149,36,6,'#f9ebbf');ellipse(482,379,37,8,'#705d4b');glow(481,161,115,'#ffe9b526');
   ellipse(63,401,30,10,'#65574433');rect(44,356,38,43,'#bb9678',5);for(let i=0;i<8;i++){const x=64+Math.sin(i*2)*27,y=327+(i%4)*9;line(64,363,x,y,'#617b64',3);ellipse(x,y,12,6,['#6b967a','#789d7b','#527966'][i%3])}
  }
  if(cover){
   if(key==='puzzle'){for(let i=0;i<3;i++){panel(56+i*57,356+i*6,52,66,'#75a7a5');text(String(i+1),82+i*57,402+i*6,30,'#eff7d1','center')}}
   else if(key==='factory'){panel(70,339,170,144,'#c7a16f');rect(118,351,45,118,'#ebd29b');rect(90,381,129,54,'#f5e2bc',3);text('MOB',153,418,28,'#4d5246','center');line(82,468,230,468,'#816749',3)}
   else if(key==='memory'){for(let i=0;i<3;i++){panel(47+i*58,315+i*19,52,89,'#bea675');ellipse(73+i*58,347+i*19,12,12,'#5f7f75');rect(61+i*58,363+i*19,24,20,'#709482',7)}}
   else if(key==='stack'){for(let i=0;i<3;i++)panel(87+i*14,471-i*67,126,60,['#a17a68','#809d9a','#c4ac71'][i]);}
   else if(key==='breakdance'){ellipse(150,385,90,90,'#111e31');ellipse(150,385,67,67,'#263e53');ellipse(150,385,38,38,'#d5b574');ellipse(150,385,6,6,'#162b42');line(165,255,241,302,'#aeb4a9',5);line(241,302,198,399,'#aeb4a9',5)}
   else if(key==='catcher'){line(165,170,165,295,'#a6bec1',6);panel(133,285,65,36,'#b7c8c1');line(141,316,110,364,'#d7dcd0',7);line(189,316,220,364,'#d7dcd0',7);line(110,364,132,379,'#d7dcd0',7);line(220,364,198,379,'#d7dcd0',7)}
  }
  // Corner shading and deterministic material grain are baked once, never animated.
  const edge=c.createRadialGradient(300,270,170,300,270,460);edge.addColorStop(0,'#00000000');edge.addColorStop(1,'#0715284d');c.fillStyle=edge;c.fillRect(0,0,600,600);
  if(detail){c.globalAlpha=.025;for(let i=0;i<800;i++){c.fillStyle=i%2?'#ffffff':'#000000';c.fillRect((i*137.37)%600,(i*97.13)%600,1,1)}c.globalAlpha=1}
  c.restore();
 }
 function bitmap(key,w,h,options={}){const dpr=Math.min(2,window.devicePixelRatio||1),cw=Math.max(1,Math.round(w*dpr)),ch=Math.max(1,Math.round(h*dpr)),id=[key,cw,ch,options.machine?'machine':options.tile?'tile':options.cover?'cover':'scene'].join(':');if(cache.has(id))return cache.get(id);const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;const at=performance.now();scene(canvas,key,options);const url=canvas.toDataURL('image/webp',.88);stats.renders++;stats.totalMs+=performance.now()-at;stats.maxMs=Math.max(stats.maxMs,performance.now()-at);if(cache.size>=32)cache.delete(cache.keys().next().value);cache.set(id,url);return url}
 function mount(screen){observers.splice(0).forEach(o=>o.disconnect());generation++;const key=screen.dataset.classic;if(!screen.classList.contains('gameplay-fit')||!selectors[key])return;const own=generation;for(const selector of selectors[key])for(const el of selector===':scope'?[screen]:screen.querySelectorAll(selector)){let previous='';const paint=()=>{if(own!==generation||!el.isConnected)return;const r=el.getBoundingClientRect(),id=Math.round(r.width)+':'+Math.round(r.height);if(r.width<2||r.height<2||id===previous)return;previous=id;const tile=el.matches('.n1990-choice4');el.style.setProperty('--scene-background',`url("${bitmap(key,r.width,r.height,{tile,machine:el.matches('.factory-belt')})}")`);};const observer=new ResizeObserver(paint);observer.observe(el);observers.push(observer);paint()}}
 function theme(g,genre=''){if(palettes[g.key])return g.key;const s=g.title+' '+g.key;if(/宇宙|ギャラク|隕石|ロケット|ドッキング/.test(s))return 'puzzle';if(/ジュース|パンケーキ|ろくろ|工場|消防/.test(s))return 'factory';if(/キャッチャ|クレーン|景品/.test(s))return 'catcher';if(/雪|スキー|山|そり/.test(s))return 'ski';if(/記憶|カード|暗記|memory/.test(s))return 'memory';if(/部屋|片付|掃除/.test(s))return 'tidy';if(/積|タワー|吊り|荷物|建/.test(s))return 'stack';return {'頭脳・記憶':'puzzle','スポーツ':'launch','運・駆け引き':'catcher','お絵かき':'tidy','代表バトル':'breakdance','3D':'launch'}[genre]||'reaction'}
 function covers(host,games,genre){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;const el=e.target,g=games[Number(el.dataset.cover)];if(g){el.style.backgroundImage=`url("${bitmap(theme(g,genre(g)),340,210,{cover:true})}")`;el.dataset.ready='true'}observer.unobserve(el)}},{rootMargin:'180px'});host.querySelectorAll('[data-cover]').forEach(el=>observer.observe(el));return ()=>observer.disconnect()}
 window.MobSceneArt={scene,bitmap,mount,covers,theme,stats,palettes};
 const screen=document.getElementById('screen');let pending=false;if(screen)new MutationObserver(changes=>{if(!changes.some(m=>m.type==='attributes'?m.target===screen:[...m.addedNodes].some(n=>n.nodeType===1)))return;if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount(screen)})}).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-classic']});
})();
