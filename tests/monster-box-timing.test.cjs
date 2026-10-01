const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../game.js'),'utf8');
const game=source.slice(source.indexOf('async function startMonsterBoxMob('),source.indexOf('// V10.40 GAME 90'));
async function successWindow(width,fps,level=20,previous=false){
  const successful=[];
  let callback,nodes,records;
  const node=()=>({clientWidth:width,clientHeight:320,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(_,fn){this.input=fn;},appendChild(){},remove(){}});
  const ctx={screen:{},document:{getElementById:id=>nodes[id]||(nodes[id]=node()),createElement:node},state:{},performance:{now:()=>0},gameFit(){},esc:String,playBadge:()=>'',partyActorImage:()=>'',clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),beep(){},setTimeout(){},wait:()=>new Promise(()=>{}),isGameRunValid:()=>true,countdown:async()=>true,requestAnimationFrame:fn=>{callback=fn;return 1;},cancelAnimationFrame:()=>{callback=null;}};
  // Start directly at the final stage; run the actual production input, physics and collision code.
  vm.createContext(ctx);vm.runInContext(game.replace('level=15','level='+level).replace(previous?'&&(requiredLift===0||feet<=groundY-requiredLift)':'UNUSED',''),ctx);
  const contact=(width-8)/(205+(level-15)*9);
  for(let jumpFrame=Math.floor((contact-.95)*fps);jumpFrame<=Math.ceil((contact+.02)*fps);jumpFrame++){
    nodes={};records={};ctx.state.records={monsterBoxMob:records};callback=null;
    await ctx.startMonsterBoxMob({id:'human',name:'TEST'},0,1);
    for(let frame=0;frame<fps*5&&callback;frame++){
      if(frame===jumpFrame)nodes.mbJump138.input({preventDefault(){}});
      const next=callback;callback=null;next((frame+1)*1000/fps);
      if(records.human===100||(level===19&&nodes.mbLevel138.textContent==='20段')){successful.push(jumpFrame);break;}
    }
  }
  return successful;
}
test('20 is achievable but requires more precise timing than 19 and the previous version',async()=>{
  let reduced=0,reduced19=0;
  for(const width of [280,312,342,360,390,400])for(const fps of [30,60,120,144]){
    const current=await successWindow(width,fps),previous=await successWindow(width,fps,20,true),nineteen=await successWindow(width,fps,19);
    assert.ok(current.length>0,`${width}px at ${fps}Hz remains possible`);
    assert.ok(current.length<=previous.length,'does not become easier');
    assert.ok(current.length<nineteen.length,'20 requires more precise timing than 19');
    const old19=await successWindow(width,fps,19,true);
    assert.ok(nineteen.length>0,'19 remains achievable');
    assert.ok(nineteen.length<old19.length,'19 is no longer left at its old difficulty');
    if(nineteen.length<old19.length)reduced19++;
    if(current.length<previous.length)reduced++;
  }
  assert.ok(reduced>=12,'most configurations have a narrower success window');
  assert.equal(reduced19,24,'19 is harder at every tested width and refresh rate');
});
