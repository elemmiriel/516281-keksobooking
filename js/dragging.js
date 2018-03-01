'use strict';
(function () {
  var MAP_MIN_X = 0;
  var MAP_MAX_X = 1200;

  var mainPin = document.querySelector('.map__pin--main');

  window.mainPinCoords = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  window.activatePinDragging = function () {
    mainPin.querySelector('img').setAttribute('draggable', 'true');

    window.setMainPinAddress = function (x, y) {
      window.FormFields.ADDRESS.value = x + ', ' + y;
      window.FormFields.ADDRESS.setAttribute('disabled', 'true');
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
        if (window.mainPinCoords.x > (MAP_MAX_X - window.MainPinSizes.WIDTH / 2)) {
          window.mainPinCoords.x = (MAP_MAX_X - window.MainPinSizes.WIDTH / 2);
        }
        if (window.mainPinCoords.y > (window.PIN_MAX_Y + window.MainPinSizes.HEIGHT)) {
          window.mainPinCoords.y = (window.PIN_MAX_Y + window.MainPinSizes.HEIGHT);
        }
        if (window.mainPinCoords.x < (MAP_MIN_X + window.MainPinSizes.WIDTH / 2)) {
          window.mainPinCoords.x = (MAP_MIN_X + window.MainPinSizes.WIDTH / 2);
        }
        if (window.mainPinCoords.y < window.PIN_MIN_Y) {
          window.mainPinCoords.y = window.PIN_MIN_Y;
        }


        mainPin.style.left = window.mainPinCoords.x + 'px';
        mainPin.style.top = window.mainPinCoords.y + 'px';

        window.setMainPinAddress(window.mainPinCoords.x + window.MainPinSizes.WIDTH / 2, window.mainPinCoords.y + window.MainPinSizes.HEIGHT);

      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();
        window.setMainPinAddress(window.mainPinCoords.x + window.MainPinSizes.WIDTH / 2, window.mainPinCoords.y + window.MainPinSizes.HEIGHT);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  };
})();
