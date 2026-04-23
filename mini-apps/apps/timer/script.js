
// setIntervalを管理するための変数
// let 再代入可能な変数
let timer = null;

// 残り時間（秒単位で管理）
let totalSeconds = 0;

// 入力欄（分・秒）
// const 再代入ができない変数
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

// 表示部分（時間・ステータス）
const display = document.getElementById("display");
const status = document.getElementById("status");


// ===== 時間表示を更新する関数 =====
function updateDisplay() {
  // 分と秒に変換
  // Math.floorで少数切り捨て
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  // 2桁表示（例：01:05）
  // .padStart(桁数, 埋める文字)
  display.textContent =
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0");
}


// ===== スタートボタンを押したときの処理 =====
document.getElementById("start").onclick = () => {

  // すでにタイマーが動いている場合は何もしない（多重起動防止）
  if (timer) return;

  // 入力値を取得（未入力は0として扱う）
  const m = parseInt(minutesInput.value) || 0;
  const s = parseInt(secondsInput.value) || 0;

  // 秒に変換して保存
  totalSeconds = m * 60 + s;

  // 0秒以下ならエラー表示して終了
  if (totalSeconds <= 0) {
    status.textContent = "時間を入力してください";
    return;
  }

  // 表示更新（スタート時点の時間を反映）
  updateDisplay();

  // 状態表示
  status.textContent = "タイマー実行中";

  // 1秒ごとに処理を実行
  timer = setInterval(() => {

    // 残り時間を1秒減らす
    totalSeconds--;

    // 表示更新
    updateDisplay();

    // 0秒になったら停止
    if (totalSeconds <= 0) {
      clearInterval(timer); // タイマー停止
      timer = null;         // 状態リセット
      alert("時間です！"); // 通知
    }

  }, 1000);
};


// ===== ストップボタン =====
document.getElementById("stop").onclick = () => {

  // タイマー停止
  clearInterval(timer);
  timer = null;

  // 状態表示
  status.textContent = "一時停止中";
};


// ===== リセットボタン =====
document.getElementById("reset").onclick = () => {

  // タイマー停止
  clearInterval(timer);
  timer = null;

  // 時間を0に戻す
  totalSeconds = 0;

  // 表示更新
  updateDisplay();

  // 状態表示
  status.textContent = "時間を設定してスタート";
};