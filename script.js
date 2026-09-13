/* =========================================================
   GANPATI INVITATION — CONFIG
   Edit everything in this block with your own details.
   You don't need to touch the rest of the file (or the HTML)
   to personalize the site.
   ========================================================= */
const CONFIG = {
  familyName: "The Nanekar Family",
  heroTitle: "The Nanekar Family's Ganpati Celebration",

  // ISO date-times with your local UTC offset, e.g. +05:30 for India
  sthapanaDateTime: "2026-09-14T04:00:00+05:30",
  sthapanaDateLabel: "Monday, 14 September 2026",
  sthapanaTimeLabel: "4:00 AM (Madhyahna Muhurat)",

  visarjanDateTime: "2026-09-25T20:00:00+05:30",
  visarjanDateLabel: "Tuesday, 15 September 2026",
  visarjanTimeLabel: "8:00 PM",

  venueName: "Our home",
  venueAddress: "312, Omkar Sai CHS, Near Sai Mandir, Jeevan Vikas Kendra Marg, Koldongri, VileParle East",
  mapsQuery: "Omkar Sai CHS LTD, Sai Mandir Marg, Shivaji Nagar, Navapada, Vile Parle, Mumbai 400057",

  aarti: [
    { label: "Morning aarti", time: "1:00 PM apx" },
    { label: "Evening aarti", time: "8:00 PM apx" }
  ],

  // Country code + number, digits only, no + or spaces (e.g. 91 for India)
  whatsappNumber: "918291574739",

  // How many images to look for in assets/gallery/ (1.jpg, 2.jpg, ...)
  galleryCount: 6,

  // How many diyas to show in the interactive row
  diyaCount: 7
};

/* =========================================================
   Below this line is site behavior — most people won't need
   to edit anything past here.
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  buildDiyas();
  buildGallery();
  startCountdown();
  wireEntrance();
  wireAudioToggle();
  wireCalendarButton();
  wireRsvpForm();
  wireShareButton();
  wireLightbox();
  if (!reduceMotion) startPetals();
});

/* ---------- fill the page from CONFIG ---------- */
function applyConfig(){
  document.title = `${CONFIG.heroTitle} — You're Invited`;
  setText('hero-title', CONFIG.heroTitle);
  setText('sthapana-date', CONFIG.sthapanaDateLabel);
  setText('sthapana-time', CONFIG.sthapanaTimeLabel);
  setText('visarjan-date', CONFIG.visarjanDateLabel);
  setText('visarjan-time', CONFIG.visarjanTimeLabel);
  setText('venue-name', CONFIG.venueName);
  setText('venue-address', CONFIG.venueAddress);
  setText('footer-credit', `With love, ${CONFIG.familyName}`);

  const directions = document.getElementById('directions-link');
  directions.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery)}`;

  const aartiList = document.getElementById('aarti-list');
  aartiList.innerHTML = '';
  CONFIG.aarti.forEach(item => {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = item.label;
    const time = document.createElement('span');
    time.textContent = item.time;
    li.append(label, time);
    aartiList.appendChild(li);
  });
}

function setText(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ---------- entrance ritual ---------- */
function wireEntrance(){
  const entrance = document.getElementById('entrance');
  const main = document.getElementById('main');
  const openBtn = document.getElementById('open-btn');

  openBtn.addEventListener('click', () => {
    const audio = document.getElementById('bg-audio');
    audio.play().then(() => setAudioState(true)).catch(() => setAudioState(false));

    main.hidden = false;
    if (reduceMotion){
      entrance.hidden = true;
      return;
    }
    entrance.classList.add('opening');
    entrance.addEventListener('transitionend', () => entrance.hidden = true, { once: true });
  });
}

/* ---------- audio toggle ---------- */
/* ---------- audio toggle + background handling ---------- */
function wireAudioToggle(){
  const btn = document.getElementById('audio-btn');
  const audio = document.getElementById('bg-audio');

  // Tracks whether the user intentionally turned the music off
  let userMuted = false;

  btn.addEventListener('click', () => {
    if (audio.paused){
      userMuted = false;

      audio.play()
        .then(() => setAudioState(true))
        .catch(() => setAudioState(false));

    } else {
      userMuted = true;
      audio.pause();
      setAudioState(false);
    }
  });

  // Pause music when the browser/tab goes into the background
  document.addEventListener('visibilitychange', () => {

    if (document.hidden){
      // Browser/app went into background
      audio.pause();
      setAudioState(false);

    } else {
      // User returned to this tab
      if (!userMuted){
        audio.play()
          .then(() => setAudioState(true))
          .catch(() => setAudioState(false));
      }
    }
  });
}

function setAudioState(playing){
  const btn = document.getElementById('audio-btn');
  btn.textContent = playing ? '🔊' : '🔈';
  btn.setAttribute('aria-pressed', String(playing));
}

/* ---------- countdown to Sthapana ---------- */
function startCountdown(){
  const target = new Date(CONFIG.sthapanaDateTime).getTime();

  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){
      document.getElementById('cd-grid').hidden = true;
      document.getElementById('cd-done').hidden = false;
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setText('cd-d', pad(d));
    setText('cd-h', pad(h));
    setText('cd-m', pad(m));
    setText('cd-s', pad(s));
  }
  const timer = setInterval(tick, 1000);
  tick();
}
function pad(n){ return String(n).padStart(2, '0'); }

/* ---------- add to calendar (.ics download + Google Calendar link on the same button) ---------- */
function wireCalendarButton(){
  document.getElementById('calendar-btn').addEventListener('click', () => {
    const start = new Date(CONFIG.sthapanaDateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ganpati Invite//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${CONFIG.heroTitle}`,
      `LOCATION:${CONFIG.venueAddress}`,
      'DESCRIPTION:Ganpati Sthapana — join us!',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ganpati-celebration.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

/* ---------- diya lighting ---------- */
function buildDiyas(){
  const row = document.getElementById('diya-row');
  let lit = 0;

  for (let i = 0; i < CONFIG.diyaCount; i++){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'diya';
    btn.setAttribute('aria-label', 'Light a diya');
    btn.innerHTML = `
      <svg viewBox="0 0 40 46" width="34" height="40" aria-hidden="true">
        <path class="diya-flame" d="M20 6 C13 15 13 23 20 28 C27 23 27 15 20 6 Z"></path>
        <ellipse class="diya-bowl" cx="20" cy="34" rx="18" ry="8"></ellipse>
        <path class="diya-bowl-front" d="M2 34 Q20 46 38 34 Q20 41 2 34 Z"></path>
      </svg>`;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('lit')) return;
      btn.classList.add('lit');
      btn.setAttribute('aria-label', 'Diya lit');
      lit++;
      updateDiyaMessage(lit);
    });
    row.appendChild(btn);
  }
}
function updateDiyaMessage(lit){
  const el = document.getElementById('diya-message');
  el.textContent = lit === CONFIG.diyaCount
    ? 'All the diyas are lit — Bappa Morya! 🙏'
    : `${lit} of ${CONFIG.diyaCount} diyas lit`;
}

/* ---------- gallery + lightbox ---------- */
function buildGallery(){
  const grid = document.getElementById('gallery-grid');
  for (let i = 1; i <= CONFIG.galleryCount; i++){
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-item';
    item.style.setProperty('--rot', `${(Math.random() * 6 - 3).toFixed(1)}deg`);

    const img = document.createElement('img');
    img.src = `assets/gallery/${i}.jpg`;
    img.alt = `Celebration photo ${i}`;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      item.classList.add('empty');
      img.remove();
    }, { once: true });

    item.appendChild(img);
    item.addEventListener('click', () => {
      if (item.classList.contains('empty')) return;
      openLightbox(img.src, img.alt);
    });
    grid.appendChild(item);
  }
}
function wireLightbox(){
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
function openLightbox(src, alt){
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').alt = alt || '';
  document.getElementById('lightbox').hidden = false;
}
function closeLightbox(){
  document.getElementById('lightbox').hidden = true;
}

/* ---------- RSVP via WhatsApp ---------- */
function wireRsvpForm(){
  document.getElementById('rsvp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const guests = data.get('guests');
    const message = data.get('message');

    let text = `Ganpati Bappa Morya! 🙏\nRSVP from ${name}\nGuests joining: ${guests}`;
    if (message) text += `\nMessage: ${message}`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

/* ---------- share ---------- */
function wireShareButton(){
  document.getElementById('share-btn').addEventListener('click', async () => {
    const shareData = {
      title: CONFIG.heroTitle,
      text: "You're invited to our Ganpati celebration!",
      url: window.location.href
    };
    if (navigator.share){
      try { await navigator.share(shareData); } catch (err) { /* user cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById('share-btn');
      const original = btn.textContent;
      btn.textContent = 'Link copied!';
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch (err) { /* clipboard unavailable */ }
  });
}

/* ---------- ambient falling petals ---------- */
function startPetals(){
  const layer = document.getElementById('petal-layer');
  setInterval(() => {
    const petal = document.createElement('span');
    petal.className = `petal ${Math.random() > 0.5 ? 'marigold' : 'vermilion'}`;
    petal.style.left = `${Math.random() * 100}vw`;
    const duration = 6 + Math.random() * 5;
    petal.style.animationDuration = `${duration}s`;
    petal.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }, 900);
}
