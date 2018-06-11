"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* 合并多个文件到一个json中 */
var fs = require("fs");
var path = require("path");
var parseArgs = require("minimist");
var FileUtil_1 = require("./lib1/FileUtil");
var CombineFile = /** @class */ (function () {
    function CombineFile() {
    }
    CombineFile.prototype.init = function () {
        var _this = this;
        var argsOpts = {};
        argsOpts['input'] = 'i';
        argsOpts['output'] = 'o';
        argsOpts['ext_need'] = 'n'; //需要的后缀名
        argsOpts['ext_ignore'] = 'g'; //忽略的后缀名
        var args = parseArgs(process.argv.slice(2), { alias: argsOpts, boolean: 'watch' });
        console.log("[info]", "args.input(-i):", args.input);
        console.log("[info]", "args.output(-o):", args.output);
        console.log("[info]", "args.ext_need(-n)", args.ext_need);
        console.log("[info]", "args.ext_ignore(-g)", args.ext_ignore);
        console.log("[info]", "args.watch(-w)", args.watch);
        //
        this.input = args.input;
        this.output = args.output;
        this.extNeed = args.ext_need ? args.ext_need.split(" ") : [];
        this.extIgnore = args.ext_ignore ? args.ext_ignore.split(" ") : [];
        this.exec();
        fs.watch(this.input, { persistent: true, recursive: true }, function () {
            clearTimeout(_this.execTimeoutId);
            _this.execTimeoutId = setTimeout(function () {
                _this.exec();
            }, 1000);
        });
    };
    CombineFile.prototype.exec = function () {
        console.log("[info]", "File change detected. Starting incremental compilation...", this.input);
        var files = FileUtil_1.FileUtil.getFileAll(this.input, this.extNeed, this.extIgnore);
        var rs = {};
        //
        var len = files.length;
        for (var i = 0; i < len; i++) {
            var file = files[i];
            var fullUrl = path.resolve(file.parent, file.name);
            var relativeUrl = path.relative(this.input, fullUrl);
            var content = fs.readFileSync(fullUrl);
            relativeUrl = relativeUrl.replace(/\\/g, '/');
            rs[relativeUrl] = content.toString();
            // console.log("[info]", relativeUrl, ":[relativeUrl]")
        }
        fs.writeFileSync(this.output, JSON.stringify(rs));
        console.log("[info]", "Watching for file changes.");
    };
    return CombineFile;
}());
//
var combineFile = new CombineFile();
combineFile.init();
//# sourceMappingURL=CombineFile.js.map