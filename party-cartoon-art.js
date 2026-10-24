/* Resolution-independent original cartoon artwork for every victory studio. */
(()=>{'use strict';
const themes={cute:['#fff6cb','#afeade','#25384a'],cool:['#a9e9ff','#ada9fa','#222c4c'],music:['#d7c9ff','#ffbfdf','#39234f'],pink:['#ffe4ed','#ffadd1','#702747'],angel:['#f3fbff','#bce9ff','#24476a'],paw:['#fff0d8','#edc8a4','#573626']};
const labels={cute:'ポップ・キャンディ',cool:'コミック・ヒーロー',music:'MOBミュージック',pink:'ピンク・リボン',angel:'天使の雲の国',paw:'にくきゅうパレード'};
const stamps={toonPaw:'ぷにぷに肉球',toonWings:'天使の羽',toonNote:'音符',toonHeadphones:'ヘッドホン',toonCloud:'にこにこ雲',toonBow:'リボン',toonCandy:'キャンディ',toonSpark:'キラキラ',toonFlower:'お花',toonPlanet:'惑星',toonWow:'WOW!吹き出し',toonCat:'ねこフェイス'};
const frames={comic:'コミックコマ枠',scallop:'もこもこ枠',ribbon:'リボン枠',wings:'天使の羽枠',paws:'肉球スタンプ枠',equalizer:'音楽イコライザー枠'};
function stamp(c,id,x,y,size){if(!stamps[id])return false;c.save();c.translate(x,y);c.scale(size/200,size/200);c.lineWidth=5;c.lineJoin=c.lineCap='round';c.strokeStyle='#283348';
const shape=(color,fn)=>{c.beginPath();fn();c.fillStyle=color;c.fill();c.stroke()},ellipse=(x,y,rx,ry,col)=>shape(col,()=>c.ellipse(x,y,rx,ry,0,0,Math.PI*2)),line=(x,y,a,b)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke()},box=(x,y,w,h,col)=>shape(col,()=>c.roundRect(x,y,w,h,12));
if(id==='toonPaw'){ellipse(0,27,48,38,'#ff9dbd');[[-53,-18],[-21,-48],[22,-48],[54,-18]].forEach(([x,y])=>ellipse(x,y,18,24,'#ffbdd3'));}
if(id==='toonWings'){for(const sign of [-1,1]){c.save();c.scale(sign,1);shape('#fff',()=>{c.moveTo(0,38);c.bezierCurveTo(28,-52,62,-20,85,-72);c.bezierCurveTo(100,3,76,59,0,38)});for(let i=0;i<3;i++)line(24+i*14,20-i*10,56+i*8,3-i*14);c.restore()}c.strokeStyle='#c58c13';c.lineWidth=8;c.beginPath();c.ellipse(0,-66,28,9,0,0,Math.PI*2);c.stroke();}
if(id==='toonNote'){c.lineWidth=13;line(-30,35,-30,-50);line(-30,-50,48,-65);line(48,-65,48,22);ellipse(-47,41,25,17,'#ed81bd');ellipse(31,28,25,17,'#9de4e6');}
if(id==='toonHeadphones'){c.lineWidth=18;c.beginPath();c.arc(0,0,62,Math.PI,Math.PI*2);c.stroke();box(-77,-10,35,65,'#a8f2ed');box(42,-10,35,65,'#ffb2d6');}
if(id==='toonCloud'){shape('#fff',()=>{c.moveTo(-65,45);c.bezierCurveTo(-115,10,-64,-35,-39,-18);c.bezierCurveTo(-40,-76,41,-79,47,-19);c.bezierCurveTo(99,-40,112,41,65,45);c.closePath()});ellipse(-23,9,4,6,'#283348');ellipse(23,9,4,6,'#283348');c.beginPath();c.arc(0,17,13,0,Math.PI);c.stroke();}
if(id==='toonBow'||id==='toonCandy'){shape('#ff99be',()=>{c.moveTo(0,0);c.lineTo(-76,-43);c.quadraticCurveTo(-91,0,-76,43);c.closePath()});shape('#ffb6d5',()=>{c.moveTo(0,0);c.lineTo(76,-43);c.quadraticCurveTo(91,0,76,43);c.closePath()});ellipse(0,0,id==='toonCandy'?41:20,id==='toonCandy'?41:26,'#fff0a5');}
if(id==='toonSpark'){shape('#ffe786',()=>{for(let i=0;i<8;i++){let a=i*Math.PI/4,r=i%2?20:78;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(r,0)}c.closePath()});}
if(id==='toonFlower'){for(let i=0;i<6;i++){let a=i*Math.PI/3;ellipse(Math.cos(a)*43,Math.sin(a)*43,26,26,'#ffa8cf')}ellipse(0,0,25,25,'#fff18c');ellipse(-8,-3,3,4,'#283348');ellipse(8,-3,3,4,'#283348');}
if(id==='toonPlanet'){ellipse(0,0,51,51,'#b8abff');c.save();c.rotate(-.4);c.lineWidth=12;c.strokeStyle='#ffe49b';c.beginPath();c.ellipse(0,0,85,22,0,0,Math.PI*2);c.stroke();c.restore();ellipse(-19,-23,10,7,'#e9e1ff');}
if(id==='toonWow'){shape('#fff294',()=>{c.roundRect(-85,-53,170,98,24);c.moveTo(-30,45);c.lineTo(-43,77);c.lineTo(0,45)});c.font='900 47px sans-serif';c.textAlign='center';c.fillStyle='#283348';c.fillText('WOW!',0,12);}
if(id==='toonCat'){shape('#ffe0b6',()=>{c.moveTo(-60,28);c.lineTo(-62,-62);c.lineTo(-23,-35);c.quadraticCurveTo(0,-45,23,-35);c.lineTo(62,-62);c.lineTo(60,28);c.bezierCurveTo(50,78,-50,78,-60,28)});ellipse(-22,6,4,6,'#283348');ellipse(22,6,4,6,'#283348');ellipse(0,24,7,5,'#ff97b9');line(-45,24,-76,17);line(45,24,76,17);}
c.restore();return true;}
function background(c,key,W,H){if(!themes[key])return;c.save();const [a,b,ink]=themes[key];c.fillStyle=a;c.fillRect(0,0,W,H);c.fillStyle=b;
if(key==='cool'){for(let i=0;i<18;i++){let angle=i*Math.PI/9;c.beginPath();c.moveTo(W/2,H*.5);c.lineTo(W/2+Math.cos(angle)*H,H*.5+Math.sin(angle)*H);c.lineTo(W/2+Math.cos(angle+.12)*H,H*.5+Math.sin(angle+.12)*H);c.fill();}}
else for(let y=25;y<H;y+=90)for(let x=25;x<W;x+=90){c.beginPath();c.arc(x+(Math.floor(y/90)%2)*45,y,7,0,7);c.fill();}
const ids={cute:['toonCandy','toonFlower','toonSpark'],cool:['toonWow','toonPlanet','toonSpark'],music:['toonHeadphones','toonNote','toonSpark'],pink:['toonBow','toonFlower','toonCandy'],angel:['toonWings','toonCloud','toonSpark'],paw:['toonPaw','toonCat','toonPaw']}[key];
for(let i=0;i<10;i++){const side=i%2,x=side?W-100:100,y=140+Math.floor(i/2)*(H-280)/4;c.save();c.translate(x,y);c.rotate((side?1:-1)*.16);stamp(c,ids[i%3],0,0,110);c.restore();}
// Pale die-cut stage keeps the central portraits readable against the artwork.
c.fillStyle='#ffffffbb';c.strokeStyle=ink;c.lineWidth=7;c.beginPath();c.roundRect(125,H*.28,W-250,H*.49,85);c.fill();c.stroke();c.restore();}
function frame(c,key,W,H,accent){if(!frames[key])return false;c.save();c.strokeStyle='#293247';c.fillStyle=accent;c.lineJoin='round';c.lineWidth=12;
if(key==='comic'){c.strokeRect(25,25,W-50,H-50);for(const y of [H*.16,H*.84]){c.beginPath();c.moveTo(25,y);c.lineTo(110,y+25);c.stroke();c.beginPath();c.moveTo(W-25,y);c.lineTo(W-110,y-25);c.stroke();}}
else if(key==='scallop'){c.lineWidth=5;for(const x of [26,W-26])for(let y=35;y<H;y+=48){c.beginPath();c.arc(x,y,23,0,7);c.fill();c.stroke()}for(const y of [26,H-26])for(let x=35;x<W;x+=48){c.beginPath();c.arc(x,y,23,0,7);c.fill();c.stroke()}}
else {c.lineWidth=7;c.beginPath();c.roundRect(28,28,W-56,H-56,36);c.stroke();const id={ribbon:'toonBow',wings:'toonWings',paws:'toonPaw',equalizer:'toonNote'}[key];for(const x of [68,W-68])for(const y of [75,H-75])stamp(c,id,x,y,110);if(key==='equalizer')for(let i=0;i<17;i++){c.fillStyle=['#c6a1ff','#ff9ecb','#9ce9db'][i%3];const h=20+(i*37)%65;c.fillRect(145+i*42,H-40-h,26,h)}}c.restore();return true;}
window.MobCartoonArt={themes,labels,stamps,frames,stamp,background,frame};})();
