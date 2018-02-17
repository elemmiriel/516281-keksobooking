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
  var getRuType = function (type) {
    if (type === 'flat') {
      return 'Квартира';
    }
    if (type === 'bungalo') {
      return 'Бунгало';
    }
    return 'Дом';
  };
  popElement.querySelector('h4').textContent = getRuType(renderingOffer.offer.type);
  var elemStr = renderingOffer.offer.rooms + ' комнаты для ' + renderingOffer.offer.guests + ' гостей';
  popElement.querySelectorAll('p')[2].textContent = elemStr;
  elemStr = 'Заезд после ' + renderingOffer.offer.checkin + ', выезд до ' + renderingOffer.offer.checkout;
  popElement.querySelectorAll('p')[3].textContent = elemStr;
  var featuresElement = popElement.querySelector('.popup__features');
  while (featuresElement.firstChild) { // чистим перечень удобств из шаблона
    featuresElement.removeChild(featuresElement.firstChild);
  }
  for (var m = 0; m < renderingOffer.offer.features.length; m++) {
    var feature = document.createElement('li');
    feature.classList.add('feature');
    feature.classList.add('feature--' + renderingOffer.offer.features[m]);
    featuresElement.appendChild(feature);
  }
  popElement.querySelectorAll('p')[4].textContent = renderingOffer.offer.description;
  var photosElement = popElement.querySelector('.popup__pictures');
  for (m = 0; m < renderingOffer.offer.photos.length; m++) {
    var li = photosElement.querySelector('li').cloneNode(true);
    li.querySelector('img').src = renderingOffer.offer.photos[m];
    li.querySelector('img').width = (POPUP_WIDTH - 2 * POPUP_MARGIN) / renderingOffer.offer.photos.length;
    li.querySelector('img').height = 70;
    photosElement.append(li);
  }
  photosElement.querySelector('li').remove(); // удалить первый шаблонный элемент
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
