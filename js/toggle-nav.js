$(document).ready(function () {
    const $toggler = $('.custom-toggler');
    const $nav = $('nav');

    $toggler.on('click', function () {
        $nav.slideToggle("slow");
        $toggler.toggleClass("open");
    });
});