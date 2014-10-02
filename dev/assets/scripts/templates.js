define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["site/assets/scripts/templates/Directory.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="active">\n\n  <span class="user"><img src="http://placehold.it/77x77"></span>\n\n  <div class="user-container">\n      <div class="user-flex">\n          <div class="user-info user-default">\n\n              <span class="name">' +
((__t = ( fName )) == null ? '' : __t) +
' ' +
((__t = ( lName )) == null ? '' : __t) +
'</span>\n              <span class="title">' +
((__t = ( title )) == null ? '' : __t) +
'</span>\n              <span class="bell"><i class="icon-bell"></i></span>\n          </div>\n          <div class="user-info user-details">\n              <span class="email">' +
((__t = ( email )) == null ? '' : __t) +
'</span>\n              <span class="phone">' +
((__t = ( phone )) == null ? '' : __t) +
'</span>\n              <span class="close"><i class="icon-close"></i></span>\n          </div>\n      </div>\n  </div>\n</li>\n';

}
return __p
};

  return this["JST"];

});