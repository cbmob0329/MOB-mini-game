const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {start}=require('./visual-refresh-harness.cjs');
(async()=>{
 const {server,url}=await start();let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  for(const [width,height] of [[360,640],[390,600]]){
   const p=await browser.newPage({viewport:{width,height}});
   await p.route('https://**',r=>r.abort());
   await p.route('**/game.js*',async r=>{
    const response=await r.fetch();
    const body=(await response.text()).replace('ready:humanReady};','ready:humanReady,record:recordScreen};');
    await r.fulfill({response,body});
   });
   await p.goto(url);await p.clock.install();
   for(const [subGame,factor,base] of [['A',2,100],['B',2,80],['C',3,100],['C',3,80],['',1,100]]){
    await p.evaluate(({subGame,factor,base})=>{
     const player={...MobPartyCore.roster[0],id:'p1',no:1,cpu:false};
     const teams=[{id:'T',name:'TEST',members:['p1']}];
     testHost.league.configure([player],teams);
     const key='mobIssen',i=testHost.games.findIndex(g=>g.key===key);window.rawResult=null;
     testHost.league.run(key,teams,{phase:'qualifier',round:10,key:'tripleChoice',subGame,multiplier:factor===1?1:2,scoreMultiplier:factor},scores=>window.rawResult=scores);
     testHost.begin(i);testHost.state().records[key].p1=base;
     testHost.record(i,player,0,base+'<small>/100 pt</small>','FINISH');
    },{subGame,factor,base});
    assert.equal((await p.locator('.big-record').innerText()).replace(/\s/g,''),`${factor*base}/${factor*100}pt`);
    const rect=await p.locator('#nextHuman').boundingBox();
    assert.ok(rect.y+rect.height<=height&&rect.height>=44);
    await p.clock.runFor(650);await p.click('#nextHuman');
    assert.equal(await p.evaluate(()=>rawResult.p1),base,'Callback keeps base score to avoid double multiplication');
   }
   console.log('PASS',width,height);await p.close();
  }
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
