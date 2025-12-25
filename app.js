const CHAR_ASSETS = {
  "ロジカルアナリスト": "./assets/chars/png64/system-architect.png",
  "職人エンジニア": "./assets/chars/png64/core-engineer.png",
  "アイデア職人": "./assets/chars/png64/solution-designer.png",
  "ビジョンリーダー": "./assets/chars/png64/tech-lead.png",
  "現場ファイター": "./assets/chars/png64/field-engineer.png",
  "現場指揮官": "./assets/chars/png64/field-commander.png",
  "バランスタイプ": "./assets/chars/png64/generalist.png"
};
// X: 0=深掘り ←→ 100=推進
// Y: 0=構造/設計 ←→ 100=現場/運用
const CHAR_POS = {
  "ロジカルアナリスト": { x: 25, y: 20 },
  "職人エンジニア":     { x: 30, y: 55 },
  "アイデア職人":       { x: 70, y: 30 },
  "ビジョンリーダー":   { x: 80, y: 15 },
  "現場ファイター":     { x: 55, y: 85 },
  "現場指揮官":         { x: 85, y: 75 },
  "バランスタイプ":     { x: 55, y: 55 }
};

const QUESTIONS = [
  {
    id: "q1",
    title: "Q1. 物事を考えるとき、最初に意識するのは？",
    options: [
      { v: "A", t: "A：ロジック（根拠・整合性）" },
      { v: "B", t: "B：直感（アイデア・イメージ）" },
      { v: "C", t: "C：経験（これまでの実例）" },
    ],
  },
  {
    id: "q2",
    title: "Q2. 新しい課題を渡されたときの行動は？",
    options: [
      { v: "A", t: "A：まず調査して整理する" },
      { v: "B", t: "B：動かしながら理解する" },
      { v: "C", t: "C：早めに誰かに方向性を確認する" },
    ],
  },
  {
    id: "q3",
    title: "Q3. 仕事のスピード感は？",
    options: [
      { v: "A", t: "A：丁寧で正確" },
      { v: "B", t: "B：とりあえず動かすのが早い" },
      { v: "C", t: "C：必要とあればすぐ決断して進める" },
    ],
  },
  {
    id: "q4",
    title: "Q4. 報連相のスタイルは？",
    options: [
      { v: "A", t: "A：こまめに報告する" },
      { v: "B", t: "B：最低限の要点だけ伝える" },
      { v: "C", t: "C：自分で完結させてから報告する" },
    ],
  },
  {
    id: "q5",
    title: "Q5. トラブル発生時の動きは？",
    options: [
      { v: "A", t: "A：原因分析を徹底する" },
      { v: "B", t: "B：とりあえず応急対応する" },
      { v: "C", t: "C：関係者を集めて調整する" },
    ],
  },
  {
    id: "q6",
    title: "Q6. チームでの立ち回りは？",
    options: [
      { v: "A", t: "A：着実に仕上げる職人タイプ" },
      { v: "B", t: "B：周囲との橋渡し役が多い" },
      { v: "C", t: "C：方向性を決めて引っ張る" },
    ],
  },
  {
    id: "q7",
    title: "Q7. ドキュメントに対する姿勢は？",
    options: [
      { v: "A", t: "A：必ず残しておきたい" },
      { v: "B", t: "B：必要なものだけでいい" },
      { v: "C", t: "C：まず動くものを優先したい" },
    ],
  },
  {
    id: "q8",
    title: "Q8. 新技術への反応は？",
    options: [
      { v: "A", t: "A：安定してから取り入れたい" },
      { v: "B", t: "B：触ってみて判断したい" },
      { v: "C", t: "C：価値があればすぐ提案したい" },
    ],
  },
  {
    id: "q9",
    title: "Q9. 得意なのは？",
    options: [
      { v: "A", t: "A：要件整理・仕様詰め" },
      { v: "B", t: "B：UI/UX改善やアイデア出し" },
      { v: "C", t: "C：実装・手を動かすこと" },
    ],
  },
  {
    id: "q10",
    title: "Q10. 仕事で嬉しい瞬間は？",
    options: [
      { v: "A", t: "A：問題原因を突き止めたとき" },
      { v: "B", t: "B：アイデアが採用されたとき" },
      { v: "C", t: "C：プロジェクトが前進したとき" },
    ],
  },
];

function renderQuestions() {
  const host = document.getElementById("questions");
  host.innerHTML = "";
  QUESTIONS.forEach((q, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "q";
    wrap.innerHTML = `
      <div class="q-title">${q.title}</div>
      <div class="options">
        ${q.options
          .map(
            (o) => `
          <label class="opt">
            <input type="radio" name="${q.id}" value="${o.v}" required />
            ${o.t}
          </label>`
          )
          .join("")}
      </div>
    `;
    host.appendChild(wrap);
  });
}

function countABC(arr) {
  return arr.reduce(
    (acc, v) => {
      if (v === "A") acc.A++;
      if (v === "B") acc.B++;
      if (v === "C") acc.C++;
      return acc;
    },
    { A: 0, B: 0, C: 0 }
  );
}

function maxKeyABC(c) {
  let k = "A";
  let m = c.A;
  if (c.B > m) { k = "B"; m = c.B; }
  if (c.C > m) { k = "C"; m = c.C; }
  return k;
}

function computeResult(answers) {  
  // 思考（Q1,Q9）
  const thinkKey = maxKeyABC(countABC([answers.q1, answers.q9]));
  const thinkType = thinkKey === "A" ? "ロジック型" : thinkKey === "B" ? "クリエイティブ型" : "現場感覚型";

  // 行動（Q3,Q5,Q6）
  const actKey = maxKeyABC(countABC([answers.q3, answers.q5, answers.q6]));
  const actType = actKey === "A" ? "分析型" : actKey === "B" ? "実行型" : "推進／調整型";

  // コミュニケーション（Q4）
  const comKey = answers.q4;
  const comType = comKey === "A" ? "早め早めタイプ" : comKey === "B" ? "必要最小限タイプ" : "事後報告タイプ";

  const charName = `${thinkType} × ${actType} × ${comType}`;

  // キャラ名（必要なら全組合せに拡張）
  let nickname = "バランスタイプ";
  if (thinkType === "ロジック型" && actType === "分析型") nickname = "ロジカルアナリスト";
  else if (thinkType === "ロジック型" && actType === "実行型") nickname = "職人エンジニア";
  else if (thinkType === "クリエイティブ型" && actType === "実行型") nickname = "アイデア職人";
  else if (thinkType === "クリエイティブ型" && actType === "推進／調整型") nickname = "ビジョンリーダー";
  else if (thinkType === "現場感覚型" && actType === "実行型") nickname = "現場ファイター";
  else if (thinkType === "現場感覚型" && actType === "推進／調整型") nickname = "現場指揮官";

  const desc =
    `思考の軸「${thinkType}」は考え方のベース、行動の軸「${actType}」は仕事の進め方、` +
    `コミュニケーションの軸「${comType}」は報連相スタイルを表します。` +
    `タイプに良し悪しはなく、フェーズにより活躍領域が変わります。`;

  return { nickname, charName, thinkType, actType, comType, desc };
}

function getAnswers(form) {
  const data = new FormData(form);
  const ans = {};
  QUESTIONS.forEach((q) => (ans[q.id] = data.get(q.id)));
  return ans;
}

function validateAnswers(ans) {
  return QUESTIONS.every((q) => ans[q.id] === "A" || ans[q.id] === "B" || ans[q.id] === "C");
}

function setResultUI(r) {
  const setText = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v ?? "";
  };

  setText("nickname", r.nickname);
  setText("charName", `（${r.charName}）`);
  setText("thinkType", r.thinkType);
  setText("actType", r.actType);
  setText("comType", r.comType);
  setText("desc", r.desc);

  // 画像反映（CHAR_ASSETS を使用）
  const imgEl = document.getElementById("charImg");
  if (imgEl) {
    const path = CHAR_ASSETS[r.nickname] || CHAR_ASSETS["バランスタイプ"];
    imgEl.src = path;
    imgEl.alt = r.nickname;
  }
  
  // --- マトリクスにプロット ---
  const pin = document.getElementById("pin");
  const pinImg = document.getElementById("pinImg");
  const pinLabel = document.getElementById("pinLabel");
  const matrix = document.getElementById("matrix");

  if (pin && pinImg && pinLabel && matrix) {
    const pos = CHAR_POS[r.nickname] || CHAR_POS["バランスタイプ"];

    // matrix内の%座標に変換
    pin.style.left = `${pos.x}%`;
    pin.style.top  = `${pos.y}%`;

    // アイコン
    pinImg.src = CHAR_ASSETS[r.nickname] || CHAR_ASSETS["バランスタイプ"];
    pinImg.alt = r.nickname;

    // ラベル
    pinLabel.textContent = r.nickname;

    pin.classList.remove("hidden");
  }

}


function buildCopyText(name, r) {
  const who = name ? `${name}：` : "";
  return `${who}${r.nickname}\n${r.charName}\n思考：${r.thinkType}\n行動：${r.actType}\nコミュニケーション：${r.comType}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestions();

  const form = document.getElementById("quiz");
  const error = document.getElementById("error");
  const result = document.getElementById("result");
  const resetBtn = document.getElementById("reset");
  const copyBtn = document.getElementById("copy");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    error.textContent = "";

    const ans = getAnswers(form);
    if (!validateAnswers(ans)) {
      error.textContent = "未回答の設問があります。すべて回答してください。";
      return;
    }

    const r = computeResult(ans);
    setResultUI(r);
    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    error.textContent = "";
    result.classList.add("hidden");
  });

  copyBtn.addEventListener("click", async () => {
    const name = (document.getElementById("name").value || "").trim();
    const ans = getAnswers(form);
    if (!validateAnswers(ans)) {
      error.textContent = "コピーするには、先に診断してください。";
      return;
    }
    const r = computeResult(ans);
    const text = buildCopyText(name, r);
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "コピーしました";
      setTimeout(() => (copyBtn.textContent = "結果をコピー"), 1200);
    } catch {
      error.textContent = "コピーに失敗しました。ブラウザの権限をご確認ください。";
    }
  });
});
