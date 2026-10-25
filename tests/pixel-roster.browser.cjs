const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright'),{start,output}=require('./visual-refresh-harness.cjs');
(async()=>{const {server,url}=await start();let browser;
try{browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
for(const [width,height] of [[360,640],[390,600]]){
 const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());await page.goto(url);
 await page.evaluate(()=>{window.qaLeague=MobPartyLeagueUI.create(testHost.league);qaLeague.setup();});
 await page.selectOption('#leagueLevel','HARD');await page.selectOption('#leagueScoring','rank');
 assert.equal(await page.locator('#leagueLevel').inputValue(),'INFERNO');assert.equal(await page.locator('#leagueLevel').isDisabled(),true);
 await page.selectOption('#leagueScoring','raw');assert.equal(await page.locator('#leagueLevel').inputValue(),'HARD');
 await page.selectOption('#leagueScoring','rank');
 async function fits(selector){const r=await page.locator(selector).boundingBox();assert.ok(r&&r.x>=0&&r.y>=0&&r.x+r.width<=width+1&&r.y+r.height<=height+1&&r.height>=44,selector+JSON.stringify(r));}
 await fits('#leagueSelect');await fits('#leagueBack');await page.screenshot({path:path.join(output,`pixel-setup-${width}.png`)});
 await page.click('#leagueSelect');await page.selectOption('#characterGroup','MAIN CHARACTERS');await page.click('[data-character="4001"]');
 await page.waitForFunction(()=>{const im=document.querySelector('#partyPreview img');return im?.complete&&im.naturalWidth>0;});
 await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('#partyPreview img,[data-character="4001"] img')].map(im=>im.decode()));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await fits('#partyConfirm');await page.screenshot({path:path.join(output,`pixel-picker-${width}.png`)});
 await page.click('#partyConfirm');await page.click('#leagueStart');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mobTagLeagueProgressV2')));
 assert.equal(saved.players.filter(p=>!p.cpu)[0].name,'モブプチノン');
 const humanTeam=saved.league.teams.find(t=>t.members.includes(saved.players.find(p=>!p.cpu).id));
 assert.ok(humanTeam.members.some(id=>saved.players.find(p=>p.id===id).name==='モブスーパーマン'));
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('mobTagLeagueProgressV2')).players.filter(p=>p.cpu&&MobPartyCore.rankValue(p.characterRank)>=5.5).length>=27));
 assert.deepEqual(errors,[]);await page.close();console.log('PASS',width,height);
}
console.log(output);
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
