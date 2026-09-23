const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const K=require('../party-king.js');
test('KING rank boundaries and fixed five-game order',()=>{
  for(const [score,rank] of [[0,'R'],[319,'R'],[320,'SR'],[399,'SR'],[400,'SSR'],[449,'SSR'],[450,'UR'],[479,'UR'],[480,'MOB'],[500,'MOB']])assert.equal(K.rank(score),rank);
  assert.deepEqual(K.games,['reaction','monsterBoxMob','longJumpMob','brake','mobIssen']);
});
test('top20 sorting uses score, perfects and oldest tie while retaining only 20',()=>{
  const rows=Array.from({length:25},(_,i)=>({playerName:'P'+i,total:400+i,perfect:0,stamp:i}));rows.push({playerName:'tie',total:424,perfect:1,stamp:30});
  const top=K.top20(rows);assert.equal(top.length,20);assert.equal(top[0].playerName,'tie');assert.equal(top[1].playerName,'P24');assert.equal(K.top20([{playerName:'bad',total:501}]).length,0);
});
test('KING five games persist the earned card and name into the top20',()=>{
  let html='',nodes={},saved=null;const storage={getItem:()=>saved,setItem:(k,v)=>saved=v};
  const screen={get innerHTML(){return html;},set innerHTML(v){html=v;nodes={};for(const m of v.matchAll(/(?:id|data-king-char)="([^"]+)"/g))nodes[m[1]]={value:'',disabled:false,dataset:{kingChar:m[1]},setAttribute(){},isConnected:false};},querySelector:q=>nodes[q.slice(1)],querySelectorAll:q=>q==='[data-king-char]'?[nodes['1']]:[]};
  const window={MobPartyCore:{roster:[{id:1,name:'Hero',img:'hero.png'}]},MobCollectibles:{date:()=> '2026/09/23',card:async()=>{}}},played=[];
  vm.runInNewContext(fs.readFileSync(require.resolve('../party-king.js'),'utf8'),{window,localStorage:storage,Math,Date});
  const ui=window.MobGameKing.create({screen,esc:s=>s,clear(){},top(){},beep(){},home(){},title:k=>k,configure(e){assert.equal(e.playerName,'Test Player');},run(k,round,done){played.push(k);done([100,95,90,80,100][round]);}});
  const click=id=>{assert.ok(nodes[id]?.onclick,id);nodes[id].onclick();};ui.setup();click('kingNext');click('kingNext');nodes.kingName.value='Test Player';click('1');click('kingConfirm');click('kingStart');for(let i=0;i<5;i++)click('kingNext');
  assert.deepEqual(played,K.games);const record=JSON.parse(saved)[0];assert.equal(record.total,465);assert.equal(record.rank,'UR');assert.equal(record.perfect,2);assert.equal(record.characterName,'Hero');assert.match(html,/歴代 1位/);click('kingNext');assert.match(html,/kingCard/);
});
