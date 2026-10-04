(function(root){'use strict';const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function clothCap(speed,dx,dy){return Math.round(clamp(100-45*clamp((1200-speed)/700)-20*clamp(Math.abs(dx)/Math.max(dy,125)/.25)-15*clamp((210-dy)/110),0,100));}
function wallTotal(clears,precisionSum){if(clears<=0)return 0;const n=Math.min(4,clears),q=clamp((precisionSum-23*n)/(2*n));return Math.round([0,50,75,90,98][n]+[0,15,14,7,2][n]*q);}
const api={clothCap,wallTotal};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.MobGameBalance=api;})(typeof window!=='undefined'?window:null);
