(function(root){'use strict';const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function clothCap(speed,dx,dy){return Math.round(clamp(100-45*clamp((1200-speed)/700)-20*clamp(Math.abs(dx)/Math.max(dy,125)/.25)-15*clamp((210-dy)/110),0,100));}
function wallTotal(clears,precisionSum){if(clears<=0)return 0;const n=Math.min(6,clears),quality=clamp((precisionSum-23*n)/(2*n));return Math.round(n/6*(95+5*quality));}
function cutPoints(error){return Math.round(clamp(100-Math.abs(error)*8,0,100));}
// Keep the stored 0..9999 timing record compatible with existing results.
function bombPoints(record){return Math.round(100*Math.pow(clamp(record/10000),1.2));}
function spherePoints(kos,othersOut,seconds,timeout=false){return Math.min(95,timeout?65+kos*15:15+kos*20+othersOut*15+Math.floor(seconds/2));}
function cardEvent(random=Math.random){const roll=random();return roll<.10?'extra':roll<.30?'mob':roll<.60?'premium':null;}
function curlStep(stones,dt,width,height){
 for(const a of stones){a.x+=a.vx*dt;a.y+=a.vy*dt;const speed=Math.hypot(a.vx,a.vy),decay=Math.max(0,speed-100*dt)/Math.max(1,speed);a.vx*=decay;a.vy*=decay;for(const axis of ['x','y']){const bound=axis==='x'?width:height;if(a[axis]<16||a[axis]>bound-16){a[axis]=Math.max(16,Math.min(bound-16,a[axis]));a['v'+axis]*=-.6;}}}
 for(let i=0;i<stones.length;i++)for(let j=i+1;j<stones.length;j++){const a=stones[i],b=stones[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>=32)continue;const nx=d?dx/d:1,ny=d?dy/d:0,push=(32-d)/2;a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push;const v=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(v>0){const impulse=v*.9;a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny;}}
 }
const api={cardEvent,curlStep,clothCap,wallTotal,cutPoints,bombPoints,spherePoints};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobGameBalance=api;})(typeof window!=='undefined'?window:null);
