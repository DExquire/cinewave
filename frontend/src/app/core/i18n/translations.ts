export type Locale = 'en' | 'ru' | 'de';

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'de', label: 'DE' },
];

type Dict = Record<string, string>;

const en: Dict = {
  'nav.home': 'Home',
  'nav.browse': 'Browse',
  'nav.mylist': 'My List',
  'nav.search': 'Search shows…',
  'nav.theme_to_light': 'Switch to light theme',
  'nav.theme_to_dark': 'Switch to dark theme',
  'nav.menu': 'Toggle navigation menu',
  'nav.language': 'Language',

  'home.kicker': 'Trending now',
  'home.view': 'View details',
  'home.add': '+ My List',
  'home.added': '✓ In My List',
  'home.row.trending': 'Trending Now',
  'home.row.classics': 'Modern Classics',
  'home.row.toprated': 'Top Rated',
  'home.row.premiered': 'Newly Premiered',
  'home.row.airing': 'Airing Now',

  'browse.title': 'Browse Shows',
  'browse.all': 'All',
  'browse.popular': 'Popular',
  'browse.toprated': 'Top Rated',
  'browse.newest': 'Newest',
  'browse.empty': 'No shows match this filter.',
  'browse.more': 'Load more',
  'browse.loading': 'Loading…',

  'search.title': 'Search',
  'search.results': 'Results for',
  'search.found': 'titles found',
  'search.none': 'No shows found. Try another title.',
  'search.prompt': 'Type in the search bar above to find a show.',

  'details.synopsis_none': 'No synopsis available.',
  'details.add': '+ Add to My List',
  'details.added': '✓ In My List',
  'details.network': 'Network',
  'details.status': 'Status',
  'details.seasons': 'Seasons',
  'details.episodes': 'Episodes',
  'details.aired': 'Aired',
  'details.present': 'present',
  'details.cast': 'Top Billed Cast',
  'details.more': 'More Like This',

  'fav.title': 'My List',
  'fav.empty_title': 'Your list is empty',
  'fav.empty_text': 'Tap the heart on any poster to save shows you want to watch.',
  'fav.browse': 'Browse shows',

  'card.add': 'Add to My List',
  'card.remove': 'Remove from My List',

  'row.left': 'Scroll left',
  'row.right': 'Scroll right',

  'footer.data': 'Data & imagery courtesy of TVMaze.',
  'footer.built': 'Built with Angular · Spring Boot',
};

const ru: Dict = {
  'nav.home': 'Главная',
  'nav.browse': 'Каталог',
  'nav.mylist': 'Мой список',
  'nav.search': 'Поиск сериалов…',
  'nav.theme_to_light': 'Светлая тема',
  'nav.theme_to_dark': 'Тёмная тема',
  'nav.menu': 'Меню навигации',
  'nav.language': 'Язык',

  'home.kicker': 'В тренде',
  'home.view': 'Подробнее',
  'home.add': '+ В список',
  'home.added': '✓ В списке',
  'home.row.trending': 'Сейчас в тренде',
  'home.row.classics': 'Современная классика',
  'home.row.toprated': 'Высокий рейтинг',
  'home.row.premiered': 'Свежие премьеры',
  'home.row.airing': 'Сейчас в эфире',

  'browse.title': 'Каталог сериалов',
  'browse.all': 'Все',
  'browse.popular': 'Популярные',
  'browse.toprated': 'По рейтингу',
  'browse.newest': 'Новые',
  'browse.empty': 'Ничего не найдено по этому фильтру.',
  'browse.more': 'Показать ещё',
  'browse.loading': 'Загрузка…',

  'search.title': 'Поиск',
  'search.results': 'Результаты по запросу',
  'search.found': 'результатов',
  'search.none': 'Ничего не найдено. Попробуйте другой запрос.',
  'search.prompt': 'Введите запрос в строке поиска выше.',

  'details.synopsis_none': 'Описание отсутствует.',
  'details.add': '+ Добавить в список',
  'details.added': '✓ В списке',
  'details.network': 'Канал',
  'details.status': 'Статус',
  'details.seasons': 'Сезоны',
  'details.episodes': 'Серии',
  'details.aired': 'В эфире',
  'details.present': 'наст. время',
  'details.cast': 'Главные роли',
  'details.more': 'Похожее',

  'fav.title': 'Мой список',
  'fav.empty_title': 'Список пуст',
  'fav.empty_text': 'Нажмите на сердечко на любом постере, чтобы сохранить сериал.',
  'fav.browse': 'Перейти в каталог',

  'card.add': 'Добавить в список',
  'card.remove': 'Убрать из списка',

  'row.left': 'Прокрутить влево',
  'row.right': 'Прокрутить вправо',

  'footer.data': 'Данные и изображения предоставлены TVMaze.',
  'footer.built': 'Сделано на Angular · Spring Boot',
};

const de: Dict = {
  'nav.home': 'Start',
  'nav.browse': 'Entdecken',
  'nav.mylist': 'Meine Liste',
  'nav.search': 'Serien suchen…',
  'nav.theme_to_light': 'Helles Design',
  'nav.theme_to_dark': 'Dunkles Design',
  'nav.menu': 'Navigationsmenü',
  'nav.language': 'Sprache',

  'home.kicker': 'Im Trend',
  'home.view': 'Details ansehen',
  'home.add': '+ Meine Liste',
  'home.added': '✓ In Meiner Liste',
  'home.row.trending': 'Aktuell im Trend',
  'home.row.classics': 'Moderne Klassiker',
  'home.row.toprated': 'Bestbewertet',
  'home.row.premiered': 'Neu erschienen',
  'home.row.airing': 'Läuft gerade',

  'browse.title': 'Serien entdecken',
  'browse.all': 'Alle',
  'browse.popular': 'Beliebt',
  'browse.toprated': 'Bestbewertet',
  'browse.newest': 'Neueste',
  'browse.empty': 'Keine Serien für diesen Filter.',
  'browse.more': 'Mehr laden',
  'browse.loading': 'Lädt…',

  'search.title': 'Suche',
  'search.results': 'Ergebnisse für',
  'search.found': 'Titel gefunden',
  'search.none': 'Keine Serien gefunden. Anderen Titel versuchen.',
  'search.prompt': 'Oben in der Suchleiste tippen, um eine Serie zu finden.',

  'details.synopsis_none': 'Keine Beschreibung verfügbar.',
  'details.add': '+ Zur Liste hinzufügen',
  'details.added': '✓ In Meiner Liste',
  'details.network': 'Sender',
  'details.status': 'Status',
  'details.seasons': 'Staffeln',
  'details.episodes': 'Folgen',
  'details.aired': 'Ausgestrahlt',
  'details.present': 'heute',
  'details.cast': 'Hauptbesetzung',
  'details.more': 'Ähnliche Serien',

  'fav.title': 'Meine Liste',
  'fav.empty_title': 'Deine Liste ist leer',
  'fav.empty_text': 'Tippe auf das Herz eines Posters, um Serien zu speichern.',
  'fav.browse': 'Serien entdecken',

  'card.add': 'Zur Liste hinzufügen',
  'card.remove': 'Aus Liste entfernen',

  'row.left': 'Nach links scrollen',
  'row.right': 'Nach rechts scrollen',

  'footer.data': 'Daten & Bilder bereitgestellt von TVMaze.',
  'footer.built': 'Erstellt mit Angular · Spring Boot',
};

export const TRANSLATIONS: Record<Locale, Dict> = { en, ru, de };
