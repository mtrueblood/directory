/* jshint -W030 */
!function() {
    'use strict';

    var w = window
        , d = document
        , e = d.documentElement
        , g = d.getElementsByTagName('body')[0]
        , winWidth = w.innerWidth || e.clientWidth || g.clientWidth
        , winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight
        , landingContainer = '.landing'
        , cur_location = 'detroit'
        ;

    var directory = {

        appInit: function(){

            // Initialize Parse Application
            Parse.initialize('uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O', 'N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu');
            this.queryData();
        },

        queryData: function(){

            var UserData = Parse.Object.extend('directory')
                , query = new Parse.Query(UserData)
                , that = this
                ;

            query.ascending('lName');
            query.find({

                success: function(results) {

                    var html = '';

                    for (var i = 0; i < results.length; i++) {

                        var object = results[i]
                            , fName = object.get('fName')
                            , lName = object.get('lName')
                            , title = object.get('title')
                            , email = object.get('email')
                            , phone = object.get('phone')
                            , office = object.get('office')
                            , currentlyAt = object.get('currently')
                            , homeOffice = ''
                            ;

                        if(phone !== 'n/a'){
                            phone = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6,4);
                        }

                        if(cur_location !== office){
                            homeOffice = 'not-home';
                        }

                        html += '<li class="active '+homeOffice+'">';
                        html += '  <span class="user"><img src="assets/images/office/detroit/'+lName+'-'+fName+'.jpg"></span>';
                        html += '  <div class="user-container">';
                        html += '      <div class="user-flex">';
                        html += '          <div class="user-info user-default '+currentlyAt+'">';
                        html += '              <span class="name">'+fName+' '+lName+'</span>';
                        html += '              <span class="title">'+title+'</span>';
                        html += '              <span class="bell"><i class="icon-address-book"></i></span>';
                        html += '          </div>';
                        html += '          <div class="user-info user-details" style="background: #ccc url(assets/images/office/detroit/'+lName+'-'+fName+'.jpg) 0 0 no-repeat;">';
                        html += '              <span class="name">'+fName+' '+lName+'</span>';
                        html += '              <span class="title">'+title+'</span>';
                        html += '              <span class="email"><i class="icon-mail4"></i><a href="mailto:'+email+'" target="_blank">'+email+'</a></span>';
                        if(phone !== 'n/a'){
                            html += '              <span class="phone"><i class="icon-phone"></i><a href="tel:'+phone+'"  target="_blank">'+phone+'</a></span>';
                        }
                        html += '              <span class="office">'+office+'</span>';
                        html += '              <span class="close"><i class="icon-close"></i></span>';
                        html += '          </div>';
                        html += '      </div>';
                        html += '  </div>';
                        html += '</li>';

                    }

                    document.querySelector('.directory ul').innerHTML = html;

                },
                error: function(error) {

                    console.log('Error: ' + error.code + ' ' + error.message);
                }

            }).then(function(){

                that.events();
            });
        },

        events: function(){

            // search functionality
            $(document).on('keyup keypress focus focusin focusout', '.search input', function () {

                var filter = $(this).val().toLowerCase(); // get the value of the input, which we filter on
                $('.directory li').find('span.name:not(:contains(' + filter + '))').closest('li').slideUp();
                $('.directory li').find('span.name:contains(' + filter + ')').closest('li').slideDown();
            });

            // Footer Nav Menu
            [].forEach.call(document.querySelectorAll('nav a'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();

                    var that = this
                        , dataAtt = that.getAttribute('data-section')
                        , section = '.' + dataAtt
                        , allSections = '.section'
                        ;

                    if(dataAtt === 'directory'){

                        document.querySelector(landingContainer).style.display = 'none';
                        document.querySelector('h1').style.height = '139px';
                        document.querySelector(allSections).style.top = '139px';
                        document.querySelector(allSections).style.height = '56%';
                        document.querySelector('.search').style.display = 'inline';
                        document.querySelector('.welcome').style.display = 'none';
                    } else {

                        document.querySelector('h1').style.height = '90px';
                        $('.section').css({'top' : '90px', 'height' : '66%'});
                    }

                    $('.section').animate({left: '-'+ winWidth +'px'}, 200).promise().done(function(){

                        $(section).animate({left: '0px'}, 200);
                    });

                });
            });

            // Icon click to show more info overlay
            [].forEach.call(document.querySelectorAll('.bell'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();
                    var that = this;

                    $(that, '.bell').parent().next().fadeIn(200);

                    $('.section').css({'zIndex': '104', 'position': 'fixed', 'top': '0', 'height': '422px'});

                    if(winHeight <= 630){
                        document.querySelector('.search, h1, nav').style.display = 'none';
                    }
                });
            });

            // Close more info overlay
            [].forEach.call(document.querySelectorAll('.close'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();
                    var that = this;
                    $(that).parent().fadeOut(200);
                    $('.directory.section').css({'zIndex' : '101', 'position' : 'absolute', 'top' : '139px', 'height': '56%', 'left': '0px'});
                    $('.search, h1, nav').show();
                });
            });

        }
    };

    return directory.appInit();

}();

(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='//www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-XXXXX-X');ga('send','pageview');