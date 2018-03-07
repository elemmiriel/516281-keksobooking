'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.SIMILAR_PIN_MAX_COUNT = 5;

  window.MainPinSizes = {
    WIDTH: 62,
    HEIGHT: 62 / 2
  };

  window.PinSize = {
    WIDTH: 50,
    HEIGHT: 40 / 2
  };

  var similarOffers;

  // Загрузить похожие объявления
  var getOffers = function (data) {
    similarOffers = JSON.parse(data);
    document.querySelector('.map__filters').addEventListener('click', window.filtrate(similarOffers));
    window.disableMainPin();
  };


  window.download(getOffers, window.errorHandler);

  var isEscEvent = function (evt, func) {
    if (evt.keyCode === ESC_KEYCODE) {
      func();
    }
  };

  var isEnterEvent = function (evt, func) {
    if (evt.keyCode === ENTER_KEYCODE) {
      func();
    }
  };

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
    var index = targetPin.firstChild ? targetPin.value : targetPin.parentElement.value;
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    closePopup();
    if (typeof window.results === 'undefined') {
      fragment.appendChild(window.renderPopup(similarOffers[index])); // фильтр не установлен
    } else {
      fragment.appendChild(window.renderPopup(window.results[index])); // только фильтрованное
    }
    similarListElement.appendChild(fragment);

    var closeButton = document.querySelector('.map__pins').querySelector('.popup__close');
    var closeClickHandler = function () {
      closePopup();
      closeButton.removeEventListener('keydown', closeKeyEnterHandler);
      closeButton.removeEventListener('click', closeClickHandler);
      document.removeEventListener('keydown', closeKeyEscHandler);
    };
    var closeKeyEnterHandler = function (evtKey) {
      isEnterEvent(evtKey, closePopup);
      closeButton.removeEventListener('keydown', closeKeyEnterHandler);
      closeButton.removeEventListener('click', closeClickHandler);
      document.removeEventListener('keydown', closeKeyEscHandler);
    };
    var closeKeyEscHandler = function (evtKey) {
      isEscEvent(evtKey, closePopup);
      closeButton.removeEventListener('keydown', closeKeyEnterHandler);
      closeButton.removeEventListener('click', closeClickHandler);
      document.removeEventListener('keydown', closeKeyEscHandler);
    };
    closeButton.addEventListener('click', closeClickHandler);
    closeButton.addEventListener('keydown', closeKeyEnterHandler);
    document.addEventListener('keydown', closeKeyEscHandler);
  };

  // Установка пинов похожих объявлений по карте
  window.setupPins = function (offers) {
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    for (var n = 0; n < offers.length; n++) {
      fragment.appendChild(window.renderPins(offers[n]));
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
    var formFields = window.FormFields.FIELDSET;
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].setAttribute('disabled', 'disabled');
    }
    var mainPinMouseupHandler = function () {
      document.querySelector('.map').classList.remove('map--faded');
      window.FormFields.NOTICE_FORM.classList.remove('notice__form--disabled');
      for (i = 0; i < formFields.length; i++) {
        formFields[i].removeAttribute('disabled');
      }
      var filterArr = document.querySelector('.map__filters').children;
      for (i = 0; i < filterArr.length; i++) {
        filterArr[i].removeAttribute('disabled');
      }
      if (similarOffers.length > window.SIMILAR_PIN_MAX_COUNT) {
        var copy = similarOffers.slice(0, window.SIMILAR_PIN_MAX_COUNT);
        window.setupPins(copy);
      } else {
        window.setupPins(similarOffers);
      }
      mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    };
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    mainPin.addEventListener('keydown', function (evt) {
      isEnterEvent(evt, mainPinMouseupHandler);
    });
  };

  // Сбросить форму и карту
  window.disableMainPin = function () {
    window.activatePinDragging();
    var formFields = window.FormFields.FIELDSET;
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].setAttribute('disabled', 'disabled');
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
    // Сбрасываем перемещения главного пина
    window.mainPinCoords = {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop
    };
    window.startCoords = {
      x: 0,
      y: 0
    };
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
