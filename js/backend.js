'use strict';

(function () {
  var loader = document.createElement('script');
  loader.src = 'https://js.dump.academy/keksobooking/data';

  var uploader = document.createElement('script');
  uploader.src = 'https://js.dump.academy/keksobooking';

  window.errorHandler = function (message) {
    var errorPopup = document.createElement('div');
    var messageText = document.createElement('div');
    messageText.textContent = message;
    messageText.style.position = 'relative';
    messageText.style.top = '15px';

    errorPopup.style.zIndex = '100';
    errorPopup.style.width = '350px';
    errorPopup.style.height = '80px';
    errorPopup.style.position = 'fixed';
    errorPopup.style.overflow = 'auto';
    errorPopup.style.background = 'rgba(255,255,255,0.9)';
    errorPopup.style.border = '2px solid rgba(255,0,0,0.5)';
    errorPopup.style.borderRadius = '8px';
    errorPopup.style.top = '20%';
    errorPopup.style.left = '40%';
    errorPopup.style.textAlign = 'center';
    errorPopup.style.fontSize = '18px';
    errorPopup.style.cursor = 'pointer';
    errorPopup.appendChild(messageText);
    document.querySelector('main').appendChild(errorPopup);

    var closeErrorPopup = function () {
      errorPopup.style.display = 'none';
    };
    errorPopup.addEventListener('click', closeErrorPopup);
    window.setTimeout(closeErrorPopup, 5000);
  };

  window.download = function (onLoad, onError) {
    var URL = loader.src;
    var xhr = new XMLHttpRequest();
    // xhr.responseType = 'json';
    xhr.open('GET', URL);
    xhr.send();
    xhr.timeout = 10000; // 10s

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  window.upload = function (data, onLoad, onError) {
    var URL = uploader.src;
    var xhr = new XMLHttpRequest();
    // xhr.responseType = 'json';
    xhr.open('POST', URL);
    xhr.send(data);
    xhr.timeout = 10000; // 10s

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };
})();
