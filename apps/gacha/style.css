/* =========================
  リセット・基本
========================= */

/*paddingとborderを幅と高さに含める*/
* {
  box-sizing: border-box;
}

body {
  /*ブラウザ標準の余白を消す*/
  margin: 0;
  /*画面の高さ100%を確保*/
  min-height: 100vh;
  /*グラデーション背景*/
  /*radial-gradient → 円形グラデーション
  circle at top → 上から広がる*/
  background: radial-gradient(circle at top, #fff7f0, #f4e8ff 35%, #cfe4ff 100%);
  /*文字の色*/
  color: #2c2c3b;
  /*フォント*/
  font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
}

/*body以下の要素全てに*/
body > * {
  max-width: 640px;   /* コンテンツの横幅を最大640pxに制限（広がりすぎ防止） */

  margin: 0 auto;     /* 左右の余白を自動にして中央寄せ（横中央に配置） */

  padding: 16px;      /* 内側の余白（文字や要素が端にくっつかないようにする） */
}

/* =========================
  タイトル
========================= */
h1 {
  margin-top: 32px;
  font-size: 2.2rem;
  letter-spacing: 0.08em;
  text-align: center;
}

h2 {
  margin: 32px auto 16px;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  text-align: center;
}

/* =========================
  ガチャ表示
========================= */
#gachaBox {
  /* 上下に28pxの余白、左右はautoで中央寄せ */
  margin: 28px auto;
  padding: 28px 22px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(243,237,255,0.95));
  box-shadow: 0 24px 50px rgba(108, 99, 255, 0.14);

  /* 最低高さを確保 → 中身が少なくてもボックスが潰れない */
  min-height: 180px;

  /* CSS Gridレイアウトを使用 */
  /* place-items: centerは中身を縦・横ともに中央に配置 → justify + align をまとめた書き方 */
  display: grid;
  place-items: center;
}

#result {
  width: 100%;
  min-height: 120px;
  display: grid;
  place-items: center;
}

/* =========================
  ガチャカード
========================= */
.gacha-card {
  /* 横幅を親要素いっぱいに広げる */
  width: 100%;

  /* 高さを固定してレイアウトを安定させる */
  height: 140px;

  /* 角を丸くしてカード風の見た目にする */
  border-radius: 16px;

  /* Flexboxレイアウトを使用 */
  display: flex;
  /* 要素を縦方向に並べる（上から順） */
  flex-direction: column;
  /* 縦方向の中央揃え */
  justify-content: center;
  /* 横方向の中央揃え */
  align-items: center;

  /* 要素同士の間隔を6pxあける */
  gap: 6px;

  /* テキストを中央揃えにする */
  text-align: center;

  /* 内側の余白（コンテンツが端にくっつかないようにする） */
  padding: 10px;

  /* 擬似要素（::afterなど）を使うための基準位置
  擬似要素 = HTMLを書かずに要素を追加できる仕組み
  ::before
  ::afterなどを使用するときに必要
  */
  position: relative;
}

/* =========================
  テキスト
========================= */
.rarity-text {
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-shadow:
    0 0 6px rgba(255,255,255,0.8),
    0 0 12px rgba(255,215,0,0.8);
}

.name-text {
  font-size: 16px;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 4px rgba(0,0,0,0.6);
}

.emoji {
  font-size: 36px;
  margin: 6px 0;
  text-shadow: 
    0 0 4px rgba(0,0,0,0.6),
    0 0 8px rgba(0,0,0,0.4);
  animation: pop 0.3s ease;
  transform: translateY(-2px);
}

/* =========================
  レアリティ背景
========================= */
.rarity-SSR {
  background:
    radial-gradient(circle at center, rgba(255,255,255,0.3), transparent 70%),
    linear-gradient(135deg, #ffd700, #ffb300);
  box-shadow: 0 0 20px rgba(255, 200, 0, 0.6);
}

.rarity-SR {
  background: linear-gradient(135deg, #a855f7, #6b21a8);
}

.rarity-R {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
}

.rarity-N {
  background: #9ca3af;
}

/* SSRだけ特別強化 */
.rarity-SSR .rarity-text {
  font-size: 30px;
}

.rarity-SSR .emoji {
  text-shadow: 0 0 12px gold;
}

/* =========================
  アニメーション
========================= */
.ssr-effect {
  animation: flash 0.6s ease-in-out 3;
}

@keyframes flash {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes pop {
  0% { transform: scale(0.5); }
  100% { transform: scale(1); }
}

/* =========================
  ボタン
========================= */
button#gachaBtn {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: block;
  border: none;
  border-radius: 999px;
  padding: 16px 22px;
  background: linear-gradient(135deg, #8f6fff, #5a4be0);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(90, 75, 224, 0.22);
  transition: 0.2s;
}

button#gachaBtn:hover {
  transform: translateY(-2px);
}

button#gachaBtn:active {
  transform: translateY(0);
}

/* =========================
  確率リスト
========================= */
#rateList {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: 10px;
  max-width: 420px;
}

#rateList li {
  background: #ffffffcc;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* =========================
  フッター
========================= */
#footer {
  margin-top: 60px;
  text-align: center;
  font-size: 0.8rem;
  color: #6a6a8a;
}

#footer p {
  margin: 4px 0;
}

/* =========================
  レスポンシブ
========================= */
@media (max-width: 520px) {
  body > * {
    padding: 12px;
  }

  #gachaBox {
    padding: 22px 18px;
  }

  button#gachaBtn {
    padding: 14px 18px;
  }
}
