"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var child_process = require("child_process");
var path = require("path");
var parseArgs = require("minimist");
var process = require("process");
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
        var cmdStr = "pbjs -t static -w CommonJS -o " + this.path_pb_js + " " + this.path_pb_proto;
        console.log("Doing generatePbJs: ", cmdStr);
        var out = child_process.execSync(cmdStr);
        if (out.toString()) {
            console.log("out:", out.toString());
        }
        else {
            console.log("No news is good news.");
        }
    };
    ProtobufJsHelper.prototype.generatePbTsd = function () {
        console.log("Doing generatePbTsd");
        var out = child_process.execSync("pbts -o " + this.path_pb_tsd + " " + this.path_pb_js + " -m");
        if (out.toString()) {
            console.log("out:", out.toString());
        }
        else {
            console.log("No news is good news.");
        }
    };
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
        'protobuf': 'p',
        'js': 'j',
        'tsd': 't'
    }
});
if (argv.help || (!argv.protobuf || !argv.js || !argv.tsd)) {
    console.log("Help in here!\r\n", "e.g.  bin/ProtobufJsHelper.js -d test --protobuf pb.proto -j pb.js -t pb.d.ts");
}
else {
    var dir = argv.dir;
    if (!dir) {
        dir = "";
    }
    var inst = new ProtobufJsHelper();
    inst.path_pb_proto = path.resolve(dir, argv.protobuf);
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
//# sourceMappingURL=ProtobufJsHelper.js.map