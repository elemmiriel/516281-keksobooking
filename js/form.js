'use strict';

(function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;

  var PRICE_MAX_VALUE = 1000000;

  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  var FLAT_INDEX = 0;
  var BUNGALO_INDEX = 1;
  var HOUSE_INDEX = 2;
  var PALACE_INDEX = 3;

  var ONE_ROOMS_INDEX = 0;
  var TWO_ROOMS_INDEX = 1;
  var THREE_ROOMS_INDEX = 2;
  var HUNDRED_ROOMS_INDEX = 3;

  var THREE_GUESTS_INDEX = 0;
  var TWO_GUESTS_INDEX = 1;
  var ONE_GUESTS_INDEX = 2;
  var NO_GUESTS_INDEX = 3;

  window.FormFields = {
    NOTICE_FORM: document.querySelector('.notice__form'),
    FIELDSET: document.querySelector('.notice__form').querySelectorAll('fieldset'),
    TITLE: document.querySelector('.notice__form').querySelector('#title'),
    ADDRESS: document.querySelector('.notice__form').querySelector('#address'),
    TYPE: document.querySelector('.notice__form').querySelector('#type'),
    PRICE: document.querySelector('.notice__form').querySelector('#price'),
    CHECKIN: document.querySelector('.notice__form').querySelector('#timein'),
    CHECKOUT: document.querySelector('.notice__form').querySelector('#timeout'),
    ROOMS: document.querySelector('.notice__form').querySelector('#room_number'),
    CAPACITY: document.querySelector('.notice__form').querySelector('#capacity')
  };

  // Заголовок объявления
  window.FormFields.TITLE.setAttribute('required', 'true');
  window.FormFields.TITLE.setAttribute('minlength', TITLE_MIN_LENGTH);
  window.FormFields.TITLE.setAttribute('maxlength', TITLE_MAX_LENGTH);
  // Для IE - там не работает minlength
  window.FormFields.TITLE.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < TITLE_MIN_LENGTH) {
      target.setCustomValidity('Минимальное кол-во символов: ' + TITLE_MIN_LENGTH + ' Длина текста сейчас: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  });

  // Тип жилья влияет на минимальную цену
  var priceChangeHandler = function () {
    if (window.FormFields.TYPE.selectedIndex === BUNGALO_INDEX) {
      window.FormFields.PRICE.setAttribute('min', BUNGALO_MIN_PRICE);
    }
    if (window.FormFields.TYPE.selectedIndex === FLAT_INDEX) {
      window.FormFields.PRICE.setAttribute('min', FLAT_MIN_PRICE);
    }
    if (window.FormFields.TYPE.selectedIndex === HOUSE_INDEX) {
      window.FormFields.PRICE.setAttribute('min', HOUSE_MIN_PRICE);
    }
    if (window.FormFields.TYPE.selectedIndex === PALACE_INDEX) {
      window.FormFields.PRICE.setAttribute('min', PALACE_MIN_PRICE);
    }
  };

  // Цена за ночь
  window.FormFields.PRICE.setAttribute('required', 'true');
  window.FormFields.PRICE.setAttribute('max', PRICE_MAX_VALUE);
  window.FormFields.PRICE.addEventListener('input', priceChangeHandler);
  window.FormFields.PRICE.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value > PRICE_MAX_VALUE) {
      target.setCustomValidity('Максимально допустимая цена: ' + PRICE_MAX_VALUE);
    } else {
      target.setCustomValidity('');
    }
  });

  window.FormFields.TYPE.addEventListener('input', priceChangeHandler);

  // Адрес заполняется автоматически
  window.FormFields.ADDRESS.setAttribute('disabled', 'true');
  window.FormFields.ADDRESS.setAttribute('title', 'Заполняется автоматически');

  // Поля «Время заезда» и «Время выезда» синхронизированы
  window.FormFields.CHECKIN.addEventListener('change', function (evt) {
    window.FormFields.CHECKOUT.value = evt.target.value;
  });
  window.FormFields.CHECKOUT.addEventListener('change', function (evt) {
    window.FormFields.CHECKIN.value = evt.target.value;
  });

  // Поле «Количество комнат» синхронизировано с полем «Количество гостей»
  var options = window.FormFields.CAPACITY.querySelectorAll('option');
  options[2].setAttribute('selected', 'true');

  var checkRoomsGuests = function () {
    var rooms = window.FormFields.ROOMS;
    var guests = window.FormFields.CAPACITY;

    var selectedRooms = rooms.selectedIndex;
    var selectedGuests = guests.selectedIndex;
    switch (selectedRooms) {
      case ONE_ROOMS_INDEX:
        return (selectedGuests === ONE_GUESTS_INDEX);
      case TWO_ROOMS_INDEX:
        return ((selectedGuests === TWO_GUESTS_INDEX) || (selectedGuests === ONE_GUESTS_INDEX));
      case THREE_ROOMS_INDEX:
        return ((selectedGuests === THREE_GUESTS_INDEX) || (selectedGuests === TWO_GUESTS_INDEX) || (selectedGuests === ONE_GUESTS_INDEX));
      case HUNDRED_ROOMS_INDEX:
        return (selectedGuests === NO_GUESTS_INDEX);
      default:
        return false;
    }
  };

  var selectClickHandler = function () {
    // Проверка комнаты-гости
    var isRoomsGuestsValid = checkRoomsGuests();
    if (!isRoomsGuestsValid) {
      window.FormFields.ROOMS.setCustomValidity('Некорректное значение! Проверьте кол-во комнат и гостей.');
      window.FormFields.CAPACITY.setCustomValidity('Некорректное значение! Проверьте кол-во комнат и гостей.');
    } else {
      window.FormFields.ROOMS.setCustomValidity('');
      window.FormFields.CAPACITY.setCustomValidity('');
    }
  };
  window.FormFields.ROOMS.addEventListener('click', selectClickHandler);
  window.FormFields.CAPACITY.addEventListener('click', selectClickHandler);

  var resetButton = document.querySelector('.form__reset');
  resetButton.addEventListener('click', function () {
    window.FormFields.NOTICE_FORM.reset();
    window.FormFields.CAPACITY.querySelectorAll('option')[3].removeAttribute('selected');
    window.FormFields.CAPACITY.querySelectorAll('option')[2].setAttribute('selected', 'true');
    window.disableMainPin();
  });

  var successUploadHandler = function () {
    window.FormFields.NOTICE_FORM.reset();
    window.disableMainPin();
  };

  var form = window.FormFields.NOTICE_FORM;
  form.addEventListener('submit', function (evt) {
    // Для того, чтобы адрес отправился серверу, включаем его
    window.FormFields.ADDRESS.removeAttribute('disabled');
    if (checkRoomsGuests) {
      window.upload(new FormData(form), successUploadHandler, window.errorHandler);
    } else {
      window.FormFields.ROOMS.setCustomValidity('Некорректное значение! Проверьте кол-во комнат и гостей.');
      window.FormFields.CAPACITY.setCustomValidity('Некорректное значение! Проверьте кол-во комнат и гостей.');
    }
    evt.preventDefault();
  });

})();
