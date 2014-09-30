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
            this.queryData();
        },

        queryData: function(){
            var UserData = Parse.Object.extend("directory");
            var query = new Parse.Query(UserData);
            var that = this;
            query.find({
              success: function(results) {
                console.log("Successfully retrieved " + results.length + " users.");
                // Do something with the returned Parse.Object values

                var html = '';

                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  var fName = object.get('fName');
                  var lName = object.get('lName');
                  var title = object.get('title');
                  var email = object.get('email');
                  var phone = object.get('phone');
                  var office = object.get('office');
                  var currentlyAt = object.get('currently');

                  html += '<li class="active">';

                  html += '  <span class="user"><img src="http://placehold.it/77x77"></span>';

                  html += '  <div class="user-container">';
                  html += '      <div class="user-flex">';
                  html += '          <div class="user-info user-default">';

                  html += '              <span class="name">'+fName+' '+lName+'</span>';
                  html += '              <span class="title">'+title+'</span>';
                  html += '              <span class="bell"><i class="icon-bell"></i></span>';
                  html += '          </div>';
                  html += '          <div class="user-info user-details">';
                  html += '              <span class="email">'+email+'</span>';
                  html += '              <span class="phone">'+phone+'</span>';
                  html += '              <span class="close"><i class="icon-close"></i></span>';
                  html += '          </div>';
                  html += '      </div>';
                  html += '  </div>';
                  html += '</li>';

                  console.log(object.id + ' - ' + object.get('fName'));
                }

                $('.directory ul').append(html);

              },
              error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
              }
            }).then(function(){
                that.events();
            });
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
                    });

                });
            });

            // Bell Event Handler
            [].forEach.call(document.querySelectorAll('.bell'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();

                    var that = this;

                    $('.bell').parent().animate({
                        marginLeft: '0px'
                    }, 100).promise().done(function(){

                        $(that).parent().animate({
                            marginLeft: '-250px'
                        }, 200);
                    });

                });
            });

            // Bell Event Handler
            [].forEach.call(document.querySelectorAll('.close'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();

                    var that = this;

                    $(that).parent().prev().animate({
                        marginLeft: '0px'
                    }, 200);

                });
            });

        }

    }

})();

directory.appInit();





(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X');ga('send','pageview');