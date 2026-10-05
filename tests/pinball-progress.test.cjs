const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('random pinball boards drain through real slots, including former fan traps at 30/60/120Hz',()=>{
const source=fs.readFileSync(require.resolve('../game.js'),'utf8').split('async function startMobPinball(')[1],setup=source.slice(source.indexOf('  const BASE_VALUES'),source.indexOf('  screen.innerHTML')),physics=source.slice(source.indexOf('  function physics(dt)'),source.indexOf("  dropBtn.addEventListener('pointerdown'"));
for(const dt of [1/120,1/60,.032])for(let seed=1;seed<=100;seed++){
let n=seed;const random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296),math=Object.create(Math);math.random=random;
const context={Math:math,rand:(a,b)=>a+(b-a)*random(),clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),shuffle:a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},burstPeg(){},bumpFan(){},beep(){}};vm.createContext(context);
vm.runInContext(setup+`let elapsedPlay=0,bestFallY=72,stuckFor=0,edgeStuckFor=0,jamTime=0,jamDepth=72;const ball={x:${38+seed%29*10},y:72,vx:35,vy:42};let done=false,score,slot;function finish(i){done=true;slot=i;score=SLOT_VALUES[i]}`+physics+`let seconds=0;while(!done&&seconds<30){physics(${dt});seconds+=${dt}}result={done,seconds,slot,score,y:ball.y,x:ball.x}`,context);
const r=context.result;assert.ok(r.done,`seed ${seed}, dt ${dt}: stalled at ${r.y}`);assert.ok(r.y>=1330);assert.equal(r.slot,Math.max(0,Math.min(9,Math.floor(r.x/36))));assert.ok(r.score>=10&&r.score<=100);
}
});
