// ============================================================
// ACE PRIME - SHARED SCRIPT
// Used across all pages
// ============================================================

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Hero line draw-in
  var heroLine = document.getElementById('heroLine');
  if (heroLine) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        heroLine.style.width = '100%';
      }, 600);
    });
  }

  // Dashboard chart bars fill on load
  var chartBars = document.querySelectorAll('.dash-bar-col');
  if (chartBars.length) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        var heights = [55, 75, 45, 90, 65, 100, 80];
        chartBars.forEach(function (bar, i) {
          bar.style.height = (heights[i % heights.length]) + '%';
        });
      }, 500);
    });
  }

  // Count up stats on scroll into view
  function animateCount(el, target, duration) {
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsGrid = document.getElementById('statsGrid');
  if (statsGrid) {
    var counted = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          var leadsEl = document.getElementById('statLeads');
          var hoursEl = document.getElementById('statHours');
          var daysEl = document.getElementById('statDays');
          if (leadsEl) animateCount(leadsEl, 3, 1400);
          if (hoursEl) animateCount(hoursEl, 40, 1400);
          if (daysEl) animateCount(daysEl, 14, 1400);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsGrid);
  }
});

// ---------- FIT FINDER ----------
(function () {
  var fitOptions = document.querySelectorAll('.fit-option');
  var fitResult = document.getElementById('fitResult');
  if (!fitOptions.length || !fitResult) return;

  var systems = {
    hvac: {
      tag: 'HVAC',
      name: 'The Never Miss a Call System',
      desc: 'Every after-hours call gets answered and booked automatically, no front desk required.'
    },
    ecommerce: {
      tag: 'E-commerce',
      name: 'The Repeat Customer System',
      desc: 'A post-purchase sequence that turns first-time buyers into repeat customers on autopilot.'
    },
    'property-management': {
      tag: 'Property Management',
      name: 'The Small Team, Big Portfolio System',
      desc: 'One manager runs a portfolio that used to need a small team, with nothing falling through the cracks.'
    },
    saas: {
      tag: 'Early-stage SaaS',
      name: 'The Activation & Retention System',
      desc: 'New sign-ups get guided to activation automatically, and fewer disappear in the first week.'
    }
  };

  fitOptions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      fitOptions.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var key = btn.getAttribute('data-fit');
      var s = systems[key];
      if (!s) return;

      fitResult.innerHTML =
        '<span class="fit-tag">' + s.tag + '</span>' +
        '<h3>' + s.name + '</h3>' +
        '<p>' + s.desc + '</p>' +
        '<a href="/portfolio#' + key + '" class="btn btn-primary btn-small">See the system →</a>';
    });
  });
})();

function closeMenu() {
  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

function toggleServiceRow(trigger) {
  var panelId = trigger.getAttribute('aria-controls');
  var panel = document.getElementById(panelId);
  if (!panel) return;

  var isOpen = trigger.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    // Closing: lock current height, then animate to 0
    panel.style.height = panel.scrollHeight + 'px';
    requestAnimationFrame(function () {
      panel.style.height = '0px';
    });
    trigger.setAttribute('aria-expanded', 'false');
  } else {
    // Opening: start at 0 (in case it was 'auto'), then animate to full height
    panel.style.height = '0px';
    var targetHeight = panel.scrollHeight;
    requestAnimationFrame(function () {
      panel.style.height = targetHeight + 'px';
    });
    trigger.setAttribute('aria-expanded', 'true');
    panel.addEventListener('transitionend', function handler() {
      if (trigger.getAttribute('aria-expanded') === 'true') {
        panel.style.height = 'auto';
      }
      panel.removeEventListener('transitionend', handler);
    });
  }
}

// Recalculate open panel heights on resize so wrapped text doesn't get clipped
window.addEventListener('resize', function () {
  document.querySelectorAll('.service-row-trigger[aria-expanded="true"]').forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (panel) panel.style.height = 'auto';
  });
});

// ---------- PRICING CALCULATOR ----------
(function () {
  var pagesInput = document.getElementById('calcPages');
  if (!pagesInput) return; // calculator not on this page

  // Interactive background glow follows the cursor within the section
  var calcSection = document.getElementById('calculator-section');
  var glow = document.getElementById('calcGlow');
  if (calcSection && glow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    calcSection.addEventListener('mousemove', function (e) {
      var rect = calcSection.getBoundingClientRect();
      var xPct = ((e.clientX - rect.left) / rect.width) * 100;
      var yPct = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.left = xPct + '%';
      glow.style.top = yPct + '%';
    });
  }

  var pagesValueEl = document.getElementById('calcPagesValue');
  var aiChatEl = document.getElementById('calcAiChat');
  var emailSequenceEl = document.getElementById('calcEmailSequence');
  var extraAutomationEl = document.getElementById('calcExtraAutomation');
  var brandRefreshEl = document.getElementById('calcBrandRefresh');
  var rushEl = document.getElementById('calcRush');

  var agencyPriceEl = document.getElementById('calcAgencyPrice');
  var freelancerPriceEl = document.getElementById('calcFreelancerPrice');
  var acePrimePriceEl = document.getElementById('calcAcePrimePrice');

  var BASE = 2000;
  var INCLUDED_PAGES = 6;
  var EXTRA_PAGE_PRICE = 100;
  var RUSH_PCT = 0.20;

  var AGENCY_BASE = 6000;
  var AGENCY_PER_PAGE = 350;
  var FREELANCER_BASE = 3000;
  var FREELANCER_PER_PAGE = 200;

  function formatPrice(n) {
    return '$' + Math.round(n).toLocaleString();
  }

  function calculate() {
    var pages = parseInt(pagesInput.value, 10);
    pagesValueEl.textContent = pages + (pages === 1 ? ' page' : ' pages');

    var total = BASE;
    var extraPages = Math.max(0, pages - INCLUDED_PAGES);
    total += extraPages * EXTRA_PAGE_PRICE;

    if (aiChatEl.checked) total += 500;
    if (emailSequenceEl.checked) total += 350;
    if (extraAutomationEl.checked) total += 400;
    if (brandRefreshEl.checked) total += 600;

    if (rushEl.checked) total *= (1 + RUSH_PCT);

    var agencyTotal = AGENCY_BASE + extraPages * AGENCY_PER_PAGE;
    var freelancerTotal = FREELANCER_BASE + extraPages * FREELANCER_PER_PAGE;

    acePrimePriceEl.textContent = formatPrice(total);
    agencyPriceEl.textContent = formatPrice(agencyTotal);
    freelancerPriceEl.textContent = formatPrice(freelancerTotal);
  }

  [pagesInput, aiChatEl, emailSequenceEl, extraAutomationEl, brandRefreshEl, rushEl].forEach(function (el) {
    el.addEventListener('input', calculate);
  });
  document.getElementById('calcRegular').addEventListener('input', calculate);

  calculate();
})();
