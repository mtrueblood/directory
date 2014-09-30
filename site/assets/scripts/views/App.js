/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'parse',
    'views/Directory'
], function ($, _, Backbone, Parse, DirectoryView) {
    'use strict';

    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: '.directory ul',

        initialize: function() {
            this.render();
        },

        render: function() {
           new DirectoryView();
        }
    });

    return AppView;
});
