// Records the redesigned prototype as webm using Playwright,
// driving the page through hero, practice (with auto-typing demo),
// lessons, and stats sections to match the narration timeline.

const { chromium } = require('playwright');
const path = require('path');

const W = 1280, H = 800;
// Target total duration ~98s to match audio.
const TIMELINE = [
  // [duration_ms, action]
  [11000, async (page) => { /* hero hold */ }],
  [4000,  async (page) => { await page.evaluate(() => window.scrollTo({top: 80, behavior:'smooth'})); }],
  [3000,  async (page) => { await page.evaluate(() => window.scrollTo({top: 200, behavior:'smooth'})); }],
  // Scroll to practice
  [3000,  async (page) => {
      await page.evaluate(() => document.querySelector('#practice').scrollIntoView({behavior:'smooth', block:'start'}));
  }],
  // Hold + auto-typing in practice
  [22000, async (page) => {
      // Trigger demo typing in-page
      await page.evaluate(() => {
        const el = document.getElementById('text');
        const PASSAGE = "The quick brown fox jumps over the lazy dog. Practice every day to build muscle memory.";
        let i = 0; let typed = ""; let mistakes = 0; let startTs = performance.now();
        const wpmEl = document.getElementById('wpm');
        const accEl = document.getElementById('acc');
        const timeEl = document.getElementById('time');
        function render() {
          let html = "";
          for (let j = 0; j < PASSAGE.length; j++) {
            const ch = PASSAGE[j];
            if (j < typed.length) {
              const ok = typed[j] === ch;
              html += `<span class="ch ${ok ? "ch--ok" : "ch--bad"}">${ch === " " ? "&nbsp;" : ch}</span>`;
            } else if (j === typed.length) {
              html += `<span class="caret"></span><span class="ch">${ch === " " ? "&nbsp;" : ch}</span>`;
            } else {
              html += `<span class="ch">${ch === " " ? "&nbsp;" : ch}</span>`;
            }
          }
          el.innerHTML = html;
        }
        function metrics() {
          const elapsed = (performance.now() - startTs) / 1000;
          const words = typed.length / 5;
          const wpm = elapsed > 0 ? Math.round((words/elapsed)*60) : 0;
          const correct = typed.length - mistakes;
          const acc = typed.length === 0 ? 100 : Math.max(0, Math.round((correct/typed.length)*100));
          wpmEl.textContent = String(wpm);
          accEl.textContent = acc + '%';
          timeEl.textContent = Math.floor(elapsed) + 's';
        }
        const mt = setInterval(metrics, 200);
        function tick() {
          if (i >= PASSAGE.length) { clearInterval(mt); metrics(); return; }
          if (Math.random() < 0.05 && i > 6 && i < PASSAGE.length-2) {
            typed += 'x'; mistakes++; render();
            setTimeout(() => { typed = typed.slice(0,-1); render(); setTimeout(real, 90); }, 160);
          } else { real(); }
          function real() {
            typed += PASSAGE[i]; i++;
            render();
            setTimeout(tick, 120 + Math.random()*100);
          }
        }
        setTimeout(tick, 600);
      });
  }],
  // Scroll to lessons
  [2000, async (page) => {
      await page.evaluate(() => document.querySelector('#lessons').scrollIntoView({behavior:'smooth', block:'start'}));
  }],
  [13000, async (page) => {
      // Hover each lesson card
      const cards = await page.locator('.lesson').all();
      for (const c of cards) {
        try { await c.hover(); } catch(e) {}
        await page.waitForTimeout(2500);
      }
  }],
  // Scroll to stats
  [2000, async (page) => {
      await page.evaluate(() => document.querySelector('#stats').scrollIntoView({behavior:'smooth', block:'start'}));
  }],
  [16000, async (page) => { /* hold on stats */ }],
  // Final: back to top
  [3000, async (page) => {
      await page.evaluate(() => window.scrollTo({top: 0, behavior:'smooth'}));
  }],
  [4000, async (page) => { /* final hero hold */ }],
];

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: { dir: path.resolve(__dirname, 'build/video'), size: { width: W, height: H } },
  });
  const page = await context.newPage();
  const url = `file://${path.resolve(__dirname, 'index.html')}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  let total = 0;
  for (const [dur, fn] of TIMELINE) {
    try { await fn(page); } catch(e) { console.error('step err', e.message); }
    await page.waitForTimeout(dur);
    total += dur;
    console.log('step done, total ms:', total);
  }

  await context.close();
  await browser.close();
  console.log('DONE');
})();
