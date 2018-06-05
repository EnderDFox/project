import * as fs from "fs";
import * as child_process from "child_process";
import * as path from "path";
import * as parseArgs from "minimist";
import * as process from 'process';

/**
 * 调用protobufjs生成 UMD下可以使用的 js和 d.ts
 * # 准备工作:
 * - 安装protobufjs:  cnpm i protobufjs -g
 * - 引入 protogbuf.js 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/dist/minimal/protobuf.js) 
 * - 工程加入 protobuf.d.ts 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/index.d.ts) 
 * - 引入 本工具生成的 pb.js和pb.d.ts
 * # e.g.
 * ```TypeScript
    var login = new pb.Login()
    login.account = "my acc"
    login.password = "my pwd"
    var bufferWriter = pb.Login.encode(login)
    var loginB = pb.Login.decode(bufferWriter.finish())
    console.log("[debug]",loginB,":[loginB]")
 * ```
 */
class ProtobufJsHelper {
    public path_pb_proto: string;
    public path_pb_js: string;
    public path_pb_tsd: string;
    public generatePbJs() {
        //e.g. pbjs -t static -w CommonJS -o c:\fox\projects\tools\NodeJsTools\test\pb.js c:\fox\projects\tools\NodeJsTools\test\pb.proto
        var cmdStr = `pbjs -t static -w CommonJS -o ${this.path_pb_js} ${this.path_pb_proto}`;
        console.log("Doing generatePbJs: ",cmdStr);
        let out: Buffer = child_process.execSync(cmdStr);
        if (out.toString()) {
            console.log("out:", out.toString());
        } else {
            console.log("Doing generatePbJs complete! No news is good news.");
        }
    }
    public generatePbTsd() {
        console.log("Doing generatePbTsd");
        let out: Buffer = child_process.execSync(`pbts -o ${this.path_pb_tsd} ${this.path_pb_js} -m`);
        if (out.toString()) {
            console.log("out:", out.toString());
        } else {
            console.log("Doing generatePbTsd complete! No news is good news.");
        }
    }
    private line_separator: string = "\r\n";
    private var$protobuf: string = "var $protobuf = protobuf;";
    private pb$root: string = "pb = $root.pb";
    private export_namespace_pb: string = "export namespace pb";
    private declare_module_pb: string = "declare module pb";
    private import$protobuf: string = "import $protobuf = protobuf;";
    /**protobufjs生成的代码无法直接使用, 需要自己处理一下 */
    public modifyJs(): void {
        let path: string = this.path_pb_js;
        let buf: Buffer = fs.readFileSync(path);
        let content: string = buf.toString();
        if (content.indexOf(this.var$protobuf) == -1) {
            content = this.var$protobuf + this.line_separator + content;
        }
        if (content.lastIndexOf(this.pb$root) == -1) {
            content = content + this.line_separator + this.pb$root;
        }
        fs.writeFileSync(path, content);
    }
    public modifyTs(): void {
        let path: string = this.path_pb_tsd;
        let buf: Buffer = fs.readFileSync(path);
        let content: string = buf.toString();
        if (content.indexOf(this.export_namespace_pb) > -1) {
            content = content.replace(this.export_namespace_pb, this.declare_module_pb);
            content = this.import$protobuf + this.line_separator + content;
        }
        fs.writeFileSync(path, content);
    }
}

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
} else {
    var dir = argv.dir;
    if (!dir) {
        dir = "";
    }
    let inst: ProtobufJsHelper = new ProtobufJsHelper();
    inst.path_pb_proto = path.resolve(dir,argv.protobuf);
    inst.path_pb_js = path.resolve(dir,argv.js);
    inst.path_pb_tsd = path.resolve(dir,argv.tsd);
    //
    inst.generatePbJs();
    inst.generatePbTsd();
    inst.modifyJs();
    inst.modifyTs();
    console.log("Complete!");
}
process.exit(1);