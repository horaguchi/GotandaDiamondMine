browser-run: gotandadiamondmine-html5.browserify.js
	cordova run browser

push:
	git commit -a -m 'Commit for build'
	git push origin master

android: gotandadiamondmine-html5.browserify.js
	cordova build android

android-run: gotandadiamondmine-html5.browserify.js
	cordova run android

gotandadiamondmine-html5.browserify.js: gotandadiamondmine.js gotandadiamondmine-html5.js
	npm install -d
	cp gotandadiamondmine-html5.browserify.js www/js/gotandadiamondmine-html5.browserify.js
