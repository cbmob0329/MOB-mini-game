/* Shared party data and deterministic rules. Ranks are never rendered. */
(function(root){
  'use strict';
  const groups=[
    ['MAIN CHARACTERS',[[1,'モブパティレッド','B'],[2,'モブパティブルー','C'],[3,'モブパティゴールド','A'],[4,'モブパティシルバー','B'],[5,'モブパティトレーナー','C'],[6,'モブパティDJ','C'],[7,'モブパティロボ','B']]],
    ['MOB STORY',[[9,'モブ勇者','SS'],[11,'モブデンデン','S'],[12,'モブピンク','A'],[13,'モブマニー','S'],[24,'モブイルカエル(酒場)','A'],[25,'モブコーチ','C-A'],[26,'モブゴンゾー','C-A'],[27,'モブマテリア','B-A']]],
    ['MOB MONSTERS',[[14,'モブスライム','B'],[15,'モブミイラ','B'],[16,'モブサバンナ','A'],[17,'モブロック','C-B+']]],
    ['MOB SHOT',[[18,'モブコドラ','B+'],[19,'モブイルカエル','B+'],[20,'モブウルフ','C']]],
    ['MOB BR',[[21,'モブテツBR','SS'],[22,'マルモブBR','S'],[23,'モブポヨBR','A'],[32,'モブマックスBR','S'],[33,'モブジョーダンBR','A'],[34,'モブレオンBR','A'],[35,'モブティラBR','B-A+'],[36,'モブラプBR','B-A'],[37,'モブサウルスBR','B-A']]],
    ['Wonder UNITY',[[28,'モブラプトル','B-A'],[29,'モブティラノ','B-A'],[30,'モブプテラ','C-A'],[31,'モブペンギン','B']]],
    ['MOB mini game',[[101,'モブドットレッド','E-D','play/01.png'],[102,'モブドットブルー','E-D','play/02.png'],[103,'モブドットイエロー','E-D','play/03.png'],[104,'モブドットグリーン','E-D','play/04.png'],[105,'モブイタリアン','C-B','play/05.PNG'],[106,'モブ中華店主','C-B','play/06.PNG'],[107,'モブみかんティラ','B-A','play/07.PNG'],[108,'モブスーパーマン','SS','play/08.PNG']]],
    ['ぷにモブ', ['グリーン','イエロー','バイオレット','ピンク','カモフラ','紳士','ブルー','レッド','ライトピンク','ハロウィン'].map((name,i)=>[201+i,`ぷにモブ${name}`,'D',`icon/${String(i+1).padStart(2,'0')}.png`])]
  ];
  const roster=groups.flatMap(([group,rows])=>rows.map(([id,name,rank,img])=>({id,name,rank,group,img:img||`main/${String(id).padStart(3,'0')}.png`})));
  const rankOrder=['F','E','D','C','B','B+','A','A+','S','SS'];
  const rankBounds=rank=>String(rank).split('-').map(r=>rankOrder.indexOf(r));
  function rankValue(rank){const values={F:0,E:1,D:2,C:3,B:4,'B+':4.5,A:5,'A+':5.5,S:6,SS:7},[lo,hi=lo]=String(rank).split('-');return (values[lo]+values[hi])/2;}
  function resolveRank(rank,random=Math.random){const [lo,hi=lo]=rankBounds(rank);return rankOrder[lo+Math.floor(random()*(hi-lo+1))]||'C';}
  function characterRank(player,game={},random=Math.random){
    const c=roster.find(c=>c.img===player.img)||player;
    const {brain,sport,running,flying}=gameTraits(game);
    let rank=c.rank||player.characterRank||'C';
    if(c.id===24&&brain)rank='S';
    if(c.id===26&&sport)rank='A-S';
    if(c.id===27&&brain)rank='A-S';
    if(c.id===20&&running)rank='A+';
    if(c.id===33&&flying)rank='S';
    if(c.id===30&&flying)rank='S-SS';
    if(c.id===31&&random()<.2)rank='S';
    return resolveRank(rank,random);
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function cpuScore(rank='C',random=Math.random){
    rank=resolveRank(rank,random);
    const average={SS:91,S:81,'A+':76,A:71,'B+':66,B:61,C:50,D:39,E:29,F:19}[rank]??50;
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
      if(!chosen.length){const largest=Math.max(...buckets.map(b=>b.length)),seeds=buckets.filter(b=>b.length===largest&&b.length);if(seeds.length)chosen.push(...seeds[Math.floor(random()*seeds.length)].slice(0,size));}
      while(chosen.length<size){const remaining=pool.filter(c=>!chosen.includes(c));if(!remaining.length)throw new Error('Not enough unique characters');const anchor=chosen.reduce((n,c)=>n+rankValue(c.rank),0)/chosen.length,nearest=Math.min(...remaining.map(c=>Math.abs(rankValue(c.rank)-anchor))),candidates=remaining.filter(c=>Math.abs(rankValue(c.rank)-anchor)===nearest);chosen.push(candidates[Math.floor(random()*candidates.length)]);}
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
    const take=anchor=>{
      if(!pool.length)throw Error('Not enough unique characters');
      const same=anchor?pool.filter(c=>c.group===anchor.group):pool;
      const nearest=anchor?Math.min(...pool.map(c=>Math.abs(rankValue(c.rank)-rankValue(anchor.rank)))):0;
      const candidates=same.length?same:pool.filter(c=>Math.abs(rankValue(c.rank)-rankValue(anchor.rank))===nearest);
      const c=candidates[Math.floor(random()*candidates.length)];pool.splice(pool.indexOf(c),1);return c;
    };
    result.filter(t=>t.length===1).forEach(t=>t.push(take(t[0])));
    result.filter(t=>!t.length).forEach(t=>{
      const fullGroups=[...new Set(pool.map(c=>c.group))].filter(g=>pool.filter(c=>c.group===g).length>=2);
      const g=fullGroups[Math.floor(random()*fullGroups.length)];
      const candidates=g?pool.filter(c=>c.group===g):pool;
      const first=candidates[Math.floor(random()*candidates.length)];pool.splice(pool.indexOf(first),1);t.push(first,take(first));
    });
    return result;
  }
  function gameTraits(game={}){
    const title=game.title||'',key=game.key||'',category=genre({...game,title:title.replace(/3D/g,'')});
    return {
      brain:category==='頭脳・記憶'||/ブラックジャック|カード|スカウト|集中大爆弾|少数派/.test(title),
      sport:category==='スポーツ'||/ボウリング|フリースロー|ハンマー|砲丸|パンチング|カーリング|ホッケー|ホームラン|ビリヤード/.test(title),
      power:/ハンマー|砲丸|パンチ|トラック運び|綱引き/.test(title)||['rocketPunch','truckHaulMob','punchMachine3DMob','giantHammer3DMob','shotPut3DMob'].includes(key),
      running:['mob50m','hurdleRun','longJumpMob','obstacleRaceMob'].includes(key)||/走|ダッシュ/.test(title)&&!/トロッコ|車|バイク|レーサー/.test(title),
      flying:['launch','bikeJump','ski','parachute','flyingCarpet','skiJump3DMob','mobRocket','rocketPunch'].includes(key)||/空を飛|バイクで飛|スキージャンプ|パラシュート|じゅうたん|ロケット/.test(title)
    };
  }
  // Shared awards use base points, including each player's selected event.
  function awardStats(players,history,lookup=key=>({key})){
    return players.map(p=>{
      const s={p,brain:0,sport:0,power:0,perfect:0,baseTotal:0,played:0,highlight:null};
      for(const r of history){
        const points=r.rawPoints||r.points||{},value=points[p.id];if(value===undefined)continue;
        s.played++;s.baseTotal+=value;
        const traits=gameTraits(lookup(r.selections?.[p.id]||r.key));
        for(const key of ['brain','sport','power'])if(traits[key])s[key]+=value;
        if(value!==100)continue;
        s.perfect++;
        const peers=Object.entries(points).filter(([id])=>id!==p.id&&(!r.selections||r.selections[id]===r.selections[p.id])).map(([,v])=>v);
        const highlight={rarity:1/(1+peers.filter(v=>v===100).length),margin:peers.length?100-peers.reduce((n,v)=>n+v,0)/peers.length:0};
        if(!s.highlight||highlight.rarity>s.highlight.rarity||highlight.rarity===s.highlight.rarity&&highlight.margin>s.highlight.margin)s.highlight=highlight;
      }
      return s;
    });
  }
  function bestPlayWinners(stats){
    return stats.filter(s=>s.highlight).sort((a,b)=>b.highlight.rarity-a.highlight.rarity||b.highlight.margin-a.highlight.margin||b.perfect-a.perfect||b.baseTotal/Math.max(1,b.played)-a.baseTotal/Math.max(1,a.played)||String(a.p.id).localeCompare(String(b.p.id))).slice(0,2);
  }
  const core={groups,roster,characterRank,rankValue,resolveRank,cpuScore,cpuRaw,allocateTeams,leagueCpuPairs,representativeKeys,genre,bridgeScore,gameTraits,awardStats,bestPlayWinners};
  if(typeof module!=='undefined'&&module.exports)module.exports=core;
  root.MobPartyCore=core;
})(typeof window!=='undefined'?window:globalThis);
