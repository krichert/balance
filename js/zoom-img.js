$(document).ready(function () {
    const $photos = $('#gallery img');

    $photos.hover(function() {
        $photos.css('opacity', '0.3');
        $(this).css({
            'opacity': '1',
            'transform': 'scale(1.5,1.5)',
        });
        $(this).parent().css({'z-index': '1'})
    }, function () {
        $photos.css('opacity', '1');
        $(this).css('transform', 'scale(1,1)');
        $(this).parent().css({'z-index': '0'})
    });
});