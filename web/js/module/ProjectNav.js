var NavMenuValue;
(function (NavMenuValue) {
    NavMenuValue[NavMenuValue["PROFILE"] = 0] = "PROFILE";
    NavMenuValue[NavMenuValue["PROCESS"] = 1] = "PROCESS";
    NavMenuValue[NavMenuValue["COLLATE"] = 2] = "COLLATE";
})(NavMenuValue || (NavMenuValue = {}));
//项目导航
var ProjectNavClass = /** @class */ (function () {
    function ProjectNavClass() {
        //过滤器
        this.FilterDid = 0; // 使用 DidField.VERSION 在IE会报错
        //菜单选择
        this.NavMenu = NavMenuValue.PROCESS;
    }
    // NavMenu = NavMenuValue.COLLATE
    //初始化di 
    ProjectNavClass.prototype.Init = function () {
        //筛选器
        ProcessFilter.Init();
        CollateFilter.Init();
        //初始化
        ProcessPanel.Init();
        VersionManager.Init();
        TemplateManager.Init();
        //初始化
        CollatePanel.Init();
        //绑定事件
        this.BindActions();
        UploadManager.Init();
    };
    //绑定事件
    ProjectNavClass.prototype.BindActions = function () {
        var _this = this;
        var plan = $('#projectNav');
        //子菜单事件
        plan.find('.body').delegate('li', 'click', function (e) {
            ProcessPanel.HideMenu();
            if ($(e.currentTarget).hasClass('on')) { //当前正选中的li,再次点击不处理
                return false;
            }
            plan.find('.body li').removeClass();
            var did = $(e.currentTarget).addClass('on').attr('did');
            _this.FilterDid = parseInt(did);
            //ProcessFilter.ResetPack()
            //ProcessPanel.Index()
            Main.Over(function () {
                ProcessPanel.Index();
            });
            return true;
        });
        //父菜单事件
        plan.find('.head').delegate('li', 'click', function (e) {
            ProcessPanel.HideMenu();
            _this.HideMenu();
            if ($(e.currentTarget).hasClass('on')) {
                return false;
            }
            plan.find('.head li').removeClass();
            $(e.currentTarget).addClass('on');
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'ProfilePanel':
                    _this.ProfilePanelShow();
                    break;
                case 'ProcessPanel':
                    _this.ProcessPanelShow();
                    break;
                case 'CollatePanel':
                    _this.CollatePanelShow();
                    break;
            }
            return true;
        }).find('li:eq(' + this.NavMenu + ')').click();
        //筛选
        $('#projectSer').click(function (e) {
            switch (_this.NavMenu) {
                case NavMenuValue.PROCESS:
                    ProcessPanel.HideMenu();
                    ProcessFilter.ShowFilter(e.currentTarget, e);
                    break;
                case NavMenuValue.COLLATE:
                    CollatePanel.HideMenu();
                    CollateFilter.ShowFilter(e.currentTarget, e);
                    break;
            }
        });
        //保存
        $('#saveFile').click(function (e) {
            switch (_this.NavMenu) {
                case NavMenuValue.PROFILE:
                    break;
                case NavMenuValue.PROCESS:
                    break;
                case NavMenuValue.COLLATE:
                    Main.Over(function () {
                        WSConn.sendMsg(C2L.C2L_SAVE_COLLATE, CollateFilter.Pack);
                    });
                    break;
            }
        });
        plan.find(".tpl_edit").click(function (e) {
            TemplateManager.ShowEditTplModeList(e);
        });
    };
    //个人主页
    ProjectNavClass.prototype.ProfilePanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            ProfilePanel.Index();
        });
        $('#saveFile,#projectSer').hide();
        plan.find(".tpl_edit").hide();
        this.NavMenu = NavMenuValue.PROFILE;
    };
    //进度面板
    ProjectNavClass.prototype.ProcessPanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            ProcessPanel.Index();
        });
        plan.find('.body li').removeClass().filter('[did="' + this.FilterDid + '"]').addClass('on');
        plan.find('.menu').show();
        $('#projectSer').show();
        $('#saveFile').hide();
        // plan.find(".tpl_edit").show()//暂时不需要这个入口
        plan.find(".tpl_edit").hide();
        this.NavMenu = NavMenuValue.PROCESS;
        if (Loader.isDebug) {
            plan.find('.test_fox').show().on('click', function (e) {
                // WSConn.sendMsg(C2L.C2L_TEST_1, {})
                // UploadManager.ShowUploadWork(e.currentTarget,101)
                // ManagerManager.Show()
            });
        }
    };
    //晨会面板
    ProjectNavClass.prototype.CollatePanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            CollatePanel.Index();
        });
        plan.find('.menu').hide();
        $('#saveFile,#projectSer').show();
        $('#saveFile').hide(); //TODO:
        plan.find(".tpl_edit").hide();
        this.NavMenu = NavMenuValue.COLLATE;
    };
    //关闭菜单
    ProjectNavClass.prototype.HideMenu = function () {
        $('#workFilter,#extraNotice').hide();
        ProcessFilter.HideFilter(false);
        Common.HidePullDownMenu();
    };
    return ProjectNavClass;
}());
var ProjectNav = new ProjectNavClass();
//# sourceMappingURL=ProjectNav.js.map