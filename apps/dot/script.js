// グリッドを配置する要素を取得
const grid = document.getElementById("grid");

// カラーピッカーの要素を取得
const colorPicker = document.getElementById("colorPicker");

const gridSizeSelect = document.getElementById("gridSize");

const uploadInput = document.getElementById("uploadImage");
const guideImage = document.getElementById("guideImage");

let tool = "pen"; // pen / eraser / picker

let activeTool = "pen";
//下絵の変数
let hasGuideImage = false;

let paletteColors = [];

// ==============================
// グリッド生成
// ==============================

//グリッド初期表示
createGrid(16);

// グリッド生成関数
function createGrid(size) {

  // 中身リセット
  grid.innerHTML = "";

  // 列数設定
  grid.style.gridTemplateColumns = `repeat(${size}, 20px)`;

  // セル生成
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(createCell());
  }

  updateCellBackgroundMode();

  // 追加機能（ドラッグなど）
  addAdvancedEvents();
}
// セル生成の関数
function createCell() {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  return cell;
}

//カーソル初期化
document.querySelectorAll(".tool-btn")[0].classList.add("active");
updateCursor();

//グリッドサイズ変更時の処理
gridSizeSelect.addEventListener("change", () => {
  createGrid(parseInt(gridSizeSelect.value));
});



// ==============================
// 全消し処理
// ==============================

// クリアボタンが押されたときに呼ばれる関数
function clearGrid() {
  if (confirm("マス目を初期化します。よろしいですか？")) {
  // すべてのマスを取得
  document.querySelectorAll(".cell").forEach(cell => {

    // 背景色を白に戻す
    cell.style.backgroundColor = "#fff";
    cell.dataset.color = "#ffffff";
  });
  }

}



// ==============================
// ドラッグ塗り＆消しゴム機能
// ==============================

// マウスのボタンを判別するための変数
let isMouseDown = false;
let mouseButton = 0; // 0:左 2:右

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

//セルに対して塗る消すのイベントを追加
function addAdvancedEvents() {
  document.querySelectorAll(".cell").forEach(cell => {

    // 右クリックメニュー禁止
    cell.addEventListener("contextmenu", e => e.preventDefault());

    // クリック時
    cell.addEventListener("mousedown", e => {

      isMouseDown = true;
      mouseButton = e.button;
      activeTool = tool;

    // 右クリック → 消しゴム
    if (e.button === 2) {
      cell.style.backgroundColor = "#fff";
    return;
  }

  // 左クリックの挙動
  if (e.button === 0) {

    // スポイトはここだけ特別処理
    if (tool === "picker") {
      const color = getComputedStyle(cell).backgroundColor;
      colorPicker.value = rgbToHex(color);
      return;
    }

      // それ以外は共通処理
      applyTool(cell);
    }
  });

    

    // ドラッグ処理
    cell.addEventListener("mouseover", () => {

      if (!isMouseDown) return;

      if (mouseButton === 0) {
        applyTool(cell);
      }

      if (mouseButton === 2) {
        // 右ドラッグ → 消す
        cell.style.backgroundColor = "#fff";
        cell.dataset.color = "#ffffff";
        return;
      }
    });
  });
}

//ツールの切り替え
function setTool(t) {
  tool = t;

  // 全ボタンのactiveを解除
  document.querySelectorAll(".tool-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // 押したボタンだけactiveに
  event.target.classList.add("active");

  // カーソル更新（任意）
  updateCursor();
}

//カーソルの変更
function updateCursor() {

  grid.classList.remove(
    "grid-eraser",
    "grid-picker",
    "grid-transparent"
  );

  if (tool === "eraser") grid.classList.add("grid-eraser");
  if (tool === "picker") grid.classList.add("grid-picker");
  if (tool === "transparent") grid.classList.add("grid-transparent");
}

function applyTool(cell) {
  // ドラッグ中はactiveToolを使う
  const currentTool = isMouseDown ? activeTool : tool;

  if (currentTool === "picker") return;

  if (currentTool === "eraser") {
    cell.style.backgroundColor = "#fff";
    cell.dataset.color = "#ffffff";
    return;
  }

  if (currentTool === "pen") {
    cell.style.backgroundColor = colorPicker.value;
    cell.dataset.color = colorPicker.value;
    return;
  }

  if (currentTool === "transparent") {
    cell.style.backgroundColor = "transparent";
    cell.dataset.color = "transparent";
    cell.classList.add("transparent");
  }
}

// ==============================
// PNG画像DL機能
// ==============================

//表示されない模擬的なcanvas要素に再描画してDLする

function saveAsPNG() {

  // すべてのセル数からグリッドサイズを算出（例：256 → 16×16）
  const size = Math.sqrt(document.querySelectorAll(".cell").length);

  // 1マスあたりのピクセルサイズ（表示サイズと合わせている）
  const cellSize = 20;

  // canvas要素を作成（画面には表示されない）
  const canvas = document.createElement("canvas");

  // canvasの横幅（マス数 × マスサイズ）
  canvas.width = size * cellSize;

  // canvasの縦幅（マス数 × マスサイズ）
  canvas.height = size * cellSize;

  // 2D描画コンテキストを取得（これで描画できる）
  const ctx = canvas.getContext("2d");

  // すべてのセルを順番に処理
  document.querySelectorAll(".cell").forEach((cell, index) => {

    // x座標（横位置）
    // indexを横方向の位置に変換
    const x = (index % size) * cellSize;

    // y座標（縦位置）
    // indexを縦方向の位置に変換
    const y = Math.floor(index / size) * cellSize;

    // datasetから色を取得（なければ白）
    const color = cell.dataset.color || "#ffffff";

    // 透明なら描かない（＝透過になる）
    if (color === "transparent") {
      ctx.clearRect(x, y, cellSize, cellSize);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  });

  // ==============================
  // ダウンロード処理
  // ==============================

  // aタグを動的に作成
  const link = document.createElement("a");

  // ダウンロード時のファイル名
  link.download = "dot.png";

  // canvasの内容を画像データURLに変換
  link.href = canvas.toDataURL();

  // 擬似クリックでダウンロード実行
  link.click();
}

// ==============================
// JSON保存機能
// ==============================

function saveAsJSON() {

  // すべてのセル要素を取得
  const cells = document.querySelectorAll(".cell");

  // セル数からグリッドサイズを計算（例：256 → 16×16）
  const size = Math.sqrt(cells.length);

  // 保存するデータの入れ物を作成
  const data = {
    // グリッドサイズ（復元時に必要）
    size: size,

    // 各セルの色情報を入れる配列
    pixels: []
  };

  // 各セルを順番に処理
  cells.forEach(cell => {

    // セルの背景色を取得
    data.pixels.push(cell.dataset.color || "#ffffff");
  });

  // ==============================
  // ファイルとして保存する準備
  // ==============================

  // dataオブジェクトをJSON文字列に変換し、
  // Blob（ファイルデータ）として生成
  const blob = new Blob(
    [JSON.stringify(data)],
    { type: "application/json" }
  );

  // ダウンロード用のaタグを作成
  const link = document.createElement("a");

  // 保存するファイル名
  link.download = "dot.json";

  // BlobをURLとして扱えるように変換
  link.href = URL.createObjectURL(blob);

  // 擬似クリックでダウンロードを実行
  link.click();
}

// ==============================
// JSON読み込み機能
// ==============================

// JSONファイル選択時の処理
document.getElementById("loadJson").addEventListener("change", e => {

  // 選択されたファイルを取得
  const file = e.target.files[0];

  // ファイルがなければ終了
  if (!file) return;

  // ファイルを読み込むためのオブジェクト
  const reader = new FileReader();

  // ==============================
  // ファイル読み込み完了時の処理
  // ==============================
  reader.onload = () => {

    // JSON文字列をオブジェクトに変換
    const data = JSON.parse(reader.result);

    // ==============================
    // データ検証（安全チェック）
    // ==============================

    // 必須データがあるか確認
    if (!data.size || !data.pixels) {
      alert("不正なデータです");
      return;
    }

    // サイズ取得
    const size = data.size;

    // ピクセル数が正しいか確認
    if (data.pixels.length !== size * size) {
      alert("データが壊れています");
      return;
    }

    // ==============================
    // UI復元処理
    // ==============================

    // グリッドを作り直す
    createGrid(size);

    // セレクトボックスの表示も同期
    gridSizeSelect.value = size;

    // すべてのセルを取得
    const cells = document.querySelectorAll(".cell");

    // 各セルに色情報を反映
    cells.forEach((cell, i) => {
      cell.style.backgroundColor = data.pixels[i];
    });
  };

  // ファイルをテキストとして読み込む
  //非同期処理になっている
  reader.readAsText(file);
});

// ==============================
// カラーパレット
// ==============================

const colors = [
  "#000000", "#ffffff", "#ff0000",
  "#00ff00", "#0000ff", "#ffff00"
];

const palette = document.getElementById("palette");

colors.forEach(color => {
  const div = document.createElement("div");
  div.classList.add("palette-color");
  div.style.backgroundColor = color;

  div.addEventListener("click", () => {
    colorPicker.value = color;
  });

  palette.appendChild(div);
});

// ==============================
// グリッド線の付け外し
// ==============================

const toggleGrid = document.getElementById("toggleGrid");

toggleGrid.addEventListener("change", e => {
  // チェックが外れたら no-grid を付与
  grid.classList.toggle("no-grid", !e.target.checked);
});

// ==============================
// RGB → HEX変換
// ==============================

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";

  return "#" + result.slice(0,3).map(x =>
    parseInt(x).toString(16).padStart(2, "0")
  ).join("");
}

document.getElementById("addColor").addEventListener("click", () => {

  const color = colorPicker.value;

  if (!paletteColors.includes(color)) {
    paletteColors.push(color);
    renderPalette();
  }
});

function renderPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  paletteColors.forEach(color => {
    const div = document.createElement("div");
    div.classList.add("palette-color");
    div.style.backgroundColor = color;

    div.addEventListener("click", () => {
      colorPicker.value = color;
    });

    palette.appendChild(div);
  });
}

// ==============================
// 下絵アップロード機能
// ==============================
uploadInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    guideImage.src = reader.result;

    guideImage.style.display = "block";

    hasGuideImage = true;

    updateCellBackgroundMode();
  };

  reader.readAsDataURL(file);
});

//背景切り替え関数
function updateCellBackgroundMode() {
  document.querySelectorAll(".cell").forEach(cell => {

    const color = cell.dataset.color;

    // すでに色が塗られている場合は触らない
    if (color && color !== "#ffffff") return;

    if (hasGuideImage) {
      // 下絵あり → 透明
      cell.style.backgroundColor = "transparent";
      cell.dataset.color = "transparent";
    } else {
      // 下絵なし → 白
      cell.style.backgroundColor = "#ffffff";
      cell.dataset.color = "#ffffff";
    }
  });
}

//下絵を消す機能
function removeGuide() {
  guideImage.src = "";

  guideImage.style.display = "none";

  uploadInput.value = "";
  hasGuideImage = false;

  updateCellBackgroundMode();
}
