'use strict';

(function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;

  var PRICE_MAX_VALUE = 1000000;

  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  window.formFields = {
    noticeForm: document.querySelector('.notice__form'),
    fieldset: document.querySelector('.notice__form').querySelectorAll('fieldset'),
    title: document.querySelector('.notice__form').querySelector('#title'),
    address: document.querySelector('.notice__form').querySelector('#address'),
    type: document.querySelector('.notice__form').querySelector('#type'),
    price: document.querySelector('.notice__form').querySelector('#price'),
    checkin: document.querySelector('.notice__form').querySelector('#timein'),
    checkout: document.querySelector('.notice__form').querySelector('#timeout'),
    rooms: document.querySelector('.notice__form').querySelector('#room_number'),
    capacity: document.querySelector('.notice__form').querySelector('#capacity')
  };

  // Заголовок объявления
  window.formFields.title.setAttribute('required', 'true');
  window.formFields.title.setAttribute('minlength', TITLE_MIN_LENGTH);
  window.formFields.title.setAttribute('maxlength', TITLE_MAX_LENGTH);
  // Для IE - там не работает minlength
  window.formFields.title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < TITLE_MIN_LENGTH) {
      target.setCustomValidity('Минимальное кол-во символов: ' + TITLE_MIN_LENGTH + ' Длина текста сейчас: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  });

  // Тип жилья влияет на минимальную цену
  var priceHandler = function () {
    if (window.formFields.type.selectedIndex === 1) {
      window.formFields.price.setAttribute('min', BUNGALO_MIN_PRICE);
    }
    if (window.formFields.type.selectedIndex === 0) {
      window.formFields.price.setAttribute('min', FLAT_MIN_PRICE);
    }
    if (window.formFields.type.selectedIndex === 2) {
      window.formFields.price.setAttribute('min', HOUSE_MIN_PRICE);
    }
    if (window.formFields.type.selectedIndex === 3) {
      window.formFields.price.setAttribute('min', PALACE_MIN_PRICE);
    }
  };

  // Цена за ночь
  window.formFields.price.setAttribute('required', 'true');
  window.formFields.price.setAttribute('max', PRICE_MAX_VALUE);
  window.formFields.price.addEventListener('input', priceHandler);
  window.formFields.price.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value > PRICE_MAX_VALUE) {
      target.setCustomValidity('Максимально допустимая цена: ' + PRICE_MAX_VALUE);
    } else {
      target.setCustomValidity('');
    }
  });


  window.formFields.type.addEventListener('input', priceHandler);

  // Адрес заполняется автоматически
  window.formFields.address.setAttribute('disabled', 'true');
  window.formFields.address.setAttribute('title', 'Заполняется автоматически');

  // Поля «Время заезда» и «Время выезда» синхронизированы
  window.formFields.checkin.addEventListener('change', function (evt) {
    window.formFields.checkout.value = evt.target.value;
  });
  window.formFields.checkout.addEventListener('change', function (evt) {
    window.formFields.checkin.value = evt.target.value;
  });

  // Поле «Количество комнат» синхронизировано с полем «Количество гостей»
  var optionsArray = window.formFields.capacity.querySelectorAll('option');
  optionsArray[2].setAttribute('selected', 'true');

  var selectClickHandler = function () {
    if (window.formFields.rooms.selectedIndex === 0) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if ((window.formFields.capacity.selectedIndex === 0) || (window.formFields.capacity.selectedIndex === 1)) {
        window.formFields.capacity.setCustomValidity('В 1 комнате может расположиться только 1 гость.');
      } else {
        if (window.formFields.capacity.selectedIndex === 3) {
          window.formFields.capacity.setCustomValidity('Некорректное значение!');
        } else {
          window.formFields.capacity.setCustomValidity('');
        }
      }
    }
    if (window.formFields.rooms.selectedIndex === 1) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (window.formFields.capacity.selectedIndex === 0) {
        window.formFields.capacity.setCustomValidity('В 2 комнатах могут расположиться не больше 2 гостей');
      } else {
        if (window.formFields.capacity.selectedIndex === 3) {
          window.formFields.capacity.setCustomValidity('Некорректное значение!');
        } else {
          window.formFields.capacity.setCustomValidity('');
        }
      }
    }
    if (window.formFields.rooms.selectedIndex === 2) {
      optionsArray[0].removeAttribute('disabled');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (window.formFields.capacity.selectedIndex === 3) {
        window.formFields.capacity.setCustomValidity('Некорректное значение!');
      } else {
        window.formFields.capacity.setCustomValidity('');
      }
    }
    if (window.formFields.rooms.selectedIndex === 3) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].setAttribute('disabled', 'true');
      optionsArray[3].removeAttribute('disabled');
      optionsArray[3].setAttribute('selected', 'true');
      if (window.formFields.capacity.selectedIndex !== 3) {
        window.formFields.capacity.setCustomValidity('Некорректное значение! Такое количество комнат не для гостей.');
      } else {
        window.formFields.capacity.setCustomValidity('');
      }
    }
  };
  window.formFields.rooms.addEventListener('click', selectClickHandler);
  window.formFields.capacity.addEventListener('click', selectClickHandler);

  var resetButton = document.querySelector('.form__reset');
  resetButton.addEventListener('click', function () {
    window.formFields.noticeForm.reset();
    window.disableMainPin();
  });

  var successHandler = function () {
    window.formFields.noticeForm.reset();
    window.disableMainPin();
  };

  var form = window.formFields.noticeForm;
  form.addEventListener('submit', function (evt) {
    // Для того, чтобы поле адрес отправился серверу, включаем его
    window.formFields.address.removeAttribute('disabled');
    window.upload(new FormData(form), successHandler, window.errorHandler);
    evt.preventDefault();
  });

})();
