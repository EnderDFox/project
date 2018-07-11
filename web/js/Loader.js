//内容加载
var LoaderClass = /** @class */ (function () {
    function LoaderClass() {
        this.isDebug = false;
        //版本号 由外部传入
        this.Ver = '0.0.0';
        //模块Id
        this.Needs = {};
        //语言环境
        this.Lang = ['zh'];
        //需要加载的css文件列表
        //     <link rel="stylesheet" href="css/common.css?v=v1.3.59" />
        this.CssList = [
            { path: "", files: ['common', 'project', 'project1'] }
        ];
        //需要加载的js文件列表  jquery必须提前加载
        //< script src = "js/Loader1.js?v=v1.3.59" > </script>
        this.JsList = [
            { path: "", files: ['Define', 'JQueryExtend', 'Protocol', 'Config', 'WSConn', 'Commond', 'Common', 'DateTime', 'Templet', 'Data', 'Main'] },
            { path: "lib", files: ['vue', 'Echarts.min', 'Cookie', 'jquery.md5'] },
            { path: "common", files: ['PrototypeExtend'] },
            {
                path: "module", files: ['User', 'ProjectNav', 'FileManager',
                    'ProcessData', 'ProcessManager', 'ProcessPanel', 'ProcessFilter',
                    'CollateData', 'CollateManager', 'CollatePanel', 'CollateFilter',
                    'NoticeData', 'NoticeManager', 'NoticePanel',
                    'ProfileData', 'ProfileManager', 'ProfilePanel',
                    'TemplateManager', 'PopManager', 'UploadManager', 'VersionManager']
            },
            {
                path: "tests", files: []
            }
        ];
        //脚本数量
        this.LoadFileSum = 0;
        //加载状态
        this.IsComplete = false;
        this.IsVueTemplateLoaded = false;
        /**vue模板缓存 */
        this.VueTemplateLoadedDict = {};
    }
    //初始化
    LoaderClass.prototype.Init = function () {
        Loader.CheckEnviroment();
        if (Loader.isDebug) {
            //开发阶段用随机数做版本号
            this.Ver = Math.random().toString();
            //加载脚本
            this.LoadAll();
        }
        else {
            //正式版本读取 <script src="js/Loader.js?v=xxx"></script> 中的版本号
            var scripts = window.document.head.getElementsByTagName('script');
            var len = scripts.length;
            for (var i = 0; i < len; i++) {
                var item = scripts[i];
                if (item.src && item.src.indexOf('Loader.js') > -1) {
                    this.Ver = item.src.split('v=')[1];
                    //加载脚本
                    this.LoadAll();
                    return;
                }
            }
            console.log("[fatal]", "\u6CA1\u6709\u627E\u5230<script src=\"js/Loader.js?v=xxx\"></script>");
        }
    };
    //注册函数
    LoaderClass.prototype.RegisterFunc = function () {
        PopManager.Init();
        //用户管理
        User.RegisterFunc();
        //数据管理
        Data.RegisterFunc();
        //个人管理
        ProfileManager.RegisterFunc();
        //进度管理
        ProcessManager.RegisterFunc();
        //模板管理
        TemplateManager.RegisterFunc();
        //版本管理
        VersionManager.RegisterFunc();
        //晨会管理
        CollateManager.RegisterFunc();
        //内容管理
        FileManager.RegisterFunc();
        //提示管理
        NoticeManager.RegisterFunc();
        //上传管理(测试)
        UploadManager.RegisterFunc();
    };
    //设置协议
    LoaderClass.prototype.SetNeedCode = function () {
        this.Needs[L2C.L2C_SESSION_LOGIN] = true;
        this.Needs[L2C.L2C_USER_LIST] = true;
        this.Needs[L2C.L2C_DEPARTMENT_LIST] = true;
    };
    //检查环境
    LoaderClass.prototype.CheckEnviroment = function () {
        if (window.location.href.toLowerCase().indexOf('isdebug=true') > -1) {
            this.isDebug = true;
        }
        else if (window.location.href.toLowerCase().indexOf('isdebug=false') > -1) {
            this.isDebug = false;
        }
        else {
            var hostMap = { '192.168.118.132:8080': 1, '192.168.50.191:8080': 1, 'localhost:8080': 1, '192.168.118.224:8080': 1, '192.168.120.236:8080': 1 };
            if (hostMap[location.host]) {
                this.isDebug = true;
            }
            else {
                this.isDebug = false;
            }
        }
    };
    //调试 初始化
    LoaderClass.prototype.InitForDebug = function () {
        var key = '23528d0315eac50e44927b0051e6e75f';
        var account = 'fengjw';
        var str = window.location.href.toLowerCase();
        // console.log("[debug]", str)
        if (str.indexOf('debugacc=') > -1) {
            str = str.split('debugacc=').pop().toString();
            str = str.split(/\&|\?/).shift().toString();
            account = str;
        }
        var verify = $.md5(key + account);
        console.log("[info]", account, ":[account]", verify, ":[verify]");
        $.cookie("set", { duration: 0, name: 'Account', value: account });
        $.cookie("set", { duration: 0, name: 'Verify', value: verify });
    };
    LoaderClass.prototype.InitPid = function () {
        var str = window.location.href.toLowerCase();
        if (str.indexOf('pid=') > -1) {
            str = str.split('pid=').pop().toString();
            str = str.split(/\&|\?/).shift().toString();
            User.Pid = parseInt(str);
        }
        else {
            User.Pid = PidFeild.AGAME;
        }
    };
    //脚本加载完毕
    LoaderClass.prototype.ScriptComplete = function () {
        //调试
        if (this.isDebug) {
            this.InitForDebug();
        }
        //注册函数
        this.RegisterFunc();
        //必须的协议
        this.SetNeedCode();
        //链接服务器
        this.Connect();
    };
    //同步css
    LoaderClass.prototype.AsyncCss = function (list, path) {
        var _this = this;
        for (var i in list) {
            var v = list[i];
            this.loadSingleCss(path + v, function () {
                _this.LoadFileSum--;
                if (_this.LoadFileSum == 0) {
                    _this.ScriptComplete();
                }
            });
        }
    };
    //同步脚本
    LoaderClass.prototype.AsyncScript = function (list, path) {
        var _this = this;
        for (var i in list) {
            var v = list[i];
            //方法1 这样编译器能断点  浏览器console中可以显示正确的位置
            this.loadSingleScript(path + v, function () {
                _this.LoadFileSum--;
                if (_this.LoadFileSum == 0) {
                    //脚本加载完毕
                    _this.ScriptComplete();
                }
            });
            //方法2 这样无法断点  浏览器console中显示的位置也是VM的位置
            /* $.ajax({
                url:path+v+'.js',dataType:'script',async:true,
                success:(res,textStatus)=>{
                    this.LoadSrcNum--
                    if(this.LoadSrcNum == 0){
                        //脚本加载完毕
                        this.ScriptComplete()
                    }
                }
            }) */
        }
    };
    LoaderClass.prototype.loadSingleCss = function (src, callback) {
        var s = document.createElement('link');
        s.rel = 'stylesheet';
        s.type = 'text/css';
        // s.async = true;
        s.href = "css/" + src + ".css?v=" + this.Ver;
        s.id = src;
        s.addEventListener('load', function () {
            s.removeEventListener('load', arguments.callee, false);
            callback();
        }, false);
        document.head.appendChild(s);
    };
    LoaderClass.prototype.loadSingleScript = function (src, callback) {
        var s = document.createElement('script');
        s.async = true;
        s.src = "js/" + src + ".js?v=" + this.Ver;
        s.addEventListener('load', function () {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', arguments.callee, false);
            callback();
        }, false);
        document.body.appendChild(s);
    };
    //加载脚本
    LoaderClass.prototype.LoadAll = function () {
        var _this = this;
        //先加载jquery否则需要他的资源无法使用
        this.loadSingleScript("lib/jquery-3.2.1.min", function () {
            //计算总数
            _this.LoadFileSum = 0;
            for (var i in _this.CssList) {
                _this.LoadFileSum += _this.CssList[i].files.length;
            }
            for (var i in _this.JsList) {
                _this.LoadFileSum += _this.JsList[i].files.length;
            }
            //开始加载
            for (var i in _this.CssList) {
                var item = _this.CssList[i];
                _this.AsyncCss(item.files, item.path + '/');
            }
            for (var i in _this.JsList) {
                var item = _this.JsList[i];
                _this.AsyncScript(item.files, item.path + '/');
            }
        });
    };
    //链接初始化
    LoaderClass.prototype.Connect = function () {
        var _this = this;
        this.InitPid();
        //链接服务
        WSConn.Init();
        //登陆
        WSConn.onOpen(function () {
            User.Login();
        });
        //关闭
        WSConn.onClose(function () {
            location.reload();
        });
        //收到
        WSConn.onMessage(function (msg) {
            //函数执行
            Commond.Execute(msg.Cid, msg.Data);
            //执行完毕
            _this.MsgAsync(msg.Cid);
        });
    };
    //消息回调
    LoaderClass.prototype.MsgCall = function () {
        //程序入口
        Main.Init();
    };
    //消息同步完成
    LoaderClass.prototype.MsgAsync = function (cid) {
        if (this.IsComplete) {
            return;
        }
        delete this.Needs[cid];
        var len = 0;
        $.each(this.Needs, function () {
            len++;
            return;
        });
        //完毕
        if (len == 0) {
            this.IsComplete = true;
            this.MsgCall();
        }
    };
    LoaderClass.prototype.LoadVueTemplate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tplHtml;
        var idName;
        var tplName;
        var callback;
        if (args.length == 3) {
            tplHtml = args[0];
            idName = args[1];
            tplName = tplHtml + '/' + idName;
            callback = args[2];
        }
        else {
            tplName = args[0];
            callback = args[1];
        }
        this.__LoadVueTemplate_PlanA(tplName, callback);
    };
    LoaderClass.prototype.__LoadVueTemplate_PlanA = function (tplName, callback) {
        var _this = this;
        if (this.VueTemplateLoadedDict[tplName]) {
            callback(this.VueTemplateLoadedDict[tplName], tplName);
        }
        else {
            $.ajax({
                url: "vue_template/" + tplName + ".html?v=" + this.Ver, dataType: 'text', async: true, success: function (tpl) {
                    _this.VueTemplateLoadedDict[tplName] = tpl;
                    if (callback) {
                        callback(tpl, tplName);
                    }
                }
            });
        }
    };
    LoaderClass.prototype.__LoadVueTemplate_PlanB = function (tplName, callback) {
        var _this = this;
        tplName += '.html';
        if (!this.IsVueTemplateLoaded) {
            this.IsVueTemplateLoaded = true;
            $.ajax({
                url: "vue_template.bundle.json?v=" + this.Ver, dataType: 'text', async: true, success: function (tpl) {
                    _this.VueTemplateLoadedDict = JSON.parse(tpl);
                    var tpl = _this.VueTemplateLoadedDict[tplName];
                    if (!tpl) {
                        console.log("[error]", "tpl is null", tplName);
                    }
                    else {
                        if (callback) {
                            callback(tpl, tplName);
                        }
                    }
                }
            });
        }
        else {
            var tpl = this.VueTemplateLoadedDict[tplName];
            if (!tpl) {
                console.log("[error]", "tpl is null", tplName);
            }
            else {
                if (callback) {
                    callback(tpl, tplName);
                }
            }
        }
    };
    /**批量加载vue模板 */
    LoaderClass.prototype.LoadVueTemplateList = function (tplNameList, callback) {
        var _this = this;
        var _tplNameList = tplNameList.concat();
        var _tplTxtList = [];
        var _doLoad = function () {
            if (_tplNameList.length > 0) {
                _this.LoadVueTemplate(_tplNameList.shift(), function (tpl, tplName) {
                    _tplTxtList.push(tpl);
                    _doLoad();
                });
            }
            else {
                //加载完成
                callback(_tplTxtList, tplNameList);
            }
        };
        _doLoad();
    };
    return LoaderClass;
}());
//
var Loader = new LoaderClass();
//# sourceMappingURL=Loader.js.map