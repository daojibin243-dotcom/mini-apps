const javascriptQuestions = [

  {
    code: "const count = 0;",
    title: "const",
    description: "定数を宣言",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/const"
  },

  {
    code: "let score = 100;",
    title: "let",
    description: "変数を宣言",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let"
  },

  {
    code: "console.log(\"Hello\");",
    title: "console.log",
    description: "コンソール出力",
    link: "https://developer.mozilla.org/ja/docs/Web/API/console/log_static"
  },

  {
    code: "document.getElementById(\"app\")",
    title: "getElementById",
    description: "IDから要素取得",
    link: "https://developer.mozilla.org/ja/docs/Web/API/Document/getElementById"
  },

  {
    code: "document.querySelector(\".box\")",
    title: "querySelector",
    description: "CSSセレクタで要素取得",
    link: "https://developer.mozilla.org/ja/docs/Web/API/Document/querySelector"
  },

  {
    code: "addEventListener(\"click\", handleClick)",
    title: "addEventListener",
    description: "イベント登録",
    link: "https://developer.mozilla.org/ja/docs/Web/API/EventTarget/addEventListener"
  },

  {
    code: "setTimeout(() => {}, 1000)",
    title: "setTimeout",
    description: "一定時間後に実行",
    link: "https://developer.mozilla.org/ja/docs/Web/API/setTimeout"
  },

  {
    code: "setInterval(() => {}, 1000)",
    title: "setInterval",
    description: "一定間隔で実行",
    link: "https://developer.mozilla.org/ja/docs/Web/API/setInterval"
  },

  {
    code: "Math.floor(Math.random() * 10)",
    title: "Math.random",
    description: "ランダム数値生成",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random"
  },

  {
    code: "array.push(item)",
    title: "push",
    description: "配列追加",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push"
  },

  {
    code: "array.map(item => item.id)",
    title: "map",
    description: "配列変換",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
  },

  {
    code: "array.filter(item => item.active)",
    title: "filter",
    description: "条件で絞り込み",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter"
  },

  {
    code: "array.forEach(item => console.log(item))",
    title: "forEach",
    description: "配列ループ",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach"
  },

  {
    code: "if(score > 100) {}",
    title: "if文",
    description: "条件分岐",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/if...else"
  },

  {
    code: "for(let i = 0; i < 10; i++) {}",
    title: "for文",
    description: "繰り返し処理",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for"
  },

  {
    code: "function hello() {}",
    title: "function",
    description: "関数定義",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/function"
  },

  {
    code: "const hello = () => {}",
    title: "アロー関数",
    description: "Arrow Function",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions"
  },

  {
    code: "fetch(\"/api/data\")",
    title: "fetch",
    description: "API通信",
    link: "https://developer.mozilla.org/ja/docs/Web/API/Fetch_API"
  },

  {
    code: "localStorage.setItem(\"score\", 100)",
    title: "localStorage",
    description: "ブラウザ保存",
    link: "https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage"
  },

  {
    code: "JSON.parse(data)",
    title: "JSON.parse",
    description: "JSON文字列を変換",
    link: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse"
  }

];