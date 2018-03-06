'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('.notice__photo input[type=file]');
  var preview = document.querySelector('.notice__preview').querySelector('img');

  var previewAvatar = function (file) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
        preview.style.borderRadius = '4px';
      });

      reader.readAsDataURL(file);
    }
  };

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    previewAvatar(file);
  });

  var uploadAvatar = function () {
    var dropZone = document.querySelector('.notice__photo .drop-zone');

    dropZone.addEventListener('dragover', function (evt) {
      evt.preventDefault();
      dropZone.setAttribute('style', 'border-color: orange; background-color: #dadada');
      return false;
    });

    dropZone.addEventListener('dragleave', function (evt) {
      evt.preventDefault();
      dropZone.removeAttribute('style');
      return false;
    });
    dropZone.addEventListener('drop', function (evt) {
      evt.preventDefault();
      dropZone.removeAttribute('style');

      var file = evt.dataTransfer.files[0];
      previewAvatar(file);
    });
  };

  uploadAvatar();

  var uploadPhotos = function () {
    var dropZone = document.querySelector('.form__photo-container .drop-zone');
    var photoChooser = document.querySelector('.form__photo-container input[type=file]');
    var photoPreview = document.querySelector('.form__photo-container');
    photoChooser.setAttribute('multiple', 'true');

    var block = document.createElement('div');
    block.classList.add('form__photo');
    photoPreview.appendChild(block);
    var fragment = document.createDocumentFragment();

    var uploadPhoto = function (file) {
      var fileName = file.name.toLowerCase();
      var img = document.createElement('img');
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          img.classList.add('photo_preview');
          img.draggable = true;
          img.src = reader.result;
          img.style.width = '50px';
          img.style.height = '50px';
          img.style.border = '2px solid #dadada';
          img.style.borderRadius = '8px';
        });
        reader.readAsDataURL(file);
      }
      return img;
    };

    var photosChangeHandler = function () {
      var files = photoChooser.files;
      for (var i = 0; i < files.length; i++) {
        fragment.appendChild(uploadPhoto(files[i]));
      }
      block.appendChild(fragment);
    };
    photoChooser.addEventListener('change', photosChangeHandler);

    dropZone.addEventListener('dragover', function (evt) {
      evt.preventDefault();
      dropZone.setAttribute('style', 'border-color: orange; background-color: #dadada');
      return false;
    });

    dropZone.addEventListener('dragleave', function (evt) {
      evt.preventDefault();
      dropZone.removeAttribute('style');
      return false;
    });
    dropZone.addEventListener('drop', function (evt) {
      evt.preventDefault();
      dropZone.removeAttribute('style');

      var files = evt.dataTransfer.files;
      for (var i = 0; i < files.length; i++) {
        fragment.appendChild(uploadPhoto(files[i]));
      }
      block.appendChild(fragment);
    });
  };
  uploadPhotos();
})();
