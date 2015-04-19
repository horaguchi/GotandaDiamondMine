#!/usr/bin/env node

var fs = require('fs');
var browserify = require('browserify');

var b = browserify({
  standalone: "GotandaDiamondMine"
});
b.add("./gotandadiamondmine.js");
b.bundle(function (err, src) {
  fs.writeFileSync("./gotandadiamondmine.browserify.js", src);
  console.info("gotandadiamondmine.browserify.js is updated");
});
