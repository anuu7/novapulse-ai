/**
 * NovaPulse AI - Core Interactive Engine
 * Modular, performant, zero-dependency client-side script
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initVitalityCalculator();
  initPricingToggle();
  initFaqAccordion();
  initContactForm();
  initSubmissionsList();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('novapulse_theme') || (prefersDark ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('novapulse_theme', theme);
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ==========================================================================
   2. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close nav on click outside or escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.innerHTML = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Interactive Vitality Score Calculator
   ========================================================================== */
function initVitalityCalculator() {
  const sleepSlider = document.getElementById('calc-sleep');
  const activitySlider = document.getElementById('calc-activity');
  const focusSlider = document.getElementById('calc-focus');
  
  const sleepVal = document.getElementById('calc-sleep-val');
  const activityVal = document.getElementById('calc-activity-val');
  const focusVal = document.getElementById('calc-focus-val');
  
  const scoreResult = document.getElementById('calc-score-result');
  const badgeResult = document.getElementById('calc-badge-result');

  if (!sleepSlider || !activitySlider || !focusSlider) return;

  function calculateScore() {
    const sleep = parseFloat(sleepSlider.value);
    const activity = parseFloat(activitySlider.value);
    const focus = parseFloat(focusSlider.value);

    // Update label values
    if (sleepVal) sleepVal.textContent = `${sleep} hrs`;
    if (activityVal) activityVal.textContent = `${activity} mins`;
    if (focusVal) focusVal.textContent = `${focus} hrs`;

    // Mathematical formula for vitality score index (0-100)
    const sleepScore = Math.min(100, (sleep / 8) * 35);
    const activityScore = Math.min(100, (activity / 60) * 35);
    const focusScore = Math.min(100, (focus / 6) * 30);
    const total = Math.min(99, Math.round(sleepScore + activityScore + focusScore));

    if (scoreResult) scoreResult.textContent = total;

    if (badgeResult) {
      if (total >= 85) {
        badgeResult.textContent = '⚡ Peak Bio-State (Optimal)';
        badgeResult.style.color = 'var(--success)';
      } else if (total >= 65) {
        badgeResult.textContent = '✨ Balanced Vitality (Good)';
        badgeResult.style.color = 'var(--accent-secondary)';
      } else {
        badgeResult.textContent = '⚠️ Elevated Burnout Risk (Needs Pulse)';
        badgeResult.style.color = 'var(--warning)';
      }
    }
  }

  [sleepSlider, activitySlider, focusSlider].forEach(slider => {
    slider.addEventListener('input', calculateScore);
  });

  calculateScore();
}

/* ==========================================================================
   4. Pricing Billing Cycle Toggle
   ========================================================================== */
function initPricingToggle() {
  const billingCheckbox = document.getElementById('billing-toggle');
  const starterPrice = document.getElementById('price-starter');
  const proPrice = document.getElementById('price-pro');
  const enterprisePrice = document.getElementById('price-enterprise');

  if (!billingCheckbox) return;

  billingCheckbox.addEventListener('change', () => {
    const isYearly = billingCheckbox.checked;
    
    if (starterPrice) {
      starterPrice.innerHTML = isYearly ? '$0<span>/forever</span>' : '$0<span>/forever</span>';
    }
    if (proPrice) {
      proPrice.innerHTML = isYearly ? '$19<span>/mo (billed yearly)</span>' : '$29<span>/mo</span>';
    }
    if (enterprisePrice) {
      enterprisePrice.innerHTML = isYearly ? '$79<span>/mo (billed yearly)</span>' : '$99<span>/mo</span>';
    }

    showToast(isYearly ? 'Annual billing applied (Saved 25%!)' : 'Monthly billing applied', 'info');
  });
}

/* ==========================================================================
   5. Searchable FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const searchInput = document.getElementById('faq-search-input');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        accordionItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      accordionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   6. Contact / VIP Early Access Form & Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('vip-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const roleSelect = document.getElementById('form-role');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'Individual';
    const message = messageInput ? messageInput.value.trim() : '';

    // Validation
    if (!name || name.length < 2) {
      showToast('Please enter your full name (at least 2 characters)', 'error');
      nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      emailInput.focus();
      return;
    }

    // Save to localStorage
    const newSubmission = {
      id: Date.now(),
      name,
      email,
      role,
      message: message || 'Early Access Request',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    saveSubmission(newSubmission);
    form.reset();
    showToast('🎉 VIP Access application received! We sent a confirmation email.', 'success');
    renderSubmissions();
  });
}

function saveSubmission(submission) {
  const existing = JSON.parse(localStorage.getItem('novapulse_submissions') || '[]');
  existing.unshift(submission);
  localStorage.setItem('novapulse_submissions', JSON.stringify(existing.slice(0, 10)));
}

function initSubmissionsList() {
  const clearBtn = document.getElementById('clear-submissions-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('novapulse_submissions');
      renderSubmissions();
      showToast('Local application log cleared', 'info');
    });
  }
  renderSubmissions();
}

function renderSubmissions() {
  const container = document.getElementById('submissions-list');
  if (!container) return;

  const submissions = JSON.parse(localStorage.getItem('novapulse_submissions') || '[]');

  if (submissions.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">No applications submitted yet in this browser session.</p>';
    return;
  }

  container.innerHTML = submissions.map(sub => `
    <div class="submission-item">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
        <strong>${escapeHtml(sub.name)}</strong>
        <span style="color: var(--accent-primary); font-size: 0.75rem;">${escapeHtml(sub.role)}</span>
      </div>
      <div style="color: var(--text-secondary); font-size: 0.8rem;">${escapeHtml(sub.email)}</div>
      <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;">${sub.date}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   7. Custom Toast System
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><div>${escapeHtml(message)}</div>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
