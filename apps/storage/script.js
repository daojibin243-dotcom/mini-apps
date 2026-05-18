// script.js

const storageList = document.getElementById("storageList");
const valueEditor = document.getElementById("valueEditor");
const currentKeyText = document.getElementById("currentKey");

const refreshBtn = document.getElementById("refreshBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

const logArea = document.getElementById("logArea");
const clearLogBtn = document.getElementById("clearLogBtn");

const searchInput = document.getElementById("searchInput");

let currentKey = null;

function getStorageItems(){

  // localStorageに保存されている
  // 全てのkey名を配列で取得
  //
  // 例:
  // ["theme", "user", "memo"]
  //
  return Object.keys(localStorage).map(key => {

    // keyに対応するvalueを取得
    //
    // 例:
    // localStorage.getItem("theme")
    // → "dark"
    //
    const value = localStorage.getItem(key);

    // keyごとの情報を
    // オブジェクトとして返す
    //
    // key   : 保存名
    // value : 保存データ
    // size  : データ容量(byte)
    //
    return {

      key,

      value,

      // データサイズを取得
      //
      // Blobを使うことで
      // byteサイズを計算できる
      //
      // 例:
      // 15 B
      // 2 KB
      //
      size: new Blob([value]).size

    };

  });

}

//Storage一覧を画面に表示する関数
function renderStorageList(){

  // 検索欄の文字を取得
  //
  // toLowerCase()で小文字化して
  // 大文字小文字を区別しない検索にする
  //
  // 例:
  // "USER" → "user"
  //
  const keyword =
    searchInput.value.toLowerCase();

  // 一度一覧を空にする
  storageList.innerHTML = "";

  // localStorageのデータ一覧を取得
  //
  // getStorageItems() から:
  // [
  //   { key, value, size }
  // ]
  //
  const items = getStorageItems();


  // 検索キーワードに一致する
  // itemだけを抽出
  //
  // includes() は
  // 「文字を含むか」判定
  //
  const filteredItems = items.filter(

    item =>

      item.key
        .toLowerCase()
        .includes(keyword)

  );


  // 「データがありません」
  // メッセージ要素を取得
  //
  const emptyMessage =
    document.getElementById(
      "emptyMessage"
    );


  // 検索結果が0件なら
  // emptyMessageを表示
  //
  if(filteredItems.length === 0){

    emptyMessage.style.display =
      "block";

  }else{

    // データがあるなら非表示
    //
    emptyMessage.style.display =
      "none";

  }


  // filter後のデータを
  // 1件ずつ処理
  //
  filteredItems.forEach(item => {


    // <li> 要素を新規作成
    //
    const li =
      document.createElement("li");


    // CSSクラス追加
    //
    li.className = "storage-item";


    // 現在選択中のkeyなら
    // activeクラス追加
    //
    // 青背景表示など用
    //
    if(item.key === currentKey){

      li.classList.add("active");

    }


    // liの中身を作成
    //
    // key名
    // サイズ
    //
    li.innerHTML = `

      <div class="storage-key">
        ${item.key}
      </div>

      <div class="storage-size">
        ${formatBytes(item.size)}
      </div>

    `;


    // liクリック時の処理
    //
    li.addEventListener("click", () => {


      // 現在選択中keyを更新
      //
      currentKey = item.key;


      // 画面上の現在key表示変更
      //
      currentKeyText.textContent =
        item.key;


      // valueを整形して
      // textareaへ表示
      //
      // JSONなら見やすく整形
      //
      valueEditor.value =
        formatJson(item.value);


      // 一覧を再描画
      //
      // active表示更新用
      //
      renderStorageList();


      // ログ追加
      //
      addLog(`選択: ${item.key}`);

    });


    // 完成したliを
    // 一覧へ追加
    //
    storageList.appendChild(li);

  });

}

function formatJson(value){

  try{

    return JSON.stringify(
      JSON.parse(value),
      null,
      2
    );

  }catch{

    return value;

  }

}

function saveCurrentValue(){

  if(!currentKey){
    return;
  }

  const value = valueEditor.value;

  localStorage.setItem(currentKey, value);

  addLog(`保存: ${currentKey}`);

  renderStorageList();

}

function deleteCurrentKey(){

  if(!currentKey){
    return;
  }

  const ok = confirm(
    `${currentKey} を削除しますか？`
  );

  if(!ok){
    return;
  }

  localStorage.removeItem(currentKey);

  addLog(`削除: ${currentKey}`);

  currentKey = null;

  currentKeyText.textContent = "未選択";

  valueEditor.value = "";

  renderStorageList();

}

function addLog(message){

  const div = document.createElement("div");

  div.className = "log-item";

  const now = new Date();

  div.innerHTML = `
    <div class="log-time">
      ${now.toLocaleTimeString()}
    </div>

    <div>
      ${message}
    </div>
  `;

  logArea.prepend(div);

}

function formatBytes(bytes){

  if(bytes < 1024){
    return `${bytes} B`;
  }

  if(bytes < 1024 * 1024){
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;

}

refreshBtn.addEventListener(
  "click",
  renderStorageList
);

saveBtn.addEventListener(
  "click",
  saveCurrentValue
);

deleteBtn.addEventListener(
  "click",
  deleteCurrentKey
);

clearLogBtn.addEventListener(
  "click",
  () => {
    logArea.innerHTML = "";
  }
);

searchInput.addEventListener(
  "input",
  renderStorageList
);

window.addEventListener(
  "storage",
  () => {

    renderStorageList();

    addLog("storage更新検知");

  }
);

renderStorageList();

addLog("Storage Inspector 起動");