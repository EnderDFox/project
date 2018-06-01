/* 文件管理 */
import * as fs from "fs";
import * as path from "path";
import * as parseArgs from "minimist";
import * as child_process from "child_process";
import * as express from "express";
import * as ejs from "ejs";
import * as bodyParser from "body-parser";
import { MathUtil } from "./MathUtil";

export class ExpressServer {
    static EXT_MAP = ".map"
    static FAVICON_ICO = "/favicon.ico"

    args: parseArgs.ParsedArgs
    app: express.Express;
    staticPath: string

    init(argsOpts: { [key: string]: string | string[] } = null, initGetPostAllFunc: Function = null) {
        if (!argsOpts) {
            argsOpts = {}
        }
        argsOpts['dir'] = 'd'
        argsOpts['port'] = 'p'
        var args = parseArgs(process.argv.slice(2), {
            alias: argsOpts
        });
        this.args = args
        //
        console.log("[info]", "`args.dir(-d)`:", args.dir)
        console.log("[info]", "`args.port(-p)`:", args.port)
        console.log("[info]", "`__dirname`:", __dirname)
        console.log("[info]", "`process.cwd()`:", process.cwd())
        this.staticPath = path.resolve(__dirname, '../../../', args.dir || "");
        console.log("[info]", "`staticPath`:", this.staticPath);
        console.log("[info]", "------")
        //
        var app: express.Express = express();
        this.app = app
        app.use(bodyParser.urlencoded({ extended: false }))//加入post解析插件
        app.use(express.static(this.staticPath));
        //--自定义
        if (initGetPostAllFunc != null) {
            initGetPostAllFunc()
        }
        //--can't find
        app.use((req, res, next) => {
            if (path.extname(req.url) == ExpressServer.EXT_MAP || req.url == ExpressServer.FAVICON_ICO) {
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
        var port = this.args.port || 80
        app.listen(port, () => {
            console.log(`Server started on http://${this.getIPAdress()}:${port} or http://localhost:${port}, press Ctrl-C to terminate.`);
        });
    }
    getIPAdress() {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return "localhost";
    }
    /** 没有定位到的,如果是目录,则显示目录列表 */
    showFolderContent(req: express.Request, res: express.Response): boolean {
        var reqUrl: string = req.url;
        if (reqUrl.indexOf('/') == 0) {
            reqUrl = reqUrl.replace('/', '')
        }
        var folder = path.resolve(this.staticPath, reqUrl)
        // console.log("[debug]", "will showFolderContent:", folder)
        if (fs.existsSync(folder)) {
            var stat = fs.lstatSync(folder);
            if (stat.isDirectory()) {
                var t = fs.readFileSync(path.resolve(__dirname, '../../template/index.template.html')).toString()
                var children: string[] = []
                t = ejs.render(t, { title: 'Folder List', children: this.getChildFiles(folder, null) })
                // console.log("[info]", "t:", t)
                res.end(t)
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**解析文件夹, 获取里面的文件和文件夹 (无递归)*/
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
}