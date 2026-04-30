// 入力欄・出力欄・メッセージ表示要素を取得
const input = document.getElementById("input");
const output = document.getElementById("output");
const message = document.getElementById("message");

// メッセージ表示用の関数（エラーかどうかでスタイル切替）
function showMessage(text, isError = false) {
  message.textContent = text; // メッセージ内容をセット
  message.className = isError ? "error" : "success"; // クラスを切り替え
}

// JSONを整形（インデント付きで見やすくする）
function formatJSON() {
  //エラーが起きてもプログラムを止めないようにtry catch
  try {
    const obj = JSON.parse(input.value); // JSON文字列をオブジェクトに変換
    output.value = JSON.stringify(obj, null, 2); // 整形して出力（2スペース）
    showMessage("整形しました！");
  } catch (e) {
    // JSONが不正な場合
    showMessage("JSONの形式が正しくありません", true);
  }
}

// JSONを圧縮（余分なスペースや改行を削除）
function minifyJSON() {
  try {
    const obj = JSON.parse(input.value); // JSON文字列をオブジェクトに変換
    output.value = JSON.stringify(obj); // 最小化して出力
    showMessage("圧縮しました！");
  } catch (e) {
    // JSONが不正な場合
    showMessage("JSONの形式が正しくありません", true);
  }
}

// 入力欄と出力欄をクリア
function clearJSON() {
  input.value = "";
  output.value = "";
  showMessage("クリアしました！");
}

// 出力されたJSONをクリップボードにコピー
function copyJSON() {
  // 出力が空なら処理しない
  if (!output.value) return;

  //navigator：ブラウザの情報にアクセスできるオブジェクト
  //clipboard：その中の「クリップボード機能」
  //writeText()：テキストを書き込む関数、非同期処理（あとで結果が返る）、Promise { <pending> }が返ってくる
  navigator.clipboard.writeText(output.value)
    .then(() => showMessage("コピーしました！")) // 成功時
    .catch(() => showMessage("コピーに失敗しました", true)); // 失敗時
}

// サンプルボタンを押したらJSONサンプルを入力欄にセット
function setSample() {
  input.value = `{
  "name": "Taro",
  "age": 25,
  "isStudent": false,
  "skills": ["JavaScript", "HTML", "CSS"],
  "address": {
    "prefecture": "Tokyo",
    "city": "Shibuya"
  }
}`;
  showMessage("サンプルを入力しました！");
}