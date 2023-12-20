import { createAllFilms } from "./adminsettings.js";

const btnAddFilm = document.querySelector(".add__film__btn");
const popupAddFilm = document.querySelector(".popup__add-film");
const adminPageSettings = document.querySelector(".admin-container");
const popupClose = document.querySelector(".popup__add-film__close");
const popupCancellation = document.querySelector(
  ".popup__form-film__cancellation"
);
const popupBtnAddFilm = document.querySelector(".popup__btn-add-film");

btnAddFilm.addEventListener("click", () => {
  popupAddFilm.classList.add("popup__add-film-active");
  adminPageSettings.classList.add("hidden");
});

popupClose.addEventListener("click", closePopup);
popupCancellation.addEventListener("click", closePopup);

function closePopup() {
  const parentPopup = popupClose.closest(".popup");
  parentPopup.classList.remove("popup__add-film-active");
  adminPageSettings.classList.remove("hidden");
}

popupBtnAddFilm.addEventListener("click", (e) => {
  e.preventDefault();
  const filmName = document.querySelector(
    ".popup__form__input__film-name"
  ).value;
  const filmDuration = document.querySelector(
    ".popup__form__input__film-time"
  ).value;
  const filmDescription = document.querySelector(
    ".popup__form__input__film-description"
  ).value;
  const filmOrigin = document.querySelector(
    ".popup__form__input__film-origin"
  ).value;
  const filePoster = document.getElementById("input__file").files[0];

  fetchAddFilm(filmName, filmDuration, filmDescription, filmOrigin, filePoster);
});

async function fetchAddFilm(name, duration, description, origin, poster) {
  const params = new FormData();
  params.set("filmName", name);
  params.set("filmDuration", duration);
  params.set("filmDescription", description);
  params.set("filmOrigin", origin);
  params.set("filePoster", poster);

  let response = await fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: params,
  });
  let data = await response.json();
  console.log(data);
  await createAllFilms();
  if (!data.success) {
    alert(data.error);
  }
}
