const animals = [
  { name: "ライオン", rarity: "SSR", rate: 5, emoji: "🦁" },
  { name: "トラ", rarity: "SR", rate: 15, emoji: "🐯" },
  { name: "パンダ", rarity: "SR", rate: 15, emoji: "🐼" },
  { name: "ゾウ", rarity: "R", rate: 30, emoji: "🐘" },
  { name: "ウサギ", rarity: "R", rate: 30, emoji: "🐰" },
  { name: "コアラ", rarity: "R", rate: 50, emoji: "🐨" },
  { name: "キリン", rarity: "N", rate: 50, emoji: "🦒" },
  { name: "シマウマ", rarity: "N", rate: 50, emoji: "🦓" },
  { name: "カバ", rarity: "N", rate: 50, emoji: "🦛" },
  { name: "サイ", rarity: "N", rate: 50, emoji: "🦏" },
  { name: "ゴリラ", rarity: "N", rate: 50, emoji: "🦍" },
];

const result = document.getElementById("result");
const button = document.getElementById("gachaBtn");

function gacha() {

  // animals配列のrate（確率の重み）をすべて合計する
  // 例：5 + 15 + 80 = 100
  // reduceは配列を1つの値にまとめるメソッド
  // =>はアロー関数、関数(function)を短くするための記法

  // animals.reduce(function(sum, a) {
  //  return sum + a.rate;
  // }, 0);
  // reduceの第2引数は初期値、今回は0からスタートしている
  // reduceとは「減らす」という意味の英語で、配列の要素を順番に処理して1つの値に「減らす」イメージ
  const total = animals.reduce((sum, a) => sum + a.rate, 0);

  // 0〜total未満のランダムな数を作る
  // 例：0〜100の間のどこかの数
  let rand = Math.random() * total;

  // 配列の先頭から順番にチェックしていく
  for (const animal of animals) {

    // ランダム値がその動物のrate内に収まっていれば当選
    if (rand < animal.rate) {
      return animal; // その動物を返す（ガチャ結果）
    }

    // 収まらなかった場合、その分を引いて次へ
    // → 次の動物の「範囲」に移動するイメージ
    rand -= animal.rate;
  }
}

//ボタンが押された時の処理
button.addEventListener("click", () => {
  result.textContent = "抽選中...";

  setTimeout(() => {
    const item = gacha();

    //まずCSSをリセット(ガチャを引くたびにスタイルが残るのを防ぐため)
    result.className = "";
    result.style.background = "";
    result.style.transform = "scale(1)";

    // 抽選結果にCSSクラスを追加してスタイルを適用
    result.innerHTML = `
    <div class="gacha-card rarity-${item.rarity}">
        <div class="rarity-text">${item.rarity}</div>
        <div class="emoji">${item.emoji}</div>
        <div class="name-text">${item.name}</div>
    </div>
    `;

    // SSRだけ特別処理
    if (item.rarity === "SSR") {
      result.classList.add("ssr-effect");

      result.style.transform = "scale(1.2)";

      // エフェクトを付ける、0.15秒後に拡大する
      setTimeout(() => {
        result.style.transform = "scale(1)";
      }, 150);
      // エフェクトを3秒後に消す
      setTimeout(() => {
        result.classList.remove("ssr-effect");
      }, 3000);
    }

  }, 800);
  // ボタンを無効にする
  button.disabled = true;

  // 1秒後にボタンを再度有効にする(連打防止)
setTimeout(() => {
  button.disabled = false;
}, 1000);
});

//=====排出確率の表示部分=====
const rateList = document.getElementById("rateList");

// 合計を出す
const total = animals.reduce((sum, a) => sum + a.rate, 0);

// 排出確率を1件ずつ表示
animals.forEach(animal => {
    // li要素を作る
  const li = document.createElement("li");

  // 割合を％に変換
  // toFixed(2)は小数点以下2桁まで表示するためのメソッド
  // 例：5 / 100 * 100 = 5.00%
  const percent = ((animal.rate / total) * 100).toFixed(2);
  // li要素のテキストを「動物名（レアリティ） : 確率%」にする
  li.textContent = `${animal.name}（${animal.rarity}） : ${percent}%`;
  // ul要素にli要素を追加する
  rateList.appendChild(li);
});