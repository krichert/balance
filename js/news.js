$(document).ready(function () {
    var newsContainer = $('#news .row');

    firebase.database().ref('news').once('value')
        .then(function (snapshot) {
            var news = snapshot.val();

            var arrayNews = Object.keys(news).map(function (key) {
                return {
                    id: key,
                    ...news[key]
                }
            });

            arrayNews.forEach(function (el) {
                var container = document.createElement('div');

                if (arrayNews.length === 1) {
                    container.className = 'offset-sm-3 col-sm-6';
                } else {
                    container.className = 'col-sm-6';
                }

                var imgContainer = document.createElement('div');
                imgContainer.className = 'bg-white text-center';

                var img = document.createElement('img');
                img.setAttribute('src', el.url);
                img.setAttribute('alt', 'aktualności');

                imgContainer.appendChild(img);

                var textContainer = document.createElement('div');
                textContainer.className = 'bg-white card-body text-center';

                var title = document.createElement('h3');
                title.innerText = el.title;

                var description = document.createElement('p');
                description.className = 'card-text';
                description.innerText = el.text;

                var date = document.createElement('small');
                date.innerText = el.date;

                textContainer.appendChild(title);
                textContainer.appendChild(description);
                textContainer.appendChild(date);

                container.appendChild(imgContainer);
                container.appendChild(textContainer);

                newsContainer.append(container);
            });
    });
});