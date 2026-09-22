const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(key,random=.9){
  let html='',buttons=[],tiles=[],nodes={},clock=0,id=0,finished=null;
  const timers=new Map();
  const element=()=>({textContent:'',classList:{toggle(){},remove(){}},disabled:false});
  const choices={set innerHTML(value){buttons=[...value.matchAll(/data-choice="(\d+)"[^>]*>(.*?)<\/button>/g)].map(m=>({...element(),label:m[2],dataset:{choice:m[1]}}));}};
  const screen={set innerHTML(value){html=value;buttons=[];nodes={};for(const m of value.matchAll(/id="([^"]+)"/g))nodes[m[1]]=element();nodes.eventChoices=choices;nodes.call=element();tiles=value.includes('party-bridge')?[element(),element(),element()]:[];},querySelector(q){return q==='.party-event-call'?nodes.call:nodes[q.slice(1)];},querySelectorAll(q){return q==='[data-choice]'?buttons:q==='.party-bridge div'?tiles:[];}};
  const api={screen,esc:s=>s,valid:()=>true,begin:()=>1,top(){},beep(){},round:()=>0,solo:()=>false,games:[{key,title:key}],teams:()=>[{name:'A',members:[{id:'p',name:'Player',img:'p',cpu:false,rank:'B'}]},{name:'B',members:[{id:'c',name:'CPU',img:'c',cpu:true,rank:'B'}]}],representatives(){},finish(i,slots){finished=slots;}};
  const window={MobPartyCore:{cpuScore:()=>50}};
  const math=Object.create(Math);math.random=()=>random;
  vm.runInNewContext(fs.readFileSync(require.resolve('../party-games.js'),'utf8'),{window,Math:math,setTimeout(fn,ms){timers.set(++id,{fn,time:clock+ms});return id},clearTimeout(i){timers.delete(i)}});
  window.MobPartyGames.create(api).start(0);
  const settle=async()=>{for(let i=0;i<15;i++)await Promise.resolve();};
  return {settle,get html(){return html},get buttons(){return buttons},get tiles(){return tiles},get finished(){return finished},async click(i=0){assert.ok(buttons[i]?.onclick,html);buttons[i].onclick();await settle();},async tick(){const next=[...timers].sort((a,b)=>a[1].time-b[1].time)[0];if(!next)return false;clock=next[1].time;timers.delete(next[0]);next[1].fn();await settle();return true;}};
}
test('death-game elimination waits for explicit acknowledgement and scores once',async()=>{
  const h=setup('deathGameChallenge');await h.settle();await h.click();
  for(let i=0;i<15&&!h.html.includes('ELIMINATED');i++){if(h.buttons.length)await h.click();else await h.tick();}
  assert.match(h.html,/ELIMINATED/);await h.tick();assert.match(h.buttons[0].label,/確認/);
  assert.equal(await h.tick(),false);assert.match(h.html,/ELIMINATED/);assert.equal(h.finished,null);
  await h.click();assert.match(h.html,/RESULT/);await h.click();assert.deepEqual(Array.from(h.finished,s=>s.score).sort((a,b)=>a-b),[70,100]);
});
test('bridge wrong route loses lives and eliminates after two mistakes',async()=>{
  const h=setup('colorBridgeParty',.9);await h.settle();
  for(let i=0;i<100&&!h.finished;i++){if(h.buttons.length&&h.buttons[0].onclick)await h.click(0);else assert.ok(await h.tick());}
  assert.ok(h.finished);assert.equal(h.finished.find(s=>s.id==='p').score,0);
});
test('bridge requires all 25 remembered steps for a perfect five-stage score',async()=>{
  const h=setup('colorBridgeParty',.9);await h.settle();let steps=0;
  for(let i=0;i<240&&!h.finished;i++){
    if(h.buttons.length&&h.buttons[0].onclick){const index=h.buttons.findIndex(b=>b.label==='右の足場');if(index>=0)steps++;await h.click(index>=0?index:0);}else assert.ok(await h.tick());
  }
  assert.equal(steps,25);assert.equal(h.finished.find(s=>s.id==='p').score,100);
});
test('treasure scouting is single use; safe chest gains points and exit banks them',async()=>{
  const h=setup('treasureEscapeParty',.9);await h.settle();await h.click();await h.click();
  await h.click(3);assert.equal(h.buttons.length,3);await h.click(0);
  await h.tick();assert.match(h.html,/10点/);await h.tick();await h.click();
  await h.click();assert.equal(h.buttons.length,3);await h.click(2);await h.tick();await h.tick();await h.click();await h.click();
  assert.equal(h.finished.find(s=>s.id==='p').score,10);
});
