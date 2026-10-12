(function(root){'use strict';const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function clothCap(speed,dx,dy){return Math.round(clamp(100-45*clamp((1200-speed)/700)-20*clamp(Math.abs(dx)/Math.max(dy,125)/.25)-15*clamp((210-dy)/110),0,100));}
function wallTotal(clears,precisionSum){if(clears<=0)return 0;const n=Math.min(6,clears),quality=clamp((precisionSum-23*n)/(2*n));return Math.round(n/6*(95+5*quality));}
function cutPoints(error){return Math.round(clamp(100-Math.abs(error)*8,0,100));}
// Keep the stored 0..9999 timing record compatible with existing results.
function bombPoints(record){return Math.round(100*Math.pow(clamp(record/10000),1.2));}
const api={clothCap,wallTotal,cutPoints,bombPoints};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobGameBalance=api;})(typeof window!=='undefined'?window:null);
