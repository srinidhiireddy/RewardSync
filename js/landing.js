/* ============================================
   REWARDSYNC — Landing Page JavaScript
   ============================================ */

// ---- Navbar scroll effect ----
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Mobile nav toggle ----
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ---- Hero wallet amount counter ----
function animateCounter(el, target, prefix = '', suffix = '', duration = 2000) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Animate hero wallet total
const heroAmount = document.getElementById('heroAmount');
const totalBarFill = document.getElementById('totalBarFill');
if (heroAmount) {
  setTimeout(() => {
    animateCounter(heroAmount, 145, '₹', '', 1800);
    if (totalBarFill) {
      setTimeout(() => { totalBarFill.style.width = '72%'; }, 300);
    }
  }, 600);
}

// ---- Stats Section Counter Animation ----
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseFloat(entry.target.dataset.target);
      const suffix = entry.target.dataset.suffix || '';
      const prefix = entry.target.textContent.startsWith('₹') ? '₹' : '$';
      const isRupee = entry.target.dataset.suffix && entry.target.dataset.suffix.includes('K');
      const isPct = suffix === '%';
      const isDollar = !isRupee && !isPct;

      const start = performance.now();
      const duration = 2000;
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (eased * target).toFixed(target % 1 !== 0 ? 0 : 0);
        if (isRupee) {
          entry.target.textContent = '₹' + Math.round(current) + suffix;
        } else if (isPct) {
          entry.target.textContent = Math.round(current) + suffix;
        } else {
          entry.target.textContent = '$' + current + suffix;
        }
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ---- Floating alerts auto-cycle ----
const alerts = document.querySelectorAll('.floating-alert');
alerts.forEach((alert, i) => {
  alert.style.animationDelay = `${i * 1.5}s`;
});

// ---- Smooth anchor scroll ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Scroll reveal animation ----
const revealElements = document.querySelectorAll(
  '.problem-card, .feature-card, .step, .stat-item, .platform-pill'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// ---- CTA Button pulse ----
const heroCTA = document.getElementById('heroGetStarted');
if (heroCTA) {
  setInterval(() => {
    heroCTA.style.boxShadow = '0 0 0 0 rgba(124,58,237,0)';
    heroCTA.animate([
      { boxShadow: '0 0 0 0 rgba(124,58,237,0.5)' },
      { boxShadow: '0 0 0 16px rgba(124,58,237,0)' }
    ], { duration: 1500, easing: 'ease-out' });
  }, 3000);
}
