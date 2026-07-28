/* ─────────────────────────────────────────
   SECTIONS
───────────────────────────────────────── */
const SECTIONS = {
  about:                { label: 'About',              file: 'sections/about.html' },
  contact:              { label: 'Contact',             file: 'sections/contact.html' },
  cs:                   { label: 'CS & Code',           file: 'sections/cs.html' },
  research:             { label: 'Research',            file: 'sections/research.html' },
  'architecture-design': { label: 'Architecture-Design', file: 'sections/architecture-design.html' },
  tennis:               { label: 'Tennis',              file: 'sections/tennis.html' },
};

/* ─────────────────────────────────────────
   GITHUB PROJECTS
───────────────────────────────────────── */
const GITHUB_USER = 'agahduzenli';
let ghProjectsCache = null;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderGithubProjects(repos) {
  const grid = document.getElementById('gh-projects');
  if (!grid) return;

  if (!repos.length) {
    grid.innerHTML = '<p class="section-body">No public repositories yet.</p>';
    return;
  }

  grid.innerHTML = repos.map(repo => {
    const meta = [repo.language, repo.description].filter(Boolean).map(escapeHtml).join(' · ');
    return `
      <a class="project-card" href="${repo.html_url}" target="_blank" rel="noopener">
        <div class="project-thumb">
          <img src="https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo.name}" alt="" loading="lazy" onerror="this.remove()">
        </div>
        <span class="project-title">${escapeHtml(repo.name)}</span>
        <span class="project-meta">${meta}</span>
      </a>
    `;
  }).join('');
}

async function loadGithubProjects() {
  const grid = document.getElementById('gh-projects');
  if (!grid) return;

  if (ghProjectsCache) {
    renderGithubProjects(ghProjectsCache);
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&direction=desc`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    ghProjectsCache = repos.filter(repo => !repo.fork);
    renderGithubProjects(ghProjectsCache);
  } catch {
    grid.innerHTML = `<p class="section-body">Couldn't load projects right now — view them directly on <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub ↗</a>.</p>`;
  }
}

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

if (navName) navName.textContent = 'Agah Duzenli';

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
  if (id === 'cs') loadGithubProjects();

  setActiveNavLink(id);
  hero.classList.add('panel-open');
  sidePanel.classList.add('open');
  heroTitle.classList.add('hidden');
  if (navName) navName.classList.add('visible');
}

function closePanel() {
  setActiveNavLink(null);
  clearHoverLayers();
  hero.classList.remove('panel-open');
  sidePanel.classList.remove('open');
  heroTitle.classList.remove('hidden');
  if (navName) navName.classList.remove('visible');
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
if (navName) navName.addEventListener('click', closePanel);

document.querySelectorAll('.nav-right a[data-target]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openSection(link.dataset.target);
  });
});