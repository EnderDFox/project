import * as fs from "fs";
import * as path from "path";
import * as parseArgs from "minimist";
import * as process from 'process';

class AutoReferencePathItem {
    public fullPath: string;
    public typeName: string;
    public superItem: AutoReferencePathItem;
    public children: AutoReferencePathItem[];
    /** 是否已经被使用 */
    public used: boolean = false;
}
class AutoReferencePath {
    static word_namespace: string = "namespace";
    static word_module: string = "module";
    static word_class: string = "class";
    static word_enum: string = "enum";
    static word_interface: string = "interface";
    static word_extends: string = "extends";
    //-
    public path_dir: string;
    public path_out: string;
    public excludes: string[];
    //-
    topFileFullPaths: string[];
    fileFullPaths: string[];
    /**
     * key:typeName
     * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
     */
    typeDict: { [key: string]: AutoReferencePathItem; };
    typeQueue: AutoReferencePathItem[];
    //-
    public exec() {
        if(this.parseCmdArg()==false) return;
        //
        let stat = fs.lstatSync(this.path_dir);
        if (stat.isDirectory() == false) {
            console.log("[error]", "dir必须是文件夹");
        } else {
            //step 1 count fileFullPaths
            this.topFileFullPaths = [];
            this.fileFullPaths = [];
            this.parseDir(this.path_dir);
            //step 2 parse file to type names
            this.typeDict = {};
            for (let i = 0; i < this.fileFullPaths.length; i++) {
                let file: string = this.fileFullPaths[i];
                this.parseFile(file);
            }
            //step 3 count typeQueue
            this.typeQueue = [];
            this.combineItemsToQueue();
            //step 4 combine typeQueue to ReferencePaths.ts
            this.combineReferencePaths();
        }
    }
    public parseCmdArg():boolean {
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
        } else {
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
            } else {
                this.path_out = path.resolve(dir, output);
            }
            //
            console.log("path_dir:", this.path_dir);
            console.log("path_out:", this.path_out);
            if (argv.excludes) {
                var excludes = argv.excludes.split(" ");
                for (let i = 0; i < excludes.length; i++) {
                    let exclude: string = excludes[i];
                    if (exclude) {
                        if (path.isAbsolute(exclude)) {
                            excludes[i] = path.resolve(exclude);
                        } else {
                            excludes[i] = path.resolve(dir, exclude);
                        }
                    }
                }
                this.excludes = excludes;
            }
            console.log("excludes", this.excludes);
            return true;
        }
    }
    /**
     * 分析文件夹,提取里面的所有文件
     * @param dir 
     */
    parseDir(dir: string) {
        let files = fs.readdirSync(dir);
        // console.log("[debug]","files",files.length);
        for (let i = 0; i < files.length; i++) {
            let file: string = files[i];
            let fullPath: string = path.resolve(dir, file);
            if (this.excludes == null || (this.excludes.indexOf(fullPath) == -1 && fullPath != this.path_out)) {
                var stat: fs.Stats = fs.lstatSync(fullPath);
                if (stat.isDirectory()) {
                    this.parseDir(fullPath);
                } else {
                    if (file.indexOf(".") == 0) {
                        console.info("[info]", "过滤掉以 . 开头的File");
                    } else if (path.parse(fullPath).ext == ".ts") {
                        console.log("[info]", file, "is ts file");
                        this.fileFullPaths.push(fullPath);
                    } else {
                        console.info("[info]", "过滤掉其它不需要的File");
                    }
                }
            } else {
                // console.log("[debug]", "Path is exclude", fullPath);
            }
        }
    }
    parseFile(fullPath: string) {
        var str: string = fs.readFileSync(fullPath).toString();
        var strLines: string[] = str.split("\n");
        var rs: boolean = this.parseStrType(fullPath, strLines);
        if (rs == false) {
            this.topFileFullPaths.push(fullPath);
        }
    }
    /**分析文件的class类型 */
    parseStrType(fullPath: string, strLines: string[]): boolean {
        var namespaceName: string = "";
        for (let i = 0; i < strLines.length; i++) {
            let strLine = strLines[i];
            if(strLine.indexOf("//")==0 || strLine.indexOf("/*")==0){
                continue;
            }
            if (strLine.indexOf(AutoReferencePath.word_namespace) > -1) {
                namespaceName = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_namespace);
            }else if (strLine.indexOf(AutoReferencePath.word_module) > -1) {
                namespaceName = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_module);
            }
            var typeWord: string = null;
            if (strLine.indexOf(AutoReferencePath.word_class) > -1) {
                typeWord = AutoReferencePath.word_class;
            } else if (strLine.indexOf(AutoReferencePath.word_enum) > -1) {
                typeWord = AutoReferencePath.word_enum;
            } else if (strLine.indexOf(AutoReferencePath.word_interface) > -1) {
                typeWord = AutoReferencePath.word_interface;
            }
            if (typeWord != null) {
                this.parseType(fullPath, strLine, typeWord, namespaceName);
                return true;
            }
        }
        return false;
    }
    parseType(fullPath: string, strLine: string, typeWord: string, namespaceName: string) {
        var item: AutoReferencePathItem = new AutoReferencePathItem();
        var typeName: string = this.getTypeNameInStrLine(strLine, typeWord);
        var typeItem: AutoReferencePathItem = this.getItem(namespaceName ? (namespaceName + "." + typeName) : typeName);
        typeItem.fullPath = fullPath;
        // console.log("[info]",typeItem.fullPath,typeItem.typeName);
        //extends
        var superTypeName: string = this.getTypeNameInStrLine(strLine, AutoReferencePath.word_extends);
        if (superTypeName != null) {
            var superTypeItem: AutoReferencePathItem = this.getItem(superTypeName);
            superTypeItem.children.push(typeItem);
            typeItem.superItem = superTypeItem;
        }
    }
    getTypeNameInStrLine(strLine: string, typeWord: string): string {
        var typeArr: string[] = strLine.split(/\s/g);
        var typeIndex: number = typeArr.indexOf(typeWord);
        if (typeIndex == -1) {
            return null;
        } else {
            var typeName: string = typeArr[typeIndex + 1];
            typeName = typeName.replace("{", "");
            typeName = typeName.trim();
            return typeName;
        }
    }
    getItem(typeName: string): AutoReferencePathItem {
        var typeItem: AutoReferencePathItem;
        if (this.typeDict[typeName] == undefined) {
            typeItem = new AutoReferencePathItem();
            typeItem.typeName = typeName;
            typeItem.children = [];
            this.typeDict[typeName] = typeItem;
        } else {
            typeItem = this.typeDict[typeName];
        }
        return typeItem;
    }
    combineItemsToQueue(): void {
        for (let key in this.typeDict) {
            var item: AutoReferencePathItem = this.typeDict[key];
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
    }
    combineItemToQueue(item: AutoReferencePathItem) {
        item.used = true;
        if (item.fullPath != null) {
            this.typeQueue.push(item);
        }
        for (let i = 0; i < item.children.length; i++) {
            let child: AutoReferencePathItem = item.children[i];
            this.combineItemToQueue(child);
        }
    }
    combineReferencePaths() {
        var outArr: string[] = [];
        for (let i = 0; i < this.topFileFullPaths.length; i++) {
            let fullPath: string = this.topFileFullPaths[i];
            outArr.push(this.combineReferencePath(fullPath));
        }
        for (let i = 0; i < this.typeQueue.length; i++) {
            let item: AutoReferencePathItem = this.typeQueue[i];
            // console.log("[info]", "itemQueue", i, item.typeName, item.superItem != null, item.fullPath);
            outArr.push(this.combineReferencePath(item.fullPath));
        }
        fs.writeFileSync(this.path_out, outArr.join("\r\n"));
    }
    combineReferencePath(fullPath: string): string {
        // console.log("[debug]","dir",path.parse(this.path_out).dir);
        // console.log("[debug]","fullpath",fullPath);
        // console.log("[debug]","rs",path.relative(path.parse(this.path_out).dir,fullPath));
        return `/// <reference path="${path.relative(path.parse(this.path_out).dir,fullPath)}" />`;
    }
}
//---
var inst: AutoReferencePath = new AutoReferencePath();
inst.exec();
console.log("Complete! Write to", inst.path_out);
process.exit(1);