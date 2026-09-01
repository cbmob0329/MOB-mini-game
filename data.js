// MOB QUEST v81
// 未決定の初期ステータス・レベル成長・通常魔法威力・敵能力値・必殺技の数値倍率は
// 正式設定ではありません。テスト戦闘だけを成立させるため TEMP_BALANCE に隔離しています。
const TEMP_BALANCE = {
  base:{hp:420,mp:72,atk:38,mag:38,def:28,res:28,spd:28},
  enemy:{hpBase:1800,hpPerLevel:175,hpPerMember:350,atkBase:52,atkPerLevel:8.1,magBase:52,magPerLevel:8.0,defBase:52,defPerLevel:4.1,resBase:52,resPerLevel:4.0,spdBase:30,spdPerLevel:2.15},
  normalEnemy:{hpBase:850,hpPerLevel:105,hpPerMember:150,atkBase:35,atkPerLevel:6.2,magBase:30,magPerLevel:5.5,defBase:32,defPerLevel:3.2,resBase:30,resPerLevel:3.0,spdBase:26,spdPerLevel:2.0},
  playerGrowth:{
    yusha:{hp:54,mp:2.5,atk:7.6,mag:7.2,def:3.8,res:3.7,spd:2.8},
    pink:{hp:50,mp:2.8,atk:6.2,mag:6.5,def:4.5,res:4.4,spd:2.5},
    desert:{hp:56,mp:2.0,atk:8.0,mag:5.6,def:4.0,res:3.4,spd:2.4},
    nyoro:{hp:49,mp:2.2,atk:7.5,mag:6.5,def:3.3,res:3.4,spd:3.0},
    nekoku:{hp:55,mp:2.2,atk:7.7,mag:5.9,def:4.2,res:3.6,spd:2.6},
    jessie:{hp:48,mp:2.7,atk:7.0,mag:7.4,def:3.2,res:3.8,spd:3.4},
    denden:{hp:53,mp:2.4,atk:7.8,mag:6.4,def:3.7,res:3.6,spd:2.8},
    money:{hp:47,mp:3.2,atk:5.7,mag:8.0,def:3.1,res:4.8,spd:2.5},
    riro:{hp:50,mp:2.7,atk:7.0,mag:6.6,def:3.5,res:4.1,spd:3.1},
    tetsu:{hp:57,mp:2.0,atk:8.4,mag:4.8,def:4.3,res:3.2,spd:2.7},
    lilith:{hp:49,mp:3.1,atk:5.9,mag:8.3,def:3.4,res:4.6,spd:3.0},
    naraku:{hp:58,mp:2.7,atk:7.9,mag:7.8,def:4.0,res:4.0,spd:2.7},
  },
  bossSpecialEvery:3, critRate:.03, critPower:1.5, evadeMin:.02, evadeMax:.05,
  damageScale:{small:.78,medium:1.6,large:2.1,extra:2.45,extreme:2.72},
  healScale:{small:.16,medium:.26,large:.40},
  magicNote:'通常魔法の習得・消費MP・威力は未設定のためテスト用仮値'
};

const MOB_DATA = {
  elements: {
    '火': { label:'火', temporary:true, spell:'ホノマ', cost:10, power:1.35, frames:['skill/05.png','skill/06.png','skill/07.png','skill/08.png'] },
    '水': { label:'水', temporary:true, spell:'ネプマ', cost:10, power:1.35, frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png'] },
    '雷': { label:'雷', temporary:true, spell:'トルマ', cost:10, power:1.38, frames:['skill/29.png','skill/30.png','skill/31.png','skill/30.png'] },
    '地': { label:'地', temporary:true, spell:'ゴレマ', cost:10, power:1.38, frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png'] },
    '風': { label:'風', temporary:true, spell:'プテマ', cost:10, power:1.35, frames:['skill/49.png','skill/50.png','skill/51.png','skill/52.png'] },
    '光': { label:'光', temporary:true, spell:'ネオマ', cost:11, power:1.42, frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png'] },
    '闇': { label:'闇', temporary:true, spell:'ミラマ', cost:11, power:1.42, frames:['skill/65.png','skill/66.png','skill/67.png','skill/68.png'] },
    '無': { label:'無', temporary:true, spell:'アノマ', cost:9, power:1.30, frames:[] }
  },

  players: [
    {
      id:'yusha', name:'モブ勇者', image:'play/01.png', symbol:'勇', attribute:'光', weapon:'大剣・杖', role:'勇者', passive:'あのヒーローにやっつけてもらおう',
      ults:[
        {name:'星降りの一振り',image:'ult/01.png',cost:18,kind:'damage',power:1.65,type:'physical',crit:.10,desc:'敵単体中ダメージ。10%で会心。'},
        {name:'特別だと信じる力',image:'ult/02.png',cost:20,kind:'selfAllBuff',power:0,desc:'自身の全能力20%UP＋被ダメージ10%軽減。'},
        {name:'エピソード・ジューマンジ',image:'ult/03.png',cost:30,kind:'jumanji',power:2.05,type:'magic',desc:'敵単体大ダメージ＋自身バフ＋敵デバフ。'},
        {name:'ネバー・エンディング・ブラスト',image:'ult/04.png',cost:38,kind:'lowHpBurst',power:2.55,type:'magic',desc:'敵単体極大ダメージ。味方残HPが少ないほど強化。'},
        {name:'読みかけの本',image:'play/13.png',cost:55,kind:'heroTransform',power:0,desc:'HP50%回復し「あのヒーロー」に変身。全能力30%UP＋自身の全必殺技CT-3。'}
      ]
    },
    {
      id:'pink', name:'モブピンク', image:'play/02.png', symbol:'桃', attribute:'無', weapon:'大剣', role:'サポート', passive:'支える力',
      ults:[
        {name:'シールドアタック',image:'ult/05.png',cost:16,kind:'shieldAttack',power:1.60,type:'physical',desc:'単体中ダメージ＋このターン自身20%軽減。'},
        {name:'癒しのピンクボンボン',image:'ult/06.png',cost:24,kind:'healCleanse',power:.18,desc:'味方全体小回復＋50%で状態異常解除。'},
        {name:'勇者のパートナー',image:'ult/07.png',cost:28,kind:'yushaGuardAoe',power:1.55,type:'magic',desc:'敵全体中ダメージ＋勇者の被ダメージ50%軽減。'},
        {name:'キングダムソルジャー',image:'ult/08.png',cost:34,kind:'teamGuardAoe',power:1.85,type:'physical',desc:'敵全体大ダメージ＋味方全員30%軽減。'}
      ]
    },
    {
      id:'desert', name:'モブデザート', image:'play/03.png', symbol:'砂', attribute:'地', weapon:'太刀', role:'物理', passive:'サバクノマモリビト',
      ults:[
        {name:'デザートブラウニー',image:'ult/09.png',cost:16,kind:'selfHealAttack',power:1.65,type:'physical',desc:'自身小回復＋単体中ダメージ。'},
        {name:'ゴールドフィッシュ',image:'ult/10.png',cost:22,kind:'goldAttack',power:2.00,type:'physical',desc:'単体大ダメージ＋トレーニング外ではゴールドを奪う。'},
        {name:'サンドドラグーン',image:'ult/11.png',cost:28,kind:'aoeSpeedDebuff',power:2.05,type:'magic',desc:'敵全体大ダメージ＋敵全体SPD小ダウン。'},
        {name:'スナノサバキ',image:'ult/12.png',cost:36,kind:'aoeDamage',power:2.65,type:'physical',desc:'敵全体極大ダメージ。'}
      ]
    },
    {
      id:'nyoro', name:'モブニョロ', image:'play/04.png', symbol:'炎', attribute:'火', weapon:'銃・杖', role:'攻撃', passive:'マグマスイミング',
      ults:[
        {name:'マグマケロ',image:'ult/13.png',cost:18,kind:'aoeBurn',power:1.60,type:'physical',chance:.10,desc:'敵全体中ダメージ＋10%でやけど。'},
        {name:'ヒノフルカヨウ',image:'ult/14.png',cost:24,kind:'aoeDamage',power:2.05,type:'physical',desc:'敵全体大ダメージ。'},
        {name:'ジューシーファイア',image:'ult/15.png',cost:28,kind:'burnAttack',power:2.15,type:'magic',chance:.30,desc:'大ダメージ＋30%でやけど。'},
        {name:'マグケロキングダム',image:'ult/16.png',cost:34,kind:'teamDefAoe',power:2.20,type:'physical',desc:'味方全体DEF小UP＋敵全体大ダメージ。'}
      ]
    },
    {
      id:'nekoku', name:'モブネコクー', image:'play/05.png', symbol:'水', attribute:'水', weapon:'槍', role:'戦士', passive:'癒しのプニプニ',
      ults:[
        {name:'ネコクージェット',image:'ult/17.png',cost:17,kind:'damage',power:1.65,type:'physical',sure:true,desc:'必中の単体中ダメージ。'},
        {name:'ネコトクジラ',image:'ult/18.png',cost:23,kind:'selfCleanseAttack',power:2.00,type:'physical',desc:'自身の状態異常解除＋単体大ダメージ。'},
        {name:'ネムレナイヨル',image:'ult/19.png',cost:29,kind:'sleepAttack',power:2.10,type:'magic',chance:.50,desc:'大ダメージ＋50%で眠り。'},
        {name:'ウォーターキル・ザ・ビート',image:'ult/20.png',cost:36,kind:'sleepAttack',power:2.60,type:'magic',chance:.10,desc:'極大ダメージ＋10%で眠り。'}
      ]
    },
    {
      id:'jessie', name:'モブジェシー', image:'play/06.png', symbol:'雷', attribute:'雷', weapon:'槍・銃', role:'雷撃', passive:'ダブルサンダー',
      ults:[
        {name:'サンダーロープ',image:'ult/21.png',cost:17,kind:'paralyzeAttack',power:1.62,type:'physical',chance:.10,desc:'中ダメージ＋10%でマヒ。'},
        {name:'ジャスティス+・スクリューブロー',image:'ult/22.png',cost:24,kind:'aoeSelfSpd',power:2.00,type:'physical',desc:'敵全体大ダメージ＋自身SPDアップ。'},
        {name:'プティハードライトニング',image:'ult/23.png',cost:28,kind:'playerSinglePlusAoe',power:2.20,aoePower:.72,type:'magic',desc:'敵単体大ダメージ＋敵全体小ダメージ。'},
        {name:'クライマックスチェイス',image:'ult/24.png',cost:36,kind:'playerSinglePlusAoeParalyze',power:2.10,aoePower:1.45,type:'physical',chance:.10,desc:'敵単体大ダメージ＋敵全体中ダメージ＋10%でマヒ。'}
      ]
    },
    {
      id:'denden', name:'モブデンデン', image:'play/07.png', symbol:'電', attribute:'雷', weapon:'銃', role:'連撃', passive:'デンデン・ムキムキ・カナリツヨイ',
      ults:[
        {name:'マシンガングミ',image:'ult/25.png',cost:18,kind:'multiAttack',power:.70,type:'physical',hits:[3,6],desc:'ランダムな敵へ3～6回の小ダメージ。'},
        {name:'イカシタイカヅチ',image:'ult/26.png',cost:25,kind:'teamRecovery',power:.16,desc:'味方全体HP・MP小回復＋DEF小UP。'},
        {name:'トリック・ザ・デンデン',image:'ult/27.png',cost:29,kind:'aoeStun',power:2.10,type:'physical',chance:.10,desc:'敵全体大ダメージ＋10%でひるみ。'},
        {name:'デンデンサンダーボルト',image:'ult/28.png',cost:37,kind:'aoeDamage',power:2.68,type:'magic',desc:'敵全体極大ダメージ。'}
      ]
    },
    {
      id:'money', name:'モブマニー', image:'play/08.png', symbol:'光', attribute:'光', weapon:'杖', role:'回復', passive:'マニーは海を渡る',
      ults:[
        {name:'バブルネオン',image:'ult/29.png',cost:18,kind:'selfRecoveryAttack',power:1.70,type:'magic',desc:'単体中ダメージ＋自身HP/MP小回復。'},
        {name:'レッドブルーボム',image:'ult/30.png',cost:27,kind:'damage',power:2.20,type:'magic',desc:'火・水・光を持つ単体大ダメージ。'},
        {name:'マニーズハウス',image:'ult/31.png',cost:30,kind:'teamHealGuard',power:.28,desc:'味方全体中回復＋被ダメージ10%軽減。'},
        {name:'レトロミラージュマニー',image:'ult/32.png',cost:42,kind:'fullHealBarrier',power:0,desc:'自身全回復＋味方全体に1回無効バリア。'}
      ]
    },
    {
      id:'riro', name:'モブリーロ', image:'play/09.png', symbol:'風', attribute:'風', weapon:'槍・太刀', role:'万能', passive:'アーティスト・マインド',
      ults:[
        {name:'トゥエルラッシュ',image:'ult/33.png',cost:16,kind:'damage',power:1.65,type:'physical',desc:'単体中ダメージ。'},
        {name:'タロ・アンド・リーロ',image:'ult/34.png',cost:25,kind:'healCleanse',power:.26,desc:'味方全体中回復＋50%で状態異常解除。'},
        {name:'ディスコスパイラル',image:'ult/35.png',cost:28,kind:'teamAtkAttack',power:2.10,type:'physical',desc:'味方全体ATK小UP＋単体大ダメージ。'},
        {name:'リーロ・トゥ・ステイシー',image:'ult/36.png',cost:38,kind:'healAttack',power:2.60,type:'physical',heal:.24,desc:'味方全体中回復＋単体極大ダメージ。'}
      ]
    },
    {
      id:'tetsu', name:'モブテツ', image:'play/10.png', symbol:'鉄', attribute:'地', weapon:'太刀', role:'剣豪', passive:'テツの意志',
      ults:[
        {name:'モブテツ一閃',image:'ult/37.png',cost:18,kind:'aoeStun',power:1.75,type:'physical',chance:.10,desc:'敵全体中ダメージ＋10%でひるみ。'},
        {name:'モブテツ流茄子落とし',image:'ult/38.png',cost:23,kind:'damage',power:2.20,type:'physical',crit:.20,priority:true,desc:'先制大ダメージ。20%で会心。'},
        {name:'モブテツ一文字',image:'ult/39.png',cost:30,kind:'aoeStun',power:2.25,type:'physical',chance:.50,desc:'敵全体大ダメージ＋50%でひるみ。'},
        {name:'鉄の極意',image:'ult/40.png',cost:38,kind:'tetsuFinal',power:2.72,type:'physical',desc:'自身ATK小UP＋敵DEFダウン＋極大ダメージ。'}
      ]
    },
    {
      id:'lilith', name:'モブリリス', image:'play/14.png', symbol:'薔', attribute:'闇', weapon:'杖', role:'魔法', passive:'ウルモブリリス',
      ults:[
        {name:'ブラックホール',image:'ult/41.png',cost:22,kind:'aoeSpeedDebuff',power:1.80,type:'magic',desc:'敵全体中ダメージ＋敵全体SPDダウン。'},
        {name:'リリス四姉妹',image:'ult/42.png',cost:30,kind:'multiAttack',power:.68,type:'magic',hits:[4,4],desc:'4属性の中ダメージを4回。'},
        {name:'薔薇の鼓動',image:'ult/43.png',cost:36,kind:'multiAttack',power:.58,type:'magic',hits:[6,6],desc:'闇の中ダメージを6回。'},
        {name:'ローズ・ウォール・ストリート',image:'ult/44.png',cost:44,kind:'healAoeStun',power:2.25,type:'magic',heal:.25,chance:.30,desc:'味方全体HP/MP中回復＋敵全体大ダメージ＋30%でひるみ。'}
      ]
    },
    {
      id:'naraku', name:'モブナラク', image:'play/12.png', symbol:'魔', attribute:'闇', weapon:'太刀・大剣', role:'魔王系', passive:'魔王の系譜',
      ults:[
        {name:'ミラモブポイズン',image:'ult/45.png',cost:22,kind:'aoePoison',power:1.90,type:'physical',chance:.30,desc:'敵全体中ダメージ＋30%で毒。'},
        {name:'ガーディアンシールド',image:'ult/46.png',cost:25,kind:'narakuShield',power:0,desc:'自身20%軽減＋味方全体10%軽減。'},
        {name:'フル・ドラゴンフレイム',image:'ult/47.png',cost:34,kind:'selfAtkAoe',power:2.30,type:'magic',desc:'自身ATK小UP＋敵全体に火・闇の大ダメージ。'},
        {name:'マスター・オブ・ピラミッド',image:'ult/48.png',cost:44,kind:'aoeDamage',power:2.78,type:'magic',desc:'敵全体極大ダメージ。'}
      ]
    }
  ],

  bosses: [
    {id:'hawk',name:'モブホーク',stage:'草原',attribute:'風',image:'boss/01.png',symbol:'鷹',special:'ホークダイブ',kind:'aoe',power:1.05,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'mira',name:'ミラモブ',stage:'砂漠',attribute:'闇',image:'boss/03.png',symbol:'毒',special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'},
    {id:'guardian',name:'モブガーディアン',stage:'田舎町',attribute:'地',image:'boss/05.png',symbol:'盾',special:'ガーディアンシールド',kind:'shield',power:0,bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'neon',name:'モブネオンバルス',stage:'ネオン街',attribute:'光',image:'boss/07.png',symbol:'光',special:'ネオンボム',kind:'singlePlusAoe',power:1.35,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'ace',name:'モブエース',stage:'ネオン街',attribute:'闇',image:'boss/08.png',symbol:'紫',special:'紫雷撃',kind:'single',power:1.65,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon',name:'モブドラゴン',stage:'マグマ',attribute:'火',image:'boss/09.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.48,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'nepu',name:'モブネプチューン',stage:'海底',attribute:'水',image:'boss/008.png',symbol:'海',special:'ネプチューン・トライデント',kind:'aoe',power:1.50,bg:'back/sea4.png',fallbackBg:'back2/07.png'},
    {id:'hawk2',name:'モブホークⅡ',stage:'草原Ⅱ',attribute:'風',image:'boss/02.png',symbol:'鷹',special:'スクリューホークダイブ',kind:'aoe',power:1.52,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'debuff',name:'モブデーバフ',stage:'部族村',attribute:'地',image:'boss/11.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.60,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'debuff2',name:'モブデーバフ第二形態',stage:'部族村',attribute:'地',image:'boss/12.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.75,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk',name:'モブバーサク',stage:'部族村',attribute:'地',image:'boss/13.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.82,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk2',name:'モブバーサク第二形態',stage:'部族村',attribute:'地',image:'boss/14.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.95,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'dendenBoss',name:'モブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/15.png',symbol:'電',special:'マシンガングミ',kind:'multi',power:.78,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'umiDenden',name:'ウミデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/16.png',symbol:'海',special:'マシンガングミ',kind:'multi',power:.88,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'moneyBoss',name:'モブマニー',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/17.png',symbol:'銭',special:'バブルネオン',kind:'healSingle',power:1.55,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'neoMaster',name:'モブネオマスター',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/18.png',symbol:'光',special:'バブルネオン',kind:'healSingle',power:1.72,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon2',name:'モブドラゴンⅡ',stage:'マグマⅡ',attribute:'火',image:'boss/10.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.72,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'gidora',name:'モブギドラ',stage:'マグマⅡ',attribute:'火',image:'boss/19.png',symbol:'龍',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.80,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'dorafara',name:'ドラファラモブ',stage:'砂漠Ⅱ',attribute:'火・闇',image:'boss/20.png',symbol:'炎',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.90,bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'},
    {id:'gladi',name:'グラディモブ',stage:'魔王城',attribute:'火',image:'boss/39.png',symbol:'将',special:'将軍進撃',kind:'doubleAoe',power:1.0,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'lilithBoss',name:'モブリリス',stage:'魔王城',attribute:'闇',image:'boss/21.png',symbol:'薔',special:'ブラックホール',kind:'aoe',power:1.85,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'maou',name:'モブ魔王',stage:'魔王城',attribute:'闇',image:'boss/22.png',symbol:'王',special:'マスター・オブ・ピラミッド',kind:'aoe',power:2.12,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'natalie',name:'モブナタリー',stage:'マトリックス',attribute:'光',image:'boss/23.png',symbol:'光',special:'ダブルエナジー',kind:'burnSingle',power:1.75,bg:'back/matrix4.png',fallbackBg:'back2/10.png'},
    {id:'smith',name:'モブスミス',stage:'マトリックス',attribute:'風',image:'boss/24.png',symbol:'眼',special:'ゴールデン・アイ',kind:'multiFixed',power:1.38,hits:[3,3],bg:'back/matrix4.png',fallbackBg:'back2/10.png'},
    {id:'unlock',name:'モブアンロック',stage:'監獄',attribute:'地',image:'boss/25.png',symbol:'鎖',special:'悪意の行進',kind:'aoe',power:2.18,bg:'back/kangoku4.png',fallbackBg:'back2/11.png'},
    {id:'yamigami',name:'モブヤミガミ',stage:'魔界',attribute:'火',image:'boss/26.png',symbol:'闇',special:'キャロット・ファイヤー',kind:'stunSingle',power:1.75,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'yamigami2',name:'モブヤミガミ第二形態',stage:'魔界',attribute:'火',image:'boss/27.png',symbol:'闇',special:'ダブル・キャロット・ファイヤー',kind:'doubleSingleStun',power:1.32,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'yamigamiDark',name:'モブヤミガミ・闇',stage:'魔界',attribute:'闇',image:'boss/28.png',symbol:'闇',special:'キャロット・バニッシュ',kind:'single',power:2.12,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enma',name:'モブ閻魔',stage:'魔界',attribute:'闇・火',image:'boss/30.png',symbol:'閻',special:'ヒノカグヅチ',kind:'single',power:2.25,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enma2',name:'モブ閻魔・第二形態',stage:'魔界',attribute:'闇・火',image:'boss/31.png',symbol:'閻',special:'レンゴクカグヅチ',kind:'aoe',power:2.18,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enmaFinal',name:'モブ閻魔・最終形態',stage:'魔界',attribute:'闇・火',image:'boss/32.png',symbol:'閻',special:'ゴウカノシンパン',kind:'aoeStun',power:2.35,bg:'back/makai4.png',fallbackBg:'back2/12.png'}
  ],

  adventure: {
    id:'grassland', name:'草原', bossId:'hawk', level:12,
    areas:[
      {name:'草原・入口',bg:'back/sougen.png',fallback:'back/sougen4.png',explore:'やわらかな風が吹いている。草むらの奥から気配を感じる。'},
      {name:'草原・小道',bg:'back/sougen2.png',fallback:'back/sougen.png',explore:'足跡を発見した！この先にモンスターがいるようだ。'},
      {name:'草原・高台',bg:'back/sougen3.png',fallback:'back/sougen.png',explore:'高台から巨大な影が飛び立った。ボスの縄張りは近い。'},
      {name:'草原・モブホークの縄張り',bg:'back/sougen4.png',fallback:'back/sougen.png',explore:'強烈な風圧！モブホークが姿を現した！'}
    ],
    normalEnemies:[
      {name:'草原モンスター',symbol:'草',attribute:'風',power:.88},
      {name:'草原の強敵',symbol:'牙',attribute:'地',power:.98},
      {name:'草原の番人',symbol:'翼',attribute:'風',power:1.06}
    ]
  }
};

// ===== MOB QUEST v25 : enemy catalog + adventure route through Magma II =====
// Source-defined levels/skills are preserved. Undefined skills use temporary elemental AI in game.js.
// Enemy stats are generated from category profiles and individual role modifiers so 1–4 enemy groups stay playable.
TEMP_BALANCE.enemyProfiles={"normal":{"hpBase":78,"hpPerLevel":38,"atkBase":16,"atkPerLevel":3.15,"magBase":15,"magPerLevel":3.0,"defBase":9,"defPerLevel":2.05,"resBase":9,"resPerLevel":2.0,"spdBase":14,"spdPerLevel":1.65},"elite":{"hpBase":330,"hpPerLevel":92,"hpPerMember":48,"atkBase":24,"atkPerLevel":3.85,"magBase":24,"magPerLevel":3.8,"defBase":16,"defPerLevel":2.65,"resBase":16,"resPerLevel":2.6,"spdBase":18,"spdPerLevel":1.85},"boss":{"hpBase":1050,"hpPerLevel":178,"hpPerMember":170,"atkBase":34,"atkPerLevel":5.0,"magBase":34,"magPerLevel":5.0,"defBase":25,"defPerLevel":3.25,"resBase":25,"resPerLevel":3.25,"spdBase":22,"spdPerLevel":2.0}};

MOB_DATA.enemyCatalog=[{"id":"g-slime","name":"モブスライム","stage":"草原","category":"normal","attribute":"水","image":"enemy/01.png","symbol":"水","levelMin":1,"levelMax":3},{"id":"g-rock","name":"モブロック","stage":"草原","category":"normal","attribute":"地","image":"enemy/02.png","symbol":"岩","levelMin":2,"levelMax":5,"mods":{"hp":1.18,"def":1.18,"spd":0.82}},{"id":"g-jouro","name":"モブジョーロ","stage":"草原","category":"normal","attribute":"水","image":"enemy/03.png","symbol":"雫","levelMin":3,"levelMax":4,"tempAi":"heal"},{"id":"g-tendevi","name":"モブテンデビ","stage":"草原","category":"normal","attribute":"水","image":"enemy/04.png","symbol":"水","levelMin":2,"levelMax":4},{"id":"g-bird","name":"モブバード","stage":"草原","category":"normal","attribute":"風","image":"enemy/05.png","symbol":"翼","levelMin":1,"levelMax":3,"mods":{"hp":0.86,"spd":1.22}},{"id":"g-piyo-green","name":"モブピヨミドリ","stage":"草原","category":"normal","attribute":"風","image":"enemy/06.png","symbol":"風","levelMin":2,"levelMax":4,"mods":{"hp":0.9,"spd":1.12}},{"id":"g-piyo-red","name":"モブピヨレッド","stage":"草原","category":"normal","attribute":"火","image":"enemy/07.png","symbol":"火","levelMin":2,"levelMax":4,"mods":{"atk":1.08}},{"id":"g-beaver","name":"モブビーバー","stage":"草原","category":"normal","attribute":"地","image":"enemy/08.png","symbol":"木","levelMin":2,"levelMax":5,"mods":{"hp":1.08,"def":1.08}},{"id":"g-savanna","name":"モブサバンナ","stage":"草原","category":"elite","attribute":"地","image":"enemy/09.png","symbol":"砂","levelMin":6,"levelMax":6,"special":"サバンナダンス","kind":"single","power":0.8,"skillElement":"地","skillType":"physical"},{"id":"g-iwakiri","name":"モブイワキリ","stage":"草原","category":"elite","attribute":"雷","image":"enemy/10.png","symbol":"雷","levelMin":7,"levelMax":7,"special":"イワキリサンダー","kind":"aoe","power":0.66,"skillElement":"雷","skillType":"magic"},{"id":"g-axe","name":"モブアックス","stage":"草原","category":"elite","attribute":"地","image":"enemy/13.png","symbol":"斧","levelMin":7,"levelMax":7,"special":"アックススクラッチ","kind":"single","power":0.8,"skillElement":"風","skillType":"physical"},{"id":"boss-hawk","name":"モブホーク","stage":"草原","category":"boss","attribute":"風","image":"boss/01.png","symbol":"鷹","levelMin":10,"levelMax":10,"bossId":"hawk","special":"ホークダイブ","kind":"aoe","power":1.05,"skillType":"physical"},{"id":"d-mummy","name":"モブミイラ","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/21.png","symbol":"包","levelMin":6,"levelMax":9,"mods":{"hp":1.08}},{"id":"d-turco","name":"モブトルコ","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/22.png","symbol":"地","levelMin":6,"levelMax":9,"mods":{"atk":1.06}},{"id":"d-yamikamen","name":"モブヤミカーメン","stage":"砂漠","category":"normal","attribute":"闇","image":"enemy/23.png","symbol":"闇","levelMin":6,"levelMax":10,"mods":{"mag":1.1}},{"id":"d-gimmick","name":"モブギミック","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/24.png","symbol":"宝","levelMin":7,"levelMax":10,"rare":true,"coinReward":10000,"mods":{"hp":0.92,"spd":1.16}},{"id":"d-adventure","name":"モブアドベンチャー","stage":"砂漠","category":"normal","attribute":"火","image":"enemy/25.png","symbol":"火","levelMin":7,"levelMax":10,"mods":{"atk":1.08}},{"id":"d-lizard","name":"モブスナトカゲ","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/26.png","symbol":"蜥","levelMin":7,"levelMax":10,"mods":{"spd":1.12}},{"id":"d-nekomummy","name":"モブネコミイラ","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/27.png","symbol":"猫","levelMin":6,"levelMax":10,"mods":{"res":1.08}},{"id":"d-akarock","name":"モブアカロック","stage":"砂漠","category":"normal","attribute":"地","image":"enemy/28.png","symbol":"岩","levelMin":7,"levelMax":10,"mods":{"hp":1.14,"def":1.14,"spd":0.85}},{"id":"d-sharty","name":"モブシャーティー","stage":"砂漠","category":"elite","attribute":"光","image":"enemy/29.png","symbol":"光","levelMin":10,"levelMax":10,"special":"リビングデッド","kind":"reviveMummy","power":0.72,"skillType":"magic"},{"id":"d-poison","name":"モブポイズン","stage":"砂漠","category":"elite","attribute":"闇","image":"enemy/30.png","symbol":"毒","levelMin":10,"levelMax":10,"special":"ポイズンクロー","kind":"poisonSingle","power":0.82,"chance":0.1,"skillType":"physical"},{"id":"d-deathhead","name":"モブデスヘッド","stage":"砂漠","category":"elite","attribute":"闇","image":"enemy/31.png","symbol":"骸","levelMin":10,"levelMax":10,"special":"デスカーテン","kind":"single","power":0.82,"skillElement":"闇","skillType":"magic"},{"id":"boss-mira","name":"ミラモブ","stage":"砂漠","category":"boss","attribute":"闇","image":"boss/03.png","symbol":"毒","levelMin":15,"levelMax":15,"bossId":"mira","special":"ミラモブポイズン","kind":"poisonSingle","power":1.35,"chance":0.5,"skillType":"physical"},{"id":"r-hitode","name":"モブヒトデヤリ","stage":"田舎町","category":"normal","attribute":"水","image":"enemy/41.png","symbol":"槍","levelMin":13,"levelMax":16,"mods":{"atk":1.08}},{"id":"r-knife","name":"モブナイフ","stage":"田舎町","category":"normal","attribute":"地","image":"enemy/42.png","symbol":"刃","levelMin":13,"levelMax":16,"mods":{"atk":1.1,"spd":1.08}},{"id":"r-purufu","name":"モブプルフ","stage":"田舎町","category":"normal","attribute":"水","image":"enemy/43.png","symbol":"水","levelMin":14,"levelMax":16,"mods":{"res":1.08}},{"id":"r-nullblue","name":"モブヌルブルー","stage":"田舎町","category":"normal","attribute":"水","image":"enemy/44.png","symbol":"水","levelMin":14,"levelMax":16,"mods":{"mag":1.08}},{"id":"r-adancer","name":"モブアダンサー","stage":"田舎町","category":"normal","attribute":"火","image":"enemy/45.png","symbol":"舞","levelMin":14,"levelMax":17,"mods":{"spd":1.1}},{"id":"r-upa","name":"モブウパルーパー","stage":"田舎町","category":"normal","attribute":"水","image":"enemy/46.png","symbol":"水","levelMin":14,"levelMax":17,"mods":{"hp":1.1}},{"id":"r-banken","name":"モブバンケン","stage":"田舎町","category":"normal","attribute":"地","image":"enemy/47.png","symbol":"犬","levelMin":14,"levelMax":17,"mods":{"hp":1.12,"def":1.08}},{"id":"r-denchi","name":"モブデンチマーク","stage":"田舎町","category":"normal","attribute":"雷","image":"enemy/48.png","symbol":"電","levelMin":14,"levelMax":17,"mods":{"mag":1.08}},{"id":"r-dancer","name":"モブダンサー","stage":"田舎町","category":"elite","attribute":"火","image":"enemy/45.png","symbol":"舞","levelMin":15,"levelMax":15,"mods":{"spd":1.1}},{"id":"r-scouter","name":"モブスカウター","stage":"田舎町","category":"elite","attribute":"光","image":"enemy/52.png","symbol":"光","levelMin":18,"levelMax":18,"special":"スカウターライト","kind":"single","power":0.8,"skillElement":"光","skillType":"magic"},{"id":"r-captain","name":"モブキャプテン","stage":"田舎町","category":"elite","attribute":"闇","image":"enemy/54.png","symbol":"船","levelMin":18,"levelMax":18,"special":"パイレーツボム","kind":"aoeStunChance","power":0.68,"chance":0.03,"skillType":"physical"},{"id":"r-dean","name":"モブディーン","stage":"田舎町","category":"elite","attribute":"雷","image":"enemy/56.png","symbol":"槍","levelMin":18,"levelMax":18,"special":"サンダースピア","kind":"single","power":0.8,"skillElement":"闇","skillType":"physical"},{"id":"boss-guardian","name":"モブガーディアン","stage":"田舎町","category":"boss","attribute":"地","image":"boss/05.png","symbol":"盾","levelMin":20,"levelMax":20,"bossId":"guardian","special":"ガーディアンシールド","kind":"shield","power":0},{"id":"n-naga","name":"モブナーガ","stage":"ネオン街","category":"normal","attribute":"光","image":"enemy/65.png","symbol":"光","levelMin":20,"levelMax":23,"mods":{"mag":1.08}},{"id":"n-lizard","name":"モブネオントカゲ","stage":"ネオン街","category":"normal","attribute":"光","image":"enemy/66.png","symbol":"蜥","levelMin":22,"levelMax":23,"mods":{"spd":1.12}},{"id":"n-kairo","name":"モブカイロ","stage":"ネオン街","category":"normal","attribute":"地","image":"enemy/67.png","symbol":"路","levelMin":21,"levelMax":23,"mods":{"def":1.1}},{"id":"n-energy","name":"モブエナジー","stage":"ネオン街","category":"normal","attribute":"光","image":"enemy/68.png","symbol":"光","levelMin":21,"levelMax":23,"mods":{"mag":1.12}},{"id":"n-slime","name":"モブネオンスライム","stage":"ネオン街","category":"normal","attribute":"光","image":"enemy/69.png","symbol":"光","levelMin":21,"levelMax":23,"mods":{"res":1.08}},{"id":"n-glass","name":"モブガラス","stage":"ネオン街","category":"normal","attribute":"闇","image":"enemy/70.png","symbol":"硝","levelMin":21,"levelMax":24,"mods":{"atk":1.1,"def":0.9}},{"id":"n-banken","name":"モブバンケン","stage":"ネオン街","category":"normal","attribute":"地","image":"enemy/78.png","symbol":"犬","levelMin":21,"levelMax":24,"mods":{"hp":1.12,"def":1.08}},{"id":"n-darknaga","name":"モブダークナーガ","stage":"ネオン街","category":"normal","attribute":"闇","image":"enemy/71.png","symbol":"闇","levelMin":22,"levelMax":23,"mods":{"mag":1.12}},{"id":"n-golem","name":"モブネオゴーレム","stage":"ネオン街","category":"elite","attribute":"光","image":"enemy/75.png","symbol":"拳","levelMin":25,"levelMax":25,"special":"パワーブーストパンチ","kind":"single","power":0.86,"skillType":"physical","mods":{"hp":1.12,"def":1.15,"spd":0.82}},{"id":"n-chaser","name":"モブエネチェイサー","stage":"ネオン街","category":"elite","attribute":"地","image":"enemy/77.png","symbol":"線","levelMin":25,"levelMax":25,"special":"ケーブルチェイス","kind":"aoe","power":0.66,"skillType":"physical"},{"id":"n-trainer","name":"モブスラトレーナー","stage":"ネオン街","category":"elite","attribute":"水","image":"enemy/80.png","symbol":"水","levelMin":26,"levelMax":26,"special":"スライムハンマー","kind":"single","power":0.84,"skillElement":"水","skillType":"physical"},{"id":"boss-neon","name":"モブネオンバルス","stage":"ネオン街","category":"boss","attribute":"光","image":"boss/07.png","symbol":"光","levelMin":28,"levelMax":28,"bossId":"neon","special":"ネオンボム","kind":"singlePlusAoe","power":1.35,"skillType":"magic"},{"id":"boss-ace","name":"モブエース","stage":"ネオン街","category":"boss","attribute":"闇","image":"boss/08.png","symbol":"紫","levelMin":38,"levelMax":38,"bossId":"ace","special":"紫雷撃（仮）","kind":"single","power":1.65,"skillType":"magic","sourceIncomplete":true},{"id":"m-honoslime","name":"モブホノスライム","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/85.png","symbol":"火","levelMin":30,"levelMax":32},{"id":"m-magrock","name":"モブマグロック","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/86.png","symbol":"岩","levelMin":33,"levelMax":35,"mods":{"hp":1.18,"def":1.18,"spd":0.82}},{"id":"m-magslime","name":"モブマグスライム","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/87.png","symbol":"火","levelMin":30,"levelMax":35},{"id":"m-hinodevi","name":"モブヒノデビ","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/88.png","symbol":"炎","levelMin":30,"levelMax":35,"mods":{"mag":1.08}},{"id":"m-lizard","name":"モブマグトカゲ","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/89.png","symbol":"蜥","levelMin":33,"levelMax":35,"mods":{"spd":1.12}},{"id":"m-heatrock","name":"モブヒートロック","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/90.png","symbol":"岩","levelMin":33,"levelMax":35,"mods":{"hp":1.16,"def":1.16,"spd":0.84}},{"id":"m-bombthrow","name":"モブボムスロー","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/91.png","symbol":"爆","levelMin":33,"levelMax":35,"tempAi":"aoe"},{"id":"m-bomber","name":"モブボマー","stage":"マグマ","category":"normal","attribute":"火","image":"enemy/92.png","symbol":"爆","levelMin":34,"levelMax":35,"tempAi":"aoe","mods":{"atk":1.08}},{"id":"m-golem","name":"モブマグゴーレム","stage":"マグマ","category":"elite","attribute":"火","image":"enemy/94.png","symbol":"拳","levelMin":36,"levelMax":36,"special":"マグマパワーパンチ","kind":"single","power":1.18,"skillType":"physical","mods":{"hp":1.12,"def":1.14,"spd":0.82}},{"id":"m-honotail","name":"モブホノテイル","stage":"マグマ","category":"elite","attribute":"火","image":"enemy/100.png","symbol":"尾","levelMin":36,"levelMax":36,"mods":{"spd":1.08}},{"id":"m-hinotabi","name":"モブヒノタビ","stage":"マグマ","category":"elite","attribute":"火","image":"enemy/99.png","symbol":"炎","levelMin":36,"levelMax":36,"special":"フレイムマジック","kind":"aoe","power":0.68,"skillElement":"火","skillType":"magic"},{"id":"m-blizzard","name":"モブブリザード","stage":"マグマ","category":"elite","attribute":"水","image":"enemy/101.png","symbol":"氷","levelMin":35,"levelMax":35,"special":"ブリザードフラッシュ","kind":"single","power":1.18,"skillElement":"水","skillType":"magic"},{"id":"m-flame","name":"モブフレイム","stage":"マグマ","category":"elite","attribute":"火","image":"enemy/102.png","symbol":"炎","levelMin":35,"levelMax":35,"special":"フレイムフラッシュ","kind":"aoe","power":0.7,"skillElement":"火","skillType":"magic"},{"id":"m-frezard","name":"モブフレザード","stage":"マグマ","category":"elite","attribute":"水・火","image":"enemy/103.png","symbol":"双","levelMin":37,"levelMax":37,"specialOptions":[{"special":"ブリザードフラッシュ","kind":"single","power":1.18,"skillElement":"水","skillType":"magic"},{"special":"フレイムフラッシュ","kind":"aoe","power":0.7,"skillElement":"火","skillType":"magic"}],"mods":{"hp":1.22,"atk":1.08,"mag":1.1}},{"id":"boss-dragon","name":"モブドラゴン","stage":"マグマ","category":"boss","attribute":"火","image":"boss/09.png","symbol":"竜","levelMin":40,"levelMax":40,"bossId":"dragon","special":"ドラゴンフレイム","kind":"aoe","power":1.48,"skillType":"magic"},{"id":"s-guard","name":"モブシーガード","stage":"海底","category":"normal","attribute":"水","image":"enemy/104.png","symbol":"盾","levelMin":37,"levelMax":40,"mods":{"def":1.1}},{"id":"s-soldier","name":"モブアビスソルジャー","stage":"海底","category":"normal","attribute":"水","image":"enemy/105.png","symbol":"兵","levelMin":38,"levelMax":40,"mods":{"atk":1.08}},{"id":"s-mist","name":"モブミスト","stage":"海底","category":"normal","attribute":"水","image":"enemy/106.png","symbol":"霧","levelMin":37,"levelMax":39,"tempAi":"debuff","mods":{"mag":1.08}},{"id":"s-nessie","name":"モブネッシー","stage":"海底","category":"normal","attribute":"水","image":"enemy/107.png","symbol":"海","levelMin":37,"levelMax":38,"mods":{"hp":1.12}},{"id":"s-jinbei","name":"モブジンベエ","stage":"海底","category":"normal","attribute":"水","image":"enemy/108.png","symbol":"鮫","levelMin":37,"levelMax":39,"mods":{"hp":1.16,"spd":0.92}},{"id":"s-doctor","name":"モブバブルドクター","stage":"海底","category":"normal","attribute":"水","image":"enemy/109.png","symbol":"医","levelMin":37,"levelMax":39,"tempAi":"heal","mods":{"mag":1.1,"res":1.1}},{"id":"s-ninja","name":"モブサメニンジャ","stage":"海底","category":"normal","attribute":"水","image":"enemy/110.png","symbol":"忍","levelMin":36,"levelMax":38,"mods":{"atk":1.08,"spd":1.18,"hp":0.92}},{"id":"s-hamon","name":"モブハモン","stage":"海底","category":"normal","attribute":"水","image":"enemy/111.png","symbol":"波","levelMin":36,"levelMax":38,"mods":{"mag":1.08}},{"id":"s-abyssknight","name":"モブアビスナイト","stage":"海底","category":"elite","attribute":"水","image":"enemy/117.png","symbol":"騎","levelMin":41,"levelMax":41,"special":"アビススクリュー","kind":"single","power":1.18,"skillElement":"水","skillType":"physical"},{"id":"s-marine","name":"モブマリン","stage":"海底","category":"elite","attribute":"水","image":"enemy/116.png","symbol":"海","levelMin":42,"levelMax":42,"mods":{"atk":1.06,"spd":1.06}},{"id":"s-jones","name":"モブジョーンズ","stage":"海底","category":"elite","attribute":"水","image":"enemy/118.png","symbol":"波","levelMin":43,"levelMax":43,"special":"ウェーブショック","kind":"aoe","power":0.68,"skillElement":"水","skillType":"magic"},{"id":"s-sorcerer","name":"モブソーサラー","stage":"海底","category":"elite","attribute":"雷","image":"enemy/113.png","symbol":"術","levelMin":45,"levelMax":45,"special":"ミストラル","kind":"single","power":1.18,"skillElement":"水","skillType":"magic"},{"id":"s-uminight","name":"モブウミナイト","stage":"海底","category":"elite","attribute":"水","image":"enemy/19.png","symbol":"騎","levelMin":43,"levelMax":43,"special":"ウォータースパイラル","kind":"single","power":0.84,"skillElement":"水","skillType":"physical"},{"id":"s-wave","name":"モブウェイブ","stage":"海底","category":"elite","attribute":"水","image":"enemy/120.png","symbol":"波","levelMin":45,"levelMax":45,"special":"ウォーターグラビディ","kind":"single","power":1.18,"skillElement":"水","skillType":"magic"},{"id":"boss-nepu","name":"モブネプチューン","stage":"海底","category":"boss","attribute":"水","image":"boss/008.png","symbol":"海","levelMin":55,"levelMax":55,"bossId":"nepu","special":"ネプチューン・トライデント","kind":"aoe","power":1.5,"skillElement":"水","skillType":"physical"},{"name":"モブスライム","category":"normal","attribute":"水","image":"enemy/01.png","symbol":"水","id":"g2-slime","stage":"草原Ⅱ","levelMin":43,"levelMax":45},{"name":"モブロック","category":"normal","attribute":"地","image":"enemy/02.png","symbol":"岩","mods":{"hp":1.18,"def":1.18,"spd":0.82},"id":"g2-rock","stage":"草原Ⅱ","levelMin":43,"levelMax":47},{"name":"モブジョーロ","category":"normal","attribute":"水","image":"enemy/03.png","symbol":"雫","tempAi":"heal","id":"g2-jouro","stage":"草原Ⅱ","levelMin":43,"levelMax":45},{"name":"モブテンデビ","category":"normal","attribute":"水","image":"enemy/04.png","symbol":"水","id":"g2-tendevi","stage":"草原Ⅱ","levelMin":43,"levelMax":47},{"name":"モブバード","category":"normal","attribute":"風","image":"enemy/05.png","symbol":"翼","mods":{"hp":0.86,"spd":1.22},"id":"g2-bird","stage":"草原Ⅱ","levelMin":43,"levelMax":46},{"name":"モブピヨミドリ","category":"normal","attribute":"風","image":"enemy/06.png","symbol":"風","mods":{"hp":0.9,"spd":1.12},"id":"g2-piyo-green","stage":"草原Ⅱ","levelMin":43,"levelMax":45},{"name":"モブピヨレッド","category":"normal","attribute":"火","image":"enemy/07.png","symbol":"火","mods":{"atk":1.08},"id":"g2-piyo-red","stage":"草原Ⅱ","levelMin":43,"levelMax":45},{"name":"モブビーバー","category":"normal","attribute":"地","image":"enemy/08.png","symbol":"木","mods":{"hp":1.08,"def":1.08},"id":"g2-beaver","stage":"草原Ⅱ","levelMin":43,"levelMax":45},{"id":"g2-savanna","name":"モブサバンナ","stage":"草原Ⅱ","category":"normal","attribute":"地","image":"enemy/09.png","symbol":"砂","levelMin":45,"levelMax":45,"special":"サバンナダンス","kind":"single","power":0.8,"skillElement":"地","skillType":"physical","mods":{"atk":1.05}},{"id":"g2-iwakiri","name":"モブイワキリ","stage":"草原Ⅱ","category":"normal","attribute":"雷","image":"enemy/10.png","symbol":"雷","levelMin":45,"levelMax":45,"special":"イワキリサンダー","kind":"aoe","power":0.62,"skillElement":"雷","skillType":"magic"},{"id":"g2-axe","name":"モブアックス","stage":"草原Ⅱ","category":"normal","attribute":"地","image":"enemy/13.png","symbol":"斧","levelMin":45,"levelMax":45,"special":"アックススクラッチ","kind":"single","power":0.8,"skillElement":"風","skillType":"physical"},{"id":"g2-inori","name":"モブイノリ","stage":"草原Ⅱ","category":"normal","attribute":"地","image":"enemy/11.png","symbol":"祈","levelMin":45,"levelMax":45,"tempAi":"heal","mods":{"res":1.1}},{"id":"g2-tsuru","name":"モブツルガンナー","stage":"草原Ⅱ","category":"elite","attribute":"風","image":"enemy/14.png","symbol":"銃","levelMin":49,"levelMax":49,"special":"シードスナイパー","kind":"single","power":0.82,"skillElement":"風","skillType":"physical","mods":{"spd":1.12}},{"id":"g2-merakero","name":"モブメラケロ","stage":"草原Ⅱ","category":"elite","attribute":"火","image":"enemy/16.png","symbol":"蛙","levelMin":52,"levelMax":52,"special":"ケロケロファイア","kind":"single","power":1.18,"skillElement":"火","skillType":"magic","mods":{"mag":1.08}},{"id":"g2-tsunoleon","name":"モブツノレオン","stage":"草原Ⅱ","category":"elite","attribute":"水","image":"enemy/19.png","symbol":"角","levelMin":50,"levelMax":50,"special":"ウォーターホーン（仮）","kind":"single","power":0.95,"skillElement":"水","skillType":"physical","mods":{"def":1.08}},{"id":"g2-keroking","name":"モブケロキング","stage":"草原Ⅱ","category":"elite","attribute":"水","image":"enemy/20.png","symbol":"王","levelMin":55,"levelMax":55,"special":"シードスナイパー","kind":"single","power":0.82,"skillElement":"風","skillType":"physical","mods":{"hp":1.1}},{"id":"boss-hawk2","name":"モブホークⅡ","stage":"草原Ⅱ","category":"boss","attribute":"風","image":"boss/02.png","symbol":"鷹","levelMin":60,"levelMax":60,"bossId":"hawk2","special":"スクリューホークダイブ","kind":"aoe","power":1.52,"skillType":"physical"},{"id":"t-ohno","name":"モブオーノ","stage":"部族村","category":"normal","attribute":"地","image":"enemy/121.png","symbol":"斧","levelMin":55,"levelMax":55,"special":"ビッグアックス","kind":"single","power":0.78,"skillElement":"地","skillType":"physical","mods":{"atk":1.1}},{"id":"t-jukon","name":"モブジュコン","stage":"部族村","category":"normal","attribute":"闇","image":"enemy/122.png","symbol":"骸","levelMin":55,"levelMax":55,"special":"ミズドクロ","kind":"aoe","power":0.58,"skillElement":"水","skillType":"magic","mods":{"mag":1.1}},{"id":"t-warrior","name":"モブウォリアー","stage":"部族村","category":"normal","attribute":"地","image":"enemy/123.png","symbol":"戦","levelMin":55,"levelMax":55,"special":"カッチンドラム","kind":"single","power":0.78,"skillElement":"地","skillType":"physical","mods":{"hp":1.1,"def":1.08}},{"id":"t-kiba","name":"モブキバ","stage":"部族村","category":"normal","attribute":"地","image":"enemy/124.png","symbol":"牙","levelMin":55,"levelMax":55,"special":"ツインバイト","kind":"single","power":0.8,"skillElement":"地","skillType":"physical","mods":{"spd":1.08}},{"id":"t-kukuri","name":"モブククリ","stage":"部族村","category":"elite","attribute":"風","image":"enemy/125.png","symbol":"輪","levelMin":57,"levelMax":57,"special":"モリカリブーメラン","kind":"aoe","power":0.66,"skillElement":"風","skillType":"physical","mods":{"spd":1.1}},{"id":"t-tough","name":"モブタフネス","stage":"部族村","category":"elite","attribute":"地","image":"enemy/126.png","symbol":"剛","levelMin":57,"levelMax":57,"special":"パワーコントロール","kind":"single","power":1.16,"skillElement":"地","skillType":"physical","mods":{"hp":1.16,"def":1.12,"spd":0.88}},{"id":"t-hisui","name":"モブヒスイ","stage":"部族村","category":"elite","attribute":"闇","image":"enemy/127.png","symbol":"翡","levelMin":57,"levelMax":57,"special":"ヒスイミントミスト","kind":"aoe","power":0.68,"skillElement":"闇","skillType":"magic","mods":{"mag":1.1}},{"id":"t-ryugo","name":"モブリュウゴウ","stage":"部族村","category":"elite","attribute":"火","image":"enemy/128.png","symbol":"竜","levelMin":57,"levelMax":57,"special":"リュウノボリ","kind":"single","power":1.18,"skillElement":"火","skillType":"physical","mods":{"atk":1.08}},{"id":"boss-debuff","name":"モブデーバフ","stage":"部族村","category":"boss","attribute":"地","image":"boss/11.png","symbol":"岩","levelMin":60,"levelMax":60,"bossId":"debuff","special":"デストロイボム","kind":"single","power":1.6,"skillType":"physical"},{"id":"boss-debuff2","name":"モブデーバフ第二形態","stage":"部族村","category":"boss","attribute":"地","image":"boss/12.png","symbol":"岩","levelMin":65,"levelMax":65,"bossId":"debuff2","special":"デストロイボム","kind":"single","power":1.75,"skillType":"physical","mods":{"hp":1.08,"atk":1.06}},{"id":"boss-berserk","name":"モブバーサク","stage":"部族村","category":"boss","attribute":"地","image":"boss/13.png","symbol":"獣","levelMin":60,"levelMax":60,"bossId":"berserk","special":"デストロイボム","kind":"single","power":1.72,"skillType":"physical","mods":{"atk":1.1,"spd":1.05}},{"id":"boss-berserk2","name":"モブバーサク第二形態","stage":"部族村","category":"boss","attribute":"地","image":"boss/14.png","symbol":"獣","levelMin":65,"levelMax":65,"bossId":"berserk2","special":"デストロイボム","kind":"single","power":1.9,"skillType":"physical","mods":{"hp":1.08,"atk":1.12}},{"name":"モブヒトデヤリ","category":"normal","attribute":"水","image":"enemy/41.png","symbol":"槍","mods":{"atk":1.08},"id":"r2-hitode","stage":"田舎町Ⅱ","levelMin":53,"levelMax":56},{"name":"モブナイフ","category":"normal","attribute":"地","image":"enemy/42.png","symbol":"刃","mods":{"atk":1.1,"spd":1.08},"id":"r2-knife","stage":"田舎町Ⅱ","levelMin":53,"levelMax":56},{"name":"モブプルフ","category":"normal","attribute":"水","image":"enemy/43.png","symbol":"水","mods":{"res":1.08},"id":"r2-purufu","stage":"田舎町Ⅱ","levelMin":54,"levelMax":56},{"name":"モブヌルブルー","category":"normal","attribute":"水","image":"enemy/44.png","symbol":"水","mods":{"mag":1.08},"id":"r2-nullblue","stage":"田舎町Ⅱ","levelMin":54,"levelMax":56},{"name":"モブアダンサー","category":"normal","attribute":"火","image":"enemy/45.png","symbol":"舞","mods":{"spd":1.1},"id":"r2-adancer","stage":"田舎町Ⅱ","levelMin":54,"levelMax":57},{"name":"モブウパルーパー","category":"normal","attribute":"水","image":"enemy/46.png","symbol":"水","mods":{"hp":1.1},"id":"r2-upa","stage":"田舎町Ⅱ","levelMin":54,"levelMax":57},{"name":"モブバンケン","category":"normal","attribute":"地","image":"enemy/47.png","symbol":"犬","mods":{"hp":1.12,"def":1.08},"id":"r2-banken","stage":"田舎町Ⅱ","levelMin":54,"levelMax":57},{"name":"モブデンチマーク","category":"normal","attribute":"雷","image":"enemy/48.png","symbol":"電","mods":{"mag":1.08},"id":"r2-denchi","stage":"田舎町Ⅱ","levelMin":54,"levelMax":57},{"id":"r2-scouter","name":"モブスカウター","stage":"田舎町Ⅱ","category":"normal","attribute":"光","image":"enemy/52.png","symbol":"光","levelMin":58,"levelMax":58,"special":"スカウターライト","kind":"single","power":0.78,"skillElement":"光","skillType":"magic"},{"id":"r2-captain","name":"モブキャプテン","stage":"田舎町Ⅱ","category":"normal","attribute":"闇","image":"enemy/54.png","symbol":"船","levelMin":58,"levelMax":58,"special":"パイレーツボム","kind":"aoeStunChance","power":0.58,"chance":0.03,"skillType":"physical"},{"id":"r2-dean","name":"モブディーン","stage":"田舎町Ⅱ","category":"normal","attribute":"雷","image":"enemy/56.png","symbol":"槍","levelMin":58,"levelMax":58,"special":"サンダースピア","kind":"single","power":0.78,"skillElement":"闇","skillType":"physical"},{"id":"r2-violin","name":"モブバイオリン","stage":"田舎町Ⅱ","category":"elite","attribute":"闇","image":"enemy/55.png","symbol":"音","levelMin":62,"levelMax":62,"special":"ココロノスキマ","kind":"single","power":1.18,"skillElement":"闇","skillType":"magic","mods":{"mag":1.1}},{"id":"r2-rapty","name":"モブラプチー","stage":"田舎町Ⅱ","category":"elite","attribute":"水","image":"enemy/57.png","symbol":"竜","levelMin":62,"levelMax":62,"special":"ジュラシックヤベージャンズ","kind":"single","power":1.2,"skillElement":"水・火","skillType":"physical","mods":{"spd":1.08}},{"id":"r2-tira","name":"モブティラ","stage":"田舎町Ⅱ","category":"elite","attribute":"火","image":"enemy/58.png","symbol":"竜","levelMin":62,"levelMax":62,"special":"ジュラシックヤベージャンズ","kind":"single","power":1.2,"skillElement":"火・水","skillType":"physical","mods":{"atk":1.1,"hp":1.08}},{"id":"r2-kuukai","name":"モブクウカイ","stage":"田舎町Ⅱ","category":"elite","attribute":"闇","image":"enemy/59.png","symbol":"山","levelMin":65,"levelMax":65,"special":"ヤマノタマシイ","kind":"single","power":1.18,"skillElement":"火","skillType":"magic","mods":{"mag":1.08}},{"id":"r2-akui","name":"モブアクイ","stage":"田舎町Ⅱ","category":"elite","attribute":"闇","image":"enemy/60.png","symbol":"悪","levelMin":63,"levelMax":63,"tempAi":"debuff","mods":{"mag":1.08}},{"id":"r2-shitsui","name":"モブシツイ","stage":"田舎町Ⅱ","category":"elite","attribute":"闇","image":"enemy/61.png","symbol":"失","levelMin":63,"levelMax":63,"tempAi":"debuff","mods":{"res":1.08}},{"id":"r2-yamai","name":"モブヤマイ","stage":"田舎町Ⅱ","category":"elite","attribute":"闇","image":"enemy/62.png","symbol":"病","levelMin":63,"levelMax":63,"tempAi":"debuff","mods":{"hp":1.08}},{"id":"boss-umidenden","name":"ウミデンデン","stage":"田舎町Ⅱ","category":"boss","attribute":"雷","image":"boss/16.png","symbol":"海","levelMin":68,"levelMax":68,"bossId":"umiDenden","special":"マシンガングミ","kind":"multi","power":0.88,"hits":[3,6],"skillElement":"雷","skillType":"physical"},{"name":"モブナーガ","category":"normal","attribute":"光","image":"enemy/65.png","symbol":"光","mods":{"mag":1.08},"id":"n2-naga","stage":"ネオン街Ⅱ","levelMin":60,"levelMax":63},{"name":"モブネオントカゲ","category":"normal","attribute":"光","image":"enemy/66.png","symbol":"蜥","mods":{"spd":1.12},"id":"n2-lizard","stage":"ネオン街Ⅱ","levelMin":62,"levelMax":63},{"name":"モブカイロ","category":"normal","attribute":"地","image":"enemy/67.png","symbol":"路","mods":{"def":1.1},"id":"n2-kairo","stage":"ネオン街Ⅱ","levelMin":61,"levelMax":63},{"name":"モブエナジー","category":"normal","attribute":"光","image":"enemy/68.png","symbol":"光","mods":{"mag":1.12},"id":"n2-energy","stage":"ネオン街Ⅱ","levelMin":61,"levelMax":63},{"name":"モブネオンスライム","category":"normal","attribute":"光","image":"enemy/69.png","symbol":"光","mods":{"res":1.08},"id":"n2-slime","stage":"ネオン街Ⅱ","levelMin":61,"levelMax":63},{"name":"モブガラス","category":"normal","attribute":"闇","image":"enemy/70.png","symbol":"硝","mods":{"atk":1.1,"def":0.9},"id":"n2-glass","stage":"ネオン街Ⅱ","levelMin":61,"levelMax":64},{"name":"モブバンケン","category":"normal","attribute":"地","image":"enemy/78.png","symbol":"犬","mods":{"hp":1.12,"def":1.08},"id":"n2-banken","stage":"ネオン街Ⅱ","levelMin":61,"levelMax":64},{"name":"モブダークナーガ","category":"normal","attribute":"闇","image":"enemy/71.png","symbol":"闇","mods":{"mag":1.12},"id":"n2-darknaga","stage":"ネオン街Ⅱ","levelMin":62,"levelMax":63},{"id":"n2-golem","name":"モブネオゴーレム","stage":"ネオン街Ⅱ","category":"normal","attribute":"光","image":"enemy/75.png","symbol":"拳","levelMin":65,"levelMax":65,"special":"パワーブーストパンチ","kind":"single","power":0.82,"skillType":"physical","mods":{"hp":1.12,"def":1.15,"spd":0.82}},{"id":"n2-chaser","name":"モブエネチェイサー","stage":"ネオン街Ⅱ","category":"normal","attribute":"地","image":"enemy/77.png","symbol":"線","levelMin":65,"levelMax":65,"special":"ケーブルチェイス","kind":"aoe","power":0.58,"skillType":"physical"},{"id":"n2-trainer","name":"モブスラトレーナー","stage":"ネオン街Ⅱ","category":"normal","attribute":"水","image":"enemy/80.png","symbol":"水","levelMin":65,"levelMax":65,"special":"スライムハンマー","kind":"single","power":0.8,"skillElement":"水","skillType":"physical"},{"id":"n2-tiger","name":"モブネオタイガー","stage":"ネオン街Ⅱ","category":"elite","attribute":"地","image":"enemy/76.png","symbol":"虎","levelMin":67,"levelMax":67,"special":"タイガーネットワーク","kind":"single","power":1.18,"skillElement":"地","skillType":"physical","mods":{"atk":1.08,"spd":1.08}},{"id":"n2-tama","name":"モブネオタマ","stage":"ネオン街Ⅱ","category":"elite","attribute":"地","image":"enemy/73.png","symbol":"玉","levelMin":66,"levelMax":66,"special":"セキュリティダッシュ","kind":"single","power":1.18,"skillElement":"地","skillType":"physical","mods":{"spd":1.12}},{"id":"n2-kodora","name":"モブネオコドラ","stage":"ネオン街Ⅱ","category":"elite","attribute":"火","image":"enemy/79.png","symbol":"竜","levelMin":66,"levelMax":66,"special":"ネオンフレイム","kind":"aoe","power":0.68,"skillElement":"火","skillType":"magic","mods":{"mag":1.1}},{"id":"n2-palette","name":"モブパレットレオン","stage":"ネオン街Ⅱ","category":"elite","attribute":"光","image":"enemy/82.png","symbol":"彩","levelMin":68,"levelMax":68,"special":"レインボーロード","kind":"single","power":1.2,"skillElement":"光","skillType":"magic","mods":{"mag":1.1,"res":1.08}},{"id":"boss-neomaster","name":"モブネオマスター","stage":"ネオン街Ⅱ","category":"boss","attribute":"光","image":"boss/18.png","symbol":"光","levelMin":70,"levelMax":70,"bossId":"neoMaster","special":"バブルネオン","kind":"healSingle","power":1.72,"skillType":"magic"},{"name":"モブホノスライム","category":"normal","attribute":"火","image":"enemy/85.png","symbol":"火","id":"m2-honoslime","stage":"マグマⅡ","levelMin":60,"levelMax":62},{"name":"モブマグロック","category":"normal","attribute":"火","image":"enemy/86.png","symbol":"岩","mods":{"hp":1.18,"def":1.18,"spd":0.82},"id":"m2-magrock","stage":"マグマⅡ","levelMin":63,"levelMax":65},{"name":"モブマグスライム","category":"normal","attribute":"火","image":"enemy/87.png","symbol":"火","id":"m2-magslime","stage":"マグマⅡ","levelMin":60,"levelMax":65},{"name":"モブヒノデビ","category":"normal","attribute":"火","image":"enemy/88.png","symbol":"炎","mods":{"mag":1.08},"id":"m2-hinodevi","stage":"マグマⅡ","levelMin":60,"levelMax":65},{"name":"モブマグトカゲ","category":"normal","attribute":"火","image":"enemy/89.png","symbol":"蜥","mods":{"spd":1.12},"id":"m2-lizard","stage":"マグマⅡ","levelMin":63,"levelMax":65},{"name":"モブヒートロック","category":"normal","attribute":"火","image":"enemy/90.png","symbol":"岩","mods":{"hp":1.16,"def":1.16,"spd":0.84},"id":"m2-heatrock","stage":"マグマⅡ","levelMin":63,"levelMax":65},{"name":"モブボムスロー","category":"normal","attribute":"火","image":"enemy/91.png","symbol":"爆","tempAi":"aoe","id":"m2-bombthrow","stage":"マグマⅡ","levelMin":63,"levelMax":65},{"name":"モブボマー","category":"normal","attribute":"火","image":"enemy/92.png","symbol":"爆","tempAi":"aoe","mods":{"atk":1.08},"id":"m2-bomber","stage":"マグマⅡ","levelMin":64,"levelMax":65},{"id":"m2-golem","name":"モブマグゴーレム","stage":"マグマⅡ","category":"normal","attribute":"火","image":"enemy/94.png","symbol":"拳","levelMin":66,"levelMax":66,"special":"マグマパワーパンチ","kind":"single","power":0.88,"skillType":"physical","mods":{"hp":1.12,"def":1.14,"spd":0.82}},{"id":"m2-honotail","name":"モブホノテイル","stage":"マグマⅡ","category":"normal","attribute":"火","image":"enemy/100.png","symbol":"尾","levelMin":66,"levelMax":66,"mods":{"spd":1.08}},{"id":"m2-hinotabi","name":"モブヒノタビ","stage":"マグマⅡ","category":"normal","attribute":"火","image":"enemy/99.png","symbol":"炎","levelMin":66,"levelMax":66,"special":"フレイムマジック","kind":"aoe","power":0.58,"skillElement":"火","skillType":"magic"},{"id":"m2-blizzard","name":"モブブリザード","stage":"マグマⅡ","category":"normal","attribute":"水","image":"enemy/101.png","symbol":"氷","levelMin":65,"levelMax":65,"special":"ブリザードフラッシュ","kind":"single","power":0.88,"skillElement":"水","skillType":"magic"},{"id":"m2-flame","name":"モブフレイム","stage":"マグマⅡ","category":"normal","attribute":"火","image":"enemy/102.png","symbol":"炎","levelMin":65,"levelMax":65,"special":"フレイムフラッシュ","kind":"aoe","power":0.58,"skillElement":"火","skillType":"magic"},{"id":"m2-yogan","name":"モブヨーガン","stage":"マグマⅡ","category":"elite","attribute":"火","image":"enemy/93.png","symbol":"溶","levelMin":68,"levelMax":68,"special":"マグポヨ～","kind":"aoeAtkDown","power":0.68,"debuff":0.05,"skillElement":"火","skillType":"magic","mods":{"mag":1.08}},{"id":"m2-salamander","name":"モブサラマンダー","stage":"マグマⅡ","category":"elite","attribute":"火","image":"enemy/95.png","symbol":"炎","levelMin":68,"levelMax":68,"special":"サラマンドラ","kind":"single","power":1.2,"skillElement":"火","skillType":"magic","mods":{"atk":1.08,"mag":1.08}},{"id":"m2-buster","name":"モブマグバスター","stage":"マグマⅡ","category":"elite","attribute":"火","image":"enemy/98.png","symbol":"砲","levelMin":68,"levelMax":68,"special":"マグマバスター","kind":"single","power":1.22,"skillElement":"火","skillType":"physical","mods":{"atk":1.12}},{"id":"boss-dragon2","name":"モブドラゴンⅡ","stage":"マグマⅡ","category":"boss","attribute":"火","image":"boss/10.png","symbol":"竜","levelMin":70,"levelMax":70,"bossId":"dragon2","special":"ドラゴンフレイム","kind":"aoe","power":1.72,"skillType":"magic"},{"id":"boss-gidora","name":"モブギドラ","stage":"マグマⅡ","category":"boss","attribute":"火","image":"boss/19.png","symbol":"龍","levelMin":75,"levelMax":75,"bossId":"gidora","special":"フル・ドラゴンフレイム","kind":"buffAoe","power":1.8,"skillElement":"火・闇","skillType":"magic","mods":{"hp":1.12,"atk":1.08,"mag":1.12}}];

MOB_DATA.adventureWorlds=[{"id":"grassland","name":"草原","fieldFallback":"back2/02.png","normalIds":["g-slime","g-rock","g-jouro","g-tendevi","g-bird","g-piyo-green","g-piyo-red","g-beaver"],"areas":[{"name":"AREA 1","bg":"back/sougen.png","boss":[{"id":"g-beaver","level":4,"qty":2},{"id":"g-savanna","level":6}]},{"name":"AREA 2","bg":"back/sougen2.png","boss":[{"id":"g-iwakiri","level":7}]},{"name":"AREA 3","bg":"back/sougen3.png","boss":[{"id":"g-axe","level":7}]},{"name":"AREA 4","bg":"back/sougen4.png","boss":[{"id":"boss-hawk","level":10}]}]},{"id":"desert","name":"砂漠","fieldFallback":"back2/03.png","normalIds":["d-mummy","d-turco","d-yamikamen","d-gimmick","d-adventure","d-lizard","d-nekomummy","d-akarock"],"areas":[{"name":"AREA 1","bg":"back/sabaku.png","boss":[{"id":"d-mummy","level":7,"qty":2},{"id":"d-sharty","level":10}]},{"name":"AREA 2","bg":"back/sabaku2.png","boss":[{"id":"d-poison","level":10}]},{"name":"AREA 3","bg":"back/sabaku3.png","boss":[{"id":"d-deathhead","level":10}]},{"name":"AREA 4","bg":"back/sabaku4.png","boss":[{"id":"boss-mira","level":15}]}]},{"id":"rural","name":"田舎町","fieldFallback":"back2/04.png","normalIds":["r-hitode","r-knife","r-purufu","r-nullblue","r-adancer","r-upa","r-banken","r-denchi"],"areas":[{"name":"AREA 1","bg":"back/inaka.png","boss":[{"id":"r-dancer","level":15,"qty":2},{"id":"r-scouter","level":18}]},{"name":"AREA 2","bg":"back/inaka2.png","boss":[{"id":"r-captain","level":18}]},{"name":"AREA 3","bg":"back/inaka3.png","boss":[{"id":"r-dean","level":18}]},{"name":"AREA 4","bg":"back/inaka4.png","boss":[{"id":"boss-guardian","level":20}]}]},{"id":"neon","name":"ネオン街","fieldFallback":"back2/05.png","normalIds":["n-naga","n-lizard","n-kairo","n-energy","n-slime","n-glass","n-banken","n-darknaga"],"areas":[{"name":"AREA 1","bg":"back/neon.png","boss":[{"id":"n-naga","level":22,"qty":2},{"id":"n-golem","level":25}]},{"name":"AREA 2","bg":"back/neon2.png","boss":[{"id":"n-chaser","level":25}]},{"name":"AREA 3","bg":"back/neon3.png","boss":[{"id":"n-trainer","level":26}]},{"name":"AREA 4","bg":"back/neon4.png","boss":[{"id":"boss-neon","level":28}]}]},{"id":"magma","name":"マグマ","fieldFallback":"back2/06.png","normalIds":["m-honoslime","m-magrock","m-magslime","m-hinodevi","m-lizard","m-heatrock","m-bombthrow","m-bomber"],"areas":[{"name":"AREA 1","bg":"back/magma.png","boss":[{"id":"m-lizard","level":35,"qty":2},{"id":"m-golem","level":36}]},{"name":"AREA 2","bg":"back/magma2.png","boss":[{"id":"m-honotail","level":36},{"id":"m-hinotabi","level":36}]},{"name":"AREA 3","bg":"back/magma3.png","boss":[{"id":"m-blizzard","level":35},{"id":"m-flame","level":35}],"nextWave":[{"id":"m-frezard","level":37}]},{"name":"AREA 4","bg":"back/magma4.png","boss":[{"id":"boss-dragon","level":40}]}]},{"id":"sea","name":"海底","fieldFallback":"back2/07.png","normalIds":["s-guard","s-soldier","s-mist","s-nessie","s-jinbei","s-doctor","s-ninja","s-hamon"],"areas":[{"name":"AREA 1","bg":"back/sea.png","boss":[{"id":"s-soldier","level":38,"qty":2},{"id":"s-abyssknight","level":41}]},{"name":"AREA 2","bg":"back/sea2.png","boss":[{"id":"s-marine","level":42},{"id":"s-jones","level":43}]},{"name":"AREA 3","bg":"back/sea3.png","boss":[{"id":"s-sorcerer","level":45},{"id":"s-uminight","level":43},{"id":"s-wave","level":45}]},{"name":"AREA 4","bg":"back/sea4.png","boss":[{"id":"boss-nepu","level":55}]}]},{"id":"grassland2","name":"草原Ⅱ","fieldFallback":"back2/02.png","normalIds":["g2-slime","g2-rock","g2-jouro","g2-tendevi","g2-bird","g2-piyo-green","g2-piyo-red","g2-beaver","g2-savanna","g2-iwakiri","g2-axe","g2-inori"],"areas":[{"name":"AREA 1","bg":"back/sougen.png","boss":[{"id":"g2-tsuru","level":49}]},{"name":"AREA 2","bg":"back/sougen2.png","boss":[{"id":"g2-merakero","level":52}]},{"name":"AREA 3","bg":"back/sougen3.png","boss":[{"id":"g2-tsunoleon","level":50},{"id":"g2-keroking","level":55}]},{"name":"AREA 4","bg":"back/sougen4.png","boss":[{"id":"g2-savanna","level":56,"qty":2},{"id":"boss-hawk2","level":60}]}]},{"id":"tribe","name":"部族村","fieldFallback":"back2/08.png","normalIds":["t-ohno","t-jukon","t-warrior","t-kiba"],"areas":[{"name":"AREA 1","bg":"back/buzok4.png","boss":[{"id":"t-kukuri","level":57}]},{"name":"AREA 2","bg":"back/buzok4.png","boss":[{"id":"t-tough","level":57}]},{"name":"AREA 3","bg":"back/buzok4.png","boss":[{"id":"t-hisui","level":57},{"id":"t-ryugo","level":57}]},{"name":"AREA 4","bg":"back/buzok4.png","boss":[{"id":"boss-debuff","level":60},{"id":"boss-berserk","level":60}],"nextWave":[{"id":"boss-debuff2","level":65},{"id":"boss-berserk2","level":65}]}]},{"id":"rural2","name":"田舎町Ⅱ","fieldFallback":"back2/04.png","normalIds":["r2-hitode","r2-knife","r2-purufu","r2-nullblue","r2-adancer","r2-upa","r2-banken","r2-denchi","r2-scouter","r2-captain","r2-dean"],"areas":[{"name":"AREA 1","bg":"back/inaka.png","boss":[{"id":"r2-violin","level":62}]},{"name":"AREA 2","bg":"back/inaka2.png","boss":[{"id":"r2-rapty","level":62},{"id":"r2-tira","level":62}]},{"name":"AREA 3","bg":"back/inaka3.png","boss":[{"id":"r2-kuukai","level":65},{"id":"r2-akui","level":63},{"id":"r2-shitsui","level":63},{"id":"r2-yamai","level":63}]},{"name":"AREA 4","bg":"back/inaka4.png","boss":[{"id":"boss-umidenden","level":68}]}]},{"id":"neon2","name":"ネオン街Ⅱ","fieldFallback":"back2/05.png","normalIds":["n2-naga","n2-lizard","n2-kairo","n2-energy","n2-slime","n2-glass","n2-banken","n2-darknaga","n2-golem","n2-chaser","n2-trainer"],"areas":[{"name":"AREA 1","bg":"back/neon.png","boss":[{"id":"n2-tiger","level":67}]},{"name":"AREA 2","bg":"back/neon2.png","boss":[{"id":"n2-tama","level":66},{"id":"n2-kodora","level":66}]},{"name":"AREA 3","bg":"back/neon3.png","boss":[{"id":"n2-banken","level":66},{"id":"n2-golem","level":66},{"id":"n2-palette","level":68}]},{"name":"AREA 4","bg":"back/neon4.png","boss":[{"id":"boss-neomaster","level":70}]}]},{"id":"magma2","name":"マグマⅡ","fieldFallback":"back2/06.png","normalIds":["m2-honoslime","m2-magrock","m2-magslime","m2-hinodevi","m2-lizard","m2-heatrock","m2-bombthrow","m2-bomber","m2-golem","m2-honotail","m2-hinotabi","m2-blizzard","m2-flame"],"areas":[{"name":"AREA 1","bg":"back/magma.png","boss":[{"id":"m2-heatrock","level":65,"qty":2},{"id":"m2-yogan","level":68}]},{"name":"AREA 2","bg":"back/magma2.png","boss":[{"id":"m2-golem","level":65,"qty":2},{"id":"m2-salamander","level":68}]},{"name":"AREA 3","bg":"back/magma3.png","boss":[{"id":"m2-bomber","level":65,"qty":2},{"id":"m2-buster","level":68}]},{"name":"AREA 4","bg":"back/magma4.png","boss":[{"id":"boss-dragon2","level":70}],"nextWave":[{"id":"boss-gidora","level":75}]}]}];


// ===== MOB QUEST v25 : progression through Demon King's Castle + fixed combat balance =====
// Player base stats are equipment-free targets. Equipment/growth systems can later raise every stat toward MAX.
TEMP_BALANCE.playerTargets={
  yusha:{hp:[180,1200,1480],mp:[55,280,340],atk:[70,950,999],mag:[70,930,990],def:[55,650,740],res:[55,640,730],spd:[45,360,410]},
  pink:{hp:[190,1240,1500],mp:[58,300,360],atk:[60,880,940],mag:[62,880,940],def:[65,720,810],res:[65,710,800],spd:[38,320,370]},
  desert:{hp:[190,1280,1500],mp:[45,235,285],atk:[75,999,999],mag:[52,820,900],def:[58,670,760],res:[45,590,680],spd:[40,325,375]},
  nyoro:{hp:[170,1140,1420],mp:[48,250,305],atk:[72,970,999],mag:[63,900,970],def:[45,560,650],res:[45,570,660],spd:[50,400,455]},
  nekoku:{hp:[190,1250,1500],mp:[48,250,305],atk:[72,960,999],mag:[55,850,930],def:[60,690,780],res:[50,610,700],spd:[45,350,400]},
  jessie:{hp:[165,1100,1380],mp:[54,290,350],atk:[68,910,980],mag:[72,950,999],def:[44,550,640],res:[52,620,710],spd:[55,440,500]},
  denden:{hp:[180,1180,1450],mp:[50,270,325],atk:[74,985,999],mag:[60,880,950],def:[52,620,710],res:[50,600,690],spd:[50,390,445]},
  money:{hp:[160,1080,1360],mp:[65,330,395],atk:[55,840,920],mag:[78,999,999],def:[42,540,630],res:[68,740,830],spd:[40,330,380]},
  riro:{hp:[175,1160,1430],mp:[55,290,350],atk:[67,900,970],mag:[65,900,970],def:[50,590,680],res:[60,670,760],spd:[54,420,480]},
  tetsu:{hp:[195,1300,1500],mp:[44,230,280],atk:[78,999,999],mag:[45,760,850],def:[64,710,800],res:[45,560,650],spd:[46,360,415]},
  lilith:{hp:[165,1100,1380],mp:[66,325,390],atk:[58,850,930],mag:[80,999,999],def:[46,570,660],res:[68,750,840],spd:[50,400,455]},
  naraku:{hp:[200,1320,1500],mp:[58,295,355],atk:[76,980,999],mag:[76,980,999],def:[60,690,780],res:[60,690,780],spd:[46,360,415]}
};
// Fixed enemy stats: no weakening and no HP scaling based on enemy count or party size.
TEMP_BALANCE.enemyProfiles={
  normal:{hpBase:110,hpPerLevel:10.5,atkBase:28,atkPerLevel:6.0,magBase:27,magPerLevel:5.9,defBase:18,defPerLevel:3.7,resBase:18,resPerLevel:3.7,spdBase:18,spdPerLevel:2.7},
  elite:{hpBase:400,hpPerLevel:27,atkBase:38,atkPerLevel:6.5,magBase:38,magPerLevel:6.5,defBase:25,defPerLevel:4.1,resBase:25,resPerLevel:4.1,spdBase:22,spdPerLevel:2.8},
  boss:{hpBase:780,hpPerLevel:52,atkBase:45,atkPerLevel:6.8,magBase:45,magPerLevel:6.8,defBase:35,defPerLevel:4.7,resBase:35,resPerLevel:4.7,spdBase:25,spdPerLevel:2.9}
};
Object.assign(MOB_DATA.elements['火'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['水'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['雷'],{cost:10,power:1.20});
Object.assign(MOB_DATA.elements['地'],{cost:10,power:1.20});
Object.assign(MOB_DATA.elements['風'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['光'],{cost:11,power:1.22});
Object.assign(MOB_DATA.elements['闇'],{cost:11,power:1.22});
Object.assign(MOB_DATA.elements['無'],{cost:8,power:1.12});

const V25_ENEMIES=[
  // 砂漠Ⅱ
  {id:'d2-mummy',name:'モブミイラ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/21.png',symbol:'包',levelMin:63,levelMax:67,mods:{hp:1.08}},
  {id:'d2-turco',name:'モブトルコ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/22.png',symbol:'地',levelMin:63,levelMax:68,mods:{atk:1.06}},
  {id:'d2-yamikamen',name:'モブヤミカーメン',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/23.png',symbol:'闇',levelMin:63,levelMax:66,mods:{mag:1.10}},
  {id:'d2-gimmick',name:'モブギミック',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/24.png',symbol:'宝',levelMin:63,levelMax:66,rare:true,coinReward:10000,mods:{hp:.92,spd:1.16}},
  {id:'d2-adventure',name:'モブアドベンチャー',stage:'砂漠Ⅱ',category:'normal',attribute:'火',image:'enemy/25.png',symbol:'火',levelMin:63,levelMax:67,mods:{atk:1.08}},
  {id:'d2-lizard',name:'モブスナトカゲ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/26.png',symbol:'蜥',levelMin:65,levelMax:67,mods:{spd:1.12}},
  {id:'d2-nekomummy',name:'モブネコミイラ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/27.png',symbol:'猫',levelMin:62,levelMax:65,mods:{res:1.08}},
  {id:'d2-akarock',name:'モブアカロック',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/28.png',symbol:'岩',levelMin:64,levelMax:64,mods:{hp:1.14,def:1.14,spd:.85}},
  {id:'d2-sharty',name:'モブシャーティー',stage:'砂漠Ⅱ',category:'normal',attribute:'光',image:'enemy/29.png',symbol:'光',levelMin:63,levelMax:65,tempAi:'heal'},
  {id:'d2-poison',name:'モブポイズン',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/30.png',symbol:'毒',levelMin:66,levelMax:66,special:'ポイズンクロー',kind:'poisonSingle',power:.72,chance:.10,skillType:'physical'},
  {id:'d2-deathhead',name:'モブデスヘッド',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/31.png',symbol:'骸',levelMin:68,levelMax:68,special:'デスカーテン',kind:'single',power:.72,skillElement:'闇',skillType:'magic'},
  {id:'boss-mira-d2',name:'ミラモブ',stage:'砂漠Ⅱ',category:'boss',attribute:'闇',image:'boss/03.png',symbol:'毒',levelMin:66,levelMax:66,bossId:'miraD2',special:'ミラモブポイズン',kind:'poisonSingle',power:1.25,chance:.50,skillType:'physical'},
  {id:'boss-mira2-d2',name:'ミラモブⅡ',stage:'砂漠Ⅱ',category:'boss',attribute:'闇',image:'boss/04.png',symbol:'毒',levelMin:72,levelMax:72,bossId:'mira2D2',special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,chance:.50,skillType:'physical'},
  {id:'d2-slamummy',name:'モブスラミイラ',stage:'砂漠Ⅱ',category:'elite',attribute:'水',image:'enemy/33.png',symbol:'斧',levelMin:63,levelMax:63,special:'スライムアックス',kind:'stunSingle',power:.72,chance:.20,skillType:'physical'},
  {id:'d2-mirabuster',name:'モブミラバスター',stage:'砂漠Ⅱ',category:'elite',attribute:'闇',image:'enemy/36.png',symbol:'闇',levelMin:70,levelMax:70,special:'バニッシュフレイム',kind:'aoeStunChance',power:.62,chance:.10,skillType:'magic'},
  {id:'d2-twinsoul',name:'モブツインソウル',stage:'砂漠Ⅱ',category:'elite',attribute:'雷',image:'enemy/35.png',symbol:'雷',levelMin:66,levelMax:66,special:'ハイタッチサンダー',kind:'aoe',power:1.02,skillElement:'雷',skillType:'magic'},
  {id:'d2-miraearth',name:'モブミラアース',stage:'砂漠Ⅱ',category:'elite',attribute:'地',image:'enemy/36.png',symbol:'地',levelMin:70,levelMax:70,special:'グラビディクラッシュ',kind:'singleSpdDown',power:1.08,debuff:.12,skillElement:'地',skillType:'physical'},
  {id:'d2-mirakarami',name:'モブミラカラミ',stage:'砂漠Ⅱ',category:'elite',attribute:'火',image:'enemy/36.png',symbol:'火',levelMin:70,levelMax:70,special:'ソウルフレイム',kind:'aoe',power:1.02,skillElement:'火',skillType:'magic'},
  {id:'d2-miranight',name:'モブミラナイト',stage:'砂漠Ⅱ',category:'elite',attribute:'水',image:'enemy/36.png',symbol:'水',levelMin:70,levelMax:70,special:'シャドウオーラスパイラル',kind:'single',power:1.08,skillElement:'水',skillType:'magic'},
  {id:'d2-miratime',name:'モブミラタイム',stage:'砂漠Ⅱ',category:'elite',attribute:'光',image:'enemy/36.png',symbol:'時',levelMin:70,levelMax:70,special:'デザート・ストーム・タイム',kind:'aoeParalyzeChance',power:.64,chance:.20,skillElement:'光',skillType:'magic'},
  {id:'boss-dorafara',name:'ドラファラモブ',stage:'砂漠Ⅱ',category:'boss',attribute:'火・闇',image:'boss/20.png',symbol:'炎',levelMin:78,levelMax:78,bossId:'dorafara',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.55,skillElement:'火・闇',skillType:'magic',specialOptions:[{special:'ミラモブポイズン',kind:'poisonSingle',power:1.25,chance:.50,skillType:'physical'},{special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.55,skillElement:'火・闇',skillType:'magic'}]},
  // 魔王城
  {id:'c-picodark',name:'モブピコダーク',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/131.png',symbol:'闇',levelMin:72,levelMax:77},
  {id:'c-devilslime',name:'モブデビルスライム',stage:'魔王城',category:'normal',attribute:'水',image:'enemy/132.png',symbol:'水',levelMin:73,levelMax:75},
  {id:'c-darkgob',name:'モブダークゴブ',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/133.png',symbol:'闇',levelMin:73,levelMax:78,mods:{atk:1.08}},
  {id:'c-punirider',name:'モブプニライダー',stage:'魔王城',category:'normal',attribute:'水',image:'enemy/134.png',symbol:'水',levelMin:73,levelMax:76,mods:{spd:1.08}},
  {id:'c-minibook',name:'モブミニブック',stage:'魔王城',category:'normal',attribute:'光',image:'enemy/135.png',symbol:'本',levelMin:73,levelMax:77,mods:{mag:1.10}},
  {id:'c-loopmagic',name:'モブループマジック',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/136.png',symbol:'魔',levelMin:75,levelMax:77,mods:{mag:1.12}},
  {id:'c-hellshadow',name:'モブヘルシャドウ',stage:'魔王城',category:'normal',attribute:'火',image:'enemy/137.png',symbol:'炎',levelMin:72,levelMax:75,mods:{spd:1.10}},
  {id:'c-metasword',name:'モブメタソード',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/138.png',symbol:'剣',levelMin:74,levelMax:77,mods:{atk:1.12,def:1.08}},
  {id:'c-cockpit',name:'モブコクピット',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/139.png',symbol:'機',levelMin:73,levelMax:75,mods:{def:1.10,res:1.10}},
  {id:'c-assassin',name:'モブアサシン',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/140.png',symbol:'刃',levelMin:76,levelMax:76,special:'ダークウィンドウ',kind:'aoe',power:.62,skillElement:'闇',skillType:'physical',mods:{spd:1.16}},
  {id:'c-deathspear',name:'モブデススピア',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/141.png',symbol:'槍',levelMin:78,levelMax:78,special:'デススパイラル',kind:'single',power:1.08,skillElement:'闇',skillType:'physical',mods:{atk:1.12}},
  {id:'c-killwitch',name:'モブキラウィッチ',stage:'魔王城',category:'elite',attribute:'闇',image:'enemy/146.png',symbol:'魔',levelMin:80,levelMax:80,special:'ウィッチ・スウィート・ベリー',kind:'poisonSingle',power:1.08,chance:.40,skillType:'magic'},
  {id:'c-succubus',name:'モブサキュバス',stage:'魔王城',category:'elite',attribute:'火',image:'enemy/147.png',symbol:'炎',levelMin:80,levelMax:80,special:'プティ・ヘルファイヤ',kind:'burnSingle',power:1.08,chance:.50,skillType:'magic'},
  {id:'c-miraheld',name:'モブミラヘルド',stage:'魔王城',category:'normal',attribute:'火',image:'enemy/143.png',symbol:'炎',levelMin:75,levelMax:75,special:'コーク・ハイ・フレイム',kind:'stunSingle',power:1.05,chance:.20,skillType:'magic'},
  {id:'boss-gladi',name:'グラディモブ',stage:'魔王城',category:'boss',attribute:'火',image:'boss/39.png',symbol:'将',levelMin:82,levelMax:82,bossId:'gladi',special:'将軍進撃',kind:'doubleAoe',power:.72,skillType:'physical'},
  {id:'c-yamieater',name:'モブヤミイーター',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/144.png',symbol:'闇',levelMin:75,levelMax:75,special:'デビルスラッシュ',kind:'single',power:1.05,skillType:'physical'},
  {id:'c-boukun',name:'モブボウクン',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/145.png',symbol:'拳',levelMin:75,levelMax:75,special:'メトロブロウ',kind:'single',power:1.05,skillType:'physical'},
  {id:'boss-lilith-castle',name:'モブリリス',stage:'魔王城',category:'boss',attribute:'闇',image:'boss/21.png',symbol:'薔',levelMin:85,levelMax:85,bossId:'lilithBoss',special:'ブラックホール',kind:'healAoeBoss',power:1.25,heal:.06,skillType:'magic'},
  {id:'boss-maou-castle',name:'モブ魔王',stage:'魔王城',category:'boss',attribute:'闇',image:'boss/22.png',symbol:'王',levelMin:95,levelMax:95,bossId:'maou',special:'マスター・オブ・ピラミッド',kind:'aoe',power:1.72,skillType:'magic',mods:{hp:1.12,mag:1.08}}
];
MOB_DATA.enemyCatalog.push(...V25_ENEMIES);
MOB_DATA.adventureWorlds.push(
  {id:'desert2',name:'砂漠Ⅱ',fieldFallback:'back2/03.png',normalIds:['d2-mummy','d2-turco','d2-yamikamen','d2-gimmick','d2-adventure','d2-lizard','d2-nekomummy','d2-akarock','d2-sharty','d2-poison','d2-deathhead'],areas:[
    {name:'AREA 1',bg:'back/sabaku.png',boss:[{id:'boss-mira-d2',level:66}],nextWave:[{id:'boss-mira2-d2',level:72}]},
    {name:'AREA 2',bg:'back/sabaku2.png',boss:[{id:'d2-slamummy',level:63},{id:'d2-mirabuster',level:70},{id:'d2-twinsoul',level:66}]},
    {name:'AREA 3',bg:'back/sabaku3.png',boss:[{id:'d2-miraearth',level:70},{id:'d2-mirakarami',level:70}],nextWave:[{id:'d2-miranight',level:70},{id:'d2-miratime',level:70}]},
    {name:'AREA 4',bg:'back/sabaku4.png',boss:[{id:'boss-dorafara',level:78}]}
  ]},
  {id:'demonCastle',name:'魔王城',fieldFallback:'back2/09.png',normalIds:['c-picodark','c-devilslime','c-darkgob','c-punirider','c-minibook','c-loopmagic','c-hellshadow','c-metasword','c-cockpit','c-assassin','c-deathspear'],areas:[
    {name:'AREA 1',bg:'back/maoh.png',boss:[{id:'c-killwitch',level:80},{id:'c-succubus',level:80}]},
    {name:'AREA 2',bg:'back/maoh2.png',boss:[{id:'c-miraheld',level:75},{id:'boss-gladi',level:82},{id:'c-yamieater',level:75}]},
    {name:'AREA 3',bg:'back/maoh3.png',boss:[{id:'c-boukun',level:75},{id:'boss-lilith-castle',level:85},{id:'c-boukun',level:75}]},
    {name:'AREA 4',bg:'back/maoh4.png',boss:[{id:'boss-maou-castle',level:95}]}
  ]}
);


// ===== MOB QUEST v45 : latest balance / enemy typing / encounter data =====
// Equipment-free player growth targets from v44 are preserved so future weapons and growth systems have room to matter.
TEMP_BALANCE.playerTargets={
  yusha:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[43,580,680],def:[38,490,590],res:[39,510,610],spd:[40,540,640]},
  pink:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[35,480,580],mag:[39,520,620],def:[42,550,650],res:[43,570,670],spd:[35,480,580]},
  desert:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[38,490,590],res:[35,450,550],spd:[40,540,640]},
  nyoro:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[39,520,620],def:[34,430,530],res:[35,450,550],spd:[45,600,700]},
  nekoku:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[42,550,650],res:[39,510,610],spd:[40,540,640]},
  jessie:{hp:[110,1080,1380],mp:[100,1140,1440],atk:[40,540,640],mag:[43,580,680],def:[34,430,530],res:[39,510,610],spd:[45,600,700]},
  denden:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[39,520,620],def:[38,490,590],res:[39,510,610],spd:[45,600,700]},
  money:{hp:[110,1080,1380],mp:[110,1200,1500],atk:[35,480,580],mag:[43,580,680],def:[34,430,530],res:[43,570,670],spd:[40,540,640]},
  riro:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[40,540,640],mag:[39,520,620],def:[38,490,590],res:[43,570,670],spd:[45,600,700]},
  tetsu:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[42,550,650],res:[35,450,550],spd:[40,540,640]},
  lilith:{hp:[110,1080,1380],mp:[110,1200,1500],atk:[35,480,580],mag:[43,580,680],def:[38,490,590],res:[43,570,670],spd:[40,540,640]},
  naraku:{hp:[130,1200,1500],mp:[100,1140,1440],atk:[45,600,700],mag:[43,580,680],def:[38,490,590],res:[43,570,670],spd:[40,540,640]}
};
TEMP_BALANCE.enemyProfiles={
  normal:{hpBase:80,hpPerLevel:9,hpQuad:.10,atkBase:18,atkPerLevel:3.3,atkQuad:.002,magBase:18,magPerLevel:3.25,magQuad:.002,defBase:15,defPerLevel:2.6,defQuad:.002,resBase:15,resPerLevel:2.6,resQuad:.002,spdBase:16,spdPerLevel:3.2,spdQuad:.001},
  elite:{hpBase:220,hpPerLevel:28,hpQuad:.42,atkBase:24,atkPerLevel:3.65,atkQuad:.003,magBase:24,magPerLevel:3.60,magQuad:.003,defBase:20,defPerLevel:2.9,defQuad:.0025,resBase:20,resPerLevel:2.9,resQuad:.0025,spdBase:18,spdPerLevel:3.5,spdQuad:.0015},
  boss:{hpBase:420,hpPerLevel:42,hpQuad:.90,atkBase:30,atkPerLevel:4.0,atkQuad:.004,magBase:30,magPerLevel:4.0,magQuad:.004,defBase:26,defPerLevel:3.15,defQuad:.003,resBase:26,resPerLevel:3.15,resQuad:.003,spdBase:20,spdPerLevel:3.8,spdQuad:.0018}
};

// Latest boss document explicitly identifies these named techniques as physical / magic / mental / hybrid.
const V45_BOSS_SKILL_TYPES={
  hawk:'physical',mira:'physical',guardian:'mental',neon:'magic',ace:'magic',dragon:'magic',nepu:'physical',hawk2:'physical',
  debuff:'physical',debuff2:'physical',berserk:'physical',berserk2:'physical',dendenBoss:'physical',umiDenden:'physical',moneyBoss:'magic',neoMaster:'magic',
  dragon2:'magic',gidora:'magic',dorafara:'magic',gladi:'physical',lilithBoss:'magic',maou:'magic',natalie:'magic',smith:'physical',unlock:'hybrid',
  yamigami:'magic',yamigami2:'magic',yamigamiDark:'magic',enma:'magic',enma2:'magic',enmaFinal:'magic'
};
for(const b of MOB_DATA.bosses||[]){
  b.skillType=V45_BOSS_SKILL_TYPES[b.id]||b.skillType||'physical';
  if(b.id==='umiDenden')b.name='モブウミデンデン';
}

// Every enemy now has an explicit regular attack family. Most ordinary weapon/body attacks are physical;
// obvious caster/energy archetypes use magic so MND has a consistent purpose even when a special is not selected.
const V45_MAGIC_NORMAL_IDS=new Set([
  'd-yamikamen','r-nullblue','r-denchi','n-naga','n-energy','n-darknaga','m-hinodevi','m-bombthrow','s-mist','s-doctor','s-sorcerer',
  't-jukon','r2-akui','r2-shitsui','r2-yamai','n2-naga','n2-energy','n2-darknaga','m2-hinodevi','m2-bombthrow','d2-yamikamen',
  'c-minibook','c-loopmagic','c-killwitch','c-succubus'
]);
for(const e of MOB_DATA.enemyCatalog||[]){
  if(!e.normalAttackType)e.normalAttackType=V45_MAGIC_NORMAL_IDS.has(e.id)?'magic':'physical';
  if(e.bossId){const bt=V45_BOSS_SKILL_TYPES[e.bossId];if(bt&&!e.skillType)e.skillType=bt;}
  if(e.special&&!e.skillType&&e.kind!=='shield'&&e.kind!=='enemyHeal')e.skillType='physical';
  if(e.kind==='shield'&&!e.skillType)e.skillType='mental';
  if(e.id==='boss-umidenden')e.name='モブウミデンデン';
}

// Latest encounter composition corrections.
const v45World=id=>(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id);
{
  const w=v45World('desert');if(w){w.areas[2].boss=[{id:'d-deathhead',level:10,qty:2}];}
  const w2=v45World('rural');if(w2){w2.areas[1].boss=[{id:'r-knife',level:15,qty:2},{id:'r-captain',level:18}];}
  const w3=v45World('rural2');if(w3){w3.areas[0].boss=[{id:'r2-adancer',level:56,qty:2},{id:'r2-violin',level:62}];}
}


// v45 latest boss sheet: final encounter corrections and explicit fixed-action mid-bosses.
{
  const sea=(MOB_DATA.adventureWorlds||[]).find(w=>w.id==='sea');
  if(sea)sea.areas[1].boss=[{id:'s-marine',level:42,qty:2},{id:'s-jones',level:43}];
  for(const id of ['m-frezard','s-jones','r2-violin']){
    const e=(MOB_DATA.enemyCatalog||[]).find(x=>x.id===id);if(e)e.actionCount=2;
  }
}


// ===== MOB QUEST v47 : boss sheet (7) corrections =====
// Latest uploaded boss sheet is authoritative for these encounter changes.
{
  const enemyById=id=>(MOB_DATA.enemyCatalog||[]).find(e=>e.id===id);
  const worldById=id=>(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id);

  const neon2=worldById('neon2');
  if(neon2){
    // AREA 1: Neo Tiger is the centre mid-boss, Neon Slimes are one-action escorts.
    neon2.areas[0].boss=[{id:'n2-slime',level:61,qty:2},{id:'n2-tiger',level:67}];
    // AREA 3: Palette Leon is the centre enemy; formation helper centres the unique elite.
    neon2.areas[2].boss=[{id:'n2-banken',level:66},{id:'n2-golem',level:66},{id:'n2-palette',level:68}];
  }

  const yogan=enemyById('m2-yogan');
  if(yogan)yogan.name='モブヨーガンスライム';

  const buster=enemyById('m2-buster');
  if(buster)buster.actionCount=2; // source: 確定2回攻撃
}

// ===== MOB QUEST v48 : story display / balance pass =====
// Party roles are intentionally more distinct, late-game bosses get clearer identities,
// and requested encounter-specific size / pacing adjustments are handled in game.js.
TEMP_BALANCE.playerTargets={
  yusha:{hp:[125,1180,1400],mp:[105,1140,1360],atk:[42,600,740],mag:[40,540,670],def:[40,520,650],res:[38,500,620],spd:[38,520,640]},
  pink:{hp:[145,1220,1450],mp:[80,900,1100],atk:[33,430,520],mag:[24,290,360],def:[50,640,790],res:[46,600,740],spd:[24,320,390]},
  desert:{hp:[112,1060,1260],mp:[85,960,1160],atk:[49,660,810],mag:[20,260,320],def:[34,430,520],res:[30,390,470],spd:[48,640,790]},
  nyoro:{hp:[115,1080,1300],mp:[100,1180,1420],atk:[36,500,610],mag:[40,560,690],def:[32,410,500],res:[40,540,650],spd:[46,620,760]},
  nekoku:{hp:[132,1240,1500],mp:[92,980,1180],atk:[44,590,720],mag:[24,320,400],def:[42,560,700],res:[34,450,560],spd:[32,420,520]},
  jessie:{hp:[110,1040,1240],mp:[115,1250,1500],atk:[30,400,500],mag:[48,670,820],def:[28,370,450],res:[42,570,690],spd:[47,640,780]},
  denden:{hp:[118,1100,1320],mp:[90,990,1180],atk:[47,650,800],mag:[28,360,450],def:[34,440,540],res:[30,390,480],spd:[50,680,840]},
  money:{hp:[108,1020,1240],mp:[125,1340,1600],atk:[26,350,430],mag:[50,690,840],def:[30,400,490],res:[48,650,800],spd:[36,490,600]},
  riro:{hp:[122,1150,1380],mp:[115,1230,1480],atk:[30,400,500],mag:[44,610,760],def:[36,470,580],res:[50,680,820],spd:[42,560,690]},
  tetsu:{hp:[155,1320,1580],mp:[72,820,980],atk:[46,620,760],mag:[18,220,280],def:[56,720,880],res:[34,450,560],spd:[20,260,320]},
  lilith:{hp:[105,980,1180],mp:[120,1300,1560],atk:[28,360,440],mag:[52,720,880],def:[28,360,440],res:[46,620,760],spd:[44,590,720]},
  naraku:{hp:[135,1260,1520],mp:[110,1210,1460],atk:[52,700,860],mag:[46,640,790],def:[42,560,690],res:[42,560,690],spd:[34,450,550]}
};

{
  const enemyById=id=>(MOB_DATA.enemyCatalog||[]).find(e=>e.id===id);
  const setEnemy=(id,props={})=>{
    const e=enemyById(id);if(!e)return;
    const {mods,...rest}=props;
    if(mods)e.mods={...(e.mods||{}),...mods};
    Object.assign(e,rest);
  };

  // 部族村：雑魚を少し手強くしつつ、役割を明確化。
  setEnemy('t-ohno',{mods:{hp:1.14,atk:1.18,def:1.08}});
  setEnemy('t-jukon',{mods:{hp:1.06,mag:1.22,res:1.16},normalAttackType:'magic'});
  setEnemy('t-warrior',{mods:{hp:1.22,def:1.18,atk:1.08,spd:0.94}});
  setEnemy('t-kiba',{mods:{hp:1.08,atk:1.12,spd:1.18}});
  setEnemy('t-kukuri',{actionCount:2,mods:{atk:1.12,spd:1.22,def:0.96}});
  setEnemy('t-tough',{mods:{hp:1.28,def:1.26,atk:1.08,spd:0.80}});
  setEnemy('t-hisui',{actionCount:2,mods:{hp:1.08,mag:1.24,res:1.22,spd:1.06},normalAttackType:'magic'});
  setEnemy('t-ryugo',{actionCount:2,mods:{hp:1.10,atk:1.24,spd:1.12}});
  setEnemy('boss-debuff',{actionCount:2,mods:{hp:1.18,atk:1.02,def:1.28,res:1.20,spd:0.94}});
  setEnemy('boss-berserk',{actionCount:2,mods:{hp:1.10,atk:1.30,def:0.94,res:0.94,spd:1.18}});
  setEnemy('boss-debuff2',{actionCount:2,mods:{hp:1.24,atk:1.08,def:1.34,res:1.28,spd:0.96}});
  setEnemy('boss-berserk2',{actionCount:2,mods:{hp:1.16,atk:1.38,def:0.98,res:0.96,spd:1.20}});

  // ネオン街Ⅱ：中ボス/ボスの個性を強化。
  setEnemy('n2-tiger',{actionCount:2,mods:{hp:1.14,atk:1.20,spd:1.12}});
  setEnemy('n2-kodora',{mods:{hp:0.90,mag:1.22,res:1.08,spd:1.06},normalAttackType:'magic'});
  setEnemy('n2-palette',{actionCount:2,mods:{hp:1.06,mag:1.24,res:1.18,spd:1.06},normalAttackType:'magic'});
  setEnemy('boss-neomaster',{actionCount:2,mods:{hp:1.22,atk:0.98,mag:1.34,def:1.12,res:1.28,spd:1.06},normalAttackType:'magic'});

  // マグマⅡ：後半らしく圧を強化。
  setEnemy('m2-yogan',{actionCount:2,mods:{hp:1.08,mag:1.18,res:1.10}});
  setEnemy('m2-salamander',{actionCount:2,mods:{hp:1.10,atk:1.18,mag:1.14,spd:1.06}});
  setEnemy('m2-buster',{actionCount:2,mods:{hp:1.24,atk:1.30,def:1.12,res:1.04,spd:1.02}});
  setEnemy('boss-dragon2',{actionCount:2,mods:{hp:1.18,atk:1.18,mag:1.22,def:1.10,res:1.12}});
  setEnemy('boss-gidora',{actionCount:2,mods:{hp:1.30,atk:1.22,mag:1.30,def:1.14,res:1.16,spd:1.06}});
}

// ===== MOB QUEST v58 : latest ボス(8) authoritative update =====
{
  const enemyById=id=>(MOB_DATA.enemyCatalog||[]).find(e=>e.id===id);
  const worldById=id=>(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id);
  const bossById=id=>(MOB_DATA.bosses||[]).find(b=>b.id===id);
  const setEnemy=(id,props={})=>{const e=enemyById(id);if(!e)return null;const {mods,...rest}=props;if(mods)e.mods={...(e.mods||{}),...mods};Object.assign(e,rest);return e;};
  const clearAction=id=>{const e=enemyById(id);if(e)delete e.actionCount;};

  // The latest sheet only fixes action counts where it explicitly says 確定2回行動/攻撃.
  for(const id of ['t-kukuri','t-hisui','t-ryugo','n2-tiger','n2-palette','boss-neomaster','m2-yogan','m2-salamander','boss-dragon2','boss-gidora'])clearAction(id);
  for(const id of ['m-frezard','s-jones','r2-violin','m2-buster','d2-mirabuster','d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'])setEnemy(id,{actionCount:2});

  // Latest encounter compositions.
  const grass=worldById('grassland');if(grass)grass.areas[0].boss=[{id:'g-beaver',level:4,qty:2},{id:'g-savanna',level:6}];
  const desert=worldById('desert');if(desert)desert.areas[2].boss=[{id:'d-deathhead',level:10,qty:2}];
  const rural=worldById('rural');if(rural){rural.areas[0].boss=[{id:'r-dancer',level:15,qty:2},{id:'r-scouter',level:18}];rural.areas[1].boss=[{id:'r-knife',level:15,qty:2},{id:'r-captain',level:18}];}
  const sea=worldById('sea');if(sea)sea.areas[1].boss=[{id:'s-marine',level:42,qty:2},{id:'s-jones',level:43}];
  const grass2=worldById('grassland2');if(grass2)grass2.areas[3].boss=[{id:'g2-savanna',level:56,qty:2},{id:'boss-hawk2',level:60}];
  const rural2=worldById('rural2');if(rural2)rural2.areas[0].boss=[{id:'r2-adancer',level:56,qty:2},{id:'r2-violin',level:62}];
  const neon2=worldById('neon2');if(neon2){neon2.areas[0].boss=[{id:'n2-slime',level:61,qty:2},{id:'n2-tiger',level:67}];neon2.areas[2].boss=[{id:'n2-banken',level:66},{id:'n2-golem',level:66},{id:'n2-palette',level:68}];}
  const magma2=worldById('magma2');if(magma2){magma2.areas[0].boss=[{id:'m2-heatrock',level:65,qty:2},{id:'m2-yogan',level:68}];magma2.areas[1].boss=[{id:'m2-golem',level:65,qty:2},{id:'m2-salamander',level:68}];magma2.areas[2].boss=[{id:'m2-bomber',level:65,qty:2},{id:'m2-buster',level:68}];magma2.areas[3].boss=[{id:'boss-dragon2',level:70}];magma2.areas[3].nextWave=[{id:'boss-gidora',level:75}];}

  // 砂漠Ⅱ: exact skills / phases from the latest sheet.
  setEnemy('boss-mira-d2',{name:'ミラモブ',attribute:'闇',levelMin:66,levelMax:66,special:'ミラモブポイズン',kind:'poisonSingle',power:1.25,chance:.50,skillType:'physical'});
  setEnemy('boss-mira2-d2',{name:'ミラモブⅡ',attribute:'闇',levelMin:72,levelMax:72,special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,chance:.50,skillType:'physical'});
  setEnemy('d2-mirabuster',{actionCount:2,special:'バニッシュフレイム',kind:'aoeStunChance',power:.64,chance:.10,skillType:'magic',specialOptions:[
    {special:'バニッシュフレイム',kind:'aoeStunChance',power:.64,chance:.10,skillElement:'闇',skillType:'magic'},
    {special:'ソウル・オーバー・ミラバスター',kind:'aoe',power:1.18,skillElement:'闇',skillType:'magic'}
  ]});
  setEnemy('d2-miraearth',{actionCount:2,special:'グラビディクラッシュ',kind:'singleSpdDown',power:1.08,debuff:.12,skillElement:'地',skillType:'physical',specialOptions:[
    {special:'グラビディクラッシュ',kind:'singleSpdDown',power:1.08,debuff:.12,skillElement:'地',skillType:'physical'},
    {special:'ソウル・アース・グラビディクラッシュ',kind:'aoe',power:1.16,skillElement:'地',skillType:'physical'}
  ]});
  setEnemy('d2-mirakarami',{actionCount:2,special:'ホワイトミイラフレイム',kind:'aoe',power:1.05,skillElement:'火',skillType:'magic',specialOptions:[
    {special:'ホワイトミイラフレイム',kind:'aoe',power:1.05,skillElement:'火',skillType:'magic'},
    {special:'ソウル・ヘル・ミイラフレイム',kind:'single',power:1.72,skillElement:'火',skillType:'magic'}
  ]});
  setEnemy('d2-miranight',{actionCount:2,special:'シャドウ・オーラ・スパイラル',kind:'sleepSingle',power:1.08,chance:.30,skillElement:'水',skillType:'magic',specialOptions:[
    {special:'シャドウ・オーラ・スパイラル',kind:'sleepSingle',power:1.08,chance:.30,skillElement:'水',skillType:'magic'},
    {special:'ソウル・ダイダル・スパイラル',kind:'aoe',power:1.18,skillElement:'水',skillType:'magic'}
  ]});
  setEnemy('d2-miratime',{actionCount:2,special:'デザート・ストーム・タイム',kind:'aoeParalyzeChance',power:.66,chance:.20,skillElement:'光',skillType:'magic',specialOptions:[
    {special:'デザート・ストーム・タイム',kind:'aoeParalyzeChance',power:.66,chance:.20,skillElement:'光',skillType:'magic'},
    {special:'ソウル・マジック・ゴーストタイム',kind:'stunSingle',power:1.12,chance:.70,skillElement:'光',skillType:'magic'}
  ]});
  const pharaoh=setEnemy('boss-dorafara',{name:'ミラモブファラオ',stage:'砂漠Ⅱ',attribute:'光・闇',image:'boss/20.png',symbol:'鏡',levelMin:78,levelMax:78,bossId:'dorafara',special:'ソウル・ダーク・ライト・ミラー',kind:'buffDefAoe',power:1.82,skillElement:'光・闇',skillType:'magic',specialOptions:[
    {special:'ミラモブポイズン',kind:'poisonSingle',power:1.28,chance:.50,skillElement:'闇',skillType:'physical'},
    {special:'ソウル・ダーク・ライト・ミラー',kind:'buffDefAoe',power:1.82,skillElement:'光・闇',skillType:'magic',buff:.15}
  ]});
  const pharaohBoss=bossById('dorafara');if(pharaohBoss)Object.assign(pharaohBoss,{name:'ミラモブファラオ',attribute:'光・闇',image:'boss/20.png',symbol:'鏡',special:'ソウル・ダーク・ライト・ミラー',kind:'buffDefAoe',power:1.82});

  const d2=worldById('desert2');if(d2){
    d2.areas[0].boss=[{id:'boss-mira-d2',level:66}];d2.areas[0].nextWave=[{id:'boss-mira2-d2',level:72}];delete d2.areas[0].nextWaves;
    d2.areas[1].boss=[{id:'d2-slamummy',level:63,escort:true,actionCount:1},{id:'d2-mirabuster',level:70,actionCount:2},{id:'d2-twinsoul',level:66,escort:true,actionCount:1}];delete d2.areas[1].nextWave;delete d2.areas[1].nextWaves;
    d2.areas[2].boss=[{id:'d2-miraearth',level:70,actionCount:2},{id:'d2-mirakarami',level:70,actionCount:2}];
    d2.areas[2].nextWaves=[
      [{id:'d2-miranight',level:70,actionCount:2},{id:'d2-miratime',level:70,actionCount:2}],
      [{id:'d2-miraearth',level:70,actionCount:1,startingHpRate:.30},{id:'d2-mirakarami',level:70,actionCount:1,startingHpRate:.30},{id:'d2-miranight',level:70,actionCount:1,startingHpRate:.30},{id:'d2-miratime',level:70,actionCount:1,startingHpRate:.30}]
    ];delete d2.areas[2].nextWave;
    d2.areas[3].boss=[{id:'boss-dorafara',level:78}];delete d2.areas[3].nextWave;delete d2.areas[3].nextWaves;
  }
}


/* ===== MOB QUEST v73 CANONICAL SKILL MATERIALS =====
   Source priority: 技のスプライトシート素材について(5).txt
   Learners are still undecided. Normal play uses the character element's middle spell;
   TEST MODE + 全技 uses every catalog entry. */
MOB_DATA.magicCatalog=[
  {id:'hono',name:'ホノ',element:'火',tier:'small',cost:6,power:1.05,target:'single',frames:['skill/01.png','skill/02.png','skill/03.png','skill/04.png']},
  {id:'honoma',name:'ホノマ',element:'火',tier:'medium',cost:12,power:1.55,target:'single',frames:['skill/05.png','skill/06.png','skill/07.png','skill/08.png','skill/04.png']},
  {id:'honomagma',name:'ホノマグマ',element:'火',tier:'large',cost:22,power:2.15,target:'single',frames:['skill/09.png','skill/10.png','skill/11.png','skill/12.png','skill/05.png','skill/06.png']},
  {id:'nepu',name:'ネプ',element:'水',tier:'small',cost:6,power:1.05,target:'single',frames:['skill/13.png','skill/14.png','skill/15.png','skill/16.png']},
  {id:'nepuma',name:'ネプマ',element:'水',tier:'medium',cost:12,power:1.55,target:'single',frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png']},
  {id:'nepumachun',name:'ネプマチューン',element:'水',tier:'large',cost:22,power:2.15,target:'single',frames:['skill/20.png','skill/21.png','skill/22.png','skill/23.png','skill/22.png','skill/21.png']},
  {id:'toru',name:'トル',element:'雷',tier:'small',cost:7,power:1.08,target:'single',frames:['skill/24.png','skill/25.png','skill/26.png','skill/27.png']},
  {id:'toruma',name:'トルマ',element:'雷',tier:'medium',cost:13,power:1.58,target:'single',frames:['skill/29.png','skill/30.png','skill/31.png']},
  {id:'torumaden',name:'トルマデン',element:'雷',tier:'large',cost:23,power:2.18,target:'single',frames:['skill/32.png','skill/33.png','skill/34.png','skill/30.png','skill/28.png']},
  {id:'gore',name:'ゴレ',element:'地',tier:'small',cost:7,power:1.08,target:'single',frames:['skill/35.png','skill/36.png','skill/37.png','skill/38.png']},
  {id:'gorema',name:'ゴレマ',element:'地',tier:'medium',cost:13,power:1.58,target:'single',frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png']},
  {id:'goremagardy',name:'ゴレマガーディ',element:'地',tier:'large',cost:23,power:2.18,target:'single',frames:['skill/41.png','skill/43.png','skill/44.png','skill/45.png'],mode:'earthLargeV74'},
  {id:'hoku',name:'ホク',element:'風',tier:'small',cost:6,power:1.05,target:'single',frames:['skill/45.png','skill/46.png','skill/47.png','skill/48.png']},
  {id:'hokuma',name:'ホクマ',element:'風',tier:'medium',cost:12,power:1.55,target:'single',frames:['skill/49.png','skill/50.png','skill/51.png','skill/52.png']},
  {id:'hokumawing',name:'ホクマウィング',element:'風',tier:'large',cost:22,power:2.15,target:'single',frames:['skill/47.png','skill/51.png','skill/53.png','skill/52.png'],mode:'windLargeV74'},
  {id:'neo',name:'ネオ',element:'光',tier:'small',cost:7,power:1.10,target:'single',frames:['skill/54.png','skill/55.png','skill/56.png'],mode:'lightSmall'},
  {id:'neoma',name:'ネオマ',element:'光',tier:'medium',cost:14,power:1.62,target:'single',frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png']},
  {id:'neomanipool',name:'ネオマニプール',element:'光',tier:'large',cost:24,power:2.22,target:'single',frames:['skill/57.png','skill/58.png','skill/59.png','skill/60.png'],mode:'lightLargeV74'},
  {id:'mira',name:'ミラ',element:'闇',tier:'small',cost:7,power:1.10,target:'single',frames:['skill/61.png','skill/62.png','skill/63.png','skill/64.png']},
  {id:'mirama',name:'ミラマ',element:'闇',tier:'medium',cost:14,power:1.62,target:'single',frames:['skill/65.png','skill/66.png','skill/67.png','skill/68.png']},
  {id:'miramazone',name:'ミラマゾーン',element:'闇',tier:'large',cost:24,power:2.22,target:'single',frames:['skill/69.png','skill/70.png','skill/71.png','skill/72.png']},
  {id:'anoma',name:'アノマ',element:'無',tier:'medium',cost:10,power:1.25,target:'single',frames:['skill/127.png','skill/128.png','skill/129.png','skill/130.png']},
  {id:'anomaun',name:'アノマウン',element:'無',tier:'large',cost:18,power:1.90,target:'single',frames:['skill/131.png','skill/132.png','skill/133.png','skill/134.png']},
  {id:'garagaranotabi',name:'ガラガラノタビ',element:'地',tier:'all',cost:18,power:1.20,target:'all',frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png']},
  {id:'girigirinokaruma',name:'ギリギリノカルマ',element:'闇',tier:'all',cost:19,power:1.22,target:'all',frames:['skill/65.png','skill/66.png','skill/67.png','skill/68.png']},
  {id:'keronoishou',name:'ケロノイショウ',element:'水',tier:'all',cost:18,power:1.20,target:'all',frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png']},
  {id:'kizuitakitsutsuki',name:'キヅイタキツツキ',element:'地',tier:'all',cost:18,power:1.20,target:'all',frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png']},
  {id:'kakashitokomugi',name:'カカシトコムギ',element:'風',tier:'all',cost:18,power:1.20,target:'all',frames:['skill/49.png','skill/50.png','skill/51.png','skill/52.png']},
  {id:'kamaenohanashi',name:'カマエノハナシ',element:'光',tier:'all',cost:19,power:1.22,target:'all',frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png']}
];
MOB_DATA.techniqueCatalog=[
  {id:'magsword',name:'マグソード',element:'火',kind:'slash',tier:'small',cost:7,power:1.15,frames:['skill/73.png','skill/74.png','skill/75.png','skill/76.png']},
  {id:'magmasword',name:'マグマソード',element:'火',kind:'slash',tier:'large',cost:15,power:1.78,frames:['skill/77.png','skill/78.png','skill/79.png','skill/80.png']},
  {id:'nepusword',name:'ネプソード',element:'水',kind:'slash',tier:'small',cost:7,power:1.15,frames:['skill/81.png','skill/82.png','skill/83.png','skill/84.png']},
  {id:'nepumasword',name:'ネプマソード',element:'水',kind:'slash',tier:'large',cost:15,power:1.78,frames:['skill/81.png','skill/82.png','skill/85.png','skill/86.png']},
  {id:'torusword',name:'トルソード',element:'雷',kind:'slash',tier:'small',cost:8,power:1.18,frames:['skill/87.png','skill/88.png','skill/89.png','skill/90.png']},
  {id:'torumasword',name:'トルマソード',element:'雷',kind:'slash',tier:'large',cost:16,power:1.82,frames:['skill/91.png','skill/92.png','skill/93.png','skill/94.png']},
  {id:'goresword',name:'ゴレソード',element:'地',kind:'slash',tier:'small',cost:8,power:1.18,frames:['skill/120.png','skill/121.png','skill/122.png','skill/123.png']},
  {id:'goremasword',name:'ゴレマソード',element:'地',kind:'slash',tier:'large',cost:16,power:1.82,frames:['skill/124.png','skill/125.png','skill/126.png','skill/123.png']},
  {id:'neosword',name:'ネオソード',element:'光',kind:'slash',tier:'small',cost:8,power:1.20,frames:['skill/112.png','skill/113.png','skill/114.png','skill/115.png']},
  {id:'neomasword',name:'ネオマソード',element:'光',kind:'slash',tier:'large',cost:17,power:1.86,frames:['skill/116.png','skill/117.png','skill/118.png','skill/119.png']},
  {id:'mirasword',name:'ミラソード',element:'闇',kind:'slash',tier:'small',cost:8,power:1.20,frames:['skill/103.png','skill/104.png','skill/105.png','skill/106.png']},
  {id:'miramasword',name:'ミラマソード',element:'闇',kind:'slash',tier:'large',cost:17,power:1.86,frames:['skill/108.png','skill/109.png','skill/110.png','skill/111.png']},
  {id:'anosword',name:'アノソード',element:'無',kind:'slash',tier:'small',cost:7,power:1.12,frames:['skill/95.png','skill/96.png','skill/97.png','skill/98.png']},
  {id:'anomasword',name:'アノマソード',element:'無',kind:'slash',tier:'large',cost:15,power:1.72,frames:['skill/99.png','skill/100.png','skill/101.png','skill/102.png']},
  {id:'noise-scratch',name:'ノイズスクラッチ',element:'無',kind:'status',status:'confuse',cost:10,power:1.20,chance:.60,frames:[]},
  {id:'chill-lofi',name:'チルローファイ',element:'無',kind:'status',status:'sleep',cost:10,power:1.20,chance:.60,frames:[]},
  {id:'fast-beat',name:'ファストビート',element:'火',kind:'status',status:'burn',cost:10,power:1.20,chance:.60,frames:[]},
  {id:'repeat-intro',name:'リピートイントロ',element:'闇',kind:'status',status:'poison',cost:10,power:1.20,chance:.60,frames:[]},
  {id:'long-scratch',name:'ロングスクラッチ',element:'雷',kind:'status',status:'paralyze',cost:10,power:1.20,chance:.60,frames:[]}
];
const _v73Middle={火:'honoma',水:'nepuma',雷:'toruma',地:'gorema',風:'hokuma',光:'neoma',闇:'mirama',無:'anoma'};
for(const [element,id] of Object.entries(_v73Middle)){
  const m=MOB_DATA.magicCatalog.find(x=>x.id===id);if(m)Object.assign(MOB_DATA.elements[element],{temporary:false,spell:m.name,cost:m.cost,power:m.power,frames:[...m.frames]});
}

/* ===== MOB QUEST v73 CANONICAL BOSS / AREA FIXES =====
   ボス(20260827-071616).txt / 冒険イベント最新版を優先。 */
(()=>{
  const enemy=id=>(MOB_DATA.enemyCatalog||[]).find(e=>e.id===id);
  const up=(id,patch)=>{const e=enemy(id);if(e)Object.assign(e,patch);else MOB_DATA.enemyCatalog.push({id,...patch});};
  const world=id=>(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id);
  up('d2-miraearth',{image:'enemy/37.png'});
  up('d2-mirakarami',{image:'enemy/38.png'});
  up('d2-miranight',{image:'enemy/39.png'});
  up('d2-miratime',{image:'enemy/40.png'});
  up('c-succubus',{name:'モブララウィッチ',image:'enemy/147.png'});
  up('c-lilith-hell',{name:'モブヘルリリス',stage:'魔王城',category:'elite',attribute:'火',image:'boss/40.png',symbol:'炎',levelMin:80,levelMax:80,special:'ローズ・オブ・ファイヤー',kind:'burnSingle',power:1.55,chance:.40,skillElement:'火',skillType:'magic'});
  up('c-lilith-kirin',{name:'モブキリンリリス',stage:'魔王城',category:'elite',attribute:'雷',image:'boss/41.png',symbol:'雷',levelMin:80,levelMax:80,special:'サンダーボルト',kind:'aoeParalyzeChance',power:1.20,chance:.20,skillElement:'雷',skillType:'magic'});
  up('c-lilith-kufu',{name:'モブクフリリス',stage:'魔王城',category:'elite',attribute:'光',image:'boss/42.png',symbol:'光',levelMin:80,levelMax:80,special:'ライトニング・エナジーキューブ',kind:'aoeSleepChance',power:1.20,chance:.20,skillElement:'光',skillType:'magic'});
  up('c-lilith-riva',{name:'モブリヴァリリス',stage:'魔王城',category:'elite',attribute:'水',image:'boss/43.png',symbol:'水',levelMin:80,levelMax:80,special:'ダイダルローズ',kind:'ctSingle',power:1.30,ctAdd:2,skillElement:'水',skillType:'physical'});
  up('boss-lilith-castle',{actionCount:2,specialOptions:[
    {special:'ブラックホール',kind:'healAoeBoss',power:1.25,heal:.06,skillElement:'闇',skillType:'magic'},
    {special:'薔薇の鼓動',kind:'poisonSingle',power:1.72,chance:.70,skillElement:'闇',skillType:'physical'}
  ]});
  const d=world('demonCastle');if(d){
    d.areas[0].boss=[{id:'c-killwitch',level:80},{id:'c-succubus',level:80}];
    d.areas[1].boss=[{id:'c-miraheld',level:75,escort:true},{id:'boss-gladi',level:82},{id:'c-yamieater',level:75,escort:true}];
    /* Bパーティー戦 → Aパーティー戦。編成分割UIはgame.js側で保持。 */
    d.areas[2].boss=[{id:'c-lilith-kufu',level:80},{id:'c-lilith-riva',level:80}];
    d.areas[2].nextWave=[{id:'c-lilith-hell',level:80},{id:'boss-lilith-castle',level:85,actionCount:2},{id:'c-lilith-kirin',level:80}];
    delete d.areas[2].nextWaves;
    d.areas[3].boss=[{id:'boss-maou-castle',level:95}];
  }
})();


/* ===== MOB QUEST v79: SKILL / ULTIMATE / PASSIVE CANONICAL UPDATE ===== */
(()=>{
  const p=id=>(MOB_DATA.players||[]).find(x=>x.id===id);
  const u=(pid,i,patch)=>{const q=p(pid);if(q?.ults?.[i])Object.assign(q.ults[i],patch);};
  const seq=(dir,a,b)=>Array.from({length:b-a+1},(_,i)=>`${dir}/${String(a+i).padStart(2,'0')}.png`);

  // Latest player/passive sheet.
  if(p('yusha')){p('yusha').passive='勇者の使命';p('yusha').passive2='あのヒーローにやっつけてもらおう';}
  if(p('lilith'))p('lilith').image='play/11.png';

  // Ultimate: current square cut-in stays fixed; effectFrames play after the frame-trace cut-in.
  u('yusha',0,{effectFrames:seq('skill2',47,50),effectMode:'ultimateV79'});
  u('yusha',2,{effectFrames:seq('skill2',51,54),effectMode:'ultimateV79'});
  u('yusha',3,{name:'ネバー・エンディング・フレイム',effectFrames:seq('skill2',55,58),effectMode:'ultimateV79'});
  u('pink',0,{effectFrames:seq('skill2',44,46),effectMode:'ultimateV79'});
  u('pink',2,{effectFrames:seq('skill',131,134),effectMode:'ultimateV79'});
  u('pink',3,{effectFrames:seq('skill2',21,24),effectMode:'ultimateV79'});
  u('desert',0,{effectFrames:seq('skill2',66,69),effectMode:'ultimateV79'});
  u('desert',1,{effectFrames:seq('skill2',59,62),effectMode:'ultimateV79'});
  u('desert',2,{effectFrames:seq('skill2',106,109),effectMode:'ultimateV79'});
  u('desert',3,{effectFrames:seq('skill2',70,73),effectMode:'ultimateV79'});
  u('nyoro',0,{effectFrames:seq('skill2',98,101),effectMode:'ultimateV79'});
  u('nyoro',1,{effectFrames:seq('skill2',102,105),effectMode:'ultimateV79'});
  u('nyoro',2,{effectFrames:seq('skill2',231,234),effectMode:'ultimateV79'});
  u('nyoro',3,{effectFrames:seq('skill2',235,238),effectMode:'ultimateV79'});
  u('nekoku',0,{effectFrames:seq('skill2',153,156),effectMode:'ultimateV79'});
  u('nekoku',1,{effectFrames:seq('skill2',239,242),effectMode:'ultimateV79'});
  u('nekoku',2,{effectFrames:seq('skill2',197,200),effectMode:'ultimateV79'});
  u('nekoku',3,{effectFrames:seq('skill2',149,152),effectMode:'ultimateV79'});
  u('jessie',0,{effectFrames:seq('skill2',137,140),effectMode:'ultimateV79'});
  u('jessie',1,{effectFrames:seq('skill2',177,180),effectMode:'ultimateV79'});
  u('jessie',2,{effectFrames:seq('skill2',145,148),effectMode:'ultimateV79'});
  u('jessie',3,{effectFrames:seq('skill2',189,192),effectMode:'ultimateV79'});
  u('denden',0,{hits:[3,3],effectFrames:seq('skill2',74,77),effectMode:'ultimateV79'});
  u('denden',2,{effectFrames:seq('skill2',82,85),effectMode:'ultimateV79'});
  u('money',0,{effectFrames:seq('skill2',33,36),effectMode:'ultimateV79'});
  u('money',1,{effectFrames:seq('skill2',90,93),effectMode:'ultimateV79'});
  u('riro',0,{effectFrames:seq('skill2',206,209),effectMode:'ultimateV79'});
  u('riro',2,{effectFrames:seq('skill2',157,160),effectMode:'ultimateV79'});
  u('riro',3,{effectFrames:seq('skill2',181,184),effectMode:'ultimateV79'});
  u('tetsu',0,{effectFrames:seq('skill2',1,4),effectMode:'ultimateV79'});
  u('tetsu',1,{effectFrames:seq('skill2',173,176),effectMode:'ultimateV79'});
  u('tetsu',2,{effectFrames:seq('skill2',5,8),effectMode:'ultimateV79'});
  u('tetsu',3,{effectFrames:seq('skill2',214,217),effectMode:'ultimateV79'});
  u('lilith',0,{effectFrames:seq('skill2',161,164),effectMode:'ultimateV79'});
  u('lilith',1,{effectFrames:seq('skill2',169,172),effectMode:'ultimateV79'});
  u('lilith',2,{kind:'aoeCrit',power:2.10,type:'magic',crit:.10,hits:null,desc:'敵全体に闇属性大ダメージ。独立10%会心判定。',effectFrames:seq('skill2',165,168),effectMode:'ultimateV79'});
  u('lilith',3,{kind:'teamHealMpGuard',power:0,heal:.26,mpHeal:.18,desc:'味方全体のHPとMPを中回復。2ターン被ダメージ30%軽減。'});

  // Canonical ultimate elements/effects from the latest party sheet.
  u('yusha',0,{attackElement:'光'});u('yusha',2,{attackElement:'雷'});u('yusha',3,{attackElement:'火'});
  u('pink',0,{attackElement:'無'});u('pink',2,{attackElement:'無'});u('pink',3,{attackElement:'光'});
  for(let i=0;i<4;i++)u('desert',i,{attackElement:'地'});
  for(let i=0;i<4;i++)u('nyoro',i,{attackElement:'火'});
  for(let i=0;i<4;i++)u('nekoku',i,{attackElement:'水'});
  for(let i=0;i<4;i++)u('jessie',i,{attackElement:'雷'});
  for(let i=0;i<4;i++)u('denden',i,{attackElement:'雷'});
  u('denden',0,{hits:[3,3],desc:'ランダムな敵へ3回、雷属性小ダメージ。'});
  u('money',0,{attackElement:'光'});u('money',1,{attackElement:'火・水・光'});
  for(let i=0;i<4;i++)u('riro',i,{attackElement:'風'});
  for(let i=0;i<4;i++)u('tetsu',i,{attackElement:'地'});
  u('lilith',0,{attackElement:'闇'});u('lilith',1,{kind:'lilithSisters',power:1.30,type:'magic',attackElement:'闇',desc:'火・雷・光・水の中ダメージをランダムな敵へ各1回。'});u('lilith',2,{attackElement:'闇'});
  u('naraku',0,{attackElement:'闇'});u('naraku',2,{attackElement:'闇・火'});u('naraku',3,{attackElement:'闇'});

  // Canonical magic sprite sequences.
  MOB_DATA.magicCatalog=[
    {id:'hono',name:'ホノ',element:'火',tier:'small',cost:6,power:1.05,target:'single',frames:seq('skill',1,4)},
    {id:'honoma',name:'ホノマ',element:'火',tier:'medium',cost:12,power:1.55,target:'single',frames:[...seq('skill',5,8),'skill/04.png']},
    {id:'honomagma',name:'ホノマグマ',element:'火',tier:'large',cost:22,power:2.15,target:'single',frames:[...seq('skill',9,12),'skill/05.png','skill/06.png']},
    {id:'nepu',name:'ネプ',element:'水',tier:'small',cost:6,power:1.05,target:'single',frames:seq('skill',13,16)},
    {id:'nepuma',name:'ネプマ',element:'水',tier:'medium',cost:12,power:1.55,target:'single',frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png']},
    {id:'nepumachun',name:'ネプマチューン',element:'水',tier:'large',cost:22,power:2.15,target:'single',frames:[...seq('skill',20,23),'skill/22.png','skill/21.png']},
    {id:'toru',name:'トル',element:'雷',tier:'small',cost:7,power:1.08,target:'single',frames:seq('skill',24,27)},
    {id:'toruma',name:'トルマ',element:'雷',tier:'medium',cost:13,power:1.58,target:'single',frames:seq('skill',29,31)},
    {id:'torumaden',name:'トルマデン',element:'雷',tier:'large',cost:23,power:2.18,target:'single',frames:[...seq('skill',32,34),'skill/30.png','skill/28.png']},
    {id:'gore',name:'ゴレ',element:'地',tier:'small',cost:7,power:1.08,target:'single',frames:seq('skill',35,38)},
    {id:'gorema',name:'ゴレマ',element:'地',tier:'medium',cost:13,power:1.58,target:'single',frames:seq('skill',39,42)},
    {id:'goremagardy',name:'ゴレマガーディ',element:'地',tier:'large',cost:23,power:2.18,target:'single',frames:['skill/43.png','skill/40.png','skill/41.png','skill/42.png','skill/44.png'],mode:'earthLargeV79'},
    {id:'hoku',name:'ホク',element:'風',tier:'small',cost:6,power:1.05,target:'single',frames:seq('skill',45,48)},
    {id:'hokuma',name:'ホクマ',element:'風',tier:'medium',cost:12,power:1.55,target:'single',frames:seq('skill',49,52)},
    {id:'hokumawing',name:'ホクマウィング',element:'風',tier:'large',cost:22,power:2.15,target:'single',frames:['skill/51.png','skill/53.png','skill/52.png'],mode:'windLargeV79'},
    {id:'neo',name:'ネオ',element:'光',tier:'small',cost:7,power:1.10,target:'single',frames:['skill/54.png','skill/55.png','skill/56.png'],mode:'lightSmallV79'},
    {id:'neoma',name:'ネオマ',element:'光',tier:'medium',cost:14,power:1.62,target:'single',frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png']},
    {id:'neomanipool',name:'ネオマニプール',element:'光',tier:'large',cost:24,power:2.22,target:'single',frames:['skill/55.png','skill/57.png','skill/58.png','skill/59.png','skill/60.png'],mode:'lightLargeV79'},
    {id:'mira',name:'ミラ',element:'闇',tier:'small',cost:7,power:1.10,target:'single',frames:seq('skill',61,64)},
    {id:'mirama',name:'ミラマ',element:'闇',tier:'medium',cost:14,power:1.62,target:'single',frames:seq('skill',65,68)},
    {id:'miramazone',name:'ミラマゾーン',element:'闇',tier:'large',cost:24,power:2.22,target:'single',frames:seq('skill',69,72)},
    {id:'anoma',name:'アノマ',element:'無',tier:'medium',cost:10,power:1.25,target:'single',frames:['skill/127.png','skill/130.png']},
    {id:'anomaun',name:'アノマウン',element:'無',tier:'large',cost:18,power:1.90,target:'single',frames:['skill/131.png','skill/134.png']},
    {id:'garagaranotabi',name:'ガラガラノタビ',element:'地',tier:'all',cost:18,power:1.20,target:'all',frames:seq('skill2',193,196)},
    {id:'kumanokomiteitanoaberto',name:'クマノコ・ミテイタ・アノベルト',element:'闇',tier:'all',cost:19,power:1.22,target:'all',frames:seq('skill2',133,136)},
    {id:'keronoishou',name:'ケロノイショウ',element:'水',tier:'all',cost:18,power:1.20,target:'all',frames:seq('skill2',110,113)},
    {id:'kizutsukukitsutsuki',name:'キズツクキツツキ',element:'雷',tier:'all',cost:18,power:1.20,target:'all',frames:seq('skill2',201,202)},
    {id:'kakashitokomugi',name:'カカシトコムギ',element:'風',tier:'all',cost:18,power:1.20,target:'all',frames:seq('skill2',114,117)},
    {id:'watashinomirai',name:'ワタシのミライ',element:'光',tier:'all',cost:19,power:1.22,target:'all',frames:seq('skill2',125,128)}
  ];

  MOB_DATA.techniqueCatalog=[
    {id:'magsword',name:'マグソード',element:'火',kind:'slash',tier:'small',cost:7,power:1.15,frames:seq('skill',73,76)},
    {id:'magmasword',name:'マグマソード',element:'火',kind:'slash',tier:'large',cost:15,power:1.78,frames:seq('skill',77,80)},
    {id:'nepusword',name:'ネプソード',element:'水',kind:'slash',tier:'small',cost:7,power:1.15,frames:seq('skill',81,84)},
    {id:'nepumasword',name:'ネプマソード',element:'水',kind:'slash',tier:'large',cost:15,power:1.78,frames:['skill/81.png','skill/82.png','skill/85.png','skill/86.png']},
    {id:'torusword',name:'トルソード',element:'雷',kind:'slash',tier:'small',cost:8,power:1.18,frames:seq('skill',87,90)},
    {id:'torumasword',name:'トルマソード',element:'雷',kind:'slash',tier:'large',cost:16,power:1.82,frames:seq('skill',91,94)},
    {id:'goresword',name:'ゴレソード',element:'地',kind:'slash',tier:'small',cost:8,power:1.18,frames:seq('skill',120,123)},
    {id:'goremasword',name:'ゴレマソード',element:'地',kind:'slash',tier:'large',cost:16,power:1.82,frames:[...seq('skill',124,126),'skill/123.png']},
    {id:'neosword',name:'ネオソード',element:'光',kind:'slash',tier:'small',cost:8,power:1.20,frames:seq('skill',112,115)},
    {id:'neomasword',name:'ネオマソード',element:'光',kind:'slash',tier:'large',cost:17,power:1.86,frames:seq('skill',116,119)},
    {id:'mirasword',name:'ミラソード',element:'闇',kind:'slash',tier:'small',cost:8,power:1.20,frames:seq('skill',103,106)},
    {id:'miramasword',name:'ミラマソード',element:'闇',kind:'slash',tier:'large',cost:17,power:1.86,frames:seq('skill',108,111)},
    {id:'anosword',name:'アノソード',element:'無',kind:'slash',tier:'small',cost:7,power:1.12,frames:seq('skill',95,98)},
    {id:'anomasword',name:'アノマソード',element:'無',kind:'slash',tier:'large',cost:15,power:1.72,frames:seq('skill',99,102)},
    {id:'mobgiri',name:'MOB斬り',element:'地・風',kind:'slash',tier:'large',cost:13,power:1.62,frames:seq('skill2',9,12)},
    {id:'shippugiri',name:'疾風斬り',element:'風',kind:'slash',tier:'large',cost:13,power:1.62,priorityChance:.40,frames:seq('skill2',13,16)},
    {id:'noise-scratch',name:'ノイズスクラッチ',element:'無',kind:'status',status:'confuse',cost:10,power:1.20,chance:.60,frames:['skill/46.png'],mode:'statusNoiseV79'},
    {id:'chill-lofi',name:'チルローファイ',element:'無',kind:'status',status:'sleep',cost:10,power:1.20,chance:.60,frames:['skill/48.png'],mode:'statusChillV79'},
    {id:'fast-beat',name:'ファストビート',element:'火',kind:'status',status:'burn',cost:10,power:1.20,chance:.60,frames:['skill/76.png'],mode:'statusFastV79'},
    {id:'repeat-intro',name:'リピートイントロ',element:'闇',kind:'status',status:'poison',cost:10,power:1.20,chance:.60,frames:['skill/103.png'],mode:'statusRepeatV79'},
    {id:'long-scratch',name:'ロングスクラッチ',element:'雷',kind:'status',status:'paralyze',cost:10,power:1.20,chance:.60,frames:['skill/27.png','skill/28.png','skill/27.png','skill/28.png','skill/27.png'],mode:'statusLongV79'}
  ];

  const middle={火:'honoma',水:'nepuma',雷:'toruma',地:'gorema',風:'hokuma',光:'neoma',闇:'mirama',無:'anoma'};
  for(const [element,id] of Object.entries(middle)){const m=MOB_DATA.magicCatalog.find(x=>x.id===id);if(m)Object.assign(MOB_DATA.elements[element],{temporary:false,spell:m.name,cost:m.cost,power:m.power,frames:[...m.frames],mode:m.mode||''});}
})();

// ===== MOB QUEST v81 : grassland level rebalance =====
{
  const enemy=id=>(MOB_DATA.enemyCatalog||[]).find(e=>e.id===id);
  const world=id=>(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id);
  const boss=id=>(MOB_DATA.bosses||[]).find(b=>b.id===id);
  const set=(id,props)=>{const e=enemy(id);if(e)Object.assign(e,props);};

  // Normal monsters: exact opening-grassland level bands.
  set('g-slime',{levelMin:1,levelMax:3});
  set('g-rock',{levelMin:2,levelMax:3});
  set('g-jouro',{levelMin:3,levelMax:3});
  set('g-tendevi',{levelMin:2,levelMax:3});
  set('g-bird',{levelMin:1,levelMax:3});
  set('g-piyo-green',{levelMin:2,levelMax:3});
  set('g-piyo-red',{levelMin:2,levelMax:3});
  set('g-beaver',{levelMin:2,levelMax:2});

  // Mid-bosses / boss. Small-damage skills stay deliberately modest for the opening area.
  set('g-savanna',{levelMin:5,levelMax:5,special:'サバンナダンス',kind:'single',power:.80,skillElement:'地',skillType:'physical'});
  set('g-iwakiri',{levelMin:6,levelMax:6,special:'イワキリサンダー',kind:'aoe',power:.66,skillElement:'雷',skillType:'magic'});
  set('g-axe',{levelMin:6,levelMax:6,special:'アックススクラッチ',kind:'single',power:.80,skillElement:'風',skillType:'physical'});
  set('boss-hawk',{levelMin:8,levelMax:8,special:'ホークダイブ',kind:'aoe',power:.66,skillType:'physical',skillElement:'風'});
  const hawk=boss('hawk');if(hawk)Object.assign(hawk,{special:'ホークダイブ',kind:'aoe',power:.66,skillType:'physical',skillElement:'風'});

  // Exact AREA formations. arrangeBossFormation() keeps the unique elite in the centre.
  const grass=world('grassland');
  if(grass){
    grass.areas[0].boss=[{id:'g-beaver',level:3,qty:2},{id:'g-savanna',level:5}];
    grass.areas[1].boss=[{id:'g-iwakiri',level:6}];
    grass.areas[2].boss=[{id:'g-axe',level:6}];
    grass.areas[3].boss=[{id:'boss-hawk',level:8}];
  }
}

