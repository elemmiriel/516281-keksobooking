'use strict';

// Размеры пинов с учётом острого конца
// на будущее: var mainPinWidth = 65;
var mainPinHeight = 70;
var pinWidth = 50;
var pinHeight = 70;

var POPUP_WIDTH = 230;
var POPUP_MARGIN = 10;

// Диапазон значений для установки пина на карте
var PIN_MIN_X = 300;
var PIN_MAX_X = 900;
var PIN_MIN_Y = 150;
var PIN_MAX_Y = 500;

var OFFERS_COUNT = 8;

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES = [
  'flat',
  'house',
  'bungalo'
];

var CHECK_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var PHOTOS_ARRAY = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var FEATURES_ARRAY = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// Для неповторяющихся значений в случайном порядке
var compareRandom = function () {
  return Math.random() - 0.5;
};

// Для генерации случайных значений в заданном диапазоне
var getRandomFromTo = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getAvatar = function (num) {
  return 'img/avatars/user0' + (num + 1) + '.png';
};

var getPhotos = function () {
  return PHOTOS_ARRAY.sort(compareRandom);
};

var getFeatures = function () {
  FEATURES_ARRAY.sort(compareRandom);
  return FEATURES_ARRAY.slice(0, getRandomFromTo(1, FEATURES_ARRAY.length));
};

// Отрисовка стартовой позиции главного пина в поле адреса
var setMainPinAddress = function () {
  var startX = PIN_MAX_X / 2;
  var startY = PIN_MAX_Y / 2 + mainPinHeight;
  var noticeAddress = document.querySelector('#address');
  noticeAddress.value = startX + ', ' + startY;
  noticeAddress.setAttribute('disabled', 'true');
};

// Активирует форму и карту после события mouseup на пине
var activateMainPin = function () {
  var noticeForm = document.querySelector('.notice__form');
  var fieldArray = noticeForm.querySelectorAll('fieldset');
  var mainPin = document.querySelector('.map__pin--main');
  for (var i = 0; i < fieldArray.length; i++) {
    fieldArray[i].setAttribute('disabled', 'disabled');
  }
  var mainPinMouseupHandler = function () {
    document.querySelector('.map').classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    for (i = 0; i < fieldArray.length; i++) {
      fieldArray[i].removeAttribute('disabled');
    }
    setMainPinAddress();
    setupPins();
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
  };
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);
};

// Генерация объявлений
var generateOffers = function () {
  var offers = [];
  OFFER_TITLES.sort(compareRandom); // Для неповторяющихся заголовков в рандомном порядке
  for (var i = 0; i < OFFERS_COUNT; i++) {
    var locX = getRandomFromTo(PIN_MIN_X, PIN_MAX_X);
    var locY = getRandomFromTo(PIN_MIN_Y, PIN_MAX_Y);
    offers.push({
      author: {
        avatar: getAvatar(i)
      },
      offer: {
        title: OFFER_TITLES[i],
        address: locX + ', ' + locY,
        price: getRandomFromTo(1000, 1000000),
        type: TYPES[getRandomFromTo(0, 2)],
        rooms: getRandomFromTo(1, 5),
        guests: getRandomFromTo(1, 10),
        checkin: CHECK_TIME[getRandomFromTo(0, 2)],
        checkout: CHECK_TIME[getRandomFromTo(0, 2)],
        features: getFeatures(),
        description: '',
        photos: getPhotos()
      },
      location: {
        x: locX,
        y: locY
      }
    });
  }
  return offers;
};
activateMainPin();

// Сгенерировать похожие объявления
var offersArray = generateOffers();

var renderPhotos = function (element, renderingOffer) {
  var photosElement = element.querySelector('.popup__pictures');
  for (var m = 0; m < renderingOffer.offer.photos.length; m++) {
    var li = photosElement.querySelector('li').cloneNode(true);
    li.querySelector('img').src = renderingOffer.offer.photos[m];
    li.querySelector('img').width = (POPUP_WIDTH - 2 * POPUP_MARGIN) / renderingOffer.offer.photos.length;
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

// Отрисовка пинов
var renderPins = function (renderingOffer) {
  var pinTemplate = document.querySelector('template').content;
  var pinElement = pinTemplate.cloneNode(true);
  var pinIcon = pinElement.querySelector('.map__pin');
  pinIcon.querySelector('img').src = renderingOffer.author.avatar;
  pinIcon.style.left = (renderingOffer.location.x + pinWidth / 2) + 'px';
  pinIcon.style.top = (renderingOffer.location.y + pinHeight) + 'px';
  pinIcon.addEventListener('click', pinIconClickHandler);
  return pinIcon;
};

// Отрисовка попап объявлений
var renderPopup = function (renderingOffer) {
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

// Обработчик клика по пину похожего объявления
var pinIconClickHandler = function (evt) {
  var targetPin = evt.target;
  // Проверка нужна для того, чтобы клик адекватно работал на всём пине
  var noticeImg = targetPin.firstChild ? targetPin.firstChild.src : targetPin.src;
  noticeImg.toString();
  var num = (noticeImg[noticeImg.length - 5] - 1);
  var fragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');
  fragment.appendChild(renderPopup(offersArray[num]));
  similarListElement.appendChild(fragment);
};

// Установка пинов похожих объявлений по карте
var setupPins = function () {
  var fragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');
  for (var n = 0; n < offersArray.length; n++) {
    fragment.appendChild(renderPins(offersArray[n]));
  }
  similarListElement.appendChild(fragment);
};

var validateForm = function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;

  var PRICE_MAX_VALUE = 1000000;

  var BUNGALO_MIN_PRICE = 0;
  var FLAT_MIN_PRICE = 1000;
  var HOUSE_MIN_PRICE = 5000;
  var PALACE_MIN_PRICE = 10000;

  var form = document.querySelector('.notice__form');
  var title = form.querySelector('#title');
  var address = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkin = form.querySelector('#timein');
  var checkout = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');

  // Заголовок объявления
  title.setAttribute('required', 'true');
  title.setAttribute('minlength', TITLE_MIN_LENGTH);
  title.setAttribute('maxlength', TITLE_MAX_LENGTH);
  // Для IE - там не работает minlength
  title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < TITLE_MIN_LENGTH) {
      target.setCustomValidity('Минимальное кол-во символов: ' + TITLE_MIN_LENGTH + ' Длина текста сейчас: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  });

  // Цена за ночь
  price.setAttribute('required', 'true');
  price.setAttribute('max', PRICE_MAX_VALUE);
  price.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value > PRICE_MAX_VALUE) {
      target.setCustomValidity('Максимально допустимая цена: ' + PRICE_MAX_VALUE);
    } else {
      target.setCustomValidity('');
    }
  });

  // Тип жилья влияет на минимальную цену
  type.addEventListener('input', function () {
    if (type.selectedIndex === 1) {
      price.setAttribute('min', BUNGALO_MIN_PRICE);
    }
    if (type.selectedIndex === 0) {
      price.setAttribute('min', FLAT_MIN_PRICE);
    }
    if (type.selectedIndex === 2) {
      price.setAttribute('min', HOUSE_MIN_PRICE);
    }
    if (type.selectedIndex === 3) {
      price.setAttribute('min', PALACE_MIN_PRICE);
    }
  });

  // Адрес заполняется автоматически
  address.setAttribute('disabled', 'true');
  address.setAttribute('title', 'Заполняется автоматически');

  // Поля «Время заезда» и «Время выезда» синхронизированы
  checkin.addEventListener('change', function (evt) {
    checkout.value = evt.target.value;
  });
  checkout.addEventListener('change', function (evt) {
    checkin.value = evt.target.value;
  });

  // Поле «Количество комнат» синхронизировано с полем «Количество гостей»
  var optionsArray = capacity.querySelectorAll('option');
  optionsArray[2].setAttribute('selected', 'true');

  var selectClickHandler = function () {
    if (rooms.selectedIndex === 0) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if ((capacity.selectedIndex === 0) || (capacity.selectedIndex === 1)) {
        capacity.setCustomValidity('В 1 комнате может расположиться только 1 гость.');
      } else {
        if (capacity.selectedIndex === 3) {
          capacity.setCustomValidity('Некорректное значение!');
        } else {
          capacity.setCustomValidity('');
        }
      }
    }
    if (rooms.selectedIndex === 1) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (capacity.selectedIndex === 0) {
        capacity.setCustomValidity('В 2 комнатах могут расположиться не больше 2 гостей');
      } else {
        if (capacity.selectedIndex === 3) {
          capacity.setCustomValidity('Некорректное значение!');
        } else {
          capacity.setCustomValidity('');
        }
      }
    }
    if (rooms.selectedIndex === 2) {
      optionsArray[0].removeAttribute('disabled');
      optionsArray[1].removeAttribute('disabled');
      optionsArray[2].removeAttribute('disabled');
      optionsArray[2].setAttribute('selected', 'true');
      optionsArray[3].setAttribute('disabled', 'true');
      if (capacity.selectedIndex === 3) {
        capacity.setCustomValidity('Некорректное значение!');
      } else {
        capacity.setCustomValidity('');
      }
    }
    if (rooms.selectedIndex === 3) {
      optionsArray[0].setAttribute('disabled', 'true');
      optionsArray[1].setAttribute('disabled', 'true');
      optionsArray[2].setAttribute('disabled', 'true');
      optionsArray[3].removeAttribute('disabled');
      optionsArray[3].setAttribute('selected', 'true');
      if (capacity.selectedIndex !== 3) {
        capacity.setCustomValidity('Некорректное значение! Такое количество комнат не для гостей.');
      } else {
        capacity.setCustomValidity('');
      }
    }
  };
  rooms.addEventListener('click', selectClickHandler);
  capacity.addEventListener('click', selectClickHandler);
};

validateForm();
