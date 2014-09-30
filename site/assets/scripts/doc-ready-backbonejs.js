/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        parse: {
            deps: ['jquery', 'underscore'],
            exports: 'Parse'
        }
    },
    paths: {
        jquery: 'vendors/jquery-1.10.2.min',
        backbone: 'vendors/backbone',
        underscore: 'vendors/underscore',
        parse: 'http://www.parsecdn.com/js/parse-1.2.16.min'
    }
});

require(['parse'], function(Parse) {
    Parse.initialize('uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O', 'N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu');
});

require([
    'backbone',
    'views/App'
], function(Backbone, AppView) {
    Backbone.history.start();
    new AppView();
});
