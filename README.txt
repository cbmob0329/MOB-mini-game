MOB QUEST playable core v86
- サブクエストは各エリアでQUEST 1→2→3→4→5の順番制へ変更
- 未解放QUESTとクリア済みQUESTはメニューから非表示
- サブクエストのエリア名を開始時に固定保存し、草原表記へ戻る不具合を修正
- サブクエスト画面の「このサブクエストは～」説明文を削除
- 未実装だったサブクエスト報酬付与処理を正式実装
- 砂漠QUEST 3などクリア時に演出へ進まず停止する不具合を修正
- クリア処理の二重実行・連打を防止

MOB QUEST playable core v85
- サブクエスト専用のSUB QUEST CLEAR演出を追加
- 報酬表示の \n 文字化けを廃止し、報酬を独立行で表示
- サブクエスト上部ヘッダーの縦崩れを修正
- ベージュ系クリア/報酬カードは濃い文字で固定

MOB QUEST playable core v84
- サブクエスト追加: ネオン街Q3-5 / マグマQ1-5 / 海底Q1-5 / 草原II Q1-5
- 確定済みサブクエスト34本プレイ可能、未確定26本は設定待ち
- サブクエストのベージュUIを黒文字へ固定
- 城の施設移動をロード→背景描画→会話の順へ修正
- 冒険中のHOME移動を禁止し「冒険を諦める」を追加
- 冒険を諦めた場合、冒険開始後の報酬・EXP・イベント進行等を完全ロールバック

MOB QUEST playable core v83
- トレーニングに「サブクエスト」(icon/24.png)を追加
- サブクエストはメインエリアクリア後に解放・一度クリアすると再挑戦不可
- 確定済みサブクエストは会話→敵出現→戦闘→会話→CLEAR→報酬一覧まで実装
- 未確定の報酬/会話があるクエストは内容を捏造せず「設定待ち」でロック
- 防具67種(bogu/01.png～67.png)を追加。防具は購入不可、ドロップ/サブクエスト入手のみ
- 防具1枠を装備画面へ追加。ステータス・耐性・特殊効果を戦闘へ反映
- 鍛冶屋に売却を追加：武器20%、防具100%
- 5体同時戦闘レイアウトを追加
- 最新武器88種・メイン/サブ武器・メダル3枠仕様を維持

MOB QUEST playable core v82
- 最初の草原の全滅救済を1回→最大2回へ変更
- 1回目・2回目は全メンバーHP/MP全回復、ダウン解除、状態異常解除、そのまま戦闘続行
- 3回目の全滅から通常DEFEAT処理
- 救済回数を0/1/2で保存し、キャンプのチェックポイント復元でも回数が巻き戻らないよう修正
- 旧セーブの firstGrassReviveUsed=true は1回使用済みとして互換処理
- 救済演出文は従来指定の「これは物語の始まり」「まだ全滅するわけにはいかない！」「1度だけ全回復する！」を維持

MOB QUEST playable core v81
- 最初の草原の通常敵Lvを再調整
- モブスライム Lv1-3 / モブロック Lv2-3 / モブジョーロ Lv3 / モブテンデビ Lv2-3
- モブバード Lv1-3 / ピヨミドリ・レッド Lv2-3 / モブビーバー Lv2
- AREA1: モブビーバーLv3×2 + モブサバンナLv5（サバンナ中央）
- AREA2: モブイワキリLv6
- AREA3: モブアックスLv6
- AREA4: モブホークLv8
- 専用技: サバンナダンス / イワキリサンダー / アックススクラッチ / ホークダイブを指定属性・小ダメージ帯へ統一

8/31 starter balance + readability update
- 初期所持金を0G、ダイヤを0へ変更
- オープニング終了時に15,000G＋モブテント×2を支給する演出を追加
- 最初の草原の通常戦・探索遭遇は敵最大2体（イベント戦は従来仕様）
- 最初の草原で初回全滅時のみ、物語救済イベントでパーティー全員HP/MP全回復・復活
- レベルアップ時のステータス上昇値を高コントラスト化
- 探索結果バナーを全エリア共通でベージュ背景＋黒文字へ変更

MOB QUEST playable core v79
- 技素材最新版を反映（魔法/特技/状態異常/全体魔法）
- 必殺技は既存の正方形カットイン＋枠なぞりを固定し、その後に指定skill/skill2アニメーションを再生
- パッシブ最新版を反映（勇者の使命、デザート10%、デンデン10%など）
- 砂漠Ⅱ AREA3 四人衆30%復活時の戦闘中セリフ演出を復旧
- 会心の一撃！を先に表示してからダメージ数値を表示
- 戦闘中セリフ表示時間を延長
- 勝利演出をベージュ枠＋黒文字で強化
- 魔法/特技/必殺技に使用確認を追加
- 特技アイコン/エフェクトサイズを他コマンドと統一

MOB QUEST playable core v78

- オープニング黒字幕を単一常駐レイヤー化。各メッセージ間のロード画面表示を廃止
- オープニング連打を220msゲートで抑止し、二重進行/フリーズを防止
- オープニング字幕の「タップで進む」を削除
- 日本語共通改行を再設計。語中分割・1〜2文字孤立・短すぎる末尾行を防止
- 王の間の吹き出しを実寸計測して話者頭上へ配置し、余白を縮小
- HOME説明を画面下側へ移動し、横長コンパクト表示へ変更
- トレーニングコーチ初回説明を読みやすい2メッセージへ整理
- バトルプログラムの白背景/白文字競合を解消
- 敵近接攻撃の突進を一段階・一回の直進モーションへ変更

MOB QUEST playable core v77
- NOW LOADING / START CHECK 停止を根本修正
- index.htmlにCSS・data.js・game.jsを直接内包し、外部JS読み込み失敗を回避
- 初期画面をタイトルに変更し、起動失敗時もローダー永久停止しない
- 初期セットアップをtry/catch化し、タイトルのNEW/CONTINUE/設定だけは必ず再バインド
- NEW GAME時の黒背景オープニングガードをv77へ更新
- v76までの会話、トレーニング配色、酒場ロック、v75戦闘モーションを維持

MOB QUEST playable core v76

v76 dialogue/opening/contrast hotfix
- Opening prologue restored to pure black background + white text; removed NARRATION label/card.
- King dialogue in opening is anchored speech, not narration.
- Opening Mob Pink runs into the throne room and speaks from the scene.
- HOME tutorial bubble reduced and moved above menu icons.
- Facility dialogue now uses balanced Japanese line breaking; 1-2 character orphan lines are prevented.
- Castle speech bubble width is content-based, reducing unexplained right-side whitespace.
- Tavern figure shop button is forcibly hidden before desert clear.
- Training contrast rules locked for Gold/EXP/Boss/Battle Program.

MOB QUEST playable core v75
- 敵攻撃を味方側へ大きく突進するダッシュモーションへ修正
- 敵被弾を赤フラッシュ＋敵ユニット全体シェイクへ修正
- 冒険パーティー画像の端につながった白背景を実行時に透過除去（既存の透過PNGはそのまま保持）
- 冒険パーティーのbutton/img背景・枠・影由来の白矩形も強制解除
- v74までのcanonical仕様・回帰修正を維持

- タイトル画面に v74 を表示
- GAME_ASSET_VERSION を74へ統一
MOB QUEST playable core v74 - CANONICAL REGRESSION FIX

- v73の統合作業を継続して完成。過去仕様を落とさない回帰チェックを実施
- 冒険画面の勇/桃/砂などの1文字記号をDOM生成側から完全撤去
- 8/25指定の大魔法アニメ順へ再固定：ゴレマガーディ 41→43→44→45 / ホクマウィング 47→51→53→52 / ネオマニプール 57→58→59→60
- 戦闘外の冒険画面・キャンプ状態確認からキャラクター詳細（ステータス/使用可能魔法/特技/装備/習得済み必殺技）を開けるよう実装
- 持ち物・キャンプ確認を白背景ナレーションへ統一、対象HP/MPと健康/負傷/ダウン色を強化
- 魔法/特技/アイテム一覧の閉じるヘッダーを追従化
- 鍛冶屋初回説明を8/24正式全文へ戻し、購入/錬成確認とメダル入手をナレーション化
- 最新オープニング全文を実装。プロローグナレーション→王の間→タイトル→HOME案内。テストモードではスキップ選択可能
- CSS/JSキャッシュをv74へ更新
- SPEC_REGRESSION_CHECKLIST_v74.txt を同梱
- 最終回帰検査で追加修正：探索/キャンプのエリア別横木目を復旧し、砂漠ベージュの探索文字を濃色・影なしへ固定
- 戦闘中の敵会話カットインは最低1.15秒以上表示。戦闘開始表示は1秒を維持
- お城メニューを正式な2+3配置へ再固定、明るい背景上の文字は黒へ固定
- 王への報告中は王/ライトアーム再タップをロックし、イベント重複発火を防止
- 部族村イベント専用のパーティーサイズ/モブジェシー位置補正を復旧
- 草原IIのモブテツ加入イベントを最新版で復旧。「魔王を討伐すべく旅をしているでござる！」へ短縮
- モブテツ加入後の部族村・田舎町II・ネオン街II・マグマIIの参加台詞を復旧
- テストチャプター開始時は join / joinKeepGuest / joinSilent を共通走査し、モブネコクー・モブテツ・モブジェシー・モブリーロ等を開始地点に応じて復元
- モブリリスの戦闘表示倍率を上げ、過小表示を防止
- 納品前の静的回帰検査 73/73 PASS

MOB QUEST playable core v73 - CANONICAL BASELINE

この版は8/18、8/19、8/24、8/25、最新ボス、最新冒険イベント1/2、最新技素材、最新フィギュア仕様をマスターとして統合。
古い再構築版へ戻さないため、SPEC_REGRESSION_CHECKLIST_v73.txtを同梱。
未確定のガチャ排出率・必要ダイヤ、バトルプログラムSeason3以降の具体的プログラム、未提供メダル画像/実データは創作していません。

MOB QUEST playable core v72

8/27 会話・鍛冶屋・魔王城イベント・トレーニング再発修正版
- 施設会話の共通折返し処理を修正。1文字だけ次行になる改行を防止し、短い台詞では吹き出し幅も自動縮小
- モブスライムキング / モブライトアームの王の間吹き出しをキャラクター近くへ再配置
- ゴールド/経験値/ボスターンテーブルの文字色をモード別に最終上書きし、disabled時も可読性を維持
- 鍛冶屋を専用画面へ復旧。ゴンゾーをタップすると「武器購入 / メダル錬成」だけを表示し、フィギュア経路を完全分離
- 鍛冶屋の武器購入とメダル錬成を実動作へ復旧
- 魔王城 arrival / Area1〜Area4 のイベントキーを復旧。到着時モブエース戦と戦後魔王登場イベントを再実装
- ストーリー戦闘終了表示を固定「3 TURN」ではなく、通常のイベント戦は EVENT BATTLE CLEAR に修正
- キャッシュバージョンを72へ更新し、古いCSSが残る再発を防止

MOB QUEST playable core v71
- 施設会話の改行処理を共通修正。入力改行をレイアウト改行として扱わず、文末単位でページ化
- 王の間の王様/ライトアーム吹き出し位置と幅を共通補正
- トレーニング3種の配色に文字コントラスト固定ルールを追加（Gold/EXP/Boss）
- 鍛冶屋を装備画面から完全分離。専用画面 + 武器購入/メダル錬成ポップアップへ復旧
- 鍛冶屋からフィギュアへ遷移する経路を撤廃
- 魔王城の到着イベントとAREA1～4のイベントキーを復旧

MOB QUEST v70 退行修正・機能復旧版

今回の修正
- 戦闘開始処理を復旧。開始演出を約1秒表示してからターン開始
- タイトル画面 NEW / CONTINUE / 設定 を復旧
- NEW再起動ループを防止
- テストモードにチャプター＋AREA選択を復旧
- 装備画面と持ち物画面を復旧
- 持ち物を アイテム / 装備 / 防具 / フィギュア / メダル のカテゴリ式ポップアップへ変更
- フィギュア装備はスロットタップ→専用ポップアップ方式
- お城に鍛冶屋を追加し、画面へ入ってからモブゴンゾーが会話する順番へ修正
- 鍛冶屋 / 宿舎 / 酒場 / MOB SHOP / トレーニングの施設会話を吹き出し表示へ統一
- 施設会話の文字を途中で強制分割する処理を撤廃。文字数に応じて自動縮小して枠内へ収める
- トレーニングポップアップ：ゴールド=ベージュ、経験値=ブルー、ボス=パープル
- お城の施設メニュー文字を黒系へ変更
- CSS/JSキャッシュバージョンをv70へ更新

重要
- このZIPはHTML単体ではなく index.html / js/game.js / js/data.js / css/style.css / README.txt を含むフルコード一式です。
- 画像フォルダは従来どおりゲーム本体側の素材フォルダを使用してください。

MOB QUEST v60
バトルプログラム追加版

MOB QUEST playable core v46

今回の更新
- 最新「ボス(6)」の敵編成・攻撃種別を反映
- 未指定だった敵の通常攻撃を物理/魔法へ明示分類
- 未指定だったボス必殺を物理/魔法/精神/物理&魔法へ補完
- 中ボスは基本1～2回行動
- 中ボスの側近は1回行動
- 複数の中ボス本人が同時初登場する編成は、それぞれ1～2回行動
- ボスは従来通り2～3回行動
- モブフレザード / モブジョーンズ / モブバイオリンは資料通り確定2回行動
- 後のエリアで通常モンスター扱いになった旧中ボスは1回行動
- 部族村ボスは片方を倒した時点で両方が第二形態へ移行しHP全回復
- マグマ合体後、部族村変身後の戦闘中カットイン会話追加
- 最新ストーリーの砂漠・田舎町・マグマ・海底・部族村更新を反映
- 田舎町IIの到着～AREA4ボス後までイベント追加
- テストモードでキャラクター別Lv1～120設定可能
- テストモード「アイテムMAX」で消耗品/テント/ドリンク/レコード/武器/メダルをMAX化

注意
- 最新ストーリー資料は「ネオン街II」の見出しで終了しているため、その先の新規会話は追加していません。
- 既存の必殺技演出、武器、ターンテーブル、キャンプ、探索、RESULT、育成仕様は保持しています。


[v46 hotfix]
- Fixed battle transition freeze at NOW LOADING / READY caused by missing WEAPON_STAT_KEYS after weapon-data refactor.
- Restored weapon stat application key list used when building player battle stats.


[v47]
- ボス(7)・冒険イベント(3)を反映
- ネオン街II / マグマIIのイベント追加
- ネオマスターHP70%/40%戦闘カットイン
- モブドラゴンII→モブギドラ戦闘中変身
- 海底報酬にモブトマトジュースセット追加
- ネオン街II AREA1側近・マグマII敵名/2回行動修正

[v49 2026-08-19]
- 施設導入：酒場 / お城 / 鍛冶屋 / トレーニング / 魔法錬成（準備中） / モブショップ（商品仕様待ち）
- 担当キャラ会話：play/001～005.png を施設会話・退出バナーに使用
- 酒場：大アイコン式メニュー（パーティー編成 / ドリンク購入 / HOME）、ドリンクはポップアップ化
- 酒場編成：メイン=赤、スーパーサブ=緑、サブ=青の区分をベージュバナーで表示
- 鍛冶屋：モブゴンゾー初回/再訪会話、メダル錬成候補は未装備3個以上のみ、3秒カンカン演出を追加
- トレーニング：通常時は 冒険日記 / 経験値 / ゴールド / ボス / HOME の5大アイコン
- テスト戦闘はテストモードON時のみ6つ目のアイコンとして表示
- 各ターンテーブル初回説明をモブコーチで表示
- 推奨Lv・レコード必要数・難易度情報を大きく表示
- 戦闘パーティーHPバー追加：>60%緑 / 31～60%オレンジ / 30%以下赤

[v50 2026-08-19]
- 施設初回/再訪会話を改行単位の1行ずつ画面タップ進行へ変更
- 施設・ダイアログ・推奨Lv/必要レコード等の文字を拡大
- トレーニングを大アイコン中心へ再設計、HOMEをモブコーチ横へ移動、アイコンは枠なし＋微小フロート
- 冒険日記/経験値/ゴールド/ボスターンテーブルをポップアップ表示
- テスト戦闘はテストモードON時のみ表示、OFF時は戦闘開始UIも完全非表示
- 酒場パーティー編成をポップアップ＋2人タップ入れ替え式へ簡略化
- キャンプ編成の案内も同じ2人タップ方式へ統一
- ドリンク購入後「ありがとうございます🎵」を表示
- メダル枠は所持メダルのみ選択可能。通常武器をメダルとして表示/装着しないよう防御を追加
- 武器特性は維持し、武器ステータスのみ全体を少し低下。最上位120級は約90以内に抑制


v51: レコード消費確認、レコードエリア退出ロック、戦闘開始安定化、探索アイテム表示時間延長、施設会話改行改善、酒場ドリンク木製ベージュ、冒険日記メタリックオレンジ。

v52: 戦闘開始時エラー修正、施設1行会話の不自然な端数改行修正、ドリンクショップ文字コントラスト改善。

v53: お城を正式な4施設メニューへ更新（王の間 / 宿舎 / MOB SHOP / レコードルーム）。王の間にモブスライムキング・モブライトアームを配置してタップ会話、宿舎にモブミータの全回復、MOB SHOPにモブマテリアとitem/01～18の購入、レコードルームLOCKを追加。MOB SHOPはピンク/青木目UI、購入後「毎度あり！」、各サブルームHOMEは城メニューへ戻る。

v59 deployment recovery:
- index.html / css/style.css / js/data.js / js/game.js are clean full-replacement files.
- Do not merge index.html with an older branch; replace the file to avoid Git conflict markers.


v60 figure accessory system:
- Added 60 figure accessories (fig/01.png - fig/60.png) and 31 resonance tags.
- Each character can equip up to four figures. Figure stat bonuses and supported traits affect battle/progression/exploration.
- Resonance is calculated per character only; 3-figure effects replace rather than stack with 2-figure effects.
- Added equipment Figure tab, acquisition/rarity/tag sorting, rarity/tag filtering, all-tag display, active resonance display, detailed resistance/effect status, and resonance activation banner.
- Test-mode MAX now grants all figures for verification. Normal acquisition is intentionally left to future gacha/event implementation.


v62: Updated figure definitions through No.74, revised resonance values/tags, decimal figure effects, status-all resistance, and pending No.62 handling.