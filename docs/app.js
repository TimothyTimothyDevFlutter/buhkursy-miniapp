/* ============================================================================
   ПОВЕДЕНИЕ И СБОРКА СТРАНИЦЫ

   Этот файл берёт содержимое из data.js и расставляет его по пустым блокам
   в index.html. Плюс отвечает за раскрытие курсов, переключение языка,
   форму заявки и связь с Telegram.

   Здесь текстов нет — если нужно поменять слово, цену или телефон,
   вам нужен файл data.js, а не этот.
   ============================================================================ */


/* ---------------------------------------------------------------------------
   ЯЗЫК

   Страница знает несколько языков. Какой показать — решается при открытии
   в таком порядке:
     1. что человек выбрал в прошлый раз (запоминается в браузере);
     2. если не выбирал — язык его Telegram;
     3. если и это неизвестно — язык из настроек в data.js.
   --------------------------------------------------------------------------- */

// Языки и их порядок в переключателе.
// Чтобы добавить четвёртый — впишите его сюда и создайте такой же
// блок в data.js. Больше нигде править не нужно.
var LANGS = ['ru', 'uz', 'en'];

var LANG = 'ru';   // текущий язык, меняется переключателем

function known(lang) {
  return LANGS.indexOf(lang) !== -1 && !!DATA[lang];
}

function pickLang() {
  // 1. прошлый выбор человека
  try {
    var saved = localStorage.getItem('lang');
    if (known(saved)) return saved;
  } catch (e) { /* браузер может запрещать хранение — не страшно */ }

  // 2. язык интерфейса Telegram
  var tg = telegram();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    var code = String(tg.initDataUnsafe.user.language_code || '').slice(0, 2);
    if (known(code)) return code;
  }

  // 3. настройка по умолчанию
  return known(DATA.settings.defaultLang) ? DATA.settings.defaultLang : 'ru';
}

// Короткая ссылка на тексты текущего языка
function T() {
  return DATA[LANG];
}

function setLang(lang) {
  if (!known(lang)) return;
  if (lang === LANG) return;

  LANG = lang;
  try { localStorage.setItem('lang', lang); } catch (e) {}
  document.documentElement.lang = T().htmlLang;

  haptic('light');
  renderAll();
}


/* ---------------------------------------------------------------------------
   МАЛЕНЬКИЕ ПОМОЩНИКИ
   --------------------------------------------------------------------------- */

// Находит на странице пустой блок по его подписи data-block из index.html
function block(name) {
  return document.querySelector('[data-block="' + name + '"]');
}

// Обезвреживает символы < > &, если они вдруг попадут в текст из data.js
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Расставляет пробелы в разрядах: 100000 превращается в «100 000»
function money(number) {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Готовит номер для звонка: из «+998 91 354-11-28» делает «tel:+998913541128»
function telHref(phone) {
  return 'tel:' + String(phone).replace(/[^\d+]/g, '');
}

// Достаёт цвет из палитры styles.css по имени, например '--forest'
function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}


/* ---------------------------------------------------------------------------
   ПРИВЕТСТВИЕ

   Справа от названия компании — переключатель языка.
   В плашках под заголовком сверху идёт название, снизу — уточнение.
   --------------------------------------------------------------------------- */

function renderHero() {
  var d = T().hero;
  var s = DATA.shared;

  var langs = LANGS.map(function (code) {
    var on = code === LANG ? ' on' : '';
    return '<button class="lg' + on + '" data-lang="' + code + '" type="button">' +
           esc(DATA[code].langName) + '</button>';
  }).join('');

  var facts = d.facts.map(function (f) {
    return '<div><b>' + esc(f.title) + '</b><span>' + esc(f.note) + '</span></div>';
  }).join('');

  block('hero').innerHTML =
    '<div class="top">' +
      '<div class="logo"><span class="m">' + esc(s.logo) + '</span>' +
      '<b>' + esc(s.brand) + '</b></div>' +
      '<div class="langs">' + langs + '</div>' +
    '</div>' +
    '<h1>' + esc(d.heading) + '<span>' + esc(d.headingAccent) + '</span></h1>' +
    '<p class="lede">' + esc(d.text) + '</p>' +
    '<div class="strip">' + facts + '</div>';
}


/* ---------------------------------------------------------------------------
   КУРСЫ
   --------------------------------------------------------------------------- */

function renderCourses() {
  var d = T().courses;

  var rows = d.items.map(function (c) {
    var chips = c.chips.map(function (chip) {
      return '<span class="chip">' + esc(chip) + '</span>';
    }).join('');

    var program = c.program.map(function (topic) {
      return '<li>' + esc(topic) + '</li>';
    }).join('');

    return '<button class="row" data-acc>' +
             '<span><span class="t">' + esc(c.title) + '</span>' +
             '<span class="s">' + esc(c.subtitle) + '</span></span>' +
             '<span class="n">' + esc(c.lessons) + '<small>' + esc(d.lessonsWord) + '</small></span>' +
             '<span class="pl">+</span>' +
           '</button>' +
           '<div class="body"><div class="in">' +
             '<p>' + esc(c.about) + '</p>' +
             '<div class="chips">' + chips + '</div>' +
             '<ul>' + program + '</ul>' +
           '</div></div>';
  }).join('');

  block('courses').innerHTML =
    '<span class="label">' + esc(d.label) + '</span>' +
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    '<div class="sheet">' +
      '<div class="sheet-head"><span>' + esc(d.headLeft) + '</span>' +
      '<span>' + esc(d.headRight) + '</span></div>' +
      rows +
    '</div>';
}


/* ---------------------------------------------------------------------------
   РАСПИСАНИЕ

   Свободные места убраны намеренно: цифры, которые обновляются вручную,
   со временем начинают врать, а это хуже, чем их отсутствие.
   --------------------------------------------------------------------------- */

function renderSchedule() {
  var d = T().schedule;

  var hours = d.hours.map(function (h) {
    return '<div>' + esc(h.days) + ' <span>' + esc(h.time) + '</span></div>';
  }).join('');

  // Сначала название занятия, время — справа, в фисташковой плашке
  var slots = d.slots.map(function (s) {
    return '<div class="slot">' +
             '<span class="tx">' + esc(s.title) +
             '<span>' + esc(s.subtitle) + '</span></span>' +
             '<span class="tm">' + esc(s.time) + '</span>' +
           '</div>';
  }).join('');

  block('schedule').innerHTML =
    '<span class="label">' + esc(d.label) + '</span>' +
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    '<div class="hours">' + hours + '</div>' +
    '<div class="sheet">' + slots + '</div>' +
    '<div class="note-card">' +
      '<span class="ic">' + esc(d.note.badge) + '</span>' +
      '<span><b>' + esc(d.note.title) + '</b>' +
      '<span>' + esc(d.note.text) + '</span></span>' +
    '</div>';
}


/* ---------------------------------------------------------------------------
   СТОИМОСТЬ
   --------------------------------------------------------------------------- */

function renderPrices() {
  var d = T().prices;
  var p = DATA.shared.prices;

  block('prices').innerHTML =
    '<span class="label">' + esc(d.label) + '</span>' +
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    '<div class="price-main">' +
      '<div class="cl">' + esc(d.groupCaption) + '</div>' +
      '<div class="amount">' + money(p.group) + ' <i>' + esc(d.currency) + '</i></div>' +
      '<div class="note">' + esc(d.groupNote) + '</div>' +
    '</div>' +
    '<div class="prow">' +
      '<div><b>' + esc(d.individualTitle) + '</b>' +
      '<small>' + esc(d.individualNote) + '</small></div>' +
      '<div class="v">' + money(p.individual) +
      '<span>' + esc(d.currency) + '</span></div>' +
    '</div>';
}


/* ---------------------------------------------------------------------------
   КОНТАКТЫ

   Имена и роли берутся из блока языка, телефоны — из общего блока shared,
   по порядку. Поэтому цену и номер достаточно поправить один раз.
   --------------------------------------------------------------------------- */

function renderContacts() {
  var d = T().contacts;

  var people = d.people.map(function (p, i) {
    var numbers = DATA.shared.phones[i] || [];

    var phones = numbers.map(function (phone) {
      return '<a class="tel" href="' + telHref(phone) + '">' +
             esc(phone) + ' <em>' + esc(d.callWord) + '</em></a>';
    }).join('');

    return '<div class="person">' +
             '<div class="who"><span class="av">' + esc(p.name.charAt(0)) + '</span>' +
             '<span><b>' + esc(p.name) + '</b>' +
             '<span>' + esc(p.role) + '</span></span></div>' +
             phones +
           '</div>';
  }).join('');

  // Подсказка про заявку — только если форма включена.
  // Ссылка прокручивает к ней, чтобы не искать глазами.
  var hint = DATA.settings.formUrl
    ? '<p class="hint">' + esc(d.formHint) +
      ' <button class="golink" type="button" data-goform>' + esc(d.formLink) + '</button></p>'
    : '';

  block('contacts').innerHTML =
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    hint +
    people;
}


/* ---------------------------------------------------------------------------
   ЗАЯВКА

   Форма показывается только тогда, когда в data.js заполнен адрес
   приёмника. Пока он пустой, блока на странице нет — лучше отсутствие
   формы, чем форма, которая молча теряет заявки.
   --------------------------------------------------------------------------- */

function renderForm() {
  var d = T().form;
  var host = block('form');
  if (!DATA.settings.formUrl) { host.hidden = true; return; }

  // Свой раскрывающийся список вместо <select>.
  // Системный список рисует не страница, а операционная система, и на телефоне
  // он открывается модальным окном поверх приложения. Оформить его нельзя.
  // Здесь та же механика, что у раскрывающихся курсов выше по странице.
  var chosen = d.courseOptions[0];

  var options = d.courseOptions.map(function (c, i) {
    return '<button class="pick-opt' + (i === 0 ? ' on' : '') + '" type="button" ' +
           'data-value="' + esc(c) + '">' + esc(c) + '</button>';
  }).join('');

  var arrow = '<svg class="pick-arrow" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">' +
              '<path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  var picker =
    '<div class="fld pick">' +
      '<span>' + esc(d.courseLabel) + '</span>' +
      '<input type="hidden" name="course" value="' + esc(chosen) + '">' +
      '<button class="pick-head" type="button" aria-expanded="false">' +
        '<span class="pick-val">' + esc(chosen) + '</span>' + arrow +
      '</button>' +
      '<div class="pick-body"><div class="pick-in">' + options + '</div></div>' +
    '</div>';

  host.hidden = false;
  host.innerHTML =
    '<span class="label">' + esc(d.label) + '</span>' +
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    '<form class="lead" novalidate>' +
      '<label class="fld" data-for="name">' +
        '<span>' + esc(d.nameLabel) + '</span>' +
        '<input name="name" type="text" autocomplete="name" placeholder="' + esc(d.namePlaceholder) + '">' +
      '</label>' +
      '<label class="fld" data-for="phone">' +
        '<span>' + esc(d.phoneLabel) + '</span>' +
        '<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="' + esc(d.phonePlaceholder) + '">' +
      '</label>' +
      picker +
      // Поле-ловушка: человек его не видит, робот заполняет и выдаёт себя
      '<input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="send" type="submit">' + esc(d.button) + '</button>' +
    '</form>';
}

/* ---------------------------------------------------------------------------
   РАСКРЫВАЮЩИЙСЯ ВЫБОР КУРСА

   Заменяет системный список. Выбранное значение хранится в скрытом поле
   с именем course — поэтому отправка формы работает ровно так же,
   как работала с <select>, менять там ничего не пришлось.
   --------------------------------------------------------------------------- */

function openPick(pick) {
  pick.classList.add('open');
  pick.querySelector('.pick-head').setAttribute('aria-expanded', 'true');
}

function closePick(pick) {
  pick.classList.remove('open');
  pick.querySelector('.pick-head').setAttribute('aria-expanded', 'false');
}

function setupPicker() {
  var pick = document.querySelector('.pick');
  if (!pick) return;

  pick.querySelector('.pick-head').addEventListener('click', function () {
    haptic('light');
    if (pick.classList.contains('open')) closePick(pick); else openPick(pick);
  });

  pick.querySelectorAll('.pick-opt').forEach(function (option) {
    option.addEventListener('click', function () {
      var value = option.getAttribute('data-value');

      pick.querySelector('input[name="course"]').value = value;
      pick.querySelector('.pick-val').textContent = value;

      pick.querySelectorAll('.pick-opt').forEach(function (o) { o.classList.remove('on'); });
      option.classList.add('on');

      haptic('light');
      closePick(pick);
    });
  });
}

// Закрытие по нажатию мимо списка и по клавише Esc.
// Вешается один раз при запуске: список каждый раз ищется заново,
// поэтому перерисовка страницы при смене языка ничего не ломает.
function setupPickerClosing() {
  document.addEventListener('click', function (event) {
    var open = document.querySelector('.pick.open');
    if (open && !open.contains(event.target)) closePick(open);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = document.querySelector('.pick.open');
    if (open) closePick(open);
  });
}


// Показывает подсказку под незаполненным полем
function markBad(form, fieldName, message) {
  var box = form.querySelector('[data-for="' + fieldName + '"]');
  if (!box) return;
  box.classList.add('bad');
  if (!box.querySelector('.err')) {
    var e = document.createElement('span');
    e.className = 'err';
    e.textContent = message;
    box.appendChild(e);
  }
}

function clearBad(form) {
  form.querySelectorAll('.fld.bad').forEach(function (box) {
    box.classList.remove('bad');
    var e = box.querySelector('.err');
    if (e) e.remove();
  });
}

function setupForm() {
  var host = block('form');
  var form = host.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var d = T().form;
    clearBad(form);

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var course = form.course.value;

    // Проверяем до отправки: пустая заявка бесполезна обеим сторонам
    var ok = true;
    if (name.length < 2) { markBad(form, 'name', d.needName); ok = false; }
    if (phone.replace(/\D/g, '').length < 7) { markBad(form, 'phone', d.needPhone); ok = false; }
    if (!ok) { haptic('medium'); return; }

    var button = form.querySelector('.send');
    button.disabled = true;
    button.textContent = d.sending;

    fetch(DATA.settings.formUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        phone: phone,
        course: course,
        lang: LANG,                      // на каком языке человек читал страницу
        company: form.company.value      // ловушка
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result && result.ok) { showSent(); } else { showFailed(); }
      })
      .catch(function () {
        // Сюда попадаем, когда интернета нет вовсе
        showFailed();
      });
  });
}

function showSent() {
  var d = T().form;
  haptic('medium');
  block('form').innerHTML =
    '<div class="res ok">' +
      '<div class="tick">✓</div>' +
      '<b>' + esc(d.okTitle) + '</b>' +
      '<p>' + esc(d.okText) + '</p>' +
    '</div>';
}

function showFailed() {
  var d = T().form;
  haptic('medium');
  // Заявка не ушла — человек не должен остаться ни с чем.
  // Показываем телефон: живой звонок надёжнее любой формы.
  block('form').innerHTML =
    '<div class="res no">' +
      '<b>' + esc(d.failTitle) + '</b>' +
      '<p>' + esc(d.failText) + '</p>' +
      '<a class="call" href="' + telHref(DATA.shared.callPhone) + '">' +
      esc(DATA.shared.callPhone) + '</a>' +
      '<button class="again" type="button">' + esc(d.retry) + '</button>' +
    '</div>';

  block('form').querySelector('.again').addEventListener('click', function () {
    renderForm();
    setupForm();
  });
}


/* ---------------------------------------------------------------------------
   НИЗ СТРАНИЦЫ

   В конце страницы — кнопка «Записаться на курс». Она не прилипает к экрану,
   а уезжает вместе с содержимым: человек дочитал до низа и видит, что делать
   дальше. По нажатию возвращает к контактам, где телефоны и ссылка на заявку.
   --------------------------------------------------------------------------- */

function renderCta() {
  block('cta').innerHTML =
    '<button class="cta" type="button" data-gocontacts>' +
    esc(T().signupButton) + '</button>';
}

// Прокручивает к блоку контактов
function goToContacts() {
  haptic('medium');
  var host = block('contacts');
  if (host) host.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFooter() {
  var f = DATA.shared.footer;
  if (!f) { block('footer').innerHTML = ''; return; }

  block('footer').innerHTML =
    esc(f.credit) + ' ' +
    '<a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.handle) + '</a>' +
    ' | ' + esc(f.version);
}

// Внешние ссылки внутри мини-приложения нужно открывать командой Telegram,
// иначе обычная ссылка просто ничего не сделает.
// Для адресов t.me команда одна, для обычных сайтов — другая.
function setupFooterLink() {
  var link = block('footer').querySelector('a');
  if (!link) return;

  link.addEventListener('click', function (event) {
    var tg = telegram();
    if (!tg) return;              // обычный браузер — работает как обычная ссылка
    event.preventDefault();

    if (link.href.indexOf('t.me/') !== -1) {
      tgTry(function () { tg.openTelegramLink(link.href); });
    } else {
      tgTry(function () { tg.openLink(link.href); });
    }
  });
}

// Прокручивает к форме и ставит курсор в первое поле.
// Одно и то же нужно кнопке внизу и ссылке в контактах.
function goToForm() {
  haptic('medium');
  var host = block('form');
  if (!host || host.hidden) return;

  host.scrollIntoView({ behavior: 'smooth', block: 'start' });

  var first = host.querySelector('input[name="name"]');
  if (first) {
    // Ждём конца прокрутки: если поставить курсор сразу,
    // телефон откроет клавиатуру и прокрутка собьётся
    setTimeout(function () { first.focus({ preventScroll: true }); }, 450);
  }
}

function setupFormLinks() {
  document.querySelectorAll('[data-goform]').forEach(function (el) {
    el.addEventListener('click', goToForm);
  });
  document.querySelectorAll('[data-gocontacts]').forEach(function (el) {
    el.addEventListener('click', goToContacts);
  });
}


/* ---------------------------------------------------------------------------
   СВЯЗЬ С TELEGRAM

   Страница живёт в двух местах сразу: внутри Telegram и в обычном браузере.
   Всё телеграмное собрано здесь и включается только тогда, когда Telegram
   действительно рядом.
   --------------------------------------------------------------------------- */

function telegram() {
  var tg = window.Telegram && window.Telegram.WebApp;
  if (!tg || !tg.platform || tg.platform === 'unknown') return null;
  return tg;
}

// Старые версии Telegram не знают новых команд и ругаются в ответ.
// Эта обёртка гасит такую ругань: не получилось — просто идём дальше.
function tgTry(action) {
  try { action(); } catch (e) { /* команда не поддерживается этой версией */ }
}

// Лёгкий отклик-вибрация. Работает только на телефоне внутри Telegram.
function haptic(strength) {
  var tg = telegram();
  if (!tg || !tg.HapticFeedback) return;
  tgTry(function () { tg.HapticFeedback.impactOccurred(strength); });
}

function setupTelegram() {
  var tg = telegram();
  if (!tg) return;            // обычный браузер — дальше ничего не делаем

  tg.ready();
  tg.expand();

  // Запрещаем закрывать приложение смахиванием вниз: страница длинная,
  // и человек легко закрыл бы её, пытаясь просто пролистать вверх
  tgTry(function () { tg.disableVerticalSwipes(); });

  // Красим рамку самого Telegram в фирменные цвета
  tgTry(function () { tg.setHeaderColor(cssColor('--forest')); });
  tgTry(function () { tg.setBackgroundColor(cssColor('--cream')); });

  // Встроенную кнопку Telegram не используем: постоянного действия внизу
  // экрана в этой версии нет, звонок и заявка живут в блоке контактов.
  tgTry(function () { tg.MainButton.hide(); });
}


/* ---------------------------------------------------------------------------
   РАСКРЫТИЕ КУРСОВ
   --------------------------------------------------------------------------- */

function setupAccordion() {
  document.querySelectorAll('[data-acc]').forEach(function (head) {
    head.addEventListener('click', function () {
      var body = head.nextElementSibling;
      var alreadyOpen = body.classList.contains('open');

      haptic('light');   // короткий отклик на раскрытие курса

      document.querySelectorAll('.body.open').forEach(function (x) {
        x.classList.remove('open');
        x.previousElementSibling.classList.remove('open');
      });

      if (!alreadyOpen) {
        body.classList.add('open');
        head.classList.add('open');
      }
    });
  });
}


/* ---------------------------------------------------------------------------
   ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА И ОТКЛИК НА ЗВОНОК
   --------------------------------------------------------------------------- */

function setupLangSwitch() {
  block('hero').querySelectorAll('[data-lang]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLang(button.getAttribute('data-lang'));
    });
  });
}

function setupHaptics() {
  document.querySelectorAll('.tel, .cta').forEach(function (link) {
    link.addEventListener('click', function () { haptic('medium'); });
  });
}


/* ---------------------------------------------------------------------------
   ЗАПУСК

   renderAll собирает всю страницу заново. Вызывается при открытии
   и каждый раз при смене языка.
   --------------------------------------------------------------------------- */

function renderAll() {
  renderHero();
  renderCourses();
  renderSchedule();
  renderPrices();
  renderContacts();
  renderForm();
  renderCta();
  renderFooter();

  // Обработчики вешаем после отрисовки: старые исчезли вместе
  // с заменённой разметкой, новые нужно привязать заново
  setupLangSwitch();
  setupAccordion();
  setupForm();
  setupPicker();
  setupFormLinks();
  setupFooterLink();
  setupHaptics();
}

LANG = pickLang();
document.documentElement.lang = DATA[LANG].htmlLang;
renderAll();
setupPickerClosing();
setupTelegram();
