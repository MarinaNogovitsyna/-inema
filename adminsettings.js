const allHalls = document.querySelector(".all-halls");

// function getAllDataCeck() {
//   return fetch("https://shfe-diplom.neto-server.ru/alldata")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
// }

// getAllDataCeck()

function getAllData() {
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
  // .then((data) => console.log(data));
  await createHallsForSelection();
  await createHallsForChangePrice();
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
