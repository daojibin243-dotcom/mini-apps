// 問題データの定義
// 各言語ごとに、コードスニペット、タイトル、説明、リンクを含む問題の配列
const questionData = {
  html: htmlQuestions,
  css: cssQuestions,
  javascript: javascriptQuestions
};

// HTML要素の取得
// これらの要素を使って、ゲームのUIを操作します
const titleElement = document.getElementById('title');
const codeDisplay = document.getElementById('code-display');
const typingInput = document.getElementById('typing-input');
const timeElement = document.getElementById('time');
const accuracyElement = document.getElementById('accuracy');
const wpmElement = document.getElementById('wpm');
const resultScreen = document.getElementById('result-screen');
const completedList = document.getElementById('completed-list');
const restartBtn = document.getElementById('restart-btn');
const languageSelect = document.getElementById('language-select');
const timeSelect = document.getElementById('time-select');

// ゲームの状態を管理する変数
let currentLanguage = 'html'; // 現在選択されている言語
let questions = questionData[currentLanguage]; // 現在の言語の問題リスト

let currentQuestionIndex = 0; // 現在表示中の問題のインデックス
let started = false; // ゲームが開始されたかどうか
let timer = null; // タイマーのID

let selectedTime = 60; // 選択された制限時間
let timeLeft = selectedTime; // 残り時間

let typedChars = 0; // 入力された文字数
let mistakes = 0; // ミスの数

const completedQuestions = []; // 完了した問題のリスト

// 現在の問題を取得する関数
function getCurrentQuestion(){
  return questions[currentQuestionIndex];
}

// 問題を表示する関数
// タイトルを表示し、コードを文字ごとに色分けして表示します
function renderQuestion(){

  const question = getCurrentQuestion(); // 現在の問題を取得

  // タイトルを更新（言語と問題のタイトルを表示）
  titleElement.textContent = `【${currentLanguage.toUpperCase()}】 ${question.title}`;

  codeDisplay.innerHTML = ''; // 表示エリアをクリア

  const input = typingInput.value; // ユーザーの入力値を取得

  // コードの各文字を処理
  question.code.split('').forEach((char,index) => {

    const span = document.createElement('span'); // 文字を表示するspan要素を作成

    span.textContent = char; // 文字を設定

    // 入力された文字と比較してクラスを設定
    if(index < input.length){

      if(input[index] === char){
        span.className = 'correct'; // 正しい場合
      }
      else{
        span.className = 'wrong'; // 間違っている場合
      }

    }
    else{
      span.className = 'pending'; // まだ入力されていない場合
    }

    codeDisplay.appendChild(span); // 表示エリアに追加

  });

}

// タイマーを開始する関数
// 1秒ごとに時間を減らし、統計を更新します
function startTimer(){

  timer = setInterval(() => {

    timeLeft--; // 残り時間を減らす

    timeElement.textContent = timeLeft; // UIに残り時間を表示

    updateStats(); // 統計を更新

    if(timeLeft <= 0){
      finishGame(); // 時間が0になったらゲーム終了
    }

  },1000); // 1秒間隔

}

// 統計情報を更新する関数
// 正確率とWPM（1分あたりの単語数）を計算して表示します
function updateStats(){

  // 正確率の計算（入力文字数0の場合は100%）
  const accuracy = typedChars === 0
    ? 100
    : Math.max(0,Math.floor(((typedChars - mistakes) / typedChars) * 100));

  accuracyElement.textContent = `Accuracy: ${accuracy}%`; // 正確率を表示

  const elapsed = selectedTime - timeLeft; // 経過時間を計算

  // WPMの計算（経過時間が0の場合は0）
  const wpm = elapsed <= 0
    ? 0
    : Math.floor((typedChars / 5 / elapsed) * 60); // 1単語を5文字として計算

  wpmElement.textContent = wpm; // WPMを表示

}

// 次の問題に進む関数
// 完了した問題を記録し、次の問題を表示します
function nextQuestion(){

  const currentQuestion = getCurrentQuestion(); // 現在の問題を取得

  // まだ完了していない場合、完了リストに追加
  if(!completedQuestions.includes(currentQuestion)){
    completedQuestions.push(currentQuestion);
  }

  currentQuestionIndex++; // インデックスを進める

  // 問題の最後まで行ったら最初に戻る
  if(currentQuestionIndex >= questions.length){
    currentQuestionIndex = 0;
  }

  typingInput.value = ''; // 入力欄をクリア

  renderQuestion(); // 新しい問題を表示

}

// ゲームを終了する関数
// タイマーを止め、結果画面を表示します
function finishGame(){

  clearInterval(timer); // タイマーを停止

  typingInput.disabled = true; // 入力欄を無効化

  resultScreen.classList.remove('hidden'); // 結果画面を表示

  // 最終的な統計を計算
  const accuracy = typedChars === 0
    ? 100
    : Math.max(0,Math.floor(((typedChars - mistakes) / typedChars) * 100));

  const elapsed = selectedTime; // 総時間を経過時間として使用

  const wpm = Math.floor((typedChars / 5 / elapsed) * 60);

  // 結果を表示
  document.getElementById('result-typed').textContent = typedChars;
  document.getElementById('result-miss').textContent = mistakes;
  document.getElementById('result-accuracy').textContent = `${accuracy}%`;
  document.getElementById('result-wpm').textContent = wpm;

  completedList.innerHTML = ''; // 完了リストをクリア

  // 完了した問題をリスト表示
  completedQuestions.forEach((item) => {

    const div = document.createElement('div');

    div.className = 'result-item';

    div.innerHTML = `
      <h4>${item.title} (${item.code})</h4>

      <p>${item.description}</p>

      <a href="${item.link}" target="_blank">
        MDNで解説を見る
      </a>
    `;

    completedList.appendChild(div);

  });

}

// ゲームをリセットする関数
// すべての変数を初期化し、ゲームを再開できる状態にします
function resetGame(){

  clearInterval(timer); // タイマーを停止

  // 選択された言語と時間を取得
  currentLanguage = languageSelect.value;
  questions = questionData[currentLanguage];

  selectedTime = Number(timeSelect.value);

  // ゲーム状態をリセット
  currentQuestionIndex = 0;
  started = false;

  typedChars = 0;
  mistakes = 0;

  timeLeft = selectedTime;

  completedQuestions.length = 0; // 完了リストをクリア

  // UIをリセット
  typingInput.disabled = false;
  typingInput.value = '';

  timeElement.textContent = selectedTime;

  resultScreen.classList.add('hidden'); // 結果画面を隠す

  updateStats(); // 統計を更新
  renderQuestion(); // 問題を表示

  typingInput.focus(); // 入力欄にフォーカス

}

// タイピング入力のイベントリスナー
// ユーザーが入力するたびに呼び出され、ゲームの進行を管理します
typingInput.addEventListener('input',(e) => {

  if(!started){
    started = true; // ゲームを開始
    startTimer(); // タイマーをスタート
  }

  const question = getCurrentQuestion(); // 現在の問題を取得

  const input = e.target.value; // 入力値を取得

  typedChars++; // 入力文字数を増やす

  const charIndex = input.length - 1; // 最後の入力文字のインデックス

  // 入力が正しいかチェック
  if(input[charIndex] !== question.code[charIndex]){
    mistakes++; // ミスをカウント
  }

  updateStats(); // 統計を更新
  renderQuestion(); // 問題を表示

  // 入力が完全一致したら次の問題へ
  if(input === question.code){
    nextQuestion();
  }

});

// 再スタートボタンのイベントリスナー
restartBtn.addEventListener('click',resetGame);

// 言語選択のイベントリスナー
languageSelect.addEventListener('change',resetGame);

// 時間選択のイベントリスナー
timeSelect.addEventListener('change',resetGame);

// ゲームの初期化
resetGame();