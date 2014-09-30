/*global define*/

define([
    'underscore',
    'backbone',
    'parse',
    'models/directory'
], function(_, Backbone, Parse, DirectoryModel) {
    'use strict';

    var DirectoryCollection = Parse.Collection.extend({
        // Reference to this collection's model.
        model: DirectoryModel,

        userName: function () {
            return this.get('fName');
        }
    });

    return DirectoryCollection;
});
