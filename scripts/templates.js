this["JST"] = this["JST"] || {};

this["JST"]["site/assets/scripts/templates/Directory.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n\n<div class="section">\n\n  <header id="header">\n    <input id="new-todo" placeholder="What needs to be done?" type="text" />\n  </header>\n\n  <div id="main">\n    <input id="toggle-all" type="checkbox">\n    <label for="toggle-all">Mark all as complete</label>\n\n    <ul id="todo-list">\n      <img src=\'images/spinner.gif\' class=\'spinner\' />\n    </ul>\n  </div>\n\n  <div id="todo-stats"></div>\n</div>\n\n\n\n';

}
return __p
};