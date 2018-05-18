import * as fs from "fs";
import * as express from "express";
import * as path from "path";
import * as parseArgs from "minimist";

class StaticServer {
    static Ext_map = ".map";
    public start() {
        console.log("[info]", process.cwd(), "`process.cwd()`");
        var args = parseArgs(process.argv.slice(2), {
            alias: {
                'dir': 'd',
                "port": 'p',
            }
        });
        console.log(__dirname, "`__dirname`", process.cwd(), "`process.cwd()`", args.dir, "`args.dir`", args.port, "`args.port`");
        var rootPath: string = path.resolve(process.cwd(), args.dir || "");
        console.log(rootPath, "{rootPath}");
        var app: express.Express = express();
        app.get('/savefile', function (req, res) {
            console.log(req.baseUrl,req.query);
            let fullPath = path.resolve(rootPath,req.query.file);
            console.log("[debug]",fullPath,"`fullPath`");
            fs.writeFileSync(fullPath,req.query.content);
            res.send({ success: true });
        });
        app.post("/post1", function(req,res){
            console.log(req.query);
        });
        app.get("/get1", function(req,res){
            console.log(req.query);
        });
        app.use(express.static(rootPath));
        app.use(function (req, res, next) {
            if(path.extname(req.url) != StaticServer.Ext_map){
                console.log("404", req.url);
            }
            res.send({ success: true });
        });
        app.use(function (err, req, res, next) {
            console.error("err:", err.stack);
        });
        app.set('port', args.port || 80);
        app.listen(app.get('port'), function () {
            console.log(`Express started on http://${StaticServer.getIPAdress()}:` +
                app.get('port') + '; press Ctrl-C to terminate StaticServer.');
        });
    }
    public static getIPAdress() {
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
    // 检测端口是否被占用
    public portIsOccupied(port) {
        // 创建服务并监听该端口
        var server = require('net').createServer().listen(port)

        server.on('listening', function () { // 执行这块代码说明端口未被占用
            server.close() // 关闭服务
            console.log('The port【' + port + '】 is available.') // 控制台输出信息
        })

        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                console.log('The port【' + port + '】 is occupied, please change other port.')
            }
        })
    }
}
//===
new StaticServer().start();
