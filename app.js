const BASE_PRICE = 1_200_000;
const INCLUDED_SPOTS = 5;
const EXTRA_SPOT_SURCHARGE = 100_000;
const MIN_ROUTE_PLACES = 5;
const MAX_HOURS_PER_DAY = 14;
const TRAVEL_SAME_REGION_HOURS = 0.75;
const TRAVEL_DIFF_REGION_HOURS = 2;

const REGION_LABELS = {
  bali: "Бали",
  nusa_penida: "Нуса Пенида",
  java: "Ява",
  other: "Другое",
};

const CATEGORY_LABELS = {
  all: "Все",
  temples: "Храмы",
  waterfalls: "Водопады",
  terraces: "Террасы",
  viewpoints: "Смотровые",
  beaches: "Пляжи",
  food: "Кафе",
  animals: "Животные",
  relax: "Релакс",
};
const SELECTABLE_CATEGORIES = Object.keys(CATEGORY_LABELS).filter(
  (key) => key !== "all"
);

const CATEGORY_IMAGES = {
  temples:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  waterfalls:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  terraces:
    "https://images.unsplash.com/photo-1598019138951-3261429d6fce?auto=format&fit=crop&w=1200&q=80",
  viewpoints:
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  beaches:
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  food:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  animals:
    "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?auto=format&fit=crop&w=1200&q=80",
  relax:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_CATALOG_SPOTS = [
  {
    name: "Uluwatu Temple",
    region: "bali",
    category: "temples",
    duration: 2,
    ticket: 50000,
    description: "Храм на скале и один из лучших закатов на Бали.",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80",
    tip: "Лучшее время: 16:30-18:30.",
  },
  {
    name: "Tanah Lot",
    region: "bali",
    category: "temples",
    duration: 1.5,
    ticket: 60000,
    description: "Знаменитый храм в океане, идеален для фото на закате.",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    tip: "Закладывайте время на очередь к фототочкам.",
  },
  {
    name: "Tirta Empul",
    region: "bali",
    category: "temples",
    duration: 2,
    ticket: 50000,
    description: "Священные источники и ритуал очищения.",
    image:
      "https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=1200&q=80",
    tip: "Берите саронг, на месте тоже можно арендовать.",
  },
  {
    name: "Sekumpul Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 2.2,
    ticket: 125000,
    description: "Каскад водопадов в джунглях, один из самых впечатляющих.",
    image:
      "https://images.unsplash.com/photo-1595069906974-f8f3e0c9f916?auto=format&fit=crop&w=1200&q=80",
    tip: "Нужна удобная нескользящая обувь.",
  },
  {
    name: "Aling-Aling Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 125000,
    description: "Прыжки, горки и купание в природных бассейнах.",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    tip: "Активности только с локальным инструктором.",
  },
  {
    name: "Tegenungan Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.2,
    ticket: 30000,
    description: "Быстрый и удобный водопад рядом с Убудом.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    tip: "Утром меньше людей.",
  },
  {
    name: "Tegalalang Rice Terrace",
    region: "bali",
    category: "terraces",
    duration: 2,
    ticket: 25000,
    description: "Легендарные рисовые террасы и фотозоны.",
    image:
      "https://images.unsplash.com/photo-1598019138951-3261429d6fce?auto=format&fit=crop&w=1200&q=80",
    tip: "Лучший свет до 10:00.",
  },
  {
    name: "Jatiluwih Rice Terrace",
    region: "bali",
    category: "terraces",
    duration: 2,
    ticket: 50000,
    description: "Большие террасы ЮНЕСКО и спокойные маршруты для прогулки.",
    image:
      "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1200&q=80",
    tip: "Берите головной убор от солнца.",
  },
  {
    name: "Puncak Wanagiri",
    region: "bali",
    category: "viewpoints",
    duration: 1,
    ticket: 50000,
    description: "Панорамные качели и виды на озера Bratan/Tamblingan.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    tip: "На высоте может быть прохладно.",
  },
  {
    name: "Bali Handara Gate",
    region: "bali",
    category: "viewpoints",
    duration: 0.5,
    ticket: 30000,
    description: "Иконические ворота для симметричных фото.",
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    tip: "Приезжайте пораньше, чтобы избежать очередей.",
  },
  {
    name: "Kelingking Beach Viewpoint",
    region: "nusa_penida",
    category: "viewpoints",
    duration: 1.4,
    ticket: 10000,
    description: "Самая известная смотровая Нуса Пениды (T-Rex cliff).",
    image:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80",
    tip: "Локация популярная, лучше ехать утром.",
  },
  {
    name: "Crystal Bay",
    region: "nusa_penida",
    category: "beaches",
    duration: 1.2,
    ticket: 10000,
    description: "Пляж для купания и снорклинга на Нуса Пенида.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tip: "Снорклинг лучше при спокойной воде.",
  },
  {
    name: "Melasti Beach",
    region: "bali",
    category: "beaches",
    duration: 1.5,
    ticket: 15000,
    description: "Красивый пляж с высокими скалами на полуострове Букит.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    tip: "Комфортнее ехать после 15:00.",
  },
  {
    name: "Jimbaran Seafood Dinner",
    region: "bali",
    category: "food",
    duration: 1.5,
    ticket: 0,
    description: "Ужин на берегу океана с морепродуктами.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    tip: "Лучше бронировать стол к закату.",
  },
  {
    name: "Sekumpul Restaurant & Coffee Shop",
    region: "bali",
    category: "food",
    duration: 1.2,
    ticket: 0,
    description: "Завтрак/обед с панорамным видом в северной части Бали.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    tip: "Попробуйте сатай и местный кофе.",
  },
  {
    name: "House of Tundra",
    region: "bali",
    category: "food",
    duration: 1,
    ticket: 0,
    description: "Удобный запасной вариант обеда в районе Убуда.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tip: "Средний чек 80 000-120 000 IDR.",
  },
  {
    name: "Bali Farm House",
    region: "bali",
    category: "animals",
    duration: 0.8,
    ticket: 75000,
    description: "Ферма с альпаками и спокойной семейной атмосферой.",
    image:
      "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?auto=format&fit=crop&w=1200&q=80",
    tip: "Подходит для детей и короткой паузы в дороге.",
  },
  {
    name: "Animal Stop (Luwak & Flying Foxes)",
    region: "bali",
    category: "animals",
    duration: 0.5,
    ticket: 20000,
    description: "Неформальная остановка с локальными животными по пути.",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80",
    tip: "Выбирайте этичные локации, где нет жесткого контакта.",
  },
  {
    name: "LAHANGAN SWEET",
    region: "bali",
    category: "viewpoints",
    duration: 1.1,
    ticket: 50000,
    description: "Панорамная смотровая площадка в районе Карангасем.",
    image: CATEGORY_IMAGES.viewpoints,
    tip: "Лучшее время для фото: раннее утро.",
  },
  {
    name: "Penataran Agung Lempuyang Temple",
    region: "bali",
    category: "temples",
    duration: 1.8,
    ticket: 100000,
    description: "Легендарные «врата небес» с видом на вулкан Агунг.",
    image: CATEGORY_IMAGES.temples,
    tip: "Закладывайте время на очередь к фототочке.",
  },
  {
    name: "Tirta Gangga",
    region: "bali",
    category: "temples",
    duration: 1.2,
    ticket: 50000,
    description: "Королевский водный дворец с садами и фонтанами.",
    image: CATEGORY_IMAGES.temples,
    tip: "Подходит как спокойная остановка без треккинга.",
  },
  {
    name: "Cinze Villas and Hot Spring",
    region: "bali",
    category: "relax",
    duration: 1.5,
    ticket: 100000,
    description: "Отдых в горячих источниках и комфортной вилле.",
    image: CATEGORY_IMAGES.relax,
    tip: "Берите купальник и сменную одежду.",
  },
  {
    name: "Paperhills",
    region: "bali",
    category: "food",
    duration: 1.2,
    ticket: 0,
    description: "Стильный ресторан с панорамными видами.",
    image: CATEGORY_IMAGES.food,
    tip: "Лучше бронировать стол заранее.",
  },
  {
    name: "Nungnung Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 25000,
    description: "Мощный водопад в джунглях с длинным спуском по лестнице.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Нужна удобная обувь для подъема обратно.",
  },
  {
    name: "Leke Leke Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.4,
    ticket: 50000,
    description: "Узкий живописный водопад с коротким треккингом.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Лучше приезжать в первой половине дня.",
  },
  {
    name: "Bayan Ancient Tree",
    region: "bali",
    category: "viewpoints",
    duration: 0.7,
    ticket: 20000,
    description: "Древнее священное дерево и атмосферная локация.",
    image: CATEGORY_IMAGES.viewpoints,
    tip: "Локация небольшая, удобно комбинировать с водопадами.",
  },
  {
    name: "Sekumpul Waterfall View Point",
    region: "bali",
    category: "viewpoints",
    duration: 0.8,
    ticket: 20000,
    description: "Смотровая с видом на долину и каскады Sekumpul.",
    image: CATEGORY_IMAGES.viewpoints,
    tip: "Идеально для быстрого фото-стопа.",
  },
  {
    name: "Banyu Wana Amertha Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 50000,
    description: "Комплекс из нескольких водопадов в одной локации.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Берите полотенце, можно купаться.",
  },
  {
    name: "Blue Lagoon Sambangan",
    region: "bali",
    category: "waterfalls",
    duration: 1.5,
    ticket: 50000,
    description: "Природные лагуны и каньоны для купания и фото.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Проверяйте погоду, после дождей течение сильнее.",
  },
  {
    name: "Fresh Strawberry (дегустация клубничного вина)",
    region: "bali",
    category: "food",
    duration: 0.8,
    ticket: 35000,
    description: "Клубничный сад и дегустация локального вина.",
    image: CATEGORY_IMAGES.food,
    tip: "Хорошая остановка между северными локациями.",
  },
  {
    name: "Babahan Crystal Water",
    region: "bali",
    category: "relax",
    duration: 1,
    ticket: 25000,
    description: "Спокойная природная локация с чистой водой.",
    image: CATEGORY_IMAGES.relax,
    tip: "Подходит для тихой паузы без толпы.",
  },
  {
    name: "Mupu Rice Terrace",
    region: "bali",
    category: "terraces",
    duration: 1.3,
    ticket: 30000,
    description: "Уютные рисовые террасы с локальной атмосферой.",
    image: CATEGORY_IMAGES.terraces,
    tip: "Утром свет мягче и меньше людей.",
  },
  {
    name: "Alas Harum Bali",
    region: "bali",
    category: "terraces",
    duration: 1.5,
    ticket: 50000,
    description: "Террасы, качели и фотозоны в районе Убуда.",
    image: CATEGORY_IMAGES.terraces,
    tip: "Для активностей на качелях нужна доплата на месте.",
  },
  {
    name: "Taman Dedari",
    region: "bali",
    category: "temples",
    duration: 1,
    ticket: 0,
    description: "Парк-скульптур и атмосферная прогулочная зона у реки.",
    image: CATEGORY_IMAGES.temples,
    tip: "Удобно совместить с маршрутом по Убуду.",
  },
  {
    name: "Sayan Point",
    region: "bali",
    category: "viewpoints",
    duration: 0.8,
    ticket: 0,
    description: "Панорамная точка с видом на долину и джунгли Убуда.",
    image: CATEGORY_IMAGES.viewpoints,
    tip: "Лучший свет ближе к закату.",
  },
  {
    name: "Tibumana Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.4,
    ticket: 30000,
    description: "Компактный красивый водопад с легким подходом.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Подходит для семей и спокойного формата.",
  },
  {
    name: "Kanto Lampo Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.2,
    ticket: 25000,
    description: "Каскадный водопад с популярной фототочкой.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "После дождя камни могут быть скользкими.",
  },
  {
    name: "Gembleng Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.3,
    ticket: 30000,
    description:
      "Каскадные водопады и природные каменные бассейны для купания и фото.",
    image: CATEGORY_IMAGES.waterfalls,
    tip: "Локация спокойная, лучше приезжать утром для мягкого света.",
  },
  {
    name: "SIDEMEN RICE TERRACE",
    region: "bali",
    category: "terraces",
    duration: 1.5,
    ticket: 25000,
    description: "Панорамные террасы и виды на долину Сидемен.",
    image: CATEGORY_IMAGES.terraces,
    tip: "Хороший маршрут для спокойного дня без спешки.",
  },
  {
    name: "Edelweiss Restaurant and Bar",
    region: "bali",
    category: "food",
    duration: 1.2,
    ticket: 0,
    description: "Ресторан с красивой подачей и видами на горы.",
    image: CATEGORY_IMAGES.food,
    tip: "Лучше планировать как обеденную остановку.",
  },
  {
    name: "Bali Chocolate Factory",
    region: "bali",
    category: "food",
    duration: 0.9,
    ticket: 30000,
    description: "Десертная точка с дегустацией шоколадных изделий.",
    image: CATEGORY_IMAGES.food,
    tip: "Можно взять наборы шоколада как сувенир.",
  },
  {
    name: "Virgin Beach, Karangasem",
    region: "bali",
    category: "beaches",
    duration: 1.5,
    ticket: 15000,
    description: "Спокойный пляж в Карангасеме с красивой береговой линией.",
    image: CATEGORY_IMAGES.beaches,
    tip: "Лучше брать наличные на лежаки и кафе.",
  },
  {
    name: "Keramas Aero Park & Black Sand Beach",
    region: "bali",
    category: "beaches",
    duration: 1.3,
    ticket: 0,
    description:
      "Обед рядом с самолетом в Keramas Aero Park и прогулка по черному пляжу.",
    image: CATEGORY_IMAGES.beaches,
    tip: "Удобная комбинированная остановка еда + фото + море.",
  },
  {
    name: "Gunung Kawi Tampaksiring",
    region: "bali",
    category: "temples",
    duration: 1.3,
    ticket: 50000,
    description: "Древний храмовый комплекс в ущелье с каменными рельефами.",
    image: CATEGORY_IMAGES.temples,
    tip: "Будет спуск по лестнице, закладывайте время на подъем.",
  },
  {
    name: "Pura Gunung Kawi Sebatu",
    region: "bali",
    category: "temples",
    duration: 1,
    ticket: 50000,
    description: "Тихий водный храм с очень фотогеничной территорией.",
    image: CATEGORY_IMAGES.temples,
    tip: "Отличная альтернатива более людным храмам.",
  },
  {
    name: "Tulamben Beach Viewpoint (USAT Liberty Snorkeling)",
    region: "bali",
    category: "beaches",
    duration: 2,
    ticket: 50000,
    description:
      "Снорклинг у знаменитого затонувшего корабля USAT Liberty в Туламбене.",
    image: CATEGORY_IMAGES.beaches,
    tip: "Для комфортного снорклинга лучше ехать при спокойной воде.",
  },
];

let CATALOG_SPOTS = [...DEFAULT_CATALOG_SPOTS];

const state = {
  routeTitle: "Индивидуальный маршрут",
  places: [],
  catalogSelectedCategories: [],
  mode: null,
};

const placesEl = document.getElementById("places");
const summaryEl = document.getElementById("summary");
const addPaperhillsRouteBtn = document.getElementById("addPaperhillsRoute");
const addEastBaliRouteBtn = document.getElementById("addEastBaliRoute");
const addUbudCenterRouteBtn = document.getElementById("addUbudCenterRoute");
const addNorthSideRouteBtn = document.getElementById("addNorthSideRoute");
const addSpiritualRouteBtn = document.getElementById("addSpiritualRoute");
const addActiveRouteBtn = document.getElementById("addActiveRoute");
const clearAllBtn = document.getElementById("clearAll");
const leadForm = document.getElementById("leadForm");
const leadResultEl = document.getElementById("leadResult");
const selectedCountInfoEl = document.getElementById("selectedCountInfo");
const leadSubmitBtn = document.getElementById("leadSubmitBtn");
const leadSubmitHintEl = document.getElementById("leadSubmitHint");
const catalogStatusEl = document.getElementById("catalogStatus");
const categoryFiltersEl = document.getElementById("categoryFilters");
const catalogCardsEl = document.getElementById("catalogCards");
const chooseReadyModeBtn = document.getElementById("chooseReadyMode");
const chooseCustomModeBtn = document.getElementById("chooseCustomMode");
const modeHintEl = document.getElementById("modeHint");
const customBuilderSectionEl = document.getElementById("customBuilderSection");
const readyRoutesSectionEl = document.getElementById("readyRoutesSection");
const step1El = document.getElementById("step1");
const step2El = document.getElementById("step2");
const step3El = document.getElementById("step3");

const formatMoney = (value) =>
  `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} IDR`;

function newId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

function getTelegramUser() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return null;
  return {
    id: user.id,
    username: user.username || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    language_code: user.language_code || "",
  };
}

function getTransferHours(prev, current) {
  if (!prev) return 0;
  return prev.region === current.region
    ? TRAVEL_SAME_REGION_HOURS
    : TRAVEL_DIFF_REGION_HOURS;
}

function getPricing(places) {
  const extraPlaces = Math.max(0, places.length - INCLUDED_SPOTS);
  const surcharge = extraPlaces * EXTRA_SPOT_SURCHARGE;
  const ticketTotal = places.reduce((acc, place) => acc + place.ticket, 0);
  const routeOnly = BASE_PRICE + surcharge;
  return {
    base: BASE_PRICE,
    includedSpots: INCLUDED_SPOTS,
    extraPlaces,
    surcharge,
    ticketTotal,
    routeOnly,
    total: routeOnly + ticketTotal,
  };
}

function getSegments(places) {
  return places.map((place, index) => {
    const prev = places[index - 1];
    const transferHours = getTransferHours(prev, place);
    const segmentHours = transferHours + place.duration;
    return { ...place, transferHours, segmentHours };
  });
}

function buildItinerary(segments, maxHoursPerDay = MAX_HOURS_PER_DAY) {
  if (!segments.length) return [];

  const result = [{ places: [], hours: 0, tickets: 0 }];
  let dayIndex = 0;

  for (const segment of segments) {
    let current = result[dayIndex];
    const hasPlaces = current.places.length > 0;
    const nextHours = current.hours + segment.segmentHours;

    if (hasPlaces && nextHours > maxHoursPerDay) {
      result.push({ places: [], hours: 0, tickets: 0 });
      dayIndex += 1;
      current = result[dayIndex];
    }

    current.places.push(segment);
    current.hours += segment.segmentHours;
    current.tickets += segment.ticket;
  }

  return result;
}

function createTag(text) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = text;
  return tag;
}

function createPlaceCard(place, index) {
  const card = document.createElement("article");
  card.className = "place-card";

  const img = document.createElement("img");
  img.src = place.image || "https://picsum.photos/1200/700?blur=1";
  img.alt = place.name;
  img.onerror = () => {
    img.src = "https://picsum.photos/1200/700?grayscale";
  };

  const body = document.createElement("div");
  body.className = "place-body";

  const title = document.createElement("h3");
  title.textContent = `${index + 1}. ${place.name}`;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(
    createTag(REGION_LABELS[place.region] || REGION_LABELS.other),
    createTag(`${place.duration} ч`),
    createTag(`Билет: ${formatMoney(place.ticket)}`)
  );

  const desc = document.createElement("p");
  desc.className = "small";
  desc.textContent = place.description || "Описание не добавлено";

  const tip = document.createElement("p");
  tip.className = "small";
  tip.textContent = place.tip ? `Совет: ${place.tip}` : "";

  const del = document.createElement("button");
  del.type = "button";
  del.className = "btn btn-danger";
  del.textContent = "Удалить";
  del.addEventListener("click", () => {
    state.places = state.places.filter((item) => item.id !== place.id);
    render();
  });

  body.append(title, meta, desc);
  if (place.tip) body.append(tip);
  body.append(del);

  card.append(img, body);
  return card;
}

function addPlaceFromCatalog(template) {
  const exists = state.places.some(
    (place) => place.name === template.name && place.region === template.region
  );
  if (exists) return;

  state.mode = "custom";
  state.routeTitle = "Индивидуальный маршрут";
  state.places.push({
    id: newId(),
    name: template.name,
    region: template.region,
    duration: template.duration,
    ticket: template.ticket,
    description: template.description,
    image: template.image,
    tip: template.tip,
  });
  render();
}

function renderCategoryFilters() {
  if (!categoryFiltersEl) return;
  categoryFiltersEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "filter-chip";
  allBtn.textContent = "Выбрать все";
  allBtn.addEventListener("click", () => {
    state.catalogSelectedCategories = [...SELECTABLE_CATEGORIES];
    renderCatalog();
  });

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "filter-chip";
  clearBtn.textContent = "Сбросить";
  clearBtn.addEventListener("click", () => {
    state.catalogSelectedCategories = [];
    renderCatalog();
  });

  categoryFiltersEl.append(allBtn, clearBtn);

  SELECTABLE_CATEGORIES.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-chip ${
      state.catalogSelectedCategories.includes(category) ? "active" : ""
    }`;
    btn.textContent = CATEGORY_LABELS[category];
    btn.addEventListener("click", () => {
      const exists = state.catalogSelectedCategories.includes(category);
      if (exists) {
        state.catalogSelectedCategories = state.catalogSelectedCategories.filter(
          (item) => item !== category
        );
      } else {
        state.catalogSelectedCategories = [
          ...state.catalogSelectedCategories,
          category,
        ];
      }
      renderCatalog();
    });
    categoryFiltersEl.append(btn);
  });
}

function createCatalogCard(spot) {
  const card = document.createElement("article");
  card.className = "catalog-card";

  const img = document.createElement("img");
  img.src = spot.image || "https://picsum.photos/1200/700?blur=1";
  img.alt = spot.name;
  img.onerror = () => {
    img.src = "https://picsum.photos/1200/700?grayscale";
  };

  const body = document.createElement("div");
  body.className = "catalog-body";

  const title = document.createElement("h3");
  title.textContent = spot.name;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(
    createTag(CATEGORY_LABELS[spot.category] || CATEGORY_LABELS.all),
    createTag(REGION_LABELS[spot.region] || REGION_LABELS.other),
    createTag(`${spot.duration} ч`),
    createTag(`Билет: ${formatMoney(spot.ticket)}`)
  );

  const desc = document.createElement("p");
  desc.className = "small";
  desc.textContent = spot.description;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = "Добавить в маршрут";
  button.addEventListener("click", () => addPlaceFromCatalog(spot));

  body.append(title, meta, desc, button);
  card.append(img, body);
  return card;
}

function renderCatalog() {
  if (!catalogCardsEl) return;
  renderCategoryFilters();
  catalogCardsEl.innerHTML = "";

  if (catalogStatusEl) {
    const selectedCount = state.catalogSelectedCategories.length;
    catalogStatusEl.textContent =
      selectedCount > 0
        ? `Выбрано категорий: ${selectedCount}`
        : "Сначала выберите хотя бы 1 категорию.";
  }

  if (!state.catalogSelectedCategories.length) {
    const hint = document.createElement("p");
    hint.className = "small";
    hint.textContent =
      "Выберите категории выше, после этого появятся подходящие локации.";
    catalogCardsEl.append(hint);
    return;
  }

  const filtered = CATALOG_SPOTS.filter((spot) => {
    return state.catalogSelectedCategories.includes(spot.category);
  });

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "По выбранным категориям пока нет локаций.";
    catalogCardsEl.append(empty);
    return;
  }

  filtered.forEach((spot) => {
    catalogCardsEl.append(createCatalogCard(spot));
  });
}

function renderSummary() {
  const segments = getSegments(state.places);
  const itinerary = buildItinerary(segments);
  const pricing = getPricing(state.places);
  const totalHours = segments.reduce((acc, place) => acc + place.segmentHours, 0);
  const dayCount = itinerary.length;

  summaryEl.innerHTML = "";

  const topRows = [
    ["Тур", state.routeTitle],
    ["Дней (авто)", `${dayCount}`],
    ["Локаций", `${state.places.length}`],
    ["Общее время (с переездами)", `${totalHours.toFixed(1)} ч`],
    ["Формат цены", "Цена за машину (на всех пассажиров)"],
    [`Базовая цена за ${INCLUDED_SPOTS} мест`, formatMoney(pricing.base)],
    [
      `Дополнительно за точки после ${INCLUDED_SPOTS} (${pricing.extraPlaces} шт.)`,
      formatMoney(pricing.surcharge),
    ],
    [
      `Итог цены за ${INCLUDED_SPOTS} мест + дополнительные точки`,
      formatMoney(pricing.routeOnly),
    ],
    ["Сумма входных билетов", formatMoney(pricing.ticketTotal)],
    ["Итого для клиента", formatMoney(pricing.total)],
  ];

  for (const [label, value] of topRows) {
    const row = document.createElement("div");
    row.className = "sum-row";
    const left = document.createElement("span");
    const right = document.createElement("strong");
    left.textContent = label;
    right.textContent = value;
    row.append(left, right);
    summaryEl.append(row);
  }

  const daysRuleNote = document.createElement("p");
  daysRuleNote.className = "small";
  daysRuleNote.textContent =
    "Дни считаются автоматически: если длительность дня превышает 14 часов, оставшиеся локации переносятся на следующий день.";
  summaryEl.append(daysRuleNote);

  itinerary.forEach((day, index) => {
    const box = document.createElement("div");
    box.className = "day-box";

    const placesText = day.places.length
      ? day.places.map((place) => place.name).join(" -> ")
      : "Точки пока не добавлены";

    const title = document.createElement("h3");
    title.textContent = `День ${index + 1}`;

    const route = document.createElement("p");
    route.className = "small";
    route.textContent = placesText;

    const stats = document.createElement("p");
    stats.className = "small";
    stats.textContent = `Время: ${day.hours.toFixed(1)} ч | Билеты: ${formatMoney(day.tickets)}`;

    box.append(title, route, stats);
    summaryEl.append(box);
  });

  const tips = state.places
    .map((place) => place.tip)
    .filter(Boolean)
    .slice(0, 6);

  const staticTips = [
    "Рекомендованный выезд: 06:00, чтобы избежать трафика и толп туристов.",
  ];
  const allTips = [...staticTips, ...tips];

  if (allTips.length) {
    const tipsBox = document.createElement("div");
    tipsBox.className = "day-box";

    const title = document.createElement("h3");
    title.textContent = "Полезные советы";

    const list = document.createElement("ul");
    list.className = "small";
    allTips.forEach((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      list.append(item);
    });

    tipsBox.append(title, list);
    summaryEl.append(tipsBox);
  }
}

function renderPlaces() {
  placesEl.innerHTML = "";
  if (!state.places.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = "Места пока не добавлены.";
    placesEl.append(empty);
    return;
  }

  state.places.forEach((place, index) => {
    placesEl.append(createPlaceCard(place, index));
  });
}

function renderRouteMinInfo() {
  if (!selectedCountInfoEl) return;
  const count = state.places.length;
  const missing = Math.max(0, MIN_ROUTE_PLACES - count);
  const readyToSend = count >= MIN_ROUTE_PLACES;

  selectedCountInfoEl.textContent = `Выбрано мест: ${count} из ${MIN_ROUTE_PLACES}+`;
  selectedCountInfoEl.classList.remove("notice-ok", "notice-error");
  selectedCountInfoEl.classList.add(readyToSend ? "notice-ok" : "notice-error");

  if (leadSubmitBtn) {
    leadSubmitBtn.disabled = !readyToSend;
  }

  if (leadSubmitHintEl) {
    leadSubmitHintEl.textContent = readyToSend
      ? "Минимум выполнен. Можно отправлять заявку."
      : `Выберите еще ${missing} мест(а), чтобы отправить заявку.`;
    leadSubmitHintEl.classList.remove("notice-ok", "notice-error");
    leadSubmitHintEl.classList.add(readyToSend ? "notice-ok" : "notice-error");
  }
}

function renderMode() {
  const isReady = state.mode === "ready";
  const isCustom = state.mode === "custom";

  if (readyRoutesSectionEl) {
    readyRoutesSectionEl.classList.toggle("hidden", !isReady);
  }
  if (customBuilderSectionEl) {
    customBuilderSectionEl.classList.toggle("hidden", !isCustom);
  }

  if (chooseReadyModeBtn) {
    chooseReadyModeBtn.classList.toggle("active", isReady);
  }
  if (chooseCustomModeBtn) {
    chooseCustomModeBtn.classList.toggle("active", isCustom);
  }

  if (modeHintEl) {
    if (!state.mode) {
      modeHintEl.textContent = "Выберите формат, чтобы перейти к шагу 2.";
    } else if (isReady) {
      modeHintEl.textContent =
        "Показываем готовые туры. Выберите вариант и отправьте заявку.";
    } else {
      modeHintEl.textContent =
        "Показываем категории и точки. Соберите маршрут и отправьте заявку.";
    }
  }
}

function setStepState(stepEl, { active = false, done = false }) {
  if (!stepEl) return;
  stepEl.classList.remove("active", "done");
  if (done) stepEl.classList.add("done");
  if (active) stepEl.classList.add("active");
}

function renderSteps() {
  const hasMode = Boolean(state.mode);
  const isReadyForContacts = state.places.length >= MIN_ROUTE_PLACES;

  setStepState(step1El, { active: !hasMode, done: hasMode });
  setStepState(step2El, { active: hasMode && !isReadyForContacts, done: isReadyForContacts });
  setStepState(step3El, { active: isReadyForContacts, done: false });
}

function selectMode(mode) {
  state.mode = mode;
  render();
}

function render() {
  renderMode();
  renderSteps();
  if (state.mode === "custom") {
    renderCatalog();
  }
  renderPlaces();
  renderSummary();
  renderRouteMinInfo();
  setupTelegramButton();
}

function normalizeSpot(spot) {
  if (!spot || typeof spot !== "object") return null;
  const name = String(spot.name || "").trim();
  if (!name) return null;

  const duration = Number(spot.duration);
  const ticket = Number(spot.ticket);

  return {
    name,
    region: String(spot.region || "bali").trim() || "bali",
    category: String(spot.category || "viewpoints").trim() || "viewpoints",
    duration: Number.isFinite(duration) && duration > 0 ? duration : 1,
    ticket: Number.isFinite(ticket) && ticket >= 0 ? ticket : 0,
    description: String(spot.description || "").trim(),
    image: String(spot.image || "").trim(),
    tip: String(spot.tip || "").trim(),
  };
}

async function syncCatalogSpots() {
  try {
    const response = await fetch("/api/spots");
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.ok && Array.isArray(data.items) && data.items.length) {
      const normalized = data.items.map(normalizeSpot).filter(Boolean);
      if (normalized.length) {
        CATALOG_SPOTS = normalized;
        render();
        return;
      }
    }
  } catch (error) {
    // Keep default catalog if API is unavailable.
  }

  try {
    await fetch("/api/spots/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: DEFAULT_CATALOG_SPOTS }),
    });
  } catch (error) {
    // Bootstrap is optional; defaults still work in the client.
  }
}

function showLeadResult(message, isError = false) {
  leadResultEl.textContent = message;
  leadResultEl.classList.remove("notice-ok", "notice-error");
  leadResultEl.classList.add(isError ? "notice-error" : "notice-ok");
}

function buildLeadPayload() {
  const routeDays = buildItinerary(getSegments(state.places)).length;
  const peopleCount = Number(document.getElementById("customerPeople").value) || 1;
  const noteRaw = document.getElementById("customerNote").value.trim();
  const noteWithPeople = noteRaw
    ? `Людей: ${peopleCount}. ${noteRaw}`
    : `Людей: ${peopleCount}.`;
  return {
    customer: {
      name: document.getElementById("customerName").value.trim(),
      phone: document.getElementById("customerTelegram").value.trim(),
      travel_date: document.getElementById("travelDate").value,
      note: noteWithPeople,
      people_count: peopleCount,
    },
    route: {
      days: routeDays,
      driver_name: state.routeTitle,
      places: state.places,
    },
    pricing: getPricing(state.places),
    source: "telegram-miniapp",
    telegram_user: getTelegramUser(),
  };
}

async function saveLead(payload) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    const msg = data.error || "Не удалось сохранить заявку";
    throw new Error(msg);
  }

  return data;
}

function sendLeadToTelegram(payload, leadId = null) {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const summary = {
    lead_id: leadId,
    customer_name: payload.customer.name,
    customer_phone: payload.customer.phone,
    customer_telegram: payload.customer.phone,
    people_count: payload.customer.people_count,
    travel_date: payload.customer.travel_date,
    days: payload.route.days,
    places_count: payload.route.places.length,
    total_price: payload.pricing.total,
    route_preview: payload.route.places.map((item) => item.name).slice(0, 6),
  };

  tg.sendData(JSON.stringify(summary));
}

function buildPlaceFromCatalogName(name) {
  const source = CATALOG_SPOTS.find((spot) => spot.name === name);
  if (!source) return null;
  return {
    name: source.name,
    region: source.region,
    duration: source.duration,
    ticket: source.ticket,
    description: source.description,
    image: source.image,
    tip: source.tip,
  };
}

function applyNamedPreset(routeTitle, placeNames) {
  const places = placeNames
    .map((name) => buildPlaceFromCatalogName(name))
    .filter(Boolean);

  if (!places.length) return;

  state.mode = "ready";
  state.routeTitle = routeTitle;
  state.places = places.map((place) => ({ ...place, id: newId() }));
  render();
}

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (state.places.length < MIN_ROUTE_PLACES) {
    showLeadResult(
      `Для отправки заявки выберите минимум ${MIN_ROUTE_PLACES} мест`,
      true
    );
    return;
  }

  const payload = buildLeadPayload();
  if (!payload.customer.name || !payload.customer.phone) {
    showLeadResult("Заполните имя и Telegram клиента", true);
    return;
  }
  if (!payload.customer.people_count || payload.customer.people_count < 1) {
    showLeadResult("Укажите корректное количество людей", true);
    return;
  }

  showLeadResult("Сохраняю заявку...");

  try {
    const result = await saveLead(payload);
    sendLeadToTelegram(payload, result.lead_id);
    showLeadResult(`Заявка #${result.lead_id} сохранена и отправлена в Telegram`);
    leadForm.reset();
    document.getElementById("customerPeople").value = "2";
  } catch (error) {
    showLeadResult(error.message, true);
  }
});

if (addPaperhillsRouteBtn) {
  addPaperhillsRouteBtn.addEventListener("click", () => {
    applyNamedPreset("Paperhills - Завтрак над облаками", [
      "Paperhills",
      "Tegalalang Rice Terrace",
      "Kanto Lampo Waterfall",
      "Gunung Kawi Tampaksiring",
      "Taman Dedari",
    ]);
  });
}

if (addEastBaliRouteBtn) {
  addEastBaliRouteBtn.addEventListener("click", () => {
    applyNamedPreset("East Bali Gates & Snorkel", [
      "Penataran Agung Lempuyang Temple",
      "LAHANGAN SWEET",
      "Tulamben Beach Viewpoint (USAT Liberty Snorkeling)",
      "Gembleng Waterfall",
      "Bali Chocolate Factory",
    ]);
  });
}

if (addUbudCenterRouteBtn) {
  addUbudCenterRouteBtn.addEventListener("click", () => {
    applyNamedPreset("Центр Бали - Убуд", [
      "Tegalalang Rice Terrace",
      "Tirta Empul",
      "Gunung Kawi Tampaksiring",
      "Taman Dedari",
      "Kanto Lampo Waterfall",
    ]);
  });
}

if (addNorthSideRouteBtn) {
  addNorthSideRouteBtn.addEventListener("click", () => {
    applyNamedPreset("Северная сторона Бали", [
      "Sekumpul Waterfall",
      "Banyu Wana Amertha Waterfall",
      "Puncak Wanagiri",
      "Bali Handara Gate",
      "Fresh Strawberry (дегустация клубничного вина)",
    ]);
  });
}

if (addSpiritualRouteBtn) {
  addSpiritualRouteBtn.addEventListener("click", () => {
    applyNamedPreset("Духовный Бали", [
      "Penataran Agung Lempuyang Temple",
      "Tirta Gangga",
      "Tirta Empul",
      "Pura Gunung Kawi Sebatu",
      "Gunung Kawi Tampaksiring",
    ]);
  });
}

if (addActiveRouteBtn) {
  addActiveRouteBtn.addEventListener("click", () => {
    applyNamedPreset("Активный Бали", [
      "Nungnung Waterfall",
      "Leke Leke Waterfall",
      "Aling-Aling Waterfall",
      "Tibumana Waterfall",
      "Kanto Lampo Waterfall",
    ]);
  });
}

if (chooseReadyModeBtn) {
  chooseReadyModeBtn.addEventListener("click", () => {
    selectMode("ready");
  });
}

if (chooseCustomModeBtn) {
  chooseCustomModeBtn.addEventListener("click", () => {
    selectMode("custom");
  });
}

clearAllBtn.addEventListener("click", () => {
  state.routeTitle =
    state.mode === "ready" ? "Готовый маршрут" : "Индивидуальный маршрут";
  state.places = [];
  render();
});

function setupTelegramButton() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();
  tg.MainButton.offClick(sendRouteToTelegramQuick);
  tg.MainButton.hide();
}

function sendRouteToTelegramQuick() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  const routeDays = buildItinerary(getSegments(state.places)).length;

  const payload = {
    route_preview: state.places.map((item) => item.name).slice(0, 8),
    days: routeDays,
    total_price: getPricing(state.places).total,
    places_count: state.places.length,
  };

  tg.sendData(JSON.stringify(payload));
}

render();
syncCatalogSpots();
