// Выбор дня недели
const allDates = Array.from(document.querySelectorAll('.client__header__data'));
const loginBtn = document.getElementById("btn-login");

allDates.map((data, index) => {
    data.addEventListener('click', () => changeActiveData(index))
})

function changeActiveData(index) {
    if (!allDates[index].classList.contains('client__header__data__active')){
        allDates[index].classList.add('client__header__data__active')
    }
    allDates.map((el, i, arr) => {
        if (i !== index){
            arr[i].classList.remove('client__header__data__active')
        }
    })
}

loginBtn.addEventListener("click", () => {
    window.location.href = "admin.html";
  });
