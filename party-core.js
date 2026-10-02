/* Shared party data and deterministic rules. Ranks are never rendered. */
(function(root){
  'use strict';
  const groups=[
    ['MAIN CHARACTERS',[[1,'モブパティレッド','B'],[2,'モブパティブルー','C+'],[3,'モブパティゴールド','A'],[4,'モブパティシルバー','B'],[5,'モブパティトレーナー','C'],[6,'モブパティDJ','C'],[7,'モブパティロボ','B'],[46,'モブボタン','D--C+','main/46.png'],[47,'モブスティック','D--C+','main/47.png'],[48,'モブキー','D--C+','main/48.png'],[49,'モブカード','D+-B-','main/49.png'],[50,'モブハート','D+-B-','main/50.png'],[51,'モブチップ','D+-B-','main/51.png'],[52,'モブベッド','D+-B-','main/52.png'],[53,'モブ62モデル','D+-B-','main/53.png'],[54,'モブ63モデル','D+-B-','main/54.png'],[55,'モブ長浜カエル','D+-B-','main/55.png'],[56,'モブモンスターDJ','C+-B+','main/56.png'],[79,'モブサイレンサー','C-B+','main/79.png'],[80,'モブバレット','C+-A-','main/80.png']]],
    ['MOB STORY',[[9,'モブ勇者','SS'],[11,'モブデンデン','S'],[12,'モブピンク','A'],[13,'モブマニー','S'],[24,'モブイルカエル(酒場)','A'],[25,'モブコーチ','C-A'],[26,'モブゴンゾー','C-A'],[27,'モブマテリア','B-A']]],
    ['MOB MONSTERS',[[14,'モブスライム','B'],[15,'モブミイラ','B'],[16,'モブサバンナ','A'],[17,'モブロック','C-B+'],[81,'モブホーク','A+','main/81.png'],[82,'ミラモブ','A+-S','main/82.png']]],
    ['MOB SHOT',[[18,'モブコドラ','B+'],[19,'モブイルカエル','B+'],[20,'モブウルフ','C'],[38,'モブフワパーカー','C-B+','main/38.png'],[39,'モブシブパーカー','C-B+','main/39.png'],[40,'モブ探偵','B','main/40.png'],[41,'モブトイプー','B-A-','main/41.png'],[42,'モブカエル忍者','B-A-','main/42.png'],[43,'モブテツMS','A+','main/43.png'],[44,'モブウィザード','A','main/44.png'],[45,'あのヒーローMS','SS','main/45.png']]],
    ['MOB BR',[[21,'モブテツBR','SS'],[22,'マルモブBR','S'],[23,'モブポヨBR','A'],[32,'モブマックスBR','S'],[33,'モブジョーダンBR','A'],[34,'モブレオンBR','A'],[35,'モブティラBR','B-A+'],[36,'モブラプBR','B-A'],[37,'モブサウルスBR','B-A']]],
    ['Wonder UNITY',[[28,'モブラプトル','B-A'],[29,'モブティラノ','B-A'],[30,'モブプテラ','C-A'],[31,'モブペンギン','B']]],
    ['MOB mini game',[[101,'モブドットレッド','E-D','play/01.png'],[102,'モブドットブルー','E-D','play/02.png'],[103,'モブドットイエロー','E-D','play/03.png'],[104,'モブドットグリーン','E-D','play/04.png'],[105,'モブイタリアン','C-B','play/05.PNG'],[106,'モブ中華店主','C-B','play/06.PNG'],[107,'モブみかんティラ','B-A','play/07.PNG'],[108,'モブスーパーマン','SS','play/08.PNG']]],
    ['ヒーローベル',[[61,'モブラプサンタ','D+-B-','main/61.png'],[62,'モブトナッチ','D+-B-','main/62.png'],[63,'モブポテイチゴ','D+-B-','main/63.png'],[64,'モブベルマージョ','C+-A+','main/64.png']]],
    ['MOB ARTIST初代',[[57,'モブわたあめ','B+-A-','main/57.png'],[58,'モブネコクー(初代)','B+-A-','main/58.png'],[59,'モブシュガー','C+-A+','main/59.png'],[60,'モブくん(初代)','A-S-','main/60.png']]],
    ['モブレーサーズ',['モブドリパープル','モブドリグリーン','モブドリブラウン','モブドリレッド','モブインカム','モブインコース','モブダート','モブアンカー','モブカワラノコ','モブツキクナイ'].map((name,i)=>[65+i,name,'D-C+',`main/${65+i}.png`])],
    ['モブボクシング',[[75,'モブスクリュー','C+-B-','main/75.png'],[76,'モブレナード','C+-B+','main/76.png'],[77,'モブスモーキン','C-A','main/77.png'],[78,'モブデンプシー','C-A-','main/78.png']]],
    ['ぷにモブ', ['グリーン','イエロー','バイオレット','ピンク','カモフラ','紳士','ブルー','レッド','ライトピンク','ハロウィン'].map((name,i)=>[201+i,`ぷにモブ${name}`,i===9?'D+':'D',`icon/${String(i+1).padStart(2,'0')}.png`])]
  ];
  const roster=groups.flatMap(([group,rows])=>rows.map(([id,name,rank,img])=>({id,name,rank,group,img:img||`main/${String(id).padStart(3,'0')}.png`})));
  // The tavern Ilukaeru belongs to STORY; SHOT's namesake is a different character.
  const preferredCpuTags=[[9,12],[11,13],[24,25],[26,27],[14,17],[15,16],[21,22],[22,23],[32,33],[35,36],[18,19],[18,20],[38,39],[40,41],[42,44],[45,43],[81,82]];
  const pick=(items,random)=>items[Math.floor(random()*items.length)];
  function preferredPartners(anchor,pool){return pool.filter(c=>preferredCpuTags.some(pair=>pair.includes(anchor.id)&&pair.includes(c.id)));}
  function takeCpuPartner(anchor,pool,random){
    if(!pool.length)throw Error('Not enough unique characters');
    const preferred=preferredPartners(anchor,pool),same=pool.filter(c=>c.group===anchor.group);
    const nearest=Math.min(...pool.map(c=>Math.abs(rankValue(c.rank)-rankValue(anchor.rank))));
    const candidates=preferred.length?preferred:same.length?same:pool.filter(c=>Math.abs(rankValue(c.rank)-rankValue(anchor.rank))===nearest);
    const c=pick(candidates,random);pool.splice(pool.indexOf(c),1);return c;
  }
  function takeCpuPair(pool,random){
    if(pool.length<2)throw Error('Not enough unique characters');
    const hero=pool.find(c=>c.id===9);
    if(hero){pool.splice(pool.indexOf(hero),1);return [hero,takeCpuPartner(hero,pool,random)];}
    const preferred=preferredCpuTags.filter(pair=>pair.every(id=>pool.some(c=>c.id===id)));
    if(preferred.length){const pair=pick(preferred,random).map(id=>pool.find(c=>c.id===id));pair.forEach(c=>pool.splice(pool.indexOf(c),1));return pair;}
    const fullGroups=[...new Set(pool.map(c=>c.group))].filter(g=>pool.filter(c=>c.group===g).length>=2);
    const group=fullGroups.length?pick(fullGroups,random):null;
    const first=pick(group?pool.filter(c=>c.group===group):pool,random);pool.splice(pool.indexOf(first),1);
    return [first,takeCpuPartner(first,pool,random)];
  }
  const rankOrder=['F','E','D-','D','D+','C','C+','B-','B','B+','A-','A','A+','S-','S','SS'];
  function rankParts(rank){const match=String(rank).match(/^(SS|S-?|[ABCD][+-]?|E|F)(?:-(SS|S-?|[ABCD][+-]?|E|F))?$/);return match?[match[1],match[2]||match[1]]:['C','C'];}
  const rankBounds=rank=>rankParts(rank).map(r=>rankOrder.indexOf(r));
  function rankValue(rank){const values={F:0,E:1,'D-':1.75,D:2,'D+':2.5,C:3,'C+':3.5,'B-':3.75,B:4,'B+':4.5,'A-':4.75,A:5,'A+':5.5,'S-':5.75,S:6,SS:7},[lo,hi]=rankParts(rank);return (values[lo]+values[hi])/2;}
  function resolveRank(rank,random=Math.random){const [lo,hi=lo]=rankBounds(rank);return rankOrder[lo+Math.floor(random()*(hi-lo+1))]||'C';}
  function characterRank(player,game={},random=Math.random){
    const c=roster.find(c=>c.img===player.img)||player;
    const {brain,sport,running,flying}=gameTraits(game);
    let rank=c.rank||player.characterRank||'C';
    if(c.id===24&&brain)rank='S';
    if(c.id===26&&sport)rank='A-S';
    if(c.id===27&&brain)rank='A-S';
    if(c.id===20&&running)rank='A+';
    if(c.id===40&&brain)rank='S-SS';
    if(c.id===42&&running)rank='S';
    if(c.id===81&&flying)rank='S';
    if(c.id===82&&brain)rank='SS';
    if(c.group==='モブボクシング'&&/パンチ|格闘|ボクシング/.test(game.title||''))rank='A+';
    if(c.group==='モブレーサーズ'&&running)rank='B--A+';
    if(c.id===33&&flying)rank='S';
    if(c.id===30&&flying)rank='S-SS';
    if(c.id===31&&random()<.2)rank='S';
    if(game.key==='santaClausMob'&&c.group==='ヒーローベル'){const base=rankOrder.indexOf(resolveRank(rank,random));return rankOrder[Math.min(rankOrder.length-1,base+1+(random()<.5?0:1))];}
    return resolveRank(rank,random);
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function cpuScore(rank='C',random=Math.random){
    rank=resolveRank(rank,random);
    const average={SS:91,S:81,'S-':78,'A+':76,A:71,'A-':68,'B+':66,B:61,'B-':58,'C+':55,C:50,'D+':44,D:39,'D-':36,E:29,F:19}[rank]??50;
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
  const tournamentLevels=['ALL','NORMAL','HARD','INFERNO'];
  function tournamentPool(available,count,level,random=Math.random){
    if(count>available.length)throw Error('Not enough unique characters');
    const shuffled=[...available];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    if(level==='ALL'||!tournamentLevels.includes(level))return shuffled.slice(0,count);
    if(level==='NORMAL')return shuffled.sort((a,b)=>rankValue(a.rank)-rankValue(b.rank)).slice(0,count);
    const priority=c=>c.id===9?100:c.id===12?99:rankValue(c.rank);
    if(level==='INFERNO')return shuffled.sort((a,b)=>priority(b)-priority(a)).slice(0,count);
    const high=shuffled.filter(c=>rankValue(c.rank)>=4.5),low=shuffled.filter(c=>rankValue(c.rank)<4.5);
    high.sort((a,b)=>(b.id===9||b.id===12)-(a.id===9||a.id===12));
    const selected=[...high.slice(0,Math.ceil(count/2)),...low.slice(0,Math.floor(count/2))];
    return selected.concat(shuffled.filter(c=>!selected.includes(c))).slice(0,count);
  }
  function allocateTeams(available,size,teamCount,random=Math.random,level=null){
    const pool=level?tournamentPool(available,size*teamCount,level,random):[...available],teams=[];
    for(let t=0;t<teamCount;t++){
      if(size===2){teams.push(takeCpuPair(pool,random));continue;}
      const buckets=groups.map(([name])=>pool.filter(c=>c.group===name));
      const full=buckets.filter(b=>b.length>=size);
      const hero=pool.find(c=>c.id===9),heroGroup=hero?pool.filter(c=>c.group===hero.group):[];
      const chosen=hero?[hero,...heroGroup.filter(c=>c!==hero).sort((a,b)=>(b.id===12)-(a.id===12)).slice(0,size-1)]:full.length?full[Math.floor(random()*full.length)].slice(0,size):[];
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
  function leagueCpuPairs(humanTeams,random=Math.random,level=null){
    const used=new Set(humanTeams.flat().map(c=>c.id)),available=roster.filter(c=>!used.has(c.id));
    const pool=level?tournamentPool(available,humanTeams.length*2-used.size,level,random):available;
    const result=humanTeams.map(t=>[...t]);
    const firstEmpty=result.find(t=>!t.length);
    if(firstEmpty&&pool.some(c=>c.id===9)&&!result.some(t=>t.length===1&&t[0].id===12))firstEmpty.push(...takeCpuPair(pool,random));
    // Fill requested partners before a fallback can consume another player's partner.
    const singles=result.filter(t=>t.length===1);
    singles.filter(t=>preferredPartners(t[0],pool).length).forEach(t=>t.push(takeCpuPartner(t[0],pool,random)));
    singles.filter(t=>t.length===1).forEach(t=>t.push(takeCpuPartner(t[0],pool,random)));
    result.filter(t=>!t.length).forEach(t=>t.push(...takeCpuPair(pool,random)));
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
  const core={groups,roster,characterRank,rankValue,resolveRank,cpuScore,cpuRaw,allocateTeams,leagueCpuPairs,tournamentLevels,tournamentPool,representativeKeys,genre,bridgeScore,gameTraits,awardStats,bestPlayWinners};
  if(typeof module!=='undefined'&&module.exports)module.exports=core;
  root.MobPartyCore=core;
})(typeof window!=='undefined'?window:globalThis);
