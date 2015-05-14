browser-run: gotandadiamondmine.browserify.js
	cordova run browser

android: gotandadiamondmine.browserify.js
	cordova build android

android-run: gotandadiamondmine.browserify.js
	cordova build android

gotandadiamondmine.browserify.js: gotandadiamondmine.js
	npm install -d
	cp gotandadiamondmine.browserify.js www/js/gotandadiamondmine.browserify.js
	cp gotandadiamondmine-html5.js      www/js/gotandadiamondmine-html5.js
