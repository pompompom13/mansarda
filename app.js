(function () {
  // часы работы: [открытие, закрытие], 26/28 = 02:00/04:00 следующего дня. Пн = 0
  var HOURS = [[12, 26], [12, 26], [12, 26], [12, 26], [12, 28], [12, 28], [12, 26]];
  var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var root = document.documentElement;

  // --- 18+ ---
  document.getElementById('ageYes').addEventListener('click', function () {
    try { localStorage.setItem('mansarda-age', 'yes'); } catch (e) {}
    root.classList.add('age-ok');
  });
  document.getElementById('ageNo').addEventListener('click', function () {
    document.getElementById('ageAsk').hidden = true;
    document.getElementById('ageDeny').hidden = false;
  });

  // --- menu ---
  var body = document.getElementById('menuBody');
  var tabs = document.querySelectorAll('.tab');
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(p) { return p.split(' / ').map(function (v) { return v.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }).join(' / ') + ' ₽'; }
  function render(key) {
    body.innerHTML = window.MANSARDA_MENU[key].map(function (g) {
      return '<section class="mgroup"><h3>' + esc(g.title) + (g.note ? ' <small>' + esc(g.note) + '</small>' : '') + '</h3><ul>' +
        g.items.map(function (it) {
          return '<li><div class="mrow"><span>' + esc(it[0]) + '</span><i aria-hidden="true"></i><b>' + fmt(it[1]) + '</b></div>' +
            (it[2] ? '<small class="mdesc">' + esc(it[2]) + '</small>' : '') + '</li>';
        }).join('') + '</ul></section>';
    }).join('');
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      render(t.dataset.tab);
    });
  });
  render('kitchen');

  // --- stamp: open / closed (Moscow time) ---
  function hh(h) { return (h % 24 < 10 ? '0' : '') + (h % 24) + ':00'; }
  var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  var d = (msk.getDay() + 6) % 7, h = msk.getHours() + msk.getMinutes() / 60;
  var prev = HOURS[(d + 6) % 7], cur = HOURS[d], open = false, until;
  if (h < prev[1] - 24) { open = true; until = prev[1]; }
  else if (h >= cur[0]) { open = true; until = cur[1]; }
  var sign = document.getElementById('stamp');
  document.getElementById('stampState').textContent = open ? 'Открыто' : 'Закрыто';
  document.getElementById('stampTime').textContent = open ? 'до ' + hh(until) : 'откроемся в ' + hh(cur[0] > h ? cur[0] : HOURS[(d + 1) % 7][0]);
  sign.classList.add(open ? 'is-open' : 'is-closed');

  document.getElementById('week').innerHTML = DAYS.map(function (n, i) {
    return '<li' + (i === d ? ' class="is-today"' : '') + '><span>' + n + '</span><span>' + hh(HOURS[i][0]) + '–' + hh(HOURS[i][1]) + '</span></li>';
  }).join('');

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
