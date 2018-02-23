'use strict';

(function () {
  var buttonId = 0;
  // Отрисовка пинов
  window.renderPins = function (renderingOffer) {
    var pinTemplate = document.querySelector('template').content;
    var pinElement = pinTemplate.cloneNode(true);
    var pinIcon = pinElement.querySelector('.map__pin');
    pinIcon.querySelector('img').src = renderingOffer.author.avatar;
    pinIcon.style.left = (renderingOffer.location.x + window.pinSize.WIDTH / 2) + 'px';
    pinIcon.style.top = (renderingOffer.location.y + window.pinSize.HEIGHT) + 'px';
    pinIcon.value = buttonId;
    buttonId++;
    pinIcon.addEventListener('click', window.pinIconClickHandler);
    return pinIcon;
  };
})();
