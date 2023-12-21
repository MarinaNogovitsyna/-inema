import { openSessionPopup, getMinutes } from "./addsession.js";

const allHalls = document.querySelector(".all-halls");

export function getAllData() {
  return fetch("https://shfe-diplom.neto-server.ru/alldata")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getAllHalls() {
  allHalls.innerHTML = "";
  getAllData().then((data) => {
    console.log(data);
    createAllHalls(data);
    createHallsForSelection();
    createHallsForChangePrice();
    createAllSession();
    createHallsForSales();
  });
}

getAllHalls();

function createAllHalls(data) {
  let halls = data.result.halls;
  halls.map((el) => {
    let hall = document.createElement("li");
    hall.id = `hall-${el.id}`;
    hall.innerHTML = `<span>- ${el.hall_name}</span>`;

    let basket = document.createElement("img");
    basket.src = "/img/basket.png";
    basket.className = "basket";
    basket.addEventListener("click", () =>
      deleteHall(basket.parentElement, el.id)
    );

    hall.insertAdjacentElement("beforeend", basket);

    allHalls.insertAdjacentElement("beforeend", hall);
  });
}

async function deleteHall(el, id) {
  el.remove();
  await fetch(`https://shfe-diplom.neto-server.ru/hall/${id}`, {
    method: "DELETE",
  }).then((response) => response.json());
  await createHallsForSelection();
  await createHallsForChangePrice();
  await createAllSession();
  await createHallsForSales();
}

// Конфигурация залов
const allHallsForSelection = document.querySelector(
  ".hall-configuration__all-halls"
);
let activeHallId;

function createHallsForSelection() {
  allHallsForSelection.innerHTML = "";
  getAllData().then((data) => {
    const allHalls = data.result.halls;
    allHalls.map((el) => {
      const hall = document.createElement("div");
      hall.textContent = el.hall_name;
      hall.classList.add("hall-configuration__selection");
      hall.id = `selection-hall-${el.id}`;
      hall.addEventListener("click", () => changeSelectionHall(hall.id));
      hall.dataset.id = el.id;
      hall.dataset.rows = el.hall_rows;
      hall.dataset.places = el.hall_places;

      allHallsForSelection.insertAdjacentElement("beforeend", hall);
      allHallsForSelection.firstChild.classList.add(
        "hall-configuration__selection-active"
      );
      activeHallId = allHallsForSelection.firstChild.id;

      getHallSize();
      createHallScheme(allHallsForSelection.firstChild.dataset.id);
    });
  });
}

function changeSelectionHall(id) {
  const allHalls = Array.from(allHallsForSelection.children);
  allHalls.map((el) => {
    if (
      el.id === id &&
      !el.classList.contains("hall-configuration__selection-active")
    ) {
      el.classList.add("hall-configuration__selection-active");
      activeHallId = el.id;
      createHallScheme(el.dataset.id);
    } else if (el.id !== id) {
      el.classList.remove("hall-configuration__selection-active");
    }
  });
  getHallSize();
}

//Количество мест по умолчанию
const numberRowsInput = document.querySelector(".number-rows__input");
const numberSeatsInput = document.querySelector(".number-seats__input");

function getHallSize() {
  const activeHall = document.getElementById(activeHallId);
  numberRowsInput.placeholder = activeHall.dataset.rows;
  numberSeatsInput.placeholder = activeHall.dataset.places;
}

// Создание cхемы зала
let hallScheme = document.querySelector(".hall-scheme__hall");

function createHallScheme(id) {
  getAllData().then((data) => {
    hallScheme.innerHTML = "";
    const activeHall = data.result.halls.find((el) => el.id == id);
    const config = activeHall.hall_config;
    for (let i = 0; i < config.length; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("hall-scheme__row");
      for (let j = 0; j < config[i].length; j++) {
        const placeDiv = document.createElement("div");
        placeDiv.classList.add(`${config[i][j]}`);
        placeDiv.dataset.type = `${config[i][j]}`;
        placeDiv.dataset.row = i + 1;
        placeDiv.dataset.place = j + 1;
        placeDiv.addEventListener("click", () => changeTypePlace(placeDiv));
        rowDiv.appendChild(placeDiv);
      }
      hallScheme.appendChild(rowDiv);
    }
  });
}

// Изменение количества рядов и кресел
numberRowsInput.addEventListener("change", () => {
  const activeHall = document.querySelector(
    ".hall-configuration__selection-active"
  );
  activeHall.dataset.rows = numberRowsInput.value;
  createHallSchemeWithRowOrPlace(
    activeHall.dataset.rows,
    activeHall.dataset.places
  );
});

numberSeatsInput.addEventListener("change", () => {
  const activeHall = document.querySelector(
    ".hall-configuration__selection-active"
  );
  activeHall.dataset.places = numberSeatsInput.value;
  createHallSchemeWithRowOrPlace(
    activeHall.dataset.rows,
    activeHall.dataset.places
  );
});

function createHallSchemeWithRowOrPlace(rows, places) {
  hallScheme.innerHTML = "";
  for (let i = 0; i < +rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("hall-scheme__row");
    for (let j = 0; j < +places; j++) {
      const placeDiv = document.createElement("div");
      placeDiv.classList.add(`standart`);
      placeDiv.dataset.type = `standart`;
      placeDiv.dataset.row = i + 1;
      placeDiv.dataset.place = j + 1;
      placeDiv.addEventListener("click", () => changeTypePlace(placeDiv));
      rowDiv.appendChild(placeDiv);
    }
    hallScheme.appendChild(rowDiv);
  }
}

// Изменение цвета места
function changeTypePlace(place) {
  const types = ["standart", "vip", "disabled"];
  const currentType = place.dataset.type;
  const currentIndex = types.indexOf(currentType);
  const nextIndex = (currentIndex + 1) % types.length;
  const nextType = types[nextIndex];

  place.classList.remove(currentType);
  place.classList.add(nextType);
  place.dataset.type = nextType;
}

// Отмена изменений зала
const hallConfigurationCancel = document.querySelector(
  ".hall-configuration__button__cancel"
);
hallConfigurationCancel.addEventListener("click", () => {
  createHallsForSelection();
  numberRowsInput.value = "";
  numberSeatsInput.value = "";
});

// Сохранение конфугурации посадочных мест
const btnSaveConfigHall = document.querySelector(
  ".hall-configuration__button__save"
);

btnSaveConfigHall.addEventListener("click", () => fetchConfigHall());

function fetchConfigHall() {
  const activeHall = document.querySelector(
    ".hall-configuration__selection-active"
  );
  const hallId = activeHall.dataset.id;
  const rowCount = activeHall.dataset.rows;
  const placeCount = activeHall.dataset.places;
  const config = createConfigArray();
  console.log(hallId, rowCount, placeCount, config);

  const params = new FormData();
  params.set("rowCount", rowCount);
  params.set("placeCount", placeCount);
  params.set("config", JSON.stringify(config));
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "POST",
    body: params,
  }).then((response) => response.json());
}

function createConfigArray() {
  const arr = [];
  const rows = Array.from(document.querySelectorAll(".hall-scheme__row"));
  for (let i = 0; i < rows.length; i++) {
    arr.push([]);
    for (let j = 0; j < rows[i].children.length; j++) {
      arr[i][j] = rows[i].children[j].dataset.type;
    }
  }
  return arr;
}

// Конфигурация цен
const allHallsForChangePrice = document.querySelector(
  ".price-configuration__all-halls"
);

function createHallsForChangePrice() {
  allHallsForChangePrice.innerHTML = "";
  getAllData().then((data) => {
    const allHalls = data.result.halls;
    allHalls.map((el) => {
      const hall = document.createElement("div");
      hall.textContent = el.hall_name;
      hall.classList.add("hall-configuration-price__selection");
      hall.id = `selection-hall-price-${el.id}`;
      hall.addEventListener("click", () =>
        changeSelectionHallForPrice(hall.id)
      );
      hall.dataset.id = el.id;
      hall.dataset.hallPriceStandart = el.hall_price_standart;
      hall.dataset.hallPriceVip = el.hall_price_vip;

      allHallsForChangePrice.insertAdjacentElement("beforeend", hall);
      allHallsForChangePrice.firstChild.classList.add(
        "hall-configuration-price__selection-active"
      );
    });
    getPlacePrice();
  });
}

function changeSelectionHallForPrice(id) {
  const allHalls = Array.from(allHallsForChangePrice.children);
  allHalls.map((el) => {
    if (
      el.id === id &&
      !el.classList.contains("hall-configuration-price__selection-active")
    ) {
      el.classList.add("hall-configuration-price__selection-active");
    } else if (el.id !== id) {
      el.classList.remove("hall-configuration-price__selection-active");
    }
  });
  getPlacePrice();
}

// Цена мест по умолчанию
const pricePlaceStandart = document.querySelector(".price__standart__input");
const pricePlaceVip = document.querySelector(".price__vip__input");

function getPlacePrice() {
  pricePlaceStandart.value = "";
  pricePlaceVip.value = "";
  const activeHall = document.querySelector(
    ".hall-configuration-price__selection-active"
  );
  pricePlaceStandart.placeholder = activeHall.dataset.hallPriceStandart;
  pricePlaceVip.placeholder = activeHall.dataset.hallPriceVip;
}

// Изменение цены мест
pricePlaceStandart.addEventListener("change", () => {
  const activeHall = document.querySelector(
    ".hall-configuration-price__selection-active"
  );
  activeHall.dataset.hallPriceStandart = pricePlaceStandart.value;
});

pricePlaceVip.addEventListener("change", () => {
  const activeHall = document.querySelector(
    ".hall-configuration-price__selection-active"
  );
  activeHall.dataset.hallPriceVip = pricePlaceVip.value;
});

// Кнопка отмены в установке цен
const btnСancellationPrice = document.querySelector(
  ".price__configuration__button__cancel"
);

btnСancellationPrice.addEventListener("click", () => {
  location.reload();
});

// Сохранение указанных цен
const btnSavePrices = document.querySelector(
  ".price__configuration__button__save"
);

btnSavePrices.addEventListener("click", () => {
  const allHalls = Array.from(
    document.querySelectorAll(".hall-configuration-price__selection")
  );
  allHalls.map((el) => {
    const standart = el.dataset.hallPriceStandart || pricePlaceStandart.value;
    const vip = el.dataset.hallPriceVip || pricePlaceVip.value;

    const params = new FormData();
    params.set("priceStandart", standart);
    params.set("priceVip", vip);
    fetch(`https://shfe-diplom.neto-server.ru/price/${el.dataset.id}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  });
});

// Отображение всех фильмов
const colors = ["yellow", "green", "lightgreen", "lightblue", "darkblue"];
const allFilms = document.querySelector(".all-films__container");

createAllFilms();

export function createAllFilms() {
  allFilms.innerHTML = "";
  getAllData().then((data) => {
    const films = data.result.films;
    films.map((el) => {
      const film = document.createElement("div");
      film.classList.add("film");
      film.id = `film-${el.id}`;
      film.dataset.id = el.id;
      film.dataset.name = el.film_name;
      film.dataset.duration = el.film_duration;
      film.innerHTML = `<img src="${el.film_poster}" alt="img of film" class="film__poster">
      <div class="film__name-and-duration">
          <span class="film__name">${el.film_name}</span>
          <span class="film__duration">${el.film_duration} минут</span>
      </div>`;

      const basket = document.createElement("img");
      basket.src = "/img/basket.png";
      basket.classList.add("basket");
      basket.classList.add("film__basket");
      basket.addEventListener("click", () =>
        deleteFilm(basket.parentElement, el.id)
      );

      film.insertAdjacentElement("beforeend", basket);
      film.addEventListener("mousedown", (event) => {
        raisingFilm(film, event);
      });
      allFilms.insertAdjacentElement("beforeend", film);

      const films = document.querySelectorAll(".film");
      films.forEach((film, index) => {
        const colorIndex = index % colors.length;
        film.classList.add(`background-color-${colors[colorIndex]}`);
        film.dataset.color = colors[colorIndex];
      });
    });
  });
}

function deleteFilm(el, id) {
  el.remove();
  fetch(`https://shfe-diplom.neto-server.ru/film/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createAllSeances();
    });
}

// Отображение залов с полосой сеансов
const allSession = document.querySelector(".all-sessions");

function createAllSession() {
  allSession.innerHTML = "";
  getAllData().then((data) => {
    const allHalls = data.result.halls;
    allHalls.map((el) => {
      const session = document.createElement("div");
      session.classList.add("session");
      session.innerHTML = `<span class="session__hall-name">${el.hall_name}</span>`;
      const sessionScheme = document.createElement("div");
      sessionScheme.classList.add("session__scheme");
      sessionScheme.id = `session__scheme-${el.id}`;
      sessionScheme.dataset.id = el.id;

      session.insertAdjacentElement("beforeend", sessionScheme);
      allSession.insertAdjacentElement("beforeend", session);
    });
    createAllSeances();
  });
}

// Перетаскивание фильма
let draggedFilm = null;

function raisingFilm(film, event) {
  draggedFilm = film.cloneNode(true);
  draggedFilm.style.position = "absolute";
  draggedFilm.style.zIndex = 1000;
  draggedFilm.style.transform = "translate(-50%, -50%)";
  draggedFilm.style.transition = "transform 0.2s ease";
  draggedFilm.style.left = `${event.pageX}px`;
  draggedFilm.style.top = `${event.pageY}px`;
  draggedFilm.style.width = `${film.getBoundingClientRect().width}px`;
  document.body.appendChild(draggedFilm);

  document.addEventListener("mousemove", moveFilm);
  document.addEventListener("mouseup", letGoFilm);
}

function moveFilm(event) {
  if (draggedFilm) {
    draggedFilm.style.left = `${event.pageX}px`;
    draggedFilm.style.top = `${event.pageY}px`;
  }
}

function letGoFilm(event) {
  if (draggedFilm) {
    const sessionSchemes = Array.from(
      document.querySelectorAll(".session__scheme")
    );
    sessionSchemes.map((sessionScheme) => {
      if (
        checkFilmPosition(
          event.target.getBoundingClientRect(),
          sessionScheme.getBoundingClientRect()
        )
      ) {
        const sessionId = sessionScheme.dataset.id;
        const filmId = draggedFilm.dataset.id;
        console.log(`Film ID: ${filmId}, Session ID: ${sessionId}`);
        draggedFilm.remove();
        openSessionPopup(filmId, sessionId);
      }
    });
    draggedFilm.remove();
    draggedFilm = null;
    document.removeEventListener("mousemove", moveFilm);
    document.removeEventListener("mouseup", letGoFilm);
  }
}

function checkFilmPosition(filmPosition, schemePosition) {
  const filmTop = filmPosition.top;
  const filmBottom = filmPosition.bottom;
  const filmLeft = filmPosition.left;

  const schemeTop = schemePosition.top;
  const schemeBottom = schemePosition.bottom;
  const schemeLeft = schemePosition.left;

  if (
    filmTop >= schemeTop &&
    filmBottom <= schemeBottom &&
    filmLeft >= schemeLeft
  ) {
    return true;
  } else {
    return false;
  }
}

// Создание схемы сеансов
export function createAllSeances() {
  const allHalls = Array.from(document.querySelectorAll(".session__scheme"));
  const allFilms = Array.from(document.querySelectorAll(".film"));
  const hallLength = allHalls[0].getBoundingClientRect().width;
  const minutInPixel = hallLength / 1439;

  allHalls.forEach((el) => (el.innerHTML = ""));

  getAllData().then((data) => {
    const allSeances = data.result.seances;
    allSeances.map((seance) => {
      const hall = allHalls.find((el) => el.dataset.id == seance.seance_hallid);
      const film = allFilms.find((el) => el.dataset.id == seance.seance_filmid);

      const filmInHall = document.createElement("div");
      filmInHall.classList.add("session__film");
      filmInHall.dataset.seanceid = seance.id;
      const filmInHallSpan = document.createElement("span");
      filmInHallSpan.classList.add("session__film-name");
      filmInHallSpan.textContent = film.dataset.name;
      filmInHall.innerHTML = `
      <div class="session__film__line-and-time">
          <div class="session__film__line"></div>
          <span class="session__film-time">${seance.seance_time}</span>
      </div>`;
      filmInHall.insertAdjacentElement("afterbegin", filmInHallSpan);
      filmInHall.style.left = `${
        getMinutes(seance.seance_time) * minutInPixel
      }px`;
      filmInHall.classList.add(`background-color-${film.dataset.color}`);
      filmInHall.style.width = `${film.dataset.duration * minutInPixel}px`;

      filmInHall.addEventListener("mouseenter", () =>
        hoverEffectOnFilm(filmInHallSpan)
      );
      filmInHall.addEventListener("mouseleave", () =>
        deleteHoverEffectOnFilm(filmInHallSpan, film.dataset.name)
      );

      hall.insertAdjacentElement("beforeend", filmInHall);
      filmInHall.addEventListener("click", () =>
        deleteSeance(filmInHall.dataset.seanceid)
      );
      filmInHall.style.top = `-${getTopPosition(hall, filmInHall)}px`;
    });
  });
}

function getTopPosition(hall, film) {
  const hallTop = hall.getBoundingClientRect().top + 10;
  const filmTop = film.getBoundingClientRect().top;
  return filmTop - hallTop;
}

// Удаление сеанса
function hoverEffectOnFilm(filmName) {
  filmName.textContent = "Удалить сеанс";
}

function deleteHoverEffectOnFilm(filmSpan, filmName) {
  filmSpan.textContent = filmName;
}

async function deleteSeance(seanceId) {
  await fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  await createAllSeances();
}

// Залы для открытия/закрытия продаж
const containerHallsForSales = document.querySelector(
  ".sales-configuration__all-halls"
);
const salesBtn = document.querySelector(".setting__open-sales-btn");

function createHallsForSales() {
  containerHallsForSales.innerHTML = "";
  getAllData().then((data) => {
    const allHalls = data.result.halls;
    allHalls.map((el) => {
      const hall = document.createElement("div");
      hall.textContent = el.hall_name;
      hall.classList.add("sales-configuration__selection");
      hall.id = `hall-for-sales-${el.id}`;
      hall.addEventListener("click", () =>
        changeSelectionHallforSales(hall.id)
      );
      hall.dataset.id = el.id;
      hall.dataset.isopen = el.hall_open;

      containerHallsForSales.insertAdjacentElement("beforeend", hall);
      containerHallsForSales.firstChild.classList.add(
        "sales-configuration__selection-active"
      );

      getSalesBtnText(containerHallsForSales.firstChild);
    });
  });
}

function getSalesBtnText(activeHall) {
  if (activeHall.dataset.isopen == 1) {
    salesBtn.textContent = "Закрыть продажу билетов";
  } else {
    salesBtn.textContent = "Открыть продажу билетов";
  }
}

function changeSelectionHallforSales(id) {
  const allHalls = Array.from(containerHallsForSales.children);
  allHalls.map((el) => {
    if (
      el.id === id &&
      !el.classList.contains("sales-configuration__selection-active")
    ) {
      el.classList.add("sales-configuration__selection-active");
      getSalesBtnText(el);
    } else if (el.id !== id) {
      el.classList.remove("sales-configuration__selection-active");
    }
  });
}

// Открытие/закрытие продаж
salesBtn.addEventListener("click", () => openCloseSales());

function openCloseSales() {
  const activeHall = document.querySelector(
    ".sales-configuration__selection-active"
  );
  const activeHallId = activeHall.dataset.id;
  const activeHallIsOpen = activeHall.dataset.isopen;

  if (activeHallIsOpen == 0) {
    const params = new FormData();
    params.set("hallOpen", "1");
    fetch(`https://shfe-diplom.neto-server.ru/open/${activeHallId}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    activeHall.dataset.isopen = 1;
    getSalesBtnText(activeHall);
  } else {
    const params = new FormData();
    params.set("hallOpen", "0");
    fetch(`https://shfe-diplom.neto-server.ru/open/${activeHallId}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    activeHall.dataset.isopen = 0;
    getSalesBtnText(activeHall);
  }
}
