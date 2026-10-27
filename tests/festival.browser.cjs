
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{chromium}=require('playwright'),{start}=require('./league-upgrade-harness.cjs');
(async()=>{
 const {server,url}=await start(true),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const out=path.resolve('output/festival-qa');fs.mkdirSync(out,{recursive:true});const report=[];
 try{for(const [width,height] of [[360,640],[390,600]]){
  const page=await browser.newPage({viewport:{width,height},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());await page.goto(url);await page.clock.install();
  await page.waitForSelector('#partyTournament');assert.equal(await page.locator('#partyWorldSeries').count(),1);
  await page.locator('#partyLeague').click();await page.selectOption('#leagueSize','40');await page.selectOption('#leagueScoring','rank');assert.equal(await page.locator('#leagueSize').isEnabled(),true);assert.equal(await page.inputValue('#leagueSize'),'40');
  // Studio uses actual supplied images and both export sizes.
  await page.evaluate(()=>{MobChampionStudio.open({screen:document.querySelector('#screen'),esc:s=>String(s),members:MobPartyCore.roster.slice(0,2),teamName:'TEST CHAMPIONS',competition:'WORLD SERIES',model:MobChampionStudio.createModel(),done(){}})});
  await page.waitForFunction(()=>!document.querySelector('#studioSaveWallpaper').disabled);
  assert.equal(await page.locator('#studioMessageTemplate option').count(),5);
  await page.locator('#studioMessageTemplate').selectOption('最高の仲間、最高の勝利。');
  await page.locator('#studioMainMessage').fill('自由に変更！');await page.locator('#studioMainMessage').dispatchEvent('change');
  await page.locator('[data-tab="stamp"]').click();await page.selectOption('#studioImageStamp','壁紙用/002.png');
  await page.waitForFunction(()=>document.querySelector('#studioStatus').textContent.includes('タップして'));
  await page.locator('#studioCanvas').click({position:{x:50,y:130}});
  await page.selectOption('#studioSilhouetteStamp','main/001.png');await page.waitForFunction(()=>document.querySelector('#studioStatus').textContent.includes('タップして'));
  await page.locator('#studioCanvas').click({position:{x:80,y:155}});
  await page.locator('#studioUndo').click();await page.locator('#studioRedo').click();
  await page.screenshot({path:path.join(out,'studio-'+width+'.png'),fullPage:true});
  for(const target of ['Wallpaper','Card']){
   const download=page.waitForEvent('download');await page.locator('#studioSave'+target).click();const d=await download,file=path.join(out,target+'-'+width+'.png');await d.saveAs(file);
   const png=fs.readFileSync(file);assert.equal(png.readUInt32BE(16),target==='Card'?1260:1440);assert.equal(png.readUInt32BE(20),target==='Card'?1760:2560);
  }
  // Geometry and draw-order regression for initial wallpaper/card, all member counts.
  const geometry=await page.evaluate(async()=>{
   const images=await Promise.all(MobPartyCore.roster.slice(0,4).map(p=>new Promise(resolve=>{const i=new Image;i.onload=()=>resolve(i);i.src=p.img})));
   const results=[];
   for(const format of ['wallpaper','card'])for(const n of [1,2,4]){
    const canvas=document.createElement('canvas'),c=canvas.getContext('2d'),texts=[],calls=[];const fill=c.fillText.bind(c),draw=c.drawImage.bind(c);
    c.fillText=(text,x,y,...args)=>{const m=c.measureText(text);texts.push({text,x,y,left:x-m.width/2,right:x+m.width/2,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent});calls.push('text');return fill(text,x,y,...args)};
    c.drawImage=(...args)=>{calls.push(images.includes(args[0])?'character':'art');return draw(...args)};
    const model=MobChampionStudio.createModel();model.edits[format].push({type:'text',text:'CUSTOM',x:.5,y:.5,size:.06,color:'#fff'});
    MobChampionStudio.render(canvas,model,{images:images.slice(0,n),colors:images.map(()=>['#ff7b31']),silhouette:()=>images[0]},MobPartyCore.roster.slice(0,n),'WINNERS','2026/10/27',format);
    const fixed=texts.filter(t=>t.text!=='CUSTOM');for(let i=0;i<fixed.length;i++)for(let j=i+1;j<fixed.length;j++){const a=fixed[i],b=fixed[j];if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)throw Error('Text overlap '+format+': '+a.text+' / '+b.text)}
    if(calls.at(-1)!=='character')throw Error('Characters not foreground');results.push({format,n,overlaps:0,foreground:true});
   }return results;
  });
  // End-to-end screens use a deterministic adapter; native adapter checked separately.
  async function fixture(mode,outcome='win'){
   await page.evaluate(({mode,outcome})=>{
    window.qaRuns=[];window.qaUI?.stop();
    const api={screen:document.querySelector('#screen'),esc:s=>String(s).replaceAll('<','&lt;'),top:()=>scrollTo(0,0),clear(){},beep(){},home(){},title:k=>k,
     pool:()=>['reaction','brake','mob50m','mobIssen','monsterBoxMob','waterSkip','launch','longJumpMob','dockingArcadeMob','juiceArcadeMob','ropeSwingMob','santaClausMob'],
     configure(players){window.qaPlayers=players},
     run(key,teams,d,done){qaRuns.push({key,d,count:teams.length});const ids=teams.flatMap(t=>t.members);done(Object.fromEntries(ids.map((id,i)=>[id,outcome==='lose'?0:mode==='white'?(i===0?100:0):100-i*2])))}
    };window.qaUI=MobFestival.create(api);qaUI.setup(mode);
   },{mode,outcome});
   await page.selectOption('#festivalCount','0');await page.locator('#festivalNext').click();await page.screenshot({path:path.join(out,mode+'-opening-'+width+'.png'),fullPage:true});
   assert.equal(await page.locator('.festival-roulette,.festival-versus,.festival-clearline').count(),0);
   const scroll=page.locator('.festival-scroll').first();if(mode==='world'){assert.ok(await scroll.evaluate(e=>e.scrollHeight>e.clientHeight));await scroll.evaluate(e=>e.scrollTop=e.scrollHeight);assert.ok(await scroll.evaluate(e=>e.scrollTop>0));}
   let steps=0;while(!await page.locator('.festival-finale,.festival-gameover').count()){
    if(++steps>600)throw Error(mode+' did not terminate: '+await page.locator('h1').textContent());
    assert.equal(await page.locator('.festival-roulette,.festival-versus,.festival-clearline,.festival-reveal').count(),0,'CPU games must only show results');
    const next=page.locator('#festivalNext');if(await next.isEnabled())await next.click();await page.clock.runFor(2400);
   }
   await page.screenshot({path:path.join(out,mode+'-'+outcome+'-final-'+width+'.png'),fullPage:true});
   const state=await page.evaluate(()=>qaUI.snapshot()),runs=await page.evaluate(()=>qaRuns);
   if(mode==='tournament'){assert.equal(runs.length,37);assert.ok(runs.every(r=>r.d.hideScores));assert.ok(state.champion)}
   if(mode==='white')assert.ok(outcome==='lose'?state.whiteWins:state.champion);
   if(mode==='world'){assert.equal(state.leg,6);assert.equal(state.finalists.length,20);assert.ok(state.champion);assert.ok(runs.slice(0,18).every(r=>r.count===40))}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
   return {mode,outcome,steps,runs:runs.length,champion:state.champion,whiteWins:state.whiteWins};
  }
  const modes=[];for(const mode of ['tournament','white','world'])modes.push(await fixture(mode));modes.push(await fixture('white','lose'));
  assert.deepEqual(errors,[]);report.push({width,height,geometry,modes,errors});await page.close();console.log('PASS mobile',width);
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
