const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function setup(){
  const window=new EventTarget(),document=new EventTarget(),pad=new EventTarget();
  const knob={style:{}};pad.setAttribute=()=>{};pad.querySelector=()=>knob;pad.setPointerCapture=()=>{};pad.getBoundingClientRect=()=>({left:0,top:0,width:130,height:130});
  vm.runInNewContext(fs.readFileSync(require.resolve('../party-controls.js'),'utf8'),{window,document,AbortController});
  const held=new Set();let active=true;const dispose=window.MobPartyControls.stick(pad,held,()=>active);
  const emit=(type,fields={})=>{const event=new Event(type,{cancelable:true});Object.assign(event,fields);pad.dispatchEvent(event);};
  return {held,emit,window,dispose,disable(){active=false;}};
}
test('stick is proportional, ignores other pointers, and recenters on cancellation',()=>{
  const s=setup();s.emit('pointerdown',{pointerId:1,clientX:85,clientY:65});assert.ok(s.held.axisX>0&&s.held.axisX<1);assert.equal(s.held.axisY,0);
  const x=s.held.axisX;s.emit('pointermove',{pointerId:2,clientX:0,clientY:0});assert.equal(s.held.axisX,x);
  s.emit('pointercancel',{pointerId:1});assert.equal(s.held.axisX,0);assert.equal(s.held.axisY,0);s.dispose();
});
test('keyboard diagonals are normalized and focus loss/disposal stops movement',()=>{
  const s=setup();s.emit('keydown',{key:'ArrowRight'});s.emit('keydown',{key:'ArrowUp'});assert.ok(Math.abs(Math.hypot(s.held.axisX,s.held.axisY)-1)<1e-9);
  s.window.dispatchEvent(new Event('blur'));assert.equal(s.held.size,0);assert.equal(s.held.axisX,0);
  s.disable();s.emit('pointerdown',{pointerId:1,clientX:100,clientY:65});assert.equal(s.held.axisX,0);
  s.dispose();s.emit('keydown',{key:'ArrowRight'});assert.equal(s.held.axisX,0);
});
