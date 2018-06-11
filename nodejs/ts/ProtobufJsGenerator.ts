import * as fs from "fs";
import * as child_process from "child_process";
import * as path from "path";
import * as parseArgs from "minimist";
import * as process from 'process';

/**
 * 调用protobufjs生成 UMD下可以使用的 .js和 .d.ts
 * # 准备工作:
 * - 安装protobufjs:  cnpm i protobufjs -g
 * - 引入 protogbuf.js 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/dist/minimal/protobuf.js) 
 * - 工程加入 protobuf.d.ts 来源: (C:/Users/hubin/AppData/Roaming/npm/node_modules/protobufjs/index.d.ts) 
 * - 找到 protobuf.d.ts 的 `export interface Long {...}` 复制到工程内一个合适的.d.ts中 (注意要去掉 `export`)
 * - 引入 本工具生成的 .js和 .d.ts
 * # e.g.
 * ```TypeScript
    var login = new hellopbjs.Login()
    login.account = "my acc"
    login.password = "my pwd"
    var bufferWriter = hellopbjs.Login.encode(login)
    var loginB = hellopbjs.Login.decode(bufferWriter.finish())
    console.log("[debug]",loginB,":[loginB]")
 * ```
 * # TODO
 * modify的namespace有问题还是`pb`呢,应该改成.proto中定义的namespace, 最省事方法就是所有.proto中的namespace用 pb开头例如pb.hello.myproject
 * # other
 * # 有关long的问题
 * long都是用 js默认的number (53 bit integer) 不是真64 但方便,
 * 要用真64, 比较麻烦, 步骤如下(没测试过)
 * - 执行pdjs时要加参数 --force-long
 * - 需要引入long.js
 * - 设置protobuf.util.Long = Long.js中导出的Long
 */
class ProtobufJsGenerator {
    public path_pb_proto: string;
    public path_pb_js: string;
    public path_pb_tsd: string;
    public init() {
        var argv = parseArgs(process.argv.slice(2), {
            alias: {
                'help': 'h',
                'dir': 'd',     //文件总的根目录[可选],设置后续 --proto等参数可以使用基于这个目录的相对路径
                'proto': 'p',   //.proto源文件位置
                'js': 'j',      //生成的.js文件位置
                'tsd': 't'      //生成的.d.ts文件位置
            },
            boolean: 'watch'
        });
        if (argv.help || (!argv.proto || !argv.js || !argv.tsd)) {
            console.log("Help in here!\r\n", "e.g.  bin/ProtobufJsHelper.js -d test --proto pb.proto -j pb.js -t pb.d.ts");
        } else {
            var dir = argv.dir;
            if (!dir) {
                dir = "";
            }
            this.path_pb_proto = path.resolve(dir, argv.proto);
            this.path_pb_js = path.resolve(dir, argv.js);
            this.path_pb_tsd = path.resolve(dir, argv.tsd);
            //
            console.log("Complete!");
            //
            this.exec()
            fs.watch(this.path_pb_proto, { persistent: true, recursive: true }, () => {
                clearTimeout(this.execTimeoutId)
                this.execTimeoutId = setTimeout(() => {
                    this.exec()
                }, 1000);
            })
        }
        // process.exit(1);
    }
    execTimeoutId: NodeJS.Timer
    public exec() {
        console.log("[info]", "File change detected. Starting incremental compilation...", this.path_pb_proto)
        this.generatePbJs();
        this.generatePbTsd();
        this.modifyJs();
        this.modifyTs();
        console.log("[info]", "Watching for file changes.")
    }
    //
    public generatePbJs() {
        //e.g. pbjs -t static -w CommonJS -o c:\fox\projects\tools\NodeJsTools\test\pb.js c:\fox\projects\tools\NodeJsTools\test\pb.proto
        var cmdStr = `pbjs -t static -w CommonJS -o ${this.path_pb_js} ${this.path_pb_proto}`;
        // var cmdStr = `pbjs -t static --force-long -w CommonJS -o ${this.path_pb_js} ${this.path_pb_proto}`;
        console.log("Doing generatePbJs: ", cmdStr);
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
    private line_separator: string = "\n";
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
new ProtobufJsGenerator().init()