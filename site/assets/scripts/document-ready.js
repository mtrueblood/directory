"use strict";

var directory = (function () {

    var w = window
        , d = document
        , e = d.documentElement
        , g = d.getElementsByTagName('body')[0]
        , winWidth = w.innerWidth || e.clientWidth || g.clientWidth
        , winHeight = w.innerHeight|| e.clientHeight|| g.clientHeight
        , landingContainer = '.landing'
        , cur_location = 'detroit'
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
            query.ascending("lName");
            query.find({
                success: function(results) {

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
                        var homeOffice = '';

                        if(phone != 'n/a'){
                            phone = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6,4);
                        }

                        if(cur_location != office){
                            homeOffice = 'not-home';
                        }

                        html += '<li class="active '+homeOffice+'">';

                        html += '  <span class="user"><img src="assets/images/office/detroit/'+lName+'-'+fName+'.jpg"></span>';

                        html += '  <div class="user-container">';
                        html += '      <div class="user-flex">';
                        html += '          <div class="user-info user-default">';

                        html += '              <span class="name">'+fName+' '+lName+'</span>';
                        html += '              <span class="title">'+title+'</span>';
                        html += '              <span class="bell"><i class="icon-bell"></i></span>';
                        html += '          </div>';
                        html += '          <div class="user-info user-details" style="background: url(assets/images/office/detroit/'+lName+'-'+fName+'.jpg) 0 0 no-repeat;">';
                        html += '              <span class="name">'+fName+' '+lName+'</span>';
                        html += '              <span class="title">'+title+'</span>';
                        html += '              <span class="email"><i class="icon-mail4"></i><a href="mailto:'+email+'" target="_blank">'+email+'</a></span>';
                        html += '              <span class="phone"><i class="icon-phone"></i><a href="tel:'+phone+'"  target="_blank">'+phone+'</a></span>';
                        html += '              <span class="office">'+office+'</span>';
                        html += '              <span class="close"><i class="icon-close"></i></span>';
                        html += '          </div>';
                        html += '      </div>';
                        html += '  </div>';
                        html += '</li>';

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

            $(document).on('keyup keypress focus focusin focusout', '.search input', function () {
                var filter = $(this).val().toLowerCase(); // get the value of the input, which we filter on
                $('.directory li').find("span.name:not(:contains(" + filter + "))").closest('li').slideUp();
                $('.directory li').find("span.name:contains(" + filter + ")").closest('li').slideDown();
            });

            // Nav Menu Event Handler
            [].forEach.call(document.querySelectorAll('nav a'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    var that = this;
                    var dataAtt = that.getAttribute('data-section');
                    var section = '.' + dataAtt;
                    var allSections = '.section';

                    if(dataAtt == 'directory'){
                            $('h1').css('height', '139px');
                            $('.section').css('top', '139px');
                            $('.search').show();
                            $('.welcome').hide();
                        } else {
                           $('h1').css('height', '90px');
                           $('.section').css('top', '90px');
                        }

                    $('.section').animate({left: '-'+winWidth+'px'}, 200).promise().done(function(){
                        $(section).animate({left: '0px'}, 200);
                    });




                });
            });

            // Bell Event Handler
            [].forEach.call(document.querySelectorAll('.bell'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();

                    var that = this;

                    $(this, '.bell').parent().next().fadeIn(200);
                    $('.section').css({'zIndex' : '104', 'position' : 'fixed', 'top' : '0', 'height': '422px'});
                    $('.search, h1, nav').hide();

                });
            });

            // Bell Event Handler
            [].forEach.call(document.querySelectorAll('.close'), function(el) {
                el.addEventListener('click', function(e) {
                    e.preventDefault();

                    var that = this;

                    $(that).parent().fadeOut(200);
                    $('.section').css({'zIndex' : '101', 'position' : 'absolute', 'top' : '139px', 'height': '56%'});
                    $('.search, h1, nav').show();
                });
            });

        }

    }

})();

directory.appInit();




