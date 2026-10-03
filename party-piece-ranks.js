/* Editable CPU profiles for the 85 PIECE collaboration characters only. */
(function(root){'use strict';
const order=["D+","C","C+","B-","B","B+"];
const profiles={
  "3001": {
    "id": 3001,
    "sourceId": "MOB001",
    "name": "モブススケ",
    "min": "D+",
    "max": "C+",
    "strong": "power",
    "reason": "大きな作業手袋とブーツの力仕事を得意にし、総合力は控えめ。"
  },
  "3002": {
    "id": 3002,
    "sourceId": "MOB002",
    "name": "モブコバネ",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "小さな翼の機動力を飛行種目に反映。体格の小ささで下限を抑える。"
  },
  "3003": {
    "id": 3003,
    "sourceId": "MOB003",
    "name": "モブエラポン",
    "min": "D+",
    "max": "C",
    "strong": "sport",
    "reason": "沼で暮らす平たい尾の水辺型。総合力より水辺の運動を重視。"
  },
  "3004": {
    "id": 3004,
    "sourceId": "MOB004",
    "name": "モブヒヤリ",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "浮遊する氷の精霊。軽さを生かす飛行型。"
  },
  "3005": {
    "id": 3005,
    "sourceId": "MOB005",
    "name": "モブヌイガミ",
    "min": "C",
    "max": "C+",
    "strong": "brain",
    "reason": "フードの小さな影として、慎重な判断を得意にする。"
  },
  "3006": {
    "id": 3006,
    "sourceId": "MOB006",
    "name": "モブトドケ",
    "min": "C",
    "max": "B-",
    "strong": "running",
    "reason": "配達役の継続的な移動力を走る種目に反映。"
  },
  "3007": {
    "id": 3007,
    "sourceId": "MOB007",
    "name": "モブヒロイ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "拾い集める観察力を記憶と判断に反映。"
  },
  "3008": {
    "id": 3008,
    "sourceId": "MOB008",
    "name": "モブミハリ",
    "min": "C",
    "max": "B",
    "strong": "brain",
    "reason": "見張り役の集中と観察を得意にする。"
  },
  "3009": {
    "id": 3009,
    "sourceId": "MOB009",
    "name": "モブトモシ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "灯りを携えて周囲を確認する慎重な案内役。"
  },
  "3010": {
    "id": 3010,
    "sourceId": "MOB010",
    "name": "モブツギハギ",
    "min": "D+",
    "max": "C",
    "strong": "brain",
    "reason": "つぎはぎ細工の丁寧さを生かす入門寄りの技巧型。"
  },
  "3016": {
    "id": 3016,
    "sourceId": "MOB016",
    "name": "モブシオリ",
    "min": "C",
    "max": "B",
    "strong": "brain",
    "reason": "本を携えた読書家として頭脳種目を得意にする。"
  },
  "3017": {
    "id": 3017,
    "sourceId": "MOB017",
    "name": "モブユラリ",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "リボンと浮遊する姿から、空中での身軽さを重視。"
  },
  "3018": {
    "id": 3018,
    "sourceId": "MOB018",
    "name": "モブホノリ",
    "min": "C",
    "max": "B-",
    "strong": "power",
    "reason": "炎の精霊の勢いを力系種目に反映。"
  },
  "3019": {
    "id": 3019,
    "sourceId": "MOB019",
    "name": "モブケムリン",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "煙の軽さと浮遊を得意分野にする。"
  },
  "3020": {
    "id": 3020,
    "sourceId": "MOB020",
    "name": "モブスナラ",
    "min": "D+",
    "max": "C",
    "strong": "sport",
    "reason": "砂の小さな精霊として、運動に集中した控えめな総合力。"
  },
  "3021": {
    "id": 3021,
    "sourceId": "MOB021",
    "name": "モブハナミ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "花を見守る繊細さを観察と記憶に反映。"
  },
  "3022": {
    "id": 3022,
    "sourceId": "MOB022",
    "name": "モブアマネ",
    "min": "D+",
    "max": "C",
    "strong": "sport",
    "reason": "雨粒の身軽さを運動向きにする。"
  },
  "3023": {
    "id": 3023,
    "sourceId": "MOB023",
    "name": "モブスミト",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "墨の精霊の表現力と手順理解を頭脳型にする。"
  },
  "3024": {
    "id": 3024,
    "sourceId": "MOB024",
    "name": "モブカゼル",
    "min": "C",
    "max": "B+",
    "strong": "flying",
    "reason": "風を操る軽快さを強みに、調子による幅を広く取る。"
  },
  "3025": {
    "id": 3025,
    "sourceId": "MOB025",
    "name": "モブコケネ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "苔をまとう落ち着いた性格を慎重な判断に反映。"
  },
  "3026": {
    "id": 3026,
    "sourceId": "MOB026",
    "name": "モブユウヒ",
    "min": "C",
    "max": "C+",
    "strong": "power",
    "reason": "夕日の熱と明るさを力系の持ち味にする。"
  },
  "3027": {
    "id": 3027,
    "sourceId": "MOB027",
    "name": "モブシオナ",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "波のモチーフから、水辺を含む運動に向く設定。"
  },
  "3028": {
    "id": 3028,
    "sourceId": "MOB028",
    "name": "モブユメル",
    "min": "C+",
    "max": "B",
    "strong": "brain",
    "reason": "夢と魔法使いの姿を頭脳種目の安定感に反映。"
  },
  "3029": {
    "id": 3029,
    "sourceId": "MOB029",
    "name": "モブユラビ",
    "min": "C",
    "max": "B+",
    "strong": "flying",
    "reason": "揺れる霊火の空中機動を得意にし、成績幅は広め。"
  },
  "3030": {
    "id": 3030,
    "sourceId": "MOB030",
    "name": "モブイシマル",
    "min": "C+",
    "max": "B+",
    "strong": "power",
    "reason": "石の体の頑丈さを力系の強みにする。"
  },
  "3031": {
    "id": 3031,
    "sourceId": "MOB031",
    "name": "モブヌノヒラ",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "布の軽さとひらめきを飛行向きにする。"
  },
  "3032": {
    "id": 3032,
    "sourceId": "MOB032",
    "name": "モブサビネ",
    "min": "C",
    "max": "B",
    "strong": "power",
    "reason": "金属の装甲を力系の強みにし、総合力は中程度。"
  },
  "3033": {
    "id": 3033,
    "sourceId": "MOB033",
    "name": "モブツギト",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "つぎはぎと魔法使い風の技巧を判断型に反映。"
  },
  "3034": {
    "id": 3034,
    "sourceId": "MOB034",
    "name": "モブシロガネ",
    "min": "C+",
    "max": "B+",
    "strong": "power",
    "reason": "銀の装甲と安定した体格を力系の強みにする。"
  },
  "3035": {
    "id": 3035,
    "sourceId": "MOB035",
    "name": "モブレンガン",
    "min": "C+",
    "max": "B",
    "strong": "power",
    "reason": "レンガの重厚さを力仕事に反映。"
  },
  "3036": {
    "id": 3036,
    "sourceId": "MOB036",
    "name": "モブオビリン",
    "min": "D+",
    "max": "C+",
    "strong": "flying",
    "reason": "帯状の軽い体と浮遊を生かす飛行型。"
  },
  "3037": {
    "id": 3037,
    "sourceId": "MOB037",
    "name": "モブクモリ",
    "min": "D+",
    "max": "C",
    "strong": "flying",
    "reason": "雲の軽さを生かす入門寄りの飛行型。"
  },
  "3038": {
    "id": 3038,
    "sourceId": "MOB038",
    "name": "モブカケラ",
    "min": "C",
    "max": "B-",
    "strong": "power",
    "reason": "結晶の体の強さを力系種目に反映。"
  },
  "3039": {
    "id": 3039,
    "sourceId": "MOB039",
    "name": "モブマントル",
    "min": "C",
    "max": "B",
    "strong": "running",
    "reason": "マントを翻す身軽な姿を走る種目に反映。"
  },
  "3040": {
    "id": 3040,
    "sourceId": "MOB040",
    "name": "モブホツレ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "ほつれた布の小柄な技巧家として判断力を持ち味にする。"
  },
  "3041": {
    "id": 3041,
    "sourceId": "MOB041",
    "name": "モブスナリ",
    "min": "C",
    "max": "B",
    "strong": "power",
    "reason": "砂岩の大きな手足を力系の強みにする。"
  },
  "3042": {
    "id": 3042,
    "sourceId": "MOB042",
    "name": "モブヤギリ",
    "min": "C",
    "max": "C+",
    "strong": "sport",
    "reason": "山羊の足取りとバランスを運動に反映。"
  },
  "3043": {
    "id": 3043,
    "sourceId": "MOB043",
    "name": "モブツノマル",
    "min": "C+",
    "max": "B",
    "strong": "power",
    "reason": "角と力強い姿を力系種目に反映。"
  },
  "3044": {
    "id": 3044,
    "sourceId": "MOB044",
    "name": "モブモクレン",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "木の長老らしい落ち着きを記憶と判断に反映。"
  },
  "3045": {
    "id": 3045,
    "sourceId": "MOB045",
    "name": "モブペタン",
    "min": "D+",
    "max": "C",
    "strong": "sport",
    "reason": "柔らかく小柄な体を生かす入門寄りの運動型。"
  },
  "3046": {
    "id": 3046,
    "sourceId": "MOB046",
    "name": "モブサラリ",
    "min": "C",
    "max": "B",
    "strong": "running",
    "reason": "斑点のある俊敏な獣の姿を走る種目に反映。"
  },
  "3047": {
    "id": 3047,
    "sourceId": "MOB047",
    "name": "モブヒソネ",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "夜の静かな観察者として集中力を持ち味にする。"
  },
  "3048": {
    "id": 3048,
    "sourceId": "MOB048",
    "name": "モブコロガネ",
    "min": "C+",
    "max": "B+",
    "strong": "power",
    "reason": "金属の拳と重厚な姿を力系の強みにする。"
  },
  "3049": {
    "id": 3049,
    "sourceId": "MOB049",
    "name": "モブミミズク",
    "min": "C",
    "max": "B",
    "strong": "flying",
    "reason": "ミミズクの翼を飛行種目に反映。"
  },
  "3050": {
    "id": 3050,
    "sourceId": "MOB050",
    "name": "モブクルリン",
    "min": "C",
    "max": "B+",
    "strong": "sport",
    "reason": "軽快に回転する曲芸的な姿を運動に反映。"
  },
  "3101": {
    "id": 3101,
    "sourceId": "SWEET01",
    "name": "モブラムネクーリエ",
    "min": "D+",
    "max": "C+",
    "strong": "running",
    "reason": "ラムネの配達役。Rでも配達の足を得意にする。"
  },
  "3102": {
    "id": 3102,
    "sourceId": "SWEET02",
    "name": "モブキャラメルフォージ",
    "min": "C",
    "max": "B-",
    "strong": "power",
    "reason": "キャラメルを鍛える工房役。職人の力仕事を反映。"
  },
  "3103": {
    "id": 3103,
    "sourceId": "SWEET03",
    "name": "モブコンペイトスター",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "星形の菓子と魔法使いの技巧を判断力に反映。"
  },
  "3104": {
    "id": 3104,
    "sourceId": "SWEET04",
    "name": "モブセンベイガード",
    "min": "C",
    "max": "C+",
    "strong": "power",
    "reason": "せんべいの盾を構える守備役。安定寄りの力系。"
  },
  "3105": {
    "id": 3105,
    "sourceId": "SWEET05",
    "name": "モブウエハースミューズ",
    "min": "D+",
    "max": "C",
    "strong": "brain",
    "reason": "ウエハースの楽器を操る表現者。手順理解を強みにする。"
  },
  "3106": {
    "id": 3106,
    "sourceId": "SWEET06",
    "name": "モブドロップタンブラー",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "ドロップ上で回る曲芸役。Rでも運動上限を高めにする。"
  },
  "3107": {
    "id": 3107,
    "sourceId": "SWEET07",
    "name": "モブショココイン船長",
    "min": "C",
    "max": "B",
    "strong": "brain",
    "reason": "ショココイン船長の判断と統率を反映。SRを補助材料にする。"
  },
  "3108": {
    "id": 3108,
    "sourceId": "SWEET08",
    "name": "モブモナカオニパティシエ",
    "min": "C",
    "max": "B+",
    "strong": "power",
    "reason": "大きなモナカを扱う職人の力を強みにする。"
  },
  "3109": {
    "id": 3109,
    "sourceId": "SWEET09",
    "name": "モブゼリールミナリス",
    "min": "C+",
    "max": "B",
    "strong": "brain",
    "reason": "SSRの光を操る技巧家として、判断力を安定させる。"
  },
  "3110": {
    "id": 3110,
    "sourceId": "SWEET10",
    "name": "モブワタアメ雲龍王",
    "min": "C+",
    "max": "B+",
    "strong": "flying",
    "reason": "URの雲龍王の浮遊を強みにするが、上限はB+に抑える。"
  },
  "3111": {
    "id": 3111,
    "sourceId": "SWEET11",
    "name": "ふがしバウンダー",
    "min": "D+",
    "max": "C+",
    "strong": "sport",
    "reason": "ふがしで弾む身軽な運動型。"
  },
  "3112": {
    "id": 3112,
    "sourceId": "SWEET12",
    "name": "きなこスラッガー",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "きなこのバットを操る打者。Rでも競技適性を高めにする。"
  },
  "3113": {
    "id": 3113,
    "sourceId": "SWEET13",
    "name": "ピーピーローラー",
    "min": "D+",
    "max": "C+",
    "strong": "sport",
    "reason": "ローラーのバランスを運動に反映。"
  },
  "3114": {
    "id": 3114,
    "sourceId": "SWEET14",
    "name": "バブルホッパー",
    "min": "D+",
    "max": "C",
    "strong": "flying",
    "reason": "泡で跳ぶ軽さを飛行に反映し、総合力は控えめ。"
  },
  "3115": {
    "id": 3115,
    "sourceId": "SWEET15",
    "name": "むぎチョコスクーパー",
    "min": "C",
    "max": "C+",
    "strong": "power",
    "reason": "むぎチョコをすくう道具仕事を力系に反映。"
  },
  "3116": {
    "id": 3116,
    "sourceId": "SWEET16",
    "name": "ボーロバランサー",
    "min": "D+",
    "max": "C+",
    "strong": "sport",
    "reason": "ボーロを積んで保つバランス感覚を運動に反映。"
  },
  "3117": {
    "id": 3117,
    "sourceId": "SWEET17",
    "name": "カステラフリッパー",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "SRのフリッパーとして返し技の器用さを運動に反映。"
  },
  "3118": {
    "id": 3118,
    "sourceId": "SWEET18",
    "name": "ヌードルビート",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "SRでも音と手順に強みを寄せ、総合上限は控えめ。"
  },
  "3119": {
    "id": 3119,
    "sourceId": "SWEET19",
    "name": "ヨーグルクライマー",
    "min": "C+",
    "max": "B",
    "strong": "running",
    "reason": "SSRのクライマーとして持続的な移動を強みにする。"
  },
  "3120": {
    "id": 3120,
    "sourceId": "SWEET20",
    "name": "りんごアメノツルギ",
    "min": "C",
    "max": "B+",
    "strong": "power",
    "reason": "URの剣士の一撃を強みにし、下限はCで波を残す。"
  },
  "3121": {
    "id": 3121,
    "sourceId": "SWEET21",
    "name": "かりんとうアクロバット",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "曲芸師のバランスを強みにする。Rの中でも運動向き。"
  },
  "3122": {
    "id": 3122,
    "sourceId": "SWEET22",
    "name": "きびだんご旅人",
    "min": "D+",
    "max": "C+",
    "strong": "running",
    "reason": "旅人の歩き続ける持久力を走る種目に反映。"
  },
  "3123": {
    "id": 3123,
    "sourceId": "SWEET23",
    "name": "ビスケット彫刻家",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "彫刻家の観察と工程理解を頭脳種目に反映。"
  },
  "3124": {
    "id": 3124,
    "sourceId": "SWEET24",
    "name": "ポン菓子屋台番",
    "min": "C",
    "max": "C+",
    "strong": "power",
    "reason": "屋台の大きな道具を扱う力仕事を反映。"
  },
  "3125": {
    "id": 3125,
    "sourceId": "SWEET25",
    "name": "ミルク飴マジシャン",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "飴の手品師の手順と判断を持ち味にする。"
  },
  "3126": {
    "id": 3126,
    "sourceId": "SWEET26",
    "name": "水あめ職人",
    "min": "C",
    "max": "B",
    "strong": "brain",
    "reason": "水あめ職人の熟練した段取りを頭脳種目に反映。"
  },
  "3127": {
    "id": 3127,
    "sourceId": "SWEET27",
    "name": "あんず棒スケーター",
    "min": "C",
    "max": "B+",
    "strong": "sport",
    "reason": "SRのスケーターの滑走とバランスを強みにする。"
  },
  "3128": {
    "id": 3128,
    "sourceId": "SWEET28",
    "name": "梅ジャム絵師",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "SRの絵師として技巧に特化し、総合上限は控えめ。"
  },
  "3129": {
    "id": 3129,
    "sourceId": "SWEET29",
    "name": "渦巻きキャンディ指揮者",
    "min": "C+",
    "max": "B",
    "strong": "brain",
    "reason": "SSRの指揮者の記憶と判断を安定した強みにする。"
  },
  "3130": {
    "id": 3130,
    "sourceId": "SWEET30",
    "name": "たい焼き船長",
    "min": "C",
    "max": "B+",
    "strong": "sport",
    "reason": "URの船長として乗りこなす運動力を強みにし、波を残す。"
  },
  "3201": {
    "id": 3201,
    "sourceId": "RETRO01",
    "name": "モブピクセルランナー",
    "min": "C",
    "max": "B",
    "strong": "running",
    "reason": "横スクロールの走者として走る種目を得意にする。"
  },
  "3202": {
    "id": 3202,
    "sourceId": "RETRO02",
    "name": "モブブロックビルダー",
    "min": "C",
    "max": "B-",
    "strong": "brain",
    "reason": "ブロック配置のパズル役として判断を得意にする。"
  },
  "3203": {
    "id": 3203,
    "sourceId": "RETRO03",
    "name": "モブパドルガード",
    "min": "D+",
    "max": "C+",
    "strong": "sport",
    "reason": "パドル操作の反射と位置合わせを運動に反映。"
  },
  "3204": {
    "id": 3204,
    "sourceId": "RETRO04",
    "name": "モブコインサーチ",
    "min": "D+",
    "max": "C+",
    "strong": "brain",
    "reason": "コイン探索の観察力を頭脳種目に反映。"
  },
  "3205": {
    "id": 3205,
    "sourceId": "RETRO05",
    "name": "モブビットシューター",
    "min": "C",
    "max": "B",
    "strong": "flying",
    "reason": "シューティングの空中機動を飛行に反映。"
  },
  "3206": {
    "id": 3206,
    "sourceId": "RETRO06",
    "name": "モブドットレーサー",
    "min": "C",
    "max": "B",
    "strong": "sport",
    "reason": "レーサーの乗り物操作と反応を運動に反映。"
  },
  "3207": {
    "id": 3207,
    "sourceId": "RETRO07",
    "name": "モブセーブキーパー",
    "min": "D+",
    "max": "C",
    "strong": "brain",
    "reason": "セーブを守る慎重な管理役。総合力より判断を重視。"
  },
  "3208": {
    "id": 3208,
    "sourceId": "RETRO08",
    "name": "モブコンボファイター",
    "min": "C+",
    "max": "B",
    "strong": "power",
    "reason": "SRのコンボ格闘家として力系に安定した強みを持つ。"
  },
  "3209": {
    "id": 3209,
    "sourceId": "RETRO09",
    "name": "モブアーケードキング",
    "min": "C+",
    "max": "B+",
    "strong": "brain",
    "reason": "SSRのアーケード王として戦況判断を強みにする。"
  },
  "3210": {
    "id": 3210,
    "sourceId": "RETRO10",
    "name": "モブラストダンジョン",
    "min": "C",
    "max": "B+",
    "strong": "brain",
    "reason": "SSRの最終ダンジョン役として策略を強みにし、成績幅を残す。"
  }
};
// Edit min, max, strong and reason above; rank is derived from the two endpoints.
for(const p of Object.values(profiles))p.rank=p.min+'-'+p.max;
// Normal events draw uniformly across the entire range. An existing matching
// game trait draws uniformly across its upper half, never above the maximum.
function resolve(id,traits={},random=Math.random){const p=profiles[id];if(!p)return null;const hi=order.indexOf(p.max),base=order.indexOf(p.min),lo=traits[p.strong]?Math.ceil((base+hi)/2):base;return order[lo+Math.floor(random()*(hi-lo+1))];}
const api={order,profiles,resolve};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MobPieceRanks=api;
})(typeof window!=='undefined'?window:globalThis);
