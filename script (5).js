const upload = document.getElementById("upload");

const beforeCanvas = document.getElementById("beforeCanvas");
const beforeCtx = beforeCanvas.getContext("2d");

const afterImage = document.getElementById("afterImage");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const fileSizeText = document.getElementById("fileSize");

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("upload");

let img = new Image();
let currentBlobUrl = null;

// ===============================
// 「ファイルが選択されたとき」に動く処理
// ===============================
//<input type="file" id="upload" accept="image/*">から察知
upload.addEventListener("change", (e) => {

  // ユーザーが選んだファイルの1つ目を取得
  const file = e.target.files[0];

  // ファイルが選ばれていない場合は処理しない
  if (!file) return;

  // 画像じゃない場合は弾く
  if (!file.type.startsWith("image/")) {
    alert("画像ファイルを選択してください");
    return;
  }

  // ファイルを読み込むための専用オブジェクトを作成
  const reader = new FileReader();

  // ファイルの読み込みが完了したときに実行される処理
  reader.onload = (event) => {

    // 読み込んだ画像データ（URL形式）をimgタグにセット
    // → これで画面に画像が表示される
    img.src = event.target.result;
  };

  // ファイルを「データURL形式」で読み込む
  // （画像を文字列として扱えるようにする）
  reader.readAsDataURL(file);
});

// ===============================
// 画像の読み込みが完了したときに実行される処理、初期描画にも
// ===============================
img.onload = () => {

  // ✅Beforeに元画像をそのまま表示する

  // canvasの横幅を、画像の横幅と同じにする
  beforeCanvas.width = img.width;

  // canvasの高さを、画像の高さと同じにする
  beforeCanvas.height = img.height;

  // canvasに画像を描画（左上(0,0)からそのまま表示）
  beforeCtx.drawImage(img, 0, 0);


  // ✅入力欄に初期値をセットする

  // 幅の入力欄に「元画像の幅」を入れる
  widthInput.value = img.width;

  // 高さの入力欄に「元画像の高さ」を入れる
  heightInput.value = img.height;


  // ✅After（加工後画像）を表示する処理を実行
  // → リサイズや圧縮のプレビューがここで作られる
  draw();
};


// ===============================
// 入力が変更されたら自動で画面を更新する処理
// ===============================

// 幅（width）の入力欄に値を入力したとき
widthInput.addEventListener("input", draw);
// → 数字を変えるたびに draw() が実行される
// → 画像の横幅がリアルタイムで変わる


// 高さ（height）の入力欄に値を入力したとき
heightInput.addEventListener("input", draw);
// → 数字を変えるたびに draw() が実行される
// → 画像の縦の大きさがリアルタイムで変わる


// 品質スライダーを動かしたとき
qualitySlider.addEventListener("input", () => {

  // 現在のスライダーの値（例：0.8）を画面に表示する
  qualityValue.textContent = qualitySlider.value;

  // draw() を実行して画像を更新
  draw();
});


// ===============================
// 画像アップロード部分
// ===============================

// アップロードエリアをクリックしたとき
uploadArea.addEventListener("click", () => {

  // 隠してある <input type="file"> を強制的にクリックする
  // → ファイル選択画面が開く
  fileInput.click();
});

// ローカルの画像を選ぶとき
fileInput.addEventListener("change", (e) => {

  // 選択されたファイルの1つ目を取得して処理
  handleFile(e.target.files[0]);
});


// ===============================
//ドラッグアンドドロップ
//================================

// ドラッグ中（エリアの上にファイルが来たとき）
uploadArea.addEventListener("dragover", (e) => {

  // デフォルト動作を止める（これがないとドロップできない）
  e.preventDefault();

  // 見た目を変える（枠を青くするなど）
  uploadArea.classList.add("dragover");
});


// ドラッグが外れたとき
uploadArea.addEventListener("dragleave", () => {

  // 見た目を元に戻す
  uploadArea.classList.remove("dragover");
});


// ドロップしたとき（ここが本処理）
uploadArea.addEventListener("drop", (e) => {

  // デフォルト動作を止める（ファイルが開かれるのを防ぐ）
  e.preventDefault();

  // 見た目を元に戻す
  uploadArea.classList.remove("dragover");

  // ドロップされたファイルを取得（1つ目）
  const file = e.dataTransfer.files[0];

  // 共通処理に渡す
  handleFile(file);
});


// ===============================
// ペースト（Ctrl+V / 右クリック貼り付け）
// ===============================

// ペーストされたとき
document.addEventListener("paste", (e) => {

  // クリップボードの中身を取得
  const items = e.clipboardData.items;

  // 中身を1つずつ確認
  for (let item of items) {

    // 画像ファイルかどうかチェック
    //startsWith() は String 値のメソッドで、文字列が引数で指定された文字列で始まるかを判定して true か false を返す。
    if (item.type.startsWith("image/")) {

      // 画像データをファイルとして取得
      // getAsFile() → クリップボードの画像を「ファイル」として取り出す
      const file = item.getAsFile();

      // 共通処理に渡す
      handleFile(file);

      // 1つ処理したら終了
      break;
    }
  }
});

// ===============================
// 共通処理
// ===============================
function handleFile(file) {

  // -------------------------------
  // ファイルのチェック
  // -------------------------------

  // ファイルが存在しない、ファイルの種類（例: "image/png"）ではないか
  if (!file || !file.type.startsWith("image/")) {

    // 警告を表示
    alert("画像ファイルを選択してください");

    return;
  }
  
  // FileReader → ファイルを読み込むための専用オブジェクト
  const reader = new FileReader();

  reader.onload = (event) => {

    // event.target.result → 読み込んだファイルのデータ
    // img.src に入れると画像として表示できる
    img.src = event.target.result;
  };

  // readAsDataURL() →
  // ファイルを「画像として表示できる形式（データURL）」に変換
  reader.readAsDataURL(file);
}

// ===============================
// リサイズと圧縮処理後Afterを更新
// ===============================
function draw() {

  // -------------------------------
  // 入力値の取得
  // -------------------------------

  //  入力欄の値（文字列）をparseInt() で数値に変換（整数）
  const width = parseInt(widthInput.value);

  const height = parseInt(heightInput.value);

  // parseFloat() → 小数の数値に変換
  const quality = parseFloat(qualitySlider.value);


  // 幅または高さが無効（0やNaN）の場合は処理しない
  if (!width || !height) return;


  // -------------------------------
  // 比較用として画像を残すためBeforeは変更しない
  // -------------------------------


  // -------------------------------
  // After用の一時canvasを作成
  // -------------------------------

  // document.createElement("canvas")
  // → 新しいcanvas要素をメモリ上に作る（画面には表示されない）
  const tempCanvas = document.createElement("canvas");

  // getContext("2d")
  // → canvasに描画するための機能を取得
  const tempCtx = tempCanvas.getContext("2d");


  // -------------------------------
  // リサイズ設定
  // -------------------------------

  // canvasのサイズを指定
  tempCanvas.width = width;
  tempCanvas.height = height;

  // drawImage(画像, x, y, 幅, 高さ)
  // → 指定サイズに引き伸ばして描画（＝リサイズ）
  tempCtx.drawImage(img, 0, 0, width, height);


  // -------------------------------
  // 圧縮してデータ化
  // -------------------------------

  // toBlob()
  // → canvasの内容を「画像ファイル（blob）」として出力
  // 第2引数 → 形式（image/jpeg）
  // 第3引数 → 品質（0〜1）
  tempCanvas.toBlob((blob) => {

    // 何も生成されなかった場合は終了
    if (!blob) return;


    // -------------------------------
    // 現在の画像データを保存
    // -------------------------------

    // 後でダウンロードに使うため保持
    currentBlob = blob;


    // -------------------------------
    // 容量を表示
    // -------------------------------

    // blob.size → バイト数
    // /1024 → KBに変換
    // toFixed(1) → 小数1桁に丸める
    const sizeKB = (blob.size / 1024).toFixed(1);

    // 画面に表示
    fileSizeText.textContent = sizeKB + " KB";


    // -------------------------------
    // プレビュー画像を更新
    // -------------------------------

    // 古いURLがあれば解放（メモリ節約）
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }

    // createObjectURL()
    // → blobを一時的なURLに変換（imgで表示できるようにする）
    currentBlobUrl = URL.createObjectURL(blob);

    // Afterのimgにセットして表示
    afterImage.src = currentBlobUrl;

  }, "image/jpeg", quality);
}

// ===============================
// ダウンロード処理（After画像を保存）
// ===============================
function downloadImage() {

  // -------------------------------
  // ① 画像データが存在するかチェック
  // -------------------------------

  // まだ生成されていない場合は保存できない
  if (!currentBlob) {

    // ユーザーにエラーを表示
    alert("画像がまだ生成されていません");

    // 処理を終了
    return;
  }


  // -------------------------------
  // ② ダウンロード用のリンクを作る
  // -------------------------------

  // document.createElement("a")
  // → <a>タグ（リンク）をプログラムで作成
  const link = document.createElement("a");


  // -------------------------------
  // ③ ダウンロード設定
  // -------------------------------

  // download属性 → 保存するファイル名を指定
  link.download = "resized.jpg";

  // URL.createObjectURL()
  // → blob（画像データ）を「一時的なURL」に変換
  link.href = URL.createObjectURL(currentBlob);


  // -------------------------------
  // ④ 自動クリックでダウンロード実行
  // -------------------------------

  // click() → プログラムでリンクをクリックしたことにする
  // → ダウンロードが開始される
  link.click();
}