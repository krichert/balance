$(document).ready(function () {
    const $navMenuItems = $('#navbar-content a');

    $(window).resize(function () {
        const mq = window.matchMedia("(max-width: 767px)");
        if (mq.matches) {
            $navMenuItems.attr("data-toggle", "collapse").attr("data-target", "#navbar-content");
        }
        else {
            $navMenuItems.removeAttr("data-toggle").removeAttr("data-target");
        }
    });
});