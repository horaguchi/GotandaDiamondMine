var __ = function (str) {
  return __[__.lang] && __[__.lang][str] || str;
};

__.setLang = function (lang) {
  this.lang = lang;
};

__.getLang = function () {
  return this.lang;
};

__.ja = require('./__ja.po2json.json');
//__.ab = require('__ab');
//__.cd = require('__cd');

module.exports = __;
