/* jshint -W030 */
!function() {
    'use strict';

    // Initialize Parse Application
    Parse.initialize('uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O', 'N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu');

    var w = window
        , d = document
        , e = d.documentElement
        , g = d.getElementsByTagName('body')[0]
        , winWidth = w.innerWidth || e.clientWidth || g.clientWidth
        , winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight
        , landingContainer = '.landing'
        , cur_location = 'detroit'
        , currentUser = Parse.User.current()
        ;

    var directory = {

        appInit: function(){

            $('.directory ul, .checkin ul').empty();

            if(currentUser){
                this.queryData();
                this.geoLocate();
            }

            this.events();

            $('h1 span.office-location').html(cur_location.toUpperCase());

        },

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



            var polygon = map.drawPolygon({
                paths: path[cur_location], // pre-defined polygon shape
                strokeColor: '#BBD8E9',
                strokeOpacity: 0,
                strokeWeight: 0,
                fillColor: '#BBD8E9',
                fillOpacity: 0
            });

            map.addMarker({
                lat: officeLatitude,
                lng: officeLongitude,
                infoWindow: {
                    content: '<p class="map-content">SapientNitro '+cur_location.toString().toUpperCase()+'</p>'
                }
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

            var UserStatus = Parse.Object.extend('directory')
                , query = new Parse.Query(UserStatus)
                , location = cur_location
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

                        if(cur_location !== office){
                            inOffice = '<br>' + office;
                        }

                        if(currentlyAt === cur_location){
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

                        if(cur_location === office){

                            if(currentlyAt === cur_location){
                                $('.directory ul.currently_here').append(html);
                            } else {
                                $('.directory ul.user_list').append(html);
                            }

                        } else {
                            if(currentlyAt === cur_location){
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

            //console.log(currentUser._serverData.emailVerified)

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

            $(document).on('click', '.logout-btn, .logout-icon', function(e){
                e.preventDefault();
                Parse.User.logOut();
                $('.user-login h2, .user-login-screen').show();
                location.reload();
            });

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
