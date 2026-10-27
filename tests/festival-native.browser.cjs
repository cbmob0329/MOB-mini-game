
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{chromium}=require('playwright'),{start}=require('./league-upgrade-harness.cjs');
(async()=>{const {server,url}=await start(),b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{const p=await b.newPage({viewport:{width:390,height:600}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('https://**',r=>r.abort());await p.clock.install();await p.goto(url);
await p.evaluate(()=>{
 const players=MobPartyCore.roster.slice(0,2).map((c,i)=>({...c,id:'native'+i,no:i+1,cpu:i!==0,characterRank:c.rank}));
 const teams=players.map(p=>({id:p.id,name:p.name,members:[p.id]}));
 testHost.league.configure(players,teams,{mode:'festival',title:'モブくんトーナメント'});window.nativeResult=null;
 testHost.league.run('reaction',teams,{phase:'final',round:1,multiplier:1,hideScores:true},scores=>nativeResult=scores);
});
await p.locator('#introStart').click();await p.locator('#readyBtn').click();await p.clock.runFor(5500);await p.locator('#reactionZone button').dispatchEvent('pointerdown',{pointerId:1});
await p.waitForSelector('#nextHuman');assert.equal(await p.locator('.big-record').textContent(),'？？？');assert.equal(await p.locator('.record-score100-v204').count(),0);assert.ok(await p.locator('.ready-card.human-banner').count());await p.screenshot({path:'output/festival-qa/native-hidden-score.png',fullPage:true});await p.locator('#nextHuman').click();await p.clock.runFor(1500);
assert.ok(await p.evaluate(()=>nativeResult&&Object.keys(nativeResult).length===2&&Object.values(nativeResult).every(Number.isFinite)));
await p.evaluate(()=>{
 window.nativeResult=null;const players=MobPartyCore.roster.slice(0,80).map((c,i)=>({...c,id:'worldnative'+i,cpu:true,characterRank:c.rank}));
 const teams=players.map(p=>({id:p.id,name:p.name,members:[p.id]}));testHost.league.configure(players,teams,{mode:'festival',title:'WORLD SERIES'});
 testHost.league.run('reaction',teams.slice(0,40),{phase:'qualifier',round:1,multiplier:1},scores=>nativeResult=scores);
});await p.clock.runFor(100);assert.equal(await p.evaluate(()=>Object.keys(nativeResult).length),40);assert.deepEqual(errors,[]);console.log('PASS native human hidden result and 40-person CPU adapter');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
