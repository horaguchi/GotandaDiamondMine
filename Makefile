browser-run:
	npm start

push:
	git commit -a -m 'Commit for build'
	git push origin master

android: gotandadiamondmine-html5.browserify.js
	cordova build android

android-run: gotandadiamondmine-html5.browserify.js
	cordova run android

xgettext:
	xgettext --extract-all --join-existing --sort-by-file --language=C --default-domain=__ja gotandadiamondmine.js
