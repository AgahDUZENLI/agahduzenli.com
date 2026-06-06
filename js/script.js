/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let openTabs  = [];
let activeTab = null;

/* ─────────────────────────────────────────
   ELEMENTS
───────────────────────────────────────── */
const nav         = document.getElementById('nav');
const hero        = document.getElementById('hero');
const sidePanel   = document.getElementById('side-panel');
const panelContent= document.getElementById('panel-content');
const navTabsEl   = document.getElementById('nav-tabs');
const navName     = document.getElementById('nav-name');
const heroTitle   = document.getElementById('hero-title');
const scrollHint  = document.getElementById('scroll-hint');
const tooltip     = document.getElementById('tooltip');
const hotspots    = document.querySelectorAll('.hotspot');
const contactLink = document.getElementById('contact-link');

/* ─────────────────────────────────────────
   NAV VISIBILITY
   Nav slides in after a short delay on load,
   or immediately when a panel opens.
───────────────────────────────────────── */
setTimeout(() => nav.classList.add('visible'), 800);

/* ─────────────────────────────────────────
   PANEL OPEN / CLOSE
───────────────────────────────────────── */
function openSection(id) {
  if (!SECTIONS[id]) return;
  if (!openTabs.includes(id)) openTabs.push(id);
  activeTab = id;

  renderPanel();
  renderTabs();

  nav.classList.add('visible');
  hero.classList.add('panel-open');
  sidePanel.classList.add('open');
  heroTitle.classList.add('hidden');
  scrollHint.classList.add('hidden');
}

function closeAllPanels() {
  activeTab = null;
  openTabs  = [];

  renderTabs();
  clearHoverLayers();

  hero.classList.remove('panel-open');
  sidePanel.classList.remove('open');
  heroTitle.classList.remove('hidden');
  scrollHint.classList.remove('hidden');
}

function switchToTab(id) {
  activeTab = id;
  renderPanel();
  renderTabs();
}

function closeTab(id, e) {
  e.stopPropagation();
  openTabs = openTabs.filter(t => t !== id);

  if (openTabs.length === 0) { closeAllPanels(); return; }

  if (activeTab === id) {
    activeTab = openTabs[openTabs.length - 1];
    renderPanel();
  }

  renderTabs();
}

/* ─────────────────────────────────────────
   RENDER
───────────────────────────────────────── */
function renderPanel() {
  const s = SECTIONS[activeTab];
  if (!s) return;

  panelContent.innerHTML = `
    <div class="section-label">${s.label}</div>
    <h2>${s.title}</h2>
    ${s.body}
  `;

  sidePanel.scrollTop = 0;
}

function renderTabs() {
  navTabsEl.innerHTML = '';

  openTabs.forEach(id => {
    const shortLabel = SECTIONS[id].label.split('— ')[1];

    const tab = document.createElement('div');
    tab.className = 'nav-tab' + (activeTab === id ? ' active' : '');
    tab.innerHTML = `${shortLabel}<span class="tab-close" title="Close">✕</span>`;

    tab.addEventListener('click', () => switchToTab(id));
    tab.querySelector('.tab-close').addEventListener('click', (e) => closeTab(id, e));

    navTabsEl.appendChild(tab);
  });
}

/* ─────────────────────────────────────────
   HOTSPOTS
───────────────────────────────────────── */
function clearHoverLayers() {
  document.querySelectorAll('.scene-layer').forEach(l => l.classList.remove('visible'));
}

hotspots.forEach(hs => {
  const layerId  = hs.dataset.layer;
  const label    = hs.dataset.label;
  const targetId = hs.dataset.target;
  const layer    = layerId ? document.getElementById(layerId) : null;

  hs.addEventListener('mouseenter', () => {
    if (layer) layer.classList.add('visible');
    if (label) {
      tooltip.textContent = label;
      tooltip.classList.add('visible');
      positionTooltip(hs);
    }
  });

  hs.addEventListener('mouseleave', () => {
    if (layer) layer.classList.remove('visible');
    tooltip.classList.remove('visible');
  });

  hs.addEventListener('click', () => {
    if (targetId) openSection(targetId);
  });
});

function positionTooltip(hs) {
  const wrapRect = document.querySelector('.scene-wrapper').getBoundingClientRect();
  const hsRect   = hs.getBoundingClientRect();
  const cx = hsRect.left - wrapRect.left + hsRect.width / 2;
  const cy = hsRect.top  - wrapRect.top;
  tooltip.style.left = cx + 'px';
  tooltip.style.top  = cy + 'px';
}

/* ─────────────────────────────────────────
   NAV INTERACTIONS
───────────────────────────────────────── */
navName.addEventListener('click', closeAllPanels);

contactLink.addEventListener('click', (e) => {
  e.preventDefault();
  openSection('contact');
});