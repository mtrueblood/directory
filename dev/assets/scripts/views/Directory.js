/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'parse',
    'templates',
    'models/directory',
    'collections/DirectoryList'
], function($, _, Backbone, Parse, JST, Todo, DirectoryModel, DirectoryCollection) {
    'use strict';

    var DirectoryView = Parse.View.extend({
        template: JST['site/assets/scripts/templates/Directory.html'],

        // Delegated events for creating new items, and clearing completed ones.

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
        },



        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved to Parse.
        initialize: function() {
            var self = this;


            var UserData = Parse.Object.extend("directory");
            this.directoryListViews = new Parse.Query(UserData);

            this.directoryListViews.find({
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
                    }


                    $('.directory ul').append(html);
                    self.events();

                }


            });




        }

    });

    return DirectoryView;
});
