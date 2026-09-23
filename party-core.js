/* Shared party data and deterministic rules. Ranks are never rendered. */
(function(root){
  'use strict';
  const groups=[
    ['MAIN CHARACTERS',[[1,'モブパティレッド','B'],[2,'モブパティブルー','C'],[3,'モブパティゴールド','A'],[4,'モブパティシルバー','B'],[5,'モブパティトレーナー','C'],[6,'モブパティDJ','C'],[7,'モブパティロボ','B']]],
    ['MOB STORY',[[9,'モブ勇者','SS'],[11,'モブデンデン','S'],[12,'モブピンク','A'],[13,'モブマニー','S']]],
    ['MOB MONSTERS',[[14,'モブスライム','B'],[15,'モブミイラ','B'],[16,'モブサバンナ','A'],[17,'モブロック','C']]],
    ['MOB SHOT',[[18,'モブコドラ','B'],[19,'モブイルカエル','B'],[20,'モブウルフ','C']]],
    ['MOB BR',[[21,'モブテツBR','SS'],[22,'マルモブBR','S'],[23,'モブポヨBR','A']]],
    ['MOB mini game',[[101,'モブドットレッド','E','play/01.png'],[102,'モブドットブルー','E','play/02.png'],[103,'モブドットイエロー','E','play/03.png'],[104,'モブドットグリーン','E','play/04.png'],[105,'モブイタリアン','C','play/05.PNG'],[106,'モブ中華店主','C','play/06.PNG'],[107,'モブみかんティラ','B','play/07.PNG'],[108,'モブスーパーマン','SS','play/08.PNG']]],
    ['ぷにモブ', ['グリーン','イエロー','バイオレット','ピンク','カモフラ','紳士','ブルー','レッド','ライトピンク','ハロウィン'].map((name,i)=>[201+i,`ぷにモブ${name}`,'D',`icon/${String(i+1).padStart(2,'0')}.png`])]
  ];
  const roster=groups.flatMap(([group,rows])=>rows.map(([id,name,rank,img])=>({id,name,rank,group,img:img||`main/${String(id).padStart(3,'0')}.png`})));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function cpuScore(rank='C',random=Math.random){
    const average={SS:91,S:81,A:71,B:61,C:50,D:39,E:29,F:19}[rank]??50;
    const luck=random();
    if(luck<.05)return Math.round(45+random()*15); // Occasional upset, including an SS slump.
    if(luck>.94)return Math.round(70+random()*30); // Even F can have a great round.
    return clamp(Math.round(average+(random()+random()+random()-1.5)*27),0,100);
  }
  function cpuRaw(score,points){
    // Scoring functions are not all monotonic. Search a broad range, then refine
    // around the best candidate; retain a real raw record instead of fake points.
    let best=0,error=Infinity;
    const inspect=v=>{const p=points(v);if(Number.isFinite(p)&&Math.abs(p-score)<error){best=v;error=Math.abs(p-score);}};
    for(let n=0;n<=200;n++)inspect(n);
    for(let scale=100;scale<=1e8;scale*=10)for(let n=1;n<=100;n++)inspect(n*scale/10);
    for(let step=Math.max(1,best/10);step>=.001;step/=10){const center=best;for(let n=-10;n<=10;n++)inspect(Math.max(0,center+n*step));}
    return best;
  }
  function allocateTeams(available,size,teamCount,random=Math.random){
    const pool=[...available],teams=[];
    for(let t=0;t<teamCount;t++){
      const buckets=groups.map(([name])=>pool.filter(c=>c.group===name));
      const full=buckets.filter(b=>b.length>=size);
      const chosen=full.length?full[Math.floor(random()*full.length)].slice(0,size):[];
      while(chosen.length<size){const remaining=pool.filter(c=>!chosen.includes(c));if(!remaining.length)throw new Error('Not enough unique characters');chosen.push(remaining[Math.floor(random()*remaining.length)]);}
      chosen.forEach(c=>pool.splice(pool.indexOf(c),1));teams.push(chosen);
    }
    return teams;
  }
  const representativeKeys=new Set(['deathGameChallenge','colorBridgeParty','treasureEscapeParty','treasureRuneParty','treasureDuoParty']);
  function genre(g){
    if(representativeKeys.has(g.key))return '代表バトル';
    if(/3D/.test(g.title))return '3D';
    if(/描|なぞ|画家|デザイン/.test(g.sub+' '+g.title))return 'お絵かき';
    if(/覚|記憶|算数|五目|オセロ|何が|探せ|パズル|マージ|脱出|カラートラップ/.test(g.title))return '頭脳・記憶';
    if(/走|ジャンプ|跳|ボウリング|ゴルフ|PK|ホッケー|水泳|ポイント|玉入れ|水切り/.test(g.title))return 'スポーツ';
    if(/サイコロ|あみだ|スロット|宝箱|ババ抜き|ブラックジャック|カードショップ|ルーレット|予想/.test(g.title))return '運・駆け引き';
    return 'アクション';
  }
  function bridgeScore(step,lives){return clamp(step*10+Math.max(0,lives)*10,0,100);}
  function leagueCpuPairs(humanTeams,random=Math.random){
    const used=new Set(humanTeams.flat().map(c=>c.id)),pool=roster.filter(c=>!used.has(c.id));
    const result=humanTeams.map(t=>[...t]);
    const take=group=>{const candidates=pool.filter(c=>!group||c.group===group),fallback=roster.filter(c=>!used.has(c.id)),matching=fallback.filter(c=>c.group===group),source=candidates.length?candidates:pool.length?pool:matching.length?matching:fallback;const c=source[Math.floor(random()*source.length)];const i=pool.indexOf(c);if(i>=0)pool.splice(i,1);return c;};
    // Fill human partners first, then keep full CPU pairs within one collaboration.
    result.filter(t=>t.length===1).forEach(t=>t.push(take(t[0].group)));
    result.filter(t=>!t.length).forEach(t=>{const groups=[...new Set(pool.map(c=>c.group))].filter(g=>pool.filter(c=>c.group===g).length>=2);const g=groups[Math.floor(random()*groups.length)];t.push(take(g));t.push(take(t[0].group));});
    return result;
  }
  const core={groups,roster,cpuScore,cpuRaw,allocateTeams,leagueCpuPairs,representativeKeys,genre,bridgeScore};
  if(typeof module!=='undefined'&&module.exports)module.exports=core;
  root.MobPartyCore=core;
})(typeof window!=='undefined'?window:globalThis);
