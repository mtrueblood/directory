define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["site/assets/scripts/templates/Directory.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="active">\n' +
((__t = ( remaining )) == null ? '' : __t) +
'\n  <span class="user"><img src="http://placehold.it/77x77"></span>\n\n  <div class="user-container">\n      <div class="user-flex">\n          <div class="user-info user-default">\n\n              <span class="name">\'+fName+\' \'+lName+\'</span>\n              <span class="title">\'+title+\'</span>\n              <span class="bell"><i class="icon-bell"></i></span>\n          </div>\n          <div class="user-info user-details">\n              <span class="email">\'+email+\'</span>\n              <span class="phone">\'+phone+\'</span>\n              <span class="close"><i class="icon-close"></i></span>\n          </div>\n      </div>\n  </div>\n</li>\n';

}
return __p
};

  return this["JST"];

});