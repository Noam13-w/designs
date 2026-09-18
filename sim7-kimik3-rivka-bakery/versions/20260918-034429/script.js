/* ===== מאפיית רבקה — script.js ===== */
(function () {
  'use strict';

  var WA_NUMBER = '972501234567';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu data ---------- */
  var MENU = {
    breads: [
      { name: 'לחם מחמצת כפרי', desc: 'מחמצת בת 27, עיסה איטית של 24 שעות וקרום פריך ועמוק.', price: 22, badge: 'הכי נמכר' },
      { name: 'חלה קלועה', desc: 'חלה רכה ומבריקה בקליעת ארבע, עם או בלי שומשום.', price: 18 },
      { name: 'לחמניות בוקר — 6 יח׳', desc: 'לחמניות רכות שיוצאות מהתנור ב־06:00, מושלמות עם גבינה.', price: 20 }
    ],
    cakes: [
      { name: 'עוגת שמרים שוקולד', desc: 'המתכון של סבתא רבקה: שכבות בצק שמרים ושוקולד בלגי.', price: 45, badge: 'הכי נמכר' },
      { name: 'עוגת גבינה אפויה', desc: 'גבינה עדינה על תחתית פריכה, נאפית לאט בתנור.', price: 55 },
      { name: 'עוגת שוקולד בלגי', desc: 'עשירה ולחה, 70% קקאו, עם ציפוי גנאש מבריק.', price: 52 }
    ],
    pastries: [
      { name: 'בורקס גבינה', desc: 'בצק עלים פריך במילוי גבינה מלוחה, עם שומשום למעלה.', price: 12 },
      { name: 'קרואסון חמאה', desc: '27 שכבות של חמאה צרפתית, פריך מבחוץ ואוורירי מבפנים.', price: 14 },
      { name: 'מארז רוגלך', desc: 'רוגלך שוקולד-אגוזים במארז של 8 יחידות, לאירוח או לעצמכם.', price: 28 }
    ]
  };

  function waLink(productName) {
    var text = 'שלום, אשמח להזמין ' + productName + ' ממאפיית רבקה';
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function renderPanel(panelEl, items) {
    var html = items.map(function (item, i) {
      return (
        '<article class="product-card" style="animation: panel-in .5s cubic-bezier(.2,.7,.2,1) both; animation-delay:' + (i * 0.08) + 's">' +
          (item.badge ? '<span class="product-badge">' + item.badge + '</span>' : '') +
          '<h3 class="font-display font-bold text-xl mb-2 mt-1">' + item.name + '</h3>' +
          '<p class="text-muted leading-relaxed text-[15px] mb-6">' + item.desc + '</p>' +
          '<div class="mt-auto flex items-center justify-between gap-3 flex-wrap">' +
            '<span class="product-price">₪' + item.price + '</span>' +
            '<a class="product-order" href="' + waLink(item.name) + '" target="_blank" rel="noopener">' +
              '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
              'הזמינו' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');
    panelEl.innerHTML = html;
  }

  Object.keys(MENU).forEach(function (key) {
    var panel = document.getElementById('panel-' + key);
    if (panel) renderPanel(panel, MENU[key]);
  });

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));

  function activateTab(tab, focus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById('panel-' + t.getAttribute('data-tab'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () { activateTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      // In RTL, ArrowLeft moves forward through the list
      if (e.key === 'ArrowLeft') next = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowRight') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next, true); }
    });
  });

  // Category links from specialty cards open the matching tab
  document.querySelectorAll('[data-tab-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      var key = link.getAttribute('data-tab-link');
      var tab = document.querySelector('.tab-btn[data-tab="' + key + '"]');
      if (tab) activateTab(tab, false);
    });
  });

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('site-nav');
  function onScrollNav() {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('icon-open');
  var iconClose = document.getElementById('icon-close');

  function setMenu(open, returnFocus) {
    mobileMenu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט ניווט' : 'פתיחת תפריט ניווט');
    if (!open && returnFocus) toggle.focus();
  }
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      setMenu(mobileMenu.classList.contains('hidden'), false);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false, false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        setMenu(false, true);
      }
    });
    document.addEventListener('click', function (e) {
      if (!mobileMenu.classList.contains('hidden') &&
          !mobileMenu.contains(e.target) &&
          !toggle.contains(e.target)) {
        setMenu(false, false);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Hero parallax (transform only, desktop) ---------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  var desktopMq = window.matchMedia('(min-width: 768px)');
  var parallaxActive = false;
  var ticking = false;

  function onParallaxScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
          if (y < window.innerHeight * 1.2) {
            el.style.transform = 'translate3d(0,' + (y * speed) + 'px,0)';
          } else {
            el.style.transform = '';
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  function syncParallax() {
    var shouldRun = !reducedMotion && desktopMq.matches && parallaxEls.length > 0;
    if (shouldRun && !parallaxActive) {
      window.addEventListener('scroll', onParallaxScroll, { passive: true });
      parallaxActive = true;
    } else if (!shouldRun && parallaxActive) {
      window.removeEventListener('scroll', onParallaxScroll);
      parallaxEls.forEach(function (el) { el.style.transform = ''; });
      parallaxActive = false;
    }
  }
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', syncParallax);
  else if (desktopMq.addListener) desktopMq.addListener(syncParallax);
  syncParallax();

  /* ---------- Live open/closed badge ---------- */
  // Hours: Sun-Thu 06:30-19:00, Fri 06:00-14:00, Sat closed.
  // JS getDay(): 0=Sun ... 5=Fri, 6=Sat
  function getHoursFor(day) {
    if (day === 6) return null;                       // Saturday — closed
    if (day === 5) return { open: 6 * 60, close: 14 * 60 };
    return { open: 6 * 60 + 30, close: 19 * 60 };
  }
  function fmt(minutes) {
    var h = Math.floor(minutes / 60), m = minutes % 60;
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
  }

  function updateOpenBadge() {
    var badge = document.getElementById('open-badge');
    var text = document.getElementById('open-text');
    if (!badge || !text) return;

    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = getHoursFor(day);

    if (today && mins >= today.open && mins < today.close) {
      badge.classList.remove('closed');
      text.textContent = 'פתוח עכשיו — נסגר ב־' + fmt(today.close);
      return;
    }

    // Closed — figure out next opening
    badge.classList.add('closed');
    var label;
    if (today && mins < today.open) {
      label = 'נפתח היום ב־' + fmt(today.open);
    } else {
      // find next open day
      var d = (day + 1) % 7, steps = 1;
      while (!getHoursFor(d) && steps < 8) { d = (d + 1) % 7; steps++; }
      var next = getHoursFor(d);
      if (steps === 1) label = 'נפתח מחר ב־' + fmt(next.open);
      else if (d === 0 && steps === 2) label = 'נפתח ביום ראשון ב־' + fmt(next.open);
      else label = 'נפתח ביום הבא ב־' + fmt(next.open);
    }
    text.textContent = 'סגור כרגע — ' + label;
  }
  updateOpenBadge();
  setInterval(updateOpenBadge, 60000);
})();