/* ================================================================
   MODERN PORTFOLIO — SCRIPT.JS
   Custom cursor, loader, theme, scroll reveal, counters, magnetic
   ================================================================ */

'use strict';

/* --------- THEME --------- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const root        = document.documentElement;

const getTheme    = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

setTheme(getTheme());

themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* --------- LOADER --------- */
// Fallback if window load takes too long
const fallbackTimer = setTimeout(() => {
  hideLoader();
}, 4000);

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    revealAll();
    animateCounters();
  }
}

window.addEventListener('load', () => {
  clearTimeout(fallbackTimer);
  setTimeout(hideLoader, 1800);
});
document.body.style.overflow = 'hidden'; // freeze until loaded

/* --------- CUSTOM CURSOR --------- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

if (dot && ring) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Scale up cursor on interactive elements
  document.querySelectorAll('a, button, .magnetic, .bento-card, .stat-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(2.5)';
      dot.style.background = 'var(--accent-l)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'var(--primary-l)';
    });
  });
}

/* --------- NAVBAR --------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* --------- SCROLL REVEAL --------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function revealAll() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
revealAll();

/* --------- SKILL BARS --------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animate');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fw').forEach(el => skillObserver.observe(el));

/* --------- COUNTER ANIMATION --------- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    let start    = 0;
    const duration = 1800;
    const step   = (timestamp) => {
      if (!counter._start) counter._start = timestamp;
      const elapsed = timestamp - counter._start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      start = Math.floor(eased * target);
      counter.textContent = start.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else counter.textContent = target.toLocaleString() + suffix;
    };
    // Observe and start when in view
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          requestAnimationFrame(step);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(counter);
  });
}
animateCounters();

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* --------- MAGNETIC BUTTONS --------- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const factor = 0.35;
    btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* --------- ACTIVE NAV LINK on SCROLL --------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = 'var(--primary-l)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

/* --------- CONTACT FORM --------- */
const contactForm = document.getElementById('contact-form');
const toast       = document.getElementById('toast');

function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;

    try {
      const endpoint = 'https://formspree.io/f/xkolowqb';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showToast('✓ Message sent! I\'ll reply soon.', 'success');
        contactForm.reset();
      } else {
        showToast('❌ Oops! There was a problem sending your message.', 'error');
      }
    } catch (error) {
      showToast('❌ Oops! Network error. Please try again.', 'error');
    } finally {
      if (btn.innerHTML === '<i class="fa-solid fa-spinner fa-spin"></i> Sending...') {
        btn.innerHTML = origText;
        btn.disabled  = false;
      }
    }
  });
}


