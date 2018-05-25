//内容加载
var Loader = {
    isDebug: false,
    //版本号 由外部传入
    Ver: '0.0.0',
    //模块Id
    Needs: {},
    //语言环境
    Lang: ['zh'],
    //需要加载的css文件列表
    //     <link rel="stylesheet" href="css/common.css?v=v1.3.59" />
    CssList: [
        { path: "", files: ['common', 'project'] }
    ],
    //需要加载的js文件列表  jquery必须提前加载
    //< script src = "js/Loader1.js?v=v1.3.59" > </script>
    JsList: [
        { path: "", files: ['Define', 'PrototypeExtend', 'JQueryExtend', 'Protocol', 'Config', 'WSConn', 'Commond', 'Common', 'DateTime', 'Search', 'Templet', 'Data', 'Main'] },
        { path: "lib", files: ['vue', 'Echarts.min', 'Cookie', 'jquery.md5'] },
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
    ],
    //脚本数量
    LoadFileSum: 0,
    //加载状态
    IsComplete: false,
    //初始化
    Init: function (ver) {
        Loader.Ver = ver;
        //加载脚本
        this.LoadAll();
    },
    //注册函数
    RegisterFunc: function () {
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
    },
    //设置协议
    SetNeedCode: function () {
        this.Needs[L2C.L2C_SESSION_LOGIN] = true;
        this.Needs[L2C.L2C_USER_LIST] = true;
        this.Needs[L2C.L2C_DEPARTMENT_LIST] = true;
    },
    //检查环境
    CheckEnviroment: function () {
        if (window.location.href.toLowerCase().indexOf('isdebug=true') > -1) {
            this.isDebug = true;
        }
        else if (window.location.href.toLowerCase().indexOf('isdebug=false') > -1) {
            this.isDebug = false;
        }
        else {
            var hostMap = { '192.168.50.191:8080': 1, 'localhost:8080': 1, '192.168.118.224:8080': 1, '192.168.120.236:8080': 1 };
            if (hostMap[location.host]) {
                this.isDebug = true;
            }
            else {
                this.isDebug = false;
            }
        }
    },
    //调试 初始化
    InitForDebug: function () {
        var str = window.location.href.toLowerCase();
        console.log("[debug]", str);
        if (str.indexOf('debugacc=') > -1) {
            str = str.split('debugacc=').pop().toString();
            str = str.split('&').shift().toString();
            var verify = '';
            switch (str) {
                case 'wangy':
                    verify = 'cfd4ce79ef36c539b63d0e54143abf2d';
                    break;
                case 'xiangjch':
                    verify = 'b078eac31f1a05a49647e8683f8fd5a8';
                    break;
            }
            $.cookie("set", { duration: 0, name: 'Account', value: str });
            $.cookie("set", { duration: 0, name: 'Verify', value: verify });
        }
        else {
            $.cookie("set", { duration: 0, name: 'Account', value: 'fengjw' });
            $.cookie("set", { duration: 0, name: 'Verify', value: 'f96f8007f6566300c90cbc09555cf17b' });
        }
    },
    //脚本加载完毕
    ScriptComplete: function () {
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
    },
    //同步css
    AsyncCss: function (list, path) {
        for (var i in list) {
            var v = list[i];
            Loader.loadSingleCss(path + v, function () {
                Loader.LoadFileSum--;
                if (Loader.LoadFileSum == 0) {
                    Loader.ScriptComplete();
                }
            });
        }
    },
    //同步脚本
    AsyncScript: function (list, path) {
        for (var i in list) {
            var v = list[i];
            //方法1 这样编译器能断点  浏览器console中可以显示正确的位置
            Loader.loadSingleScript(path + v, function () {
                Loader.LoadFileSum--;
                if (Loader.LoadFileSum == 0) {
                    //脚本加载完毕
                    Loader.ScriptComplete();
                }
            });
            //方法2 这样无法断点  浏览器console中显示的位置也是VM的位置
            /* $.ajax({
                url:path+v+'.js',dataType:'script',async:true,
                success:function(res,textStatus){
                    Loader.LoadSrcNum--
                    if(Loader.LoadSrcNum == 0){
                        //脚本加载完毕
                        Loader.ScriptComplete()
                    }
                }
            }) */
        }
    },
    loadSingleCss: function (src, callback) {
        var s = document.createElement('link');
        s.rel = 'stylesheet';
        s.type = 'text/css';
        // s.async = true;
        s.href = "css/" + src + ".css?v=" + Loader.Ver;
        s.id = src;
        s.addEventListener('load', function () {
            s.removeEventListener('load', arguments.callee, false);
            callback();
        }, false);
        document.head.appendChild(s);
    },
    loadSingleScript: function (src, callback) {
        var s = document.createElement('script');
        s.async = true;
        s.src = "js/" + src + ".js?v=" + Loader.Ver;
        s.addEventListener('load', function () {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', arguments.callee, false);
            callback();
        }, false);
        document.body.appendChild(s);
    },
    //加载脚本
    LoadAll: function () {
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
    },
    //链接初始化
    Connect: function () {
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
            Loader.MsgAsync(msg.Cid);
        });
    },
    //消息回调
    MsgCall: function () {
        //程序入口
        Main.Init();
    },
    //消息同步完成
    MsgAsync: function (cid) {
        if (this.IsComplete) {
            return false;
        }
        delete this.Needs[cid];
        var len = 0;
        $.each(this.Needs, function () {
            len++;
            return false;
        });
        //完毕
        if (len == 0) {
            this.IsComplete = true;
            this.MsgCall();
        }
    },
    VueTemplateLoaded: {},
    LoadVueTemplate: function (tplName, callback) {
        if (Loader.VueTemplateLoaded[tplName]) {
            callback(Loader.VueTemplateLoaded[tplName]);
        }
        else {
            $.ajax({
                url: "vue_template/" + tplName + ".html?v" + Loader.Ver, dataType: 'text', async: true,
                success: function (res, textStatus) {
                    Loader.VueTemplateLoaded[tplName] = res;
                    if (callback) {
                        callback(res);
                    }
                }
            });
        }
    }
};
//准备完毕
window.onload = function () {
    Loader.CheckEnviroment();
    if (Loader.isDebug) {
        //开发阶段用随机数做版本号
        Loader.Init(Math.random().toString());
    }
    else {
        //正式版本读取 <script src="js/Loader.js?v=xxx"></script> 中的版本号
        var scripts = this.document.head.getElementsByTagName('script');
        var len = scripts.length;
        for (var i = 0; i < len; i++) {
            var item = scripts[i];
            if (item.src && item.src.indexOf('Loader.js') > -1) {
                Loader.Init(item.src.split('v=')[1]);
                return;
            }
        }
        console.log("[fatal]", "\u6CA1\u6709\u627E\u5230<script src=\"js/Loader.js?v=xxx\"></script>");
    }
};
//# sourceMappingURL=Loader.js.map