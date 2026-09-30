const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../game.js'),'utf8');
const game=source.slice(source.indexOf('async function startMonsterBoxMob('),source.indexOf('// V10.40 GAME 90'));
async function canClear(width,fps,bonus){
  let callback,nodes,records;
  const node=()=>({clientWidth:width,clientHeight:320,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(_,fn){this.input=fn;},appendChild(){},remove(){}});
  const ctx={screen:{},document:{getElementById:id=>nodes[id]||(nodes[id]=node()),createElement:node},state:{},performance:{now:()=>0},gameFit(){},esc:String,playBadge:()=>'',partyActorImage:()=>'',clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),beep(){},setTimeout(){},wait:()=>new Promise(()=>{}),isGameRunValid:()=>true,countdown:async()=>true,requestAnimationFrame:fn=>{callback=fn;return 1;},cancelAnimationFrame:()=>{callback=null;}};
  // Start directly at the final stage; run the actual production input, physics and collision code.
  vm.createContext(ctx);vm.runInContext(game.replace('level=15','level=20').replace('(level===20?8:0)',String(bonus)),ctx);
  const contact=(width-8)/250;
  for(let jumpFrame=Math.floor((contact-.62)*fps);jumpFrame<=Math.ceil((contact-.44)*fps);jumpFrame++){
    nodes={};records={};ctx.state.records={monsterBoxMob:records};callback=null;
    await ctx.startMonsterBoxMob({id:'human',name:'TEST'},0,1);
    for(let frame=0;frame<fps*5&&callback;frame++){
      if(frame===jumpFrame)nodes.mbJump138.input({preventDefault(){}});
      const next=callback;callback=null;next((frame+1)*1000/fps);
      if(records.human===100)return true;
    }
  }
  return false;
}
test('20-stage jump remains achievable with the small lift across widths and refresh rates',async()=>{
  for(const width of [280,312,342,360,390,400])for(const fps of [30,60,120,144])assert.equal(await canClear(width,fps,8),true,`${width}px at ${fps}Hz`);
  assert.equal(await canClear(360,120,0),false,'reproduces the previously unreachable final stage');
});
