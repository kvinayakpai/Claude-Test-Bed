// Simple typing demo: runs an auto-typer on load if ?demo=1, else interactive.

const PASSAGE = "The quick brown fox jumps over the lazy dog. Practice every day to build muscle memory.";

const textEl = document.getElementById("text");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const timeEl = document.getElementById("time");
const resetBtn = document.getElementById("reset");

let typed = "";
let mistakes = 0;
let startTs = null;

function render() {
  let html = "";
  for (let i = 0; i < PASSAGE.length; i++) {
    const ch = PASSAGE[i];
    if (i < typed.length) {
      const ok = typed[i] === ch;
      html += `<span class="ch ${ok ? "ch--ok" : "ch--bad"}">${ch === " " ? "&nbsp;" : ch}</span>`;
    } else if (i === typed.length) {
      html += `<span class="caret"></span><span class="ch">${ch === " " ? "&nbsp;" : ch}</span>`;
    } else {
      html += `<span class="ch">${ch === " " ? "&nbsp;" : ch}</span>`;
    }
  }
  textEl.innerHTML = html;
}

function updateMetrics() {
  if (!startTs) {
    wpmEl.textContent = "0"; accEl.textContent = "100%"; timeEl.textContent = "0s";
    return;
  }
  const elapsed = (performance.now() - startTs) / 1000;
  const wordsTyped = typed.length / 5;
  const wpm = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0;
  const correct = typed.length - mistakes;
  const acc = typed.length === 0 ? 100 : Math.max(0, Math.round((correct / typed.length) * 100));
  wpmEl.textContent = String(wpm);
  accEl.textContent = acc + "%";
  timeEl.textContent = Math.floor(elapsed) + "s";
}

function reset() {
  typed = ""; mistakes = 0; startTs = null;
  render(); updateMetrics();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { e.preventDefault(); reset(); return; }
  if (e.key.length !== 1 && e.key !== "Backspace") return;
  if (e.key === "Backspace") {
    typed = typed.slice(0, -1);
  } else {
    if (!startTs) startTs = performance.now();
    if (typed.length >= PASSAGE.length) return;
    if (e.key !== PASSAGE[typed.length]) mistakes++;
    typed += e.key;
  }
  render();
});

resetBtn.addEventListener("click", reset);

setInterval(updateMetrics, 200);
render();

// --- DEMO MODE: auto-type the passage with realistic errors ---
const params = new URLSearchParams(location.search);
if (params.get("demo") === "1") {
  let i = 0;
  startTs = performance.now();
  const tick = () => {
    if (i >= PASSAGE.length) return;
    // Occasional fake mistake then correction
    if (Math.random() < 0.04 && i > 6 && i < PASSAGE.length - 2) {
      typed += "x"; mistakes++;
      render();
      setTimeout(() => {
        typed = typed.slice(0, -1); render();
        setTimeout(realChar, 90);
      }, 140);
    } else {
      realChar();
    }
    function realChar() {
      typed += PASSAGE[i]; i++;
      render();
      const delay = 55 + Math.random() * 70;
      setTimeout(tick, delay);
    }
  };
  setTimeout(tick, 800);
}

// --- AUTO-SCROLL DEMO: scroll page through sections, then back to top ---
if (params.get("scroll") === "1") {
  const sections = ["#practice", "#lessons", "#stats"];
  let idx = 0;
  const next = () => {
    if (idx >= sections.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.querySelector(sections[idx]).scrollIntoView({ behavior: "smooth", block: "start" });
    idx++;
    setTimeout(next, 4500);
  };
  setTimeout(next, 5000);
}
