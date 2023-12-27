import { getDateForFech } from "./seance.js";

const popupTicket = document.querySelector(".popup__ticket");
const popupGetCode = document.querySelector(".popup__get-code");
const btnTicketCancel = document.querySelector(".ticket__btn__cancel");

export function createTicket(
  filmName,
  seats,
  hallName,
  date,
  time,
  seanceId,
  arrayOfSeats
) {
  fetchTicket(seanceId, date, arrayOfSeats);

  popupTicket.classList.remove("hidden");
  popupGetCode.classList.add("hidden");

  const filmNameSpan = document.querySelector(".ticket__film-name");
  filmNameSpan.textContent = filmName;
  const seatsSpan = document.querySelector(".ticket__seats");
  seatsSpan.textContent = seats;
  const hallNameSpan = document.querySelector(".ticket__hall");
  hallNameSpan.textContent = hallName;
  const dateSpan = document.querySelector(".ticket__date");
  dateSpan.textContent = date;
  const timeSpan = document.querySelector(".ticket__time");
  timeSpan.textContent = time;
}

function fetchTicket(seanceId, date, seats) {
  console.log(seats);
  const correctDate = getDateForFech(date);
  const params = new FormData();
  params.set("seanceId", seanceId);
  params.set("ticketDate", correctDate);
  params.set("tickets", JSON.stringify(seats));

  fetch("https://shfe-diplom.neto-server.ru/ticket", {
    method: "POST",
    body: params,
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

btnTicketCancel.addEventListener("click", () => {
  popupTicket.classList.add("hidden");
  popupGetCode.classList.remove("hidden");
});
