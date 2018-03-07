'use strict';

(function () {
  var FILTER_FORM = document.querySelector('.map__filters');

  var PRICE_MIN = 10000;
  var PRICE_MAX = 50000;

  var ONE_GUEST = 1;
  var TWO_GUESTS = 2;

  var ONE_ROOM = 1;
  var TWO_ROOMS = 2;
  var THREE_ROOMS = 3;

  var Filters = {
    TYPE: FILTER_FORM.querySelector('#housing-type'),
    PRICE: FILTER_FORM.querySelector('#housing-price'),
    ROOMS: FILTER_FORM.querySelector('#housing-rooms'),
    CAPACITY: FILTER_FORM.querySelector('#housing-guests'),
    FEATURES: FILTER_FORM.querySelector('#housing-features')
  };

  var enabledFilters = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    capacity: 'any',
    features: []
  };

  window.filtrate = function (offers) {
    var changeTypeHandler = function (evt) {
      enabledFilters.type = evt.target.value;
      window.debounce(reloadPins);
    };

    var getPriceFilter = function (value, price) {
      switch (value) {
        case 'low':
          return (price < PRICE_MIN);
        case 'middle':
          return ((price >= PRICE_MIN) && (price <= PRICE_MAX));
        case 'high':
          return (price > PRICE_MAX);
        default:
          return true;
      }
    };

    var changePriceHandler = function (evt) {
      enabledFilters.price = evt.target.value;
      window.debounce(reloadPins);
    };

    var getRoomsFilter = function (value, rooms) {
      switch (value) {
        case '1':
          return (rooms === ONE_ROOM);
        case '2':
          return (rooms === TWO_ROOMS);
        case '3':
          return (rooms === THREE_ROOMS);
        default:
          return true;
      }
    };

    var changeRoomsHandler = function (evt) {
      enabledFilters.rooms = evt.target.value;
      window.debounce(reloadPins);
    };

    var getGuestsFilter = function (value, guests) {
      switch (value) {
        case '1':
          return (guests === ONE_GUEST);
        case '2':
          return (guests === TWO_GUESTS);
        default:
          return true;
      }
    };

    var changeCapacityHandler = function (evt) {
      enabledFilters.capacity = evt.target.value;
      window.debounce(reloadPins);
    };

    var getFeaturesFilter = function (value) {
      var offerFeatures = value.offer.features;
      var find = function (features, valueFeature) {
        return features.indexOf(valueFeature);
      };
      for (var i = 0; i < enabledFilters.features.length; i++) {
        var index = find(offerFeatures, enabledFilters.features[i]);
        if (index < 0) {
          return false;
        }
      }
      return true;
    };

    var checkFeatureHandler = function (evt) {
      if (evt.target.className === '') { // Нужна проверка, так как кликаем на инпут и лейбл одновременно
        var target = evt.target;
        var feature = target.value;
        var index = enabledFilters.features.indexOf(feature);
        if (target.checked) {
          enabledFilters.features.push(feature);
        } else {
          enabledFilters.features.splice(index, 1);
        }
      }
      window.debounce(reloadPins);
    };

    var enableFilters = function () {
      window.results = offers.filter(function (value) {
        return (((enabledFilters.type === 'any') || (value.offer.type === enabledFilters.type)) &&
        ((enabledFilters.price === 'any') || (getPriceFilter(enabledFilters.price, value.offer.price))) &&
        ((enabledFilters.rooms === 'any') || (getRoomsFilter(enabledFilters.rooms, value.offer.rooms))) &&
        ((enabledFilters.capacity === 'any') || (getGuestsFilter(enabledFilters.capacity, value.offer.guests)))) &&
        ((enabledFilters.features === []) || (getFeaturesFilter(value)));
      });
      window.results = window.results.slice(0, Math.min(window.SIMILAR_PIN_MAX_COUNT, window.results.length));
      return window.results;
    };

    var reloadPins = function () {
      window.removeElements();
      window.setupPins(enableFilters());
    };

    Filters.FEATURES.addEventListener('click', checkFeatureHandler);
    Filters.TYPE.addEventListener('change', changeTypeHandler);
    Filters.PRICE.addEventListener('change', changePriceHandler);
    Filters.ROOMS.addEventListener('change', changeRoomsHandler);
    Filters.CAPACITY.addEventListener('change', changeCapacityHandler);
  };

  window.resetFilters = function () {
    Filters.TYPE.querySelector('option').selected = true;
    Filters.PRICE.querySelector('option').selected = true;
    Filters.ROOMS.querySelector('option').selected = true;
    Filters.CAPACITY.querySelector('option').selected = true;
    var checkboxes = Filters.FEATURES.querySelectorAll('input');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };
})();
