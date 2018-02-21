'use strict';

// Генерация объявлений
(function () {
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

  window.pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

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

  window.generateOffers = function () {
    var offers = [];
    OFFER_TITLES.sort(compareRandom); // Для неповторяющихся заголовков в рандомном порядке
    for (var i = 0; i < OFFERS_COUNT; i++) {
      var locX = getRandomFromTo(window.PIN_MIN_X, window.PIN_MAX_X);
      var locY = getRandomFromTo(window.PIN_MIN_Y, window.PIN_MAX_Y);
      offers.push({
        author: {
          avatar: getAvatar(i)
        },
        offer: {
          title: OFFER_TITLES[i],
          address: (locX + (window.pinSize.WIDTH / 2)) + ', ' + (locY + (window.pinSize.HEIGHT)),
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
})();
