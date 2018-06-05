"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var child_process = require("child_process");
var path = require("path");
var parseArgs = require("minimist");
var process = require("process");
/**
 * 调用protobufjs生成 UMD下可以使用的 js和 d.ts
 * # 准备工作:
 * - 安装protobufjs:  cnpm i protobufjs -g
 * - 引入 protogbuf.js 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/dist/minimal/protobuf.js)
 * - 工程加入 protobuf.d.ts 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/index.d.ts)
 * - 引入 本工具生成的 pb.js和pb.d.ts
 * # e.g.
 * ```TypeScript
    var login = new hellopbjs.Login()
    login.account = "my acc"
    login.password = "my pwd"
    var bufferWriter = hellopbjs.Login.encode(login)
    var loginB = hellopbjs.Login.decode(bufferWriter.finish())
    console.log("[debug]",loginB,":[loginB]")
 * ```
 */
var ProtobufJsHelper = /** @class */ (function () {
    function ProtobufJsHelper() {
        this.line_separator = "\r\n";
        this.var$protobuf = "var $protobuf = protobuf;";
        this.pb$root = "pb = $root.pb";
        this.export_namespace_pb = "export namespace pb";
        this.declare_module_pb = "declare module pb";
        this.import$protobuf = "import $protobuf = protobuf;";
    }
    ProtobufJsHelper.prototype.generatePbJs = function () {
        //e.g. pbjs -t static -w CommonJS -o c:\fox\projects\tools\NodeJsTools\test\pb.js c:\fox\projects\tools\NodeJsTools\test\pb.proto
        var cmdStr = "pbjs -t static --force-long -w CommonJS -o " + this.path_pb_js + " " + this.path_pb_proto;
        console.log("Doing generatePbJs: ", cmdStr);
        var out = child_process.execSync(cmdStr);
        if (out.toString()) {
            console.log("out:", out.toString());
        }
        else {
            console.log("Doing generatePbJs complete! No news is good news.");
        }
    };
    ProtobufJsHelper.prototype.generatePbTsd = function () {
        console.log("Doing generatePbTsd");
        var out = child_process.execSync("pbts -o " + this.path_pb_tsd + " " + this.path_pb_js + " -m");
        if (out.toString()) {
            console.log("out:", out.toString());
        }
        else {
            console.log("Doing generatePbTsd complete! No news is good news.");
        }
    };
    /**protobufjs生成的代码无法直接使用, 需要自己处理一下 */
    ProtobufJsHelper.prototype.modifyJs = function () {
        var path = this.path_pb_js;
        var buf = fs.readFileSync(path);
        var content = buf.toString();
        if (content.indexOf(this.var$protobuf) == -1) {
            content = this.var$protobuf + this.line_separator + content;
        }
        if (content.lastIndexOf(this.pb$root) == -1) {
            content = content + this.line_separator + this.pb$root;
        }
        fs.writeFileSync(path, content);
    };
    ProtobufJsHelper.prototype.modifyTs = function () {
        var path = this.path_pb_tsd;
        var buf = fs.readFileSync(path);
        var content = buf.toString();
        if (content.indexOf(this.export_namespace_pb) > -1) {
            content = content.replace(this.export_namespace_pb, this.declare_module_pb);
            content = this.import$protobuf + this.line_separator + content;
        }
        fs.writeFileSync(path, content);
    };
    return ProtobufJsHelper;
}());
//---
var argv = parseArgs(process.argv.slice(2), {
    alias: {
        'help': 'h',
        'dir': 'd',
        'proto': 'p',
        'js': 'j',
        'tsd': 't' //生成的.d.ts文件位置
    }
});
if (argv.help || (!argv.proto || !argv.js || !argv.tsd)) {
    console.log("Help in here!\r\n", "e.g.  bin/ProtobufJsHelper.js -d test --proto pb.proto -j pb.js -t pb.d.ts");
}
else {
    var dir = argv.dir;
    if (!dir) {
        dir = "";
    }
    var inst = new ProtobufJsHelper();
    inst.path_pb_proto = path.resolve(dir, argv.proto);
    inst.path_pb_js = path.resolve(dir, argv.js);
    inst.path_pb_tsd = path.resolve(dir, argv.tsd);
    //
    inst.generatePbJs();
    inst.generatePbTsd();
    inst.modifyJs();
    inst.modifyTs();
    console.log("Complete!");
}
process.exit(1);
//# sourceMappingURL=ProtobufJsGenerator.js.map