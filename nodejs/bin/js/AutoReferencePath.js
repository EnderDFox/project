"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var parseArgs = require("minimist");
var process = require("process");
var AutoReferencePathItem = /** @class */ (function () {
    function AutoReferencePathItem() {
        /** 是否已经被使用 */
        this.used = false;
    }
    return AutoReferencePathItem;
}());
var AutoReferencePath = /** @class */ (function () {
    function AutoReferencePath() {
    }
    //-
    AutoReferencePath.prototype.exec = function () {
        if (this.parseCmdArg() == false)
            return;
        //
        var stat = fs.lstatSync(this.path_dir);
        if (stat.isDirectory() == false) {
            console.log("[error]", "dir必须是文件夹");
        }
        else {
            //step 1 count fileFullPaths
            this.topFileFullPaths = [];
            this.fileFullPaths = [];
            this.parseDir(this.path_dir);
            //step 2 parse file to type names
            this.typeDict = {};
            for (var i = 0; i < this.fileFullPaths.length; i++) {
                var file = this.fileFullPaths[i];
                this.parseFile(file);
            }
            //step 3 count typeQueue
            this.typeQueue = [];
            this.combineItemsToQueue();
            //step 4 combine typeQueue to ReferencePaths.ts
            this.combineReferencePaths();
        }
    };
    AutoReferencePath.prototype.parseCmdArg = function () {
        var argv = parseArgs(process.argv.slice(2), {
            alias: {
                'help': 'h',
                'dir': 'd',
                'excludes': 'e',
                'output': 'o'
            }
        });
        if (argv.help || (!argv.dir)) {
            console.log("Help in here!\r\n", "e.g.  bin/AutoReferencePath.js -d test/ts");
            return false;
        }
        else {
            var output = argv.output;
            if (!output) {
                output = "Auto_ReferencePaths.ts";
            }
            var dir = argv.dir;
            if (!dir) {
                dir = "";
            }
            this.path_dir = dir;
            if (path.isAbsolute(output)) {
                this.path_out = path.resolve(output);
            }
            else {
                this.path_out = path.resolve(dir, output);
            }
            //
            console.log("path_dir:", this.path_dir);
            console.log("path_out:", this.path_out);
            if (argv.excludes) {
                var excludes = argv.excludes.split(" ");
                for (var i = 0; i < excludes.length; i++) {
                    var exclude = excludes[i];
                    if (exclude) {
                        if (path.isAbsolute(exclude)) {
                            excludes[i] = path.resolve(exclude);
                        }
                        else {
                            excludes[i] = path.resolve(dir, exclude);
                        }
                    }
                }
                this.excludes = excludes;
            }
            console.log("excludes", this.excludes);
            return true;
        }
    };
    /**
     * 分析文件夹,提取里面的所有文件
     * @param dir
     */
    AutoReferencePath.prototype.parseDir = function (dir) {
        var files = fs.readdirSync(dir);
        // console.log("[debug]","files",files.length);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fullPath = path.resolve(dir, file);
            if (this.excludes == null || (this.excludes.indexOf(fullPath) == -1 && fullPath != this.path_out)) {
                var stat = fs.lstatSync(fullPath);
                if (stat.isDirectory()) {
                    this.parseDir(fullPath);
                }
                else {
                    if (file.indexOf(".") == 0) {
                        console.info("[info]", "过滤掉以 . 开头的File");
                    }
                    else if (path.parse(fullPath).ext == ".ts") {
                        console.log("[info]", file, "is ts file");
                        this.fileFullPaths.push(fullPath);
                    }
                    else {
                        console.info("[info]", "过滤掉其它不需要的File");
                    }
                }
            }
            else {
                // console.log("[debug]", "Path is exclude", fullPath);
            }
        }
    };
    AutoReferencePath.prototype.parseFile = function (fullPath) {
        var str = fs.readFileSync(fullPath).toString();
        var strLines = str.split("\n");
        var rs = this.parseStrType(fullPath, strLines);
        if (rs == false) {
            this.topFileFullPaths.push(fullPath);
        }
    };
    /**分析文件的class类型 */
    AutoReferencePath.prototype.parseStrType = function (fullPath, strLines) {
        var namespaceName = "";
        for (var i = 0; i < strLines.length; i++) {
            var strLine = strLines[i];
            if (strLine.indexOf("//") == 0 || strLine.indexOf("/*") == 0) {
                continue;
            }
            if (strLine.indexOf(AutoReferencePath.word_namespace) > -1) {
                namespaceName = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_namespace);
            }
            else if (strLine.indexOf(AutoReferencePath.word_module) > -1) {
                namespaceName = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_module);
            }
            var typeWord = null;
            if (strLine.indexOf(AutoReferencePath.word_class) > -1) {
                typeWord = AutoReferencePath.word_class;
            }
            else if (strLine.indexOf(AutoReferencePath.word_enum) > -1) {
                typeWord = AutoReferencePath.word_enum;
            }
            else if (strLine.indexOf(AutoReferencePath.word_interface) > -1) {
                typeWord = AutoReferencePath.word_interface;
            }
            if (typeWord != null) {
                this.parseType(fullPath, strLine, typeWord, namespaceName);
                return true;
            }
        }
        return false;
    };
    AutoReferencePath.prototype.parseType = function (fullPath, strLine, typeWord, namespaceName) {
        var item = new AutoReferencePathItem();
        var typeName = this.getTypeNameInStrLine(strLine, typeWord);
        var typeItem = this.getItem(namespaceName ? (namespaceName + "." + typeName) : typeName);
        typeItem.fullPath = fullPath;
        // console.log("[info]",typeItem.fullPath,typeItem.typeName);
        //extends
        var superTypeName = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_extends);
        if (superTypeName != null) {
            var superTypeItem = this.getItem(superTypeName);
            superTypeItem.children.push(typeItem);
            typeItem.superItem = superTypeItem;
        }
    };
    AutoReferencePath.prototype.getTypeNameInStrLine = function (strLine, typeWord) {
        var typeArr = strLine.split(/\s/g);
        var typeIndex = typeArr.indexOf(typeWord);
        if (typeIndex == -1) {
            return null;
        }
        else {
            var typeName = typeArr[typeIndex + 1];
            typeName = typeName.replace("{", "");
            typeName = typeName.trim();
            return typeName;
        }
    };
    AutoReferencePath.prototype.getItem = function (typeName) {
        var typeItem;
        if (this.typeDict[typeName] == undefined) {
            typeItem = new AutoReferencePathItem();
            typeItem.typeName = typeName;
            typeItem.children = [];
            this.typeDict[typeName] = typeItem;
        }
        else {
            typeItem = this.typeDict[typeName];
        }
        return typeItem;
    };
    AutoReferencePath.prototype.combineItemsToQueue = function () {
        for (var key in this.typeDict) {
            var item = this.typeDict[key];
            console.log("[debug]", "path", item.typeName, item.fullPath);
            if (item.used) {
                continue;
            }
            //找到top级别的,从然后从top开始向下加入
            while (item.superItem != null) {
                item = item.superItem;
            }
            this.combineItemToQueue(item);
        }
    };
    AutoReferencePath.prototype.combineItemToQueue = function (item) {
        item.used = true;
        if (item.fullPath != null) {
            this.typeQueue.push(item);
        }
        for (var i = 0; i < item.children.length; i++) {
            var child = item.children[i];
            this.combineItemToQueue(child);
        }
    };
    AutoReferencePath.prototype.combineReferencePaths = function () {
        var outArr = [];
        for (var i = 0; i < this.topFileFullPaths.length; i++) {
            var fullPath = this.topFileFullPaths[i];
            outArr.push(this.combineReferencePath(fullPath));
        }
        for (var i = 0; i < this.typeQueue.length; i++) {
            var item = this.typeQueue[i];
            // console.log("[info]", "itemQueue", i, item.typeName, item.superItem != null, item.fullPath);
            outArr.push(this.combineReferencePath(item.fullPath));
        }
        fs.writeFileSync(this.path_out, outArr.join("\r\n"));
    };
    AutoReferencePath.prototype.combineReferencePath = function (fullPath) {
        // console.log("[debug]","dir",path.parse(this.path_out).dir);
        // console.log("[debug]","fullpath",fullPath);
        // console.log("[debug]","rs",path.relative(path.parse(this.path_out).dir,fullPath));
        return "/// <reference path=\"" + path.relative(path.parse(this.path_out).dir, fullPath) + "\" />";
    };
    AutoReferencePath.word_namespace = "namespace";
    AutoReferencePath.word_module = "module";
    AutoReferencePath.word_class = "class";
    AutoReferencePath.word_enum = "enum";
    AutoReferencePath.word_interface = "interface";
    AutoReferencePath.word_extends = "extends";
    return AutoReferencePath;
}());
//---
var inst = new AutoReferencePath();
inst.exec();
console.log("Complete! Write to", inst.path_out);
process.exit(1);
//# sourceMappingURL=AutoReferencePath.js.map