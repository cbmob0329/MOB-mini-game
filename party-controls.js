(()=>{
  'use strict';
  window.MobPartyControls={stick(pad,held,enabled){
    if(!pad)return ()=>{};
    const controller=new AbortController(),signal=controller.signal;
    pad.className='party-stick';pad.tabIndex=0;pad.setAttribute('role','group');
    pad.setAttribute('aria-label','移動スティック。ドラッグ、または矢印キーで操作');
    pad.innerHTML='<span class="party-stick-cross" aria-hidden="true"></span><i aria-hidden="true"></i><small>MOVE</small>';
    const knob=pad.querySelector('i');let pointer=null;
    const originalClear=held.clear.bind(held);
    const set=(x,y)=>{if(!enabled()){x=0;y=0;}const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}held.axisX=x;held.axisY=y;originalClear();if(x<-.12)held.add('L');if(x>.12)held.add('R');if(y<-.12)held.add('U');if(y>.12)held.add('D');knob.style.transform=`translate(${x*37}px,${y*37}px)`;};
    const reset=()=>{pointer=null;set(0,0);};
    held.clear=()=>set(0,0);held.axisX=held.axisY=0;
    const move=e=>{const r=pad.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width*.32),y=(e.clientY-r.top-r.height/2)/(r.height*.32);const length=Math.hypot(x,y);if(length<.12){x=y=0;}else if(length>1){x/=length;y/=length;}set(x,y);};
    pad.addEventListener('pointerdown',e=>{if(pointer!==null||!enabled())return;e.preventDefault();pointer=e.pointerId;pad.setPointerCapture(pointer);move(e);},{signal});
    pad.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;e.preventDefault();move(e);},{signal});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,e=>{if(pointer===e.pointerId)reset();},{signal});
    const keys=new Set();
    const keySet=()=>set((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0),(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0));
    pad.addEventListener('keydown',e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();keys.add(e.key);keySet();},{signal});
    pad.addEventListener('keyup',e=>{keys.delete(e.key);keySet();},{signal});
    const blur=()=>{keys.clear();reset();};
    pad.addEventListener('blur',blur,{signal});window.addEventListener('blur',blur,{signal});
    document.addEventListener('visibilitychange',blur,{signal});
    return ()=>{blur();controller.abort();};
  }};
})();
