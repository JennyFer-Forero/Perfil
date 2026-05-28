/* ═══════════════════════════════════════════════════════════════
   JENNIFER FORERO PATIÑO — PORTFOLIO JS
   Handles: Nav scroll, reveal animations, stat counters,
            language bars, mobile menu, smooth scroll
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Utility: run after DOM is ready ───
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initRevealObserver();
  initStatCounters();
  initLangBars();
  initMobileMenu();
  initActiveSectionHighlight();
  initPageLoadReveal();
});


/* ════════════════════════════════════════
   1. NAVIGATION — scroll-activated styling
   When the user scrolls past 60px, the nav
   gains a dark blurred background so it stays
   readable over any section.
════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  // Use passive listener for performance — no preventDefault needed
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page starts scrolled
}


/* ════════════════════════════════════════
   2. REVEAL ON SCROLL (Intersection Observer)
   Every element with class .reveal starts
   invisible (handled in CSS). The observer
   watches them; once ≥15% is visible it adds
   .in-view which triggers the CSS transition.
   Staggered delays give a cascade effect.
════════════════════════════════════════ */
function initRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children within the same parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 60}ms`;

          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Fire once only
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}


/* ════════════════════════════════════════
   3. HERO PAGE-LOAD REVEAL
   The hero elements have the .reveal class
   too, but since they're in the viewport on
   load the IntersectionObserver fires them
   immediately. We add a small extra delay so
   they feel like an entrance sequence.
════════════════════════════════════════ */
function initPageLoadReveal() {
  const heroReveals = document.querySelectorAll('#hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = '0ms';
      el.classList.add('in-view');
    }, 200 + i * 140);
  });
}


/* ════════════════════════════════════════
   4. STAT COUNTERS
   Each .stat-num has a data-target attribute
   with the goal number. When the element
   becomes visible the counter animates from
   zero to that number over ~1.2 s using
   easeOutQuart easing.
════════════════════════════════════════ */
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  // easeOutQuart — fast start, slows near end
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el, target, duration = 1200) => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => observer.observe(el));
}


/* ════════════════════════════════════════
   5. LANGUAGE SKILL BARS
   Each .lang-fill has a data-width attribute
   (0–100). When the containing card enters
   the viewport, the bar width animates from
   0% to that value via inline style.
   The transition is defined in CSS as
   `transition: width 1.2s cubic-bezier(...)`.
════════════════════════════════════════ */
function initLangBars() {
  const fills = document.querySelectorAll('.lang-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pct = entry.target.dataset.width;
          // Small delay so the CSS transition is visible after reveal
          setTimeout(() => {
            entry.target.style.width = `${pct}%`;
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach((el) => observer.observe(el));
}


/* ════════════════════════════════════════
   6. MOBILE HAMBURGER MENU
   Toggles .open on the nav-links list and
   animates the three hamburger bars into an
   X when open.
════════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);

    // Animate the three bars into an X
    const bars = toggle.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close menu when a link is clicked (mobile UX)
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const bars = toggle.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    });
  });
}


/* ════════════════════════════════════════
   7. ACTIVE SECTION HIGHLIGHT IN NAV
   Uses IntersectionObserver on each section.
   The link whose href matches the currently
   most-visible section ID gets .nav-active.
════════════════════════════════════════ */
function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('#nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  // Map from id → link element for fast lookup
  const linkMap = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    linkMap[id] = link;
  });

  const visibleSections = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Highlight the first visible section's nav link
      navLinks.forEach((l) => l.classList.remove('nav-active'));
      for (const id of visibleSections) {
        if (linkMap[id]) {
          linkMap[id].classList.add('nav-active');
          break;
        }
      }
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));

  // Inject active style (avoids extra CSS coupling)
  const style = document.createElement('style');
  style.textContent = `
    #nav-links a.nav-active {
      color: var(--gold) !important;
    }
  `;
  document.head.appendChild(style);
}


/* ════════════════════════════════════════
   8. SMOOTH SCROLL POLYFILL
   Native CSS scroll-behavior handles most
   browsers, but this ensures anchor clicks
   always work even on older engines and
   correctly offsets for the fixed nav height.
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    const nav    = document.getElementById('main-nav');
    const offset = nav ? nav.offsetHeight + 16 : 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
