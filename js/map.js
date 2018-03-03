'use strict';
(function () {
  // Диапазон значений для установки пина на карте
  window.PIN_MIN_X = 300;
  window.PIN_MAX_X = 900;
  window.PIN_MIN_Y = 150;
  window.PIN_MAX_Y = 500;

  window.MainPinSizes = {
    WIDTH: 64,
    HEIGHT: 70
  };

  window.PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var offersArray;

  // Загрузить похожие объявления
  var getOffers = function (data) {
    offersArray = JSON.parse(data);
    document.querySelector('.map__filters').addEventListener('click', window.filtrate(offersArray));
    window.disableMainPin();
  };


  window.download(getOffers, window.errorHandler);

  var closePopup = function () {
    var similarListElement = document.querySelector('.map__pins');
    var articles = similarListElement.querySelector('article');
    if (articles) {
      similarListElement.removeChild(articles);
    }
  };

  // Обработчик отрисовки попапа по клику на пине
  window.pinIconClickHandler = function (evt) {
    var targetPin = evt.target;
    // Проверка нужна для того, чтобы клик адекватно работал на всём пине
    var num = targetPin.firstChild ? targetPin.value : targetPin.parentElement.value;
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    closePopup();
    if (typeof window.results === 'undefined') {
      fragment.appendChild(window.renderPopup(offersArray[num])); // фильтр не установлен
    } else {
      fragment.appendChild(window.renderPopup(window.results[num])); // только фильтрованное
    }
    similarListElement.appendChild(fragment);

    var closeButton = document.querySelector('.map__pins').querySelector('.popup__close');
    closeButton.addEventListener('click', closePopup);
    closeButton.addEventListener('keydown', function (evtEnter) {
      window.isEnterEvent(evtEnter, closePopup);
    });
    document.addEventListener('keydown', function (evtEsc) {
      window.isEscEvent(evtEsc, closePopup);
    });
  };

  // Установка пинов похожих объявлений по карте
  window.setupPins = function (array) {
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    for (var n = 0; n < array.length; n++) {
      fragment.appendChild(window.renderPins(array[n]));
    }
    similarListElement.appendChild(fragment);
  };

  window.removeElements = function () {
    var pins = document.querySelector('.map__pins').querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
    window.buttonId = 0;
    var card = document.querySelector('.map__pins').querySelector('article');
    if (card) {
      card.remove();
    }
  };

  var mainPin = document.querySelector('.map__pin--main');
  window.activatingCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  // Активирует форму и карту после события mouseup на пине
  window.activateMainPin = function () {
    var fieldsArray = window.FormFields.FIELDSET;
    for (var i = 0; i < fieldsArray.length; i++) {
      fieldsArray[i].setAttribute('disabled', 'disabled');
    }
    var mainPinMouseupHandler = function () {
      document.querySelector('.map').classList.remove('map--faded');
      window.FormFields.NOTICE_FORM.classList.remove('notice__form--disabled');
      for (i = 0; i < fieldsArray.length; i++) {
        fieldsArray[i].removeAttribute('disabled');
      }
      var filterArr = document.querySelector('.map__filters').children;
      for (i = 0; i < filterArr.length; i++) {
        filterArr[i].removeAttribute('disabled');
      }
      if (offersArray.length > 5) {
        var copy = offersArray.slice(0, 5);
        window.setupPins(copy);
      } else {
        window.setupPins(offersArray);
      }
      mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    };
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    mainPin.addEventListener('keydown', function (evt) {
      window.isEnterEvent(evt, mainPinMouseupHandler);
    });
  };

  // Сбросить форму и карту
  window.disableMainPin = function () {
    window.activatePinDragging();
    var fieldsArray = window.FormFields.FIELDSET;
    for (var i = 0; i < fieldsArray.length; i++) {
      fieldsArray[i].setAttribute('disabled', 'disabled');
    }
    var filterArr = document.querySelector('.map__filters').children;
    for (i = 0; i < filterArr.length; i++) {
      filterArr[i].setAttribute('disabled', 'disabled');
    }
    document.querySelector('.map').classList.add('map--faded');
    window.FormFields.NOTICE_FORM.classList.add('notice__form--disabled');
    window.removeElements();
    window.resetFilters();
    document.querySelector('.map__pin--main').style.left = window.activatingCoords.x + 'px';
    document.querySelector('.map__pin--main').style.top = window.activatingCoords.y + 'px';
    document.querySelector('.notice__preview').querySelector('img').src = 'img/muffin.png'; // удалить аватар
    var photoContainer = document.querySelector('.form__photo-container').querySelector('.form__photo');
    if (photoContainer) {
      while (photoContainer.firstChild) {
        photoContainer.removeChild(photoContainer.firstChild);
      }
    }
    window.setMainPinAddress(window.activatingCoords.x, window.activatingCoords.y);
    window.activateMainPin();
  };
})();
