"use strict";

var directory = (function () {

    var w = window
        , d = document
        , e = d.documentElement
        , g = d.getElementsByTagName('body')[0]
        , winWidth = w.innerWidth || e.clientWidth || g.clientWidth
        , winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight
        , landingContainer = '.landing'
        ;

    return {

        appInit: function(){
            // Fade-Out Sapient Landing
            setTimeout(function(){ $(landingContainer).fadeOut(200) }, 2000);
            // Initialize Parse Application
            Parse.initialize("uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O", "N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu");
            this.events();
        },

        events: function(){

            // Nav Menu Event Handler
            [].forEach.call(document.querySelectorAll('nav a'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    var that = this;
                    var section = '.' + that.getAttribute('data-section');
                    var allSections = '.section';

                    $('.section').fadeOut(200).promise().done(function(){
                        $(section).fadeIn(200);
                    })

                });
            });

        }

    }

})();

directory.appInit();




