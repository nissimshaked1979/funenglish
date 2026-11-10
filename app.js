'use strict';
/* ============ WordUp – English for Hebrew speakers ============ */
const NATIVE = typeof window.Android !== 'undefined';
const $ = s => document.querySelector(s);
const app = $('#app');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const DAY = 86400000;
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

/* ---------- state ---------- */
let S;
function loadState() {
  try { S = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { S = null; }
  S = Object.assign({ cards: {}, xp: 0, streak: 0, lastDay: '', today: { date: '', xp: 0, newW: 0 }, custom: {},
    settings: { rate: 0.9, newPerDay: 10, goal: 50, level: 'A1-A2' } }, S || {});
  if (S.today.date !== todayStr()) S.today = { date: todayStr(), xp: 0, newW: 0 };
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }
let STORE = 'wordup', USER = null;
loadState();

/* ---------- vocabulary ---------- */
let ALL = [], BYID = {};
function buildWords() {
  ALL = []; BYID = {};
  const add = (tk, line) => {
    const p = line.split('|'); if (p.length < 2) return;
    const w = { id: tk + ':' + p[0].trim().toLowerCase(), en: p[0].trim(), he: p[1].trim(), ex: (p[2] || '').trim(), topic: tk };
    if (BYID[w.id]) return; ALL.push(w); BYID[w.id] = w;
  };
  for (const tk in TOPICS) TOPICS[tk].w.trim().split('\n').forEach(l => add(tk, l));
  for (const tk in S.custom) S.custom[tk].words.forEach(w => add(tk, w.en + '|' + w.he + '|' + (w.ex || '')));
}
buildWords();
function topicInfo(tk) { return TOPICS[tk] || S.custom[tk] || { he: tk, icon: '✨' }; }
function topicWords(tk) { return ALL.filter(w => w.topic === tk); }
function card(id) { return S.cards[id]; }
function isLearned(id) { const c = card(id); return c && c.box >= 3; }
function dueCards() { const now = Date.now(); return Object.keys(S.cards).filter(id => BYID[id] && S.cards[id].due <= now).sort((a, b) => S.cards[a].due - S.cards[b].due); }
function seenWords() { return ALL.filter(w => S.cards[w.id]); }
const INTERVALS = [0, 1, 2, 4, 8, 16, 35, 75, 160];
function grade(id, g) { // g: 0 again, 1 hard, 2 good
  const c = S.cards[id] || (S.cards[id] = { box: 0, due: 0, ok: 0, bad: 0 });
  const now = Date.now();
  if (g === 0) { c.box = 1; c.due = now + 5 * 60000; c.bad++; }
  else if (g === 1) { c.box = Math.max(1, c.box); c.due = now + Math.max(0.5, INTERVALS[c.box] / 2) * DAY; c.ok++; }
  else { c.box = Math.min(INTERVALS.length - 1, c.box + 1); c.due = now + INTERVALS[c.box] * DAY - 3600000; c.ok++; }
  save();
}
function markSeen(id) { if (!S.cards[id]) { S.cards[id] = { box: 1, due: Date.now() + 10 * 60000, ok: 0, bad: 0 }; S.today.newW++; save(); } }
function addXP(n) {
  S.xp += n; S.today.xp += n;
  const t = todayStr();
  if (S.lastDay !== t) {
    const y = new Date(Date.now() - DAY); const ys = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    S.streak = (S.lastDay === ys) ? S.streak + 1 : 1; S.lastDay = t;
  }
  save();
}

/* ---------- native bridge: TTS / STT / AI ---------- */
function speak(text, lang) {
  lang = lang || 'en-US';
  if (NATIVE) { Android.speak(String(text), lang, S.settings.rate); return; }
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = S.settings.rate; speechSynthesis.speak(u); } catch (e) {}
}
function stopSpeak() { if (NATIVE) Android.stopSpeak(); else try { speechSynthesis.cancel(); } catch (e) {} }

let sttCb = null;
window.onSpeechResult = function (json) { const cb = sttCb; sttCb = null; let arr = []; try { arr = JSON.parse(json); } catch (e) {} cb && cb.done(arr); };
window.onSpeechError = function (msg) { const cb = sttCb; sttCb = null; cb && cb.fail(msg); };
function listen(lang) {
  return new Promise((resolve, reject) => {
    stopSpeak();
    sttCb = { done: resolve, fail: reject };
    if (NATIVE) { Android.listen(lang || 'en-US'); return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) { sttCb = null; reject('זיהוי דיבור לא נתמך כאן'); return; }
    const r = window._rec || (window._rec = new R()); r.lang = lang || 'en-US'; r.maxAlternatives = 5;
    r.onresult = e => window.onSpeechResult(JSON.stringify(Array.from(e.results[0]).map(a => a.transcript)));
    r.onerror = e => window.onSpeechError(e.error);
    try { r.abort(); } catch (e) {}
    setTimeout(() => { try { r.start(); } catch (e) { window.onSpeechError('error'); } }, 60);
  });
}
function stopListen() { if (NATIVE) Android.stopListen(); }

/* ---------- ui helpers ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
function modal(html) { $('#modalBox').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
function topBar(title, back) { return `<div class="top">${back !== false ? '<button class="iconbtn" data-back>→</button>' : ''}<h1>${title}</h1></div>`; }
const stack = [];
let cleanup = null; let navId = 0;
function later(fn, ms) { const n = navId; return setTimeout(() => { if (n === navId) fn(); }, ms); }
function go(fn, ...args) { stack.push([fn, args]); run(fn, args); }
function run(fn, args) { navId++; if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; } stopSpeak(); window.scrollTo(0, 0); fn(...args); }
function back() {
  if (!$('#modal').classList.contains('hidden')) { closeModal(); return true; }
  if (stack.length <= 1) return false;
  stack.pop(); const [fn, args] = stack[stack.length - 1]; run(fn, args); return true;
}
window.goBack = () => back();
document.addEventListener('click', e => {
  const b = e.target.closest('[data-back]'); if (b) { back(); return; }
  const s = e.target.closest('[data-say]'); if (s) { e.stopPropagation(); speak(s.dataset.say, s.dataset.lang); return; }
  const r = e.target.closest('.wl'); if (r) { const sb = r.querySelector('[data-say]'); if (sb) speak(sb.dataset.say, sb.dataset.lang); }
});
const picOf = w => PICS[w.topic + ':' + w.en.toLowerCase()] || PICS[w.en.toLowerCase()] || topicInfo(w.topic).icon;
const picHtml = (w, cls) => `<span class="pic ${cls || ''}">${picOf(w)}</span>`;
const sayBtn = (t, cls) => `<button class="pill ${cls || ''}" data-say="${esc(t)}">🔊</button>`;

/* ================= HOME ================= */
function home() {
  const learned = Object.keys(S.cards).filter(id => BYID[id] && isLearned(id)).length;
  const due = dueCards().length;
  const pct = Math.min(100, Math.round(S.today.xp / S.settings.goal * 100));
  const h = new Date().getHours();
  const greet = h < 12 ? 'בוקר טוב' : h < 18 ? 'צהריים טובים' : 'ערב טוב';
  app.innerHTML = `
  <div class="top"><h1>🍓 אנגלית בכיף</h1></div>
  <div class="wrap">
    <div class="toprow"><button class="orderbtn" id="ordBtn"><span class="oi">📱➡️</span><span>הזמנת אפליקציה<br>מותאמת אישית</span></button><button class="iconbtn" id="cBtn">©</button><button class="iconbtn" id="setBtn">⚙️</button></div>
    <div class="hero">
      <div class="hi">${greet}${USER ? ', ' + esc(USER.first) : ''}!</div>
      <div class="sub">${due ? `יש לך ${due} מילים לחזרה` : 'אין מילים לחזרה – זמן ללמוד חדשות!'}</div>
      <div class="stats">
        <div class="stat"><b>🔥 ${S.streak}</b><span>ימים ברצף</span></div>
        <div class="stat"><b>${learned}</b><span>מילים נלמדו</span></div>
        <div class="stat"><b>${S.xp}</b><span>XP</span></div>
      </div>
      <div class="goal"><i style="width:${pct}%"></i></div>
      <div class="goaltxt">יעד יומי: ${S.today.xp}/${S.settings.goal} XP</div>
    </div>
    <button class="bigbtn" id="contBtn">▶ המשך ללמוד</button>
    <div class="grid">
      <button class="tile" data-go="topics"><span class="ic">📚</span><b>נושאים ומילים</b><small>${ALL.length} מילים ב-${Object.keys(TOPICS).length + Object.keys(S.custom).length} נושאים</small></button>
      <button class="tile" data-go="games"><span class="ic">🎮</span><b>חידונים ומשחקים</b><small>5 סוגי משחקים</small></button>
      <button class="tile" data-go="pron"><span class="ic">🎤</span><b>תרגול הגייה</b><small>תגיד – ואני אבדוק</small></button>
      <button class="tile wide" data-go="progress"><span class="ic">📈</span><div class="t"><b>ההתקדמות שלי</b><br><small>סטטיסטיקה ורשימות</small></div></button>
    </div>
  </div>`;
  $('#setBtn').onclick = () => go(settings);
  $('#cBtn').onclick = () => modal(`<div style="text-align:center"><img src="logo.svg" alt="" style="width:90px;height:90px"><h2 style="margin:6px 0">אנגלית בכיף</h2><div>© כל הזכויות שמורות לגלעד שקד</div><div style="color:var(--muted);margin:6px 0 14px">Free version</div><button class="primary" onclick="closeModal()">סגור</button></div>`);
  $('#ordBtn').onclick = () => { modal(`<div style="text-align:center"><div class="ordtxt">נהנתם?<br>רוצים אפליקציה איכותית מותאמת אישית בשבילכם?<br>תפנו אל</div>
    <a class="wabtn" id="waLink" href="https://wa.me/972559279725" target="_blank" rel="noopener"><span>💬</span><span class="en">0559279725</span></a>
    <button class="closelink" onclick="closeModal()">סגור</button></div>`);
    $('#waLink').onclick = e => { if (NATIVE) { e.preventDefault(); try { Android.openUrl('https://wa.me/972559279725'); } catch (x) {} } }; };
  $('#contBtn').onclick = () => go(study, null);
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go({ topics, games, pron: pronMenu, progress }[b.dataset.go]));
}

/* ================= TOPICS ================= */
function topicRow(tk) {
  const t = topicInfo(tk), ws = topicWords(tk); if (!ws.length) return '';
  const l = ws.filter(w => isLearned(w.id)).length, s = ws.filter(w => S.cards[w.id]).length;
  return `<button class="topic" data-t="${esc(tk)}"><span class="ic">${t.icon}</span><div class="t"><b>${esc(t.he)}</b>
  <small>${ws.length} מילים · ${s} נראו · ${l} נלמדו</small><div class="bar"><i style="width:${Math.round(l / ws.length * 100)}%"></i></div></div><span>←</span></button>`;
}
function topics() {
  const cust = Object.keys(S.custom);
  app.innerHTML = topBar('נושאים') + `<div class="wrap">
    ${cust.length ? '<div class="section">הנושאים שלי</div>' + cust.map(topicRow).join('') : ''}
    <div class="section">נושאים מובנים</div>${Object.keys(TOPICS).map(topicRow).join('')}</div>`;
  app.querySelectorAll('[data-t]').forEach(b => b.onclick = () => go(topicPage, b.dataset.t));
}
function topicPage(tk) {
  const t = topicInfo(tk), ws = topicWords(tk);
  app.innerHTML = topBar(t.icon + ' ' + esc(t.he)) + `<div class="wrap">
    <button class="bigbtn" id="lt">▶ למד את הנושא</button>
    <div class="row" style="margin-bottom:14px"><button class="pill" id="qt">🎯 חידון</button><button class="pill" id="mt">🧩 התאמה</button><button class="pill mic" id="pt">🎤 הגייה</button>
    ${S.custom[tk] ? '<button class="pill" id="del">🗑️ מחק נושא</button>' : ''}</div>
    <div class="wlist">${ws.map(w => `<div class="wl">${picHtml(w, 'sm')}<span class="lv">${lvl(w.id)}</span><span class="he">${esc(w.he)}</span><span class="en">${esc(w.en)}</span><button data-say="${esc(w.en)}">🔊</button></div>`).join('')}</div></div>`;
  $('#lt').onclick = () => go(study, tk);
  $('#qt').onclick = () => go(quiz, 'en2he', tk);
  $('#mt').onclick = () => go(matchGame, tk);
  $('#pt').onclick = () => go(pronPractice, 'words', tk);
  if ($('#del')) $('#del').onclick = () => { if (confirm('למחוק את הנושא?')) { delete S.custom[tk]; save(); buildWords(); back(); } };
}
function lvl(id) { const c = S.cards[id]; if (!c) return '—'; return c.box >= 3 ? '✅' : '⭐'.repeat(Math.max(1, c.box)); }

/* ================= STUDY (flashcards + SRS) ================= */
function buildSession(tk) {
  const now = Date.now();
  let due = dueCards().filter(id => !tk || BYID[id].topic === tk).slice(0, 20).map(id => ({ id, kind: 'rev' }));
  const room = Math.max(tk ? 8 : 0, S.settings.newPerDay - S.today.newW);
  let pool = (tk ? topicWords(tk) : ALL).filter(w => !S.cards[w.id]);
  if (!tk) { // go topic by topic in order
    const order = Object.keys(S.custom).concat(Object.keys(TOPICS));
    pool.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
  }
  const fresh = pool.slice(0, Math.min(room, tk ? 8 : room)).map(w => ({ id: w.id, kind: 'new' }));
  // interleave: new word, then its quick check later
  const q = [];
  fresh.forEach(f => q.push(f));
  q.push(...due);
  fresh.forEach(f => q.push({ id: f.id, kind: 'check' }));
  return q;
}
function study(tk) {
  const q = buildSession(tk);
  if (!q.length) {
    app.innerHTML = topBar('לימוד') + `<div class="wrap"><div class="result"><div class="big">🎉</div><h2>סיימת להיום!</h2>
    <p style="color:var(--muted)">אין מילים לחזרה ועברת את מכסת המילים החדשות היומית.</p>
    <button class="primary" id="more">עוד 10 מילים חדשות</button><button class="secondary" id="gm">🎮 למשחקים</button></div></div>`;
    $('#more').onclick = () => { S.settings.newPerDay += 10; save(); run(study, [tk]); };
    $('#gm').onclick = () => go(games);
    return;
  }
  let i = 0, xp = 0;
  const total = q.length;
  function show() {
    if (i >= q.length) { addXP(0); return done(); }
    const it = q[i], w = BYID[it.id];
    const pct = Math.round(i / total * 100);
    let html = topBar((tk ? topicInfo(tk).he : 'לימוד') + ` · ${i + 1}/${total}`) + `<div class="wrap"><div class="progress"><i style="width:${pct}%"></i></div>`;
    if (it.kind === 'new') {
      markSeen(w.id);
      html += `<div class="fcard"><span class="badge">מילה חדשה</span>
        ${picHtml(w, 'big')}
        <div class="fword en">${esc(w.en)}</div>
        <div class="fhe">${esc(w.he)}</div>
        ${w.ex ? `<div class="fex en">${esc(w.ex)}</div>` : ''}
        <div class="row" style="margin-top:10px">${sayBtn(w.en)}<button class="pill mic" id="mic">🎤 נסה להגיד</button></div>
        <div class="heard" id="heard"></div></div>
        <button class="primary" id="next">הבנתי, הבא ←</button>`;
      app.innerHTML = html + '</div>';
      speak(w.en);
      $('#mic').onclick = () => tryPron(w.en, $('#mic'), $('#heard'));
      $('#next').onclick = () => { xp += 2; addXP(2); i++; show(); };
    } else {
      const reverse = it.kind !== 'check' && (S.cards[w.id] || {}).box >= 2 && Math.random() < 0.4;
      html += `<div class="fcard" id="fc"><span class="badge rev">${it.kind === 'check' ? 'בדיקה' : 'חזרה'}</span>
        ${reverse ? `<div class="fhe" style="font-size:2rem">${esc(w.he)}</div><div class="hint">איך אומרים באנגלית?</div>`
                  : `<div class="fword en">${esc(w.en)}</div><div class="hint">מה זה אומר?</div>`}
        <div id="ans" class="hidden" style="display:flex;flex-direction:column;gap:8px;align-items:center">
          ${picHtml(w, 'big')}
          ${reverse ? `<div class="fword en">${esc(w.en)}</div>` : `<div class="fhe">${esc(w.he)}</div>`}
          ${w.ex ? `<div class="fex en">${esc(w.ex)}</div>` : ''}
          <div class="row">${sayBtn(w.en)}${reverse ? '<button class="pill mic" id="mic">🎤</button>' : ''}</div><div class="heard" id="heard"></div>
        </div></div>
        <button class="primary" id="flip">הצג תשובה</button>
        <div class="grades hidden" id="gr"><button class="g-again" data-g="0">שכחתי 😕</button><button class="g-hard" data-g="1">קשה 🤔</button><button class="g-good" data-g="2">ידעתי 😎</button></div>`;
      app.innerHTML = html + '</div>';
      if (!reverse) speak(w.en);
      const flip = () => { $('#ans').classList.remove('hidden'); $('#flip').classList.add('hidden'); $('#gr').classList.remove('hidden'); if (reverse) speak(w.en); };
      $('#flip').onclick = flip; $('#fc').onclick = e => { if (!e.target.closest('button')) flip(); };
      if ($('#mic')) $('#mic').onclick = () => tryPron(w.en, $('#mic'), $('#heard'));
      app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
        const g = +b.dataset.g; grade(w.id, g);
        if (g === 0) q.push({ id: w.id, kind: 'check' });
        const gx = g === 2 ? 5 : g === 1 ? 3 : 1; xp += gx; addXP(gx); i++; show();
      });
    }
  }
  function done() {
    app.innerHTML = topBar('כל הכבוד!') + `<div class="wrap"><div class="result"><div class="big">🏆</div><h2>סיימת את הסבב!</h2>
      <p>הרווחת <b>${xp} XP</b> · רצף: 🔥 ${S.streak}</p>
      <button class="primary" id="again">סבב נוסף</button><button class="secondary" id="qz">🎯 חידון על המילים</button><button class="secondary" data-back>חזרה</button></div></div>`;
    $('#again').onclick = () => run(study, [tk]);
    $('#qz').onclick = () => go(quiz, 'en2he', tk);
  }
  show();
}

/* ================= PRONUNCIATION CHECK ================= */
const norm = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
  return p[n];
}
function compare(target, alts) {
  const tw = norm(target).split(' ').filter(Boolean);
  let best = null;
  (alts.length ? alts : ['']).forEach(alt => {
    const hw = norm(alt).split(' ').filter(Boolean);
    const used = new Set();
    const marks = tw.map(t => {
      for (let k = 0; k < hw.length; k++) {
        if (used.has(k)) continue;
        const d = lev(t, hw[k]);
        if (d === 0 || (t.length > 4 && d <= 1)) { used.add(k); return true; }
      }
      return false;
    });
    const okc = marks.filter(Boolean).length;
    const whole = 1 - lev(tw.join(' '), hw.join(' ')) / Math.max(1, tw.join(' ').length, hw.join(' ').length);
    const score = Math.round(Math.max(0, (okc / tw.length) * 0.7 + whole * 0.3) * 100);
    if (!best || score > best.score) best = { score, marks, heard: alt };
  });
  return { score: best.score, marks: best.marks, heard: best.heard, words: target.split(/\s+/) };
}
async function tryPron(target, btn, out) {
  btn.classList.add('listening'); out.innerHTML = '<span style="color:var(--muted)">מקשיב... דבר עכשיו</span>';
  try {
    const alts = await listen('en-US');
    btn.classList.remove('listening');
    const r = compare(target, alts);
    const c = r.score >= 85 ? 'var(--good)' : r.score >= 60 ? 'var(--warn)' : 'var(--bad)';
    out.innerHTML = `<div style="color:${c};font-weight:700">${r.score >= 85 ? 'מצוין! 🎉' : r.score >= 60 ? 'כמעט! 👍' : 'נסה שוב 💪'} ${r.score}%</div>
      <div style="color:var(--muted);font-size:.85rem">שמעתי: <span class="en">"${esc(r.heard || '—')}"</span></div>`;
    if (r.score >= 85) addXP(3);
    return r;
  } catch (e) { btn.classList.remove('listening'); out.innerHTML = `<span style="color:var(--bad)">${esc(sttMsg(e))}</span>`; return null; }
}
function micHelp() {
  const steps = NATIVE
    ? ['לחץ על הכפתור "פתח הגדרות" למטה', 'היכנס ל"הרשאות" (Permissions)', 'לחץ על "מיקרופון"', 'בחר "אפשר רק בזמן השימוש באפליקציה" (Allow)', 'חזור לאפליקציה ונסה שוב']
    : ['לחץ על סמל המנעול 🔒 (או ⚙️) משמאל לכתובת האתר, למעלה בדפדפן', 'מצא את השורה "מיקרופון" (Microphone)', 'לחץ על המתג כדי להדליק אותו, או בחר "אפשר" (Allow)', 'טען את הדף מחדש (F5) ונסה שוב'];
  modal(`<div style="text-align:right"><h2 style="margin:0 0 8px">🎤 המיקרופון חסום</h2><div style="color:var(--muted);margin-bottom:8px">כדי שההגייה תעבוד צריך להדליק את המיקרופון:</div><ol style="padding-right:20px;line-height:1.9;margin:0 0 14px">${steps.map(t => '<li>' + t + '</li>').join('')}</ol>${NATIVE ? '<button class="primary" id="openSet">⚙️ פתח הגדרות</button>' : ''}<button class="secondary" onclick="closeModal()" style="margin-top:8px">סגור</button></div>`);
  const ob = document.getElementById('openSet'); if (ob) ob.onclick = () => { try { Android.openSettings(); } catch (e) {} };
}
function sttMsg(e) {
  const m = String(e || '');
  if (/no.?match|no-speech|7|6/i.test(m)) return 'לא שמעתי כלום – נסה שוב קרוב יותר למיקרופון';
  if (/permission|not-allowed|9/i.test(m)) { setTimeout(micHelp, 50); return 'המיקרופון חסום – ראה הסבר איך מפעילים'; }
  if (/unavailable|not supported|לא נתמך/i.test(m)) return 'זיהוי דיבור לא זמין בטלפון. התקן/עדכן את אפליקציית Google.';
  return 'שגיאת זיהוי דיבור: ' + m;
}

function pronMenu() {
  app.innerHTML = topBar('תרגול הגייה') + `<div class="wrap">
    <div class="note">🎤 המכשיר יקריא לך מילה או משפט. לחץ על המיקרופון ותגיד אותם באנגלית – תקבל ציון וגם תראה אילו מילים לא נקלטו.</div>
    <button class="scen" data-m="words"><span class="ic">🔤</span><div><b>מילים בודדות</b><small>מהמילים שכבר ראית</small></div></button>
    <button class="scen" data-m="sent"><span class="ic">💬</span><div><b>משפטים</b><small>משפטי דוגמה מהמילים שלך</small></div></button>
    <button class="scen" data-m="phr"><span class="ic">🗣️</span><div><b>ביטויים שימושיים לשיחה</b><small>How are you, Can you repeat that ועוד</small></div></button>
    <button class="scen" data-m="tw"><span class="ic">👅</span><div><b>צלילים קשים לדוברי עברית</b><small>th, w/v, i/ee, r – תרגול ממוקד</small></div></button>
  </div>`;
  app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => go(pronPractice, b.dataset.m, null));
}
const TRICKY = [
  ['three / tree', 'th כמו בשן לשון בין השיניים'], ['I think so', 'th חסר קול – think'], ['this and that', 'th קולי – this'],
  ['thank you very much', 'th + v'], ['very well', 'v נוגעת בשפה, w מעגלים שפתיים'], ['west and vest', 'w לעומת v'],
  ['wine and vine', 'w לעומת v'], ['ship and sheep', 'i קצרה לעומת ee ארוכה'], ['live and leave', 'i קצרה לעומת ee'],
  ['full and fool', 'u קצרה לעומת oo'], ['red lorry, yellow lorry', 'r אנגלית – בלי לגלגל'], ['world', 'r + l – מילה קשה!'],
  ['beach', 'ee ארוכה'], ['the weather is wonderful', 'th + w'], ['walk and work', 'וואוק לעומת ווירק'], ['comfortable', 'קאמפ-טר-בל, 3 הברות']
];
function pronPractice(mode, tk) {
  let items;
  if (mode === 'tw') items = shuffle(TRICKY).map(x => ({ t: x[0], h: x[1] }));
  else if (mode === 'phr') items = shuffle(topicWords('conversation')).map(w => ({ t: w.en, h: w.he }));
  else {
    let pool = tk ? topicWords(tk) : seenWords();
    if (pool.length < 5) pool = pool.concat(topicWords('basics'), topicWords('verbs1'));
    pool = shuffle(pool);
    items = mode === 'sent' ? pool.filter(w => w.ex).map(w => ({ t: w.ex, h: w.en + ' = ' + w.he })) : pool.map(w => ({ t: w.en, h: w.he }));
  }
  items = items.slice(0, 10);
  let i = 0, total = 0, cnt = 0;
  function show() {
    if (i >= items.length) {
      const avg = cnt ? Math.round(total / cnt) : 0;
      app.innerHTML = topBar('תרגול הגייה') + `<div class="wrap"><div class="result"><div class="big">${avg >= 80 ? '🏅' : '💪'}</div><h2>ציון ממוצע: ${avg}%</h2>
      <button class="primary" id="ag">עוד סבב</button><button class="secondary" data-back>חזרה</button></div></div>`;
      $('#ag').onclick = () => run(pronPractice, [mode, tk]); return;
    }
    const it = items[i];
    app.innerHTML = topBar(`הגייה · ${i + 1}/${items.length}`) + `<div class="wrap"><div class="progress"><i style="width:${i / items.length * 100}%"></i></div>
      <div class="fcard" style="min-height:240px">
        <div class="pron-words" id="pw">${it.t.split(/\s+/).map(x => `<span>${esc(x)}</span>`).join(' ')}</div>
        <div class="fex">${esc(it.h)}</div>
        <div class="row"><button class="pill" data-say="${esc(it.t)}">🔊 שמע</button><button class="pill" id="slow">🐢 לאט</button></div>
      </div>
      <button class="micbig" id="mic">🎤</button><div style="text-align:center;color:var(--muted);font-size:.85rem">לחץ ודבר</div>
      <div id="res" style="text-align:center"></div>
      <button class="primary" id="nx">הבא ←</button></div>`;
    speak(it.t);
    $('#slow').onclick = () => { if (NATIVE) Android.speak(it.t, 'en-US', 0.55); else { const r = S.settings.rate; S.settings.rate = .55; speak(it.t); S.settings.rate = r; } };
    $('#nx').onclick = () => { i++; show(); };
    let tries = 0, bestS = 0;
    $('#mic').onclick = async () => {
      const btn = $('#mic'); btn.classList.add('listening'); $('#res').innerHTML = '<p style="color:var(--muted)">מקשיב...</p>';
      try {
        const alts = await listen('en-US'); btn.classList.remove('listening');
        const r = compare(it.t, alts); tries++;
        $('#pw').innerHTML = r.words.map((x, k) => `<span class="${r.marks[k] ? 'pw-ok' : 'pw-no'}">${esc(x)}</span>`).join(' ');
        const c = r.score >= 85 ? 'var(--good)' : r.score >= 60 ? 'var(--warn)' : 'var(--bad)';
        $('#res').innerHTML = `<div class="ring" style="--p:${r.score};--c:${c}"><b>${r.score}</b></div>
          <div>${r.score >= 85 ? 'מעולה! 🎉' : r.score >= 60 ? 'טוב, אפשר עוד יותר 👍' : 'עוד ניסיון 💪 הקשב שוב ונסה'}</div>
          <div style="color:var(--muted);font-size:.85rem;margin-top:4px">שמעתי: <span class="en">"${esc(r.heard || '—')}"</span></div>`;
        if (r.score > bestS) { if (r.score >= 85 && bestS < 85) addXP(5); bestS = r.score; }
        if (tries === 1 || r.score > bestS - 1) { /* keep best */ }
        $('#nx').onclick = () => { total += bestS; cnt++; i++; show(); };
      } catch (e) { btn.classList.remove('listening'); $('#res').innerHTML = `<p style="color:var(--bad)">${esc(sttMsg(e))}</p>`; }
    };
  }
  show();
}

/* ================= GAMES ================= */
function games() {
  const n = seenWords().length;
  app.innerHTML = topBar('חידונים ומשחקים') + `<div class="wrap">
    ${n < 8 ? '<div class="note">💡 המשחקים משתמשים במילים שכבר ראית. עדיין ראית מעט מילים, אז נוסיף גם מילים בסיסיות.</div>' : ''}
    <div class="grid">
      <button class="tile" data-g="en2he"><span class="ic">🇬🇧→🇮🇱</span><b>מה הפירוש?</b><small>אנגלית ← עברית</small></button>
      <button class="tile" data-g="he2en"><span class="ic">🇮🇱→🇬🇧</span><b>איך אומרים?</b><small>עברית ← אנגלית</small></button>
      <button class="tile" data-g="listen"><span class="ic">👂</span><b>הבנת הנשמע</b><small>שמע ובחר</small></button>
      <button class="tile" data-g="blank"><span class="ic">🧩</span><b>השלם את המשפט</b><small>איזו מילה חסרה?</small></button>
      <button class="tile" data-g="match"><span class="ic">🔗</span><b>משחק התאמה</b><small>חבר זוגות מהר</small></button>
    </div></div>`;
  app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
    const g = b.dataset.g;
    if (g === 'match') go(matchGame, null); else go(quiz, g, null);
  });
}
function gamePool(tk, need) {
  let pool;
  if (tk) pool = topicWords(tk);
  else pool = seenWords();
  if (pool.length < (need || 8)) { const extra = shuffle(topicWords('basics').concat(topicWords('verbs1'), topicWords('adjectives'))).filter(w => !pool.includes(w)); pool = pool.concat(extra.slice(0, (need || 8) - pool.length + 4)); }
  return pool;
}
function distractors(w, field, n) {
  const same = ALL.filter(x => x !== w && x[field] !== w[field] && x.topic === w.topic);
  const other = ALL.filter(x => x !== w && x[field] !== w[field] && x.topic !== w.topic);
  const out = [], seen = new Set([w[field]]);
  for (const x of shuffle(same).concat(shuffle(other))) { if (!seen.has(x[field])) { seen.add(x[field]); out.push(x); } if (out.length >= n) break; }
  return out;
}
const QTITLE = { en2he: 'מה הפירוש?', he2en: 'איך אומרים?', listen: 'הבנת הנשמע', blank: 'השלם את המשפט' };
function quiz(type, tk) {
  let pool = gamePool(tk, 10);
  if (type === 'blank') pool = pool.filter(w => w.ex && new RegExp('\\b' + w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(w.ex) && w.en.split(' ').length <= 2);
  if (type === 'blank' && pool.length < 6) pool = ALL.filter(w => w.ex && w.en.split(' ').length === 1 && new RegExp('\\b' + w.en + '\\b', 'i').test(w.ex));
  const qs = shuffle(pool).slice(0, 10);
  let i = 0, right = 0, streak = 0, xp = 0;
  function show() {
    if (i >= qs.length) return finish();
    const w = qs[i];
    let prompt = '', opts = [], correct = '', lbl = '', isEn = false;
    if (type === 'en2he') { lbl = 'מה הפירוש של'; prompt = `${picHtml(w, 'big')}<div class="q en">${esc(w.en)}</div><div class="row" style="justify-content:center;margin-top:8px">${sayBtn(w.en)}</div>`; correct = w.he; opts = shuffle([w].concat(distractors(w, 'he', 3))).map(x => x.he); }
    if (type === 'he2en') { lbl = 'איך אומרים באנגלית'; prompt = `<div class="q">${esc(w.he)}</div>`; correct = w.en; isEn = true; opts = shuffle([w].concat(distractors(w, 'en', 3))).map(x => x.en); }
    if (type === 'listen') { lbl = 'הקשב ובחר את הפירוש'; prompt = `<button class="micbig" data-say="${esc(w.en)}" style="background:var(--accent2)">🔊</button>`; correct = w.he; opts = shuffle([w].concat(distractors(w, 'he', 3))).map(x => x.he); }
    if (type === 'blank') {
      lbl = 'איזו מילה חסרה?';
      const re = new RegExp('\\b' + w.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      prompt = `<div class="q sent en">${esc(w.ex.replace(re, '_____'))}</div><div class="hint">(${esc(w.he)})</div>`;
      correct = w.en; isEn = true; opts = shuffle([w].concat(distractors(w, 'en', 3).filter(x => x.en.split(' ').length <= 2))).map(x => x.en);
    }
    app.innerHTML = topBar(QTITLE[type] || 'חידון') + `<div class="wrap"><div class="progress"><i style="width:${i / qs.length * 100}%"></i></div>
      <div class="score"><span>שאלה ${i + 1}/${qs.length}</span><span>✅ ${right} ${streak >= 3 ? '🔥x' + streak : ''}</span></div>
      <div class="qprompt"><div class="lbl">${lbl}</div>${prompt}</div>
      <div class="opts">${opts.map(o => `<button class="opt ${isEn ? 'en' : ''}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" id="fb"></div></div>`;
    if (type === 'listen') setTimeout(() => speak(w.en), 250);
    const answer = (ok, given) => {
      if (ok) { right++; streak++; const g = 5 + Math.min(streak, 5); xp += g; addXP(g); if (S.cards[w.id]) grade(w.id, 2); }
      else { streak = 0; if (S.cards[w.id]) grade(w.id, 0); }
      $('#fb').innerHTML = (ok ? '<span style="color:var(--good)">נכון! 🎉</span>'
        : `<span style="color:var(--bad)">התשובה: <span class="en">${esc(w.en)}</span> = ${esc(w.he)}</span>`) + (type === 'en2he' ? '' : `<div>${picHtml(w, 'big')}</div>`);
      if (type !== 'listen') speak(w.en);
      later(() => { i++; show(); }, ok ? 900 : 2200);
    };
    app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        if (app.querySelector('.opt.ok,.opt.no')) return;
        const ok = b.dataset.o === correct; b.classList.add(ok ? 'ok' : 'no'); if (isEn) speak(b.dataset.o);
        if (!ok) app.querySelectorAll('[data-o]').forEach(x => { if (x.dataset.o === correct) x.classList.add('ok'); });
        answer(ok);
      });
  }
  function finish() {
    const pct = Math.round(right / qs.length * 100);
    app.innerHTML = topBar('תוצאות') + `<div class="wrap"><div class="result"><div class="big">${pct >= 90 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</div>
      <h2>${right}/${qs.length} נכונות</h2><p>+${xp} XP</p>
      <button class="primary" id="ag">שחק שוב</button><button class="secondary" data-back>חזרה</button></div></div>`;
    $('#ag').onclick = () => run(quiz, [type, tk]);
  }
  show();
}
function matchGame(tk) {
  const words = shuffle(gamePool(tk, 10)).slice(0, 15);
  let round = 0, mistakes = 0; const t0 = Date.now();
  function show() {
    const set = words.slice(round * 5, round * 5 + 5);
    if (set.length < 3) return finish();
    const left = shuffle(set), right = shuffle(set);
    app.innerHTML = topBar('משחק התאמה') + `<div class="wrap"><div class="score"><span>סבב ${round + 1}/3</span><span>טעויות: ${mistakes}</span></div>
      <div class="match">${left.map((w, k) => `<button class="en" data-side="en" data-id="${esc(w.id)}">${esc(w.en)}</button><button data-side="he" data-id="${esc(right[k].id)}">${esc(right[k].he)}</button>`).join('')}</div></div>`;
    let sel = null, left_n = set.length;
    app.querySelectorAll('.match button').forEach(b => b.onclick = () => {
      if (b.classList.contains('done')) return;
      if (!sel || sel.dataset.side === b.dataset.side) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); speak(BYID[b.dataset.id].en); return; }
      if (sel.dataset.id === b.dataset.id) {
        sel.classList.add('done'); b.classList.add('done'); addXP(2); sel = null; left_n--;
        if (!left_n) { round++; later(show, 400); }
      } else {
        mistakes++; b.classList.add('wrong'); sel.classList.add('wrong'); const s = sel;
        setTimeout(() => { b.classList.remove('wrong'); s.classList.remove('wrong', 'sel'); }, 400); sel = null;
        app.querySelector('.score span:last-child').textContent = 'טעויות: ' + mistakes;
      }
    });
  }
  function finish() {
    const sec = Math.round((Date.now() - t0) / 1000);
    app.innerHTML = topBar('משחק התאמה') + `<div class="wrap"><div class="result"><div class="big">⏱️</div><h2>${sec} שניות</h2><p>${mistakes} טעויות</p>
      <button class="primary" id="ag">שחק שוב</button><button class="secondary" data-back>חזרה</button></div></div>`;
    $('#ag').onclick = () => run(matchGame, [tk]);
  }
  show();
}
/* ================= PROGRESS ================= */
function progress() {
  const ids = Object.keys(S.cards).filter(id => BYID[id]);
  const learned = ids.filter(isLearned), learning = ids.filter(id => !isLearned(id));
  const list = arr => `<div class="wlist">${arr.slice(0, 200).map(id => { const w = BYID[id]; return `<div class="wl">${picHtml(w, 'sm')}<span class="lv">${lvl(id)}</span><span class="he">${esc(w.he)}</span><span class="en">${esc(w.en)}</span><button data-say="${esc(w.en)}">🔊</button></div>`; }).join('') || '<div class="wl" style="color:var(--muted)">עדיין אין</div>'}</div>`;
  app.innerHTML = topBar('ההתקדמות שלי') + `<div class="wrap">
    <div class="statrow"><div class="statbox"><b>${learned.length}</b><span>נלמדו ✅</span></div><div class="statbox"><b>${learning.length}</b><span>בלמידה ⭐</span></div><div class="statbox"><b>${ALL.length - ids.length}</b><span>חדשות</span></div></div>
    <div class="statrow"><div class="statbox"><b>🔥${S.streak}</b><span>רצף ימים</span></div><div class="statbox"><b>${S.xp}</b><span>XP</span></div><div class="statbox"><b>${ALL.length}</b><span>מילים באפליקציה</span></div></div>
    <div class="section">⭐ בלמידה</div>${list(learning)}
    <div class="section">✅ נלמדו</div>${list(learned)}</div>`;
}

/* ================= SETTINGS ================= */
function settings() {
  const st = S.settings;
  app.innerHTML = topBar('הגדרות') + `<div class="wrap">
    <div class="field"><label>מהירות דיבור: <b id="rv">${st.rate}</b></label><input type="range" id="rate" min="0.5" max="1.3" step="0.05" value="${st.rate}"></div>
    <button class="secondary" id="tts" style="margin:-6px 0 16px">🔊 בדיקת קול</button>
    <div class="field"><label>מילים חדשות ביום</label><select id="npd">${[5, 10, 15, 20, 30, 50].map(n => `<option ${n == st.newPerDay ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="field"><label>יעד XP יומי</label><select id="goal">${[30, 50, 100, 150, 250].map(n => `<option ${n == st.goal ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <button class="primary" id="sv">שמור</button>
    <button class="secondary" id="rst" style="background:#4a1f33;margin-top:30px">איפוס כל ההתקדמות</button>
    <button class="secondary" id="logout" style="margin-top:10px">🚪 התנתק${USER ? ' (' + esc(USER.first + ' ' + USER.last) + ')' : ''}</button>
    <p style="color:var(--muted);font-size:.8rem;text-align:center;margin-top:20px">אנגלית בכיף · Free version · ${ALL.length} מילים</p></div>`;
  $('#rate').oninput = e => $('#rv').textContent = e.target.value;
  const collect = () => { st.rate = +$('#rate').value; st.newPerDay = +$('#npd').value; st.goal = +$('#goal').value; save(); };
  $('#tts').onclick = () => { collect(); speak('Hello! This is how I sound. Let\'s learn English together.'); };
  $('#sv').onclick = () => { collect(); toast('נשמר ✓'); back(); };
  $('#rst').onclick = () => { if (confirm('למחוק את כל ההתקדמות? (הנושאים ששמרת יישארו)')) { const c = S.custom, s = S.settings; localStorage.removeItem(STORE); loadState(); S.custom = c; S.settings = s; save(); buildWords(); toast('אופס'); } };
  $('#logout').onclick = () => { if (confirm('להתנתק?')) logout(); };
}

/* ================= ACCOUNTS (login / register) ================= */
function sha256(str) {
  const K = [], H = [];
  let n = 2, c = 0;
  const frac = x => ((x - Math.floor(x)) * 4294967296) | 0;
  while (c < 64) { let p = true; for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; } if (p) { if (c < 8) H[c] = frac(Math.pow(n, 1 / 2)); K[c] = frac(Math.pow(n, 1 / 3)); c++; } n++; }
  const bytes = Array.from(new TextEncoder().encode(str)); const l = bytes.length * 8;
  bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
  const rr = (x, k) => (x >>> k) | (x << (32 - k));
  for (let o = 0; o < bytes.length; o += 64) {
    const w = [];
    for (let i = 0; i < 16; i++) w[i] = (bytes[o + 4 * i] << 24) | (bytes[o + 4 * i + 1] << 16) | (bytes[o + 4 * i + 2] << 8) | bytes[o + 4 * i + 3];
    for (let i = 16; i < 64; i++) { const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
    let [a, b, cc, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}
function getUsers() { try { return JSON.parse(localStorage.getItem('wu_users') || '{}'); } catch (e) { return {}; } }
const userId = (f, l) => (f.trim() + ' ' + l.trim()).toLowerCase().replace(/\s+/g, ' ');
function startSession(id) {
  const users = getUsers(); USER = users[id]; STORE = 'wordup_' + id;
  try { localStorage.setItem('wu_session', id); } catch (e) {}
  // first account on this device keeps any progress made before accounts existed
  if (!localStorage.getItem(STORE) && localStorage.getItem('wordup') && Object.keys(users).length === 1) {
    localStorage.setItem(STORE, localStorage.getItem('wordup')); localStorage.removeItem('wordup');
  }
  loadState(); buildWords(); stack.length = 0; go(home);
}
function logout() { try { localStorage.removeItem('wu_session'); } catch (e) {} USER = null; stack.length = 0; go(auth, 'login'); }
function auth(mode) {
  const reg = mode === 'register';
  app.innerHTML = `<div class="wrap" style="padding-top:28px">
    <div style="text-align:center;margin-bottom:18px">
      <img src="logo.svg" alt="" style="width:130px;height:130px">
      <h1 style="margin:4px 0 2px;font-size:1.6rem">אנגלית בכיף</h1>
      <div style="color:var(--muted)">${reg ? 'יצירת חשבון חדש' : 'התחברות לחשבון'}</div>
    </div>
    <div class="field"><label>שם פרטי</label><input id="af" autocomplete="given-name"></div>
    <div class="field"><label>שם משפחה</label><input id="al" autocomplete="family-name"></div>
    <div class="field"><label>סיסמה</label><div class="pw"><input id="ap" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}"><button type="button" class="eye" data-eye="ap" aria-label="הצג סיסמה">👁️</button></div></div>
    ${reg ? '<div class="field"><label>אימות סיסמה</label><div class="pw"><input id="ap2" type="password" autocomplete="new-password"><button type="button" class="eye" data-eye="ap2" aria-label="הצג סיסמה">👁️</button></div></div>' : ''}
    <div id="aerr" style="color:var(--bad);text-align:center;min-height:22px;font-weight:600"></div>
    <button class="primary" id="ago">${reg ? 'הירשם' : 'התחבר'}</button>
    <button class="secondary" id="asw">${reg ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}</button>
    <div style="text-align:center;color:var(--muted);margin-top:22px;font-size:.85rem">© כל הזכויות שמורות לגלעד שקד</div></div>`;
  app.querySelectorAll('[data-eye]').forEach(b => b.onclick = () => {
    const i = $('#' + b.dataset.eye), show = i.type === 'password';
    i.type = show ? 'text' : 'password'; b.textContent = show ? '🙈' : '👁️'; b.classList.toggle('on', show);
    b.setAttribute('aria-label', show ? 'הסתר סיסמה' : 'הצג סיסמה');
  });
  const err = m => { $('#aerr').textContent = m; };
  $('#asw').onclick = () => run(auth, [reg ? 'login' : 'register']);
  const submit = () => {
    const f = $('#af').value.trim(), l = $('#al').value.trim(), p = $('#ap').value;
    if (!f || !l) return err('צריך למלא שם פרטי ושם משפחה');
    if (!p) return err('צריך למלא סיסמה');
    const users = getUsers(), id = userId(f, l);
    if (reg) {
      if (p.length < 4) return err('הסיסמה צריכה להיות לפחות 4 תווים');
      if (p !== $('#ap2').value) return err('הסיסמאות לא תואמות');
      if (users[id]) return err('כבר קיים משתמש עם השם הזה – נסה להתחבר');
      const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
      users[id] = { first: f, last: l, salt, hash: sha256(salt + p), created: Date.now() };
      localStorage.setItem('wu_users', JSON.stringify(users));
      toast('נרשמת בהצלחה! 🍓'); startSession(id);
    } else {
      const u = users[id];
      if (!u) return err('לא נמצא משתמש בשם הזה – אפשר להירשם');
      if (sha256(u.salt + p) !== u.hash) return err('סיסמה שגויה');
      startSession(id);
    }
  };
  $('#ago').onclick = submit;
  app.querySelectorAll('input').forEach(i => i.onkeydown = e => { if (e.key === 'Enter') submit(); });
}
(function boot() {
  let sid = null; try { sid = localStorage.getItem('wu_session'); } catch (e) {}
  if (sid && getUsers()[sid]) startSession(sid);
  else go(auth, Object.keys(getUsers()).length ? 'login' : 'register');
})();
