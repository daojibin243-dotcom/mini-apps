
// setIntervalを管理するための変数
// let 再代入可能な変数
let timer = null;

// 残り時間（秒単位で管理）
let totalSeconds = 0;

let endTime = null;

// 入力欄（分・秒）
// const 再代入ができない変数
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

// 表示部分（時間・ステータス）
const display = document.getElementById("display");
const status = document.getElementById("status");

//モード変更 normal / work / break
let mode = "normal";

//音声ファイルを変数に
const alarm = new Audio("Cuckoo.mp3");

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

  // ブラウザ外通知許可リクエスト
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // 通常モードのときだけ、入力された分・秒を使う
  // （ポモドーロモードではボタンで時間が決まっているため）
  if (mode === "normal") {
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    totalSeconds = m * 60 + s;
  }

  // 時間が0以下ならエラー表示して処理を止める
  if (totalSeconds <= 0) {
    status.textContent = "時間を入力してください";
    return;
  }

  // 表示時間更新
  updateDisplay();
  status.textContent = "タイマー実行中";

  endTime = Date.now() + totalSeconds * 1000;

  // 1秒ごとに処理を繰り返す
  timer = setInterval(() => {

    // 現在時刻から「終了時刻（endTime）」までの残り時間を計算（秒単位）
    // Date.now() は現在時刻（ミリ秒）
    // 差を1000で割って秒に変換し、小数は切り捨てる
    const remaining = Math.floor((endTime - Date.now()) / 1000);

     // 計算した残り時間を保存
    totalSeconds = remaining;

    // 画面の時間表示を更新
    updateDisplay();

    // ===== タイマー終了時の処理 =====
    if (remaining <= 0) {

      // タイマーを停止
      clearInterval(timer);
      timer = null;

      //音を鳴らす
      //再生位置を0秒に
      alarm.currentTime = 0;
      alarm.play();

      //通知
      if (Notification.permission === "granted") {
        new Notification("ポモドーロタイマー", {
          body: "時間です！次の作業に移りましょう",
          icon: "timer.png"
        });
      }

      // ===== ポモドーロの自動切り替え =====
      if (mode === "work") {
        // 作業時間が終わった → 休憩に切り替え
        mode = "break";
        totalSeconds = 5 * 60;
        status.textContent = "休憩スタート！";
      } else if (mode === "break") {
        // 休憩が終わった → 作業に戻る
        mode = "work";
        totalSeconds = 25 * 60;
        status.textContent = "作業スタート！";
      } else {
        // 通常モードの場合は通知だけして終了
        alert("時間です！");
        return;
      }

      // 次のタイマーの終了時刻を再設定
      // 「今」から新しい時間を足して次のカウントを開始する
      endTime = Date.now() + totalSeconds * 1000;
      updateDisplay();
    }

  }, 1000);//1000ms = 1秒ごとに実行
};

//ポモドーロ（作業ボタン）
document.getElementById("work").onclick = () => {
  totalSeconds = 25 * 60;
  mode = "work";
  endTime = Date.now() + totalSeconds * 1000;
  updateDisplay();
  status.textContent = "作業時間（25分）";
};

//ポモドーロ（休憩ボタン）
document.getElementById("break").onclick = () => {
  totalSeconds = 5 * 60;
  mode = "break";
  updateDisplay();
  status.textContent = "休憩時間（5分）";
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

  //モードをノーマルに
  mode = "normal";

  // 表示更新
  updateDisplay();

  // 状態表示
  status.textContent = "時間を設定してスタート";
};

