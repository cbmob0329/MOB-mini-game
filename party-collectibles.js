/* Local-only canvas keeps exported cards and wallpapers independent of services. */
(()=>{
  'use strict';
  const date=()=>new Date().toLocaleDateString('ja-JP');
  const load=src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});
  function text(ctx,value,x,y,size=32,color='#20243b',align='center'){ctx.fillStyle=color;ctx.font=`900 ${size}px sans-serif`;ctx.textAlign=align;ctx.fillText(String(value),x,y);}
  function contain(ctx,img,x,y,w,h){if(!img)return;const scale=Math.min(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*scale)/2,y+h-img.height*scale,img.width*scale,img.height*scale);}
  async function card(canvas,entry){
    canvas.width=1260;canvas.height=1760;const c=canvas.getContext('2d');c.scale(1260/900,1760/1260);c.fillStyle='#fff';c.fillRect(0,0,900,1260);
    const color=({MOB:'#b68412',UR:'#8c4dd4',SSR:'#2b68c3',SR:'#228576',R:'#647083',MVP:'#b68412'})[entry.rank]||'#647083';
    c.strokeStyle=color;c.lineWidth=18;c.strokeRect(30,30,840,1200);c.lineWidth=3;c.strokeRect(52,52,796,1156);
    text(c,entry.rank,450,143,76,color);text(c,entry.title||'MOB GAME KING',450,205,33);text(c,entry.playerName||entry.name||'PLAYER',450,278,39);
    c.fillStyle='#f1f3f8';c.fillRect(95,310,710,555);const img=await load(entry.img);contain(c,img,140,340,620,500);
    text(c,entry.characterName||entry.name,450,926,34);text(c,`${entry.total} POINTS`,450,1008,55,color);text(c,`PERFECT × ${entry.perfect||0}`,450,1065,30);text(c,entry.date||date(),450,1148,30);
    canvas.setAttribute('aria-label',`${entry.rank} ${entry.playerName||entry.name} ${entry.total}点`);return canvas;
  }
  async function save(canvas,name,pixelsPerMeter=canvas.width===1260&&canvas.height===1760?20000:null){
    let blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG export failed')),'image/png'));
    if(pixelsPerMeter){
      const bytes=new Uint8Array(await blob.arrayBuffer()),chunk=new Uint8Array(21),view=new DataView(chunk.buffer);view.setUint32(0,9);chunk.set([112,72,89,115],4);view.setUint32(8,pixelsPerMeter);view.setUint32(12,pixelsPerMeter);chunk[16]=1;
      let crc=0xffffffff;for(const byte of chunk.slice(4,17)){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}view.setUint32(17,(crc^0xffffffff)>>>0);
      // Replace the browser's default 96-dpi pHYs chunk with physical card dimensions.
      const parts=[bytes.slice(0,33),chunk];for(let offset=33;offset<bytes.length;){const length=new DataView(bytes.buffer).getUint32(offset),end=offset+length+12,type=String.fromCharCode(...bytes.slice(offset+4,offset+8));if(type!=='pHYs')parts.push(bytes.slice(offset,end));offset=end;}blob=new Blob(parts,{type:'image/png'});
    }
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.download=name+'.png';link.href=url;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  function wallpaper(options){return window.MobChampionStudio.open(options);}
  window.MobCollectibles={card,save,wallpaper,date};
})();
