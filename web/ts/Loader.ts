interface ILoadGroup {
    path: string
    files: string[]
}
enum SERVER_KIND {
    /**正式服 */
    PROJ = 1,
    /**beta服 */
    BETA = 2,
    /**开发服 */
    DEV = 3,
}
//内容加载
class LoaderClass {
    isDebug = false
    //服务器性质
    ServerKind: SERVER_KIND = SERVER_KIND.PROJ
    //版本号 由外部传入
    RealVer: string
    Ver = '0.0.0'
    //模块Id
    Needs: { [key: number]: boolean } = {}
    //语言环境
    Lang = ['zh']
    //需要加载的css文件列表
    //     <link rel="stylesheet" href="css/common.css?v=v1.3.59" />
    CssList: ILoadGroup[] = [
        { path: "", files: ['common', 'project', 'project1'] }
    ]
    //需要加载的js文件列表  jquery必须提前加载
    //< script src = "js/Loader1.js?v=v1.3.59" > </script>
    JsList: ILoadGroup[] = [
        { path: "", files: ['Define', 'JQueryExtend', 'Protocol', 'Config', 'WSConn', 'Commond', 'Common', 'DateTime', 'Templet', 'Data', 'Main'] },
        { path: "lib", files: ['vue', 'Echarts.min', 'Cookie', 'jquery.md5'] },
        { path: "common", files: ['PrototypeExtend', 'VueManager'] },
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
    ]
    //脚本数量
    LoadFileSum = 0
    //加载状态
    IsComplete = false
    //初始化
    Init() {
        Loader.CheckEnviroment()
        var scripts = window.document.head.getElementsByTagName('script')
        var len = scripts.length
        for (var i = 0; i < len; i++) {
            var item = scripts[i];
            if (item.src && item.src.indexOf('Loader.js') > -1) {
                this.Ver = item.src.split('v=')[1]
                break;
            }
        }
        this.RealVer = this.Ver
        if (Loader.isDebug) {
            //开发阶段用随机数做版本号
            this.Ver = Math.random().toString()
        } else {
            //正式版本读取 <script src="js/Loader.js?v=xxx"></script> 中的版本号
        }
        //加载脚本
        this.LoadAll()
    }
    //注册函数
    RegisterFunc() {
        PopManager.Init()
        //用户管理
        User.RegisterFunc()
        //数据管理
        Data.RegisterFunc()
        //个人管理
        ProfileManager.RegisterFunc()
        //进度管理
        ProcessManager.RegisterFunc()
        //模板管理
        TemplateManager.RegisterFunc()
        //版本管理
        VersionManager.RegisterFunc()
        //晨会管理
        CollateManager.RegisterFunc()
        //内容管理
        FileManager.RegisterFunc()
        //提示管理
        NoticeManager.RegisterFunc()
        //上传管理(测试)
        UploadManager.RegisterFunc()
    }
    //设置协议
    SetNeedCode() {
        this.Needs[L2C.L2C_SESSION_LOGIN] = true
        this.Needs[L2C.L2C_USER_LIST] = true
        this.Needs[L2C.L2C_DEPARTMENT_LIST] = true
    }
    //检查环境
    CheckEnviroment() {
        var hostMap: any = { '192.168.118.132:8080': 1, '192.168.50.191:8080': 1, 'localhost:8080': 1, '192.168.118.224:8080': 1, '192.168.120.236:8080': 1 }
        if (hostMap[location.host]) {
            this.ServerKind = SERVER_KIND.DEV
        } else {
            if (location.host.indexOf(":8081") > -1) {
                this.ServerKind = SERVER_KIND.BETA
            } else {
                this.ServerKind = SERVER_KIND.PROJ
            }
        }
        if (window.location.href.toLowerCase().indexOf('isdebug=true') > -1) {
            this.isDebug = true;
        } else if (window.location.href.toLowerCase().indexOf('isdebug=false') > -1) {
            this.isDebug = false;
        } else {
            switch (this.ServerKind) {
                case SERVER_KIND.DEV:
                    this.isDebug = true;
                    break;
                case SERVER_KIND.PROJ:
                case SERVER_KIND.PROJ:
                    this.isDebug = false;
                    break;
            }
        }
    }
    //调试 初始化
    InitForDebug() {
        var key = '23528d0315eac50e44927b0051e6e75f'
        var account: string = 'fengjw'
        var str = window.location.href.toLowerCase()
        // console.log("[debug]", str)
        if (str.indexOf('debugacc=') > -1) {
            str = str.split('debugacc=').pop().toString()
            str = str.split(/\&|\?/).shift().toString()
            account = str
        }
        var verify = $.md5(key + account)
        console.log("[info]", account, ":[account]", verify, ":[verify]")
        $.cookie("set", { duration: 0, name: 'Account', value: account })
        $.cookie("set", { duration: 0, name: 'Verify', value: verify })
    }
    InitPid() {
        var str = window.location.href.toLowerCase()
        if (str.indexOf('pid=') > -1) {
            str = str.split('pid=').pop().toString()
            str = str.split(/\&|\?/).shift().toString()
            User.Pid = parseInt(str)
        } else {
            User.Pid = PidFeild.AGAME
        }
    }
    //脚本加载完毕
    private OnLoadJsCssComplete() {
        VueManager.Init(this.OnInitVueComplete.bind(this))
    }
    private OnInitVueComplete() {
        //调试
        if (this.isDebug) {
            this.InitForDebug()
        }
        //注册函数
        this.RegisterFunc()
        //必须的协议
        this.SetNeedCode()
        //链接服务器
        this.Connect()
    }
    //同步css
    AsyncCss(list: string[], path: string) {
        for (var i in list) {
            var v = list[i]
            this.loadSingleCss(path + v, () => {
                this.LoadFileSum--
                if (this.LoadFileSum == 0) {
                    this.OnLoadJsCssComplete()
                }
            })
        }
    }
    //同步脚本
    AsyncScript(list: string[], path: string) {
        for (var i in list) {
            var v = list[i]
            //方法1 这样编译器能断点  浏览器console中可以显示正确的位置
            this.loadSingleScript(path + v, () => {
                this.LoadFileSum--
                if (this.LoadFileSum == 0) {
                    //脚本加载完毕
                    this.OnLoadJsCssComplete()
                }
            })
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
    }
    loadSingleCss(src: string, callback: () => void) {
        var s = document.createElement('link');
        s.rel = 'stylesheet';
        s.type = 'text/css';
        // s.async = true;
        s.href = `css/${src}.css?v=${this.Ver}`
        s.id = src
        s.addEventListener('load', function () {
            s.removeEventListener('load', (arguments.callee as EventListenerOrEventListenerObject), false);
            callback();
        }, false);
        document.head.appendChild(s);
    }
    loadSingleScript(src: string, callback: () => void) {
        var s = document.createElement('script');
        s.async = true;
        s.src = `js/${src}.js?v=${this.Ver}`
        s.addEventListener('load', function () {
            (s.parentNode as Node).removeChild(s)
            s.removeEventListener('load', (arguments.callee as EventListenerOrEventListenerObject), false);
            callback()
        }, false);
        document.body.appendChild(s);
    }
    //加载脚本
    LoadAll() {
        //先加载jquery否则需要他的资源无法使用
        this.loadSingleScript("lib/jquery-3.2.1.min", () => {
            //计算总数
            this.LoadFileSum = 0
            for (var i in this.CssList) {
                this.LoadFileSum += this.CssList[i].files.length
            }
            for (var i in this.JsList) {
                this.LoadFileSum += this.JsList[i].files.length
            }
            //开始加载
            for (var i in this.CssList) {
                var item = this.CssList[i]
                this.AsyncCss(item.files, item.path + '/')
            }
            for (var i in this.JsList) {
                var item = this.JsList[i]
                this.AsyncScript(item.files, item.path + '/')
            }
        })
    }
    //链接初始化
    Connect() {
        this.InitPid()
        //链接服务
        WSConn.Init()
        //登陆
        WSConn.onOpen(function () {
            User.Login()
        })
        //关闭
        WSConn.onClose(function () {
            location.reload()
        })
        //收到
        WSConn.onMessage((msg: { Cid: number, Data: any }) => {
            //函数执行
            Commond.Execute(msg.Cid, msg.Data)
            //执行完毕
            this.MsgAsync(msg.Cid)
        })
    }
    //消息回调
    MsgCall() {
        //程序入口
        Main.Init()
    }
    //消息同步完成
    MsgAsync(cid: number): void {
        if (this.IsComplete) {
            return
        }
        delete this.Needs[cid]
        var len = 0
        $.each(this.Needs, function () {
            len++
            return
        })
        //完毕
        if (len == 0) {
            this.IsComplete = true
            this.MsgCall()
        }
    }
    IsVueTemplateLoaded: boolean = false
    /**vue模板缓存 */
    VueTemplateLoadedDict: { [key: string]: string } = {}
    /**加载vue模板
     * @tplName 模板路径名称, 对应``vue_template`目录下的html文件,  e.g. `process\FilterItemTextField`
     */
    LoadVueTemplate(tplName: string, callback: (tpl: string, tplName: string) => void);
    /**加载vue模板
     * @tplHtml 模板文件夹路径名称,             e.g.    `process`
     * @idName 模板文件夹内对应的html文件名      e.g.    `FilterItemTextField`
     */
    LoadVueTemplate(tplHtml: string, idName: string, callback: (tpl: string, tplName: string) => void);
    LoadVueTemplate(...args) {
        var tplHtml: string
        var idName: string
        var tplName: string
        var callback: (tpl: string, tplName: string) => void
        if (args.length == 3) {
            tplHtml = args[0]
            idName = args[1]
            tplName = tplHtml + '/' + idName
            callback = args[2]
        } else {
            tplName = args[0]
            callback = args[1]
        }
        this.__LoadVueTemplate_PlanA(tplName, callback)
    }
    __LoadVueTemplate_PlanA(tplName: string, callback: (tpl: string, tplName: string) => void) {
        if (this.VueTemplateLoadedDict[tplName]) {
            callback(this.VueTemplateLoadedDict[tplName], tplName)
        } else {
            $.ajax({
                url: `vue_template/${tplName}.html?v=${this.Ver}`, dataType: 'text', async: true, success: (tpl: string) => {
                    this.VueTemplateLoadedDict[tplName] = tpl;
                    if (callback) {
                        callback(tpl, tplName)
                    }
                }
            })
        }
    }
    __LoadVueTemplate_PlanB(tplName: string, callback: (tpl: string, tplName: string) => void) {
        tplName += '.html'
        if (!this.IsVueTemplateLoaded) {
            this.IsVueTemplateLoaded = true
            $.ajax({
                url: `vue_template.bundle.json?v=${this.Ver}`, dataType: 'text', async: true, success: (tpl: string) => {
                    this.VueTemplateLoadedDict = JSON.parse(tpl)
                    var tpl = this.VueTemplateLoadedDict[tplName]
                    if (!tpl) {
                        console.log("[error]", "tpl is null", tplName)
                    } else {
                        if (callback) {
                            callback(tpl, tplName)
                        }
                    }
                }
            })
        } else {
            var tpl = this.VueTemplateLoadedDict[tplName]
            if (!tpl) {
                console.log("[error]", "tpl is null", tplName)
            } else {
                if (callback) {
                    callback(tpl, tplName)
                }
            }
        }
    }
    /**批量加载vue模板 */
    LoadVueTemplateList(tplNameList: string[], callback: (tplList: string[], tplNameList: string[]) => void) {
        var _tplNameList = tplNameList.concat()
        var _tplTxtList: string[] = []
        var _doLoad = () => {
            if (_tplNameList.length > 0) {
                this.LoadVueTemplate(_tplNameList.shift(), (tpl: string, tplName: string) => {
                    _tplTxtList.push(tpl)
                    _doLoad()
                })
            } else {
                //加载完成
                callback(_tplTxtList, tplNameList)
            }
        }
        _doLoad()
    }
}
//
var Loader = new LoaderClass()
