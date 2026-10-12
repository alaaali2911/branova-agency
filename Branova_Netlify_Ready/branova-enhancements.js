(() => {
  const root = document.documentElement;
  const header = document.querySelector('header');
  const nav = document.querySelector('.nav');
  root.classList.add('branova-motion-ready');

  // Gentle, staggered reveal as content enters the viewport.
  const revealItems = document.querySelectorAll(
    '.hero-grid > div, .about-box, .section-head, .service, .about-stat, .client-card, .card, .web-box, .step, .cta-box'
  );
  revealItems.forEach((item, index) => {
    item.classList.add('branova-reveal');
    item.style.setProperty('--br-reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Compact mobile navigation built from the existing page links.
  const desktopLinks = nav?.querySelector('.links');
  if (nav && desktopLinks) {
    const toggle = document.createElement('button');
    toggle.className = 'branova-mobile-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'فتح قائمة التنقل');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'branova-mobile-menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';

    const menu = document.createElement('nav');
    menu.className = 'branova-mobile-menu';
    menu.id = 'branova-mobile-menu';
    menu.setAttribute('aria-label', 'قائمة التنقل للموبايل');
    menu.dataset.open = 'false';
    desktopLinks.querySelectorAll('a').forEach(link => {
      const copy = link.cloneNode(true);
      copy.addEventListener('click', closeMenu);
      menu.append(copy);
    });
    nav.append(toggle, menu);

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'فتح قائمة التنقل');
      menu.dataset.open = 'false';
    }
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'فتح قائمة التنقل' : 'إغلاق قائمة التنقل');
      menu.dataset.open = String(!isOpen);
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => { if (!nav.contains(event.target)) closeMenu(); });
  }

  // Header polish and reading progress indicator.
  const progress = document.createElement('div');
  progress.className = 'branova-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let ticking = false;
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();
})();
