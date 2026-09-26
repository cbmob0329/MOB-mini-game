const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('../party-core.js'),rules=require('../party-league.js');
test('CPU allocation preserves humans, pairs collaborations and uses 39 distinct appearances',()=>{
  for(const humans of [[],[core.roster[0],core.roster[7],core.roster[8],core.roster[17]]]){
    const teams=Array.from({length:20},(_,i)=>humans[i]?[humans[i]]:[]),pairs=core.leagueCpuPairs(teams,()=>.3);
    assert.equal(pairs.flat().length,40);assert.equal(new Set(pairs.flat().map(c=>c.id)).size,39);
    humans.forEach((p,i)=>assert.equal(pairs[i][0],p));
    assert.ok(pairs.filter(t=>t[0].group===t[1].group).length>=17);
  }
});
function fixture(deferred=false,humanCount=0){
  const elements=new Map(),screen={innerHTML:'',getBoundingClientRect:()=>({top:80}),querySelector(id){if(!elements.has(id))elements.set(id,{value:0,style:{setProperty(){}},classList:{add(){}},insertAdjacentHTML(_,html){screen.innerHTML+=html;}});return elements.get(id);},querySelectorAll(){return [];}};
  let roster,teams;const pending=[],runs=[],window={MobPartyCore:core,MobPartyLeague:rules};vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-ui.js'),'utf8'),{window,Math});
  const ui=window.MobPartyLeagueUI.create({screen,esc:s=>s,clear(){},top(){},beep(){},home(){},pool:()=>['reaction','longJumpMob','brake'],title:s=>s,configure(p,t){roster=p;teams=t;},run(key,rows,descriptor,done){runs.push({key,rows,descriptor});const finish=()=>done(Object.fromEntries(rows.flatMap(t=>t.members.map(p=>[p,100-Number(t.id.slice(1))*3]))));if(deferred)pending.push(finish);else finish();}});
  ui.setup();screen.querySelector('#leagueCount').value=humanCount;screen.querySelector('#leagueSelect').onclick();screen.querySelector('#leagueStart').onclick();
  return {screen,roster,teams,pending,runs,next(){assert.match(screen.innerHTML,/id="leagueNext"/);screen.querySelector('#leagueNext').onclick();},until(text){for(let i=0;i<400&&!screen.innerHTML.includes(text);i++)this.next();assert.ok(screen.innerHTML.includes(text),text);}};
}
test('rapid next taps cannot submit an unfinished CPU round twice',()=>{
  const f=fixture(true);for(let i=0;i<5;i++)f.next();const next=f.screen.querySelector('#leagueNext').onclick;
  next();next();assert.equal(f.pending.length,1);f.pending.shift()();assert.match(f.screen.innerHTML,/今回のチーム順位/);
});
test('human tag heat announces both opposing teams before gameplay',()=>{
  const f=fixture(false,1);f.until('タッグ対戦、開幕');f.until('この2組が激突');assert.match(f.screen.innerHTML,/<h1>TEAM \d+ VS TEAM \d+<\/h1>/);assert.match(f.screen.innerHTML,/league-vs/);
});
test('only team results appear during league, with cumulative narration before the totals',()=>{
  const f=fixture();f.until('今回のチーム順位');assert.doesNotMatch(f.screen.innerHTML,/個人順位|通過ボーダー/);f.next();assert.match(f.screen.innerHTML,/現在の総合順位はこちら/);f.next();assert.match(f.screen.innerHTML,/ステージチーム総合/);assert.match(f.screen.innerHTML,/上位8チームが通過/);f.until('CHAMPION!!');assert.doesNotMatch(f.screen.innerHTML,/今回のチーム順位/);f.until('大会最終・個人総合順位');
});
test('individual choices differ within a pair and team choices run the pair together',()=>{
  const f=fixture(false,2);f.until('GAME 6 · 種目を選ぼう');
  f.screen.querySelector('#leagueChoice0').onclick();
  assert.match(f.screen.innerHTML,/id="leagueChoice0" class="primary" disabled/);
  assert.match(f.screen.innerHTML,/相棒が選択済み/);
  f.screen.querySelector('#leagueChoice1').onclick();f.until('今回のチーム順位');
  const round=f.runs.filter(r=>r.descriptor.round===6&&r.descriptor.phase==='qualifier');
  assert.equal(round.length,40);assert.ok(round.every(r=>r.rows[0].members.length===1));
  const humans=round.filter(r=>r.rows[0].members.some(p=>p==='p1'||p==='p2'));assert.equal(humans.length,2);assert.notEqual(humans[0].key,humans[1].key);
  f.until('GAME 7 · 種目を選ぼう');f.screen.querySelector('#leagueChoice0').onclick();f.until('今回のチーム順位');
  const seventh=f.runs.filter(r=>r.descriptor.round===7&&r.descriptor.phase==='qualifier');assert.equal(seventh.length,20);assert.ok(seventh.every(r=>r.rows[0].members.length===2&&r.descriptor.multiplier===2));
});
test('CPU league still presents matchups, bonus round, advancement, ignition and expanded awards',()=>{
  const f=fixture();f.until('タッグ対戦、開幕');assert.match(f.screen.innerHTML.replace(/<[^>]*>/g,''),/TEAM \d+ VS TEAM \d+/);
  f.until('POINTS ×2');f.until('進出発表 1 / 8');f.until('MATCH POINT');f.until('CHAMPIONS');f.until('ハイアベレージ賞');f.until('決勝の主役賞');
  f.until('相棒サポート賞');f.until('最終結果');
});
