
/* New solo championships use the same real-game adapter and victory studio. */
(()=>{
'use strict';
const R=window.MobFestivalRules,C=window.MobPartyCore;
const TITLES={tournament:'モブくんトーナメント',white:'モブホワイトの挑戦状',world:'モブくんワールドシリーズ'};
window.MobFestival={create(api){
 const {screen,esc}=api;let s=null,mode='tournament',selected=[],count=1,level='EASY',token=0;
 const timers=new Set(),SAVE='mob-festival-v1';
 const p=id=>s.players.find(p=>p.id===id),title=k=>k==='focusBombMob'?'集中爆弾':api.title(k);
 const button=(label='次へ →')=>'<button id="festivalNext" class="primary">'+label+'</button>';
 function on(fn){const b=screen.querySelector('#festivalNext');let used=false;b.onclick=()=>{if(used)return;used=true;b.disabled=true;fn()}}
 function save(){if(!s)return;try{localStorage.setItem(SAVE,JSON.stringify(s))}catch{}}
 function stop(){token++;timers.forEach(clearTimeout);timers.clear();s=null;screen.classList.remove('festival-score-secret')}
 function later(fn,ms){const own=token,t=setTimeout(()=>{timers.delete(t);if(own===token&&s)fn()},ms);timers.add(t)}
 function view(heading,body,cls=''){
  api.clear();screen.innerHTML='<section class="festival '+cls+'"><header><small>'+TITLES[mode]+'</small><h1>'+heading+'</h1></header>'+body+'</section>';api.top();window.MobPartyLayout?.fitMenus?.(screen);
 }
 function rows(ids,values={},hidden=false,notes={}){
  return '<div class="festival-scroll league-ranks" tabindex="0" aria-label="出場者・順位一覧">'+ids.map((id,i)=>{const a=p(id),rank=Object.hasOwn(values,id)?1+ids.filter(other=>(values[other]||0)>(values[id]||0)).length:i+1;return '<article class="festival-row league-rank '+(!a.cpu?'human-banner':'')+'" data-player="'+id+'"><b class="festival-place">'+rank+'</b><div><img src="'+a.img+'" alt=""><strong>'+esc(a.name)+'</strong><small>'+(!a.cpu?'PLAYER '+a.no:'CPU')+(mode==='world'?' · GROUP '+String.fromCharCode(65+a.group):'')+(a.seed?' · SEED':'')+(s.lit.includes(id)?' · ● 点灯':'')+(notes[id]!==undefined?' · '+esc(typeof notes[id]==='number'?'加算 '+notes[id]+'pt':notes[id]):'')+'</small></div><strong>'+(hidden?'？？？':Object.hasOwn(values,id)?values[id]+' pt':'')+'</strong></article>'}).join('')+'</div>';
 }
 function scope(overall=false,text=''){return '<div class="ranking-scope '+(overall?'overall':'round')+'"><small>'+(overall?'OVERALL · 総合順位':'THIS GAME · 今回の結果')+'</small><strong>'+esc(text||(overall?'大会の累計ポイント':'このゲームだけの順位'))+'</strong></div>'}
 function groupIntro(index=0){
  if(index===4){progress();return}const letter=String.fromCharCode(65+index),ids=s.players.filter(p=>p.group===index).map(p=>p.id);
  view('GROUP '+letter,speech(letter+'グループのみなさんはこっちらです！')+'<div class="festival-group-emblem" aria-hidden="true">'+letter+'</div>'+rows(ids)+button(index===3?'開幕戦へ！':'次のグループへ →'),'festival-roster festival-group-'+index);on(()=>groupIntro(index+1));
 }
 function bracket(done,highlight=null){
  const rounds=[s.players.map(p=>p.id)];for(let r=0;r<5;r++){const previous=rounds[r],next=[];for(let i=0;i<previous.length;i+=2){const rec=s.history.find(h=>h.type==='match'&&h.round===r&&h.winner&&h.ids.includes(previous[i]));next.push(rec?.winner||null)}rounds.push(next)}
  const labels=['ROUND 32','BEST 16','BEST 8','SEMI FINAL','FINAL','CHAMPION'];
  const html=rounds.map((ids,r)=>'<section class="festival-bracket-round" style="--bracket-step:'+48*2**r+'px"><h2>'+labels[r]+'</h2><div class="festival-bracket-slots">'+ids.map((id,i)=>{const c=id?p(id):null,won=id&&rounds[r+1]?.includes(id),lost=id&&s.history.some(h=>h.round===r&&h.winner&&h.ids.includes(id)&&h.winner!==id);return '<article class="bracket-slot '+(c&&!c.cpu?'human-banner ':'')+(id===highlight?'bracket-advance ':'')+(won?'bracket-won ':'')+(lost?'bracket-lost':'')+'" '+(id?'data-bracket-player="'+id+'"':'')+'>'+ (c?'<img src="'+c.img+'" alt=""><span>'+esc(c.name)+'<small>'+(!c.cpu?'PLAYER '+c.no:won?'勝ち上がり':lost?'敗退':'CPU')+'</small></span>':'<span>対戦待ち</span>')+'</article>'}).join('')+'</div></section>').join('');
  view(highlight?'勝ち上がり決定！':'32名 · TOURNAMENT',scope(false,highlight?p(highlight).name+' が次のステージへ！':'4ブロックから、頂点へ。横に送ると決勝まで確認できます。')+'<nav class="bracket-nav" aria-label="ブロックへ移動">'+['A','B','C','D'].map((label,i)=>'<button data-block="'+i+'">'+label+'ブロック</button>').join('')+'</nav><div class="festival-bracket" tabindex="0" aria-label="32名トーナメント表">'+html+'</div>'+button(s.champion?'優勝セレモニーへ':'次の勝負へ →'),'festival-bracket-view');on(done);
  screen.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>{const id=s.players[Number(b.dataset.block)*8].id;screen.querySelector('[data-bracket-player="'+id+'"]')?.scrollIntoView({block:'nearest',inline:'start',behavior:'instant'})});
  if(!highlight){const human=s.players.find(p=>!p.cpu);if(human)screen.querySelector('[data-bracket-player="'+human.id+'"]')?.scrollIntoView({block:'nearest',inline:'start',behavior:'instant'})}
  if(highlight){api.beep(1047,160,.025);const slots=screen.querySelectorAll('.bracket-advance');slots[slots.length-1]?.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'})}
 }
 function speech(text,pink=false){return '<aside class="festival-host"><img src="'+(pink?'main/012.png':'assets/commentary/mob-white.png')+'" alt="'+(pink?'モブピンク':'モブホワイト')+'"><p><small>'+(pink?'モブピンク · CLEAR LINE':'モブホワイト · LIVE')+'</small><strong>'+text+'</strong></p></aside>'}
 function announce(heading,text,ids,next,cls=''){
  const groups=cls.includes('festival-match-start')?[...new Set(ids.map(id=>p(id).group))]:[];
  const versus=groups.length===2?'<div class="festival-versus-banner"><span>GROUP <b>'+String.fromCharCode(65+groups[0])+'</b></span><strong>VS</strong><span>GROUP <b>'+String.fromCharCode(65+groups[1])+'</b></span></div>':'';
  view(heading,versus+speech(text)+rows(ids)+button(),cls);on(next);
 }
 function setup(which){
  stop();mode=which;selected=[];count=1;
  let old;try{old=JSON.parse(localStorage.getItem(SAVE))}catch{}
  view(TITLES[mode],'<p>'+({tournament:'32名の1対1。準決勝から3ゲーム合計。高ランク4名を別ブロックに配置。',white:'40名でクリアラインに挑戦。未達成で脱落、最後の1名が優勝。',world:'80名・4グループの総当たり交流戦。総合上位20名が点灯決勝へ。'}[mode])+'</p><label>プレイヤー人数<select id="festivalCount">'+Array.from({length:9},(_,i)=>'<option value="'+i+'" '+(i===1?'selected':'')+'>'+i+'人'+(!i?'（CPU観戦）':'')+'</option>').join('')+'</select></label>'+(mode==='white'?'<label>難易度<select id="festivalLevel"><option>EASY</option><option>HARD</option><option>INFERNO</option></select></label><p>EASY 65～85 / HARD 70～92 / INFERNO 75～100点</p>':'')+button('キャラクターを選ぶ')+(old?.mode===mode?'<button id="festivalResume" class="secondary">中断した大会を再開</button>':'')+'<button id="festivalHome" class="secondary">ホームへ</button>');
  on(()=>{count=Number(screen.querySelector('#festivalCount').value);level=screen.querySelector('#festivalLevel')?.value||'EASY';choose(0)});
  screen.querySelector('#festivalHome').onclick=api.home;
  if(old?.mode===mode)screen.querySelector('#festivalResume').onclick=()=>{s=old;configure();progress()};
 }
 function choose(index){
  if(index>=count){begin();return}
  window.MobCharacterSelect.show({screen,esc,count,index,slots:selected,top:api.top,beep:api.beep,back:()=>index?choose(index-1):setup(mode),confirm:c=>{selected[index]=c.id;choose(index+1)}});
 }
 function teams(ids){return ids.map(id=>({id,members:[id],name:p(id).name}))}
 function configure(){api.configure(s.players,teams(s.players.map(p=>p.id)),{mode:'festival',title:TITLES[mode]});window.MobHumanPortraits=s.players.filter(p=>!p.cpu).map(p=>p.img)}
 const cpuOnly=ids=>ids.every(id=>p(id).cpu);
 function begin(){
  s=R.create(mode,R.entrants(C.roster,selected,{tournament:32,white:40,world:80}[mode],mode==='tournament'));s.level=level;configure();save();
  if(cpuOnly(s.players.map(p=>p.id))){progress();return}
  if(mode==='world'){groupIntro();return}
  if(mode==='tournament'){bracket(progress);return}
  announce('OPENING · '+TITLES[mode],mode==='white'?'はいです！ 僕からの挑戦状です！ 40名のみんな、最後までついてくるです！':mode==='world'?'はいです！ 世界の頂点へ、80名の挑戦者はこっちらです！！':'はいです！ 32名、負けたら終わりの真剣勝負です！',s.players.map(p=>p.id),progress,'festival-opening festival-roster');
 }
 function pool(){
  const blocked=new Set([...(window.MobPartyLeague.TAG||[]),'treasureDuoParty','minorityMob','focusBombMob','deathGameChallenge','colorBridgeParty','treasureEscapeParty','treasureRuneParty']);
  return api.pool().filter(k=>!blocked.has(k));
 }
 function selectDraw(candidates,take,exclude=[]){return R.draw(pool(),candidates,take,Math.random,exclude)}
 function roulette(draw,done){
  view('運命のルーレット',speech('はいです！ ルーレットを回すです！ 決まるゲームはこっちらです！')+'<div class="festival-wheel-stage"><span>▼</span><div class="festival-wheel" style="--segments:'+draw.choices.length+'"><b>MOB<br>ROULETTE</b></div></div><ol class="festival-candidates">'+draw.choices.map(k=>'<li data-key="'+k+'">'+esc(title(k))+'</li>').join('')+'</ol><div id="festivalPicks" aria-live="polite"></div>'+button('ルーレットを回す！'),'festival-roulette');
  on(()=>{let i=0;const wheel=screen.querySelector('.festival-wheel');wheel.classList.add('spinning');screen.querySelector('#festivalNext').textContent='抽選中…';
   function reveal(){if(!s)return;const key=draw.selected[i++];screen.querySelector('[data-key="'+key+'"]').classList.add('picked');screen.querySelector('#festivalPicks').insertAdjacentHTML('beforeend','<strong>GAME '+String.fromCharCode(64+i)+' · '+esc(title(key))+'</strong>');api.beep(800+i*180,130,.025);if(i<draw.selected.length)later(reveal,700);else{wheel.classList.remove('spinning');const b=screen.querySelector('#festivalNext');b.disabled=false;b.textContent='このゲームで勝負！';b.onclick=()=>{b.disabled=true;done()}}}later(reveal,1400);
  });
 }
 function run(key,ids,secret,done){
  const own=token;screen.classList.toggle('festival-score-secret',secret);
  const finish=points=>{if(own!==token||!s)return;screen.classList.remove('festival-score-secret');done(points)};
  if(key==='focusBombMob'){
   if(ids.every(id=>p(id).cpu)){finish(window.MobLeagueEvents.simulateBomb(ids.map(p),a=>C.cpuScore(C.characterRank(a,{key,title:title(key)}))));return}
   window.MobLeagueEvents.run({key,mode:'king',screen,esc,beep:api.beep,clear:api.clear,top:api.top,valid:()=>own===token&&!!s,entrants:ids.map(id=>({...p(id),team:p(id).name,teamId:id})),done:finish});return;
  }
  api.run(key,teams(ids),{key,phase:s.phase==='groups'?'qualifier':'final',round:s.history.length+1,multiplier:1,hideScores:secret},finish);
 }
 function progress(){
  if(s.champion){champion(s.champion);return}if(s.whiteWins){whiteVictory();return}
  if(mode==='tournament')tournament();else if(mode==='white')white();else world();
 }
 function tournament(){
  const ids=R.bracketPair(s),count=s.bracket.length<=4?3:1;
  if(!s.matchData){s.matchData={draw:selectDraw(count===3?10:5,count),totals:Object.fromEntries(ids.map(id=>[id,0])),played:[],cursor:0};save()}
  const d=s.matchData;
  function playNext(){
   if(d.cursor>=d.draw.selected.length){revealMatch();return}
   const key=d.draw.selected[d.cursor];run(key,ids,true,points=>{ids.forEach(id=>d.totals[id]+=points[id]);d.played.push(key);d.cursor++;save();if(cpuOnly(ids)){playNext();return}view('GAME '+d.cursor+' · 記録を封印',rows(ids,{},true)+'<p>ポイントは勝者発表で公開します。</p>'+button(d.cursor<d.draw.selected.length?'次のゲームへ':'勝者発表へ'));on(playNext)});
  }
  function revealMatch(){
   if(cpuOnly(ids)){publish();return}
   view('勝者は・・！！',rows(ids,{},true)+'<div class="festival-suspense">運命のスコア、解禁。</div>'+button('ポイントを発表！'),'festival-reveal');on(publish);function publish(){
    const result=R.bracketResult(s,d.totals);if(!result.tie)s.matchData=null;save();
    if(cpuOnly(ids)){if(result.tie){const exclude=d.played.length<pool().length?d.played:d.draw.selected;d.draw=selectDraw(5,1,exclude);d.cursor=0;save();later(playNext,0)}else later(progress,0);return}
    view(result.tie?'同点！ 延長戦へ':(result.champion?'決勝決着！':'WINNER！'),scope(false,'対戦の合計ポイント')+rows([...ids].sort((a,b)=>d.totals[b]-d.totals[a]),d.totals)+speech(result.tie?'まだ決まらないです！ 別のゲームで延長戦です！':esc(p(result.winner).name)+'の勝利です！！')+button(result.champion?'優勝セレモニーへ':result.tie?'延長ゲームを抽選':'次の対戦へ'),'festival-win');
    on(()=>{if(result.tie){const exclude=d.played.length<pool().length?d.played:d.draw.selected;d.draw=selectDraw(5,1,exclude);d.cursor=0;save();if(cpuOnly(ids))playNext();else roulette(d.draw,playNext)}else{s.matchData=null;save();bracket(progress,result.winner)}});
   }
  }
  const stage=s.bracket.length===2?'FINAL':s.bracket.length===4?'SEMI FINAL':'BEST '+s.bracket.length;
  if(cpuOnly(ids)){playNext();return}
  announce(stage+' · MATCH '+(s.match+1),count===3?'10候補から3ゲーム！ 合計得点で決着です！':'5候補から1ゲーム！ 1対1の真剣勝負です！',ids,()=>roulette(d.draw,playNext),'festival-versus');
 }
 function white(){
  if(!s.challenge){s.challenge={draw:selectDraw(5,1),limit:R.whiteLimit(s.level)};save()}
  const d=s.challenge;
  const play=()=>run(d.draw.selected[0],s.active,false,points=>{
   const result=R.whiteResult(s,points,d.limit);s.challenge=null;save();
   if(result.whiteWins){whiteVictory();return}if(result.champion){champion(result.champion);return}
   view('CLEAR！ '+result.survivors.length+'名が生存',scope(false,'クリア / 脱落')+'<p>'+esc(title(d.draw.selected[0]))+' · クリアライン '+d.limit+'点</p>'+rows(R.ranked([...result.survivors,...result.out],points).map(r=>r.id),points,false,Object.fromEntries([...result.survivors.map(id=>[id,'✓ クリア']),...result.out.map(id=>[id,'脱落'])]))+button('次の挑戦へ'),'festival-clear');on(progress);
  });
  if(cpuOnly(s.active)){play();return}
  roulette(d.draw,()=>{view('CLEAR LINE · '+d.limit+' pt',speech('今回のクリアラインは '+d.limit+'点！ この得点以上でクリアであります！',true)+'<div class="festival-limit">'+d.limit+'<small> / 100 pt</small></div><h2>'+esc(title(d.draw.selected[0]))+'</h2>'+button('挑戦する！'),'festival-clearline');on(play)});
 }
 function whiteVictory(){
  view('GAME OVER',speech('僕の勝っちです！！')+'<div class="festival-white-win"><img src="assets/commentary/mob-white.png" alt="モブホワイト"><strong>モブホワイト WIN！</strong></div><p>全員脱落。最後まで挑んでくれてありがとうです！</p>'+button('ホームへ'),'festival-gameover');on(()=>{localStorage.removeItem(SAVE);api.home()});api.beep(330,300,.035);
 }
 function standings(heading,ids,scores,done){const sorted=R.ranked(ids,scores).map(r=>r.id);view(heading,scope(!heading.startsWith('GAME '),heading)+rows(sorted,scores)+button(),'festival-results');on(done)}
 function world(){
  if(s.phase==='cutoff'){const d=selectDraw(5,1),ids=[...s.active],play=()=>run(d.selected[0],ids,false,points=>{R.cutoffResult(s,points);save();standings('決勝進出・同点延長戦の結果',ids,points,()=>{if(s.phase==='final')finalists();else world()})});if(cpuOnly(ids))play();else announce('決勝進出・同点延長戦',s.cut.slots+'枠を争うです！ 別ゲームの得点で決めるです！',ids,()=>roulette(d,play));return}
  if(s.phase==='final'||s.phase==='showdown'){worldFinal();return}
  const ids=R.worldActive(s),pair=R.MATCHUPS[s.leg],label=pair.map(i=>String.fromCharCode(65+i)).join(' VS ');
  if(!s.worldDraw){s.worldDraw=selectDraw(10,3);s.legScores={};save()}
  const d=s.worldDraw;
  function nextGame(){const key=d.selected[s.game];run(key,ids,false,points=>{
   const result=R.worldResult(s,points),rec=result.record;if(rec.game===3)s.worldDraw=null;for(const id of ids)s.legScores[id]=(s.legScores[id]||0)+rec.earned[id];save();
   const advance=()=>{s.worldDraw=null;save();if(s.phase==='final')finalists();else world()};
   if(cpuOnly(ids)){if(rec.game<3){nextGame();return}standings(label+' · CPU 3戦の総合結果',ids,s.legScores,advance);return}
   view('GAME '+rec.game+' の結果はこちら！',scope(false,label+' · '+title(key))+rows(R.ranked(ids,points).map(r=>r.id),points,false,rec.earned)+'<p>順位点＋得点ボーナスを総合に加算しました。</p>'+button(),'festival-results');
   on(()=>{if(rec.game<3){standings(label+' · 現在の総合順位',ids,s.legScores,nextGame);return}
    standings(label+' の総合はこっちらです！',ids,s.legScores,()=>standings('A～D・80名の総合はこっちらです！',s.players.map(p=>p.id),s.phase==='final'?s.qualifyingScores:s.scores,()=>{s.worldDraw=null;save();if(s.phase==='final')finalists();else world()}));
   });
  })}
  if(cpuOnly(ids)){nextGame();return}
  announce(label+' 開っ始です！！','はいです！ '+label+'、激突です！！ 10候補から3ゲームで勝負です！',ids,()=>roulette(d,nextGame),'festival-match-start festival-roster');
 }
 function finalists(){announce('決勝に進む上位20名はこっちらです！！','決勝は0点スタート！ 80点で点灯、点灯後の1位で優勝です！ 5人点灯ごとに集中爆弾です！',s.finalists,worldFinal,'festival-qualified')}
 function worldFinal(){
  const bomb=s.phase==='final'&&s.bombQueue>0,draw=bomb?null:selectDraw(5,1),key=bomb?'focusBombMob':draw.selected[0],ids=[...s.active];
  const play=()=>run(key,ids,false,points=>{
   const result=R.worldResult(s,points,{bomb});save();
   if(s.champion){champion(s.champion);return}
   const show=()=>standings('GAME '+s.history.length+' の結果はこちら！',ids,points,()=>standings('決勝の総合順位はこちら！',s.finalists,s.scores,worldFinal));
   if(result.newLit?.length&&!cpuOnly(ids))announce('MATCH POINT · 点灯！','次の単独1位で優勝です！！',result.newLit,show,'festival-ignition');else show();
  });
  if(cpuOnly(ids)){play();return}
  if(bomb)announce('点灯5人ごと・集中爆弾！','1秒ぴったりで止めるです！ 点灯済み選手が1位なら優勝です！',ids,play,'festival-ignition');
  else announce(s.phase==='showdown'?'優勝決定・延長戦！':'FINAL · MATCH POINT','点灯済みの選手は1位で優勝です！',ids,()=>roulette(draw,play));
 }
 function champion(id){
  const winner=p(id);save();view('THE CHAMPION', '<div class="festival-confetti" aria-hidden="true">'+Array.from({length:36},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><div class="festival-champion"><span>★ WORLD OF MOB ★</span><img src="'+winner.img+'" alt="'+esc(winner.name)+'"><h2>'+esc(winner.name)+'</h2><strong>優勝おめでとう！！</strong></div>'+speech('おっめでとうです！！ あなたが最高のチャンピオンです！！')+button('優勝の壁紙・カードを作る')+(mode==='tournament'?'<button id="festivalBracket" class="secondary">トーナメント表を見る</button>':'')+'<button id="festivalFinish" class="secondary">ホームへ</button>','festival-finale');
  api.beep(1047,180,.03);later(()=>api.beep(1319,180,.03),220);later(()=>api.beep(1568,350,.03),480);
  on(()=>window.MobCollectibles.wallpaper({screen,esc,members:[winner],teamName:winner.name,competition:TITLES[mode],done:()=>champion(id)}));
  if(mode==='tournament')screen.querySelector('#festivalBracket').onclick=()=>bracket(()=>champion(id),id);
  screen.querySelector('#festivalFinish').onclick=()=>{localStorage.removeItem(SAVE);api.home()};
 }
 return {setup,stop,active:()=>!!s,snapshot:()=>s};
}};
})();
