"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var mineType = require("mime-types");
var parseArgs = require("minimist");
var process = require("process");
var argv = parseArgs(process.argv.slice(2), {
    /*  string: ['port', 'hostname', 'fallback'],
     boolean: ['silent', 'log'],
     'default': {
         'port': 8000,
         'dir': process.cwd()
    }, */
    alias: {
        'help': 'h',
        'input': 'i',
        'output': 'o',
        'dir': 'd'
    }
});
if (argv.help || (!argv.input || !argv.output)) {
    console.log("Help in here!\r\n", "e.g.  bin/ImageToBase64.js -d test --input fox_2.png -o out.txt");
}
else {
    var dir = argv.dir;
    if (!dir) {
        dir = "";
    }
    var inPath = path.resolve(dir, argv.input);
    var outPath = path.resolve(dir, argv.output);
    console.log("[info]", dir, "input filePath:", inPath);
    console.log("[info]", dir, "output filePath:", outPath);
    var data = fs.readFileSync(inPath);
    var dataStr = new Buffer(data).toString('base64');
    var base64 = 'data:' + mineType.lookup(inPath) + ';base64,' + dataStr;
    fs.writeFileSync(outPath, base64);
    console.log("[info]", "Complete!");
}
process.exit(1);
//# sourceMappingURL=ImageToBase64.js.map