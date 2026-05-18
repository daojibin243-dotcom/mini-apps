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

  return Object.keys(localStorage).map(key => {

    const value = localStorage.getItem(key);

    return {
      key,
      value,
      size: new Blob([value]).size
    };

  });

}

function renderStorageList(){

  const keyword = searchInput.value.toLowerCase();

  storageList.innerHTML = "";

  const items = getStorageItems();

  items
    .filter(item =>
      item.key.toLowerCase().includes(keyword)
    )
    .forEach(item => {

      const li = document.createElement("li");

      li.className = "storage-item";

      if(item.key === currentKey){
        li.classList.add("active");
      }

      li.innerHTML = `
        <div class="storage-key">
          ${item.key}
        </div>

        <div class="storage-size">
          ${formatBytes(item.size)}
        </div>
      `;

      li.addEventListener("click", () => {

        currentKey = item.key;

        currentKeyText.textContent = item.key;

        valueEditor.value = formatJson(item.value);

        renderStorageList();

        addLog(`選択: ${item.key}`);

      });

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