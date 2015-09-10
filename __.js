var EAW = require('eastasianwidth');
var __ = function (str) {
  return __[__.lang] && __[__.lang][str] || str;
};

__.setLang = function (lang) {
  this.lang = lang;
};

__.getLang = function () {
  return this.lang;
};

__.loadLang = function (lang_name, lang_map, is_east_asia) {
  var obj = {};
  for (var key in lang_map) {
    obj[key] = lang_map[key].split("").map(function (str) {
      var eaw = EAW.eastAsianWidth(str);
      if (eaw === "W" || eaw === "F" || (is_east_asia && eaw === "A")) {
        str = "\0" + str; // add null-str for full-width
      }
      return str;
    }).join("");
  }
  __[lang_name] = obj;
};

__.loadLang("ja", require('./__ja.po2json.json'), true);

//__.loadLang("ab", require('./__ab.po2json.json'));

module.exports = __;
