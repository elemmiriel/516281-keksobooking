'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  // Размеры попапа
  window.POPUP_WIDTH = 230;
  window.POPUP_MARGIN = 10;

  window.isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  window.isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  var renderPhotos = function (element, renderingOffer) {
    var photosElement = element.querySelector('.popup__pictures');
    for (var m = 0; m < renderingOffer.offer.photos.length; m++) {
      var li = photosElement.querySelector('li').cloneNode(true);
      li.querySelector('img').src = renderingOffer.offer.photos[m];
      li.querySelector('img').width = (window.POPUP_WIDTH - 2 * window.POPUP_MARGIN) / renderingOffer.offer.photos.length;
      li.querySelector('img').height = 70;
      photosElement.append(li);
    }
    photosElement.querySelector('li').remove(); // удалить первый шаблонный элемент
  };

  var renderFeatures = function (element, renderingOffer) {
    var featuresElement = element.querySelector('.popup__features');
    while (featuresElement.firstChild) { // чистим перечень удобств из шаблона
      featuresElement.removeChild(featuresElement.firstChild);
    }
    for (var m = 0; m < renderingOffer.offer.features.length; m++) {
      var feature = document.createElement('li');
      feature.classList.add('feature');
      feature.classList.add('feature--' + renderingOffer.offer.features[m]);
      featuresElement.appendChild(feature);
    }
  };

  var getRuType = function (type) {
    if (type === 'flat') {
      return 'Квартира';
    }
    if (type === 'bungalo') {
      return 'Бунгало';
    }
    return 'Дом';
  };

  // Отрисовка попап объявлений
  window.renderPopup = function (renderingOffer) {
    var popTemplate = document.querySelector('template').content;
    var popTemp = popTemplate.cloneNode(true);
    var popElement = popTemp.querySelector('.map__card');
    popElement.querySelector('.popup__avatar').src = renderingOffer.author.avatar;
    popElement.querySelector('h3').textContent = renderingOffer.offer.title;
    popElement.querySelector('small').textContent = renderingOffer.offer.address;
    popElement.querySelector('.popup__price').textContent = renderingOffer.offer.price + ' \u20bd/ночь';
    popElement.querySelector('h4').textContent = getRuType(renderingOffer.offer.type);
    var elemStr = renderingOffer.offer.rooms + ' комнаты для ' + renderingOffer.offer.guests + ' гостей';
    popElement.querySelectorAll('p')[2].textContent = elemStr;
    elemStr = 'Заезд после ' + renderingOffer.offer.checkin + ', выезд до ' + renderingOffer.offer.checkout;
    popElement.querySelectorAll('p')[3].textContent = elemStr;
    renderFeatures(popElement, renderingOffer);
    popElement.querySelectorAll('p')[4].textContent = renderingOffer.offer.description;
    renderPhotos(popElement, renderingOffer);
    return popElement;
  };
})();