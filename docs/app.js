/* ============================================================================
   ПОВЕДЕНИЕ И СБОРКА СТРАНИЦЫ

   Этот файл берёт содержимое из data.js и расставляет его по пустым блокам
   в index.html. Плюс отвечает за раскрытие курсов по нажатию.

   Здесь текстов нет — если нужно поменять слово, цену или телефон,
   вам нужен файл data.js, а не этот.

   Открывать этот файл имеет смысл только тогда, когда нужно изменить
   само устройство страницы: добавить новый вид блока или поменять логику.
   ============================================================================ */


/* ---------------------------------------------------------------------------
   МАЛЕНЬКИЕ ПОМОЩНИКИ
   Три коротких правила, которыми пользуются все блоки ниже.
   --------------------------------------------------------------------------- */

// Находит на странице пустой блок по его подписи data-block из index.html
function block(name) {
  return document.querySelector('[data-block="' + name + '"]');
}

// Обезвреживает символы < > &, если они вдруг попадут в текст из data.js.
// Нужен для того, чтобы случайный символ в тексте не сломал вёрстку.
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Расставляет пробелы в разрядах: 100000 превращается в «100 000»
function money(number) {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Готовит номер для звонка: из «+998 91 354-11-28» делает «tel:+998913541128»
function telHref(phone) {
  return 'tel:' + String(phone).replace(/[^\d+]/g, '');
}

// Достаёт цвет из палитры styles.css по имени, например '--forest'.
// Нужен, чтобы кнопка Telegram красилась теми же цветами, что и страница:
// поменяли цвет в одном месте — сменился и там, и там.
function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}


/* ---------------------------------------------------------------------------
   ПРИВЕТСТВИЕ
   --------------------------------------------------------------------------- */

function renderHero() {
  var d = DATA.hero;

  var facts = d.facts.map(function (f) {
    return '<div><b>' + esc(f.value) + '</b><span>' +
           esc(f.line1) + '<br>' + esc(f.line2) + '</span></div>';
  }).join('');

  block('hero').innerHTML =
    '<div class="logo"><span class="m">' + esc(DATA.company.logo) + '</span>' +
    '<b>' + esc(DATA.company.name) + '</b></div>' +
    '<h1>' + esc(d.heading) + '<span>' + esc(d.headingAccent) + '</span></h1>' +
    '<p class="lede">' + esc(d.text) + '</p>' +
    '<div class="strip">' + facts + '</div>';
}


/* ---------------------------------------------------------------------------
   КУРСЫ
   Для каждого курса создаётся пара: кнопка-строка и скрытый блок с программой.
   --------------------------------------------------------------------------- */

function renderCourses() {
  var d = DATA.courses;

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
             '<span class="n">' + esc(c.lessons) + '<small>занятий</small></span>' +
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
   --------------------------------------------------------------------------- */

function renderSchedule() {
  var d = DATA.schedule;

  var hours = d.hours.map(function (h) {
    return '<div>' + esc(h.days) + ' <span>' + esc(h.time) + '</span></div>';
  }).join('');

  var slots = d.slots.map(function (s) {
    // free: false — строка притушена, а метка становится серой
    var slotClass = s.free ? 'slot' : 'slot off';
    var tagClass = s.free ? 'tag' : 'tag no';

    return '<div class="' + slotClass + '">' +
             '<span class="bar"></span>' +
             '<span class="tm">' + esc(s.time) + '</span>' +
             '<span class="tx">' + esc(s.title) +
             '<span>' + esc(s.subtitle) + '</span></span>' +
             '<span class="' + tagClass + '">' + esc(s.seats) + '</span>' +
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
  var d = DATA.prices;

  block('prices').innerHTML =
    '<span class="label">' + esc(d.label) + '</span>' +
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    '<div class="price-main">' +
      '<div class="cl">' + esc(d.groupCaption) + '</div>' +
      '<div class="amount">' + money(d.group) + ' <i>' + esc(d.currency) + '</i></div>' +
      '<div class="note">' + esc(d.groupNote) + '</div>' +
    '</div>' +
    '<div class="prow">' +
      '<div><b>' + esc(d.individualTitle) + '</b>' +
      '<small>' + esc(d.individualNote) + '</small></div>' +
      '<div class="v">' + money(d.individual) +
      '<span>' + esc(d.currency) + '</span></div>' +
    '</div>';
}


/* ---------------------------------------------------------------------------
   КОНТАКТЫ
   Буква в квадратике — это первая буква имени, отдельно её задавать не нужно.
   --------------------------------------------------------------------------- */

function renderContacts() {
  var d = DATA.contacts;

  var people = d.people.map(function (p) {
    var phones = p.phones.map(function (phone) {
      return '<a class="tel" href="' + telHref(phone) + '">' +
             esc(phone) + ' <em>позвонить</em></a>';
    }).join('');

    return '<div class="person">' +
             '<div class="who"><span class="av">' + esc(p.name.charAt(0)) + '</span>' +
             '<span><b>' + esc(p.name) + '</b>' +
             '<span>' + esc(p.role) + '</span></span></div>' +
             phones +
           '</div>';
  }).join('');

  block('contacts').innerHTML =
    '<h2>' + esc(d.title) + '</h2>' +
    '<p class="desc">' + esc(d.desc) + '</p>' +
    people;
}


/* ---------------------------------------------------------------------------
   НИЗ СТРАНИЦЫ И КНОПКА
   --------------------------------------------------------------------------- */

function renderFooter() {
  block('footer').innerHTML = esc(DATA.footer);
}

function renderCta() {
  block('cta').innerHTML =
    '<a class="cta" href="' + telHref(DATA.cta.phone) + '">' +
    esc(DATA.cta.text) + '</a>';
}


/* ---------------------------------------------------------------------------
   СВЯЗЬ С TELEGRAM

   Страница живёт в двух местах сразу: внутри Telegram и в обычном браузере.
   Всё телеграмное собрано здесь и включается только тогда, когда Telegram
   действительно рядом. В браузере эти функции молча ничего не делают,
   и страница работает ровно так же, как работала до этого этапа.
   --------------------------------------------------------------------------- */

// Возвращает Telegram, если страница открыта внутри мессенджера, иначе null.
// Проверка по platform, а не по наличию библиотеки: библиотека загрузится
// и в обычном браузере, но платформа там будет 'unknown'.
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
// Вызываем редко и осознанно: вибрация на каждое касание раздражает.
function haptic(strength) {
  var tg = telegram();
  if (!tg || !tg.HapticFeedback) return;
  tgTry(function () { tg.HapticFeedback.impactOccurred(strength); });
}

function setupTelegram() {
  var tg = telegram();
  if (!tg) return;            // обычный браузер — дальше ничего не делаем

  // Сообщаем мессенджеру, что страница загрузилась и её можно показывать
  tg.ready();

  // Открываем окно сразу во весь экран, а не наполовину
  tg.expand();

  // Запрещаем закрывать приложение смахиванием вниз: страница длинная,
  // и человек легко закрыл бы её, пытаясь просто пролистать вверх
  tgTry(function () { tg.disableVerticalSwipes(); });

  // Красим рамку самого Telegram в фирменные цвета, чтобы верх и низ
  // мессенджера не спорили с оформлением страницы
  tgTry(function () { tg.setHeaderColor(cssColor('--forest')); });
  tgTry(function () { tg.setBackgroundColor(cssColor('--cream')); });

  // Прячем нашу нижнюю кнопку и показываем встроенную кнопку Telegram
  document.body.classList.add('tg-native-button');

  tgTry(function () {
    tg.MainButton.setParams({
      text: DATA.cta.text,
      color: cssColor('--forest'),
      text_color: cssColor('--pist'),
      is_visible: true
    });
  });

  tg.MainButton.onClick(function () {
    haptic('medium');
    window.location.href = telHref(DATA.cta.phone);
  });
}


/* ---------------------------------------------------------------------------
   РАСКРЫТИЕ КУРСОВ
   Нажали на строку: все открытые закрываются, нажатая раскрывается.
   Повторное нажатие по той же строке — закрывает её.
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
   ОТКЛИК НА ЗВОНОК
   Вибрация посильнее в момент, когда человек нажимает на номер.
   Всего в приложении три места с вибрацией: раскрытие курса, нажатие
   на телефон и нажатие на кнопку внизу. Больше не нужно.
   --------------------------------------------------------------------------- */

function setupHaptics() {
  document.querySelectorAll('.tel, .cta').forEach(function (link) {
    link.addEventListener('click', function () { haptic('medium'); });
  });
}


/* ---------------------------------------------------------------------------
   ЗАПУСК
   Порядок вызовов совпадает с порядком блоков на странице.
   --------------------------------------------------------------------------- */

renderHero();
renderCourses();
renderSchedule();
renderPrices();
renderContacts();
renderFooter();
renderCta();
setupAccordion();
setupHaptics();
setupTelegram();
