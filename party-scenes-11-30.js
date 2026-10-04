/* Decorative Canvas scenery. No gameplay imports, random calls, input, timers or animation loops. */
(()=>{'use strict';
 const targets={slot:'.slot-machine',pk:'#pkField',cut:'#cutArea',errand:'.errand-shell',dontHitMob:'#moleBoard',mobStop:'#mobStopStage',overlap:'#overlapStage',shutter:'#shutterStage',darts:'.darts-main',parachute:'#paraStage',mobCount:'#countMobStage',brake:'#brakeStage',feint:'#feintStage',bomb:'.bomb-stage',overlapMaster:'#masterStage',jumpingMob:'#jumpupView',heroMaybe:'.hero-maybe-scene,#heroChoices',popularGame:'#popularView',planetEnergy:'#planetStage',painter:'#painterStage'};
 const cache=new Map(),bound=new Map(),stats={renders:0,totalMs:0,maxMs:0};
 function draw(canvas,key,part='stage'){
  const c=canvas.getContext('2d');c.save();c.scale(canvas.width/600,canvas.height/600);
  const gradient=(x,y,x2,y2,colors)=>{const g=c.createLinearGradient(x,y,x2,y2);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));return g};
  const rect=(x,y,w,h,color,r=0)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()};
  const line=(x,y,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()};
  const poly=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
  const oval=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
  const glow=(x,y,r,color)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');rect(x-r,y-r,r*2,r*2,g)};
  const ring=(x,y,r,color,width=2)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke()};
  const bolt=(x,y)=>{oval(x,y,3,3,'#182c38');line(x-1,y-1,x+1,y+1,'#c4d1c5',1)};
  const panel=(x,y,w,h,base='#415b61',edge='#d0bf93')=>{rect(x,y+5,w,h,'#14222a55',7);rect(x,y,w,h,gradient(x,y,x+w,y+h,[edge,base,'#20373f']),7);rect(x+4,y+4,w-8,h-8,base,4);line(x+8,y+7,x+w-8,y+7,'#ffffff40',2);[[x+8,y+8],[x+w-8,y+8],[x+8,y+h-8],[x+w-8,y+h-8]].forEach(p=>bolt(...p))};
  const floor=(y,base,edge)=>{rect(0,y,600,600-y,gradient(0,y,0,600,[base,edge]));for(let x=-800;x<1600;x+=150)line(300,y,x,600,'#f8f0d219');for(let i=1;i<7;i++){let yy=y+(600-y)*(i/6)**1.7;line(0,yy,600,yy,'#f8f0d22b')}};
  const mountain=(y,colors)=>{colors.forEach((color,j)=>{const pts=[[0,600],[0,y+j*48]];for(let i=0;i<8;i++)pts.push([i*100-40,y+j*48-(i%2?35:100)-(i%3)*18]);pts.push([600,600]);poly(pts,color)})};
  const cloud=(x,y,s,color='#fff5dc88')=>{oval(x,y,53*s,13*s,color);oval(x-20*s,y-11*s,22*s,17*s,color);oval(x+8*s,y-17*s,27*s,23*s,color);oval(x+35*s,y-6*s,19*s,13*s,color)};
  const lamp=(x,y,s=1)=>{line(x,y-85*s,x,y,'#334854',4*s);poly([[x-28*s,y],[x+28*s,y],[x+42*s,y+18*s],[x-42*s,y+18*s]],'#314851');rect(x-37*s,y+17*s,74*s,5*s,'#f7dda7');glow(x,y+24*s,85*s,'#ffe9b533')};
  const tree=(x,y,s=1,leaf='#496e64')=>{rect(x-4*s,y-24*s,8*s,58*s,'#615749');poly([[x,y-150*s],[x-42*s,y-36*s],[x+42*s,y-36*s]],leaf);poly([[x,y-115*s],[x-53*s,y+9*s],[x+53*s,y+9*s]],leaf)};
  const window=(x,y,w,h)=>{rect(x-5,y-5,w+10,h+10,'#334b52',3);rect(x,y,w,h,gradient(x,y,x,y+h,['#80a7ad','#d0d9c0']));line(x+w/2,y,x+w/2,y+h,'#415c60',4);line(x,y+h*.5,x+w,y+h*.5,'#415c60',4);poly([[x+5,y+5],[x+w*.6,y+5],[x+w*.3,y+h-5],[x+5,y+h-5]],'#ffffff20')};
  const railing=(y,color)=>{rect(0,y,600,6,color);rect(0,y+44,600,5,color);for(let x=12;x<600;x+=54)rect(x,y,4,100,color)};
  const stars=()=>{for(let i=0;i<47;i++){const x=(i*137+33)%600,y=(i*79+17)%380;oval(x,y,i%4===0?1.6:.7,i%4===0?1.6:.7,'#e8eac799')}};
  const city=(base,color,windows=false)=>{for(let i=0;i<15;i++){const x=i*47-24,h=38+(i*37)%121;rect(x,base-h,37,h,color,2);if(windows)for(let yy=base-h+10;yy<base-8;yy+=17)for(let xx=x+7;xx<x+33;xx+=12)rect(xx,yy,4,6,(i+yy)%3?'#bce5dd44':'#ebc47955')}};
  const wood=(y,color='#967451')=>{rect(0,y,600,600-y,color);for(let i=0;i<12;i++){const yy=y+i*(600-y)/12;line(0,yy,600,yy,'#5c493a66',2);for(let j=0;j<7;j++)line(j*103+(i%2)*36,yy+7,j*103+60+(i%2)*36,yy+7,'#e5c39422')}};
  // The moving/clickable objects remain in the original DOM, above these pixels.
  if(key==='slot'){
   rect(0,0,600,600,gradient(0,0,600,600,['#152f3e','#664d5a','#162d3b']));for(let x=15;x<600;x+=40){rect(x,0,11,600,'#c3967529');line(x+12,0,x+12,600,'#071a2744',2)}
   panel(22,22,556,556,'#253e4b','#d3ad70');rect(37,35,526,49,gradient(0,35,0,84,['#a88350','#efd090','#9b7449']),9);for(let x=53;x<559;x+=28){oval(x,55,4,4,'#fff1b5');glow(x,55,12,'#ffe49333')}
   rect(40,101,520,239,'#091d2a',13);panel(35,361,530,190,'#354b54','#af966d');for(const x of [18,582])for(let y=110;y<550;y+=34){oval(x,y,3,5,'#b8e9d9');glow(x,y,11,'#a6ffd32b')}for(let x=62;x<550;x+=33)line(x,552,x+15,570,'#d2b87855',4);
  }else if(key==='pk'){
   rect(0,0,600,600,gradient(0,0,0,600,['#214551','#789490','#486f4e']));poly([[0,0],[600,0],[600,47],[0,110]],'#102e3d');for(let x=0;x<600;x+=65)line(x,0,x+38,72,'#86a6a244',3);
   for(let row=0;row<9;row++){let y=75+row*20;rect(0,y,600,15,row%2?'#4f7178':'#47636f');for(let x=6;x<600;x+=19)rect(x,y+3,10,7,((x+row*7)%5<2)?'#d6c69988':'#91b0ad77',3)}
   rect(0,260,600,30,'#23494a');for(let x=14;x<600;x+=100){rect(x,266,82,17,x%3?'#e7d9a9':'#82b5ac',3);line(x+9,274,x+67,274,'#49665b',2)}
   rect(0,291,600,309,gradient(0,291,0,600,['#71936a','#3f755b']));for(let i=0;i<7;i++)poly([[i*86-90,291],[i*86-48,291],[i*135+10,600],[i*135-65,600]],'#b7c88822');line(90,340,510,340,'#e4eed477',3);line(90,340,25,570,'#e4eed477',3);line(510,340,575,570,'#e4eed477',3);for(const x of [28,570]){rect(x,25,5,192,'#bccaba');for(let y=30;y<64;y+=12)for(let xx=x-17;xx<x+26;xx+=11)rect(xx,y,8,8,'#fff5c0',2);glow(x,49,84,'#fff5c031')}
  }else if(key==='cut'){
   rect(0,0,600,600,'#91afa8');for(let y=0;y<210;y+=43){line(0,y,600,y,'#d0dfce',3);for(let x=(y%2)*30;x<600;x+=76)line(x,y,x,y+43,'#d0dfce',2)}
   rect(0,205,600,22,'#3f6265');wood(227,'#af8960');rect(17,208,566,310,'#69554055',20);rect(18,195,564,309,gradient(0,195,0,504,['#dbc296','#c4a373']),18);for(let y=212;y<490;y+=17)line(30,y,572,y,'#765c3620');rect(35,236,7,210,'#a18151',3);rect(558,236,7,210,'#e6cea0',3);
   for(const x of [58,528]){line(x,34,x,134,'#486463',6);oval(x,24,8,8,'#263f43');oval(x,140,18,28,'#a9bbb0');oval(x-3,134,10,18,'#d4dec9')}
   rect(90,14,93,61,'#e5d6ac',7);rect(96,20,81,46,'#6b8e85',3);oval(453,79,30,39,'#ddd2b1');oval(453,71,21,25,'#bda982');line(430,16,444,49,'#c4d5c1',6);line(460,9,457,45,'#687a60',5);
  }else if(key==='errand'){
   rect(0,0,600,600,gradient(0,0,0,600,['#d8d9bd','#aab7a1','#638476']));for(let x=0;x<600;x+=48)rect(x,0,24,73,'#637f70');poly([[0,58],[600,58],[600,90],[0,107]],'#ead9aa');for(let x=0;x<600;x+=48)poly([[x,58],[x+24,58],[x+24,86],[x,89]],'#496f65');
   for(let y=195;y<595;y+=65){rect(0,y,600,8,'#695840');rect(0,y+8,600,3,'#d5bc89');for(let x=9;x<600;x+=54){rect(x,y-38,43,34,(x+y)%3?'#b49969':'#88a187',3);line(x+5,y-11,x+38,y-11,'#e5d5a055',2)}}
   for(const x of [5,584]){rect(x,98,10,500,'#46675d');line(x+2,100,x+2,599,'#d9d5ab88',2)}
  }else if(key==='dontHitMob'){
   rect(0,0,600,600,gradient(0,0,0,600,['#86a99b','#638b60','#477a53']));mountain(112,['#799d81','#567c63']);for(let x=0;x<600;x+=42){rect(x,38,13,68,'#c6bb91',3);poly([[x,38],[x+7,27],[x+13,38]],'#d6cca4')}rect(0,65,600,7,'#a49370');
   poly([[235,105],[364,105],[420,600],[177,600]],'#adab7570');for(let i=0;i<54;i++){let x=(i*131+17)%600,y=119+(i*67)%477;line(x,y,x-4,y-8,'#b4c08a55',2);line(x,y,x+5,y-10,'#3c704d77',2)}for(const [x,y] of [[22,154],[573,220],[36,398],[566,498]]){oval(x,y,13,6,'#54754d');for(let i=0;i<5;i++)oval(x+Math.cos(i*1.257)*6,y-11+Math.sin(i*1.257)*6,4,4,'#e8dca3');oval(x,y-11,3,3,'#bc9858')}
   rect(17,540,33,41,'#9e7651',5);oval(33,539,22,9,'#c09f73');line(549,522,566,585,'#d5c08f',5);oval(543,513,13,21,'#789590');
  }else if(key==='mobStop'){
   rect(0,0,600,600,gradient(0,0,0,600,['#749dab','#bbcfbc','#638789']));mountain(274,['#78979a','#527b83']);rect(0,350,600,250,gradient(0,350,0,600,['#80aaa2','#3b6e77']));for(let i=0;i<18;i++)line((i*83)%600,366+i*12,(i*83)%600+55,366+i*12,'#c7ddc43b',2);
   for(const x of [19,553]){rect(x,52,18,317,'#49626b');rect(x+2,55,4,310,'#aac1b2');for(let y=78;y<331;y+=48){line(x,y,x+18,y+36,'#a7bbad',3);line(x+18,y,x,y+36,'#203e4c',2)}}rect(15,55,561,18,'#4d6a70');line(30,72,540,72,'#c7c4a1',3);line(365,72,365,148,'#5b7274',3);panel(345,142,42,25,'#a9b7a3');
   poly([[0,493],[98,493],[122,600],[0,600]],'#506a70');poly([[478,493],[600,493],[600,600],[454,600]],'#506a70');for(let x=4;x<108;x+=27)line(x,508,x+15,545,'#e8c887',8);
  }else if(key==='overlap'||key==='overlapMaster'){
   const master=key==='overlapMaster';rect(0,0,600,600,gradient(0,0,0,600,master?['#262f4b','#50677b','#263d52']:['#264959','#689894','#345e67']));
   rect(55,62,490,474,gradient(0,62,0,536,master?['#d6e0d2','#f1f1de','#c3d5ca']:['#c9ded0','#eef2dd','#b8d3c6']),35);for(const x of [25,554]){panel(x,105,23,376,master?'#667988':'#759f94');for(let y=136;y<450;y+=38)rect(x+7,y,9,13,master?'#d8c7a1':'#c4e2ba',3)}
   for(let i=0;i<6;i++){line(85+i*85,78,85+i*85,509,'#e0e6c816');line(66,91+i*84,532,91+i*84,'#e0e6c81f')}for(const [x,y] of [[79,85],[522,85],[79,512],[522,512]]){line(x-9,y,x+9,y,'#d7dccb88',2);line(x,y-9,x,y+9,'#d7dccb88',2)}
   panel(128,15,344,31,master?'#405367':'#557b79');for(let i=0;i<(master?4:2);i++)rect(266+i*20-(master?15:0),25,10,8,['#d5cf9f','#a5d0c1','#b4bad7','#d5b8a1'][i],3);floor(552,'#355766','#182f41');
  }else if(key==='shutter'){
   rect(0,0,600,600,gradient(0,0,0,600,['#77999f','#d5d9bd','#a3b69d']));mountain(287,['#a9bcac','#82a194']);for(const [x,y,s] of [[27,300,1.4],[556,315,1.5],[79,287,.7],[510,294,.65]]){rect(x-7,y-255*s,14,315*s,'#536c63');for(let j=0;j<5;j++)oval(x-19+(j%2)*38,y-240*s+j*37,57*s,47*s,j%2?'#668f74':'#779c7d')}
   cloud(365,73,1.2,'#f3edcf55');poly([[228,281],[370,281],[518,600],[68,600]],'#d6c49b');for(let i=0;i<6;i++)line(180-i*12,357+i*40,425+i*11,357+i*40,'#b2a78077',2);glow(325,170,170,'#fff8ca22');
   for(const x of [25,520]){rect(x,452,61,8,'#6e6a51');rect(x+7,460,5,56,'#4f675d');rect(x+50,460,5,56,'#4f675d');line(x+5,434,x+57,434,'#927a52',12)}
  }else if(key==='darts'){
   rect(0,0,600,600,gradient(0,0,0,600,['#333646','#535b54','#263b40']));for(let x=0;x<600;x+=52){rect(x,0,48,600,'#92775822');line(x+48,0,x+48,600,'#101f2c66',3)}
   panel(35,52,418,422,'#425a55','#aa9167');ring(245,257,204,'#152e34',17);ring(245,257,208,'#c8b88f88',2);lamp(245,12,1.15);for(const x of [23,563]){panel(x,128,17,282,'#415955');for(let y=154;y<390;y+=28)rect(x+5,y,6,10,'#c5d2ac',2)}
   floor(514,'#766e53','#374a44');rect(465,451,102,9,'#b39a68',3);for(let i=0;i<3;i++){line(487+i*27,414,487+i*27,449,'#b3c5c0',3);poly([[480+i*27,416],[494+i*27,416],[487+i*27,431]],'#cab688')}
  }else if(key==='parachute'){
   rect(0,0,600,600,gradient(0,0,0,600,['#3f7997','#a6c8c4','#d8dcbb']));glow(467,68,100,'#fce9b233');oval(467,68,27,27,'#f4e8bb');cloud(110,105,1.5);cloud(486,265,1.2);cloud(115,410,1,'#ebefd36b');
   // Distant coast is not a landing guide; the real scrolling ground/target is untouched.
   poly([[0,541],[130,505],[198,554],[305,538],[366,586],[600,562],[600,600],[0,600]],'#91b2a455');line(0,552,119,521,'#dce5bd33',2);for(let i=0;i<5;i++)line(403+i*26,113+i*28,444+i*26,104+i*28,'#f4edd02e',1);
  }else if(key==='mobCount'){
   rect(0,0,600,600,gradient(0,0,0,600,['#c9c4a0','#ded5b1','#adc2a8']));for(let y=0;y<600;y+=82){line(0,y,600,y,'#829c8627',2);for(let x=(y%3)*25;x<600;x+=97)line(x,y,x,y+82,'#829c8620',2)}
   for(const x of [4,577]){rect(x,12,18,576,'#718d7a',6);for(let y=20;y<584;y+=38){oval(x+9,y,13,17,'#859e7e');oval(x+4,y-6,7,10,'#a7b390')}}rect(25,4,550,12,'#8c9c7b');rect(25,584,550,12,'#8c9c7b');
   for(const [x,y] of [[37,29],[561,29],[37,568],[561,568]]){oval(x,y,8,4,'#d9d4ae');line(x-5,y,x+5,y,'#647f6c',1)}
  }else if(key==='brake'){
   rect(0,0,600,600,gradient(0,0,0,600,['#708da5','#d8bd9b','#8d9b8c']));oval(470,85,34,34,'#f5deb1');mountain(310,['#929eaa','#778b94']);city(319,'#617d8599',true);railing(305,'#3f5a67');
   for(const x of [39,503]){rect(x,89,5,258,'#506772');line(x+2,91,x+62,76,'#506772',5);line(x+62,76,x+70,83,'#506772',5);rect(x+54,83,35,7,'#efdcb2',3);glow(x+68,96,70,'#ffe2ab22')}
   rect(0,403,600,197,'#41575e');for(let x=0;x<600;x+=85)rect(x,410,42,12,'#b6b9a277');
  }else if(key==='feint'){
   rect(0,0,600,600,gradient(0,0,0,600,['#243b4c','#789a95','#355565']));for(const x of [0,490]){rect(x,0,110,600,gradient(x,0,x+110,0,['#233849','#4b5767','#26394b']));for(let xx=x+12;xx<x+104;xx+=23)rect(xx,0,4,600,'#97a49622')}
   poly([[160,30],[190,30],[365,600],[67,600]],'#eee9b518');poly([[410,30],[442,30],[533,600],[246,600]],'#eee9b518');rect(35,121,530,300,gradient(0,121,0,421,['#d6dfc4','#aac7b3']),15);rect(43,129,514,284,'#dce5cd',10);for(let x=135;x<480;x+=35){oval(x,112,3,3,'#c5b992');oval(x,394,3,3,'#c5b992')}floor(474,'#837c66','#3a5052');lamp(179,33,.5);lamp(425,33,.5);
  }else if(key==='bomb'){
   rect(0,0,600,600,gradient(0,0,0,600,['#1f3643','#52676a','#243b46']));for(let y=0;y<600;y+=88)line(0,y,600,y,'#abc0b12b',2);for(const x of [36,557]){rect(x,0,12,600,'#82928a');line(x+3,0,x+3,600,'#c5c7a5',2)}panel(61,25,124,81,'#4d6868');for(let i=0;i<5;i++)rect(75+i*20,42,12,26,'#a7b9a288',2);for(let x=417;x<535;x+=29){rect(x,27,12,111,'#2a4653',5);rect(x+3,27,3,111,'#83a79c')}
   floor(453,'#66776d','#253d44');for(const y of [6,574]){rect(0,y,600,20,'#baaa77');for(let x=0;x<600;x+=44)poly([[x,y],[x+20,y],[x+36,y+20],[x+16,y+20]],'#384a48')}rect(128,467,344,42,'#233c4288',20);glow(310,199,196,'#c6dcc218');
  }else if(key==='jumpingMob'){
   rect(0,0,600,600,gradient(0,0,0,600,['#648ea3','#b3c9be','#d9d4b0']));cloud(372,101,1.3);cloud(74,249,1);mountain(412,['#a1b8ad','#829f96']);
   for(const [x,y,w,h] of [[26,238,44,362],[508,126,58,474],[100,394,42,206],[439,372,39,228]]){rect(x,y,w,h,'#7b939080',5);rect(x-5,y,w+10,13,'#a5b6a280',3);for(let yy=y+30;yy<600;yy+=45){rect(x+8,yy,w-16,20,'#52758044',4);line(x,yy+33,x+w,yy+33,'#c8cfb522')}}
   line(48,232,536,120,'#76959355',3);for(let i=0;i<8;i++){let x=65+i*60,y=228-i*14;line(x,y,x,y+11,'#819b8d77');poly([[x,y+9],[x+18,y+9],[x+8,y+27]],'#d4be9277')}
  }else if(key==='heroMaybe'){
   if(part==='wheel'){rect(0,0,600,600,gradient(0,0,0,600,['#8b8f7a','#bab68f','#6c8274']));for(let y=0;y<600;y+=89){line(0,y,600,y,'#52695b44',3);for(let x=(y%2)*60;x<600;x+=130)line(x,y,x,y+89,'#52695b33',2)}for(const [x,y] of [[26,36],[570,36],[26,565],[570,565]]){poly([[x,y-16],[x+14,y],[x,y+16],[x-14,y]],'#d5c49b77');ring(x,y,22,'#435e5799',2)}glow(300,280,285,'#f1e4b74a');}
   else{rect(0,0,600,600,gradient(0,0,0,600,['#a8b9a1','#d9d1ac','#769085']));mountain(348,['#91a799','#6a8b82']);for(const x of [42,494]){rect(x,144,65,383,'#7b8c81');rect(x-6,130,77,34,'#bdbe9d');for(let j=0;j<4;j++)rect(x-6+j*21,104,14,31,'#aeb398');for(let yy=201;yy<510;yy+=75)rect(x+19,yy,23,41,'#405e5b',9)}poly([[106,198],[496,198],[496,481],[106,481]],'#adb498');poly([[180,198],[300,64],[424,198]],'#587970');rect(218,241,170,274,'#466a60',55);rect(243,274,121,241,'#254d4b',45);floor(511,'#a6aa85','#5e7f70');line(166,200,166,381,'#4c6961',5);poly([[169,209],[203,209],[203,285],[186,303],[169,285]],'#b29b6e')}
  }else if(key==='popularGame'){
   rect(0,0,600,600,gradient(0,0,0,600,['#72a7b6','#c4d6ba','#8db183']));cloud(79,90,1);cloud(449,156,1.15);mountain(384,['#9bb6a0','#6d9a83']);for(const [x,y,s] of [[20,490,1.3],[578,479,1.7],[479,365,.6],[147,401,.7]])tree(x,y,s,'#4c7f6a');
   poly([[174,395],[302,310],[383,395]],'#86a693');rect(211,390,137,130,'#8ba990');rect(251,434,42,86,'#668a78',20);for(let x=200;x<367;x+=25)rect(x,384,12,18,'#acba92');glow(422,74,95,'#fff0bd2a');
  }else if(key==='planetEnergy'){
   rect(0,0,600,600,gradient(0,0,0,600,['#101e39','#2f4262','#677378']));stars();glow(431,144,141,'#9abdd02a');oval(448,141,58,58,'#97a8b177');oval(465,127,56,56,'#364d68');ring(448,141,70,'#d0d6bf22',2);city(450,'#354d6588',true);city(519,'#243c5199',true);rect(0,548,600,52,'#21384b');for(let i=0;i<18;i++)rect(i*35+7,554,2,10,'#b9dbd155');
   poly([[0,370],[600,287],[600,314],[0,399]],'#94c6c715');line(0,384,600,302,'#b8d8cb15',1);
  }else if(key==='painter'){
   rect(0,0,600,600,gradient(0,0,0,600,['#849e97','#d0c9a8','#a48965']));window(23,21,125,155);rect(17,181,143,10,'#b8a47c');wood(394,'#987753');
   rect(483,44,84,85,'#7a684e',5);rect(491,52,68,69,'#dacda9');poly([[496,106],[511,74],[532,97],[548,65],[554,112]],'#8fa18b');rect(22,224,24,302,'#7d6248',5);rect(556,224,24,302,'#7d6248',5);rect(17,516,568,25,'#c6a477',5);line(23,521,578,521,'#e4c491',2);
   oval(542,561,40,20,'#bfa274');for(const [x,y,col] of [[515,556,'#658b8b'],[537,549,'#a2544e'],[561,558,'#dbc073']])oval(x,y,8,6,col);rect(27,547,35,40,'#687f78',4);for(let i=0;i<4;i++){line(33+i*7,560,30+i*11,510,'#d6bb87',3);line(30+i*11,510,29+i*11,496,'#5e6552',5)}
  }
  const vignette=c.createRadialGradient(300,260,175,300,260,480);vignette.addColorStop(0,'#102b3700');vignette.addColorStop(1,'#102b372a');rect(0,0,600,600,vignette);c.restore();
 }
 function bitmap(key,w,h,part){const dpr=Math.min(1.5,devicePixelRatio||1),cw=Math.max(1,Math.min(1500,Math.round(w*dpr))),ch=Math.max(1,Math.min(1500,Math.round(h*dpr))),id=[key,cw,ch,part].join(':');if(cache.has(id))return cache.get(id);const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=ch;const t=performance.now();draw(canvas,key,part);const url=canvas.toDataURL('image/png');const ms=performance.now()-t;stats.renders++;stats.totalMs+=ms;stats.maxMs=Math.max(stats.maxMs,ms);if(cache.size>=48)cache.delete(cache.keys().next().value);cache.set(id,url);return url}
 function mount(){const screen=document.getElementById('screen');for(const [el,entry] of bound)if(!el.isConnected||!screen?.classList.contains('gameplay-fit')){entry.observer.disconnect();bound.delete(el)}if(!screen?.classList.contains('gameplay-fit'))return;for(const [key,selector] of Object.entries(targets))for(const el of screen.querySelectorAll(selector)){if(bound.has(el))continue;const part=el.id==='heroChoices'?'wheel':'stage';let size='';const paint=()=>{if(!el.isConnected)return;const w=el.clientWidth,h=el.clientHeight,id=w+':'+h;if(w<2||h<2||size===id)return;size=id;el.style.setProperty('--scenic-background',`url("${bitmap(key,w,h,part)}")`);el.dataset.scenic=key;};const observer=new ResizeObserver(paint);bound.set(el,{observer});observer.observe(el);paint()}}
 const root=document.getElementById('screen');if(root){new MutationObserver(mount).observe(root,{childList:true,attributes:true,attributeFilter:['class']});mount()}
 window.MobScenicCollection={draw,bitmap,targets,stats};
})();
