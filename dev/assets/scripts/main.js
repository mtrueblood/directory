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

            $('.directory ul, .checkin ul').empty();
            // Initialize Parse Application
            Parse.initialize('uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O', 'N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu');
            this.queryData();
            this.geoLocate();
        },

        getOffice: function(location, point){
            var offices = {};

            offices = {
                'detroit' : {
                    'latitude' : '42.546897',
                    'longitude' : '-83.214471'
                }
            };

            return offices[cur_location][point];

        },

        showPosition: function(position){

            var userLatitude = position.coords.latitude
                , userLongitude = position.coords.longitude
                , officeLatitude = directory.getOffice(cur_location, 'latitude')
                , officeLongitude = directory.getOffice(cur_location, 'longitude')
                ;

            var map = new GMaps({
                div: '#map',
                lat: officeLatitude,
                lng: officeLongitude
            });

            var path = [
                [42.547334,-83.215245],
                [42.547540,-83.214773],
                [42.547208,-83.214515],
                [42.547018,-83.214955],
                [42.547334,-83.215224]
            ];
            /*
            var path = [
                [42.488349,-83.119597],
                [42.488349,-83.118439],
                [42.487606,-83.118396],
                [42.487606,-83.119533],
                [42.488326,-83.119608]
            ];*/

            var polygon = map.drawPolygon({
                paths: path, // pre-defined polygon shape
                strokeColor: '#BBD8E9',
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '#BBD8E9',
                fillOpacity: 0.6
            });

            var currentUser = Parse.User.current();
            if (currentUser) {
                var email = currentUser.get('email');

                if( !map.checkGeofence(userLatitude, userLongitude, polygon) ) {
                    console.log('user not in geofence');
                    directory.updateUserLocation(email, false);
                } else {
                    console.log('user in geofence');
                    directory.updateUserLocation(email, true);
                }
            }

        },

        updateUserLocation: function(email, inFence){
            var UserStatus = Parse.Object.extend('directory');
            var query = new Parse.Query(UserStatus);
            query.equalTo('email', email);
            var location = cur_location;
            if(inFence !== true){
                location = '';
            }
            query.first({
                success: function (Contact) {
                    Contact.save(null, {
                        success: function (contact) {

                            contact.set('currentlyAt', location);
                            contact.save();
                        }
                    });

                    if(inFence !== true){
                        $('li[data-email="'+email+'"]').removeClass('active').addClass('inactive');
                    } else {
                        $('li[data-email="'+email+'"]').removeClass('inactive').addClass('active');
                    }
                }
            });
        },

        geoLocate: function(){

            var that = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(that.showPosition);
            }
        },

        queryData: function(){

            var UserData = Parse.Object.extend('directory')
                , query = new Parse.Query(UserData)
                , that = this
                ;

            query.ascending('lName');
            query.find({

                success: function(results) {

                    for (var i = 0; i < results.length; i++) {

                        var object = results[i]
                            , fName = object.get('fName')
                            , lName = object.get('lName')
                            , title = object.get('title')
                            , email = object.get('email')
                            , phone = object.get('phone')
                            , office = object.get('office')
                            , currentlyAt = object.get('currently')
                            , inOffice = ''
                            ;

                        if(phone !== 'n/a'){
                            phone = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6,4);
                        }



                        if(cur_location !== office){
                            inOffice = '<br>' + office;
                        }

                        var html = '';
                        html += '<li data-email="'+email+'" data-user="'+lName+'-'+fName+'" class="inactive">';
                        html += '  <span class="user"><img src="assets/images/office/'+office+'/'+lName+'-'+fName+'.jpg"></span>';
                        html += '  <div class="user-container">';
                        html += '      <div class="user-flex">';
                        html += '          <div class="user-info user-default '+currentlyAt+'">';
                        html += '              <span class="name">'+fName+' '+lName+'</span>';
                        html += '              <span class="title">'+title+' ' + inOffice + '</span>';
                        html += '              <span class="user-info-icon"><i class="icon-address-book"></i></span>';
                        html += '          </div>';
                        html += '          <div class="user-info user-details" style="background: #ccc url(assets/images/office/'+office+'/'+lName+'-'+fName+'.jpg) 0 0 no-repeat;">';
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

                        if(cur_location === office){
                            $('.directory ul').append(html);
                        } else {
                            $('.checkin ul').append(html);
                        }

                    }



                },
                error: function(error) {

                    console.log('Error: ' + error.code + ' ' + error.message);
                }

            }).then(function(){

                that.events();
            });
        },

        events: function(){

            var currentUser = Parse.User.current();
            if (currentUser) {
                $('.logout').show();
                $('.user-login h2, .user-login-screen, .user-signup-screen').hide();
            } else {
                $('.user-login h2, .user-login-screen').show();
            }

            $(document).on('click', '.user-login h2 a', function(e){
                var type = $(this).data('login');

                $('.screen').hide();
                $('.user-'+type+'-screen').show();
            });

            $(document).on('click', '.logout-btn', function(e){
                e.preventDefault();
                Parse.User.logOut();
                $('.user-login h2, .user-login-screen').show();
            });

            $(document).on('click', '.signup-btn', function(e){
                e.preventDefault();

                var user = new Parse.User();
                var username = $('input.signup-username').val();
                var password = $('input.signup-password').val();
                var email = $('input.signup-email').val();

                if(email.indexOf('@sapient.com') > -1){
                    user.set('username', username);
                    user.set('password', password);
                    user.set('email', email);


                    user.signUp(null, {
                        success: function(user) {
                            alert('signed up successfully');
                        },
                        error: function(user, error) {
                        // Show the error message somewhere and let the user try again.
                            alert('Error: ' + error.code + ' ' + error.message);
                        }
                    });
                }
            });

            $(document).on('click', '.login-btn', function(e){
                e.preventDefault();

                var username = $('input.login-username').val();
                var password = $('input.login-password').val();

                Parse.User.logIn(username, password, {
                    success: function(user) {
                        alert('logged in successfully');
                    },
                    error: function(user, error) {
                        // The login failed. Check error to see why.
                    }
                });
            });

            // search functionality
            $(document).on('keyup keypress focus focusin focusout', '.search input', function () {

                var filter = $(this).val().toLowerCase(); // get the value of the input, which we filter on
                $('.directory li, .checkin li').find('span.name:not(:contains(' + filter + '))').closest('li').slideUp();
                $('.directory li, .checkin li').find('span.name:contains(' + filter + ')').closest('li').slideDown();
            });

            // Footer Nav Menu
            [].forEach.call(document.querySelectorAll('nav a'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();

                    var that = this
                        , dataAtt = that.getAttribute('data-section')
                        , section = '.' + dataAtt
                        , heading = document.querySelector('h1').style
                        , allSections = document.querySelector('.' + dataAtt).style
                        , search = document.querySelector('.search').style
                        , welcome = document.querySelector('.welcome').style
                        ;

                    $('nav a').removeClass('open');
                    $(that).addClass('open');

                    if(dataAtt === 'directory' || dataAtt === 'checkin'){

                        document.querySelector(landingContainer).style.display = 'none';
                        heading.height = '139px';
                        allSections.top = '139px';
                        allSections.height = '56%';
                        allSections.zIndex = '101';
                        search.display = 'inline';
                        welcome.display = 'none';
                    } else {

                        heading.height = '90px';
                        $('.section').css({'top' : '90px', 'height' : '66%'});
                    }

                    $('.section').animate({left: '-'+ winWidth +'px'}, 200).promise().done(function(){

                        $(section).animate({left: '0px'}, 200);
                    });

                });
            });

            // Icon click to show more info overlay
            [].forEach.call(document.querySelectorAll('.user-info-icon'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();
                    var that = this
                        , directoryElems = document.querySelector('.search, h1, nav').style
                        ;

                    $(that, '.user-info-icon').parent().next().fadeIn(200);

                    $('.section').css({'zIndex': '104', 'position': 'fixed', 'top': '0', 'height': '422px'});

                    if(winHeight <= 630){
                        directoryElems.display = 'none';
                    }
                });
            });

            // Close more info overlay
            [].forEach.call(document.querySelectorAll('.close'), function(el) {
                el.addEventListener('click', function(e) {

                    e.preventDefault();
                    var that = this
                        , section = $('nav a.open').data('section')
                        ;

                    $(that).parent().fadeOut(200);
                    $('.'+section+'.section').css({'zIndex' : '101', 'position' : 'absolute', 'top' : '139px', 'height': '56%', 'left': '0px'});
                    document.querySelector('.search, h1, nav').style.display = 'block';
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