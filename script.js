// --- Helpers ---
const qs  = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];

// Year in footer
qs('#year').textContent = new Date().getFullYear();

/* -----------------------------
   Feedback validation (safe)
------------------------------*/
(function feedback(){
  const form   = qs('#fbForm');
  if(!form) return;
  const nameEl = qs('#fbName');
  const msgEl  = qs('#fbMsg');
  const status = qs('#fbStatus');

  const setErr = (el, msg='')=>{
    const err = el.closest('.field')?.querySelector('.error');
    if(err) err.textContent = msg;
  };

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let ok = true;

    const name = (nameEl.value||'').trim();
    const msg  = (msgEl.value||'').trim();

    if(name.length < 2){ setErr(nameEl, 'Minst 2 tecken.'); ok = false; } else setErr(nameEl,'');
    if(msg.length  < 5){ setErr(msgEl,  'Minst 5 tecken.'); ok = false; } else setErr(msgEl,'');

    status.textContent = ok ? 'Tack för din feedback!' : 'Formuläret innehåller fel.';
    if(ok){
      form.reset();
      setErr(nameEl,''); setErr(msgEl,'');
    }
  });
})();

/* -----------------------------
   Tiny To-Do (localStorage)
------------------------------*/
(function todo(){
  const input = qs('#todoInput'), add = qs('#todoAdd'), list = qs('#todoList'), clear = qs('#todoClear');
  if(!input || !add || !list) return;

  const KEY = 'cafe.todo.v1';
  let items = JSON.parse(localStorage.getItem(KEY) || '[]');

  const save = () => localStorage.setItem(KEY, JSON.stringify(items));

  const render = () => {
    list.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (it.done ? ' done' : '');
      const span = document.createElement('span');
      span.textContent = it.text;

      const toggle = document.createElement('button');
      toggle.className = 'btn';
      toggle.type = 'button';
      toggle.textContent = it.done ? 'Återställ' : 'Klar';
      toggle.addEventListener('click', () => {
        items[i].done = !items[i].done; save(); render();
      });

      const del = document.createElement('button');
      del.className = 'btn btn-secondary';
      del.type = 'button';
      del.textContent = 'Ta bort';
      del.addEventListener('click', () => {
        items.splice(i,1); save(); render();
      });

      li.append(span, toggle, del);
      list.appendChild(li);
    });
  };

  const addItem = () => {
    const t = (input.value || '').trim();
    if(!t) return;
    items.push({ text: t, done: false });
    input.value = '';
    save(); render(); input.focus();
  };

  add.addEventListener('click', addItem);
  input.addEventListener('keydown', e => { if(e.key === 'Enter') addItem(); });
  clear.addEventListener('click', () => { items = items.filter(i => !i.done); save(); render(); });

  render();
})();

/* -----------------------------
   Weather API (Open-Meteo)
   Stockholm lat/lon + timezone
------------------------------*/
(function weather(){
  const btn = qs('#loadWeather'), out = qs('#weatherOut');
  if(!btn || !out) return;

  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=59.3293&longitude=18.0686'
    + '&current=temperature_2m,wind_speed_10m'
    + '&timezone=auto';

  btn.addEventListener('click', async () => {
    try {
      btn.disabled = true; btn.textContent = 'Hämtar…'; out.textContent = '';
      const res = await fetch(url, { cache: 'no-store' });
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      const t = data?.current?.temperature_2m;
      const w = data?.current?.wind_speed_10m;

      if (typeof t === 'number') {
        out.textContent = `Just nu: ${t} °C, vind ${w ?? '—'} m/s.`;
      } else {
        out.textContent = 'Kunde inte läsa temperatur just nu.';
      }
    } catch (e) {
      out.textContent = 'Fel: kunde inte hämta väder.';
      console.error('Weather error:', e);
    } finally {
      btn.disabled = false; btn.textContent = 'Hämta väder';
    }
  });
})();
