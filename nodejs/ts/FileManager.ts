/* 文件管理 */
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import * as express from "express";
import { MathUtil } from "./lib1/MathUtil";
import { ExpressServer } from "./lib1/ExpressServer";

class FileManager {

    server: ExpressServer

    constructor() {
        this.initServer()
    }
    initServer() {
        this.server = new ExpressServer()
        //random_ext_xxx: e.g. ['mp4', 'rm', 'rmvb', 'mkv', 'wmv', 'avi']
        this.server.init({ "folder": 'f', 'random_ext_need': 'r', 'random_ext_ignore': 'i' }, this.initGetPostAll.bind(this))
        this.extNeed = this.server.args.random_ext_need?this.server.args.random_ext_need.split(" "):[]
        this.extIgnore = this.server.args.random_ext_ignore?this.server.args.random_ext_ignore.split(" "):[]
        console.log("[log]",this.server.args.random_ext_need,this.extNeed,":[this.extNeed]")
        console.log("[log]",this.server.args.random_ext_ignore,this.extIgnore,":[this.extIgnore]")
    }
    initGetPostAll() {
        var app = this.server.app
        app.get("/get1", (req: express.Request, res: express.Response) => {
            console.log(req.query);
            res.send({ success1: true });
            // path.parse(pathString)
        });
        app.post("/post1", (req, res) => {
            console.log(req, req.body);
            res.send({ success2: true });
        });
        //
        app.get("/list", this.cs_list.bind(this))
        app.get("/openFolder", this.cs_openFolder.bind(this))
        app.get("/playFile", this.cs_playFile.bind(this))
        app.get("/rename", this.cs_rename.bind(this))
        app.get("/getRandomFiles", this.cs_getRandomFiles.bind(this))
    }
    //===
    cs_list(req: express.Request, res: express.Response): void {
        var currPath: string = req.query.currPath
        if (!currPath) {
            currPath = path.resolve(process.cwd(), this.server.args.folder || "");
        }
        //
        var data: IVueData = {
            showRandom: true,
            showChildren: true,
            currPath: currPath,
            randomItems: [],
            childrenSelectedAll: true,
            childItems: []
        }
        if (fs.existsSync(currPath)) {
            //获取random files
            data.randomItems = this.getRandomFiles(currPath)
            data.childItems = this.server.getChildFiles(currPath, (file: string): boolean => {
                if (file.indexOf(".") == 0 || file.indexOf("$") == 0) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            data.error = `${currPath} is not exists`
        }
        res.send(data);
    }
    cs_getRandomFiles(req: express.Request, res: express.Response): void {
        var data: IVueData = {
            randomItems: this.getRandomFiles(req.query.currPath)
        }
        res.send(data)
    }
    //---递归得到文件夹里的所有文件 为了随机用的
    /**得到目录下所有文件 (递归) 中随机的几个 */
    getRandomFiles(dir: string): IChildFile[] {
        var filesAll = this.getFileAll(dir);
        if (filesAll.length) {
            var rs: IChildFile[] = [];
            var i = 10;
            while (i--) {
                var obj = filesAll[MathUtil.randomInt(filesAll.length - 1)];
                if (obj) {
                    rs.push(obj);
                }
            }
            return rs
        } else {
            return []
        }
    }
    /**忽略的后缀名 */
    extIgnore: string[]
    /**需要的后缀名,如果为null或length=0则不限制后缀名 
     * e.g. ['mp4', 'rm', 'rmvb', 'mkv', 'wmv', 'avi']
    */
    extNeed: string[]
    /**得到目录下所有文件 (递归) */
    getFileAll(dir: string): IRandomFile[] {
        var fileAll: IRandomFile[] = []
        if (dir == null || dir.trim() == "") {
            return [];
        }
        if (dir.indexOf("/") == -1) {
            dir += "/";
        }
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fullname = path.resolve(dir, file);
            // console.log("parseDir item:", fullname, file);
            try {
                var stat = fs.lstatSync(fullname);
                if (file.indexOf(".") == 0) {
                    // console.info("[info]", "过滤掉以 . 开头的File",fullname);
                    continue;
                }
                var ext = path.extname(fullname).toLowerCase();
                ext = ext.replace(/\./g,'') //去掉 `.`
                if (this.extIgnore.indexOf(ext) > -1) continue;
                if (this.extNeed.length > 0 && this.extNeed.indexOf(ext) == -1) continue;
                if (stat.isDirectory()) {
                    fileAll = fileAll.concat(this.getFileAll(fullname));//recursive children folders
                } else {
                    fileAll.push(
                        {
                            uuid: fileAll.length,
                            name: path.parse(fullname).base,
                            parent: path.parse(fullname).dir,
                        }
                    );
                }
            } catch (error) {
                console.log("[debug] catch error:", error)
            }
        }
        return fileAll
    }
    cs_openFolder(req: express.Request, res: express.Response): void {
        var fullpath: string = req.query.folder
        fullpath = fullpath.replace(/\//g, '\\')
        child_process.exec("explorer " + fullpath);
    }
    cs_playFile(req: express.Request, res: express.Response): void {
        var fullpath: string = req.query.fullname
        fullpath = fullpath.replace(/\//g, '\\')
        child_process.exec("explorer " + fullpath);
    }
    cs_rename(req: express.Request, res: express.Response): void {
        //大小写不敏感时直接rename有问题
        var newFullnameTemp = req.query.newFullname + ".rename.temp"
        fs.renameSync(req.query.fullname, newFullnameTemp)
        fs.renameSync(newFullnameTemp, req.query.newFullname)
        res.send({ success: true });
    }
}

new FileManager()