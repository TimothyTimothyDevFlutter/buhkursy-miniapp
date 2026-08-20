/* ============================================================================
   СКРИПТ-ПРИЁМНИК ЗАЯВОК

   Живёт не на сайте, а в Cloudflare Workers. Задача одна: принять заявку
   от страницы и переслать её вам сообщением в Telegram.

   Зачем нужен посредник. Чтобы отправить сообщение, нужен токен бота.
   Страница публична — её файлы лежат на GitHub, а исходник открывается
   в браузере двумя нажатиями. Токен там увидит кто угодно, и бот начнёт
   подчиняться чужому человеку. Поэтому токен лежит здесь: этот код
   выполняется на стороне Cloudflare и никому не показывается.

   Токен в этом файле НЕ ЗАПИСАН. Он задаётся в панели Cloudflare
   как переменная BOT_TOKEN — инструкция в файле ЗАЯВКИ-НАСТРОЙКА.md.
   ============================================================================ */

export default {
  async fetch(request, env) {

    // Разрешаем странице обращаться к этому адресу
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Браузер сначала спрашивает разрешение — отвечаем «можно»
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (request.method !== 'POST') {
      return answer({ ok: false, error: 'Сюда нужно отправлять заявку, а не открывать в браузере' }, 405, cors);
    }

    // --- читаем заявку ---
    let data;
    try {
      data = await request.json();
    } catch (e) {
      return answer({ ok: false, error: 'Не удалось прочитать заявку' }, 400, cors);
    }

    const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
    const name = clean(data.name, 80);
    const phone = clean(data.phone, 40);
    const course = clean(data.course, 80);
    const lang = clean(data.lang, 5);   // на каком языке человек читал страницу

    // --- ловушка для роботов ---
    // На странице есть невидимое поле. Человек его не заполнит, а робот,
    // который заполняет всё подряд, — заполнит. Отвечаем «принято»,
    // но никуда не отправляем: пусть считает, что сработало.
    if (clean(data.company, 100) !== '') {
      return answer({ ok: true }, 200, cors);
    }

    // --- проверки ---
    if (name.length < 2) {
      return answer({ ok: false, error: 'Не заполнено имя' }, 400, cors);
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) {
      return answer({ ok: false, error: 'Телефон выглядит неполным' }, 400, cors);
    }

    // --- проверяем настройку ---
    if (!env.BOT_TOKEN || !env.CHAT_ID) {
      return answer({ ok: false, error: 'Приёмник заявок не настроен' }, 500, cors);
    }

    // --- собираем сообщение ---
    const when = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Tashkent',
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    // Язык подсказывает, на каком языке перезванивать.
    // Если страница старая и языка не прислала — строки просто не будет.
    const langNames = { ru: 'русский', uz: 'узбекский', en: 'английский' };
    const langLine = langNames[lang] ? 'Язык: ' + langNames[lang] + '\n' : '';

    const text =
      '🔔 Новая заявка\n\n' +
      'Имя: ' + name + '\n' +
      'Телефон: ' + phone + '\n' +
      'Курс: ' + (course || 'не указан') + '\n' +
      langLine + '\n' +
      'Оставлена: ' + when;

    // --- отправляем в Telegram ---
    try {
      const res = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text: text,
          disable_web_page_preview: true
        })
      });

      const result = await res.json();

      if (!result.ok) {
        // Самая частая причина: владелец не нажал «Запустить» у своего бота.
        // Telegram запрещает боту писать первым.
        console.log('Telegram отказал:', result.description);
        return answer({ ok: false, error: 'Telegram не принял сообщение' }, 502, cors);
      }

      return answer({ ok: true }, 200, cors);

    } catch (e) {
      console.log('Сбой при отправке:', e.message);
      return answer({ ok: false, error: 'Не удалось связаться с Telegram' }, 502, cors);
    }
  }
};

function answer(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors)
  });
}
