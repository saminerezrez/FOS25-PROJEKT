// ===== Helpers =====
const qs  = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];

// År i footer
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// ===== Quotes (20 random) =====
const text = document.querySelector('#quoteText');
const author = document.querySelector('#quoteAuthor');
const btn = document.querySelector('#nextQuote');

let quotes = [];  

function loadQuotes() {
  fetch('https://dummyjson.com/quotes?limit=20')
    .then(res => res.json())
    .then(data => {
      quotes = data.quotes;
      showQuote();
    })
    .catch(() => {
      text.textContent = "Kunde inte hämta citat.";
      author.textContent = "";
    });
}

function showQuote() {
  if (quotes.length === 0) return;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  text.textContent = q.quote;
  author.textContent = `~ ${q.author}`;
}

btn.addEventListener('click', showQuote);
loadQuotes();


// ===== Feedback =====
const form = document.querySelector('#fbForm');
const nameIn = document.querySelector('#fbName');
const msgIn = document.querySelector('#fbMsg');
const list = document.querySelector('#fbList');
let feedback = JSON.parse(localStorage.getItem('feedback') || '[]');

function showFeedback() {
  list.innerHTML = feedback.map(f => `<li><b>${f.name}</b>: ${f.message}</li>`).join('');
}
showFeedback();

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameIn.value.trim();
  const msg  = msgIn.value.trim();
  if (name.length < 2 || msg.length < 2) return alert('Skriv något längre!');
  feedback.push({ name, message: msg });
  localStorage.setItem('feedback', JSON.stringify(feedback));
  showFeedback();
  form.reset();
});



/* =============================
   To-Do (localStorage)
============================= */
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

      const grp = document.createElement('div');
      grp.style.display = 'flex';
      grp.style.gap = '.5rem';

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

      grp.append(toggle, del);
      li.append(span, grp);
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
  if (clear) clear.addEventListener('click', () => { items = items.filter(i => !i.done); save(); render(); });

  render();
})();

// ===== Weather =====
const btnWeather = document.querySelector('#loadWeather');
const outWeather = document.querySelector('#weatherOut');

btnWeather.addEventListener('click', () => {
  outWeather.textContent = "Hämtar väder...";

  fetch("https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current=temperature_2m,wind_speed_10m&timezone=auto")
    .then(res => res.json())
    .then(data => {
      const temp = data.current.temperature_2m;
      const wind = data.current.wind_speed_10m;
      outWeather.textContent = `Just nu: ${temp} °C, vind ${wind} m/s`;
    })
    .catch(() => {
      outWeather.textContent = "Kunde inte hämta väder just nu.";
    });
});

/* =============================
   Tabs
============= */
(function tabs(){
  const tabs = qsa('.menu-nav__link');
  const byId = id => document.getElementById(id);
  if(!tabs.length) return;

  const KEY = 'cafe.activeTab';

  function activate(btn) {
    tabs.forEach(t => {
      const selected = (t === btn);
      t.setAttribute('aria-selected', String(selected));
      t.classList.toggle('is-active', selected);
      const panel = byId(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    localStorage.setItem(KEY, btn.id);
    btn.focus();
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', (e) => {
      const i = tabs.findIndex(x => x === t);
      let target;
      if (e.key === 'ArrowRight')      target = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft')  target = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home')       target = tabs[0];
      else if (e.key === 'End')        target = tabs[tabs.length - 1];
      if (target) { e.preventDefault(); activate(target); }
    });
  });

  const saved = localStorage.getItem(KEY);
  const initial = saved ? byId(saved) : tabs[0];
  if (initial) activate(initial);
})();
