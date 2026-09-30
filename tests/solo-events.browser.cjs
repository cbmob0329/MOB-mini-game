const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),output=fs.mkdtempSync(path.join(os.tmpdir(),'mob-stopwatch-'));
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 for(const [width,height] of [[360,640],[390,600]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');
  if(process.env.TIMEOUT_ONLY){
    await page.evaluate(()=>{window.MobGamePreviewActive=true;window.MobLeagueEvents.run({key:'focusBombMob',mode:'king',screen:document.querySelector('#screen'),esc:String,entrants:window.MobPartyCore.roster.slice(0,20).map((c,i)=>({...c,id:'t'+i,no:i+1,teamId:'T'+i,team:'TEST',cpu:i!==0})),valid:()=>true,clear(){},top(){},beep(){},done(){}});});
    await page.getByRole('button',{name:'準備OK',exact:true}).click();await page.getByRole('button',{name:'START',exact:true}).click();await page.locator('.bomb-stopwatch.exploded').waitFor();assert.equal(await page.locator('#bombTime').innerText(),'3.000');assert.match(await page.locator('#bombMeasure').innerText(),/2.000秒/);assert.deepEqual(errors,[]);await page.close();continue;
  }
  await page.click('#partySolo');await page.click('#partyConfirm');await page.click('#partySingle');assert.equal(await page.locator('[data-game]').count(),135);
  await page.fill('#partySearch','集中大爆弾');await page.locator('[data-game]').click();await page.click('#introStart');
  let attempts=0;
  for(let step=0;step<160;step++){
    if(await page.locator('#soloReplay').count())break;
    const button=page.locator('#eventActions button:enabled').first();if(!await button.count()){await page.waitForTimeout(40);continue;}
    if((await button.innerText())==='START'){
      await button.click();await page.waitForTimeout(900);await page.locator('#eventActions button').click();attempts++;
      const time=Number(await page.locator('#bombTime').innerText()),measure=await page.locator('#bombMeasure').innerText();assert.ok(time>.8&&time<1.4);assert.ok(measure.includes((Math.abs(Math.round(time*1000)-1000)/1000).toFixed(3)),measure);
      const boxes=await page.locator('.bomb-stopwatch,#eventActions button').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));assert.ok(boxes.every(r=>r.top>=0&&r.bottom<=height&&r.left>=0&&r.right<=width),JSON.stringify(boxes));await page.screenshot({path:path.join(output,`stopwatch-${width}.png`)});
    }else await button.click();
  }
  assert.ok(attempts>=1);await page.locator('#soloReplay').waitFor();await page.click('#soloOther');await page.fill('#partySearch','少数派');await page.locator('[data-game]').click();await page.click('#introStart');await page.locator('#eventActions button').click();await page.locator('#eventActions button').click();await page.locator('.food-options button').first().click();await page.getByRole('button',{name:'みんなで結果を見る',exact:true}).waitFor();
  await page.click('#homeBtn');await page.click('#partySolo');await page.click('#partyConfirm');await page.click('#partySingle');await page.fill('#partySearch','モンスターボックス');await page.locator('[data-game]').click();await page.click('#introStart');await page.click('#readyBtn');await page.waitForTimeout(3300);assert.equal(await page.locator('#mbJump138').innerText(),'JUMP');const before=await page.locator('#mbMob138').evaluate(el=>parseFloat(el.style.top));await page.locator('#mbJump138').dispatchEvent('pointerdown');await page.waitForTimeout(140);const after=await page.locator('#mbMob138').evaluate(el=>parseFloat(el.style.top));assert.ok(after<before-10);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log(process.env.TIMEOUT_ONLY?'Stopwatch 3-second automatic stop passed at both mobile widths.':'Solo catalog, stopwatch scoring/results, minority voting and original jump controls passed at both mobile widths.');console.log(output);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
