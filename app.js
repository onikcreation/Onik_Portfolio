/**
 * Portfolio / app.js
 * Author  : Al Amin Onik (oNiK)
 * Version : 2.0
 */

// =============================================
// 1. LOADER
// =============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const inner = loader.querySelector('.loader-inner');

  setTimeout(() => {
    // Step 1: inner content fade করবে (0.5s)
    if (inner) {
      inner.style.transition = 'opacity 0.5s ease';
      inner.style.opacity = '0';
    }
    // Step 2: fade শেষ হলে loader পুরো সরিয়ে দাও
    setTimeout(() => {
      loader.style.display = 'none';
    }, 520);
  }, 1400);
});

// =============================================
// 2. THEME SWITCHER
// =============================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themePanel     = document.getElementById('themePanel');

themeToggleBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  themePanel.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#themeSwitcher')) {
    themePanel?.classList.remove('open');
  }
});

document.querySelectorAll('.theme-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    applyTheme(opt.dataset.theme);
    themePanel.classList.remove('open');
  });
});

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
  document.querySelector(`.theme-opt[data-theme="${theme}"]`)?.classList.add('active');
  localStorage.setItem('portfolio-theme', theme);
  syncColorInputs();
}

// Saved theme restore — default: glass
const savedTheme = localStorage.getItem('portfolio-theme') || 'glass';
applyTheme(savedTheme);

// =============================================
// COLOR PALETTE CUSTOMIZER
// =============================================
const cpAccent  = document.getElementById('cpAccent');
const cpAccent2 = document.getElementById('cpAccent2');
const cpBg      = document.getElementById('cpBg');
const cpReset   = document.getElementById('cpReset');

const CP_KEYS = {
  '--accent':   cpAccent,
  '--accent-2': cpAccent2,
  '--bg':       cpBg,
};

function setCustomColor(prop, val) {
  document.documentElement.style.setProperty(prop, val);
  localStorage.setItem(`cp-${prop}`, val);
}

function syncColorInputs() {
  // requestAnimationFrame নিশ্চিত করে theme variables আগে apply হয়েছে
  requestAnimationFrame(() => {
    const style = getComputedStyle(document.documentElement);
    Object.entries(CP_KEYS).forEach(([prop, input]) => {
      if (!input) return;
      const saved = localStorage.getItem(`cp-${prop}`);
      input.value = saved || style.getPropertyValue(prop).trim() || '#000000';
    });
  });
}

Object.entries(CP_KEYS).forEach(([prop, input]) => {
  input?.addEventListener('input', e => setCustomColor(prop, e.target.value));
});

cpReset?.addEventListener('click', () => {
  Object.keys(CP_KEYS).forEach(prop => {
    document.documentElement.style.removeProperty(prop);
    localStorage.removeItem(`cp-${prop}`);
  });
  syncColorInputs();
});

// Saved custom colors restore
Object.keys(CP_KEYS).forEach(prop => {
  const saved = localStorage.getItem(`cp-${prop}`);
  if (saved) document.documentElement.style.setProperty(prop, saved);
});
syncColorInputs();

// =============================================
// 3. FOOTER YEAR
// =============================================
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// 3. NAVBAR — scroll state + mobile menu
// =============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}, { passive: true });

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// =============================================
// 3. ACTIVE NAV HIGHLIGHT ON SCROLL
// =============================================
function updateActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navHeight = navbar.offsetHeight + 10;
  let current = '';

  // Page-এর একদম নিচে থাকলে শেষ section active
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;
  if (atBottom) {
    current = sections[sections.length - 1].getAttribute('id');
  } else {
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= navHeight) {
        current = section.getAttribute('id');
      }
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// =============================================
// 4. SCROLL REVEAL (lightweight AOS)
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

// =============================================
// 5. DOWNLOAD VCARD (.vcf)
// =============================================
function downloadVCard() {
  const vcfData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Al Amin Onik',
    'N:Onik;Al Amin;;;',
    'ORG:Udvash-Unmesh-Uttoron',
    'TITLE:Assistant Manager ERP & Web Management',
    'TEL;TYPE=CELL,VOICE:+8801313368630',
    'TEL;TYPE=WORK,VOICE:+8801675547466',
    'EMAIL;TYPE=WORK:anik@udvash.com',
    'URL:https://www.udvash.com',
    'PHOTO;VALUE=URI:assets/profile.jpg',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'Al_Amin_Onik.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showToast('✅ vCard downloaded!');
}

// =============================================
// 6. TOAST NOTIFICATION
// =============================================
function showToast(message) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className   = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}
