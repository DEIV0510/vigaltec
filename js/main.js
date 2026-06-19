/* ===================================================================
   VIGALTEC — main.js
=================================================================== */
(function () {
  'use strict';

  /* ---------- CONFIG (editar datos reales aquí) ---------- */
  const CONFIG = {
    waNumber: '573168769923',                 // WhatsApp en formato internacional sin + ni espacios
    phoneDisplay: '+57 316 876 9923',
    email: 'contacto@vigaltec.com',
    address: 'Calle 40 # 4B-39',
    waGreeting: 'Hola VIGALTEC 👋, quisiera más información sobre sus servicios de estructuras metálicas.'
  };

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Inyectar datos de contacto ---------- */
  function waLink(text) {
    return 'https://wa.me/' + CONFIG.waNumber + '?text=' + encodeURIComponent(text || CONFIG.waGreeting);
  }
  function injectContact() {
    $$('[data-field="phone"]').forEach(el => {
      el.textContent = CONFIG.phoneDisplay;
      if (el.tagName === 'A') el.setAttribute('href', 'tel:+' + CONFIG.waNumber);
    });
    $$('[data-field="email"]').forEach(el => {
      el.textContent = CONFIG.email;
      if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + CONFIG.email);
    });
    $$('[data-field="address"]').forEach(el => { el.textContent = CONFIG.address; });
    const wd = $('#waDirect'); if (wd) wd.href = waLink();
    const fw = $('#fabWa'); if (fw) fw.href = waLink();
  }

  /* ---------- LOADER ---------- */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    const fill = $('.loader__fill', loader);
    const pct = $('.loader__pct', loader);
    document.body.classList.add('no-scroll');
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) p = 100;
      if (fill) fill.style.width = p + '%';
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (p >= 100) clearInterval(tick);
    }, 130);

    function done() {
      if (fill) fill.style.width = '100%';
      if (pct) pct.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('is-done');
        document.body.classList.remove('no-scroll');
        document.body.classList.add('loaded'); // dispara la animación del título del hero
        startReveals();
        if (window.__heroVideoPlay) window.__heroVideoPlay(); // arranca el video al entrar
      }, 240);
    }
    const minTime = new Promise(r => setTimeout(r, prefersReduced ? 250 : 1100));
    const pageLoad = new Promise(r => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    Promise.all([minTime, pageLoad]).then(done);
    // failsafe
    setTimeout(done, 4000);
  }

  /* ---------- HEADER + SCROLLSPY ---------- */
  function initHeader() {
    const header = $('#header');
    const links = $$('.nav__link');
    const sections = links
      .map(l => document.getElementById(l.getAttribute('href').slice(1)))
      .filter(Boolean);

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      let current = '';
      const y = window.scrollY + 120;
      sections.forEach(sec => { if (sec.offsetTop <= y) current = sec.id; });
      links.forEach(l => l.classList.toggle('is-current', l.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- MOBILE NAV ---------- */
  function initNav() {
    const burger = $('#burger');
    const nav = $('#nav');
    if (!burger || !nav) return;
    const toggle = (open) => {
      const isOpen = open ?? !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', isOpen);
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    };
    burger.addEventListener('click', () => toggle());
    $$('.nav__link', nav).forEach(l => l.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  let revealsStarted = false;
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;
    const items = $$('.reveal');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-visible'));
      return;
    }
    // stagger por posición dentro del contenedor
    items.forEach(el => {
      const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
      const idx = sibs.indexOf(el);
      if (sibs.length > 1 && idx > 0) el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(i => io.observe(i));
  }

  /* ---------- COUNTERS ---------- */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      if (prefersReduced) { el.textContent = target + suffix; return; }
      const dur = 1600;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------- HERO PARALLAX ---------- */
  function initParallax() {
    const bg = $('.hero__bg');
    const hero = $('.hero');
    if (!bg || !hero || prefersReduced) return;
    if (window.matchMedia('(max-width:860px)').matches) return; // sin parallax en móvil (scroll más fluido)
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        bg.style.transform = 'scale(1.12) translate3d(0,' + (y * 0.18) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ---------- HERO VIDEO ---------- */
  function initHeroVideo() {
    const v = document.querySelector('.hero__video');
    if (!v) return;
    if (prefersReduced) { v.removeAttribute('autoplay'); try { v.pause(); } catch (e) {} return; }

    // Forzar condiciones de autoplay (Safari/iOS/Chrome móvil)
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');

    let playing = false;
    const attempt = () => {
      if (playing || !v.paused) { playing = true; return; }
      const p = v.play();
      if (p && p.then) p.then(() => { playing = true; }).catch(() => {});
    };

    // Reproducir en cuanto el navegador tenga datos suficientes
    ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach(ev =>
      v.addEventListener(ev, attempt));
    v.addEventListener('playing', () => { playing = true; });

    // Intento inmediato + reintentos cortos durante ~5s (cubre la carga inicial)
    attempt();
    let tries = 0;
    const iv = setInterval(() => { attempt(); if (playing || ++tries > 14) clearInterval(iv); }, 350);

    // Si el navegador bloquea el autoplay, arrancar con el primer gesto/interacción
    const onGesture = () => attempt();
    ['pointerdown', 'touchstart', 'keydown', 'scroll', 'mousemove', 'click'].forEach(ev =>
      window.addEventListener(ev, onGesture, { passive: true }));

    // Reintentar al volver a la pestaña
    document.addEventListener('visibilitychange', () => { if (!document.hidden) attempt(); });

    window.__heroVideoPlay = attempt; // usado por el loader al cerrarse
    try { v.load(); } catch (e) {}
  }

  /* ---------- GALLERY FILTER ---------- */
  function initFilters() {
    const btns = $$('.filter');
    const items = $$('.gitem');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const f = btn.dataset.filter;
        items.forEach(it => {
          const show = f === 'all' || it.dataset.cat === f;
          it.classList.remove('just-shown');
          if (show) {
            it.classList.remove('is-hidden');
            // re-trigger animación
            void it.offsetWidth;
            if (!prefersReduced) it.classList.add('just-shown');
          } else {
            it.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ---------- LIGHTBOX ---------- */
  function initLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    const img = $('#lbImg'), cap = $('#lbCaption');
    const btnClose = $('#lbClose'), btnPrev = $('#lbPrev'), btnNext = $('#lbNext');
    let list = [], idx = 0;

    const visibleItems = () => $$('.gitem').filter(i => !i.classList.contains('is-hidden'));

    const show = (i) => {
      idx = (i + list.length) % list.length;
      const it = list[idx];
      img.src = it.dataset.full;
      img.alt = it.dataset.title || '';
      cap.textContent = it.dataset.title || '';
    };
    const open = (it) => {
      list = visibleItems();
      idx = list.indexOf(it);
      show(idx);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    $$('.gitem').forEach(it => it.addEventListener('click', () => open(it)));
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => show(idx - 1));
    btnNext.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    // swipe
    let sx = 0;
    lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- TESTIMONIOS SLIDER ---------- */
  function initTesti() {
    const track = $('#testiTrack');
    if (!track) return;
    const cards = $$('.testi__card', track);
    const dotsWrap = $('#testiDots');
    const prev = $('#testiPrev'), next = $('#testiNext');
    let i = 0, timer = null;
    const total = cards.length;

    cards.forEach((_, k) => {
      const d = document.createElement('button');
      d.className = 'testi__dot' + (k === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', 'Ver testimonio ' + (k + 1));
      d.addEventListener('click', () => { go(k); reset(); });
      dotsWrap.appendChild(d);
    });
    const dots = $$('.testi__dot', dotsWrap);

    function go(n) {
      i = (n + total) % total;
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    }
    function reset() { if (timer) clearInterval(timer); if (!prefersReduced) timer = setInterval(() => go(i + 1), 5500); }

    prev.addEventListener('click', () => { go(i - 1); reset(); });
    next.addEventListener('click', () => { go(i + 1); reset(); });
    const slider = $('#testiSlider');
    slider.addEventListener('mouseenter', () => timer && clearInterval(timer));
    slider.addEventListener('mouseleave', reset);
    let sx = 0;
    slider.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) { go(i + (dx < 0 ? 1 : -1)); reset(); }
    }, { passive: true });
    reset();
  }

  /* ---------- QUOTE FORM -> WHATSAPP ---------- */
  function initForm() {
    const form = $('#quoteForm');
    if (!form) return;
    const setErr = (name, msg) => {
      const field = form.querySelector('[name="' + name + '"]').closest('.field');
      field.classList.toggle('has-error', !!msg);
      const err = field.querySelector('.field__err');
      if (err) err.textContent = msg || '';
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();
      let ok = true;
      if (name.length < 2) { setErr('name', 'Ingresa tu nombre.'); ok = false; } else setErr('name', '');
      if (phone.replace(/\D/g, '').length < 7) { setErr('phone', 'Ingresa un teléfono válido.'); ok = false; } else setErr('phone', '');
      if (!ok) { form.querySelector('.has-error input')?.focus(); return; }

      const txt =
        '*Nueva solicitud de cotización — VIGALTEC*%0A%0A' +
        '👤 *Nombre:* ' + name + '%0A' +
        '📞 *Teléfono:* ' + phone + '%0A' +
        '🔧 *Servicio:* ' + service + '%0A' +
        (message ? '📝 *Detalle:* ' + message : '');
      window.open('https://wa.me/' + CONFIG.waNumber + '?text=' + txt, '_blank', 'noopener');
    });
  }

  /* ---------- SCROLL PROGRESS ---------- */
  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(h.scrollTop / max, 1) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- BOTONES MAGNÉTICOS ---------- */
  function initMagnetic() {
    if (prefersReduced || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('.btn--lg:not(.btn--block), .btn--xl').forEach(btn => {
      let raf = null;
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { btn.style.transform = 'translate(' + (mx * 0.2) + 'px,' + (my * 0.32) + 'px)'; });
      });
      btn.addEventListener('pointerleave', () => { if (raf) cancelAnimationFrame(raf); btn.style.transform = ''; });
    });
  }

  /* ---------- BACK TO TOP + data-quote focus ---------- */
  function initMisc() {
    const top = $('#toTop');
    if (top) {
      window.addEventListener('scroll', () => {
        top.classList.toggle('is-visible', window.scrollY > 600);
      }, { passive: true });
      top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));
    }
    $$('[data-quote]').forEach(b => b.addEventListener('click', () => {
      setTimeout(() => $('#f-name')?.focus({ preventScroll: true }), 700);
    }));
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- INIT ---------- */
  function init() {
    injectContact();
    initLoader();
    initHeader();
    initNav();
    initCounters();
    initParallax();
    initHeroVideo();
    initFilters();
    initLightbox();
    initTesti();
    initForm();
    initScrollProgress();
    initMagnetic();
    initMisc();
    // por si el loader tarda, revelar al primer scroll igualmente
    window.addEventListener('scroll', startReveals, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
