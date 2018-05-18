import * as fs from "fs";
import * as path from "path";
import * as mineType from "mime-types";
import * as parseArgs from "minimist";
import * as process from 'process';

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
} else {
    var dir = argv.dir;
    if (!dir) {
        dir = "";
    }
    let inPath = path.resolve(dir, argv.input);
    let outPath = path.resolve(dir, argv.output);
    console.log("[info]", dir, "input filePath:", inPath);
    console.log("[info]", dir, "output filePath:", outPath);
    let data = fs.readFileSync(inPath);
    let dataStr:string = new Buffer(data).toString('base64');
    let base64 = 'data:' + mineType.lookup(inPath) + ';base64,' + dataStr;
    fs.writeFileSync(outPath, base64);
    console.log("[info]", "Complete!");
}
process.exit(1);
