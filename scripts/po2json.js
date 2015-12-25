var gettextParser = require("gettext-parser");
var fs = require('fs');
var po = fs.readFileSync('__ja.po');
var parsed = gettextParser.po.parse(po).translations[''];
var result = {};
for (var key in parsed) {
  result[parsed[key]['msgid']] = parsed[key]['msgstr'][0];
}
fs.writeFileSync('__ja.po.json', JSON.stringify(result), 'utf8');
console.log("[DONE] __ja.po -> __ja.po.json");
