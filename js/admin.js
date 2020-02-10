$(document).ready(function () {
    var loginSection = $('#login');
    var panelSection = $('#panel');

    var inputEmail = $('#inputEmail');
    var inputPassword = $('#inputPassword');
    var submitLogin = $('#submitLogin');

    submitLogin.on('click', function (e) {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(inputEmail.val(), inputPassword.val())
            .catch(function () {
                alert('Nie poprawny login lub hasło. Spróbuj ponownie.')
            });

    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loginSection.hide();
            panelSection.show();
        } else {
            loginSection.show();
            panelSection.hide();
        }
    });
});

$(document).ready(function () {
    var signOutButton = $('#signOut');

    signOutButton.on('click', function () {
        firebase.auth().signOut();
    });
});

function formatNumber(month) {
    if (month < 10) {
        return '0' + month;
    } else {
        return month;
    }
}

$(document).ready(function () {
    var today = new Date();

    var newsDateInput = $('#newsDate');
    var newsTitleInput = $('#newsTitle');
    var newsDescriptionInput = $('#newsDescription');
    var newsPhotoInput = $('#newsPhoto');
    var newsSubmit = $('#newsSubmit');

    newsDateInput.val(today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());

    newsSubmit.on('click', function (e) {
        e.preventDefault();

        if (!newsPhotoInput[0].files[0]) {
            return alert('Dodaj zdjęcie')
        }

        addNews(newsDateInput.val(), newsTitleInput.val(), newsDescriptionInput.val(), newsPhotoInput[0].files[0])
            .then(function () {
                newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
                newsTitleInput.val('');
                newsDescriptionInput.val('');
            })
    });

    getNews();
});

function getNews() {
    var tableBody = document.querySelector('.news-table tbody');

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    firebase.database().ref('news').once('value')
        .then(function (snapshot) {
            var news = snapshot.val();

            Object.keys(news).map(function (key) {
                return {
                    id: key,
                    ...news[key]
                }
            }).forEach(function (el) {
                var row = document.createElement('tr');

                var dateCol = document.createElement('td');
                var titleCol = document.createElement('td');
                var textCol = document.createElement('td');

                var imgCol = document.createElement('td');
                var img = document.createElement('img');
                img.setAttribute('src', el.url);
                img.setAttribute('width', '100');
                imgCol.appendChild(img);

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.className = 'btn btn-danger';
                delCol.className = 'text-center';

                delCol.appendChild(delBtn);


                delBtn.addEventListener('click', function () {
                    removeNews(el.id);
                });


                dateCol.innerText = el.date;
                textCol.innerText = el.text;
                titleCol.innerText = el.title;

                row.appendChild(dateCol);
                row.appendChild(titleCol);
                row.appendChild(textCol);
                row.appendChild(imgCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeNews(id) {
    firebase.database().ref('news/' + id).remove()
        .then(function () {
            firebase.storage().ref('news/' + id).delete().then(function () {
                getNews();
            })
        })
}

function addNews(date, title, text, file) {
    var key = firebase.database().ref('news').push().key;

    var uploadTask = firebase.storage().ref('news/' + key).put(file)

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function(error) {
        alert('Błąd podczas dodwania aktualności. Spróbuj ponownie!')
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            return firebase.database().ref('news/' + key).set({
                date: date,
                title: title,
                text: text,
                url: downloadURL
            }).then(function () {
                getNews();
            })
        });
    })
}

$(document).ready(function () {
    var photoInput = $('#photo');
    var photoSubmit = $('#photoSubmit');

    photoSubmit.on('click', function (e) {
        e.preventDefault();

        if (photoInput[0].files[0]) {
            addGallery(photoInput[0].files[0])
        } else {
            alert('Dodaj zdjęcie!')
        }
    });

    getGallery();
});

function getGallery() {
    var tableBody = document.querySelector('.gallery-table tbody');

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    firebase.database().ref('gallery').once('value')
        .then(function (snapshot) {
            var gallery = snapshot.val();

            Object.keys(gallery).map(function (key) {
                return {
                    id: key,
                    ...gallery[key]
                }
            }).forEach(function (el) {
                var row = document.createElement('tr');

                var nameCol = document.createElement('td');
                nameCol.innerText = el.name;

                var imgCol = document.createElement('td');
                var img = document.createElement('img');
                img.setAttribute('src', el.url);
                img.setAttribute('width', '100');

                imgCol.appendChild(img);

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.className = 'btn btn-danger';
                delCol.className = 'text-center';

                delCol.appendChild(delBtn);


                delBtn.addEventListener('click', function () {
                    removeGallery(el.id);
                });

                row.appendChild(nameCol);
                row.appendChild(imgCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeGallery(id) {
    firebase.storage().ref('gallery/' + id).delete()
        .then(function () {
            firebase.database().ref('gallery/' + id).remove().then(function () {
                getGallery();
            })
        })
}

function addGallery(file) {
    var key = firebase.database().ref('gallery').push().key;

    var uploadTask = firebase.storage().ref('gallery/' + key).put(file)

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function(error) {
        alert('Błąd podczas dodwania zdjęcia. Spróbuj ponownie!')
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            firebase.database().ref('gallery/' + key).set({
                name: file.name,
                url: downloadURL
            }).then(function () {
                getGallery();
            })
        });
    });
}