const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),output=fs.mkdtempSync(path.join(os.tmpdir(),'mob-season-'));
const hooks=`window.seasonHost={start(key){let seed=123;window.seasonRandom=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};invalidateGameRun();state=freshState();state.freePlay=true;state.modeKey='solo';const i=GAMES.findIndex(g=>g.key===key);state.freeGameIndex=i;state.freePlayerId=PLAYERS[0].id;partyActivePlayer=PLAYERS[0];countdown=async()=>true;startSeasonGame(key,PLAYERS[0],0,beginGameRun(i));},records(){return state.records}};`;
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'})[path.extname(file)]||'application/octet-stream');if(path.basename(file)==='game.js')data=data.toString().replace(/if\(previewKey\)startLivePreview\(\);else renderHome\(\);/,hooks+'renderHome();');if(path.basename(file)==='party-season-games.js')data=data.toString().replaceAll('api.random||Math.random','root.seasonRandom||Math.random').replace('const render=dt=>',`root.seasonProbe=()=>({active,time,phase,phaseTime,level,power,runner,gauge:gaugeAt(time-phaseTime),lockedGauge,pose,result,mode,px,py,selected,buffer,delivered,ended,score,spawned,caught,missed,bananas,boat,velocity,presents});const render=dt=>`);res.end(data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'});try{
  for(const [width,height] of [[360,640],[390,600]]){
    const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');if(process.env.CATALOG_ONLY){for(const title of ['そんなバナナ','そり立つ壁','サンタクロース']){await page.click('#partySolo');await page.click('#partyConfirm');await page.click('#partySingle');assert.equal(await page.locator('[data-game]').count(),135);await page.fill('#partySearch',title);await page.locator('[data-game]').click();assert.ok(await page.locator('[data-live-preview]').count());assert.ok(!(await page.locator('#screen').innerText()).includes('SASUKE'));await page.click('#introStart');await page.click('#readyBtn');await page.locator('.season-shell canvas').waitFor();await page.click('#homeBtn');}assert.deepEqual(errors,[]);await page.close();continue;}await page.clock.install();
    const read=()=>page.evaluate(()=>window.seasonProbe());
    const start=async key=>{await page.evaluate(k=>window.seasonHost.start(k),key);await page.waitForFunction(()=>window.seasonProbe?.().active);await page.clock.runFor(16);};
    const bounds=async()=>{const rs=await page.locator('.season-world,.season-actions').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));assert.ok(rs.every(r=>r.width>0&&r.height>=44&&r.x>=0&&r.right<=width&&r.y>=0&&r.bottom<=height),JSON.stringify(rs));};
    const press=()=>page.locator('#seasonAction').dispatchEvent('pointerdown',{pointerId:8});
    let s;
    if(!process.env.WALL_ONLY){
    await start('bananaBoatMob');await bounds();const stick=await page.locator('#seasonStick').boundingBox(),sea=await page.locator('canvas').boundingBox();assert.ok(stick.y>=sea.y+sea.height,'stick never covers the sea');
    await page.clock.runFor(18000);s=await read();assert.equal(s.spawned,30);assert.equal(s.caught+s.missed,30);assert.ok(s.score<64,'standing still is not enough: '+s.score);
    await start('bananaBoatMob');await page.mouse.move(stick.x+stick.width/2,stick.y+stick.height/2);await page.mouse.down();
    for(let i=0;i<650;i++){s=await read();if(s.ended)break;const b=s.bananas.filter(b=>!b.dead).sort((a,b)=>(.69-a.y)/a.speed-(.69-b.y)/b.speed)[0];if(b){const target=b.x+b.vx*Math.max(0,(.69-b.y)/b.speed),axis=Math.max(-1,Math.min(1,(target-s.boat)*8/.94));await page.mouse.move(stick.x+stick.width/2+axis*stick.width*.32,stick.y+stick.height/2);}await page.clock.runFor(32);if(i===140)await page.screenshot({path:path.join(output,`banana-${width}.png`)});}
    await page.mouse.up();s=await read();assert.equal(s.caught+s.missed,30);assert.ok(s.caught>=25,'25 remain attainable using the actual stick: '+s.caught);await page.clock.runFor(1200);await page.locator('#soloReplay').waitFor();
    }
    await start('warpedWallMob');await bounds();let checkedLock=false,capturedTop=false;
    for(let i=0;i<1700;i++){s=await read();if(s.ended)break;
      if(s.phase==='gauge'&&Math.abs(s.gauge-.5)<.023){await press();const locked=await read();assert.equal(locked.phase,'run');if(!checkedLock){await page.clock.runFor(120);assert.equal((await read()).lockedGauge,locked.lockedGauge);await page.locator('#seasonAction').dispatchEvent('pointerup',{pointerId:8});assert.equal((await read()).phase,'run');checkedLock=true;}}
      else if(s.phase==='run'&&Math.abs(s.runner-.49)<.006)await press();
      if(s.level===3&&s.phase==='climb'&&s.pose.height>.9&&!capturedTop){await page.screenshot({path:path.join(output,`wall-top-${width}.png`)});capturedTop=true;}
      await page.clock.runFor(16);if(i===90)await page.screenshot({path:path.join(output,`wall-${width}.png`)});
    }
    s=await read();assert.equal(s.level,3);assert.equal(s.ended,true);assert.ok(s.score>=95,s.score);await page.clock.runFor(1200);await page.locator('#soloReplay').waitFor();
    await start('warpedWallMob');await press();
    for(let i=0;i<230;i++){s=await read();if(s.ended)break;if(s.phase==='run'&&Math.abs(s.runner-.49)<.006)await press();if(s.phase==='climb'){const edge=await page.evaluate(u=>window.MobSeasonGames.wallSurface(u,0),s.pose.height);assert.ok(s.pose.x+.018<=edge.x+.00001,'failed climb never enters wall');if(s.pose.height>.03)await page.screenshot({path:path.join(output,`wall-slip-${width}.png`)});}await page.clock.runFor(16);}
    s=await read();assert.equal(s.ended,true);assert.equal(s.score,0);
    if(process.env.WALL_ONLY){assert.deepEqual(errors,[]);await page.close();continue;}
    await start('santaClausMob');await bounds();const box=await page.locator('canvas').boundingBox();assert.ok(Math.abs(box.width-box.height)<=1,JSON.stringify(box));
    await page.locator('canvas').evaluate(c=>{const g=window.seasonProbe().presents.find(g=>g.type===0),r=c.getBoundingClientRect();c.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.x+g.x*r.width,clientY:r.y+g.y*r.height}));});
    await page.clock.runFor(300);s=await read();assert.equal(s.mode,'carry');assert.equal(s.score,0);const before={x:s.px,y:s.py};
    await page.evaluate(()=>{for(let i=0;i<100;i++)document.querySelector('[data-hand="'+i%2+'"]').dispatchEvent(new PointerEvent('pointerdown'));});await page.clock.runFor(160);s=await read();assert.equal(s.score,0);assert.ok(Math.hypot(s.px-before.x,s.py-before.y)<=.28*.161,'burst taps cannot teleport a heavy gift');
    for(let i=0;i<60;i++){s=await read();if(s.mode==='choose'||s.ended)break;await page.locator('[data-hand="'+(i%2)+'"]').dispatchEvent('pointerdown');await page.clock.runFor(130);}
    s=await read();assert.equal(s.score,25);assert.equal(s.presents.filter(g=>g.available).length,10,'delivered gifts never respawn');await page.screenshot({path:path.join(output,`santa-${width}.png`)});await page.clock.runFor(13000);s=await read();assert.equal(s.ended,true);assert.equal(s.score,25);await page.locator('#soloReplay').waitFor();
    // Skilled alternating input can still finish four large deliveries within 12 seconds.
    await start('santaClausMob');let lastHandAt=-1,nextHand=0;
    for(let i=0;i<780;i++){s=await read();if(s.ended)break;
      if(s.mode==='choose'){await page.locator('canvas').evaluate(c=>{const s=window.seasonProbe(),g=s.presents.filter(g=>g.available&&g.type===0).sort((a,b)=>Math.hypot(a.x-.49,a.y-.24)-Math.hypot(b.x-.49,b.y-.24))[0];if(!g)return;const r=c.getBoundingClientRect();c.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.x+g.x*r.width,clientY:r.y+g.y*r.height}));});nextHand=0;lastHandAt=-1;}
      if(s.mode==='carry'&&s.time-lastHandAt>=.096){await page.locator('[data-hand="'+nextHand+'"]').dispatchEvent('pointerdown');nextHand=1-nextHand;lastHandAt=s.time;}
      await page.clock.runFor(16);
    }
    s=await read();assert.equal(s.score,100,'skilled route and alternating taps still permit full marks');assert.equal(s.delivered,4);await page.clock.runFor(1200);await page.locator('#soloReplay').waitFor();
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Three games completed with scoring, controls and mobile layout verified.');console.log(output);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
