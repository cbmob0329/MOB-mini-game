(() => {
'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pct=(n,max)=>max?clamp(n/max*100,0,100):0;
const clone=v=>JSON.parse(JSON.stringify(v));
const GAME_ASSET_VERSION=86;
function versionedPlay(src){if(!src)return'';return /^play\//.test(src)?`${src}${src.includes('?')?'&':'?'}mqv=${GAME_ASSET_VERSION}`:src;}
function loadTestSettings(){try{const v=JSON.parse(localStorage.getItem('mobQuestTestSettingsV1'));if(v&&typeof v==='object')return{enabled:!!v.enabled,fast5:!!v.fast5,allSkills:!!v.allSkills};}catch(_){}return{enabled:false,fast5:false,allSkills:false};}
function saveTestSettings(){try{localStorage.setItem('mobQuestTestSettingsV1',JSON.stringify(state.test));}catch(_){}}
function loadAutoBattlePreference(){try{return localStorage.getItem('mobQuestAutoBattleV1')==='1';}catch(_){return false;}}
function saveAutoBattlePreference(v){try{localStorage.setItem('mobQuestAutoBattleV1',v?'1':'0');}catch(_){}}

const GAME_ITEMS=[
  {id:'01',name:'ライフゼリー',image:'item/01.png',price:500,weight:70,type:'hp',min:30,max:60},
  {id:'02',name:'スーパーライフゼリー',image:'item/02.png',price:2000,weight:30,type:'hp',min:75,max:120},
  {id:'03',name:'ハイパーライフゼリー',image:'item/03.png',price:5000,weight:10,type:'hp',min:200,max:300},
  {id:'04',name:'ウルトラライフゼリー',image:'item/04.png',price:10000,weight:3,type:'hp',min:500,max:600},
  {id:'05',name:'マジックラムネ',image:'item/05.png',price:1000,weight:60,type:'mp',min:20,max:40},
  {id:'06',name:'スーパーマジックラムネ',image:'item/06.png',price:3000,weight:25,type:'mp',min:60,max:100},
  {id:'07',name:'ハイパーマジックラムネ',image:'item/07.png',price:8000,weight:8,type:'mp',min:120,max:180},
  {id:'08',name:'ウルトラマジックラムネ',image:'item/08.png',price:15000,weight:2,type:'mp',min:200,max:250},
  {id:'09',name:'解毒カプセル',image:'item/09.png',price:3000,weight:30,type:'cure',status:'poison'},
  {id:'10',name:'やけどケアカプセル',image:'item/10.png',price:3000,weight:30,type:'cure',status:'burn'},
  {id:'11',name:'アンチマヒカプセル',image:'item/11.png',price:3000,weight:30,type:'cure',status:'paralyze'},
  {id:'12',name:'万能カプセル',image:'item/12.png',price:50000,weight:4,type:'cureAll'},
  {id:'13',name:'グロウアップカプセル',image:'item/13.png',price:20000,weight:5,type:'hpmp',amount:200},
  {id:'14',name:'キングカプセル',image:'item/14.png',price:100000,weight:2,type:'full'},
  {id:'15',name:'激辛カプセル',image:'item/15.png',price:10000,weight:5,type:'battleBuff',stat:'ATK',ratio:.20,minTurns:3,maxTurns:4},
  {id:'16',name:'激冷えカプセル',image:'item/16.png',price:10000,weight:5,type:'battleBuff',stat:'DEF',ratio:.20,minTurns:3,maxTurns:4},
  {id:'17',name:'チルパウダー',image:'item/17.png',price:15000,weight:4,type:'partyHp',amount:150},
  {id:'18',name:'リスポーンビスケット',image:'item/18.png',price:20000,weight:2,type:'revive',ratio:.50},
  {id:'36',name:'経験値レコード',image:'item/36.png',price:0,weight:0,type:'record',recordType:'exp'},
  {id:'37',name:'ゴールドレコード',image:'item/37.png',price:0,weight:0,type:'record',recordType:'gold'},
  {id:'38',name:'ボスレコード',image:'item/38.png',price:0,weight:0,type:'record',recordType:'boss'}
];
const DRINK_SETS=[
  {id:'19',name:'モブトマトジュースセット',image:'item/19.png',price:5000,heal:.30,cure:'poison',desc:'HP・MP30%回復＋毒解除'},
  {id:'20',name:'モブオレンジジュースセット',image:'item/20.png',price:5000,heal:.30,cure:'paralyze',desc:'HP・MP30%回復＋マヒ解除'},
  {id:'21',name:'モブサイダーセット',image:'item/21.png',price:5000,heal:.30,cure:'burn',desc:'HP・MP30%回復＋やけど解除'},
  {id:'22',name:'モブファイヤーオレンジジュースセット',image:'item/22.png',price:9000,heal:.30,buff:{atk:.20},desc:'HP・MP30%回復＋1AREA ATK20%UP'},
  {id:'23',name:'モブウォーターレモンジュースセット',image:'item/23.png',price:9000,heal:.30,buff:{def:.20},desc:'HP・MP30%回復＋1AREA DEF20%UP'},
  {id:'24',name:'モブサンダーシュガージュースセット',image:'item/24.png',price:9000,heal:.30,buff:{spd:.20},desc:'HP・MP30%回復＋1AREA SPD20%UP'},
  {id:'25',name:'モブロックカフェオレセット',image:'item/25.png',price:9000,heal:.30,buff:{mag:.20},desc:'HP・MP30%回復＋1AREA MAG20%UP'},
  {id:'26',name:'モブダークベリージュースセット',image:'item/26.png',price:15000,heal:.30,buff:{all:.10},desc:'HP・MP30%回復＋1AREA 全能力10%UP'},
  {id:'27',name:'モブヒーローミルクセーキセット',image:'item/27.png',price:12000,buff:{gold:.50},desc:'1AREA 獲得ゴールド50%UP'},
  {id:'29',name:'モブネオンコットンジュースセット',image:'item/29.png',price:12000,fullHp:true,desc:'HP全回復（追加効果は未確定）'},
  {id:'30',name:'モブメタルアルコールセット',image:'item/30.png',price:50000,buff:{exp:1.00},desc:'1AREA 獲得経験値100%UP'},
  {id:'31',name:'モブローズジュースセット',image:'item/31.png',price:15000,heal:.30,cureAll:true,desc:'HP・MP30%回復＋状態異常全解除'},
  {id:'32',name:'モブグレープジュースセット',image:'item/32.png',price:5000,heal:.40,desc:'HP・MP40%回復'},
  {id:'33',name:'モブメロンソーダセット',image:'item/33.png',price:5000,hpHeal:.60,desc:'HP60%回復'},
  {id:'34',name:'モブアップルジュースセット',image:'item/34.png',price:5000,mpHeal:.60,desc:'MP60%回復'},
  {id:'35',name:'モブメタルジュースセット',image:'item/35.png',price:25000,buff:{exp:.50},desc:'1AREA 獲得経験値50%UP'}
];
const WEAPONS=[{"id":"01","name":"MOBソード","type":"大剣","attribute":"無","stats":{"atk":5},"price":5000,"season":1,"image":"wepon/01.png","shop":true,"traitLabel":"","traits":[]},{"id":"02","name":"MOBの太刀","type":"太刀","attribute":"無","stats":{"atk":4,"spd":1},"price":5000,"season":1,"image":"wepon/02.png","shop":true,"traitLabel":"","traits":[]},{"id":"03","name":"MOBスティック","type":"杖","attribute":"無","stats":{"atk":2,"mag":3},"price":5000,"season":1,"image":"wepon/03.png","shop":true,"traitLabel":"","traits":[]},{"id":"04","name":"MOBハンドガン","type":"銃","attribute":"無","stats":{"atk":5},"price":5000,"season":1,"image":"wepon/04.png","shop":true,"traitLabel":"","traits":[]},{"id":"05","name":"MOBスピア","type":"槍","attribute":"無","stats":{"atk":4},"price":5000,"season":1,"image":"wepon/05.png","shop":true,"traitLabel":"会心率+2%","traits":[{"kind":"crit","value":0.02}]},{"id":"06","name":"モブファイアソード","type":"大剣","attribute":"火","stats":{"atk":9},"price":10000,"season":2,"image":"wepon/06.png","shop":false,"traitLabel":"火属性耐性+5%","traits":[{"kind":"resist","element":"火","value":0.05}]},{"id":"07","name":"モブウォーターソード","type":"大剣","attribute":"水","stats":{"atk":8,"def":2},"price":10000,"season":2,"image":"wepon/07.png","shop":false,"traitLabel":"水属性耐性+5%","traits":[{"kind":"resist","element":"水","value":0.05}]},{"id":"08","name":"モブサンダーソード","type":"大剣","attribute":"雷","stats":{"atk":8,"spd":2},"price":10000,"season":2,"image":"wepon/08.png","shop":false,"traitLabel":"雷属性耐性+5%","traits":[{"kind":"resist","element":"雷","value":0.05}]},{"id":"09","name":"モブウィングソード","type":"大剣","attribute":"風","stats":{"atk":8,"spd":2},"price":12000,"season":2,"image":"wepon/09.png","shop":false,"traitLabel":"回避率+3%","traits":[{"kind":"evade","value":0.03}]},{"id":"10","name":"モブウォータースティック","type":"杖","attribute":"水","stats":{"atk":3,"mag":6},"price":10000,"season":2,"image":"wepon/10.png","shop":false,"traitLabel":"水属性魔法の消費MP-10%","traits":[{"kind":"magicMpCut","element":"水","value":0.1}]},{"id":"11","name":"モブウィングスティック","type":"杖","attribute":"風","stats":{"atk":2,"mag":6},"price":13000,"season":2,"image":"wepon/11.png","shop":false,"traitLabel":"風属性魔法使用時、30%の確率で威力50%の追撃魔法が発生","traits":[{"kind":"magicFollowup","element":"風","chance":0.3,"power":0.5}]},{"id":"12","name":"モブライトニングスティック","type":"杖","attribute":"光","stats":{"atk":3,"mag":6},"price":13000,"season":2,"image":"wepon/12.png","shop":false,"traitLabel":"闇属性モンスターに魔法でダメージを与えた時、自身のHP50回復","traits":[{"kind":"darkMagicHitHeal","amount":50}]},{"id":"13","name":"モブアースロッド","type":"杖","attribute":"地","stats":{"atk":3,"mag":6},"price":15000,"season":2,"image":"wepon/13.png","shop":false,"traitLabel":"通常攻撃時、10%の確率で敵全体攻撃になる","traits":[{"kind":"normalAoe","chance":0.1}]},{"id":"14","name":"モブバブルガン","type":"銃","attribute":"水","stats":{"atk":10,"spd":1},"price":14000,"season":2,"image":"wepon/14.png","shop":false,"traitLabel":"弱点を突いた時、会心率+8%","traits":[{"kind":"weakCrit","value":0.08}]},{"id":"15","name":"モブサンダーガン","type":"銃","attribute":"雷","stats":{"atk":9,"spd":3},"price":16000,"season":2,"image":"wepon/15.png","shop":false,"traitLabel":"通常攻撃時、12%の確率で威力50%の追撃","traits":[{"kind":"normalFollowup","chance":0.12,"power":0.5}]},{"id":"16","name":"モブファイアガン","type":"銃","attribute":"火","stats":{"atk":11},"price":14000,"season":2,"image":"wepon/16.png","shop":false,"traitLabel":"HPが80%以上の時、ATK+5%","traits":[{"kind":"highHpAtk","threshold":0.8,"value":0.05}]},{"id":"17","name":"モブネオンブラスター","type":"銃","attribute":"光","stats":{"atk":10,"mag":2},"price":18000,"season":2,"image":"wepon/17.png","shop":false,"traitLabel":"闇属性モンスターへの与ダメージ+12%","traits":[{"kind":"darkDamage","value":0.12}]},{"id":"18","name":"モブライトスピア","type":"槍","attribute":"光","stats":{"atk":10,"def":2},"price":16000,"season":2,"image":"wepon/18.png","shop":false,"traitLabel":"闇属性から受けるダメージ-8%","traits":[{"kind":"darkResist","value":0.08}]},{"id":"19","name":"モブロックスピア","type":"槍","attribute":"地","stats":{"atk":11,"def":3},"price":18000,"season":2,"image":"wepon/19.png","shop":false,"traitLabel":"防御コマンド使用時、追加で被ダメージ-10%","traits":[{"kind":"guardExtraCut","value":0.1}]},{"id":"20","name":"モブサンドスピア","type":"槍","attribute":"地","stats":{"atk":12,"def":2},"price":17000,"season":2,"image":"wepon/20.png","shop":false,"traitLabel":"HP50%以下の時、DEF+8%","traits":[{"kind":"lowHpDef","threshold":0.5,"value":0.08}]},{"id":"21","name":"モブスカイスピア","type":"槍","attribute":"雷","stats":{"atk":11,"spd":4},"price":22000,"season":2,"image":"wepon/21.png","shop":false,"traitLabel":"会心率+4%","traits":[{"kind":"crit","value":0.04}]},{"id":"22","name":"モブ炎の太刀","type":"太刀","attribute":"火","stats":{"atk":13,"spd":2},"price":20000,"season":2,"image":"wepon/22.png","shop":false,"traitLabel":"HP80%以上の時、会心率+6%","traits":[{"kind":"highHpCrit","threshold":0.8,"value":0.06}]},{"id":"23","name":"モブ風の太刀","type":"太刀","attribute":"風","stats":{"atk":12,"spd":4},"price":19000,"season":2,"image":"wepon/23.png","shop":false,"traitLabel":"通常攻撃時、15%の確率で威力50%の追撃","traits":[{"kind":"normalFollowup","chance":0.15,"power":0.5}]},{"id":"24","name":"モブスライムソード","type":"大剣","attribute":"水","stats":{"atk":18,"def":4},"price":38000,"season":3,"image":"wepon/24.png","shop":false,"traitLabel":"HP50%以下の時、DEF+10%","traits":[{"kind":"lowHpDef","threshold":0.5,"value":0.1}]},{"id":"25","name":"モブロックソード","type":"大剣","attribute":"地","stats":{"atk":20,"def":6},"price":42000,"season":3,"image":"wepon/25.png","shop":false,"traitLabel":"物理攻撃で受けるダメージ-7%","traits":[{"kind":"physicalCut","value":0.07}]},{"id":"26","name":"モブネオンソード","type":"大剣","attribute":"光","stats":{"atk":22,"mag":4},"price":48000,"season":3,"image":"wepon/26.png","shop":false,"traitLabel":"闇属性モンスターへの与ダメージ+15%","traits":[{"kind":"darkDamage","value":0.15}]},{"id":"27","name":"モブネプチューンソード","type":"大剣","attribute":"水","stats":{"atk":24,"def":4},"price":55000,"season":3,"image":"wepon/27.png","shop":false,"traitLabel":"HP満タン時、与ダメージ+10%","traits":[{"kind":"fullHpDamage","value":0.1}]},{"id":"28","name":"モブパルスソード","type":"大剣","attribute":"光","stats":{"atk":24,"spd":6},"price":60000,"season":3,"image":"wepon/28.png","shop":false,"traitLabel":"会心率+6%","traits":[{"kind":"crit","value":0.06}]},{"id":"29","name":"モブスライムスティック","type":"杖","attribute":"水","stats":{"atk":6,"mag":22},"price":45000,"season":3,"image":"wepon/29.png","shop":false,"traitLabel":"水属性魔法の消費MP-15%","traits":[{"kind":"magicMpCut","element":"水","value":0.15}]},{"id":"30","name":"モブロックスティック","type":"杖","attribute":"地","stats":{"atk":7,"mag":24,"def":4},"price":52000,"season":3,"image":"wepon/30.png","shop":false,"traitLabel":"防御コマンド使用時、最大MPの5%回復","traits":[{"kind":"guardMpHeal","value":0.05}]},{"id":"31","name":"モブネプチューンスティック","type":"杖","attribute":"水","stats":{"atk":8,"mag":28},"price":65000,"season":3,"image":"wepon/31.png","shop":false,"traitLabel":"水属性魔法使用時、15%の確率で消費MP0","traits":[{"kind":"magicFree","element":"水","chance":0.15}]},{"id":"32","name":"モブドワーフスティック","type":"杖","attribute":"地","stats":{"atk":10,"mag":30,"def":5},"price":72000,"season":3,"image":"wepon/32.png","shop":false,"traitLabel":"HP50%以下の時、魔法で受けるダメージ-10%","traits":[{"kind":"lowHpMagicCut","threshold":0.5,"value":0.1}]},{"id":"33","name":"モブナイフスティック","type":"杖","attribute":"地","stats":{"atk":16,"mag":24,"spd":6},"price":58000,"season":3,"image":"wepon/33.png","shop":false,"traitLabel":"通常攻撃の会心率+8%","traits":[{"kind":"normalCrit","value":0.08}]},{"id":"34","name":"モブホークガン","type":"銃","attribute":"風","stats":{"atk":28,"spd":6},"price":68000,"season":3,"image":"wepon/34.png","shop":false,"traitLabel":"通常攻撃時、20%の確率で威力50%の追撃","traits":[{"kind":"normalFollowup","chance":0.2,"power":0.5}]},{"id":"35","name":"モブネオンガン","type":"銃","attribute":"光","stats":{"atk":30,"mag":5},"price":70000,"season":3,"image":"wepon/35.png","shop":false,"traitLabel":"闇属性モンスターへの与ダメージ+18%","traits":[{"kind":"darkDamage","value":0.18}]},{"id":"36","name":"モブデンデンガン","type":"銃","attribute":"雷","stats":{"atk":31,"spd":7},"price":74000,"season":3,"image":"wepon/36.png","shop":false,"traitLabel":"会心率+7%","traits":[{"kind":"crit","value":0.07}]},{"id":"37","name":"モブティラガン","type":"銃","attribute":"火","stats":{"atk":34},"price":69000,"season":3,"image":"wepon/37.png","shop":false,"traitLabel":"HP70%以上の時、与ダメージ+10%","traits":[{"kind":"highHpDamage","threshold":0.7,"value":0.1}]},{"id":"38","name":"モブライトスピア","type":"槍","attribute":"光","stats":{"atk":30,"def":8},"price":66000,"season":3,"image":"wepon/38.png","shop":false,"traitLabel":"闇属性から受けるダメージ-10%","traits":[{"kind":"darkResist","value":0.1}]},{"id":"39","name":"モブデンデンスピア","type":"槍","attribute":"雷","stats":{"atk":32,"spd":7},"price":78000,"season":3,"image":"wepon/39.png","shop":false,"traitLabel":"会心発生時、自身のHPを最大HPの3%回復","traits":[{"kind":"critHeal","value":0.03}]},{"id":"40","name":"モブティラスピア","type":"槍","attribute":"火","stats":{"atk":35,"def":4},"price":80000,"season":3,"image":"wepon/40.png","shop":false,"traitLabel":"ボスモンスターへの与ダメージ+10%","traits":[{"kind":"bossDamage","value":0.1}]},{"id":"41","name":"モブエーススピア","type":"槍","attribute":"無","stats":{"atk":34,"spd":8},"price":75000,"season":3,"image":"wepon/41.png","shop":false,"traitLabel":"戦闘開始から3ターンの間、SPD+10%","traits":[{"kind":"startSpd","turns":3,"value":0.1}]},{"id":"42","name":"モブネプチューントライデント","type":"槍","attribute":"水","stats":{"atk":36,"def":8},"price":90000,"season":3,"image":"wepon/42.png","shop":false,"traitLabel":"防御コマンド使用時、最大HPの5%回復","traits":[{"kind":"guardHpHeal","value":0.05}]},{"id":"43","name":"モブ海駅守護","type":"太刀","attribute":"地","stats":{"atk":34,"def":7,"spd":5},"price":77000,"season":3,"image":"wepon/43.png","shop":false,"traitLabel":"HP50%以下の時、被ダメージ-10%","traits":[{"kind":"lowHpDamageCut","threshold":0.5,"value":0.1}]},{"id":"44","name":"モブパーティー赤刀","type":"太刀","attribute":"火","stats":{"atk":36,"spd":8},"price":82000,"season":3,"image":"wepon/44.png","shop":false,"traitLabel":"会心率+8%","traits":[{"kind":"crit","value":0.08}]},{"id":"45","name":"モブパーティー青刀","type":"太刀","attribute":"水","stats":{"atk":35,"def":4,"spd":9},"price":84000,"season":3,"image":"wepon/45.png","shop":false,"traitLabel":"回避率+5%","traits":[{"kind":"evade","value":0.05}]},{"id":"46","name":"モブ三光の太刀","type":"太刀","attribute":"光","stats":{"atk":40,"mag":6,"spd":10},"price":95000,"season":3,"image":"wepon/46.png","shop":false,"traitLabel":"光属性弱点を突いた時、与ダメージ+15% 会心率+5%","traits":[{"kind":"weakDamage","element":"光","value":0.15},{"kind":"crit","value":0.05}]},{"id":"47","name":"モブタフネスソード","type":"大剣","attribute":"地","stats":{"atk":44,"def":10},"price":125000,"season":4,"image":"wepon/47.png","shop":false,"traitLabel":"物理攻撃で受けるダメージ-10%","traits":[{"kind":"physicalCut","value":0.1}]},{"id":"48","name":"モブテツソード","type":"大剣","attribute":"地","stats":{"atk":48,"def":12},"price":118000,"season":4,"image":"wepon/48.png","shop":false,"traitLabel":"地属性耐性+15%","traits":[{"kind":"resist","element":"地","value":0.15}]},{"id":"49","name":"モブエンジェルソード","type":"大剣","attribute":"光","stats":{"atk":50,"mag":10},"price":142000,"season":4,"image":"wepon/49.png","shop":false,"traitLabel":"闇属性モンスターへの与ダメージ+20%","traits":[{"kind":"darkDamage","value":0.2}]},{"id":"50","name":"モブPB2デュアルソード","type":"大剣","attribute":"光","stats":{"atk":50,"spd":14},"price":180000,"season":4,"image":"wepon/50.png","shop":false,"traitLabel":"通常攻撃時、20%の確率で威力60%の追撃","traits":[{"kind":"normalFollowup","chance":0.2,"power":0.6}]},{"id":"51","name":"モブPB2レッドソード","type":"大剣","attribute":"火","stats":{"atk":56,"spd":6},"price":155000,"season":4,"image":"wepon/51.png","shop":false,"traitLabel":"HP80%以上の時、与ダメージ+12%","traits":[{"kind":"highHpDamage","threshold":0.8,"value":0.12}]},{"id":"52","name":"モブPB2ブルーソード","type":"大剣","attribute":"水","stats":{"atk":54,"def":10},"price":150000,"season":4,"image":"wepon/52.png","shop":false,"traitLabel":"HP50%以下の時、DEF+15%","traits":[{"kind":"lowHpDef","threshold":0.5,"value":0.15}]},{"id":"53","name":"モブピンクスティック","type":"杖","attribute":"光","stats":{"atk":12,"mag":50,"spd":6},"price":138000,"season":4,"image":"wepon/53.png","shop":false,"traitLabel":"光属性魔法の消費MP-15%","traits":[{"kind":"magicMpCut","element":"光","value":0.15}]},{"id":"54","name":"モブパッションフレイムスティック","type":"杖","attribute":"火","stats":{"atk":14,"mag":56},"price":160000,"season":4,"image":"wepon/54.png","shop":false,"traitLabel":"火属性魔法使用時、20%の確率で消費MP0","traits":[{"kind":"magicFree","element":"火","chance":0.2}]},{"id":"55","name":"モブ星の杖","type":"杖","attribute":"無","stats":{"atk":18,"mag":54,"spd":10},"price":152000,"season":4,"image":"wepon/55.png","shop":false,"traitLabel":"魔法使用時、10%の確率で消費MP0","traits":[{"kind":"magicFree","element":null,"chance":0.1}]},{"id":"56","name":"モブ闇の宝石","type":"杖","attribute":"闇","stats":{"atk":14,"mag":60},"price":172000,"season":4,"image":"wepon/56.png","shop":false,"traitLabel":"HP70%以上の時、魔法与ダメージ+15%","traits":[{"kind":"highHpMagicDamage","threshold":0.7,"value":0.15}]},{"id":"57","name":"モブスティックガン","type":"杖・銃","attribute":"雷","stats":{"atk":38,"mag":38,"spd":8},"price":185000,"season":4,"image":"wepon/57.png","shop":false,"traitLabel":"通常攻撃時、20%の確率でMAG依存の追撃が発生 追撃威力50%","traits":[{"kind":"normalMagFollowup","chance":0.2,"power":0.5}]},{"id":"58","name":"モブエンジェルガン","type":"銃","attribute":"光","stats":{"atk":60,"mag":10},"price":165000,"season":4,"image":"wepon/58.png","shop":false,"traitLabel":"闇属性モンスターへの与ダメージ+22%","traits":[{"kind":"darkDamage","value":0.22}]},{"id":"59","name":"モブスミスリボルバー","type":"銃","attribute":"火","stats":{"atk":64,"spd":8},"price":175000,"season":4,"image":"wepon/59.png","shop":false,"traitLabel":"会心率+10%","traits":[{"kind":"crit","value":0.1}]},{"id":"60","name":"モブマトリックスイーグル","type":"銃","attribute":"光","stats":{"atk":62,"spd":12},"price":205000,"season":4,"image":"wepon/60.png","shop":false,"traitLabel":"通常攻撃時、25%の確率で威力50%の追撃","traits":[{"kind":"normalFollowup","chance":0.25,"power":0.5}]},{"id":"61","name":"モブグラディシルバー","type":"銃","attribute":"火","stats":{"atk":68,"def":5},"price":190000,"season":4,"image":"wepon/61.png","shop":false,"traitLabel":"ボスモンスターへの与ダメージ+12%","traits":[{"kind":"bossDamage","value":0.12}]},{"id":"62","name":"モブ憤怒の槍","type":"槍","attribute":"火","stats":{"atk":66,"def":12},"price":200000,"season":4,"image":"wepon/62.png","shop":false,"traitLabel":"HP50%以下の時、与ダメージ+20%","traits":[{"kind":"lowHpDamage","threshold":0.5,"value":0.2}]},{"id":"63","name":"モブデジタルコードスピア","type":"槍","attribute":"光","stats":{"atk":64,"mag":12,"spd":10},"price":210000,"season":4,"image":"wepon/63.png","shop":false,"traitLabel":"通常攻撃時、15%の確率で敵DEFを50%無視","traits":[{"kind":"defIgnore","chance":0.15,"value":0.5}]},{"id":"64","name":"ミラモブの太刀","type":"太刀","attribute":"闇","stats":{"atk":70,"spd":14},"price":225000,"season":4,"image":"wepon/64.png","shop":false,"traitLabel":"会心率+12% 攻撃したモンスターを10%の確率で毒状態にする","traits":[{"kind":"crit","value":0.12},{"kind":"poisonOnHit","chance":0.1}]},{"id":"65","name":"モブテツ一文字","type":"太刀","attribute":"地","stats":{"atk":72,"def":10,"spd":8},"price":215000,"season":4,"image":"wepon/65.png","shop":false,"traitLabel":"物理攻撃で受けるダメージ-10%","traits":[{"kind":"physicalCut","value":0.1}]},{"id":"66","name":"モブスライムの一振り","type":"太刀","attribute":"水","stats":{"atk":75,"spd":10},"price":220000,"season":4,"image":"wepon/66.png","shop":false,"traitLabel":"通常攻撃で与えたダメージの5%分HP回復","traits":[{"kind":"normalLifesteal","value":0.05}]},{"id":"67","name":"モブ魔王の大剣","type":"大剣","attribute":"闇","stats":{"atk":82,"def":8},"price":330000,"season":5,"image":"wepon/67.png","shop":false,"traitLabel":"HP50%以下の時、与ダメージ+18%","traits":[{"kind":"lowHpDamage","threshold":0.5,"value":0.18}]},{"id":"68","name":"モブ魔女の大剣","type":"大剣","attribute":"光・闇","stats":{"atk":62,"mag":62,"def":8},"price":390000,"season":5,"image":"wepon/68.png","shop":false,"traitLabel":"弱点を突いた時、与ダメージ+20%","traits":[{"kind":"weakDamage","value":0.2}]},{"id":"69","name":"モブアンロックソード","type":"大剣","attribute":"地","stats":{"atk":86,"def":14},"price":320000,"season":5,"image":"wepon/69.png","shop":false,"traitLabel":"ボスモンスターへの与ダメージ+15%","traits":[{"kind":"bossDamage","value":0.15}]},{"id":"70","name":"モブデンデンソード","type":"大剣","attribute":"雷","stats":{"atk":88,"spd":14},"price":360000,"season":5,"image":"wepon/70.png","shop":false,"traitLabel":"通常攻撃時、20%の確率で威力60%の追撃","traits":[{"kind":"normalFollowup","chance":0.2,"power":0.6}]},{"id":"71","name":"モブニョロの大剣","type":"大剣","attribute":"火","stats":{"atk":92,"spd":8},"price":345000,"season":5,"image":"wepon/71.png","shop":false,"traitLabel":"HP70%以上の時、与ダメージ+15%","traits":[{"kind":"highHpDamage","threshold":0.7,"value":0.15}]},{"id":"72","name":"ウルモブソード","type":"大剣","attribute":"闇","stats":{"atk":96,"spd":14},"price":410000,"season":5,"image":"wepon/72.png","shop":false,"traitLabel":"弱点を突いた時、与ダメージ+25%","traits":[{"kind":"weakDamage","value":0.25}]},{"id":"73","name":"モブリリスの杖","type":"杖","attribute":"闇","stats":{"atk":18,"mag":90},"price":340000,"season":5,"image":"wepon/73.png","shop":false,"traitLabel":"HP50%以下の時、魔法与ダメージ+20%","traits":[{"kind":"lowHpMagicDamage","threshold":0.5,"value":0.2}]},{"id":"74","name":"モブリリススティック","type":"杖","attribute":"闇","stats":{"atk":20,"mag":96,"spd":8},"price":385000,"season":5,"image":"wepon/74.png","shop":false,"traitLabel":"闇属性魔法使用時、25%の確率で威力50%の追撃魔法","traits":[{"kind":"magicFollowup","element":"闇","chance":0.25,"power":0.5}]},{"id":"75","name":"モブ魔女の杖","type":"杖","attribute":"光・闇","stats":{"atk":25,"mag":102,"def":8},"price":450000,"season":5,"image":"wepon/75.png","shop":false,"traitLabel":"弱点を魔法で突いた時、与ダメージ+25%","traits":[{"kind":"magicWeakDamage","value":0.25}]},{"id":"76","name":"モブマニーの杖","type":"杖","attribute":"光","stats":{"atk":20,"mag":108,"spd":10},"price":420000,"season":5,"image":"wepon/76.png","shop":false,"traitLabel":"戦闘勝利時の獲得G+20%","traits":[{"kind":"goldBonus","value":0.2}]},{"id":"77","name":"モブテツの杖","type":"杖","attribute":"地","stats":{"atk":30,"mag":120,"def":12},"price":480000,"season":5,"image":"wepon/77.png","shop":false,"traitLabel":"防御コマンド使用時、最大MPの10%回復","traits":[{"kind":"guardMpHeal","value":0.1}]},{"id":"78","name":"モブ魔女ハンドガン","type":"銃","attribute":"光・闇","stats":{"atk":82,"mag":50,"spd":12},"price":400000,"season":5,"image":"wepon/78.png","shop":false,"traitLabel":"敵の弱点属性を突いた時、会心率+15%","traits":[{"kind":"weakCrit","value":0.15}]},{"id":"79","name":"モブマニーブラスター","type":"銃","attribute":"光","stats":{"atk":104,"mag":10},"price":405000,"season":5,"image":"wepon/79.png","shop":false,"traitLabel":"戦闘勝利時の獲得G+20%","traits":[{"kind":"goldBonus","value":0.2}]},{"id":"80","name":"モブネオンパルスショット","type":"銃","attribute":"光","stats":{"atk":108,"spd":16},"price":460000,"season":5,"image":"wepon/80.png","shop":false,"traitLabel":"通常攻撃時、25%の確率で威力60%の追撃","traits":[{"kind":"normalFollowup","chance":0.25,"power":0.6}]},{"id":"81","name":"モブアンティークリボルバー","type":"銃","attribute":"火","stats":{"atk":112,"spd":12},"price":445000,"season":5,"image":"wepon/81.png","shop":false,"traitLabel":"会心率+15%","traits":[{"kind":"crit","value":0.15}]},{"id":"82","name":"モブアンティークスピア","type":"槍","attribute":"火","stats":{"atk":106,"def":16},"price":430000,"season":5,"image":"wepon/82.png","shop":false,"traitLabel":"物理攻撃で受けるダメージ-10%","traits":[{"kind":"physicalCut","value":0.1}]},{"id":"83","name":"モブローズスピア","type":"槍","attribute":"闇","stats":{"atk":110,"def":10,"spd":12},"price":470000,"season":5,"image":"wepon/83.png","shop":false,"traitLabel":"通常攻撃で与えたダメージの5%分HP回復","traits":[{"kind":"normalLifesteal","value":0.05}]},{"id":"84","name":"モブマニースピア","type":"槍","attribute":"光","stats":{"atk":114,"def":12},"price":415000,"season":5,"image":"wepon/84.png","shop":false,"traitLabel":"戦闘勝利時の獲得G+20%","traits":[{"kind":"goldBonus","value":0.2}]},{"id":"85","name":"モブタフネス二ノ型","type":"太刀","attribute":"地","stats":{"atk":112,"def":14,"spd":18},"price":455000,"season":5,"image":"wepon/85.png","shop":false,"traitLabel":"物理攻撃で受けるダメージ-12% 会心率+8%","traits":[{"kind":"crit","value":0.08},{"kind":"physicalCut","value":0.12}]},{"id":"86","name":"モブネオン妖刀の一","type":"太刀","attribute":"光","stats":{"atk":115,"mag":10,"spd":20},"price":490000,"season":5,"image":"wepon/86.png","shop":false,"traitLabel":"会心率+12% 会心発生時、最大HPの5%回復","traits":[{"kind":"crit","value":0.12},{"kind":"critHeal","value":0.05}]},{"id":"87","name":"モブテツ一輪の花","type":"太刀","attribute":"地","stats":{"atk":118,"def":16,"spd":14},"price":475000,"season":5,"image":"wepon/87.png","shop":false,"traitLabel":"ボスモンスターへの与ダメージ+20%","traits":[{"kind":"bossDamage","value":0.2}]},{"id":"88","name":"モブ海王の太刀","type":"太刀","attribute":"水","stats":{"atk":120,"spd":20},"price":500000,"season":5,"image":"wepon/88.png","shop":false,"traitLabel":"弱点を突いた時、与ダメージ+30% 会心率+15%","traits":[{"kind":"weakDamage","value":0.3},{"kind":"crit","value":0.15}]}];
const ARMORS=[{"id":"01","name":"ぷにモブグリーン","price":5000,"image":"bogu/01.png","stats":{"maxHp":2,"maxMp":1,"atk":2,"def":3,"spd":3,"mag":3,"res":2},"traitLabel":"風耐性+2%","traitsText":["風耐性+2%"]},{"id":"02","name":"ぷにモブレッド","price":5000,"image":"bogu/02.png","stats":{"maxHp":2,"maxMp":1,"atk":3,"def":3,"spd":2,"mag":2,"res":2},"traitLabel":"風耐性+2%","traitsText":["風耐性+2%"]},{"id":"03","name":"ぷにモブピンク","price":5000,"image":"bogu/03.png","stats":{"maxHp":2,"maxMp":1,"atk":2,"def":2,"spd":2,"mag":4,"res":4},"traitLabel":"光耐性+2%","traitsText":["光耐性+2%"]},{"id":"04","name":"ぷにモブパープル","price":5000,"image":"bogu/04.png","stats":{"maxHp":2,"maxMp":3,"atk":2,"def":2,"spd":2,"mag":4,"res":2},"traitLabel":"毒耐性+5%","traitsText":["毒耐性+5%"]},{"id":"05","name":"ぷにモブミント","price":5000,"image":"bogu/05.png","stats":{"maxHp":2,"maxMp":2,"atk":2,"def":2,"spd":4,"mag":4,"res":2},"traitLabel":"風耐性+2%","traitsText":["風耐性+2%"]},{"id":"06","name":"ぷにモブイエロー","price":5000,"image":"bogu/06.png","stats":{"maxHp":3,"maxMp":3,"atk":2,"def":3,"spd":2,"mag":2,"res":3},"traitLabel":"光耐性+2%","traitsText":["光耐性+2%"]},{"id":"07","name":"ぷにモブカモフラ","price":5000,"image":"bogu/07.png","stats":{"maxHp":3,"maxMp":3,"atk":1,"def":4,"spd":2,"mag":2,"res":3},"traitLabel":"地耐性+2%","traitsText":["地耐性+2%"]},{"id":"08","name":"フェザーグリーン","price":10000,"image":"bogu/08.png","stats":{"maxHp":4,"maxMp":3,"atk":3,"def":2,"spd":4,"mag":3,"res":2},"traitLabel":"風耐性+3% / ひるみ耐性+1%","traitsText":["風耐性+3%","ひるみ耐性+1%"]},{"id":"09","name":"フェザーブルー","price":10000,"image":"bogu/09.png","stats":{"maxHp":3,"maxMp":4,"atk":2,"def":3,"spd":4,"mag":3,"res":2},"traitLabel":"水耐性+3% / ひるみ耐性+1%","traitsText":["水耐性+3%","ひるみ耐性+1%"]},{"id":"10","name":"ケロライトブルー","price":10000,"image":"bogu/10.png","stats":{"maxHp":4,"maxMp":4,"atk":4,"def":2,"spd":2,"mag":3,"res":2},"traitLabel":"水耐性+3% / 水属性物理ダメージ軽減+2%","traitsText":["水耐性+3%","水属性物理ダメージ軽減+2%"]},{"id":"11","name":"ぽよフェザーアクア","price":10000,"image":"bogu/11.png","stats":{"maxHp":2,"maxMp":3,"atk":2,"def":2,"spd":4,"mag":4,"res":2},"traitLabel":"風耐性+3% / 水耐性+2%","traitsText":["風耐性+3%","水耐性+2%"]},{"id":"12","name":"ぷにモブホワイト","price":10000,"image":"bogu/12.png","stats":{"maxHp":5,"maxMp":3,"atk":3,"def":2,"spd":3,"mag":3,"res":2},"traitLabel":"光耐性+3% / 闇耐性+2%","traitsText":["光耐性+3%","闇耐性+2%"]},{"id":"13","name":"ぷにモブピンクゴールド","price":10000,"image":"bogu/13.png","stats":{"maxHp":5,"maxMp":3,"atk":3,"def":2,"spd":3,"mag":3,"res":2},"traitLabel":"光耐性+5%","traitsText":["光耐性+5%"]},{"id":"14","name":"ぷにモブブロンズ","price":10000,"image":"bogu/14.png","stats":{"maxHp":4,"maxMp":3,"atk":3,"def":2,"spd":3,"mag":3,"res":4},"traitLabel":"光耐性+3% / ひるみ耐性+25%","traitsText":["光耐性+3%","ひるみ耐性+25%"]},{"id":"15","name":"ミイラホワイト","price":10000,"image":"bogu/15.png","stats":{"maxHp":4,"maxMp":5,"atk":3,"def":2,"spd":3,"mag":3,"res":2},"traitLabel":"闇耐性+4%","traitsText":["闇耐性+4%"]},{"id":"16","name":"ミイラベージュブラウン","price":10000,"image":"bogu/16.png","stats":{"maxHp":4,"maxMp":4,"atk":3,"def":2,"spd":3,"mag":4,"res":4},"traitLabel":"闇耐性+3% / 毒耐性+2%","traitsText":["闇耐性+3%","毒耐性+2%"]},{"id":"17","name":"エジプトアドベンチャー","price":10000,"image":"bogu/17.png","stats":{"maxHp":4,"maxMp":3,"atk":3,"def":3,"spd":3,"mag":3,"res":3},"traitLabel":"闇耐性+4% / ひるみ耐性+2%","traitsText":["闇耐性+4%","ひるみ耐性+2%"]},{"id":"18","name":"ロックアーマー","price":10000,"image":"bogu/18.png","stats":{"maxHp":7,"maxMp":2,"atk":3,"def":5,"spd":2,"mag":2,"res":2},"traitLabel":"地耐性+5%","traitsText":["地耐性+5%"]},{"id":"19","name":"スピードブルー","price":10000,"image":"bogu/19.png","stats":{"maxHp":5,"maxMp":5,"atk":3,"def":2,"spd":5,"mag":1,"res":2},"traitLabel":"水耐性+5%","traitsText":["水耐性+5%"]},{"id":"20","name":"エレガントオレンジ","price":10000,"image":"bogu/20.png","stats":{"maxHp":5,"maxMp":5,"atk":2,"def":2,"spd":2,"mag":2,"res":6},"traitLabel":"火耐性+3% / マヒ耐性+2%","traitsText":["火耐性+3%","マヒ耐性+2%"]},{"id":"21","name":"ウォーターライン","price":30000,"image":"bogu/21.png","stats":{"maxHp":15,"maxMp":8,"atk":5,"def":5,"spd":5,"mag":7,"res":7},"traitLabel":"水耐性+5% / 水魔法ダメージ軽減+2%","traitsText":["水耐性+5%","水魔法ダメージ軽減+2%"]},{"id":"22","name":"グリーンマジシャン","price":30000,"image":"bogu/22.png","stats":{"maxHp":15,"maxMp":8,"atk":5,"def":7,"spd":7,"mag":5,"res":5},"traitLabel":"風耐性+5% / 風魔法ダメージ軽減+2%","traitsText":["風耐性+5%","風魔法ダメージ軽減+2%"]},{"id":"23","name":"クラシックミント","price":30000,"image":"bogu/23.png","stats":{"maxHp":15,"maxMp":10,"atk":5,"def":6,"spd":5,"mag":6,"res":6},"traitLabel":"毒耐性+5% / 風物理ダメージ軽減+2%","traitsText":["毒耐性+5%","風物理ダメージ軽減+2%"]},{"id":"24","name":"クラシックイエロー","price":30000,"image":"bogu/24.png","stats":{"maxHp":15,"maxMp":10,"atk":6,"def":5,"spd":5,"mag":6,"res":6},"traitLabel":"ひるみ耐性+5% / 光物理ダメージ軽減+2%","traitsText":["ひるみ耐性+5%","光物理ダメージ軽減+2%"]},{"id":"25","name":"クラシックオレンジ","price":30000,"image":"bogu/25.png","stats":{"maxHp":15,"maxMp":10,"atk":6,"def":6,"spd":5,"mag":5,"res":6},"traitLabel":"マヒ耐性+5% / 光魔法ダメージ軽減+2%","traitsText":["マヒ耐性+5%","光魔法ダメージ軽減+2%"]},{"id":"26","name":"クラシックピンク","price":30000,"image":"bogu/26.png","stats":{"maxHp":15,"maxMp":10,"atk":5,"def":6,"spd":5,"mag":6,"res":6},"traitLabel":"やけど耐性+5% / 無属性ダメージ軽減+2%","traitsText":["やけど耐性+5%","無属性ダメージ軽減+2%"]},{"id":"27","name":"キャットネオンパープル","price":30000,"image":"bogu/27.png","stats":{"maxHp":15,"maxMp":10,"atk":5,"def":5,"spd":5,"mag":5,"res":7},"traitLabel":"光属性耐性+5% / 光物理ダメージ軽減+2%","traitsText":["光属性耐性+5%","光物理ダメージ軽減+2%"]},{"id":"28","name":"マグマスライムオレンジ","price":30000,"image":"bogu/28.png","stats":{"maxHp":15,"maxMp":10,"atk":7,"def":6,"spd":5,"mag":5,"res":5},"traitLabel":"火属性耐性+5% / 火物理ダメージ軽減+2%","traitsText":["火属性耐性+5%","火物理ダメージ軽減+2%"]},{"id":"29","name":"ネオンパープルハード","price":30000,"image":"bogu/29.png","stats":{"maxHp":15,"maxMp":10,"atk":5,"def":6,"spd":5,"mag":7,"res":5},"traitLabel":"闇属性耐性+5% / 闇物理ダメージ軽減+2%","traitsText":["闇属性耐性+5%","闇物理ダメージ軽減+2%"]},{"id":"30","name":"マグマブルー","price":50000,"image":"bogu/30.png","stats":{"maxHp":20,"maxMp":15,"atk":5,"def":8,"spd":5,"mag":8,"res":6},"traitLabel":"火属性耐性+5% / 火物理ダメージ軽減+2%","traitsText":["火属性耐性+5%","火物理ダメージ軽減+2%"]},{"id":"31","name":"マグマレッド","price":50000,"image":"bogu/31.png","stats":{"maxHp":20,"maxMp":15,"atk":8,"def":5,"spd":7,"mag":6,"res":6},"traitLabel":"火属性耐性+5% / 火魔法ダメージ軽減+2%","traitsText":["火属性耐性+5%","火魔法ダメージ軽減+2%"]},{"id":"32","name":"アビスブルー","price":50000,"image":"bogu/32.png","stats":{"maxHp":20,"maxMp":15,"atk":5,"def":6,"spd":7,"mag":7,"res":7},"traitLabel":"水属性耐性+5% / 水物理ダメージ軽減+2%","traitsText":["水属性耐性+5%","水物理ダメージ軽減+2%"]},{"id":"33","name":"キャプテンコート","price":50000,"image":"bogu/33.png","stats":{"maxHp":20,"maxMp":15,"atk":7,"def":7,"spd":8,"mag":5,"res":5},"traitLabel":"水属性耐性+5% / 混乱耐性+4%","traitsText":["水属性耐性+5%","混乱耐性+4%"]},{"id":"34","name":"スライムコート","price":50000,"image":"bogu/34.png","stats":{"maxHp":20,"maxMp":15,"atk":5,"def":9,"spd":7,"mag":6,"res":5},"traitLabel":"水属性耐性+5% / 物理ダメージ軽減+1%","traitsText":["水属性耐性+5%","物理ダメージ軽減+1%"]},{"id":"35","name":"ネオンハードコート","price":50000,"image":"bogu/35.png","stats":{"maxHp":20,"maxMp":15,"atk":5,"def":7,"spd":6,"mag":7,"res":7},"traitLabel":"光属性耐性+5% / マヒ耐性+4%","traitsText":["光属性耐性+5%","マヒ耐性+4%"]},{"id":"36","name":"ソーサラーコート","price":50000,"image":"bogu/36.png","stats":{"maxHp":20,"maxMp":15,"atk":5,"def":7,"spd":7,"mag":8,"res":5},"traitLabel":"闇属性耐性+5% / 魔法会心率+2%","traitsText":["闇属性耐性+5%","魔法会心率+2%"]},{"id":"37","name":"ケロキンググリーン","price":50000,"image":"bogu/37.png","stats":{"maxHp":20,"maxMp":15,"atk":10,"def":7,"spd":5,"mag":5,"res":5},"traitLabel":"水属性耐性+5% / ひるみ耐性+4%","traitsText":["水属性耐性+5%","ひるみ耐性+4%"]},{"id":"38","name":"ホーングリーン","price":50000,"image":"bogu/38.png","stats":{"maxHp":20,"maxMp":15,"atk":9,"def":9,"spd":5,"mag":4,"res":4},"traitLabel":"地属性耐性+5% / 風属性耐性+2%","traitsText":["地属性耐性+5%","風属性耐性+2%"]},{"id":"39","name":"パープルイルカ","price":80000,"image":"bogu/39.png","stats":{"maxHp":25,"maxMp":18,"atk":8,"def":10,"spd":8,"mag":8,"res":10},"traitLabel":"水属性耐性+7% / 会心率+2%","traitsText":["水属性耐性+7%","会心率+2%"]},{"id":"40","name":"ミュージックオレンジ","price":80000,"image":"bogu/40.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":8,"spd":10,"mag":8,"res":8},"traitLabel":"地属性耐性+7% / 混乱耐性+5%","traitsText":["地属性耐性+7%","混乱耐性+5%"]},{"id":"41","name":"ウェーブ＆ミュージック","price":80000,"image":"bogu/41.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":8,"spd":8,"mag":10,"res":8},"traitLabel":"水属性耐性+7% / マヒ耐性+5%","traitsText":["水属性耐性+7%","マヒ耐性+5%"]},{"id":"42","name":"チルミュージック","price":80000,"image":"bogu/42.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":10,"spd":8,"mag":8,"res":8},"traitLabel":"光属性耐性+7% / 眠り耐性+5%","traitsText":["光属性耐性+7%","眠り耐性+5%"]},{"id":"43","name":"ハードオレンジアーマー","price":80000,"image":"bogu/43.png","stats":{"maxHp":25,"maxMp":18,"atk":8,"def":8,"spd":8,"mag":10,"res":10},"traitLabel":"風属性耐性+7% / マヒ耐性+5%","traitsText":["風属性耐性+7%","マヒ耐性+5%"]},{"id":"44","name":"ハードレッドアーマー","price":80000,"image":"bogu/44.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":10,"spd":8,"mag":8,"res":8},"traitLabel":"火属性耐性+12%","traitsText":["火属性耐性+12%"]},{"id":"45","name":"ラプチーブルー","price":80000,"image":"bogu/45.png","stats":{"maxHp":25,"maxMp":18,"atk":8,"def":8,"spd":10,"mag":10,"res":8},"traitLabel":"水属性耐性+7% / 水属性与ダメージ+5%","traitsText":["水属性耐性+7%","水属性与ダメージ+5%"]},{"id":"46","name":"ティラレッド","price":80000,"image":"bogu/46.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":8,"spd":10,"mag":8,"res":8},"traitLabel":"火属性耐性+7% / 火属性与ダメージ+5%","traitsText":["火属性耐性+7%","火属性与ダメージ+5%"]},{"id":"47","name":"シーパワーブルー","price":80000,"image":"bogu/47.png","stats":{"maxHp":25,"maxMp":18,"atk":10,"def":10,"spd":8,"mag":8,"res":8},"traitLabel":"水属性ダメージ軽減+3% / 水属性与ダメージ+5%","traitsText":["水属性ダメージ軽減+3%","水属性与ダメージ+5%"]},{"id":"48","name":"ネオンブルーコート","price":80000,"image":"bogu/48.png","stats":{"maxHp":25,"maxMp":25,"atk":8,"def":8,"spd":8,"mag":8,"res":8},"traitLabel":"水属性耐性+7% / 光属性与ダメージ+5%","traitsText":["水属性耐性+7%","光属性与ダメージ+5%"]},{"id":"49","name":"ムギワラウミコート","price":80000,"image":"bogu/49.png","stats":{"maxHp":25,"maxMp":18,"atk":8,"def":8,"spd":8,"mag":8,"res":8},"traitLabel":"水属性耐性+10% / 水属性与ダメージ+5%","traitsText":["水属性耐性+10%","水属性与ダメージ+5%"]},{"id":"50","name":"タフネスホーン","price":100000,"image":"bogu/50.png","stats":{"maxHp":40,"maxMp":25,"atk":12,"def":15,"spd":12,"mag":12,"res":15},"traitLabel":"地属性耐性+10% / 会心率+3%","traitsText":["地属性耐性+10%","会心率+3%"]},{"id":"51","name":"マグマホーン","price":100000,"image":"bogu/51.png","stats":{"maxHp":35,"maxMp":25,"atk":13,"def":13,"spd":14,"mag":12,"res":13},"traitLabel":"火属性耐性+10% / 物理ダメージ軽減+3%","traitsText":["火属性耐性+10%","物理ダメージ軽減+3%"]},{"id":"52","name":"ドラゴンコート","price":120000,"image":"bogu/52.png","stats":{"maxHp":38,"maxMp":25,"atk":15,"def":15,"spd":15,"mag":12,"res":12},"traitLabel":"マグマエリア会心率+10% / マグマエリアダメージ軽減+5%","traitsText":["マグマエリア会心率+10%","マグマエリアダメージ軽減+5%"]},{"id":"53","name":"ネオンバルスコート","price":120000,"image":"bogu/53.png","stats":{"maxHp":38,"maxMp":25,"atk":12,"def":15,"spd":12,"mag":15,"res":15},"traitLabel":"ネオン街エリア会心率+10% / ネオン街エリアダメージ軽減+5%","traitsText":["ネオン街エリア会心率+10%","ネオン街エリアダメージ軽減+5%"]},{"id":"54","name":"ネプチューンコート","price":120000,"image":"bogu/54.png","stats":{"maxHp":38,"maxMp":25,"atk":16,"def":15,"spd":16,"mag":10,"res":12},"traitLabel":"海底エリア会心率+10% / 海底エリアダメージ軽減+5%","traitsText":["海底エリア会心率+10%","海底エリアダメージ軽減+5%"]},{"id":"55","name":"デザートコート","price":120000,"image":"bogu/55.png","stats":{"maxHp":38,"maxMp":25,"atk":15,"def":14,"spd":15,"mag":13,"res":12},"traitLabel":"砂漠エリア会心率+10% / 砂漠エリアダメージ軽減+5%","traitsText":["砂漠エリア会心率+10%","砂漠エリアダメージ軽減+5%"]},{"id":"56","name":"デンデンコート","price":120000,"image":"bogu/56.png","stats":{"maxHp":35,"maxMp":28,"atk":15,"def":13,"spd":15,"mag":13,"res":15},"traitLabel":"田舎町エリア会心率+10% / 田舎町エリアダメージ軽減+5%","traitsText":["田舎町エリア会心率+10%","田舎町エリアダメージ軽減+5%"]},{"id":"57","name":"ネコクーコート","price":120000,"image":"bogu/57.png","stats":{"maxHp":35,"maxMp":25,"atk":10,"def":12,"spd":12,"mag":12,"res":12},"traitLabel":"回復量+20% / ダメージ軽減+5%","traitsText":["回復量+20%","ダメージ軽減+5%"]},{"id":"58","name":"ニョロコート","price":120000,"image":"bogu/58.png","stats":{"maxHp":35,"maxMp":25,"atk":13,"def":13,"spd":13,"mag":13,"res":13},"traitLabel":"会心率+5% / やけど無効","traitsText":["会心率+5%","やけど無効"]},{"id":"59","name":"ジェシーコート","price":120000,"image":"bogu/59.png","stats":{"maxHp":38,"maxMp":25,"atk":13,"def":13,"spd":17,"mag":13,"res":14},"traitLabel":"部族村エリア会心率+10% / 部族村エリアダメージ軽減+5%","traitsText":["部族村エリア会心率+10%","部族村エリアダメージ軽減+5%"]},{"id":"60","name":"ピンクコート","price":120000,"image":"bogu/60.png","stats":{"maxHp":30,"maxMp":20,"atk":15,"def":14,"spd":15,"mag":13,"res":12},"traitLabel":"必殺技CT-1 / ダメージ軽減+5%","traitsText":["必殺技CT-1","ダメージ軽減+5%"]},{"id":"61","name":"勇者コート","price":120000,"image":"bogu/61.png","stats":{"maxHp":40,"maxMp":25,"atk":16,"def":16,"spd":12,"mag":16,"res":12},"traitLabel":"会心率+7% / ダメージ軽減+5%","traitsText":["会心率+7%","ダメージ軽減+5%"]},{"id":"62","name":"リーロコート","price":120000,"image":"bogu/62.png","stats":{"maxHp":35,"maxMp":25,"atk":13,"def":14,"spd":13,"mag":12,"res":12},"traitLabel":"毒無効 / ボス与ダメージ+10%","traitsText":["毒無効","ボス与ダメージ+10%"]},{"id":"63","name":"ヒーローコート","price":150000,"image":"bogu/63.png","stats":{"maxHp":45,"maxMp":35,"atk":16,"def":16,"spd":16,"mag":16,"res":16},"traitLabel":"通常攻撃が全体攻撃になる","traitsText":["通常攻撃が全体攻撃になる"]},{"id":"64","name":"リリスコート","price":150000,"image":"bogu/64.png","stats":{"maxHp":40,"maxMp":40,"atk":10,"def":14,"spd":13,"mag":18,"res":18},"traitLabel":"全ての魔法が全体攻撃になる","traitsText":["全ての魔法が全体攻撃になる"]},{"id":"65","name":"タロアートモデル","price":120000,"image":"bogu/65.png","stats":{"maxHp":40,"maxMp":25,"atk":15,"def":15,"spd":15,"mag":15,"res":15},"traitLabel":"状態異常耐性+20% / ダメージ軽減+5%","traitsText":["状態異常耐性+20%","ダメージ軽減+5%"]},{"id":"66","name":"タロアートモデルⅡ","price":120000,"image":"bogu/66.png","stats":{"maxHp":40,"maxMp":25,"atk":15,"def":15,"spd":15,"mag":15,"res":15},"traitLabel":"状態異常耐性+20% / 魔法ダメージ軽減+10%","traitsText":["状態異常耐性+20%","魔法ダメージ軽減+10%"]},{"id":"67","name":"タロアートモデルⅢ","price":120000,"image":"bogu/67.png","stats":{"maxHp":40,"maxMp":25,"atk":15,"def":15,"spd":15,"mag":15,"res":15},"traitLabel":"状態異常耐性+20% / 物理ダメージ軽減+10%","traitsText":["状態異常耐性+20%","物理ダメージ軽減+10%"]}];
const WEAPON_STAT_KEYS=['atk','mag','def','res','spd','maxHp','maxMp'];
const WEAPON_STAT_LABEL={atk:'ATK',mag:'MAG',def:'DEF',res:'MND',spd:'SPD',maxHp:'HP',maxMp:'MP'};


/* ===== MOB QUEST v60 FIGURE ACCESSORY SYSTEM ===== */
const FIGURES=[{"id":"01","name":"ぷにモブグリーン","rarity":"R","statsText":"HP +5","traitText":"無し","tags":["01","02"],"image":"fig/01.png"},{"id":"02","name":"ぷにモブレッド","rarity":"R","statsText":"ATK +1","traitText":"無し","tags":["01","03"],"image":"fig/02.png"},{"id":"03","name":"ぷにモブオレンジ","rarity":"R","statsText":"MAG +1","traitText":"無し","tags":["01","07"],"image":"fig/03.png"},{"id":"04","name":"ぷにモブイエロー","rarity":"R","statsText":"SPD +1","traitText":"無し","tags":["01","04"],"image":"fig/04.png"},{"id":"05","name":"ぷにモブパープル","rarity":"R","statsText":"MND +1","traitText":"無し","tags":["01","05"],"image":"fig/05.png"},{"id":"06","name":"ぷにモブ:ピンク","rarity":"R","statsText":"HP & MP +2","traitText":"無し","tags":["01","06"],"image":"fig/06.png"},{"id":"07","name":"ぷにモブディープレッド","rarity":"R","statsText":"ATK +1","traitText":"無し","tags":["01","03"],"image":"fig/07.png"},{"id":"08","name":"ぷにモブイタリアンレッド","rarity":"R","statsText":"ATK +1","traitText":"無し","tags":["01","03"],"image":"fig/08.png"},{"id":"09","name":"ぷにモブブルー","rarity":"R","statsText":"DEF +1","traitText":"無し","tags":["01","31"],"image":"fig/09.png"},{"id":"10","name":"ぷにモブミントグリーン","rarity":"R","statsText":"HP +5","traitText":"無し","tags":["01","02"],"image":"fig/10.png"},{"id":"11","name":"ぷにモブブロンズ","rarity":"SR","statsText":"HP +3 & DEF +1","traitText":"無し","tags":["01","08","10"],"image":"fig/11.png"},{"id":"12","name":"ぷにモブピンクゴールド","rarity":"SR","statsText":"HP +3 & MP +2","traitText":"無し","tags":["01","06","08"],"image":"fig/12.png"},{"id":"13","name":"ぷにモブゴールド","rarity":"SR","statsText":"HP +4 & ATK +1","traitText":"無し","tags":["01","08"],"image":"fig/13.png"},{"id":"14","name":"ぷにモブシルバーホワイト","rarity":"SR","statsText":"HP +8","traitText":"会心率+2%","tags":["01","08","28"],"image":"fig/14.png"},{"id":"15","name":"ぷにモブハロウィン","rarity":"SR","statsText":"MND +4","traitText":"無し","tags":["01","07","09"],"image":"fig/15.png"},{"id":"16","name":"みかんちゃん","rarity":"MOB","statsText":"HP.MP +15 & DEF +10","traitText":"必殺技CT-1ターン & ダメージ軽減+5%","tags":["08","10","13","23","27","28","30","33","40"],"image":"fig/16.png"},{"id":"17","name":"/////","rarity":"SR","statsText":"DEF +3","traitText":"水属性耐性 +2%","tags":["02","09","10","17"],"image":"fig/17.png"},{"id":"18","name":"モブクラシックグリーン","rarity":"SR","statsText":"DEF +3","traitText":"毒耐性 +1%","tags":["02","10","33"],"image":"fig/18.png"},{"id":"19","name":"モブクラシックピンク","rarity":"SR","statsText":"DEF +3","traitText":"ダメージ軽減 +1%","tags":["06","10","33"],"image":"fig/19.png"},{"id":"20","name":"モブクラシックオレンジ","rarity":"SR","statsText":"DEF +3","traitText":"マヒ耐性 +1%","tags":["07","10","33"],"image":"fig/20.png"},{"id":"21","name":"モブクラシックレッド","rarity":"SR","statsText":"DEF +3","traitText":"やけど耐性 +1%","tags":["03","10","33"],"image":"fig/21.png"},{"id":"22","name":"モブメシ どら焼き","rarity":"SSR","statsText":"DEF +5","traitText":"眠り耐性 +5%","tags":["10","18","29","30"],"image":"fig/22.png"},{"id":"23","name":"モブメシ ピザ","rarity":"SSR","statsText":"ATK +4","traitText":"やけど耐性 +5%","tags":["07","10","18","29"],"image":"fig/23.png"},{"id":"24","name":"モブメシ 肉まん","rarity":"SSR","statsText":"HP +10","traitText":"マヒ耐性 +5%","tags":["10","18","28","29"],"image":"fig/24.png"},{"id":"25","name":"モブメシ パンケーキ","rarity":"SSR","statsText":"ATK +2 & DEF +3","traitText":"眠り耐性 +5%","tags":["04","10","18","33"],"image":"fig/25.png"},{"id":"26","name":"モブKART VR","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"ネオン街の戦闘で全ステータス+5%","tags":["08","10","22","36"],"image":"fig/26.png"},{"id":"27","name":"モブKART ゴールド","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"戦闘獲得コイン +5%","tags":["08","10","22","39"],"image":"fig/27.png"},{"id":"28","name":"モブKART ブラック","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"HP30以下でDFE +10","tags":["09","22","26","36","37"],"image":"fig/28.png"},{"id":"29","name":"モブKART 中華店主","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"やけど耐性 +5%","tags":["03","18","22","32"],"image":"fig/29.png"},{"id":"30","name":"モブKART ヴィラン","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"光属性耐性 +5%","tags":["09","22","25","26","32","37","50"],"image":"fig/30.png"},{"id":"31","name":"モブKART ファイヤー","rarity":"SSR","statsText":"SPD +3 & MND +2","traitText":"火属性耐性 +3%","tags":["03","22","26","32"],"image":"fig/31.png"},{"id":"32","name":"PB2 オンラインロゴ","rarity":"SR","statsText":"HP +10 & MAG +2","traitText":"無し","tags":["11","12","19","40"],"image":"fig/32.png"},{"id":"33","name":"PB2 PB2 Vol.60ロゴ","rarity":"SR","statsText":"MP +10 & MAG +2","traitText":"無し","tags":["11","12","19","40"],"image":"fig/33.png"},{"id":"34","name":"PB2 Vol.62 マスコット","rarity":"SSR","statsText":"ATK +2 & MAG +2","traitText":"会心率+2%","tags":["04","11","27","31","40"],"image":"fig/34.png"},{"id":"35","name":"PB2 Vol.63 マスコット","rarity":"SSR","statsText":"SPD +2 & MND +2","traitText":"会心率+2%","tags":["07","11","12","27","40"],"image":"fig/35.png"},{"id":"36","name":"PB2 Vol.63 マスコットⅡ","rarity":"SSR","statsText":"SPD +2 & MAG +2","traitText":"会心率+2%","tags":["07","11","12","27","40"],"image":"fig/36.png"},{"id":"37","name":"PB2 Vol.63 マスコットⅢ","rarity":"SSR","statsText":"DEF +2 & MND +2","traitText":"会心率+2%","tags":["07","11","12","19","40"],"image":"fig/37.png"},{"id":"38","name":"PB2 クッションモブ","rarity":"SSR","statsText":"HP +10 & MAG +1","traitText":"ダメージ軽減+2%","tags":["06","10","11","19","40"],"image":"fig/38.png"},{"id":"39","name":"PB2 CB 20th ロゴ","rarity":"UR","statsText":"HP+10 & ATK +2 & MAG +2 & MND +2","traitText":"獲得経験値+10%","tags":["04","11","12","19","30","33","40"],"image":"fig/39.png"},{"id":"40","name":"MOB SHOT PET モブコドラ","rarity":"SSR","statsText":"ATK +2 & MP +10","traitText":"火属性魔法与ダメージ+7%","tags":["03","10","14","38"],"image":"fig/40.png"},{"id":"41","name":"MOB SHOT PET イルカエル","rarity":"SSR","statsText":"SPD +2 & MP +10","traitText":"水属性魔法与ダメージ+7%","tags":["10","14","27","31"],"image":"fig/41.png"},{"id":"42","name":"MOB SHOT PET モブネロ","rarity":"SSR","statsText":"SPD +5","traitText":"命中率+10% & 会心率+1%","tags":["14","29","34","36"],"image":"fig/42.png"},{"id":"43","name":"MOB SHOT PET モブトン","rarity":"SSR","statsText":"ATK +3","traitText":"水属性ダメージ軽減+5%","tags":["09","14","31","34","36","45"],"image":"fig/43.png"},{"id":"44","name":"MOB SHOT PET モブデンデン","rarity":"UR","statsText":"ATK +2 & SPD +2 & MND +2","traitText":"雷耐性+10% & 雷属性魔法与ダメージ+5%","tags":["04","13","14","24","27","34","40","43","51"],"image":"fig/44.png"},{"id":"45","name":"MOB SHOT SOUL モブスライム","rarity":"SSR","statsText":"DEF +3 & MND +2 & MAG +1","traitText":"水属性耐性+8%","tags":["02","09","14","23","41"],"image":"fig/45.png"},{"id":"46","name":"MOB SHOT SOUL モブロック","rarity":"SSR","statsText":"DEF +3 & MND +2","traitText":"地属性耐性+10%","tags":["09","14","23","29","41"],"image":"fig/46.png"},{"id":"47","name":"MOB SHOT SOUL モブテツ","rarity":"UR","statsText":"ATK +5 & SPD +5","traitText":"会心率+5% & マヒ耐性+10%","tags":["14","23","24","27","28","29","36","40","49"],"image":"fig/47.png"},{"id":"48","name":"MOB SHOT SOUL モブガーディアン","rarity":"SSR","statsText":"DEF +5 & MND +1","traitText":"ダメージ軽減+2%","tags":["09","14","23","25","29","39","43"],"image":"fig/48.png"},{"id":"49","name":"MOB SHOT SOUL ミラモブ","rarity":"UR","statsText":"DEF+3 & MP +15 & MND +2","traitText":"闇属性耐性+10 & 回避率+3%","tags":["05","09","14","23","25","32","37","42","50"],"image":"fig/49.png"},{"id":"50","name":"MOB SHOT SOUL モブホーク","rarity":"SSR","statsText":"ATK +2 & SPD +2 & MND +2","traitText":"風属性耐性+10%","tags":["04","09","14","23","25","41","50"],"image":"fig/50.png"},{"id":"51","name":"MOB SHOT SOUL モブドラゴン","rarity":"UR","statsText":"ATK +3 & DEF +3 & MND +2","traitText":"火属性耐性+10% & 会心率+3%","tags":["03","09","14","23","25","35","38","47","50"],"image":"fig/51.png"},{"id":"52","name":"スケボーネコクー","rarity":"SSR","statsText":"ATK +2 & SPD +3","traitText":"通常攻撃の与ダメージ+5%","tags":["10","16","27","31","33"],"image":"fig/52.png"},{"id":"53","name":"レコードネコクー","rarity":"SSR","statsText":"MAG +3 & MND +2","traitText":"魔法攻撃の与ダメージ+5%","tags":["10","12","16","27","31","33"],"image":"fig/53.png"},{"id":"54","name":"おやすみネコクー","rarity":"SSR","statsText":"HP+15","traitText":"回復量+10%","tags":["10","16","27","31","33"],"image":"fig/54.png"},{"id":"55","name":"どら焼きネコクー","rarity":"UR","statsText":"DEF +5 & MND +5","traitText":"回復量+10% & 水属性耐性+10%","tags":["10","16","18","27","30","31","33"],"image":"fig/55.png"},{"id":"56","name":"モブKART 実況モブ","rarity":"SSR","statsText":"SPD +4 & MND +1","traitText":"雷属性耐性 +4%","tags":["04","19","22","36"],"image":"fig/56.png"},{"id":"57","name":"モブソフトクリーム","rarity":"SSR","statsText":"MP +15","traitText":"全属性耐性 +1%","tags":["18","27","28","33"],"image":"fig/57.png"},{"id":"58","name":"CBロゴ","rarity":"MOB","statsText":"SPD +5 & MND +5","traitText":"全属性耐性 +3% & 会心率 +3%","tags":["10","11","12","19","23","29","30","40"],"image":"fig/58.png"},{"id":"59","name":"モブDJ 選曲","rarity":"SSR","statsText":"ATK.DEF.SPD +2","traitText":"MP消費 -2%","tags":["05","10","12","27"],"image":"fig/59.png"},{"id":"60","name":"モブDJ ハンズアップ","rarity":"SSR","statsText":"MND.MAG +2","traitText":"魔法与ダメージ+3%","tags":["05","10","12","27"],"image":"fig/60.png"},{"id":"61","name":"MOB BR プレイヤー","rarity":"SSR","statsText":"SPD.MND +2 & HP +10","traitText":"命中率+3%","tags":["05","10","20","36"],"image":"fig/61.png"},{"id":"62","name":"モブゴースト","rarity":"SR","statsText":"SPD.MND +2","traitText":"命中率+3%","tags":["09","23","28"],"image":"fig/62.png"},{"id":"63","name":"メニュー 冒険日記 レア度 SR","rarity":"SR","statsText":"SPD.MND +2","traitText":"探索レアアイテム率 +0.5%","tags":["05","10","20"],"image":"fig/63.png"},{"id":"64","name":"メニュー バトルプログラム レア度 SR","rarity":"SR","statsText":"ATK.DEF +2","traitText":"回避率+0.5%","tags":["06","15","36"],"image":"fig/64.png"},{"id":"65","name":"メニュー ゴールドレコード レア度 SR","rarity":"SR","statsText":"HP +10","traitText":"コイン獲得量 +0.5%","tags":["06","08","15"],"image":"fig/65.png"},{"id":"66","name":"メニュー 経験値レコード レア度 SR","rarity":"SR","statsText":"MP +10","traitText":"経験値獲得量 +0.5%","tags":["06","15","36"],"image":"fig/66.png"},{"id":"67","name":"メニュー ボスレコード レア度 SR","rarity":"SR","statsText":"MAG.MND +2","traitText":"状態異常全耐性 +0.3%","tags":["06","15","25"],"image":"fig/67.png"},{"id":"68","name":"メニュー ドリンクセット レア度 SR","rarity":"SR","statsText":"HP +10","traitText":"回復量 +0.5%","tags":["06","15","18"],"image":"fig/68.png"},{"id":"69","name":"メニュー 椅子で休む レア度 SR","rarity":"SR","statsText":"MP +10","traitText":"回復量 +0.5%","tags":["06","15","33"],"image":"fig/69.png"},{"id":"70","name":"酒場の看板娘 モブイルカエル レア度 UR","rarity":"UR","statsText":"SPD +3 & DEF +3 & MND +2","traitText":"水属性耐性+10% & 会心率+2%","tags":["06","13","15","18","27","33","40"],"image":"fig/70.png"},{"id":"71","name":"鍛冶屋の職人 モブゴンゾー レア度 UR","rarity":"UR","statsText":"ATK +5 & DEF +3","traitText":"地属性耐性+10% & 会心率+2%","tags":["03","13","15","35","36","39","40"],"image":"fig/71.png"},{"id":"72","name":"優しき熱血コーチ モブコーチ レア度 UR","rarity":"UR","statsText":"HP +20 & DEF +3 & MND +2","traitText":"雷属性耐性+10% & 会心率+2%","tags":["08","13","15","28","29","31","40"],"image":"fig/72.png"},{"id":"73","name":"宿舎の癒し モブミータ レア度 UR","rarity":"UR","statsText":"MP +20 & DEF +3 & MND +2","traitText":"無属性耐性+10% & 会心率+2%","tags":["08","13","15","27","29","33","40"],"image":"fig/73.png"},{"id":"74","name":"頼りになる店主 モブマテリア レア度 UR","rarity":"UR","statsText":"MAG +3 & DEF +3 & SPD +2","traitText":"光.闇属性耐性+8% & 会心率+2%","tags":["05","13","15","23","36","37","40"],"image":"fig/74.png"},{"id":"75","name":"メニュー 王の間 レア度 SR","rarity":"SR","statsText":"DEF.MND +2","traitText":"状態異常全耐性 +0.3%","tags":["02","09","15"],"image":"fig/75.png"},{"id":"76","name":"メニュー MOB SHOP レア度 SR","rarity":"SR","statsText":"MAG.MND +2","traitText":"マヒ耐性 +5%","tags":["02","09","15"],"image":"fig/76.png"},{"id":"77","name":"メニュー 宿舎 レア度 SR","rarity":"SR","statsText":"HP+10.MND +2","traitText":"眠り耐性 +5%","tags":["02","09","15"],"image":"fig/77.png"},{"id":"78","name":"メニュー レコードの間 レア度 SR","rarity":"SR","statsText":"MP+10.MND +2","traitText":"回避率 +0.1%","tags":["02","09","15"],"image":"fig/78.png"},{"id":"79","name":"モブキングダムの王様 モブスライムキング","rarity":"SSR","statsText":"DEF +5 & MND +1","traitText":"ダメージ軽減+2%","tags":["02","09","13","17","30","40"],"image":"fig/79.png"},{"id":"80","name":"王様の右腕 モブライトアーム","rarity":"SSR","statsText":"ATK +5 & MND +1","traitText":"通常攻撃与ダメージ+4%","tags":["02","09","13","17","40"],"image":"fig/80.png"},{"id":"81","name":"MOB PARTY マスコット","rarity":"SSR","statsText":"SPD.MND +2 & HP +10","traitText":"命中率+3%","tags":["05","10","12","20","40"],"image":"fig/81.png"},{"id":"82","name":"読みかけの本を読もう","rarity":"SSR","statsText":"SPD.MND +2 & HP +10","traitText":"命中率+3%","tags":["05","10","20","33","40"],"image":"fig/82.png"},{"id":"83","name":"モブ三味線","rarity":"SSR","statsText":"SPD.MND +2 & HP +10","traitText":"命中率+3%","tags":["05","10","12","20","40"],"image":"fig/83.png"},{"id":"84","name":"MOB SHOT リリス四姉妹ソウル 赤","rarity":"SSR","statsText":"MAG.MND +2 & MP +10","traitText":"火属性耐性+5% & 魔法ダメージ軽減+2%","tags":["03","09","23","27","37","50"],"image":"fig/84.png"},{"id":"85","name":"MOB SHOT リリス四姉妹ソウル 黄","rarity":"SSR","statsText":"MAG.ATK +2 & MP +10","traitText":"雷属性耐性+5% & 魔法ダメージ軽減+2%","tags":["04","09","23","27","37","50","51"],"image":"fig/85.png"},{"id":"86","name":"MOB SHOT リリス四姉妹ソウル 青","rarity":"SSR","statsText":"MAG.DEF +2 & MP +10","traitText":"水属性耐性+5% & 魔法ダメージ軽減+2%","tags":["09","23","27","31","37","50"],"image":"fig/86.png"},{"id":"87","name":"MOB SHOT リリス四姉妹ソウル 白","rarity":"SSR","statsText":"MAG +5 & MP +10","traitText":"光属性耐性+5% & 魔法ダメージ軽減+2%","tags":["09","23","27","28","37","50"],"image":"fig/87.png"},{"id":"88","name":"スライム","rarity":"SSR","statsText":"DEF +5","traitText":"水属性耐性 +5%","tags":["02","09","10","17","41"],"image":"figene/01.png"},{"id":"89","name":"モブロック","rarity":"SR","statsText":"DEF +3","traitText":"地属性耐性 +3%","tags":["09","39","41"],"image":"figene/02.png"},{"id":"90","name":"モブテンデビ","rarity":"SR","statsText":"SPD +3","traitText":"水属性耐性 +3%","tags":["09","27","39","41","50"],"image":"figene/03.png"},{"id":"91","name":"モブジョーロ","rarity":"SR","statsText":"ATK +3","traitText":"水属性耐性 +3%","tags":["09","34","39","41"],"image":"figene/04.png"},{"id":"92","name":"モブイワキリ","rarity":"SSR","statsText":"DEF +3","traitText":"雷属性耐性 +5%","tags":["09","32","35","41","51"],"image":"figene/05.png"},{"id":"93","name":"モブサバンナ","rarity":"SR","statsText":"SPD +3","traitText":"地属性与ダメージ +3%","tags":["04","09","36","41"],"image":"figene/06.png"},{"id":"94","name":"モブメラケロ","rarity":"SSR","statsText":"ATK+3 & DEF +3","traitText":"火属性与ダメージ +5%","tags":["03","32","34","40","41"],"image":"figene/07.png"},{"id":"95","name":"モブケロキング","rarity":"SSR","statsText":"DEF +3 & MND +3","traitText":"水属性与ダメージ +5%","tags":["02","09","32","34","41","49"],"image":"figene/08.png"},{"id":"96","name":"モブツルガンナー","rarity":"SSR","statsText":"SPD +5","traitText":"命中率 +5%","tags":["02","09","32","36","41"],"image":"figene/09.png"},{"id":"97","name":"モブミイラ","rarity":"SR","statsText":"DEF +3","traitText":"混乱耐性 +5%","tags":["09","28","42"],"image":"figene/10.png"},{"id":"98","name":"モブネコミイラ","rarity":"SR","statsText":"SPD +3","traitText":"回避率 +2%","tags":["09","27","28","42"],"image":"figene/11.png"},{"id":"99","name":"モブデスヘッド","rarity":"SSR","statsText":"DEF +3 & MAG +3%","traitText":"闇属性耐性 +5%","tags":["09","29","32","37","42","50","49"],"image":"figene/12.png"},{"id":"100","name":"モブポイズン","rarity":"SR","statsText":"MND +3","traitText":"毒耐性 +3%","tags":["09","29","42"],"image":"figene/13.png"},{"id":"101","name":"モブアドベンチャー","rarity":"SR","statsText":"DEF +3","traitText":"ひるみ耐性 +3%","tags":["03","09","27","42"],"image":"figene/14.png"},{"id":"102","name":"モブスナトカゲ","rarity":"SR","statsText":"SPD +3","traitText":"地属性耐性 +3%","tags":["09","36","42","49"],"image":"figene/15.png"},{"id":"103","name":"モブツインソウル","rarity":"SSR","statsText":"MP +15","traitText":"風属性耐性 +3% & 雷属性耐性 +3%","tags":["08","09","23","37","20","42","50","51"],"image":"figene/16.png"},{"id":"104","name":"モブミラバスター","rarity":"SSR","statsText":"DEF +3 & MND +3","traitText":"砂漠での与ダメージ +7%","tags":["09","23","26","32","36","42"],"image":"figene/17.png"},{"id":"105","name":"モブヒトデ","rarity":"SR","statsText":"ATK +3","traitText":"水属性耐性 +3%","tags":["09","36","43"],"image":"figene/18.png"},{"id":"106","name":"モブナイフ","rarity":"SR","statsText":"ATK +3","traitText":"混乱耐性 +3%","tags":["09","26","43","49"],"image":"figene/19.png"},{"id":"107","name":"モブダンサー","rarity":"SR","statsText":"SPD +3","traitText":"混乱耐性 +3%","tags":["09","12","43"],"image":"figene/20.png"},{"id":"108","name":"モブヌルブルー","rarity":"SR","statsText":"SPD +3","traitText":"地属性耐性 +3%","tags":["09","31","43"],"image":"figene/21.png"},{"id":"109","name":"モブバイオリン","rarity":"SSR","statsText":"MND +3 & DEF +3","traitText":"眠り耐性 +5%","tags":["09","26","29","33","36","37","43"],"image":"figene/22.png"},{"id":"110","name":"モブラプチー","rarity":"SSR","statsText":"SPD +3 & DEF +3","traitText":"魔法ダメージ軽減 +3%","tags":["09","31","32","40","43"],"image":"figene/23.png"},{"id":"111","name":"モブティラ","rarity":"SSR","statsText":"ATK +3 & MND +3","traitText":"物理ダメージ軽減 +3%","tags":["03","09","32","40","43"],"image":"figene/24.png"},{"id":"112","name":"モブクウカイ","rarity":"SSR","statsText":"MAG +3 & MND +3","traitText":"全属性耐性 +3%","tags":["05","09","23","26","37","43"],"image":"figene/25.png"},{"id":"113","name":"モブアクイ","rarity":"SSR","statsText":"DEF +3 & MP+10","traitText":"闇属性耐性 +5%","tags":["05","09","23","26","43","50"],"image":"figene/26.png"},{"id":"114","name":"モブシツイ","rarity":"SSR","statsText":"DEF +3 & MP+10","traitText":"闇属性与ダメージ +3%","tags":["05","09","23","26","43","50"],"image":"figene/27.png"},{"id":"115","name":"モブヤマイ","rarity":"SSR","statsText":"DEF +3 & MP+10","traitText":"闇属性魔法消費MP -10%","tags":["05","09","23","26","43","50"],"image":"figene/28.png"},{"id":"116","name":"モブネオントカゲ","rarity":"SR","statsText":"SPD +3","traitText":"会心率 +1%","tags":["08","09","36","44","49"],"image":"figene/29.png"},{"id":"117","name":"モブカイロ","rarity":"SR","statsText":"DEF +3","traitText":"会心率 +1%","tags":["05","09","34","44"],"image":"figene/30.png"},{"id":"118","name":"モブバンケン","rarity":"SR","statsText":"SPD +3","traitText":"光属性耐性 +5%","tags":["09","27","33","44"],"image":"figene/31.png"},{"id":"119","name":"モブスラトレーナー","rarity":"SSR","statsText":"ATK +3 & MP+10","traitText":"会心率 +2%","tags":["02","09","17","35","44"],"image":"figene/32.png"},{"id":"120","name":"モブエネチェイサー","rarity":"SSR","statsText":"DEF +3 & HP+10","traitText":"命中率 +3%","tags":["09","29","32","35","44"],"image":"figene/33.png"},{"id":"121","name":"モブパレットレオン","rarity":"SSR","statsText":"SPD +3 & MP+10","traitText":"毒耐性 +10%","tags":["08","09","29","36","44","49"],"image":"figene/34.png"},{"id":"122","name":"モブコドラ","rarity":"SSR","statsText":"DEF +3 & HP+10","traitText":"火属性耐性 +5%","tags":["09","27","38","40","44"],"image":"figene/35.png"},{"id":"123","name":"モブネオクマ","rarity":"SSR","statsText":"ATK +3 & MP+10","traitText":"火属性耐性 +3%","tags":["09","27","36","40","44"],"image":"figene/36.png"},{"id":"124","name":"モブジンベエ","rarity":"SR","statsText":"ATK +3","traitText":"水属性耐性 +3%","tags":["09","31","36","40","45","49"],"image":"figene/37.png"},{"id":"125","name":"モブネッシー","rarity":"SR","statsText":"DEF +3","traitText":"水属性耐性 +3%","tags":["09","31","39","40","45","51"],"image":"figene/38.png"},{"id":"126","name":"モブバブルドクター","rarity":"SR","statsText":"DEF +3","traitText":"水属性耐性 +3%","tags":["09","31","36","40","45"],"image":"figene/39.png"},{"id":"127","name":"モブシーガード","rarity":"SR","statsText":"DEF +3","traitText":"水属性耐性 +3%","tags":["09","28","31","40","45"],"image":"figene/40.png"},{"id":"128","name":"モブアビスナイト","rarity":"SSR","statsText":"ATK +3 DEF +3","traitText":"水属性与ダメージ +5%","tags":["09","31","36","40","45"],"image":"figene/41.png"},{"id":"129","name":"モブジョーンズ","rarity":"SSR","statsText":"ATK +3 DEF +3","traitText":"水属性与ダメージ +5%","tags":["09","31","32","35","40","45","49"],"image":"figene/42.png"},{"id":"130","name":"モブウェイブ","rarity":"SSR","statsText":"MAG +3 MND +3","traitText":"水属性魔法与ダメージ +10%","tags":["09","31","36","37","40","45"],"image":"figene/43.png"},{"id":"131","name":"モブヒトデヤリ","rarity":"SR","statsText":"ATK +3","traitText":"水属性耐性 +3%","tags":["09","31","36","40","45"],"image":"figene/44.png"},{"id":"132","name":"モブウォリアー","rarity":"SR","statsText":"MAG +3","traitText":"地属性魔法与ダメージ +3%","tags":["09","26","32","37","46","49"],"image":"figene/45.png"},{"id":"133","name":"モブキバ","rarity":"SR","statsText":"SPD +3","traitText":"地属性物理与ダメージ +3%","tags":["07","09","26","32","36","46"],"image":"figene/46.png"},{"id":"134","name":"モブククリ","rarity":"SSR","statsText":"SPD +3","traitText":"毒耐性 +10%","tags":["02","09","26","32","36","46"],"image":"figene/47.png"},{"id":"135","name":"モブタフネス","rarity":"SSR","statsText":"HP +15","traitText":"物理ダメージ軽減 +3%","tags":["09","26","32","35","39","46"],"image":"figene/48.png"},{"id":"136","name":"モブヒスイ","rarity":"SSR","statsText":"MP +10","traitText":"魔法ダメージ軽減 +3%","tags":["05","09","26","32","37","46"],"image":"figene/49.png"},{"id":"137","name":"モブリュウゴウ","rarity":"SSR","statsText":"ATK +5","traitText":"火属性与ダメージ +5%","tags":["09","26","32","35","38","46","49"],"image":"figene/50.png"},{"id":"138","name":"モブマグトカゲ","rarity":"SR","statsText":"ATK +3","traitText":"火属性与ダメージ +3%","tags":["03","09","38","47","49"],"image":"figene/51.png"},{"id":"139","name":"モブヒートロック","rarity":"SR","statsText":"DEF +3","traitText":"火属性ダメージ軽減 +3%","tags":["03","09","39","47"],"image":"figene/52.png"},{"id":"140","name":"モブヒノデビ","rarity":"SR","statsText":"SPD +3","traitText":"回避率 +1%","tags":["03","09","27","47","50"],"image":"figene/53.png"},{"id":"141","name":"モブボムスロー","rarity":"SR","statsText":"ATK +3","traitText":"火属性与ダメージ +3%","tags":["03","09","35","47"],"image":"figene/54.png"},{"id":"142","name":"モブホノテイル","rarity":"SSR","statsText":"ATK +5","traitText":"火属性与ダメージ +5%","tags":["03","09","27","37","47"],"image":"figene/55.png"},{"id":"143","name":"モブヒノタビ","rarity":"SSR","statsText":"MAG +5","traitText":"火属性魔法与ダメージ +10%","tags":["03","09","32","37","47"],"image":"figene/56.png"},{"id":"144","name":"モブブリザード","rarity":"SSR","statsText":"DEF +5","traitText":"水属性ダメージ軽減 +5%","tags":["09","31","32","36","40","47"],"image":"figene/57.png"},{"id":"145","name":"モブフレイム","rarity":"SSR","statsText":"ATK +5","traitText":"火属性与ダメージ +5%","tags":["03","09","32","36","40","47"],"image":"figene/58.png"},{"id":"146","name":"モブフレザード","rarity":"SSR","statsText":"ATK +3 & DEF +3%","traitText":"火属性と水属性の与ダメージ +3%","tags":["03","09","27","31","32","35","47"],"image":"figene/59.png"},{"id":"147","name":"モブマグバスター","rarity":"SSR","statsText":"ATK +5","traitText":"火属性与ダメージ +3% & 会心率1%","tags":["03","09","26","32","35","39","47"],"image":"figene/60.png"},{"id":"148","name":"モブヨーガンスライム","rarity":"SSR","statsText":"DEF +5","traitText":"物理ダメージ軽減 +3% & 会心率1%","tags":["03","09","17","32","39","47","50"],"image":"figene/61.png"},{"id":"149","name":"モブピコダーク","rarity":"SR","statsText":"DEF +3","traitText":"闇属性耐性 +3% & 回避率1%","tags":["05","09","27","37","48"],"image":"figene/62.png"},{"id":"150","name":"モブデビルスライム","rarity":"SR","statsText":"MND +3","traitText":"闇属性与えダメージ +3% & 回避率1%","tags":["02","09","17","27","37","48","50"],"image":"figene/63.png"},{"id":"151","name":"モブプニライダー","rarity":"SR","statsText":"ATK +3","traitText":"会心率 ＋1% & 回避率 +1%","tags":["02","09","17","27","40","48","50"],"image":"figene/64.png"},{"id":"152","name":"モブミニブック","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["08","09","27","32","37","48"],"image":"figene/65.png"},{"id":"153","name":"モブコクピット","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["05","09","32","36","48","50"],"image":"figene/66.png"},{"id":"154","name":"モブアサシン","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["02","09","26","34","36","48","50"],"image":"figene/67.png"},{"id":"155","name":"モブヘルシャドウ","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["03","09","23","26","36","48"],"image":"figene/68.png"},{"id":"156","name":"モブミラヘルド","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["03","09","26","32","36","48","49"],"image":"figene/69.png"},{"id":"157","name":"モブキラウィッチ","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["05","09","27","32","37","48","50"],"image":"figene/70.png"},{"id":"158","name":"モブララウィッチ","rarity":"SSR","statsText":"MND +5","traitText":"魔法会心率 ＋3%","tags":["03","09","27","32","37","40","48","50"],"image":"figene/71.png"},{"id":"159","name":"モブホーク","rarity":"SSR","statsText":"ATK +2 & SPD +2 & MND +2","traitText":"風属性耐性+10%","tags":["04","09","25","32","34","41","50"],"image":"figboss/01.png"},{"id":"160","name":"モブホークⅡ","rarity":"UR","statsText":"ATK +2 & SPD +2 & MND +2","traitText":"風属性耐性+10%","tags":["04","09","25","26","32","34","41","50"],"image":"figboss/02.png"},{"id":"161","name":"ミラモブ","rarity":"SSR","statsText":"MAG+3 & MP +15","traitText":"闇属性耐性+10 & 回避率+3%","tags":["05","09","23","25","37","42","50"],"image":"figboss/03.png"},{"id":"162","name":"ミラモブⅡ","rarity":"UR","statsText":"MAG+3 & MP +15 & MND +3","traitText":"毒耐性+20 & 回避率+3%","tags":["05","09","23","25","36","37","42","50"],"image":"figboss/04.png"},{"id":"163","name":"モブガーディアン","rarity":"SSR","statsText":"DEF +5 & MND +1","traitText":"ダメージ軽減+2%","tags":["09","25","32","35","39","40","43"],"image":"figboss/05.png"},{"id":"164","name":"モブガーディアンⅡ","rarity":"UR","statsText":"DEF +5 & HP +20","traitText":"ダメージ軽減+3%","tags":["09","25","26","29","32","35","39","40","43"],"image":"figboss/06.png"},{"id":"165","name":"モブネオンバルス","rarity":"UR","statsText":"MAG +5 & HP +20","traitText":"光属性耐性 +10% & 会心率 +1%","tags":["08","09","25","31","32","36","44","50"],"image":"figboss/07.png"},{"id":"166","name":"モブエース","rarity":"UR","statsText":"MAG +5 & HP +20","traitText":"光属性与ダメージ +5% & 回避率 +1%","tags":["05","08","09","25","32","34","36","44","51"],"image":"figboss/08.png"},{"id":"167","name":"モブドラゴン","rarity":"SSR","statsText":"ATK +3 & DEF +3 & MND +2","traitText":"火属性耐性+10% & 会心率+3%","tags":["03","09","25","32","35","38","47","50"],"image":"figboss/09.png"},{"id":"168","name":"モブドラゴンⅡ","rarity":"UR","statsText":"ATK +3 & DEF +3 & MND +2","traitText":"火属性耐性+10% & 会心率+3%","tags":["03","09","25","32","34","35","38","47","50"],"image":"figboss/10.png"},{"id":"169","name":"モブギドラ","rarity":"MOB","statsText":"ATK +3 & DEF +3 & MND +2","traitText":"火属性耐性+10% & 会心率+3%","tags":["03","09","25","30","32","34","35","36","38","47","50"],"image":"figboss/11.png"},{"id":"170","name":"ミラモブファラオ","rarity":"MOB","statsText":"MAG+5 & MP +15 & MND +3","traitText":"全属性耐性+8 & 回避率+3%","tags":["08","09","23","25","30","32","36","37","42","49","50"],"image":"figboss/12.png"},{"id":"171","name":"モブデーバフ","rarity":"SSR","statsText":"MAG+3 & MP +15","traitText":"状態異常耐性+3 & 闇属性耐性 +3%","tags":["05","09","23","25","29","37","46"],"image":"figboss/13.png"},{"id":"172","name":"モブデーバフ第二形態","rarity":"UR","statsText":"MAG+5 & MP +20","traitText":"状態異常耐性+5 & 闇属性耐性 +5%","tags":["05","09","23","25","29","30","32","37","46"],"image":"figboss/14.png"},{"id":"173","name":"モブバーサク","rarity":"SSR","statsText":"ATK+3 & HP +15","traitText":"物理属性ダメージ軽減 +3& & 闇属性耐性 +3%","tags":["05","09","23","25","29","35","46","49"],"image":"figboss/15.png"},{"id":"174","name":"モブバーサク第二形態","rarity":"UR","statsText":"ATK+5 & HP +25","traitText":"物理属性ダメージ軽減 +3& & 闇属性耐性 +3%","tags":["05","09","23","25","29","32","36","46","49"],"image":"figboss/16.png"},{"id":"175","name":"モブウミデンデン","rarity":"UR","statsText":"ATK+5 & SPD +8 & MND +5","traitText":"雷属性与ダメージ +5& & 雷属性耐性 +10%","tags":["08","09","23","25","29","30","35","43","51"],"image":"figboss/17.png"},{"id":"176","name":"モブネオマスター","rarity":"UR","statsText":"DEF +5 & HP +20","traitText":"光属性与ダメージ +5% & 会心率 +1%","tags":["05","08","09","25","30","36","37","40","44","50"],"image":"figboss/18.png"},{"id":"177","name":"モブヘルリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"火属性耐性 +10% & 魔法会心率 +1%","tags":["03","23","26","27","37","48","50"],"image":"figboss/19.png"},{"id":"178","name":"モブキリンリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"雷属性耐性 +10% & 魔法会心率 +1%","tags":["04","23","26","27","37","48","50"],"image":"figboss/20.png"},{"id":"179","name":"モブリヴァリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"雷属性耐性 +10% & 魔法会心率 +1%","tags":["23","26","27","31","37","48","50"],"image":"figboss/21.png"},{"id":"180","name":"モブクフリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"雷属性耐性 +10% & 魔法会心率 +1%","tags":["23","26","27","28","37","48","50"],"image":"figboss/22.png"},{"id":"181","name":"覚醒モブヘルリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"火属性耐性 +10% & 魔法会心率 +1%","tags":["23","26","27","32","37","48","50"],"image":"figboss/23.png"},{"id":"182","name":"覚醒モブキリンリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"雷属性耐性 +10% & 魔法会心率 +1%","tags":["23","26","27","32","37","48","50","51"],"image":"figboss/24.png"},{"id":"183","name":"覚醒モブリヴァリリス","rarity":"SSR","statsText":"MAG +3 & MP +15","traitText":"雷属性耐性 +10% & 魔法会心率 +1%","tags":["23","26","27","32","37","48","50"],"image":"figboss/25.png"},{"id":"184","name":"覚醒モブクフリリス","rarity":"SR","statsText":"DEF +3","traitText":"地属性耐性 +3%","tags":["02","09","10","17","41"],"image":"figboss/26.png"}];
const FIGURE_TAGS=[{"id":"01","name":"ぷにモブ","two":"HP+50","three":"HP+100"},{"id":"02","name":"グリーンカラー","two":"地属性耐性+10%","three":"地属性耐性+20%"},{"id":"03","name":"レッドカラー","two":"火属性耐性+10%","three":"火属性耐性+20%"},{"id":"04","name":"イエローカラー","two":"マヒ耐性+10%","three":"マヒ耐性+20%"},{"id":"05","name":"パープルカラー","two":"毒耐性+10%","three":"毒耐性+20%"},{"id":"06","name":"ピンクカラー","two":"MP+30","three":"MP+50"},{"id":"07","name":"オレンジカラー","two":"HP+50","three":"HP+100"},{"id":"08","name":"輝き","two":"光属性耐性+10%","three":"光属性耐性+20%"},{"id":"09","name":"モンスター","two":"通常モンスターへのダメージ+10%","three":"通常モンスターへのダメージ+15% & MP+15"},{"id":"10","name":"マスコット","two":"戦闘獲得経験値 & 戦闘獲得コイン +3%","three":"戦闘獲得経験値 & 戦闘獲得コイン +5%"},{"id":"11","name":"PB2","two":"必殺技ダメージ+10%","three":"必殺技ダメージ+15% & MND+5"},{"id":"12","name":"MUSIC","two":"魔法与ダメージ+10% & MAG+5","three":"魔法与ダメージ15% & MAG+10"},{"id":"13","name":"頼もしい仲間","two":"DEF+10","three":"DEF+20"},{"id":"14","name":"MOB SHOT","two":"探索のレアアイテム率+2%","three":"探索のレアアイテム率+5% & 命中率+10%"},{"id":"15","name":"メニュー","two":"MP消費-10%","three":"MP消費-10%"},{"id":"16","name":"ネコクー","two":"ダメージ軽減+3%","three":"ダメージ軽減+5%"},{"id":"17","name":"スライム","two":"物理ダメージ軽減+2%","three":"物理ダメージ軽減+3% + 水属性耐性+10%"},{"id":"18","name":"美味しい食べ物","two":"全属性耐性+5%","three":"全属性耐性+10%"},{"id":"19","name":"ロゴ","two":"HP+30 & MP+15","three":"HP+50 & MP+30"},{"id":"20","name":"MOB BR","two":"命中率+10% & SPD+5","three":"命中率+20% & SPD+10"},{"id":"21","name":"MOB PG","two":"MND+2 & SPD+3","three":"MND +8 & SPD+12"},{"id":"22","name":"MOB KART","two":"SPD+10","three":"SPD+15 & MP+10"},{"id":"23","name":"ソウル","two":"MND+10","three":"MND+15 & HP+20"},{"id":"24","name":"主人公パーティー","two":"ATK+5 & DEF+5","three":"ATK+10 & DEF+10 & HP+30"},{"id":"25","name":"ボス","two":"与ダメージ+3%","three":"与ダメージ+8%"},{"id":"26","name":"ヴィラン","two":"MND+5 & MP+30","three":"MND +10 & MP+30"},{"id":"27","name":"キュート","two":"回復量+10%","three":"回復量+20%"},{"id":"28","name":"ホワイトカラー","two":"無属性耐性+10%","three":"無属性耐性+20%"},{"id":"29","name":"ブラックカラー","two":"闇属性耐性+10%","three":"闇属性耐性+20%"},{"id":"30","name":"伝説","two":"必殺技ダメージ+10%","three":"必殺技ダメージ+10% & CT-1"},{"id":"31","name":"ブルーカラー","two":"水属性耐性+10%","three":"水属性耐性+20%"},{"id":"32","name":"立ちはだかる強敵","two":"物理ダメージ軽減+3%","three":"ダメージ軽減+3% & 与ダメージ+3%"},{"id":"33","name":"チルタイム","two":"状態異常耐性+5%","three":"状態異常耐性+5%"},{"id":"34","name":"勇猛果敢","two":"ひるみ耐性+10%","three":"ひるみ耐性+20%"},{"id":"35","name":"破壊力","two":"与物理ダメージ+5%","three":"与物理ダメージ+10%"},{"id":"36","name":"技術力","two":"回避率+3%","three":"回避率+5%"},{"id":"37","name":"魔法使い","two":"与魔法ダメージ+5%","three":"与魔法ダメージ+10%"},{"id":"38","name":"ドラゴン","two":"弱点を突いた時のダメージ+10%","three":"弱点を突いた時のダメージ+15% & MP+15"},{"id":"39","name":"鉄壁","two":"全耐性+3% & ダメージ軽減+3%","three":"全耐性+3% & ダメージ軽減+3% & 状態異常耐性+3%"},{"id":"40","name":"絆","two":"混乱耐性+10%","three":"混乱耐性+20%"},{"id":"41","name":"草原","two":"","three":""},{"id":"42","name":"砂漠","two":"","three":""},{"id":"43","name":"田舎町","two":"","three":""},{"id":"44","name":"ネオン街","two":"","three":""},{"id":"45","name":"海底","two":"","three":""},{"id":"46","name":"部族村","two":"","three":""},{"id":"47","name":"マグマ","two":"","three":""},{"id":"48","name":"魔王城","two":"","three":""},{"id":"49","name":"斬撃","two":"","three":""},{"id":"50","name":"浮遊","two":"","three":""},{"id":"51","name":"雷撃","two":"","three":""}];

const FIGURE_RARITY_ORDER={R:1,SR:2,SSR:3,UR:4,MOB:5};
let figureSort='acquired',figureRarityFilter='all',figureTagFilter='all',figurePickerSlot=0;
function figureById(id){return FIGURES.find(x=>x.id===String(id||'').padStart(2,'0'))||null;}
function figureTagById(id){return FIGURE_TAGS.find(x=>x.id===String(id||'').padStart(2,'0'))||null;}
function figureOwned(id){return Math.max(0,Number(state.meta?.figures?.[String(id).padStart(2,'0')])||0);}
function addFigure(id,n=1){id=String(id||'').padStart(2,'0');if(!figureById(id))return false;if(!state.meta.figures)state.meta.figures={};if(!Array.isArray(state.meta.figureOrder))state.meta.figureOrder=[];if(!figureOwned(id))state.meta.figureOrder.push(id);state.meta.figures[id]=figureOwned(id)+Math.max(0,Number(n)||0);saveMeta();return true;}
function normalizeFigureEquipmentRecord(v){const seen=new Set();return Array.from({length:4},(_,i)=>{const id=Array.isArray(v)?(v[i]||null):null;if(!id||seen.has(id))return null;seen.add(id);return id;});}
function figureEquipmentFor(pid){pid=canonicalPlayerId(pid);if(!state.meta.figureEquipment)state.meta.figureEquipment={};const eq=normalizeFigureEquipmentRecord(state.meta.figureEquipment[pid]);state.meta.figureEquipment[pid]=eq;return eq;}
function assignedFigureCount(id,exclude=null){let n=0;for(const [pid,raw] of Object.entries(state.meta?.figureEquipment||{}))normalizeFigureEquipmentRecord(raw).forEach((x,i)=>{if(x===id&&!(exclude&&exclude.pid===pid&&exclude.index===i))n++;});return n;}
function freeFigureCount(id,exclude=null){return Math.max(0,figureOwned(id)-assignedFigureCount(id,exclude));}
function parseFigureStatsText(text){
  const out={maxHp:0,maxMp:0,atk:0,mag:0,def:0,res:0,spd:0};
  let s=String(text||'').replace(/DFE/g,'DEF').replace(/未設定/g,'');
  const map={HP:'maxHp',MP:'maxMp',ATK:'atk',MAG:'mag',DEF:'def',MND:'res',SPD:'spd'};
  // "ATK.DEF.SPD +2" / "HP.MP +15" / "SPD.MND +2" のような複数能力表記。
  s=s.replace(/((?:HP|MP|ATK|MAG|DEF|MND|SPD)(?:\s*[.&・/]\s*(?:HP|MP|ATK|MAG|DEF|MND|SPD))+)[ ]*\+[ ]*(\d+(?:\.\d+)?)/gi,(all,group,n)=>{
    for(const key of group.split(/\s*[.&・/]\s*/)){const u=key.toUpperCase();if(map[u])out[map[u]]+=Number(n);}
    return' ';
  });
  for(const m of s.matchAll(/(HP|MP|ATK|MAG|DEF|MND|SPD)\s*\+\s*(\d+(?:\.\d+)?)/gi)){const u=m[1].toUpperCase();out[map[u]]+=Number(m[2]);}
  return out;
}
function emptyFigureEffects(){return{stats:{maxHp:0,maxMp:0,atk:0,mag:0,def:0,res:0,spd:0},resist:{火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0},statusResist:{poison:0,burn:0,paralyze:0,sleep:0,stun:0,confuse:0},crit:0,magicCrit:0,evade:0,damageCut:0,physicalCut:0,magicCut:0,expBonus:0,goldBonus:0,weakDamage:0,magicDamage:0,physicalDamage:0,normalDamage:0,ultimateDamage:0,bossDamage:0,normalMonsterDamage:0,rareExplore:0,accuracy:0,mpCut:0,healBoost:0,ultimateCtCut:0,allStatPercent:0,lowHpDefFlat:0,damageBonus:0,elementMagicDamage:{火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0},elementDamage:{火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0},areaDamage:{grassland:0,desert:0,rural:0,neon:0,sea:0,tribe:0,magma:0,demonCastle:0}};}
function parseFigureEffectText(text){
  const out=emptyFigureEffects(),s=String(text||'').replace(/DFE/g,'DEF').replace(/与物理ダメージ/g,'物理与ダメージ').replace(/与魔法ダメージ/g,'魔法与ダメージ').replace(/全耐性/g,'全属性耐性').replace(/無し|未設定/g,'');
  out.stats=parseFigureStatsText(s);const NUM='(\\d+(?:\\.\\d+)?)';let m;
  const statusMap={毒:'poison',やけど:'burn',マヒ:'paralyze',眠り:'sleep',ひるみ:'stun',混乱:'confuse'};
  if((m=s.match(new RegExp('全属性耐性\\s*\\+?\\s*'+NUM+'%?'))))for(const k of Object.keys(out.resist))out.resist[k]+=Number(m[1])/100;
  const multiRe=new RegExp('([火水雷風地光闇無](?:[.&・/][火水雷風地光闇無])+?)属性耐性\\s*\\+?\\s*'+NUM+'%?','g');let single=s;
  for(const x of s.matchAll(multiRe)){for(const el of x[1].split(/[.&・/]/))out.resist[el]+=Number(x[2])/100;single=single.replace(x[0],' ');}
  for(const x of single.matchAll(new RegExp('([火水雷風地光闇無])(?:属性)?(?:ダメージ)?耐性\\s*\\+?\\s*'+NUM+'%?','g')))out.resist[x[1]]+=Number(x[2])/100;
  for(const x of s.matchAll(new RegExp('([火水雷風地光闇無])属性ダメージ軽減\\s*\\+?\\s*'+NUM+'%?','g')))out.resist[x[1]]+=Number(x[2])/100;
  if((m=s.match(new RegExp('状態異常(?:全)?耐性\\s*\\+?\\s*'+NUM+'%?'))))for(const k of Object.values(statusMap))out.statusResist[k]+=Number(m[1])/100;
  for(const [label,key] of Object.entries(statusMap)){const x=s.match(new RegExp(label+'耐性\\s*\\+?\\s*'+NUM+'%?'));if(x)out.statusResist[key]+=Number(x[1])/100;}
  if((m=s.match(new RegExp('魔法会心率\\s*\\+?\\s*'+NUM+'%?'))))out.magicCrit+=Number(m[1])/100;
  const critSource=s.replace(/魔法会心率[^&、,]*/g,'');if((m=critSource.match(new RegExp('会心率\\s*\\+?\\s*'+NUM+'%?'))))out.crit+=Number(m[1])/100;
  if((m=s.match(new RegExp('回避率\\s*\\+?\\s*'+NUM+'%?'))))out.evade+=Number(m[1])/100;
  if((m=s.match(new RegExp('物理ダメージ軽減\\s*\\+?\\s*'+NUM+'%?'))))out.physicalCut+=Number(m[1])/100;
  if((m=s.match(new RegExp('魔法ダメージ軽減\\s*\\+?\\s*'+NUM+'%?'))))out.magicCut+=Number(m[1])/100;
  const cutSource=s.replace(/物理ダメージ軽減[^&、,]*/g,'').replace(/魔法ダメージ軽減[^&、,]*/g,'').replace(/[火水雷風地光闇無]属性ダメージ軽減[^&、,]*/g,'');if((m=cutSource.match(new RegExp('ダメージ軽減\\s*\\+?\\s*'+NUM+'%?'))))out.damageCut+=Number(m[1])/100;
  if((m=s.match(new RegExp('戦闘獲得経験値\\s*&\\s*戦闘獲得コイン\\s*\\+?\\s*'+NUM+'%?')))){out.expBonus+=Number(m[1])/100;out.goldBonus+=Number(m[1])/100;}else{if((m=s.match(new RegExp('(?:戦闘獲得経験値|獲得経験値|経験値獲得量)\\s*\\+?\\s*'+NUM+'%?'))))out.expBonus+=Number(m[1])/100;if((m=s.match(new RegExp('(?:戦闘獲得コイン|獲得コイン|コイン獲得量)\\s*\\+?\\s*'+NUM+'%?'))))out.goldBonus+=Number(m[1])/100;}
  if((m=s.match(new RegExp('弱点を突いた時のダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.weakDamage+=Number(m[1])/100;
  if((m=s.match(new RegExp('通常攻撃(?:の)?与ダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.normalDamage+=Number(m[1])/100;
  if((m=s.match(new RegExp('物理与ダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.physicalDamage+=Number(m[1])/100;
  const magSource=s.replace(/[火水雷風地光闇無]属性魔法与ダメージ[^&、,]*/g,'');if((m=magSource.match(new RegExp('(?:魔法攻撃(?:の)?与ダメージ|魔法与ダメージ)\\s*\\+?\\s*'+NUM+'%?'))))out.magicDamage+=Number(m[1])/100;
  for(const x of s.matchAll(new RegExp('([火水雷風地光闇無])属性魔法与ダメージ\\s*\\+?\\s*'+NUM+'%?','g')))out.elementMagicDamage[x[1]]+=Number(x[2])/100;
  for(const x of s.matchAll(new RegExp('([火水雷風地光闇無])属性与ダメージ\\s*\\+?\\s*'+NUM+'%?','g')))out.elementDamage[x[1]]+=Number(x[2])/100;
  if((m=s.match(new RegExp('通常モンスターへのダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.normalMonsterDamage+=Number(m[1])/100;
  if((m=s.match(new RegExp('ボスモンスターへのダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.bossDamage+=Number(m[1])/100;
  if((m=s.match(new RegExp('必殺技ダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.ultimateDamage+=Number(m[1])/100;
  if((m=s.match(new RegExp('(?:^|[&、,])\\s*与ダメージ\\s*\\+?\\s*'+NUM+'%?'))))out.damageBonus+=Number(m[1])/100;
  if((m=s.match(new RegExp('探索(?:の)?レアアイテム率\\s*\\+?\\s*'+NUM+'%?'))))out.rareExplore+=Number(m[1])/100;
  if((m=s.match(new RegExp('命中率\\s*\\+?\\s*'+NUM+'%?'))))out.accuracy+=Number(m[1])/100;
  if((m=s.match(new RegExp('MP消費\\s*-\\s*'+NUM+'%?'))))out.mpCut+=Number(m[1])/100;
  if((m=s.match(new RegExp('回復量\\s*\\+?\\s*'+NUM+'%?'))))out.healBoost+=Number(m[1])/100;
  if((m=s.match(/必殺技(?:の)?CT\\s*-\\s*(\\d+)(?:ターン)?/)))out.ultimateCtCut+=Number(m[1]);else if((m=s.match(/(?:^|[&、,])\\s*CT\\s*-\\s*(\\d+)/)))out.ultimateCtCut+=Number(m[1]);
  if((m=s.match(new RegExp('ネオン街の戦闘で全ステータス\\s*\\+?\\s*'+NUM+'%?'))))out.allStatPercent+=Number(m[1])/100;
  if((m=s.match(/HP\\s*30%?以下でDEF\\s*\\+?\\s*(\\d+(?:\\.\\d+)?)/)))out.lowHpDefFlat+=Number(m[1]);
  const areaMap={草原:'grassland',砂漠:'desert',田舎町:'rural',ネオン街:'neon',海底:'sea',部族村:'tribe',マグマ:'magma',魔王城:'demonCastle'};for(const [label,key] of Object.entries(areaMap)){const x=s.match(new RegExp(label+'での与ダメージ\\s*\\+?\\s*'+NUM+'%?'));if(x)out.areaDamage[key]+=Number(x[1])/100;}
  return out;
}
function mergeFigureEffects(a,b){for(const k of Object.keys(a.stats||{}))a.stats[k]+=Number(b.stats?.[k]||0);for(const k of Object.keys(a.resist||{}))a.resist[k]+=Number(b.resist?.[k]||0);for(const k of Object.keys(a.statusResist||{}))a.statusResist[k]+=Number(b.statusResist?.[k]||0);for(const k of Object.keys(a.elementMagicDamage||{}))a.elementMagicDamage[k]+=Number(b.elementMagicDamage?.[k]||0);for(const k of Object.keys(a.elementDamage||{}))a.elementDamage[k]+=Number(b.elementDamage?.[k]||0);for(const k of Object.keys(a.areaDamage||{}))a.areaDamage[k]+=Number(b.areaDamage?.[k]||0);for(const k of ['crit','magicCrit','evade','damageCut','physicalCut','magicCut','expBonus','goldBonus','weakDamage','magicDamage','physicalDamage','normalDamage','ultimateDamage','bossDamage','normalMonsterDamage','rareExplore','accuracy','mpCut','healBoost','ultimateCtCut','allStatPercent','lowHpDefFlat','damageBonus'])a[k]=(a[k]||0)+Number(b[k]||0);for(const map of ['elementPhysicalCut','elementMagicCut','elementCut','areaCrit','areaCut'])if(a[map]||b?.[map]){a[map]=a[map]||{};for(const [k,v] of Object.entries(b?.[map]||{}))a[map][k]=(a[map][k]||0)+Number(v||0);}if(b?.normalAoe)a.normalAoe=true;if(b?.magicAoe)a.magicAoe=true;return a;}
function activeFigureResonances(pid){const counts={};for(const id of figureEquipmentFor(pid)){const f=figureById(id);if(!f)continue;for(const t of f.tags)counts[t]=(counts[t]||0)+1;}return FIGURE_TAGS.map(tag=>{const count=counts[tag.id]||0;if(count<2)return null;const tier=count>=3?3:2,label=count>=3?tag.three:tag.two;if(!label)return null;return{tag,count,tier,label,effects:parseFigureEffectText(label)};}).filter(Boolean);}
function figureEffectsFor(pid){const out=emptyFigureEffects();mergeFigureEffects(out,armorEffectsFor(pid));for(const id of figureEquipmentFor(pid)){const f=figureById(id);if(!f)continue;mergeFigureEffects(out,{...parseFigureEffectText(f.traitText),stats:parseFigureStatsText(f.statsText)});}for(const r of activeFigureResonances(pid))mergeFigureEffects(out,r.effects);return out;}
function figureStatBonus(pid){return figureEffectsFor(pid).stats;}
function setFigureEquipment(pid,index,id){pid=canonicalPlayerId(pid);index=clamp(Number(index)||0,0,3);const eq=figureEquipmentFor(pid),before=activeFigureResonances(pid).map(x=>`${x.tag.id}:${x.tier}`);if(id){id=String(id).padStart(2,'0');if(!figureById(id)||freeFigureCount(id,{pid,index})<1)return false;if(eq.some((x,i)=>i!==index&&x===id))return false;}eq[index]=id||null;state.meta.figureEquipment[pid]=eq;saveMeta();const after=activeFigureResonances(pid);const born=after.find(x=>!before.includes(`${x.tag.id}:${x.tier}`));if(born)showFigureResonanceActivation(born.tag.name,born.label);return true;}
function showFigureResonanceActivation(name,effect){let el=document.querySelector('.figure-resonance-activation');if(!el){el=document.createElement('div');el.className='figure-resonance-activation';document.body.appendChild(el);}el.innerHTML=`<small>RESONANCE</small><b>特性「${name}」発動！</b><span>${effect}</span>`;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(showFigureResonanceActivation.timer);showFigureResonanceActivation.timer=setTimeout(()=>el.classList.remove('show'),1500);}
function figureResistanceTotal(pid,element){const f=figureEffectsFor(pid);return clamp(Number(f.resist[element]||0),0,.8);}
function figureStatusResistance(pid,kind){return clamp(Number(figureEffectsFor(pid).statusResist[kind]||0),0,1);}
function figureRarityClass(r){return String(r||'R').toLowerCase();}
function figureOrderIndex(id){const i=(state.meta.figureOrder||[]).indexOf(id);return i<0?9999:i;}
function filteredOwnedFigures(){let list=FIGURES.filter(f=>!f.pending&&figureOwned(f.id)>0);if(figureRarityFilter!=='all')list=list.filter(f=>f.rarity===figureRarityFilter);if(figureTagFilter!=='all')list=list.filter(f=>f.tags.includes(figureTagFilter));if(figureSort==='rarity')list.sort((a,b)=>(FIGURE_RARITY_ORDER[b.rarity]||0)-(FIGURE_RARITY_ORDER[a.rarity]||0)||a.id.localeCompare(b.id));else if(figureSort==='tag')list.sort((a,b)=>(a.tags[0]||'99').localeCompare(b.tags[0]||'99')||a.id.localeCompare(b.id));else list.sort((a,b)=>figureOrderIndex(a.id)-figureOrderIndex(b.id));return list;}
function figureTagLabel(id){const t=figureTagById(id);return t?`${id} ${t.name}`:id;}
function figureResonanceMarkup(pid,compact=false){const active=activeFigureResonances(pid);return `<section class="figure-resonance-panel ${compact?'compact':''}"><div class="figure-section-head"><b>発動中の共鳴特性</b><small>${active.length}件</small></div>${active.length?`<div class="figure-resonance-list">${active.map(r=>`<div><b>${r.tag.name} <em>${r.count}体</em></b><span>${r.label}</span></div>`).join('')}</div>`:'<p>現在発動している共鳴特性はありません。</p>'}</section>`;}
function figurePercentText(v){const n=Number(v||0)*100;const rounded=Math.abs(n-Math.round(n))<1e-9?Math.round(n):Number(n.toFixed(1));return `${rounded}%`;}
function figureEffectStatusMarkup(pid){const e=figureEffectsFor(pid),pct=figurePercentText,elementRows=['火','水','雷','風','地','光','闇','無'].map(k=>`<span><small>${k}耐性</small><b>${pct(e.resist[k])}</b></span>`).join(''),statusRows=[['poison','毒'],['burn','やけど'],['paralyze','マヒ'],['sleep','眠り'],['stun','ひるみ'],['confuse','混乱']].map(([k,n])=>`<span><small>${n}耐性</small><b>${pct(e.statusResist[k])}</b></span>`).join('');const misc=[];if(e.crit)misc.push(`会心率 +${pct(e.crit)}`);if(e.magicCrit)misc.push(`魔法会心率 +${pct(e.magicCrit)}`);if(e.evade)misc.push(`回避率 +${pct(e.evade)}`);if(e.damageCut)misc.push(`ダメージ軽減 +${pct(e.damageCut)}`);if(e.physicalCut)misc.push(`物理軽減 +${pct(e.physicalCut)}`);if(e.magicCut)misc.push(`魔法軽減 +${pct(e.magicCut)}`);if(e.healBoost)misc.push(`回復量 +${pct(e.healBoost)}`);if(e.expBonus)misc.push(`獲得EXP +${pct(e.expBonus)}`);if(e.goldBonus)misc.push(`獲得コイン +${pct(e.goldBonus)}`);if(e.mpCut)misc.push(`MP消費 -${pct(e.mpCut)}`);if(e.ultimateCtCut)misc.push(`必殺技CT -${e.ultimateCtCut}`);if(e.normalDamage)misc.push(`通常攻撃 +${pct(e.normalDamage)}`);if(e.physicalDamage)misc.push(`物理与ダメージ +${pct(e.physicalDamage)}`);if(e.magicDamage)misc.push(`魔法与ダメージ +${pct(e.magicDamage)}`);if(e.ultimateDamage)misc.push(`必殺技ダメージ +${pct(e.ultimateDamage)}`);if(e.normalMonsterDamage)misc.push(`通常モンスター +${pct(e.normalMonsterDamage)}`);if(e.bossDamage)misc.push(`ボス +${pct(e.bossDamage)}`);if(e.damageBonus)misc.push(`与ダメージ +${pct(e.damageBonus)}`);if(e.weakDamage)misc.push(`弱点ダメージ +${pct(e.weakDamage)}`);if(e.rareExplore)misc.push(`探索レア率 +${pct(e.rareExplore)}`);if(e.accuracy)misc.push(`命中率 +${pct(e.accuracy)}`);for(const [k,v] of Object.entries(e.elementDamage))if(v)misc.push(`${k}属性与ダメージ +${pct(v)}`);for(const [k,v] of Object.entries(e.elementMagicDamage))if(v)misc.push(`${k}魔法 +${pct(v)}`);return `<section class="figure-status-panel"><div class="figure-section-head"><b>耐性・特性</b><small>STATUS</small></div><div class="figure-resistance-grid">${elementRows}${statusRows}</div>${misc.length?`<div class="figure-misc-effects">${misc.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</section>`;}
function figureSlotMarkup(pid,index,id){const f=figureById(id);return `<button class="figure-slot ${figurePickerSlot===index?'selected':''}" data-figure-slot="${index}" type="button"><small>FIGURE ${index+1}</small>${f?`<img src="${f.image}" alt="${f.name}"><b>${f.name}</b><em class="rarity-${figureRarityClass(f.rarity)}">${f.rarity}</em>`:'<i>＋</i><b>未装備</b><em>タップして選択</em>'}</button>`;}
function figureCardMarkup(f,pid){const equipped=figureEquipmentFor(pid).includes(f.id),free=freeFigureCount(f.id);return `<button class="figure-card rarity-${figureRarityClass(f.rarity)} ${equipped?'equipped':''}" data-figure-id="${f.id}" type="button" ${equipped?'disabled':(free<1?'disabled':'')}><img src="${f.image}" alt="${f.name}"><div><span><b>${f.name}</b><em>${f.rarity}</em></span><small>${f.statsText}</small><p>${f.traitText==='無し'?'特性なし':f.traitText}</p><div class="figure-tags">${f.tags.map(t=>`<i>${figureTagLabel(t)}</i>`).join('')}</div><strong>${equipped?'このキャラに装備中':`所持 ${figureOwned(f.id)} / 空き ${free}`}</strong></div></button>`;}
function figurePickerControlsMarkup(){return `<div class="figure-sort-row"><button data-figure-sort="acquired" class="${figureSort==='acquired'?'active':''}" type="button">入手順</button><button data-figure-sort="rarity" class="${figureSort==='rarity'?'active':''}" type="button">レア度順</button><button data-figure-sort="tag" class="${figureSort==='tag'?'active':''}" type="button">タグ順</button></div><div class="figure-rarity-filter">${['all','R','SR','SSR','UR','MOB'].map(r=>`<button data-figure-rarity="${r}" class="${figureRarityFilter===r?'active':''}" type="button">${r==='all'?'ALL':r}</button>`).join('')}</div><div class="figure-tag-filter"><button data-figure-tag="all" class="${figureTagFilter==='all'?'active':''}" type="button">ALL TAG</button>${FIGURE_TAGS.map(t=>`<button data-figure-tag="${t.id}" class="${figureTagFilter===t.id?'active':''}" type="button">${t.id} ${t.name}</button>`).join('')}</div>`;}
function renderFigurePicker(){const overlay=$('#figurePickerOverlay'),summary=$('#figurePickerSummary'),controls=$('#figurePickerControls'),listRoot=$('#figurePickerList'),p=player(equipmentPlayerId);if(!overlay||!summary||!controls||!listRoot||!p)return;const eq=figureEquipmentFor(p.id),current=figureById(eq[figurePickerSlot]),list=filteredOwnedFigures();$('#figurePickerTitle').textContent=`${p.name} / FIGURE ${figurePickerSlot+1}`;summary.innerHTML=`<div class="figure-picker-current"><small>現在の装備</small>${current?`<img src="${current.image}" alt="${current.name}"><div><b>${current.name}</b><span>${current.rarity} / ${current.statsText}</span></div>`:'<div class="figure-picker-empty"><b>未装備</b><span>下の一覧から選択してください</span></div>'}<button data-remove-figure type="button" ${current?'':'disabled'}>外す</button></div>`;controls.innerHTML=figurePickerControlsMarkup();listRoot.innerHTML=list.length?list.map(f=>figureCardMarkup(f,p.id)).join(''):'<div class="camp-empty-note">条件に合う所持フィギュアがありません。</div>';bindImages(overlay);$$('[data-figure-sort]',controls).forEach(b=>b.onclick=()=>{figureSort=b.dataset.figureSort;renderFigurePicker();});$$('[data-figure-rarity]',controls).forEach(b=>b.onclick=()=>{figureRarityFilter=b.dataset.figureRarity;renderFigurePicker();});$$('[data-figure-tag]',controls).forEach(b=>b.onclick=()=>{figureTagFilter=b.dataset.figureTag;renderFigurePicker();});$('[data-remove-figure]',summary)?.addEventListener('click',()=>{setFigureEquipment(p.id,figurePickerSlot,null);closeFigurePicker();renderEquipment();});$$('[data-figure-id]',listRoot).forEach(b=>b.onclick=()=>{if(!setFigureEquipment(p.id,figurePickerSlot,b.dataset.figureId))return toast('このフィギュアは装備できません');closeFigurePicker();renderEquipment();});}
function openFigurePicker(pid,index){equipmentPlayerId=canonicalPlayerId(pid);figurePickerSlot=clamp(Number(index)||0,0,3);renderFigurePicker();const overlay=$('#figurePickerOverlay');if(overlay)overlay.hidden=false;}
function closeFigurePicker(){const overlay=$('#figurePickerOverlay');if(overlay)overlay.hidden=true;}
function renderFigureEquipment(){const root=$('#equipmentContent'),p=player(equipmentPlayerId),lv=currentPlayerLevel(p.id),eq=figureEquipmentFor(p.id);root.innerHTML=`<section class="panel figure-equipment-panel"><div class="equipment-party-strip">${state.party.map(([id])=>{const q=player(id);return `<button class="${q.id===p.id?'active':''}" data-equip-player="${q.id}" type="button"><img src="${versionedPlay(q.image)}" alt="${q.name}"><b>${q.name}</b></button>`;}).join('')}</div><div class="figure-title-row"><div><small>FIGURE ACCESSORY / Lv${lv}</small><h2>${p.name}</h2><p>フィギュアは4体まで装備できます。</p></div><span>${eq.filter(Boolean).length} / 4</span></div><div class="equipment-stat-grid figure-final-stats">${equipmentStatRows(p,lv,equipmentFor(p.id))}</div><div class="figure-popup-guide"><b>装備したい枠をタップ</b><span>フィギュア一覧はポップアップで開きます。</span></div><div class="figure-slots">${eq.map((id,i)=>figureSlotMarkup(p.id,i,id)).join('')}</div>${figureResonanceMarkup(p.id)}${figureEffectStatusMarkup(p.id)}</section>`;bindImages(root);$$('[data-equip-player]',root).forEach(b=>b.onclick=()=>{equipmentPlayerId=b.dataset.equipPlayer;figurePickerSlot=0;renderEquipment();});$$('[data-figure-slot]',root).forEach(b=>b.onclick=()=>openFigurePicker(p.id,Number(b.dataset.figureSlot)||0));}
function partyFigureRewardBonus(kind){return Math.max(0,...(state.battle?.allies||[]).map(a=>Number(figureEffectsFor(a.id)?.[kind]||0)));}
function partyExploreFigureBonus(){return Math.max(0,...state.party.map(([id])=>Number(figureEffectsFor(id).rareExplore||0)));}

/* v50: raw weapon stats are softened; traits remain unchanged. MAIN + SUB + 3 medals can stack, so high-end values receive the larger trim. */
function v50WeaponStatValue(v){
  v=Number(v)||0;
  if(v<=10)return Math.max(0,Math.round(v));
  if(v<=30)return Math.max(1,Math.round(v*.92));
  if(v<=60)return Math.max(1,Math.round(v*.88));
  if(v<=90)return Math.max(1,Math.round(v*.82));
  return Math.min(90,Math.max(1,Math.round(v*.74)));
}
for(const w of WEAPONS){for(const k of Object.keys(w.stats||{}))w.stats[k]=v50WeaponStatValue(w.stats[k]);}
let equipmentTab='equip',equipmentPlayerId=null,weaponPickerContext=null,campEquipPlayerId=null;
function weaponById(id){return WEAPONS.find(w=>w.id===String(id||''))||null;}
function normalizeWeaponType(t){t=String(t||'').trim();return t==='刀'?'太刀':t;}
function weaponTypeList(w){return String(w?.type||'').split('・').map(normalizeWeaponType).filter(x=>x&&x!=='未設定');}
function playerWeaponTypes(p){return String(p?.weapon||'').split('・').map(normalizeWeaponType).filter(Boolean);}
function canEquipWeapon(p,w){if(!p||!w)return false;const wt=weaponTypeList(w),pt=playerWeaponTypes(p);return wt.some(t=>pt.includes(t));}
function emptyEquipment(){return{main:null,sub:null,armor:null,medals:[null,null,null]};}
function normalizeEquipmentRecord(v){const x=(v&&typeof v==='object')?v:{};return{main:x.main||null,sub:x.sub||null,armor:x.armor||null,medals:Array.from({length:3},(_,i)=>Array.isArray(x.medals)?(x.medals[i]||null):null)};}
function equipmentFor(pid){pid=canonicalPlayerId(pid);if(!state.meta.equipment)state.meta.equipment={};if(!state.meta.equipment[pid])state.meta.equipment[pid]=emptyEquipment();const eq=normalizeEquipmentRecord(state.meta.equipment[pid]);eq.medals=eq.medals.map(id=>id&&medalOwned(id)>0?id:null);eq.armor=eq.armor&&armorOwned(eq.armor)>0?eq.armor:null;state.meta.equipment[pid]=eq;return eq;}
function armorById(id){return ARMORS.find(a=>a.id===String(id||'').padStart(2,'0'))||null;}
function armorOwned(id){return Math.max(0,Number(state.meta?.armors?.[String(id||'').padStart(2,'0')])||0);}
function addArmor(id,n=1){id=String(id||'').padStart(2,'0');if(!armorById(id))return false;if(!state.meta.armors)state.meta.armors={};state.meta.armors[id]=armorOwned(id)+Math.max(0,Number(n)||0);saveMeta();return true;}
function assignedArmorCount(id,excludePid=null){let n=0;for(const [pid,raw] of Object.entries(state.meta?.equipment||{})){if(excludePid&&pid===excludePid)continue;const eq=normalizeEquipmentRecord(raw);if(eq.armor===id)n++;}return n;}
function freeArmorCount(id,excludePid=null){return Math.max(0,armorOwned(id)-assignedArmorCount(id,excludePid));}
function armorStatsText(a){if(!a)return'なし';const L={maxHp:'HP',maxMp:'MP',atk:'ATK',def:'DEF',spd:'SPD',mag:'MAG',res:'MND'};return Object.entries(a.stats||{}).map(([k,v])=>`${L[k]||k}+${v}`).join(' ');}
function armorEffectBase(){const e=emptyFigureEffects();e.elementPhysicalCut={火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0};e.elementMagicCut={火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0};e.elementCut={火:0,水:0,雷:0,風:0,地:0,光:0,闇:0,無:0};e.areaCrit={};e.areaCut={};e.normalAoe=false;e.magicAoe=false;return e;}
function armorEffectsFor(pid){const eq=equipmentFor(pid),a=armorById(eq.armor),out=armorEffectBase();if(!a)return out;const parsed=parseFigureEffectText(a.traitLabel||'');mergeFigureEffects(out,parsed);const s=String(a.traitLabel||'');const areaMap={'マグマ':'magma','ネオン街':'neon','海底':'sea','砂漠':'desert','田舎町':'rural','部族村':'tribe'};let m;for(const [jp,key] of Object.entries(areaMap)){if((m=s.match(new RegExp(jp+'エリア会心率\\+([0-9]+)%'))))out.areaCrit[key]=(out.areaCrit[key]||0)+Number(m[1])/100;if((m=s.match(new RegExp(jp+'エリアダメージ軽減\\+([0-9]+)%'))))out.areaCut[key]=(out.areaCut[key]||0)+Number(m[1])/100;}
for(const el of ['火','水','雷','風','地','光','闇','無']){if((m=s.match(new RegExp(el+'属性物理ダメージ軽減\\+([0-9]+)%'))))out.elementPhysicalCut[el]+=Number(m[1])/100;if((m=s.match(new RegExp(el+'物理ダメージ軽減\\+([0-9]+)%'))))out.elementPhysicalCut[el]+=Number(m[1])/100;if((m=s.match(new RegExp(el+'属性魔法ダメージ軽減\\+([0-9]+)%'))))out.elementMagicCut[el]+=Number(m[1])/100;if((m=s.match(new RegExp(el+'魔法ダメージ軽減\\+([0-9]+)%'))))out.elementMagicCut[el]+=Number(m[1])/100;if((m=s.match(new RegExp(el+'属性ダメージ軽減\\+([0-9]+)%'))))out.elementCut[el]+=Number(m[1])/100;}
if((m=s.match(/ボス与ダメージ\+([0-9]+)%/)))out.bossDamage+=Number(m[1])/100;if(/毒無効/.test(s))out.statusResist.poison=1;if(/やけど無効/.test(s))out.statusResist.burn=1;if(/通常攻撃が全体攻撃/.test(s))out.normalAoe=true;if(/全ての魔法が全体攻撃/.test(s))out.magicAoe=true;return out;}
function armorStatBonus(pid){const a=armorById(equipmentFor(pid).armor);return a?{...a.stats}:{maxHp:0,maxMp:0,atk:0,def:0,spd:0,mag:0,res:0};}
function weaponOwned(id){return Math.max(0,Number(state.meta?.weapons?.[id])||0);}
function medalOwned(id){return Math.max(0,Number(state.meta?.medals?.[id])||0);}
function addWeapon(id,n=1){if(!state.meta.weapons)state.meta.weapons={};state.meta.weapons[id]=weaponOwned(id)+n;saveMeta();}
function addMedal(id,n=1){if(!state.meta.medals)state.meta.medals={};state.meta.medals[id]=medalOwned(id)+n;saveMeta();}
function assignedWeaponCount(id,exclude=null){let n=0;for(const [pid,raw] of Object.entries(state.meta?.equipment||{})){const eq=normalizeEquipmentRecord(raw);for(const slot of ['main','sub'])if(eq[slot]===id&&!(exclude&&exclude.pid===pid&&exclude.slot===slot))n++;}return n;}
function assignedMedalCount(id,exclude=null){let n=0;for(const [pid,raw] of Object.entries(state.meta?.equipment||{})){const eq=normalizeEquipmentRecord(raw);eq.medals.forEach((x,i)=>{if(x===id&&!(exclude&&exclude.pid===pid&&exclude.slot==='medal'&&exclude.index===i))n++;});}return n;}
function freeWeaponCount(id,exclude=null){return Math.max(0,weaponOwned(id)-assignedWeaponCount(id,exclude));}
function freeMedalCount(id,exclude=null){return Math.max(0,medalOwned(id)-assignedMedalCount(id,exclude));}
function weaponStatBonus(eq){
  eq=normalizeEquipmentRecord(eq);const out={atk:0,mag:0,def:0,res:0,spd:0,maxHp:0,maxMp:0};
  const add=(id,scale)=>{const w=weaponById(id);if(!w)return;for(const [k,v] of Object.entries(w.stats||{}))if(k in out)out[k]+=Number(v||0)*scale;};
  add(eq.main,1);add(eq.sub,.5);for(const id of eq.medals)add(id,.1);return out;
}
function weaponTraits(w){if(!w)return[];if(Array.isArray(w.traits))return w.traits.filter(Boolean);return w.trait?[w.trait]:[];}
function weaponTraitEntries(aOrEq){const eq=aOrEq?.equipment||((aOrEq&&aOrEq.main!==undefined)?aOrEq:equipmentFor(aOrEq?.id));const n=normalizeEquipmentRecord(eq);return[n.main,n.sub,...n.medals].flatMap(id=>{const w=weaponById(id);return weaponTraits(w).map(trait=>({weapon:w,trait}));});}
function combinedTraitChance(a,kind,element=null){let miss=1;for(const {trait:t} of weaponTraitEntries(a)){if(t.kind!==kind)continue;if(element&&t.element&&normalizeElement(t.element)!==normalizeElement(element))continue;miss*=1-clamp(Number(t.chance)||0,0,1);}return 1-miss;}
function weaponTraitSum(a,kind,key='value',element=null){let n=0;for(const {trait:t} of weaponTraitEntries(a)){if(t.kind!==kind)continue;if(element&&t.element&&normalizeElement(t.element)!==normalizeElement(element))continue;n+=Number(t[key])||0;}return n;}
function weaponTraitList(a,kind,element=null){return weaponTraitEntries(a).map(x=>x.trait).filter(t=>t.kind===kind&&(!element||!t.element||normalizeElement(t.element)===normalizeElement(element)));}
function weaponCritBonus(a){return weaponTraitSum(a,'crit');}
function weaponResistance(a,element){return clamp(weaponTraitSum(a,'resist','value',element),0,.75);}
function weaponEvasion(a){return clamp(weaponTraitSum(a,'evade'),0,.45);}
function weaponNormalAoeChance(a){return combinedTraitChance(a,'normalAoe');}
function weaponMagicMpCut(a,element){return clamp(weaponTraitSum(a,'magicMpCut','value',element),0,.80);}
function weaponMagicFreeChance(a,element){return combinedTraitChance(a,'magicFree',element);}
function weaponDarkMagicHitHeal(a){return weaponTraitSum(a,'darkMagicHitHeal','amount');}
function weaponGuardExtraCut(a){return clamp(weaponTraitSum(a,'guardExtraCut'),0,.60);}
function weaponPhysicalCut(a){return clamp(weaponTraitSum(a,'physicalCut'),0,.60);}
function weaponDarkResist(a){return clamp(weaponTraitSum(a,'darkResist'),0,.60);}
function weaponGuardMpHeal(a){return clamp(weaponTraitSum(a,'guardMpHeal'),0,.50);}
function weaponGuardHpHeal(a){return clamp(weaponTraitSum(a,'guardHpHeal'),0,.50);}
function weaponGoldBonus(a){return Math.max(0,weaponTraitSum(a,'goldBonus'));}
function weaponNormalLifesteal(a){return clamp(weaponTraitSum(a,'normalLifesteal'),0,.60);}
function weaponPoisonOnHitChance(a){return combinedTraitChance(a,'poisonOnHit');}
function weaponCritHealRate(a){return clamp(weaponTraitSum(a,'critHeal'),0,.50);}
function weaponFollowupSpec(a,kind,element=null){const list=weaponTraitList(a,kind,element);if(!list.length)return{chance:0,power:0};let miss=1,power=0;for(const t of list){miss*=1-clamp(Number(t.chance)||0,0,1);power=Math.max(power,Number(t.power)||0);}return{chance:1-miss,power};}
function equippedMainWeapon(aOrId){const pid=typeof aOrId==='string'?aOrId:aOrId?.id,eq=aOrId?.equipment||equipmentFor(pid);return weaponById(eq?.main);}
function weaponCombatType(a){const w=equippedMainWeapon(a);if(w){const types=weaponTypeList(w),allowed=playerWeaponTypes(a);return types.find(t=>allowed.includes(t))||types[0]||'';}return String(a?.weapon||'').split('・')[0]||'';}
function weaponCombatElement(a){const w=equippedMainWeapon(a);return w&&w.attribute!=='未設定'?normalizeElement(w.attribute):normalizeElement(a?.attribute);}
function weaponStatsText(w,scale=1){if(!w)return'なし';const arr=Object.entries(w.stats||{}).map(([k,v])=>`${WEAPON_STAT_LABEL[k]||k.toUpperCase()}+${Number((Number(v)*scale).toFixed(1))}`);return arr.length?arr.join(' '):'ステータス未設定';}
function weaponTraitText(w){return w?.traitLabel||weaponTraits(w).map(t=>t.label).filter(Boolean).join(' / ')||'特性なし';}
function weaponAllowedText(p){return playerWeaponTypes(p).join(' / ');}
function currentPlayerLevel(pid){return state.party.find(x=>canonicalPlayerId(x[0])===canonicalPlayerId(pid))?.[1]||5;}
function weaponStatsForEquipment(p,lv,eq){const raw=rawBaseStats(p,lv),b=weaponStatBonus(eq),ab=armorStatBonus(p.id),fb=figureStatBonus(p.id),out={...raw};for(const k of WEAPON_STAT_KEYS)if(k in out)out[k]=Math.round((out[k]||0)+(b[k]||0)+(ab[k]||0)+(fb[k]||0));return out;}
function equipmentStatRows(p,lv,eq){const raw=rawBaseStats(p,lv),st=weaponStatsForEquipment(p,lv,eq),keyMap={HP:'maxHp',MP:'maxMp',ATK:'atk',MAG:'mag',DEF:'def',MND:'res',SPD:'spd'};return Object.entries(keyMap).map(([k,key])=>`<span class="${st[key]>raw[key]?'boosted':''}"><small>${k}</small><b>${st[key]}</b>${st[key]>raw[key]?`<em>+${st[key]-raw[key]}</em>`:''}</span>`).join('');}
function equipmentDetailMarkup(pid){const p=player(pid),lv=currentPlayerLevel(pid),eq=equipmentFor(pid),raw=rawBaseStats(p,lv),st=weaponStatsForEquipment(p,lv,eq),fake={...p,id:p.id,equipment:eq,maxHp:st.maxHp,hp:st.maxHp,figureEffects:figureEffectsFor(pid)},labels={maxHp:'HP',maxMp:'MP',atk:'ATK',mag:'MAG',def:'DEF',res:'MND',spd:'SPD'};const statRows=Object.entries(labels).map(([k,n])=>{const d=st[k]-raw[k];return`<div><span>${n}</span><b>${st[k]}</b><small>基礎 ${raw[k]}${d?` / 装備 +${d}`:''}</small></div>`;}).join('');const elems=['火','水','雷','風','地','光','闇','無'].map(el=>{const wr=weaponResistance(fake,el)+(el==='闇'?weaponDarkResist(fake):0),fr=figureResistanceTotal(pid,el),effectiveCut=1-(1-clamp(wr,0,.95))*(1-clamp(fr,0,.95));return`<div><span>${el}耐性</span><b>${figurePercentText(effectiveCut)}</b><small>武器 ${figurePercentText(wr)} / FIG ${figurePercentText(fr)}</small></div>`;}).join('');const fe=figureEffectsFor(pid),status=[['poison','毒'],['burn','やけど'],['paralyze','マヒ'],['sleep','眠り'],['stun','ひるみ']].map(([k,n])=>`<div><span>${n}耐性</span><b>${figurePercentText(.20+Number(fe.statusResist?.[k]||0))}</b><small>基礎20% + FIG/共鳴 ${figurePercentText(Number(fe.statusResist?.[k]||0))}</small></div>`).join(''),crit=TEMP_BALANCE.critRate+weaponCritBonus(fake)+Number(fe.crit||0),evade=weaponEvasion(fake)+Number(fe.evade||0),acc=1+weaponTraitSum(fake,'accuracy')+Number(fe.accuracy||0),misc=[`会心率 ${figurePercentText(crit)}`,`基本命中 100% / 補正 ${Math.round((acc-1)*100)>=0?'+':''}${Math.round((acc-1)*100)}%`,`回避率 ${figurePercentText(evade)}`,`物理軽減 ${figurePercentText(weaponPhysicalCut(fake)+Number(fe.physicalCut||0))}`,`ダメージ軽減 ${figurePercentText(Number(fe.damageCut||0))}`,`回復量 +${figurePercentText(Number(fe.healBoost||0))}`,`EXP +${figurePercentText(Number(fe.expBonus||0))}`,`コイン +${figurePercentText(Number(fe.goldBonus||0))}`,`必殺CT -${Number(fe.ultimateCtCut||0)}ターン`];return`<div class="status-detail-grid">${statRows}</div><h3>属性耐性</h3><div class="status-detail-grid resist">${elems}</div><h3>状態異常耐性</h3><div class="status-detail-grid resist">${status}</div><h3>戦闘特性</h3><div class="status-detail-misc">${misc.map(x=>`<span>${x}</span>`).join('')}</div>${figureResonanceMarkup(pid,true)}`;}
function openEquipmentDetail(pid){let ov=$('#statusDetailOverlay');if(!ov){ov=document.createElement('div');ov.id='statusDetailOverlay';ov.className='status-detail-overlay';ov.innerHTML='<div class="status-detail-card"><div class="settings-head"><div><small>STATUS DETAIL</small><h2 id="statusDetailTitle">詳細ステータス</h2></div><button class="sheet-close" data-close-status-detail type="button">×</button></div><div id="statusDetailBody"></div></div>';document.body.appendChild(ov);ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-close-status-detail]'))ov.hidden=true;});}$('#statusDetailTitle').textContent=`${player(pid)?.name||''} / Lv${currentPlayerLevel(pid)}`;$('#statusDetailBody').innerHTML=equipmentDetailMarkup(pid);ov.hidden=false;}
function weaponEquipSlotName(kind,index=0){return kind==='main'?'MAIN':kind==='sub'?'SUB':`MEDAL ${index+1}`;}
function setPlayerEquipment(pid,kind,index,id){
  pid=canonicalPlayerId(pid);const p=player(pid),eq=equipmentFor(pid);
  if(kind==='main'||kind==='sub'){
    if(id){const w=weaponById(id);if(!w||!canEquipWeapon(p,w))return false;if(freeWeaponCount(id,{pid,slot:kind})<1)return false;}
    eq[kind]=id||null;
  }else{
    if(id&&freeMedalCount(id,{pid,slot:'medal',index})<1)return false;
    eq.medals[index]=id||null;
  }
  state.meta.equipment[pid]=eq;saveMeta();return true;
}
function weaponCardMarkup(w,{shop=false,smith=false}={}){
  const owned=weaponOwned(w.id),free=freeWeaponCount(w.id),med=medalOwned(w.id);
  return `<button class="weapon-card ${!w.price&&!shop?'pending':''}" data-${shop?'buy-weapon':smith?'forge-medal':'weapon-id'}="${w.id}" type="button" ${shop&&!w.price?'disabled':''}>
    <span class="weapon-art"><img src="${w.image}" alt="${w.name}" loading="lazy" decoding="async"><i>${w.type}</i></span>
    <div><b>${w.name}</b><small>${w.type} / ${w.attribute}</small><em>${weaponStatsText(w)}</em><p>${weaponTraitText(w)}</p>${shop?`<strong>${w.price?w.price.toLocaleString()+'G':'価格未設定'} / 所持 ${owned}</strong>`:smith?`<strong>所持 ${owned} / 未装備 ${free} / メダル ${med}</strong>`:`<strong>所持 ${owned}</strong>`}</div>
  </button>`;
}
function armorSlotMarkup(pid,id){const a=armorById(id);return `<button class="equipment-slot armor" data-equip-slot="armor" data-equip-index="0" type="button"><small>ARMOR / 防具</small>${a?`<img src="${a.image}" alt="${a.name}"><b>${a.name}</b><em>${armorStatsText(a)}</em><span>${a.traitLabel||'特性なし'}</span>`:'<i>＋</i><b>未装備</b><em>防具を選択</em>'}</button>`;}
function equipmentSlotMarkup(p,kind,index,id){const w=weaponById(id),scale=kind==='main'?1:(kind==='sub'?0.5:0.1),isMedal=kind==='medal';return `<button class="equipment-slot ${kind}" data-equip-slot="${kind}" data-equip-index="${index}" type="button"><small>${weaponEquipSlotName(kind,index)}</small>${w?`<img src="${w.image}" alt="${isMedal?w.name+'メダル':w.name}" loading="lazy" decoding="async"><b>${isMedal?w.name+'メダル':w.name}</b><em>${weaponStatsText(w,scale)}</em><span>${isMedal?'MEDAL / ':''}${weaponTraitText(w)}</span>`:`<i>＋</i><b>未装備</b><em>${isMedal?'所持メダルを選択':'武器を選択'}</em>`}</button>`;}
function renderEquipment(){
  if(!equipmentPlayerId||!player(equipmentPlayerId))equipmentPlayerId=state.party[0]?.[0]||'yusha';
  const p=player(equipmentPlayerId),lv=currentPlayerLevel(p.id),eq=equipmentFor(p.id),root=$('#equipmentContent');
  $('#equipmentCoin').textContent=`${state.coins.toLocaleString()} G`;
  $$('.equipment-tab').forEach(b=>b.classList.toggle('active',b.dataset.equipmentTab===equipmentTab));
  if(equipmentTab==='figures'){renderFigureEquipment();return;}
  if(equipmentTab==='shop'){
    const testAll=!!state.test?.enabled,visible=WEAPONS.filter(w=>w.season===1||testAll);
    root.innerHTML=`<section class="panel"><div class="section-title"><div><small>WEAPON SHOP</small><h2>武器ショップ</h2></div><span class="pill">${testAll?'TEST / 全SEASON':'SEASON 1'}</span></div><p class="panel-note">通常プレイの初期ショップはSEASON 1（01～05）のみです。SEASON 2～5の通常解放条件はまだ未指定のため、テストモード中だけ全武器を購入できます。同じ武器は複数購入可能です。</p>${[1,2,3,4,5].filter(s=>s===1||testAll).map(s=>`<h3 class="weapon-season-title">SEASON ${s}</h3><div class="weapon-list">${visible.filter(w=>w.season===s).map(w=>weaponCardMarkup(w,{shop:true})).join('')}</div>`).join('')}</section>`;
    bindImages(root);$$('[data-buy-weapon]',root).forEach(b=>b.onclick=()=>buyWeapon(b.dataset.buyWeapon));return;
  }
  if(equipmentTab==='smith'){
    const list=WEAPONS.filter(w=>freeWeaponCount(w.id)>=3);
    root.innerHTML=`<section class="panel smith-host-panel"><div class="facility-host-card smith-host"><img src="play/002.png" alt="モブゴンゾー"><div><small>BLACKSMITH</small><h2>モブゴンゾー</h2><p>今日はどうする？</p></div></div><div class="smith-action-grid"><button data-smith-action="forge" type="button"><b>メダル錬成</b><small>武器3個 → メダル1個</small></button><button data-smith-action="equip" type="button"><b>メダル装備・入れ替え</b><small>装備画面で3枠を編集</small></button><button data-smith-action="home" type="button"><b>HOME</b><small>鍛冶屋を出る</small></button></div></section><section class="panel" id="smithForgeList"><div class="section-title"><div><small>MEDAL FORGE</small><h2>どの武器をメダルにするんだ？</h2></div><span class="pill">3個消費</span></div><div class="weapon-list">${list.length?list.map(w=>weaponCardMarkup(w,{smith:true})).join(''):'<div class="camp-empty-note">と、思ったが<br>メダルに出来る武器が無いようだ</div>'}</div></section>`;
    bindImages(root);$$('[data-forge-medal]',root).forEach(b=>b.onclick=()=>forgeWeaponMedal(b.dataset.forgeMedal));
    $$('[data-smith-action]',root).forEach(b=>b.onclick=()=>{const a=b.dataset.smithAction;if(a==='forge')$('#smithForgeList')?.scrollIntoView({behavior:'smooth',block:'start'});else if(a==='equip'){equipmentTab='equip';renderEquipment();}else if(a==='home')leaveBlacksmith();});return;
  }
  if(equipmentTab==='catalog'){
    root.innerHTML=`<section class="panel"><div class="section-title"><div><small>WEAPON CATALOG</small><h2>登録武器</h2></div><span class="pill">${WEAPONS.length}種</span></div><p class="panel-note">正しい武器指示書のSEASON 1～5、01～88を全登録しています。MAINは100%、SUBはステータス50%、MEDALはステータス10%・特性100%です。</p><div class="weapon-catalog-grid">${WEAPONS.map(w=>`<div class="weapon-catalog-card ready"><img src="${w.image}" alt="${w.name}" loading="lazy" decoding="async"><b>${w.id}. ${w.name}</b><small>SEASON ${w.season} / ${w.type} / ${w.attribute}</small><em>${weaponStatsText(w)} / ${w.price.toLocaleString()}G</em><p>${weaponTraitText(w)}</p></div>`).join('')}</div></section>`;bindImages(root);return;
  }
  root.innerHTML=`<section class="panel equipment-player-panel">
    <div class="equipment-party-strip">${state.party.map(([id])=>{const q=player(id);return `<button class="${q.id===p.id?'active':''}" data-equip-player="${q.id}" type="button"><img src="${versionedPlay(q.image)}" alt="${q.name}"><b>${q.name}</b></button>`;}).join('')}</div>
    <div class="equipment-selected"><img src="${versionedPlay(p.image)}" alt="${p.name}"><div><small>EQUIPMENT / Lv${lv}</small><h2>${p.name}</h2><p>装備可能：${weaponAllowedText(p)}</p><button class="equipment-detail-btn" data-status-detail="${p.id}" type="button">詳細確認</button></div></div>
    <div class="equipment-stat-grid">${equipmentStatRows(p,lv,eq)}</div>
    <div class="equipment-slots">
      ${equipmentSlotMarkup(p,'main',0,eq.main)}
      ${equipmentSlotMarkup(p,'sub',0,eq.sub)}
      ${armorSlotMarkup(p.id,eq.armor)}
      ${eq.medals.map((id,i)=>equipmentSlotMarkup(p,'medal',i,id)).join('')}
    </div>
    ${figureResonanceMarkup(p.id,true)}
    <p class="panel-note">MAINはステータス100%＋攻撃エフェクト。SUBはステータス50%。SUBの特性とメダル特性は100%発動します。メダルは元武器ステータス10%＋特性です。フィギュアは専用タブで4体まで編成できます。</p>
  </section>`;
  bindImages(root);$$('[data-equip-player]',root).forEach(b=>b.onclick=()=>{equipmentPlayerId=b.dataset.equipPlayer;renderEquipment();});$$('[data-status-detail]',root).forEach(b=>b.onclick=()=>openEquipmentDetail(b.dataset.statusDetail));
  $$('[data-equip-slot]',root).forEach(b=>b.onclick=()=>openWeaponPicker(p.id,b.dataset.equipSlot,Number(b.dataset.equipIndex||0),()=>renderEquipment()));
}
async function buyWeapon(id){const w=weaponById(id);if(!w?.price)return;if(state.coins<w.price)return toast('ゴールドが足りません');const a=await dialog(`${w.name}を購入しますか？\n${w.price.toLocaleString()}G`,[['はい','yes','primary'],['いいえ','no']],'WEAPON SHOP');if(a!=='yes')return;state.coins-=w.price;state.meta.coins=state.coins;addWeapon(w.id,1);saveMeta();renderHome();renderEquipment();await dialog('毎度！大事に使ってくれ！',[['OK','ok','primary']],'WEAPON SHOP');}
async function runSmithHammerFx(){const fx=$('#smithHammerFx');if(!fx){await fixedDelay(3000);return;}fx.hidden=false;await fixedDelay(3000);fx.hidden=true;}
async function forgeWeaponMedal(id){
  const w=weaponById(id);if(!w)return;
  if(freeWeaponCount(id)<3){await dialog('と、思ったが\nメダルに出来る武器が無いようだ',[['戻る','back','primary']],'モブゴンゾー','play/002.png');return renderEquipment();}
  const a=await dialog(`${w.name}\nこの武器でいいのか？`,[['はい','yes','primary'],['いいえ','no']],'モブゴンゾー','play/002.png');if(a!=='yes')return renderEquipment();
  toast('よし来た！');await runSmithHammerFx();
  state.meta.weapons[id]=Math.max(0,weaponOwned(id)-3);addMedal(id,1);saveMeta();
  await dialog(`よし！出来たぞ！\n「${w.name}メダルを手に入れた！」`,[['OK','ok','primary']],'モブゴンゾー','play/002.png');renderEquipment();
}
function openWeaponPicker(pid,kind,index=0,onDone=null){
  pid=canonicalPlayerId(pid);const p=player(pid),eq=equipmentFor(pid),overlay=$('#weaponPickerOverlay'),list=$('#weaponPickerList');weaponPickerContext={pid,kind,index,onDone};
  $('#weaponPickerTitle').textContent=kind==='armor'?`${p.name} / 防具を選択`:kind==='medal'?`${p.name} / 所持メダルを選択`:`${p.name} / ${weaponEquipSlotName(kind,index)}`;
  let items=[];
  if(kind==='armor')items=ARMORS.filter(a=>armorOwned(a.id)>0&&(freeArmorCount(a.id,pid)>0||eq.armor===a.id));
  else if(kind==='medal')items=WEAPONS.filter(w=>medalOwned(w.id)>0&&(freeMedalCount(w.id,{pid,slot:'medal',index})>0||eq.medals[index]===w.id));
  else items=WEAPONS.filter(w=>canEquipWeapon(p,w)&&weaponOwned(w.id)>0&&(freeWeaponCount(w.id,{pid,slot:kind})>0||eq[kind]===w.id));
  const current=kind==='medal'?eq.medals[index]:eq[kind];
  if(kind==='armor'){list.innerHTML=`<button class="weapon-picker-item clear" data-picker-armor="" type="button"><b>外す</b><small>防具を外します</small></button>${items.map(a=>`<button class="weapon-picker-item ${current===a.id?'active':''}" data-picker-armor="${a.id}" type="button"><img src="${a.image}" alt="${a.name}"><div><b>${a.name}</b><small>ARMOR</small><em>${armorStatsText(a)}</em><p>${a.traitLabel}</p></div></button>`).join('')||'<div class="camp-empty-note">装備できる所持防具がありません。</div>'}`;bindImages(list);overlay.hidden=false;$$('[data-picker-armor]',list).forEach(b=>b.onclick=()=>{const id=b.dataset.pickerArmor||null;if(id&&freeArmorCount(id,pid)<1&&eq.armor!==id)return toast('この防具は装備できません');eq.armor=id;state.meta.equipment[pid]=eq;saveMeta();overlay.hidden=true;weaponPickerContext=null;onDone?.();});return;}
  list.innerHTML=`<button class="weapon-picker-item clear" data-picker-weapon="" type="button"><b>外す</b><small>このスロットを空にします</small></button>${items.map(w=>{const scale=kind==='main'?1:(kind==='sub'?0.5:0.1);return `<button class="weapon-picker-item ${current===w.id?'active':''}" data-picker-weapon="${w.id}" type="button"><img src="${w.image}" alt="${kind==='medal'?w.name+'メダル':w.name}" loading="lazy" decoding="async"><div><b>${kind==='medal'?w.name+'メダル':w.name}</b><small>${kind==='medal'?'MEDAL / ':''}${w.type} / ${w.attribute}</small><em>${weaponStatsText(w,scale)}</em><p>${weaponTraitText(w)}</p></div></button>`;}).join('')||'<div class="camp-empty-note">装備できる所持品がありません。</div>'}`;
  bindImages(list);overlay.hidden=false;$$('[data-picker-weapon]',list).forEach(b=>b.onclick=()=>{const id=b.dataset.pickerWeapon||null;if(kind==='medal'&&id&&medalOwned(id)<1)return toast('メダル以外は装着できません');if(!setPlayerEquipment(pid,kind,index,id))return toast(kind==='medal'?'このメダルは装着できません':'この武器は装備できません');overlay.hidden=true;weaponPickerContext=null;onDone?.();});
}
function closeWeaponPicker(){const x=$('#weaponPickerOverlay');if(x)x.hidden=true;weaponPickerContext=null;}
function openEquipmentScreen(){equipmentTab='equip';equipmentPlayerId=state.party[0]?.[0]||'yusha';renderEquipment();showScreen('equipment');}

let inventoryTab='item';
function inventoryItemEffectText(it){return itemEffectText(it)||'所持アイテム';}
function inventoryTargetStatus(pid){const entry=state.party.find(x=>x[0]===pid),p=player(pid);if(!entry||!p)return null;const st=baseStats(p,entry[1]),v=ensureAdventureVitals()[pid];return{entry,p,st,v};}
function renderInventory(){const body=$('#inventoryBody'),ov=$('#inventoryOverlay');if(!body||!ov)return;$$('[data-inventory-tab]',ov).forEach(b=>b.classList.toggle('active',b.dataset.inventoryTab===inventoryTab));
  if(inventoryTab==='item'){
    const list=GAME_ITEMS.filter(it=>itemCount(it.id)>0);body.innerHTML=`<div class="inventory-list">${list.length?list.map(it=>`<button class="inventory-row" data-inventory-item="${it.id}" type="button"><img src="${it.image}" alt="${it.name}"><div><b>${it.name}</b><small>${inventoryItemEffectText(it)}</small></div><em>×${itemCount(it.id)}</em></button>`).join(''):'<div class="inventory-empty">所持アイテムはありません。</div>'}</div>`;
    bindImages(body);$$('[data-inventory-item]',body).forEach(b=>b.onclick=()=>showInventoryItemTargets(b.dataset.inventoryItem));return;
  }
  if(inventoryTab==='equipment'){
    const list=WEAPONS.filter(w=>weaponOwned(w.id)>0);body.innerHTML=`<div class="inventory-list">${list.length?list.map(w=>`<div class="inventory-row static"><img src="${w.image}" alt="${w.name}"><div><b>${w.name}</b><small>${w.type} / ${w.attribute}<br>${weaponStatsText(w)} / ${weaponTraitText(w)}</small></div><em>×${weaponOwned(w.id)}</em></div>`).join(''):'<div class="inventory-empty">所持装備はありません。</div>'}</div>`;bindImages(body);return;
  }
  if(inventoryTab==='figures'){
    const list=FIGURES.filter(f=>!f.pending&&figureOwned(f.id)>0);body.innerHTML=`<div class="inventory-list">${list.length?list.map(f=>`<div class="inventory-row static"><img src="${f.image}" alt="${f.name}"><div><b>${f.name}</b><small>${f.rarity} / ${f.statsText}<br>${f.traitText}</small></div><em>×${figureOwned(f.id)}</em></div>`).join(''):'<div class="inventory-empty">所持フィギュアはありません。</div>'}</div>`;bindImages(body);return;
  }
  if(inventoryTab==='medals'){
    const list=WEAPONS.filter(w=>medalOwned(w.id)>0);body.innerHTML=`<div class="inventory-list">${list.length?list.map(w=>`<div class="inventory-row static"><img src="${w.image}" alt="${w.name}メダル"><div><b>${w.name}メダル</b><small>武器能力10%＋特性を引き継ぐ</small></div><em>×${medalOwned(w.id)}</em></div>`).join(''):'<div class="inventory-empty">所持メダルはありません。</div>'}</div>`;bindImages(body);return;
  }
  const list=ARMORS.filter(a=>armorOwned(a.id)>0);body.innerHTML=`<div class="inventory-list armor-inventory-list">${list.length?list.map(a=>`<div class="inventory-row static armor-row"><img src="${a.image}" alt="${a.name}"><div><b>${a.id}. ${a.name}</b><small>${armorStatsText(a)}<br>${a.traitLabel}</small></div><em>×${armorOwned(a.id)}</em></div>`).join(''):'<div class="inventory-empty">所持防具はありません。<br>防具はサブクエストなどのドロップで入手できます。</div>'}</div>`;bindImages(body);
}
function openInventory(){inventoryTab='item';renderInventory();$('#inventoryOverlay').hidden=false;}
function closeInventory(){$('#inventoryOverlay').hidden=true;}
async function showInventoryItemTargets(id){const it=itemData(id);if(!it||itemCount(id)<1)return;
  if(it.type==='record')return narrationDialog(`${it.name}はトレーニング施設で使用します。`);
  if(it.type==='battleBuff')return dialog(`${it.name}は戦闘中に使用するアイテムです。`,[['OK','ok']],'SYSTEM','');
  const body=$('#inventoryBody');if(it.type==='partyHp'){const vit=ensureAdventureVitals();let used=false;for(const [pid,lv] of state.party){const p=player(pid),st=baseStats(p,lv),x=vit[pid];if(x&&!x.dead&&x.hp<st.maxHp){x.hp=Math.min(st.maxHp,x.hp+it.amount);used=true;}}if(!used)return toast('HPが減っているメンバーはいません');consumeItem(id);saveAdventure();toast(`${it.name}を使用しました`);renderInventory();return;}
  body.innerHTML=`<button class="inventory-back" data-inventory-back type="button">← アイテム一覧</button><div class="inventory-target-title"><img src="${it.image}" alt="${it.name}"><div><small>USE ITEM</small><b>${it.name}</b><span>${inventoryItemEffectText(it)}</span></div></div><div class="inventory-target-grid">${state.party.map(([pid])=>{const t=inventoryTargetStatus(pid);if(!t)return'';const status=t.v?.dead?'DOWN':Object.values(t.v?.status||{}).some(n=>n>0)?'状態異常':'健康';return`<button data-inventory-target="${pid}" type="button" class="${t.v?.dead?'down':status==='状態異常'?'abnormal':t.v?.hp<t.st.maxHp?'hurt':'healthy'}"><img src="${versionedPlay(t.p.image)}" alt="${t.p.name}"><b>${t.p.name}</b><small>HP ${Math.round(t.v.hp)}/${t.st.maxHp}<br>MP ${Math.round(t.v.mp)}/${t.st.maxMp}</small><em>${status}</em></button>`;}).join('')}</div>`;bindImages(body);$('[data-inventory-back]',body).onclick=renderInventory;$$('[data-inventory-target]',body).forEach(b=>b.onclick=()=>useInventoryItemOn(id,b.dataset.inventoryTarget));
}
function useInventoryItemOn(id,pid){const it=itemData(id),t=inventoryTargetStatus(pid);if(!it||!t||itemCount(id)<1)return;const {p,st,v}=t;let ok=false,msg='';if(it.type==='hp'&&!v.dead&&v.hp<st.maxHp){const n=Math.round(rint(it.min,it.max)*(1+Number(figureEffectsFor(pid).healBoost||0))),before=v.hp;v.hp=Math.min(st.maxHp,v.hp+n);ok=true;msg=`HPが${Math.round(v.hp-before)}回復した！`;}else if(it.type==='mp'&&!v.dead&&v.mp<st.maxMp){const n=rint(it.min,it.max);v.mp=Math.min(st.maxMp,v.mp+n);ok=true;msg=`MPが${n}回復した！`;}else if(it.type==='cure'&&!v.dead&&v.status[it.status]>0){v.status[it.status]=0;ok=true;msg='状態異常が治った！';}else if(it.type==='cureAll'&&!v.dead&&Object.values(v.status).some(n=>n>0)){for(const k of Object.keys(v.status))v.status[k]=0;ok=true;msg='状態異常が全て治った！';}else if(it.type==='hpmp'&&!v.dead&&(v.hp<st.maxHp||v.mp<st.maxMp)){v.hp=Math.min(st.maxHp,v.hp+200);v.mp=Math.min(st.maxMp,v.mp+200);ok=true;msg='HPとMPが回復した！';}else if(it.type==='full'&&!v.dead&&(v.hp<st.maxHp||v.mp<st.maxMp)){v.hp=st.maxHp;v.mp=st.maxMp;ok=true;msg='HPとMPが全回復した！';}else if(it.type==='revive'&&v.dead){v.dead=false;v.hp=Math.max(1,Math.round(st.maxHp*it.ratio));ok=true;msg=`${p.name}が復活した！`;}if(!ok)return toast('今はこのアイテムを使用できません');consumeItem(id);saveAdventure();toast(msg);renderInventory();}

function playerDetailMagic(p){const element=normalizeElement(p.attribute),all=MOB_DATA.magicCatalog||[];return all.find(x=>x.element===element&&x.tier==='medium')||all.find(x=>x.element===element)||null;}
function playerDetailTechnique(p){return temporaryTechnique({...p,equipment:equipmentFor(p.id)});}
function openPlayerDetail(pid){const row=state.party.find(x=>x[0]===pid),p=player(pid),ov=$('#playerDetailOverlay'),body=$('#playerDetailBody');if(!row||!p||!ov||!body)return;const lv=row[1],st=baseStats(p,lv),v=ensureAdventureVitals()[pid],eq=equipmentFor(pid),magic=playerDetailMagic(p),tech=playerDetailTechnique(p),ults=(p.ults||[]).filter((u,i)=>i<4?lv>=ULT_UNLOCK_LEVELS[i]:(p.id==='yusha'&&state.meta?.heroPassive2Unlocked===true));body.innerHTML=`<div class="player-detail-hero"><img src="${versionedPlay(p.image)}" alt="${p.name}"><div><small>${p.attribute} / ${p.weapon}</small><h2>${p.name}</h2><b>Lv${lv}</b><em>${statusLabel(v)}</em></div></div><section><h3>ステータス</h3><div class="player-detail-stats"><span>HP <b>${Math.round(v.hp)}/${st.maxHp}</b></span><span>MP <b>${Math.round(v.mp)}/${st.maxMp}</b></span><span>ATK <b>${st.atk}</b></span><span>MAG <b>${st.mag}</b></span><span>DEF <b>${st.def}</b></span><span>MND <b>${st.res}</b></span><span>SPD <b>${st.spd}</b></span></div></section><section><h3>魔法</h3>${magic?`<div class="player-detail-list"><span><b>${magic.name}</b><small>MP ${magic.cost} / ${magic.element}属性 / ${magic.target==='all'?'敵全体':'敵単体'}</small></span></div>`:'<p>現在使用できる魔法はありません。</p>'}</section><section><h3>特技</h3>${tech?`<div class="player-detail-list"><span><b>${tech.name}</b><small>MP ${tech.cost} / 現在使用可能な基本特技</small></span></div>`:'<p>現在使用できる特技はありません。</p>'}</section><section><h3>装備</h3><div class="player-detail-list"><span><b>MAIN</b><small>${eq.main?weaponById(eq.main)?.name||eq.main:'なし'}</small></span><span><b>SUB</b><small>${eq.sub?weaponById(eq.sub)?.name||eq.sub:'なし'}</small></span><span><b>ARMOR</b><small>${eq.armor?armorById(eq.armor)?.name||eq.armor:'なし'}</small></span><span><b>FIGURE</b><small>${figureEquipmentFor(pid).filter(Boolean).map(id=>figureById(id)?.name||id).join(' / ')||'なし'}</small></span></div></section><section><h3>必殺技</h3><div class="player-detail-list">${ults.length?ults.map(u=>`<span><b>${u.name}</b><small>${u.desc}</small></span>`).join(''):'<span><b>現在習得している必殺技はありません。</b></span>'}</div></section>`;bindImages(body);ov.hidden=false;}
function closePlayerDetail(){const ov=$('#playerDetailOverlay');if(ov)ov.hidden=true;}
function defaultMeta(){return{coins:0,diamonds:0,exp:{},inventory:{},drinkSets:{},weapons:{},medals:{},armors:{},equipment:{},subquests:{cleared:{}},figures:{},figureEquipment:{},figureOrder:[],ultimateCooldowns:{},openingCompleted:false,starterGrantReceived:false,firstGrassReviveUsed:false,firstGrassReviveCount:0,defeatedBosses:[],defeatedElites:[]};}
function loadMeta(){try{const v=JSON.parse(localStorage.getItem('mobQuestMetaV1'));if(v&&typeof v==='object'){const equipment={...(v.equipment||{})};if(equipment.jerry&&!equipment.jessie){equipment.jessie=equipment.jerry;delete equipment.jerry;}return{...defaultMeta(),...v,exp:{...(v.exp||{})},inventory:{...(v.inventory||{})},drinkSets:{...(v.drinkSets||{})},weapons:{...(v.weapons||{})},medals:{...(v.medals||{})},armors:{...(v.armors||{})},subquests:{cleared:{...(v.subquests?.cleared||{})}},equipment,figures:{...(v.figures||{})},figureEquipment:{...(v.figureEquipment||{})},figureOrder:[...(v.figureOrder||[])],ultimateCooldowns:{...(v.ultimateCooldowns||{})},defeatedBosses:[...(v.defeatedBosses||[])],defeatedElites:[...(v.defeatedElites||[])]};}}catch(_){}return defaultMeta();}
function saveMeta(){if(!state?.meta)return;state.meta.coins=state.coins;try{localStorage.setItem('mobQuestMetaV1',JSON.stringify(state.meta));}catch(_){}}
function itemData(id){return GAME_ITEMS.find(x=>x.id===String(id).padStart(2,'0'));}
function itemCount(id){return Math.max(0,Number(state.meta?.inventory?.[id])||0);}
function addItem(id,n=1){if(!state.meta.inventory)state.meta.inventory={};state.meta.inventory[id]=itemCount(id)+n;saveMeta();}
function consumeItem(id,n=1){if(itemCount(id)<n)return false;state.meta.inventory[id]=itemCount(id)-n;saveMeta();return true;}
function tentCount(){return Math.max(0,Number(state.meta?.inventory?.['mob-tent'])||0);}

const screens={title:$('#titleScreen'),home:$('#homeScreen'),loading:$('#loadingScreen'),tavern:$('#tavernScreen'),castle:$('#castleScreen'),equipment:$('#equipmentScreen'),training:$('#trainingScreen'),quest:$('#questScreen'),adventure:$('#adventureScreen'),battle:$('#battleScreen')};
const defaultParty=[['yusha',5],['pink',5]];
const initialMeta=loadMeta();
const initialCoins=Number(initialMeta.coins);
const state={
  party:loadParty(), coins:Number.isFinite(initialCoins)?initialCoins:0, meta:initialMeta,
  training:{party:null,enemySlots:[{id:'boss-hawk',level:8},null,null,null],activeEnemySlot:0,filter:'草原',mode:'menu',programSeason:null},
  quest:null,
  adventure:loadAdventure(),
  battle:null, speed:1, autoBattle:loadAutoBattlePreference(), tavernSwapIndex:null,
  test:loadTestSettings(),
  noticeQueue:[],noticeBusy:false
};
let scriptedBattleResolve=null;

const PASSIVE_RATE_SCALE=1;
function spriteScale(){return 1;}
function passiveChance(base){return Math.random()<(base*PASSIVE_RATE_SCALE);}

function canonicalPlayerId(id){return id==='jerry'?'jessie':id;}
function player(id){const cid=canonicalPlayerId(id);return MOB_DATA.players.find(x=>x.id===cid);}
function boss(id){return MOB_DATA.bosses.find(x=>x.id===id);}
function enemyTemplate(id){return MOB_DATA.enemyCatalog?.find(x=>x.id===id)||null;}
function legacyBossTemplate(b){return{id:`legacy-${b.id}`,bossId:b.id,name:b.name,stage:b.stage,category:'boss',attribute:b.attribute,image:b.image,symbol:b.symbol||'敵',levelMin:50,levelMax:50,special:b.special,kind:b.kind,power:b.power,hits:b.hits,skillType:b.skillType||'physical',normalAttackType:b.normalAttackType||'physical',bg:b.bg,fallbackBg:b.fallbackBg,trainingLegacy:true};}
function trainingEnemyCatalog(){const base=[...(MOB_DATA.enemyCatalog||[])],seen=new Set(base.map(x=>x.bossId).filter(Boolean));for(const b of MOB_DATA.bosses||[])if(!seen.has(b.id))base.push(legacyBossTemplate(b));return base;}
const SPECIAL_ENEMIES=[
  {id:'sp-metal',name:'モブメタルスライム',stage:'経験値',category:'normal',attribute:'無',image:'spenemy/001.png',symbol:'経',levelMin:2,levelMax:52,escapeRate:.30,metalBody:true,fixedHp:4,rewardExp:1206,rewardCoin:14,actionCount:1,normalAttackType:'physical',mods:{spd:1.35}},
  {id:'sp-metal-coin',name:'モブメタルコインスライム',stage:'経験値',category:'normal',attribute:'無',image:'spenemy/002.png',symbol:'経',levelMin:12,levelMax:52,escapeRate:.40,metalBody:true,fixedHp:8,rewardExp:12060,rewardCoin:24,actionCount:1,normalAttackType:'physical',mods:{spd:1.42}},
  {id:'sp-metal-king',name:'モブキングメタルスライム',stage:'経験値',category:'elite',attribute:'無',image:'spenemy/003.png',symbol:'王',levelMin:26,levelMax:52,escapeRate:.20,metalBody:true,fixedHp:25,rewardExp:48240,rewardCoin:36,actionCount:1,normalAttackType:'physical',mods:{spd:1.35}},
  {id:'sp-gold',name:'モブゴールドスライム',stage:'ゴールド',category:'normal',attribute:'光',image:'spenemy/004.png',symbol:'G',levelMin:2,levelMax:52,rewardExpScale:.35,rewardCoinBase:900,rewardCoinPerLevel:26,actionCount:1,normalAttackType:'physical',mods:{hp:.78,def:1.45,res:1.45,spd:1.25}},
  {id:'sp-gold-coin',name:'モブゴールドコインスライム',stage:'ゴールド',category:'normal',attribute:'光',image:'spenemy/005.png',symbol:'G',levelMin:12,levelMax:52,rewardExpScale:.45,rewardCoinBase:2400,rewardCoinPerLevel:48,actionCount:1,normalAttackType:'physical',mods:{hp:.84,def:1.55,res:1.55,spd:1.30}},
  {id:'sp-gold-king',name:'モブキングゴールドスライム',stage:'ゴールド',category:'elite',attribute:'光',image:'spenemy/006.png',symbol:'王',levelMin:26,levelMax:52,rewardExpScale:.60,rewardCoinBase:6500,rewardCoinPerLevel:95,actionCount:1,normalAttackType:'physical',mods:{hp:.72,def:1.7,res:1.7,spd:1.28}},
  {id:'sq-savanna-variant',name:'モブサバンナ亜種',stage:'草原',category:'elite',attribute:'地',image:'spenemy/007.png',symbol:'亜',levelMin:10,levelMax:10,mods:{spd:1.45,atk:1.08}},
  {id:'sq-gold-mummy',name:'モブゴールデンミイラ',stage:'砂漠',category:'elite',attribute:'光',image:'spenemy/008.png',symbol:'金',levelMin:12,levelMax:12,mods:{def:1.55,res:1.25},rewardCoinScale:2.5},
  {id:'sq-gold-nekomummy',name:'モブゴールデンネコミイラ',stage:'砂漠',category:'normal',attribute:'光',image:'spenemy/009.png',symbol:'金',levelMin:10,levelMax:10,mods:{def:1.45,res:1.2},rewardCoinScale:2},
  {id:'sq-mini-guardian',name:'モブミニガーディアン',stage:'田舎町',category:'elite',attribute:'地',image:'spenemy/010.png',symbol:'守',levelMin:15,levelMax:15,mods:{def:1.45,hp:1.1}},
  {id:'sq-mini-guardian2',name:'モブミニガーディアンⅡ',stage:'田舎町',category:'elite',attribute:'地',image:'spenemy/011.png',symbol:'守',levelMin:20,levelMax:20,mods:{def:1.55,hp:1.18}},
  {id:'sq-neon-chaser-neo',name:'モブエネチェイサーネオ',stage:'ネオン街',category:'elite',attribute:'地',image:'spenemy/011.png',symbol:'追',levelMin:25,levelMax:25,special:'ネオチェイス',kind:'aoe',power:.82,skillType:'physical',preemptive:true,actionCount:2,forceActionCount:true,mods:{spd:1.42,atk:1.08}},
  {id:'sq-high-abyss',name:'モブハイアビスソルジャー',stage:'海底',category:'elite',attribute:'水',image:'enemy/105.png',symbol:'騎',levelMin:48,levelMax:48,special:'アビスブレード',kind:'single',power:1.18,skillElement:'水',skillType:'physical',mods:{hp:1.16,atk:1.12,def:1.12}},
  {id:'sq-wave-serious',name:'モブウェイブ',stage:'海底',category:'elite',attribute:'水',image:'enemy/120.png',symbol:'波',levelMin:50,levelMax:50,special:'ウォーターグラビディ',kind:'single',power:1.22,skillElement:'水',skillType:'magic',actionCount:2,forceActionCount:true,firstActionSpec:{special:'コンフューズウェイブ',kind:'confuseSingle',power:.84,chance:1,skillElement:'水',skillType:'magic'},halfDefBuff:.20},
  {id:'sq-power-jones',name:'モブパワージョーンズ',stage:'海底',category:'elite',attribute:'水',image:'enemy/118.png',symbol:'波',levelMin:55,levelMax:55,special:'パワーウェーブショック',kind:'aoe',power:.88,skillElement:'水',skillType:'magic',actionCount:2,forceActionCount:true,mods:{hp:1.22,atk:1.18,mag:1.16}},
  {id:'sq-wing-slime',name:'モブハネスライム',stage:'草原Ⅱ',category:'elite',attribute:'風',image:'enemy/01.png',symbol:'翼',levelMin:50,levelMax:50,alwaysSpecial:true,specialOptions:[{special:'ハネパニック',kind:'confuseSingle',power:.78,chance:.45,skillElement:'風',skillType:'magic'},{special:'ハネアタック',kind:'stunSingle',power:.82,chance:.35,skillElement:'風',skillType:'physical'}],mods:{spd:1.3}},
  {id:'sq-red-hawk',name:'モブレッドホーク',stage:'草原Ⅱ',category:'elite',attribute:'火',image:'boss/02.png',symbol:'炎',levelMin:60,levelMax:60,special:'レッドホークフレイム',kind:'aoe',power:.90,skillElement:'火',skillType:'magic',actionCount:2,forceActionCount:true,alwaysSpecial:true,mods:{spd:1.22,mag:1.15}},
  {id:'sq-blue-hawk',name:'モブブルーホーク',stage:'草原Ⅱ',category:'elite',attribute:'水',image:'boss/02.png',symbol:'水',levelMin:60,levelMax:60,special:'ブルーホークウェイブ',kind:'aoe',power:.90,skillElement:'水',skillType:'magic',actionCount:2,forceActionCount:true,alwaysSpecial:true,mods:{spd:1.22,mag:1.15}},
  {id:'sq-young-dragon',name:'若きモブドラゴン',stage:'マグマ',category:'elite',attribute:'火',image:'boss/09.png',symbol:'竜',levelMin:40,levelMax:40,special:'ヤングドラゴンフレイム',kind:'aoe',power:1.05,skillElement:'火',skillType:'magic',mods:{hp:.72,spd:1.35,atk:.92,mag:.95}}
];
function specialEnemyTemplate(id){return SPECIAL_ENEMIES.find(x=>x.id===id)||null;}
function trainingEnemyTemplate(id){return enemyTemplate(id)||specialEnemyTemplate(id)||trainingEnemyCatalog().find(x=>x.id===id)||null;}
function currentWorld(){return MOB_DATA.adventureWorlds?.[clamp(state.adventure.worldIndex||0,0,(MOB_DATA.adventureWorlds?.length||1)-1)]||MOB_DATA.adventureWorlds?.[0];}
function currentArea(){const w=currentWorld();return w?.areas?.[clamp(state.adventure.areaIndex||0,0,3)]||w?.areas?.[0];}
function normalizeElement(attr){return ['火','水','雷','地','風','光','闇','無'].find(e=>String(attr).includes(e))||'無';}
function playerLevelCap(){if(state.test?.enabled)return 120;const worlds=MOB_DATA.adventureWorlds||[],castle=worlds.findIndex(w=>w.id==='demonCastle'),wi=Number(state.adventure?.worldIndex)||0;if(castle<0)return 99;return (wi>castle||(wi===castle&&state.adventure?.completed))?120:99;}
function delay(ms){return new Promise(r=>setTimeout(r,Math.max(25,ms/state.speed)));}
function fixedDelay(ms){return new Promise(r=>setTimeout(r,ms));}
function showScreen(name){Object.entries(screens).forEach(([k,v])=>v.classList.toggle('active',k===name));}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600);}

function saveParty(){try{localStorage.setItem('mobQuestPartyV4',JSON.stringify(state.party.slice(0,10)));}catch(_){} }
function loadParty(){
  try{
    const raw=localStorage.getItem('mobQuestPartyV4')||localStorage.getItem('mobQuestPartyV3')||localStorage.getItem('mobQuestPartyV2');
    const v=JSON.parse(raw);if(Array.isArray(v)&&v.length){const seen=new Set();const clean=v.filter(x=>Array.isArray(x)&&player(x[0])).map(x=>[canonicalPlayerId(x[0]),clamp(Number(x[1])||1,1,120)]).filter(x=>!seen.has(x[0])&&(seen.add(x[0])||true)).slice(0,10);if(clean.length)return clean;}
  }catch(_){}
  return defaultParty.map(x=>[...x]);
}
function defaultAdventure(){return {worldIndex:0,areaIndex:0,battleIndex:0,battleReady:false,completed:false,pendingEncounter:null,vitals:null,checkpoint:null,runSnapshot:null,storyFlags:{},pendingPostStory:null,campUsed:{},areaBuff:null,awaitingReport:null,reportedWorlds:[]};}
function loadAdventure(){
  try{const v=JSON.parse(localStorage.getItem('mobQuestAdventureV5'));if(v&&typeof v==='object'){const out={...defaultAdventure(),...v};out.storyFlags=(v.storyFlags&&typeof v.storyFlags==='object')?v.storyFlags:{};out.reportedWorlds=Array.isArray(v.reportedWorlds)?[...v.reportedWorlds]:[];const worlds=MOB_DATA.adventureWorlds||[],last=Math.max(0,worlds.length-1);if(out.completed&&Number(out.worldIndex)<last){out.completed=false;out.worldIndex=Math.min(last,(Number(out.worldIndex)||0)+1);out.areaIndex=0;out.battleIndex=0;out.battleReady=false;out.pendingEncounter=null;out.vitals=null;}out.worldIndex=clamp(Number(out.worldIndex)||0,0,last);/* existing saves are treated as already reported up to their current world */for(let i=0;i<out.worldIndex;i++){const id=worlds[i]?.id;if(id&&!out.reportedWorlds.includes(id))out.reportedWorlds.push(id);}return out;}}catch(_){}
  try{const old=JSON.parse(localStorage.getItem('mobQuestAdventureV4'));if(old&&typeof old==='object')return{...defaultAdventure(),areaIndex:clamp(Number(old.progress)||0,0,3),battleReady:!!old.battleReady,completed:false,vitals:old.vitals||null,checkpoint:null};}catch(_){}
  return defaultAdventure();
}
function saveAdventure(){try{localStorage.setItem('mobQuestAdventureV5',JSON.stringify(state.adventure));}catch(_){} }
function makeAdventureRunSnapshot(){const adv=clone(state.adventure||defaultAdventure());adv.runSnapshot=null;return{coins:Number(state.coins)||0,meta:clone(state.meta),party:clone(state.party),adventure:adv};}
function ensureAdventureRunSnapshot(){if(state.adventure?.runSnapshot||state.adventure?.awaitingReport||state.adventure?.completed)return;state.adventure.runSnapshot=makeAdventureRunSnapshot();saveAdventure();saveParty();saveMeta();}
function commitAdventureRun(){if(state.adventure?.runSnapshot){state.adventure.runSnapshot=null;saveAdventure();}}
function adventureRunActive(){return!!state.adventure?.runSnapshot&&!state.adventure?.awaitingReport&&!state.adventure?.completed;}
async function abandonAdventure(){
  if(!adventureRunActive())return;
  const ans=await dialog('冒険を諦めますか？\nこの冒険中に獲得した経験値・G・ダイヤ・アイテム・装備・イベント進行はすべて無効になります。',[['冒険を諦める','yes','danger'],['続ける','no','primary']],'ADVENTURE');
  if(ans!=='yes')return;
  const snap=clone(state.adventure.runSnapshot);if(!snap)return;
  state.coins=Math.max(0,Number(snap.coins)||0);state.meta={...defaultMeta(),...clone(snap.meta||{})};state.meta.coins=state.coins;state.party=(clone(snap.party)||defaultParty.map(x=>[...x])).map(x=>Array.isArray(x)?[canonicalPlayerId(x[0]),x[1]]:x);state.adventure={...defaultAdventure(),...clone(snap.adventure||{}),runSnapshot:null,checkpoint:null};state.battle=null;state.quest=null;storyBusy=false;storySceneExtras=[];
  $('#campOverlay').hidden=true;$('#exploreOverlay').hidden=true;$('#storyScene').hidden=true;$('#resultOverlay').hidden=true;saveMeta();saveParty();saveAdventure();state.training.party=state.party.map(x=>[...x]);await goHome();await narrationDialog('冒険を諦めました。\n今回の冒険で得たものとイベント進行は元に戻りました。');
}


function bindImage(img){if(!img||img.dataset.bound==='1')return;img.dataset.bound='1';img.draggable=false;img.addEventListener('error',()=>{const f=img.dataset.fallbackSrc;if(f&&img.dataset.tried!=='1'){img.dataset.tried='1';img.src=f;return;}img.classList.add('asset-missing');});img.addEventListener('load',()=>img.classList.remove('asset-missing'));}
function bindImages(root=document){$$('img',root).forEach(bindImage);}
function setImage(img,src,fallback=''){if(!img)return;img.classList.remove('asset-missing');img.dataset.tried='0';if(fallback)img.dataset.fallbackSrc=fallback;img.src=src;bindImage(img);}

const assetPreloadCache=new Map();
const assetImageCache=new Map();
function preloadAsset(src,priority='auto'){
  if(!src)return Promise.resolve(false);
  if(assetPreloadCache.has(src))return assetPreloadCache.get(src);
  const img=new Image();
  img.decoding='async';
  try{img.fetchPriority=priority;}catch(_){}
  assetImageCache.set(src,img);
  const task=new Promise(resolve=>{
    let settled=false;
    let watchdog=0;
    const done=async ok=>{
      if(settled)return;
      settled=true;
      clearTimeout(watchdog);
      img.onload=null;
      img.onerror=null;
      if(ok&&img.decode){
        try{await Promise.race([img.decode(),new Promise(r=>setTimeout(r,900))]);}catch(_){}
      }
      resolve(!!ok);
    };
    img.onload=()=>done(true);
    img.onerror=()=>done(false);
    /* A stalled GitHub Pages/image request must never freeze the whole game. */
    watchdog=setTimeout(()=>done(false),3200);
    try{img.src=src;}catch(_){done(false);return;}
    if(img.complete)done(img.naturalWidth>0);
  });
  assetPreloadCache.set(src,task);
  return task;
}
async function preloadAssets(paths,onProgress){
  const unique=[...new Set((paths||[]).filter(Boolean))];
  if(!unique.length){onProgress?.(1,1);return;}
  let done=0;
  await Promise.allSettled(unique.map(async src=>{
    try{return await preloadAsset(src);}finally{
      done++;
      onProgress?.(done,unique.length);
    }
  }));
}
async function preloadAssetsSafe(paths,timeout=800){
  try{
    await Promise.race([
      preloadAssets(paths),
      new Promise(resolve=>setTimeout(resolve,timeout))
    ]);
  }catch(_){/* visual preload must never stop battle flow */}
}
function fastWarmAssetList(){
  /* v21: warm the current party first. Do not flood mobile Safari with every asset at boot. */
  const partyPlayers=state.party.map(([id])=>player(id)).filter(Boolean);
  const partyImages=partyPlayers.map(p=>versionedPlay(p.image)).filter(Boolean);
  const partyMagic=partyPlayers.flatMap(p=>Object.values(MOB_DATA.elements).find(e=>e===MOB_DATA.elements[normalizeElement(p.attribute)])?.frames||[]).filter(Boolean);
  const mainUlts=partyPlayers.slice(0,4).flatMap(p=>(p.ults||[]).map(u=>u.image)).filter(Boolean);
  const restUlts=MOB_DATA.players.flatMap(p=>(p.ults||[]).map(u=>u.image)).filter(Boolean);
  const restMagic=Object.values(MOB_DATA.elements).flatMap(e=>e.frames||[]).filter(Boolean);
  return [...new Set([...partyImages,...partyMagic,...mainUlts,...restUlts,...restMagic])];
}
let backgroundWarmStarted=false;
function startFastBackgroundWarmup(){
  if(backgroundWarmStarted)return;
  backgroundWarmStarted=true;
  const queue=fastWarmAssetList();
  let cursor=0;
  const workers=Math.min(2,queue.length); // network/decode contention is much lower on iPhone
  const idle=()=>new Promise(resolve=>{
    if('requestIdleCallback' in window)requestIdleCallback(()=>resolve(),{timeout:180});
    else setTimeout(resolve,24);
  });
  const run=async()=>{
    while(cursor<queue.length){
      const src=queue[cursor++];
      try{await preloadAsset(src,'low');}catch(_){}
      await idle();
    }
  };
  for(let i=0;i<workers;i++)run();
}
function nextPaint(count=1){return new Promise(resolve=>{const step=()=>count--<=1?requestAnimationFrame(()=>resolve()):requestAnimationFrame(step);requestAnimationFrame(step);});}
async function ensureDomImageReady(img,src,timeout=650){
  if(!img||!src)return false;
  try{await Promise.race([preloadAsset(src,'high'),new Promise(r=>setTimeout(()=>r(false),timeout))]);}catch(_){}
  const abs=new URL(src,document.baseURI).href;
  if(img.src!==abs)img.src=src;
  try{
    if(img.decode)await Promise.race([img.decode(),new Promise(r=>setTimeout(r,timeout))]);
    else if(!img.complete)await Promise.race([new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true});}),new Promise(r=>setTimeout(r,timeout))]);
  }catch(_){}
  await new Promise(requestAnimationFrame);
  return !!img.naturalWidth;
}
function pageAssets(target){
  const party=state.party.map(([id])=>player(id)).filter(Boolean);
  const common=['icon/01.png',versionedPlay('play/02.png'),'mqicon/06.png','mqicon/09.png','mqicon/10.png','mqicon/12.png'];
  if(target==='tavern')return [...common,'back2/001.png',versionedPlay('play/001.png'),'icon/11.png','icon/13.png',...party.map(p=>versionedPlay(p.image))];
  if(target==='castle')return [...common,'back2/003.png','back/king1.png','back/king2.png','back/king3.png','back/king4.png','icon/18.png','icon/19.png','icon/20.png','icon/21.png',versionedPlay('play/005.png'),versionedPlay('play/006.png'),versionedPlay('play/007.png'),versionedPlay('play/008.png')];
  if(target==='training'){const first=state.training.enemySlots?.find(Boolean);return ['back2/002.png',versionedPlay('play/003.png'),'icon/14.png','icon/15.png','icon/16.png','icon/17.png','icon/22.png','mqicon/06.png',trainingEnemyTemplate(first?.id)?.image];}
  if(target==='adventure'){const w=currentWorld(),area=currentArea();return [...common,area?.bg,w?.fieldFallback,'mqicon/14.png','mqicon/15.png','mqicon/16.png',...party.slice(0,6).map(p=>versionedPlay(p.image))];}
  return common;
}
function configEnemyAssetRecords(config){
  if(Array.isArray(config.enemies))return config.enemies;
  if(Array.isArray(config.enemyConfigs))return config.enemyConfigs.map(x=>trainingEnemyTemplate(x.id)).filter(Boolean);
  if(Array.isArray(config.waves))return config.waves.flat().map(x=>trainingEnemyTemplate(x.id)).filter(Boolean);
  if(config.enemy)return [config.enemy];
  if(config.bossId)return [boss(config.bossId)].filter(Boolean);
  return [];
}
function battleAssets(config){
  const partyList=(config.party||state.party).slice(0,6),chars=partyList.map(([id])=>player(id)).filter(Boolean),enemies=configEnemyAssetRecords(config);
  return [...enemies.flatMap(e=>[e?.image,e?.bg,e?.fallbackBg]),...chars.map(c=>versionedPlay(c.image))].filter(Boolean);
}
function battleCriticalAssets(config){
  const partyList=(config.party||state.party).slice(0,4),chars=partyList.map(([id])=>player(id)).filter(Boolean),enemies=configEnemyAssetRecords(config);
  return [...enemies.flatMap(e=>[e?.image]),config.bg,config.fallbackBg,...enemies.slice(0,1).flatMap(e=>[e?.bg,e?.fallbackBg]),...chars.map(c=>versionedPlay(c.image))].filter(Boolean);
}
function battleActionAssets(config){
  const partyList=(config.party||state.party).slice(0,6),chars=partyList.map(([id])=>player(id)).filter(Boolean);
  const magic=chars.flatMap(c=>MOB_DATA.elements[normalizeElement(c.attribute)]?.frames||[]),ults=chars.flatMap(c=>(c.ults||[]).map(u=>u.image)),support=chars.slice(4).map(c=>versionedPlay(c.image));
  return [...new Set([...support,...magic,...ults].filter(Boolean))];
}
function warmBattleActionAssets(config){const queue=battleActionAssets(config);let i=0;const run=async()=>{while(i<queue.length){const src=queue[i++];try{await preloadAsset(src,'low');}catch(_){}await new Promise(r=>setTimeout(r,12));}};run();run();}
async function loadingWithAssets(text,assets){
  showScreen('loading');
  $('#loadingText').textContent=text;
  $('#loadingBar').style.width='0%';
  const detail=$('#loadingDetail');
  if(detail)detail.textContent='0%';
  let acceptingProgress=true;
  const preloadJob=preloadAssets(assets,(done,total)=>{
    if(!acceptingProgress)return;
    const per=Math.round(done/Math.max(1,total)*100);
    $('#loadingBar').style.width=`${per}%`;
    if(detail)detail.textContent=`${done} / ${total}　${per}%`;
  });
  /* Second watchdog: even an unexpected browser/network bug cannot trap the player on LOADING. */
  const timedOut=await Promise.race([
    preloadJob.then(()=>false).catch(()=>false),
    new Promise(resolve=>setTimeout(()=>resolve(true),5200))
  ]);
  acceptingProgress=false;
  $('#loadingBar').style.width='100%';
  if(detail)detail.textContent=timedOut?'READY / SKIP':'READY';
  await fixedDelay(timedOut?80:140);
}

function commonNavMarkup(){return `<button data-nav="home" type="button"><span><img src="mqicon/06.png" alt=""><i>⌂</i></span><b>HOME</b></button><button data-nav="equipment" type="button"><span><img src="mqicon/10.png" alt=""><i>◇</i></span><b>装備</b></button><button data-nav="items" type="button"><span><img src="mqicon/12.png" alt=""><i>□</i></span><b>持ち物</b></button><button data-nav="settings" type="button"><span><img src="mqicon/09.png" alt=""><i>⚙</i></span><b>設定</b></button>`;}
function initCommonNav(){$$('[data-common-nav]').forEach(n=>n.innerHTML=commonNavMarkup());$$('[data-nav]').forEach(b=>b.addEventListener('click',async()=>{if(b.dataset.nav==='home'){if(screens.adventure.classList.contains('active')&&adventureRunActive())return narrationDialog('冒険中はHOMEへ戻れません。\n戻る場合は「冒険を諦める」を選んでください。');if(screens.tavern.classList.contains('active'))return leaveTavern();if(screens.training.classList.contains('active'))return leaveTraining();if(screens.castle.classList.contains('active'))return castleBackOrHome();if(screens.equipment.classList.contains('active')&&equipmentFacilityOrigin==='smith')return leaveBlacksmith();return goHome();}else if(b.dataset.nav==='equipment')openEquipmentScreen();else if(b.dataset.nav==='items')openInventory();else if(b.dataset.nav==='settings')openSettings();}));bindImages();}

async function dialog(text,choices=[['OK','ok']],speaker='モブピンク',character='play/02.png'){
  const overlay=$('#dialogOverlay'),img=$('#dialogCharacter'),facility=facilitySpeakerCharacter(speaker),formatted=facility?balancedJapaneseText(text,15):String(text||'');
  $('#dialogSpeaker').textContent=speaker;$('#dialogText').textContent=formatted;
  if(img){setImage(img,versionedPlay(character||'play/02.png'),'');img.alt=speaker||'';}
  $('#dialogChoices').innerHTML=choices.map(([label,val,cls=''])=>`<button type="button" data-dialog-value="${val}" class="${cls}">${label}</button>`).join('');
  overlay.classList.toggle('facility-line-talk',facility);overlay.classList.toggle('facility-choice-talk',facility);if(facility){const longest=dialogueLongestLine(formatted);overlay.style.setProperty('--facility-card-width',`${facilityBubbleWidth(formatted,true)}px`);$('#dialogText').style.setProperty('--facility-line-font',longest>=15?'15px':longest>=13?'16px':'17px');}overlay.hidden=false;
  return new Promise(resolve=>{$$('[data-dialog-value]',overlay).forEach(btn=>btn.onclick=()=>{overlay.hidden=true;overlay.classList.remove('facility-line-talk','facility-choice-talk');overlay.style.removeProperty('--facility-card-width');$('#dialogText').style.removeProperty('--facility-line-font');resolve(btn.dataset.dialogValue);});});
}
async function narrationDialog(text,choices=[['OK','ok']]){
  const overlay=$('#dialogOverlay'),img=$('#dialogCharacter'),speaker=$('#dialogSpeaker'),textEl=$('#dialogText'),choiceRoot=$('#dialogChoices');
  speaker.textContent='';textEl.textContent=String(text||'');if(img)img.hidden=true;choiceRoot.innerHTML=choices.map(([label,val,cls=''])=>`<button type="button" data-narration-value="${val}" class="${cls}">${label}</button>`).join('');
  overlay.classList.remove('facility-line-talk','facility-choice-talk');overlay.classList.add('narration-dialog');overlay.hidden=false;
  return new Promise(resolve=>{$$('[data-narration-value]',overlay).forEach(btn=>btn.onclick=()=>{overlay.hidden=true;overlay.classList.remove('narration-dialog');if(img)img.hidden=false;choiceRoot.innerHTML='';resolve(btn.dataset.narrationValue);});});
}
function facilityFlag(key){try{return localStorage.getItem(`mobQuestFacilitySeen:${key}`)==='1';}catch(_){return false;}}
function markFacilityFlag(key){try{localStorage.setItem(`mobQuestFacilitySeen:${key}`,'1');}catch(_){}}
function compactDialogueText(text){return String(text||'').replace(/\s+/g,'').trim();}
const DIALOGUE_PROTECTED_PHRASES=['決意する','こととなった','ゆっくり','してくださいね','くださいね','また来てください','たくさん','レッツトレーニング','であります','勇者様','モブピンク','魔王討伐'];
function balancedJapaneseText(text,maxChars=16,minTail=7){
  const compact=compactDialogueText(text);if(!compact)return'';const chars=[...compact];if(chars.length<=maxChars)return compact;
  const lines=[];let rest=chars;
  const badStart='、。，．！？!?♪」』】）》〉〕］）ぁぃぅぇぉゃゅょっァィゥェォャュョッー';
  const badEnd='「『【《〈〔［（';
  const insideProtected=(str,pos)=>DIALOGUE_PROTECTED_PHRASES.some(ph=>{let i=str.indexOf(ph);while(i>=0){if(pos>i&&pos<i+[...ph].length)return true;i=str.indexOf(ph,i+1);}return false;});
  while(rest.length>maxChars){
    const str=rest.join(''),lineCount=Math.ceil(rest.length/maxChars),target=Math.min(maxChars,Math.ceil(rest.length/lineCount));let best=Math.max(5,target),bestScore=1e9;
    const lo=Math.max(5,target-5),hi=Math.min(maxChars,target+4,rest.length-minTail);
    for(let pos=lo;pos<=hi;pos++){
      const prev=rest[pos-1]||'',next=rest[pos]||'';let score=Math.abs(pos-target)*4;
      if('。！？!?♪'.includes(prev))score-=24;else if('、，'.includes(prev))score-=14;
      if(badStart.includes(next))score+=80;if(badEnd.includes(prev))score+=80;
      if(/[\u3400-\u9fff]/.test(prev)&&/[\u3400-\u9fff]/.test(next))score+=95;
      if(/[\u3400-\u9fff]/.test(prev)&&/[\u3040-\u309f]/.test(next))score+=90;
      if(/[\u3040-\u309f]/.test(prev)&&/[\u3040-\u309f]/.test(next))score+=55;
      if(insideProtected(str,pos))score+=120;
      const tail=rest.length-pos;if(tail<minTail)score+=(minTail-tail)*40;
      if(score<bestScore){bestScore=score;best=pos;}
    }
    if(rest.length-best<minTail)best=Math.max(5,rest.length-minTail);
    lines.push(rest.slice(0,best).join(''));rest=rest.slice(best);
  }
  if(rest.length)lines.push(rest.join(''));
  if(lines.length>=2&&[...lines.at(-1)].length<minTail){
    const last=[...lines.at(-1)],prev=[...lines.at(-2)],need=Math.min(Math.max(0,prev.length-5),minTail-last.length);
    if(need>0){lines[lines.length-2]=prev.slice(0,-need).join('');lines[lines.length-1]=prev.slice(-need).concat(last).join('');}
  }
  return lines.join('\n');
}
function dialogueLongestLine(text){return Math.max(0,...String(text||'').split('\n').map(x=>[...x].length));}
function facilitySpeechPages(text,maxChars=48){
  const compact=compactDialogueText(text);if(!compact)return[];
  const sentences=compact.match(/[^。！？!?♪]+[。！？!?♪]+|[^。！？!?♪]+$/g)||[compact],pages=[];let buf='';
  for(const part of sentences){const combined=buf+part;if(!buf||[...combined].length<=maxChars){buf=combined;continue;}pages.push(buf);buf=part;}
  if(buf)pages.push(buf);return pages;
}
function facilitySpeakerCharacter(speaker){return ['モブゴンゾー','モブミータ','モブマテリア','モブイルカエル','モブコーチ','モブメープル','モブスライムキング','モブライトアーム','モブピンク'].includes(speaker);}
function facilityBubbleWidth(text,hasChoices=false){
  const formatted=balancedJapaneseText(text,17,7),longest=dialogueLongestLine(formatted),body=Math.max(136,Math.min(278,longest*15+24));
  const px=78+7+body;return Math.max(hasChoices?340:0,Math.min(440,px));
}
async function facilityTalk(text,speaker='モブピンク',image='play/02.png'){
  const pages=facilitySpeechPages(text);if(!pages.length)return;
  const overlay=$('#dialogOverlay'),img=$('#dialogCharacter'),speakerEl=$('#dialogSpeaker'),textEl=$('#dialogText'),choices=$('#dialogChoices');
  speakerEl.textContent=speaker;setImage(img,versionedPlay(image||'play/02.png'),'');img.alt=speaker||'';choices.innerHTML='';overlay.classList.add('facility-line-talk');overlay.hidden=false;
  for(const page of pages){const formatted=balancedJapaneseText(page,17,7),longest=dialogueLongestLine(formatted),n=[...compactDialogueText(page)].length;textEl.textContent=formatted;textEl.dataset.lineLength=String(n);overlay.style.setProperty('--facility-card-width',`${facilityBubbleWidth(formatted)}px`);textEl.style.setProperty('--facility-line-font',longest>=17?'14px':longest>=15?'15px':'16px');await new Promise(resolve=>{let ready=false;const timer=setTimeout(()=>ready=true,90);const next=e=>{if(!ready)return;e?.preventDefault?.();e?.stopPropagation?.();clearTimeout(timer);overlay.removeEventListener('pointerup',next,true);resolve();};overlay.addEventListener('pointerup',next,true);});await fixedDelay(100);}
  overlay.hidden=true;overlay.classList.remove('facility-line-talk');overlay.style.removeProperty('--facility-card-width');choices.innerHTML='';textEl.style.removeProperty('--facility-line-font');delete textEl.dataset.lineLength;
}
async function facilityIntro(key,{speaker,image,first='',repeat=''}){
  const seen=facilityFlag(key),text=seen?repeat:first;
  if(text)await facilityTalk(text,speaker,image);
  if(!seen)markFacilityFlag(key);
}
async function showFacilityExit(image,text,theme='blue'){
  const wrap=$('#facilityExitBanner'),img=$('#facilityExitImage'),label=$('#facilityExitText');if(!wrap)return;
  setImage(img,versionedPlay(image),'');label.textContent=text;wrap.className=`facility-exit-banner theme-${theme}`;wrap.hidden=false;await fixedDelay(1050);wrap.hidden=true;
}
let openingSequenceBusy=false;
let tavernView='menu';
let castleView='menu';
let castleQtyState={itemId:null,qty:1};
let equipmentFacilityOrigin='';
async function travelTo(target,text,after){
  if(target==='training'){
    /* v21: a short critical preload only; the setup screen becomes interactive immediately afterwards. */
    showScreen('loading');$('#loadingText').textContent=text;$('#loadingBar').style.width='38%';const detail=$('#loadingDetail');if(detail)detail.textContent='ROOM';
    await preloadAssetsSafe(pageAssets(target),520);
    $('#loadingBar').style.width='100%';if(detail)detail.textContent='READY';
    if(after)after();showScreen(target);
    return;
  }
  await loadingWithAssets(text,pageAssets(target));if(after)after();showScreen(target);
}

const HOME_COMMON_SCALE_MAX=0.16;
async function applyHomeCommonScale(){
  /* v34: HOME no longer renders party character PNGs. Kept as a no-op so old resize hooks stay safe. */
  return;
}

function hasGameSave(){try{return !!(localStorage.getItem('mobQuestAdventureV5')||localStorage.getItem('mobQuestPartyV4')||localStorage.getItem('mobQuestMetaV1'));}catch(_){return false;}}
function showTitle(){const c=$('#titleContinueBtn');if(c){c.disabled=!hasGameSave();c.classList.toggle('disabled',!hasGameSave());}showScreen('title');if(window.__mobBootGuard){clearTimeout(window.__mobBootGuard);window.__mobBootGuard=null;}}
function clearGameProgressForNew(){try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith('mobQuest')&&!['mobQuestTestSettingsV1'].includes(key))localStorage.removeItem(key);}}catch(_){}}
async function startNewGame(){
  clearGameProgressForNew();
  state.party=defaultParty.map(x=>[...x]);state.coins=0;state.meta=defaultMeta();
  state.training={party:null,enemySlots:[{id:'boss-hawk',level:8},null,null,null],activeEnemySlot:0,filter:'草原',mode:'menu',programSeason:null};
  state.quest=null;state.adventure=defaultAdventure();state.battle=null;state.speed=1;state.autoBattle=false;state.tavernSwapIndex=null;state.noticeQueue=[];state.noticeBusy=false;
  saveParty();saveMeta();saveAdventure();
  closeSettings?.();
  if(state.test?.enabled){showTitle();const skip=await narrationDialog('テストモードです。オープニングをスキップしますか？',[['スキップ','yes','primary'],['見る','no']]);if(skip==='yes'){await grantOpeningStarterSupplies({silent:true});state.meta.openingCompleted=true;saveMeta();await goHome();return;}}
  await runOpeningV74();
}
async function continueGame(){if(adventureRunActive()){await travelTo('adventure','冒険を再開しています…',renderAdventure);await handleAdventureEntry();return;}await goHome();}

async function renderHome(){
  $('#coinValue').textContent=state.coins.toLocaleString();
  const d=$('#diamondValue');if(d)d.textContent=Math.max(0,Number(state.meta?.diamonds)||0).toLocaleString();
}
async function goHome(){
  /* HOME deliberately avoids player PNGs: this removes the native-size flash and unnecessary decode work. */
  showScreen('loading');
  $('#loadingText').textContent='HOMEを準備しています…';
  $('#loadingBar').style.width='35%';
  const detail=$('#loadingDetail');if(detail)detail.textContent='HOME';
  await preloadAssetsSafe(['back/rpgmain.png','icon/01.png'],900);
  $('#loadingBar').style.width='100%';if(detail)detail.textContent='READY';
  await renderHome();
  showScreen('home');
  if(window.__mobBootGuard){clearTimeout(window.__mobBootGuard);window.__mobBootGuard=null;}
}

function zoneForIndex(i){return i<4?{key:'MAIN',label:'戦闘メンバー',n:i+1,cls:'main-slot'}:i<6?{key:'SUPER SUB',label:'自動支援',n:i-3,cls:'super-slot'}:{key:'RESERVE',label:'控えメンバー',n:i-5,cls:'reserve-slot'};}
function rosterCard(p,selected,level){return `<button class="roster-card ${selected?'selected':''}" data-roster-id="${p.id}" type="button"><span class="roster-art"><img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i></span><b>${p.name}</b><small>${p.attribute} / ${p.weapon}</small><em>Lv${level}</em></button>`;}
function worldCleared(id){const worlds=MOB_DATA.adventureWorlds||[],idx=worlds.findIndex(w=>w.id===id);if(idx<0)return false;return !!state.adventure.completed||(state.adventure.reportedWorlds||[]).includes(id)||(Number(state.adventure.worldIndex)||0)>idx;}
function syncDefeatedHistoryFromProgress(){for(const w of MOB_DATA.adventureWorlds||[]){if(!worldCleared(w.id))continue;for(const a of w.areas||[]){const rows=[...(a.boss||[]),...(a.nextWave||[]),...(a.nextWaves||[]).flat()];for(const r of rows){const t=trainingEnemyTemplate(r.id);if(!t)continue;if(t.category==='boss'&&!state.meta.defeatedBosses.includes(t.id))state.meta.defeatedBosses.push(t.id);if(t.category==='elite'&&!state.meta.defeatedElites.includes(t.id))state.meta.defeatedElites.push(t.id);}}}saveMeta();}
function unlockedDrinkIds(){
  const ids=new Set(['19','20','21','32','33','34','22']);
  if(worldCleared('grassland'))ids.add('23');
  if(worldCleared('rural'))ids.add('24');
  if(worldCleared('neon'))ids.add('25');
  if(worldCleared('sea'))ids.add('27');
  if(worldCleared('tribe'))ids.add('29');
  if(worldCleared('desert2'))DRINK_SETS.forEach(d=>ids.add(d.id));
  return ids;
}
function drinkCount(id){return Math.max(0,Number(state.meta.drinkSets?.[id])||0);}
function addDrink(id,n=1){if(!state.meta.drinkSets)state.meta.drinkSets={};state.meta.drinkSets[id]=drinkCount(id)+n;saveMeta();}
function consumeDrink(id,n=1){if(drinkCount(id)<n)return false;state.meta.drinkSets[id]=drinkCount(id)-n;saveMeta();return true;}
function renderTavernDrinkShop(){
  const root=$('#tavernDrinkShop');if(!root)return;const unlocked=unlockedDrinkIds();$('#drinkShopCoin').textContent=`${state.coins.toLocaleString()} G`;
  root.innerHTML=DRINK_SETS.filter(d=>unlocked.has(d.id)).map(d=>`<button class="drink-shop-item ${drinkCount(d.id)>0?'owned':''}" data-buy-drink="${d.id}" type="button"><img src="${d.image}" alt="${d.name}"><div><b>${d.name}</b><small>${d.desc}</small><em>${d.price.toLocaleString()}G / 所持 ${drinkCount(d.id)}</em></div></button>`).join('');
  bindImages(root);$$('[data-buy-drink]',root).forEach(b=>b.onclick=async()=>{const d=DRINK_SETS.find(x=>x.id===b.dataset.buyDrink);if(!d)return;if(state.coins<d.price)return toast('ゴールドが足りません');const ans=await dialog(`${d.name}を購入しますか？\n${d.price.toLocaleString()}G`,[['はい','yes','primary'],['いいえ','no']],'モブイルカエル','play/001.png');if(ans!=='yes')return;state.coins-=d.price;state.meta.coins=state.coins;addDrink(d.id,1);saveMeta();renderTavernDrinkShop();await facilityTalk('ありがとうございます🎵','モブイルカエル','play/001.png');});
}
function mapleShopUnlocked(){return worldCleared('desert');}
async function showTavernFigureShop(){if(!mapleShopUnlocked())return;const first=!facilityFlag('tavern:maple-shop');if(first){await facilityTalk('やっほ～。私はフィギュアを売ってるよ。色んなガチャを用意してるから、好きなガチャを選んでね。ガチャはダイヤでしか引けないから、頑張って集めて来て！','モブメープル','play/009.png');markFacilityFlag('tavern:maple-shop');}else await facilityTalk('やっほ～どのガチャにする？','モブメープル','play/009.png');$('#tavernFigurePopup').hidden=false;}
function renderTavern(){
  const landing=$('#tavernLanding'),popup=$('#tavernPartyPopup'),guide=$('#tavernPartyGuide');
  if(landing)landing.hidden=false;const maple=$('#tavernFigureMenuBtn');if(maple)maple.hidden=!mapleShopUnlocked();
  if(popup)popup.hidden=tavernView!=='party';
  const m=Math.min(4,state.party.length),ss=Math.max(0,Math.min(2,state.party.length-4)),r=Math.max(0,state.party.length-6);
  $('#tavernPartyCount').textContent=`MAIN ${m}/4・SUPER ${ss}/2・SUB ${r}/4`;
  if(guide)guide.textContent=state.tavernSwapIndex===null?'入れ替えたいメンバーを1人タップしてください':'入れ替えるメンバーを選んでください';
  const root=$('#tavernSlots');
  root.innerHTML=state.party.map(([id,lv],i)=>{
    const p=player(id),z=zoneForIndex(i),selected=state.tavernSwapIndex===i;
    const group=i<4?'main':i<6?'super':'sub',label=i<4?`MAIN ${i+1}`:i<6?`SUPER ${i-3}`:`SUB ${i-5}`;
    return `<button class="tavern-simple-member ${group} ${selected?'selected':''}" data-tavern-swap="${i}" type="button"><span><img src="${versionedPlay(p.image)}" alt="${p.name}"></span><b>${p.name}</b><small>${label} / Lv${lv}</small></button>`;
  }).join('');
  renderTavernDrinkShop();bindImages($('#tavernScreen'));
  $$('[data-tavern-swap]',root).forEach(btn=>btn.onclick=()=>{
    const idx=Number(btn.dataset.tavernSwap);
    if(state.tavernSwapIndex===null){state.tavernSwapIndex=idx;renderTavern();return;}
    if(state.tavernSwapIndex===idx){state.tavernSwapIndex=null;renderTavern();return;}
    const first=state.tavernSwapIndex;[state.party[first],state.party[idx]]=[state.party[idx],state.party[first]];state.tavernSwapIndex=null;renderTavern();toast('入れ替えました');
  });
}
function showTavernMenu(){tavernView='menu';state.tavernSwapIndex=null;$('#tavernDrinkPopup').hidden=true;$('#tavernPartyPopup').hidden=true;$('#tavernFigurePopup').hidden=true;renderTavern();}
function showTavernParty(){tavernView='party';state.tavernSwapIndex=null;renderTavern();}
function showTavernDrinks(){tavernView='menu';renderTavernDrinkShop();$('#tavernDrinkPopup').hidden=false;}
let openingLastAdvanceAt=0;
function openingTapAllowed(minGap=220){const now=performance.now();if(now-openingLastAdvanceAt<minGap)return false;openingLastAdvanceAt=now;return true;}
async function openingNarrationSequenceV78(messages){
  const rows=(messages||[]).filter(Boolean);if(!rows.length)return;
  const el=document.createElement('div');el.className='opening-narration-v76 opening-narration-sequence-v78';el.innerHTML='<div><p></p></div>';document.body.appendChild(el);
  const p=el.querySelector('p');let index=0,readyAt=performance.now()+220,done=false;
  const render=()=>{const max=window.innerWidth<=380?13:14;p.textContent=balancedJapaneseText(rows[index],max,7);el.classList.toggle('grand',index===0);};
  render();el.classList.add('show');await nextPaint();document.documentElement.classList.remove('opening-boot-v77','opening-boot-v78');
  await new Promise(resolve=>{const next=e=>{e.preventDefault();e.stopPropagation();if(done||performance.now()<readyAt||!openingTapAllowed())return;index++;if(index>=rows.length){done=true;el.removeEventListener('pointerup',next,true);resolve();return;}render();readyAt=performance.now()+110;};el.addEventListener('pointerup',next,{capture:true,passive:false});});
  el.remove();
}
async function openingNarrateV74(text,{grand=false}={}){await openingNarrationSequenceV78([text]);}
async function openingSceneCaption(text){
  const el=document.createElement('div');el.className='opening-scene-caption-v76';el.innerHTML='<p></p>';el.querySelector('p').textContent=balancedJapaneseText(text,17,7);document.body.appendChild(el);el.classList.add('show');await nextPaint();document.documentElement.classList.remove('opening-boot-v77','opening-boot-v78');
  await new Promise(resolve=>{const readyAt=performance.now()+180;const next=e=>{e.preventDefault();e.stopPropagation();if(performance.now()<readyAt||!openingTapAllowed())return;el.removeEventListener('pointerup',next,true);resolve();};el.addEventListener('pointerup',next,{capture:true,passive:false});});el.remove();
}
async function openingCastleSay(speaker,text,actor,side='center'){
  const stage=$('.throne-stage'),box=$('#castleSpeech');if(!stage||!box)return facilityTalk(text,speaker,speaker==='モブピンク'?'play/02.png':'play/007.png');showCastleSpeech(speaker,text,actor,side);clearTimeout(showCastleSpeech.timer);
  await new Promise(resolve=>{const readyAt=performance.now()+180;const next=e=>{e.preventDefault();e.stopPropagation();if(performance.now()<readyAt||!openingTapAllowed())return;stage.removeEventListener('pointerup',next,true);resolve();};stage.addEventListener('pointerup',next,{capture:true,passive:false});});box.hidden=true;
}
function ensureOpeningPinkActor(){const stage=$('.throne-stage');if(!stage)return null;let actor=stage.querySelector('[data-opening-pink]');if(actor)return actor;actor=document.createElement('div');actor.className='opening-pink-actor-v76';actor.dataset.openingPink='1';actor.innerHTML='<img src="play/02.png" alt="モブピンク"><b>モブピンク</b>';stage.appendChild(actor);bindImages(actor);requestAnimationFrame(()=>actor.classList.add('arrived'));return actor;}
async function homeTutorialSay(text,action=''){
  const wrap=document.createElement('div');wrap.className='home-tutorial-v76';wrap.innerHTML=`<div class="home-tutorial-bubble-v76"><img src="play/02.png" alt="モブピンク"><div><b>モブピンク</b><p>${balancedJapaneseText(String(text||''),24,7).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</p></div></div>${action?'<i class="home-tutorial-arrow-v76">▼</i>':''}`;document.body.appendChild(wrap);bindImages(wrap);await nextPaint();const target=action?document.querySelector(`[data-home-action="${action}"]`):null,arrow=wrap.querySelector('.home-tutorial-arrow-v76');if(target&&arrow){const r=target.getBoundingClientRect();arrow.style.left=`${r.left+r.width/2}px`;arrow.style.top=`${Math.max(8,r.top-22)}px`;}wrap.classList.add('show');await new Promise(resolve=>{let ready=false;setTimeout(()=>ready=true,120);wrap.addEventListener('pointerup',e=>{if(!ready)return;e.preventDefault();resolve();},{once:true});});wrap.remove();
}
async function grantOpeningStarterSupplies({silent=false}={}){
  if(state.meta?.starterGrantReceived)return;
  state.coins=Math.max(0,Number(state.coins)||0)+15000;
  state.meta.coins=state.coins;
  if(!state.meta.inventory)state.meta.inventory={};
  state.meta.inventory['mob-tent']=tentCount()+2;
  state.meta.starterGrantReceived=true;
  saveMeta();
  if(silent)return;
  const el=document.createElement('div');el.className='opening-supply-v80';el.innerHTML='<div class="opening-supply-card-v80"><small>KINGDOM SUPPLY</small><h2>旅の支度が支給された！</h2><div><span><b>15,000G</b><em>ゴールド</em></span><span><b>×2</b><em>モブテント</em></span></div></div>';document.body.appendChild(el);await nextPaint();el.classList.add('show');await fixedDelay(1900);el.classList.remove('show');await fixedDelay(260);el.remove();
}
async function runOpeningV74(){
  openingSequenceBusy=true;document.body.classList.add('opening-sequence-v78');
  const prologue=['とある世界のお話','様々な種族が','様々なエリアに','平和に暮らしていた','そんなある日','ある町が魔王軍に襲撃され','姿を消した','モブキングダムの王様','モブスライムキングは','この事態を受け','勇者に魔王討伐を依頼することを決意する','これは','勇者と仲間たち','魔王軍','光と闇','冒険と戦いのお話―'];
  await openingNarrationSequenceV78(prologue);
  const curtain=document.createElement('div');curtain.className='opening-black-curtain-v76';document.body.appendChild(curtain);showScreen('castle');renderThroneRoom();await fixedDelay(520);curtain.classList.add('fade');await fixedDelay(900);curtain.remove();
  const king=()=>document.querySelector('[data-castle-actor="king"]');
  await openingCastleSay('モブスライムキング','勇者よ、世界を救ってくれ！',king(),'center');
  await openingSceneCaption('勇者は深く頷いた');
  await openingCastleSay('モブスライムキング','お主1人では不安であろう',king(),'center');
  await openingCastleSay('モブスライムキング','おい！モブピンク！',king(),'center');
  await fixedDelay(650);
  await openingCastleSay('モブスライムキング','集合ーーーー！！',king(),'center');
  const pink=ensureOpeningPinkActor();await fixedDelay(600);
  await openingCastleSay('モブピンク','はいーー！',pink,'left');
  await openingCastleSay('モブピンク','はいであります！',pink,'left');
  await openingCastleSay('モブスライムキング','王よりモブピンクに命じる！',king(),'center');
  await openingCastleSay('モブピンク','はい！',pink,'left');
  await openingCastleSay('モブスライムキング','勇者と共に魔王を撃ち滅ぼすのじゃー！！',king(),'center');
  await openingCastleSay('モブピンク','・・・・はい？',pink,'left');
  await openingCastleSay('モブスライムキング','なんじゃ？',king(),'center');
  await openingCastleSay('モブピンク','僕がですか？',pink,'left');
  await openingCastleSay('モブスライムキング','他に誰がおるんじゃ？',king(),'center');
  pink?.classList.add('panic');await openingCastleSay('モブピンク','えーーーー！！！！',pink,'left');pink?.classList.remove('panic');
  await openingCastleSay('モブスライムキング','うるさい！さっさと行くのじゃ！',king(),'center');
  await openingCastleSay('モブピンク','わ、わかりましたよ！',pink,'left');
  await openingCastleSay('モブピンク','勇者様、僕のこと守ってくださいね！',pink,'left');
  await openingCastleSay('モブスライムキング','ヒロインみたいなことを言うな！',king(),'center');
  await openingCastleSay('モブスライムキング','お主が勇者を守るのじゃ！',king(),'center');
  await openingSceneCaption('こうして勇者はモブピンクと共に旅に出ることとなった');
  await grantOpeningStarterSupplies();
  openingSequenceBusy=false;document.body.classList.remove('opening-sequence-v78');
  const splash=document.createElement('div');splash.className='opening-title-splash';splash.innerHTML='<img src="icon/01.png" alt="MOB STORY"><button type="button">NEXT</button>';document.body.appendChild(splash);bindImages(splash);await fixedDelay(3000);splash.classList.add('ready');await new Promise(resolve=>splash.querySelector('button').onclick=resolve);splash.remove();
  state.meta.openingCompleted=true;saveMeta();await goHome();
  await facilityTalk('大変なことになりましたね..','モブピンク','play/02.png');await facilityTalk('でも精一杯頑張るであります！','モブピンク','play/02.png');await facilityTalk('よろしくお願いします、勇者様！','モブピンク','play/02.png');
  await homeTutorialSay('ダンジョンのアイコンを押すと冒険に向かいます','adventure');await homeTutorialSay('お城のアイコンを押すとお城へ入れます','castle');await homeTutorialSay('お店の利用や冒険の報告がある時はお城へ向かいましょう','castle');await facilityTalk('その他の機能については冒険しながら慣れていきましょう','モブピンク','play/02.png');await facilityTalk('冒険の始まりであります！','モブピンク','play/02.png');
}
async function enterTavern(){
  tavernView='menu';renderTavern();
  await facilityIntro('tavern',{speaker:'モブイルカエル',image:'play/001.png',first:'いらっしゃい♪ ここは酒場です。パーティー編成とドリンク販売をしています。',repeat:'いらっしゃいませ♪ ゆっくりしていってくださいね！'});
  if(mapleShopUnlocked()&&!facilityFlag('tavern:maple-intro')){
    await facilityTalk('あら、いい所に来ましたね！今日から、新しい店員が増えたの','モブイルカエル','play/001.png');
    await facilityTalk('やっほ～モブメープルです。これからよろしくねー','モブメープル','play/009.png');
    await facilityTalk('モブメープルちゃんはフィギュアを売ってくれます♪ 詳しくは本人に聞いてみてください！','モブイルカエル','play/001.png');
    markFacilityFlag('tavern:maple-intro');renderTavern();
  }
}
async function leaveTavern(){await facilityTalk('また来てくださいね♪','モブイルカエル','play/001.png');await goHome();}


const SUBQUEST_AREAS=[
 {worldId:'grassland',name:'草原',required:['yusha','pink'],quests:[
  {id:'grass-1',no:1,name:'新種発見',reward:{diamonds:10,coins:10000,weapons:['01','02'],armor:'01'},intro:[['pink','勇者様！\n実はモンスターには亜種が存在します！\nもちろん全員にではありませんが\n強力なモンスターが存在するのであります！'],['show',['sq-savanna-variant']],['pink','やや！\nこれはモブサバンナの亜種です！\n通常のモブサバンナより速いであります！']],waves:[[{id:'sq-savanna-variant',level:10},{id:'g-savanna',level:6},{id:'g-savanna',level:6}]],post:[['pink','他にも亜種がたくさん存在するのですが\nそのほとんどが発見されていません\nどこからやってくるのやら・・']]},
  {id:'grass-2',no:2,name:'スライムの団結力',reward:{diamonds:10,coins:10000,weapons:['03','04'],armor:'02'},intro:[['pink','モンスターと言えばスライムですね\nやつらは種類も豊富で\n古くからどのエリアにも存在するであります'],['show',['g-slime','g-slime','g-slime','g-slime']],['pink','やや！\n1気に5体も！？\nこの団結力もやつらの強さであります！']],waves:[Array.from({length:5},()=>({id:'g-slime',level:6})),Array.from({length:5},()=>({id:'g-slime',level:6}))],post:[['pink','昔はスライムレースという競技で\n国と国が平和に競っていました\n魔王を倒せば\nまた見れるかもしれないであります！']]},
  {id:'grass-3',no:3,name:'バードウォッチング',reward:{diamonds:10,coins:10000,weapons:['05','01'],armor:'03'},intro:[['pink','いい景色ですね～\n草原の高台はもっと最高であります！\nあ！\nそういえば空海(そらうみ)を知っていますか？\n空に海があるという伝説があります！\nいつか行ってみたいでありますね～'],['show',['g-piyo-green','g-piyo-red']],['pink','やや！\n空飛ぶモンスターは羨ましいであります・・！']],waves:[[{id:'g-piyo-green',level:8},{id:'g-piyo-green',level:8},{id:'g-piyo-red',level:8},{id:'g-piyo-red',level:8}]],post:[['pink','空海には見たこともないようなモンスターが\nたくさんいると聞くであります\n魔王より強いモンスターもいるとか・・']]},
  {id:'grass-4',no:4,name:'岩だらけ',reward:{diamonds:10,coins:10000,weapons:['02','03'],armor:'04'},intro:[['pink','この辺りはゴツゴツでありますね\n勇者様！\n僕実はフィギュア収集にハマっているであります！\nフィギュアはアクセサリーとしてだけでなく\n対戦も出来るであります！\nそのうち酒場に売りに出るみたいなので\n一緒に遊びましょう♪'],['show',['g-rock','g-iwakiri']],['pink','ゴツゴツモンスターは\nフィギュアのピースに見えるであります\n（昨日遊びすぎたであります）']],waves:[[{id:'g-rock',level:8},{id:'g-rock',level:8},{id:'g-rock',level:8},{id:'g-iwakiri',level:10}]],post:[['pink','勇者様と遊ぶ日が楽しみであります♪']]},
  {id:'grass-5',no:5,name:'サバンナサバイバル',reward:{diamonds:10,coins:10000,weapons:['05','06'],armor:'05',medals:['01']},intro:[['pink','勇者様！\n武器が集まってきたら\nメダルにするといいであります！\n3つ同じ武器を鍛冶屋に渡すと\n特性を宿したメダルにしてくれます\n強力な武器と強力なメダル\n魔王と戦うには必須であります！'],['show',['g-savanna','sq-savanna-variant']],['pink','やや！\nこのモンスターたちは\nメダルを落とす予感がするであります！']],waves:[[{id:'g-savanna',level:10},{id:'g-savanna',level:10}],[{id:'sq-savanna-variant',level:10},{id:'sq-savanna-variant',level:10}]],post:[['pink','やりましたね！\nやっぱりメダルを落としたであります！\n中々こういうことはありませんが\n獲得したら装備を忘れずに！\nであります！']]}
 ]},
 {worldId:'desert',name:'砂漠',required:['pink','desert'],quests:[
  {id:'desert-1',no:1,name:'黄金のミイラ',reward:{diamonds:10,coins:10000,weapons:['01','04'],armor:'06'},intro:[['pink','ピラミッドと言えばお宝であります！\n財宝の在り処とか知らないでありますか？'],['desert','財宝か\n財宝のようなモンスターならいるぞ'],['show',['sq-gold-mummy','sq-gold-nekomummy']],['pink','やや！！\nややや！！\nキラッキラであります！'],['desert','やつらはコインをたくさん落とす\n見つけたら倒すべきだ']],waves:[[{id:'sq-gold-mummy',level:12},{id:'sq-gold-nekomummy',level:10},{id:'sq-gold-nekomummy',level:10},{id:'sq-gold-nekomummy',level:10}]],post:[['pink','大量であります～！！'],['desert','良い武器が買えそうだな']]},
  {id:'desert-2',no:2,name:'ピラミッド大行進',reward:{diamonds:10,coins:10000,weapons:['03','05'],armor:'06'},intro:[['pink','モブデザートのこと\nもっと知りたいであります！\nなぜ砂漠の守り人になったのでありますか？'],['desert','強引だな\nまあいいだろう\n俺はここで生まれ育った\n理由が必要なら、そんなところだ'],['pink','ほえ～であります\nではなぜ王の座に就かないでありますか？'],['desert','・・・王には興味がない'],['show',['d-mummy','d-nekomummy','d-yamikamen']],['pink','出ましたね！！'],['desert','再び平穏を取り戻すため\n俺は戦う']],waves:[Array.from({length:3},()=>({id:'d-mummy',level:10})),Array.from({length:3},()=>({id:'d-nekomummy',level:10})),Array.from({length:2},()=>({id:'d-yamikamen',level:11}))],post:[['pink','危険がいっぱいでありますね'],['desert','ああ、魔王を討つまではな']]},
  {id:'desert-3',no:3,name:'毒砂注意報',reward:{diamonds:10,coins:10000,weapons:['01','07'],armor:'07'},intro:[['pink','砂漠と言えば毒でありますね\nミラモブも毒使いでした\nモブデザートは使えないのですか？'],['desert','俺は毒は使えない\n・・正確には使わない'],['pink','？\nなるほど、であります'],['show',['d-poison','d-lizard']],['pink','毒っぽいモンスターであります！'],['desert','注意しろ\n解毒の準備を怠るな']],waves:[[{id:'d-poison',level:11},{id:'d-poison',level:11},{id:'d-lizard',level:11},{id:'d-lizard',level:11}]],post:[['pink','解毒！解毒であります～！'],['desert','騒がしいやつだ']]},
  {id:'desert-4',no:4,name:'幻の財宝',reward:{diamonds:10,coins:10000,weapons:['04','08'],armor:'09'},intro:[['pink','それにしても\n砂漠には夢がいっぱいでありますね～\n財宝に歴史的建造物\n素晴らしいエリアです！'],['desert','そうだな\nではもっといいことを教えよう\nあのモンスターが見えるか？'],['show',['d-gimmick','d-gimmick','d-gimmick']],['pink','あ、あれは！？'],['desert','モブギミックという\nレアアイテムを落とすモンスターだ\n3体もいるのは珍しいがな'],['pink','と、討伐であります～！']],waves:[Array.from({length:3},()=>({id:'d-gimmick',level:11}))],post:[['pink','砂漠ドリームであります！！'],['desert','ハハッ・・ドリームか'],['pink','わ、笑ったであります！！']]},
  {id:'desert-5',no:5,name:'砂漠の悪夢',reward:{diamonds:10,coins:10000,weapons:['02','10'],armor:'10'},intro:[['pink','ミラモブはなぜ魔王軍に？\nあんなに強いのに不思議であります'],['desert','さあな\nやつの考えは納得できん\n魔王は悪\nそれは揺るがない事実だ'],['show',['d-sharty','d-poison','d-deathhead']],['pink','敵襲であります！']],waves:[[{id:'d-sharty',level:12},{id:'d-poison',level:12},{id:'d-deathhead',level:12}],[{id:'d-sharty',level:12},{id:'d-poison',level:12},{id:'d-deathhead',level:12}]],post:[['pink','ハードでありましたね、、'],['desert','だが\n俺達も確実に強くなっている']]}
 ]},
 {worldId:'rural',name:'田舎町',required:['pink','denden'],quests:[
  {id:'rural-1',no:1,name:'新米ガーディアン',reward:{diamonds:10,coins:10000,weapons:['11'],armor:'11'},intro:[['pink','モブデンデンは\nいつから田舎町にいるでありますか？'],['denden','王国を出てすぐ、\nちょうど魔王に支配された頃でやんす'],['pink','この町を守りに来たでありますか！？'],['denden','そんなカッコいいもんじゃないでやんす'],['show',['sq-mini-guardian']],['pink','モブガーディアン！？'],['denden','いや、\nモブミニガーディアン\n魔王軍にはたくさんいるでやんす！']],waves:[[{id:'sq-mini-guardian',level:15},{id:'sq-mini-guardian',level:15}]],post:[['pink','びっくりであります、、'],['denden','もっとびっくりするモンスターも\n魔王軍にはいっぱいでやんす！']]},
  {id:'rural-2',no:2,name:'ダンスフェスティバル',reward:{diamonds:10,coins:10000,weapons:['12'],armor:'12'},intro:[['pink','この町は賑やかでありますね～\n魔王軍の支配があるとは思えないです'],['denden','昔は毎日がパーティーだったでやんす\nオイラもダンス大好きでやんす！'],['show',['r-dancer','r-dancer','r-dancer','r-dancer']],['pink','ダンスパーティーでありますね！'],['denden','踊るでやんすー！']],waves:[Array.from({length:4},()=>({id:'r-dancer',level:13,mods:{spd:1.25}}))],post:[['denden','いつか\n素敵な姫様と\nダンスを踊りたいでやんす！'],['pink','その時は\n僕も呼んで欲しいであります！']]},
  {id:'rural-3',no:3,name:'海賊が来た！',pending:true,note:'報酬番号が資料未設定',intro:[],waves:[]},
  {id:'rural-4',no:4,name:'雷雨注意報',reward:{diamonds:10,coins:10000,weapons:['13'],armor:'13'},intro:[['pink','モブデンデンは\n雷属性ですよね？'],['denden','そうでやんす！\nオイラ怒るとビリビリするでやんす！'],['pink','ある国と関係があるでありますか？'],['denden','そうでやんすね～\nあるといえばあるでやんす'],['show',['r-denchi','r-dean']],['pink','やや！\nビリビリモンスターであります！'],['denden','オイラのビリビリには敵わないでやんす！']],waves:[[{id:'r-denchi',level:15},{id:'r-denchi',level:15},{id:'r-denchi',level:15},{id:'r-dean',level:16}]],post:[['pink','モブデンデン、強いでありますね～'],['denden','えっへんでやんす！']]},
  {id:'rural-5',no:5,name:'小さな守護神',reward:{diamonds:10,coins:10000,weapons:['14'],armor:'14'},intro:[['pink','この町の空気\n素晴らしいであります\n魔王軍さえいなければ・・！'],['denden','魔王軍の中にも\nここの空気が好きなやつは\nいるでやんす\nモブガーディアンも\nそうでやんした'],['show',['sq-mini-guardian2']],['pink','強そうなのが出ましたね！！'],['denden','ガーディアン候補でやんす！'],['pink','すでに覚醒していますね！！'],['denden','絶対勝つでやんす！']],waves:[[{id:'sq-mini-guardian2',level:20},{id:'sq-mini-guardian2',level:20}]],post:[['pink','多様な考えがあっても\n悪は討つであります！'],['denden','オイラ、\nもっと強くなるでやんす！']]}
 ]},
 {worldId:'neon',name:'ネオン街',required:['pink','money','desert'],quests:[
  {id:'neon-1',no:1,name:'ネオンスライム大発生',reward:{diamonds:10,coins:10000,weapons:['15'],armor:'15'},intro:[['pink','モブマニー、\n何か思い出しましたか？'],['money','う～ん\nネオン街のこと\n魔王軍のこと\nそれくらいは覚えてるけど\nあんまり深くはちょっと・・'],['desert','おそらく\n魔王軍とネオン街で戦いになり\nその戦いに参加していたのであろう'],['money','あー。。\n参加した気もする！'],['show',['n-slime','n-slime','n-slime','n-slime']],['money','このスライムたちはよく覚えてるわ！'],['pink','5体同時は危険であります！'],['desert','一気に叩くぞ！']],waves:[Array.from({length:5},()=>({id:'n-slime',level:23}))],post:[['pink','やっぱり\nモブマニーは強いであります！'],['money','そうね！\nそれは忘れてないわ！'],['desert','もしかすると\n魔王軍の脅威だったのかもな'],['money','う～ん\nそれはどうだろう？']]},
  {id:'neon-2',no:2,name:'光と闇',reward:{diamonds:10,coins:10000,weapons:['16'],armor:'16'},intro:[['desert','先代の王は\nどんなやつだったんだ？'],['money','凄く強かったわ！\nそれに優しかった'],['desert','魔王軍にやられたのか？'],['money','そう！\nだったはず・・！'],['pink','やはり\n魔王軍は脅威であります'],['show',['n-naga','n-darknaga']],['money','出たわね！'],['pink','戦闘開始であります！']],waves:[[{id:'n-naga',level:24},{id:'n-naga',level:24},{id:'n-darknaga',level:24},{id:'n-darknaga',level:24}]],post:[['desert','先代の王\nモブネオンキングか\n会ってみたかった']]},
  {id:'neon-3',no:3,name:'ネオン・サバイバル',pending:true,note:'会話・報酬番号が資料未設定'},
  {id:'neon-4',no:4,name:'追跡者',pending:true,note:'会話・報酬番号が資料未設定'},
  {id:'neon-5',no:5,name:'ネオン・サバイバルⅡ',pending:true,note:'会話・報酬番号が資料未設定'}
 ]},
 ...[
  ['magma','マグマ',['マグマスライム異常増殖','爆発注意','ゴーレム耐久試験','炎と氷','ドラゴンの試練']],
  ['sea','海底',['深海調査','忍者は海にもいる','深海騎士団','海底魔法戦','王の修行']],
  ['grassland2','草原Ⅱ',['帰ってきた新種','スライムの逆襲','カエル王国','狙撃部隊','空の支配者']],
  ['tribe','部族村',['森の狩人','戦士の宴','タフネス軍団','二人の長','暴走する力']],
  ['rural2','田舎町Ⅱ',['アンコール！','ジュラシック再結成','三つの悪意','魂の説法','最強護衛隊長']],
  ['neon2','ネオン街Ⅱ',['セキュリティ暴走','ネオン幼竜','タイガーネットワーク','マスターの番犬','ネオン・マスタークラス']],
  ['magma2','マグマⅡ',['変異スライム','灼熱地獄','ゴーレム工場','バスター量産計画','ドラゴン・トライアル']],
  ['desert2','砂漠Ⅱ',['不滅の王','ソウルフュージョン実験体','大地と業火','夜と時間','四人衆・完全復活']]
 ].map(([worldId,name,names])=>({worldId,name,required:[],quests:names.map((name,i)=>({id:`${worldId}-${i+1}`,no:i+1,name,pending:true,note:'報酬番号・会話が資料未設定'}))}))
];

/* ===== MOB QUEST v84: latest confirmed subquests ===== */
{
  const area=id=>SUBQUEST_AREAS.find(a=>a.worldId===id);
  const grass=area('grassland'),desert=area('desert'),rural=area('rural');
  if(grass?.quests?.[4]?.reward)grass.quests[4].reward.diamonds=50;
  if(desert?.quests?.[4]?.reward)desert.quests[4].reward.diamonds=50;
  if(rural?.quests?.[4]?.reward)rural.quests[4].reward.diamonds=50;
  const neon=area('neon');if(neon)neon.quests=[...neon.quests.slice(0,2),
    {id:'neon-3',no:3,name:'ネオン・サバイバル',reward:{diamonds:10,coins:10000,weapons:['17'],armor:'17'},intro:[['desert','モブエースのような戦士はネオン街にもっといるのか？'],['money','あいつは特別。強いし責任感もあって、次の王として適任だった'],['pink','悲しいでありますね'],['money','まあね。でもきっと何か事情があるのよ'],['desert','そうだといいがな'],['show',['n-golem','n-chaser','n-trainer']],['money','魔王を倒せばきっと全部分かる！戦うわよ！']],waves:[[{id:'n-golem',level:25,preemptive:true,actionCount:2,forceActionCount:true}],[{id:'n-chaser',level:25,preemptive:true,actionCount:2,forceActionCount:true}],[{id:'n-trainer',level:25,preemptive:true,actionCount:2,forceActionCount:true}]],post:[['pink','お見事であります！'],['desert','ネオン街、悪くないエリアだ']]},
    {id:'neon-4',no:4,name:'追跡者',reward:{diamonds:10,coins:10000,weapons:['12','18'],armor:'18'},intro:[['pink','モブマニーは魔女ですよね？'],['money','ええ、魔女っ娘よ！'],['pink','魔法は独学でありますか？'],['money','違うよ。・・・・誰からだっけ？でも凄く強い人！'],['desert','ネオン街の住人か？'],['money','たぶんそうだと思う！'],['show',['sq-neon-chaser-neo','sq-neon-chaser-neo']],['pink','凄い速さであります！！'],['desert','先制攻撃をしてくる可能性が高い。注意しろ！']],waves:[[{id:'sq-neon-chaser-neo',level:25},{id:'sq-neon-chaser-neo',level:25}]],post:[['money','2人ともさすがね！'],['pink','まだまだであります！']]},
    {id:'neon-5',no:5,name:'ネオン街の夢',reward:{diamonds:50,coins:10000,weapons:['19'],armor:'19'},intro:[['money','少しずつ記憶が戻ってる気がする。でも肝心なことは何も分からないの'],['pink','辛いでありますね'],['money','そうでもないわよ。私は私。生きてるし楽しんでる'],['desert','前向きだな'],['money','それが私の取り柄だからね'],['show',['boss-neon','boss-neon']],['pink','ボ、ボスであります！！'],['desert','こいつ、、量産型か？'],['money','たぶん魔王軍の仕業ね。見てられないわ']],waves:[[{id:'boss-neon',level:25},{id:'boss-neon',level:25}]],post:[['money','許せないわね。早く次のエリアに行きましょう！']]}
  ];
  const magma=area('magma');if(magma){magma.required=['nyoro','money','denden'];magma.quests=[
    {id:'magma-1',no:1,name:'マグマスライム異常増殖',reward:{diamonds:10,coins:15000,weapons:['06','16'],armor:'20'},intro:[['nyoro','マグマのスライムは集団が多いニョロ'],['denden','なにか理由があるでやんすか？'],['nyoro','マグマは強いモンスターが多いから、集団で固まって身を守るニョロ'],['money','ふ～ん。でも弱くはないのよね？'],['nyoro','むしろ強いニョロ！'],['show',['m-honoslime','m-magslime']],['nyoro','こうして集まると厄介ニョロ'],['money','魔法で一気に片付けるわ！']],waves:[[{id:'m-honoslime',level:33},{id:'m-honoslime',level:33},{id:'m-honoslime',level:33},{id:'m-magslime',level:33},{id:'m-magslime',level:33}]],post:[['denden','本当に強いモンスターが多いでやんす'],['nyoro','先代がいなくなって無法地帯ニョロ']]},
    {id:'magma-2',no:2,name:'爆発注意',reward:{diamonds:10,coins:15000,weapons:['20'],armor:'21'},intro:[['money','先代はどんなモンスターだったの？'],['nyoro','モブフェニックス様は気高く優しいモンスターだったニョロ'],['denden','モブドラゴンにやられたでやんすね'],['nyoro','でも、あれはみんなを守ろうとして、まともに戦えなかったからニョロ'],['money','魔王軍らしいわね'],['show',['m-bombthrow','m-bomber']],['nyoro','こいつらも遠くから爆弾を投げていたニョロ！'],['denden','卑怯者は成敗でやんす！']],waves:[[{id:'m-bombthrow',level:34},{id:'m-bombthrow',level:34},{id:'m-bomber',level:34},{id:'m-bomber',level:34}]],post:[['money','不死鳥なのよね？復活とかしないの？'],['nyoro','・・分からないニョロ']]},
    {id:'magma-3',no:3,name:'ゴーレム耐久試験',reward:{diamonds:10,coins:15000,weapons:['21'],armor:'22'},intro:[['nyoro','実は僕はマグマ出身じゃないニョロ'],['money','え、そうなの？'],['nyoro','故郷に変わりはないニョロ'],['denden','事情がありそうでやんすね'],['nyoro','ハチュー洞窟という海底近くの洞窟ニョロ'],['money','なんかヌメヌメしてそうな名前ね'],['show',['m-golem','m-golem']],['nyoro','ちょっとここと似てるから住みやすいんだニョロ'],['denden','じゃあモブニョロはやっぱり強いでやんす！']],waves:[[{id:'m-golem',level:35,mods:{hp:1.45,def:1.55,spd:.75}},{id:'m-golem',level:35,mods:{hp:1.45,def:1.55,spd:.75}}]],post:[['money','帰りたいとか思わないの？'],['nyoro','・・・・そのうち寄ってみるニョロ！']]},
    {id:'magma-4',no:4,name:'炎と氷',reward:{diamonds:10,coins:15000,weapons:['22'],armor:'23'},intro:[['show',['m-flame','m-blizzard']]],waves:[[{id:'m-flame',level:35},{id:'m-blizzard',level:35}],[{id:'m-frezard',level:37}]],post:[]},
    {id:'magma-5',no:5,name:'ドラゴンの試練',reward:{diamonds:50,coins:30000,weapons:['23'],armor:'24'},intro:[['show',['sq-young-dragon']]],waves:[[{id:'sq-young-dragon',level:40}]],post:[]}
  ];}
  const sea=area('sea');if(sea){sea.required=['nekoku','pink','desert'];sea.quests=[
    {id:'sea-1',no:1,name:'深海調査',reward:{diamonds:10,coins:30000,weapons:['24'],armor:'25'},intro:[['nekoku','海底は平和だ。だから守らないと'],['pink','それでみんな強いのでありますね'],['nekoku','オラも修行中だ'],['show',['s-mist','s-nessie']],['nekoku','国王様の役に立つなら、もっと強くなるぞ'],['desert','良い忠誠心だ']],waves:[[{id:'s-mist',level:40},{id:'s-mist',level:40},{id:'s-nessie',level:40},{id:'s-nessie',level:40}]],post:[['pink','モブネコクー、十分強いであります！頼もしいですね♪']]},
    {id:'sea-2',no:2,name:'海に潜むニンジャ',reward:{diamonds:10,coins:30000,weapons:['25'],armor:'26'},intro:[['desert','ここの住人は海底から外には出ないのか？'],['nekoku','むしろここにいることの方が少ないぞ。色んなエリアでみんな戦っているぞ'],['pink','凄いですね～。尊敬であります！'],['show',['s-ninja','s-ninja','s-ninja','s-ninja']],['nekoku','色んなエリアの文化で海底は毎日進化してるぞ']],waves:[[{id:'s-ninja',level:40},{id:'s-ninja',level:40},{id:'s-ninja',level:40},{id:'s-ninja',level:40}]],post:[['desert','通りで技が多様なわけだ']]},
    {id:'sea-3',no:3,name:'海底騎士団',reward:{diamonds:10,coins:30000,weapons:['26'],armor:'27'},intro:[['nekoku','海底にはカッコイイ騎士団がいるぞ'],['pink','騎士団でありますか～！'],['nekoku','オラもその一人だ'],['desert','だから推薦されたのか'],['show',['s-soldier','sq-high-abyss']],['nekoku','強い仲間がいっぱいいるぞ'],['pink','いずれ共闘する日が来るかもしれないであります！']],waves:[[{id:'s-soldier',level:40},{id:'s-soldier',level:40},{id:'sq-high-abyss',level:48},{id:'sq-high-abyss',level:48}]],post:[['desert','魔王軍 VS 騎士団か。見てみたいものだな']]},
    {id:'sea-4',no:4,name:'モブウェイブの本気',reward:{diamonds:10,coins:50000,weapons:['27'],armor:'28'},intro:[['nekoku','モブウェイブは長年国王様の側近なんだぞ'],['pink','風格ありましたからね～。納得であります！'],['show',['sq-wave-serious']],['desert','腕試しにはもってこいだな']],waves:[[{id:'sq-wave-serious',level:50}]],post:[['desert','学びの多い戦いだったな'],['nekoku','オラ、モブウェイブ好きだ。いいやつで強い'],['pink','仲間になって欲しいでありますね～']]},
    {id:'sea-5',no:5,name:'ライバル再び',reward:{diamonds:50,coins:50000,weapons:['28'],armor:'29'},intro:[['nekoku','モブジョーンズは海底の英雄なんだぞ'],['pink','英雄でありますか！'],['nekoku','有名な戦いには必ずモブジョーンズの功績があるぞ'],['desert','まだまだ力を秘めていそうだったな'],['show',['sq-power-jones']],['nekoku','ある戦いで敗れて以来、強さをさらに求めているぞ'],['desert','良い志だ']],waves:[[{id:'sq-power-jones',level:55}]],post:[['pink','これほどの力でも勝てなかったでありますか？'],['nekoku','一対一ではなかったと聞いてるぞ'],['pink','きっと卑怯な手を使われたであります！']]}
  ];}
  const grass2=area('grassland2');if(grass2){grass2.required=['tetsu','denden','nyoro'];grass2.quests=[
    {id:'grassland2-1',no:1,name:'モブハネスライム',reward:{diamonds:10,coins:50000,weapons:['29'],armor:'30'},intro:[['tetsu','皆はどれくらい旅をしているでござる？'],['denden','短いような、長いようなでやんす！'],['nyoro','友情には時間なんて関係ないニョロ！'],['tetsu','それはそうでござるな。野暮でござった'],['show',['sq-wing-slime','sq-wing-slime']],['tetsu','拙者、共闘とは無縁でござった。勇者様たちと会えて気楽に戦えるでござる！']],waves:[[{id:'sq-wing-slime',level:50},{id:'sq-wing-slime',level:50}]],post:[['denden','モブテツ、強いでやんす！'],['nyoro','1人で戦えるわけだニョロ'],['tetsu','いやいや、みんなの力があってこそでござる！']]},
    {id:'grassland2-2',no:2,name:'スライムの逆襲',reward:{diamonds:10,coins:50000,weapons:['30'],armor:'31'},intro:[['denden','サムライは他にもいるでやんすか？'],['tetsu','どうでござろう？旅に出てまだ会ったことないでござる'],['nyoro','敵にいたら嫌だニョロ'],['show',['g2-slime','g2-slime','g2-slime','g2-slime']],['tetsu','その時は拙者がお相手するでござる！']],waves:[[...Array(5)].map(()=>({id:'g2-slime',level:50})),[...Array(5)].map(()=>({id:'g2-slime',level:50}))],post:[['tetsu','魔王軍の猛者たち、戦うのが楽しみでござる！'],['denden','・・なんかオイラも強くなった気がするでござる！あ！やんすでやんす！']]},
    {id:'grassland2-3',no:3,name:'カエル王国',reward:{diamonds:10,coins:50000,weapons:['31'],armor:'32'},intro:[['nyoro','監獄はどんなところだったニョロ？'],['tetsu','名前ほど嫌なところじゃないでござる。いいやつもいっぱいいたでござるよ'],['denden','もしかしたら他にも脱獄しているかもしれないでやんすね！'],['tetsu','再会出来たら拙者嬉しいでござる'],['show',['g2-merakero','g2-keroking']],['nyoro','旅を続けていればきっと会えるニョロ！'],['denden','そうでやんす！']],waves:[[{id:'g2-merakero',level:53},{id:'g2-merakero',level:53},{id:'g2-keroking',level:57}]],post:[['tetsu','拙者、まだまだ腕を磨くでござる！']]},
    {id:'grassland2-4',no:4,name:'狙撃部隊',reward:{diamonds:10,coins:50000,weapons:['32'],armor:'33'},intro:[['denden','オイラの仲間も監獄に行ったやつがいるでやんす'],['nyoro','なんでニョロ？'],['denden','理由は分からないでやんすが、風の噂で教育係をやっていると聞いたでやんす'],['tetsu','教育係・・拙者は見たことないでござる'],['show',['g2-tsuru','g2-tsuru','g2-tsuru']],['denden','オイラ、いつか会いたいと思ってずっと忘れてないでやんす！']],waves:[[{id:'g2-tsuru',level:55},{id:'g2-tsuru',level:55},{id:'g2-tsuru',level:55}]],post:[['tetsu','その者の名を聞いてもよいでござるか？'],['denden','モブエーデンというでやんす。護衛隊の中でも人望のあるやつでやんした'],['tetsu','知らない名でござる。でも、会えるといいでござるな！']]},
    {id:'grassland2-5',no:5,name:'空の支配者',reward:{diamonds:50,coins:50000,weapons:['33','34'],armor:'34'},intro:[['denden','空はいいでやんすね～。オイラも飛びたいでやんす！'],['nyoro','あ、僕は空飛べるニョロ'],['tetsu','そうなのでござるか！？'],['nyoro','この傘でぴゅーんと飛べるニョロ！'],['denden','羨ましいでやんす～！'],['show',['sq-red-hawk','sq-blue-hawk']],['tetsu','皆構えよ！強力なモンスターでござる！！'],['denden','オイラの雷で叩き落としてやるでやんす！']],waves:[[{id:'sq-red-hawk',level:60},{id:'sq-blue-hawk',level:60}]],post:[['nyoro','僕たち強くなってるニョロ！'],['tetsu','さあ！魔王の元へいざ！']]}
  ];}
}
function ensureSubquestMeta(){if(!state.meta.subquests||typeof state.meta.subquests!=='object')state.meta.subquests={cleared:{}};state.meta.subquests.cleared=state.meta.subquests.cleared||{};return state.meta.subquests;}
function subquestArea(worldId){return SUBQUEST_AREAS.find(a=>a.worldId===worldId)||null;}
function subquestById(id){for(const a of SUBQUEST_AREAS){const q=a.quests.find(x=>x.id===id);if(q)return{area:a,quest:q};}return null;}
function subquestCleared(id){return!!ensureSubquestMeta().cleared[id];}
function subquestAreaUnlocked(a){return state.test?.enabled||worldCleared(a.worldId);}
function subquestRequiredReady(a){return(a.required||[]).every(id=>state.party.some(x=>canonicalPlayerId(x[0])===canonicalPlayerId(id)));}
function subquestNextQuest(area){if(!area)return null;const quests=[...(area.quests||[])].sort((a,b)=>Number(a.no||0)-Number(b.no||0));return quests.find(q=>!subquestCleared(q.id))||null;}
function subquestVisibleQuest(area){const q=subquestNextQuest(area);return q&&!q.pending?q:null;}
const TRAINING_MODES=[
  {id:'test',name:'テスト戦闘',icon:'mqicon/04.png',desc:'自由設定'},
  {id:'program',name:'バトルプログラム',icon:'icon/22.png',desc:'シーズン制バトル'},
  {id:'subquest',name:'サブクエスト',icon:'icon/24.png',desc:'クリア済みエリアの別ストーリー'},
  {id:'journal',name:'冒険日記',icon:'icon/14.png',desc:'クリア済みエリアを再体験'},
  {id:'exp',name:'経験値ターンテーブル',icon:'icon/15.png',desc:'経験値レコードを使用'},
  {id:'gold',name:'ゴールドターンテーブル',icon:'icon/16.png',desc:'ゴールドレコードを使用'},
  {id:'boss',name:'ボスターンテーブル',icon:'icon/17.png',desc:'撃破済みボスへ挑戦'}
];
const BATTLE_PROGRAM_SEASONS=[
  {id:1,name:'シーズン1',unlock:()=>true,bg:'back/sougen.png',fallback:'back2/02.png',rewardId:'01',programs:[
    {id:'s1-1',no:1,label:'スライム Lv.3',enemies:[{id:'g-slime',level:3}]},
    {id:'s1-2',no:2,label:'スライム ×2 Lv.3',enemies:[{id:'g-slime',level:3},{id:'g-slime',level:3}]}
  ]},
  {id:2,name:'シーズン2',unlock:()=>worldCleared('grassland'),bg:'back/sougen.png',fallback:'back2/02.png',rewardId:'02',programs:[
    {id:'s2-3',no:3,label:'モブロック ×3 Lv.6',enemies:[{id:'g-rock',level:6},{id:'g-rock',level:6},{id:'g-rock',level:6}]},
    {id:'s2-4',no:4,label:'モブテンデビ ×3 Lv.6',enemies:[{id:'g-tendevi',level:6},{id:'g-tendevi',level:6},{id:'g-tendevi',level:6}]},
    {id:'s2-5',no:5,label:'モブジョーロ ×3 Lv.6',enemies:[{id:'g-jouro',level:6},{id:'g-jouro',level:6},{id:'g-jouro',level:6}]},
    {id:'s2-6',no:6,label:'モブバード Lv.6 / ピヨミドリ・ピヨレッド Lv.5',enemies:[{id:'g-bird',level:6},{id:'g-piyo-green',level:5},{id:'g-piyo-red',level:5}]},
    {id:'s2-7',no:7,label:'モブビーバー ×3 Lv.6',enemies:[{id:'g-beaver',level:6},{id:'g-beaver',level:6},{id:'g-beaver',level:6}]}
  ]}
];
function ensureBattleProgramMeta(){
  if(!state.meta.battleProgram||typeof state.meta.battleProgram!=='object')state.meta.battleProgram={cleared:{},seasonRewards:{}};
  state.meta.battleProgram.cleared=state.meta.battleProgram.cleared||{};
  state.meta.battleProgram.seasonRewards=state.meta.battleProgram.seasonRewards||{};
  return state.meta.battleProgram;
}
function battleProgramSeason(id){return BATTLE_PROGRAM_SEASONS.find(s=>s.id===Number(id))||null;}
function battleProgramById(id){for(const season of BATTLE_PROGRAM_SEASONS){const program=season.programs.find(p=>p.id===id);if(program)return{season,program};}return null;}
function availableBattleProgramSeasons(){return BATTLE_PROGRAM_SEASONS.filter(s=>s.programs.length&&s.unlock());}
function battleProgramCleared(id){return !!ensureBattleProgramMeta().cleared[id];}
function battleProgramSeasonClear(season){return !!season?.programs?.length&&season.programs.every(p=>battleProgramCleared(p.id));}
const TURNTABLE_DIFFICULTIES={
  normal:{id:'normal',name:'ノーマル',cost:1,recommended:5},
  hard:{id:'hard',name:'ハード',cost:3,recommended:15},
  veryhard:{id:'veryhard',name:'ベリーハード',cost:5,recommended:30},
  inferno:{id:'inferno',name:'インフェルノ',cost:10,recommended:50}
};
const BOSS_DIFFICULTIES={
  normal:{id:'normal',name:'ノーマル',cost:1,recommended:25,itemRate:.10},
  hard:{id:'hard',name:'ハード',cost:1,recommended:40,itemRate:.25},
  veryhard:{id:'veryhard',name:'ベリーハード',cost:1,recommended:65,itemRate:.40},
  inferno:{id:'inferno',name:'インフェルノ',cost:1,recommended:90,itemRate:.60}
};
const TRAINING_GUIDE_TEXT={
  subquest:'サブクエストでは\nエリアの別のストーリーが見れて\n様々なアイテムが手に入る！\n特に防具は貴重だぞ！\nエリアクリアごとに\n必ずチェックしよう！',
  program:'ここではモンスターと戦って報酬を得ることが出来るぞ！\nシーズンのプログラムをすべてクリアすると、\nアイテムを獲得だ！\n経験値やコインももらえるから、\n積極的に挑戦しよう！',
  journal:'ここでは一度クリアしたエリアを\n再探索出来るよ！\n経験値を積んだり\nアイテムを探そう！',
  exp:'ここでは\n経験値レコードを消費して\n経験値エリアに入れるよ！\nたくさん経験を積もう！',
  gold:'ここでは\nゴールドレコードを消費して\nゴールドエリアに入れるよ！\nコインをたくさん稼ごう！',
  boss:'ここでは\nボスレコードを消費して\nボスエリアに入れるよ！\n強敵と戦って\nここでしか手に入らない\nレアアクセサリーを\n獲得しよう！'
};
async function showTrainingModeGuide(mode){
  const text=TRAINING_GUIDE_TEXT[mode];if(!text||facilityFlag(`training:${mode}`))return;
  await facilityTalk(text,'モブコーチ','play/003.png');markFacilityFlag(`training:${mode}`);
}
async function setTrainingMode(mode){
  if(mode==='home')return leaveTraining();
  if(mode==='test'&&!state.test?.enabled)return toast('テストモード中のみ使用できます');
  if(mode!=='menu'&&!TRAINING_MODES.some(x=>x.id===mode))mode='menu';
  state.training.mode=mode;
  renderTraining();
  if(['program','subquest','journal','exp','gold','boss'].includes(mode)){
    const firstSub=mode==='subquest'&&!facilityFlag('training:subquest');await showTrainingModeGuide(mode);if(mode==='subquest'&&!firstSub)await facilityTalk('サブクエストに挑戦かい？\nどのクエストにする？','モブコーチ','play/003.png');
    const pop=$('#trainingFeaturePopup');if(pop){pop.hidden=false;pop.dataset.mode=mode;}
    const title=$('#trainingFeaturePopupTitle');if(title)title.textContent=TRAINING_MODES.find(x=>x.id===mode)?.name||'トレーニング';
  }else if(mode==='test'){
    $('#trainingFeaturePopup').hidden=true;$('#trainingFeaturePopup').dataset.mode='';
    requestAnimationFrame(()=>{$('#trainingTestPanel')?.scrollIntoView({behavior:'smooth',block:'start'});});
  }else{$('#trainingFeaturePopup').hidden=true;$('#trainingFeaturePopup').dataset.mode='';}
}
function renderTrainingModeCarousel(){
  const root=$('#trainingModeCarousel');if(!root)return;
  const mode=state.training.mode||'menu';
  const cards=TRAINING_MODES.filter(m=>m.id!=='test');
  if(state.test?.enabled)cards.push(TRAINING_MODES.find(m=>m.id==='test'));
  root.innerHTML=cards.filter(Boolean).map((m,i)=>`<button class="training-mode-card ${m.id===mode?'active':''} ${m.id==='test'?'test-card':''}" data-training-mode="${m.id}" type="button" style="--float-delay:${(i*.28).toFixed(2)}s"><img src="${m.icon}" alt="${m.name}"><b>${m.name}</b></button>`).join('');
  bindImages(root);
  $$('[data-training-mode]',root).forEach(b=>{b.onclick=e=>{e.preventDefault();e.stopPropagation();setTrainingMode(b.dataset.trainingMode);};});
}
async function enterTraining(){
  state.training.mode='menu';renderTraining();
  if(!facilityFlag('training')){
    await facilityTalk('よく来たね！ここでは一度クリアしたエリアを再探索したり、レコードを使って経験値やコインを稼ぐことが出来るよ！','モブコーチ','play/003.png');
    await facilityTalk('難しいことは何も無いから、とにかくレッツトレーニングだ！','モブコーチ','play/003.png');
    markFacilityFlag('training');
  }
}
async function leaveTraining(){await facilityTalk('また来てくれよな！レッツトレーニング！','モブコーチ','play/003.png');await goHome();}
function clearedJournalWorlds(){const worlds=MOB_DATA.adventureWorlds||[];return worlds.filter((w,i)=>state.adventure.completed||(Number(state.adventure.worldIndex)||0)>i);}
function recordCountForMode(mode){return itemCount(mode==='exp'?'36':mode==='gold'?'37':'38');}
function renderBattleProgramSeasonSelect(){
  const root=$('#trainingFeaturePanel');if(!root)return;
  const seasons=availableBattleProgramSeasons();
  ensureBattleProgramMeta();
  state.training.programSeason=null;
  root.innerHTML=`<section class="panel battle-program-panel"><div class="section-title"><div><small>BATTLE PROGRAM</small><h2>シーズンを選択</h2></div><span class="pill">CLEAR PROGRAM</span></div><p class="panel-note">好きなシーズンを選んで、プログラムをクリアしていこう。</p><div class="battle-program-season-grid">${seasons.map(season=>{const cleared=season.programs.filter(p=>battleProgramCleared(p.id)).length,done=battleProgramSeasonClear(season);return`<button class="battle-program-season ${done?'complete':''}" data-program-season="${season.id}" type="button"><span>SEASON ${season.id}</span><b>${season.name}</b><small>${cleared} / ${season.programs.length} CLEAR</small>${done?'<em>COMPLETE</em>':''}</button>`;}).join('')||'<div class="camp-empty-note">現在挑戦できるシーズンはありません。</div>'}</div></section>`;
  $$('[data-program-season]',root).forEach(btn=>btn.onclick=()=>renderBattleProgramList(Number(btn.dataset.programSeason)));
}
function renderBattleProgramList(seasonId){
  const root=$('#trainingFeaturePanel'),season=battleProgramSeason(seasonId);if(!root||!season||!season.unlock())return renderBattleProgramSeasonSelect();
  state.training.programSeason=season.id;
  const reward=itemData(season.rewardId),clearedCount=season.programs.filter(p=>battleProgramCleared(p.id)).length;
  root.innerHTML=`<section class="panel battle-program-panel"><div class="section-title"><div><small>BATTLE PROGRAM / SEASON ${season.id}</small><h2>${season.name}</h2></div><button class="battle-program-back" data-program-back type="button">シーズン選択へ</button></div><div class="battle-program-reward"><div><small>全クリ報酬</small><b>${reward?.name||'ITEM'}</b></div><img src="${reward?.image||''}" alt="${reward?.name||''}"><span>${clearedCount}/${season.programs.length}</span></div><div class="battle-program-list">${season.programs.map(program=>{const done=battleProgramCleared(program.id),enemyText=program.enemies.map(c=>`${trainingEnemyTemplate(c.id)?.name||c.id} Lv.${c.level}`).join(' / ');return`<button class="battle-program-card ${done?'cleared':''}" data-program-id="${program.id}" type="button"><span class="program-number">PROGRAM ${program.no}</span><div><b>${program.label}</b><small>${enemyText}</small></div><em>${done?'CLEAR':'挑戦'}</em></button>`;}).join('')}</div></section>`;
  bindImages(root);
  $('[data-program-back]',root).onclick=renderBattleProgramSeasonSelect;
  $$('[data-program-id]',root).forEach(btn=>btn.onclick=()=>confirmBattleProgram(btn.dataset.programId));
}
async function confirmBattleProgram(programId){
  const found=battleProgramById(programId);if(!found||!found.season.unlock())return;
  const answer=await dialog('このプログラムに挑戦するかい？',[['はい','yes','primary'],['いいえ','no']],'モブコーチ','play/003.png');
  if(answer!=='yes')return;
  await facilityTalk('レッツトレーニング！武運を祈る！','モブコーチ','play/003.png');
  return startBattleProgram(found.season,found.program);
}
async function startBattleProgram(season,program){
  markTrainingPlayed();
  state.quest={type:'program',seasonId:season.id,programId:program.id,programNo:program.no,areaIndex:0,battleIndex:0,battleReady:true,explored:true,campUsed:false,vitals:freshQuestVitals(),finished:false,locked:true,bg:season.bg,fallbackBg:season.fallback,pendingSeasonReward:false,newProgramClear:false};
  const pop=$('#trainingFeaturePopup');if(pop)pop.hidden=true;
  await startBattleLoaded({mode:'quest',returnScreen:'training',enemyConfigs:program.enemies.map(x=>({...x})),party:state.party,questVitals:state.quest.vitals,bg:season.bg,fallbackBg:season.fallback,bossBattle:false,questType:'program',adventureLabel:`バトルプログラム / ${season.name} / PROGRAM ${program.no}`});
}
function markBattleProgramWin(){
  const q=state.quest;if(!q||q.type!=='program')return;
  const meta=ensureBattleProgramMeta(),found=battleProgramById(q.programId);if(!found)return;
  q.newProgramClear=!meta.cleared[q.programId];
  meta.cleared[q.programId]=true;
  q.pendingSeasonReward=battleProgramSeasonClear(found.season)&&!meta.seasonRewards[found.season.id];
  q.finished=true;saveMeta();
}
async function finishBattleProgramReturn(win){
  const q=state.quest,found=q?battleProgramById(q.programId):null,season=found?.season||null;
  const pendingReward=!!q?.pendingSeasonReward;
  state.quest=null;
  state.training.mode='program';
  renderTraining();showScreen('training');
  const pop=$('#trainingFeaturePopup');if(pop){pop.hidden=false;pop.dataset.mode='program';}
  $('#trainingFeaturePopupTitle').textContent='バトルプログラム';
  if(season)renderBattleProgramList(season.id);else renderBattleProgramSeasonSelect();
  if(!win){await facilityTalk('惜しかったね！\n次はクリアを目指して頑張ろう！','モブコーチ','play/003.png');return;}
  if(pendingReward&&season){
    const reward=itemData(season.rewardId);
    await facilityTalk(`ナイスクリア！\nこのシーズンを全てクリアしたね！\n${reward?.name||'アイテム'}をプレゼントだ！\n受け取ってくれ！`,'モブコーチ','play/003.png');
    if(reward){addItem(reward.id,1);ensureBattleProgramMeta().seasonRewards[season.id]=true;saveMeta();await facilityTalk(`${reward.name}を手に入れた！`,'ITEM GET',reward.image);}
  }else await facilityTalk('ナイスクリア！\nこの調子で頑張ってくれ！','モブコーチ','play/003.png');
}

function renderSubquestList(){
  const root=$('#trainingFeaturePanel');if(!root)return;ensureSubquestMeta();
  const areas=SUBQUEST_AREAS.filter(subquestAreaUnlocked),visible=areas.map(area=>({area,quest:subquestVisibleQuest(area)})).filter(x=>x.quest);
  root.innerHTML=`<section class="panel subquest-panel"><div class="section-title"><div><small>SUB QUEST</small><h2>サブクエスト</h2></div><span class="pill">一度限り</span></div><div class="subquest-area-list">${visible.map(({area:a,quest:q})=>{const requiredReady=subquestRequiredReady(a);return`<section class="subquest-area-block"><header><b>${a.name}</b><small>NEXT QUEST</small></header><div><button class="subquest-card" data-subquest-id="${q.id}" type="button"><img src="icon/24.png" alt=""><span><small>QUEST ${q.no}</small><b>${q.name}</b><em>${requiredReady?'挑戦可能':`必須：${(a.required||[]).map(id=>player(id)?.name||id).join('・')}`}</em></span></button></div></section>`;}).join('')||'<div class="camp-empty-note">現在挑戦できるサブクエストはありません。</div>'}</div></section>`;
  bindImages(root);$$('[data-subquest-id]',root).forEach(b=>b.onclick=()=>confirmSubquest(b.dataset.subquestId));
}
async function confirmSubquest(id){const found=subquestById(id);if(!found||found.quest.pending||subquestCleared(id))return;const {area,quest}=found;if(subquestVisibleQuest(area)?.id!==quest.id)return renderSubquestList();if(!subquestAreaUnlocked(area))return;if(!subquestRequiredReady(area)){await facilityTalk(`このクエストには ${(area.required||[]).map(x=>player(x)?.name||x).join('・')} が必要だ！\\n酒場で編成してから挑戦しよう！`,'モブコーチ','play/003.png');return;}await facilityTalk('このクエストでいいかな？','モブコーチ','play/003.png');const ans=await dialog(quest.name,[['はい','yes','primary'],['いいえ','no']],'モブコーチ','play/003.png');if(ans!=='yes')return;await facilityTalk('レッツトレーニング！','モブコーチ','play/003.png');await startSubquest(area,quest);}
function subquestBg(area){const w=(MOB_DATA.adventureWorlds||[]).find(x=>x.id===area.worldId),a=w?.areas?.[0];return{bg:a?.bg||w?.fieldFallback||'back/sougen.png',fallback:w?.fieldFallback||'back2/02.png'};}
async function startSubquest(area,quest){markTrainingPlayed();state.quest={type:'subquest',subquestId:quest.id,subquestWorldId:area.worldId,subquestAreaName:area.name,subquestQuestNo:quest.no,subquestQuestName:quest.name,areaIndex:0,battleIndex:0,battleReady:true,campUsed:false,vitals:freshQuestVitals(),finished:false,locked:true,bg:subquestBg(area).bg,fallbackBg:subquestBg(area).fallback};$('#trainingFeaturePopup').hidden=true;renderQuestScreen();showScreen('quest');await runSubquestLines(area,quest.intro||[]);await startQuestBattle();}
async function runSubquestLines(area,lines=[]){if(!lines.length)return;const bg=subquestBg(area);showScreen('adventure');setImage($('#adventureBg'),bg.bg,bg.fallback);const sc=$('#storyScene');[...sc.classList].filter(c=>c.startsWith('story-world-')).forEach(c=>sc.classList.remove(c));sc.classList.add(`story-world-${area.worldId}`);storySceneExtras=(area.required||[]).filter(id=>!['yusha','pink'].includes(id));$('#storyGuest').hidden=true;$('#storyGuestGroup').hidden=true;$('#storyBubble').hidden=true;$('#storyNarration').hidden=true;sc.hidden=false;sc.style.visibility='hidden';await renderStoryParty();await nextPaint();sc.style.visibility='visible';for(const row of lines){if(row[0]==='show'){await storyShowGuests(row[1]||[]);continue;}await storySay(row[0],row[1]||'');}await storyHideGuests().catch(()=>{});sc.hidden=true;sc.style.visibility='';$('#storyBubble').hidden=true;$('#storyGuest').hidden=true;storySceneExtras=[];renderQuestScreen();showScreen('quest');}
function grantSubquestReward(quest){
  if(!quest?.id)return false;const meta=ensureSubquestMeta();if(meta.cleared[quest.id])return false;
  meta.cleared[quest.id]=true;const reward=quest.reward||{};
  state.meta.diamonds=Math.max(0,Number(state.meta.diamonds)||0)+Math.max(0,Number(reward.diamonds)||0);
  state.coins=Math.max(0,Number(state.coins)||0)+Math.max(0,Number(reward.coins)||0);state.meta.coins=state.coins;
  for(const id of reward.weapons||[])addWeapon(String(id).padStart(2,'0'),1);
  if(reward.armor)addArmor(String(reward.armor).padStart(2,'0'),1);
  for(const id of reward.medals||[])addMedal(String(id).padStart(2,'0'),1);
  saveMeta();renderHome();return true;
}
function subquestRewardRows(reward){const out=[];if(reward.diamonds)out.push({label:'DIAMOND',value:`×${reward.diamonds}`});if(reward.coins)out.push({label:'COIN',value:`${Number(reward.coins).toLocaleString()}G`});for(const id of reward.weapons||[]){const w=weaponById(id);out.push({label:'WEAPON',value:w?.name||id});}if(reward.armor){const a=armorById(reward.armor);out.push({label:'ARMOR',value:a?.name||reward.armor});}for(const id of reward.medals||[]){const w=weaponById(id);out.push({label:'MEDAL',value:`${w?.name||id}メダル`});}return out;}
function createSubquestClearOverlay(quest){const ov=document.createElement('div');ov.className='subquest-clear-overlay-v85';ov.innerHTML='<div class="subquest-clear-card-v85"><div class="subquest-clear-shine-v85"></div><small class="subquest-clear-kicker-v85">TRAINING SUB QUEST</small><h2 class="subquest-clear-title-v85">SUB QUEST CLEAR!</h2><strong class="subquest-clear-name-v85"></strong><span class="subquest-clear-complete-v85"></span><div class="subquest-clear-rewards-v85" hidden><small>QUEST REWARD</small><h3>報酬をゲットした！</h3><div class="subquest-reward-list-v85"></div></div><button class="subquest-clear-next-v85" type="button">報酬を見る</button></div>';ov.querySelector('.subquest-clear-name-v85').textContent=quest.name||'サブクエスト';ov.querySelector('.subquest-clear-complete-v85').textContent=`QUEST ${quest.no||''} COMPLETE`;document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add('show'));return ov;}
function waitSubquestClearButton(ov){return new Promise(resolve=>{const btn=ov?.querySelector('.subquest-clear-next-v85');if(!btn)return resolve(null);const done=()=>{btn.removeEventListener('click',done);resolve(btn);};btn.addEventListener('click',done,{once:true});});}
async function showSubquestReward(quest){
  grantSubquestReward(quest);const ov=createSubquestClearOverlay(quest),btn=ov.querySelector('.subquest-clear-next-v85');
  try{
    const first=await waitSubquestClearButton(ov);if(!first)return;
    first.disabled=true;const card=ov.querySelector('.subquest-clear-card-v85'),rewards=ov.querySelector('.subquest-clear-rewards-v85'),list=ov.querySelector('.subquest-reward-list-v85');
    card.classList.add('reward-stage');rewards.hidden=false;list.textContent='';
    for(const row of subquestRewardRows(quest.reward||{})){const el=document.createElement('div');el.className='subquest-reward-row-v85';const label=document.createElement('span'),value=document.createElement('b');label.textContent=row.label;value.textContent=row.value;el.append(label,value);list.appendChild(el);}
    first.textContent='OK';await fixedDelay(180);first.disabled=false;await waitSubquestClearButton(ov);
    ov.classList.remove('show');ov.classList.add('hide');await fixedDelay(180);
  }finally{ov?.remove();}
}
async function finishSubquestReturn(){
  const q=state.quest;if(!q||q.type!=='subquest'||q.subquestFinishing)return;q.subquestFinishing=true;const found=subquestById(q.subquestId);
  if(!found){endQuestToTraining();return;}
  try{await runSubquestLines(found.area,found.quest.post||[]);await showSubquestReward(found.quest);}
  catch(err){console.error('[MOB QUEST] subquest clear recovery',err);grantSubquestReward(found.quest);toast('サブクエスト報酬を受け取りました');}
  state.quest=null;state.training.mode='subquest';renderTraining();showScreen('training');const pop=$('#trainingFeaturePopup');if(pop){pop.hidden=false;pop.dataset.mode='subquest';}renderSubquestList();
}
function renderTrainingFeature(mode){
  const root=$('#trainingFeaturePanel');root.hidden=false;if(mode==='subquest'){renderSubquestList();return;}const testFree=!!state.test?.enabled;if(mode==='boss')syncDefeatedHistoryFromProgress();
  if(mode==='program'){if(state.training.programSeason)return renderBattleProgramList(state.training.programSeason);return renderBattleProgramSeasonSelect();}
  if(mode==='journal'){
    const worlds=clearedJournalWorlds();root.innerHTML=`<section class="panel"><div class="section-title"><div><small>ADVENTURE JOURNAL</small><h2>クリア済みストーリーを再体験</h2></div><span class="pill">イベントなし</span></div><p class="panel-note">探索とバトルで経験値・コインを獲得できます。中ボスは出現しますがAREA4のボスは出現せず、エリアモンスター4体が出現します。</p><div class="training-feature-grid">${worlds.length?worlds.map((w,i)=>`<article class="training-feature-card"><div class="feature-head"><img src="icon/14.png" alt=""><div><h3>${w.name}</h3><p>4 AREA / 探索あり / セリフ・イベントなし</p></div></div><button data-start-journal="${(MOB_DATA.adventureWorlds||[]).indexOf(w)}" type="button">冒険日記を開始</button></article>`).join(''):'<div class="camp-empty-note">まだクリア済みのエリアがありません。</div>'}</div></section>`;$$('[data-start-journal]',root).forEach(b=>b.onclick=()=>startTrainingQuest('journal',{worldIndex:Number(b.dataset.startJournal)}));bindImages(root);return;
  }
  const isBoss=mode==='boss',recordId=mode==='exp'?'36':mode==='gold'?'37':'38',recordName=itemData(recordId)?.name||'レコード',defs=isBoss?BOSS_DIFFICULTIES:TURNTABLE_DIFFICULTIES,count=itemCount(recordId);
  const discovered=(state.meta.defeatedBosses||[]).length+(state.meta.defeatedElites||[]).length;
  root.innerHTML=`<section class="panel"><div class="section-title"><div><small>${mode.toUpperCase()} TURNTABLE</small><h2>${TRAINING_MODES.find(x=>x.id===mode)?.name||''}</h2></div><span class="pill">${recordName} ×${count}</span></div><div class="record-count-line"><span>経験値 ×${itemCount('36')}</span><span>ゴールド ×${itemCount('37')}</span><span>ボス ×${itemCount('38')}</span>${testFree?'<span>TEST MODE</span>':''}</div><div class="training-feature-grid">${Object.values(defs).map(d=>{const hasBoss=!isBoss||discovered>0,hasRecord=count>=d.cost;return`<article class="training-feature-card ${hasBoss&&hasRecord?'':'locked'}"><div class="feature-head"><img src="${mode==='exp'?'icon/15.png':mode==='gold'?'icon/16.png':'icon/17.png'}" alt=""><div><h3>${d.name}</h3><p>推奨 Lv${d.recommended}${isBoss?` / 限定アイテム率 ${Math.round(d.itemRate*100)}%`:''}</p></div></div><div class="feature-meta"><span>${recordName} ${d.cost}枚</span><span>4 AREA</span><span>1 AREA 1戦</span></div><button data-start-turntable="${mode}" data-difficulty="${d.id}" type="button" ${hasBoss?'':'disabled'}>${isBoss&&!hasBoss?'撃破済みボスがいません':'参加する'}</button></article>`;}).join('')}</div></section>`;
  $$('[data-start-turntable]',root).forEach(b=>b.onclick=()=>startTrainingQuest(b.dataset.startTurntable,{difficulty:b.dataset.difficulty}));bindImages(root);
}
function questRecordId(type){return type==='exp'?'36':type==='gold'?'37':type==='boss'?'38':'';}
function consumeQuestRecord(type,cost){const id=questRecordId(type);return id?consumeItem(id,cost):true;}
function freshQuestVitals(){const out={};for(const [id,lv] of state.party){const q=player(id),st=baseStats(q,lv);out[id]={hp:st.maxHp,mp:st.maxMp,dead:false,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0}};}return out;}
async function startTrainingQuest(type,opt={}){
  markTrainingPlayed();
  if(type==='journal'){
    const wi=clamp(Number(opt.worldIndex)||0,0,(MOB_DATA.adventureWorlds?.length||1)-1),w=MOB_DATA.adventureWorlds?.[wi];
    if(!w||!clearedJournalWorlds().includes(w))return toast('まだ選択できません');
    state.quest={type:'journal',worldIndex:wi,areaIndex:0,battleIndex:0,battleReady:false,explored:false,campUsed:false,vitals:freshQuestVitals(),finished:false,locked:false};
  }else{
    const defs=type==='boss'?BOSS_DIFFICULTIES:TURNTABLE_DIFFICULTIES,d=defs[opt.difficulty]||defs.normal;
    const recordId=questRecordId(type),recordName=itemData(recordId)?.name||'レコード';
    const answer=await dialog(`${recordName}を${d.cost}枚消費するけど、参加するかい？`,[['はい','yes','primary'],['いいえ','no']],'モブコーチ','play/003.png');
    if(answer!=='yes')return;
    if(itemCount(recordId)<d.cost){await facilityTalk('枚数が足りないよ','モブコーチ','play/003.png');renderTrainingFeature(type);return;}
    if(!consumeQuestRecord(type,d.cost)){await facilityTalk('枚数が足りないよ','モブコーチ','play/003.png');renderTrainingFeature(type);return;}
    state.quest={type,difficulty:d.id,areaIndex:0,battleIndex:0,battleReady:true,explored:true,campUsed:false,vitals:freshQuestVitals(),finished:false,itemRate:d.itemRate||0,locked:true,recordSpent:d.cost};
  }
  const pop=$('#trainingFeaturePopup');if(pop)pop.hidden=true;
  renderQuestScreen();showScreen('quest');
}
function questWorld(){return state.quest?.type==='journal'?MOB_DATA.adventureWorlds?.[state.quest.worldIndex]:null;}
function questBackground(){const q=state.quest;if(!q)return{bg:'back/metal.png',fallback:'back2/002.png'};if(q.type==='subquest'){const f=subquestById(q.subquestId);return f?subquestBg(f.area):{bg:q.bg||'back/sougen.png',fallback:q.fallback||'back2/02.png'};}if(q.type==='journal'){const w=questWorld(),a=w?.areas?.[q.areaIndex];return{bg:a?.bg||w?.fieldFallback||'back/sougen.png',fallback:w?.fieldFallback||'back2/002.png'};}if(q.type==='exp')return{bg:q.areaIndex===3?'back/metal2.png':'back/metal.png',fallback:'back2/002.png'};if(q.type==='gold')return{bg:q.areaIndex===3?'back/gold2.png':'back/gold.png',fallback:'back2/002.png'};return{bg:q.areaIndex===3?'back/boss2.png':'back/boss.png',fallback:'back2/002.png'};}
function questTitleText(){const q=state.quest;if(!q)return'';if(q.type==='journal')return`${questWorld()?.name||''}・冒険日記`;if(q.type==='program'){const f=battleProgramById(q.programId);return `バトルプログラム / ${f?.season?.name||''} / PROGRAM ${q.programNo||''}`;}if(q.type==='subquest'){const f=subquestById(q.subquestId),areaName=q.subquestAreaName||f?.area?.name||'',no=q.subquestQuestNo||f?.quest?.no||'';return `${areaName}・QUEST ${no}`;}return TRAINING_MODES.find(x=>x.id===q.type)?.name||'トレーニング';}
function renderQuestScreen(){const q=state.quest;if(!q)return renderTraining();const screen=$('#questScreen'),bg=questBackground(),sub=q.type==='subquest'?subquestById(q.subquestId):null;setImage($('#questBg'),bg.bg,bg.fallback);screen?.classList.toggle('quest-no-back',q.type!=='journal');screen?.classList.toggle('subquest-mode',q.type==='subquest');$('#questTitle').textContent=questTitleText();$('#questKicker').textContent=q.type==='journal'?'ADVENTURE JOURNAL':q.type==='subquest'?'SUB QUEST':'TRAINING QUEST';$('#questAreaPill').textContent=q.type==='subquest'?'AREA 1 / 1':`AREA ${q.areaIndex+1} / 4`;$('#questAreaName').textContent=q.type==='subquest'?(q.subquestQuestName||sub?.quest?.name||'サブクエスト'):`AREA ${q.areaIndex+1}`;$('#questModeLabel').textContent=q.type==='subquest'?`QUEST ${q.subquestQuestNo||sub?.quest?.no||''}`:q.type==='journal'?(questWorld()?.name||'JOURNAL'):(q.difficulty||'').toUpperCase();$('#questDescription').textContent=q.type==='subquest'?'':q.type==='journal'?`戦闘 ${q.battleIndex+1}/3。イベント・セリフは発生しません。`:'探索なし。キャンプとバトルのみ。クリアかゲームオーバーまで退出できません。';const back=$('#questBackBtn');if(back){back.hidden=q.type!=='journal';back.style.display=q.type==='journal'?'':'none';}const explore=$('#questExploreBtn');explore.style.display=q.type==='journal'?'flex':'none';explore.disabled=q.type==='journal'&&(q.battleReady||q.finished);const battleBtn=$('#questBattleBtn');battleBtn.disabled=q.finished||(q.type==='journal'&&!q.battleReady);battleBtn.onclick=startQuestBattle;$('#questBattleHint').textContent=q.finished?'CLEAR':q.type==='journal'?(q.battleReady?'戦闘可能':'探索が必要'):'戦闘開始';$('#questCampBtn').disabled=q.campUsed||q.finished;$('#questCampBtn small').textContent=q.campUsed?'このAREAは休憩済み':'1 AREA 1回';$('#questExploreResult').hidden=true;bindImages($('#questScreen'));}
function currentQuestConfigs(){const q=state.quest;if(!q)return[];if(q.type==='subquest'){const f=subquestById(q.subquestId);return f?.quest?.waves?.[0]||[];}if(q.type==='journal')return journalEncounter();if(q.type==='boss')return bossQuestConfigs();return makeTurntableConfigs(q.type,q.difficulty,q.areaIndex);}
async function questExplore(){const q=state.quest;if(!q||q.type!=='journal'||q.battleReady)return;const box=$('#questExploreResult');box.hidden=false;box.textContent='勇者一行は周囲を探索した';await fixedDelay(420);for(let i=0;i<6;i++){box.textContent=`探索中${'.'.repeat(i%3+1)}`;await fixedDelay(180);}const r=Math.random();let resultWait=900;if(r<.70){const it=weightedPickItem();addItem(it.id,1);box.innerHTML=`<img src="${it.image}" alt=""><b>${it.name}を見つけた！</b><br><small>1つ入手</small>`;bindImages(box);resultWait=1500;}else if(r<.90){const arr=AREA_FLAVOR[questWorld()?.id]||['周囲を見渡した'];box.textContent=pick(arr);}else box.textContent='敵の気配を感じる…';q.battleReady=true;await fixedDelay(resultWait);box.hidden=true;renderQuestScreen();}
async function questCamp(){const q=state.quest;if(!q||q.campUsed)return;const hasTent=tentCount()>0,ans=await dialog(`キャンプで休みますか？\nテント：全回復${hasTent?'':'（未所持）'}\n椅子：HP・MP30%回復`,[[hasTent?'テント':'テントなし','tent',hasTent?'primary':''],['椅子','chair'],['戻る','no']],'CAMP');if(ans==='no'||!ans)return;if(ans==='tent'&&!hasTent)return;if(ans==='tent')consumeItem('mob-tent',1);for(const [id,lv] of state.party){const st=baseStats(player(id),lv),v=q.vitals[id];if(!v||v.dead)continue;if(ans==='tent'){v.hp=st.maxHp;v.mp=st.maxMp;}else{v.hp=Math.min(st.maxHp,v.hp+Math.ceil(st.maxHp*.30));v.mp=Math.min(st.maxMp,v.mp+Math.ceil(st.maxMp*.30));}}q.campUsed=true;toast(ans==='tent'?'HP・MPが全回復した！':'HP・MPが少し回復した！');renderQuestScreen();}
async function startQuestBattle(){const q=state.quest;if(!q||q.finished||q.startingBattle||q.type==='journal'&&!q.battleReady)return;q.startingBattle=true;const btn=$('#questBattleBtn');if(btn)btn.disabled=true;try{const configs=currentQuestConfigs();if(!configs.length){toast('出現可能な敵がいません');return;}const bg=questBackground(),sub= q.type==='subquest'?subquestById(q.subquestId):null,waves=sub?.quest?.waves||null;await startBattleLoaded({mode:'quest',returnScreen:'quest',enemyConfigs:waves?undefined:configs,waves:waves||undefined,party:state.party,questVitals:q.vitals,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:q.type==='boss'||configs.some(x=>trainingEnemyTemplate(x.id)?.category==='boss'),questType:q.type,questArea:q.areaIndex,questDifficulty:q.difficulty||'',worldId:q.subquestWorldId||sub?.area?.worldId||'',adventureLabel:questTitleText()});}finally{if(state.quest)state.quest.startingBattle=false;if(state.quest&&screens.quest.classList.contains('active'))renderQuestScreen();}}
function persistQuestVitals(){const q=state.quest,b=state.battle;if(!q||!b)return;q.vitals={};b.allies.forEach(a=>{q.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow),dead:!!a.dead,status:clone(a.status||{})};});}
function advanceQuestAfterWin(){const q=state.quest;if(!q)return;if(q.type==='subquest'){q.finished=true;return;}if(q.type==='program'){markBattleProgramWin();return;}if(q.type==='journal'){q.battleReady=false;q.explored=false;q.battleIndex++;if(q.battleIndex<3)return;q.battleIndex=0;}q.areaIndex++;q.campUsed=false;if(q.areaIndex>=4)q.finished=true;}
function endQuestToTraining(){state.quest=null;setTrainingMode(state.training.mode||'menu');showScreen('training');}
function ensureTrainingParty(){
  if(!Array.isArray(state.training.party))state.training.party=state.party.map(x=>[...x]);
  const src=state.training.party,seen=new Set();
  state.training.party=Array.from({length:10},(_,i)=>{const x=src[i];if(!Array.isArray(x)||!player(x[0])||seen.has(x[0]))return null;seen.add(x[0]);return[x[0],clamp(Number(x[1])||5,1,120)];});
  return state.training.party;
}
function trainingParty(){return ensureTrainingParty().filter(Boolean).map(x=>[...x]);}
function ensureTrainingEnemies(){
  if(!Array.isArray(state.training.enemySlots))state.training.enemySlots=[{id:'boss-hawk',level:8},null,null,null];
  state.training.enemySlots=Array.from({length:4},(_,i)=>{const x=state.training.enemySlots[i];if(!x||!trainingEnemyTemplate(x.id))return null;const t=trainingEnemyTemplate(x.id);return{id:x.id,level:clamp(Number(x.level)||t.levelMin||1,1,120)};});
  state.training.activeEnemySlot=clamp(Number(state.training.activeEnemySlot)||0,0,3);
  return state.training.enemySlots;
}
function trainingEnemyList(){return ensureTrainingEnemies().filter(Boolean);}
function enemyCategoryLabel(t){return t.category==='boss'?'BOSS':t.category==='elite'?'中ボス':'モンスター';}
function renderTraining(){
  if(state.training.mode==='test'&&!state.test?.enabled)state.training.mode='menu';
  renderTrainingModeCarousel();
  const mode=state.training.mode||'menu',isTest=mode==='test'&&!!state.test?.enabled,isFeature=['program','subquest','journal','exp','gold','boss'].includes(mode);
  $('#trainingPageTitle').textContent=mode==='menu'?'トレーニング':isTest?'テスト戦闘':(TRAINING_MODES.find(x=>x.id===mode)?.name||'トレーニング');
  $('#trainingRandomBtn').style.display=isTest?'block':'none';
  $('#trainingTestPanel').hidden=!isTest;
  const feature=$('#trainingFeaturePanel');if(feature)feature.hidden=!isFeature;
  const popup=$('#trainingFeaturePopup');if(popup&&!isFeature)popup.hidden=true;
  const sticky=$('#trainingStickyAction');if(sticky){sticky.hidden=!isTest;sticky.style.display=isTest?'grid':'none';}
  if(mode==='menu')return;
  if(isFeature){renderTrainingFeature(mode);return;}
  if(!isTest)return;
  ensureTrainingParty();ensureTrainingEnemies();
  const setup=state.training.party;
  $('#trainingPartySetup').innerHTML=Array.from({length:10},(_,i)=>{
    const slot=setup[i],z=zoneForIndex(i),start=i===0||i===4||i===6,p=slot?player(slot[0]):null,lv=slot?.[1]||5;
    const options=`<option value="" ${!slot?'selected':''}>— 空き —</option>`+MOB_DATA.players.map(q=>`<option value="${q.id}" ${p?.id===q.id?'selected':''}>${q.name} / ${q.attribute}</option>`).join('');
    return`${start?`<div class="training-zone-title ${i===4?'super':i===6?'reserve':''}"><b>${z.key}</b><small>${i<4?'戦闘開始メンバー':i<6?'2～5ターンごとに自動行動':'待機メンバー'}</small></div>`:''}<div class="training-slot ${z.cls} ${slot?'':'empty'}"><span>${p?`<img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i>`:'<i class="training-empty-mark">＋</i>'}</span><div class="training-slot-info"><small>${z.key} ${z.n}</small><select data-training-member="${i}">${options}</select></div><label>Lv<input data-training-level="${i}" type="number" min="1" max="120" inputmode="numeric" value="${lv}" ${slot?'':'disabled'}></label></div>`;
  }).join('');
  const slots=state.training.enemySlots,active=state.training.activeEnemySlot,enemyCount=slots.filter(Boolean).length,partyCount=trainingParty().length,previewPartySize=Math.max(1,Math.min(4,partyCount));
  $('#trainingEnemySlots').innerHTML=slots.map((x,i)=>{if(!x)return`<button class="training-enemy-slot empty ${active===i?'active':''}" data-training-enemy-slot="${i}" type="button"><b>ENEMY ${i+1}</b><span>＋</span><small>この枠を選択</small></button>`;const t=trainingEnemyTemplate(x.id),st=enemyStatPreview(t,x.level,enemyCount,previewPartySize);return`<div class="training-enemy-slot filled ${active===i?'active':''}" data-training-enemy-slot="${i}"><button class="training-enemy-select" type="button"><span><img src="${t.image||''}" alt="${t.name}" loading="lazy" decoding="async"><i>${t.symbol||'敵'}</i></span><div><small>ENEMY ${i+1} / ${enemyCategoryLabel(t)}</small><b>${t.name}</b><em>${t.attribute}　HP ${st.maxHp.toLocaleString()} / ATK ${st.atk}</em></div></button><label>Lv<input data-training-enemy-level="${i}" type="number" min="1" max="120" inputmode="numeric" value="${x.level}"></label><button class="training-enemy-remove" data-training-enemy-remove="${i}" type="button">×</button></div>`;}).join('');
  const catalog=trainingEnemyCatalog(),stages=['ALL',...new Set(catalog.map(b=>b.stage))];
  if(state.training.filter!=='ALL'&&!stages.includes(state.training.filter))state.training.filter='ALL';
  $('#bossTabs').innerHTML=stages.map(stage=>`<button class="boss-tab ${state.training.filter===stage?'active':''}" data-boss-stage="${stage}" type="button">${stage==='ALL'?'全て':stage}</button>`).join('');
  const list=state.training.filter==='ALL'?catalog:catalog.filter(b=>b.stage===state.training.filter);
  $('#bossCountLabel').textContent=`味方 ${partyCount}/10　敵 ${enemyCount}/4　${catalog.length}種`;
  $('#bossGrid').innerHTML=list.map(t=>`<button class="boss-choice enemy-catalog-card" data-training-enemy-id="${t.id}" type="button"><span><img src="${t.image||''}" alt="${t.name}" loading="lazy" decoding="async"><i>${t.symbol||'敵'}</i></span><div><b>${t.name}${t.rare?' ★RARE':''}</b><small>${t.stage} / ${t.attribute} / ${enemyCategoryLabel(t)}</small><em>Lv${t.levelMin}${t.levelMax!==t.levelMin?`～${t.levelMax}`:''}${t.special?` / ${t.special}`:' / 技は仮設定'}</em></div></button>`).join('');
  renderSelectedBoss();bindImages($('#trainingScreen'));
  $$('[data-training-member]').forEach(sel=>sel.onchange=()=>{
    const i=Number(sel.dataset.trainingMember),nextId=sel.value,current=state.training.party[i];
    if(!nextId){state.training.party[i]=null;return renderTraining();}
    const other=state.training.party.findIndex((x,j)=>j!==i&&x?.[0]===nextId);
    if(other>=0){state.training.party[other]=current||null;}
    state.training.party[i]=[nextId,current?.[1]||5];renderTraining();
  });
  $$('[data-training-level]').forEach(inp=>inp.onchange=()=>{const i=Number(inp.dataset.trainingLevel);if(state.training.party[i])state.training.party[i][1]=clamp(Number(inp.value)||1,1,120);});
  $$('[data-training-enemy-slot]').forEach(el=>el.onclick=e=>{if(e.target.closest('[data-training-enemy-remove]')||e.target.matches('input'))return;state.training.activeEnemySlot=Number(el.dataset.trainingEnemySlot);renderTraining();});
  $$('[data-training-enemy-level]').forEach(inp=>inp.onchange=()=>{const i=Number(inp.dataset.trainingEnemyLevel);if(state.training.enemySlots[i])state.training.enemySlots[i].level=clamp(Number(inp.value)||1,1,120);renderTraining();});
  $$('[data-training-enemy-remove]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const i=Number(btn.dataset.trainingEnemyRemove);state.training.enemySlots[i]=null;state.training.activeEnemySlot=i;if(!state.training.enemySlots.some(Boolean))state.training.activeEnemySlot=0;renderTraining();});
  $$('[data-boss-stage]').forEach(b=>b.onclick=()=>{state.training.filter=b.dataset.bossStage;renderTraining();});
  $$('[data-training-enemy-id]').forEach(btn=>btn.onclick=()=>{const t=trainingEnemyTemplate(btn.dataset.trainingEnemyId),i=state.training.activeEnemySlot;state.training.enemySlots[i]={id:t.id,level:t.levelMin||1};const next=state.training.enemySlots.findIndex((x,j)=>j>i&&!x);if(next>=0)state.training.activeEnemySlot=next;renderTraining();});
}
function renderSelectedBoss(){const list=trainingEnemyList(),partyCount=trainingParty().length,names=list.map(x=>trainingEnemyTemplate(x.id)?.name).filter(Boolean);$('#selectedBossMini').innerHTML=`<b>味方 ${partyCount}人 / 敵 ${list.length}体：${names.join(' / ')||'未設定'}</b><small>味方は空き枠ありでOK。敵は1～4体まで自由に設定できます</small>`;$('#startTrainingBattleBtn').disabled=!list.length||!partyCount;}
function weightedEnemyCount(areaIndex=0){
  // AREA 1 is always a two-enemy field battle. AREA 2+ uses 2-4 enemies, with four still uncommon.
  if(Number(areaIndex)===0)return 2;
  const r=Math.random();return r<.55?2:r<.90?3:4;
}
function weightedNormalTemplate(world,exclude=[]){
  const pool=(world.normalIds||[]).map(enemyTemplate).filter(Boolean).filter(t=>!exclude.includes(t.id));if(!pool.length)return null;
  const weighted=[];for(const t of pool){const weight=t.rare?1:8;for(let i=0;i<weight;i++)weighted.push(t);}return pick(weighted);
}
function expandEncounterEntries(entries=[]){
  const out=[];
  entries.forEach((x,sourceIndex)=>{
    const q=clamp(Number(x.qty)||1,1,4);
    for(let i=0;i<q;i++)out.push({id:x.id,level:x.level,sourceIndex,sourceQty:q,escort:q>1||x.escort===true,encounterRole:x.encounterRole||'',actionCount:x.actionCount??(q>1?1:undefined)});
  });
  return out.slice(0,4);
}
function arrangeBossFormation(entries=[]){
  const list=[...entries];if(list.length<3)return list;
  // Prefer the unique boss / mid-boss as the centre. Repeated attendants (qty 2 etc.) stay at the sides.
  let primary=list.findIndex(x=>!x.escort&&trainingEnemyTemplate(x.id)?.category==='boss');
  if(primary<0)primary=list.findIndex(x=>!x.escort&&trainingEnemyTemplate(x.id)?.category==='elite');
  if(primary<0)primary=list.findIndex(x=>trainingEnemyTemplate(x.id)?.category==='boss');
  if(primary<0)primary=list.findIndex(x=>trainingEnemyTemplate(x.id)?.category==='elite');
  if(primary<0)return list;
  const [main]=list.splice(primary,1),insertAt=list.length>=3?2:1;list.splice(insertAt,0,main);return list.slice(0,4);
}
function createAdventureEncounter(){
  const w=currentWorld(),area=currentArea(),battleIndex=clamp(state.adventure.battleIndex||0,0,2),areaIndex=clamp(state.adventure.areaIndex||0,0,3);
  if(battleIndex===2){
    const tagWave=rows=>{
      const formed=arrangeBossFormation(expandEncounterEntries(rows||[]));
      if(areaIndex===3){
        return formed.map(r=>{const t=trainingEnemyTemplate(r.id),role=(t?.category==='boss'&&!r.escort)?'boss':'escort';return{...r,encounterRole:role,actionCount:r.actionCount??(role==='escort'?1:undefined)};});
      }
      const uniqueDistinct=formed.every(r=>!r.escort&&Number(r.sourceQty||1)===1);
      const allElite=formed.length>0&&formed.every(r=>trainingEnemyTemplate(r.id)?.category==='elite');
      // Source rule: if up to three individually introduced mid-bosses appear together, all remain mid-bosses.
      // Otherwise normal/repeated attendants are escorts and act once.
      const allAreIntroducedMidBosses=uniqueDistinct&&allElite&&formed.length<=3;
      let chosen=new Set();
      if(allAreIntroducedMidBosses)formed.forEach((_,i)=>chosen.add(i));
      else{
        formed.forEach((r,i)=>{const t=trainingEnemyTemplate(r.id);if(!r.escort&&(t?.category==='boss'||(t?.category==='elite'&&t?.special)))chosen.add(i);});
        if(!chosen.size){const i=formed.findIndex(r=>!r.escort&&(trainingEnemyTemplate(r.id)?.category==='elite'||trainingEnemyTemplate(r.id)?.category==='boss'));if(i>=0)chosen.add(i);}
      }
      return formed.map((r,i)=>{const role=chosen.has(i)?'midboss':'escort';return{...r,encounterRole:role,actionCount:r.actionCount??(role==='escort'?1:undefined)};});
    };
    const first=tagWave(area.boss||[]),waves=[first];
    if(Array.isArray(area.nextWaves)&&area.nextWaves.length){for(const wave of area.nextWaves)if(wave?.length)waves.push(tagWave(wave));}
    else if(area.nextWave?.length)waves.push(tagWave(area.nextWave));
    return{waves,bossBattle:true,label:`${w.name} ${area.name} 中ボス/ボス`};
  }
  const count=w?.id==='grassland'?rint(1,2):weightedEnemyCount(areaIndex),used=[],list=[];for(let i=0;i<count;i++){let t=weightedNormalTemplate(w,used);if(!t)t=weightedNormalTemplate(w,[]);if(!t)break;used.push(t.id);list.push({id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||1),encounterRole:'normal'});}return{waves:[list],bossBattle:false,label:`${w.name} ${area.name} 通常戦`};
}
function encounterNames(enc){return(enc?.waves?.[0]||[]).map(x=>{const t=trainingEnemyTemplate(x.id);return`${t?.name||x.id} Lv${x.level}`;}).join(' / ');}

const ADVENTURE_COMMON_SCALE_MAX=.14;
function setAdventureVisualLoading(on){const gate=$('#adventureVisualLoader'),root=$('#adventureParty');if(gate)gate.hidden=!on;if(root)root.classList.toggle('visual-loading',!!on);}
const ADVENTURE_TRANSPARENCY_CACHE=new Map();
async function cleanAdventurePartyImageBackground(img){
  if(!img||img.dataset.bgCleaned==='1'||!img.naturalWidth||!img.naturalHeight)return;
  img.dataset.bgCleaned='1';
  const original=img.currentSrc||img.src||'';
  if(ADVENTURE_TRANSPARENCY_CACHE.has(original)){
    const cleaned=ADVENTURE_TRANSPARENCY_CACHE.get(original);if(cleaned&&cleaned!==original){await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.src=cleaned;});}return;
  }
  try{
    const w=img.naturalWidth,h=img.naturalHeight,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return;
    ctx.drawImage(img,0,0,w,h);const im=ctx.getImageData(0,0,w,h),px=im.data;
    const idx=(x,y)=>(y*w+x)*4,isBg=(x,y)=>{const i=idx(x,y),a=px[i+3];if(a<10)return true;const rr=px[i],gg=px[i+1],bb=px[i+2],mx=Math.max(rr,gg,bb),mn=Math.min(rr,gg,bb);return rr>=218&&gg>=218&&bb>=218&&(mx-mn)<=30;};
    let cornerTransparent=0;for(const [x,y] of [[0,0],[w-1,0],[0,h-1],[w-1,h-1]])if(px[idx(x,y)+3]<20)cornerTransparent++;
    if(cornerTransparent>=2){ADVENTURE_TRANSPARENCY_CACHE.set(original,original);return;}
    const seen=new Uint8Array(w*h),queue=[];const push=(x,y)=>{if(x<0||y<0||x>=w||y>=h)return;const p=y*w+x;if(seen[p]||!isBg(x,y))return;seen[p]=1;queue.push(p);};
    for(let x=0;x<w;x++){push(x,0);push(x,h-1);}for(let y=0;y<h;y++){push(0,y);push(w-1,y);}
    for(let q=0;q<queue.length;q++){const p=queue[q],x=p%w,y=(p/w)|0;push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1);}
    if(queue.length<Math.max(16,w*h*.015)){ADVENTURE_TRANSPARENCY_CACHE.set(original,original);return;}
    for(const p of queue){const i=p*4;px[i+3]=0;}
    ctx.putImageData(im,0,0);const cleaned=canvas.toDataURL('image/png');ADVENTURE_TRANSPARENCY_CACHE.set(original,cleaned);
    await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.src=cleaned;});
  }catch(err){img.classList.add('white-bg-fallback');ADVENTURE_TRANSPARENCY_CACHE.set(original,original);}
}
async function applyAdventurePartyScale(){
  const root=$('#adventureParty');if(!root)return;
  const imgs=$$('[data-adventure-party-img]',root);if(!imgs.length){setAdventureVisualLoading(false);return;}
  await Promise.all(imgs.map(async img=>{
    if(!(img.complete&&img.naturalWidth))await new Promise(resolve=>{const done=()=>resolve();img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});});
    try{if(img.decode&&img.naturalWidth)await img.decode();}catch(_){}
  }));
  const valid=imgs.filter(img=>img.naturalWidth>0&&img.naturalHeight>0);if(!valid.length){setAdventureVisualLoading(false);return;}
  await Promise.all(valid.map(img=>cleanAdventurePartyImageBackground(img)));
  const sumW=valid.reduce((a,img)=>a+img.naturalWidth,0),maxH=Math.max(...valid.map(img=>img.naturalHeight));
  const scale=Math.min(ADVENTURE_COMMON_SCALE_MAX,Math.max(.01,(root.clientWidth-8)/Math.max(1,sumW)),Math.max(.01,(root.clientHeight-8)/Math.max(1,maxH)));
  valid.forEach(img=>{img.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*scale))}px`,'important');img.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*scale))}px`,'important');img.classList.add('size-ready');});
  await nextPaint();setAdventureVisualLoading(false);
}

/* ===== v26 STORY EVENT ENGINE ===== */
let storyBusy=false;
const STORY_GUESTS={
  mira:'boss-mira',guardian:'boss-guardian',neonBoss:'boss-neon',ace:'boss-ace',dragon:'boss-dragon',nepu:'boss-nepu'
};
/* v32: モブジェシー is the canonical play/06.png player character. */
const STORY_ONLY_ACTORS={};
let storySceneExtras=[];
function storyActorInfo(key){
  const e=STORY_ONLY_ACTORS[key];if(e)return{key,...e,image:versionedPlay(e.image),player:false,eventOnly:true};
  const p=player(key);if(p)return{key,name:p.name,image:versionedPlay(p.image),symbol:p.symbol||'仲',player:true};
  const t=trainingEnemyTemplate(STORY_GUESTS[key]||key);if(t)return{key,name:t.name,image:t.image||'',symbol:t.symbol||'敵',player:false,category:t.category||'normal',enemyTemplate:t,sizeClass:enemySizeClass(t),winged:enemyIsWinged(t)};
  return{key,name:key||'???',image:'',symbol:'?'};
}
function storyFlags(){if(!state.adventure.storyFlags||typeof state.adventure.storyFlags!=='object')state.adventure.storyFlags={};return state.adventure.storyFlags;}
function storyDone(key){return!!storyFlags()[key];}
function markStoryDone(key){storyFlags()[key]=true;saveAdventure();}
function storyWorld(id){return(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id)||currentWorld();}
function storySceneBg(worldId,areaIndex=0){const w=storyWorld(worldId),a=w?.areas?.[clamp(areaIndex,0,3)];return{bg:a?.bg||w?.fieldFallback||'back/rpgmain.png',fallback:w?.fieldFallback||'back/rpgmain.png'};}
let storyTapResolve=null;
let storyTapReadyAt=0;
function storyAdvanceWait(){
  return new Promise(resolve=>{storyTapResolve=resolve;storyTapReadyAt=performance.now()+80;});
}
function handleStoryTapAdvance(e){
  if(!storyTapResolve||performance.now()<storyTapReadyAt)return;
  e?.preventDefault?.();e?.stopPropagation?.();
  const resolve=storyTapResolve;storyTapResolve=null;storyTapReadyAt=0;resolve();
}
async function readyStoryImage(img,src){
  img.classList.remove('size-ready','asset-missing');if(!src){img.classList.add('asset-missing');return false;}
  img.src=src;bindImage(img);try{await preloadAsset(src,'high');if(img.decode)await img.decode();}catch(_){}
  await nextPaint();if(img.naturalWidth){img.classList.add('size-ready');return true;}img.classList.add('asset-missing');return false;
}
let lastStoryPartyScale=.14;
async function sizeStoryPartyImages(root){
  const imgs=$$('[data-story-party-img]',root);
  await Promise.all(imgs.map(async img=>{try{await preloadAsset(img.getAttribute('src'),'high');if(img.decode)await img.decode();}catch(_){}}));
  const valid=imgs.filter(img=>img.naturalWidth>0&&img.naturalHeight>0);if(!valid.length)return;
  const count=valid.length,rows=Math.max(1,Math.ceil(count/6));
  const rowSums=[];for(let i=0;i<count;i+=6)rowSums.push(valid.slice(i,i+6).reduce((a,img)=>a+img.naturalWidth,0));
  const maxRowW=Math.max(...rowSums,1),maxH=Math.max(...valid.map(i=>i.naturalHeight));
  const rowH=Math.max(1,(root.clientHeight-4)/rows);
  /* v36: keep the asset-authored relative size, but make the event party a little smaller than v35. */
  /* v37: story party should sit lower/smaller so guests and bosses never collide with it. */
  const cap=count<=2?.150:count<=3?.138:count<=4?.130:count<=6?.118:count<=8?.112:count<=10?.103:.098;
  const sc=Math.min(cap,(root.clientWidth-8)/maxRowW,(rowH*.94)/maxH);
  lastStoryPartyScale=sc;
  valid.forEach(img=>{
    img.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*sc))}px`,'important');
    img.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*sc))}px`,'important');
    img.classList.add('size-ready');
  });
}
function fitNaturalSize(nw,nh,scale,maxW,maxH){
  if(!(nw>0&&nh>0))return{w:1,h:1,scale:0};
  const s=Math.min(scale,maxW/nw,maxH/nh,1);
  return{w:Math.max(1,Math.round(nw*s)),h:Math.max(1,Math.round(nh*s)),scale:s};
}
function storyEnemyScaleKind(info){return info?.sizeClass||enemySizeClass(info?.enemyTemplate||info||{});}
function applyStoryGuestNaturalSize(holder,img,info,{multi=false}={}){
  if(!holder||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;
  const scene=$('#storyScene')?.getBoundingClientRect();if(!scene?.width||!scene?.height)return;
  let sz;
  if(info?.player){
    /* New allies use exactly the same source-pixel scale as the visible event party. */
    let sc=Math.min(lastStoryPartyScale||.14,.17);if($('#storyScene')?.classList.contains('story-world-tribe'))sc=Math.min(.18,Math.max(.135,sc*1.18));
    sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,sc,scene.width*(multi?.25:.32),scene.height*(multi?.22:.25));
  }else{
    const kind=storyEnemyScaleKind(info),base=clamp(scene.width/2550,.155,.205)*(multi?.88:1),tune=enemyVisualTune(info);
    const mul={small:.82,normal:1.00,elite:1.16,rock:1.24,golem:1.32,boss:1.72,dragon:1.98,frezard:2.08}[kind]||1;
    const maxW=scene.width*({small:.30,normal:.39,elite:.46,rock:.50,golem:.54,boss:.84,dragon:.92,frezard:.94}[kind]||.42)*(multi?.76:1);
    const maxH=scene.height*({small:.19,normal:.24,elite:.28,rock:.31,golem:.34,boss:.45,dragon:.50,frezard:.54}[kind]||.25)*(multi?.90:1);
    sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,base*mul*tune.scale,maxW,maxH);
  }
  holder.style.setProperty('width',`${sz.w}px`,'important');
  holder.style.setProperty('height',`${sz.h}px`,'important');
}

function storyDisplayPartyIds(extraIds=null){
  const visible=state.party.map(([id])=>canonicalPlayerId(id)).filter(Boolean).slice(0,12);
  const extras=[...storySceneExtras,...(Array.isArray(extraIds)?extraIds:(extraIds?[extraIds]:[]))].map(canonicalPlayerId).filter(Boolean);
  for(const id of extras){
    if(visible.includes(id))continue;
    if(visible.length<12)visible.push(id);
    else visible[visible.length-1]=id;
  }
  return [...new Set(visible)];
}
async function renderStoryParty(extraIds=null){
  const root=$('#storyPartyLine');
  const list=storyDisplayPartyIds(extraIds).map(id=>storyActorInfo(id)).filter(x=>x?.image);
  root.dataset.partyCount=String(list.length);
  root.innerHTML=list.map(p=>`<div class="story-party-actor" data-story-actor="${p.key}"><img data-story-party-img src="${p.image}" alt="${p.name}"></div>`).join('');
  bindImages(root);await sizeStoryPartyImages(root);
}
async function openStoryScene(worldId,areaIndex=0,layout='default',extras=[]){
  const sc=$('#storyScene'),bg=storySceneBg(worldId,areaIndex),underParty=$('#adventureParty'),advScreen=$('#adventureScreen');
  setImage($('#adventureBg'),bg.bg,bg.fallback);$('#fieldEvent').hidden=true;
  if(advScreen)advScreen.classList.add('story-event-active');if(underParty)underParty.hidden=true;setAdventureVisualLoading(true);
  [...sc.classList].filter(c=>c.startsWith('story-world-')).forEach(c=>sc.classList.remove(c));sc.classList.remove('closing','shake','story-layout-party-left');sc.classList.add(`story-world-${worldId}`);if(layout==='partyLeftGuestRight')sc.classList.add('story-layout-party-left');
  storySceneExtras=Array.isArray(extras)?extras.filter(Boolean):[];
  $('#storyGuest').hidden=true;$('#storyGuestGroup').hidden=true;$('#storyGuestGroup').innerHTML='';$('#storyBubble').hidden=true;$('#storyNarration').hidden=true;storyTapResolve=null;
  // Layout and decode first while invisible so a raw PNG can never flash at native size.
  sc.hidden=false;sc.style.visibility='hidden';await renderStoryParty();await nextPaint();sc.style.visibility='visible';setAdventureVisualLoading(false);await fixedDelay(240);
}
async function closeStoryScene(forceHome=false){
  const sc=$('#storyScene');sc.classList.add('closing');storyTapResolve=null;await fixedDelay(350);sc.hidden=true;sc.style.visibility='';[...sc.classList].filter(c=>c.startsWith('story-world-')).forEach(c=>sc.classList.remove(c));sc.classList.remove('closing','shake','story-layout-party-left');$('#storyGuest').hidden=true;$('#storyGuestGroup').hidden=true;$('#storyGuestGroup').innerHTML='';$('#storyBubble').hidden=true;$('#storyNarration').hidden=true;$('#storyPartyLine').innerHTML='';storySceneExtras=[];
  const advScreen=$('#adventureScreen');if(advScreen)advScreen.classList.remove('story-event-active');const underParty=$('#adventureParty');if(underParty)underParty.hidden=false;
  if(forceHome){await goHome();}else{renderAdventure();showScreen('adventure');}
}
function storyAnchor(key){return $(`[data-story-actor="${key}"]`,$('#storyScene'))||($('#storyGuest').dataset.storyActor===key?$('#storyGuest'):null);}
function storyAnchorRect(anchor){
  if(!anchor)return null;
  const img=anchor.matches?.('img')?anchor:anchor.querySelector?.('img.size-ready,img:not(.asset-missing)');
  const target=(img&&img.getBoundingClientRect().width>0)?img:anchor;
  return target.getBoundingClientRect();
}
function setStorySpeaking(key,on){$$('.story-party-actor,.story-guest-multi',$('#storyScene')).forEach(el=>el.classList.toggle('speaking',on&&el.dataset.storyActor===key));const g=$('#storyGuest');g.classList.toggle('speaking',!!(on&&g.dataset.storyActor===key));}
async function storySayLine(key,line,displayName=null,anchorKey=null){
  const info=storyActorInfo(key),bubble=$('#storyBubble'),anchor=storyAnchor(anchorKey||key);
  $('#storySpeaker').textContent=displayName||info.name||'???';$('#storyText').textContent=line;
  // One source-script line = one bubble. Keep short lines compact, but cap width on phones.
  const visualChars=Math.max(String(line||'').length,String(displayName||info.name||'').length);
  bubble.style.width=`${clamp(132+Math.max(0,visualChars-5)*10,156,300)}px`;
  bubble.hidden=false;bubble.classList.remove('show','no-arrow');setStorySpeaking(anchorKey||key,true);
  await nextPaint();const scene=$('#storyScene').getBoundingClientRect(),br=bubble.getBoundingClientRect();let left=(scene.width-br.width)/2,top=scene.height*.18;
  if(anchor){
    const ar=storyAnchorRect(anchor),cx=ar.left-scene.left+ar.width/2;
    left=clamp(cx-br.width/2,8,scene.width-br.width-8);
    /* Point to the actual character art. If there is no room above, place the bubble just above the lower UI, never over a distant enemy. */
    top=clamp(ar.top-scene.top-br.height-10,66,scene.height-br.height-34);
    bubble.style.setProperty('--arrow-x',`${clamp(cx-left,22,br.width-22)}px`);
  }else bubble.classList.add('no-arrow');
  bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;await nextPaint();bubble.classList.add('show');
  await storyAdvanceWait();bubble.classList.remove('show');setStorySpeaking(anchorKey||key,false);await fixedDelay(500);bubble.hidden=true;
}
async function storySay(key,text,displayName=null,anchorKey=null){
  const lines=String(text??'').split(/\r?\n/).filter(line=>line.length>0);
  if(!lines.length)lines.push('');
  for(const line of lines)await storySayLine(key,line,displayName,anchorKey);
}
async function storySayRed(key,text,displayName=null,anchorKey=null){
  const bubble=$('#storyBubble');bubble?.classList.add('story-bubble-danger');
  try{await storySay(key,text,displayName,anchorKey);}finally{bubble?.classList.remove('story-bubble-danger');}
}
async function storyNarrate(text){const box=$('#storyNarration');$('#storyNarrationText').textContent=text;box.hidden=false;await nextPaint();box.classList.add('show');await storyAdvanceWait();box.classList.remove('show');await fixedDelay(500);box.hidden=true;}
async function storyShowGuest(key,opt={}){const g=$('#storyGuest'),img=$('#storyGuestImg'),info=storyActorInfo(key),duplicate=storyAnchor(key);g.dataset.storyActor=key;g.className='story-guest';g.classList.add(info.player?'story-guest-player':'story-guest-enemy');if(!info.player){g.classList.add(`story-enemy-${storyEnemyScaleKind(info)}`);if(info.winged)g.classList.add('story-enemy-winged');}if(opt.side==='right')g.classList.add('side-right');else if(opt.side==='left')g.classList.add('side-left');if(duplicate&&duplicate!==g){duplicate.classList.add('guest-duplicate-hidden');g.dataset.hiddenPartyActor=key;}else delete g.dataset.hiddenPartyActor;g.hidden=false;$('#storyGuestFallback').textContent=info.symbol||'?';await readyStoryImage(img,info.image);applyStoryGuestNaturalSize(g,img,info);if(opt.slow)g.classList.add('fade-slow');g.classList.add('visible');if(opt.drop){g.classList.add('drop');$('#storyScene').classList.add('shake');}await fixedDelay(opt.drop?760:(opt.slow?1050:520));g.classList.remove('drop');$('#storyScene').classList.remove('shake');await fixedDelay(500);}
async function storyHideGuest(){const g=$('#storyGuest'),hiddenKey=g.dataset.hiddenPartyActor;g.classList.remove('visible');await fixedDelay(520);g.hidden=true;g.dataset.storyActor='';if(hiddenKey){const a=$(`[data-story-actor="${hiddenKey}"]`,$('#storyScene'));a?.classList.remove('guest-duplicate-hidden');delete g.dataset.hiddenPartyActor;}}
async function storyShowGuests(keys=[],opt={}){
  await storyHideGuest().catch(()=>{});
  const group=$('#storyGuestGroup'),ids=(keys||[]).filter(Boolean).slice(0,4);if(!ids.length)return;
  group.hidden=false;group.className='story-guest-group';group.dataset.count=String(ids.length);group.innerHTML=ids.map(key=>{const info=storyActorInfo(key),kind=info.player?'player':storyEnemyScaleKind(info),winged=info.winged?' story-enemy-winged':'';return `<div class="story-guest-multi story-multi-${kind}${winged}" data-story-actor="${key}"><img src="${info.image||''}" alt="${info.name}"><span>${info.symbol||'敵'}</span></div>`;}).join('');
  bindImages(group);
  await Promise.all($$('.story-guest-multi',group).map(async holder=>{const img=$('img',holder),key=holder.dataset.storyActor,info=storyActorInfo(key),src=img?.getAttribute('src');if(!src)return;try{await preloadAsset(src,'high');if(img.decode)await img.decode();}catch(_){}if(img.naturalWidth){img.classList.add('size-ready');applyStoryGuestNaturalSize(holder,img,info,{multi:true});}else img.classList.add('asset-missing');}));
  await nextPaint();group.classList.add('visible');await fixedDelay(opt.slow?950:520);await fixedDelay(500);
}
async function storyHideGuests(){const group=$('#storyGuestGroup');if(group.hidden)return;group.classList.remove('visible');await fixedDelay(480);group.hidden=true;group.innerHTML='';group.dataset.count='0';}
async function storyExclaim(key){const g=$('#storyGuestMark');if($('#storyGuest').dataset.storyActor===key){g.hidden=false;void g.offsetWidth;await fixedDelay(700);g.hidden=true;}else{const a=storyAnchor(key);if(a){const mark=document.createElement('i');mark.className='story-mark';mark.textContent='!';a.appendChild(mark);await fixedDelay(700);mark.remove();}}await fixedDelay(500);}
async function storyFlash(){const f=$('#storyFlash');f.classList.remove('play');void f.offsetWidth;f.classList.add('play');await fixedDelay(460);f.classList.remove('play');await fixedDelay(500);}
async function storyImpact(text='ドン！ッ',dodge=false){if(dodge){const acts=$$('.story-party-actor',$('#storyPartyLine'));acts.forEach((a,i)=>a.classList.add(i%2?'dodge-right':'dodge-left'));}const sc=$('#storyScene'),el=$('#storyImpact');el.textContent=text;el.hidden=false;sc.classList.add('shake');el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await fixedDelay(720);sc.classList.remove('shake');el.hidden=true;el.classList.remove('play');$$('.story-party-actor',$('#storyPartyLine')).forEach(a=>a.classList.remove('dodge-left','dodge-right'));await fixedDelay(500);}
async function storySayDual(keyA,lineA,keyB,lineB){
  const scene=$('#storyScene'),make=(key,line)=>{const info=storyActorInfo(key),anchor=storyAnchor(key),b=document.createElement('div');b.className='story-bubble story-bubble-temp';b.innerHTML=`<b></b><p></p>`;b.querySelector('b').textContent=info.name;b.querySelector('p').textContent=line;b.style.width=`${clamp(150+String(line||'').length*7,168,250)}px`;scene.appendChild(b);return{b,anchor,key};};
  const items=[make(keyA,lineA),make(keyB,lineB)];await nextPaint();const sr=scene.getBoundingClientRect();for(const it of items){const br=it.b.getBoundingClientRect(),ar=it.anchor?.getBoundingClientRect();let left=(sr.width-br.width)/2,top=sr.height*.18;if(ar){const cx=ar.left-sr.left+ar.width/2;left=clamp(cx-br.width/2,6,sr.width-br.width-6);top=clamp(ar.top-sr.top-br.height-14,52,sr.height-br.height-20);it.b.style.setProperty('--arrow-x',`${clamp(cx-left,20,br.width-20)}px`);}else it.b.classList.add('no-arrow');it.b.style.left=`${left}px`;it.b.style.top=`${top}px`;setStorySpeaking(it.key,true);it.b.classList.add('show');}
  // If both bubbles overlap, separate them horizontally while keeping each arrow aimed at its speaker.
  const [a,b]=items.map(x=>x.b.getBoundingClientRect());if(!(a.right+4<b.left||b.right+4<a.left)){items[0].b.style.left='6px';items[1].b.style.left=`${Math.max(6,sr.width-items[1].b.offsetWidth-6)}px`;}
  await storyAdvanceWait();for(const it of items){it.b.classList.remove('show');setStorySpeaking(it.key,false);}await fixedDelay(500);items.forEach(it=>it.b.remove());
}

async function storySoftLight(){
  const scene=$('#storyScene');if(!scene)return;
  const el=document.createElement('div');el.className='story-soft-light';scene.appendChild(el);
  await nextPaint();el.classList.add('show');await fixedDelay(220);el.classList.remove('show');await fixedDelay(260);el.remove();
}
async function storyTransformGuest(toKey){
  await storyHideGuest();await storySoftLight();await storyShowGuest(toKey,{slow:true});
}
async function storyEnergyTransfer(fromKey,toKey){
  const scene=$('#storyScene'),from=storyAnchor(fromKey),to=storyAnchor(toKey);if(!scene||!from||!to){await storySoftLight();return;}
  const sr=scene.getBoundingClientRect(),fr=storyAnchorRect(from),tr=storyAnchorRect(to),orb=document.createElement('i');
  orb.className='story-energy-orb';orb.style.left=`${fr.left-sr.left+fr.width/2}px`;orb.style.top=`${fr.top-sr.top+fr.height*.45}px`;scene.appendChild(orb);
  await nextPaint();orb.style.setProperty('--orb-x',`${tr.left-fr.left+(tr.width-fr.width)/2}px`);orb.style.setProperty('--orb-y',`${tr.top-fr.top+(tr.height-fr.height)*.45}px`);orb.classList.add('move');
  await fixedDelay(1250);orb.remove();
}
async function storyDarkEnergyTransfer(fromKey,toKey){
  const scene=$('#storyScene'),from=storyAnchor(fromKey),to=storyAnchor(toKey);if(!scene||!from||!to)return;
  const sr=scene.getBoundingClientRect(),fr=storyAnchorRect(from),tr=storyAnchorRect(to),orb=document.createElement('i');
  orb.className='story-energy-orb story-energy-dark';orb.style.left=`${fr.left-sr.left+fr.width/2}px`;orb.style.top=`${fr.top-sr.top+fr.height*.45}px`;scene.appendChild(orb);
  await nextPaint();orb.style.setProperty('--orb-x',`${tr.left-fr.left+(tr.width-fr.width)/2}px`);orb.style.setProperty('--orb-y',`${tr.top-fr.top+(tr.height-fr.height)*.45}px`);orb.classList.add('move');
  await fixedDelay(1350);orb.remove();
}
async function storyDarkGlowGuest(){const g=$('#storyGuest');if(!g||g.hidden)return;g.classList.add('story-dark-glow');await fixedDelay(820);g.classList.remove('story-dark-glow');}
async function storyFadeActor(key){const a=storyAnchor(key);if(!a)return;a.classList.add('story-faded-out');await fixedDelay(620);}
async function storyFadePartyExcept(key){
  const root=$('#storyPartyLine');if(!root)return;for(const a of $$('.story-party-actor',root))if(a.dataset.storyActor!==key)a.classList.add('story-faded-out');await fixedDelay(620);
}
function storyJoinSilent(id){storyJoin(id);}
async function storyRewardDrink(id,text){addDrink(String(id),1);await storyNarrate(text||`${DRINK_SETS.find(d=>d.id===String(id))?.name||'ドリンクセット'}を1つ手に入れた！`);}
async function enemyStoryCutin(e,text,duration=1750){
  if(!e)return;await passiveCutin({id:`enemy-story-${e.id}`,image:e.image,name:e.name,transformed:false},`${e.name}\n${text}`,Math.max(1750,Number(duration)||0));
}
async function allyStoryCutin(id,text,duration=1750){
  const a=allyById(id)||player(id);if(!a){await actionCutin(text,'system',Math.max(1750,Number(duration)||0));return;}
  await passiveCutin({id:`ally-story-${a.id}`,image:a.image,name:a.name,transformed:!!a.transformed},`${a.name}\n${text}`,Math.max(1750,Number(duration)||0));
}
async function checkBattleHpDialogue(){
  const b=state.battle;if(!b||b.finished)return;b.storyHpFlags=b.storyHpFlags||{};
  const neo=(b.enemies||[]).find(e=>e.id==='boss-neomaster'&&e.hp>0);
  if(neo){
    const rate=neo.hp/Math.max(1,neo.maxHp);
    if(rate<=.70&&!b.storyHpFlags.neo70){b.storyHpFlags.neo70=true;await enemyStoryCutin(neo,'やりますね\nではギアを上げますよ',920);}
    if(rate<=.40&&!b.storyHpFlags.neo40){b.storyHpFlags.neo40=true;await enemyStoryCutin(neo,'なるほど\nこれは強力だ・・',920);}
  }
  const gladi=(b.enemies||[]).find(e=>e.id==='boss-gladi'&&e.hp>0);
  if(gladi){const rate=gladi.hp/Math.max(1,gladi.maxHp);if(rate<=.70&&!b.storyHpFlags.gladi70){b.storyHpFlags.gladi70=true;await enemyStoryCutin(gladi,'いいぞ\n闘いはこうでなくてはな',1050);}if(rate<=.50&&!b.storyHpFlags.gladi50){b.storyHpFlags.gladi50=true;b.gladiSpecialReady=true;await enemyStoryCutin(gladi,'認めよう\nお前たちは強者だ！',1050);await actionCutin('次のターン、グラビディ・グラディエーターが来る！','danger',900);}}
  const karami=(b.enemies||[]).find(e=>e.id==='d2-mirakarami');
  if(karami&&karami.hp>0&&karami.hp/Math.max(1,karami.maxHp)<=.50&&!b.storyHpFlags.d2Karami50){
    b.storyHpFlags.d2Karami50=true;
    await enemyStoryCutin(karami,'やるじゃねえか！\n燃えてきたぜ！',920);
    karami.atkBuff=.20;karami.atkBuffTurns=99;karami.defBuff=.20;karami.defBuffTurns=99;fx('buff',`enemy:${karami.uid}`);
    await actionCutin('モブミラカラミのATKとDEFが20%アップした！','buff',760);
  }
  const earth=(b.enemies||[]).find(e=>e.id==='d2-miraearth');
  if(earth&&earth.hp>0&&earth.hp/Math.max(1,earth.maxHp)<=.50&&!b.storyHpFlags.d2Earth50){
    b.storyHpFlags.d2Earth50=true;
    await enemyStoryCutin(earth,'小賢しいガキ共だ\n踏みつぶしてくれる！',920);
    earth.atkBuff=.20;earth.atkBuffTurns=99;earth.defBuff=.20;earth.defBuffTurns=99;fx('buff',`enemy:${earth.uid}`);
    await actionCutin('モブミラアースのATKとDEFが20%アップした！','buff',760);
  }
  if(karami&&karami.hp<=0&&!b.storyHpFlags.d2KaramiDown){b.storyHpFlags.d2KaramiDown=true;await enemyStoryCutin(karami,'くそ・・俺がやられるとはな・・',800);}
  if(earth&&earth.hp<=0&&!b.storyHpFlags.d2EarthDown){b.storyHpFlags.d2EarthDown=true;await enemyStoryCutin(earth,'貴様ら如きにこの私が!!',800);}
}

function storyJoin(id){if(state.party.some(x=>x[0]===id))return;const avg=state.party.length?Math.round(state.party.reduce((s,x)=>s+(Number(x[1])||5),0)/state.party.length):5;state.party.push([id,clamp(avg,5,120)]);if(state.meta?.exp&&state.meta.exp[id]==null)state.meta.exp[id]=0;saveParty();saveMeta();state.training.party=state.party.map(x=>[...x]);}
async function storyJoinStep(id,message){await storyHideGuest();storyJoin(id);await renderStoryParty();await storyNarrate(message||`${player(id)?.name||id}が仲間に加わった！`);}
async function storyTempActor(id){
  const p=player(id);if(!p)return;
  const guest=$('#storyGuest');
  if(guest?.dataset.storyActor===canonicalPlayerId(id))await storyHideGuest();
  await renderStoryParty(id);
}
async function renderStoryPartyWithTemp(tempId){await renderStoryParty(tempId);}
async function storyJoinKeepGuest(id,message){storyJoin(id);await renderStoryParty();await storyNarrate(message||`${player(id)?.name||id}が仲間に加わった！`);}


function normalizeLilithSplit(){const roster=state.party.map(x=>[x[0],Number(x[1])||5]);let saved=state.meta?.lilithSplit;if(saved&&Array.isArray(saved.A)&&Array.isArray(saved.B)){const valid=new Set(roster.map(x=>x[0])),used=new Set(),clean=a=>(a||[]).filter(x=>valid.has(x[0])&&!used.has(x[0])&&used.add(x[0])).map(x=>{const row=roster.find(r=>r[0]===x[0]);return row?[...row]:null;}).filter(Boolean);const A=clean(saved.A),B=clean(saved.B);for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);if(A.length&&B.length)return{A,B};}
  const A=[],B=[];roster.forEach((row,i)=>(i%2?B:A).push([...row]));if(!B.length&&A.length>1)B.push(A.pop());return{A,B};
}
function renderLilithSplitOverlay(root,split){const roster=state.party.map(x=>[x[0],Number(x[1])||5]),teamOf=id=>split.A.some(x=>x[0]===id)?'A':'B';root.innerHTML=`<div class="lilith-split-card"><div class="settings-head"><div><small>PARTY SPLIT</small><h2>パーティーを2つ作ってください</h2></div></div><div class="lilith-opponents"><div><b>Aパーティー</b><span>モブリリス / モブヘルリリス / モブキリンリリス</span></div><div><b>Bパーティー</b><span>モブクフリリス / モブリヴァリリス</span></div></div><p>キャラクターをタップするとA/Bを移動します。</p><div class="lilith-split-roster">${roster.map(([id,lv])=>{const q=player(id),team=teamOf(id);return`<button type="button" data-lilith-member="${id}" class="team-${team.toLowerCase()}"><em>${team}</em><img src="${versionedPlay(q.image)}" alt="${q.name}"><b>${q.name}</b><small>Lv${lv}</small></button>`;}).join('')}</div><div class="lilith-team-count"><span>A ${split.A.length}人</span><span>B ${split.B.length}人</span></div><button type="button" class="primary-btn" data-lilith-confirm>このパーティーで挑む</button></div>`;bindImages(root);}
async function chooseLilithSplit(){let overlay=document.querySelector('#lilithSplitOverlay');if(!overlay){overlay=document.createElement('div');overlay.id='lilithSplitOverlay';overlay.className='lilith-split-overlay';document.body.appendChild(overlay);}const split=normalizeLilithSplit();overlay.hidden=false;renderLilithSplitOverlay(overlay,split);return await new Promise(resolve=>{const bind=()=>{$$('[data-lilith-member]',overlay).forEach(btn=>btn.onclick=()=>{const id=btn.dataset.lilithMember,from=split.A.some(x=>x[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');const i=from.findIndex(x=>x[0]===id);to.push(from.splice(i,1)[0]);renderLilithSplitOverlay(overlay,split);bind();});$('[data-lilith-confirm]',overlay).onclick=async()=>{if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');const ans=await dialog('このパーティーで挑みますか？',[['はい','yes','primary'],['いいえ','no']],'PARTY SPLIT');if(ans!=='yes')return;state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)};saveMeta();overlay.hidden=true;resolve(state.meta.lilithSplit);};};bind();});}
function currentLilithSplit(){const v=state.meta?.lilithSplit;return v&&Array.isArray(v.A)&&Array.isArray(v.B)&&v.A.length&&v.B.length?v:null;}
function switchBattleToLilithPartyA(){const b=state.battle,split=b?.config?.lilithSplit;if(!b||!split?.A?.length)return;persistAdventureVitalsFor(b.allies||[]);const vitals=state.adventure.vitals||{},allies=split.A.map(([id,lv])=>buildAlly(player(id),lv,vitals[id])).filter(Boolean);for(const a of allies)initUltimateCooldowns(a);b.allies=allies;b.mainIds=allies.slice(0,4).map(a=>a.id);b.superIds=allies.slice(4,6).map(a=>a.id);b.reserveIds=allies.slice(6,10).map(a=>a.id);b.queue=[];b.queuePos=0;}

const STORY_EVENTS={
  'arrival:desert':{worldId:'desert',area:0,layout:'partyLeftGuestRight',steps:[
    ['say','pink','ケホッ、ケホッ、\n凄い砂埃ですね、、\nん？\n誰か来ますよ！'],['guestRight','desert'],['say','desert','旅人か？\n今はやめておけ'],['say','pink','僕たちは国王の命令で\n魔王を倒すべく旅をしているのであります！'],['say','desert','なおさらやめておけ\nやつらの力は強大だ\nたった2人で何が出来る？'],['say','pink','ふぅ、、\nこのお方は勇者様です‼︎'],['say','desert','・・・勇者？\nそんなはずは、、'],['exclaim','desert'],['say','desert','いや、間違いなく勇者だ'],['say','pink','その通り！あなた見る目ありますねー！'],['say','desert','こんな日が来るとはな\nいいだろう\n俺も同行する'],['say','pink','大変ありがたいです！\nここのボスはミラモブと聞いています\n早速案内してください！'],['say','desert','やつは強い\nだが勇者ならあるいわ'],['join','desert','モブデザートが仲間に加わった！']
  ]},
  'pre:desert':{worldId:'desert',area:3,steps:[
    ['guest','mira'],['say','mira','何者だ？'],['say','desert','久しぶりだな、ミラモブ'],['say','mira','モブデザートか\n今更何をしに来た？\n王位にも就けず、魔物にもなれない半端者が'],['say','desert','用があるのは私ではない\nまあ、私もなくはないのだがな'],['say','pink','やいやいやい！\nやいやーい！'],['say','mira','なんだそのゴミは？'],['say','pink','ゴ、ゴミ、、'],['say','desert','そいつはいいとして\nもう1人を見てみろ'],['say','mira','こいつは・・'],['say','pink','このお方は勇者様だぞ！\n強いのだぞ！'],['say','mira','なるほど\nお前が強気に出られる理由はこれか\nこの私も\n舐められたものだ！'],['say','desert','来るぞ！']
  ]},
  'post:desert':{worldId:'desert',area:3,forceHome:true,steps:[
    ['say','pink','はあ、はあ、\n強すぎであります、、'],['say','desert','しかし、討伐成功だ\n見ろ\nこれがミラモブのレコード\nガラガラの旅 だ'],['narrate','7つのレコードの1つ、ガラガラの旅を手に入れた！'],['say','pink','これで2枚目であります！\n次は田舎町を目指します！'],['say','desert','海底への入り口か\n懐かしいな']
  ]},
  'arrival:rural':{worldId:'rural',area:0,steps:[
    ['say','pink','すぅ〜\nはぁ〜\n空気が美味しいですねー'],['say','desert','砂漠とは大違いだな\n奇妙な建物が多いが、悪くない'],['sayOff','???','どけどけどけー！でやんすー！'],['say','pink','な、なんですか⁉︎'],['guestDrop','denden','ドン！ッ'],['say','denden','いててて、、','???'],['say','desert','なんだこいつは？'],['say','pink','大丈夫ですか？'],['say','denden','あいやー\nご心配感謝ですやんす！\nオイラはモブデンデン！\nこんな時に観光とは珍しいでやんすねー'],['say','pink','観光ではありません！\n僕たちは勇者と仲間達！\n魔王を倒すため旅をしてるのであります！'],['say','desert','勇者と仲間達、、'],['say','denden','ほぅー！\nカッコいいでやんすねー\n勇者様にお会い出来るなんて\n感激でやんす！'],['say','pink','やんすさんは、\nこの辺り詳しいのですか？'],['say','denden','もちろん！\nこの辺りは庭でやんす！'],['say','desert','やんすさん..？'],['say','pink','ここのボスは\nモブガーディアンですね？\n討伐に協力していただきたい！'],['say','denden','ほぅー！\nオイラはとある国の\n護衛隊長をやっていたでやんす！'],['say','desert','そうなのか？'],['say','denden','勇者様のためなら\n一肌脱ぐでやんす！'],['join','denden','モブデンデンが仲間に加わった！']
  ]},
  'pre:rural':{worldId:'rural',area:3,steps:[
    ['guest','guardian'],['say','guardian','ガオォォォォー‼︎'],['say','denden','ライオンでやんすーーー‼︎'],['say','pink','いや、怪獣でありますーーー‼︎'],['say','guardian','・・・・・・。'],['say','desert','勇者よ、お前も苦労しているな'],['say','guardian','我の持つレコードが狙いだな？\n受けて立つ！'],['say','denden','風穴開けてやるでやんす！']
  ]},
  'post:rural':{worldId:'rural',area:3,steps:[
    ['say','pink','やりましたー！'],['say','desert','こいつも強敵だったな'],['say','denden','ガーディアンの名にふさわしい強さでやんす\nあと、たぶん根は悪いやつじゃなかったでやんす・・・。'],['say','desert','それが、お前が護衛隊長を辞めた理由か？'],['say','denden','だけ、ではないでやんす\n魔王は平和を乱す悪党でやんすから'],['narrate','3つめのレコード「案山子と小麦」を手に入れた！']
  ]},
  'arrival:neon':{worldId:'neon',area:0,steps:[
    ['say','denden','なんだかチカチカするでやんす・・'],['say','pink','ネオン街ですからね'],['say','desert','不思議な魔力をいくつか感じる'],['say','denden','味方だといいでやんすねー'],['sayOff','???','もらったー‼︎'],['say','desert','避けろ‼︎'],['flash'],['guestSlow','money'],['say','money','あれ？\nあなた達誰？'],['say','denden','人を攻撃しておいて何を言ってるでやんすか！'],['say','money','え？人？'],['say','desert','また面倒なやつが来たものだ'],['say','money','私はモブマニー！\n長年魔王に封印されていたの\nなぜか解放されて外に出てみたら\nすっかり街の雰囲気が変わってしまったの！'],['say','pink','どれくらい封印されていたのでありますか？'],['say','money','う〜ん\n分からない！'],['say','desert','ではなぜ封印されていた？'],['say','money','う〜ん\nう〜ん\n思い出せない・・'],['say','denden','まあ敵の敵は味方でやんす！\n一緒に魔王を倒すでやんす‼︎'],['say','money','えー\nあなたとー？'],['say','pink','いやいやいや\nこちらの方を見るであります！'],['say','money','ん？'],['say','pink','このお方は勇者様であります！'],['say','money','勇者？\n誰が？'],['say','pink','だ・か・ら！\nこのお方であります‼︎'],['say','money','ふーん\nなんか迫力ないわね\nまあいいわ！\n目的は同じだから協力しましょう！'],['join','money','モブマニーが仲間に加わった！']
  ]},
  'pre:neon':{worldId:'neon',area:3,steps:[
    ['guest','neonBoss'],['say','money','あなたがここのボス？\n前のボスよりイカついわね・・'],['say','desert','気を付けろ\n強力な魔力を感じる'],['say','denden','油断大敵でやんす！'],['say','neonBoss','お前たちは間違っている\n魔王様は秩序を保っている\nお前たちは守られているのだ'],['say','pink','どんな理由でも\nあの町の住人は帰ってこない・・！'],['say','neonBoss','平和に犠牲はつきものだ\nあの町は・・'],['say','denden','問答無用でやんす！'],['say','money','レコードはいただくわよ！']
  ]},
  'post:neon':{worldId:'neon',area:3,custom:'neonPost'},
  'arrival:magma':{worldId:'magma',area:0,steps:[
    ['say','denden','暑いでやんすー\nオイラ暑いの嫌いでやんすー'],['say','money','うるさいわね\nこっちまで暑くなるじゃない！'],['say','desert','砂漠も暑いが、ここはもっと過酷だな'],['say','pink','ここでも誰か案内してくれると良いのですが'],['say','money','そんな都合よく・・'],['guestDropDodge','nyoro','ドン！ッ'],['say','nyoro','おー・・\n痛いニョロ・・'],['say','pink','あなたさてはここに詳しいですね！'],['say','money','ボスのところに案内しなさい！'],['say','nyoro','ニョロ！？'],['say','denden','まあ待つでやんす'],['sayDual','money','お前が言うな！！','pink','お前が言うな！！（であります）'],['say','desert','俺が事情を説明しよう'],['narrate','モブニョロに事情を説明した'],['say','nyoro','お～！勇者様！\nお会いできて嬉しいニョロ！'],['say','desert','ここのボスはどんなやつだ？'],['say','nyoro','恐ろしいドラゴンニョロ・・'],['say','denden','ドラゴンニョロ・・\n変な名前でやんす'],['say','desert','気にせず続けてくれ'],['say','nyoro','先代の王モブフェニックス様との死闘は\nそりゃ～凄かったニョロ\nでも結局最後はモブドラゴンが勝ったニョロ\nそれからというもの、\n魔王軍が住みついて大変ニョロ・・'],['say','pink','どこも同じでありますね・・'],['say','denden','ドラゴンか\n会ってみたいでやんすね！'],['join','nyoro','モブニョロが仲間に加わった！']
  ]},
  'pre:magma':{worldId:'magma',area:3,steps:[
    ['guest','dragon'],['say','dragon','私に何か用か？'],['say','money','想像以上にドラゴンね・・！'],['say','denden','かっけえでやんす！'],['say','pink','これは手ごわいですよ・・！'],['say','dragon','目障りなやつらだ\n命惜しくば立ち去れ'],['say','desert','風格もさすがだな\nだが、去るわけにはいかん'],['say','nyoro','やるしかないニョロね！'],['say','dragon','手加減はせぬぞ！！']
  ]},
  'post:magma':{worldId:'magma',area:3,steps:[
    ['say','desert','はあ、はあ、'],['say','money','み、みんな無事？'],['say','denden','暑いでやんす・・'],['say','pink','強敵でありましたね'],['say','nyoro','でも、勝ったニョロ！\n信じられないニョロ！'],['narrate','5つ目のレコードを手に入れた！']
  ]},
  'arrival:sea':{worldId:'sea',area:0,steps:[
    ['say','nyoro','うわー空が海ニョロ！'],['say','money','海底だからね'],['say','denden','おっかないお魚がたくさんでやんす！'],['say','desert','とにかく進んでみよう'],['say','pink','みなさん、警戒を怠らず！']
  ]},
  'pre:sea':{worldId:'sea',area:3,steps:[
    ['guest','nepu'],['say','nepu','待っていたぞ勇者よ'],['say','denden','でっかいお魚でやんす！'],['say','pink','し、失礼ですよ！'],['say','nepu','構わぬ\n王を前にしてその陽気さ\nお主のような戦士はきっと強くなる'],['say','denden','えへへ・・でやんす！'],['say','desert','敵意を感じないな\nお前は魔王の手下ではないのか？'],['say','nepu','海底の歴史は地上を遥かに凌駕する\n魔王軍とて簡単に手は出せん'],['say','desert','では全ての事情も知っているのか？'],['say','nepu','もちろんだ\nお前たちがレコードを求めていることもな'],['say','pink','では、是非お譲りいただけませんか？'],['say','nepu','それは構わぬ\nだが、\nその前にお前たちの力を見せてくれ'],['say','desert','当然の展開だな'],['say','nyoro','勝負だニョロー！']
  ]},
  'post:sea':{worldId:'sea',area:3,keepGuest:'nepu',steps:[
    ['guest','nepu'],['say','nepu','素晴らしい強さだ\nだが、魔王には遥に及ばない\n旅を続け、力をつけるのだ'],['say','pink','はい！'],['say','nepu','モブネコクー！\nこちらへ来るのだ！'],['sayOff','モブネコクー','はいはい！'],['tempActor','nekoku'],['say','nekoku','お呼びでしょうか国王様！'],['say','nepu','お前も彼らと旅をするのだ\nきっとお互いのためになる'],['say','nekoku','オラがですか！？\nうーん\n分かりました！\n精一杯頑張ります！'],['say','nyoro','ヘンテコな戦士だニョロ'],['say','nekoku','オラが言えたもんじゃねえが\nおめえも大概変だぞ'],['say','money','勇者パーティーとは思えないわね\nでもそれもいいんじゃない？'],['say','denden','仲間が増えたでやんす！'],['joinKeepGuest','nekoku','6枚目のレコード「ケロの衣装」を手に入れた！']
  ]}
 };

/* ===== v32 story expansion: 草原 / 草原Ⅱ / 部族村 ===== */
Object.assign(STORY_EVENTS,{
  'arrival:grassland':{worldId:'grassland',area:0,steps:[
    ['say','pink','いよいよ冒険の始まりですね！\nウキウキ、ワクワクであります！']
  ]},
  'pre:grassland:0':{worldId:'grassland',area:0,steps:[
    ['guest','g-savanna'],['say','pink','やや！\n手ごわいモンスターが出ましたよ！'],['say','pink','Areaを進むに中ボスを倒しましょう！']
  ]},
  'post:grassland:0':{worldId:'grassland',area:0,steps:[
    ['say','pink','さすがは勇者様であります！\n先へ進みましょう！']
  ]},
  'pre:grassland:1':{worldId:'grassland',area:1,steps:[
    ['guest','g-iwakiri'],['say','pink','見るからに危険ですね・・\n気を引き締めてかかりましょう！']
  ]},
  'pre:grassland:2':{worldId:'grassland',area:2,steps:[
    ['guest','g-axe'],['narrate','相手は1人ですが、\nそれだけ強力です！\n全力で挑みましょう！']
  ]},
  'pre:grassland:3':{worldId:'grassland',area:3,steps:[
    ['guest','boss-hawk'],['say','boss-hawk','来客とは珍しいな\n何者だ？'],['say','pink','我々は勇者パーティー！\nここにあるレコードを譲ってもらいたい！'],['say','boss-hawk','戯言を\n現代に勇者の名など通用しない\n早々に立ち去るがよい'],['say','pink','ぐぬぬ・・\nここまで来たら引けません！\n戦いましょう！'],['say','boss-hawk','覚悟だけは認めてやる\n来い！']
  ]},
  'post:grassland:3':{worldId:'grassland',area:3,steps:[
    ['say','pink','やはりボスは強いですね・・\nでもこれでレコード入手です！'],['narrate','1枚目のレコード「」を手に入れた！'],['say','pink','まずは王様に報告に行きましょう！']
  ]},

  'arrival:grassland2':{worldId:'grassland2',area:0,steps:[
    ['say','pink','この場所ももう懐かしいですね・・\n急ぎましょう\nモブホークと再び決戦です！']
  ]},
  'pre:grassland2:0':{worldId:'grassland2',area:0,steps:[
    ['guest','g2-tsuru'],['say','g2-tsuru','申し訳ないが、お帰りいただこうか'],['say','pink','そうはいかない！'],['say','denden','いざ勝負でやんす！']
  ]},
  'post:grassland2:0':{worldId:'grassland2',area:0,steps:[
    ['say','desert','同じ地だと思って油断しないことだな\nモブホークもきっと、\n強大な力を得ているだろう']
  ]},
  'pre:grassland2:1':{worldId:'grassland2',area:1,steps:[
    ['guest','g2-merakero'],['say','g2-merakero','メラメラメラーーー！'],['say','nyoro','気合い入っているニョロね・・！'],['say','nekoku','オラ、カエルは苦手だ']
  ]},
  'post:grassland2:1':{worldId:'grassland2',area:1,steps:[
    ['say','money','アツいカエルだったわね'],['say','denden','漢でやんした！']
  ]},
  'pre:grassland2:2':{worldId:'grassland2',area:2,steps:[
    ['guest','g2-keroking'],['say','g2-keroking','私はケロの王ケロキング！\nモブホーク様の命により\nお前たちをここで仕留める！'],['say','desert','受けて立つ！'],['say','pink','ここを倒せばもうすぐであります！\nみなさん頑張りましょう！']
  ]},
  'post:grassland2:2':{worldId:'grassland2',area:2,steps:[
    ['say','desert','さあ、先へ進もう'],['say','nyoro','キング、立派だったニョロ！']
  ]},
  'pre:grassland2:3':{worldId:'grassland2',area:3,steps:[
    ['guest','boss-hawk2'],['say','boss-hawk2','クククク・・・\nようやく来たな'],['say','pink','往生際が悪いであります！'],['say','money','あんた一度負けてるって聞いたよ？'],['say','nekoku','オラ焼き鳥大好きだ'],['say','boss-hawk2','勇者よ、お前を認め\n魔王様から力を得た\n新たな私の強さ\n受け止める勇気があるかな？'],['say','denden','みんな、構えるでやんす！']
  ]},
  'post:grassland2:3':{worldId:'grassland2',area:3,steps:[
    ['guest','boss-hawk2'],['say','boss-hawk2','貴様ら如きに・・・'],['hideGuest'],['say','pink','なんとか勝てました・・！'],['say','desert','レコードは手に入らないが、\n必要な戦いだったな'],['say','pink','王様に報告に行きましょう！']
  ]},

  'arrival:tribe':{worldId:'tribe',area:0,steps:[
    ['say','pink','なんだか不思議な雰囲気でありますね'],['say','nekoku','オラ初めて見る景色だ'],['say','denden','ビリビリしそうな香りがするでやんす'],['say','desert','で、そこのお前が案内でもしてくれるのか？'],['sayOff','???','あら、気が付いていたの？\n中々やるわね'],['guest','jessie'],['say','jessie','私はネオン街の保安官\n通報を受けてこの村に来たの\nモブジェシーよ\nよろしくね'],['say','money','ネオン街！？\n私も、私も！'],['say','jessie','知っているわ\nモブマニーでしょ？\n私を覚えてない？'],['say','money','うーん\n私、魔王に封印されてたから'],['say','jessie','本当にそう？'],['say','money','え？'],['say','jessie','まあ、いずれ分かるわ'],['say','desert','この村は、どういう村なんだ？'],['say','jessie','魔王軍と直接は関係ないわ\nただ、あの町と関係はあるの'],['say','pink','あの町と繋がりが！？'],['say','jessie','ええ\nネオン街、部族村\nこの2つがあの町と大きく関係がある'],['say','pink','詳しく知りたいであります！'],['say','jessie','それもまたいずれね\nとにかく\nこの村は危険がいっぱいよ\n手を貸してあげるから油断しないことね']
  ]},
  'pre:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[
    ['guest','t-kukuri'],['say','t-kukuri','タチサレ・・'],['say','pink','幹部の登場であります！'],['say','denden','気合い入れるでやんす！']
  ]},
  'post:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[
    ['say','money','不気味だったわね・・'],['say','jessie','あなたたちも十分不気味よ'],['say','money','そういう意味じゃないわよ！'],['say','nyoro','喧嘩はやめるニョロ～！']
  ]},
  'pre:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[
    ['guest','t-tough'],['say','t-tough','全く、大変な時に来たね君たち'],['say','pink','まともそうな人であります！'],['say','desert','そんなはずがないだろう'],['say','t-tough','まともかはともかく\n俺は連中とは違うよ'],['say','jessie','そう？\n危ないやつにしか出せないオーラよ'],['say','t-tough','これはこれは保安官\n大人しく影に隠れていてはどうですか？'],['say','jessie','あなた・・'],['say','nekoku','ん？'],['say','t-tough','まあお喋りはこれくらいにして\nやりますか\n他に道はないだろう？']
  ]},
  'post:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[
    ['say','nyoro','強かったニョロ・・'],['say','denden','この村はみんな強いでやんす'],['say','jessie','さあ、しっかり休んで先へ行きましょう']
  ]},
  'pre:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[
    ['guests',['t-hisui','t-ryugo']],['say','t-hisui','天よ・・こやつらに災いを'],['say','t-ryugo','もてなすぞ、客人'],['say','nekoku','強そうな2人だなー'],['say','money','みんな最初から飛ばしていくわよ！']
  ]},
  'post:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[
    ['say','jessie','おかしい・・'],['say','desert','どうした？'],['say','jessie','この2人はこの村の長だったはず'],['say','money','なんで戦う前に言わないのよ！'],['say','jessie','腰が引けちゃうでしょ？'],['say','nyoro','それはそうだニョロ'],['say','desert','ということは\nさらに上がいるということか'],['say','jessie','そうなるわね'],['say','pink','大丈夫！\n力を合わせて進むであります！\n・・・・\nあります！'],['say','jessie','すっかり怖がっちゃって・・'],['say','denden','でも進むしかないでやんす！']
  ]},
  'pre:tribe:3':{worldId:'tribe',area:3,extras:['jessie'],steps:[
    ['guests',['boss-debuff','boss-berserk']],['say','boss-debuff','・・・・'],['say','boss-berserk','・・・・'],['say','jessie','もはや言葉すらないのね'],['say','denden','これが魔王の魔力でやんすか・・'],['say','nyoro','こ、怖いニョロ・・'],['say','money','うー・・\nさっさとやるわよ！'],['say','desert','やつらの力\n歴戦の魔王たちと近いものを感じる\n力を合わせ、全員で戦うぞ！'],['say','denden','もちろんでやんす！']
  ]},
  'post:tribe:3':{worldId:'tribe',area:3,extras:['jessie'],steps:[
    ['say','jessie','任務完了'],['say','desert','魔王とは、\n一体どこまで・・'],['say','pink','とりあえず王様に報告です！\nどうやらここにレコードは無いようです'],['say','jessie','私も行くわ\n魔王を倒さないと\n何も進まなそうだしね'],['say','nyoro','心強いニョロ！\nモブジェシー、強いニョロ！']
  ]}
});


/* ===== MOB QUEST v45 latest story overrides =====
   Source: 冒険のイベントとセリフと演出(2).txt
   Specific AREA keys override older AREA4-only events without changing completed-save flags outside those keys. */
Object.assign(STORY_EVENTS,{
  'pre:desert:0':{worldId:'desert',area:0,steps:[
    ['guest','d-sharty'],['say','pink','砂漠らしいモンスターが出ましたよ！'],['say','pink','魔法に注意して戦うであります！']
  ]},
  'post:desert:0':{worldId:'desert',area:0,steps:[
    ['say','desert','なかなかやるな'],['say','pink','まだまだ、\nこんなもんじゃないであります！']
  ]},
  'pre:desert:1':{worldId:'desert',area:1,steps:[
    ['guest','d-poison'],['say','pink','ミ、ミラモブ！？'],['say','desert','よく見ろ\n全く別のモンスターだ'],['say','pink','なんと！\n騙しましたねー！'],['say','desert','・・・・']
  ]},
  'post:desert:1':{worldId:'desert',area:1,steps:[
    ['say','desert','見た目だけ真似ても\n強さを得ることは出来ない']
  ]},
  'pre:desert:2':{worldId:'desert',area:2,steps:[
    ['guests',['d-deathhead','d-deathhead']],['say','desert','やっかいなモンスターが出たな'],['say','pink','これは強そうであります！'],['say','desert','ミラモブまであと少しだ\nここで立ち止まるわけにはいかない']
  ]},
  'post:desert:2':{worldId:'desert',area:2,steps:[
    ['say','pink','不思議なモンスターだらけであります・・'],['say','desert','砂漠は歴史あるエリアだ\n他と違うのは当然だ']
  ]},
  'post:desert':{worldId:'desert',area:3,forceHome:true,steps:[
    ['say','pink','はあ、はあ、\n強すぎであります、、'],['say','desert','しかし、討伐成功だ\n見ろ\nこれがミラモブのレコード\nガラガラの旅 だ'],['narrate','7つのレコードの1つ、ガラガラの旅を手に入れた！'],['say','pink','これで2枚目であります！\n次は王様に報告後、田舎町を目指します！'],['say','desert','海底への入り口か\n懐かしいな']
  ]},

  'pre:rural:0':{worldId:'rural',area:0,steps:[
    ['guest','r-scouter'],['say','denden','ここのモンスターは\n結束力が強いでやんす！'],['say','pink','なんの！\nそれはこちらも同じこと！']
  ]},
  'post:rural:0':{worldId:'rural',area:0,steps:[
    ['say','denden','やるでやんすね！\nこれは期待できるでやんす！']
  ]},
  'pre:rural:1':{worldId:'rural',area:1,steps:[
    ['guest','r-captain'],['say','pink','か、海賊！？'],['say','denden','やつはモブキャプテンでやんす！'],['say','desert','船長か\n実力者とみて間違いないだろう']
  ]},
  'post:rural:1':{worldId:'rural',area:1,steps:[
    ['say','pink','恐ろしい海賊でありました・・'],['say','denden','昔はもっと強い海賊団がいたでやんす']
  ]},
  'pre:rural:2':{worldId:'rural',area:2,steps:[
    ['guest','r-dean'],['say','desert','雷のモンスターか・・！'],['say','denden','あ、実はオイラもでやんす'],['say','pink','見れば分かるであります']
  ]},
  'post:rural':{worldId:'rural',area:3,steps:[
    ['say','pink','やりましたー！'],['say','desert','こいつも強敵だったな'],['say','denden','ボスの名にふさわしい強さでやんす\nあと、たぶん根は悪いやつじゃなかったでやんす・・・。'],['say','desert','それが、お前が護衛隊長を辞めた理由か？'],['say','denden','だけ、ではないでやんす\n魔王は平和を乱す悪党でやんすから'],['narrate','3つめのレコード「案山子と小麦」を手に入れた！']
  ]},

  'arrival:magma':{worldId:'magma',area:0,steps:[
    ['say','denden','暑いでやんすー\nオイラ暑いの嫌いでやんすー'],['say','money','うるさいわね\nこっちまで暑くなるじゃない！'],['say','desert','砂漠も暑いが、ここはもっと過酷だな'],['say','pink','ここでも誰か案内してくれると良いのですが'],['say','money','そんな都合よく・・'],['guestDropDodge','nyoro','ドン！ッ'],['say','nyoro','おー・・\n痛いニョロ・・'],['say','pink','あなたさてはここに詳しいですね！'],['say','money','ボスのところに案内しなさい！'],['say','nyoro','ニョロ！？'],['say','denden','まあ待つでやんす'],['sayDual','money','お前が言うな！！','pink','お前が言うな！！（であります）'],['say','desert','俺が事情を説明しよう'],['narrate','モブニョロに事情を説明した'],['say','nyoro','お～！勇者様！\nお会いできて嬉しいニョロ！'],['say','desert','モブドラゴンとは、どんなやつだ？'],['say','nyoro','本当に恐ろしいモンスターニョロ・・'],['say','denden','モンスター二ョロ・・\n変な名前でやんす'],['say','desert','気にせず続けてくれ'],['say','nyoro','先代の王モブフェニックス様との死闘は\nそりゃ～凄かったニョロ\nでも結局最後はモブドラゴンが勝ったニョロ\nそれからというもの、\n魔王軍が住みついて大変ニョロ・・'],['say','pink','どこも同じでありますね・・'],['say','denden','ドラゴンか\n会ってみたいでやんすね！'],['join','nyoro','モブニョロが仲間に加わった！']
  ]},
  'pre:magma:0':{worldId:'magma',area:0,steps:[
    ['guest','m-golem'],['say','pink','でかいのが出て来たであります！'],['say','nyoro','ゴーレムは強いニョロ！\n最初に狙うニョロ！'],['say','money','私の魔法でイチコロよ！']
  ]},
  'post:magma:0':{worldId:'magma',area:0,steps:[
    ['say','desert','タフなモンスターだったな'],['say','denden','ここは過酷な環境ニョロ\nその分みんな強いニョロ']
  ]},
  'pre:magma:1':{worldId:'magma',area:1,steps:[
    ['guests',['m-honotail','m-hinotabi']],['say','m-hinotabi','お前達か？\n魔王様にたてつく愚か者は'],['say','nyoro','やつは火の魔法を使うニョロ！'],['say','m-hinotabi','お前、魔物のくせに勇者側か？'],['say','nyoro','今の暗い世界は嫌ニョロ！'],['say','denden','ピッカピカにするでやんす！']
  ]},
  'post:magma:1':{worldId:'magma',area:1,steps:[
    ['say','money','強い魔法使いだったわね\n私ほどじゃないけど']
  ]},
  'pre:magma:2':{worldId:'magma',area:2,steps:[
    ['guests',['m-blizzard','m-flame']],['say','desert','こいつらは・・'],['say','nyoro','そう\n砂漠出身の双子だニョロ'],['say','m-blizzard','邪魔する奴は'],['say','m-flame','全員始末する']
  ]},
  'post:magma:2':{worldId:'magma',area:2,steps:[
    ['say','denden','強敵だったでやんす・・'],['say','desert','さあ、決戦だ']
  ]},

  'pre:sea:0':{worldId:'sea',area:0,steps:[
    ['guest','s-abyssknight'],['say','s-abyssknight','勇者だな？\n悪いが国王は忙しい\nお帰り願おう'],['say','pink','そうはいかないであります！'],['say','desert','力を試す、か\n存分に見せてやろう']
  ]},
  'post:sea:0':{worldId:'sea',area:0,steps:[
    ['say','money','こんなのが続くの？\n杖がもたないよー'],['say','denden','元気出すでやんす！\nみんなで頑張るでやんす！']
  ]},
  'pre:sea:1':{worldId:'sea',area:1,steps:[
    ['guest','s-jones'],['say','s-jones','強力な覇気を感じる\nやはり、本物の勇者か'],['say','nyoro','すごい迫力ニョロ・・！'],['say','desert','これは骨が折れそうだ'],['say','s-jones','さあ、力を示せ！']
  ]},
  'post:sea:1':{worldId:'sea',area:1,steps:[
    ['say','pink','なんとか勝てましたね'],['say','money','でも、\n次の方が嫌な予感がするわ・・'],['say','desert','魔法使いの感か'],['say','money','しっかり備えて挑みましょう']
  ]},
  'pre:sea:2':{worldId:'sea',area:2,steps:[
    ['guest','s-wave'],['say','s-wave','よくここまで来たな\n想像以上の力だ'],['say','desert','みんな気を引き締めろ\n今までとは違うぞ'],['say','s-wave','戦い慣れしているな\nでは言葉は不要'],['say','pink','みなさん、頑張りましょう！']
  ]},
  'post:sea:2':{worldId:'sea',area:2,steps:[
    ['say','denden','疲れたでやんす・・'],['say','desert','人数差で勝ったようなものだな'],['say','money','勝ちは勝ち！\n国王のところへ急ぎましょう！']
  ]},

  'arrival:tribe':{worldId:'tribe',area:0,layout:'partyLeftGuestRight',steps:[
    ['say','pink','なんだか不思議な雰囲気でありますね'],['say','nekoku','オラ初めて見る景色だ'],['say','denden','ビリビリしそうな香りがするでやんす'],['say','desert','で、そこのお前が案内でもしてくれるのか？'],['sayOff','???','あら、気が付いていたの？\n中々やるわね'],['guestRight','jessie'],['say','jessie','私はネオン街の保安官\n通報を受けてこの村に来たの\nモブジェシーよ\nよろしくね'],['say','money','ネオン街！？\n私も、私も！'],['say','jessie','知っているわ\nモブマニーでしょ？\n私を覚えてない？'],['say','money','うーん\n私、魔王に封印されてたから'],['say','jessie','本当にそう？'],['say','money','え？'],['say','jessie','まあ、いいわ'],['say','desert','この村はどういう村なんだ？'],['say','jessie','魔王軍と直接は関係ないわ\nただ、あの町と関係はあるの'],['say','pink','あの町と繋がりが！？'],['say','jessie','ええ\nネオン街、部族村\nこの2つがあの町と大きく関係がある'],['say','pink','詳しく知りたいであります！'],['say','jessie','それはまたいずれね\nとにかく\nこの村は危険がいっぱいよ\n手を貸してあげるから油断しないことね'],['tempActor','jessie']
  ]},

  'arrival:rural2':{worldId:'rural2',area:0,steps:[
    ['say','denden','故郷でやんす～！'],['say','jessie','いい空気・・\n世界中こうだといいのに'],['say','money','でも、嫌な気配は感じるわ'],['say','pink','出発であります！']
  ]},
  'pre:rural2:0':{worldId:'rural2',area:0,steps:[
    ['guest','r2-violin'],['say','r2-violin','ようこそ我がコンサートへ\n一曲いかが？'],['say','denden','あ、じゃあ一曲・・'],['say','nekoku','オラ音楽好きだ'],['sayRed','money','そんな暇ないでしょう！'],['say','desert','どう見ても強敵だ\n紳士的な態度に騙されるな'],['say','r2-violin','残念\nでは、終曲を披露しましょう！']
  ]},
  'post:rural2:0':{worldId:'rural2',area:0,steps:[
    ['say','jessie','世界が変われば\n一曲お願いしてみたいわね']
  ]},
  'pre:rural2:1':{worldId:'rural2',area:1,steps:[
    ['guests',['r2-rapty','r2-tira']],['say','r2-rapty','我ら！'],['say','r2-tira','ジュラシック！'],['sayDual','r2-rapty','ヤベージャンズ！！','r2-tira','ヤベージャンズ！！'],['say','denden','この町の悪ガキコンビでやんす！'],['say','money','お仕置きが必要ね！']
  ]},
  'post:rural2:1':{worldId:'rural2',area:1,steps:[
    ['say','pink','凄い連携でありましたね'],['say','desert','我々も\nさらに連携力を磨く必要があるな']
  ]},
  'pre:rural2:2':{worldId:'rural2',area:2,steps:[
    ['guest','r2-kuukai'],['say','r2-kuukai','タマシイとは\n人の心なり\nタマシイとは\n魔物の悪意なり'],['say','money','嫌なオーラね・・'],['say','jessie','さっさと片付けましょう'],['say','nyoro','さ、さむいニョロ・・'],['say','nekoku','わたあめ・・'],['say','denden','声出していくでやんす！！！！']
  ]},
  'post:rural2:2':{worldId:'rural2',area:2,steps:[
    ['say','desert','こいつがボスではないようだな'],['say','pink','では一体・・'],['say','denden','なんだかムズムズするでやんす']
  ]},
  'pre:rural2:3':{worldId:'rural2',area:3,steps:[
    ['guest','boss-umidenden'],['say','denden','！？'],['say','boss-umidenden','ん？\nよう\n久しぶりだな\n落ちこぼれ'],['say','desert','何者だ？'],['say','denden','オイラと同じ\nある国の護衛隊長でやんす\n王国最強の戦士でやんす・・！'],['say','money','なんで魔王軍に？'],['say','boss-umidenden','退屈だったからさ\n魔王様は\n俺の退屈を埋めてくれる\n毎日最高の気分だぜ'],['say','nekoku','情けないやつだなー'],['say','desert','ふっその通りだな\nその退屈\n終わらせてやろう！']
  ]},
  'post:rural2:3':{worldId:'rural2',area:3,steps:[
    ['say','jessie','ねえ、\nその王国って\n今もあるの？'],['say','denden','・・・・'],['say','money','まあ、\n言いたくないこともあるわよね']
  ]}
});
// Jessie accompanies the party from the end of the tribe-village chapter onward.
if(STORY_EVENTS['post:tribe:3']&&!STORY_EVENTS['post:tribe:3'].steps.some(st=>st[0]==='join'&&st[1]==='jessie'))STORY_EVENTS['post:tribe:3'].steps.push(['join','jessie','モブジェシーが仲間に加わった！']);



// ===== MOB QUEST v47 : latest story/event sheet (3) =====
// Existing earlier scenes remain unchanged unless explicitly updated below.
Object.assign(STORY_EVENTS,{
  'arrival:sea':{worldId:'sea',area:0,steps:[
    ['say','nyoro','うわー空が海ニョロ！'],['say','money','海底だからね\n・・・・・\n美しい景色ね'],['say','denden','おっかないお魚がたくさんでやんす！'],['say','desert','とにかく進んでみよう'],['say','pink','みなさん、警戒を怠らず！']
  ]},
  'post:sea:0':{worldId:'sea',area:0,steps:[
    ['say','pink','こんなのが続くのでありますか・・？'],['say','denden','元気出すでやんす！\nみんなで頑張るでやんす！']
  ]},
  'pre:sea:1':{worldId:'sea',area:1,steps:[
    ['guest','s-jones'],['say','s-jones','強力な覇気を感じる\nやはり、本物の勇者か\nそして・・'],['say','nyoro','すごい迫力ニョロ・・！'],['say','desert','これは骨が折れそうだ'],['say','s-jones','私も本気で挑ませてもらう\nさあ、力を示せ！']
  ]},
  'post:sea':{worldId:'sea',area:3,steps:[
    ['guest','nepu'],['say','nepu','素晴らしい強さだ\nだが、魔王には遥に及ばない\n旅を続け、力をつけるのだ'],['say','pink','はい！'],['say','nepu','モブネコクー！\nこちらへ来るのだ！'],['sayOff','モブネコクー','はいはい！'],['tempActor','nekoku'],['say','nekoku','お呼びでしょうか国王様！'],['say','nepu','お前も彼らと旅をするのだ\nきっとお互いのためになる'],['say','nekoku','オラがですか！？\nうーん\n分かりました！\n精一杯頑張ります！'],['say','nyoro','ヘンテコな戦士だニョロ'],['say','nekoku','オラが言えたもんじゃねえが\nおめえも大概変だぞ'],['say','money','勇者パーティーとは思えないわね\nでもそれもいいんじゃない？'],['say','denden','仲間が増えたでやんす！'],['joinSilent','nekoku'],['say','nepu','モブマニー\nこれを'],['say','money','ん？'],['rewardDrink','19','モブトマトジュースセットを1つ手に入れた！'],['say','money','なんで私に？'],['say','nepu','道中、皆と飲むがいい'],['say','money','ありがとう・・？'],['narrate','6枚目のレコード「ケロの衣装」を手に入れた！']
  ]},

  'arrival:neon2':{worldId:'neon2',area:0,steps:[
    ['say','jessie','ようやく帰ってこれた'],['say','denden','そういえば\nここの保安官でやんしたねー'],['say','money','うっ・・・'],['say','nekoku','ん？大丈夫か？'],['say','money','頭が・・\n割れそう・・'],['say','nyoro','少し休むニョロ！'],['say','money','だめ・・\n急がない・・と・・'],['say','desert','先に進むべきだ\n立ち止まっても状況は変わらない'],['say','pink','モブマニー・・\n頑張るであります!!\n僕たちがフォローするであります!!'],['say','jessie','そうね、急ぎましょう！']
  ]},
  'pre:neon2:0':{worldId:'neon2',area:0,steps:[
    ['guest','n2-tiger'],['say','n2-tiger','侵入者発見\n排除する'],['say','money','しん・・にゅう・・\n侵入・・者・・'],['say','jessie','急いだ方が良さそうね']
  ]},
  'post:neon2:0':{worldId:'neon2',area:0,steps:[['say','denden','次次次～！\nでやんす！']]},
  'pre:neon2:1':{worldId:'neon2',area:1,steps:[
    ['guests',['n2-tama','n2-kodora']],['say','nyoro','なんだかキュートな子達だニョロ'],['say','jessie','油断しないで\nネオン街にか弱い子なんていない'],['say','desert','お前達を見ていれば分かる'],['say','denden','でも可愛いでやんす～'],['say','money','・・・・・']
  ]},
  'post:neon2:1':{worldId:'neon2',area:1,steps:[
    ['say','nekoku','オラ、この場所見覚えがあるぞ'],['say','jessie','今更？\n海底はネオン街出身が多いのよ'],['say','nekoku','そうだ\n国王様に連れて来てもらったんだ'],['say','desert','国王はネオン街出身なのか？'],['say','nekoku','いや、女王様がネオン街出身だ'],['say','jessie','そうだったわね']
  ]},
  'pre:neon2:2':{worldId:'neon2',area:2,steps:[
    ['guest','n2-palette'],['say','n2-palette','止まれ'],['say','denden','派手なやつが来たでやんす！'],['say','money','モブ・・パレット・・'],['say','jessie','モブマニー、\n今は何も考えなくていい\n私たちに任せて'],['say','nyoro','素早く倒すニョロ！'],['say','n2-palette','悪いが\nここまでだ\n魔王などどうでもいいが\nマスター様の言うこと絶対だ'],['say','desert','魔王の傘下じゃないだと？'],['say','n2-palette','マスター様に考えがあってのこと\n私は従うまでだ\n勇者であろうと容赦はしない'],['say','nekoku','オラ、モブマニーを守る！']
  ]},
  'post:neon2:2':{worldId:'neon2',area:2,steps:[
    ['guest','n2-palette'],['say','n2-palette','見事だ\nお前たちは強い\n・・・・・\n魔王との戦い、\n楽しみにしているぞ'],['hideGuest']
  ]},
  'pre:neon2:3':{worldId:'neon2',area:3,steps:[
    ['guest','boss-neomaster'],['say','boss-neomaster','よくぞここまで来ました\nこれも運命というやつですね\n勇者よ、あなたには何が見える？\nこの戦いの先に、何を見る？'],['say','pink','洗脳する気であります！！\n聞かなくていいであります！'],['say','jessie','そんなせこいことしないわ\nこの人はネオン街のマスターよ'],['say','boss-neomaster','モブジェシー\nお久しぶりです\n随分と長いこと旅をしましたね\nお互いに'],['say','jessie','そうね\nまさかあなたと対峙するなんて\n思ってもみなかったわ'],['say','boss-neomaster','これも運命です\nモブマニー\nあなたも元気そうですね'],['say','money','・・・？\nあな・・た・・は？'],['say','boss-neomaster','そうか\nそうですね\n封印が解かれて間もない\nしかし\n時間もない'],['say','jessie','急いでいるの\n分かるでしょう？\n戦いは避けられない'],['say','desert','話しはまとまったようだな\nお前達とやつに\nどんな関わりがあるかは知らない\nだが、俺は俺の使命を全うする\nお前達が敵でないと分かって良かった\nやつを倒すぞ！'],['say','pink','やつを倒せば、\n魔王城への扉が開かれるであります！\nみなさん、やるであります！']
  ]},
  'post:neon2:3':{worldId:'neon2',area:3,steps:[
    ['guest','boss-neomaster'],['say','jessie','私たちの勝ちね・・'],['say','boss-neomaster','素晴らしい力です\n魔王の力は強大\nしかし\nあなたたちなら・・'],['say','money','マスター・・\nネオン街の\nマスター・・'],['say','nyoro','モブマニー、\nまだ良くならないニョロ・・'],['say','boss-neomaster','モブマニー\n最後に\n私の力を・・'],['energyTransfer','boss-neomaster','money'],['say','jessie','マスター・・！'],['softLight'],['hideGuest'],['say','money','・・・・あれ？'],['say','denden','正気に戻ったでやんすか！？'],['say','desert','気分はどうだ？'],['say','money','うん、平気\n意識はあったんだけど\n頭がもやもやしてたの\nでももう大丈夫！\n次へ行きましょう！'],['say','jessie','良かった・・'],['fadePartyExcept','jessie'],['say','jessie','マスター・・\n必ずやり遂げて見せます']
  ]},

  'arrival:magma2':{worldId:'magma2',area:0,steps:[
    ['say','nyoro','帰って来たニョロ～！\nやっぱり落ち着くニョロ'],['say','denden','故郷は特別でやんすからね～'],['say','money','相変わらず暑いわね'],['say','jessie','ここも強敵だらけよ\n油断せず進みましょう']
  ]},
  'pre:magma2:0':{worldId:'magma2',area:0,steps:[
    ['guest','m2-yogan'],['say','nekoku','すんごいスライムだなー'],['say','desert','スライムにしては\n魔力が高すぎる'],['say','nyoro','たぶん変異体ニョロ！\nマグマではよくあるニョロ！'],['say','money','魔力なら負けないわ！']
  ]},
  'post:magma2:0':{worldId:'magma2',area:0,steps:[
    ['say','jessie','危険なモンスター・・'],['say','desert','そうだな\nやはり急がねば'],['say','pink','こんなのが増えたら大変であります！']
  ]},
  'pre:magma2:1':{worldId:'magma2',area:1,steps:[
    ['guest','m2-salamander'],['say','denden','オイラやっぱり\n暑いの嫌いでやんす'],['say','nyoro','あいつはこのエリアでも\n特に熱いモンスターニョロ！'],['say','jessie','モブサラマンダーね？\n聞いたことがあるわ'],['say','pink','倒して、\n少しでも涼しくするであります！']
  ]},
  'pre:magma2:2':{worldId:'magma2',area:2,steps:[
    ['guest','m2-buster'],['say','m2-buster','勇者一行よ\nお前達の命運も\nここまでだ'],['say','desert','なんだこいつは・・\nモブドラゴンと同じ魔力？'],['say','nyoro','あいつは魔界に行ったはずニョロ・・\nモブドラゴンと\n同じくらいの力を持っているニョロ！'],['sayAs','m2-buster','その通り\n我らは魔王様より\n同じ魔力を与えられている','モブマグマスター'],['say','money','同じ？\nなんでそんなに強気なの？'],['say','denden','オイラたちは\nモブドラゴンを倒しているでやんす！'],['sayAs','m2-buster','無知と言うのは\n楽なものだな','モブマグマスター']
  ]},
  'post:magma2:2':{worldId:'magma2',area:2,steps:[
    ['guest','m2-buster'],['say','m2-buster','これで完成するのだ\n全てを滅ぼす\n最強のドラゴンが・・'],['hideGuest'],['say','denden','もっと凄いドラゴン・・\n会ってみたいでやんす']
  ]},
  'pre:magma2:3':{worldId:'magma2',area:3,steps:[
    ['guest','dragon'],['say','dragon','待ちわびたぞ\nこの時を\n勇者よ\nお前ともう一度\n戦いたかった'],['say','desert','さらに力が上がっている'],['say','jessie','大変な戦いになりそうね'],['say','money','ドラゴンとの決戦、\n燃えるわ！'],['say','dragon','勇者よ\n覚悟するのだ！！'],['guestTransform','boss-dragon2'],['say','nyoro','気を付けるニョロ！\nこれが本来の姿ニョロ！']
  ]},
  'post:magma2:3':{worldId:'magma2',area:3,steps:[
    ['guest','dragon'],['say','dragon','私の負けだ\n最後に\n素晴らしい戦いが出来た\nもう\n思い残すことは無い'],['say','pink','モブドラゴン！\n立派でありました！\n僕は勇者の相棒として\nお前を決して忘れないであります！'],['say','dragon','ふふふっ・・\n勇者の相棒\nモブピンクよ\nお前も素晴らしい戦士だ\n魔王様にどこまで通用するか\n業火の地獄で見ていてやろう'],['hideGuest'],['say','desert','さあ魔王は近い'],['say','jessie','ゴールが見えて来たわね'],['say','nyoro','魔王・・\nもう怖くないニョロ！'],['say','denden','やってやんべ！\nでやんす！'],['say','nekoku','オラ、戦うぞ！'],['say','money','なんだかんだ\n勇者パーティーって感じになったわね']
  ]}
});


// ===== MOB QUEST v58 : 冒険イベント最新稿（砂漠Ⅱ） =====
Object.assign(STORY_EVENTS,{
  'arrival:desert2':{worldId:'desert2',area:0,steps:[
    ['say','jessie','砂漠は本当に変わらないわね'],
    ['say','desert','ああ\nここが一番落ち着く'],
    ['say','money','あなたにとっては\n特別な場所だものね'],
    ['say','nyoro','暑くてちょうどいいニョロ'],
    ['say','denden','オイラちょっと苦手でやんす'],
    ['sayOff','???','ちょっといいかナ？'],
    ['guestSlow','riro'],
    ['say','riro','君たちが勇者一行かナ？'],
    ['say','pink','何者でありますか！？'],
    ['say','riro','私はモブリーロ\n魂を司る者'],
    ['say','money','魂を？'],
    ['say','riro','ミラモブはいくつもの\nタブーを犯していまス\n魂を\n軽く見ていまス\n魔王も\n同じでス'],
    ['say','desert','それで\n勇者と共に魔王を討ちたい\nというわけか'],
    ['say','riro','そうでス\n私、強いでス'],
    ['say','denden','いいでやんすね！\n魔王討伐に向けて\n仲間は多い方がいいでやんす！'],
    ['joinSilent','riro']
  ]},
  'pre:desert2:0':{worldId:'desert2',area:0,steps:[
    ['guest','boss-mira-d2'],
    ['say','boss-mira-d2','待っていたぞ\n勇者たちよ'],
    ['say','desert','ミラモブ！？'],
    ['say','boss-mira-d2','この世界支配するの\n魔王様だ\nお前たちに\n邪魔はさせない'],
    ['say','money','いきなり出てくるなんて\n手間が省けたわね！'],
    ['say','riro','少し\nいいですカ？\nミラモブ\nあなたは\n数日前\nソウルフュージョンを\n実行しタ'],
    ['say','pink','ソウルフュージョン？'],
    ['say','riro','一体\nどんなモンスターを\n作ったのですカ？'],
    ['say','boss-mira-d2','貴様\nサクラ一族か\nククク・・\nさあ？\nどんなモンスターかな？'],
    ['say','desert','なんでもいい\n俺たちは\n目の前の敵を倒すだけだ！']
  ]},
  'post:desert2:0':{worldId:'desert2',area:0,steps:[
    ['guest','boss-mira-d2'],
    ['say','boss-mira-d2','ククク・・\n私は不滅だ。。'],
    ['hideGuest'],
    ['say','jessie','これで\n目的達成？'],
    ['say','money','ううん\n凄い魔力をいくつも感じる\nここからが本番みたいね'],
    ['say','pink','ミラモブ以上のモンスターが\nまだいるってことでありますね']
  ]},
  'pre:desert2:1':{worldId:'desert2',area:1,steps:[
    ['guest','d2-mirabuster'],
    ['say','d2-mirabuster','おーおー・・\nお前たちか\n魔王様に逆らう愚か者は'],
    ['say','desert','なんという不気味な魔力だ'],
    ['say','jessie','これがソウルフュージョン・・？'],
    ['say','riro','そうでス\nみなさん\nお気をつけテ']
  ]},
  'post:desert2:1':{worldId:'desert2',area:1,steps:[
    ['say','desert','この魔法を\n魔王も使えるのか？'],
    ['say','riro','この魔法を使えるのハ\nミラモブと\n魔王城の魔女\nモブリリスだけでス\n世界の禁術として\n封じられていましタ'],
    ['say','jessie','聞いたことがあるわ\nどこで誰が使ったのか\nいつでも分かるように\nなっているのよね？\nあの禁術が\nソウルフュージョン'],
    ['say','money','モブリリスは\nなぜその術を使わないの？\n魔王軍でしょ？'],
    ['say','riro','分かりませン\nしかし\nいつ使っても\nおかしくありませン'],
    ['say','denden','覚悟し挑むでやんす！']
  ]},
  'pre:desert2:2':{worldId:'desert2',area:2,steps:[
    ['guests',['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'],{raised:true}],
    ['say','desert','こんなことが・・'],
    ['say','nyoro','ミラモブがいっぱいニョロ！'],
    ['say','d2-miraearth','我ら'],
    ['say','d2-mirakarami','ミラモブ四人衆'],
    ['say','d2-miranight','ミラモブ様の命により'],
    ['say','d2-miratime','お前たちをここで始末する'],
    ['say','money','とんでもない魔力ね・・！'],
    ['say','nekoku','肌がヒリヒリするぞ'],
    ['say','pink','ここで負けるわけには\nいかないであります！！'],
    ['say','jessie','ミラモブ4体分か・・\nいいんじゃない？'],
    ['say','denden','やってやるでやんすーー！！'],
    ['say','d2-mirakarami','まずは俺達からだ！'],
    ['say','d2-miraearth','坊やたち\n遊んであげよう']
  ]},
  'post:desert2:2':{worldId:'desert2',area:2,steps:[
    ['say','denden','勝ったでやんす！'],
    ['say','jessie','もうヘトヘト・・'],
    ['say','riro','残すは\nミラモブだケ'],
    ['say','desert','ああ\nやつとの\n最後の決戦だ'],
    ['say','pink','うおー！\nであります！！']
  ]},
  'pre:desert2:3':{worldId:'desert2',area:3,steps:[
    ['guest','boss-dorafara'],
    ['say','boss-dorafara','この世界を支配するのは魔王様\n砂漠を支配するのは\nこの私'],
    ['say','desert','その姿・・'],
    ['say','boss-dorafara','私は砂漠の支配者\n使命を全うする'],
    ['say','jessie','記憶が・・'],
    ['say','money','力を求めた代償ね'],
    ['say','nekoku','オラ、なんだか悲しい'],
    ['darkGlowGuest'],
    ['say','nyoro','みんな、構えるニョロ！！'],
    ['say','desert','来い！ミラモブ！！']
  ]},
  'post:desert2:3':{worldId:'desert2',area:3,forceHome:true,steps:[
    ['guest','boss-mira-d2'],
    ['say','boss-mira-d2','はあ・・はあ・・、、\n私は\n不滅・・\nだったはず・・'],
    ['say','desert','砂漠の王よ\nお前は敗れたのだ\n勇者によって'],
    ['say','boss-mira-d2','そうか・・\nわが息子\nモブデザートよ\n素晴らしい仲間に出会ったな'],
    ['say','pink','えーーーーーーー！！！'],
    ['say','money','親子だったの！？'],
    ['say','boss-mira-d2','お前は昔から\n魔王様のやり方が嫌いだったな\nお前がピラミッドを去った時\nいつか\nこんな日が来ると思っていた'],
    ['say','desert','俺は・・\n俺は砂漠が好きだ\n種族隔てなく\n自由に生活出来る広大なエリア\nそれが\n魔王によって奪われた\n俺は\n我慢出来なかった'],
    ['say','boss-mira-d2','そうだな\nだが\n私では砂漠を守り切れなかった\n魔王様は\n秩序を保たれているのだ\n正しいかは分からないがな'],
    ['say','jessie','正しいわけがないわ\nあなた達はずっと\n命を軽く見ている\nただの悪党よ'],
    ['say','boss-mira-d2','悪党か\nそれは否定しない\nしかし\n魂はだれよりも重んじている\nそこは譲れない\nモブデザートよ\nお前に私の力を授ける\nこの先の未来\n好きなように生きてみろ\n砂漠を頼んだぞ'],
    ['darkEnergyTransfer','boss-mira-d2','desert'],
    ['hideGuest'],
    ['say','pink','強き者でした・・！'],
    ['say','denden','敵ながら立派だったでやんす！'],
    ['say','money','あれほどの魔物を従えるなんて\n魔王がまた遠く感じるわね'],
    ['say','nekoku','でも、悪いことはだめだ\nオラたち、正義の味方だ\n人に、\nいじわるしちゃダメだ'],
    ['say','nyoro','その通りニョロ'],
    ['say','riro','少なくとモ\n魔王は\n絶対的な悪でス'],
    ['say','desert','・・・・・\nさあ行こう\n最終決戦だ'],
    ['say','jessie','魔王城へ向かいましょう\nやることは決まっているわ'],
    ['say','pink','やりましょう！\nみなさん！'],
    ['fadePartyExcept','desert'],
    ['say','desert','砂漠の王よ\n安らかに・・'],
    ['fadeActor','desert']
  ]}
});

/* ===== MOB QUEST v71: 魔王城イベント復旧 ===== */
Object.assign(STORY_EVENTS,{
  'arrival:demonCastle':{worldId:'demonCastle',area:0,custom:'demonCastleArrival'},
  'pre:demonCastle:0':{worldId:'demonCastle',area:0,steps:[['guests',['c-killwitch','c-succubus']],['say','c-killwitch','我ら！'],['sayAs','c-succubus','リリス親衛隊！','モブララウィッチ'],['say','c-killwitch','モブキラウィッチ！'],['sayAs','c-succubus','モブララウィッチ！','モブララウィッチ'],['narrate','2人で「お命頂戴！」'],['say','denden','か、かっけえでやんす・・'],['say','nekoku','オラ、好きだ'],['say','money','何馬鹿な事言ってるの！この2人相当強いわよ！'],['say','jessie','簡単には通してくれなさそうね'],['say','nyoro','早く倒してモブエースを追うニョロ！']]},
  'post:demonCastle:0':{worldId:'demonCastle',area:0,steps:[['guests',['c-killwitch','c-succubus']],['sayAs','c-succubus','リリス様・・','モブララウィッチ'],['say','c-killwitch','申し訳ありません・・'],['hideGuests'],['guest','boss-lilith-castle'],['say','boss-lilith-castle','2人ともよく頑張ったね。もういいからゆっくり休んでね。あとは僕に任せて'],['say','boss-lilith-castle','どうも勇者様。引き返すならここが最後だよ'],['say','money','出たわね魔王軍 No.2！'],['say','jessie','薔薇の魔女、モブリリス・・！'],['say','pink','魔王を倒すまで僕たちは止まらないであります！'],['say','boss-lilith-castle','警告に来てあげただけ。まあ、せいぜい死なないことね'],['hideGuest'],['say','desert','覚悟を決めて先へ進むぞ！']]},
  'pre:demonCastle:1':{worldId:'demonCastle',area:1,steps:[['guestDrop','boss-gladi','ドン！'],['say','boss-gladi','我・・見参！'],['say','desert','魔王軍 No.3の登場か'],['say','jessie','ゴールデンバレットのグラディモブ・・！'],['say','denden','カッコいい銃を持ってるでやんすね'],['say','boss-gladi','エース、ララ、キラ。やつらを倒すとは賞賛に値するぞ'],['say','money','あなたもリストに加えてあげるわ！'],['say','boss-gladi','いいだろう。どこからでもかかってくるがよい！'],['say','jessie','みんな気を付けて！状態異常を受けたらすぐ回復するのよ！']]},
  'post:demonCastle:1':{worldId:'demonCastle',area:1,steps:[['guest','boss-gladi'],['say','boss-gladi','我の負けだ・・だが魔王様には遠く及ばない'],['say','money','先へ進ませてもらうわ'],['say','boss-gladi','運命とどう戦うのか。その答えを見せてくれ'],['hideGuest'],['say','desert','残りはモブリリス、そして魔王だけだ'],['say','nekoku','オラ、誰が相手でも戦う！'],['say','pink','先へ進むであります！']]},
  'pre:demonCastle:2':{worldId:'demonCastle',area:2,steps:[['guest','boss-lilith-castle'],['say','boss-lilith-castle','凄いね君たち。グラディモブ、強かったでしょ'],['say','desert','ああ。強敵だった'],['say','money','あんたなんて私の魔法でぶっ飛ばしてやるわ！'],['say','jessie','あなたを倒せば、あとは魔王だけ！'],['say','boss-lilith-castle','君たちはこのリリス四姉妹が遊んでくれるよ'],['say','desert','2手に分かれよう'],['say','riro','勇者様が決めればいいでス'],['narrate','Aパーティー：モブリリス・モブヘルリリス・モブキリンリリス / Bパーティー：モブクフリリス・モブリヴァリリス'],['lilithSplit']]},
  'post:demonCastle:2':{worldId:'demonCastle',area:2,steps:[['guest','boss-lilith-castle'],['say','boss-lilith-castle','僕の負けだね。いいソウルを持ったチーム'],['say','money','なによ！まだやる気！？'],['say','boss-lilith-castle','そんなつもりないよ。今はね'],['say','boss-lilith-castle','ネオン街の魔女。モブマニー、君にはまだ知らない過去がある'],['say','jessie','今のモブマニーが本当のモブマニーよ'],['say','money','・・・ありがとう'],['hideGuest'],['say','desert','さあ最終決戦だ。全てを終わらせよう']]},
  'pre:demonCastle:3':{worldId:'demonCastle',area:3,steps:[['guests',['boss-maou-castle','boss-ace'],{slow:true}],['say','boss-maou-castle','モブリリスがやられた。我が軍は私とお前だけだ'],['say','boss-ace','なんと・・'],['say','boss-maou-castle','だが終わりでは無い。勇者を滅ぼし、新たな軍勢を作る'],['say','boss-ace','俺はネオン街の戦士、モブエース。お前を倒すチャンスをずっと伺っていた'],['say','boss-maou-castle','この状況がチャンスだと？'],['say','boss-ace','1対1なら、今の俺なら勝てる！'],['narrate','魔王城、最後の戦いが始まる。']]}
});
/* ===== MOB QUEST v73 CANONICAL STORY OVERRIDE =====
   冒険のイベントとセリフと演出(8).txt / 2(3).txt を最優先。 */
Object.assign(STORY_EVENTS,{
  'pre:desert2:0':{worldId:'desert2',area:0,steps:[
    ['guest','boss-mira-d2'],['say','boss-mira-d2','待っていたぞ勇者たちよ'],['say','desert','ミラモブ！？'],
    ['say','boss-mira-d2','この世界を支配するのは魔王様\nお前たちに\n邪魔はさせない'],
    ['say','money','いきなり出てくるなんて\n手間が省けたわね！'],['say','riro','少しいいですカ？\nミラモブ\nあなたは数日前\nソウルフュージョンを実行しタ'],['say','pink','ソウルフュージョン？'],['say','riro','一体どんなモンスターを作ったのですカ？'],['say','boss-mira-d2','貴様サクラ一族か\nククク・・\nさあ？\nどんなモンスターかな？'],['say','desert','なんでもいい\n俺たちは目の前の敵を倒すだけだ！']
  ]},
  'pre:desert2:1':{worldId:'desert2',area:1,steps:[
    ['guest','d2-mirabuster'],['say','d2-mirabuster','おーおー・・\nお前たちか\n魔王様に逆らう愚か者は'],['say','desert','なんという不気味な魔力だ'],['say','jessie','これがソウルフュージョン・・？'],['say','riro','そうでス\nみなさんお気をつけテ'],['say','tetsu','妖気を感じるでござる'],['say','pink','サポートし合いながら戦いましょう！'],['say','money','行くわよ！']
  ]},
  'post:desert2:1':{worldId:'desert2',area:1,steps:[
    ['say','denden','やったであります！'],['say','desert','この魔法を魔王も使えるのか？'],['say','riro','この魔法を使えるのハ\nミラモブと\n魔王城の魔女\nモブリリスだけでス\n世界の禁術として\n封じられていましタ'],['say','jessie','聞いたことがあるわ\nモンスターとモンスターを融合させる術\nあの禁術が\nソウルフュージョン'],['say','money','モブリリスはなぜその術を使わないの？\n魔王軍でしょ？'],['say','riro','分かりませン\nしかし\nいつ使ってもおかしくありませン'],['say','denden','(怖いでやんす)'],['say','nyoro','みんなで戦えば大丈夫ニョロ！']
  ]},
  'pre:desert2:2':{worldId:'desert2',area:2,steps:[
    ['guests',['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'],{raised:true}],['say','desert','なんだこれは・・！？'],['say','nyoro','ミラモブがいっぱいニョロ！'],['say','d2-miraearth','我ら'],['say','d2-mirakarami','ミラモブ四人衆'],['say','d2-miranight','ミラモブ様の命により'],['say','d2-miratime','お前たちをここで始末する'],['say','money','とんでもない魔力ね！'],['say','nekoku','肌がヒリヒリするぞ'],['say','pink','ここで負けるわけには\nいかないであります！！'],['say','jessie','ミラモブ4体分か'],['say','denden','やってやるでやんすーー！！'],['say','d2-mirakarami','まずは俺達からだ！'],['say','d2-miraearth','坊やたち、私たちが遊んであげよう']
  ]},
  'post:desert2:2':{worldId:'desert2',area:2,steps:[
    ['say','denden','勝ったでやんす！'],['say','jessie','もうヘトヘト・・'],['say','riro','残すはミラモブだケ'],['say','desert','ああ\nやつとの最後の決戦だ'],['say','pink','うおー！であります！！']
  ]},
  'post:desert2:3':{worldId:'desert2',area:3,forceHome:true,steps:[
    ['guest','boss-mira-d2'],['say','boss-mira-d2','はあ・・はあ・・、、\n私は不滅・・\nだったはず・・'],['say','desert','砂漠の王よお前は敗れたのだ\n勇者によって'],['say','boss-mira-d2','そうか・・\nわが息子モブデザートよ\n素晴らしい仲間に出会ったな'],['say','pink','えーーーーーーー！！！'],['say','money','親子だったの！？'],['say','boss-mira-d2','お前は昔から\n魔王様のやり方が嫌いだったな\nお前がピラミッドを去った時\nいつかこんな日が来ると思っていた'],['say','desert','俺は・・\n俺は砂漠が好きだ\n種族隔てなく\n自由に生活出来る広大なエリア\nそれが魔王によって奪われた\n俺は我慢出来なかった'],['say','boss-mira-d2','そうだな・・だが\n私では砂漠を守り切れなかった\n魔王様は秩序を保たれているのだ\n正しいかは分からないがな'],['say','jessie','正しいわけがないわ\nあなた達はずっと命を軽く見ている\nただの悪党よ'],['say','boss-mira-d2','悪党か、それは否定しない\nしかし魂はだれよりも重んじている\nそこは譲れない\nモブデザートよ、お前に私の力を授ける\nこの先の未来、好きなように生きてみろ\n砂漠を頼んだぞ'],['darkEnergyTransfer','boss-mira-d2','desert'],['hideGuest'],['say','pink','強き者でした・・！'],['say','denden','敵ながら立派だったでやんす！'],['say','money','あれほどの魔物を従えるなんて\n魔王がまた遠く感じるわね'],['say','nekoku','でも、悪いことはだめだ\n人に、いじわるしちゃダメだ'],['say','nyoro','その通りニョロ'],['say','riro','少なくとモ\n魔王は絶対的な悪でス'],['say','desert','・・・・・\nさあ行こう、魔王討伐の時だ'],['say','jessie','魔王城へ向かいましょう\nやることは決まっているわ'],['say','pink','やりましょう！みなさん！'],['fadePartyExcept','desert'],['say','desert','砂漠の王よ\n安らかに・・'],['fadeActor','desert']
  ]},
  'pre:demonCastle:0':{worldId:'demonCastle',area:0,steps:[
    ['guests',['c-killwitch','c-succubus']],['say','c-killwitch','我ら！'],['sayAs','c-succubus','リリス親衛隊！','モブララウィッチ'],['say','c-killwitch','モブキラウィッチ！'],['sayAs','c-succubus','モブララウィッチ！','モブララウィッチ'],['narrate','2人で「お命頂戴！」'],['say','denden','か、かっけえでやんす・・'],['say','nekoku','オラ、好きだ'],['say','money','何馬鹿な事言ってるの！\nこの2人相当強いわよ！'],['say','jessie','簡単には通してくれなさそうね'],['say','nyoro','早く倒してモブエースを追うニョロ！']
  ]},
  'post:demonCastle:0':{worldId:'demonCastle',area:0,steps:[
    ['guests',['c-killwitch','c-succubus']],['sayAs','c-succubus','リリス様・・','モブララウィッチ'],['say','c-killwitch','申し訳、、ありません、、'],['hideGuests'],['guest','boss-lilith-castle'],['say','boss-lilith-castle','2人ともよく頑張ったね\nもういいから\nゆっくり休んでね\nあとは僕に任せて'],['wait',650],['say','boss-lilith-castle','どうも勇者様\n引き返すならここが最後だよ'],['say','money','出たわね魔王軍 No.2！'],['say','jessie','薔薇の魔女、モブリリス・・！'],['say','boss-lilith-castle','ネオン街の魔女に保安官ね\n大人しくお家に帰る気はない？'],['say','pink','魔王を倒すまで\n僕たちは止まらないであります！'],['say','desert','薔薇の魔女がもう相手をしてくれるのか？'],['say','boss-lilith-castle','そんなわけないでしょ\nそこのピンクちゃん\n死相が出てるわ\n警告に来てあげただけ'],['say','pink','そんな脅し怖くないであります！'],['say','boss-lilith-castle','脅し？\n僕割と優しいんだけどね\nまあ\nせいぜい死なないことね'],['hideGuest'],['say','desert','死相など全員に出ている\n覚悟を決めて\n先へ進むぞ！']
  ]},
  'pre:demonCastle:1':{worldId:'demonCastle',area:1,steps:[
    ['guestSlow','boss-gladi'],['say','boss-gladi','我・・見参！'],['say','desert','魔王軍 No.3の登場か'],['say','jessie','ゴールデンバレットの\nグラディモブ・・！'],['say','denden','カッコいい銃を持ってるでやんすね\nオイラがいただくでやんす！'],['say','boss-gladi','エース\nララ\nキラ\nやつらを倒すとは\n賞賛に値するぞ'],['say','money','あなたもリストに加えてあげるわ！'],['say','boss-gladi','ネオン街の魔女\nお前に弾丸を撃ち込むこの時\n心待ちにしていたぞ'],['say','money','？\n私はあんたに恨みなんてないけど\nモブエースを助けるため\nそこを通してもらうわ！'],['say','boss-gladi','いいだろう\nどこからでもかかってくるがよい！'],['say','jessie','みんな気を付けて！\nやつの攻撃は通常攻撃で状態異常弾丸を使ってくる！\nかかったらすぐアイテムで回復するのよ！']
  ]},
  'post:demonCastle:1':{worldId:'demonCastle',area:1,steps:[
    ['guest','boss-gladi'],['say','boss-gladi','グフッ・・'],['say','pink','我々の勝ちであります！'],['say','boss-gladi','我の負けだ・・\nだが\n魔王様には遠く及ばない\nネオン街の魔女よ\n二度もお前に敗れるとはな'],['say','money','さっきから何を言っているの？\n誰かと間違えてない？'],['say','boss-gladi','先へ進むがいい\nそして\n運命とどう戦うのか\nその答えを見せてくれ'],['say','jessie','・・・・'],['say','denden','お前の想いはオイラが引き継ぐでやんす！'],['say','boss-gladi','そうだったな\n名乗れ'],['say','denden','お、オイラはモブデンデン！\n（・・もらえるでやんすか？）'],['say','boss-gladi','良い腕だったぞ\n銃はやれぬが\nこのメダルを授けよう'],['narrate','「グラビディゴールデンバレット」のメダルは素材追加後に実装されます。'],['hideGuest'],['say','desert','残りはモブリリス、そして魔王だけだ'],['say','jessie','奥の手でもない限りはね'],['say','nekoku','オラ\n誰が相手でも戦う！'],['say','nyoro','魔王まであと少しニョロ！'],['say','pink','先へ進むであります！']
  ]},
  'pre:demonCastle:2':{worldId:'demonCastle',area:2,steps:[
    ['guest','boss-lilith-castle'],['say','boss-lilith-castle','凄いね君たち\nグラディモブ\n強かったでしょ'],['say','desert','ああ\n強敵だった'],['say','boss-lilith-castle','まあ\n僕の方が強いんだけどね\nちょっとだけ寂しくなるな'],['say','money','あんたなんて\n私の魔法でぶっ飛ばしてやるわ！'],['say','boss-lilith-castle','ネオン街の魔女\n僕も手合わせしてみたかった\n良い機会ね'],['say','jessie','あなたを倒せば\nあとは魔王だけ！'],['say','boss-lilith-castle','うーん\nそれはどうだろう\n行ってみないと分からないよね\nまあ\n行けないんだけどね'],['guests',['c-lilith-hell','c-lilith-kirin','c-lilith-kufu','c-lilith-riva'],{raised:true}],['say','boss-lilith-castle','君たちは\nこのリリス四姉妹が遊んでくれるよ\nあ、僕も入れたら五姉妹か？\nいや僕は親？うーん'],['say','pink','あれを全部相手は大変であります・・'],['say','desert','2手に分かれよう'],['say','denden','ナイスアイデアでやんす！'],['say','jessie','どう分かれるの？'],['say','riro','勇者様が\n決めればいいでス'],['say','denden','そうでやんすね！'],['say','money','リリスがいる方は3体\n戦力の分け方が大事ね！'],['narrate','パーティーを2つ作ってください\nAパーティー：モブリリス・モブヘルリリス・モブキリンリリス\nBパーティー：モブクフリリス・モブリヴァリリス'],['lilithSplit']
  ]}
});

async function startDemonAceStoryBattle(){
  const bg=storySceneBg('demonCastle',0);return new Promise(async resolve=>{scriptedBattleResolve=resolve;await startBattleLoaded({mode:'story',returnScreen:'adventure',enemyConfigs:[{id:'boss-ace',level:73,actionCount:2}],party:state.party,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:true,storyLabel:'モブエース EVENT BATTLE'});});
}
async function runDemonCastleArrivalStory(){
  await openStoryScene('demonCastle',0);await storySay('pink','ここが魔王城でありますね・・！');await storyShowGuest('boss-ace',{slow:true});
  await storySay('boss-ace','まさか本当にここまで来るとはな');await storySay('jessie','モブエース！！');await storySay('boss-ace','久しぶりだな。このような形での再会は望んでいなかった');await storySay('desert','魔王の側近と随分と仲が良さそうだな');await storySay('jessie','かつての仲間よ。共にネオン街を守っていた保安官仲間');await storySay('pink','なぜ魔王軍に・・！');await storySay('money','悪いやつではなかったはずよ！');await storySay('jessie','なぜネオン街を捨てた！');await storySay('boss-ace','捨ててなどいない。お前と同じだモブジェシー・・！');await storySay('denden','それでも戦うでやんす！！');
  $('#storyScene').hidden=true;await startDemonAceStoryBattle();
  await openStoryScene('demonCastle',0);await storyShowGuest('boss-ace',{slow:true});await storySay('boss-ace','俺はまだ・・消えるわけにはいかない・・');await storySay('denden','オイラたちの勝ちでやんす！');await storyNarrate('？？？「情けない」');await storyShowGuests(['boss-ace','boss-maou-castle'],{slow:true});await storySay('boss-maou-castle','我の側近が無様な姿を晒すとは');await storySay('boss-ace','申し訳ありません・・');await storySay('pink','魔王であります！！');await storySay('boss-maou-castle','まあよい。一度引き上げるぞ');await storySay('jessie','逃がさないわよ！');await storyFlash();await storySay('boss-ace','グッ・・・！');await storySay('boss-maou-castle','随分と嫌われたようだな。行くぞ');await storyHideGuests();await storySay('denden','待つでやんす！！');await storySay('money','臆病者！');await storySay('desert','城内にいるはずだ。先へ進むぞ！');
}

// ===== v74 FINAL GRASSLAND2 / TETSU CANONICAL =====
Object.assign(STORY_EVENTS,{
  'arrival:grassland2':{worldId:'grassland2',area:0,steps:[
    ['say','pink','この場所ももう懐かしいですね・・\n急ぎましょう\nモブホークと再び決戦です！'],['sayOff','???','待つでござる！'],['guestSlow','tetsu'],
    ['say','tetsu','勇者様でござるな？\n拙者、逃走中の囚人サムライ\nモブテツと申すでござる！'],['say','denden','わ、悪いやつでやんすね！？'],
    ['say','tetsu','誤解しないで欲しいでござる！\n拙者、可愛いという理由で捕まったでござる！'],['say','money','えー・・\nじゃあ私も捕まるじゃない'],
    ['say','denden','(狂暴過ぎて捕まえられないでやんす)'],['sayRed','money','聴こえてるわよ！'],['say','denden','ご、ごめんでやんす！'],
    ['say','nekoku','お前、オトナシの国出身だな？\nオラ、同じ匂いを知ってる'],['say','tetsu','如何にも！オトナシの国のサムライ！\n魔王を討伐すべく旅をしているでござる！'],
    ['say','desert','つまり味方だな\nどうする？'],['say','pink','もちろん大歓迎です！\nモブテツさん、よろしくお願いします！'],['say','nyoro','賑やかになるニョロ！'],['join','tetsu','モブテツが仲間に加わった！']
  ]},
  'pre:grassland2:0':{worldId:'grassland2',area:0,steps:[['guest','g2-tsuru'],['say','g2-tsuru','申し訳ないが、お帰りいただこうか\n勇者を通すわけにはいかないんだ'],['say','pink','そうはいかない！'],['say','denden','いざ勝負でやんす！'],['say','tetsu','初陣でござる！']]},
  'post:grassland2:0':{worldId:'grassland2',area:0,steps:[['guest','g2-tsuru'],['say','g2-tsuru','ク・・ここは引かせてもらおう'],['hideGuest'],['say','desert','同じ地だと思って油断しないことだな\nモブホークもきっと、\n強大な力を得ているだろう']]},
  'pre:grassland2:1':{worldId:'grassland2',area:1,steps:[['guest','g2-merakero'],['say','g2-merakero','メラメラメラーーー！'],['say','nyoro','気合い入っているニョロね・・！'],['say','nekoku','オラ、カエルは苦手だ'],['say','money','ちょっと可愛いわね']]},
  'post:grassland2:1':{worldId:'grassland2',area:1,steps:[['say','money','アツいカエルだったわね'],['say','denden','漢でやんした！'],['say','tetsu','強い心を持っていたでござる！']]},
  'pre:grassland2:2':{worldId:'grassland2',area:2,steps:[['guest','g2-keroking'],['say','g2-keroking','私はケロの王ケロキング！\nモブホーク様の命により\nお前たちをここで仕留める！'],['say','desert','受けて立つ！'],['say','pink','ここを倒せばもうすぐであります！\nみなさん頑張りましょう！']]},
  'post:grassland2:2':{worldId:'grassland2',area:2,steps:[['guest','g2-keroking'],['say','g2-keroking','強い・・これが勇者か\nだが\nモブホーク様は負けない'],['hideGuest'],['say','desert','さあ、先へ進もう'],['say','nyoro','ボスとの対決ニョロ！']]},
  'pre:grassland2:3':{worldId:'grassland2',area:3,steps:[['guest','boss-hawk2'],['say','boss-hawk2','クククク・・・\nようやく来たな'],['say','pink','往生際が悪いであります！'],['say','money','あんた一度負けてるって聞いたよ？'],['say','nekoku','オラ焼き鳥大好きだ'],['say','boss-hawk2','勇者よ、お前を認め\n魔王様から力を得た\n新たな私の強さ\n受け止める勇気があるかな？'],['say','denden','みんな、構えるでやんす！'],['guests',['g2-tsuru','boss-hawk2']],['say','g2-tsuru','私も忘れてもらっては困る'],['say','money','一緒に片付けてあげるわ！'],['say','tetsu','いざ！勝負でござる！']]},
  'post:grassland2:3':{worldId:'grassland2',area:3,steps:[['guest','boss-hawk2'],['say','boss-hawk2','貴様ら如きに・・・'],['hideGuest'],['say','pink','なんとか勝てました・・！'],['say','desert','レコードは手に入らないが、\n必要な戦いだったな'],['say','nekoku','仲間が増えたぞ'],['say','denden','モブテツ強いでやんす！'],['say','tetsu','このまま魔王まで行くでござる！'],['say','pink','まずは、王様に報告に行きましょう！']]}
});


// ===== v74 FINAL TETSU CONTINUITY AFTER GRASSLAND2 =====
Object.assign(STORY_EVENTS,{
  'arrival:tribe':{worldId:'tribe',area:0,layout:'partyLeftGuestRight',steps:[
    ['say','pink','なんだか不思議な雰囲気でありますね'],['say','nekoku','オラ初めて見る景色だ'],['say','denden','ビリビリしそうな香りがするでやんす'],['say','desert','で、そこのお前が案内でもしてくれるのか？'],['say','tetsu','隠れても無駄でござる'],['sayOff','???','あら、気が付いていたの？\n中々やるわね'],['guestRight','jessie'],['say','jessie','私はネオン街の保安官\n通報を受けてこの村に来たの\nモブジェシーよ\nよろしくね'],['say','money','ネオン街！？私も、私も！'],['say','jessie','知っているわ\nモブマニーでしょ？私を覚えてない？'],['say','money','うーん\n私、魔王に封印されてたから'],['say','jessie','そうね'],['say','money','え？'],['say','jessie','まあ、いいわ'],['say','desert','この村はどういう村なんだ？'],['say','jessie','魔王軍と直接は関係ないわ\nただ、あの町と関係はあるの'],['say','pink','あの町と繋がりが！？'],['say','jessie','ええ、ネオン街、部族村\nこの2つがあの町と大きく関係がある'],['say','pink','詳しく知りたいであります！'],['say','jessie','それはまたいずれね\nとにかく、この村は危険がいっぱいよ\n手を貸してあげるから油断しないことね'],['tempActor','jessie']
  ]},
  'pre:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[['guest','t-kukuri'],['say','t-kukuri','タチサレ・・'],['say','pink','幹部の登場であります！'],['say','tetsu','強敵でござる！'],['say','denden','気合い入れるでやんす！']]},
  'post:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[['say','denden','不気味だったでやんす・・'],['say','jessie','あなたたちも十分不気味よ'],['say','pink','なんてこと言うでありますか！'],['say','nyoro','喧嘩はやめるニョロ～！']]},
  'pre:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[['guest','t-tough'],['say','t-tough','全く、大変な時に来たね君たち'],['say','pink','まともそうな人であります！'],['say','desert','そんなはずがないだろう'],['say','t-tough','まともかはともかく\n俺は連中とは違うよ'],['say','jessie','でも戦うのよね？'],['say','t-tough','これはこれは保安官\nまさか戦うことになるとは'],['say','nekoku','ん？'],['say','t-tough','まあお喋りはこれくらいにして\nやりますか\n他に道はないだろう？'],['say','desert','そうだな\n立ち止まるわけにはいかない！']]},
  'post:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[['say','nyoro','強かったニョロ・・'],['say','denden','この村はみんな強いでやんす'],['say','jessie','さあ、しっかり休んで先へ行きましょう'],['say','money','あの人凄く変だった\n何者なんだろう？'],['say','desert','迷いの原因になるようなことは考えるな\n戦いの基本だ']]},
  'pre:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[['guests',['t-hisui','t-ryugo']],['say','t-hisui','天よ・・こやつらに災いを'],['say','t-ryugo','もてなすぞ、客人'],['say','tetsu','これは激戦の予感でござる'],['say','nekoku','強そうな2人だなー'],['say','money','みんな最初から飛ばしていくわよ！']]},
  'post:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[['say','money','なによ、これが途中に出て来る敵の強さ？'],['say','tetsu','王の器でござったな'],['say','jessie','おかしい・・'],['say','desert','どうした？'],['say','jessie','この2人はこの村の長だったはず'],['say','money','なんで戦う前に言わないのよ！'],['say','jessie','腰が引けちゃうでしょ？'],['say','nyoro','それはそうだニョロ'],['say','desert','ということは\nさらに上がいるということか'],['say','jessie','そうなるわね'],['say','pink','大丈夫！\n力を合わせて進むであります！\n・・・・\nあります！'],['say','jessie','すっかり怖がっちゃって・・'],['say','denden','でも進むしかないでやんす！']]},
  'post:tribe:3':{worldId:'tribe',area:3,extras:['jessie'],steps:[['say','jessie','任務完了'],['say','desert','魔王とは、一体どこまで・・'],['say','pink','とりあえず王様に報告です！\nどうやらここにレコードは無いようです'],['say','jessie','私も行くわ\n魔王を倒さないと\n何も進まなそうだしね'],['say','nyoro','心強いニョロ！\nモブジェシー、強いニョロ！'],['say','tetsu','いつか手合わせ願いたいでござる'],['join','jessie','モブジェシーが仲間に加わった！']]},

  'arrival:rural2':{worldId:'rural2',area:0,steps:[['say','denden','故郷でやんす～！'],['say','jessie','いい空気・・\n世界中こうだといいのに'],['say','money','でも、嫌な気配は感じるわ'],['say','tetsu','恐らく魔王軍の幹部がいるでござるな'],['say','pink','出発であります！']]},
  'post:rural2:0':{worldId:'rural2',area:0,steps:[['say','jessie','世界が変われば\n一曲お願いしてみたいわね'],['say','nyoro','魔王を倒せば平和が戻るニョロ！']]},
  'pre:rural2:1':{worldId:'rural2',area:1,steps:[['guests',['r2-rapty','r2-tira']],['say','r2-rapty','我ら！'],['say','r2-tira','ジュラシック！'],['sayDual','r2-rapty','ヤベージャンズ！！','r2-tira','ヤベージャンズ！！'],['say','denden','この町の悪ガキコンビでやんす！'],['say','jessie','そして魔王軍の幹部でもある'],['say','money','お仕置きが必要ね！'],['say','tetsu','先手必勝でござる！']]},
  'post:rural2:1':{worldId:'rural2',area:1,steps:[['say','pink','凄い連携でありましたね'],['say','desert','我々も連携力を磨く必要があるな'],['say','nekoku','大丈夫、みんな仲良しだ'],['say','denden','もちろんでやんす！']]},
  'pre:rural2:2':{worldId:'rural2',area:2,steps:[['guest','r2-kuukai'],['say','r2-kuukai','タマシイとは\n人の心なり\nタマシイとは\n魔物の悪意なり'],['say','money','嫌なオーラね・・'],['say','tetsu','怨念でござるな'],['say','jessie','さっさと片付けましょう'],['say','nyoro','さ、さむいニョロ・・'],['say','nekoku','わたあめ・・'],['say','denden','声出していくでやんす！！！！']]},
  'post:rural2:2':{worldId:'rural2',area:2,steps:[['say','desert','こいつがボスではないようだな'],['say','pink','では一体・・'],['say','denden','なんだかムズムズするでやんす'],['say','tetsu','先へ進むでござる']]},
  'pre:rural2:3':{worldId:'rural2',area:3,steps:[['guest','boss-umidenden'],['say','denden','！？'],['say','boss-umidenden','ん？\nよう\n久しぶりだな落ちこぼれ'],['say','desert','何者だ？'],['say','denden','オイラと同じ\nある国の護衛隊長でやんす\n王国最強の戦士でやんす・・！'],['say','money','なんで魔王軍に？'],['say','boss-umidenden','退屈だったからさ\n魔王様は\n俺の退屈を埋めてくれる\n毎日最高の気分だぜ'],['say','nekoku','情けないやつだなー'],['say','desert','その通りだな\nその退屈終わらせてやろう！'],['say','tetsu','王国最強の戦士\nサムライとして負けられぬでござる！']]},
  'post:rural2:3':{worldId:'rural2',area:3,steps:[['say','money','こいつも強かったわね'],['say','desert','名前に恥じぬ実力だった'],['say','jessie','ねえ、その王国って今もあるの？'],['say','denden','・・・・'],['say','money','まあ、\n言いたくないこともあるわよね'],['say','tetsu','詮索は無用でござる'],['say','pink','王様に報告に行きましょう！']]},

  'pre:neon2:0':{worldId:'neon2',area:0,steps:[['guest','n2-tiger'],['say','n2-tiger','侵入者発見、排除する'],['say','money','しん・・にゅう・・\n侵入・・者・・'],['say','jessie','急いだ方が良さそうね'],['say','tetsu','速攻で終わらせるでござる！']]},
  'pre:neon2:1':{worldId:'neon2',area:1,steps:[['guests',['n2-tama','n2-kodora']],['say','nyoro','なんだかキュートな子達だニョロ'],['say','jessie','油断しないで\nネオン街にか弱い子なんていない'],['say','desert','お前達を見ていれば分かる'],['say','denden','でも可愛いでやんす～'],['say','money','・・・・・'],['say','tetsu','モブマニー、拙者に掴まるでござる'],['say','money','・・ありがとう']]},
  'post:neon2:3':{worldId:'neon2',area:3,steps:[['guest','boss-neomaster'],['say','jessie','私たちの勝ちね・・'],['say','boss-neomaster','素晴らしい力です\n魔王の力は強大\nしかし、あなたたちなら・・'],['say','money','マスター・・\nネオン街の、マスター・・'],['say','nyoro','モブマニー、\nまだ良くならないニョロ・・'],['say','tetsu','しかし何か方法があるはずでござる'],['say','boss-neomaster','モブマニー\n最後に私の力を'],['energyTransfer','boss-neomaster','money'],['say','jessie','マスター・・！'],['softLight'],['hideGuest'],['say','money','・・・・あれ？'],['say','denden','正気に戻ったでやんすか！？'],['say','desert','気分はどうだ？'],['say','money','うん、平気\n意識はあったんだけど\n頭がもやもやしてたの\nでももう大丈夫！\n次へ行きましょう！'],['say','tetsu','良かったでござる！'],['say','money','ありがとう！あんた優しいのね'],['say','tetsu','当然のことをしたまででござる！'],['fadePartyExcept','jessie'],['say','jessie','マスター・・\n必ずやり遂げて見せます']]},

  'arrival:magma2':{worldId:'magma2',area:0,steps:[['say','nyoro','帰って来たニョロ～！\nやっぱり落ち着くニョロ'],['say','denden','故郷は特別でやんすからね～'],['say','money','相変わらず暑いわね'],['say','tetsu','これは良い修行になるでござる'],['say','jessie','ここも強敵だらけよ\n油断せず進みましょう']]},
  'pre:magma2:1':{worldId:'magma2',area:1,steps:[['guest','m2-salamander'],['say','denden','オイラやっぱり\n暑いの嫌いでやんす'],['say','nyoro','あいつはこのエリアでも\n特に熱いモンスターニョロ！'],['say','jessie','モブサラマンダーね？\n聞いたことがあるわ'],['say','pink','倒して、\n少しでも涼しくするであります！'],['say','desert','やけどに注意しつつ、一気に倒すぞ！']]},
  'pre:magma2:2':{worldId:'magma2',area:2,steps:[['guest','m2-buster'],['say','m2-buster','勇者一行よ\nお前達の命運もここまでだ'],['say','desert','なんだこいつは・・\nモブドラゴンと同じ魔力？'],['say','nyoro','あいつは魔界に行ったはずニョロ・・\nモブドラゴンと\n同じくらいの力を持っているニョロ！'],['say','m2-buster','その通り\n我らは魔王様より\n同じ魔力を与えられている'],['say','money','同じ？\nなんでそんなに強気なの？'],['say','denden','オイラたちは\nモブドラゴンを倒しているでやんす！'],['say','m2-buster','無知と言うのは楽なものだな'],['say','tetsu','この者\n力を隠しているでござる'],['say','m2-buster','ほう\nお前は見込みがありそうだ\nでは、始めるぞ']]},
  'post:magma2:2':{worldId:'magma2',area:2,steps:[['guest','m2-buster'],['say','m2-buster','これで完成するのだ\n全てを滅ぼす\n最強のドラゴンが・・'],['hideGuest'],['say','denden','もっと凄いドラゴン・・\n会ってみたいでやんす'],['say','nekoku','きっと大きいぞ'],['say','jessie','しっかり回復してから行きましょう']]}
});

async function runStorySteps(steps=[]){
  for(const st of steps){const [type,a,b,c,d]=st;
    if(type==='say')await storySay(a,b,c,d);
    else if(type==='sayRed')await storySayRed(a,b,c,d);
    else if(type==='sayAs')await storySay(a,b,c,a);
    else if(type==='sayDual')await storySayDual(a,b,c,d);
    else if(type==='sayOff')await storySay(a,b,c||a,null);
    else if(type==='narrate')await storyNarrate(a);
    else if(type==='guest')await storyShowGuest(a);
    else if(type==='guests')await storyShowGuests(a,b||{});
    else if(type==='hideGuests')await storyHideGuests();
    else if(type==='guestRight')await storyShowGuest(a,{side:'right'});
    else if(type==='guestSlow')await storyShowGuest(a,{slow:true});
    else if(type==='guestDrop'){await storyShowGuest(a,{drop:true});await storyImpact(b||'ドン！ッ');}
    else if(type==='guestDropDodge'){await storyShowGuest(a,{drop:true});await storyImpact(b||'ドン！ッ',true);}
    else if(type==='hideGuest')await storyHideGuest();
    else if(type==='exclaim')await storyExclaim(a);
    else if(type==='flash')await storyFlash();
    else if(type==='impact')await storyImpact(a||'ドン！ッ',!!b);
    else if(type==='join')await storyJoinStep(a,b);
    else if(type==='joinKeepGuest')await storyJoinKeepGuest(a,b);
    else if(type==='tempActor')await storyTempActor(a);
    else if(type==='joinSilent')storyJoinSilent(a);
    else if(type==='rewardDrink')await storyRewardDrink(a,b);
    else if(type==='guestTransform')await storyTransformGuest(a);
    else if(type==='energyTransfer')await storyEnergyTransfer(a,b);
    else if(type==='darkEnergyTransfer')await storyDarkEnergyTransfer(a,b);
    else if(type==='darkGlowGuest')await storyDarkGlowGuest();
    else if(type==='softLight')await storySoftLight();
    else if(type==='fadePartyExcept')await storyFadePartyExcept(a);
    else if(type==='fadeActor')await storyFadeActor(a);
    else if(type==='lilithSplit')await chooseLilithSplit();
    else if(type==='wait')await fixedDelay(Number(a)||500);
  }
}
async function startAceStoryBattle(){
  const bg=storySceneBg('neon',3);return new Promise(async resolve=>{scriptedBattleResolve=resolve;await startBattleLoaded({mode:'story',returnScreen:'adventure',enemyConfigs:[{id:'boss-ace',level:38}],party:state.party,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:true,scriptedTurnLimit:3,scriptedImmortalEnemy:true,scriptedImmortalParty:true,storyLabel:'モブエース EVENT BATTLE'});});
}
async function runNeonPostStory(){
  await openStoryScene('neon',3);
  await storySay('money','いてて・・');await storySay('denden','チカチカするでやんす・・');await storySay('desert','危ないところだったな');await storySay('pink','・・・？\n何か来ます！');
  await storyNarrate('まさかやつが敗れるとはな・・');await storyShowGuest('ace',{slow:true});
  await storySay('ace','我は\n魔王様の側近の1人\nモブエース');await storySay('money','モブエース！？');await storySay('desert','知っているのか？');await storySay('money','以前の王、モブネオンキングの息子・・');await storySay('ace','ほう、我を知る者もいるのか');await storySay('money','気を付けて！\nあいつは次の王と言われていた戦士よ！');await storySay('ace','魔王様のため、ここで消えてもらう！');
  $('#storyScene').hidden=true;await startAceStoryBattle();
  await openStoryScene('neon',3);await storyShowGuest('ace',{slow:true});
  await storySay('ace','見事だ\nここまでとは思わなかったぞ');await storySay('pink','なんて強さでありますか・・');await storySay('ace','一先ずは引いてやろう\n次に会う時が楽しみだ');await storyHideGuest();await storySay('desert','もっと強さが必要だな');await storySay('money','強力な武器も必要ね');await storyNarrate('4つ目のレコードを手に入れた！');
}
async function runStoryEvent(key,forceHomeOverride=false){
  const ev=STORY_EVENTS[key];if(!ev||storyDone(key)||storyBusy)return false;storyBusy=true;let ok=false;
  try{if(ev.custom==='neonPost')await runNeonPostStory();else if(ev.custom==='demonCastleArrival')await runDemonCastleArrivalStory();else{await openStoryScene(ev.worldId,ev.area||0,ev.layout||'default',ev.extras||[]);await runStorySteps(ev.steps||[]);}markStoryDone(key);ok=true;}finally{storyBusy=false;}
  const goHome=!!(ev.forceHome||forceHomeOverride);if(ok){await closeStoryScene(goHome);if(!goHome&&screens.adventure.classList.contains('active'))renderAdventure();}return ok;
}
async function maybeRunArrivalStory(){const w=currentWorld();if(!w)return false;const key=`arrival:${w.id}`;if(STORY_EVENTS[key]&&!storyDone(key))return await runStoryEvent(key);return false;}
async function runPendingPostStory(suppressArrival=false,forceHomeAfter=false){const p=state.adventure.pendingPostStory;if(!p?.key)return false;const key=p.key;if(storyDone(key)){state.adventure.pendingPostStory=null;saveAdventure();return false;}const ran=await runStoryEvent(key,forceHomeAfter);if(ran){state.adventure.pendingPostStory=null;saveAdventure();const ev=STORY_EVENTS[key];if(!suppressArrival&&!forceHomeAfter&&!ev?.forceHome){renderAdventure();showScreen('adventure');await maybeRunArrivalStory();}}return ran;}
async function handleAdventureEntry(){if(state.adventure.awaitingReport){renderAdventure();return;}if(state.adventure.pendingPostStory){if(await runPendingPostStory())return;}await maybeRunArrivalStory();}

function adventureAreaTheme(){
  const id=currentWorld()?.id||'';
  if(['grassland','grassland2'].includes(id))return'green';
  if(['desert','desert2'].includes(id))return'beige';
  if(['rural','rural2'].includes(id))return'sky';
  if(['magma','magma2'].includes(id))return'red';
  if(['neon','neon2'].includes(id))return'neon';
  if(id==='sea')return'blue';
  if(id==='tribe')return'brown';
  if(id==='demonCastle')return'redblack';
  if(id==='unfinishedBook')return'white';
  return'burgundy';
}
function applyAdventureAreaTheme(){
  const theme=adventureAreaTheme();
  for(const el of [$('#campOverlay'),$('#exploreOverlay')])if(el){
    [...el.classList].filter(c=>c.startsWith('area-theme-')).forEach(c=>el.classList.remove(c));
    el.classList.add(`area-theme-${theme}`);
  }
}
function renderAdventure(){
  const w=currentWorld(),area=currentArea(),bi=state.adventure.battleIndex||0,report=state.adventure.awaitingReport;
  $('#adventureStageTitle').textContent=state.adventure.completed?'魔王城までCLEAR':w.name;
  $('#adventureProgress').textContent=state.adventure.completed?'CLEAR':report?'王へ報告':`${area.name}　戦闘 ${bi+1}/3`;
  $('#areaName').textContent=state.adventure.completed?'魔王城までの冒険完了':report?`${w.name}・CLEAR`:`${w.name}・${area.name}`;
  const pending=state.adventure.pendingEncounter;
  $('#areaDescription').textContent=state.adventure.completed?'現在設定済みの草原～魔王城ルートをクリアしました。Lv上限が120になりました。':report?'次の地域へ進むには、お城の「王の間」で国王へ報告してください。':state.adventure.battleReady?(pending?.bossBattle?'強い気配がする。準備ができたら戦闘へ。':'敵の気配を感じる。何が現れるかは戦闘まで分からない。'):`探索 → バトルを3回行うと次のAREAへ進みます。3戦目は中ボス/ボスです。`;
  setImage($('#adventureBg'),area.bg,w.fieldFallback);setAdventureVisualLoading(true);
  const partyRoot=$('#adventureParty');partyRoot.innerHTML=state.party.slice(0,4).map(([id,lv])=>{const p=player(id);return p?`<button type="button" data-player-detail="${p.id}" aria-label="${p.name}のステータス"><img data-adventure-party-img src="${versionedPlay(p.image)}" alt="${p.name}" decoding="async"><small>Lv${lv}</small></button>`:'';}).join('');$$(`[data-player-detail]`,partyRoot).forEach(b=>b.onclick=e=>{e.stopPropagation();openPlayerDetail(b.dataset.playerDetail);});
  const blocked=!!report||state.adventure.completed||storyBusy;
  const btn=$('#fieldBattleBtn');btn.disabled=!state.adventure.battleReady||blocked;btn.classList.toggle('locked',btn.disabled);$('#fieldBattleHint').textContent=state.adventure.completed?'CLEAR':report?'王へ報告':state.adventure.battleReady?(pending?.bossBattle?'強敵の気配':'戦闘可能'):'探索が必要';$('#exploreBtn').disabled=state.adventure.battleReady||blocked;$('#campBtn').disabled=blocked;const campSmall=$('#campBtn small');if(campSmall){const cr=areaCampRecord(),used=[cr.tent,cr.chair,cr.drink].filter(Boolean).length;campSmall.textContent=report?'王へ報告してください':`休憩 ${used}/3・パーティー常時`;}const abandon=$('#abandonAdventureBtn');if(abandon){abandon.hidden=!adventureRunActive();abandon.disabled=!!report||storyBusy;}bindImages($('#adventureScreen'));applyAdventurePartyScale();applyAdventureAreaTheme();
}
function currentAreaKey(){return `${state.adventure.worldIndex||0}:${state.adventure.areaIndex||0}`;}
function areaCampRecord(){
  if(!state.adventure.campUsed||typeof state.adventure.campUsed!=='object')state.adventure.campUsed={};
  const key=currentAreaKey(),raw=state.adventure.campUsed[key];
  if(!raw||raw===true||typeof raw!=='object')state.adventure.campUsed[key]={tent:false,chair:false,drink:false};
  return state.adventure.campUsed[key];
}
function areaCampActionUsed(action){return !!areaCampRecord()[action];}
function markAreaCampActionUsed(action){const rec=areaCampRecord();rec[action]=true;state.adventure.campUsed[currentAreaKey()]=rec;saveAdventure();}
function areaCampUsed(){const r=areaCampRecord();return !!(r.tent&&r.chair&&r.drink);}
function ensureAdventureVitals(){
  if(!state.adventure.vitals||typeof state.adventure.vitals!=='object')state.adventure.vitals={};
  for(const [id,lv] of state.party){const p=player(id);if(!p)continue;const st=baseStats(p,lv),v=state.adventure.vitals[id];if(!v)state.adventure.vitals[id]={hp:st.maxHp,mp:st.maxMp,dead:false,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0}};else{v.hp=clamp(Number(v.hp)||0,0,st.maxHp);v.mp=clamp(Number(v.mp)||0,0,st.maxMp);v.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0,...(v.status||{})};v.dead=!!v.dead||v.hp<=0;}}
  saveAdventure();return state.adventure.vitals;
}
function weightedPickItem(){const bonus=partyExploreFigureBonus(),weighted=GAME_ITEMS.map(x=>({x,w:x.weight+bonus*Math.max(0,18-x.weight)})),total=weighted.reduce((s,o)=>s+o.w,0);let r=Math.random()*total;for(const o of weighted){r-=o.w;if(r<=0)return o.x;}return GAME_ITEMS[0];}
const AREA_FLAVOR={grassland:['広大な草原が広がっている'],grassland2:['広大な草原が広がっている'],desert:['歴史的建造物が見える'],desert2:['歴史的建造物が見える'],rural:['とても良い空気だ'],rural2:['とても良い空気だ'],neon:['未来を感じる素晴らしい街だ'],neon2:['未来を感じる素晴らしい街だ'],magma:['マグマが煮えたぎっている'],magma2:['マグマが煮えたぎっている'],sea:['様々な種族が遊泳している'],tribe:['不気味な音が響いている・・'],demonCastle:['邪悪なオーラを感じる'],matrix:['デジタルな世界が広がっている'],prison:['長居したくない光景だ'],demonWorld:['凄まじい魔力をたくさん感じる'],roseCountry:['悪の国だが、美しい国だ'],unfinishedBook:['こんな世界があるのか','無力で惨めになってくる'],mobKingdom:['全ての始まり','そして全ての終わり'],roseCastle:['薔薇がとても美しい国だ'],glacier:['壮大な光景だ'],space:['人類はちっぽけだ','そう思えるくらい壮大だ']};
async function showExplorePhase(title,sub='',img='',duration=1050){
  applyAdventureAreaTheme();const ov=$('#exploreOverlay'),load=$('#exploreLoading'),reward=$('#exploreReward');ov.hidden=false;$('#exploreTitle').textContent='探索結果';load.hidden=true;reward.hidden=false;$('#exploreRewardText').textContent=title;$('#exploreRewardSub').textContent=sub||'';const im=$('#exploreRewardImg');if(img){im.hidden=false;im.src=img;bindImage(im);}else im.hidden=true;await fixedDelay(duration);ov.hidden=true;
}
async function runExploreDots(){applyAdventureAreaTheme();const ov=$('#exploreOverlay'),load=$('#exploreLoading'),reward=$('#exploreReward');ov.hidden=false;$('#exploreTitle').textContent='勇者一行は周囲を探索した';reward.hidden=true;load.hidden=false;for(let i=0;i<6;i++){const n=i%3+1;$('#exploreDots').textContent='.'.repeat(n);await fixedDelay(220);}load.hidden=true;}
function makeAmbushConfigs(){const w=currentWorld(),count=w?.id==='grassland'?rint(1,2):rint(2,4),used=[],list=[];for(let i=0;i<count;i++){let t=weightedNormalTemplate(w,used);if(!t)t=weightedNormalTemplate(w,[]);if(!t)break;used.push(t.id);list.push({id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||1)});}return list;}
function completeExplorationUnlock(){const enc=createAdventureEncounter();state.adventure.pendingEncounter=enc;state.adventure.battleReady=true;saveAdventure();renderAdventure();}
async function startExploreAmbush(){const configs=makeAmbushConfigs(),w=currentWorld(),area=currentArea();if(!configs.length){completeExplorationUnlock();return;}$('#exploreOverlay').hidden=true;await startBattleLoaded({mode:'adventure',returnScreen:'adventure',enemyConfigs:configs,party:state.party,useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,bossBattle:false,explorationAmbush:true,adventureLabel:`${w.name} 探索遭遇`});}
function rollExploreRecord(){const bonus=partyExploreFigureBonus(),mul=1+bonus,r=Math.random();if(r<.05*mul)return'36';if(r<.11*mul)return'37';if(r<.15*mul)return'38';return'';}
async function maybeExploreRecord(){const id=rollExploreRecord();if(!id)return;const it=itemData(id);addItem(id,1);await showExplorePhase(`${it.name}を見つけた！`,'1つ入手',it.image,1550);}
async function exploreField(){
  if(state.adventure.completed||state.adventure.awaitingReport||state.adventure.battleReady||storyBusy)return;
  $('#exploreBtn').disabled=true;await runExploreDots();const r=Math.random();
  if(r<.70){const it=weightedPickItem();addItem(it.id,1);await showExplorePhase(`${it.name}を見つけた！`,'1つ入手',it.image,1550);await maybeExploreRecord();completeExplorationUnlock();}
  else if(r<.90){const w=currentWorld(),arr=AREA_FLAVOR[w.id]||[`${w.name}を見渡した`];await showExplorePhase(pick(arr));await maybeExploreRecord();completeExplorationUnlock();}
  else{await showExplorePhase('敵と遭遇した！','戦闘になります');await maybeExploreRecord();await startExploreAmbush();}
}

/* ===== CAMP ===== */
let campSwapIndex=null;
function openCamp(){applyAdventureAreaTheme();renderCampMain();$('#campOverlay').hidden=false;}
function closeCamp(){$('#campOverlay').hidden=true;campSwapIndex=null;}
function renderCampMain(){const r=areaCampRecord();$('#campTitle').textContent=`キャンプ / ${currentArea()?.name||''}`;$('#campUsageText').textContent='テント・椅子・ドリンクはこのAREAでそれぞれ1回 / パーティーはいつでも利用可能';$('#campTentCount').textContent=tentCount();$('#campMainMenu').hidden=false;$('#campSubPanel').hidden=true;$$('[data-camp-action]',$('#campMainMenu')).forEach(b=>{const a=b.dataset.campAction,used=a==='party'?false:!!r[a];b.classList.toggle('camp-used',used);b.disabled=used;if(a==='party')b.disabled=false;});bindImages($('#campOverlay'));}
async function campFadeMessage(text,work){const f=$('#campFade');$('#campFadeText').textContent='';f.hidden=false;await nextPaint();f.classList.add('dark');await fixedDelay(620);if(work)await work();$('#campFadeText').textContent=text;await fixedDelay(900);f.classList.remove('dark');await fixedDelay(620);f.hidden=true;$('#campFadeText').textContent='';}
async function campSleepTransition(recoveryText,work){
  const f=$('#campFade'),txt=$('#campFadeText');if(!f)return;
  txt.textContent='ZZZ・・・';f.hidden=false;await nextPaint();f.classList.add('dark');await fixedDelay(850);if(work)await work();await fixedDelay(350);f.classList.remove('dark');await fixedDelay(500);f.hidden=true;txt.textContent='';
  await narrationDialog(recoveryText);
}
function healCampVitals(ratio=1){const v=ensureAdventureVitals();for(const [id,lv] of state.party){const p=player(id),st=baseStats(p,lv),x=v[id];if(!x||x.dead||x.hp<=0)continue;if(ratio>=1){x.hp=st.maxHp;x.mp=st.maxMp;}else{const healRate=Math.min(1,ratio*(1+Number(figureEffectsFor(id).healBoost||0)));x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*healRate));x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*ratio));}}saveAdventure();}
async function useCampTent(){if(areaCampActionUsed('tent'))return narrationDialog('このAREAではテントをすでに使用しました。');if(tentCount()<1)return narrationDialog('モブテントを所持していません！');const ans=await narrationDialog(`テントで休みますか？\nモブテントを1つ消費します`,[['はい','yes','primary'],['いいえ','no']]);if(ans!=='yes')return;if(!consumeItem('mob-tent',1))return;await campSleepTransition('テントで休み、パーティーは全回復した！',async()=>{healCampVitals(1);markAreaCampActionUsed('tent');saveCampCheckpoint();});closeCamp();renderAdventure();}
async function useCampChair(){if(areaCampActionUsed('chair'))return narrationDialog('このAREAでは椅子をすでに使用しました。');const ans=await narrationDialog('椅子で休みますか？',[['はい','yes','primary'],['いいえ','no']]);if(ans!=='yes')return;await campSleepTransition('椅子で休み、パーティーのHPとMPが少し回復した！',async()=>{healCampVitals(.30);markAreaCampActionUsed('chair');saveCampCheckpoint();});closeCamp();renderAdventure();}
function campBackButton(){return `<button class="camp-back" data-camp-back type="button">← 戻る</button>`;}
function renderCampPartyMenu(){const p=$('#campSubPanel');$('#campMainMenu').hidden=true;p.hidden=false;p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>PARTY</small><h3>パーティー</h3></div><div class="camp-option-list"><button data-camp-party="formation" type="button">編成<small>MAIN / SUPER SUB / RESERVE の並び替え</small></button><button data-camp-party="equipment" type="button">装備<small>装備変更とステータス差分</small></button><button data-camp-party="inventory" type="button">持ち物<small>所持アイテムを使用</small></button><button data-camp-party="status" type="button">状態確認<small>HP・MP・状態を確認</small></button></div>`;bindCampSubEvents();}
function bindCampSubEvents(){$('[data-camp-back]',$('#campSubPanel'))?.addEventListener('click',renderCampMain);$$('[data-camp-party]',$('#campSubPanel')).forEach(b=>b.onclick=()=>{const a=b.dataset.campParty;if(a==='formation')renderCampFormation();else if(a==='equipment')renderCampEquipment();else if(a==='inventory')renderCampInventory();else renderCampStatus();});}
function renderCampFormation(){const p=$('#campSubPanel'),hint=campSwapIndex===null?'入れ替えたいメンバーを1人タップしてください':'入れ替えるメンバーを選んでください';p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>FORMATION</small><h3>編成</h3><p>${hint}</p></div><div class="camp-formation">${state.party.map(([id,lv],i)=>{const q=player(id),z=zoneForIndex(i);return `<button class="camp-member ${campSwapIndex===i?'selected':''}" data-camp-swap="${i}" type="button"><img src="${versionedPlay(q.image)}" alt="${q.name}"><span><small>${z.key} ${z.n}</small><b>${q.name}</b><em>Lv${lv}</em></span></button>`;}).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-camp-swap]',p).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.campSwap);if(campSwapIndex===null){campSwapIndex=i;return renderCampFormation();}if(campSwapIndex===i){campSwapIndex=null;return renderCampFormation();}[state.party[campSwapIndex],state.party[i]]=[state.party[i],state.party[campSwapIndex]];campSwapIndex=null;saveParty();state.training.party=state.party.map(x=>[...x]);saveCampCheckpoint();renderCampFormation();renderAdventure();});}
function renderCampEquipment(){
  const p=$('#campSubPanel');if(!campEquipPlayerId||!state.party.some(x=>x[0]===campEquipPlayerId))campEquipPlayerId=state.party[0]?.[0];
  const q=player(campEquipPlayerId),lv=currentPlayerLevel(q.id),eq=equipmentFor(q.id);
  p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>EQUIPMENT</small><h3>装備</h3><p>キャラクターとスロットを選んで変更できます。</p></div>
  <div class="camp-equip-party">${state.party.map(([id])=>{const x=player(id);return `<button class="${x.id===q.id?'active':''}" data-camp-equip-player="${x.id}" type="button"><img src="${versionedPlay(x.image)}" alt="${x.name}"><b>${x.name}</b></button>`;}).join('')}</div>
  <div class="camp-equip-summary"><b>${q.name}</b><small>装備可能 ${weaponAllowedText(q)}</small><div class="equipment-stat-grid">${equipmentStatRows(q,lv,eq)}</div></div>
  <div class="camp-equip-slots">${equipmentSlotMarkup(q,'main',0,eq.main)}${equipmentSlotMarkup(q,'sub',0,eq.sub)}${eq.medals.map((id,i)=>equipmentSlotMarkup(q,'medal',i,id)).join('')}</div>`;
  bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-camp-equip-player]',p).forEach(b=>b.onclick=()=>{campEquipPlayerId=b.dataset.campEquipPlayer;renderCampEquipment();});$$('[data-equip-slot]',p).forEach(b=>b.onclick=()=>openWeaponPicker(q.id,b.dataset.equipSlot,Number(b.dataset.equipIndex||0),()=>{renderCampEquipment();saveCampCheckpoint();}));
}
function statusLabel(v){if(v?.dead||v?.hp<=0)return'ダウン';const a=[];if(v?.status?.poison>0)a.push('毒');if(v?.status?.burn>0)a.push('やけど');if(v?.status?.paralyze>0)a.push('マヒ');if(v?.status?.sleep>0)a.push('睡眠');if(v?.status?.stun>0)a.push('ひるみ');if(v?.status?.confuse>0)a.push('混乱');return a.length?a.join('・'):'健康';}
function renderCampStatus(){const p=$('#campSubPanel'),v=ensureAdventureVitals();p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>STATUS</small><h3>状態確認</h3></div><div class="camp-status-list">${state.party.map(([id,lv])=>{const q=player(id),st=baseStats(q,lv),x=v[id],fe=figureEffectsFor(id),res=['火','水','雷','風','地','光','闇','無'].map(k=>`${k}${Math.round((fe.resist[k]||0)*100)}%`).join('　');return `<button type="button" class="camp-status-card detailed" data-player-detail="${id}"><img src="${versionedPlay(q.image)}" alt="${q.name}"><div><b>${q.name} <em>Lv${lv}</em></b><small>HP ${Math.round(x.hp)}/${st.maxHp}</small><small>MP ${Math.round(x.mp)}/${st.maxMp}</small><strong class="${x.dead?'down':''}">${statusLabel(x)}</strong><small class="camp-resist-line">FIGURE耐性　${res}</small>${activeFigureResonances(id).length?`<small class="camp-resonance-line">共鳴　${activeFigureResonances(id).map(r=>r.tag.name).join(' / ')}</small>`:''}</div></button>`;}).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-player-detail]',p).forEach(b=>b.onclick=()=>openPlayerDetail(b.dataset.playerDetail));}
function itemEffectText(it){if(it.type==='hp')return`HP ${it.min}～${it.max}回復`;if(it.type==='mp')return`MP ${it.min}～${it.max}回復`;if(it.type==='cure')return`${{poison:'毒',burn:'やけど',paralyze:'マヒ'}[it.status]}を治す`;if(it.type==='cureAll')return'状態異常を全て治す';if(it.type==='hpmp')return'HP・MP 200回復';if(it.type==='full')return'HP・MP 全回復';if(it.type==='battleBuff')return`${it.minTurns||3}～${it.maxTurns||4}ターン ${it.stat} 20%アップ`;if(it.type==='partyHp')return'味方全体 HP 150回復';if(it.type==='revive')return'ダウン1人をHP50%で復活';if(it.type==='record')return'トレーニング施設で使用するレコード';return'';}
function renderCampInventory(){const p=$('#campSubPanel'),owned=GAME_ITEMS.filter(it=>itemCount(it.id)>0);p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>ITEM</small><h3>持ち物</h3></div><div class="camp-inventory">${owned.length?owned.map(it=>`<button data-field-item="${it.id}" type="button"><img src="${it.image}" alt="${it.name}"><div><b>${it.name}</b><small>${itemEffectText(it)}</small></div><em>×${itemCount(it.id)}</em></button>`).join(''):'<div class="camp-empty-note">使用できるアイテムを所持していません。</div>'}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-field-item]',p).forEach(b=>b.onclick=()=>openFieldItemTargets(b.dataset.fieldItem));}
async function openFieldItemTargets(id){const it=itemData(id);if(!it||itemCount(id)<1)return;if(it.type==='record')return narrationDialog(`${it.name}はトレーニング施設で使用します。`);if(it.type==='battleBuff')return narrationDialog(`${it.name}は戦闘中に使用するアイテムです。`);if(it.type==='partyHp'){const v=ensureAdventureVitals();let used=false;for(const [pid,lv] of state.party){const q=player(pid),st=baseStats(q,lv),x=v[pid];if(x&&!x.dead&&x.hp<st.maxHp){x.hp=Math.min(st.maxHp,x.hp+it.amount);used=true;}}if(!used)return narrationDialog('HPが減っているメンバーはいません。');consumeItem(id);saveAdventure();saveCampCheckpoint();toast(`${it.name}を使用しました`);return renderCampInventory();}
  const v=ensureAdventureVitals(),candidates=state.party.map(([pid,lv])=>{const q=player(pid),x=v[pid],st=baseStats(q,lv);return{pid,lv,q,x,st};});const p=$('#campSubPanel');p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>USE ITEM</small><h3>${it.name}</h3><p>使用するメンバーを選んでください。</p></div><div class="camp-status-list">${candidates.map(c=>{const tone=c.x.dead||c.x.hp<=0?'down':c.x.hp<c.st.maxHp?'hurt':'healthy',ab=statusLabel(c.x)!=='健康';return`<button class="camp-status-card item-target ${tone} ${ab?'abnormal':''}" data-item-target="${c.pid}" type="button"><img src="${versionedPlay(c.q.image)}" alt="${c.q.name}"><div><b>${c.q.name}</b><small class="item-target-vitals">HP ${Math.round(c.x.hp)}/${c.st.maxHp}<br>MP ${Math.round(c.x.mp)}/${c.st.maxMp}</small><strong>${statusLabel(c.x)}</strong></div></button>`;}).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampInventory;$$('[data-item-target]',p).forEach(b=>b.onclick=()=>useFieldItemOn(id,b.dataset.itemTarget));}
function useFieldItemOn(id,pid){const it=itemData(id),v=ensureAdventureVitals(),entry=state.party.find(x=>x[0]===pid),q=player(pid);if(!it||!entry||!q||itemCount(id)<1)return;const st=baseStats(q,entry[1]),x=v[pid];let ok=false,msg='';if(it.type==='hp'&&!x.dead&&x.hp<st.maxHp){const n=Math.round(rint(it.min,it.max)*(1+Number(figureEffectsFor(pid).healBoost||0))),before=x.hp;x.hp=Math.min(st.maxHp,x.hp+n);ok=true;msg=`HPが${Math.round(x.hp-before)}回復した！`;}else if(it.type==='mp'&&!x.dead&&x.mp<st.maxMp){const n=rint(it.min,it.max);x.mp=Math.min(st.maxMp,x.mp+n);ok=true;msg=`MPが${n}回復した！`;}else if(it.type==='cure'&&!x.dead&&x.status[it.status]>0){x.status[it.status]=0;ok=true;msg='状態異常が治った！';}else if(it.type==='cureAll'&&!x.dead&&Object.values(x.status).some(n=>n>0)){for(const k of Object.keys(x.status))x.status[k]=0;ok=true;msg='状態異常が全て治った！';}else if(it.type==='hpmp'&&!x.dead&&(x.hp<st.maxHp||x.mp<st.maxMp)){const boost=1+Number(figureEffectsFor(pid).healBoost||0);x.hp=Math.min(st.maxHp,x.hp+Math.round(200*boost));x.mp=Math.min(st.maxMp,x.mp+200);ok=true;msg='HPとMPが回復した！';}else if(it.type==='full'&&!x.dead&&(x.hp<st.maxHp||x.mp<st.maxMp)){x.hp=st.maxHp;x.mp=st.maxMp;ok=true;msg='HPとMPが全回復した！';}else if(it.type==='revive'&&x.dead){x.dead=false;const boost=1+Number(figureEffectsFor(pid).healBoost||0);x.hp=Math.max(1,Math.round(st.maxHp*Math.min(1,it.ratio*boost)));x.mp=Math.min(x.mp,st.maxMp);ok=true;msg=`${q.name}が復活した！`;}if(!ok)return narrationDialog('今はこのアイテムを使用できません。');consumeItem(id);saveAdventure();saveCampCheckpoint();toast(msg);renderCampInventory();}
function applyDrinkImmediate(d){const v=ensureAdventureVitals();for(const [id,lv] of state.party){const q=player(id),st=baseStats(q,lv),x=v[id];if(!x||x.dead)continue;if(d.fullHp)x.hp=st.maxHp;if(d.heal){const hb=1+Number(figureEffectsFor(id).healBoost||0);x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*d.heal*hb));x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*d.heal));}if(d.hpHeal){const hb=1+Number(figureEffectsFor(id).healBoost||0);x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*d.hpHeal*hb));}if(d.mpHeal)x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*d.mpHeal));if(d.cure)x.status[d.cure]=0;if(d.cureAll)for(const k of Object.keys(x.status))x.status[k]=0;}if(d.buff)state.adventure.areaBuff={...(state.adventure.areaBuff||{}),...d.buff,source:d.id};saveAdventure();}
async function useCampDrink(id){if(areaCampActionUsed('drink'))return narrationDialog('このAREAではドリンクをすでに使用しました。');const d=DRINK_SETS.find(x=>x.id===id);if(!d||drinkCount(id)<1)return;const ans=await narrationDialog(`${d.name}を飲みますか？`,[['はい','yes','primary'],['いいえ','no']]);if(ans!=='yes')return;if(!consumeDrink(id,1))return;applyDrinkImmediate(d);markAreaCampActionUsed('drink');saveCampCheckpoint();await narrationDialog(`勇者一行は${d.name}を楽しんだ！\n${d.desc}`);closeCamp();renderAdventure();}
function renderCampDrinks(){const p=$('#campSubPanel');$('#campMainMenu').hidden=true;p.hidden=false;const owned=DRINK_SETS.filter(d=>drinkCount(d.id)>0);p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>DRINK</small><h3>ドリンクセット</h3></div><div class="camp-inventory">${owned.length?owned.map(d=>`<button data-camp-drink="${d.id}" type="button"><img src="${d.image}" alt="${d.name}"><div><b>${d.name}</b><small>${d.desc}</small></div><em>×${drinkCount(d.id)}</em></button>`).join(''):'<div class="camp-empty-note">所持しているドリンクセットはありません。<br>酒場で購入できます。</div>'}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampMain;$$('[data-camp-drink]',p).forEach(b=>b.onclick=()=>useCampDrink(b.dataset.campDrink));}

function saveCampCheckpoint(){const cp={worldIndex:state.adventure.worldIndex,areaIndex:state.adventure.areaIndex,battleIndex:state.adventure.battleIndex,battleReady:state.adventure.battleReady,completed:state.adventure.completed,pendingEncounter:clone(state.adventure.pendingEncounter),vitals:clone(state.adventure.vitals),storyFlags:clone(state.adventure.storyFlags||{}),campUsed:clone(state.adventure.campUsed||{}),areaBuff:clone(state.adventure.areaBuff),coins:state.coins,party:clone(state.party),meta:clone(state.meta)};state.adventure.checkpoint=cp;saveAdventure();saveParty();saveMeta();}
function restoreCampCheckpoint(){const cp=state.adventure.checkpoint,reviveCount=Math.max(Number(state.meta?.firstGrassReviveCount)||0,state.meta?.firstGrassReviveUsed?1:0),starterGrant=!!state.meta?.starterGrantReceived,diamonds=Math.max(0,Number(state.meta?.diamonds)||0);if(cp){state.adventure={...state.adventure,...clone(cp),checkpoint:clone(cp)};state.coins=Number(cp.coins)||0;if(cp.meta){state.meta={...defaultMeta(),...clone(cp.meta)};const restoredReviveCount=Math.max(reviveCount,Number(state.meta?.firstGrassReviveCount)||0,state.meta?.firstGrassReviveUsed?1:0);state.meta.firstGrassReviveCount=Math.min(2,restoredReviveCount);state.meta.firstGrassReviveUsed=state.meta.firstGrassReviveCount>0;if(starterGrant)state.meta.starterGrantReceived=true;state.meta.diamonds=Math.max(diamonds,Number(state.meta.diamonds)||0);state.meta.coins=state.coins;saveMeta();}if(Array.isArray(cp.party)){state.party=clone(cp.party).map(x=>Array.isArray(x)?[canonicalPlayerId(x[0]),x[1]]:x);saveParty();}}else state.adventure=defaultAdventure();saveAdventure();}

function growthValue(lv,curve){lv=clamp(Number(lv)||1,1,120);const [v1,v99,v120=v99]=curve;if(lv<=99){const t=(lv-1)/98;return Math.round(v1+(v99-v1)*t);}const t=(lv-99)/21;return Math.round(v99+(v120-v99)*t);}
function rawBaseStats(p,lv){const t=TEMP_BALANCE.playerTargets?.[p.id];if(!t){const old=TEMP_BALANCE.playerGrowth[p.id],b=TEMP_BALANCE.base;return{maxHp:Math.round(b.hp+old.hp*lv),maxMp:Math.round(b.mp+old.mp*lv),atk:Math.round(b.atk+old.atk*lv),mag:Math.round(b.mag+old.mag*lv),def:Math.round(b.def+old.def*lv),res:Math.round(b.res+old.res*lv),spd:Math.round(b.spd+old.spd*lv)};}return{maxHp:growthValue(lv,t.hp),maxMp:growthValue(lv,t.mp),atk:growthValue(lv,t.atk),mag:growthValue(lv,t.mag),def:growthValue(lv,t.def),res:growthValue(lv,t.res),spd:growthValue(lv,t.spd)};}
function baseStats(p,lv){return weaponStatsForEquipment(p,lv,equipmentFor(p.id));}
function buildAlly(p,lv,vital){lv=clamp(Number(lv)||1,1,120);const equipment=clone(equipmentFor(p.id)),figureEquipment=clone(figureEquipmentFor(p.id)),figureEffects=figureEffectsFor(p.id),s=weaponStatsForEquipment(p,lv,equipment),hp=vital?clamp(Number(vital.hp)||0,0,s.maxHp):s.maxHp,vs=vital?.status||{};return{...p,equipment,figureEquipment,figureEffects,level:lv,...s,hp,mpNow:vital?clamp(Number(vital.mp)||0,0,s.maxMp):s.maxMp,dead:vital?.dead===true||hp<=0,guard:0,guardTurns:0,barrier:0,atkBuff:0,atkBuffTurns:0,atkDebuff:0,atkDebuffTurns:0,defBuff:0,defBuffTurns:0,spdBuff:0,spdBuffTurns:0,spdDebuff:0,spdDebuffTurns:0,allBuff:0,allBuffTurns:0,damageCut:0,damageCutTurns:0,status:{poison:Number(vs.poison)||0,burn:Number(vs.burn)||0,sleep:Number(vs.sleep)||0,stun:Number(vs.stun)||0,paralyze:Number(vs.paralyze)||0,confuse:Number(vs.confuse)||0},pinkReviveUsed:false,lilithReviveUsed:false,transformed:false,narakuStacks:0,missionBuff:0,nextSupportTurn:rint(2,5)};}
function enemyStatPreview(t,lv,groupSize=1,partySize=4){
  t=t||{category:'normal'};lv=clamp(Number(lv)||1,1,120);const profile=TEMP_BALANCE.enemyProfiles?.[t.category]||TEMP_BALANCE.enemyProfiles.normal,mods=t.mods||{};
  const curve=(base,per,quad=0)=>base+lv*per+lv*lv*quad;
  const hp=t.fixedHp?Number(t.fixedHp):Math.round(curve(profile.hpBase,profile.hpPerLevel,profile.hpQuad||0)*(mods.hp||1));
  return{maxHp:Math.max(1,Math.round(hp)),atk:Math.round(curve(profile.atkBase,profile.atkPerLevel,profile.atkQuad||0)*(mods.atk||1)),mag:Math.round(curve(profile.magBase,profile.magPerLevel,profile.magQuad||0)*(mods.mag||1)),def:Math.round(curve(profile.defBase,profile.defPerLevel,profile.defQuad||0)*(mods.def||1)),res:Math.round(curve(profile.resBase,profile.resPerLevel,profile.resQuad||0)*(mods.res||1)),spd:Math.round(curve(profile.spdBase,profile.spdPerLevel,profile.spdQuad||0)*(mods.spd||1)),groupAttackScale:1};
}
let ENEMY_UID=0;
function buildEnemyFromTemplate(t,lv,partySize=4,groupSize=1,bg='',fallbackBg=''){
  if(!t)return null;const st=enemyStatPreview(t,lv,groupSize,partySize),b=t.bossId?boss(t.bossId):null;
  const startRate=clamp(Number(t.startingHpRate)||1,.01,1);
  return{...t,uid:`enemy-${++ENEMY_UID}`,level:clamp(Number(lv)||t.levelMin||1,1,120),...st,hp:Math.max(1,Math.round(st.maxHp*startRate)),isBoss:t.category==='boss',isElite:t.category==='elite',evasion:clamp(Number(t.evasion??t.evade??t.mods?.evade)||0,0,.8),bg:bg||t.bg||b?.bg||'',fallbackBg:fallbackBg||t.fallbackBg||b?.fallbackBg||'',damageReduction:0,shieldTurns:0,atkBuff:0,atkBuffTurns:0,defBuff:0,defBuffTurns:0,defDebuff:0,defDebuffTurns:0,spdDebuff:0,spdDebuffTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0}};
}
function buildBossEnemy(b,lv,size){return buildEnemyFromTemplate(trainingEnemyCatalog().find(t=>t.bossId===b?.id)||legacyBossTemplate(b),lv,size,1,b?.bg,b?.fallbackBg);}
function buildNormalEnemy(raw,lv,size,bg){const t={...raw,id:raw.id||`legacy-normal-${raw.name}`,category:'normal',image:raw.image||'',levelMin:lv,levelMax:lv};return buildEnemyFromTemplate(t,lv,size,1,bg,'back/sougen.png');}
function arrangeEnemyWaveCenter(items){
  const list=[...(items||[])].slice(0,5);if(list.length<3)return list;
  const bosses=list.filter(x=>x.t?.category==='boss'),elites=list.filter(x=>x.t?.category==='elite');
  const lead=bosses.length===1?bosses[0]:(bosses.length===0&&elites.length===1?elites[0]:null);if(!lead)return list;
  const from=list.indexOf(lead),to=Math.floor((list.length-1)/2);if(from>=0&&from!==to){list.splice(from,1);list.splice(to,0,lead);}return list;
}
function buildEnemyWave(records,partySize,bg,fallbackBg){
  const expanded=[];
  for(const r of records||[]){
    const base=trainingEnemyTemplate(r.id)||r.template||r;if(!base)continue;
    const t={...base,...r,id:base.id||r.id};const q=clamp(Number(r.qty)||1,1,5);
    for(let i=0;i<q;i++)expanded.push({t:{...t,escort:!!r.escort,sourceQty:r.sourceQty||q},level:r.level||t.levelMin||1});
  }
  const ordered=arrangeEnemyWaveCenter(expanded),count=Math.max(1,ordered.length);
  const distinctElites=new Set(ordered.filter(x=>x.t?.category==='elite'&&!x.t?.escort).map(x=>x.t.id));
  const allTrueMidbosses=ordered.length>=2&&ordered.every(x=>x.t?.category==='elite'&&!x.t?.escort)&&distinctElites.size===ordered.length;
  return ordered.map((x,i)=>{
    const t={...x.t};
    // Side attendants always act once. Genuine multi-mid-boss encounters (2 or 3 distinct first-appearance elites) are the exception.
    if(t.category==='normal'||t.escort)t.actionCount=1;
    else if(t.category==='elite'&&allTrueMidbosses&&!t.forceActionCount)delete t.actionCount;
    return buildEnemyFromTemplate(t,x.level,partySize,count,bg,fallbackBg);
  }).filter(Boolean);
}
async function beginBattle(config){
  if(state.test?.enabled&&state.test?.fast5)state.speed=5;else if(state.speed===5)state.speed=1;
  const partyList=(config.party||state.party).slice(0,10),vitals=config.questVitals|| (config.useAdventureVitals?state.adventure.vitals:null),allies=partyList.map(([id,lv])=>buildAlly(player(id),lv,vitals?.[id])),partySize=Math.min(4,allies.length);for(const a of allies)initUltimateCooldowns(a);
  const areaBuff=config.useAdventureVitals?(state.adventure.areaBuff||null):null;if(areaBuff)for(const a of allies){if(areaBuff.atk){a.atkBuff=areaBuff.atk;a.atkBuffTurns=99;}if(areaBuff.def){a.defBuff=areaBuff.def;a.defBuffTurns=99;}if(areaBuff.spd){a.spdBuff=areaBuff.spd;a.spdBuffTurns=99;}if(areaBuff.mag){a.mag=Math.round(a.mag*(1+areaBuff.mag));}if(areaBuff.all){a.atk=Math.round(a.atk*(1+areaBuff.all));a.mag=Math.round(a.mag*(1+areaBuff.all));a.def=Math.round(a.def*(1+areaBuff.all));a.res=Math.round(a.res*(1+areaBuff.all));a.spd=Math.round(a.spd*(1+areaBuff.all));}}
  let waveConfigs=[];
  if(Array.isArray(config.waves)&&config.waves.length)waveConfigs=clone(config.waves);
  else if(Array.isArray(config.enemyConfigs)&&config.enemyConfigs.length)waveConfigs=[clone(config.enemyConfigs)];
  else if(Array.isArray(config.enemies)&&config.enemies.length)waveConfigs=[config.enemies.map(e=>({template:e,level:e.level||1}))];
  else if(config.enemy)waveConfigs=[[{template:config.enemy,level:config.enemy.level||1}]];
  else if(config.bossId){const bt=trainingEnemyCatalog().find(t=>t.bossId===config.bossId)||legacyBossTemplate(boss(config.bossId));waveConfigs=[[{id:bt.id,level:config.bossLevel||bt.levelMin||30}]];}
  const bg=config.bg||currentArea()?.bg||waveConfigs[0]?.[0]?.template?.bg||'back/sougen4.png',fallbackBg=config.fallbackBg||currentWorld()?.fieldFallback||'back/rpgmain.png';
  const enemies=buildEnemyWave(waveConfigs.shift()||[],partySize,bg,fallbackBg);const first=enemies[0];
  state.battle={mode:config.mode||'training',returnScreen:config.returnScreen||'training',allies,mainIds:allies.slice(0,4).map(a=>a.id),superIds:allies.slice(4,6).map(a=>a.id),reserveIds:allies.slice(6,10).map(a=>a.id),enemies,enemy:first,targetEnemyId:first?.uid||null,actingEnemyId:null,pendingWaveConfigs:waveConfigs,defeatedEnemies:[],turn:1,queue:[],queuePos:0,busy:false,auto:!!state.autoBattle,finished:false,criticalCtReducedThisAction:false,teamGuard:0,teamGuardTurns:0,yushaGuard:0,yushaGuardTurns:0,config,bg,fallbackBg};
  const neonBattle=/ネオン街/.test(String(config.adventureLabel||currentWorld()?.name||''));if(neonBattle)for(const a of allies){const rate=Number(a.figureEffects?.allStatPercent||0);if(rate>0){const hpRatio=a.maxHp?a.hp/a.maxHp:1,mpRatio=a.maxMp?a.mpNow/a.maxMp:1;for(const k of ['maxHp','maxMp','atk','mag','def','res','spd'])a[k]=Math.round(a[k]*(1+rate));a.hp=Math.max(1,Math.round(a.maxHp*hpRatio));a.mpNow=Math.round(a.maxMp*mpRatio);}}
  state.noticeQueue=[];state.noticeBusy=false;setImage($('#battleBg'),bg,fallbackBg);$('#battleModeLabel').textContent=config.mode==='adventure'?(config.bossBattle?'BOSS / MID BOSS':'FIELD BATTLE'):config.mode==='story'?'EVENT BATTLE':config.mode==='quest'?'TRAINING QUEST':'TRAINING';$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;$('#autoBtn').classList.toggle('active',!!state.autoBattle);$('#autoBtn').textContent=state.autoBattle?'AUTO ON':'AUTO';$('#speedBtn').textContent=`×${state.speed}`;$('#battleBackBtn').disabled=config.mode==='story';$('#battleBackBtn').style.display=(config.mode==='training'?'':'none');renderBattle();showScreen('battle');await actionCutin(`${enemies.map(e=>e.name).join('・')}が現れた！`,'danger',1000);await fixedDelay(100);startRound();
}

function allyById(id){return state.battle?.allies.find(a=>a.id===id)||null;}
function idsToAllies(ids){return ids.map(allyById).filter(Boolean);}
function mainAllies(){return state.battle?idsToAllies(state.battle.mainIds):[];}
function superAllies(){return state.battle?idsToAllies(state.battle.superIds):[];}
function reserveAllies(){return state.battle?idsToAllies(state.battle.reserveIds):[];}
function fieldAllies(){return [...mainAllies(),...superAllies()];}
function livingMain(){return mainAllies().filter(a=>!a.dead&&a.hp>0);}
function livingSuper(){return superAllies().filter(a=>!a.dead&&a.hp>0);}
function livingField(){return fieldAllies().filter(a=>!a.dead&&a.hp>0);}
function livingRoster(){return state.battle?state.battle.allies.filter(a=>!a.dead&&a.hp>0):[];}
function enemyByUid(uid){return state.battle?.enemies?.find(e=>e.uid===uid)||null;}
function livingEnemies(){return state.battle?.enemies?.filter(e=>e.hp>0)||[];}
function targetEnemy(){const b=state.battle;if(!b)return null;let e=enemyByUid(b.targetEnemyId);if(!e||e.hp<=0){e=livingEnemies()[0]||null;b.targetEnemyId=e?.uid||null;}if(!b.actingEnemyId)b.enemy=e;return e;}
function actingEnemy(){return enemyByUid(state.battle?.actingEnemyId)||null;}
function setEnemyTarget(uid){const e=enemyByUid(uid);if(!e||e.hp<=0)return;state.battle.targetEnemyId=uid;if(!state.battle.actingEnemyId)state.battle.enemy=e;renderBattle();}
function currentEntry(){return state.battle?.queue[state.battle.queuePos]||null;}
function activeAlly(){const e=currentEntry();return e?.type==='ally'?allyById(e.id):null;}
const ULT_UNLOCK_LEVELS=[1,15,30,50];
const ULT_BASE_CT=[6,7,8,9];
function ultimateBaseCt(u,index){if(u?.name==='読みかけの本')return 3;return ULT_BASE_CT[index]||9;}
function ultimateEffectiveCt(a,u,index){const cut=Math.max(0,Number((a?.figureEffects||figureEffectsFor(a?.id)).ultimateCtCut||0));return Math.max(0,ultimateBaseCt(u,index)-cut);}
function loadUltimateCooldowns(a){
  const stored=state.meta?.ultimateCooldowns?.[a.id],base=(a.ults||[]).map((u,i)=>ultimateEffectiveCt(a,u,i));
  a.ultCooldowns=Array.isArray(stored)?base.map((max,i)=>stored[i]==null?max:Math.max(0,Number(stored[i])||0)):base;
}
function initUltimateCooldowns(a){loadUltimateCooldowns(a);}
function persistUltimateCooldownsFromBattle(){const b=state.battle;if(!b)return;if(!state.meta.ultimateCooldowns)state.meta.ultimateCooldowns={};for(const a of b.allies||[])if(Array.isArray(a.ultCooldowns))state.meta.ultimateCooldowns[a.id]=a.ultCooldowns.map(v=>Math.max(0,Number(v)||0));saveMeta();}
function ultimateRemaining(a,index){if(!Array.isArray(a?.ultCooldowns))initUltimateCooldowns(a);return Math.max(0,Number(a.ultCooldowns[index])||0);}
function advanceUltimateCooldowns(a,usedIndex=-1){if(!a)return;if(!Array.isArray(a.ultCooldowns))initUltimateCooldowns(a);a.ultCooldowns=a.ultCooldowns.map((v,i)=>i===usedIndex?v:Math.max(0,(Number(v)||0)-1));persistUltimateCooldownsFromBattle();}
function criticalUltimateCharge(a){if(!a)return 0;if(!Array.isArray(a.ultCooldowns))initUltimateCooldowns(a);let changed=0;a.ultCooldowns=a.ultCooldowns.map(v=>{v=Math.max(0,Number(v)||0);if(v>0){changed++;return Math.max(0,v-1);}return v;});if(changed)persistUltimateCooldownsFromBattle();return changed;}
function availableUlts(a){if(state.test?.enabled&&state.test?.allSkills)return a.ults.slice();return a.ults.filter((u,i)=>i<4?a.level>=ULT_UNLOCK_LEVELS[i]:(a.id==='yusha'&&state.meta?.heroPassive2Unlocked===true));}
function readyUlts(a){return availableUlts(a).filter(u=>ultimateRemaining(a,a.ults.indexOf(u))<=0);}

function effective(stat,obj){
  let v=obj[stat];
  if(obj.allBuffTurns>0)v*=1+obj.allBuff;
  if(Number(obj.missionBuff||0)>0)v*=1+Number(obj.missionBuff||0);
  if(stat==='atk'&&obj.atkBuffTurns>0)v*=1+obj.atkBuff;
  if(stat==='atk'&&obj.atkDebuffTurns>0)v*=1-obj.atkDebuff;
  if(stat==='def'&&obj.defBuffTurns>0)v*=1+obj.defBuff;
  if(stat==='spd'&&obj.spdBuffTurns>0)v*=1+obj.spdBuff;
  if(stat==='spd'&&obj.spdDebuffTurns>0)v*=1-(obj.spdDebuff||0);
  if(obj?.equipment&&obj.maxHp>0){
    const hr=obj.hp/obj.maxHp;if(stat==='def'&&hr<=.30)v+=Number((obj.figureEffects||figureEffectsFor(obj.id)).lowHpDefFlat||0);
    if(stat==='atk')for(const t of weaponTraitList(obj,'highHpAtk'))if(hr>=Number(t.threshold||1))v*=1+Number(t.value||0);
    if(stat==='def')for(const t of weaponTraitList(obj,'lowHpDef'))if(hr<=Number(t.threshold||0))v*=1+Number(t.value||0);
    if(stat==='spd')for(const t of weaponTraitList(obj,'startSpd'))if((state.battle?.turn||1)<=Number(t.turns||0))v*=1+Number(t.value||0);
  }
  return v;
}

function enemySizeClass(e){const n=e.name||'';if(/フレザード/.test(n))return'frezard';if(e.category==='boss'&&/ドラゴン|ギドラ|ドラファラ/.test(n))return'dragon';if(e.category==='boss')return'boss';if(/ゴーレム/.test(n))return'golem';if(/ロック/.test(n))return'rock';if(e.category==='elite')return'elite';if(/スライム|ピヨ|ミスト|プルフ|ジョーロ|テンデビ|ミニブック|プニ|バブル/.test(n))return'small';return'normal';}
function enemyIsWinged(e){return /バード|ピヨ|ホーク|テンデビ|ヒノデビ|サキュバス|ドラゴン|ギドラ|フレザード|フェニックス/.test(e?.name||'');}
function enemyVisualTune(e){
  const id=e?.id||e?.enemyTemplate?.id||'';
  const name=e?.name||e?.enemyTemplate?.name||'';
  if(id==='boss-neon'||name==='モブネオンバルス')return{scale:1.28,y:0};
  if(id==='boss-guardian'||name==='モブガーディアン')return{scale:1.12,y:14};
  if(id==='g-beaver'||id==='g2-beaver'||name==='モブビーバー')return{scale:.88,y:4};
  if(['t-ohno','t-jukon','t-warrior','t-kiba'].includes(id))return{scale:1.16,y:6};
  if(id==='boss-debuff'||name==='モブデーバフ')return{scale:1.08,y:10,z:24};
  if(id==='boss-debuff2'||name==='モブデーバフ第二形態')return{scale:1.12,y:6,z:24};
  if(id==='boss-berserk'||name==='モブバーサク')return{scale:1.16,y:2};
  if(id==='boss-berserk2'||name==='モブバーサク第二形態')return{scale:1.20,y:0};
  if(id==='n2-kodora'||name==='モブネオコドラ')return{scale:.92,y:8};
  if(id==='boss-neomaster'||name==='モブネオマスター')return{scale:1.42,y:-2};
  if(id==='m2-buster'||name==='モブマグバスター'||name==='モブマグマスター')return{scale:1.42,y:0};
  if(id==='boss-dragon2'||name==='モブドラゴンⅡ')return{scale:1.22,y:0};
  if(id==='boss-gidora'||name==='モブギドラ')return{scale:1.34,y:-2};
  if(id==='boss-lilith-castle'||name==='モブリリス')return{scale:1.18,y:0};
  return{scale:1,y:0};
}
function battleEnemyNaturalScale(root,kind,e=null){
  const w=root?.clientWidth||440,base=clamp(w/2450,.165,.225),tune=enemyVisualTune(e||{});
  return base*({small:.90,normal:1.10,elite:1.18,rock:1.30,golem:1.42,boss:1.90,dragon:2.18,frezard:2.28}[kind]||1)*tune.scale;
}
function applyEnemyVisualSizes(root=$('#enemyArea')){
  if(!root)return;
  $$('[data-enemy-target]',root).forEach(unit=>{
    const img=$('.enemy-sprite',unit);if(!img)return;
    const place=()=>{
      if(!(img.naturalWidth>0&&img.naturalHeight>0))return;
      const kind=['small','normal','elite','rock','golem','boss','dragon','frezard'].find(k=>unit.classList.contains(`enemy-size-${k}`))||'normal';
      const enemy=enemyByUid(unit.dataset.enemyTarget),tune=enemyVisualTune(enemy||{}),wrap=$('.enemy-sprite-wrap',unit);
      const field=$('#battle-field')||$('.battle-field')||$('#battleScreen'),fr=field?.getBoundingClientRect()||{width:root.clientWidth,height:root.clientHeight};
      const maxW=(fr.width||root.clientWidth)*({small:.27,normal:.32,elite:.36,rock:.40,golem:.44,boss:.82,dragon:.88,frezard:.92}[kind]||.32);
      const maxH=(fr.height||root.clientHeight)*({small:.31,normal:.38,elite:.42,rock:.45,golem:.48,boss:.74,dragon:.79,frezard:.84}[kind]||.38);
      const sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,battleEnemyNaturalScale(root,kind,enemy),maxW,maxH);
      img.style.setProperty('width',`${sz.w}px`,'important');img.style.setProperty('height',`${sz.h}px`,'important');
      if(wrap)wrap.style.setProperty('transform',`translateY(${tune.y||0}px)`,'important');
      if(Number.isFinite(tune.z))unit.style.setProperty('z-index',String(tune.z),'important');
      else unit.style.removeProperty('z-index');
      requestAnimationFrame(()=>positionEnemyTargetMarks(root));
    };
    place();if(!img.complete)img.addEventListener('load',place,{once:true});
  });
}
function positionEnemyTargetMarks(root=$('#enemyArea')){
  if(!root)return;
  $$('[data-enemy-target]',root).forEach(unit=>{
    const mark=$('.enemy-target-mark',unit),wrap=$('.enemy-sprite-wrap',unit),img=$('.enemy-sprite',unit);
    if(!mark||!wrap)return;
    const place=()=>{
      if(!img||!(img.getBoundingClientRect().width>0)){mark.style.setProperty('top','-12px','important');mark.style.setProperty('left','50%','important');return;}
      const wr=wrap.getBoundingClientRect(),ir=img.getBoundingClientRect();
      mark.style.setProperty('left',`${ir.left-wr.left+ir.width/2}px`,'important');
      mark.style.setProperty('top',`${Math.round(ir.top-wr.top-14)}px`,'important');
      mark.style.setProperty('bottom','auto','important');
    };
    place();if(img&&!img.complete)img.addEventListener('load',place,{once:true});
  });
}
function enemyMarkup(e){
  const tags=[];for(const[k,l]of[['poison','毒'],['burn','やけど'],['sleep','眠り'],['stun','ひるみ'],['paralyze','マヒ'],['confuse','混乱']])if(e.status[k]>0)tags.push(l);if(e.shieldTurns>0)tags.push('SHIELD');if(e.defDebuffTurns>0)tags.push('DEF↓↓');if(e.spdDebuffTurns>0)tags.push('SPD↓↓');
  const selected=state.battle?.targetEnemyId===e.uid&&e.hp>0,dead=e.hp<=0;
  const nameLen=[...String(e.name||'')].length,nameSize=nameLen>=11?4.7:nameLen>=9?5.1:nameLen>=7?5.6:6.2;
  return`<button type="button" class="enemy-unit enemy-size-${enemySizeClass(e)} ${enemyIsWinged(e)?'enemy-winged':''} ${selected?'selected':''} ${dead?'dead':''}" data-enemy-target="${e.uid}" ${dead?'disabled':''}><div class="enemy-sprite-wrap">${e.image?`<img class="enemy-sprite" data-enemy-sprite="${e.uid}" src="${e.image}" alt="${e.name}">`:''}<div class="enemy-symbol ${e.image?'fallback-only':''}" data-enemy-symbol="${e.uid}">${e.symbol||'敵'}</div>${selected?'<span class="enemy-target-mark">▼</span>':''}</div><div class="enemy-nameplate"><div class="enemy-name-row"><b style="font-size:${nameSize}px!important">${e.name}</b><small>Lv${e.level}</small>${tags.length?`<span class="enemy-tags">${tags.map(t=>`<em>${t}</em>`).join('')}</span>`:''}</div><div class="enemy-hp-row"><span>${dead?'DOWN':'HP'}</span><div class="gauge"><i class="hp" style="width:${pct(e.hp,e.maxHp)}%"></i></div><b>${Math.ceil(e.hp).toLocaleString()}/${e.maxHp.toLocaleString()}</b></div></div></button>`;
}
function statusText(a){return Object.entries(a.status||{}).filter(([,v])=>v>0).map(([k])=>({poison:'毒',burn:'やけど',sleep:'眠り',stun:'ひるみ',paralyze:'マヒ',confuse:'混乱'}[k]||k)).join(' ');}
function allyStatusClass(a){if(a?.dead||a?.hp<=0)return'status-down';if(a?.status?.poison>0)return'status-poison';if(a?.status?.burn>0)return'status-burn';if(a?.status?.sleep>0)return'status-sleep';if(a?.status?.paralyze>0)return'status-paralyze';if(a?.status?.confuse>0)return'status-confuse';if(a?.status?.stun>0)return'status-stun';return'';}
function allyHpTone(a){const r=a.maxHp>0?a.hp/a.maxHp:0;return r<=.30?'danger':r<=.60?'warning':'safe';}
function allyMarkup(a){const st=statusText(a),hpPct=pct(a.hp,a.maxHp),mpPct=pct(a.mpNow,a.maxMp);return`<button type="button" class="ally-hud-card ${a.dead?'dead':''} ${allyStatusClass(a)} ${activeAlly()===a?'active turn-active':''}" data-ally-id="${a.id}"><span class="ally-hud-art"><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i>${st?`<em class="ally-status-mark">${st}</em>`:''}</span><div class="ally-title-line"><b>${a.name}</b><em>${a.dead?'DOWN':`Lv${a.level}`}</em></div><div class="ally-hud-line"><span>HP ${Math.ceil(a.hp)}/${a.maxHp}</span><span>MP ${Math.floor(a.mpNow)}/${a.maxMp}</span></div><div class="ally-hp-bar ${allyHpTone(a)}"><i style="width:${hpPct}%"></i></div><div class="ally-mp-bar"><i style="width:${mpPct}%"></i></div></button>`;}
function superMarkup(a){const next=Math.max(0,a.nextSupportTurn-state.battle.turn);return`<div class="super-chip ${a.dead?'dead':''} ${allyStatusClass(a)}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small><div class="super-hp-bar ${allyHpTone(a)}"><i style="width:${pct(a.hp,a.maxHp)}%"></i></div></div><em>${a.dead?'—':next===0?'READY':`+${next}T`}</em></div>`;}
function benchMarkup(a){return`<div class="bench-chip ${a.dead?'dead':''} ${allyStatusClass(a)}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div></div></div>`;}
function renderBattle(){
  const b=state.battle;if(!b)return;targetEnemy();$('#battleTurnLabel').textContent='';const enemies=b.enemies||[];const area=$('#enemyArea');area.className=`enemy-area enemy-count-${Math.max(1,enemies.length)}`;area.innerHTML=enemies.map(enemyMarkup).join('');
  $('#allyStatus').innerHTML=mainAllies().map(allyMarkup).join('');$('#superStatus').innerHTML=superAllies().length?superAllies().map(superMarkup).join(''):`<div class="no-bench">援護なし</div>`;$('#benchStatus').innerHTML=reserveAllies().length?reserveAllies().map(benchMarkup).join(''):`<div class="no-bench">控えなし</div>`;
  const entry=currentEntry(),a=activeAlly(),acting=entry?.type==='enemy'?enemyByUid(entry.enemyId):null,target=targetEnemy();$('#activeActorBar').innerHTML=a?`<img src="${versionedPlay(a.image)}" alt=""><div><small>COMMAND / SPD ${Math.round(effective('spd',a))}</small><b>${a.name}</b><span>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</span></div>`:entry?.type==='super'?`<div><small>AUTO ACTION</small><b>${allyById(entry.id)?.name||''}</b></div>`:`<div><small>${acting?'ENEMY ACTION':'TARGET'}</small><b>${acting?.name||target?.name||''}</b></div>`;
  bindImages($('#battleScreen'));applyEnemyVisualSizes(area);positionEnemyTargetMarks(area);requestAnimationFrame(()=>{applyEnemyVisualSizes(area);positionEnemyTargetMarks(area);});$$('[data-enemy-target]',area).forEach(btn=>btn.onclick=()=>setEnemyTarget(btn.dataset.enemyTarget));setCommandDisabled(b.busy||b.finished||!a);
}
function setCommandDisabled(dis){['attackBtn','skillBtn','specialBtn','ultimateBtn','defendBtn','itemBtn','escapeBtn','switchBtn'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=dis;});}

function notice(text,tone='system',duration=650){if(!state.battle||state.battle.finished&&tone!=='system')return;state.noticeQueue.push({text,tone,duration});pumpNotice();}
async function pumpNotice(){if(state.noticeBusy)return;state.noticeBusy=true;const el=$('#centerMessage');while(state.noticeQueue.length){const n=state.noticeQueue.shift();el.textContent=n.text;el.dataset.tone=n.tone;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(n.duration);el.classList.remove('play');await delay(60);}state.noticeBusy=false;}
function fieldPointFromRect(r,x=.5,y=.5){const field=$('#battleScreen');if(!field||!r)return{left:'50%',top:'50%'};const fr=field.getBoundingClientRect();return{left:`${((r.left-fr.left)+r.width*x)/fr.width*100}%`,top:`${((r.top-fr.top)+r.height*y)/fr.height*100}%`};}
function enemyVisual(uid){uid=uid||state.battle?.actingEnemyId||state.battle?.targetEnemyId;return uid?($(`[data-enemy-sprite="${uid}"]`)||$(`[data-enemy-symbol="${uid}"]`)):null;}
function enemyTargetPoint(uid){const el=enemyVisual(uid);return el?fieldPointFromRect(el.getBoundingClientRect(),.5,.68):{left:'50%',top:'45%'};}
function enemyFormationPoint(){const els=$$('.enemy-unit').filter(el=>el.offsetParent!==null);if(!els.length)return{left:'50%',top:'42%'};const rs=els.map(el=>el.getBoundingClientRect()),left=Math.min(...rs.map(r=>r.left)),right=Math.max(...rs.map(r=>r.right)),top=Math.min(...rs.map(r=>r.top)),bottom=Math.max(...rs.map(r=>r.bottom));return fieldPointFromRect({left,top,width:right-left,height:bottom-top},.5,.55);}
async function playEnemyProjectile(e,target){const layer=$('#battleFxLayer'),from=enemyTargetPoint(e?.uid),to=allyTargetPoint(target?.id);if(!layer)return;const b=document.createElement('i');b.className='enemy-projectile-bullet';b.style.left=from.left;b.style.top=from.top;b.style.setProperty('--bullet-x',`calc(${to.left} - ${from.left})`);b.style.setProperty('--bullet-y',`calc(${to.top} - ${from.top})`);layer.appendChild(b);await fixedDelay(320);b.remove();}
function allyTargetPoint(id){const root=$(`[data-ally-id="${id}"]`)||null;if(!root)return{left:'50%',top:'82%'};return fieldPointFromRect(root.getBoundingClientRect(),.5,.08);}
function positionEffect(el,target='enemy'){let p;if(target==='enemy-all')p=enemyFormationPoint();else if(!target||target==='enemy')p=enemyTargetPoint();else if(String(target).startsWith('enemy:'))p=enemyTargetPoint(String(target).slice(6));else p=allyTargetPoint(target);el.style.left=p.left;el.style.top=p.top;}
function pulseAllyDamage(id){
  const el=$(`[data-ally-id="${id}"]`);if(!el)return;
  el.classList.remove('damage-flash','hud-shake');void el.offsetWidth;el.classList.add('damage-flash','hud-shake');
  const layer=$('#battleFxLayer'),screen=$('#battleScreen');if(!layer||!screen)return;
  const r=el.getBoundingClientRect(),sr=screen.getBoundingClientRect(),ov=document.createElement('div');
  ov.className='ally-damage-overlay';
  ov.style.left=`${r.left-sr.left}px`;ov.style.top=`${r.top-sr.top}px`;ov.style.width=`${r.width}px`;ov.style.height=`${r.height}px`;
  layer.appendChild(ov);setTimeout(()=>ov.remove(),460);
}
async function actionCutin(text,tone='system',duration=500){const el=$('#actionBanner');if(!el){notice(text,tone,duration);await delay(Math.min(duration,520));return;}el.textContent=text;el.dataset.tone=tone;const n=[...text].length;el.style.fontSize=n>=22?'12px':n>=18?'13px':n>=15?'14px':n>=12?'16px':'18px';el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(duration);el.classList.remove('play');await delay(55);}
async function passiveCutin(a,text,duration=620){
  const wrap=$('#passiveCutin'),img=$('#passiveCutinCharacter'),label=$('#passiveCutinText');
  if(!wrap||!a){notice(text,'system',duration);await fixedDelay(duration);return;}
  const src=versionedPlay(a.transformed&&a.id==='yusha'?'play/13.png':a.image);await preloadAsset(src);setImage(img,src,'');label.textContent=text;wrap.hidden=false;wrap.classList.remove('play');void wrap.offsetWidth;wrap.classList.add('play');await fixedDelay(duration);wrap.classList.remove('play');wrap.hidden=true;
}
async function passiveBeat(a,text,duration=620,preDelay=600){await fixedDelay(preDelay);await passiveCutin(a,text,duration);}
async function reactivePassiveBeat(a,text,duration=600){return passiveBeat(a,text,duration,140);}
function floatNumber(value,kind='damage',target='enemy'){const el=document.createElement('div');el.className=`float-number ${kind}`;el.textContent=(kind==='heal'?'+':'')+Math.round(value);positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),850/state.speed);}
function clearEnemyImpact(){for(const el of $$('[data-enemy-sprite],[data-enemy-symbol]')){el.classList.remove('enemy-hit','enemy-cast','enemy-damage-impact','enemy-advance');el.style.filter='';}$$('.enemy-unit-hit,.enemy-lunge-unit').forEach(x=>x.classList.remove('enemy-unit-hit','enemy-lunge-unit'));}
function pulseEnemy(cls='hit',uid){const el=enemyVisual(uid);if(!el)return;const unit=el.closest('.enemy-unit');el.classList.remove('enemy-hit','enemy-cast','enemy-advance','enemy-damage-impact');el.style.filter='';if(unit)unit.classList.remove('enemy-unit-hit');void el.offsetWidth;if(cls==='advance'){if(unit){unit.classList.remove('enemy-lunge-unit');void unit.offsetWidth;unit.classList.add('enemy-lunge-unit');}return;}if(cls==='cast'){el.classList.add('enemy-cast');const cleanup=()=>{if(el.isConnected)el.classList.remove('enemy-cast');};el.addEventListener('animationend',cleanup,{once:true});setTimeout(cleanup,620);return;}el.classList.add('enemy-damage-impact');if(unit){void unit.offsetWidth;unit.classList.add('enemy-unit-hit');}const cleanup=()=>{if(el.isConnected){el.classList.remove('enemy-damage-impact');el.style.filter='';}if(unit?.isConnected)unit.classList.remove('enemy-unit-hit');};setTimeout(cleanup,340);}
async function beginEnemyLunge(uid){const screen=$('#battleScreen'),el=enemyVisual(uid),unit=el?.closest('.enemy-unit');if(screen)screen.classList.add('enemy-attacking');if(unit){unit.classList.remove('enemy-lunge-unit');void unit.offsetWidth;unit.classList.add('enemy-lunge-unit');}await fixedDelay(250);}
function endEnemyLunge(){const screen=$('#battleScreen');if(screen)screen.classList.remove('enemy-attacking');$$('.enemy-lunge-unit').forEach(x=>x.classList.remove('enemy-lunge-unit'));}
function fx(type='slash',target){if(target==null)target=(type==='buff'||type==='heal')?(activeAlly()?.id||'enemy'):'enemy';const el=document.createElement('div');el.className=`simple-fx ${type}`;positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),650/state.speed);}

/* ===== v22 procedural weapon + attribute attack FX =====
   Temporary battle animation system used until dedicated sprite assets are prepared.
   Weapon determines motion/shape; attribute determines the secondary impact animation. */
const NORMAL_ATTACK_WEAPON={
  yusha:'greatsword',pink:'greatsword',desert:'katana',nyoro:'gun',nekoku:'spear',
  jessie:'spear',denden:'gun',money:'staff',riro:'spear',tetsu:'katana',lilith:'staff',naraku:'katana'
};
function weaponKind(a){
  const t=normalizeWeaponType(weaponCombatType(a));
  if(t==='大剣')return'greatsword';if(t==='太刀')return'katana';if(t==='片手剣')return'sword';if(t==='槍')return'spear';if(t==='銃')return'gun';if(t==='杖')return'staff';
  if(NORMAL_ATTACK_WEAPON[a?.id])return NORMAL_ATTACK_WEAPON[a.id];return'sword';
}
function elementFxKind(a){
  const e=weaponCombatElement(a);
  return({'火':'fire','水':'water','雷':'thunder','地':'earth','風':'wind','光':'light','闇':'dark','無':'neutral'})[e]||'neutral';
}
function battlePointPx(target='enemy'){
  const screen=$('#battleScreen'),sr=screen?.getBoundingClientRect();if(!screen||!sr)return{x:0,y:0};let el=null,x=.5,y=.5;
  if(target==='enemy'||String(target).startsWith('enemy:')){const uid=String(target).startsWith('enemy:')?String(target).slice(6):undefined;el=enemyVisual(uid);x=.5;y=.66;}
  else{el=$(`[data-ally-id="${target}"]`);x=.5;y=.08;}
  if(!el)return{x:sr.width*.5,y:sr.height*(target==='enemy'?.45:.82)};const r=el.getBoundingClientRect();return{x:r.left-sr.left+r.width*x,y:r.top-sr.top+r.height*y};
}
function weaponFxMarkup(kind){
  if(kind==='greatsword')return'<i class="w-blade w-blade-a"></i><i class="w-blade w-blade-b"></i><i class="w-core"></i>';
  if(kind==='katana')return'<i class="w-katana k1"></i><i class="w-katana k2"></i><i class="w-katana k3"></i>';
  if(kind==='spear')return'<i class="w-pierce"></i><i class="w-spear-ring"></i><i class="w-core"></i>';
  if(kind==='gun')return'<i class="w-bullet"></i><i class="w-trail"></i><i class="w-gun-impact"></i>';
  if(kind==='staff')return'<i class="w-rune r1"></i><i class="w-rune r2"></i><i class="w-orb"></i>';
  return'<i class="w-sword-arc"></i><i class="w-core"></i>';
}
function elementFxMarkup(){return'<span class="e-overlay"><i></i><i></i><i></i><i></i><i></i><i></i></span>';}
async function weaponElementAttackFx(a,{quick=false}={}){
  const layer=$('#battleFxLayer');if(!layer)return;
  const kind=weaponKind(a),element=elementFxKind(a),end=battlePointPx('enemy'),start=battlePointPx(a.id);
  const el=document.createElement('div');
  el.className=`weapon-attack-fx weapon-${kind} element-${element}${quick?' quick':''}`;
  el.style.setProperty('--fx-rate',String(1/state.speed));
  el.innerHTML=weaponFxMarkup(kind)+elementFxMarkup();
  if(kind==='gun'||kind==='spear'){
    el.style.left=`${start.x}px`;el.style.top=`${start.y}px`;
    el.style.setProperty('--travel-x',`${end.x-start.x}px`);el.style.setProperty('--travel-y',`${end.y-start.y}px`);
    el.style.setProperty('--impact-x',`${end.x}px`);el.style.setProperty('--impact-y',`${end.y}px`);
  }else{el.style.left=`${end.x}px`;el.style.top=`${end.y}px`;}
  layer.appendChild(el);
  const life=quick?250:360;
  try{await delay(life);}finally{el.remove();}
}

async function skillSprite(frames,target='enemy',mode='default'){
  if(!frames?.length){fx('magic',target==='enemy-all'?'enemy':target);return;}
  const wrap=$('#skillSpriteFx');if(!wrap)return;positionEffect(wrap,target);wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';wrap.replaceChildren();wrap.dataset.mode=mode||'default';
  const sources=[...new Set(frames)],nodeMap=new Map();
  for(const src of sources){const img=document.createElement('img');img.className='skill-frame';img.alt='';img.draggable=false;img.decoding='async';img.src=src;bindImage(img);wrap.appendChild(img);nodeMap.set(src,img);}
  let ghost=null;if(mode==='statusRepeatV79'){ghost=document.createElement('img');ghost.className='skill-frame skill-frame-ghost';ghost.alt='';ghost.draggable=false;ghost.decoding='async';ghost.src=frames[0];bindImage(ghost);wrap.appendChild(ghost);}
  const clear=()=>{wrap.classList.remove('earth-shake','light-shake','status-noise','status-chill','status-fast','status-repeat');for(const img of wrap.querySelectorAll('img'))img.classList.remove('active','skill-fade-v79');};
  const showFrame=async(src,ms,fade=false)=>{for(const img of nodeMap.values())img.classList.remove('active','skill-fade-v79');const img=nodeMap.get(src);if(!img)return;img.classList.add('active');if(fade)img.classList.add('skill-fade-v79');await fixedDelay(ms);};
  try{
    await Promise.all([...wrap.querySelectorAll('img')].map(img=>ensureDomImageReady(img,img.src,1200)));wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';await nextPaint(2);
    if(mode==='earthLargeV79'){
      wrap.classList.add('earth-shake');await showFrame(frames[0],1000);wrap.classList.remove('earth-shake');for(const src of frames.slice(1,-1))await showFrame(src,180);await showFrame(frames.at(-1),1000,true);
    }else if(mode==='windLargeV79'||mode==='lightSmallV79'){
      const a=frames[0],b=frames[1],last=frames.at(-1);for(let i=0;i<3;i++){await showFrame(a,165);await showFrame(b,165);}await showFrame(last,1000,true);
    }else if(mode==='lightLargeV79'){
      wrap.classList.add('light-shake');await showFrame(frames[0],1000);wrap.classList.remove('light-shake');for(const src of frames.slice(1,-1))await showFrame(src,180);await showFrame(frames.at(-1),1000,true);
    }else if(mode==='statusNoiseV79'){
      wrap.classList.add('status-noise');nodeMap.get(frames[0])?.classList.add('active');await fixedDelay(1000);
    }else if(mode==='statusChillV79'){
      wrap.classList.add('status-chill');nodeMap.get(frames[0])?.classList.add('active');await fixedDelay(1000);
    }else if(mode==='statusFastV79'){
      wrap.classList.add('status-fast');nodeMap.get(frames[0])?.classList.add('active');await fixedDelay(850);
    }else if(mode==='statusRepeatV79'){
      wrap.classList.add('status-repeat');nodeMap.get(frames[0])?.classList.add('active');ghost?.classList.add('active');await fixedDelay(1000);
    }else if(mode==='statusLongV79'){
      for(const src of frames)await showFrame(src,180);
    }else if(mode==='ultimateV79'){
      for(let i=0;i<frames.length;i++)await showFrame(frames[i],i===frames.length-1?420:145,i===frames.length-1);
    }else{
      for(const src of frames)await showFrame(src,94);
    }
    await fixedDelay(45);
  }finally{clear();wrap.className='skill-sprite-fx';wrap.style.opacity='0';wrap.hidden=true;wrap.style.display='none';wrap.replaceChildren();delete wrap.dataset.mode;}
}
async function ultimateImpactFx(){
  const layer=$('#battleFxLayer');
  if(!layer)return;
  const el=document.createElement('div');
  el.className='ultimate-impact-fx';
  try{
    positionEffect(el,'enemy');
    layer.appendChild(el);
    await fixedDelay(420);
  }finally{
    el.remove();
  }
}
const SUPPORT_ONLY_ULTS=new Set(['selfAllBuff','heroTransform','healCleanse','teamRecovery','teamHealGuard','fullHealBarrier','narakuShield','teamHealMpGuard']);
async function ultimateCutin(a,u){
  const wrap=$('#ultimateCutin');
  if(!wrap)return;
  const banner=$('.cutin-character',wrap),art=$('.ult-art-wrap',wrap),name=$('#cutinName');
  const artImg=$('#cutinUltArt'),charImg=$('#cutinCharacter');
  const neon=$('.ult-neon-trace',wrap);
  const charSrc=versionedPlay(a.transformed&&a.id==='yusha'?'play/13.png':a.image);

  const hardHide=()=>{
    wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';wrap.style.visibility='hidden';
    wrap.classList.remove('ult-v14-live');
    if(neon)neon.classList.remove('active');
    if(banner){banner.style.opacity='0';banner.style.visibility='hidden';banner.style.transform='none';}
    if(art){art.style.opacity='0';art.style.visibility='hidden';art.style.transform='translate(-50%,-42%) scale(1)';}
  };

  try{
    hardHide();
    if(name){
      name.textContent=u.name;
      const n=[...u.name].length;
      name.style.fontSize=n>=18?'12px':n>=15?'13px':n>=12?'15px':'18px';
    }
    const quote=$('#cutinQuote');if(quote)quote.textContent='';
    const fallback=$('#cutinUltFallback');if(fallback)fallback.textContent=u.name;

    /* v21: never reveal the ultimate until both images have completed decode. */
    await Promise.all([preloadAsset(charSrc,'high'),preloadAsset(u.image,'high')]);
    if(charImg){charImg.classList.remove('asset-missing');charImg.src=charSrc;}
    if(artImg){artImg.classList.remove('asset-missing');artImg.src=u.image;}
    await Promise.all([
      ensureDomImageReady(charImg,charSrc,1800),
      ensureDomImageReady(artImg,u.image,2200)
    ]);
    await nextPaint(2);

    wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';wrap.style.visibility='visible';
    if(banner){banner.style.opacity='1';banner.style.visibility='visible';}
    if(art){art.style.opacity='1';art.style.visibility='visible';}
    wrap.classList.add('ult-v14-live');
    await new Promise(requestAnimationFrame);

    await fixedDelay(1120);

    if(neon){neon.classList.remove('active');void neon.offsetWidth;neon.classList.add('active');}
    await fixedDelay(300);

    hardHide();
    await new Promise(requestAnimationFrame);
  }catch(err){
    console.error('[MOB QUEST] ultimateCutin recovered:',err);
    hardHide();
  }finally{
    hardHide();
  }
}

async function playUltimatePostAnimation(a,u){
  if(u?.effectFrames?.length){const aoe=/aoe/i.test(String(u.kind||''))||u.kind==='multiAttack';await preloadAssets(u.effectFrames);await skillSprite(u.effectFrames,aoe?'enemy-all':'enemy',u.effectMode||'ultimateV79');return;}
  if(!SUPPORT_ONLY_ULTS.has(u?.kind))await ultimateImpactFx();
}
function enemyDefense(type,e=targetEnemy()){if(!e)return 0;let v=type==='magic'?e.res:e.def;if(type!=='magic'&&e.defBuffTurns>0)v*=1+(e.defBuff||0);if(e.defDebuffTurns>0)v*=1-e.defDebuff;return v;}
/* v44 formal attribute relations. Supplied Fire/Water rules preserved; blanks completed as one consistent cycle. */
const ELEMENT_RELATIONS={
  火:{strong:'地',weak:'水'},水:{strong:'火',weak:'雷'},雷:{strong:'水',weak:'風'},風:{strong:'雷',weak:'光'},
  光:{strong:'風',weak:'闇'},闇:{strong:'光',weak:'地'},地:{strong:'闇',weak:'火'},無:{strong:null,weak:null}
};
function elementParts(attr){const s=String(attr||'無');const out=['火','水','風','雷','地','闇','光'].filter(e=>s.includes(e));return out.length?out:['無'];}
function elementRelation(attackerAttr,defenderAttr){let good=false,bad=false;for(const a of elementParts(attackerAttr)){const r=ELEMENT_RELATIONS[a]||ELEMENT_RELATIONS['無'];for(const d of elementParts(defenderAttr)){if(r.strong===d)good=true;if(r.weak===d)bad=true;}}return good===bad?0:(good?1:-1);}
function elementDamageMultiplier(attackerAttr,defenderAttr){const r=elementRelation(attackerAttr,defenderAttr);return r>0?1.155:r<0?.855:1;}
function attackElementFromContext(attacker,type){const c=state.battle?.weaponAttackContext;if(c?.element)return c.element;return type==='magic'?(attacker?.attribute||'無'):(equippedMainWeapon(attacker)?.attribute||attacker?.attribute||'無');}
function isWeaponWeaknessHit(element,e){return elementRelation(element,e?.attribute)>0;}
function weaponConditionalCritBonus(a,e,type,normal,element){
  let n=weaponCritBonus(a),hr=a.maxHp>0?a.hp/a.maxHp:1,weak=isWeaponWeaknessHit(element,e);
  if(normal)n+=weaponTraitSum(a,'normalCrit');
  if(weak)n+=weaponTraitSum(a,'weakCrit');
  for(const t of weaponTraitList(a,'highHpCrit'))if(hr>=Number(t.threshold||1))n+=Number(t.value||0);
  return n;
}
function weaponOutgoingMultiplier(a,e,type,normal,element){
  let m=1,hr=a.maxHp>0?a.hp/a.maxHp:1,weak=isWeaponWeaknessHit(element,e);
  if(String(e?.attribute||'').includes('闇'))m*=1+weaponTraitSum(a,'darkDamage');
  if(e?.category==='boss')m*=1+weaponTraitSum(a,'bossDamage');
  for(const t of weaponTraitList(a,'fullHpDamage'))if(hr>=.999)m*=1+Number(t.value||0);
  for(const t of weaponTraitList(a,'highHpDamage'))if(hr>=Number(t.threshold||1))m*=1+Number(t.value||0);
  for(const t of weaponTraitList(a,'lowHpDamage'))if(hr<=Number(t.threshold||0))m*=1+Number(t.value||0);
  if(type==='magic'){
    for(const t of weaponTraitList(a,'highHpMagicDamage'))if(hr>=Number(t.threshold||1))m*=1+Number(t.value||0);
    for(const t of weaponTraitList(a,'lowHpMagicDamage'))if(hr<=Number(t.threshold||0))m*=1+Number(t.value||0);
    if(weak)m*=1+weaponTraitSum(a,'magicWeakDamage');
  }
  if(weak)for(const t of weaponTraitList(a,'weakDamage'))if(!t.element||normalizeElement(t.element)===normalizeElement(element))m*=1+Number(t.value||0);
  return m;
}
function playerAttackHitChance(attacker,e,type='physical'){
  const ctx=state.battle?.weaponAttackContext||{};if(ctx.sure)return 1;
  const fe=attacker?.figureEffects||figureEffectsFor(attacker?.id),weaponAcc=weaponTraitSum(attacker,'accuracy'),bonus=Number(fe?.accuracy||0)+Number(weaponAcc||0);
  const base=1,evade=clamp(Number(e?.evasion||0),0,.8);
  return clamp(base+bonus-evade,.35,1);
}
function showMiss(target){const el=document.createElement('div');el.className='float-number miss';el.textContent='MISS';positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),850/state.speed);}
function showCriticalBeat(a,ctReduced=false){let el=$('#criticalBeat');if(!el){el=document.createElement('div');el.id='criticalBeat';el.className='critical-beat';document.body.appendChild(el);}el.innerHTML=`<b>会心の一撃！</b>${ctReduced?'<span>必殺技CT -1</span>':''}`;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');clearTimeout(showCriticalBeat.timer);showCriticalBeat.timer=setTimeout(()=>el.classList.remove('play'),Math.max(220,Math.round(600/state.speed)));}
function currentBattleFigureAreaKey(){const id=state.battle?.config?.worldId||currentWorld()?.id||'';return ['grassland','desert','rural','neon','sea','tribe','magma','demonCastle'].includes(id)?id:'';}
function calcDamage(attacker,type,power,crit=0,e=targetEnemy()){
  const ctx=state.battle?.weaponAttackContext||{},normal=!!ctx.normal,element=attackElementFromContext(attacker,type),source=type==='magic'?effective('mag',attacker):effective('atk',attacker);
  const hitChance=playerAttackHitChance(attacker,e,type);if(Math.random()>hitChance)return{value:0,crit:false,miss:true,weak:isWeaponWeaknessHit(element,e),element,hitChance};
  let def=enemyDefense(type,e);
  if(normal&&type==='physical'){
    const ignores=weaponTraitList(attacker,'defIgnore');let miss=1,maxIgnore=0;
    for(const t of ignores){miss*=1-clamp(Number(t.chance)||0,0,1);maxIgnore=Math.max(maxIgnore,Number(t.value)||0);}
    if(ignores.length&&Math.random()<1-miss)def*=1-maxIgnore;
  }
  let d=Math.max(1,source*power-def*.45)*(.91+Math.random()*.18);
  d*=elementDamageMultiplier(element,e?.attribute||'無');
  d*=weaponOutgoingMultiplier(attacker,e,type,normal,element);
  const fe=attacker?.figureEffects||figureEffectsFor(attacker?.id),el=normalizeElement(element),areaKey=currentBattleFigureAreaKey(),bonus=weaponConditionalCritBonus(attacker,e,type,normal,element)+Number(fe?.crit||0)+(type==='magic'?Number(fe?.magicCrit||0):0)+Number(fe?.areaCrit?.[areaKey]||0);
  if(normal)d*=1+Number(fe?.normalDamage||0);if(type==='physical')d*=1+Number(fe?.physicalDamage||0);if(type==='magic')d*=1+Number(fe?.magicDamage||0)+Number(fe?.elementMagicDamage?.[el]||0);d*=1+Number(fe?.elementDamage?.[el]||0);if(isWeaponWeaknessHit(element,e))d*=1+Number(fe?.weakDamage||0);if(state.battle?.currentActionKind==='ultimate')d*=1+Number(fe?.ultimateDamage||0);if(e?.category==='boss'||e?.isBoss)d*=1+Number(fe?.bossDamage||0);else if(e?.category==='normal')d*=1+Number(fe?.normalMonsterDamage||0);if(areaKey)d*=1+Number(fe?.areaDamage?.[areaKey]||0);d*=1+Number(fe?.damageBonus||0);
  const c=Math.random()<clamp(Math.max(TEMP_BALANCE.critRate+bonus,(crit||0)+bonus),0,.95);
  if(c)d*=TEMP_BALANCE.critPower;
  if(e?.metalBody&&!c)d=1;
  return{value:Math.max(1,Math.round(d)),crit:c,weak:isWeaponWeaknessHit(element,e),element};
}
function calcEnemyDamage(target,power,type='physical'){
  const e=actingEnemy()||state.battle.enemy;if(!e)return 0;
  const buff=(e.atkBuffTurns>0?1+e.atkBuff:1)*(e.groupAttackScale||1);
  let source,def;
  if(type==='magic'){source=e.mag*buff;def=effective('res',target);}
  else if(type==='hybrid'){source=((e.atk+e.mag)/2)*buff;def=(effective('def',target)+effective('res',target))/2;}
  else{source=e.atk*buff;def=effective('def',target);}
  const attrMul=elementDamageMultiplier(e.attribute||'無',target?.attribute||'無');
  const raw=(source*power-def*.30)*(.9+Math.random()*.2)*attrMul;
  const naturalFloor=Math.max(2,source*Math.max(.08,.10*power)*attrMul);
  return Math.max(1,Math.round(Math.max(raw,naturalFloor)));
}
function wakeEnemyOnHit(e){if(e?.status.sleep>0&&Math.random()<.70){e.status.sleep=0;notice(`${e.name}は眠りから覚めた！`,'status');}}
function recordEnemyDefeat(e){if(!e||e._defeatRecorded)return;e._defeatRecorded=true;state.battle?.defeatedEnemies?.push({uid:e.uid,id:e.id,name:e.name,level:e.level,category:e.category,coinReward:e.coinReward||0,rewardExp:e.rewardExp,rewardCoin:e.rewardCoin,rewardCoinBase:e.rewardCoinBase,rewardCoinPerLevel:e.rewardCoinPerLevel,rewardExpScale:e.rewardExpScale||1,rewardCoinScale:e.rewardCoinScale||1});}
function applyEnemyDamageTo(a,e,power,type='physical',crit=0,showGenericFx=true,showHitPulse=true){
  if(!e||e.hp<=0)return{value:0,crit:false};const uid=e.uid,r=calcDamage(a,type,power,crit,e);if(r.miss){renderBattle();showMiss(`enemy:${uid}`);return{...r,value:0};}let d=r.value;if(e.shieldTurns>0)d=Math.round(d*(1-(e.damageReduction||.2)));if(e.allyShieldTurns>0)d=Math.round(d*(1-(e.allyShieldReduction||.10)));const scriptedImmortal=state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalEnemy;e.hp=Math.max(scriptedImmortal?1:0,e.hp-d);
  if(e.hp<=0){
    recordEnemyDefeat(e);
    if((e.id==='boss-debuff'||e.id==='boss-berserk')&&state.battle?.pendingWaveConfigs?.[0]?.some(r=>r.id==='boss-debuff2'||r.id==='boss-berserk2'))state.battle.forcePhaseChange='tribe';
    if(state.battle.targetEnemyId===uid){const next=livingEnemies().find(x=>x.uid!==uid);state.battle.targetEnemyId=next?.uid||null;if(!state.battle.actingEnemyId)state.battle.enemy=next||e;}
  }
  if(r.crit&&!a.dead){const rate=weaponCritHealRate(a);if(rate>0)heal(a,a.maxHp*rate);const reduced=criticalUltimateCharge(a)>0;showCriticalBeat(a,reduced);}
  renderBattle();if(r.crit)setTimeout(()=>floatNumber(d,'crit',`enemy:${uid}`),Math.max(250,Math.round(660/state.speed)));else floatNumber(d,'damage',`enemy:${uid}`);if(showGenericFx)fx(type==='magic'?'magic':'slash',`enemy:${uid}`);if(showHitPulse)pulseEnemy('hit',uid);wakeEnemyOnHit(e);if(e.hp<=0)notice(`${e.name} DOWN`,'danger',520);return{...r,value:d};
}
function applyEnemyDamage(a,power,type='physical',crit=0,showGenericFx=true){return applyEnemyDamageTo(a,targetEnemy(),power,type,crit,showGenericFx);}
async function playerAoeDamage(a,power,type='physical',crit=0,statusKind='',statusChance=0,statusTurns=3){
  let total=0;const targets=[...livingEnemies()];if(!targets.length)return 0;
  /* v38: an allied all-target attack visually hits every living enemy at the same moment. */
  const fxKind=type==='magic'?'magic':'slash';
  for(const e of targets){fx(fxKind,`enemy:${e.uid}`);pulseEnemy('hit',e.uid);}
  await delay(55);
  for(const e of targets){const r=applyEnemyDamageTo(a,e,power,type,crit,false,true);total+=r.value;if(statusKind&&e.hp>0)applyEnemyStatusTo(e,statusKind,statusChance,statusTurns);await delay(170);}return total;
}
function applyEnemyStatusTo(e,kind,chance,turns=3){if(!e||e.hp<=0)return false;let c=chance;if(e.isBoss&&(kind==='paralyze'||kind==='sleep'))c*=.25;if(Math.random()>=c)return false;e.status[kind]=Math.max(e.status[kind],e.isBoss?rint(1,2):turns);return true;}
function heal(a,amount){if(a.dead)return 0;const fe=a.figureEffects||figureEffectsFor(a.id);amount*=1+Number(fe?.healBoost||0);const before=a.hp;a.hp=Math.min(a.maxHp,a.hp+amount);const h=Math.round(a.hp-before);if(h>0)floatNumber(h,'heal',a.id);return h;}
function healField(ratio){let total=0;livingField().forEach(a=>total+=heal(a,a.maxHp*ratio));renderBattle();return total;}
function restoreMpField(ratio){livingField().forEach(a=>a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*ratio));renderBattle();}
function cleanse(a){Object.keys(a.status).forEach(k=>a.status[k]=0);}
function applyBossStatus(kind,chance,turns=3){return applyEnemyStatusTo(targetEnemy(),kind,chance,turns);}

async function choosePinkReviveTarget(candidates){
  if(!candidates.length)return null;if(candidates.length===1||state.battle?.auto)return candidates[0];
  const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent='支える力';$('#skillMenuTitle').textContent='復活する味方を選択';
  list.innerHTML=candidates.map(a=>`<button class="skill-item" data-pink-revive="${a.id}" type="button"><span class="ult-thumb"><img src="${versionedPlay(a.image)}" alt=""><i>復</i></span><div><b>${a.name}</b><small>DOWN / 支える力で復活</small></div><em>SELECT</em></button>`).join('');bindImages(list);
  return new Promise(resolve=>{$$('[data-pink-revive]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;resolve(allyById(btn.dataset.pinkRevive));});});
}
async function checkSpecialRevives(){
  const field=fieldAllies();
  for(const a of field){if(a.dead&&a.id==='lilith'&&!a.lilithReviveUsed){await reactivePassiveBeat(a,'ウルモブリリス！');a.dead=false;a.lilithReviveUsed=true;a.transformed=true;a.hp=Math.round(a.maxHp*.60);a.atk*=1.2;a.mag*=1.2;a.def*=1.2;a.res*=1.2;a.spd*=1.2;renderBattle();notice('モブリリスがHP60%で復活！ ALL STATUS +20%','heal',900);await fixedDelay(650);}}
  const pink=field.find(a=>a.id==='pink'&&!a.dead&&a.hp>0&&!a.pinkReviveUsed),downed=field.filter(a=>a.id!=='pink'&&a.dead);
  if(pink&&downed.length){const target=await choosePinkReviveTarget(downed);if(target){await reactivePassiveBeat(pink,'支える力！');pink.pinkReviveUsed=true;pink.hp=Math.max(1,Math.floor(pink.hp*.5));target.dead=false;target.hp=Math.max(1,Math.round(target.maxHp*.35));renderBattle();notice(`${target.name}が復活！`,'heal',650);await fixedDelay(650);}}
}
async function maybeArtistCleanse(target){const riro=livingField().find(a=>a.id==='riro');if(riro&&target&&passiveChance(.50)){await reactivePassiveBeat(riro,'アーティスト・マインド！');cleanse(target);notice(`${target.name}の状態異常を解除！`,'status');await fixedDelay(600);return true;}return false;}
function isSuper(a){return state.battle.superIds.includes(a.id);}
async function triggerYushaMission(downed){
  if(!downed||downed.id==='yusha')return;const y=livingField().find(x=>x.id==='yusha'&&!x.dead&&x.hp>0);if(!y)return;
  await reactivePassiveBeat(y,'勇者の使命！',920);const h=heal(y,y.maxHp*.30);y.missionBuff=Number(y.missionBuff||0)+.10;renderBattle();notice(`HP +${h} / ALL STATUS +10%`,'buff',850);await fixedDelay(520);
}
async function damageAlly(a,power,type='physical',superHalf=false,element=''){
  if(!a||a.dead)return 0;
  const fe=a.figureEffects||figureEffectsFor(a.id),ev=clamp(weaponEvasion(a)+Number(fe.evade||0),0,.65);if(ev>0&&Math.random()<ev){notice(`${a.name}は攻撃を回避！`,'system',520);return 0;}
  if(a.barrier>0){a.barrier--;notice(`${a.name}のバリアが攻撃を無効化！`,'buff');renderBattle();return 0;}
  let d=calcEnemyDamage(a,power,type),incomingElement=normalizeElement(element||actingEnemy()?.attribute||'無'),wr=weaponResistance(a,incomingElement);
  if(wr>0)d=Math.max(1,Math.round(d*(1-wr)));const fr=figureResistanceTotal(a.id,incomingElement);if(fr>0)d=Math.max(1,Math.round(d*(1-fr)));if(fe.damageCut)d=Math.max(1,Math.round(d*(1-clamp(fe.damageCut,0,.65))));if(type==='physical'&&fe.physicalCut)d=Math.max(1,Math.round(d*(1-clamp(fe.physicalCut,0,.65))));if(fe.elementCut?.[incomingElement])d=Math.max(1,Math.round(d*(1-clamp(fe.elementCut[incomingElement],0,.65))));if(type==='physical'&&fe.elementPhysicalCut?.[incomingElement])d=Math.max(1,Math.round(d*(1-clamp(fe.elementPhysicalCut[incomingElement],0,.65))));if(type==='magic'&&fe.elementMagicCut?.[incomingElement])d=Math.max(1,Math.round(d*(1-clamp(fe.elementMagicCut[incomingElement],0,.65))));const areaCut=Number(fe.areaCut?.[currentBattleFigureAreaKey()]||0);if(areaCut)d=Math.max(1,Math.round(d*(1-clamp(areaCut,0,.65))));
  if(incomingElement==='闇')d=Math.max(1,Math.round(d*(1-weaponDarkResist(a))));
  if(type==='physical')d=Math.max(1,Math.round(d*(1-weaponPhysicalCut(a))));else if(type==='hybrid')d=Math.max(1,Math.round(d*(1-weaponPhysicalCut(a)*.5)));
  const hr=a.maxHp>0?a.hp/a.maxHp:1;
  for(const t of weaponTraitList(a,'lowHpDamageCut'))if(hr<=Number(t.threshold||0))d=Math.max(1,Math.round(d*(1-Number(t.value||0))));
  if(type==='magic'||type==='hybrid')for(const t of weaponTraitList(a,'lowHpMagicCut'))if(hr<=Number(t.threshold||0))d=Math.max(1,Math.round(d*(1-Number(t.value||0)*(type==='hybrid'?.5:1))));
  if(superHalf||isSuper(a))d=Math.round(d*.5);
  if(a.guardTurns>0)d=Math.round(d*(1-a.guard)*(1-weaponGuardExtraCut(a)));
  if(a.damageCutTurns>0)d=Math.round(d*(1-a.damageCut));
  if(state.battle.teamGuardTurns>0)d=Math.round(d*(1-state.battle.teamGuard));
  if(a.id==='yusha'&&state.battle.yushaGuardTurns>0)d=Math.round(d*(1-state.battle.yushaGuard));
  const desert=livingField().find(x=>x.id==='desert');if(desert&&passiveChance(.10)){await reactivePassiveBeat(desert,'サバクノマモリビト！');d=Math.round(d*.8);await fixedDelay(360);}
  const scriptedImmortal=state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalParty,wasAlive=!a.dead&&a.hp>0;a.hp=Math.max(scriptedImmortal?1:0,a.hp-d);
  if(a.hp<=0)a.dead=true;
  renderBattle();pulseAllyDamage(a.id);floatNumber(d,'damage',a.id);fx((type==='magic'||type==='hybrid')?'magic':'enemy',a.id);if(a.dead){notice(`${a.name} DOWN`,'danger',850);if(wasAlive)await triggerYushaMission(a);}return d;
}
async function inflictAllyStatus(a,kind,turns){if(!a||a.dead)return false;const resist=clamp(.2+figureStatusResistance(a.id,kind),0,.9);if(Math.random()<resist)return false;a.status[kind]=Math.max(a.status[kind],turns);if(await maybeArtistCleanse(a))return false;return true;}

async function performAttack(a,auto=false){
  await actionCutin(`${a.name}の攻撃！`,'system',480);
  let crit=TEMP_BALANCE.critRate,denPassive=false;
  if(a.id==='denden'&&passiveChance(.10)){await passiveBeat(a,'デンデン・ムキムキ・カナリツヨイ！');crit=1;denPassive=true;}
  const targetBefore=targetEnemy(),nyoroAoe=a.id==='nyoro'&&livingEnemies().length>1&&passiveChance(.70),armorAoe=livingEnemies().length>1&&!!(a.figureEffects||figureEffectsFor(a.id)).normalAoe,weaponAoe=livingEnemies().length>1&&Math.random()<weaponNormalAoeChance(a);
  if(nyoroAoe)await passiveBeat(a,'マグマスイミング！');else if(weaponAoe)notice('武器特性 / 通常攻撃が全体化！','buff',620);
  const prev=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:true,element:weaponCombatElement(a)};
  let dealt=0,last=null;
  try{
    await weaponElementAttackFx(a);
    if(nyoroAoe||armorAoe||weaponAoe)dealt=await playerAoeDamage(a,1,'physical',crit);
    else{last=applyEnemyDamage(a,1,'physical',crit,false);dealt=last.value||0;}
    const life=weaponNormalLifesteal(a);if(life>0&&dealt>0&&!a.dead){const h=heal(a,dealt*life);if(h)notice(`武器特性 / HP +${h}`,'heal',520);}
    const poison=weaponPoisonOnHitChance(a);if(poison>0&&targetBefore?.hp>0&&Math.random()<poison){applyEnemyStatusTo(targetBefore,'poison',1,3);notice(`武器特性 / ${targetBefore.name}を毒にした！`,'status',600);}
    const f=weaponFollowupSpec(a,'normalFollowup');if(f.chance>0&&livingEnemies().length&&Math.random()<f.chance){notice('武器特性 / 追撃！','buff',480);await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,f.power||.5,'physical',TEMP_BALANCE.critRate,false);}
    const mf=weaponFollowupSpec(a,'normalMagFollowup');if(mf.chance>0&&livingEnemies().length&&Math.random()<mf.chance){notice('武器特性 / MAG追撃！','buff',480);const old=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:false,element:weaponCombatElement(a)};applyEnemyDamage(a,mf.power||.5,'magic',0,false);state.battle.weaponAttackContext=old;}
  }finally{state.battle.weaponAttackContext=prev;}
  if(denPassive)await fixedDelay(600);
  if(a.id==='tetsu'&&livingEnemies().length&&passiveChance(.30)){await passiveBeat(a,'テツの意志！');await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,.85,'physical',TEMP_BALANCE.critRate,false);await fixedDelay(600);}
  await delay(auto?250:340);
}
function defaultMagicFor(a){const element=normalizeElement(a.attribute),all=MOB_DATA.magicCatalog||[];return all.find(x=>x.element===element&&x.tier==='medium')||all.find(x=>x.element===element)||null;}
async function performMagic(a,skill=null,auto=false){
  const chosen=skill?.id?skill:defaultMagicFor(a);if(!chosen)return false;const element=normalizeElement(chosen.element||a.attribute),cut=clamp(weaponMagicMpCut(a,element)+Number((a.figureEffects||figureEffectsFor(a.id)).mpCut||0),0,.8),cost=Math.max(0,Math.ceil((chosen.cost||0)*(1-cut))),freeChance=weaponMagicFreeChance(a,element),free=freeChance>0&&Math.random()<freeChance;
  if(a.mpNow<(free?0:cost)){notice('MPが足りない！','danger');return false;}if(!free)a.mpNow-=cost;else notice('武器特性 / 消費MP 0！','buff',520);
  const magicReady=preloadAssets(chosen.frames||[]);await actionCutin(`${a.name}の${chosen.name}！`,'system',620);await magicReady;const prev=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:false,element};
  try{
    if(chosen.target==='all'||(a.figureEffects||figureEffectsFor(a.id)).magicAoe){await skillSprite(chosen.frames,'enemy-all',chosen.mode);await playerAoeDamage(a,chosen.power,'magic',0);}
    else{const targetBefore=targetEnemy();await skillSprite(chosen.frames,'enemy',chosen.mode);applyEnemyDamage(a,chosen.power,'magic');const darkHeal=weaponDarkMagicHitHeal(a);if(darkHeal>0&&String(targetBefore?.attribute||'').includes('闇')&&!a.dead){const h=heal(a,darkHeal);if(h)notice(`武器特性 / HP +${h}`,'heal',520);}const rep=weaponFollowupSpec(a,'magicFollowup',element);if(rep.chance>0&&targetEnemy()?.hp>0&&Math.random()<rep.chance){notice('武器特性 / 追撃魔法！','buff',520);await skillSprite(chosen.frames,'enemy',chosen.mode);applyEnemyDamage(a,chosen.power*(rep.power||.5),'magic');}if(a.id==='jessie'&&element==='雷'&&targetEnemy()?.hp>0&&passiveChance(.50)){await passiveBeat(a,'ダブルサンダー！');await skillSprite(chosen.frames,'enemy',chosen.mode);applyEnemyDamage(a,chosen.power*.9,'magic');await fixedDelay(600);}}
  }finally{state.battle.weaponAttackContext=prev;}await delay(auto?260:360);return true;
}
function temporaryTechnique(a){const w=String(weaponCombatType(a)||a.weapon||'');if(w.includes('大剣'))return{name:'大剣・強斬り',cost:4,power:1.14};if(w.includes('太刀'))return{name:'太刀・疾風斬り',cost:4,power:1.12};if(w.includes('槍'))return{name:'槍・貫通突き',cost:4,power:1.10};if(w.includes('銃'))return{name:'ガンラッシュ',cost:4,power:1.10};if(w.includes('杖'))return{name:'スタッフブロウ',cost:3,power:1.06};return{name:'特殊攻撃',cost:3,power:1.08};}
async function performSpecial(a,tech=null){
  const t=tech?.id?tech:temporaryTechnique(a),cost=Math.max(0,Math.ceil((t.cost||0)*(1-clamp(Number((a.figureEffects||figureEffectsFor(a.id)).mpCut||0),0,.8))));if(a.mpNow<cost){notice('MPが足りない！','danger');return false;}a.mpNow-=cost;await actionCutin(`${a.name}の${t.name}！`,'system',600);
  if(t.kind==='status'){await skillSprite(t.frames||[],'enemy',t.mode);const e=targetEnemy();if(e){const prev=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:false,element:normalizeElement(t.element||'無')};try{applyEnemyDamageTo(a,e,t.power||1.20,'physical',TEMP_BALANCE.critRate,false);}finally{state.battle.weaponAttackContext=prev;}if(e.hp>0&&applyEnemyStatusTo(e,t.status,t.chance||.60,t.status==='stun'?1:3))notice(`${e.name}は${{confuse:'混乱',sleep:'眠り',burn:'やけど',poison:'毒',paralyze:'マヒ'}[t.status]||'状態異常'}になった！`,'status',720);else if(e.hp>0)notice('状態異常は効かなかった！','system',520);}}
  else if(t.id){await skillSprite(t.frames||[],'enemy',t.mode);const prev=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:false,element:normalizeElement(t.element||'無')};try{applyEnemyDamage(a,t.power||1,'physical',TEMP_BALANCE.critRate,false);}finally{state.battle.weaponAttackContext=prev;}}
  else{await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,t.power,'physical',TEMP_BALANCE.critRate,false);}await delay(340);return true;
}
async function performUltimate(a,u){const ui=a.ults.indexOf(u);if(ui<0||ultimateRemaining(a,ui)>0){notice('必殺技のCTが溜まっていません！','danger');return false;}const cost=Math.max(0,Math.ceil(u.cost*(1-clamp(Number((a.figureEffects||figureEffectsFor(a.id)).mpCut||0),0,.8))));if(a.mpNow<cost){notice('MPが足りない！','danger');return false;}a.mpNow-=cost;if(!Array.isArray(a.ultCooldowns))initUltimateCooldowns(a);a.ultCooldowns[ui]=ultimateEffectiveCt(a,u,ui);persistUltimateCooldownsFromBattle();const prevAttackContext=state.battle.weaponAttackContext;state.battle.weaponAttackContext={...(prevAttackContext||{}),normal:false,sure:!!u.sure,element:u.attackElement||normalizeElement(a.attribute)};let total=0,r,lastHitEnemy=null;
  try{await ultimateCutin(a,u);await playUltimatePostAnimation(a,u);
  const hit=async(power=u.power,type=u.type||'physical',crit=u.crit||0)=>{const e=targetEnemy();lastHitEnemy=e;r=applyEnemyDamageTo(a,e,power,type,crit);total+=r.value;await delay(240);return r;};
  const hitEnemy=async(e,power=u.power,type=u.type||'physical',crit=u.crit||0)=>{lastHitEnemy=e;r=applyEnemyDamageTo(a,e,power,type,crit);total+=r.value;await delay(220);return r;};
  const aoe=async(power=u.power,type=u.type||'physical',crit=u.crit||0,status='',chance=0,turns=3)=>{const x=await playerAoeDamage(a,power,type,crit,status,chance,turns);total+=x;return x;};
  const allEnemyDebuff=(key,value,turns=3)=>{for(const e of livingEnemies()){e[key]=value;e[`${key}Turns`]=turns;}};
  switch(u.kind){
    case'selfAllBuff':a.allBuff=.20;a.allBuffTurns=rint(3,5);a.damageCut=.10;a.damageCutTurns=a.allBuffTurns;fx('buff',a.id);notice('ALL STATUS ↑↑ / DAMAGE CUT','buff');break;
    case'jumanji':{await hit();const buff=pick(['atk','def','spd']);a[`${buff}Buff`]=.15;a[`${buff}BuffTurns`]=3;const deb=pick(['defDebuff','spdDebuff']);for(const e of livingEnemies()){e[deb]=.12;e[`${deb}Turns`]=3;}notice(`${buff.toUpperCase()} ↑ / ENEMY ALL ${deb.startsWith('def')?'DEF':'SPD'} ↓`,'buff');break;}
    case'lowHpBurst':{const all=livingField(),avg=all.reduce((s,x)=>s+x.hp/x.maxHp,0)/Math.max(1,all.length);await hit(u.power*(1+(1-avg)*.65),'magic');break;}
    case'heroTransform':heal(a,a.maxHp*.5);a.transformed=true;a.allBuff=.30;a.allBuffTurns=99;if(Array.isArray(a.ultCooldowns)){a.ultCooldowns=a.ultCooldowns.map(v=>Math.max(0,(Number(v)||0)-3));persistUltimateCooldownsFromBattle();}notice('あのヒーローに変身！ ALL STATUS ↑30% / 必殺技CT -3','buff',1100);break;
    case'shieldAttack':await hit();a.guard=.20;a.guardTurns=1;notice('GUARD ↑','buff');break;
    case'healCleanse':healField(u.power);livingField().forEach(x=>{if(Math.random()<.5)cleanse(x);fx('heal',x.id);});notice('PARTY HP RECOVER / CLEANSE','heal');break;
    case'yushaGuardAoe':await aoe();state.battle.yushaGuard=.50;state.battle.yushaGuardTurns=1;notice('勇者 DAMAGE CUT','buff');break;
    case'teamGuardAoe':await aoe();state.battle.teamGuard=.30;state.battle.teamGuardTurns=2;notice('PARTY GUARD / 2 TURN','buff');break;
    case'selfHealAttack':heal(a,a.maxHp*.16);await hit();notice('HP RECOVER','heal');break;
    case'goldAttack':{await hit();if(state.battle?.mode!=='training'){const gold=rint(10,50);state.coins=(Number(state.coins)||0)+gold;state.meta.coins=state.coins;saveMeta();notice(`GOLD +${gold}`,'buff',650);}break;}
    case'speedDebuffAttack':await hit();if(lastHitEnemy){lastHitEnemy.spdDebuff=.15;lastHitEnemy.spdDebuffTurns=3;}notice('SPD ↓↓','status');break;
    case'aoeSpeedDebuff':await aoe();allEnemyDebuff('spdDebuff',.15,3);notice('ENEMY ALL SPD ↓↓','status');break;
    case'burnAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'burn',u.chance||.1))notice(`${lastHitEnemy.name}はやけど状態！`,'status');break;
    case'aoeBurn':await aoe(u.power,u.type||'physical',0,'burn',u.chance||.1,3);notice('敵全体にやけど判定！','status');break;
    case'teamDefAoe':await aoe();livingField().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});notice('PARTY DEF ↑','buff');break;
    case'teamDefAttack':await hit();livingField().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});notice('PARTY DEF ↑','buff');break;
    case'selfCleanseAttack':cleanse(a);await hit();notice('状態異常解除！','status');break;
    case'sleepAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'sleep',u.chance||.1))notice(`${lastHitEnemy.name}は眠った！`,'status');break;
    case'paralyzeAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'paralyze',u.chance||.1))notice(`${lastHitEnemy.name}はマヒした！`,'status');break;
    case'aoeSelfSpd':await aoe();a.spdBuff=.18;a.spdBuffTurns=3;notice('SPD ↑','buff');break;
    case'selfSpdAttack':await hit();a.spdBuff=.18;a.spdBuffTurns=3;notice('SPD ↑','buff');break;
    case'playerSinglePlusAoe':await hit();await aoe(u.aoePower||.70,u.type||'magic');break;
    case'playerSinglePlusAoeParalyze':await hit();await aoe(u.aoePower||1.35,u.type||'physical',0,'paralyze',u.chance||.10,2);notice('敵全体にマヒ判定！','status');break;
    case'lilithSisters':{const elements=['火','雷','光','水'];let n=0;for(const el of elements){if(!livingEnemies().length)break;const old=state.battle.weaponAttackContext;state.battle.weaponAttackContext={...(old||{}),normal:false,element:el};try{await hitEnemy(pick(livingEnemies()),u.power||1.30,'magic');n++;}finally{state.battle.weaponAttackContext=old;}}notice(`${n} ELEMENT HIT`,'system',520);break;}
    case'multiAttack':{const n=rint(u.hits?.[0]||3,u.hits?.[1]||6),multiScale=a.id==='denden'?.82:.90,hitPower=(u.power||1)*multiScale;for(let i=0;i<n&&livingEnemies().length;i++)await hitEnemy(pick(livingEnemies()),hitPower,u.type||'physical');notice(`${n} HIT`,'system',420);break;}
    case'teamRecovery':healField(.16);restoreMpField(.10);livingField().forEach(x=>{x.defBuff=.12;x.defBuffTurns=3;});notice('PARTY HP/MP RECOVER / DEF ↑','heal');break;
    case'stunAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'stun',u.chance||.1,1))notice(`${lastHitEnemy.name}をひるませた！`,'status');break;
    case'aoeStun':await aoe(u.power,u.type||'physical',0,'stun',u.chance||.1,1);notice('敵全体にひるみ判定！','status');break;
    case'selfRecoveryAttack':await hit();heal(a,a.maxHp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*.08);notice('HP・MP RECOVER','heal');break;
    case'teamHealGuard':healField(u.power||.28);state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('PARTY HP RECOVER / DAMAGE CUT','heal');break;
    case'fullHealBarrier':heal(a,a.maxHp);livingField().forEach(x=>x.barrier=Math.max(x.barrier,1));notice('FULL HEAL / PARTY BARRIER','heal');break;
    case'teamAtkAttack':await hit();livingField().forEach(x=>{x.atkBuff=.15;x.atkBuffTurns=3;});notice('PARTY ATK ↑','buff');break;
    case'healAttack':healField(u.heal||.24);await hit();notice('PARTY HP RECOVER','heal');break;
    case'tetsuFinal':a.atkBuff=.18;a.atkBuffTurns=3;{const e=targetEnemy();if(e){e.defDebuff=.15;e.defDebuffTurns=3;await hitEnemy(e);}}notice('ATK ↑ / DEF ↓','buff');break;
    case'healAoeStun':healField(u.heal||.25);restoreMpField(.10);await aoe(u.power,u.type||'magic',0,'stun',u.chance||.3,1);notice('PARTY RECOVER / 敵全体ひるみ判定','heal');break;
    case'healStunAttack':healField(u.heal||.25);restoreMpField(.10);await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'stun',u.chance||.3,1))notice('ひるみ！','status');else notice('PARTY RECOVER','heal');break;
    case'poisonAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'poison',u.chance||.3))notice(`${lastHitEnemy.name}は毒になった！`,'status');break;
    case'aoePoison':await aoe(u.power,u.type||'physical',0,'poison',u.chance||.3,3);notice('敵全体に毒判定！','status');break;
    case'narakuShield':a.damageCut=.20;a.damageCutTurns=3;state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('GUARD ↑↑ / PARTY GUARD ↑','buff');break;
    case'selfAtkAoe':a.atkBuff=.18;a.atkBuffTurns=3;await aoe();notice('ATK ↑ / ENEMY ALL DAMAGE','buff');break;
    case'selfAtkAttack':a.atkBuff=.18;a.atkBuffTurns=3;await hit();notice('ATK ↑','buff');break;
    case'aoeCrit':{for(const e of [...livingEnemies()]){const extra=Math.random()<(u.crit||.10)?1:0;await hitEnemy(e,u.power,u.type||'magic',extra);}break;}
    case'teamHealMpGuard':healField(u.heal||.26);restoreMpField(u.mpHeal||.18);state.battle.teamGuard=.30;state.battle.teamGuardTurns=2;notice('PARTY HP/MP RECOVER / DAMAGE CUT 30%','heal',900);break;
    case'aoeDamage':await aoe();break;
    case'damage':default:await hit();break;
  }
  }finally{state.battle.weaponAttackContext=prevAttackContext;}
  renderBattle();await delay(250);return true;
}

async function applyRoundDots(){
  for(const e of state.battle.enemies||[]){if(e.hp<=0)continue;for(const k of ['poison','burn'])if(e.status[k]>0){const d=Math.max(1,Math.round(e.maxHp*.025));e.hp=Math.max(state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalEnemy?1:0,e.hp-d);e.status[k]--;floatNumber(d,'damage',`enemy:${e.uid}`);notice(`${e.name}に${k==='poison'?'毒':'やけど'}ダメージ！`,'status');if(e.hp<=0){recordEnemyDefeat(e);if((e.id==='boss-debuff'||e.id==='boss-berserk')&&state.battle?.pendingWaveConfigs?.[0]?.some(r=>r.id==='boss-debuff2'||r.id==='boss-berserk2'))state.battle.forcePhaseChange='tribe';}}}
  for(const a of fieldAllies()){if(a.dead)continue;for(const k of ['poison','burn'])if(a.status[k]>0){const d=Math.max(1,Math.round(a.maxHp*.025));a.hp=Math.max(state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalParty?1:0,a.hp-d);a.status[k]--;floatNumber(d,'damage',a.id);const card=$(`[data-ally-id="${a.id}"]`,$('#partyHud')||document);if(card){card.classList.remove('status-damage-shake');void card.offsetWidth;card.classList.add('status-damage-shake');setTimeout(()=>card.classList.remove('status-damage-shake'),420);}if(a.hp<=0){a.dead=true;notice(`${a.name} DOWN`,'danger');}else notice(`${a.name}に${k==='poison'?'毒':'やけど'}ダメージ！`,'status');}}
  if(!livingEnemies().length)state.battle.targetEnemyId=null;renderBattle();await checkSpecialRevives();
}
function tickBuffs(){const b=state.battle;for(const e of b.enemies||[])for(const k of ['shieldTurns','allyShieldTurns','atkBuffTurns','defBuffTurns','defDebuffTurns','spdDebuffTurns'])if(e[k]>0&&e[k]<90)e[k]--;if(b.teamGuardTurns>0)b.teamGuardTurns--;if(b.yushaGuardTurns>0)b.yushaGuardTurns--;fieldAllies().forEach(a=>{for(const k of ['guardTurns','damageCutTurns','atkBuffTurns','atkDebuffTurns','defBuffTurns','spdBuffTurns','spdDebuffTurns'])if(a[k]>0)a[k]--;if(a.allBuffTurns>0&&a.allBuffTurns<90)a.allBuffTurns--;});}
function initiativeSpeed(entry){if(entry.type==='enemy'){const e=enemyByUid(entry.enemyId);if(e?.preemptive&&(state.battle?.turn||1)===1)return 10000+e.spd;return e?e.spd*(e.spdDebuffTurns>0?1-e.spdDebuff:1):0;}const a=allyById(entry.id);return a?effective('spd',a):0;}
async function playFrezardFusion(){
  const b=state.battle,field=$('#battleField')||$('#battleScreen'),layer=$('#battleFxLayer');if(!b||!field||!layer)return;const fr=field.getBoundingClientRect(),center={x:fr.width*.5,y:fr.height*.43},sources=(b.enemies||[]).slice(0,2);const ghosts=[];
  for(const e of sources){const vis=enemyVisual(e.uid),r=vis?.getBoundingClientRect();if(!vis||!r)continue;const img=document.createElement('img');img.className='fusion-ghost';img.src=e.image||'';img.style.left=`${r.left-fr.left+r.width/2}px`;img.style.top=`${r.top-fr.top+r.height/2}px`;img.style.width=`${Math.max(42,r.width)}px`;img.style.height=`${Math.max(42,r.height)}px`;img.style.setProperty('--merge-x',`${center.x-(r.left-fr.left+r.width/2)}px`);img.style.setProperty('--merge-y',`${center.y-(r.top-fr.top+r.height/2)}px`);layer.appendChild(img);ghosts.push(img);}
  await nextPaint();ghosts.forEach(g=>g.classList.add('merge'));await actionCutin('2人の魔物は合体した！','danger',850);await fixedDelay(120);ghosts.forEach(g=>g.remove());await storyFlashBattle();
}
async function storyFlashBattle(){const el=document.createElement('div');el.className='battle-fusion-flash';$('#battleFxLayer')?.appendChild(el);await fixedDelay(260);el.remove();}
async function storyDarkBattlePulse(){const el=document.createElement('div');el.className='battle-dark-pulse';$('#battleFxLayer')?.appendChild(el);await nextPaint();el.classList.add('show');await fixedDelay(420);el.classList.remove('show');await fixedDelay(260);el.remove();}
async function spawnNextEnemyWave(){
  const b=state.battle;if(!b?.pendingWaveConfigs?.length)return false;
  const records=b.pendingWaveConfigs.shift(),isFrezard=records.some(r=>r.id==='m-frezard'),isTribeTransform=records.some(r=>r.id==='boss-debuff2'||r.id==='boss-berserk2'),isGidora=records.some(r=>r.id==='boss-gidora'),isMira2=records.some(r=>r.id==='boss-mira2-d2'),isLilithPartyA=records.some(r=>r.id==='boss-lilith-castle')&&b.config?.lilithSplitBattle,isD2Pair2=records.length===2&&records.some(r=>r.id==='d2-miranight')&&records.some(r=>r.id==='d2-miratime'),isD2Revive=records.length===4&&['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'].every(id=>records.some(r=>r.id===id))&&records.some(r=>Number(r.startingHpRate)>0&&Number(r.startingHpRate)<=.31);
  if(isLilithPartyA){await actionCutin('Bパーティー勝利！ 次はAパーティーであります！','system',1000);switchBattleToLilithPartyA();}
  if(isFrezard)await playFrezardFusion();
  if(isGidora){const oldDragon=(b.enemies||[]).find(e=>e.id==='boss-dragon2');if(oldDragon)await enemyStoryCutin(oldDragon,`素晴らしい\n本当に素晴らしいぞ勇者よ！\n私は嬉しいぞ\nようやく\n本当の好敵手に出会えた！！`,1200);await storyFlashBattle();}
  if(isMira2){const oldMira=(b.enemies||[]).find(e=>e.id==='boss-mira-d2');if(oldMira)await enemyStoryCutin(oldMira,'いいぞ\nそうこなくては\n面白くない！！',920);await storyDarkBattlePulse();}
  if(isD2Revive){
    await allyStoryCutin('money','・・・・？\nなんだろう\n嫌な予感がする',1650);await fixedDelay(220);
    await allyStoryCutin('desert','終わってないのか？',1500);await fixedDelay(220);
    await storyDarkBattlePulse();
    const oldTime=(b.enemies||[]).find(e=>e.id==='d2-miratime');if(oldTime)await enemyStoryCutin(oldTime,'ソウル・タイム・ミラー！！',1750);else await actionCutin('ソウル・タイム・ミラー！！','danger',1600);
  }
  const next=buildEnemyWave(records,Math.min(4,b.allies.length),b.bg,b.fallbackBg);if(!next.length)return false;
  b.enemies=next;b.targetEnemyId=next[0].uid;b.enemy=next[0];b.actingEnemyId=null;b.queue=[];b.queuePos=0;renderBattle();
  if(isFrezard){
    await actionCutin('モブフレザードが出現！','danger',650);
    await fixedDelay(260);await allyStoryCutin('denden','合体した！？\nか、かっこいいでやんす・・',1800);
    await fixedDelay(260);await allyStoryCutin('money','そんなこと言ってる場合！？',1750);
    await fixedDelay(260);{const e=next.find(x=>x.id==='m-frezard');if(e)await enemyStoryCutin(e,'お前たちは危険だ\nここで確実に仕留める',1850);}
  }else if(isTribeTransform){
    await actionCutin('第二形態へ変身！','danger',720);
    await fixedDelay(260);await allyStoryCutin('money','なんてオーラなの・・',1750);
    await fixedDelay(260);await allyStoryCutin('nyoro','こ、怖いニョロ・・',1750);
    await fixedDelay(260);await allyStoryCutin('denden','やってやるでやんす！',1750);
  }else if(isGidora){
    await actionCutin('モブギドラに変身！','danger',760);
  }else if(isMira2){
    await actionCutin('ミラモブⅡに変身した！','danger',760);
  }else if(isLilithPartyA){
    await actionCutin('Aパーティー出陣！ モブリリス、覚悟であります!!','danger',1000);
  }else if(isD2Pair2){
    for(const e of next){e.atkBuff=.20;e.atkBuffTurns=99;e.defBuff=.20;e.defBuffTurns=99;}
    await actionCutin('モブミラナイト・モブミラタイムが出現！','danger',760);
    await fixedDelay(220);{const e=next.find(x=>x.id==='d2-miranight');if(e)await enemyStoryCutin(e,'中々やるじゃないか',1750);}
    await fixedDelay(220);{const e=next.find(x=>x.id==='d2-miratime');if(e)await enemyStoryCutin(e,'遊びすぎなんですよあの二人は',1800);}
    await fixedDelay(220);{const e=next.find(x=>x.id==='d2-miranight');if(e)await enemyStoryCutin(e,'では始めから全力で行くとしよう',1800);}
    await fixedDelay(220);{const e=next.find(x=>x.id==='d2-miratime');if(e)await enemyStoryCutin(e,'そうですね\nあっという間に終わらせましょう',1850);}
    await fixedDelay(160);await actionCutin('2人のATKとDEFが20%アップした！','buff',760);
  }else if(isD2Revive){
    await fixedDelay(260);await allyStoryCutin('jessie','そんな！！',1500);
    const earth=next.find(e=>e.id==='d2-miraearth'),karami=next.find(e=>e.id==='d2-mirakarami'),night=next.find(e=>e.id==='d2-miranight'),time=next.find(e=>e.id==='d2-miratime');
    if(earth)await enemyStoryCutin(earth,'結局勝つのは私たちだ！',1600);
    if(karami)await enemyStoryCutin(karami,'派手に暴れてやるぜ！',1600);
    if(night)await enemyStoryCutin(night,'決着をつけようか',1600);
    if(time)await enemyStoryCutin(time,'ゲームオーバーです',1600);
    await allyStoryCutin('money','みんな、私に任せて！',1650);
    for(const a of livingField()){const h=Math.round(a.maxHp*.30),before=a.hp;a.hp=Math.min(a.maxHp,a.hp+h);if(a.hp>before)floatNumber(a.hp-before,'heal',a.id);}
    renderBattle();await actionCutin('モブマニーの魔力により\n全員のHPが30%回復した！','heal',1500);
  }else{
    await actionCutin('ENEMY PHASE CHANGE!','danger',650);notice(`${next.map(e=>e.name).join('・')}が現れた！`,'danger',900);
  }
  await fixedDelay(450);b.turn++;b.busy=false;startRound();return true;
}
async function handleForcedEnemyPhase(){
  const b=state.battle;if(!b?.forcePhaseChange)return false;
  const phase=b.forcePhaseChange;b.forcePhaseChange=null;
  if(phase==='tribe'&&b.pendingWaveConfigs?.length){
    // As soon as either first form falls, both immediately transform. The surviving first form does not take another action.
    for(const e of b.enemies||[])if(e.id==='boss-debuff'||e.id==='boss-berserk')e.hp=0;
    renderBattle();await fixedDelay(300);return await spawnNextEnemyWave();
  }
  return false;
}
async function handleEnemyWaveClear(){if(livingEnemies().length)return false;if(state.battle.pendingWaveConfigs?.length)return await spawnNextEnemyWave();finishBattle(true);return true;}
async function startRound(){
  const b=state.battle;if(!b||b.finished)return;b.busy=true;b.queuePos=0;await applyRoundDots();await checkBattleHpDialogue();if(b.forcePhaseChange){b.busy=false;return handleForcedEnemyPhase();}if(!livingEnemies().length){b.busy=false;return handleEnemyWaveClear();}if(!livingRoster().length)return finishBattle(false);await resolveRequiredReplacements();if(!livingRoster().length)return finishBattle(false);
  for(const a of fieldAllies().filter(x=>!x.dead)){
    if(a.id==='nekoku'&&passiveChance(.30)){const target=[...livingField()].sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];if(target){await passiveBeat(a,'癒しのプニプニ！');const h=heal(target,target.maxHp*.22);if(h)notice(`${target.name} HP +${h}`,'heal');await fixedDelay(600);}}
    if(a.id==='money'&&passiveChance(.30)){await passiveBeat(a,'マニーは海を渡る！');const m=Math.round(a.maxMp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+m);notice(`MP +${m}`,'heal');await fixedDelay(600);}
    if(a.id==='naraku'){await passiveBeat(a,'魔王の系譜！');a.narakuStacks++;a.allBuff=a.narakuStacks*.10;a.allBuffTurns=99;notice(`ALL STATUS ↑${a.narakuStacks*10}%`,'buff');await fixedDelay(600);}
  }
  const enemyEntries=livingEnemies().flatMap(e=>{
    const role=e.encounterRole||'';
    const fallback=role==='escort'?1:role==='midboss'?rint(1,2):role==='boss'?rint(2,3):(e.isBoss?rint(2,3):e.isElite?rint(1,2):1);
    const count=clamp(Number(e.actionCount)||fallback,1,3);return Array.from({length:count},(_,i)=>({type:'enemy',enemyId:e.uid,action:i+1}));
  });
  b.queue=[...livingMain().map(a=>({type:'ally',id:a.id})),...enemyEntries,...livingSuper().filter(a=>b.turn>=a.nextSupportTurn).map(a=>({type:'super',id:a.id}))].sort((x,y)=>initiativeSpeed(y)-initiativeSpeed(x)+((Math.random()-.5)*.01));b.busy=false;renderBattle();await processQueue();
}
async function processQueue(){
  const b=state.battle;if(!b||b.finished||b.busy)return;while(b.queuePos<b.queue.length){const entry=b.queue[b.queuePos];
    if(entry.type==='ally'){const a=allyById(entry.id);if(!a||a.dead||!b.mainIds.includes(a.id)){b.queuePos++;continue;}if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');advanceUltimateCooldowns(a);b.queuePos++;await delay(300);continue;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');advanceUltimateCooldowns(a);b.queuePos++;await delay(300);continue;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');advanceUltimateCooldowns(a);b.queuePos++;await delay(300);continue;}renderBattle();if(b.auto)setTimeout(autoAct,100);return;}
    if(entry.type==='enemy'){const e=enemyByUid(entry.enemyId);if(!e||e.hp<=0){b.queuePos++;continue;}const prev=b.queue[b.queuePos-1];if(prev&&(prev.type==='ally'||prev.type==='super'))await fixedDelay(1000);else if(prev&&prev.type==='enemy')await fixedDelay(600);b.busy=true;b.actingEnemyId=e.uid;b.enemy=e;renderBattle();await enemyAction(entry.action||1,e.uid);b.actingEnemyId=null;b.enemy=targetEnemy();b.busy=false;b.queuePos++;if(b.finished)return;await resolveRequiredReplacements();if(b.finished)return;continue;}
    if(entry.type==='super'){const a=allyById(entry.id);if(!a||a.dead||!b.superIds.includes(a.id)){b.queuePos++;continue;}b.busy=true;renderBattle();await superSubAction(a);await checkBattleHpDialogue();a.nextSupportTurn=b.turn+rint(2,5);b.busy=false;b.queuePos++;if(b.forcePhaseChange){if(await handleForcedEnemyPhase())return;}if(!livingEnemies().length){if(await handleEnemyWaveClear())return;}continue;}
  }await endRound();
}
async function endRound(){const b=state.battle;if(!b||b.finished)return;tickBuffs();b.turn++;if(b.mode==='story'&&b.config?.scriptedTurnLimit&&b.turn>Number(b.config.scriptedTurnLimit)){return finishScriptedBattle();}await delay(120);startRound();}
function temporaryEnemySpecial(e){
  const attr=normalizeElement(e.attribute),names={火:'フレイムショット（仮）',水:'ウォーターバブル（仮）',雷:'サンダーショック（仮）',地:'ロックブロー（仮）',風:'ウィンドカッター（仮）',光:'ライトパルス（仮）',闇:'ダークミスト（仮）',無:'パワーアタック（仮）'};
  if(e.tempAi==='heal')return{special:'リカバリー（仮）',kind:'enemyHeal',power:.18,temporary:true};
  if(e.tempAi==='aoe')return{special:'エレメントボム（仮）',kind:'aoe',power:e.category==='elite'?.86:.72,skillElement:attr,skillType:'magic',temporary:true};
  if(e.tempAi==='debuff')return{special:'ミストブレイク（仮）',kind:'single',power:e.category==='elite'?1.12:.90,skillElement:attr,skillType:'magic',temporary:true};
  return{special:names[attr]||names['無'],kind:'single',power:e.category==='elite'?1.15:.90,skillElement:attr,skillType:(attr==='地'||attr==='無')?'physical':'magic',temporary:true};
}
function enemyMainSkillPower(e,spec){
  const raw=Math.max(.01,Number(spec?.power)||1),kind=String(spec?.kind||'single'),boss=!!e?.isBoss,elite=!!e?.isElite;
  if(/enemyHeal|shield|revive/.test(kind))return raw;
  if(/aoe/i.test(kind)&&kind!=='singlePlusAoe')return Math.max(raw,boss?.96:elite?.86:.72);
  if(/multi|doubleAoe/.test(kind))return raw;
  if(/single|poison|burn|stun|healSingle|speed/i.test(kind)||kind==='damage')return Math.max(raw,boss?1.30:elite?1.18:.94);
  return Math.max(raw,boss?1.22:elite?1.12:.90);
}
function enemySpecialSpec(e){if(e.specialOptions?.length)return pick(e.specialOptions);if(e.special)return e;return temporaryEnemySpecial(e);}
async function enemyAction(actionIndex=1,enemyId){
  const b=state.battle,e=enemyByUid(enemyId)||actingEnemy()||b.enemy;if(!e||e.hp<=0)return;if(e.id==='boss-gladi'&&b.gladiSpecialReady){b.gladiSpecialReady=false;await bossSpecial({special:'グラビディ・グラディエーター',kind:'aoeStun',power:1.55,chance:.70,skillElement:'無',skillType:'physical'});if(!livingRoster().length)finishBattle(false);return;}if(e.escapeRate&&!e.noEscape&&actionIndex===1&&Math.random()<e.escapeRate){await actionCutin(`${e.name}は逃げ出した！`,'system',620);e.hp=0;e.escaped=true;if(b.targetEnemyId===e.uid){const n=livingEnemies()[0];b.targetEnemyId=n?.uid||null;}renderBattle();await delay(220);return;}if(e.status.sleep>0){e.status.sleep--;notice(`${e.name}は眠っている！`,'status');await delay(350);return;}if(e.status.stun>0){e.status.stun--;notice(`${e.name}はひるんで動けない！`,'status');await delay(350);return;}if(e.status.paralyze>0){e.status.paralyze--;notice(`${e.name}はマヒして動けない！`,'status');await delay(350);return;}
  if(e.halfDefBuff&&!e.halfDefTriggered&&e.hp/e.maxHp<=.5){e.halfDefTriggered=true;e.defBuff=Math.max(e.defBuff||0,Number(e.halfDefBuff)||0);e.defBuffTurns=99;notice(`${e.name} DEF ↑${Math.round((Number(e.halfDefBuff)||0)*100)}%`,'buff',650);}
  if(e.firstActionSpec&&!e.firstActionUsed&&b.turn===1&&actionIndex===1){e.firstActionUsed=true;await bossSpecial(e.firstActionSpec);if(!livingRoster().length)finishBattle(false);return;}
  const hasSource=!!(e.special||e.specialOptions?.length),useSpecial=e.alwaysSpecial?true:e.isBoss?(actionIndex===1&&b.turn%(e.specialEvery||TEMP_BALANCE.bossSpecialEvery)===0):e.isElite?(hasSource?b.turn%3===0:Math.random()<.22):Math.random()<.18;
  if(useSpecial)await bossSpecial(enemySpecialSpec(e));else await bossNormal();if(!livingRoster().length)finishBattle(false);
}
async function bossNormal(){const e=actingEnemy()||state.battle.enemy,t=pick(livingMain());if(!e||!t)return;const type=e.normalAttackType||'physical',ranged=e.id==='boss-gladi';await actionCutin(`${e.name}の攻撃！`,'danger',520);if(ranged)await playEnemyProjectile(e,t);else await beginEnemyLunge(e.uid);try{await damageAlly(t,1,type,false,e.attribute);await delay(320);}finally{if(!ranged)endEnemyLunge();}}
async function aoeHit(power,type='physical',element=''){let total=0;const el=element||actingEnemy()?.attribute||'無';for(const a of [...livingMain()]){total+=await damageAlly(a,power,type,false,el);await delay(70);}for(const a of [...livingSuper()]){total+=await damageAlly(a,power,type,true,el);await delay(70);}return total;}
async function bossSpecial(spec){
  const e=actingEnemy()||state.battle.enemy;if(!e)return;spec=spec||enemySpecialSpec(e);const ranged=e.id==='boss-gladi';await actionCutin(`${e.name}の${spec.special}！`,'danger',700);if(!ranged)await beginEnemyLunge(e.uid);let t,d,total=0;const attackElement=spec.skillElement||e.attribute||'無',mainPower=enemyMainSkillPower(e,spec);const hit=async(target,m=null,type=spec.skillType||'physical')=>{const x=await damageAlly(target,m==null?mainPower:m,type,false,attackElement);await delay(80);return x;};const aoe=async(m=null,type='physical')=>aoeHit(m==null?mainPower:m,type,attackElement);
  try{switch(spec.kind){
    case'shield':e.damageReduction=.20;e.shieldTurns=3;for(const ally of livingEnemies())if(ally.uid!==e.uid){ally.allyShieldReduction=.10;ally.allyShieldTurns=3;fx('buff',`enemy:${ally.uid}`);}fx('buff',`enemy:${e.uid}`);notice('自身20% / 味方10% DAMAGE CUT','buff');break;
    case'reviveMummy':{const dead=(state.battle.enemies||[]).find(x=>x.hp<=0&&String(x.name).includes('ミイラ'));if(dead){dead.hp=Math.max(1,Math.round(dead.maxHp*.45));dead.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0};notice(`${dead.name}が復活！`,'heal',800);floatNumber(dead.hp,'heal',`enemy:${dead.uid}`);}else{t=pick(livingMain());if(t)await hit(t,.72,'magic');}break;}
    case'enemyHeal':{const target=[...livingEnemies()].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]||e;if(target){const h=Math.round(target.maxHp*(spec.power||.18));target.hp=Math.min(target.maxHp,target.hp+h);floatNumber(h,'heal',`enemy:${target.uid}`);notice(`${target.name} HP回復`,'heal');}break;}
    case'poisonSingle':t=pick(livingMain());if(t){d=await hit(t,null,spec.skillType||'physical');if(Math.random()<(spec.chance??.10)&&await inflictAllyStatus(t,'poison',3))notice(`${t.name}は毒になった！`,'status');}break;
    case'burnSingle':t=pick(livingMain());if(t){d=await hit(t,null,'magic');if(Math.random()<(spec.chance??.5)&&await inflictAllyStatus(t,'burn',3))notice(`${t.name}はやけど状態！`,'status');}break;
    case'stunSingle':t=pick(livingMain());if(t){d=await hit(t,null,spec.skillType||'magic');if(Math.random()<(spec.chance??1)){await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}}break;
    case'confuseSingle':t=pick(livingMain());if(t){d=await hit(t,null,spec.skillType||'magic');if(Math.random()<(spec.chance??.30)){await inflictAllyStatus(t,'confuse',2);notice(`${t.name}は混乱した！`,'status');}}break;
    case'sleepSingle':t=pick(livingMain());if(t){d=await hit(t,null,spec.skillType||'magic');if(Math.random()<(spec.chance??.30)){await inflictAllyStatus(t,'sleep',2);notice(`${t.name}は眠った！`,'status');}}break;
    case'aoeSleepChance':total=await aoe(null,spec.skillType||'magic');for(const a of [...livingMain(),...livingSuper()])if(Math.random()<(spec.chance||.20))await inflictAllyStatus(a,'sleep',2);break;
    case'ctSingle':t=pick(livingMain());if(t){if(ranged)await playEnemyProjectile(e,t);d=await hit(t,null,spec.skillType||'physical');for(let i=0;i<(t.ultCooldowns||[]).length;i++)t.ultCooldowns[i]=Math.max(0,Number(t.ultCooldowns[i])||0)+Math.max(1,Number(spec.ctAdd)||2);persistUltimateCooldownsFromBattle();await actionCutin(`${t.name}の必殺技CTが${Math.max(1,Number(spec.ctAdd)||2)}ターン増えてしまった！`,'danger',900);}break;
    case'doubleSingleStun':t=pick(livingMain());if(t){total+=await hit(t,null,'magic');if(!t.dead)total+=await hit(t,null,'magic');await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}break;
    case'singlePlusAoe':t=pick(livingMain());if(t)total+=await hit(t,null,'magic');total+=await aoe(.52,'magic');break;
    case'singleSpdDown':t=pick(livingMain());if(t){total+=await hit(t,null,spec.skillType||'physical');t.spdDebuff=Math.max(t.spdDebuff||0,spec.debuff||.12);t.spdDebuffTurns=Math.max(t.spdDebuffTurns||0,3);notice(`${t.name} SPD ↓`,'status');}break;
    case'aoeParalyzeChance':total=await aoe(null,spec.skillType||'magic');for(const a of [...livingMain(),...livingSuper()])if(Math.random()<(spec.chance||.20))await inflictAllyStatus(a,'paralyze',2);break;
    case'healAoeBoss':total=await aoe(null,spec.skillType||'magic');{const h=Math.round(e.maxHp*(spec.heal||.06));e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal',`enemy:${e.uid}`);fx('buff',`enemy:${e.uid}`);notice(`${e.name} HP +${h}`,'heal');}break;
    case'aoeAtkDown':total=await aoe(null,spec.skillType||'magic');for(const a of [...livingMain(),...livingSuper()]){a.atkDebuff=Math.max(a.atkDebuff||0,spec.debuff||.05);a.atkDebuffTurns=Math.max(a.atkDebuffTurns||0,3);}notice(`PARTY ATK ↓${Math.round((spec.debuff||.05)*100)}%`,'status');break;
    case'aoeStunChance':total=await aoe(null,spec.skillType||'physical');for(const a of [...livingMain(),...livingSuper()])if(Math.random()<(spec.chance||.03))await inflictAllyStatus(a,'stun',1);break;
    case'multi':case'multiFixed':{const n=rint(spec.hits?.[0]||3,spec.hits?.[1]||6);for(let i=0;i<n&&livingMain().length;i++)total+=await hit(pick(livingMain()),spec.power);notice(`${n} HIT`,'system',420);break;}
    case'healSingle':t=pick(livingMain());if(t)d=await hit(t,null,'magic');{const h=Math.round(e.maxHp*.06);e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal',`enemy:${e.uid}`);notice(`BOSS HP +${h}`,'heal');}break;
    case'buffAoe':e.atkBuff=.18;e.atkBuffTurns=3;total=await aoe(null,'magic');notice('ATK ↑','buff');break;
    case'buffDefAoe':e.defBuff=Math.max(e.defBuff||0,spec.buff||.15);e.defBuffTurns=3;fx('buff',`enemy:${e.uid}`);total=await aoe(null,spec.skillType||'magic');notice('DEF ↑ / ENEMY ALL DAMAGE','buff');break;
    case'doubleAoe':for(let n=0;n<2;n++)total+=await aoe(spec.power,'physical');notice('2 HIT','system',420);break;
    case'aoeStun':total=await aoe(null,'magic');for(const a of livingMain())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);for(const a of livingSuper())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);notice('ひるみ判定','status');break;
    case'aoe':total=await aoe(null,spec.skillType||((spec.skillElement||e.attribute).includes('火')||(spec.skillElement||e.attribute).includes('闇')?'magic':'physical'));break;
    case'single':default:t=pick(livingMain());if(t)d=await hit(t,null,spec.skillType||'physical');break;
  }}finally{if(!ranged)endEnemyLunge();}await checkSpecialRevives();renderBattle();await delay(280);
}

async function superSubAction(a){await fixedDelay(600);await actionCutin(`${a.name}の援護！`,'system',650);try{if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');return;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');return;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');return;}const low=livingField().some(x=>x.hp/x.maxHp<.45);if((a.id==='money'||a.id==='pink'||a.id==='riro')&&low){const h=healField(.12);notice(`SUPER SUPPORT / PARTY HP +${h}`,'heal');return;}const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.45){await performMagic(a,true);return;}await performAttack(a,true);}finally{clearEnemyImpact();await fixedDelay(600);}}

function findGroup(id){const b=state.battle;for(const key of ['mainIds','superIds','reserveIds']){const i=b[key].indexOf(id);if(i>=0)return{key,index:i};}return null;}
function persistBattlePartyOrder(){const b=state.battle;if(!b||!['adventure','quest'].includes(b.mode)||b.config?.lilithSplitBattle)return;const ordered=[...b.mainIds,...b.superIds,...b.reserveIds],levelById=new Map(state.party.map(([id,lv])=>[id,lv])),next=[];for(const id of ordered){if(levelById.has(id)&&!next.some(x=>x[0]===id))next.push([id,levelById.get(id)]);}for(const row of state.party)if(!next.some(x=>x[0]===row[0]))next.push([...row]);state.party=next.slice(0,10);saveParty();state.training.party=state.party.map(x=>[...x]);}
function swapGroupMembers(outId,inId){const b=state.battle,a=findGroup(outId),c=findGroup(inId);if(!a||!c)return false;[b[a.key][a.index],b[c.key][c.index]]=[b[c.key][c.index],b[a.key][a.index]];persistBattlePartyOrder();return true;}
function replacementCandidates(exclude=[]){const b=state.battle,ids=[...b.superIds,...b.reserveIds].filter(id=>!exclude.includes(id)),seen=new Set();return ids.map(allyById).filter(a=>a&&!a.dead&&a.hp>0&&!seen.has(a.id)&&(seen.add(a.id)||true));}
function reserveReplacementCandidates(exclude=[]){const b=state.battle;return b.reserveIds.filter(id=>!exclude.includes(id)).map(allyById).filter(a=>a&&!a.dead&&a.hp>0);}
async function chooseReplacement(title,candidates){if(!candidates.length)return null;if(state.battle.auto)return candidates[0].id;const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent='MEMBER CHANGE';$('#skillMenuTitle').textContent=title;list.innerHTML=candidates.map(a=>`<button class="skill-item" data-replace-id="${a.id}" type="button"><span class="ult-thumb"><img src="${versionedPlay(a.image)}" alt=""><i>${a.symbol}</i></span><div><b>${a.name}</b><small>HP ${Math.ceil(a.hp)} / ${a.maxHp}　MP ${Math.floor(a.mpNow)}</small></div><em>${state.battle.superIds.includes(a.id)?'援護':'RESERVE'}</em></button>`).join('');bindImages(list);return new Promise(resolve=>{$$('[data-replace-id]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;resolve(btn.dataset.replaceId);});});}
async function resolveRequiredReplacements(){const b=state.battle;if(!b||b.finished)return;await checkSpecialRevives();for(let i=0;i<b.mainIds.length;i++){const a=allyById(b.mainIds[i]);if(a&&!a.dead&&a.hp>0)continue;const candidates=replacementCandidates();if(!candidates.length)continue;const inId=await chooseReplacement(`${a?.name||'メイン'}の交代メンバーを選択`,candidates);if(inId){const incoming=allyById(inId);swapGroupMembers(b.mainIds[i],inId);notice(`CHANGE → ${incoming.name}`,'system',750);renderBattle();}}
  for(let i=0;i<b.superIds.length;i++){const a=allyById(b.superIds[i]);if(a&&!a.dead&&a.hp>0)continue;const candidates=reserveReplacementCandidates();if(!candidates.length)continue;const inId=await chooseReplacement(`援護枠 ${i+1}を入れ替えますか？`,candidates);if(inId){const incoming=allyById(inId);swapGroupMembers(b.superIds[i],inId);incoming.nextSupportTurn=b.turn+rint(2,5);notice(`援護 CHANGE → ${incoming.name}`,'system',750);renderBattle();}}
  if(!livingRoster().length)finishBattle(false);
}

async function act(kind,payload){
  const b=state.battle,a=activeAlly();
  if(!b||!a||b.busy||b.finished)return;
  b.busy=true;setCommandDisabled(true);b.currentActionKind=kind;b.criticalCtReducedThisAction=false;
  let consumed=true;
  try{
    if(kind==='attack')await performAttack(a);
    else if(kind==='magic')consumed=await performMagic(a,payload);
    else if(kind==='special')consumed=await performSpecial(a,payload);
    else if(kind==='ultimate')consumed=await performUltimate(a,payload);
    else if(kind==='defend'){
      a.guard=.45;a.guardTurns=1;
      await actionCutin(`${a.name}の防御！`,'buff',420);
      notice(`${a.name}は身を守っている！`,'buff');fx('buff',a.id);
      const hpRate=weaponGuardHpHeal(a),mpRate=weaponGuardMpHeal(a);
      if(hpRate>0){const h=heal(a,a.maxHp*hpRate);if(h)notice(`武器特性 / HP +${h}`,'heal',480);}
      if(mpRate>0){const before=a.mpNow;a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*mpRate);const g=Math.floor(a.mpNow-before);if(g>0)notice(`武器特性 / MP +${g}`,'heal',480);}
      await delay(220);
    }else if(kind==='item')consumed=await performBattleItem(a,payload);
    else if(kind==='switch')consumed=await performSwitch(payload);
  }catch(err){
    console.error('[MOB QUEST] action recovered:',kind,err);
    // Consume the selected action rather than leaving the battle permanently locked.
    consumed=true;
  }
  b.currentActionKind='';
  if(!consumed){b.busy=false;renderBattle();return;}
  const usedUltIndex=kind==='ultimate'?a.ults.indexOf(payload):-1;advanceUltimateCooldowns(a,usedUltIndex);
  await checkBattleHpDialogue();
  if(b.forcePhaseChange){b.busy=false;renderBattle();if(await handleForcedEnemyPhase())return;}
  if(!livingEnemies().length){
    b.busy=false;
    renderBattle();
    await handleEnemyWaveClear();
    return;
  }
  b.queuePos++;
  b.busy=false;
  renderBattle();
  await processQueue();
}
async function performSwitch(payload){if(!payload)return false;const b=state.battle,out=allyById(payload.outId),incoming=allyById(payload.inId);if(!b||!out||!incoming||incoming.dead||incoming.hp<=0||!b.mainIds.includes(out.id))return false;if(!swapGroupMembers(out.id,incoming.id))return false;const entry=currentEntry();if(entry?.type==='ally'&&entry.id===out.id)entry.id=incoming.id;renderBattle();await actionCutin(`CHANGE! ${out.name} → ${incoming.name}`,'system',620);notice('入れ替えでは行動を消費しません','system',520);await delay(120);return false;}
function openSwitchMenu(){const a=activeAlly();if(!a)return;const candidates=[...superAllies(),...reserveAllies()].filter(x=>!x.dead&&x.hp>0);if(!candidates.length)return notice('入れ替え可能なメンバーがいません','danger');const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent=`${a.name} / 行動消費なし`;$('#skillMenuTitle').textContent='入れ替える';list.innerHTML=`<div class="switch-zone-title super">援護メンバー</div>${superAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>援護</em></button>`).join('')}<div class="switch-zone-title reserve">RESERVE</div>${reserveAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>RESERVE</em></button>`).join('')}`;bindImages(list);$$('[data-switch-in]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;act('switch',{outId:a.id,inId:btn.dataset.switchIn});});}

async function autoAct(){const b=state.battle,a=activeAlly();if(!b||!a||!b.auto||b.busy||b.finished)return;const usable=readyUlts(a).filter(u=>a.mpNow>=u.cost);if(usable.length&&Math.random()<.32)return act('ultimate',pick(usable));const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.30)return act('magic');return act('attack');}
function battleEffectSummary(kind,item){
  if(kind==='ultimate')return item?.desc||'必殺技を使用します。';
  if(kind==='magic'){const tier=item?.tier==='large'?'大':item?.tier==='small'?'小':item?.tier==='all'?'中':'中';return `${item?.target==='all'?'敵全体':'敵単体'}に${item?.element||'無'}属性${tier}ダメージ`;}
  if(kind==='special'){if(item?.kind==='status')return `敵単体を${{confuse:'混乱',sleep:'眠り',burn:'やけど',poison:'毒',paralyze:'マヒ'}[item.status]||'状態異常'}にする`;return `${item?.element||'無'}属性 / ${item?.tier==='large'?'中～大':'小'}ダメージ`;}
  return'';
}
async function confirmBattleSkillUse(kind,item,a){const effect=battleEffectSummary(kind,item),cost=Math.max(0,Number(item?.cost)||0),ans=await narrationDialog(`${item?.name||'技'}\n${effect}\n消費MP ${cost}\n\n使用しますか？`,[['使用する','yes','primary'],['戻る','no']]);return ans==='yes';}
function openSkillMenu(type){
  const a=activeAlly();if(!a)return;const list=$('#skillMenuList');$('#skillMenu').hidden=false;
  if(type==='magic'){
    const testAll=!!(state.test?.enabled&&state.test?.allSkills),all=MOB_DATA.magicCatalog||[],normal=defaultMagicFor(a),skills=testAll?all:(normal?[normal]:[]);for(const sk of skills)for(const src of sk.frames||[])preloadAsset(src,'high');
    $('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}${testAll?' / TEST ALL MAGIC':''}`;$('#skillMenuTitle').textContent='魔法';
    list.innerHTML=skills.length?skills.map(sk=>`<button class="skill-item ${a.mpNow<sk.cost?'disabled':''}" data-magic-id="${sk.id}" type="button"><span class="skill-symbol">${sk.element}</span><div><b>${sk.name}</b><small>${sk.target==='all'?'敵全体':'敵単体'} / ${sk.tier==='large'?'大':sk.tier==='small'?'小':sk.tier==='all'?'全体中':'中'}ダメージ</small></div><em>MP ${sk.cost}</em></button>`).join(''):'<div class="switch-guide">使用できる魔法はありません。</div>';
    $$('[data-magic-id]',list).forEach(btn=>btn.onclick=async()=>{const sk=all.find(x=>x.id===btn.dataset.magicId);if(!sk||a.mpNow<sk.cost)return notice('MPが足りない！','danger');if(!await confirmBattleSkillUse('magic',sk,a))return;$('#skillMenu').hidden=true;act('magic',sk);});return;
  }
  if(type==='special'){
    const testAll=!!(state.test?.enabled&&state.test?.allSkills),all=MOB_DATA.techniqueCatalog||[];
    if(testAll){$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)} / TEST ALL TECHNIQUE`;$('#skillMenuTitle').textContent='特技';list.innerHTML=all.map(t=>`<button class="skill-item ${a.mpNow<t.cost?'disabled':''}" data-tech-id="${t.id}" type="button"><span class="skill-symbol">技</span><div><b>${t.name}</b><small>${t.kind==='status'?`敵単体を${{confuse:'混乱',sleep:'眠り',burn:'やけど',poison:'毒',paralyze:'マヒ'}[t.status]}にする`:`${t.element}属性 / ${t.tier==='large'?'中～大':'小'}ダメージ`}</small></div><em>MP ${t.cost}</em></button>`).join('');$$('[data-tech-id]',list).forEach(btn=>btn.onclick=async()=>{const t=all.find(x=>x.id===btn.dataset.techId);if(!t||a.mpNow<t.cost)return notice('MPが足りない！','danger');if(!await confirmBattleSkillUse('special',t,a))return;$('#skillMenu').hidden=true;act('special',t);});return;}
    const t=temporaryTechnique(a);$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='特技';list.innerHTML=`<button class="skill-item ${a.mpNow<t.cost?'disabled':''}" data-use-special type="button"><span class="skill-symbol">技</span><div><b>${t.name}</b><small>正式な習得者は未決定。現在は武器種に合わせた基本特技。</small></div><em>MP ${t.cost}</em></button>`;$('[data-use-special]',list).onclick=async()=>{if(a.mpNow<t.cost)return notice('MPが足りない！','danger');if(!await confirmBattleSkillUse('special',t,a))return;$('#skillMenu').hidden=true;act('special',t);};return;
  }
  const unlocked=availableUlts(a);unlocked.forEach(u=>preloadAsset(u.image,'high'));$('#skillMenuKicker').textContent=`${a.name} / Lv${a.level} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='必殺技';list.innerHTML=a.ults.map((u,i)=>{const req=i<4?ULT_UNLOCK_LEVELS[i]:null,ok=unlocked.includes(u),cd=ok?ultimateRemaining(a,i):0,base=ultimateEffectiveCt(a,u,i),ready=ok&&cd<=0;return`<button class="skill-item ${!ok?'locked':''} ${ok&&(!ready||a.mpNow<u.cost)?'disabled':''}" data-ult-index="${i}" type="button" ${!ok?'disabled':''}><span class="ult-thumb"><img src="${u.image}" alt=""><i>必</i></span><div><b>${u.name}</b><small>${u.desc}${!ok?(i<4?` / Lv${req}で習得`:' / イベントで解放'):` / CT ${base}ターン`}</small></div><em>${!ok?'LOCK':ready?`READY / MP ${u.cost}`:`CT ${cd}`}</em></button>`;}).join('');bindImages(list);$$('[data-ult-index]',list).forEach(btn=>btn.onclick=async()=>{const i=Number(btn.dataset.ultIndex),u=a.ults[i];if(!availableUlts(a).includes(u))return;if(ultimateRemaining(a,i)>0)return notice(`あと${ultimateRemaining(a,i)}ターンで使用可能！`,'system');if(a.mpNow<u.cost)return notice('MPが足りない！','danger');if(!await confirmBattleSkillUse('ultimate',u,a))return;$('#skillMenu').hidden=true;act('ultimate',u);});
}
function battleItemCandidates(it){const all=state.battle?.allies||[];if(it.type==='revive')return all.filter(a=>a.dead||a.hp<=0);return all.filter(a=>!a.dead&&a.hp>0);}
function battleItemCanUseOn(it,t){if(!it||!t)return false;if(it.type==='revive')return !!t.dead||t.hp<=0;if(t.dead||t.hp<=0)return false;if(it.type==='hp')return t.hp<t.maxHp;if(it.type==='mp')return t.mpNow<t.maxMp;if(it.type==='cure')return Number(t.status?.[it.status]||0)>0;if(it.type==='cureAll')return Object.values(t.status||{}).some(v=>Number(v)>0);if(it.type==='hpmp'||it.type==='full')return t.hp<t.maxHp||t.mpNow<t.maxMp;if(it.type==='battleBuff')return true;return false;}
function openItemMenu(){const list=$('#skillMenuList'),usable=GAME_ITEMS.filter(it=>it.type!=='record'&&itemCount(it.id)>0);$('#skillMenu').hidden=false;$('#skillMenuKicker').textContent='ITEM';$('#skillMenuTitle').textContent='アイテム';list.innerHTML=usable.length?usable.map(it=>`<button class="skill-item battle-item-entry" data-battle-item="${it.id}" type="button"><span class="ult-thumb"><img src="${it.image}" alt="${it.name}"><i>道</i></span><div><b>${it.name}</b><small>${itemEffectText(it)}</small></div><em>×${itemCount(it.id)}</em></button>`).join(''):`<div class="switch-guide">戦闘で使えるアイテムを所持していません。</div>`;bindImages(list);$$('[data-battle-item]',list).forEach(btn=>btn.onclick=()=>openBattleItemTargets(btn.dataset.battleItem));}
function openBattleItemTargets(id){const it=itemData(id),list=$('#skillMenuList');if(!it||itemCount(id)<1)return openItemMenu();if(it.type==='partyHp'){$('#skillMenu').hidden=true;return act('item',{id});}const candidates=battleItemCandidates(it);$('#skillMenuKicker').textContent=`${it.name} / ×${itemCount(id)}`;$('#skillMenuTitle').textContent=it.type==='revive'?'復活させるメンバー':'使用するメンバー';list.innerHTML=candidates.length?candidates.map(t=>`<button class="skill-item ${battleItemCanUseOn(it,t)?'':'disabled'}" data-battle-item-target="${t.id}" type="button" ${battleItemCanUseOn(it,t)?'':'disabled'}><span class="ult-thumb"><img src="${versionedPlay(t.image)}" alt="${t.name}"><i>${t.symbol||'仲'}</i></span><div><b>${t.name}</b><small>${t.dead?'DOWN':`HP ${Math.ceil(t.hp)}/${t.maxHp} / MP ${Math.floor(t.mpNow)}/${t.maxMp}`}</small></div><em>${t.dead?'DOWN':'選択'}</em></button>`).join(''):`<div class="switch-guide">今このアイテムを使用できるメンバーはいません。</div>`;bindImages(list);$$('[data-battle-item-target]',list).forEach(btn=>btn.onclick=()=>{$('#skillMenu').hidden=true;act('item',{id,targetId:btn.dataset.battleItemTarget});});}
async function performBattleItem(user,payload){const it=itemData(payload?.id);if(!it||it.type==='record'||itemCount(it.id)<1){notice('このアイテムは使えません','danger');return false;}let target=payload?.targetId?allyById(payload.targetId):null,ok=false,msg='';if(it.type==='partyHp'){const targets=livingField().filter(t=>t.hp<t.maxHp);if(!targets.length){notice('HPが減っているメンバーはいません','system');return false;}if(!consumeItem(it.id,1))return false;await actionCutin(`${user.name}は${it.name}を使った！`,'system',520);for(const t of targets)heal(t,it.amount||150);ok=true;msg='味方全体のHPが回復した！';}else{if(!target||!battleItemCanUseOn(it,target)){notice('今はこのアイテムを使用できません','system');return false;}if(!consumeItem(it.id,1))return false;await actionCutin(`${user.name}は${it.name}を使った！`,'system',520);if(it.type==='hp'){const n=rint(it.min,it.max);heal(target,n);msg=`${target.name}のHPが回復した！`;ok=true;}else if(it.type==='mp'){const n=rint(it.min,it.max),before=target.mpNow;target.mpNow=Math.min(target.maxMp,target.mpNow+n);msg=`${target.name}のMPが${Math.floor(target.mpNow-before)}回復した！`;ok=true;}else if(it.type==='cure'){target.status[it.status]=0;msg=`${target.name}の状態異常が治った！`;ok=true;}else if(it.type==='cureAll'){for(const k of Object.keys(target.status||{}))target.status[k]=0;msg=`${target.name}の状態異常が全て治った！`;ok=true;}else if(it.type==='hpmp'){heal(target,200);const m=Math.min(200,target.maxMp-target.mpNow);target.mpNow+=m;msg=`${target.name}のHPとMPが回復した！`;ok=true;}else if(it.type==='full'){const h=target.maxHp-target.hp;target.hp=target.maxHp;target.mpNow=target.maxMp;if(h)floatNumber(h,'heal',target.id);msg=`${target.name}のHPとMPが全回復した！`;ok=true;}else if(it.type==='battleBuff'){const turns=rint(it.minTurns||3,it.maxTurns||4);if(it.stat==='ATK'){target.atkBuff=Math.max(target.atkBuff||0,it.ratio||.20);target.atkBuffTurns=Math.max(target.atkBuffTurns||0,turns);}else{target.defBuff=Math.max(target.defBuff||0,it.ratio||.20);target.defBuffTurns=Math.max(target.defBuffTurns||0,turns);}fx('buff',target.id);msg=`${target.name}の${it.stat}が${turns}ターン上がった！`;ok=true;}else if(it.type==='revive'){target.dead=false;const boost=1+Number((target.figureEffects||figureEffectsFor(target.id)).healBoost||0);target.hp=Math.max(1,Math.round(target.maxHp*Math.min(1,(it.ratio||.50)*boost)));target.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0};msg=`${target.name}が復活した！`;ok=true;}}if(!ok)return false;renderBattle();notice(msg,'heal',720);await delay(260);return true;}
function escapeAttempt(){notice('「逃げる」の成功率は未設定です','system',850);}

function persistAdventureVitalsFor(allies=[]){if(!state.adventure.vitals||typeof state.adventure.vitals!=='object')state.adventure.vitals={};for(const a of allies)state.adventure.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow),dead:!!a.dead,status:clone(a.status||{})};saveAdventure();}
function persistAdventureVitals(){if(!state.battle)return;persistAdventureVitalsFor(state.battle.allies||[]);}
function battleEnemySummary(b){
  const seen=new Map();
  for(const e of b?.defeatedEnemies||[]){
    const key=`${e.name}|${e.level}`;seen.set(key,{...e,count:(seen.get(key)?.count||0)+1});
  }
  if(!seen.size)for(const e of b?.enemies||[]){const key=`${e.name}|${e.level}`;seen.set(key,{name:e.name,level:e.level,count:(seen.get(key)?.count||0)+1});}
  return [...seen.values()].map(e=>`${e.name} Lv${e.level}${e.count>1?` ×${e.count}`:''}`).join(' / ');
}
function advanceAdventureAfterWin(){
  const adv=state.adventure,worlds=MOB_DATA.adventureWorlds||[];
  adv.battleReady=false;adv.pendingEncounter=null;
  if((adv.battleIndex||0)<2){adv.battleIndex=(adv.battleIndex||0)+1;return;}
  adv.battleIndex=0;adv.areaBuff=null;
  if((adv.areaIndex||0)<3){adv.areaIndex=(adv.areaIndex||0)+1;return;}
  const wi=Number(adv.worldIndex)||0,w=worlds[wi];
  adv.areaIndex=3;
  adv.awaitingReport={worldIndex:wi,worldId:w?.id||'',worldName:w?.name||'現在地',nextWorldIndex:wi<worlds.length-1?wi+1:null};adv.runSnapshot=null;
}
const DQ10_EXP_TO_NEXT=[7,15,26,40,59,87,128,184,264,370,512,691,920,1200,1540,1946,2423,2975,3609,4324,5127,6012,6985,8036,9165,10364,11629,12961,14359,15826,17362,18969,20650,22404,24232,26136,28118,30180,32319,34541,36844,39231,41704,44262,46907,49641,52464,55381,58387,61488,67917,71537,75271,79117,83073,87137,91308,95585,99971,104464,109062,113764,118569,123479,128492,133606,138820,144133,149547,155060,160688,166466,172442,178667,185192,192068,199346,199346,199346,199346,199346,199346,199346,199346,249346,299346,349346,399346,449346,599346,749346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,959346,997720,1036094,1074468,1112842,1151216,1189590,1227964,1266338,1304712,1343086];
function expToNext(level){level=clamp(Number(level)||1,1,120);return level>=120?Infinity:DQ10_EXP_TO_NEXT[level-1];}
function enemyReward(e){
  const lv=Math.max(1,Number(e.level)||1),cat=e.category||'normal';
  let exp,coin;
  if(Number.isFinite(Number(e.rewardExp)))exp=Math.max(0,Math.round(Number(e.rewardExp)));
  else{
    const next=expToNext(Math.min(lv,119));
    const baseRate=cat==='boss'?0.48:cat==='elite'?0.18:0.03;
    const rate=baseRate*(Number(e.rewardExpScale)||1);
    exp=Math.max(1,Math.round(next*rate));
  }
  if(Number.isFinite(Number(e.rewardCoin)))coin=Math.max(0,Math.round(Number(e.rewardCoin)));
  else if(Number.isFinite(Number(e.rewardCoinBase)))coin=Math.max(0,Math.round(Number(e.rewardCoinBase)+(Number(e.rewardCoinPerLevel)||0)*lv));
  else{
    const base=cat==='boss'?(20+lv*6):cat==='elite'?(8+lv*2.4):(2+lv*.70);
    coin=Math.max(1,Math.round(base*(Number(e.rewardCoinScale)||1)));
  }
  coin+=Number(e.coinReward)||0;
  return{exp,coin};
}
function calcBattleRewards(b){let exp=0,coin=0;for(const e of b?.defeatedEnemies||[]){const r=enemyReward(e);exp+=r.exp;coin+=r.coin;}return{exp,coin};}
function learnedBetween(p,oldLv,newLv){const out=[],req=ULT_UNLOCK_LEVELS;for(let i=0;i<Math.min(4,p.ults?.length||0);i++)if(oldLv<req[i]&&newLv>=req[i])out.push(p.ults[i].name);return out;}
function applyProgressRewards(b,vitalsObj=null,buff=null){let reward=calcBattleRewards(b);if(buff?.exp)reward.exp=Math.round(reward.exp*(1+buff.exp));if(buff?.gold)reward.coin=Math.round(reward.coin*(1+buff.gold));const weaponGold=Math.max(0,...(b?.allies||[]).map(a=>weaponGoldBonus(a)));if(weaponGold>0)reward.coin=Math.round(reward.coin*(1+weaponGold));const figureExp=partyFigureRewardBonus('expBonus'),figureGold=partyFigureRewardBonus('goldBonus');if(figureExp>0)reward.exp=Math.round(reward.exp*(1+figureExp));if(figureGold>0)reward.coin=Math.round(reward.coin*(1+figureGold));const changes=[];state.coins+=reward.coin;state.meta.coins=state.coins;if(!state.meta.exp)state.meta.exp={};const cap=playerLevelCap();for(const slot of state.party){const id=slot[0],p=player(id);if(!p)continue;const startLv=slot[1],oldStats=baseStats(p,startLv);let lv=startLv,xp=Math.max(0,Number(state.meta.exp[id])||0)+reward.exp;while(lv<cap&&xp>=expToNext(lv)){xp-=expToNext(lv);lv++;}state.meta.exp[id]=xp;if(lv>startLv){slot[1]=lv;const ns=baseStats(p,lv),learned=learnedBetween(p,startLv,lv);changes.push({id,name:p.name,image:p.image,oldLevel:startLv,newLevel:lv,stats:{HP:ns.maxHp-oldStats.maxHp,MP:ns.maxMp-oldStats.maxMp,ATK:ns.atk-oldStats.atk,MAG:ns.mag-oldStats.mag,DEF:ns.def-oldStats.def,MND:ns.res-oldStats.res,SPD:ns.spd-oldStats.spd},learned});const v=vitalsObj?.[id];if(v&&!v.dead){v.hp=Math.min(ns.maxHp,Math.max(0,Number(v.hp)||0)+(ns.maxHp-oldStats.maxHp));v.mp=Math.min(ns.maxMp,Math.max(0,Number(v.mp)||0)+(ns.maxMp-oldStats.maxMp));}}}saveParty();saveMeta();return{...reward,changes};}
function applyAdventureRewards(b){const out=applyProgressRewards(b,state.adventure.vitals,state.adventure.areaBuff);saveAdventure();return out;}
function applyQuestRewards(b){return applyProgressRewards(b,state.quest?.vitals,null);}
function randomRecordId(){return pick(['36','37','38']);}
function adventureRecordDrops(b){const out=[];if(b?.mode!=='adventure'||b.config?.explorationAmbush)return out;const area=Number(b.config?.storyAreaIndex)||0,isBoss=!!b.config?.bossBattle;if(!isBoss)return out;const chance=area===3?1:.40;if(Math.random()<chance){const id=randomRecordId(),it=itemData(id);addItem(id,1);out.push({id,name:it.name,image:it.image,sub:area===3?'ボス撃破報酬':'中ボス撃破報酬'});}return out;}
function registerDefeatedBosses(b){if(!b?.defeatedEnemies)return;for(const e of b.defeatedEnemies){if(e.category==='boss'&&e.id&&!state.meta.defeatedBosses.includes(e.id))state.meta.defeatedBosses.push(e.id);if(e.category==='elite'&&e.id&&!state.meta.defeatedElites.includes(e.id))state.meta.defeatedElites.push(e.id);}saveMeta();}
function renderResultDrops(drops=[]){const root=$('#resultDrops');root.hidden=!drops.length;root.innerHTML=drops.map(d=>`<div class="result-drop"><img src="${d.image||''}" alt=""><div><b>${d.name}</b><small>${d.sub||''}</small></div></div>`).join('');bindImages(root);}
function renderResultProgression(changes=[]){const root=$('#resultProgression');root.innerHTML='';root.hidden=!changes.length;if(!changes.length)return;for(const c of changes){const statHtml=Object.entries(c.stats).filter(([,v])=>v>0).map(([k,v])=>`<span><b>${k}</b> +${v}</span>`).join('');const learned=c.learned?.length?`<div class="result-learn"><small>習得</small>${c.learned.map(x=>`<b>${x}</b>`).join('')}</div>`:'';root.insertAdjacentHTML('beforeend',`<article class="levelup-card"><div class="levelup-head"><img src="${versionedPlay(c.image)}" alt="${c.name}"><div><small>LEVEL UP</small><b>${c.name}</b><em>Lv${c.oldLevel} → Lv${c.newLevel}</em></div></div><div class="levelup-stats">${statHtml}</div>${learned}</article>`);}bindImages(root);requestAnimationFrame(()=>{[...root.children].forEach((el,i)=>setTimeout(()=>el.classList.add('show'),180+i*170));});}

function finishScriptedBattle(){const b=state.battle;if(!b||b.finished)return;b.finished=true;persistUltimateCooldownsFromBattle();persistBattlePartyOrder();b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';$('#battleBackBtn').disabled=false;setCommandDisabled(true);const limit=Number(b.config?.scriptedTurnLimit)||0;notice(limit?`${limit} TURN EVENT END`:'EVENT BATTLE CLEAR','system',650);setTimeout(()=>{renderAdventure();showScreen('adventure');const r=scriptedBattleResolve;scriptedBattleResolve=null;if(r)r(true);},320);}
function playVictoryBanner(){let el=$('#victoryBannerV79');if(el)el.remove();el=document.createElement('div');el.id='victoryBannerV79';el.className='victory-banner-v79';el.innerHTML='<small>BATTLE CLEAR</small><b>VICTORY!</b><span>勝利！</span>';document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),260);},1050);}
function firstGrassRescueCount(){return Math.min(2,Math.max(Number(state.meta?.firstGrassReviveCount)||0,state.meta?.firstGrassReviveUsed?1:0));}
function canTriggerFirstGrassRescue(b){return !!(b&&b.mode==='adventure'&&currentWorld()?.id==='grassland'&&firstGrassRescueCount()<2&&!b.firstGrassRescueInProgress);}
async function triggerFirstGrassRescue(b){
  if(!b)return;
  b.firstGrassRescueInProgress=true;b.finished=true;b.busy=true;setCommandDisabled(true);
  state.meta.firstGrassReviveCount=Math.min(2,firstGrassRescueCount()+1);state.meta.firstGrassReviveUsed=state.meta.firstGrassReviveCount>0;saveMeta();
  await actionCutin('これは物語の始まり','system',1150);
  await actionCutin('まだ全滅するわけにはいかない！','system',1350);
  for(const a of b.allies||[]){a.dead=false;a.hp=a.maxHp;a.mpNow=a.maxMp;a.guard=0;a.guardTurns=0;a.barrier=0;a.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0};}
  persistAdventureVitals();renderBattle();
  await actionCutin('1度だけ全回復する！','heal',1350);
  b.queue=[];b.queuePos=0;b.finished=false;b.busy=false;b.firstGrassRescueInProgress=false;renderBattle();startRound();
}
function finishBattle(win){
  const b=state.battle;if(!b||b.finished)return;if(b.mode==='story')return finishScriptedBattle();
  if(!win&&canTriggerFirstGrassRescue(b)){void triggerFirstGrassRescue(b);return;}
  b.finished=true;b.resultWin=!!win;b.auto=false;persistUltimateCooldownsFromBattle();persistBattlePartyOrder();$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';setCommandDisabled(true);
  if(win)playVictoryBanner();else notice('DEFEAT...','system',900);
  let reward={exp:0,coin:0,changes:[]},drops=[];
  if(win&&b.mode==='adventure'){
    persistAdventureVitals();reward=applyAdventureRewards(b);registerDefeatedBosses(b);drops=adventureRecordDrops(b);
    if(!b.config?.explorationAmbush){
      if(b.config?.storyPostKey&&!storyDone(b.config.storyPostKey))state.adventure.pendingPostStory={key:b.config.storyPostKey,worldId:b.config.storyWorldId||currentWorld()?.id||'',areaIndex:Number(b.config.storyAreaIndex)||0,bg:b.bg||''};
      advanceAdventureAfterWin();
    }
    saveAdventure();
  }
  if(b.mode==='adventure'&&!win)restoreCampCheckpoint();
  if(b.mode==='quest'){
    persistQuestVitals();
    if(win){reward=applyQuestRewards(b);advanceQuestAfterWin();}
  }
  const summary=battleEnemySummary(b)||'ENEMY';
  $('#resultOverlay').classList.toggle('victory',!!win);$('#resultTitle').textContent=win?'VICTORY':'DEFEAT';
  $('#resultKicker').textContent=b.mode==='adventure'?(b.config?.adventureLabel||`${currentWorld()?.name||'冒険'} BATTLE`):b.mode==='quest'?questTitleText():'TRAINING RESULT';
  $('#resultText').textContent=win?`${summary} を撃破！ / ${b.turn}ターン`:(b.mode==='adventure'?'全員がダウンしました。直前のキャンプ地点のデータへ戻ります。':b.mode==='quest'?'クエスト戦闘に敗北しました。':`${summary} / ${b.turn}ターン目で全員ダウン`);
  const rw=$('#resultRewards');rw.hidden=!((b.mode==='adventure'||b.mode==='quest')&&win);$('#resultExp').textContent=`+${reward.exp.toLocaleString()}`;$('#resultCoin').textContent=`+${reward.coin.toLocaleString()}`;renderResultDrops(drops);renderResultProgression(reward.changes||[]);
  $('#resultRetryBtn').style.display=b.mode==='training'?'block':'none';
  $('#resultSetupBtn').textContent=b.mode==='training'?'トレーニングへ戻る':'NEXT';
  setTimeout(()=>{$('#resultOverlay').hidden=false;},(win?1080:560)/state.speed);
}

async function startBattleLoaded(config){
  await loadingWithAssets('戦闘用画像を読み込んでいます…',battleCriticalAssets(config));
  try{
    await beginBattle(config);
    warmBattleActionAssets(config);
  }catch(err){
    console.error('[MOB QUEST] battle start recovery',err);
    if(config?.mode==='adventure'){try{renderAdventure();}catch(_){}showScreen('adventure');}
    else if(config?.mode==='quest'){if(config?.questType==='program'){try{renderTraining();}catch(_){}showScreen('training');}else{try{renderQuestScreen();}catch(_){}showScreen('quest');}}
    else{try{renderTraining();}catch(_){}showScreen('training');}
    toast('戦闘開始時にエラーが発生しました。画面を復帰しました。');
  }
}
function trainingBattleBackground(list){
  const first=trainingEnemyTemplate(list?.[0]?.id);if(!first)return{bg:'back/sougen4.png',fallbackBg:'back2/02.png'};
  const w=(MOB_DATA.adventureWorlds||[]).find(x=>x.name===first.stage);
  if(w)return{bg:w.areas?.[3]?.bg||w.areas?.[0]?.bg||'back/sougen4.png',fallbackBg:w.fieldFallback||'back/rpgmain.png'};
  const b=first.bossId?boss(first.bossId):null;return{bg:b?.bg||first.bg||'back/sougen4.png',fallbackBg:b?.fallbackBg||first.fallbackBg||'back/rpgmain.png'};
}
async function startAdventureBattle(){
  if(!state.adventure.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;
  const enc=state.adventure.pendingEncounter||createAdventureEncounter(),w=currentWorld(),area=currentArea();
  const areaIndex=state.adventure.areaIndex||0,bossEncounter=(state.adventure.battleIndex||0)===2&&!!enc.bossBattle;
  const specificPre=bossEncounter?`pre:${w.id}:${areaIndex}`:'',legacyPre=(bossEncounter&&areaIndex===3)?`pre:${w.id}`:'';
  const preKey=STORY_EVENTS[specificPre]?specificPre:(STORY_EVENTS[legacyPre]?legacyPre:'');
  if(preKey&&!storyDone(preKey))await runStoryEvent(preKey);
  state.adventure.pendingEncounter=enc;saveAdventure();
  const specificPost=bossEncounter?`post:${w.id}:${areaIndex}`:'',legacyPost=(bossEncounter&&areaIndex===3)?`post:${w.id}`:'';
  const postKey=STORY_EVENTS[specificPost]?specificPost:(STORY_EVENTS[legacyPost]?legacyPost:'');
  /* v36: only AREA 4's boss sends the player HOME. AREA 1-3 mid-bosses continue in Adventure. */
  const returnHomeAfterAreaClear=!!(bossEncounter&&areaIndex===3);
  const lilithSplitBattle=!!(bossEncounter&&w.id==='demonCastle'&&areaIndex===2),split=lilithSplitBattle?currentLilithSplit():null,battleParty=split?.B||state.party;
  await startBattleLoaded({mode:'adventure',returnScreen:'adventure',waves:enc.waves,party:battleParty,useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,bossBattle:!!enc.bossBattle,adventureLabel:enc.label,storyPostKey:postKey,storyWorldId:w.id,storyAreaIndex:state.adventure.areaIndex,returnHomeAfterAreaClear,lilithSplitBattle,lilithSplit:split});
}
async function resetTrainingBattle(){
  markTrainingPlayed();
  const list=trainingEnemyList().map(x=>({id:x.id,level:x.level}));if(!list.length)return toast('敵を1体以上設定してください');const party=trainingParty();if(!party.length)return toast('味方を1人以上設定してください');
  const bg=trainingBattleBackground(list);
  await startBattleLoaded({mode:'training',returnScreen:'training',enemyConfigs:list,party,...bg});
}

function testWeaponScore(w,p){const s=w?.stats||{},types=playerWeaponTypes(p),physical=/物理|剣豪|戦士|攻撃|雷撃|連撃/.test(String(p.role||'')),magic=/魔法|回復/.test(String(p.role||''));let score=(s.atk||0)*(physical?1.6:1)+(s.mag||0)*(magic?1.6:1)+(s.def||0)*.8+(s.res||0)*.8+(s.spd||0)*.9+(s.maxHp||0)*.08+(s.maxMp||0)*.07;score+=(w.traits?.length||0)*2;return score;}
function bestTestWeaponsFor(p,filter=()=>true){return WEAPONS.filter(w=>canEquipWeapon(p,w)&&filter(w)).sort((a,b)=>testWeaponScore(b,p)-testWeaponScore(a,p));}
function testFigureScore(f){const st=parseFigureStatsText(f.statsText),fx=parseFigureEffectText(f.traitText);return st.maxHp*.08+st.maxMp*.07+st.atk*2+st.mag*2+st.def*1.5+st.res*1.5+st.spd*1.5+fx.crit*120+fx.evade*100+fx.damageCut*130+fx.physicalCut*110+fx.healBoost*60+fx.ultimateDamage*70+fx.ultimateCtCut*14+fx.accuracy*40+f.tags.length*.5;}
function applyTestLoadoutPreset(kind){if(!state.test?.enabled)return;for(const [pid,lv] of state.party){const p=player(pid);if(!p)continue;const eq=emptyEquipment();state.meta.figureEquipment[pid]=[null,null,null,null];if(kind==='naked'){state.meta.equipment[pid]=eq;continue;}let list=[];if(kind==='shop')list=bestTestWeaponsFor(p,w=>w.shop||w.season===1);else if(kind==='expected'){const season=clamp(Math.ceil((Number(lv)||1)/24),1,5);list=bestTestWeaponsFor(p,w=>w.season<=season);}else list=bestTestWeaponsFor(p);if(list[0]){state.meta.weapons[list[0].id]=Math.max(2,Number(state.meta.weapons[list[0].id])||0);eq.main=list[0].id;}if(kind!=='shop'&&list[1]){state.meta.weapons[list[1].id]=Math.max(2,Number(state.meta.weapons[list[1].id])||0);eq.sub=list[1].id;}if(kind==='optimal'){for(let i=0;i<3;i++){const w=list[i]||list[0];if(w){state.meta.medals[w.id]=Math.max(1,Number(state.meta.medals[w.id])||0);eq.medals[i]=w.id;}}const figs=FIGURES.filter(f=>!f.pending).sort((a,b)=>testFigureScore(b)-testFigureScore(a)).slice(0,4);for(const f of figs){state.meta.figures[f.id]=Math.max(99,Number(state.meta.figures[f.id])||0);}state.meta.figureEquipment[pid]=figs.map(f=>f.id);}state.meta.equipment[pid]=eq;}saveMeta();state.adventure.vitals=null;saveAdventure();toast(kind==='naked'?'裸装備にしました':kind==='shop'?'店売り装備にしました':kind==='expected'?'Lv帯想定装備にしました':'最適装備にしました');renderSettings();}
function renderSettings(){
  const t=state.test||loadTestSettings();state.test=t;
  const on=$('#testModeToggle'),fast=$('#testFastToggle'),allSkills=$('#testAllSkillsToggle'),controls=$('#testModeControls');
  on.textContent=t.enabled?'ON':'OFF';on.classList.toggle('on',!!t.enabled);
  fast.textContent=t.fast5?'ON':'OFF';fast.classList.toggle('on',!!(t.enabled&&t.fast5));if(allSkills){allSkills.textContent=t.allSkills?'ON':'OFF';allSkills.classList.toggle('on',!!(t.enabled&&t.allSkills));}
  fast.disabled=!t.enabled;if(allSkills)allSkills.disabled=!t.enabled;controls.classList.toggle('disabled',!t.enabled);
  $('#testLevelInput').disabled=!t.enabled;$('#applyTestLevelBtn').disabled=!t.enabled;$('#testItemsMaxBtn').disabled=!t.enabled;$$('[data-test-loadout]').forEach(b=>b.disabled=!t.enabled);

  const chapterSelect=$('#testChapterSelect'),areaSelect=$('#testAreaSelect'),chapterBtn=$('#testChapterApplyBtn');if(chapterSelect){const worlds=MOB_DATA.adventureWorlds||[];chapterSelect.innerHTML=worlds.map((w,i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} ${w.name}</option>`).join('');chapterSelect.value=String(clamp(Number(state.adventure.worldIndex)||0,0,Math.max(0,worlds.length-1)));chapterSelect.disabled=!t.enabled;}if(areaSelect){areaSelect.value=String(clamp(Number(state.adventure.areaIndex)||0,0,3));areaSelect.disabled=!t.enabled;}if(chapterBtn)chapterBtn.disabled=!t.enabled;
  const roster=$('#testLevelRoster');if(roster){
    roster.innerHTML=state.party.map(([id,lv])=>{const p=player(id);return p?`<label class="test-level-member"><b>${p.name}</b><input data-test-level-id="${id}" type="number" min="1" max="120" value="${lv}" inputmode="numeric" ${t.enabled?'':'disabled'}><button data-test-level-apply="${id}" type="button" ${t.enabled?'':'disabled'}>反映</button></label>`:'';}).join('');
    $$('[data-test-level-apply]',roster).forEach(btn=>btn.onclick=()=>{if(!state.test.enabled)return;const id=btn.dataset.testLevelApply,input=$(`[data-test-level-id="${id}"]`,roster),lv=clamp(Number(input?.value)||1,1,120),slot=state.party.find(x=>x[0]===id);if(!slot)return;slot[1]=lv;if(!state.meta.exp)state.meta.exp={};state.meta.exp[id]=0;state.adventure.vitals=null;saveParty();saveMeta();saveAdventure();state.training.party=state.party.map(x=>[...x]);renderSettings();toast(`${player(id)?.name||id}をLv${lv}に設定しました`);});
  }
}

function storyJoinsForCheckpoint(worldIndex,areaIndex){
  const worlds=MOB_DATA.adventureWorlds||[],idxById=Object.fromEntries(worlds.map((w,i)=>[w.id,i])),ids=[];
  for(const [key,ev] of Object.entries(STORY_EVENTS||{})){
    const wi=idxById[ev?.worldId];if(wi==null)continue;
    let include=wi<worldIndex;
    if(wi===worldIndex){if(key.startsWith('arrival:'))include=areaIndex>0;else include=Number(ev.area||0)<areaIndex;}
    if(!include)continue;
    for(const st of ev.steps||[])if(['join','joinKeepGuest','joinSilent'].includes(st?.[0]))ids.push(canonicalPlayerId(st[1]));
  }
  return [...new Set(ids.filter(Boolean))];
}
function rebuildPartyForTestCheckpoint(worldIndex,areaIndex){
  const levelById=new Map(state.party.map(([id,lv])=>[canonicalPlayerId(id),Number(lv)||5])),baseLv=Math.max(5,...levelById.values()),rows=defaultParty.map(([id,lv])=>[canonicalPlayerId(id),levelById.get(canonicalPlayerId(id))||baseLv]);
  for(const id of storyJoinsForCheckpoint(worldIndex,areaIndex))if(!rows.some(x=>x[0]===id)&&player(id))rows.push([id,levelById.get(id)||baseLv]);
  state.party=rows.slice(0,10);saveParty();state.training.party=state.party.map(x=>[...x]);
}
function applyTestChapter(){if(!state.test?.enabled)return;const worlds=MOB_DATA.adventureWorlds||[],wi=clamp(Number($('#testChapterSelect')?.value)||0,0,Math.max(0,worlds.length-1)),ai=clamp(Number($('#testAreaSelect')?.value)||0,0,3);const keepTest=state.test;state.adventure=defaultAdventure();state.adventure.worldIndex=wi;state.adventure.areaIndex=ai;state.adventure.battleIndex=0;state.adventure.battleReady=false;state.adventure.completed=false;state.adventure.reportedWorlds=worlds.slice(0,wi).map(w=>w.id);state.adventure.storyFlags={};for(let i=0;i<wi;i++){const id=worlds[i]?.id;if(id)state.adventure.storyFlags[`arrive:${id}`]=true;}if(ai>0){const id=worlds[wi]?.id;if(id)state.adventure.storyFlags[`arrive:${id}`]=true;}state.adventure.vitals=null;state.meta.defeatedBosses=[];state.meta.defeatedElites=[];rebuildPartyForTestCheckpoint(wi,ai);saveAdventure();syncDefeatedHistoryFromProgress();saveMeta();toast(`${worlds[wi]?.name||'チャプター'} AREA ${ai+1} から開始します`);closeSettings();renderHome();showScreen('home');}

function grantTestItemsMax(){
  if(!state.test?.enabled)return;
  if(!state.meta.inventory)state.meta.inventory={};
  for(const it of GAME_ITEMS)state.meta.inventory[it.id]=99;
  state.meta.inventory['mob-tent']=99;
  if(!state.meta.drinkSets)state.meta.drinkSets={};
  for(const d of DRINK_SETS)state.meta.drinkSets[d.id]=99;
  if(!state.meta.weapons)state.meta.weapons={};
  if(!state.meta.medals)state.meta.medals={};
  for(const w of WEAPONS){state.meta.weapons[w.id]=99;state.meta.medals[w.id]=99;}if(!state.meta.armors)state.meta.armors={};for(const a of ARMORS)state.meta.armors[a.id]=99;
  if(!state.meta.figures)state.meta.figures={};if(!Array.isArray(state.meta.figureOrder))state.meta.figureOrder=[];for(const f of FIGURES){if(f.pending)continue;state.meta.figures[f.id]=99;if(!state.meta.figureOrder.includes(f.id))state.meta.figureOrder.push(f.id);}
  saveMeta();
  toast('消耗品・テント・ドリンク・レコード・武器・メダル・防具・フィギュアをMAXにしました');
}
function openSettings(){renderSettings();$('#settingsOverlay').hidden=false;}
function closeSettings(){$('#settingsOverlay').hidden=true;}
async function deleteAllGameData(){
  closeSettings();
  const confirm=await dialog('本当に全データを削除しますか？\nこの操作は取り消せません。冒険イベントも最初から確認できます。',[['削除する','yes','danger'],['キャンセル','no']],'SYSTEM');
  if(confirm!=='yes')return openSettings();
  try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith('mobQuest')&&key!=='mobQuestTestSettingsV1')localStorage.removeItem(key);}}catch(_){}
  location.reload();
}
function setCastleHeader(kicker,title,pill=''){
  const k=$('#castleHeaderKicker'),t=$('#castleHeaderTitle'),p=$('#castleHeaderPill');
  if(k)k.textContent=kicker;if(t)t.textContent=title;if(p){p.textContent=pill||'';p.hidden=!pill;}
}
function setCastleBackground(src,fallback='back2/003.png'){
  const bg=$('#castleBg');if(!bg)return;setImage(bg,src,fallback);
}
function castleHomeButton(extraClass=''){return `<button class="castle-room-home ${extraClass}" data-castle-home type="button"><img src="mqicon/06.png" alt="HOME"><b>HOME</b><small>城メニューへ</small></button>`;}
function renderCastle(){
  castleView='menu';
  setCastleBackground('back2/003.png','back/rpgmain.png');
  setCastleHeader('CASTLE','お城','FACILITIES');
  const root=$('#castleContent');
  root.className='page-scroll nav-spacer castle-content castle-menu-view';
  root.innerHTML=`<section class="castle-menu-stage"><div class="castle-title-card"><small>CASTLE FACILITIES</small><h2>お城</h2><p>利用する施設を選んでください。</p></div><div class="castle-main-icons"><button data-castle-menu="throne" type="button"><img src="icon/18.png" alt="王の間"><b>王の間</b></button><button data-castle-menu="inn" type="button"><img src="icon/19.png" alt="宿舎"><b>宿舎</b></button><button data-castle-menu="shop" type="button"><img src="icon/20.png" alt="MOB SHOP"><b>MOB SHOP</b></button><button data-castle-menu="records" type="button"><img src="icon/21.png" alt="レコードルーム"><b>レコードルーム</b><small>LOCKED</small></button><button data-castle-menu="smith" type="button"><img src="icon/23.png" alt="鍛冶屋"><b>鍛冶屋</b></button></div></section>`;
  bindImages(root);bindCastleContentEvents();
}
async function enterCastle(){renderCastle();}
function renderThroneRoom(){
  castleView='throne';setCastleBackground('back/king1.png','back2/003.png');setCastleHeader('ROYAL CHAMBER','王の間',state.adventure.awaitingReport?'REPORT!':'REPORT');const rp=$('#castleHeaderPill');if(rp){rp.classList.toggle('report-ready',!!state.adventure.awaitingReport);rp.onclick=()=>state.adventure.awaitingReport?submitAdventureReport():castleActorSpeak('king',document.querySelector('[data-castle-actor="king"]'));}
  const root=$('#castleContent');root.className='page-scroll nav-spacer castle-content castle-room-view throne-room-view';
  root.innerHTML=`<section class="castle-room-stage throne-stage"><button class="castle-actor castle-actor-arm" data-castle-actor="arm" type="button"><img src="play/008.png" alt="モブライトアーム"><b>モブライトアーム</b></button><button class="castle-actor castle-actor-king" data-castle-actor="king" type="button"><img src="play/007.png" alt="モブスライムキング"><b>モブスライムキング</b></button><div id="castleSpeech" class="castle-speech" hidden><small></small><p></p></div>${castleHomeButton('throne-home')}</section>`;
  bindImages(root);bindCastleContentEvents();
}
function showCastleSpeech(speaker,text,actorEl=null,side='center'){
  const box=$('#castleSpeech');if(!box)return;
  const clean=compactDialogueText(text),formatted=balancedJapaneseText(clean,16,7),longest=dialogueLongestLine(formatted);box.className=`castle-speech side-${side}`;$('small',box).textContent=speaker;$('p',box).textContent=formatted;box.hidden=false;
  box.style.left='';box.style.top='';box.style.width='';box.style.transform='';box.style.removeProperty('--tail-x');box.style.removeProperty('--castle-speech-font');
  const stage=box.parentElement;
  if(actorEl&&stage){const sr=stage.getBoundingClientRect(),ar=actorEl.getBoundingClientRect(),sw=sr.width||320,natural=Math.max(184,Math.min(332,longest*15+44)),bw=Math.min(sw-20,natural),ax=ar.left+ar.width*.5-sr.left;box.style.width=`${bw}px`;box.style.transform='none';const bh=box.offsetHeight||96,left=Math.max(10,Math.min(ax-bw*.52,sw-bw-10));let top=ar.top-sr.top-bh-14;top=Math.max(14,Math.min(top,sr.height-bh-22));const tx=Math.max(28,Math.min(ax-left,bw-28));box.style.left=`${left}px`;box.style.top=`${top}px`;box.style.setProperty('--tail-x',`${tx}px`);}
  box.style.setProperty('--castle-speech-font',longest>=16?'14px':longest>=14?'15px':'16px');clearTimeout(showCastleSpeech.timer);showCastleSpeech.timer=setTimeout(()=>{if(box)box.hidden=true;},3000);
}
let castleReportBusy=false;
async function submitAdventureReport(){
  if(castleReportBusy||storyBusy)return;
  const r=state.adventure.awaitingReport;
  if(!r)return showCastleSpeech('モブスライムキング','今は新しい報告はないようじゃな',document.querySelector('[data-castle-actor="king"]'),'center');
  castleReportBusy=true;
  try{
    const worlds=MOB_DATA.adventureWorlds||[],w=worlds[r.worldIndex]||currentWorld();
    await facilityTalk(`${w?.name||'今回の地'}の報告、ご苦労じゃ！ よくやった！`,'モブスライムキング','play/007.png');
    if(!Array.isArray(state.adventure.reportedWorlds))state.adventure.reportedWorlds=[];
    if(r.worldId&&!state.adventure.reportedWorlds.includes(r.worldId))state.adventure.reportedWorlds.push(r.worldId);
    state.adventure.awaitingReport=null;state.adventure.battleReady=false;state.adventure.pendingEncounter=null;state.adventure.checkpoint=null;
    if(r.nextWorldIndex==null){state.adventure.completed=true;state.adventure.areaIndex=0;}
    else{state.adventure.worldIndex=r.nextWorldIndex;state.adventure.areaIndex=0;state.adventure.battleIndex=0;state.adventure.completed=false;}
    saveAdventure();renderThroneRoom();
    if(r.nextWorldIndex!=null)await facilityTalk('次の地へ進むがよい！','モブスライムキング','play/007.png');
    else await facilityTalk('見事じゃ！本当にご苦労であった！','モブスライムキング','play/007.png');
  }finally{castleReportBusy=false;}
}
function castleActorSpeak(kind,actorEl){
  if(openingSequenceBusy||castleReportBusy||storyBusy||!$('#dialogOverlay').hidden)return;
  if(kind==='king'&&state.adventure.awaitingReport)return submitAdventureReport();
  if(kind==='king')showCastleSpeech('モブスライムキング',pick(['頼むぞ、運命はお主たちにかかっている！','時には休息も大事じゃぞ！','装備は整っておるか？','城の設備はどんどん使ってくれ！']),actorEl,'center');
  else showCastleSpeech('モブライトアーム',pick(['みなさん、お気をつけて','ここはお任せを！','城は私が守ります！']),actorEl,'left');
}
async function renderInnRoom(){
  castleView='inn';setCastleBackground('back/king3.png','back2/003.png');setCastleHeader('CASTLE INN','宿舎','REST');
  const root=$('#castleContent');root.className='page-scroll nav-spacer castle-content castle-room-view inn-room-view';
  root.innerHTML=`<section class="castle-room-stage inn-stage"><button class="castle-actor castle-actor-inn" data-innkeeper type="button"><img src="play/006.png" alt="モブミータ"><b>モブミータ</b><small>タップして話す</small></button>${castleHomeButton()}</section>`;
  bindImages(root);bindCastleContentEvents();
}

function fullHealAtCastleInn(){
  const v=ensureAdventureVitals();
  for(const [id,lv] of state.party){const q=player(id);if(!q)continue;const st=baseStats(q,lv);const x=v[id]||(v[id]={});x.hp=st.maxHp;x.mp=st.maxMp;x.dead=false;x.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0};}
  state.adventure.vitals=v;saveAdventure();
}
async function castleFadeMessage(text,work){
  const f=$('#castleFade'),label=$('#castleFadeText');if(!f)return;if(label)label.textContent='';f.hidden=false;await nextPaint();f.classList.add('dark');await fixedDelay(650);if(work)await work();if(label)label.textContent=text;await fixedDelay(1050);f.classList.remove('dark');await fixedDelay(650);f.hidden=true;if(label)label.textContent='';
}
async function askInnRest(){
  const a=await dialog('休んでいきますか？',[['はい','yes','primary'],['いいえ','no']],'モブミータ','play/006.png');
  if(a!=='yes')return;
  const f=$('#castleFade'),label=$('#castleFadeText');if(!f)return;
  if(label)label.textContent='';f.hidden=false;await nextPaint();f.classList.add('dark');await fixedDelay(650);
  fullHealAtCastleInn();
  if(label)label.textContent='勇者一行はゆっくり休んだ！';await fixedDelay(1050);
  if(label)label.textContent='パーティーが全回復した！';await fixedDelay(1150);
  f.classList.remove('dark');await fixedDelay(650);f.hidden=true;if(label)label.textContent='';
}
function renderMobShopRoom(){
  castleView='shop';setCastleBackground('back/king2.png','back2/003.png');setCastleHeader('MOB SHOP','MOB SHOP','ITEM');
  const root=$('#castleContent');root.className='page-scroll nav-spacer castle-content castle-room-view mobshop-room-view';
  root.innerHTML=`<section class="castle-room-stage mobshop-stage"><div class="mobshop-host"><img src="play/005.png" alt="モブマテリア"><div><small>SHOP MASTER</small><b>モブマテリア</b></div></div><button class="castle-shop-open" data-open-castle-shop type="button"><img src="icon/20.png" alt=""><b>アイテムを見る</b></button>${castleHomeButton()}</section>`;
  bindImages(root);bindCastleContentEvents();
}
async function enterMobShop(){
  renderMobShopRoom();await facilityTalk('いらっしゃい！たくさん買って行ってくれ♪','モブマテリア','play/005.png');openCastleShopPopup();
}
function renderCastleShopGrid(){
  const root=$('#castleShopGrid'),coin=$('#castleShopCoins');if(!root)return;if(coin)coin.textContent=`${state.coins.toLocaleString()} G`;
  const goods=GAME_ITEMS.filter(it=>Number(it.id)>=1&&Number(it.id)<=18);
  root.innerHTML=goods.map((it,i)=>`<button class="castle-shop-item wood-${i%2?'blue':'pink'}" data-buy-castle-item="${it.id}" type="button"><img src="${it.image}" alt="${it.name}"><div><b>${it.name}</b><small>${itemEffectText(it)}</small><em>${it.price.toLocaleString()}G / 所持 ${itemCount(it.id)}</em></div></button>`).join('');
  bindImages(root);$$('[data-buy-castle-item]',root).forEach(btn=>btn.onclick=()=>openCastleQtyPopup(btn.dataset.buyCastleItem));
}
function openCastleShopPopup(){renderCastleShopGrid();$('#castleShopPopup').hidden=false;}
function closeCastleShopPopup(){closeCastleQtyPopup();$('#castleShopPopup').hidden=true;}
function renderCastleQtyPopup(){
  const it=itemData(castleQtyState.itemId),popup=$('#castleQtyPopup');if(!it||!popup)return;
  const qty=Math.max(1,Math.min(99,Number(castleQtyState.qty)||1));castleQtyState.qty=qty;
  const total=it.price*qty,over=total>state.coins;
  $('#castleQtyImage').src=it.image;$('#castleQtyImage').alt=it.name;
  $('#castleQtyName').textContent=it.name;$('#castleQtyUnitPrice').textContent=`1個 ${it.price.toLocaleString()} G`;
  $('#castleQtyValue').textContent=String(qty);$('#castleQtyTotal').textContent=`${total.toLocaleString()} G`;
  $('#castleQtyTotal').classList.toggle('over-budget',over);$('#castleQtyWallet').textContent=`${state.coins.toLocaleString()} G`;
  $('#castleQtyMinusBtn').disabled=qty<=1;$('#castleQtyPlusBtn').disabled=qty>=99;
  $('#castleQtyBuyBtn').classList.toggle('over-budget',over);
}
function openCastleQtyPopup(id){
  const it=itemData(id);if(!it||Number(it.id)>18)return;
  castleQtyState={itemId:String(id),qty:1};renderCastleQtyPopup();$('#castleQtyPopup').hidden=false;
}
function closeCastleQtyPopup(){const popup=$('#castleQtyPopup');if(popup)popup.hidden=true;castleQtyState={itemId:null,qty:1};}
function changeCastleQty(delta){if(!castleQtyState.itemId)return;castleQtyState.qty=Math.max(1,Math.min(99,(Number(castleQtyState.qty)||1)+delta));renderCastleQtyPopup();}
async function buyCastleItemQty(){
  const it=itemData(castleQtyState.itemId);if(!it||Number(it.id)>18)return;
  const qty=Math.max(1,Math.min(99,Number(castleQtyState.qty)||1)),total=it.price*qty;
  if(state.coins<total){await facilityTalk('ゴールドが足りないよ！','モブマテリア','play/005.png');renderCastleQtyPopup();return;}
  state.coins-=total;state.meta.coins=state.coins;addItem(it.id,qty);saveMeta();closeCastleQtyPopup();renderCastleShopGrid();await facilityTalk('毎度あり！','モブマテリア','play/005.png');
}
function renderRecordRoom(){
  castleView='records';setCastleBackground('back/king4.png','back2/003.png');setCastleHeader('RECORD ROOM','レコードルーム','LOCKED');
  const root=$('#castleContent');root.className='page-scroll nav-spacer castle-content castle-room-view record-room-view';
  root.innerHTML=`<section class="castle-room-stage record-stage"><div class="record-room-lock"><img src="icon/21.png" alt="レコードルーム"><b>LOCKED</b><p>レコードルームはまだ利用できません。</p></div>${castleHomeButton()}</section>`;bindImages(root);bindCastleContentEvents();
}
async function openCastleRoom(room){
  const assets={throne:['back/king1.png','play/007.png','play/008.png'],inn:['back/king3.png','play/006.png'],shop:['back/king2.png','play/005.png','icon/20.png'],records:['back/king4.png','icon/21.png'],smith:['back/gonzo.png','play/002.png','icon/23.png']}[room]||['back2/003.png'];
  showScreen('loading');$('#loadingText').textContent='施設へ移動しています…';$('#loadingBar').style.width='35%';const detail=$('#loadingDetail');if(detail)detail.textContent='CASTLE ROOM';await preloadAssetsSafe(assets,1000);$('#loadingBar').style.width='100%';if(detail)detail.textContent='READY';
  if(room==='throne')renderThroneRoom();else if(room==='inn')renderInnRoom();else if(room==='shop')renderMobShopRoom();else if(room==='smith'){await openBlacksmithFacility();return;}else if(room==='records')renderRecordRoom();else{renderCastle();}
  showScreen('castle');await nextPaint();await nextPaint();
  if(room==='inn')await facilityTalk('ようこそ！自由に休んでいってね！','モブミータ','play/006.png');
  if(room==='shop'){await facilityTalk('いらっしゃい！たくさん買って行ってくれ♪','モブマテリア','play/005.png');openCastleShopPopup();}
}
async function returnCastleMenu(){
  closeCastleShopPopup();closeBlacksmithPopup();
  if(castleView==='shop')await facilityTalk('またいつでもどうぞ！','モブマテリア','play/005.png');
  else if(castleView==='inn')await facilityTalk('応援しています！','モブミータ','play/006.png');
  renderCastle();
}
async function castleBackOrHome(){
  if(!$('#blacksmithPopup')?.hidden){closeBlacksmithPopup();return;}
  if(!$('#castleShopPopup').hidden){closeCastleShopPopup();return;}
  if(castleView!=='menu')return returnCastleMenu();
  return goHome();
}
function bindCastleContentEvents(){
  const root=$('#castleContent');if(!root)return;
  root.onclick=e=>{
    const menu=e.target.closest('[data-castle-menu]');if(menu)return openCastleRoom(menu.dataset.castleMenu);
    if(e.target.closest('[data-castle-home]'))return returnCastleMenu();
    const actor=e.target.closest('[data-castle-actor]');if(actor)return castleActorSpeak(actor.dataset.castleActor,actor);
    if(e.target.closest('[data-innkeeper]'))return askInnRest();
    if(e.target.closest('[data-open-castle-shop]'))return openCastleShopPopup();
    if(e.target.closest('[data-blacksmith-host]'))return renderBlacksmithPopup('menu');
  };
}
// Legacy castle facilities are kept internally for later re-introduction, but the current castle menu follows the four-room specification.
let blacksmithPopupMode='menu';
function blacksmithShopWeapons(){return WEAPONS.filter(w=>w.price&&(w.season===1||state.test?.enabled));}
function renderBlacksmithRoom(){
  castleView='smith';setCastleBackground('back/gonzo.png','back2/003.png');setCastleHeader('BLACKSMITH','鍛冶屋',`${state.coins.toLocaleString()} G`);
  const root=$('#castleContent');root.className='page-scroll nav-spacer castle-content castle-room-view blacksmith-room-view';
  root.innerHTML=`<section class="castle-room-stage blacksmith-stage"><button class="blacksmith-gonzo" data-blacksmith-host type="button"><img src="play/002.png" alt="モブゴンゾー"><b>モブゴンゾー</b><small>タップして利用</small></button>${castleHomeButton('blacksmith-home')}</section>`;
  bindImages(root);bindCastleContentEvents();
}
function renderBlacksmithPopup(mode='menu'){
  blacksmithPopupMode=mode;const pop=$('#blacksmithPopup'),body=$('#blacksmithPopupBody'),title=$('#blacksmithPopupTitle');if(!pop||!body)return;
  title.textContent=mode==='shop'?'武器購入':mode==='forge'?'メダル錬成':mode==='sell'?'武器・防具売却':'鍛冶屋';
  if(mode==='menu')body.innerHTML=`<div class="blacksmith-popup-menu"><button data-blacksmith-popup-action="shop" type="button"><b>武器購入</b><small>武器を購入する</small></button><button data-blacksmith-popup-action="forge" type="button"><b>メダル錬成</b><small>同じ武器3個 → メダル1個</small></button><button data-blacksmith-popup-action="sell" type="button"><b>売却</b><small>武器20% / 防具100%</small></button></div>`;
  else if(mode==='shop'){const list=blacksmithShopWeapons();body.innerHTML=`<button class="blacksmith-popup-back" data-blacksmith-popup-back type="button">← メニューへ</button><div class="blacksmith-weapon-list">${list.map(w=>weaponCardMarkup(w,{shop:true})).join('')||'<div class="camp-empty-note">購入できる武器がありません。</div>'}</div>`;}
  else if(mode==='forge'){const list=WEAPONS.filter(w=>freeWeaponCount(w.id)>=3);body.innerHTML=`<button class="blacksmith-popup-back" data-blacksmith-popup-back type="button">← メニューへ</button><div class="blacksmith-weapon-list">${list.map(w=>weaponCardMarkup(w,{smith:true})).join('')||'<div class="camp-empty-note">メダルに出来る武器がありません。</div>'}</div>`;}else{const ws=WEAPONS.filter(w=>freeWeaponCount(w.id)>0),as=ARMORS.filter(a=>freeArmorCount(a.id)>0);body.innerHTML=`<button class="blacksmith-popup-back" data-blacksmith-popup-back type="button">← メニューへ</button><h3>武器売却（購入価格の20%）</h3><div class="blacksmith-weapon-list">${ws.map(w=>`<button class="weapon-card" data-sell-weapon="${w.id}" type="button"><span class="weapon-art"><img src="${w.image}" alt=""></span><div><b>${w.name}</b><small>所持 ${weaponOwned(w.id)} / 売却可能 ${freeWeaponCount(w.id)}</small><strong>${Math.floor(w.price*.2).toLocaleString()}G</strong></div></button>`).join('')||'<div class="camp-empty-note">売却可能な武器はありません。</div>'}</div><h3>防具売却（価格100%）</h3><div class="blacksmith-weapon-list">${as.map(a=>`<button class="weapon-card" data-sell-armor="${a.id}" type="button"><span class="weapon-art"><img src="${a.image}" alt=""></span><div><b>${a.name}</b><small>所持 ${armorOwned(a.id)} / 売却可能 ${freeArmorCount(a.id)}</small><strong>${a.price.toLocaleString()}G</strong></div></button>`).join('')||'<div class="camp-empty-note">売却可能な防具はありません。</div>'}</div>`;}
  bindImages(body);pop.hidden=false;
}
function closeBlacksmithPopup(){const pop=$('#blacksmithPopup');if(pop)pop.hidden=true;blacksmithPopupMode='menu';}
async function buyBlacksmithWeapon(id){
  const w=weaponById(id);if(!w?.price)return;if(state.coins<w.price){await facilityTalk('ゴールドが足りないぞ！','モブゴンゾー','play/002.png');return;}
  const a=await narrationDialog(`${w.name}を購入しますか？\n${w.price.toLocaleString()}G`,[['はい','yes','primary'],['いいえ','no']]);if(a!=='yes')return;
  state.coins-=w.price;state.meta.coins=state.coins;addWeapon(w.id,1);saveMeta();renderHome();renderBlacksmithPopup('shop');await facilityTalk('毎度！大事に使ってくれよな！','モブゴンゾー','play/002.png');
}
async function forgeBlacksmithMedal(id){
  const w=weaponById(id);if(!w)return;if(freeWeaponCount(id)<3){await facilityTalk('今はメダルに出来る武器が足りないぞ！','モブゴンゾー','play/002.png');return renderBlacksmithPopup('forge');}
  const a=await narrationDialog(`${w.name}を3個使ってメダルを錬成しますか？`,[['はい','yes','primary'],['いいえ','no']]);if(a!=='yes')return;
  closeBlacksmithPopup();await facilityTalk('よし来た！任せろ！','モブゴンゾー','play/002.png');await runSmithHammerFx();state.meta.weapons[id]=Math.max(0,weaponOwned(id)-3);addMedal(id,1);saveMeta();await narrationDialog(`${w.name}メダルを手に入れた！`);renderBlacksmithPopup('forge');
}
async function sellBlacksmithItem(kind,id){const obj=kind==='armor'?armorById(id):weaponById(id);if(!obj)return;const free=kind==='armor'?freeArmorCount(id):freeWeaponCount(id);if(free<1)return facilityTalk('装備中のものは売れないぞ！','モブゴンゾー','play/002.png');const price=kind==='armor'?obj.price:Math.floor(obj.price*.2);const a=await narrationDialog(`${obj.name}を売却しますか？\\n${price.toLocaleString()}G`,[['はい','yes','primary'],['いいえ','no']]);if(a!=='yes')return;if(kind==='armor')state.meta.armors[id]=Math.max(0,armorOwned(id)-1);else state.meta.weapons[id]=Math.max(0,weaponOwned(id)-1);state.coins+=price;saveMeta();renderHome();renderBlacksmithPopup('sell');toast(`${price.toLocaleString()}Gで売却しました`);}
function bindBlacksmithPopupEvents(){
  const pop=$('#blacksmithPopup');if(!pop)return;pop.onclick=e=>{if(e.target===pop||e.target.closest('[data-blacksmith-popup-close]'))return closeBlacksmithPopup();const back=e.target.closest('[data-blacksmith-popup-back]');if(back)return renderBlacksmithPopup('menu');const act=e.target.closest('[data-blacksmith-popup-action]');if(act)return renderBlacksmithPopup(act.dataset.blacksmithPopupAction);const buy=e.target.closest('[data-buy-weapon]');if(buy)return buyBlacksmithWeapon(buy.dataset.buyWeapon);const forge=e.target.closest('[data-forge-medal]');if(forge)return forgeBlacksmithMedal(forge.dataset.forgeMedal);const sw=e.target.closest('[data-sell-weapon]');if(sw)return sellBlacksmithItem('weapon',sw.dataset.sellWeapon);const sa=e.target.closest('[data-sell-armor]');if(sa)return sellBlacksmithItem('armor',sa.dataset.sellArmor);};
}
async function openBlacksmithFacility(){
  renderBlacksmithRoom();showScreen('castle');await nextPaint();await nextPaint();
  if(!facilityFlag('smith:v74')){await facilityTalk('よう！よく来たな！ここでは装備の購入とメダルの錬成が出来るぞ！装備は武器と防具に分かれていて武器は2つまで、防具は1つ装備出来るぞ！武器の2つ目はサブ武器でステータスが半減する。注意して装備してくれ！同じ武器を3つ持ってきたらメダル錬成が出来るぞ！メダルはその武器のステータス10％と、なんと特性を引き継ぐことが出来るぞ！メダルにした武器は消えてしまうから注意してくれ！','モブゴンゾー','play/002.png');markFacilityFlag('smith:v74');}
}
async function leaveBlacksmith(){closeBlacksmithPopup();await facilityTalk('また来てくれよな！','モブゴンゾー','play/002.png');renderCastle();showScreen('castle');}
async function openMagicFacility(){await dialog('魔法錬成は現在準備中です。',[['戻る','back','primary']],'モブローブ','play/004.png');await showFacilityExit('play/004.png','いつでもお待ちしています！','purple');renderCastle();showScreen('castle');}
async function openMobShopFacility(){return enterMobShop();}
function trainingPlayedOnce(){return !!state.meta?.trainingPlayed||Number(state.adventure?.worldIndex||0)>0||(state.adventure?.reportedWorlds||[]).length>0;}
function markTrainingPlayed(){if(!state.meta.trainingPlayed){state.meta.trainingPlayed=true;saveMeta();}}
function adventureEntryUnlocked(){return state.test?.enabled||trainingPlayedOnce();}
function openHomeAction(action){
  if(action==='home')return toast('ここがHOMEです');
  if(action==='equipment')return openEquipmentScreen();
  if(action==='items')return openInventory();
  if(action==='settings')return openSettings();
  if(action==='castle')return dialog('お城に向かいますか？',[['はい','yes','primary'],['いいえ','no']]).then(async v=>{if(v==='yes'){await travelTo('castle','お城へ向かっています…',renderCastle);await enterCastle();}});
  if(action==='tavern')return dialog('酒場に向かいますか？',[['はい','yes','primary'],['いいえ','no']]).then(async v=>{if(v==='yes'){await travelTo('tavern','酒場へ向かっています…',renderTavern);await enterTavern();}});
  if(action==='training')return dialog('トレーニングに向かいますか？',[['はい','yes','primary'],['いいえ','no']]).then(async v=>{if(v==='yes'){await travelTo('training','トレーニングルームへ向かっています…',renderTraining);await enterTraining();}});
  if(action==='adventure'){if(!adventureEntryUnlocked())return dialog('まずはトレーニングへ向かいましょう！',[['OK','ok']],'SYSTEM');const w=currentWorld();return dialog(`冒険に向かいますか？\n現在の目的地は「${w?.name||'草原'}」です！`,[['はい','yes','primary'],['いいえ','no']]).then(async v=>{if(v==='yes'){ensureAdventureRunSnapshot();await travelTo('adventure',`${w?.name||'草原'}へ出発です！`,renderAdventure);await handleAdventureEntry();}});}
}
function randomTraining(){
  const arr=[...MOB_DATA.players].sort(()=>Math.random()-.5).slice(0,10);state.training.party=Array.from({length:10},(_,i)=>arr[i]?[arr[i].id,rint(5,95)]:null);
  const catalog=trainingEnemyCatalog(),count=rint(1,4);state.training.enemySlots=[null,null,null,null];
  for(let i=0;i<count;i++){const t=pick(catalog);state.training.enemySlots[i]={id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||50)};}
  state.training.activeEnemySlot=Math.min(count,3);state.training.filter='ALL';renderTraining();
}

function lockMobileGestures(){const editable=el=>['INPUT','SELECT','TEXTAREA'].includes(el?.tagName);document.addEventListener('contextmenu',e=>{if(!editable(e.target))e.preventDefault();},{capture:true});document.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});document.addEventListener('selectstart',e=>{if(!editable(e.target))e.preventDefault();},{capture:true});document.addEventListener('selectionchange',()=>{const a=document.activeElement;if(editable(a))return;const s=window.getSelection?.();if(s&&!s.isCollapsed)s.removeAllRanges();});['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false,capture:true}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false,capture:true});let last=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-last<320)e.preventDefault();last=now;},{passive:false,capture:true});document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false,capture:true});}
function bindEvents(){
  const storyScene=$('#storyScene');if(storyScene){storyScene.addEventListener('pointerup',handleStoryTapAdvance,{passive:false});storyScene.addEventListener('contextmenu',e=>e.preventDefault());}
  $('#titleNewBtn').onclick=startNewGame;$('#titleContinueBtn').onclick=continueGame;$('#titleSettingsBtn').onclick=openSettings;
  $$('[data-home-action]').forEach(b=>b.onclick=()=>openHomeAction(b.dataset.homeAction));$$('[data-back-home]').forEach(b=>b.onclick=()=>{if(screens.adventure.classList.contains('active')&&adventureRunActive())return narrationDialog('冒険中はHOMEへ戻れません。\n戻る場合は「冒険を諦める」を選んでください。');goHome();});
  $('#castleBackBtn').onclick=castleBackOrHome;bindBlacksmithPopupEvents();$('#castleShopCloseBtn').onclick=closeCastleShopPopup;$('#castleShopPopup').addEventListener('click',e=>{if(e.target===$('#castleShopPopup'))closeCastleShopPopup();});
  $('#castleQtyCloseBtn').onclick=closeCastleQtyPopup;$('#castleQtyMinusBtn').onclick=()=>changeCastleQty(-1);$('#castleQtyPlusBtn').onclick=()=>changeCastleQty(1);$('#castleQtyBuyBtn').onclick=buyCastleItemQty;$('#castleQtyPopup').addEventListener('click',e=>{if(e.target===$('#castleQtyPopup'))closeCastleQtyPopup();});
  $('#equipmentBackBtn').onclick=()=>{closeFigurePicker();if(equipmentFacilityOrigin==='smith')leaveBlacksmith();else goHome();};$$('[data-equipment-tab]').forEach(b=>b.onclick=()=>{equipmentTab=b.dataset.equipmentTab;renderEquipment();});$('#weaponPickerCloseBtn').onclick=closeWeaponPicker;$('#weaponPickerOverlay').addEventListener('click',e=>{if(e.target===$('#weaponPickerOverlay'))closeWeaponPicker();});$('#figurePickerCloseBtn').onclick=closeFigurePicker;$('#figurePickerOverlay').addEventListener('click',e=>{if(e.target===$('#figurePickerOverlay'))closeFigurePicker();});
  $('#tavernBackBtn').onclick=()=>{if(!$('#tavernPartyPopup').hidden||!$('#tavernDrinkPopup').hidden||!$('#tavernFigurePopup').hidden)return showTavernMenu();leaveTavern();};$('#tavernResetBtn').onclick=()=>{};$('#savePartyBtn').onclick=async()=>{if(state.party.length<1)return;saveParty();state.training.party=state.party.map(x=>[...x]);toast('パーティーを保存しました');showTavernMenu();};$('#tavernPartyCloseBtn').onclick=showTavernMenu;$('#tavernDrinkCloseBtn').onclick=()=>{$('#tavernDrinkPopup').hidden=true;};$('#tavernFigureCloseBtn').onclick=()=>{$('#tavernFigurePopup').hidden=true;};$$('[data-tavern-menu]').forEach(b=>b.onclick=()=>{const a=b.dataset.tavernMenu;if(a==='party')showTavernParty();else if(a==='drink')showTavernDrinks();else if(a==='figure')showTavernFigureShop();else leaveTavern();});
  $('#trainingBackBtn').onclick=()=>{if(!$('#trainingFeaturePopup').hidden){state.training.mode='menu';$('#trainingFeaturePopup').hidden=true;renderTraining();return;}if((state.training.mode||'menu')!=='menu'){state.training.mode='menu';renderTraining();return;}leaveTraining();};$('#trainingHomeQuick').onclick=leaveTraining;$('#trainingFeatureCloseBtn').onclick=()=>{state.training.mode='menu';$('#trainingFeaturePopup').hidden=true;renderTraining();};$('#trainingRandomBtn').onclick=randomTraining;$('#allLevelBtn').onclick=()=>{ensureTrainingParty();state.training.party=state.training.party.map(x=>x?[x[0],50]:null);renderTraining();};$('#trainingEnemyAddBtn').onclick=()=>{ensureTrainingEnemies();const i=state.training.enemySlots.findIndex(x=>!x);if(i<0)return toast('敵は最大4体です');state.training.activeEnemySlot=i;renderTraining();};$('#trainingEnemyClearBtn').onclick=()=>{state.training.enemySlots=[null,null,null,null];state.training.activeEnemySlot=0;renderTraining();};$('#startTrainingBattleBtn').onclick=resetTrainingBattle;
  $('#exploreBtn').onclick=exploreField;$('#campBtn').onclick=openCamp;$('#fieldBattleBtn').onclick=startAdventureBattle;const abandonBtn=$('#abandonAdventureBtn');if(abandonBtn)abandonBtn.onclick=abandonAdventure;
  $('#questBackBtn').onclick=async()=>{if(!state.quest)return setTrainingMode(state.training.mode||'menu');if(state.quest.type!=='journal')return facilityTalk('このエリアはクリアかゲームオーバーまで出られないよ','モブコーチ','play/003.png');const a=await dialog('冒険日記を中断してトレーニングへ戻りますか？',[['はい','yes','primary'],['いいえ','no']],'モブコーチ','play/003.png');if(a==='yes')endQuestToTraining();};$('#questExploreBtn').onclick=questExplore;$('#questCampBtn').onclick=questCamp;$('#questBattleBtn').onclick=startQuestBattle;
  $('#battleBackBtn').onclick=()=>{if(!state.battle||state.battle.mode!=='training')return;state.battle.auto=false;renderTraining();showScreen('training');};
  $('#campCloseBtn').onclick=closeCamp;$$('[data-camp-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.campAction;if(a==='tent')useCampTent();else if(a==='chair')useCampChair();else if(a==='party')renderCampPartyMenu();else renderCampDrinks();});
  $('#attackBtn').onclick=()=>act('attack');$('#skillBtn').onclick=()=>openSkillMenu('magic');$('#specialBtn').onclick=()=>openSkillMenu('special');$('#ultimateBtn').onclick=()=>openSkillMenu('ultimate');$('#defendBtn').onclick=()=>act('defend');$('#itemBtn').onclick=openItemMenu;$('#escapeBtn').onclick=escapeAttempt;$('#switchBtn').onclick=openSwitchMenu;$$('[data-close-sheet]').forEach(b=>b.onclick=()=>{$('#skillMenu').hidden=true;});
  $('#autoBtn').onclick=()=>{const b=state.battle;if(!b||b.finished)return;b.auto=!b.auto;state.autoBattle=b.auto;saveAutoBattlePreference(state.autoBattle);$('#autoBtn').classList.toggle('active',b.auto);$('#autoBtn').textContent=b.auto?'AUTO ON':'AUTO';if(b.auto&&!b.busy&&activeAlly())autoAct();};$('#speedBtn').onclick=()=>{const speeds=state.test?.enabled?[1,1.5,2,5]:[1,1.5,2];let i=speeds.indexOf(state.speed);if(i<0)i=0;state.speed=speeds[(i+1)%speeds.length];$('#speedBtn').textContent=`×${state.speed}`;};
  $('#resultRetryBtn').onclick=resetTrainingBattle;$('#resultSetupBtn').onclick=async()=>{if(!state.battle)return;const b=state.battle;$('#resultOverlay').hidden=true;if(b.mode==='adventure'){renderAdventure();showScreen('adventure');if(b.config?.explorationAmbush){if(b.resultWin)completeExplorationUnlock();else{renderAdventure();showScreen('adventure');}return;}if(state.adventure.pendingPostStory)await runPendingPostStory(!!b.config?.returnHomeAfterAreaClear,!!b.config?.returnHomeAfterAreaClear);if(b.config?.returnHomeAfterAreaClear){await goHome();return;}renderAdventure();showScreen('adventure');return;}if(b.mode==='quest'){if(state.quest?.type==='program'){await finishBattleProgramReturn(!!b.resultWin);return;}if(state.quest?.type==='subquest'){if(b.resultWin){await finishSubquestReturn();return;}endQuestToTraining();return;}if(!b.resultWin){if(state.quest?.type==='boss'&&(state.test?.enabled||itemCount('38')>=3)){const a=await dialog('ボスレコードを3枚消費してコンテニューしますか？',[['はい','yes','primary'],['いいえ','no']],'CONTINUE');if(a==='yes'&&(state.test?.enabled||consumeItem('38',3))){state.quest.vitals=freshQuestVitals();renderQuestScreen();showScreen('quest');return;}}endQuestToTraining();return;}if(state.quest?.finished){toast('4 AREA CLEAR！');endQuestToTraining();return;}renderQuestScreen();showScreen('quest');return;}renderTraining();showScreen('training');};
  $('#inventoryCloseBtn').onclick=closeInventory;$('#inventoryOverlay').addEventListener('click',e=>{if(e.target===$('#inventoryOverlay'))closeInventory();});$$('[data-inventory-tab]').forEach(b=>b.onclick=()=>{inventoryTab=b.dataset.inventoryTab;renderInventory();});$('#playerDetailCloseBtn').onclick=closePlayerDetail;$('#playerDetailOverlay').addEventListener('click',e=>{if(e.target===$('#playerDetailOverlay'))closePlayerDetail();});
  $('#settingsCloseBtn').onclick=closeSettings;
  $('#testModeToggle').onclick=()=>{state.test.enabled=!state.test.enabled;if(!state.test.enabled){state.test.fast5=false;if(state.speed===5)state.speed=1;if(state.training.mode==='test')state.training.mode='menu';}saveTestSettings();renderSettings();if(screens.training.classList.contains('active'))renderTraining();toast(state.test.enabled?'テストモード ON':'テストモード OFF');};
  $('#testFastToggle').onclick=()=>{if(!state.test.enabled)return;state.test.fast5=!state.test.fast5;saveTestSettings();renderSettings();toast(state.test.fast5?'戦闘速度 ×5 をON':'戦闘速度 ×5 をOFF');};$('#testAllSkillsToggle').onclick=()=>{if(!state.test.enabled)return;state.test.allSkills=!state.test.allSkills;saveTestSettings();renderSettings();toast(state.test.allSkills?'全魔法・特技・必殺技テスト ON':'全魔法・特技・必殺技テスト OFF');};$('#testChapterApplyBtn').onclick=applyTestChapter;
  $('#applyTestLevelBtn').onclick=()=>{if(!state.test.enabled)return;const lv=clamp(Number($('#testLevelInput').value)||5,1,120);state.party=state.party.map(([id])=>[id,lv]);state.adventure.vitals=null;saveParty();saveAdventure();state.training.party=state.party.map(x=>[...x]);renderSettings();toast(`現在のパーティーをLv${lv}に設定しました / HP・MP全回復`);};
  $('#testItemsMaxBtn').onclick=grantTestItemsMax;$$('[data-test-loadout]').forEach(btn=>btn.onclick=()=>applyTestLoadoutPreset(btn.dataset.testLoadout));
  $('#deleteDataBtn').onclick=deleteAllGameData;
}

window.addEventListener('resize',()=>{if(screens.home.classList.contains('active'))applyHomeCommonScale();if(screens.adventure.classList.contains('active'))applyAdventurePartyScale();});
let bootSetupError=null;
try{lockMobileGestures();initCommonNav();bindImages();bindEvents();}
catch(err){bootSetupError=err;console.error('[MOB QUEST] setup recovery',err);}
function bindEssentialBootEvents(){
  const n=$('#titleNewBtn'),c=$('#titleContinueBtn'),s=$('#titleSettingsBtn');
  if(n)n.onclick=startNewGame;if(c)c.onclick=continueGame;if(s)s.onclick=openSettings;
}
bindEssentialBootEvents();
window.__mobBootReady=true;
/* Boot must always escape the loader, even if a malformed/missing asset throws unexpectedly. */
(async()=>{
  try{showTitle();}
  catch(err){console.error('[MOB QUEST] TITLE boot recovery',err);const l=$('#loadingScreen'),t=$('#titleScreen');if(l)l.classList.remove('active');if(t)t.classList.add('active');}
})();
preloadAssets(['icon/01.png','back/rpgmain.png','icon/02.png','icon/03.png','icon/04.png','icon/05.png','icon/06.png','icon/07.png','icon/08.png']).catch(()=>{});
setTimeout(startFastBackgroundWarmup,1400);
})();

