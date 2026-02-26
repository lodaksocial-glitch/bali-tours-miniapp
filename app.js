const BASE_PRICE = 1_200_000;
const INCLUDED_SPOTS = 5;
const EXTRA_SPOT_SURCHARGE = 100_000;
const MIN_ROUTE_PLACES = 5;
const MAX_HOURS_PER_DAY = 14;
const TRAVEL_SAME_REGION_HOURS = 0.75;
const TRAVEL_DIFF_REGION_HOURS = 2;

const ADDON_OPTIONS = {
  drone: { id: "drone", price: 200_000 },
  port_transfer: { id: "port_transfer", price: 350_000 },
};

const I18N = {
  ru: {
    heroBadge: "Создай свой уникальный маршрут",
    heroLead:
      "Выберите лучшие локации, соберите тур мечты и получите незабываемое путешествие с комфортным трансфером, красивыми фото-точками и продуманным таймингом без лишней суеты.",
    stepFormatTitle: "Шаг 1. Выберите формат",
    readyModeTitle: "Готовые туры",
    readyModeDesc: "Быстрый выбор готового сценария",
    customModeTitle: "Собрать свой",
    customModeDesc: "Категории -> локации -> ваш маршрут",
    packageTitle: "Пакет тура",
    packageQuickText: "Быстрый тур",
    packageQuickDesc: "Оптимальный маршрут и комфортный темп",
    packagePremiumText: "Премиум тур",
    packagePremiumDesc: "Больше сопровождения и гибкий тайминг",
    addonsTitle: "Допуслуги",
    addonPhotoText: "Фото-сопровождение",
    addonDroneText: "Съемка на дрон",
    addonLunchText: "Обед в красивом месте",
    addonPortTransferText: "Трансфер в порт/из порта",
    chooseFormatHint: "Выберите формат, чтобы перейти к шагу 2.",
    readyFormatHint: "Показываем готовые туры. Выберите вариант и отправьте заявку.",
    customFormatHint: "Показываем категории и точки. Соберите маршрут и отправьте заявку.",
    chooseCategoriesHint:
      "Выберите категории выше, после этого появятся подходящие локации.",
    selectAtLeastCategory: "Сначала выберите хотя бы 1 категорию.",
    selectedCategories: "Выбрано категорий",
    noPlacesInCategory: "По выбранным категориям пока нет локаций.",
    addToRoute: "Добавить в маршрут",
    removePlace: "Удалить",
    emptyRoute: "Места пока не добавлены.",
    minReady: "Минимум выполнен. Можно отправлять заявку.",
    chooseMorePlaces: "Выберите еще {count} мест(а), чтобы отправить заявку.",
    selectedPlacesCounter: "Выбрано мест: {count} (минимум {min})",
    unavailableDate: "Эта дата уже занята. Выберите другую дату поездки.",
    availableDate: "Дата свободна. Можно отправлять заявку.",
    recommendDeparture:
      "Рекомендуемый выезд: 06:00, чтобы избежать трафика и толп туристов.",
    routeSummaryTitle: "Итог по маршруту",
    daysAuto: "Дней (авто)",
    locations: "Локаций",
    totalTime: "Общее время (с переездами)",
    pricingFormat: "Формат цены",
    pricePerCar: "Цена за машину (на всех пассажиров)",
    basePrice: `Базовая цена за ${INCLUDED_SPOTS} мест`,
    extraPlacesLabel: `Дополнительно за точки после ${INCLUDED_SPOTS}`,
    packageLabel: "Пакет тура",
    addonsLabel: "Допуслуги",
    ticketTotal: "Сумма входных билетов",
    totalForClient: "Итого для клиента",
    quickPackage: "Быстрый тур",
    premiumPackage: "Премиум тур",
    none: "нет",
    day: "День",
    timeAndTickets: "Время",
    tickets: "Билеты",
    usefulTips: "Полезные советы",
    leadSaving: "Сохраняю заявку...",
    fillContact: "Заполните имя и Telegram клиента",
    invalidPeople: "Укажите корректное количество людей",
    minPlacesError: "Для отправки заявки выберите минимум {min} мест",
    leadSaved: "Заявка #{id} сохранена и отправлена в Telegram",
    regions: {
      bali: "Бали",
      nusa_penida: "Нуса Пенида",
      java: "Ява",
      other: "Другое",
    },
    categories: {
      all: "Все",
      temples: "Храмы",
      waterfalls: "Водопады",
      terraces: "Террасы",
      viewpoints: "Смотровые",
      beaches: "Пляжи",
      food: "Кафе",
      animals: "Животные",
      relax: "Релакс",
    },
  },
  en: {
    heroBadge: "Build your unique route",
    heroLead:
      "Pick top spots, create your dream tour, and enjoy a smooth trip with smart timing, scenic photo points, and private transfer.",
    stepFormatTitle: "Step 1. Choose format",
    readyModeTitle: "Ready tours",
    readyModeDesc: "Quick pick from prepared itineraries",
    customModeTitle: "Build your own",
    customModeDesc: "Categories -> locations -> your route",
    packageTitle: "Tour package",
    packageQuickText: "Quick Tour",
    packageQuickDesc: "Optimized route and comfortable pace",
    packagePremiumText: "Premium Tour",
    packagePremiumDesc: "More guidance and flexible timing",
    addonsTitle: "Add-ons",
    addonPhotoText: "Photo support",
    addonDroneText: "Drone shooting",
    addonLunchText: "Lunch stop",
    addonPortTransferText: "Port transfer",
    chooseFormatHint: "Choose format to continue to step 2.",
    readyFormatHint: "Ready tours shown. Pick one and send request.",
    customFormatHint: "Categories and spots shown. Build route and send request.",
    chooseCategoriesHint:
      "Select categories above and matching locations will appear.",
    selectAtLeastCategory: "Please select at least 1 category first.",
    selectedCategories: "Selected categories",
    noPlacesInCategory: "No locations found for selected categories.",
    addToRoute: "Add to route",
    removePlace: "Remove",
    emptyRoute: "No places added yet.",
    minReady: "Minimum reached. You can submit the request.",
    chooseMorePlaces: "Choose {count} more place(s) to submit.",
    selectedPlacesCounter: "Selected places: {count} (minimum {min})",
    unavailableDate: "This date is already booked. Choose another date.",
    availableDate: "Date is available. You can submit the request.",
    recommendDeparture:
      "Recommended departure: 06:00 to avoid traffic and tourist crowds.",
    routeSummaryTitle: "Route summary",
    daysAuto: "Days (auto)",
    locations: "Locations",
    totalTime: "Total time (with transfers)",
    pricingFormat: "Pricing format",
    pricePerCar: "Price per car (shared by all passengers)",
    basePrice: `Base price for ${INCLUDED_SPOTS} places`,
    extraPlacesLabel: `Extra places after ${INCLUDED_SPOTS}`,
    packageLabel: "Package",
    addonsLabel: "Add-ons",
    ticketTotal: "Tickets total",
    totalForClient: "Total",
    quickPackage: "Quick Tour",
    premiumPackage: "Premium Tour",
    none: "none",
    day: "Day",
    timeAndTickets: "Time",
    tickets: "Tickets",
    usefulTips: "Useful tips",
    leadSaving: "Saving request...",
    fillContact: "Fill in customer name and Telegram",
    invalidPeople: "Please enter valid number of people",
    minPlacesError: "Choose at least {min} places before submit",
    leadSaved: "Request #{id} saved and sent to Telegram",
    regions: {
      bali: "Bali",
      nusa_penida: "Nusa Penida",
      java: "Java",
      other: "Other",
    },
    categories: {
      all: "All",
      temples: "Temples",
      waterfalls: "Waterfalls",
      terraces: "Terraces",
      viewpoints: "Viewpoints",
      beaches: "Beaches",
      food: "Food",
      animals: "Animals",
      relax: "Relax",
    },
  },
};

const SELECTABLE_CATEGORIES = Object.keys(I18N.ru.categories).filter(
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
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/3e/ca/b5.jpg",
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
      "https://www.arabianknightubud.com/wp-content/uploads/2025/07/tanah-lot-temple-1024x683.webp",
    tip: "Закладывайте время на очередь к фототочкам.",
  },
  {
    name: "Tirta Empul",
    region: "bali",
    category: "temples",
    duration: 2,
    ticket: 75000,
    description:
      "Священные источники и ритуал очищения Мелукат. То самое место силы из фильма «Ешь, молись, люби».",
    image:
      "https://torch.id/cdn/shop/articles/Artikel_160_-_Preview.webp?v=1710761089&width=1100",
    tip: "Берите саронг, на месте тоже можно арендовать.",
  },
  {
    name: "Sekumpul Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 2.2,
    ticket: 175000,
    description: "Каскад водопадов в джунглях, один из самых впечатляющих.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8nfD_jlB83UdTMBfpif5wmdGyw0yPpev2cQ&s",
    tip: "Нужна удобная нескользящая обувь.",
  },
  {
    name: "Aling-Aling Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 100000,
    description: "Прыжки в воду с 5,10,15 метров, горки и купание в природных бассейнах.",
    image:
      "https://balirescentre.com/wp-content/uploads/2025/12/aling-aling-waterfalls.jpg",
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
      "https://cdn.sanity.io/images/nxpteyfv/goguides/a9cb9057258e0f3900c89d7605729feb9efe3ddb-1600x1066.jpg",
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
      "https://blp.inc/storage/location-guide-sub-area/623578bbef18c.jpg",
    tip: "Лучший свет до 10:00.",
  },
  {
    name: "Jatiluwih Rice Terrace",
    region: "bali",
    category: "terraces",
    duration: 2,
    ticket: 75000,
    description: "Большие террасы ЮНЕСКО и спокойные маршруты для прогулки.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTESs9sB9-5PCkxmGJ6LP6Z6jypZglmF4WRAA&s",
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
      "https://backpackerjakarta.com/wp-content/uploads/2017/11/21224243_157354024844518_8521169893553340416_n.jpg",
    tip: "На высоте может быть прохладно.",
  },
  {
    name: "Bali Handara Gate",
    region: "bali",
    category: "viewpoints",
    duration: 0.5,
    ticket: 50000,
    description: "Иконические ворота для симметричных фото.",
    image:
      "https://www.baliholidaysecrets.com/wp-content/uploads/2025/08/bali-handara-gate.webp",
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
      "https://static.saltinourhair.com/wp-content/uploads/2018/10/23145815/kelingking-nusa-penida-viewpoint-1-1920x1386.jpg",
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
      "https://www.baliskytour.com/images/CrystalBay3.jpg",
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
      "https://thebalisun.com/wp-content/uploads/2025/04/Stunning-Southern-Bali-Beach-Is-Rising-In-Popularity-With-Tourists-For-Good-Reason.jpg",
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
      "https://jimbaranbayrestaurant.com/wp-content/uploads/2025/06/cropped-beachfront-seafood-dinner-2.jpg",
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
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/63/8a/4d/photo0jpg.jpg?w=600&h=600&s=1",
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
      "https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/67/2024/02/23/CANDRA-1931761531.jpeg",
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
      "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=center,quality=60,width=450,height=450,dpr=2/tour_img/2b414474bfc837d023be7fdf9696ef5a9d97e2a9c9ae85aff2232b09a20e5617.jpg",
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
      "https://media.istockphoto.com/id/688157310/ru/фото/caged-копи-лувак-кофе-moongose-на-бали-индонезии.jpg?s=170667a&w=0&k=20&c=lUbxp9K8L_zOR_IFnlrr25gTddUToPNeMxZphiNh94o=",
    tip: "Выбирайте этичные локации, где нет жесткого контакта.",
  },
  {
    name: "LAHANGAN SWEET",
    region: "bali",
    category: "viewpoints",
    duration: 1.1,
    ticket: 100000,
    description: "Панорамная смотровая площадка в районе Карангасем.",
    image:
      "https://awsimages.detik.net.id/community/media/visual/2024/07/05/lahangan-sweet-bali-desa-bunutan-karangasem-dok-lahangansweetcom-2_169.jpeg?w=1200",
    tip: "Лучшее время для фото: раннее утро.",
  },
  {
    name: "Penataran Agung Lempuyang Temple",
    region: "bali",
    category: "temples",
    duration: 1.8,
    ticket: 100000,
    description: "Легендарные «врата небес» с видом на вулкан Агунг.",
    image:
      "https://www.gotravelaindonesia.com/wp-content/uploads/Pura-Lempuyang.jpg",
    tip: "Закладывайте время на очередь к фототочке.",
  },
  {
    name: "Tirta Gangga",
    region: "bali",
    category: "temples",
    duration: 1.2,
    ticket: 50000,
    description: "Королевский водный дворец с садами и фонтанами.",
    image:
      "https://finnsbeachclub.com/wp-content/uploads/2023/04/exploring-bali_s-tirta-gangga-water-palace-1024x683.jpg",
    tip: "Подходит как спокойная остановка без треккинга.",
  },
  {
    name: "Cinze Villas and Hot Spring",
    region: "bali",
    category: "relax",
    duration: 1.5,
    ticket: 100000,
    description: "Отдых в горячих источниках и комфортной вилле.",
    image:
      "https://ik.imagekit.io/tvlk/xpe-asset/AyJ40ZAo1DOyPyKLZ9c3RGQHTP2oT4ZXW+QmPVVkFQiXFSv42UaHGzSmaSzQ8DO5QIbWPZuF+VkYVRk6gh-Vg4ECbfuQRQ4pHjWJ5Rmbtkk=/3154116240853/Cinze-Natural-Hot-Spring-fdfbe6b9-1006-4f13-8abd-edfe59feaf65.png?_src=imagekit&tr=c-at_max,h-250,q-100,w-412",
    tip: "Берите купальник и сменную одежду.",
  },
  {
    name: "Paperhills",
    region: "bali",
    category: "food",
    duration: 1.2,
    ticket: 0,
    description: "Стильный ресторан с панорамными видами.",
    image:
      "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_863/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jbmfuwpt2vw2qpa2mkon/MountBaturTourwithScenicCoffeeStopatPaperhills,Kintamani.jpg",
    tip: "Лучше бронировать стол заранее.",
  },
  {
    name: "Nungnung Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 25000,
    description: "Мощный водопад в джунглях с длинным спуском по лестнице.",
    image:
      "https://www.balihonestdriver.com/wp-content/uploads/2020/06/Nungnung-waterfall-for-web.jpg",
    tip: "Нужна удобная обувь для подъема обратно.",
  },
  {
    name: "Leke Leke Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.4,
    ticket: 50000,
    description: "Узкий живописный водопад с коротким треккингом.",
    image:
      "https://finnsbeachclub.com/wp-content/uploads/2023/12/Leke-Leke-Waterfall-1024x683.webp",
    tip: "Лучше приезжать в первой половине дня.",
  },
  {
    name: "Bayan Ancient Tree",
    region: "bali",
    category: "viewpoints",
    duration: 0.7,
    ticket: 20000,
    description: "Древнее священное дерево и атмосферная локация.",
    image:
      "https://theworldtravelguy.com/wp-content/uploads/2020/11/DSCF6990.jpg",
    tip: "Локация небольшая, удобно комбинировать с водопадами.",
  },
  {
    name: "Sekumpul Waterfall View Point",
    region: "bali",
    category: "viewpoints",
    duration: 0.8,
    ticket: 20000,
    description: "Смотровая с видом на долину и каскады Sekumpul.",
    image:
      "https://images.squarespace-cdn.com/content/v1/5a3bb03b4c326d76de73ddaa/1554285066122-JJIP8BVSZLRP6L6RO6GC/The_Common_Wanderer_Sekumpul_waterfall_guide-10.jpg",
    tip: "Идеально для быстрого фото-стопа.",
  },
  {
    name: "Banyu Wana Amertha Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.8,
    ticket: 50000,
    description: "Комплекс из нескольких водопадов в одной локации.",
    image:
      "https://www.gusmank.com/CMS/wp-content/uploads/2022/11/banyu-wana-amertha-waterfall-bali-007.jpg",
    tip: "Берите полотенце, можно купаться.",
  },
  {
    name: "Blue Lagoon Sambangan",
    region: "bali",
    category: "waterfalls",
    duration: 1.5,
    ticket: 50000,
    description: "Природные лагуны и каньоны для купания и фото.",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit621414gsm/events/2021/07/15/cfcf4189-0cb2-4d3f-aa44-cc1180f80803-1626334711325-45688fcaa47bcef9883d8a36e70497d1.jpg",
    tip: "Проверяйте погоду, после дождей течение сильнее.",
  },
  {
    name: "Fresh Strawberry (дегустация клубничного вина)",
    region: "bali",
    category: "food",
    duration: 0.8,
    ticket: 35000,
    description: "Клубничный сад и дегустация локального вина.",
    image:
      "https://townsquare.media/site/40/files/2023/03/attachment-richard-loader-zCxCn6lRZpg-unsplash.jpg",
    tip: "Хорошая остановка между северными локациями.",
  },
  {
    name: "Babahan Crystal Water",
    region: "bali",
    category: "relax",
    duration: 1,
    ticket: 25000,
    description: "Спокойная природная локация с чистой водой. Плывем на надувных тюбингах по реке",
    image:
      "https://liburanyuk.co.id/wp-content/uploads/2022/01/babahan-crystal-water-bali.jpg",
    tip: "Подходит для тихой паузы без толпы.",
  },
  {
    name: "Mupu Rice Terrace",
    region: "bali",
    category: "terraces",
    duration: 1.3,
    ticket: 30000,
    description: "Уютные рисовые террасы с локальной атмосферой.",
    image:
      "https://img1.wsimg.com/isteam/ip/6e0089e0-eaf3-4dff-b71a-f6f273c9c078/Wonderful%20Indonesia.jpg/:/cr=t:12.44%25,l:0%25,w:100%25,h:75.12%25/rs=w:600,h:300,cg:true",
    tip: "Утром свет мягче и меньше людей.",
  },
  {
    name: "Alas Harum Bali",
    region: "bali",
    category: "terraces",
    duration: 1.5,
    ticket: 50000,
    description: "Террасы, качели и фотозоны в районе Убуда.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNn-2lBkn1PcdwhtqlFO0GdYg2MeCLgf-SPw&s",
    tip: "Для активностей на качелях нужна доплата на месте.",
  },
  {
    name: "Taman Dedari",
    region: "bali",
    category: "temples",
    duration: 1,
    ticket: 0,
    description: "Парк-скульптур и атмосферная прогулочная зона у реки.",
    image:
      "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/11/2024/12/04/296487417_131831309327310_3213992059836810361_n-2310264101.jpg",
    tip: "Удобно совместить с маршрутом по Убуду.",
  },
  {
    name: "Sayan Point",
    region: "bali",
    category: "viewpoints",
    duration: 0.8,
    ticket: 0,
    description: "Панорамная точка с видом на долину и джунгли Убуда.",
    image:
      "https://majalahbali.com/wp-content/uploads/2022/10/sayan-cover-fix.jpg",
    tip: "Лучший свет ближе к закату.",
  },
  {
    name: "Tibumana Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.4,
    ticket: 30000,
    description: "Компактный красивый водопад с легким подходом.",
    image:
      "https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit800600gsm/eventThirdParty/2024/11/06/71f6aa88-3cd2-4ce5-927c-e79098431fbc-1730880810514-5b458e569ddd273419f07df83f354f3f.jpg",
    tip: "Подходит для семей и спокойного формата.",
  },
  {
    name: "Kanto Lampo Waterfall",
    region: "bali",
    category: "waterfalls",
    duration: 1.2,
    ticket: 25000,
    description: "Каскадный водопад с популярной фототочкой.",
    image:
      "https://digitaltravelcouple.com/wp-content/uploads/2022/01/kanto-lampo-waterfall-bali-1.jpg",
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
    image:
      "https://awsimages.detik.net.id/community/media/visual/2024/07/12/gembleng-waterfall-di-karangasem-bali-tangkapan-layar-google-earthf-bader_169.png?w=650&q=90",
    tip: "Локация спокойная, лучше приезжать утром для мягкого света.",
  },
  {
    name: "SIDEMEN RICE TERRACE",
    region: "bali",
    category: "terraces",
    duration: 1.5,
    ticket: 25000,
    description: "Панорамные террасы и виды на долину Сидемен.",
    image:
      "https://balidens.com/wp-content/uploads/2022/12/sidemen-1024x573.jpg",
    tip: "Хороший маршрут для спокойного дня без спешки.",
  },
  {
    name: "Edelweiss Restaurant and Bar",
    region: "bali",
    category: "food",
    duration: 1.2,
    ticket: 0,
    description: "Ресторан с красивой подачей и видами на горы.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/34/cb/1c/profile.jpg?w=900&h=500&s=1",
    tip: "Лучше планировать как обеденную остановку.",
  },
  {
    name: "Bali Chocolate Factory",
    region: "bali",
    category: "food",
    duration: 0.9,
    ticket: 30000,
    description: "Десертная точка с дегустацией шоколадных изделий.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMvnwQFFdH2PGCfFW7Phy3Ds6M8lpppp9lRw&s",
    tip: "Можно взять наборы шоколада как сувенир.",
  },
  {
    name: "Virgin Beach, Karangasem",
    region: "bali",
    category: "beaches",
    duration: 1.5,
    ticket: 15000,
    description: "Спокойный пляж в Карангасеме с красивой береговой линией.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBKN6vU3_L7hkX_9Tl5Q5n699nhIICVvzROA&s",
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
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEj_hNndAECJBV5WeWvGomnFZshVyzE6id5Q&s",
    tip: "Удобная комбинированная остановка еда + фото + море.",
  },
  {
    name: "Gunung Kawi Tampaksiring",
    region: "bali",
    category: "temples",
    duration: 1.3,
    ticket: 50000,
    description: "Древний храмовый комплекс в ущелье с каменными рельефами.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/c4/ab/20/gunung-kawi.jpg?w=900&h=500&s=1",
    tip: "Будет спуск по лестнице, закладывайте время на подъем.",
  },
  {
    name: "Pura Gunung Kawi Sebatu",
    region: "bali",
    category: "temples",
    duration: 1,
    ticket: 50000,
    description: "Тихий водный храм с очень фотогеничной территорией.",
    image:
      "https://roadtripsandsuitcases.com/wp-content/uploads/2025/01/DSC_2714_5_6_Optimizer_edited_edited.jpg",
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
    image:
      "https://www.flagman.travel/upload/medialibrary/a37/cizz5bqjs4ov4d47wmqmmaubidmimmfr.jpg",
    tip: "Для комфортного снорклинга лучше ехать при спокойной воде.",
  },
  {
    name: "Pinggan Sunrise Point",
    region: "bali",
    category: "viewpoints",
    duration: 1,
    ticket: 30000,
    description: "Рассветная панорама на вулкан Батур и озеро в Кинтамани.",
    image:
      "https://awsimages.detik.net.id/community/media/visual/2023/08/10/desa-pinggan-kintamani-bangli-bali-dok-kemenparekraf.jpeg?w=1200",
    tip: "Лучший свет с 05:30 до 06:30.",
  },
  {
    name: "Mount Batur Viewpoint",
    region: "bali",
    category: "viewpoints",
    duration: 1,
    ticket: 100000,
    description: "Классическая смотровая точка на кальдеру и вулкан Батур.",
    image:
      "https://www.pelago.com/img/products/ID-Indonesia/mount-batur-sunrise-trekking-meeting-point-ubud-palace/c89053e4-7a76-4c9a-af99-afe7e1cebc52_mount-batur-sunrise-trekking-meeting-point-ubud-palace.jpg",
    tip: "Утром меньше облаков и туристов.",
  },
  {
    name: "Batur Natural Hot Spring",
    region: "bali",
    category: "relax",
    duration: 1.7,
    ticket: 175000,
    description: "Термальные источники у подножья вулкана Батур.",
    image:
      "https://www.balibestjourney.com/public/uploads/berita/Berita_221705030554_batur-natural-hot-spring-best-place-for-body-relaxation-on-the-side-of-a-beautiful-lake.jpg",
    tip: "Берите купальник и сменную одежду.",
  },
  {
    name: "Penglipuran Village",
    region: "bali",
    category: "viewpoints",
    duration: 1.2,
    ticket: 50000,
    description: "Традиционная балийская деревня с красивой планировкой улиц.",
    image:
      "https://tansestate.com/wp-content/uploads/2025/07/561-desa-penglipuran.jpg",
    tip: "Подходит для спокойной прогулки и фото.",
  },
  {
    name: "1911 Cafe & Resto",
    region: "java",
    category: "food",
    duration: 1,
    ticket: 0,
    description: "Кафе-остановка перед маршрутом на Иджен.",
    image:
      "https://koreana.rest/upload/article/Корейский-комплексный-обед.jpg",
    tip: "Удобно поесть перед ночным подъемом.",
  },
  {
    name: "Pondok Is Oke - Villas & Bungalows",
    region: "java",
    category: "relax",
    duration: 8,
    ticket: 0,
    description: "Ночевка перед/после восхождений на Яве.",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/675486223.jpg?k=1bb1e633efd1a463b89c158cd6c77692d3c8869bda19a8b06fcc93bfceafe40e&o=",
    tip: "Рекомендуется ранний сон перед выездом на рассвет.",
  },
  {
    name: "Pegunungan Ijen",
    region: "java",
    category: "viewpoints",
    duration: 4.5,
    ticket: 135000,
    description: "Вулкан Иджен: кратер, рассвет и знаменитые виды.",
    image:
      "https://inspiretravel.id/wp-content/uploads/2023/09/1-9.jpg",
    tip: "Нужна теплая одежда и респиратор.",
  },
  {
    name: "Kawah Gunung Bromo",
    region: "java",
    category: "viewpoints",
    duration: 3.5,
    ticket: 100000,
    description: "Рассвет на Бромо и подъем к кратеру вулкана.",
    image:
      "https://adamputratravel.com/wp-content/uploads/2025/05/Kawah-gunung-bromo.webp",
    tip: "На рассвете прохладно, берите куртку.",
  },
  {
    name: "Bromo Escapes",
    region: "java",
    category: "viewpoints",
    duration: 1.2,
    ticket: 0,
    description: "Фотостопы и панорамные точки в районе Бромо.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtOv01UlNt0UbzwC6LIiP_4bg681XZjXhlWg&s",
    tip: "Лучшие кадры в золотой час.",
  },
  {
    name: "Tumpak Sewu Waterfall",
    region: "java",
    category: "waterfalls",
    duration: 2.5,
    ticket: 50000,
    description: "Один из самых впечатляющих водопадов Явы.",
    image:
      "https://static.saltinourhair.com/wp-content/uploads/2018/09/23151253/tumpak-sewu-best-waterfall-indonesia-java-foot.jpg",
    tip: "Обувь с хорошим сцеплением обязательна.",
  },
  {
    name: "Air Terjun Kabut Pelangi",
    region: "java",
    category: "waterfalls",
    duration: 1.8,
    ticket: 30000,
    description: "Живописный водопад с мягким треком и фототочками.",
    image:
      "https://www.javanesiatours.com/wp-content/uploads/2025/11/4-1-1024x576.jpg",
    tip: "Лучше приезжать в сухую погоду.",
  },
];

let CATALOG_SPOTS = [...DEFAULT_CATALOG_SPOTS];

const state = {
  routeTitle: "Индивидуальный маршрут",
  places: [],
  catalogSelectedCategories: [],
  mode: null,
  language: "ru",
  selectedAddons: [],
  blockedDates: [],
  requiredPlacesMin: MIN_ROUTE_PLACES,
  presetPricing: null,
};

const placesEl = document.getElementById("places");
const summaryEl = document.getElementById("summary");
const addSekumpulRouteBtn = document.getElementById("addSekumpulRoute");
const addUbudClassicRouteBtn = document.getElementById("addUbudClassicRoute");
const addKintamaniRouteBtn = document.getElementById("addKintamaniRoute");
const addEastBaliRouteBtn = document.getElementById("addEastBaliRoute");
const addNorthSideRouteBtn = document.getElementById("addNorthSideRoute");
const addIjenRouteBtn = document.getElementById("addIjenRoute");
const addJavaGrandRouteBtn = document.getElementById("addJavaGrandRoute");
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
const addonDroneEl = document.getElementById("addonDrone");
const addonPortTransferEl = document.getElementById("addonPortTransfer");
const travelDateEl = document.getElementById("travelDate");
const availabilityHintEl = document.getElementById("availabilityHint");
const langRuBtn = document.getElementById("langRuBtn");
const langEnBtn = document.getElementById("langEnBtn");
const heroBadgeEl = document.getElementById("heroBadge");
const heroLeadEl = document.getElementById("heroLead");
const formatStepTitleEl = document.getElementById("formatStepTitle");
const readyModeTitleEl = document.getElementById("readyModeTitle");
const readyModeDescEl = document.getElementById("readyModeDesc");
const customModeTitleEl = document.getElementById("customModeTitle");
const customModeDescEl = document.getElementById("customModeDesc");
const addonsTitleEl = document.getElementById("addonsTitle");
const addonDroneTextEl = document.getElementById("addonDroneText");
const addonPortTransferTextEl = document.getElementById("addonPortTransferText");

const formatMoney = (value) =>
  `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} IDR`;

function t(key, params = {}) {
  const dict = I18N[state.language] || I18N.ru;
  let template = dict[key] || I18N.ru[key] || key;
  if (typeof template !== "string") return String(template);
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    template = template.replace(`{${paramKey}}`, String(paramValue));
  });
  return template;
}

function getCategoryLabel(key) {
  return (
    (I18N[state.language] && I18N[state.language].categories[key]) ||
    I18N.ru.categories[key] ||
    key
  );
}

function getRegionLabel(key) {
  return (
    (I18N[state.language] && I18N[state.language].regions[key]) ||
    I18N.ru.regions[key] ||
    key
  );
}

function getCustomRouteTitle() {
  return state.language === "en" ? "Custom route" : "Индивидуальный маршрут";
}

function getReadyRouteTitle() {
  return state.language === "en" ? "Ready route" : "Готовый маршрут";
}

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

function getRequiredPlacesMin() {
  const value = Number(state.requiredPlacesMin);
  if (!Number.isFinite(value) || value < 1) return MIN_ROUTE_PLACES;
  return Math.round(value);
}

function getPricing(places, selectedAddons = state.selectedAddons, presetPricing = state.presetPricing) {
  const extraPlaces = Math.max(0, places.length - INCLUDED_SPOTS);
  const surcharge = extraPlaces * EXTRA_SPOT_SURCHARGE;
  const ticketTotal = places.reduce((acc, place) => acc + place.ticket, 0);
  const basePrice =
    presetPricing && Number.isFinite(Number(presetPricing.baseOverride))
      ? Number(presetPricing.baseOverride)
      : BASE_PRICE;
  const mandatoryExtras = Array.isArray(presetPricing?.mandatoryExtras)
    ? presetPricing.mandatoryExtras
        .filter((item) => item && Number.isFinite(Number(item.price)))
        .map((item) => ({ label: String(item.label || "").trim(), price: Number(item.price) }))
    : [];
  const mandatoryExtrasTotal = mandatoryExtras.reduce((acc, item) => acc + item.price, 0);
  const addonsTotal = selectedAddons.reduce((acc, addonId) => {
    return acc + (ADDON_OPTIONS[addonId]?.price || 0);
  }, 0);
  const routeOnly = basePrice + surcharge + addonsTotal + mandatoryExtrasTotal;
  return {
    base: basePrice,
    includedSpots: INCLUDED_SPOTS,
    extraPlaces,
    surcharge,
    mandatoryExtras,
    mandatoryExtrasTotal,
    addons: selectedAddons,
    addonsTotal,
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
    createTag(getRegionLabel(place.region || "other")),
    createTag(`${place.duration} ч`),
    createTag(`Билет: ${formatMoney(place.ticket)}`)
  );

  const desc = document.createElement("p");
  desc.className = "small";
  desc.textContent =
    place.description || (state.language === "en" ? "No description" : "Описание не добавлено");

  const tip = document.createElement("p");
  tip.className = "small";
  tip.textContent =
    place.tip ? `${state.language === "en" ? "Tip" : "Совет"}: ${place.tip}` : "";

  const del = document.createElement("button");
  del.type = "button";
  del.className = "btn btn-danger";
  del.textContent = t("removePlace");
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
  state.routeTitle = getCustomRouteTitle();
  state.requiredPlacesMin = MIN_ROUTE_PLACES;
  state.presetPricing = null;
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
  allBtn.textContent = state.language === "en" ? "Select all" : "Выбрать все";
  allBtn.addEventListener("click", () => {
    state.catalogSelectedCategories = [...SELECTABLE_CATEGORIES];
    renderCatalog();
  });

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "filter-chip";
  clearBtn.textContent = state.language === "en" ? "Reset" : "Сбросить";
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
    btn.textContent = getCategoryLabel(category);
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
    createTag(getCategoryLabel(spot.category || "all")),
    createTag(getRegionLabel(spot.region || "other")),
    createTag(`${spot.duration} ч`),
    createTag(`Билет: ${formatMoney(spot.ticket)}`)
  );

  const desc = document.createElement("p");
  desc.className = "small";
  desc.textContent = spot.description;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = t("addToRoute");
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
        ? `${t("selectedCategories")}: ${selectedCount}`
        : t("selectAtLeastCategory");
  }

  if (!state.catalogSelectedCategories.length) {
    const hint = document.createElement("p");
    hint.className = "small";
    hint.textContent = t("chooseCategoriesHint");
    catalogCardsEl.append(hint);
    return;
  }

  const filtered = CATALOG_SPOTS.filter((spot) => {
    return state.catalogSelectedCategories.includes(spot.category);
  });

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "small";
    empty.textContent = t("noPlacesInCategory");
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

  const basePriceLabel =
    state.presetPricing && Number.isFinite(Number(state.presetPricing.baseOverride))
      ? state.language === "en"
        ? "Tour base price"
        : "Базовая цена тура"
      : t("basePrice");
  const addonsText = pricing.addons.length
    ? pricing.addons
        .map((addonId) => {
          if (addonId === "drone") return t("addonDroneText");
          if (addonId === "port_transfer") return t("addonPortTransferText");
          return addonId;
        })
        .join(", ")
    : t("none");
  const mandatoryExtrasText = pricing.mandatoryExtras.length
    ? pricing.mandatoryExtras.map((item) => item.label || formatMoney(item.price)).join(", ")
    : t("none");

  const topRows = [
    [state.language === "en" ? "Tour" : "Тур", state.routeTitle],
    [t("daysAuto"), `${dayCount}`],
    [t("locations"), `${state.places.length}`],
    [t("totalTime"), `${totalHours.toFixed(1)} ч`],
    [t("pricingFormat"), t("pricePerCar")],
    [basePriceLabel, formatMoney(pricing.base)],
    [
      `${t("extraPlacesLabel")} (${pricing.extraPlaces})`,
      formatMoney(pricing.surcharge),
    ],
    [t("addonsLabel"), `${addonsText} (${formatMoney(pricing.addonsTotal)})`],
    [
      state.language === "en" ? "Mandatory trip extras" : "Обязательные доп.расходы",
      `${mandatoryExtrasText} (${formatMoney(pricing.mandatoryExtrasTotal)})`,
    ],
    [
      state.language === "en"
        ? `Route subtotal (${INCLUDED_SPOTS}+ places)`
        : `Итог цены за ${INCLUDED_SPOTS} мест + дополнительные точки`,
      formatMoney(pricing.routeOnly),
    ],
    [t("ticketTotal"), formatMoney(pricing.ticketTotal)],
    [t("totalForClient"), formatMoney(pricing.total)],
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
  daysRuleNote.textContent = state.language === "en"
    ? "Days are calculated automatically: if a day exceeds 14 hours, remaining spots move to the next day."
    : "Дни считаются автоматически: если длительность дня превышает 14 часов, оставшиеся локации переносятся на следующий день.";
  summaryEl.append(daysRuleNote);

  itinerary.forEach((day, index) => {
    const box = document.createElement("div");
    box.className = "day-box";

    const placesText = day.places.length
      ? day.places.map((place) => place.name).join(" -> ")
      : (state.language === "en" ? "No spots added yet" : "Точки пока не добавлены");

    const title = document.createElement("h3");
    title.textContent = `${t("day")} ${index + 1}`;

    const route = document.createElement("p");
    route.className = "small";
    route.textContent = placesText;

    const stats = document.createElement("p");
    stats.className = "small";
    stats.textContent = `${t("timeAndTickets")}: ${day.hours.toFixed(1)} ч | ${t("tickets")}: ${formatMoney(day.tickets)}`;

    box.append(title, route, stats);
    summaryEl.append(box);
  });

  const tips = state.places
    .map((place) => place.tip)
    .filter(Boolean)
    .slice(0, 6);

  const staticTips = [
    t("recommendDeparture"),
  ];
  if (pricing.mandatoryExtras.length) {
    pricing.mandatoryExtras.forEach((item) => {
      staticTips.push(
        `${
          state.language === "en" ? "Mandatory extra" : "Обязательная доплата"
        }: ${item.label} (${formatMoney(item.price)})`
      );
    });
  }
  const allTips = [...staticTips, ...tips];

  if (allTips.length) {
    const tipsBox = document.createElement("div");
    tipsBox.className = "day-box";

    const title = document.createElement("h3");
    title.textContent = t("usefulTips");

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
    empty.textContent = t("emptyRoute");
    placesEl.append(empty);
    return;
  }

  state.places.forEach((place, index) => {
    placesEl.append(createPlaceCard(place, index));
  });
}

function isBlockedDate(dateValue) {
  if (!dateValue) return false;
  return state.blockedDates.includes(dateValue);
}

function renderAvailability() {
  if (!availabilityHintEl || !travelDateEl) return;
  const dateValue = travelDateEl.value;
  if (!dateValue) {
    availabilityHintEl.textContent = "";
    return;
  }

  const blocked = isBlockedDate(dateValue);
  availabilityHintEl.textContent = blocked ? t("unavailableDate") : t("availableDate");
  availabilityHintEl.classList.remove("notice-ok", "notice-error");
  availabilityHintEl.classList.add(blocked ? "notice-error" : "notice-ok");
}

function renderRouteMinInfo() {
  if (!selectedCountInfoEl) return;
  const count = state.places.length;
  const requiredMin = getRequiredPlacesMin();
  const missing = Math.max(0, requiredMin - count);
  const dateBlocked = travelDateEl ? isBlockedDate(travelDateEl.value) : false;
  const readyToSend = count >= requiredMin && !dateBlocked;

  selectedCountInfoEl.textContent = t("selectedPlacesCounter", {
    count,
    min: requiredMin,
  });
  selectedCountInfoEl.classList.remove("notice-ok", "notice-error");
  selectedCountInfoEl.classList.add(count >= requiredMin ? "notice-ok" : "notice-error");

  if (leadSubmitBtn) {
    leadSubmitBtn.disabled = !readyToSend;
  }

  if (leadSubmitHintEl) {
    if (dateBlocked) {
      leadSubmitHintEl.textContent = t("unavailableDate");
    } else {
      leadSubmitHintEl.textContent = readyToSend
        ? t("minReady")
        : t("chooseMorePlaces", { count: missing });
    }
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
      modeHintEl.textContent = t("chooseFormatHint");
    } else if (isReady) {
      modeHintEl.textContent = t("readyFormatHint");
    } else {
      modeHintEl.textContent = t("customFormatHint");
    }
  }
}

function renderAddons() {
  if (addonDroneEl) addonDroneEl.checked = state.selectedAddons.includes("drone");
  if (addonPortTransferEl) addonPortTransferEl.checked = state.selectedAddons.includes("port_transfer");
}

function renderLanguage() {
  if (langRuBtn) langRuBtn.classList.toggle("active", state.language === "ru");
  if (langEnBtn) langEnBtn.classList.toggle("active", state.language === "en");

  if (heroBadgeEl) heroBadgeEl.textContent = t("heroBadge");
  if (heroLeadEl) heroLeadEl.textContent = t("heroLead");
  if (formatStepTitleEl) formatStepTitleEl.textContent = t("stepFormatTitle");
  if (readyModeTitleEl) readyModeTitleEl.textContent = t("readyModeTitle");
  if (readyModeDescEl) readyModeDescEl.textContent = t("readyModeDesc");
  if (customModeTitleEl) customModeTitleEl.textContent = t("customModeTitle");
  if (customModeDescEl) customModeDescEl.textContent = t("customModeDesc");
  if (addonsTitleEl) addonsTitleEl.textContent = t("addonsTitle");
  if (addonDroneTextEl) {
    addonDroneTextEl.textContent = `${t("addonDroneText")} (+${formatMoney(ADDON_OPTIONS.drone.price)})`;
  }
  if (addonPortTransferTextEl) {
    addonPortTransferTextEl.textContent = `${t("addonPortTransferText")} (+${formatMoney(ADDON_OPTIONS.port_transfer.price)})`;
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
  const isReadyForContacts = state.places.length >= getRequiredPlacesMin();

  setStepState(step1El, { active: !hasMode, done: hasMode });
  setStepState(step2El, { active: hasMode && !isReadyForContacts, done: isReadyForContacts });
  setStepState(step3El, { active: isReadyForContacts, done: false });
}

function selectMode(mode) {
  state.mode = mode;
  if (mode === "custom") {
    state.routeTitle = getCustomRouteTitle();
    state.requiredPlacesMin = MIN_ROUTE_PLACES;
    state.presetPricing = null;
  }
  render();
}

function render() {
  renderLanguage();
  renderAddons();
  renderMode();
  renderSteps();
  if (state.mode === "custom") {
    renderCatalog();
  }
  renderPlaces();
  renderSummary();
  renderAvailability();
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
        const merged = new Map();
        normalized.forEach((spot) => {
          merged.set(`${spot.name}::${spot.region}`, spot);
        });
        DEFAULT_CATALOG_SPOTS.map(normalizeSpot)
          .filter(Boolean)
          .forEach((spot) => {
            const key = `${spot.name}::${spot.region}`;
            if (!merged.has(key)) merged.set(key, spot);
          });
        CATALOG_SPOTS = [...merged.values()];
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

async function syncAvailability() {
  try {
    const response = await fetch("/api/availability");
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) return;
    if (Array.isArray(data.blocked_dates)) {
      state.blockedDates = data.blocked_dates;
      renderAvailability();
      renderRouteMinInfo();
    }
  } catch (error) {
    // Availability is optional; keep submit flow if API is unavailable.
  }
}

function showLeadResult(message, isError = false) {
  leadResultEl.textContent = message;
  leadResultEl.classList.remove("notice-ok", "notice-error");
  leadResultEl.classList.add(isError ? "notice-error" : "notice-ok");
}

function buildLeadPayload() {
  const routeDays = buildItinerary(getSegments(state.places)).length;
  const requiredPlacesMin = getRequiredPlacesMin();
  const peopleCount = Number(document.getElementById("customerPeople").value) || 1;
  const noteRaw = document.getElementById("customerNote").value.trim();
  const peoplePrefix = state.language === "en" ? "People" : "Людей";
  const noteWithPeople = noteRaw
    ? `${peoplePrefix}: ${peopleCount}. ${noteRaw}`
    : `${peoplePrefix}: ${peopleCount}.`;
  const pricing = getPricing(state.places);
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
      required_places_min: requiredPlacesMin,
      addons: state.selectedAddons,
      preset_pricing: state.presetPricing,
      places: state.places,
    },
    pricing,
    source: "telegram-miniapp",
    language: state.language,
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
    addons: payload.route.addons,
    required_places_min: payload.route.required_places_min,
    preset_pricing: payload.route.preset_pricing,
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

function applyNamedPreset(config) {
  const routeTitle = String(config?.routeTitle || "").trim();
  const placeNames = Array.isArray(config?.placeNames) ? config.placeNames : [];
  const placeOverrides =
    config?.placeOverrides && typeof config.placeOverrides === "object"
      ? config.placeOverrides
      : {};
  const places = placeNames
    .map((name) => buildPlaceFromCatalogName(name))
    .filter(Boolean)
    .map((place) => {
      const override = placeOverrides[place.name];
      if (!override || typeof override !== "object") return place;
      return {
        ...place,
        ...override,
      };
    });

  if (!places.length || !routeTitle) return;

  const requiredPlacesMinRaw = Number(config?.requiredPlacesMin);
  const requiredPlacesMin =
    Number.isFinite(requiredPlacesMinRaw) && requiredPlacesMinRaw > 0
      ? Math.round(requiredPlacesMinRaw)
      : Math.min(MIN_ROUTE_PLACES, places.length);

  state.mode = "ready";
  state.routeTitle = routeTitle;
  state.requiredPlacesMin = requiredPlacesMin;
  state.presetPricing = config?.presetPricing || null;
  state.places = places.map((place) => ({ ...place, id: newId() }));
  render();
}

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (travelDateEl && isBlockedDate(travelDateEl.value)) {
      showLeadResult(t("unavailableDate"), true);
      return;
    }

    const requiredMin = getRequiredPlacesMin();
    if (state.places.length < requiredMin) {
      showLeadResult(t("minPlacesError", { min: requiredMin }), true);
      return;
    }

    const payload = buildLeadPayload();
    if (!payload.customer.name || !payload.customer.phone) {
      showLeadResult(t("fillContact"), true);
      return;
    }
    if (!payload.customer.people_count || payload.customer.people_count < 1) {
      showLeadResult(t("invalidPeople"), true);
      return;
    }

    showLeadResult(t("leadSaving"));

    try {
      const result = await saveLead(payload);
      sendLeadToTelegram(payload, result.lead_id);
      showLeadResult(t("leadSaved", { id: result.lead_id }));
      leadForm.reset();
      const peopleEl = document.getElementById("customerPeople");
      if (peopleEl) peopleEl.value = "2";
      state.selectedAddons = [];
      render();
    } catch (error) {
      showLeadResult(error.message, true);
    }
  });
}

if (addSekumpulRouteBtn) {
  addSekumpulRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Секумпул и Северные жемчужины",
      placeNames: [
        "Sekumpul Waterfall",
        "Sekumpul Waterfall View Point",
        "Aling-Aling Waterfall",
        "Puncak Wanagiri",
        "Bali Handara Gate",
      ],
    });
  });
}

if (addUbudClassicRouteBtn) {
  addUbudClassicRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Убуд Классика",
      placeNames: [
        "Tegalalang Rice Terrace",
        "Tirta Empul",
        "Gunung Kawi Tampaksiring",
        "Taman Dedari",
        "Kanto Lampo Waterfall",
      ],
    });
  });
}

if (addKintamaniRouteBtn) {
  addKintamaniRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Кинтамани - вулканы и рассвет",
      placeNames: [
        "Pinggan Sunrise Point",
        "Mount Batur Viewpoint",
        "Batur Natural Hot Spring",
        "Paperhills",
        "Penglipuran Village",
      ],
    });
  });
}

if (addNorthSideRouteBtn) {
  addNorthSideRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Север Бали - озера и водопады",
      placeNames: [
        "Sekumpul Waterfall",
        "Banyu Wana Amertha Waterfall",
        "Puncak Wanagiri",
        "Bali Handara Gate",
        "Fresh Strawberry (дегустация клубничного вина)",
      ],
    });
  });
}

if (addEastBaliRouteBtn) {
  addEastBaliRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Восток Бали - храмы и океан",
      placeNames: [
        "Penataran Agung Lempuyang Temple",
        "LAHANGAN SWEET",
        "Tulamben Beach Viewpoint (USAT Liberty Snorkeling)",
        "Gembleng Waterfall",
        "Bali Chocolate Factory",
      ],
    });
  });
}

if (addIjenRouteBtn) {
  addIjenRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Иджен Экспресс (Ява)",
      placeNames: [
        "1911 Cafe & Resto",
        "Pondok Is Oke - Villas & Bungalows",
        "Pegunungan Ijen",
      ],
      placeOverrides: {
        "Pegunungan Ijen": { ticket: 135_000 },
      },
      requiredPlacesMin: 3,
      presetPricing: {
        baseOverride: 4_500_000,
        mandatoryExtras: [
          { label: "Респиратор", price: 50_000 },
          { label: "Отель", price: 125_000 },
        ],
      },
    });
  });
}

if (addJavaGrandRouteBtn) {
  addJavaGrandRouteBtn.addEventListener("click", () => {
    applyNamedPreset({
      routeTitle: "Ява Гранд Тур - Иджен + Бромо + 2 водопада",
      placeNames: [
        "1911 Cafe & Resto",
        "Pondok Is Oke - Villas & Bungalows",
        "Pegunungan Ijen",
        "Kawah Gunung Bromo",
        "Bromo Escapes",
        "Tumpak Sewu Waterfall",
        "Air Terjun Kabut Pelangi",
      ],
      placeOverrides: {
        "Pegunungan Ijen": { ticket: 135_000 },
        "Kawah Gunung Bromo": { ticket: 100_000 },
      },
      presetPricing: {
        baseOverride: 6_500_000,
        mandatoryExtras: [
          { label: "2 отеля", price: 300_000 },
          { label: "Респиратор Иджен", price: 50_000 },
          { label: "Справки о здоровье", price: 15_000 },
        ],
      },
    });
  });
}

function syncAddonsFromUI() {
  const selected = [];
  if (addonDroneEl && addonDroneEl.checked) selected.push("drone");
  if (addonPortTransferEl && addonPortTransferEl.checked) selected.push("port_transfer");
  state.selectedAddons = selected;
  renderSummary();
}

function applyLanguage(lang) {
  const prevLanguage = state.language;
  state.language = lang === "en" ? "en" : "ru";
  if (
    state.routeTitle === (prevLanguage === "en" ? "Custom route" : "Индивидуальный маршрут")
  ) {
    state.routeTitle = getCustomRouteTitle();
  }
  if (
    state.routeTitle === (prevLanguage === "en" ? "Ready route" : "Готовый маршрут")
  ) {
    state.routeTitle = getReadyRouteTitle();
  }
  if (state.language === "en") {
    if (step1El) step1El.querySelector(".step-text").textContent = "Format";
    if (step2El) step2El.querySelector(".step-text").textContent = "Locations";
    if (step3El) step3El.querySelector(".step-text").textContent = "Contacts";
  } else {
    if (step1El) step1El.querySelector(".step-text").textContent = "Формат";
    if (step2El) step2El.querySelector(".step-text").textContent = "Локации";
    if (step3El) step3El.querySelector(".step-text").textContent = "Контакты";
  }
  render();
}

if (addonDroneEl) addonDroneEl.addEventListener("change", syncAddonsFromUI);
if (addonPortTransferEl) addonPortTransferEl.addEventListener("change", syncAddonsFromUI);

if (travelDateEl) {
  travelDateEl.addEventListener("change", () => {
    renderAvailability();
    renderRouteMinInfo();
  });
}

if (langRuBtn) langRuBtn.addEventListener("click", () => applyLanguage("ru"));
if (langEnBtn) langEnBtn.addEventListener("click", () => applyLanguage("en"));

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

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    state.routeTitle =
      state.mode === "ready" ? getReadyRouteTitle() : getCustomRouteTitle();
    state.places = [];
    state.requiredPlacesMin = MIN_ROUTE_PLACES;
    state.presetPricing = null;
    render();
  });
}

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

const telegramLang = String(getTelegramUser()?.language_code || "").toLowerCase();
if (telegramLang.startsWith("en")) {
  state.language = "en";
  state.routeTitle = "Custom route";
}

render();
syncCatalogSpots();
syncAvailability();
