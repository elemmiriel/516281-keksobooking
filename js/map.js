'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

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

var generateOffers = function () {
  var offers = [];
  OFFER_TITLES.sort(compareRandom); // Для неповторяющихся заголовков в рандомном порядке
  // var addressArray = getAddress();
  for (var i = 0; i < OFFERS_COUNT; i++) {
    var addressArray = [getRandomFromTo(300, 900), getRandomFromTo(150, 500)];
    offers.push({
      author: {
        avatar: getAvatar(i)
      },
      offer: {
        title: OFFER_TITLES[i],
        address: addressArray[0] + ', ' + addressArray[1],
        price: getRandomFromTo(1000, 1000000),
        type: TYPES[getRandomFromTo(0, 2)],
        rooms: getRandomFromTo(1, 5),
        guests: getRandomFromTo(1, 10),
        checkin: CHECK_TIME[getRandomFromTo(0, 2)],
        checkout: CHECK_TIME[getRandomFromTo(0, 2)],
        features: getFeatures(),
        description: 'тут будет описание',
        photos: getPhotos()
      },
      location: {
        x: addressArray[0],
        y: addressArray[1]
      }
    });
  }
  return offers;
};

var offersArray = generateOffers();

var showMap = function () {
  var mapBlock = document.querySelector('.map');
  mapBlock.classList.remove('map--faded');
};


var renderPins = function (offerArr) {
  var pinTemplate = document.querySelector('template').content;
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector('.popup__avatar').src = offerArr.author.avatar;
  pinElement.querySelector('h3').textContent = offerArr.offer.title;
  pinElement.querySelector('small').textContent = offerArr.offer.address;
  pinElement.querySelector('.popup__price').textContent = offerArr.offer.price + ' \u20bd/ночь';
  pinElement.querySelector('h4').textContent = offerArr.offer.type;
  pinElement.querySelectorAll('p')[2].textContent = offerArr.offer.rooms + ' комнаты для ' + offerArr.offer.guests + ' гостей';
  pinElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + offerArr.offer.checkin + ', выезд до ' + offerArr.offer.checkout;

  var featuresElement = pinElement.querySelector('.popup__features');
  featuresElement.innerHTML = '';
  for (var m = 0; m < offerArr.offer.features.length; m++) {
    featuresElement.insertAdjacentHTML('afterbegin', '<li class="feature feature--' + offerArr.offer.features[m] + '"></li>');
  }

  pinElement.querySelectorAll('p')[4].textContent = offerArr.offer.description;

  var photosElement = pinElement.querySelector('.popup__pictures');
  for (m = 0; m < offerArr.offer.photos.length; m++) {
    photosElement.insertAdjacentHTML('afterbegin', '<li><img src="' + offerArr.offer.photos[m] + '" width="70" height="70" ></li>');
  }
  var pinIcon = pinElement.querySelector('.map__pin');
  pinIcon.innerHTML = '<img src="' + offerArr.author.avatar + '" width="40" height="40" draggable="false">';
  pinIcon.style.left = (offerArr.location.x + PIN_WIDTH / 2) + 'px';
  pinIcon.style.top = (offerArr.location.y + PIN_HEIGHT) + 'px';
  return pinElement;
};

var setupPins = function () {
  var fragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');
  for (var n = 0; n < offersArray.length; n++) {
    fragment.appendChild(renderPins(offersArray[n]));
  }
  similarListElement.appendChild(fragment);
};

showMap();
setupPins();

