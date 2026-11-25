/* BuckMe – App-Logik */
(() => {
  const $ = (s) => document.querySelector(s);

  const GOALS = [5000, 25000, 50000, 100000, 1000000];
  const TIERS = ['Lila', 'Bronze', 'Silber', 'Gold', 'Platin', 'Diamant'];
  const PERKS = [
    'Start-Karte in Lila. Fliegen inklusive, Geruch gratis.',
    'Bronze-Karte. Zwei Fliegen haben gekündigt.',
    'Silber-Karte. Die Fliegen sind komplett ausgezogen.',
    'Gold-Karte. Wieder lila, kein Sabbern mehr, erste Münzen.',
    'Platin-Karte. Er lächelt wieder – und hat jetzt eine kleine Familie.',
    'Diamant-Karte. Palmen, Sonnenbrille, Louis Buckton™ und Scheine auf dem Boden.'
  ];
  const QUOTES = [
    ['Ich riech mich selbst…', 'Die Fliegen zahlen mehr Miete als ich.', 'Haste mal nen Euro?', 'Mein Kontostand ist ein Hilfeschrei.', 'Buck dich selbst. Bitte. Für uns beide.'],
    ['Nur noch 2 Fliegen! Fortschritt!', 'Bronze. Fast wie Gold. Nur… nicht.', 'Ich hab heute geduscht. Fast.'],
    ['Die Fliegen sind weg. Bessere Angebote bekommen.', 'Silber steht mir.', 'Ich sabber nur noch aus Gewohnheit.'],
    ['Lila ist zurück, Baby!', 'Münzen! Echte Münzen!', 'Hab aufgehört zu sabbern. Persönliches Wachstum.'],
    ['Familie, Münzen, Lächeln. Läuft.', 'Schatz, wir sind Mittelschicht!', 'Der Kleine will Taschengeld. Nö.'],
    ['Ich bin jetzt Influencer.', 'Meine Frau trägt Louis Buckton. Original. Fast.', 'Hier liegt das Geld echt auf der Straße.']
  ];
  const LEVEL_TEXT = [
    '',
    'Die ersten Fliegen sind abgehauen. Er riecht nur noch ein bisschen.',
    'Keine einzige Fliege mehr! Ein Wunder der modernen Hygiene.',
    'Er ist wieder lila, sabbert nicht mehr und hat sogar Münzen.',
    'Er lächelt wieder! Und plötzlich ist da eine Familie.',
    'Palmen. Sonnenbrille. Louis Buckton. Du bist offiziell reich gebuckt.'
  ];
  const CONTACTS = [
    { n: 'Mama', e: '👩‍🍳' }, { n: 'Vermieter Horst', e: '🧔' }, { n: 'Pizza Pepe', e: '🍕' },
    { n: 'Kevin (schuldet dir 5 €)', e: '🧢' }, { n: 'Fitnessstudio (nie da)', e: '🏋️' }, { n: 'Oma Gerda', e: '👵' }
  ];

  /* ---------- State ---------- */
  const STORE = 'buckme-state-v1';
  function fresh() { return { balance: 0, savings: 0, tx: [], name: '', photo: null, onboarded: false }; }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && typeof s.balance === 'number' && typeof s.savings === 'number') return Object.assign(fresh(), s);
    } catch (e) {}
    return fresh();
  }
  let state = load();
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  const r2 = (n) => Math.round(n * 100) / 100;
  const stageOf = (sav) => GOALS.filter((g) => sav >= g).length;
  const stage = () => stageOf(state.savings);
  /* Konto-Limit = aktuelles Ziel (bei Stufe 5 bleibt es bei 1 Mio.) */
  const limit = () => GOALS[Math.min(stage(), GOALS.length - 1)];
  const room = () => Math.max(0, r2(limit() - state.balance));
  const fmt = (n) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n) + ' €';
  function parseAmount(str) {
    str = String(str || '').replace(/[€\s]/g, '');
    if (str.includes(',')) str = str.replace(/\./g, '').replace(',', '.');
    const n = r2(Number(str));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function addTx(type, amount, label, icon) {
    state.tx.unshift({ type, amount, label, icon, t: Date.now() });
    state.tx = state.tx.slice(0, 200);
  }

  /* ---------- Rendering ---------- */
  let renderedStage = -1;
  let shownBalance = state.balance;

  function tween(el, from, to) {
    if (from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 650;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(p < 1 ? Math.round(from + (to - from) * e) : to);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function render() {
    const st = stage();
    const card = $('#card');
    card.className = 'card tier-' + st;
    $('#tierName').textContent = TIERS[st];
    $('#cardLimit').textContent = 'Limit ' + fmt(limit());
    tween($('#balance'), shownBalance, state.balance);
    shownBalance = state.balance;
    if (st !== renderedStage) { $('#scene').innerHTML = Mascot.scene(st); renderedStage = st; }
    $('#savings').textContent = fmt(state.savings);
    const next = GOALS[st];
    $('#bar').style.width = next ? Math.min(100, state.savings / next * 100) + '%' : '100%';
    $('#goalLeft').textContent = next
      ? `${fmt(r2(next - state.savings))} bis zum nächsten Ziel`
      : 'Alle Ziele geknackt. Du bist offiziell reich gebuckt. 🌴';
    $('#goalStage').textContent = next ? `Ziel ${st + 1} / 5 · ${fmt(next)}` : 'Millionär 💎';
    renderAvatar();
  }

  /* ---------- Profil ---------- */
  function initial() { return (state.name || '').trim().charAt(0).toUpperCase() || '🙂'; }
  function renderAvatar() {
    const a = $('#avatar');
    a.classList.toggle('has-photo', !!state.photo);
    a.style.backgroundImage = state.photo ? `url("${state.photo}")` : '';
    a.textContent = state.photo ? '' : initial();
  }
  function setPick(el, photo, label) {
    el.classList.toggle('has-photo', !!photo);
    el.style.backgroundImage = photo ? `url("${photo}")` : '';
    el.firstChild.textContent = photo ? '' : label;
  }
  /* Bild auswählen, quadratisch zuschneiden und verkleinern (passt so in den lokalen Speicher) */
  function pickPhoto(cb) {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const S = 256, c = document.createElement('canvas');
        c.width = c.height = S;
        const m = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        URL.revokeObjectURL(url);
        cb(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); toast('Das Bild mag ich nicht. Versuch ein anderes.'); };
      img.src = url;
    };
    inp.click();
  }

  function showOnboard() {
    const ob = $('#onboard');
    let photo = state.photo;
    ob.innerHTML = `
      <div class="ob-logo">${Logo.svg()}</div>
      <h1>Willkommen bei BuckMe!</h1>
      <p>Bevor wir dich bucken: Wer bist du überhaupt?</p>
      <button class="photo-pick" id="obPhoto"><span>Profilbild<br>wählen</span><span class="plus">+</span></button>
      <input id="obName" class="text-input" placeholder="Dein Name" maxlength="20" autocomplete="nickname" value="${escapeHtml(state.name)}">
      <button class="btn" id="obGo">Los geht’s 🍑</button>
      <p class="ob-skip">Profilbild ist optional – kannst du später über dein Profil oben rechts ändern.</p>`;
    const pick = $('#obPhoto');
    setPick(pick, photo, 'Profilbild\nwählen');
    pick.firstChild.innerHTML = photo ? '' : 'Profilbild<br>wählen';
    pick.addEventListener('click', () => pickPhoto((p) => { photo = p; setPick(pick, p, ''); }));
    const go = () => {
      const name = $('#obName').value.trim();
      if (!name) { $('#obName').focus(); return toast('Ohne Namen kein Konto. Selbst die Fliegen haben Namen.'); }
      state.name = name.slice(0, 20); state.photo = photo; state.onboarded = true;
      save(); render(); ob.classList.remove('show');
      toast(`Hi ${state.name}! Zeit, dich selbst zu bucken.`);
      setTimeout(bubble, 900);
    };
    $('#obGo').addEventListener('click', go);
    $('#obName').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    ob.classList.add('show');
  }

  /* ---------- Toast & Bubble ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
  }
  let bubbleT;
  function bubble() {
    const q = QUOTES[stage()];
    const b = $('#bubble');
    b.textContent = q[Math.floor(Math.random() * q.length)];
    b.classList.add('show');
    clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.remove('show'), 3200);
  }

  /* ---------- Bottom Sheet ---------- */
  const sheet = $('#sheet'), backdrop = $('#backdrop'), sc = $('#sheetContent');
  function openSheet(html, half = false) {
    const wasOpen = sheet.classList.contains('open');
    sc.innerHTML = html;
    sc.scrollTop = 0;
    sheet.classList.toggle('half', half);
    if (wasOpen) { sc.classList.remove('swap'); void sc.offsetWidth; sc.classList.add('swap'); }
    sheet.style.transform = '';
    sheet.classList.add('open'); backdrop.classList.add('open');
  }
  function closeSheet() {
    sheet.classList.remove('open'); backdrop.classList.remove('open');
    sheet.style.transform = '';
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  }
  backdrop.addEventListener('click', closeSheet);
  // Runterziehen zum Schließen
  (() => {
    const grab = $('#grab'); let y0 = null, dy = 0;
    grab.addEventListener('pointerdown', (e) => { y0 = e.clientY; dy = 0; sheet.classList.add('dragging'); grab.setPointerCapture(e.pointerId); });
    grab.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${dy}px)`; });
    const end = () => { if (y0 === null) return; y0 = null; sheet.classList.remove('dragging'); if (dy > 90) closeSheet(); else sheet.style.transform = ''; };
    grab.addEventListener('pointerup', end); grab.addEventListener('pointercancel', end);
  })();
  const on = (sel, fn, ev = 'click') => sc.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));

  /* ---------- Karten-Menü (halbe Höhe) ---------- */
  function viewMenu() {
    const st = stage();
    openSheet(`
      <div class="minicard card tier-${st}" style="aspect-ratio:auto;border-width:2px">
        <div><small>Girokonto · ${TIERS[st]}</small>Limit ${fmt(limit())}</div><b>${fmt(state.balance)}</b>
      </div>
      <div class="stats">
        <div class="stat"><small>Noch Platz bis Limit</small><b>${fmt(room())}</b></div>
        <div class="stat"><small>Sparkonto</small><b>${fmt(state.savings)}</b></div>
      </div>
      <button class="btn btn-primary" data-go="pay">Jemanden bezahlen</button>
      <button class="btn btn-ghost" data-go="buck">Buck dich selbst</button>
      <button class="btn btn-ghost" data-go="tx">Überweisungen</button>
    `, true);
    on('[data-go]', (e) => ({ pay: viewPay, buck: viewBuck, tx: viewTx })[e.currentTarget.dataset.go]());
  }

  /* ---------- Jemanden bezahlen ---------- */
  function viewPay() {
    let sel = -1;
    openSheet(`
      <h2>Jemanden bezahlen</h2>
      <p class="sub">Verfügbar: ${fmt(state.balance)}</p>
      <div class="contacts">${CONTACTS.map((c, i) => `<button class="contact" data-i="${i}"><span>${c.e}</span><small>${c.n}</small></button>`).join('')}</div>
      <input id="amt" class="amount-input" inputmode="decimal" placeholder="0 €" autocomplete="off">
      <input id="note" class="text-input" placeholder="Verwendungszweck (z.B. „Nicht für Drogen“)" maxlength="60">
      <button class="btn btn-primary" id="go">Bezahlen</button>
      <button class="btn btn-ghost" id="back">Zurück</button>
    `);
    on('.contact', (e) => {
      sc.querySelectorAll('.contact').forEach((c) => c.classList.remove('sel'));
      e.currentTarget.classList.add('sel'); sel = +e.currentTarget.dataset.i;
    });
    on('#back', viewMenu);
    on('#go', () => {
      const a = parseAmount($('#amt').value);
      if (sel < 0) return toast('Wen willst du denn bezahlen? Dich selbst? Dafür gibt’s „Buck dich selbst“.');
      if (!a) return toast('Gib einen Betrag ein. Luft zählt nicht.');
      if (a > state.balance) return toast('Nicht genug Geld. Der Maskottchen-Blick sagt alles. 😐');
      const c = CONTACTS[sel], note = $('#note').value.trim();
      state.balance = r2(state.balance - a);
      addTx('pay', a, c.n + (note ? ' · ' + note : ''), c.e);
      save(); render(); closeSheet();
      toast(`Zack! ${fmt(a)} an ${c.n} gebuckt.`);
    });
  }

  /* ---------- Buck dich selbst (Girokonto → Sparkonto) ---------- */
  function viewBuck() {
    const st = stage(), next = GOALS[st];
    const toGoal = next ? Math.min(state.balance, r2(next - state.savings)) : 0;
    openSheet(`
      <h2>Buck dich selbst</h2>
      <p class="sub">Vom Girokonto aufs Sparkonto. Nur gebucktes Geld zählt fürs Ziel.</p>
      <input id="amt" class="amount-input" inputmode="decimal" placeholder="0 €" autocomplete="off">
      <div class="chips">
        <button class="chip" data-p=".1">10 %</button>
        <button class="chip" data-p=".25">25 %</button>
        <button class="chip" data-p=".5">50 %</button>
        <button class="chip" data-p="1">Alles</button>
        ${toGoal > 0 ? `<button class="chip" data-v="${toGoal}">Bis zum Ziel</button>` : ''}
      </div>
      <p class="hint">Verfügbar: ${fmt(state.balance)} · Sparkonto: ${fmt(state.savings)}</p>
      <button class="btn btn-primary" id="go">Jetzt bucken 🍑</button>
      <button class="btn btn-ghost" id="back">Zurück</button>
    `);
    on('.chip', (e) => {
      const d = e.currentTarget.dataset;
      const v = d.v ? +d.v : r2(state.balance * +d.p);
      $('#amt').value = String(v).replace('.', ',');
    });
    on('#back', viewMenu);
    on('#go', () => {
      const a = parseAmount($('#amt').value);
      if (!a) return toast('0 € bucken? Mutig. Aber nein.');
      if (a > state.balance) return toast('So viel hast du nicht auf dem Girokonto.');
      const before = stage();
      state.balance = r2(state.balance - a);
      state.savings = r2(state.savings + a);
      addTx('save', a, 'Buck dich selbst → Sparkonto', '🍑');
      save(); closeSheet(); render();
      const after = stage();
      if (after > before) setTimeout(() => levelUp(after), 350);
      else toast(`${fmt(a)} gebuckt. Das Maskottchen ist stolz auf dich.`);
    });
  }

  /* ---------- Überweisungen ---------- */
  function viewTx() {
    const items = state.tx.map((t) => {
      const cls = t.type === 'in' ? 'plus' : t.type === 'save' ? 'save' : 'minus';
      const sign = t.type === 'in' ? '+' : '−';
      const d = new Date(t.t);
      return `<div class="tx"><div class="tx-ico">${t.icon || '💸'}</div>
        <div class="tx-main"><b>${escapeHtml(t.label)}</b><small>${d.toLocaleDateString('de-DE')} · ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</small></div>
        <div class="tx-amt ${cls}">${sign}${fmt(t.amount)}</div></div>`;
    }).join('');
    openSheet(`
      <h2>Überweisungen</h2>
      <div class="txlist">${items || '<div class="empty"><div>🦗</div>Hier ist es so leer wie dein Kühlschrank.</div>'}</div>
      <button class="btn btn-ghost" id="back">Zurück</button>
    `);
    on('#back', viewMenu);
  }

  /* ---------- Vorteile / Ziele ---------- */
  function viewPerks() {
    const st = stage();
    const rows = TIERS.map((name, i) => {
      const goal = i === 0 ? 'Start' : 'Ziel ' + i + ' · ' + fmt(GOALS[i - 1]);
      const lim = 'Kontolimit ' + fmt(GOALS[Math.min(i, GOALS.length - 1)]);
      return `<div class="perk ${i > st ? 'locked' : ''} ${i === st ? 'now' : ''}">
        <div class="pc tier-${i}"></div>
        <div><b>${name}${i > st ? ' 🔒' : i === st ? ' · aktuell' : ' ✓'}</b><small>${goal} · ${lim}</small><small>${PERKS[i]}</small></div></div>`;
    }).join('');
    openSheet(`<h2>Vorteile</h2><p class="sub">Je mehr du dich buckst, desto besser geht’s ihm.</p>${rows}
      <button class="btn btn-ghost" id="close">Schließen</button>`);
    on('#close', closeSheet);
  }

  /* ---------- Einstellungen (Testgeld) ---------- */
  function viewSettings() {
    let armed = false;
    openSheet(`
      <h2>Einstellungen</h2>
      <div class="section-title">🧪 Testgeld</div>
      <p class="hint" style="text-align:left">Gib dir selbst Geld aufs Girokonto. Achtung: Kontolimit aktuell ${fmt(limit())} (noch ${fmt(room())} frei).</p>
      <input id="amt" class="amount-input" inputmode="decimal" placeholder="0 €" autocomplete="off">
      <div class="chips">
        <button class="chip" data-v="100">+100</button>
        <button class="chip" data-v="1000">+1.000</button>
        <button class="chip" data-v="5000">+5.000</button>
        <button class="chip" data-v="${room()}">Bis zum Limit</button>
      </div>
      <button class="btn btn-primary" id="give">Geld geben 💸</button>
      <div class="section-title">Profil</div>
      <div class="profile-row">
        <button class="photo-pick" id="pPhoto"><span></span><span class="plus">+</span></button>
        <div>
          <input id="name" class="text-input" value="${escapeHtml(state.name)}" placeholder="Dein Name" maxlength="20">
          ${state.photo ? '<button class="link-btn" id="pRemove">Profilbild entfernen</button>' : ''}
        </div>
      </div>
      <div class="section-title">Gefahrenzone</div>
      <button class="btn btn-danger" id="reset">App zurücksetzen</button>
      <button class="btn btn-ghost" id="close">Schließen</button>
    `);
    on('.chip', (e) => { $('#amt').value = String(e.currentTarget.dataset.v).replace('.', ','); });
    on('#give', () => {
      const a = parseAmount($('#amt').value);
      if (!a) return toast('Wie viel denn? Träumen ist kostenlos, Geld nicht.');
      const add = Math.min(a, room());
      if (add <= 0) return toast(`Konto voll! Limit ${fmt(limit())}. Buck dich selbst, um Platz zu machen.`);
      state.balance = r2(state.balance + add);
      addTx('in', add, 'Testgeld vom Geldbaum', '🌳');
      save(); render();
      if (add < a) toast(`Limit erreicht! Nur ${fmt(add)} passten rein – der Rest ist ins Nirvana gebuckt.`);
      else toast(`+${fmt(add)} aufs Girokonto. Ka-tsching!`);
      viewSettings();
    });
    setPick($('#pPhoto'), state.photo, 'Bild');
    on('#pPhoto', () => pickPhoto((p) => { state.photo = p; save(); renderAvatar(); viewSettings(); toast('Schickes Bild! Fast zu schick für dein Konto.'); }));
    on('#pRemove', () => { state.photo = null; save(); renderAvatar(); viewSettings(); });
    on('#name', (e) => { state.name = e.currentTarget.value.slice(0, 20).trim(); save(); renderAvatar(); }, 'input');
    on('#reset', (e) => {
      if (!armed) { armed = true; e.currentTarget.textContent = 'Wirklich alles löschen? Nochmal tippen'; return; }
      state = fresh(); shownBalance = 0; renderedStage = -1; save(); render(); closeSheet();
      toast('Alles weg. Die Fliegen sind zurück. 🪰');
      showOnboard();
    });
    on('#close', closeSheet);
  }

  /* ---------- Level Up ---------- */
  function levelUp(st) {
    const lv = $('#levelup');
    lv.innerHTML = `
      <div style="font-weight:900;letter-spacing:2px;opacity:.8">ZIEL ${st} ERREICHT</div>
      <h1>${st === 5 ? 'Millionär! 💎' : 'Neue ' + TIERS[st] + '-Karte!'}</h1>
      <div class="lv-card"><div class="card tier-${st}" style="pointer-events:none">
        <div class="card-bglogo">${Logo.svg()}</div><div class="card-shine"></div>
        <div class="card-head"><span class="card-brand">buckme</span><span class="card-tier">${TIERS[st]}</span></div>
        <div class="card-balance">${fmt(state.balance)}</div>
        <div class="card-pill"><span>Girokonto</span><span class="card-limit">Limit ${fmt(limit())}</span></div>
      </div></div>
      <div class="lv-scene">${Mascot.scene(st)}</div>
      <p>${LEVEL_TEXT[st]}<br>Neues Kontolimit: <b>${fmt(limit())}</b></p>
      <button class="btn" id="lvok">Weiter bucken</button>`;
    const colors = ['#ffd54a', '#ff6fb5', '#7ef0c8', '#ffffff', '#b98bff', '#5fd0ff'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 2 + Math.random() * 2.5 + 's';
      c.style.animationDelay = Math.random() * .8 + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      lv.appendChild(c);
    }
    lv.classList.add('show');
    $('#lvok').addEventListener('click', () => lv.classList.remove('show'));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Init ---------- */
  $('#splashLogo').innerHTML = Logo.svg();
  $('#splash').style.backgroundImage = Logo.dataUri('rgba(255,255,255,0.07)');
  $('#topLogo').innerHTML = Logo.svg();
  $('#cardBgLogo').innerHTML = Logo.svg();
  $('#card').addEventListener('click', viewMenu);
  $('#savingsBtn').addEventListener('click', viewBuck);
  $('#perksBtn').addEventListener('click', viewPerks);
  $('#settingsBtn').addEventListener('click', viewSettings);
  $('#avatar').addEventListener('click', viewSettings);
  $('#scene').addEventListener('click', bubble);
  render();
  if (!state.onboarded) showOnboard();
  setTimeout(() => {
    $('#splash').classList.add('hide');
    if (state.onboarded) setTimeout(bubble, 900);
  }, 1900);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
