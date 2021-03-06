'use strict';

(function () {
  // Отрисовка пинов
  window.buttonId = 0;
  window.renderPins = function (renderingOffer) {
    var pinTemplate = document.querySelector('template').content;
    var pinElement = pinTemplate.cloneNode(true);
    var pinIcon = pinElement.querySelector('.map__pin');
    pinIcon.querySelector('img').src = renderingOffer.author.avatar;
    pinIcon.style.left = (renderingOffer.location.x - window.PinSize.WIDTH / 2) + 'px';
    pinIcon.style.top = (renderingOffer.location.y - window.PinSize.HEIGHT) + 'px';
    pinIcon.value = window.buttonId;
    window.buttonId++;
    pinIcon.addEventListener('click', window.pinIconClickHandler);
    return pinIcon;
  };
})();
