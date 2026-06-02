const hotspots = [
  { id: 'hs-character', layer: 'layer-character', label: 'About me',     target: 'about'        },
  { id: 'hs-house',     layer: 'layer-studio',    label: 'Architecture', target: 'architecture' },
  { id: 'hs-studio',    layer: 'layer-studio',    label: 'Design',       target: 'design'       },
  { id: 'hs-garage',    layer: 'layer-garage',    label: 'CS & Code',    target: 'cs'           },
  { id: 'hs-library',   layer: 'layer-library',   label: 'Research',     target: 'research'     },
  { id: 'hs-tennis',    layer: 'layer-tennis',     label: '',             target: ''             },
];

const tooltip = document.getElementById('tooltip');

const nav = document.querySelector('nav');
const hero = document.querySelector('.hero');
const scrollIndicator = document.getElementById('scroll-indicator');

const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) {
    nav.classList.add('visible');
    if (scrollIndicator) scrollIndicator.classList.add('hidden');
  } else {
    nav.classList.remove('visible');
    if (scrollIndicator) scrollIndicator.classList.remove('hidden');
  }
}, { threshold: 0.1 });

observer.observe(hero);

hotspots.forEach(({ id, layer, label, target }) => {
  const hs  = document.getElementById(id);
  const img = document.getElementById(layer);
  if (!hs) return;

  hs.addEventListener('mouseenter', (e) => {
    if (img) img.style.opacity = '1';
    if (label) {
      tooltip.textContent = label;
      positionTooltip(e, hs);
      tooltip.classList.add('visible');
    }
  });

  hs.addEventListener('mousemove', (e) => {
    positionTooltip(e, hs);
  });

  hs.addEventListener('mouseleave', () => {
    if (img) img.style.opacity = '0';
    tooltip.classList.remove('visible');
  });

  hs.addEventListener('click', () => {
    if (!target) return;
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

function positionTooltip(e, hs) {
  const wrapper = document.querySelector('.scene-wrapper');
  const wRect   = wrapper.getBoundingClientRect();
  const hsRect  = hs.getBoundingClientRect();

  const x = hsRect.left + hsRect.width / 2 - wRect.left;
  const y = hsRect.top - wRect.top;

  tooltip.style.left = x + 'px';
  tooltip.style.top  = y + 'px';
}