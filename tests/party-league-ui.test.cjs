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
  let roster,teams;const pending=[],window={MobPartyCore:core,MobPartyLeague:rules};vm.runInNewContext(fs.readFileSync(require.resolve('../party-league-ui.js'),'utf8'),{window,Math});
  const ui=window.MobPartyLeagueUI.create({screen,esc:s=>s,clear(){},top(){},beep(){},home(){},pool:()=>['reaction'],title:s=>s,configure(p,t){roster=p;teams=t;},run(key,rows,descriptor,done){const finish=()=>done(Object.fromEntries(rows.flatMap(t=>t.members.map(p=>[p,100-Number(t.id.slice(1))*3]))));if(deferred)pending.push(finish);else finish();}});
  ui.setup();screen.querySelector('#leagueCount').value=humanCount;screen.querySelector('#leagueSelect').onclick();screen.querySelector('#leagueStart').onclick();
  return {screen,roster,teams,pending,next(){assert.match(screen.innerHTML,/id="leagueNext"/);screen.querySelector('#leagueNext').onclick();},until(text){for(let i=0;i<400&&!screen.innerHTML.includes(text);i++)this.next();assert.ok(screen.innerHTML.includes(text),text);}};
}
test('rapid next taps cannot submit an unfinished CPU round twice',()=>{
  const f=fixture(true);for(let i=0;i<4;i++)f.next();const next=f.screen.querySelector('#leagueNext').onclick;
  next();next();assert.equal(f.pending.length,1);f.pending.shift()();assert.match(f.screen.innerHTML,/今回の個人順位/);
});
test('human tag heat announces both opposing teams before gameplay',()=>{
  const f=fixture(false,1);f.until('タッグ対戦、開幕');f.next();assert.match(f.screen.innerHTML,/<h1>TEAM 1 VS TEAM 2<\/h1>/);assert.match(f.screen.innerHTML,/league-vs/);
});
test('individual and round results omit qualification; cumulative standings have narration first',()=>{
  const f=fixture();f.until('今回の個人順位');assert.doesNotMatch(f.screen.innerHTML,/通過ボーダー|上位8チームが通過/);
  f.next();assert.match(f.screen.innerHTML,/今回のチーム順位/);assert.doesNotMatch(f.screen.innerHTML,/通過ボーダー|上位8チームが通過/);
  f.next();assert.match(f.screen.innerHTML,/現在の総合順位はこちら/);f.next();assert.match(f.screen.innerHTML,/ステージ個人総合/);assert.doesNotMatch(f.screen.innerHTML,/通過ボーダー|上位8チームが通過/);
  f.next();assert.match(f.screen.innerHTML,/現在の総合順位はこちら/);f.next();assert.match(f.screen.innerHTML,/上位8チームが通過/);
});
test('CPU league still presents matchups, bonus round, advancement, ignition and expanded awards',()=>{
  const f=fixture();f.until('タッグ対戦、開幕');assert.match(f.screen.innerHTML.replace(/<[^>]*>/g,''),/TEAM 1 VS TEAM 2/);
  f.until('POINTS ×2');f.until('進出発表 1 / 8');f.until('MATCH POINT');f.until('CHAMPIONS');f.until('ハイアベレージ賞');f.until('決勝の主役賞');
  f.next();assert.match(f.screen.innerHTML,/最終結果/);
});
