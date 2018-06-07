//项目导航
class ProjectNavClass {
    //过滤器
    FilterDid: DidField = 0
    //菜单选择
    NavMenu = 1
    //初始化
    Init() {
        //筛选器
        ProcessFilter.Init()
        CollateFilter.Init()
        //初始化
        ProcessPanel.Init()
        VersionManager.Init()
        TemplateManager.Init()
        //初始化
        CollatePanel.Init()
        //绑定事件
        this.BindActions()

        UploadManager.Init()
    }
    //绑定事件
    BindActions() {
        var plan = $('#projectNav')
        //子菜单事件
        plan.find('.body').delegate('li', 'click', (e: JQuery.Event): boolean => {
            ProcessPanel.HideMenu()
            if ($(e.currentTarget).hasClass('on')) {//当前正选中的li,再次点击不处理
                return false
            }
            plan.find('.body li').removeClass()
            var did = $(e.currentTarget).addClass('on').attr('did')
            this.FilterDid = parseInt(did)
            //ProcessFilter.ResetPack()
            //ProcessPanel.Index()
            Main.Over(function () {
                ProcessPanel.Index()
            })
            return true
        })
        //父菜单事件
        plan.find('.head').delegate('li', 'click', (e: JQuery.Event): boolean => {
            ProcessPanel.HideMenu()
            this.HideMenu()
            if ($(e.currentTarget).hasClass('on')) {
                return false
            }
            plan.find('.head li').removeClass()
            $(e.currentTarget).addClass('on')
            var type = $(e.currentTarget).attr('type')
            switch (type) {
                case 'ProfilePanel':
                    this.ProfilePanelShow()
                    break
                case 'ProcessPanel':
                    this.ProcessPanelShow()
                    break
                case 'CollatePanel':
                    this.CollatePanelShow()
                    break
            }
            return true
        }).find('li:eq(' + this.NavMenu + ')').click()
        //筛选
        $('#projectSer').click((e: JQuery.Event) => {
            switch (this.NavMenu) {
                case 1:
                    ProcessPanel.HideMenu()
                    ProcessFilter.ShowFilter(e.currentTarget, e)
                    break
                case 2:
                    CollatePanel.HideMenu()
                    CollateFilter.ShowFilter(e.currentTarget, e)
                    break
            }
        })
        //保存
        $('#saveFile').click((e: JQuery.Event) => {
            switch (this.NavMenu) {
                case 0:
                    break
                case 1:
                    break
                case 2:
                    Main.Over(function () {
                        WSConn.sendMsg(C2L.C2L_SAVE_COLLATE, CollateFilter.Pack)
                    })
                    break
            }
        })
        plan.find(".tpl_edit").click((e: JQuery.Event) => {
            TemplateManager.ShowEditTplModeList(e)
        })
        //信息提示
        NoticePanel.BindActions()
    }
    //个人主页
    ProfilePanelShow() {
        var plan = $('#projectNav')
        Main.Over(function () {
            ProfilePanel.Index()
        })
        $('#saveFile,#projectSer').hide()
        plan.find(".tpl_edit").hide()
        this.NavMenu = 0
    }
    //进度面板
    ProcessPanelShow() {
        var plan = $('#projectNav')
        Main.Over(function () {
            ProcessPanel.Index()
        })
        plan.find('.body li').removeClass().filter('[did="' + this.FilterDid + '"]').addClass('on')
        plan.find('.menu').show()
        $('#projectSer').show()
        $('#saveFile').hide()
        // plan.find(".tpl_edit").show()//暂时不需要这个入口
        plan.find(".tpl_edit").hide()
        this.NavMenu = 1
        if (Loader.isDebug) {
            plan.find('.test_fox').show().on('click', function (e) {
                // UploadManager.ShowUploadWork(e.currentTarget,101)
            })
        }
    }
    //晨会面板
    CollatePanelShow() {
        var plan = $('#projectNav')
        Main.Over(function () {
            CollatePanel.Index()
        })
        plan.find('.menu').hide()
        $('#saveFile,#projectSer').show()
        plan.find(".tpl_edit").hide()
        this.NavMenu = 2
    }
    //关闭菜单
    HideMenu() {
        $('#workFilter,#extraNotice').hide()
        ProcessFilter.HideFilter(false)
        Common.HidePullDownMenu()
    }
}

var ProjectNav = new ProjectNavClass()