var $ = jQuery;
var whaittimer;
$(document).ready(function () {
//    $('input.flat').iCheck({
//        checkboxClass: 'icheckbox_flat-green',
//        radioClass: 'iradio_flat-green'
//    });
    if ($(window).width() < 767) {
        var isTrue = true;
        var elemFix = $('#fix'), elemFixWidth = $('#fix').outerWidth();
        elemFix.css({left: -elemFixWidth, display: 'block'});
        $('body').on('click', '#mobileLeftMenu', function () {
            if (isTrue) {
                elemFix.addClass("showElemFix");
                $(".toggle").animate({left: elemFixWidth});
                elemFix.animate({left: 0});
                isTrue = false;
            } else {
                elemFix.removeClass("showElemFix");
                $(".toggle").animate({left: 0});
                elemFix.animate({left: -elemFixWidth});
                isTrue = true;
            }
            ;
        });
        $("body").mouseup(function (e) {
            if ((e.target.id !== elemFix.attr('id') && !elemFix.has(e.target).length) && (!(e.target.id === $('#mobileLeftMenu').attr('id')) && !($('#mobileLeftMenu').has(e.target).length))) {
                elemFix.removeClass("showElemFix");
                $(".toggle").animate({left: 0});
                elemFix.animate({left: -elemFixWidth});
                isTrue = true;
            }
        });
        $(document).on('scroll', function () {
            elemFix.css({height: $(document).height()});
        });
    }
    $('#return-to-top').click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });
    $(document).on('scroll', function () {
        if ($(this).scrollTop() >= 500) {
            $('#return-to-top').fadeIn(200);
        } else {
            $('#return-to-top').fadeOut(200);
        }
    });
    ;
});