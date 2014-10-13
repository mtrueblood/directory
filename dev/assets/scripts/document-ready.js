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

            var polygon = map.drawPolygon({
                paths: path, // pre-defined polygon shape
                strokeColor: '#BBD8E9',
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '#BBD8E9',
                fillOpacity: 0.6
            });

            if( !map.checkGeofence(userLatitude, userLongitude, polygon) ) {
                alert('user not in geofence');
            } else {
                alert('user in geofence');
            }


        },

        inFence: function(m, f){
            //console.log(m.inside());
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
                        html += '<li data-user="'+lName+'-'+fName+'" class="active">';
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
