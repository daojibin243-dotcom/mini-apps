// ===============================
// 要素取得
// ===============================
// HTMLのidを使って、JavaScriptから操作したい要素を取得します。
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("upload");

// 比較表示に使う2枚の画像です。
const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");

// ダウンロード時のサイズを指定する入力欄です。
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

// 品質スライダーと、画面に表示する数値・容量です。
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const fileSizeText = document.getElementById("fileSize");
const estimatedSizeText = document.getElementById("estimatedSize");

const downloadBtn = document.getElementById("downloadBtn");

const lockRatioCheckbox = document.getElementById("lockRatio");

// Before/After比較用のスライダーです。
const compareSlider = document.getElementById("compareSlider");

const compare = document.querySelector(".compare");
const overlay = document.querySelector(".overlay");

// ===============================
// 状態
// ===============================
// 選択された画像を読み込むためのImageオブジェクトです。
let img = new Image();

// ダウンロード用に作った画像データを保存しておきます。
let currentBlob = null;

// プレビュー用のURLです。作り直すたびに古いURLは破棄します。
let previewBlobUrl = null;

let aspectRatio = null; // 比率を保持


// ===============================
// イベント登録
// ===============================

// ファイル選択
fileInput.addEventListener("change", (e) => {
  // inputで選ばれたファイルの1つ目を処理します。
  handleFile(e.target.files[0]);
});

// クリックでアップロード
uploadArea.addEventListener("click", () => {
  // 見えないinputをクリックしたことにして、ファイル選択画面を開きます。
  fileInput.click();
});

// ドラッグ＆ドロップ
uploadArea.addEventListener("dragover", (e) => {
  // デフォルト動作を止めると、dropイベントを受け取れるようになります。
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  // ドロップされたファイルの1つ目を処理します。
  handleFile(e.dataTransfer.files[0]);
});

// ペースト
document.addEventListener("paste", (e) => {
  // クリップボードの中から、画像データだけを探します。
  for (let item of e.clipboardData.items) {
    if (item.type.startsWith("image/")) {
      handleFile(item.getAsFile());
      break;
    }
  }
});

qualitySlider.addEventListener("input", () => {
  // スライダーを動かしたら表示値を更新し、画像も作り直します。
  qualityValue.textContent = qualitySlider.value;
  draw();
});

// ダウンロード
downloadBtn.addEventListener("click", downloadImage);


// ===============================
// ファイル処理
// ===============================
function handleFile(file) {

  // ファイルがない、または画像ではない場合は処理を止めます。
  if (!file || !file.type.startsWith("image/")) {
    alert("画像ファイルを選択してください");
    return;
  }

  // FileReaderは、選択したファイルをブラウザ上で読み込むためのAPIです。
  const reader = new FileReader();

  reader.onload = (e) => {
    // 読み込んだ画像データをimg.srcに入れると、画像として扱えるようになります。
    img.src = e.target.result;
  };

  // ファイルをData URL形式で読み込みます。
  reader.readAsDataURL(file);
}


// ===============================
// 画像読み込み後
// ===============================
img.onload = () => {

  // 元画像をBefore側に表示します。
  beforeImage.src = img.src;

  // 画像がある状態のCSSに切り替えます。
  compare.classList.add("has-image");

  // 入力初期値
  widthInput.value = img.width;
  heightInput.value = img.height;

  // 縦横比固定で使うため、元画像の比率を保存します。
  aspectRatio = img.width / img.height;

  // 画像を読み込んだら、すぐにプレビューとダウンロード用画像を作ります。
  draw();
};


// ===============================
// 描画処理
// ===============================
function draw() {

  // 入力欄と品質スライダーの値を数値として取り出します。
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const quality = parseFloat(qualitySlider.value);

  // 画像やサイズがまだない場合は、何もしません。
  if (!img.src || !width || !height) return;

  // 現在の設定でダウンロードされる予定のサイズを表示します。
  estimatedSizeText.textContent = `${width} x ${height} px`;

  // ダウンロード用とプレビュー用は目的が違うので、別々に作ります。
  createDownloadImage(width, height, quality);
  createPreviewImage(quality);
}

function createDownloadImage(width, height, quality) {
  // canvasは、画像を描画したりリサイズしたりできるHTML要素です。
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // ダウンロード用は、入力された幅と高さで作ります。
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // canvasの内容をJPEG画像データに変換します。
  canvas.toBlob((blob) => {
    if (!blob) return;

    // 後でダウンロードボタンから使えるように保存します。
    currentBlob = blob;

    // Blobのサイズから、画像容量をKBで表示します。
    fileSizeText.textContent =
      (blob.size / 1024).toFixed(1) + " KB";

  }, "image/jpeg", quality);
}

function createPreviewImage(quality) {
  // プレビュー用は表示比較が目的なので、元画像サイズのまま品質だけ変えます。
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;

    // 古いプレビューURLを破棄して、メモリを無駄に使わないようにします。
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }

    // Blobをimgタグで表示できるURLに変換します。
    previewBlobUrl = URL.createObjectURL(blob);
    afterImage.src = previewBlobUrl;

    // スライダー維持
    updateCompareSlider();
}, "image/jpeg", quality);
}
//横を変えたら → 縦を自動更新
widthInput.addEventListener("input", () => {
  // 縦横比固定がONなら、幅に合わせて高さを自動計算します。
  if (lockRatioCheckbox.checked && aspectRatio) {
    heightInput.value = Math.round(widthInput.value / aspectRatio);
  }
  draw();
});
// 縦を変えたら → 横を自動更新
heightInput.addEventListener("input", () => {
  // 縦横比固定がONなら、高さに合わせて幅を自動計算します。
  if (lockRatioCheckbox.checked && aspectRatio) {
    widthInput.value = Math.round(heightInput.value * aspectRatio);
  }
  draw();
});


// ===============================
// ダウンロード
// ===============================
function downloadImage() {

  // まだ画像が作られていない場合はダウンロードできません。
  if (!currentBlob) {
    alert("画像がまだ生成されていません");
    return;
  }

  // aタグを一時的に作り、クリックしたことにしてダウンロードします。
  const link = document.createElement("a");
  link.download = "resized.jpg";
  link.href = URL.createObjectURL(currentBlob);
  link.click();
}

// ===============================
// 比較スライダー
// =============================== 
function updateCompareSlider() {
  // スライダーの値を%にして、overlayの幅に使います。
  const position = compareSlider.value + "%";

  // overlayの幅が変わると、After画像の見える範囲が変わります。
  overlay.style.width = position;

  // CSS変数も更新して、スライダーの色の境目を動かします。
  compareSlider.style.setProperty("--compare-position", position);
}

compareSlider.addEventListener("input", updateCompareSlider);
