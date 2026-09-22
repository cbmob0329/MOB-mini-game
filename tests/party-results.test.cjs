const {test}=require('node:test');const assert=require('node:assert/strict');const {pages}=require('../party-results.js');
const players=['a','b','c','d'].map(id=>({id,name:id}));
test('four result pages separate round points from cumulative points and show reserves',()=>{
  const round={a:40,c:30,d:10},total={a:50,b:100,c:40,d:10};
  const result=pages({players,teams:{A:['a','b'],B:['c','d']},names:{A:'RED',B:'BLUE'},round,total});
  assert.deepEqual(result.map(p=>p.title),['このゲームの個人順位','このゲームのチーム順位','個人総合順位','チーム総合順位']);
  assert.equal(result[0].rows.length,3);assert.equal(result[0].rows[0].p.id,'a');
  assert.deepEqual(result[1].rows.map(t=>[t.points,t.rank]),[[40,1],[40,1]]);
  assert.equal(result[1].rows[0].members[1].bench,true);
  assert.equal(result[2].rows[0].p.id,'b');assert.equal(result[3].rows[0].points,150);
  assert.deepEqual(round,{a:40,c:30,d:10});assert.deepEqual(total,{a:50,b:100,c:40,d:10});
});
test('all-zero results tie at first place and teams equal member sum',()=>{
  const result=pages({players,teams:{A:['a','b'],B:['c','d']},names:{},round:{a:0,b:0,c:0,d:0},total:{}});
  for(const page of result){assert.ok(page.rows.every(r=>r.rank===1));if(page.team)for(const row of page.rows)assert.equal(row.points,row.members.reduce((n,m)=>n+m.points,0));}
});
test('round ranking preserves game ranking even when awarded points tie',()=>{
  const result=pages({players,teams:{A:['a','b'],B:['c','d']},names:{},round:{a:100,b:100},total:{a:100,b:100},ranked:[{p:players[0],points:100,rank:1},{p:players[1],points:100,rank:2}]});
  assert.deepEqual(result[0].rows.map(r=>r.rank),[1,2]);assert.deepEqual(result[2].rows.slice(0,2).map(r=>r.rank),[1,1]);
});
test('tap advances once, drag does not advance, and completion is called only after page four',()=>{
  const vm=require('node:vm'),fs=require('node:fs');let now=1000,html='',panel,button,done=0;
  const element=()=>({handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}});
  const screen={set innerHTML(value){html=value;panel=element();button=element();},querySelector(q){return q==='.party-results'?panel:button;}};
  const context={module:{exports:{}},performance:{now:()=>now},window:{scrollY:0}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../party-results.js'),'utf8'),context);
  const model=pages({players,teams:{A:['a','b'],B:['c','d']},names:{},round:{a:10},total:{a:10}});
  context.module.exports.show({screen,esc:s=>String(s),model,game:'TEST',round:1,done:()=>done++,beep(){},top(){}});
  now+=500;const target={closest:()=>null};panel.handlers.pointerdown({clientX:0,clientY:0});panel.handlers.pointerup({clientX:0,clientY:40,target});assert.match(html,/ROUND \/ INDIVIDUAL/);
  panel.handlers.pointerdown({clientX:0,clientY:0});panel.handlers.pointerup({clientX:0,clientY:0,target});assert.match(html,/ROUND \/ TEAM/);
  button.handlers.click();assert.match(html,/ROUND \/ TEAM/);
  now+=500;button.handlers.click();assert.match(html,/OVERALL \/ INDIVIDUAL/);
  now+=500;button.handlers.click();assert.match(html,/OVERALL \/ TEAM/);assert.equal(done,0);
  now+=500;button.handlers.click();button.handlers.click();assert.equal(done,1);
});
