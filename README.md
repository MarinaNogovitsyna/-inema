# Описание проекта
Данный проект представляет из себя сайт кинотеатра "Идем в кино". Сайт включает в себя клиентскую часть, в которой можно просматривать расписание фильмов, бронировать билеты на сеансы.
Также сайт имеет административную часть, в которой можно редактировать фильмы, залы, сеансы и др. 
## Используемые технологии
- HTML
- CSS
- JS
## Возможности клиентской части
- Просмотр всех фильмов с их описанием
- Выбор дня, времени сеанса
- Просмотр схемы зала и выбор интересующего места
- После выбора места при нажатии на кнопку "Забронировать" будет указана вся информация о сеансе
- Получение QR-кода бронирования, который сожержит в себе текстовую информацию о билете
## Авторизация 
При нажатии на кнопку "Войти" будет запрошен логин и пароль. 
Для успешной авторизации используйте следующие данные:  
*Логин* - ***shfe-diplom@netology.ru***  
*Пароль* - ***shfe-diplom***

Информация об успешной авторизации будет сохранена в cookie.
## Возможности администативной части
- Добавление и удаление залов
- Конфигурация залов (можно утсановить количство рядов и мест, а также указать тип кресла)
- Установка цен для стандартных и Vip мест отдельно для каждого зала
- Добавление нового фильма (открывается окно, в котором нужно ввести название фильма, продолжительность в минутах, описание, страну, а также прикрепить постер в формате png)
- Удаление фильма (клик по значку корзины у фильма)
- Добавление сеанса происходит перетаскиванием фильма в нужный зал, после чего устанавливается время, далее проиходит проверка, чтобы сеансы в одном зале не пересекались по времени, а также последний сеанс не должен заканчиваться позднее 23:59.
- Удаление сеанса (клик по фильму в полосе сеансов конкретного зала)
- Открытие/закрытие продаж отдельного зала. В случае открытия продаж все сеансы этого зала отобразятся в клиентской части. 
