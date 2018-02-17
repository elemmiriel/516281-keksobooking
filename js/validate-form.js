'use strict';

var TITLE_MIN_LENGTH = 30;
var TITLE_MAX_LENGTH = 100;

var PRICE_MAX_VALUE = 1000000;

var BUNGALO_MIN_PRICE = 0;
var FLAT_MIN_PRICE = 1000;
var HOUSE_MIN_PRICE = 5000;
var PALACE_MIN_PRICE = 10000;

(function () {
  var form = document.querySelector('.notice__form');
  var title = form.querySelector('#title');
  var address = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkin = form.querySelector('#timein');
  var checkout = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');

  // Заголовок объявления
  title.setAttribute('required', 'true');
  title.setAttribute('minlength', TITLE_MIN_LENGTH);
  title.setAttribute('maxlength', TITLE_MAX_LENGTH);
  // Для IE - там не работает minlength
  title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < TITLE_MIN_LENGTH) {
      target.setCustomValidity('Минимальное кол-во символов: ' + TITLE_MIN_LENGTH + ' Длина текста сейчас: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  });

  // Цена за ночь
  price.setAttribute('required', 'true');
  price.setAttribute('max', PRICE_MAX_VALUE);
  price.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value > PRICE_MAX_VALUE) {
      target.setCustomValidity('Максимально допустимая цена: ' + PRICE_MAX_VALUE);
    } else {
      target.setCustomValidity('');
    }
  });

  // Тип жилья влияет на минимальную цену
  type.addEventListener('input', function () {
    if (type.selectedIndex === 1) {
      price.setAttribute('min', BUNGALO_MIN_PRICE);
    }
    if (type.selectedIndex === 0) {
      price.setAttribute('min', FLAT_MIN_PRICE);
    }
    if (type.selectedIndex === 2) {
      price.setAttribute('min', HOUSE_MIN_PRICE);
    }
    if (type.selectedIndex === 3) {
      price.setAttribute('min', PALACE_MIN_PRICE);
    }
  });

  // Адрес заполняется автоматически
  address.setAttribute('disabled', 'true');
  address.setAttribute('title', 'Заполняется автоматически');

  // Поля «Время заезда» и «Время выезда» синхронизированы
  checkin.addEventListener('change', function (evt) {
    checkout.value = evt.target.value;
  });
  checkout.addEventListener('change', function (evt) {
    checkin.value = evt.target.value;
  });

  // Поле «Количество комнат» синхронизировано с полем «Количество гостей»
  var optionsArray = capacity.querySelectorAll('option');
  optionsArray[2].setAttribute('selected', 'true');
  var selectClickHandler = function () {
    if (rooms.selectedIndex === 0) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if ((capacity.selectedIndex === 0) || (capacity.selectedIndex === 1)) {
        capacity.setCustomValidity('В 1 комнате может расположиться только 1 гость.');
      } else {
        if (capacity.selectedIndex === 3) {
          capacity.setCustomValidity('Некорректное значение!');
        } else {
          capacity.setCustomValidity('');
        }
      }
    }
    if (rooms.selectedIndex === 1) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (capacity.selectedIndex === 0) {
        capacity.setCustomValidity('В 2 комнатах могут расположиться не больше 2 гостей');
      } else {
        if (capacity.selectedIndex === 3) {
          capacity.setCustomValidity('Некорректное значение!');
        } else {
          capacity.setCustomValidity('');
        }
      }
    }
    if (rooms.selectedIndex === 2) {
      optionsArray[0].removeAttribute('disabled');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (capacity.selectedIndex === 3) {
        capacity.setCustomValidity('Некорректное значение!');
      } else {
        capacity.setCustomValidity('');
      }
    }
    if (rooms.selectedIndex === 3) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].setAttribute('disabled', 'true');
      optionsArray[3].removeAttribute('disabled');
      optionsArray[3].setAttribute('selected', 'true');
      if (capacity.selectedIndex !== 3) {
        capacity.setCustomValidity('Некорректное значение! Такое количество комнат не для гостей.');
      } else {
        capacity.setCustomValidity('');
      }
    }
  };
  rooms.addEventListener('click', selectClickHandler);
  capacity.addEventListener('click', selectClickHandler);
})();
