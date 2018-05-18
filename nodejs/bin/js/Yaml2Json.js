"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var yaml = require("js-yaml");
var path = require("path");
var parseArgs = require("minimist");
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
    doYaml2JsonDir();
    fs.watch(rootPath, function (event, filename) {
        console.log("[debug]", event, filename);
        doYaml2Json(filename);
    });
}
function doYaml2JsonDir() {
    var files = fs.readdirSync(rootPath);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        doYaml2Json(file);
    }
    console.log("YamlToJson dir Complete!", rootPath);
}
function doYaml2Json(file) {
    file = path.join(rootPath, file);
    if (fs.existsSync(file) == false) {
        return;
    }
    if (path.extname(file) == ".yaml" || path.extname(file) == ".yml") {
        console.log("doYamlToJson", file);
        var yamlStr = fs.readFileSync(file).toString();
        // yamlStr = yamlStr.replace(/\t/g,"  ");
        // fs.writeFileSync(file,yamlStr);
        var obj = void 0;
        try { //异常捕获
            obj = yaml.load(yamlStr);
        }
        catch (err) {
            console.log("[error]", err);
        }
        finally {
            if (obj) {
                // console.log(obj);
                var jsonStr = JSON.stringify(obj);
                var fileNew = file.substring(0, file.lastIndexOf(".")) + ".json";
                fs.writeFileSync(fileNew, jsonStr);
                console.log("YamlToJson Success!", fileNew);
            }
            else {
                console.log("YamlToJson Failed!", file);
            }
        }
    }
}
//==test
// let str = fs.readFileSync(__dirname + "/../test/yaml.yaml");
// let obj = yaml.load(str);
// console.log(obj);
//==
//# sourceMappingURL=Yaml2Json.js.map