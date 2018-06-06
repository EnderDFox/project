"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* 文件管理 */
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var MathUtil_1 = require("./lib1/MathUtil");
var ExpressServer_1 = require("./lib1/ExpressServer");
var FileManager = /** @class */ (function () {
    function FileManager() {
        this.initServer();
    }
    FileManager.prototype.initServer = function () {
        this.server = new ExpressServer_1.ExpressServer();
        //random_ext_xxx: e.g. ['mp4', 'rm', 'rmvb', 'mkv', 'wmv', 'avi']
        this.server.init({ "folder": 'f', 'random_ext_need': 'r', 'random_ext_ignore': 'i' }, this.initGetPostAll.bind(this));
        console.log("[info]", this.server.args.folder, ":[this.folder]");
        console.log("[info]", this.server.args.random_ext_need, ":[this.extNeed]");
        console.log("[info]", this.server.args.random_ext_ignore, ":[this.extIgnore]");
        console.log("[info]", "------");
        this.extNeed = this.server.args.random_ext_need ? this.server.args.random_ext_need.split(" ") : [];
        this.extIgnore = this.server.args.random_ext_ignore ? this.server.args.random_ext_ignore.split(" ") : [];
    };
    FileManager.prototype.initGetPostAll = function () {
        var app = this.server.app;
        app.get("/get1", function (req, res) {
            console.log(req.query);
            res.send({ success1: true });
            // path.parse(pathString)
        });
        app.post("/post1", function (req, res) {
            console.log(req, req.body);
            res.send({ success2: true });
        });
        //
        app.get("/list", this.cs_list.bind(this));
        app.get("/openFolder", this.cs_openFolder.bind(this));
        app.get("/playFile", this.cs_playFile.bind(this));
        app.get("/rename", this.cs_rename.bind(this));
        app.get("/getRandomFiles", this.cs_getRandomFiles.bind(this));
    };
    //===
    FileManager.prototype.cs_list = function (req, res) {
        var currPath = req.query.currPath;
        if (!currPath) {
            currPath = path.resolve(process.cwd(), this.server.args.folder || "");
        }
        //
        var data = {
            showRandom: true,
            showChildren: true,
            currPath: currPath,
            randomItems: [],
            childrenSelectedAll: true,
            childItems: []
        };
        if (fs.existsSync(currPath)) {
            //获取random files
            data.randomItems = this.getRandomFiles(currPath);
            data.childItems = this.server.getChildFiles(currPath, function (file) {
                if (file.indexOf(".") == 0 || file.indexOf("$") == 0) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        else {
            data.error = currPath + " is not exists";
        }
        res.send(data);
    };
    FileManager.prototype.cs_getRandomFiles = function (req, res) {
        var data = {
            randomItems: this.getRandomFiles(req.query.currPath)
        };
        res.send(data);
    };
    //---递归得到文件夹里的所有文件 为了随机用的
    /**得到目录下所有文件 (递归) 中随机的几个 */
    FileManager.prototype.getRandomFiles = function (dir) {
        var filesAll = this.getFileAll(dir);
        if (filesAll.length) {
            var rs = [];
            var i = 10;
            while (i--) {
                var obj = filesAll[MathUtil_1.MathUtil.randomInt(filesAll.length - 1)];
                if (obj) {
                    rs.push(obj);
                }
            }
            return rs;
        }
        else {
            return [];
        }
    };
    /**得到目录下所有文件 (递归) */
    FileManager.prototype.getFileAll = function (dir) {
        var fileAll = [];
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
                ext = ext.replace(/\./g, ''); //去掉 `.`
                if (this.extIgnore.indexOf(ext) > -1)
                    continue;
                if (this.extNeed.length > 0 && this.extNeed.indexOf(ext) == -1)
                    continue;
                if (stat.isDirectory()) {
                    fileAll = fileAll.concat(this.getFileAll(fullname)); //recursive children folders
                }
                else {
                    fileAll.push({
                        uuid: fileAll.length,
                        name: path.parse(fullname).base,
                        parent: path.parse(fullname).dir,
                    });
                }
            }
            catch (error) {
                console.log("[debug] catch error:", error);
            }
        }
        return fileAll;
    };
    FileManager.prototype.cs_openFolder = function (req, res) {
        var fullpath = req.query.folder;
        fullpath = fullpath.replace(/\//g, '\\');
        child_process.exec("explorer " + fullpath);
    };
    FileManager.prototype.cs_playFile = function (req, res) {
        var fullpath = req.query.fullname;
        fullpath = fullpath.replace(/\//g, '\\');
        child_process.exec("explorer " + fullpath);
    };
    FileManager.prototype.cs_rename = function (req, res) {
        //大小写不敏感时直接rename有问题
        var newFullnameTemp = req.query.newFullname + ".rename.temp";
        fs.renameSync(req.query.fullname, newFullnameTemp);
        fs.renameSync(newFullnameTemp, req.query.newFullname);
        res.send({ success: true });
    };
    return FileManager;
}());
new FileManager();
//# sourceMappingURL=FileManager.js.map