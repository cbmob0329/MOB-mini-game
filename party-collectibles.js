/* Local-only canvas keeps exported cards and wallpapers independent of services. */
(()=>{
  'use strict';
  const date=()=>new Date().toLocaleDateString('ja-JP');
  const load=src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});
  function text(ctx,value,x,y,size=32,color='#20243b',align='center'){ctx.fillStyle=color;ctx.font=`900 ${size}px sans-serif`;ctx.textAlign=align;ctx.fillText(String(value),x,y);}
  function contain(ctx,img,x,y,w,h){if(!img)return;const scale=Math.min(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*scale)/2,y+h-img.height*scale,img.width*scale,img.height*scale);}
  async function card(canvas,entry){
    canvas.width=900;canvas.height=1260;const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,900,1260);
    const color=({MOB:'#b68412',UR:'#8c4dd4',SSR:'#2b68c3',SR:'#228576',R:'#647083',MVP:'#b68412'})[entry.rank]||'#647083';
    c.strokeStyle=color;c.lineWidth=18;c.strokeRect(30,30,840,1200);c.lineWidth=3;c.strokeRect(52,52,796,1156);
    text(c,entry.rank,450,143,76,color);text(c,entry.title||'MOB GAME KING',450,205,33);text(c,entry.playerName||entry.name||'PLAYER',450,278,39);
    c.fillStyle='#f1f3f8';c.fillRect(95,310,710,555);const img=await load(entry.img);contain(c,img,140,340,620,500);
    text(c,entry.characterName||entry.name,450,926,34);text(c,`${entry.total} POINTS`,450,1008,55,color);text(c,`PERFECT × ${entry.perfect||0}`,450,1065,30);text(c,entry.date||date(),450,1148,30);
    canvas.setAttribute('aria-label',`${entry.rank} ${entry.playerName||entry.name} ${entry.total}点`);return canvas;
  }
  function save(canvas,name){const link=document.createElement('a');link.download=name+'.png';link.href=canvas.toDataURL('image/png');link.click();}
  function wallpaper({screen,esc,members,teamName,done}){
    let revision=0;const settings={background:'night',frame:'gold',stamp:'crown',effect:'stars'},day=date();
    const options={background:[['night','夜空'],['sky','青空'],['sunset','夕焼け'],['white','ホワイト']],frame:[['gold','ゴールド'],['silver','シルバー'],['neon','ネオン'],['none','なし']],stamp:[['crown','王冠'],['star','スター'],['heart','ハート'],['none','なし']],effect:[['stars','きらめき'],['rays','放射光'],['confetti','紙吹雪'],['none','なし']]};
    screen.innerHTML=`<section class="party-wallpaper"><header><small>CHAMPIONS STUDIO</small><h1>優勝記念の壁紙を作ろう</h1><p>キャラクターは中央、日付は足元に固定。好きなデザインで仕上げよう。</p></header><div class="wallpaper-workspace"><canvas id="wallpaperCanvas" role="img" aria-label="優勝記念壁紙プレビュー"></canvas><div class="wallpaper-tools">${Object.entries(options).map(([key,values],i)=>`<label>${['背景','枠','スタンプ','エフェクト'][i]}<select data-wall="${key}">${values.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>`).join('')}<button id="wallpaperSave" class="primary" disabled>画像を保存する</button><p id="wallpaperStatus" role="status">画像を準備しています…</p><button id="wallpaperDone" class="secondary">完了して進む</button></div></div></section>`;
    const canvas=screen.querySelector('#wallpaperCanvas'),button=screen.querySelector('#wallpaperSave'),status=screen.querySelector('#wallpaperStatus');
    const assets=Promise.all(members.map(p=>load(p.img)));
    async function render(){const own=++revision;button.disabled=true;const images=await assets;if(own!==revision||!canvas.isConnected)return;canvas.width=1080;canvas.height=1920;const c=canvas.getContext('2d'),colors={night:['#11182d','#40326c'],sky:['#bee8ff','#5a9fd0'],sunset:['#ffc67a','#b8557f'],white:['#fff','#edf1fa']}[settings.background],dark=['night','sunset'].includes(settings.background),ink=dark?'#fff7d5':'#243454';
      const g=c.createLinearGradient(0,0,0,1920);g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);c.fillStyle=g;c.fillRect(0,0,1080,1920);
      if(settings.effect==='rays'){c.save();c.translate(540,940);for(let i=0;i<18;i++){c.rotate(Math.PI/9);c.fillStyle='#ffffff14';c.beginPath();c.moveTo(0,0);c.lineTo(-110,-2000);c.lineTo(110,-2000);c.fill();}c.restore();}
      if(['stars','confetti'].includes(settings.effect))for(let i=0;i<85;i++){const x=(i*233+71)%1080,y=(i*389+31)%1920;if(x>130&&x<950&&y>520&&y<1280)continue;if(settings.effect==='stars')text(c,'✦',x,y,12+i%18,ink);else{c.fillStyle=['#ffe88a','#aaffda','#ffa7db'][i%3];c.fillRect(x,y,8+i%8,18);}}
      if(settings.frame!=='none'){c.strokeStyle=({gold:'#efd47e',silver:'#d7e6f0',neon:'#8bf8ef'})[settings.frame];c.lineWidth=18;c.strokeRect(35,35,1010,1850);c.lineWidth=4;c.strokeRect(58,58,964,1804);}
      text(c,'TAG BATTLE LEAGUE',540,205,38,ink);text(c,'CHAMPIONS',540,320,78,ink);text(c,teamName,540,409,44,ink);
      images.forEach((img,i)=>contain(c,img,members.length===1?190:90+i*460,580,members.length===1?700:440,650));
      text(c,day,540,1300,42,ink);text(c,'TOGETHER, WE ARE THE CHAMPIONS.',540,1465,28,ink);
      members.forEach((p,i)=>text(c,p.name,540,1540+i*52,30,ink));const stamp=({crown:'♛',star:'★',heart:'♥',none:''})[settings.stamp];text(c,stamp,540,1740,115,ink);
      button.disabled=images.some(img=>!img);status.textContent=images.some(img=>!img)?'キャラクター画像を読み込めません。再度開いてください。':'プレビューと同じ1080×1920のPNGを保存できます。';
    }
    screen.querySelectorAll('[data-wall]').forEach(el=>el.onchange=()=>{settings[el.dataset.wall]=el.value;render();});button.onclick=()=>{save(canvas,'MOB-CHAMPIONS-'+day.replaceAll('/','-'));status.textContent='保存を開始しました。画像が開いた場合は長押しで保存できます。';};screen.querySelector('#wallpaperDone').onclick=()=>{revision++;done();};render();
  }
  window.MobCollectibles={card,save,wallpaper,date};
})();
