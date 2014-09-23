"use strict";

/* Vanilla JS FadeIn / FadeOut */
// arguments  (out || in, element, duration, forceIE support true || false)
// usage: fade('in', el, 200, true);
//        fade('out', el, 750, true);

function fade(e,t,n,r){function a(){s=i?s+u:s-u;n.style.opacity=s;if(r){n.style.filter="alpha(opacity="+s*100+")";n.style.filter="progid:DXImageTransform.Microsoft.Alpha(Opacity="+s*100+")"}if(s<=0||s>=1)window.clearInterval(f);if(s<=0)n.style.display="none"}var i=e==="in",s=i?0:1,o=50,u=o/t;if(i){n.style.display="block";n.style.opacity=s;if(r){n.style.filter="alpha(opacity="+s+")";n.style.filter="progid:DXImageTransform.Microsoft.Alpha(Opacity="+s+")"}}var f=window.setInterval(a,o)}

!function() {

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        winWidth = w.innerWidth || e.clientWidth || g.clientWidth,
        winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var landingContainer = document.querySelector('.landing');

    setTimeout(function(){ fade('out', 500, landingContainer, true) }, 2000);

    // settings nav icon click
    /*
    $(document).on("click",".settings-nav-icon",function() {
        $this = $(this);
        if(!($this).hasClass("open")) {
            $('.side-panel').animate({ width: "0%", opacity: 0 }, 'slow', function() {
                $('.side-panel').removeClass("open");
                $('.side-panel').html("");
            });
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
        var tool = ($(this).attr('class').split(' ')[1]);
        $(".settings-nav-icon span").addClass("icon-menu2").html("");
        $(".settings-nav-icon").removeClass("open");
        $('.content-wrapper').animate({ width: "100%" }, 'slow', function() {});
        $('.settings-menu').animate({ width: "0%", opacity: 0 }, 'slow', function() {});

        if($('.side-panel').hasClass("open")) {
            $('.side-panel').animate({ width: "0%", opacity: 0 }, 'fast', function() {
                $('.side-panel').animate({ width: "80%", opacity: 1 }, 'fast', function() {
                    $('.side-panel').addClass("open");
                });
                $('.side-panel').load('includes/'+tool+'.html');
            });
        } else {
            $('.side-panel').animate({ width: "80%", opacity: 1 }, 'fast', function() {
                $('.side-panel').addClass("open");
                $('.side-panel').load('includes/'+tool+'.html');
            });
        }
    });

    $(document).on("click",".close-sidepanel",function() {
        $('.side-panel').animate({ width: "0%", opacity: 0 }, 'slow', function() {
            $('.side-panel').removeClass("open");
            $('.side-panel').html("");
        });
    });
*/


}();


(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X');ga('send','pageview');

(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X');ga('send','pageview');