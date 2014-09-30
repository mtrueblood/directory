// Filename: app.js
define([
  'jquery',
  'underscore',
  'parsejs'
], function($, _, Parse){
  var initialize = function(){
    Parse.initialize("uNtjzJdbGtEmC5n6ZoB3MkYbdlB23i5qeXejOT0O", "N1wO2Ceogq6ZPld1F6J6N4I6q6P4K8UXgWmI1yyu");
  }

  return {
    initialize: initialize
  };
});
