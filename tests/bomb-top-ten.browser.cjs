const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright'),{start,output}=require('./visual-refresh-harness.cjs');
(async()=>{const {server,url}=await start();let browser;try{
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 for(const [width,height] of [[360,640],[390,600]]){
  const p=await browser.newPage({viewport:{width,height}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('https://**',r=>r.abort());await p.goto(url);await p.clock.install();await p.clock.pauseAt(new Date(await p.evaluate(()=>Date.now()+100)));
  await p.evaluate(()=>{window.MobPresentation=null;MobPartyCore.cpuScore=()=>50;window.bombDone=null;window.bombRun=MobLeagueEvents.run({screen:document.querySelector('#screen'),key:'focusBombMob',mode:'tag',entrants:MobPartyCore.roster.slice(0,40).map((p,i)=>({...p,id:'q'+i,team:'TEAM '+Math.floor(i/2),teamId:'t'+Math.floor(i/2),no:i+1,cpu:i>0})),esc:String,valid:()=>true,clear(){},top(){scrollTo(0,0)},beep(){},random:()=>.45,done:s=>window.bombDone=s});});
  let attempts=0,top=false,dual=false;const ranks=[];
  for(let i=0;i<45&&!await p.evaluate(()=>!!bombDone);i++){
   await p.clock.runFor(400);
   if(await p.locator('.bomb-top-ten').count()){top=true;assert.equal(await p.locator('.bomb-top-ten article').count(),10);const box=await p.locator('.bomb-top-ten').boundingBox();assert.ok(box.y+box.height<=height);await p.screenshot({path:path.join(output,'top-ten-'+width+'.png')});}
   const rank=await p.locator('[data-bomb-rank]').count()?await p.locator('[data-bomb-rank]').first().getAttribute('data-bomb-rank'):null;if(rank)ranks.push(Number(rank));
   const button=p.locator('#eventActions button');await button.waitFor();const label=await button.innerText(),box=await button.boundingBox();assert.ok(box.y+box.height<=height&&box.height>=44,label);
   if(label==='START'){
    attempts++;await button.click();await p.clock.runFor(500);assert.equal(await p.locator('#bombTime').innerText(),'?.?????');await p.clock.runFor(500);await p.locator('#eventActions button').click();assert.equal(await p.locator('#bombTime').innerText(),'?.?????');continue;
   }
   if(label==='優勝者を発表！'){dual=true;assert.equal(await p.locator('.bomb-final-two article').count(),2);await button.click();assert.equal(await p.locator('.bomb-final-count').innerText(),'3');await p.screenshot({path:path.join(output,'last-two-'+width+'.png')});await p.clock.runFor(2500);continue;}
   await button.click();
  }
  assert.ok(top&&dual);assert.equal(attempts,2);assert.deepEqual(ranks,[10,9,8,7,6,5,4,3,1]);assert.equal(await p.evaluate(()=>bombDone.q0),100);assert.deepEqual(await p.evaluate(()=>Object.values(bombDone).filter(v=>v>0).sort((a,b)=>b-a)),[100,80,60,50,40,30,20,15,10,5]);assert.deepEqual(errors,[]);console.log('PASS',width,height);await p.close();
 }console.log(output);
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
