"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var parseArgs = require("minimist");
var exec = require('child_process').exec;
console.log("[info]", process.cwd(), "`process.cwd()`");
var args = parseArgs(process.argv.slice(2), {
    alias: {
        'dir': 'd'
    }
});
console.log(__dirname, "`__dirname`", process.cwd(), "`process.cwd()`", args.dir, "`args.dir`");
var rootPath = path.resolve(process.cwd(), args.dir || "");
console.log(rootPath, "{rootPath}");
if (rootPath) {
    doEgretClean();
    var timeoutId;
    fs.watch(rootPath, function (event, filename) {
        console.log("[debug]", event, filename);
        // if(event=="rename"){//子文件夹内变化 会返回 change 和子文件夹名,所以用rename不准确
        if (timeoutId != undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function () {
            doEgretClean();
        }, 2000);
        // }
        // doEgretClean();
    });
}
function doEgretClean() {
    console.log("[info]", "egret clean start");
    exec('egret clean', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log("[info]", "egret clean complete");
    });
}
//# sourceMappingURL=EgretClean.js.map