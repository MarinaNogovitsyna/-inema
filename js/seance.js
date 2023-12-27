import { getAllData } from "./index.js";

const popupSeance = document.querySelector(".popup__seance");
const btnLogin = document.querySelector(".client__header__login");
const datesInHeades = document.querySelector(".client__header__dates");
const mainBlock = document.querySelector("main");
const btnCancelPopup = document.querySelector(".seanse__btn__cancel");

export function openPopupSeance(seanceInHall, filmHall, film) {
  if (!seanceInHall.classList.contains("film__hall__seance__not-available")) {
    popupSeance.classList.remove("hidden");
    btnLogin.classList.add("hidden");
    datesInHeades.classList.add("hidden");
    mainBlock.classList.add("hidden");
    createInfoSeance(seanceInHall, filmHall, film);
  }
}

btnCancelPopup.addEventListener("click", () => {
  popupSeance.classList.add("hidden");
  btnLogin.classList.remove("hidden");
  datesInHeades.classList.remove("hidden");
  mainBlock.classList.remove("hidden");
});

function createInfoSeance(seanceInHall, filmHall, film) {
  const filmName = document.querySelector(".seance__film-name");
  const seanceTime = document.querySelector(".seance__time");
  const hallName = document.querySelector(".seance__hall-name");
  const seanceDate = document.querySelector(".seance__data");
  const currentData = document.querySelector(".client__header__data__active");

  seanceDate.textContent = `Дата: ${currentData.dataset.date}`;
  hallName.textContent = filmHall.dataset.hallname;
  seanceTime.textContent = `Начало сеанса: ${seanceInHall.dataset.time}`;
  filmName.textContent = film.dataset.name;

  createHallScheme(seanceInHall.dataset.id, currentData.dataset.date);
}

function getHallConfig(seanceId, date) {
  return fetch(
    `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${date}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function createHallScheme(seanceId, currentData) {
  const date = getDateForFech(currentData);
  const hallSchemeContainer = document.querySelector(".seance__hall-scheme");
  hallSchemeContainer.innerHTML = "";

  getHallConfig(seanceId, date).then((data) => {
    const hallScheme = data.result;

    for (let i = 0; i < hallScheme.length; i++) {
      const row = document.createElement("div");
      row.classList.add("seance__hall-scheme__row");

      for (let j = 0; j < hallScheme[i].length; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seance__seat");
        seat.setAttribute("data-row", i + 1);
        seat.setAttribute("data-place", j + 1);
        seat.setAttribute("data-type", hallScheme[i][j]);
        seat.classList.add(`${hallScheme[i][j]}`);

        seat.addEventListener("click", () => {
          choosePlace(seat);
        });

        row.appendChild(seat);
      }

      hallSchemeContainer.appendChild(row);
    }
  });
}

function choosePlace(seat) {
  if (seat.dataset.type !== "taken" && seat.dataset.type !== "disabled") {
    seat.classList.toggle("color__seats-selected");
  }
}

function getDateForFech(date) {
  const year = date.slice(6);
  const mounth = date.slice(3, 5);
  const day = date.slice(0, 2);
  return `${year}-${mounth}-${day}`;
}

// ПОСЛЕ НАЖАТИЯ НА Получить код бронирования ПОМЕНЯТЬ DATA-TYPE В МЕСТАХ НА taken (возможно)
