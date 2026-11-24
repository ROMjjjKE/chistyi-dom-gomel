document.documentElement.classList.add('js');

/* меню */
(function () {
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

/* калькулятор часов */
(function () {
  var calc = document.getElementById('calc');
  if (!calc) return;
  var K = { support: 1, general: 1.8, remont: 2.6 };
  var NAME = { support: 'поддерживающая', general: 'генеральная', remont: 'после ремонта' };
  var st = { type: 'support', area: 60, extra: 0 };
  var area = document.getElementById('area');
  var out = document.getElementById('cHours');
  var crew = document.getElementById('cCrew');
  var note = document.getElementById('cNote');
  var tName = document.getElementById('cType');
  var aNum = document.getElementById('cArea');

  function hours() {
    var base = (st.area / 26) * K[st.type];
    var h = base + st.extra;
    return Math.max(1.5, Math.round(h * 2) / 2);
  }
  function render() {
    var h = hours();
    var n = h > 5 ? 2 : 1;
    var per = n === 2 ? Math.round((h / 2) * 2) / 2 : h;
    out.textContent = String(h).replace('.', ',') + ' ч';
    crew.textContent = n === 1 ? 'один клинер' : 'два клинера по ' + String(per).replace('.', ',') + ' ч';
    tName.textContent = NAME[st.type];
    aNum.textContent = st.area;
    note.textContent = st.type === 'remont'
      ? 'После ремонта считаем с запасом: пыль оседает повторно, часто нужен второй проход. Ставку подтверждаем по телефону.'
      : 'Стоимость — по часовой ставке: часы × ставка. Ставку и точный расчёт подтверждаем по телефону.';
  }
  Array.prototype.forEach.call(calc.querySelectorAll('.seg button'), function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(calc.querySelectorAll('.seg button'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      st.type = btn.getAttribute('data-t');
      render();
    });
  });
  if (area) area.addEventListener('input', function () { st.area = +area.value; render(); });
  Array.prototype.forEach.call(calc.querySelectorAll('.zones input'), function (cb) {
    cb.addEventListener('change', function () {
      st.extra = 0;
      Array.prototype.forEach.call(calc.querySelectorAll('.zones input'), function (c) {
        if (c.checked) st.extra += parseFloat(c.getAttribute('data-add'));
      });
      render();
    });
  });
  render();
})();

/* форма заявки */
(function () {
  var f = document.getElementById('reqForm');
  if (!f) return;
  var toast = document.getElementById('toast');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var type = document.getElementById('q-type'), area = document.getElementById('q-area'),
        name = document.getElementById('q-name'), tel = document.getElementById('q-tel'),
        note = document.getElementById('q-note');
    var bad = 0;
    [[type, type.value.trim() !== ''], [area, area.value.trim() !== ''], [name, name.value.trim().length > 1], [tel, tel.value.replace(/\D/g, '').length >= 9]]
      .forEach(function (pair) {
        var field = pair[0].closest('.field');
        var ok = pair[1];
        field.classList.toggle('err', !ok);
        if (!ok) bad++;
      });
    if (bad) return;
    var text = ['Заявка на уборку (Чистый дом, Гомель)',
      'Тип: ' + type.value,
      'Площадь: ' + area.value + ' м²',
      'Имя: ' + name.value,
      'Телефон: ' + tel.value];
    if (note.value.trim()) text.push('Комментарий: ' + note.value.trim());
    var msg = text.join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(function () {});
    if (toast) toast.style.display = 'block';
    window.open('https://wa.me/375297304567?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();

/* появление блоков */
(function () {
  var els = document.querySelectorAll('.fx');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });
})();
