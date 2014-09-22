$( document ).ready(function() {
console.log("Doc ready");

    var winHeight = $(window).height();
    var winWidth = $(window).width();
    console.log("Height: "+winHeight+" Width: "+winWidth);

    // set height of setting menu
    $(".settings-menu").css("height",winHeight);

    // settings nav icon click
    $(document).on("click",".settings-nav-icon",function() {
        $this = $(this);
        if(!($this).hasClass("open")) {
            $('.settings-menu').animate({ width: "25%", opacity: 1 }, 'slow', function() {});
            $('.content-wrapper').animate({ width: "75%" }, 'slow', function() {});
            $(this).addClass("open");
            $(".settings-nav-icon span").removeClass("icon-menu2").html("X");
        } else {
            $(".settings-nav-icon span").addClass("icon-menu2").html("");
            $(this).removeClass("open");
            $('.content-wrapper').animate({ width: "100%" }, 'slow', function() {});
            $('.settings-menu').animate({ width: "0%", opacity: 0 }, 'slow', function() {});
        }
    });

    $(document).on("click",".tool",function() {
        $this = $(this);
        var tool = $this.data("tool");
        $('.settings-menu').animate({ width: "85%", opacity: 1 }, 'slow', function() {});  
    });

});
(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X');ga('send','pageview');