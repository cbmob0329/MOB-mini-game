/* Shared gameplay UI contract. Keep colour pairs together and finish layout before GO. */
(function(root){
  'use strict';
  function rgb(value){const m=value?.match(/^rgba?\(([^)]+)\)/);if(!m)return null;const n=m[1].split(/[, /]+/).map(Number);return n.length<4||n[3]>=.98?n.slice(0,3):null;}
  function luminance(c){return c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);}
  function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function readable(fg,bg){return ratio(fg,bg)>=4.5?null:ratio([23,31,43],bg)>=ratio([255,255,255],bg)?'#171f2b':'#ffffff';}
  function repair(screen){
    if(!screen)return;
    for(const el of screen.querySelectorAll('button,span,b,strong,small,label,p,h1,h2,h3,em,output,div')){
      if(!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
      const s=getComputedStyle(el),fg=rgb(s.color);if(!fg)continue;
      let node=el,bg=null;
      while(node&&node!==document.body){const c=getComputedStyle(node);if(c.backgroundImage!=='none')break;bg=rgb(c.backgroundColor);if(bg)break;node=node.parentElement;}
      if(!bg)continue;const color=readable(fg,bg);if(color){el.style.setProperty('color',color,'important');el.style.setProperty('text-shadow','none','important');}
    }
  }
  // Fixed-coordinate worlds use the same scale for rendering and camera limits.
  function worldCamera({worldWidth,worldHeight,viewportWidth,viewportHeight,focusY,anchor=.42}){
    const scale=Math.max(.01,viewportWidth/worldWidth),viewHeight=viewportHeight/scale;
    return {scale,viewHeight,y:Math.max(0,Math.min(Math.max(0,worldHeight-viewHeight),focusY-viewHeight*anchor))};
  }
  root.MobPartyLayout={repair,readable,ratio,worldCamera};
  if(typeof module!=='undefined')module.exports=root.MobPartyLayout;
  if(typeof document==='undefined')return;
  const screen=document.getElementById('screen');let pending=false;
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;repair(screen);});};
  // Observe structural changes, not per-frame position/score updates.
  new MutationObserver(changes=>{if(changes.some(c=>Array.from(c.addedNodes).some(n=>n.nodeType===1)))schedule();}).observe(screen,{childList:true,subtree:true});
})(typeof window==='undefined'?globalThis:window);
