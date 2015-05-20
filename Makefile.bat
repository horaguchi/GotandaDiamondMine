call xgettext --extract-all --join-existing --sort-output --language=C --default-domain=__ja gotandadiamondmine.js
call npm install -d
copy gotandadiamondmine-html5.browserify.js www\js\gotandadiamondmine-html5.browserify.js
cordova run browser
pause
