/* 合并多个文件到一个json中 */
import * as fs from "fs";
import * as path from "path";
import * as parseArgs from "minimist";
import { MathUtil } from "./lib1/MathUtil";
import { FileUtil } from "./lib1/FileUtil";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

class CombineFile {
    extNeed: string[]
    extIgnore: string[]
    input: string
    output: string
    exec() {
        var argsOpts: { [key: string]: string } = {};
        argsOpts['input'] = 'i'
        argsOpts['output'] = 'o'
        argsOpts['ext_need'] = 'n'  //需要的后缀名
        argsOpts['ext_ignore'] = 'g'    //忽略的后缀名
        var args = parseArgs(process.argv.slice(2), { alias: argsOpts, boolean: 'watch' });
        console.log("[info]", "args.input(-i):", args.input)
        console.log("[info]", "args.output(-o):", args.output)
        console.log("[info]", "args.ext_need(-n)", args.ext_need)
        console.log("[info]", "args.ext_ignore(-g)", args.ext_ignore)
        console.log("[info]", "args.watch(-w)", args.watch)
        //
        this.input = args.input
        this.output = args.output
        this.extNeed = args.ext_need ? args.ext_need.split(" ") : []
        this.extIgnore = args.ext_ignore ? args.ext_ignore.split(" ") : []
        this.combine()
        fs.watch(this.input, { persistent: true, recursive: true }, () => {
            clearTimeout(this.combineTimeoutId)
            this.combineTimeoutId = setTimeout(() => {
                this.combine()
            }, 1000);
        })
    }
    combineTimeoutId: NodeJS.Timer
    combine() {
        console.log("[info]", "combine", this.input)
        var files: FileItem[] = FileUtil.getFileAll(this.input, this.extNeed, this.extIgnore);
        var rs: { [key: string]: string } = {};
        //
        var len = files.length
        for (var i = 0; i < len; i++) {
            var file = files[i]
            var fullUrl = path.resolve(file.parent, file.name)
            var relativeUrl = path.relative(this.input, fullUrl)
            var content = fs.readFileSync(fullUrl)
            relativeUrl = relativeUrl.replace(/\\/g, '/')
            rs[relativeUrl] = content.toString()
            // console.log("[info]", relativeUrl, ":[relativeUrl]")
        }
        fs.writeFileSync(this.output, JSON.stringify(rs))
    }
}
//
var combineFile = new CombineFile()
combineFile.exec()