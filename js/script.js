/* ─────────────────────────────────────────
   SECTIONS
───────────────────────────────────────── */
const SECTIONS = {
  about:        { label: 'About',        file: 'sections/about.html' },
  contact:      { label: 'Contact',      file: 'sections/contact.html' },
  cs:           { label: 'CS & Code',    file: 'sections/cs.html' },
  research:     { label: 'Research',     file: 'sections/research.html' },
  architecture: { label: 'Architecture', file: 'sections/architecture.html' },
  design:       { label: 'Design',       file: 'sections/design.html' },
  tennis:       { label: 'Tennis',       file: 'sections/tennis.html' },
};

/* ─────────────────────────────────────────
   ELEMENTS
───────────────────────────────────────── */
const hero         = document.getElementById('hero');
const sidePanel    = document.getElementById('side-panel');
const panelContent = document.getElementById('panel-content');
const navName      = document.getElementById('nav-name');
const heroTitle    = document.getElementById('hero-title');
const tooltip      = document.getElementById('tooltip');
const hotspots     = document.querySelectorAll('.hotspot');

/* ─────────────────────────────────────────
   PANEL OPEN / CLOSE
───────────────────────────────────────── */
function setActiveNavLink(id) {
  document.querySelectorAll('.nav-right a[data-target]').forEach(link => {
    link.classList.toggle('active', link.dataset.target === id);
  });
}

async function openSection(id) {
  const s = SECTIONS[id];
  if (!s) return;

  if (!s.body) {
    try {
      const res = await fetch(s.file);
      s.body = await res.text();
    } catch {
      s.body = '<p class="section-body">Content unavailable.</p>';
    }
  }

  panelContent.innerHTML = `<p class="section-label">${s.label}</p>${s.body}`;
  sidePanel.scrollTop = 0;

  setActiveNavLink(id);
  hero.classList.add('panel-open');
  sidePanel.classList.add('open');
  heroTitle.classList.add('hidden');
}

function closePanel() {
  setActiveNavLink(null);
  clearHoverLayers();
  hero.classList.remove('panel-open');
  sidePanel.classList.remove('open');
  heroTitle.classList.remove('hidden');
}

/* ─────────────────────────────────────────
   HOTSPOTS
───────────────────────────────────────── */
function clearHoverLayers() {
  document.querySelectorAll('.scene-layer').forEach(l => l.classList.remove('visible'));
}

hotspots.forEach(hs => {
  const layer    = hs.dataset.layer ? document.getElementById(hs.dataset.layer) : null;
  const label    = hs.dataset.label;
  const targetId = hs.dataset.target;

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
  tooltip.style.left = (hsRect.left - wrapRect.left + hsRect.width / 2) + 'px';
  tooltip.style.top  = (hsRect.top  - wrapRect.top) + 'px';
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
navName.addEventListener('click', closePanel);

document.querySelectorAll('.nav-right a[data-target]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openSection(link.dataset.target);
  });
});