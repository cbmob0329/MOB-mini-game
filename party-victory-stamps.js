/* Small cached vector toys: embossed lettering, extrusion and glossy highlights. */
(()=>{'use strict';const labels={mobCrane:'MOBクレーン',mobDora:'MOBどら焼き',mobPad:'コントローラー',mobChoco:'チョコレート',mobHeart:'ハート',mobCrown:'王冠',mobBalloons:'MOBバルーン',mobKnit:'MOB猫耳ニット'};const cache=new Map();
function paint(c,id){
 const path=(pts)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()},oval=(x,y,rx,ry)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2)},box=(x,y,w,h,r=12)=>{c.beginPath();c.roundRect(x,y,w,h,r)},g=(top,bottom)=>{const a=c.createLinearGradient(15,10,160,180);a.addColorStop(0,top);a.addColorStop(1,bottom);return a};
 function toy(p,top,bottom,depth='#243346'){c.save();c.translate(0,6);p();c.fillStyle=depth;c.strokeStyle='#17263a';c.lineWidth=6;c.lineJoin='round';c.stroke();c.fill();c.restore();p();c.fillStyle=g(top,bottom);c.strokeStyle='#283343';c.lineWidth=4;c.stroke();c.fill()}
 function line(x,y,x2,y2,color,width=4){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
 function text(s,x,y,size=25,color='#fff5cc'){c.font=`900 ${size}px sans-serif`;c.textAlign='center';c.fillStyle='#231b3466';c.fillText(s,x,y+2);c.fillStyle=color;c.fillText(s,x,y)}
 function shine(p){p();c.fillStyle='#ffffff80';c.fill()}
 c.save();c.shadowColor='#15233c55';c.shadowBlur=8;c.shadowOffsetY=8;oval(100,177,69,10);c.fillStyle='#17263622';c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
 if(id==='mobCrane'){
  toy(()=>box(30,17,140,42,14),'#a8f5ff','#359eb7','#1d6782');text('MOB',100,47,29);line(100,64,100,108,'#39465e',13);line(97,66,97,106,'#d8e9f1',5);toy(()=>oval(100,108,20,16),'#f6efff','#aca0d4');for(const sign of [-1,1]){line(100+sign*12,119,100+sign*43,143,'#29354a',12);line(100+sign*43,143,100+sign*25,164,'#29354a',12);line(100+sign*12,116,100+sign*43,140,'#f3d895',7);line(100+sign*43,140,100+sign*25,161,'#ddb96b',7)}line(100,120,100,150,'#d5ddea',7);line(100,150,110,159,'#d5ddea',7);shine(()=>box(42,24,96,6,3));
 }else if(id==='mobDora'){
  toy(()=>oval(100,124,76,41),'#fbc475','#a36530','#664329');toy(()=>oval(100,109,72,31),'#674531','#352534','#282332');toy(()=>oval(100,88,79,49),'#ffe3a1','#bc7338','#81512e');c.save();c.translate(100,92);c.rotate(-.12);c.strokeStyle='#9b572d';c.lineWidth=2;box(-42,-26,84,39,9);c.stroke();text('MOB',0,2,30,'#96502b');c.restore();shine(()=>{c.beginPath();c.ellipse(66,59,27,6,-.3,0,Math.PI*2)});for(let i=0;i<13;i++){oval(37+i*10,91+(i%3)*9,1.3,1.3);c.fillStyle='#a76a3766';c.fill()}
 }else if(id==='mobPad'){
  const pad=()=>{c.beginPath();c.moveTo(59,61);c.bezierCurveTo(30,52,22,74,15,129);c.bezierCurveTo(9,172,40,173,65,137);c.lineTo(135,137);c.bezierCurveTo(161,173,191,172,185,128);c.bezierCurveTo(176,73,173,54,143,61);c.closePath()};toy(pad,'#efdcff','#8b77bc','#57436f');toy(()=>box(40,82,34,12,3),'#647389','#28344a');toy(()=>box(51,71,12,34,3),'#647389','#28344a');for(const [x,y,col] of [[145,80,'#f991ae'],[161,96,'#8de4ce'],[129,96,'#ffc86d'],[145,112,'#a7c6ff']])toy(()=>oval(x,y,6,6),'#fff7ee',col);for(const x of [78,119])toy(()=>oval(x,124,12,12),'#667289','#27334a');shine(()=>box(75,69,46,5,3));text('MOB',99,99,11,'#564776');
 }else if(id==='mobChoco'){
  c.save();c.translate(100,100);c.rotate(-.16);c.translate(-100,-100);toy(()=>box(47,20,108,156,14),'#9e6348','#4c2f34','#342435');for(let j=0;j<3;j++)for(let i=0;i<2;i++){toy(()=>box(56+i*47,30+j*42,39,33,5),'#c88e60','#70442f','#573137');shine(()=>box(60+i*47,34+j*42,26,3,2))}toy(()=>{path([[42,127],[158,127],[162,177],[38,177]])},'#bbeaff','#5d8fc2','#446183');path([[44,126],[55,119],[66,126],[77,119],[88,126],[99,119],[110,126],[121,119],[132,126],[143,119],[155,126]]);c.fillStyle='#f4e0bd';c.fill();text('MOB',100,159,26);c.restore();
 }else if(id==='mobHeart'){
  const heart=()=>{c.beginPath();c.moveTo(100,169);c.bezierCurveTo(-12,96,21,4,100,57);c.bezierCurveTo(179,4,212,96,100,169);c.closePath()};toy(heart,'#ffb5d6','#d72b66','#8d275d');shine(()=>{c.beginPath();c.ellipse(59,69,21,10,-.65,0,Math.PI*2)});line(147,117,128,139,'#ff83a2',5);
 }else if(id==='mobCrown'){
  toy(()=>path([[31,131],[19,61],[60,91],[100,27],[139,91],[181,61],[169,131]]),'#fff2a2','#dea43f','#906539');toy(()=>box(31,126,138,33,9),'#ffe29a','#d39032','#8d5b32');for(const [x,y] of [[20,58],[100,27],[180,58]])toy(()=>oval(x,y,9,9),'#fff8d4','#e4ae45');toy(()=>path([[100,119],[111,139],[100,151],[89,139]]),'#aff8f3','#379cb4');for(const x of [57,143])toy(()=>oval(x,141,6,7),'#ffe9f2','#d8698b');line(42,131,80,131,'#fff8c4',4);
 }else if(id==='mobBalloons'){
  for(const [i,ch] of [...'MOB'].entries()){const x=48+i*53,y=97+(i===1?-15:0);line(x,y+30,100+(i-1)*5,174,'#dbe8f8',2);c.save();c.translate(x,y);c.rotate((i-1)*.13);c.font='1000 70px sans-serif';c.textAlign='center';c.lineJoin='round';c.lineWidth=8;c.strokeStyle='#4d3a65';c.strokeText(ch,0,6);c.fillStyle=['#ac456f','#288995','#7654a3'][i];c.fillText(ch,0,6);c.fillStyle=g(['#ffd5e8','#b8fff7','#e9d7ff'][i],['#ef70a8','#51c2c8','#a980da'][i]);c.fillText(ch,0,0);line(-12,-42,-3,-46,'#ffffffb0',4);path([[-4,12],[4,12],[0,19]]);c.fillStyle='#fff0e1';c.fill();c.restore()}
 }else if(id==='mobKnit'){
  const cap=()=>{c.beginPath();c.moveTo(30,139);c.lineTo(32,36);c.quadraticCurveTo(36,24,64,59);c.quadraticCurveTo(100,42,137,59);c.quadraticCurveTo(163,22,170,35);c.lineTo(174,139);c.closePath()};toy(cap,'#f1c6ef','#9b6eab','#604866');c.save();cap();c.clip();for(let y=57;y<139;y+=9)for(let x=34;x<171;x+=10){line(x,y,x+4,y+4,'#e1afdc',1.7);line(x+4,y+4,x+8,y,'#85558e88',1.5)}c.restore();toy(()=>box(26,127,152,38,10),'#e2b3df','#a170ac','#654568');for(let x=35;x<174;x+=7)line(x,135,x,157,'#81518955',2);toy(()=>box(73,133,59,24,5),'#fff0cc','#d5b88b');text('MOB',102,150,16,'#5e4365');shine(()=>box(40,129,32,4,2));
 }
 c.restore();
}
function image(id){if(!labels[id])return null;if(!cache.has(id)){const c=document.createElement('canvas');c.width=c.height=400;const ctx=c.getContext('2d');ctx.scale(2,2);paint(ctx,id);cache.set(id,c)}return cache.get(id)}
function draw(c,id,x,y,size){const img=image(id);if(!img)return false;c.drawImage(img,x-size/2,y-size/2,size,size);return true}
window.MobVictoryStamps={labels,draw,image,paint};
})();
