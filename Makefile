all:
	npm install -d
	cp gotandadiamondmine.browserify.js www/js/gotandadiamondmine.browserify.js
	cp gotandadiamondmine-html5.js      www/js/gotandadiamondmine-html5.js
	cordova run browser
