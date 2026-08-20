/* ============================================================================
   СОДЕРЖИМОЕ ПРИЛОЖЕНИЯ

   Это единственный файл, который вам нужно открывать регулярно.
   Здесь лежат все тексты, цены, телефоны и расписание.
   Ни цветов, ни разметки тут нет — они в styles.css.

   ----------------------------------------------------------------
   КАК УСТРОЕН ФАЙЛ

   Он делится на три части:

   1. settings — технические настройки. Трогать почти не нужно.
   2. shared   — то, что одинаково на обоих языках: цены и телефоны.
                 Меняете цену один раз — меняется везде.
   3. ru / uz  — все слова. Русский блок и узбекский блок устроены
                 совершенно одинаково, строка в строку.

   ----------------------------------------------------------------
   ГЛАВНОЕ ПРАВИЛО ПРО ДВА ЯЗЫКА

   Правите текст — правьте в ОБОИХ блоках, ru и uz.
   Если поправить только русский, узбекская версия останется старой.
   Страница при этом не сломается, просто покажет разное.

   Цены и телефоны так дублировать не нужно: они лежат в shared,
   один раз на оба языка.

   ----------------------------------------------------------------
   КАК ЭТО ЧИТАТЬ

   Строка вида      title: 'Бухгалтер с нуля',
   означает         поле «title» (название) равно «Бухгалтер с нуля».

   Менять нужно только то, что стоит СПРАВА от двоеточия, внутри кавычек.
   Слова слева (title, lessons, phones) — служебные имена, их читает
   только программа. Переименуете — блок перестанет отображаться.

   ----------------------------------------------------------------
   ТРИ ПРАВИЛА, ЧТОБЫ НИЧЕГО НЕ СЛОМАТЬ

   1. Кавычки всегда парные. Открыли — закройте.
   2. После каждого пункта в списке стоит запятая.
   3. Внутри текста апостроф ставить нельзя — он оборвёт строку.
      В узбекских словах вместо апострофа уже стоит «ʼ»: qoʼngʼiroq.
      Так и пишите.

   Если страница вдруг стала пустой — почти всегда потеряна запятая
   или кавычка. Нажмите F12 в браузере: там будет написано, в какой строке.
   ============================================================================ */

const DATA = {

  /* ==========================================================================
     1. НАСТРОЙКИ
     ========================================================================== */
  settings: {
    // Адрес скрипта-приёмника заявок из Cloudflare.
    // Пустая строка — форма на странице не показывается.
    formUrl: 'https://zayavki.skinnygrap.workers.dev',

    // С какого языка начинать, если у человека в Telegram не узбекский
    defaultLang: 'ru'
  },

  /* ==========================================================================
     2. ОДИНАКОВОЕ НА ОБОИХ ЯЗЫКАХ
     ========================================================================== */
  shared: {
    logo: 'Σ',                    // один символ в фисташковом квадратике
    brand: 'Счёт и Порядок',      // название компании, не переводится

    // Цены. Пишутся слитно, без пробелов: 100000, а не 100 000.
    // Пробелы в разрядах страница расставит сама.
    prices: {
      group: 100000,
      individual: 300000
    },

    // Телефоны. Пишите так, как удобно читать: пробелы и дефисы
    // страница уберёт сама, когда будет набирать номер.
    // Порядок людей здесь и в блоках ru/uz должен совпадать.
    phones: [
      ['+998 91 354-11-28'],
      ['+998 97 259-00-85', '+998 97 253-00-85']
    ],

    // Номер для кнопки «Позвонить» внизу экрана
    callPhone: '+998 91 354-11-28'
  },

  /* ==========================================================================
     3. РУССКИЙ
     ========================================================================== */
  ru: {
    langName: 'RU',
    htmlLang: 'ru',

    hero: {
      heading: 'Разберётесь в цифрах',
      headingAccent: 'за одну весну.',
      text: 'Курсы бухгалтерии для новичков и для тех, кто устал бояться отчётности.',

      // Три плашки под заголовком.
      // title — крупная строка сверху, note — подпись под ней.
      facts: [
        { title: 'Курсы на выбор', note: '2 курса' },
        { title: 'Одно занятие',   note: '90 минут' },
        { title: 'В группе',       note: 'до 6 человек' }
      ]
    },

    courses: {
      label: 'Программы',
      title: 'Что можно изучать',
      desc: 'Курсы идут параллельно — начать можно с любого. Нажмите на строку, чтобы раскрыть программу.',
      headLeft: 'Курс',
      headRight: 'Занятий',
      lessonsWord: 'занятий',        // мелкая подпись под числом в строке курса
      items: [
        {
          title: 'Бухгалтер с нуля',
          subtitle: 'для смены профессии',
          lessons: 36,
          about: 'Полный путь: от первого документа до сданного отчёта. Подойдёт, если вы никогда не работали с бухгалтерией.',
          chips: ['с нуля', 'много практики'],
          program: [
            'Первичные документы и счета',
            'Двойная запись: дебет и кредит',
            'Учёт кассы и банка',
            'Итоговая практика на реальных кейсах'
          ]
        },
        {
          title: '1С: Бухгалтерия 8.3',
          subtitle: 'практика в программе',
          lessons: 18,
          about: 'Каждое занятие проходит за компьютером, внутри самой программы. Без пересказа справки.',
          chips: ['за компьютером', 'по документам'],
          program: [
            'Настройка организации с нуля',
            'Поступление, продажа, оплата',
            'Закрытие месяца',
            'Формирование отчётов'
          ]
        }
      ]
    },

    schedule: {
      label: 'Расписание',
      title: 'Как идёт день',
      desc: 'Три группы каждый будний день, между ними — время на консультации.',
      hours: [
        { days: 'Пн — Пт', time: '09:00 — 20:00' },
        { days: 'Суббота', time: '10:00 — 16:00' },
        { days: 'Вс',      time: 'выходной' }
      ],
      slots: [
        { time: '09:30', title: 'Утренняя группа', subtitle: 'Бухгалтер с нуля' },
        { time: '11:15', title: 'Консультации',    subtitle: 'Бесплатно, по телефону' },
        { time: '13:00', title: 'Дневная группа',  subtitle: '1С: Бухгалтерия 8.3' },
        { time: '15:00', title: 'Индивидуально',   subtitle: 'Один на один' },
        { time: '18:30', title: 'Вечерняя группа', subtitle: '1С: Бухгалтерия 8.3' }
      ],
      note: {
        badge: '10',
        title: 'Опоздание',
        text: 'До 10 минут мы вас ждём.'
      }
    },

    prices: {
      label: 'Стоимость',
      title: 'Сколько стоит занятие',
      desc: 'Одна цена, без абонементов и скрытых условий.',
      currency: 'сум',
      groupCaption: 'Занятие в группе',
      groupNote: '90 минут · группа до 6 человек',
      individualTitle: 'Индивидуально',
      individualNote: 'один на один с преподавателем'
    },

    contacts: {
      title: 'Контакты',
      desc: 'Позвоните — расскажем о курсе и запишем в группу.',
      callWord: 'позвонить',         // мелкая подпись справа от номера
      // Порядок должен совпадать с shared.phones
      people: [
        { name: 'Элина',              role: 'запись на курсы' },
        { name: 'Зохиджон Сайдуллаев', role: 'вопросы по обучению' }
      ]
    },

    form: {
      label: 'Заявка',
      title: 'Не любите звонить?',
      desc: 'Оставьте номер — перезвоним и всё расскажем.',
      nameLabel: 'Как вас зовут',
      namePlaceholder: 'Дилноза',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+998 90 123-45-67',
      courseLabel: 'Какой курс интересует',
      courseOptions: ['Бухгалтер с нуля', '1С: Бухгалтерия 8.3', 'Пока не решил'],
      button: 'Отправить заявку',
      sending: 'Отправляем…',
      okTitle: 'Заявка отправлена',
      okText: 'Перезвоним в рабочее время: Пн — Пт с 09:00 до 20:00.',
      failTitle: 'Не получилось отправить',
      failText: 'Похоже, пропал интернет. Попробуйте ещё раз или позвоните — так быстрее:',
      retry: 'Попробовать снова',
      needName: 'Впишите имя',
      needPhone: 'Впишите телефон — без него мы не сможем перезвонить'
    },

    // Две кнопки внизу экрана
    actions: {
      call: 'Позвонить и проконсультироваться',
      signup: 'Записаться на курс'
    },

    footer: 'Прототип · версия 2'
  },

  /* ==========================================================================
     4. УЗБЕКСКИЙ

     Перевод сделан мной, не носителем языка. Покажите его тому,
     кто говорит по-узбекски, и поправьте, что режет слух.
     Структура блока совпадает с русским строка в строку.
     ========================================================================== */
  uz: {
    langName: 'UZ',
    htmlLang: 'uz',

    hero: {
      heading: 'Raqamlarni tushunasiz',
      headingAccent: 'bir bahorda.',
      text: 'Buxgalteriya kurslari — yangi boshlovchilar va hisobotdan qoʼrqishdan charchaganlar uchun.',
      facts: [
        { title: 'Tanlov uchun kurslar', note: '2 ta kurs' },
        { title: 'Bitta dars',           note: '90 daqiqa' },
        { title: 'Guruhda',              note: '6 kishigacha' }
      ]
    },

    courses: {
      label: 'Dasturlar',
      title: 'Nimani oʼrganish mumkin',
      desc: 'Kurslar parallel ravishda oʼtadi — istalganidan boshlash mumkin. Dasturni ochish uchun qatorni bosing.',
      headLeft: 'Kurs',
      headRight: 'Darslar',
      lessonsWord: 'dars',
      items: [
        {
          title: 'Noldan buxgalter',
          subtitle: 'kasbni oʼzgartirish uchun',
          lessons: 36,
          about: 'Toʼliq yoʼl: birinchi hujjatdan topshirilgan hisobotgacha. Agar siz hech qachon buxgalteriya bilan ishlamagan boʼlsangiz, mos keladi.',
          chips: ['noldan', 'koʼp amaliyot'],
          program: [
            'Birlamchi hujjatlar va hisoblar',
            'Ikki yoqlama yozuv: debet va kredit',
            'Kassa va bank hisobi',
            'Real keyslarda yakuniy amaliyot'
          ]
        },
        {
          title: '1C: Buxgalteriya 8.3',
          subtitle: 'dasturda amaliyot',
          lessons: 18,
          about: 'Har bir dars kompyuterda, dasturning oʼzida oʼtadi. Maʼlumotnomani qayta aytib berishsiz.',
          chips: ['kompyuterda', 'hujjatlar boʼyicha'],
          program: [
            'Tashkilotni noldan sozlash',
            'Kirim, sotuv, toʼlov',
            'Oyni yopish',
            'Hisobotlarni shakllantirish'
          ]
        }
      ]
    },

    schedule: {
      label: 'Jadval',
      title: 'Kun qanday oʼtadi',
      desc: 'Har ish kuni uchta guruh, ular orasida — maslahat uchun vaqt.',
      hours: [
        { days: 'Du — Ju',  time: '09:00 — 20:00' },
        { days: 'Shanba',   time: '10:00 — 16:00' },
        { days: 'Yakshanba', time: 'dam olish' }
      ],
      slots: [
        { time: '09:30', title: 'Ertalabki guruh', subtitle: 'Noldan buxgalter' },
        { time: '11:15', title: 'Maslahatlar',     subtitle: 'Bepul, telefon orqali' },
        { time: '13:00', title: 'Kunduzgi guruh',  subtitle: '1C: Buxgalteriya 8.3' },
        { time: '15:00', title: 'Individual',      subtitle: 'Yakkama-yakka' },
        { time: '18:30', title: 'Kechki guruh',    subtitle: '1C: Buxgalteriya 8.3' }
      ],
      note: {
        badge: '10',
        title: 'Kechikish',
        text: '10 daqiqagacha sizni kutamiz.'
      }
    },

    prices: {
      label: 'Narxi',
      title: 'Bitta dars qancha turadi',
      desc: 'Yagona narx, abonement va yashirin shartlarsiz.',
      currency: 'soʼm',
      groupCaption: 'Guruhdagi dars',
      groupNote: '90 daqiqa · guruhda 6 kishigacha',
      individualTitle: 'Individual',
      individualNote: 'oʼqituvchi bilan yakkama-yakka'
    },

    contacts: {
      title: 'Aloqa',
      desc: 'Qoʼngʼiroq qiling — kurs haqida aytamiz va guruhga yozamiz.',
      callWord: 'qoʼngʼiroq',
      people: [
        { name: 'Elina',              role: 'kurslarga yozilish' },
        { name: 'Zohidjon Saydullayev', role: 'oʼqish boʼyicha savollar' }
      ]
    },

    form: {
      label: 'Ariza',
      title: 'Qoʼngʼiroq qilishni yoqtirmaysizmi?',
      desc: 'Raqamingizni qoldiring — oʼzimiz qoʼngʼiroq qilamiz va hammasini aytamiz.',
      nameLabel: 'Ismingiz',
      namePlaceholder: 'Dilnoza',
      phoneLabel: 'Telefon',
      phonePlaceholder: '+998 90 123-45-67',
      courseLabel: 'Qaysi kurs qiziqtiradi',
      courseOptions: ['Noldan buxgalter', '1C: Buxgalteriya 8.3', 'Hali hal qilmadim'],
      button: 'Arizani yuborish',
      sending: 'Yuborilmoqda…',
      okTitle: 'Ariza yuborildi',
      okText: 'Ish vaqtida qoʼngʼiroq qilamiz: Du — Ju, 09:00 dan 20:00 gacha.',
      failTitle: 'Yuborib boʼlmadi',
      failText: 'Internet uzilganga oʼxshaydi. Qayta urinib koʼring yoki qoʼngʼiroq qiling — bu tezroq:',
      retry: 'Qayta urinish',
      needName: 'Ismingizni yozing',
      needPhone: 'Telefon raqamini yozing — usiz qoʼngʼiroq qila olmaymiz'
    },

    actions: {
      call: 'Qoʼngʼiroq qilib maslahat olish',
      signup: 'Kursga yozilish'
    },

    footer: 'Prototip · 2-versiya'
  }

};
