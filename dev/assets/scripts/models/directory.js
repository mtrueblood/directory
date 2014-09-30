/*global define*/

define([
    'underscore',
    'backbone',
    'parse'
], function(_, Backbone, Parse) {
    'use strict';

    var DirectoryModel = Parse.Object.extend('directory', {

        // Ensure that each todo created has `content`.
        initialize: function() {
          var query = new Parse.Query(DirectoryModel);

            query.find({
              success: function(results) {
                return results;
              }
            });
        }

    });

    return DirectoryModel;
});
