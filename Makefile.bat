call perl -i'*' -ne 'print if not s{^#.*$}{}' __ja.po
call xgettext --extract-all --join-existing --sort-output --language=C --default-domain=__ja gotandadiamondmine.js
chcp 65001
npm start
pause
