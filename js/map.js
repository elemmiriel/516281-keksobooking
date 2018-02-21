'use strict';
(function () {
  // Диапазон значений для установки пина на карте
  window.PIN_MIN_X = 300;
  window.PIN_MAX_X = 900;
  window.PIN_MIN_Y = 150;
  window.PIN_MAX_Y = 500;

  // Сгенерировать похожие объявления
  var offersArray = window.generateOffers();

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
    var noticeImg = targetPin.firstChild ? targetPin.firstChild.src : targetPin.src;
    noticeImg.toString();
    var num = (noticeImg[noticeImg.length - 5] - 1);
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    closePopup();
    fragment.appendChild(window.renderPopup(offersArray[num]));
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
  var setupPins = function () {
    var fragment = document.createDocumentFragment();
    var similarListElement = document.querySelector('.map__pins');
    for (var n = 0; n < offersArray.length; n++) {
      fragment.appendChild(window.renderPins(offersArray[n]));
    }
    similarListElement.appendChild(fragment);
  };

  // Активирует форму и карту после события mouseup на пине
  window.activateMainPin = function () {
    var mainPin = document.querySelector('.map__pin--main');
    window.activatingCoords = {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop
    };
    var fieldsArray = window.formFields.fieldset;
    var mainPinMouseupHandler = function () {
      document.querySelector('.map').classList.remove('map--faded');
      window.formFields.noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < fieldsArray.length; i++) {
        fieldsArray[i].removeAttribute('disabled');
      }
      setupPins();
      mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    };
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    mainPin.addEventListener('keydown', function (evt) {
      window.isEnterEvent(evt, mainPinMouseupHandler);
    });
  };

  window.disableMainPin = function () {
    var fieldsArray = window.formFields.fieldset;
    for (var i = 0; i < fieldsArray.length; i++) {
      fieldsArray[i].setAttribute('disabled', 'disabled');
    }
    document.querySelector('.map').classList.add('map--faded');
    window.formFields.noticeForm.classList.add('notice__form--disabled');
    var pins = document.querySelector('.map__pins').querySelectorAll('.map__pin');
    for (i = 0; i < pins.length; i++) {
      if (!pins[i].classList.contains('map__pin--main')) {
        pins[i].remove();
      }
    }
    var card = document.querySelector('.map__pins').querySelector('article');
    if (card) {
      card.remove();
    }
    document.querySelector('.map__pin--main').style.left = window.activatingCoords.x + 'px';
    document.querySelector('.map__pin--main').style.top = window.activatingCoords.y + 'px';
    window.setMainPinAddress(window.activatingCoords.x, window.activatingCoords.y);
    window.activateMainPin();
  };
  window.activateMainPin();
})();
