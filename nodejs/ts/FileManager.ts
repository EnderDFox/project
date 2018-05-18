/* 文件管理 */
import * as fs from "fs";
import * as path from "path";
import * as parseArgs from "minimist";
import * as child_process from "child_process";
import * as express from "express";
import * as ejs from "ejs";
import * as bodyParser from "body-parser";
import { MathUtil } from "./utils/MathUtil";

class FileManager {
    static Ext_map = ".map"
    args: parseArgs.ParsedArgs
    app: express.Express;
    staticPath: string
    constructor() {
        this.initServer()
    }
    initServer() {
        var args = parseArgs(process.argv.slice(2), {
            alias: {
                'dir': 'd',
                "port": 'p',
                "folder": 'f',
            }
        });
        this.args = args
        //
        console.log("[info]", "`args.dir(-d)`:", args.dir)
        console.log("[info]", "`args.port(-p)`:", args.port)
        console.log("[info]", "`args.folder(-f)`:", args.folder)
        console.log("[info]", "`__dirname`:", __dirname)
        console.log("[info]", "`process.cwd()`:", process.cwd())
        var staticPath = path.resolve(process.cwd(), args.dir || "");
        console.log("[info]", "`staticPath`:", staticPath);
        this.staticPath = staticPath
        //
        var app: express.Express = express();
        this.app = app;
        app.use(bodyParser.urlencoded({ extended: false }))
        // 
        this.initGetPostAll()
        //static
        app.use(express.static(staticPath));
        //can't find
        app.use((req, res, next) => {
            if (path.extname(req.url) == FileManager.Ext_map || req.url == '/favicon.ico') {
                res.send({ success: true });
            } else if (this.showFolderContent(req, res)) {
            } else {
                console.log("404", req.url);
                res.sendStatus(404)
            }
        });
        app.use((err, req, res, next) => {
            console.error("err:", err.stack);
        });
        //start server
        var port = args.port || 80
        app.listen(port, () => {
            console.log('Express started on http://localhost:' +
                port + ' ; press Ctrl-C to terminate.');
        });
    }
    /** 没有定位到的,如果是目录,则显示目录列表 */
    showFolderContent(req: express.Request, res: express.Response): boolean {
        var reqUrl: string = req.url;
        if (reqUrl.indexOf('/') == 0) {
            reqUrl = reqUrl.replace('/', '')
        }
        var folder = path.resolve(this.staticPath, reqUrl)
        // console.log("[debug]", "will showFolderContent:", folder)
        var stat = fs.lstatSync(folder);
        if (stat.isDirectory()) {
            var t = fs.readFileSync(path.resolve(process.cwd(), 'bin/template/index.template.html')).toString()
            var children: string[] = []
            t = ejs.render(t, { title: 'Folder List', children: this.getChildFiles(folder, null) })
            // console.log("[info]", "t:", t)
            res.end(t)
            return true;
        } else {
            return false;
        }
    }
    initGetPostAll() {
        var app = this.app
        app.get("/list", this.cs_list.bind(this))
        app.get("/openFolder", this.cs_openFolder.bind(this))
        app.get("/playFile", this.cs_playFile.bind(this))
        app.get("/rename", this.cs_rename.bind(this))
        app.get("/getRandomFiles", this.cs_getRandomFiles.bind(this))
        app.get("/get1", (req: express.Request, res: express.Response) => {
            console.log(req.query);
            res.send({ success1: true });
            // path.parse(pathString)
        });
        app.post("/post1", (req, res) => {
            console.log(req, req.body);
            res.send({ success2: true });
        });
    }
    //===
    cs_list(req: express.Request, res: express.Response): void {
        var currPath: string = req.query.currPath
        if (currPath == null) {
            currPath = path.resolve(process.cwd(), this.args.folder || "");
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
        //获取random files
        data.randomItems = this.getRandomFiles(currPath)
        data.childItems = this.getChildFiles(currPath, (file: string): boolean => {
            if (file.indexOf(".") == 0 || file.indexOf("$") == 0) {
                return true
            } else {
                return false
            }
        })
        //
        res.send(data);
    }
    cs_getRandomFiles(req: express.Request, res: express.Response): void {
        var data: IVueData = {
            randomItems: this.getRandomFiles(req.query.currPath)
        }
        res.send(data)
    }
    //解析文件夹, 获取里面的文件和文件夹
    getChildFiles(dir: string, ignoreFunc: (file: string) => boolean): IChildFile[] {
        var fileList: IChildFile[] = []
        if (dir == null || dir.trim() == "") {
            return [];
        }
        if (dir.indexOf("/") == -1) {
            dir += "/";
        }
        // console.log("parseDir", dir, path.resolve(dir));
        var files = fs.readdirSync(dir);
        // console.log("[debug]","files",files.length);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fullname = path.resolve(dir, file);
            // console.log("parseDir item:", fullname, file);
            try {
                var stat = fs.lstatSync(fullname);
                if (ignoreFunc != null && ignoreFunc(file)) {
                    // if(file.indexOf(".") == 0 || file.indexOf("$") == 0) {
                    // console.info("[info]", "过滤掉以 . 开头的File");
                } else {
                    fileList.push(
                        {
                            uuid: fileList.length,
                            isDir: stat.isDirectory(),
                            name: path.parse(fullname).base,
                            newName: path.parse(fullname).base,
                            parent: path.parse(fullname).dir,
                            selected: !stat.isDirectory(),
                        }
                    )
                }
            } catch (error) {
                console.log("[debug] catch error:", error)
            }
        }
        return fileList;
    }
    //---递归得到文件夹里的所有文件 为了随机用的
    /*     ignoreExtnames = ["torrent", "jpg", "png", "txt", "mp3", "lnk", "url", "pdf",
            "js", "html", "css",
            "zip", "rar", "7z"]; */
    needExtNames = ["mp4", "rm", "rmvb", "mkv", "wmv", "avi"]
    //得到随机文件
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
                // if (this.ignoreExtnames.indexOf('.'+ext) > -1) continue;
                if (this.needExtNames.indexOf('.' + ext) == -1) continue;
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