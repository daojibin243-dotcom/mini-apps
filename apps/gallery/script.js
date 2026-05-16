const breedList = document.querySelector("#breedList");
const gallery = document.querySelector(".gallery");
const statusText = document.querySelector("#status");
const loading = document.querySelector("#loading");
const searchInput = document.querySelector("#searchInput");

const modal = document.querySelector("#modal");
const modalImage = document.querySelector("#modalImage");
const modalText = document.querySelector("#modalText");
const closeModal = document.querySelector("#closeModal");


// 犬種一覧
const breeds = [
  "affenpinscher",
  "akita",
  "beagle",
  "boxer",
  "bulldog",
  "chihuahua",
  "corgi",
  "dachshund",
  "dalmatian",
  "doberman",
  "germanshepherd",
  "golden",
  "husky",
  "labrador",
  "malamute",
  "papillon",
  "pomeranian",
  "poodle",
  "pug",
  "retriever",
  "rottweiler",
  "samoyed",
  "shiba",
  "shihtzu",
  "whippet"
];


// サイドバー生成
function createBreedList(list){

  breedList.innerHTML = "";

  list.forEach(breed => {

    const label = document.createElement("label");

    label.innerHTML = `
      <input
        type="checkbox"
        value="${breed}"
      >
      ${breed}
    `;

    breedList.appendChild(label);

  });

}

createBreedList(breeds);


// 「検索欄」に文字が入力された時に実行
searchInput.addEventListener("input", () => {

  // 入力された文字を取得
  //
  // 例：
  // 「shi」と入力された場合
  // keyword = "shi"
  //
  // toLowerCase() は小文字化
  //
  // 例えば：
  // "Shiba"
  // ↓
  // "shiba"
  //
  // 大文字小文字を区別しない検索にするため
  const keyword =
    searchInput.value.toLowerCase();


  // breeds 配列を検索して
  // 条件に一致した犬種だけを取り出す
  //
  // filter() は
  // 「条件に合うデータだけを残す」
  // 配列メソッド
  //
  // breed には
  // breeds の中身が1個ずつ入る
  //
  // 例：
  // "shiba"
  // "husky"
  // "corgi"
  // ...
  const filtered = breeds.filter(breed =>

    // includes() は
    // 「文字が含まれているか」
    // を判定
    //
    // 例：
    //
    // "shiba".includes("shi")
    // ↓
    // true
    //
    // "husky".includes("shi")
    // ↓
    // false
    //
    // true の犬種だけ残る
    breed.includes(keyword)

  );


  // フィルター後の犬種一覧で
  // サイドバーを再生成
  //
  // 例：
  // ["shiba","shihtzu"]
  //
  // のみ表示される
  createBreedList(filtered);

});


// サイドバー変更
breedList.addEventListener("change", loadDogs);


// 初期表示
window.addEventListener("load", () => {

  const randomBreed =
    breeds[Math.floor(Math.random() * breeds.length)];

  const target =
    document.querySelector(
      `input[value="${randomBreed}"]`
    );

  if(target){

    target.checked = true;

    loadDogs();

  }

});


// 犬画像読み込み
//
// async は
// 「API通信が終わるまで待てる」関数
async function loadDogs(){

  // ギャラリーを一旦空にする
  gallery.innerHTML = "";


  // チェックされた犬種を取得
  // map() で value だけ取り出す
  const selectedBreeds = [
    ...document.querySelectorAll(
      'input:checked'
    )
  ].map(input => input.value);


  // 1つも選択されていない場合
  if(selectedBreeds.length === 0){

    // メッセージ表示
    statusText.textContent =
      "犬種を選択してください";

    // 処理終了
    return;

  }


  // ステータスメッセージを消す
  statusText.textContent = "";


  // ローディング表示
  loading.classList.remove("hidden");


  // エラー監視開始
  try{

    // 選択された犬種を1つずつ処理
    for(const breed of selectedBreeds){

      // API用の犬種名
      let apiBreed = breed;


      // API特殊対応
      //
      // germanshepherd
      // ↓
      // german/shepherd
      //
      // API仕様に合わせる
      if(breed === "germanshepherd"){
        apiBreed = "german/shepherd";
      }


      // APIから画像取得
      const response = await fetch(
        `https://dog.ceo/api/breed/${apiBreed}/images/random/5`
      );


      // 通信失敗チェック
      if(!response.ok){
        throw new Error("API ERROR");
      }


      // JSON変換
      const data = await response.json();


      // 画像URLを1枚ずつ処理
      data.message.forEach(url => {

        // カード生成
        createCard(url, breed);

      });

    }

  }


  // エラー時
  catch(error){

    // エラー内容表示
    console.error(error);


    // ユーザー向けメッセージ
    statusText.textContent =
      "API取得失敗。ダミー画像を表示しています。";


    // ダミー画像表示
    selectedBreeds.forEach(breed => {

      // 5枚生成
      for(let i = 1; i <= 5; i++){

        createCard(
          `https://placehold.co/600x600?text=${breed}`,
          breed
        );

      }

    });

  }


  // ローディング非表示
  loading.classList.add("hidden");

}


// カード生成
function createCard(url, breed){

  const card = document.createElement("div");

  card.className = "card";

  card.innerHTML = `
    <img src="${url}" alt="${breed}">

    <div class="card-info">
      <h3>${breed}</h3>
      <p>Click to zoom</p>
    </div>
  `;


  // モーダル
  card.addEventListener("click", () => {

    modal.classList.remove("hidden");

    modalImage.src = url;

    modalText.textContent = breed;

  });


  gallery.appendChild(card);

}


// モーダル閉じる
closeModal.addEventListener("click", () => {

  modal.classList.add("hidden");

});