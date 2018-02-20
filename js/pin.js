'use strict';

(function () {

  var pinWidth = 50;
  var pinHeight = 70;

  // Отрисовка пинов
  window.renderPins = function (renderingOffer) {
    var pinTemplate = document.querySelector('template').content;
    var pinElement = pinTemplate.cloneNode(true);
    var pinIcon = pinElement.querySelector('.map__pin');
    pinIcon.querySelector('img').src = renderingOffer.author.avatar;
    pinIcon.style.left = (renderingOffer.location.x + pinWidth / 2) + 'px';
    pinIcon.style.top = (renderingOffer.location.y + pinHeight) + 'px';
    pinIcon.addEventListener('click', window.pinIconClickHandler);
    return pinIcon;
  };
})();
