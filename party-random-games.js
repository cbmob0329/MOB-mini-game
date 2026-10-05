/* User-approved displayed game numbers. Never legacy indices. */
(function(root){'use strict';
const ALLOWED=[
  {
    "no": 1,
    "key": "reaction",
    "title": "モブくんの反射神経"
  },
  {
    "no": 3,
    "key": "puzzle",
    "title": "モブくん12"
  },
  {
    "no": 4,
    "key": "launch",
    "title": "モブくん人形空を飛ぶ"
  },
  {
    "no": 5,
    "key": "stack",
    "title": "グラグラモブくん"
  },
  {
    "no": 6,
    "key": "breakdance",
    "title": "モブくん1990にチャレンジ"
  },
  {
    "no": 7,
    "key": "factory",
    "title": "モブくん人形大人気"
  },
  {
    "no": 8,
    "key": "catcher",
    "title": "モブくんキャッチャー"
  },
  {
    "no": 9,
    "key": "tidy",
    "title": "モブくん整理整頓"
  },
  {
    "no": 10,
    "key": "ski",
    "title": "モブくんスキージャンプ"
  },
  {
    "no": 11,
    "key": "slot",
    "title": "モブくんスロット"
  },
  {
    "no": 12,
    "key": "pk",
    "title": "モブくんPK"
  },
  {
    "no": 13,
    "key": "cut",
    "title": "モブくんカットゲーム"
  },
  {
    "no": 14,
    "key": "errand",
    "title": "お使いモブくん"
  },
  {
    "no": 16,
    "key": "mobStop",
    "title": "モブくんストップ"
  },
  {
    "no": 17,
    "key": "overlap",
    "title": "重なるモブくん"
  },
  {
    "no": 20,
    "key": "parachute",
    "title": "モブくんとパラシュート"
  },
  {
    "no": 22,
    "key": "brake",
    "title": "モブくんブレーキチキンレース"
  },
  {
    "no": 24,
    "key": "bomb",
    "title": "爆弾チキンレース"
  },
  {
    "no": 26,
    "key": "jumpingMob",
    "title": "ジャンピングモブくん"
  },
  {
    "no": 27,
    "key": "heroMaybe",
    "title": "モブくんは勇者かも"
  },
  {
    "no": 29,
    "key": "planetEnergy",
    "title": "モブくんは破壊神"
  },
  {
    "no": 30,
    "key": "painter",
    "title": "モブくんは画家志望"
  },
  {
    "no": 31,
    "key": "bikeJump",
    "title": "モブくんバイクで飛ぶ"
  },
  {
    "no": 32,
    "key": "mobTrain",
    "title": "モブくん列車出発進行！"
  },
  {
    "no": 33,
    "key": "giantMob",
    "title": "巨大モブくん大進撃"
  },
  {
    "no": 37,
    "key": "blackjackMob",
    "title": "ブラックジャックの決戦"
  },
  {
    "no": 38,
    "key": "mobIssen",
    "title": "モブくん一閃"
  },
  {
    "no": 43,
    "key": "mobRacePredict",
    "title": "モブくんレースだれが勝つ!?"
  },
  {
    "no": 47,
    "key": "toyOnOff",
    "title": "モブくんおもちゃON or OFF"
  },
  {
    "no": 49,
    "key": "amidakujiMob",
    "title": "モブくんのあみだくじ"
  },
  {
    "no": 54,
    "key": "mobDice",
    "title": "モブくんのサイコロ"
  },
  {
    "no": 57,
    "key": "cardShop",
    "title": "モブくんカードショップ"
  },
  {
    "no": 58,
    "key": "bungeeMob",
    "title": "モブくんバンジー"
  },
  {
    "no": 64,
    "key": "changeMob",
    "title": "モブくん何が変わった？"
  },
  {
    "no": 66,
    "key": "treasureMob",
    "title": "モブくん宝箱どれだ!?"
  },
  {
    "no": 77,
    "key": "monsterBoxMob",
    "title": "モブくんモンスターボックスに挑む"
  },
  {
    "no": 84,
    "key": "mobPinball",
    "title": "モブくんピンボール"
  },
  {
    "no": 86,
    "key": "longJumpMob",
    "title": "モブくんの走り幅跳び"
  },
  {
    "no": 89,
    "key": "bowlingMob",
    "title": "モブくんボウリング"
  },
  {
    "no": 90,
    "key": "waterSkip",
    "title": "モブくん水切り"
  },
  {
    "no": 91,
    "key": "tamaireMob",
    "title": "モブくん玉入れ"
  },
  {
    "no": 108,
    "key": "tableclothPull",
    "title": "モブくんのテーブルクロス引き"
  },
  {
    "no": 109,
    "key": "bombPassMob",
    "title": "モブくんの爆弾ゲーム"
  },
  {
    "no": 112,
    "key": "frontFlipMob",
    "title": "モブくんの前宙"
  },
  {
    "no": 117,
    "key": "poiGameMob",
    "title": "モブくんのポイゲーム"
  },
  {
    "no": 118,
    "key": "cleaningMob",
    "title": "モブくんのお掃除"
  },
  {
    "no": 120,
    "key": "ohajikiMob",
    "title": "モブくんのおはじき"
  },
  {
    "no": 131,
    "key": "mergeMob",
    "title": "モブくんマージ"
  },
  {
    "no": 163,
    "key": "bananaBoatMob",
    "title": "モブくんのそんなバナナ"
  },
  {
    "no": 164,
    "key": "warpedWallMob",
    "title": "モブくんのそり立つ壁"
  },
  {
    "no": 165,
    "key": "santaClausMob",
    "title": "モブくんはサンタクロース"
  },
  {
    "no": 166,
    "key": "juiceArcadeMob",
    "title": "モブくんのピッタリジュース"
  },
  {
    "no": 167,
    "key": "rallyArcadeMob",
    "title": "モブくんラリー"
  },
  {
    "no": 168,
    "key": "potteryArcadeMob",
    "title": "モブくんろくろの名人"
  },
  {
    "no": 169,
    "key": "galaxyArcadeMob",
    "title": "モブくんギャラクシー"
  },
  {
    "no": 171,
    "key": "lockArcadeMob",
    "title": "モブくんのくるくるロック"
  },
  {
    "no": 172,
    "key": "shieldArcadeMob",
    "title": "モブくんシールド360"
  },
  {
    "no": 173,
    "key": "dockingArcadeMob",
    "title": "モブくんの宇宙ドッキング"
  },
  {
    "no": 174,
    "key": "cargoArcadeMob",
    "title": "モブくんの吊り荷ピタッ"
  }
];
function sample(items,n,random=Math.random){const a=[...new Set(items)];for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n)}
function draw(count=1,random=Math.random,pool=ALLOWED.map(g=>g.key)){const eligible=ALLOWED.map(g=>g.key).filter(k=>pool.includes(k));if(eligible.length<5)throw Error('Five approved candidates required');const choices=sample(eligible,5,random);return {choices,selected:sample(choices,count,random)}}
const api={ALLOWED,sample,draw};if(typeof module!=='undefined')module.exports=api;if(root)root.MobRandomGames=api;
})(typeof window==='undefined'?null:window);
