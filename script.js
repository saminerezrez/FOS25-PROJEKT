// för tabs menu 
const qs  = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

/* =========================
   Bookning
   ========================= */
const BOOK_KEY = 'cafe.booking.v1';

// läser
function getBookings() {
  const raw = localStorage.getItem(BOOK_KEY);
  return raw ? JSON.parse(raw) : [];
}
// sparar bokningar
function setBookings(list) {
  localStorage.setItem(BOOK_KEY, JSON.stringify(list));
}

// (YYYY-MM-DD) och hittar listan 
function renderBookings(day) {
  const ul = document.getElementById('bList');
  if (!ul || !day) return;
  ul.innerHTML = '';
// hämtar alla sparade bokningar håller de som matchar
  const items = getBookings().filter(b => b.date === day);
  items.forEach(b => {
    const li = document.createElement('li');
    li.textContent = `${b.time} — ${b.name} (${b.party}) ${b.phone} | ${b.email}`;
    ul.appendChild(li);
  });
}
// väntar till hela sidan har laddats inna koden körs
document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('bForm');
  const dateI = document.getElementById('bDate');
  const msgEl = document.getElementById('bMsg');
//hittar
  if (form && dateI) {
    //skapar dagens datum i format
    const today = new Date().toISOString().slice(0,10);
    dateI.value = dateI.value || today;
    renderBookings(dateI.value);

    // ändra dagen 
    dateI.addEventListener('change', () => renderBookings(dateI.value));

    // läga till dagen 
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        date:  qs('#bDate').value,
        time:  qs('#bTime').value,
        name:  qs('#bName').value.trim(),
        phone: qs('#bPhone').value.trim(),
        email: qs('#bEmail').value.trim(),
        party: parseInt(qs('#bParty').value, 10) || 1,
        createdAt: Date.now()
      };

      // validera
      if (!data.date || !data.time || !data.name || !data.phone || !data.email) {
        if (msgEl) msgEl.textContent = 'Fyll i alla fält.';
        return;
      }

      const list = getBookings();
      list.push(data);
      setBookings(list);

      renderBookings(data.date);
      form.reset();
      qs('#bDate').value = data.date; // keep day
      if (msgEl) msgEl.textContent = 'Bokningen sparades.';
    });
  }
});

/* =========================
   Feedback delen
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fbForm');
  const nameInput = document.getElementById('fbName');
  const msgInput  = document.getElementById('fbMsg');
  const list = document.getElementById('fbList');
  const FB_KEY = 'feedback';

  if (!form || !nameInput || !msgInput || !list) return;

  // localStorage
  function getFeedback() {
    const saved = localStorage.getItem(FB_KEY);
    return saved ? JSON.parse(saved) : [];
  }
  function setFeedback(data) {
    localStorage.setItem(FB_KEY, JSON.stringify(data));
  }

  // render list
  function showFeedback() {
    const data = getFeedback();
    list.innerHTML = '';
    data.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${f.name}</strong>: ${f.message}`;
      list.appendChild(li);
    });
  }

  
  showFeedback();

  // lägga till en nytt
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (name.length < 2 || msg.length < 2) {
      
      alert('Skriv lite längre tack.'); 
      return;
    }

    const data = getFeedback();
    data.push({ name, message: msg });
    setFeedback(data);

    showFeedback();
    form.reset();
  });
});

/* =========================
   väder
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('loadWeather');
  const out = document.getElementById('weatherOut');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    out.textContent = 'Hämtar väder...';

    fetch('https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current=temperature_2m,wind_speed_10m&timezone=auto')
      .then(res => res.json())
      .then(data => {
        const temp = data.current?.temperature_2m ?? '–';
        const wind = data.current?.wind_speed_10m ?? '–';
        out.textContent = `Just nu: ${temp} °C, vind ${wind} m/s`;
      })
      .catch(() => {
        out.textContent = 'Kunde inte hämta väder just nu.';
      });
  });
});

/* =========================
   Tabs för meny delen 
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = qsa('.menu-nav__link');
  const byId = id => document.getElementById(id);
  if (!tabs.length) return;

  function activate(tab){
    tabs.forEach(t => {
      const selected = (t === tab);
      t.setAttribute('aria-selected', String(selected));
      t.classList.toggle('is-active', selected);
      const panel = byId(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    tab.focus();
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', (e) => {
      const arr = tabs;
      const i = arr.indexOf(t);
      if (e.key === 'ArrowRight') activate(arr[(i + 1) % arr.length]);
      if (e.key === 'ArrowLeft')  activate(arr[(i - 1 + arr.length) % arr.length]);
    });
  });

  
  activate(tabs[0]);
});
