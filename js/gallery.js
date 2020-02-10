$(document).ready(function () {
    var galleryContainerMain = $('#gallery-main');
    var galleryContainer = $('#gallery-row');

    firebase.database().ref('gallery').once('value')
        .then(function (snapshot) {
            var gallery = snapshot.val();

            Object.keys(gallery).map(function (key) {
                return {
                    id: key,
                    ...gallery[key]
                }
            }).forEach(function (el, index) {
                var img = document.createElement('img');

                if (index === 0) {
                    img.className = 'img-fluid';
                    img.alt = 'studio';
                    img.src = el.url;

                    galleryContainerMain.append(img);
                } else {
                    var imgContainer = document.createElement('div');
                    imgContainer.className = 'col-md-4';

                    img.className = 'img-fluid';
                    img.alt = 'studio';
                    img.src = el.url;

                    imgContainer.appendChild(img);

                    galleryContainer.append(imgContainer);
                }
            });

            zoomImg();
        });
});