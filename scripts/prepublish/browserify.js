#!/usr/bin/env node

var fs = require('fs');
var browserify = require('browserify');

var b = browserify({
  standalone: "GotandaDiamondMine"
});
b.add("./gotandadiamondmine-html5.js");
b.bundle(function (err, src) {
  fs.writeFileSync("./gotandadiamondmine-html5.browserify.js", src);
  console.info("gotandadiamondmine-html5.browserify.js is updated");
});
