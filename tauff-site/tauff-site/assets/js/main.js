/* ============================================================
   TAUFF. — interações do site
   Vanilla JS · compatível com GitHub Pages (sem dependências)
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------------- preloader ---------------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add('done');
      document.body.classList.remove('loading');
    }, prefersReduced ? 100 : 1250);
  });
  // safety: remove preloader even if load event stalls
  setTimeout(function () {
    if (preloader) preloader.classList.add('done');
    document.body.classList.remove('loading');
  }, 3200);

  /* ---------------- custom cursor ---------------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring && isFinePointer && !prefersReduced) {
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function loopRing() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loopRing);
    })();
    document.querySelectorAll('a, button, [data-cursor="link"], .fan-card, .faq-q').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    });
  }

  /* ---------------- nav ---------------- */
  var nav = document.getElementById('nav');
  var waFloat = document.getElementById('waFloat');
  function onScrollNav() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('scrolled', y > 40);
    waFloat.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // active section highlight
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var sections = [];
  navLinks.forEach(function (l) {
    var s = document.getElementById(l.getAttribute('data-section'));
    if (s) sections.push(s);
  });
  if ('IntersectionObserver' in window && sections.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('data-section') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  // burger menu
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mmenu');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    mmenu.setAttribute('aria-hidden', 'true');
  }
  if (burger && mmenu) {
    burger.addEventListener('click', function () {
      var open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      mmenu.setAttribute('aria-hidden', String(!open));
    });
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------- smooth anchors with nav offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- counters ---------------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
    });
  }

  /* ---------------- fan (leque de projetos) ---------------- */
  var stage = document.getElementById('fanStage');
  var prevBtn = document.getElementById('fanPrev');
  var nextBtn = document.getElementById('fanNext');
  var dotsBox = document.getElementById('fanDots');
  if (stage) {
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.fan-card'));
    var active = 0;
    var autoTimer = null;
    var isMobileFan = function () { return window.matchMedia('(max-width: 920px)').matches; };

    // dots
    var dots = [];
    cards.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'fan-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ver projeto ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); restartAuto(); });
      dotsBox.appendChild(d);
      dots.push(d);
    });

    function render() {
      var n = cards.length;
      cards.forEach(function (card, i) {
        var offset = i - active;
        // wrap to shortest path (-2..2 for 5 cards)
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;
        var abs = Math.abs(offset);
        if (isMobileFan()) {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.zIndex = '';
          return;
        }
        var x = offset * 300;
        var y = Math.pow(abs, 1.6) * 34;
        var rot = offset * 6.5;
        var scale = 1 - Math.min(abs, 3) * 0.075;
        var opacity = abs > 2 ? 0 : 1 - abs * 0.28;
        card.style.transform =
          'translateX(' + x + 'px) translateY(' + y + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
        card.style.opacity = String(opacity);
        card.style.zIndex = String(50 - abs);
      });
      cards.forEach(function (c, i) {
        c.classList.toggle('is-active', i === active);
        c.setAttribute('aria-hidden', String(i !== active));
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === active); });
    }

    function goTo(i) {
      var n = cards.length;
      active = ((i % n) + n) % n;
      render();
    }
    function next() { goTo(active + 1); }
    function prev() { goTo(active - 1); }

    function restartAuto() {
      if (autoTimer) clearInterval(autoTimer);
      if (!prefersReduced) {
        autoTimer = setInterval(next, 6000);
      }
    }

    prevBtn.addEventListener('click', function () { prev(); restartAuto(); });
    nextBtn.addEventListener('click', function () { next(); restartAuto(); });

    cards.forEach(function (card, i) {
      card.addEventListener('click', function (e) {
        if (i === active) return; // link works on active card
        e.preventDefault();
        e.stopPropagation();
        goTo(i);
        restartAuto();
      });
    });

    // keyboard when fan visible
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' && fanInView()) { next(); restartAuto(); }
      if (e.key === 'ArrowLeft' && fanInView()) { prev(); restartAuto(); }
    });
    var fanVisible = false;
    function fanInView() { return fanVisible; }
    if ('IntersectionObserver' in window) {
      var fanObs = new IntersectionObserver(function (entries) {
        fanVisible = entries[0].isIntersecting;
      }, { threshold: 0.25 });
      fanObs.observe(stage);
    }

    // pause auto on hover
    stage.addEventListener('mouseenter', function () { if (autoTimer) clearInterval(autoTimer); });
    stage.addEventListener('mouseleave', restartAuto);

    // touch swipe (desktop fan fallback)
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 46) {
        if (dx < 0) { next(); } else { prev(); }
        restartAuto();
      }
      sx = null;
    }, { passive: true });

    // click on active card opens the site
    cards.forEach(function (card) {
      var url = card.getAttribute('data-url');
      card.addEventListener('dblclick', function () { window.open(url, '_blank'); });
    });

    window.addEventListener('resize', render);
    render();
    restartAuto();
  }

  /* ---------------- tilt effect ---------------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * 7) + 'deg) rotateX(' + (-py * 7) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left - r.width / 2) / r.width;
        var py = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'translate(' + px * 10 + 'px,' + py * 8 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------- parallax glows ---------------- */
  if (!prefersReduced) {
    var pEls = document.querySelectorAll('[data-parallax]');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        pEls.forEach(function (el) {
          var f = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          el.style.transform = 'translateY(' + y * f + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- video: play only when visible ---------------- */
  var video = document.getElementById('lossVideo');
  if (video && 'IntersectionObserver' in window) {
    var vObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    vObs.observe(video);
  }

  /* ---------------- faq accordion ---------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close all
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
