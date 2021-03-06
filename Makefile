browser-run: xgettext
	npm start

push:
	git commit -a -m 'Commit for build'
	git push origin master

android: gotandadiamondmine-html5.browserify.js
	cordova build android

android-run: gotandadiamondmine-html5.browserify.js
	cordova run android

xgettext:
	perl -i'*' -lne 'print if not s{^#.*}{}' __ja.po
	xgettext --extract-all --join-existing --sort-by-file --language=C --default-domain=__ja gotandadiamondmine.js
