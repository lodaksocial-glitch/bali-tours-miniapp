const BASE_PRICE = 1_200_000;
const OTHER_REGION_SURCHARGE = 200_000;
const INCLUDED_BALI_SPOTS = 5;
const TRAVEL_SAME_REGION_HOURS = 0.75;
const TRAVEL_DIFF_REGION_HOURS = 2;

const REGION_LABELS = {
  bali: "Бали",
  nusa_penida: "Нуса Пенида",
  java: "Ява",
  other: "Другое",
};

const state = {
  days: 1,
  driverName: "Авторский тур с водителем",
  places: [],
};

const form = document.getElementById("placeForm");
const placesEl = document.getElementById("places");
const summaryEl = document.getElementById("summary");
const daysEl = document.getElementById("days");
const driverNameEl = document.getElementById("driverName");
const addPresetBtn = document.getElementById("addPreset");
const clearAllBtn = document.getElementById("clearAll");
const leadForm = document.getElementById("leadForm");
const leadResultEl = document.getElementById("leadResult");

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

function getOtherRegionCount(places) {
  return places.filter((place) => place.region !== "bali").length;
}

function getPricing(places) {
  const otherRegionCount = getOtherRegionCount(places);
  const surcharge = otherRegionCount * OTHER_REGION_SURCHARGE;
  const ticketTotal = places.reduce((acc, place) => acc + place.ticket, 0);
  return {
    base: BASE_PRICE,
    surcharge,
    ticketTotal,
    total: BASE_PRICE + surcharge + ticketTotal,
    otherRegionCount,
    baliCount: places.filter((place) => place.region === "bali").length,
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

function buildItinerary(segments, days) {
  const result = Array.from({ length: days }, () => ({
    places: [],
    hours: 0,
    tickets: 0,
  }));
  if (!segments.length) return result;

  const totalHours = segments.reduce((acc, place) => acc + place.segmentHours, 0);
  const targetPerDay = totalHours / days;

  let dayIndex = 0;
  for (const segment of segments) {
    const current = result[dayIndex];
    const hasPlaces = current.places.length > 0;
    const nextHours = current.hours + segment.segmentHours;

    if (dayIndex < days - 1 && hasPlaces && nextHours > targetPerDay * 1.2) {
      dayIndex += 1;
    }

    result[dayIndex].places.push(segment);
    result[dayIndex].hours += segment.segmentHours;
    result[dayIndex].tickets += segment.ticket;
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

function renderSummary() {
  const segments = getSegments(state.places);
  const itinerary = buildItinerary(segments, state.days);
  const pricing = getPricing(state.places);
  const totalHours = segments.reduce((acc, place) => acc + place.segmentHours, 0);

  const baliLimitInfo =
    pricing.baliCount > INCLUDED_BALI_SPOTS
      ? `Мест на Бали: ${pricing.baliCount} (в базовой цене включено ${INCLUDED_BALI_SPOTS})`
      : `Мест на Бали: ${pricing.baliCount} из ${INCLUDED_BALI_SPOTS} включенных`;

  summaryEl.innerHTML = "";

  const topRows = [
    ["Тур", state.driverName],
    ["Дней", `${state.days}`],
    ["Локаций", `${state.places.length}`],
    ["Общее время (с переездами)", `${totalHours.toFixed(1)} ч`],
    ["Базовый пакет", formatMoney(pricing.base)],
    [
      `Доплата за точки вне Бали (${pricing.otherRegionCount} шт.)`,
      formatMoney(pricing.surcharge),
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

  const limitNote = document.createElement("p");
  limitNote.className = "small";
  limitNote.textContent = baliLimitInfo;
  summaryEl.append(limitNote);

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

  if (tips.length) {
    const tipsBox = document.createElement("div");
    tipsBox.className = "day-box";

    const title = document.createElement("h3");
    title.textContent = "Полезные советы";

    const list = document.createElement("ul");
    list.className = "small";
    tips.forEach((tip) => {
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

function render() {
  renderPlaces();
  renderSummary();
  setupTelegramButton();
}

function showLeadResult(message, isError = false) {
  leadResultEl.textContent = message;
  leadResultEl.classList.remove("notice-ok", "notice-error");
  leadResultEl.classList.add(isError ? "notice-error" : "notice-ok");
}

function buildLeadPayload() {
  return {
    customer: {
      name: document.getElementById("customerName").value.trim(),
      phone: document.getElementById("customerPhone").value.trim(),
      travel_date: document.getElementById("travelDate").value,
      note: document.getElementById("customerNote").value.trim(),
    },
    route: {
      days: state.days,
      driver_name: state.driverName,
      places: state.places,
    },
    pricing: getPricing(state.places),
    source: (document.getElementById("leadSource").value || "miniapp").trim(),
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
    travel_date: payload.customer.travel_date,
    days: payload.route.days,
    places_count: payload.route.places.length,
    total_price: payload.pricing.total,
    route_preview: payload.route.places.map((item) => item.name).slice(0, 6),
  };

  tg.sendData(JSON.stringify(summary));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const place = {
    id: newId(),
    name: document.getElementById("name").value.trim(),
    region: document.getElementById("region").value,
    duration: Number(document.getElementById("duration").value),
    ticket: Number(document.getElementById("ticket").value),
    description: document.getElementById("description").value.trim(),
    image: document.getElementById("image").value.trim(),
    tip: document.getElementById("tip").value.trim(),
  };

  state.places.push(place);
  form.reset();
  document.getElementById("duration").value = "2";
  document.getElementById("ticket").value = "50000";
  document.getElementById("region").value = "bali";
  render();
});

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!state.places.length) {
    showLeadResult("Сначала добавьте хотя бы 1 место в маршрут", true);
    return;
  }

  const payload = buildLeadPayload();
  if (!payload.customer.name || !payload.customer.phone) {
    showLeadResult("Заполните имя и телефон клиента", true);
    return;
  }

  showLeadResult("Сохраняю заявку...");

  try {
    const result = await saveLead(payload);
    sendLeadToTelegram(payload, result.lead_id);
    showLeadResult(`Заявка #${result.lead_id} сохранена и отправлена в Telegram`);
    leadForm.reset();
    document.getElementById("leadSource").value = "telegram-miniapp";
  } catch (error) {
    showLeadResult(error.message, true);
  }
});

daysEl.addEventListener("change", (event) => {
  state.days = Number(event.target.value);
  render();
});

driverNameEl.addEventListener("input", (event) => {
  state.driverName = event.target.value.trim() || "Авторский тур с водителем";
  render();
});

addPresetBtn.addEventListener("click", () => {
  if (state.places.length) return;

  const presets = [
    {
      name: "Uluwatu Temple",
      region: "bali",
      duration: 2,
      ticket: 50000,
      description: "Храм на скале и закат.",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80",
      tip: "Приезжайте к 16:30 на закат и танец кечак.",
    },
    {
      name: "Tanah Lot",
      region: "bali",
      duration: 1.5,
      ticket: 60000,
      description: "Один из самых фотогеничных храмов Бали.",
      image:
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      tip: "Лучший свет утром или на закате.",
    },
    {
      name: "Tegalalang Rice Terrace",
      region: "bali",
      duration: 2,
      ticket: 25000,
      description: "Рисовые террасы и панорамные виды.",
      image:
        "https://images.unsplash.com/photo-1598019138951-3261429d6fce?auto=format&fit=crop&w=1200&q=80",
      tip: "Берите нескользящую обувь.",
    },
    {
      name: "Tirta Empul",
      region: "bali",
      duration: 2,
      ticket: 50000,
      description: "Священные источники и ритуал очищения.",
      image:
        "https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=1200&q=80",
      tip: "Нужен саронг, можно взять на месте.",
    },
    {
      name: "Ubud Center",
      region: "bali",
      duration: 2.5,
      ticket: 0,
      description: "Кафе, арт-рынок и атмосферные улочки.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      tip: "Запланируйте ужин в центре Убуда.",
    },
  ];

  state.places = presets.map((place) => ({ ...place, id: newId() }));
  render();
});

clearAllBtn.addEventListener("click", () => {
  state.places = [];
  render();
});

function setupTelegramButton() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();
  tg.MainButton.setText("Отправить маршрут в чат");
  tg.MainButton.show();

  tg.MainButton.offClick(sendRouteToTelegramQuick);
  tg.MainButton.onClick(sendRouteToTelegramQuick);
}

function sendRouteToTelegramQuick() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const payload = {
    route_preview: state.places.map((item) => item.name).slice(0, 8),
    days: state.days,
    total_price: getPricing(state.places).total,
    places_count: state.places.length,
  };

  tg.sendData(JSON.stringify(payload));
}

render();
