/* jshint -W030 */
!function() {
    'use strict';

    // Initialize Parse Application
    Parse.initialize('uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O', 'N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu');
    var pubnub = PUBNUB.init({
        publish_key: 'pub-c-2d364555-4032-454d-bd96-2736e9f9d40d',
        subscribe_key: 'sub-c-bbfbc38a-604f-11e4-b0f7-02ee2ddab7fe'
    });



    var w = window
        , d = document
        , e = d.documentElement
        , g = d.getElementsByTagName('body')[0]
        , winWidth = w.innerWidth || e.clientWidth || g.clientWidth
        , winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight
        , landingContainer = '.landing'
        , currentUser = Parse.User.current()
        ;

    window.cur_location = 'detroit';

    var directory = {

        // Initialize app
        appInit: function(){

            $('.directory ul, .checkin ul').empty();

            if(currentUser){
                this.queryData();
                this.geoLocate();
            }

            this.events();



        },

        // Office lat / longs
        getOffice: function(location, point){
            var offices = {};

            offices = {
                'detroit' : {
                    'latitude' : '42.546897',
                    'longitude' : '-83.214471'
                },
                'chicago' : {
                    'latitude' : '41.881596',
                    'longitude' : '-87.627710'
                }
            };

            return offices[window.cur_location][point];

        },

        getCityName: function(city){
            var baseCity = city;
            switch(city){
            case 'birmingham':
            case 'royal oak':
            case 'ferndale':
            case 'detroit':
            case 'bloomfield hills':
            case 'west bloomfield':
                baseCity = 'detroit';
                break;
            case 'chicago':
                baseCity = 'chicago';
                break;
            }

            return baseCity;
        },

        // Geofencing functionality
        showPosition: function(position){

            var userLatitude = position.coords.latitude
                , userLongitude = position.coords.longitude
                , officeLatitude = directory.getOffice(window.cur_location, 'latitude')
                , officeLongitude = directory.getOffice(window.cur_location, 'longitude')
                ;

            $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+officeLatitude+','+officeLongitude+'&sensor=true', function(data){
                var city = data.results[0].address_components[2].short_name.toLowerCase();
                window.cur_location = directory.getCityName(city);
                $('h1 span.office-location').html(window.cur_location.toUpperCase());
            });

            // Create Google Map
            var map = new GMaps({
                div: '#map',
                lat: officeLatitude,
                lng: officeLongitude
            });

            // Create GeoFence
            // path variable is saved in offices.js file
            var polygon = map.drawPolygon({
                paths: path[window.cur_location], // pre-defined polygon shape
                strokeColor: '#BBD8E9',
                strokeOpacity: 0,
                strokeWeight: 0,
                fillColor: '#BBD8E9',
                fillOpacity: 0
            });

            // Add Office marker to map
            map.addMarker({
                lat: officeLatitude,
                lng: officeLongitude,
                infoWindow: {
                    content: '<p class="map-content">SapientNitro '+window.cur_location.toString().toUpperCase()+'</p>'
                }
            });

            // Detect if user is in Geofence
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

        // Query Parse and update users location in / out of Geofence
        updateUserLocation: function(email, inFence){

            var UserStatus = Parse.Object.extend('directory')
                , query = new Parse.Query(UserStatus)
                , location = window.cur_location
                ;

            query.equalTo('email', email);

            if(inFence !== true){
                location = '';
            }

            query.first({
                success: function (Contact) {
                    Contact.save(null, {
                        success: function (contact) {

                            contact.set('currentlyAt', location);
                            contact.save();


                            var UserData = Parse.Object.extend('directory')
                                , query = new Parse.Query(UserData)
                                ;

                            query.equalTo('email', email);

                            query.first({
                                success: function (results) {
                                    var userData = results
                                        , fName = userData.attributes.fName
                                        , lName = userData.attributes.lName
                                        , office = userData.attributes.office
                                        , email = userData.attributes.email
                                        ;

                                    window.visitorEmail = email;


                                    if(office !== window.cur_location){
                                        pubnub.publish({
                                            channel: 'my_channel',
                                            //message: fName + ' ' + lName + ' from the ' + office + ' office is in the buiding'
                                            message: {
                                                "message" : "Arrived: " + fName + " " + lName + " from SapientNitro " + office +"",
                                                "email" : email
                                            }
                                        });
                                    }

                                }
                            });

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

        // HTML5 Geolocation ... get users lat / long
        geoLocate: function(){

            var that = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(that.showPosition);
            }
        },

        getUser: function(email){

        },

        // Grab data from parse (directory table) and render to directory / checkin div sections
        queryData: function(){

            $('.directory ul, .checkin ul').empty();

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
                            , currentlyAt = object.get('currentlyAt')
                            , inOffice = ''
                            , active = 'inactive'
                            ;

                        if(phone !== 'n/a'){
                            phone = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6,4);
                        }

                        if(window.cur_location !== office){
                            inOffice = '<br>' + office;
                        }

                        if(currentlyAt === window.cur_location){
                            active = 'active';
                        }

                        var html = '';
                        html += '<li data-email="'+email+'" data-user="'+lName+'-'+fName+'" class="'+active+'">';
                        html += '  <span class="user"><img src="assets/images/transparent.png" data-src="assets/images/office/'+office+'/'+lName+'-'+fName+'.jpg"></span>';
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

                        if(window.cur_location === office){

                            if(currentlyAt === window.cur_location){
                                $('.directory ul.currently_here').append(html);
                            } else {
                                $('.directory ul.user_list').append(html);
                            }

                        } else {
                            if(currentlyAt === window.cur_location){
                                $('.checkin h3').hide();
                                $('.checkin ul').append(html);

                            }
                        }

                    }



                },
                error: function(error) {

                    console.log('Error: ' + error.code + ' ' + error.message);
                }

            }).then(function(){

                // Lazy loading images
                $('.directory, .checkin').find('img').unveil();

                var didScroll = false;

                $('.section').scroll(function() {
                    didScroll = true;
                });

                setInterval(function() {
                    if ( didScroll ) {
                        didScroll = false;
                        $('.directory, .checkin').find('img').unveil();
                    }
                }, 250);

                that.events();
            });
        },

        events: function(){

            pubnub.subscribe({
                channel: 'my_channel',
                message: function(m){
                    var message = m.message
                        , email = m.email
                        ;

                    if(window.visitorEmail !== email){

                        $('.notifications').html('');
                        $('.notifications').html(message);
                        $('.notifications').removeClass('slideDownNotify').addClass('slideDownNotify');
                    }
                }
            });
            //console.log(currentUser._serverData.emailVerified)

            // Onload show login or logout
            if (currentUser) {
                $('.logout').show();
                $('.user-login h2, .user-login-screen, .user-signup-screen').hide();
            } else {
                $('.user-login h2, .user-login-screen').show();
            }

            // User login / sign up buttons
            $(document).on('click', '.user-login h2 a', function(e){
                var type = $(this).data('login');

                $('.screen').hide();
                $('.user-'+type+'-screen').show();
            });

            // Logout functionality
            $(document).on('click', '.logout-btn, .logout-icon', function(e){
                e.preventDefault();
                Parse.User.logOut();
                $('.user-login h2, .user-login-screen').show();
                location.reload();
            });

            // Parse signup functionality
            $(document).on('click', '.signup-btn', function(e){
                e.preventDefault();

                var user = new Parse.User()
                    , username = $('input.signup-username').val()
                    , password = $('input.signup-password').val()
                    , email = $('input.signup-email').val()
                    ;

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
                } else {
                    alert('You must have a valid Sapient email address to register');
                }
            });

            // Parse login functionality
            $(document).on('click', '.login-btn', function(e){
                e.preventDefault();

                var username = $('input.login-username').val()
                    , password = $('input.login-password').val()
                    ;

                Parse.User.logIn(username, password, {
                    success: function(user) {
                        $('.logout').show();
                        $('.user-login h2, .user-login-screen, .user-signup-screen').hide();
                        location.reload();
                    },
                    error: function(user, error) {
                        alert('Error: ' + error.code + ' ' + error.message);
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
                if(currentUser){
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
                }
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
