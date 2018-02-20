'use strict';
(function () {
  var mainPin = document.querySelector('.map__pin--main');
  mainPin.querySelector('img').setAttribute('draggable', 'true');

  window.mainPinCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  window.setMainPinAddress = function (x, y) {
    window.formFields.address.value = x + ', ' + y;
    window.formFields.address.setAttribute('disabled', 'true');
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.mainPinCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      // Ограничим область установки пина
      if (window.mainPinCoords.x > window.PIN_MAX_X) {
        window.mainPinCoords.x = window.PIN_MAX_X;
      }
      if (window.mainPinCoords.y > window.PIN_MAX_Y) {
        window.mainPinCoords.y = window.PIN_MAX_Y;
      }
      if (window.mainPinCoords.x < window.PIN_MIN_X) {
        window.mainPinCoords.x = window.PIN_MIN_X;
      }
      if (window.mainPinCoords.y < window.PIN_MIN_Y) {
        window.mainPinCoords.y = window.PIN_MIN_Y;
      }


      mainPin.style.left = window.mainPinCoords.x + 'px';
      mainPin.style.top = window.mainPinCoords.y + 'px';

      window.setMainPinAddress(window.mainPinCoords.x, window.mainPinCoords.y);

    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      window.setMainPinAddress(window.mainPinCoords.x, window.mainPinCoords.y);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
