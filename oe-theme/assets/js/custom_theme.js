var b = document.location.hostname.split(".");
var host = "." + b[b.length - 2] + "." + b[b.length - 1];
if (!getCookie("feh"))
{
    setCookie("feh", document.location.href, {domain: host, path: '/', expires: 50000000000});
}
if (!getCookie("fep"))
{
    setCookie("fep", document.location.pathname, {domain: host, path: '/', expires: 50000000000});
}
if (!getCookie("feq"))
{
    setCookie("feq", document.location.search, {domain: host, path: '/', expires: 50000000000});
}
if (!getCookie("fed"))
{
    setCookie("fed", document.location.hostname, {domain: host, path: '/', expires: 50000000000});
}
if (document.referrer)
{
    if (!getCookie("fer"))
    {
        setCookie("fer", document.referrer, {domain: host, path: '/', expires: 50000000000});
    }
    setCookie("lar", document.referrer, {domain: host, path: '/', expires: 50000000000});
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires === "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}
var $ = jQuery;
function addFixs(elemLeft, elemWidth) {
    $("#sideBar").css({
        position: "fixed",
        right: 0
    });
}
function removeFixs( ) {
    $("#sideBar").removeAttr("style");
}
$(document).ready(function () {
    var elemTop = $('#sideBar').offset().top;
    var elemLeft = $('#sideBar').offset().left;
    var elemWidth = $('#sideBar').width();
    $(document).on("scroll", function () {
        var winHeight = $(window).height();
        if ($(window).width() > 990) {
            if ($(document).scrollTop() > elemTop && $("#sideBar").css("position") !== "fixed") {
                $("#sideBar").css("max-height", winHeight);
                $("#sideBarmobile .toc").css("max-height", winHeight / 4);
                addFixs(elemLeft, elemWidth);
            }
            if ($(document).scrollTop() < elemTop && $("#sideBar").css("position") === "fixed") {
                $("#sideBar").css("max-height", winHeight);
                $("#sideBarmobile .toc").css("max-height", winHeight / 4);
                removeFixs();
            }
        }
        ;

    });
    $("table").wrap('<div class="table-responsive"></div>');
    $("table").addClass("table table-hover");
    var root = $('html, body');
    $("body").on('click', '.toc a', function (event) {
        event.preventDefault();
        var href = $.attr(this, 'href');

        root.animate({
            scrollTop: $(href).offset().top
        }, 500, function () {
            window.location.hash = href;
        });
        return false;
    });
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
});
