'use strict';

(function () {
  var FILTER_FORM = document.querySelector('.map__filters');
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

  window.filtrate = function (array) {
    var changeTypeHandler = function (evt) {
      enabledFilters.type = evt.target.value;
      window.debounce(reloadPins);
    };

    var getPriceFilter = function (value, price) {
      switch (value) {
        case 'low':
          return (price < 10000);
        case 'middle':
          return ((price >= 10000) && (price <= 50000));
        case 'high':
          return (price > 50000);
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
          return (rooms === 1);
        case '2':
          return (rooms === 2);
        case '3':
          return (rooms === 3);
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
          return (guests === 1);
        case '2':
          return (guests === 2);
        default:
          return true;
      }
    };

    var changeCapacityHandler = function (evt) {
      enabledFilters.capacity = evt.target.value;
      window.debounce(reloadPins);
    };

    var getFeaturesFilter = function (value) {
      if (enabledFilters.features.length === 0) {
        return true;
      } else {
        var count = 0;
        var offerFeatures = value.offer.features;
        for (var i = 0; i < enabledFilters.features.length; i++) {
          if (offerFeatures.indexOf(enabledFilters.features[i]) >= 0) {
            count++;
          }
        }
        return (count === enabledFilters.features.length);
      }
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
      window.results = array.filter(function (value) {
        var isResult = (((enabledFilters.type === 'any') || (value.offer.type === enabledFilters.type)) &&
        ((enabledFilters.price === 'any') || (getPriceFilter(enabledFilters.price, value.offer.price))) &&
        ((enabledFilters.rooms === 'any') || (getRoomsFilter(enabledFilters.rooms, value.offer.rooms))) &&
        ((enabledFilters.capacity === 'any') || (getGuestsFilter(enabledFilters.capacity, value.offer.guests)))) &&
        ((enabledFilters.features === []) || (getFeaturesFilter(value)));
        return isResult;
      });
      window.results = window.results.slice(0, Math.min(5, window.results.length));
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
