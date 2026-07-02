/* ============================================================
   MANAS SINGH — PORTFOLIO INTERACTIONS
   Loader · Cursor · Scroll Reveals · Nav
   ============================================================ */

(function () {
  'use strict';

  // ---------- Loading Screen ----------
  const loader = document.querySelector('.loader');
  
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  }

  // Block scroll during load
  document.body.style.overflow = 'hidden';
  
  // Hide after 2.5s
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 2500);
  });

  // Fallback in case load fires before script
  setTimeout(hideLoader, 3500);

  // ---------- Custom Cursor ----------
  const cursor = document.querySelector('.cursor');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    function updateCursor() {
      const dx = cursorX - currentX;
      const dy = cursorY - currentY;
      currentX += dx * 0.15;
      currentY += dy * 0.15;
      cursor.style.left = currentX + 'px';
      cursor.style.top = currentY + 'px';
      requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Expand on interactive elements
    const hoverTargets = 'a, button, .project-card, .skill-card, .nav__toggle';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('is-hovering');
      }
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  // ---------- Navigation ----------
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navLinkItems = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('[data-section]');

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open'));
    });

    // Close on link click
    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section tracking
  function updateActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('data-section');
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('is-active');
      }
    });
  }

  // Hide nav on scroll down, show on scroll up
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 100) {
      nav.classList.add('is-hidden');
    } else {
      nav.classList.remove('is-hidden');
    }

    lastScroll = currentScroll;
    updateActiveLink();
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-blur');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Stagger children reveal
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.reveal-stagger');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('is-visible');
            }, index * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  staggerContainers.forEach((el) => staggerObserver.observe(el));

  // ---------- Parallax ----------
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function handleParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${-offset}px)`;
    });
  }

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ---------- Smooth Anchor Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = nav ? nav.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Year in footer ----------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
