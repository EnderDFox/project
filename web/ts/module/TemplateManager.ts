/**编辑模板功能   例如 模板-功能   模板-流程 */
interface ITplModeSimple {
    Tmid: number
    Name: string
    Links: ITplLinkSimple[]
}
interface ITplLinkSimple {
    Tlid: number; Tmid: number; Did: number; Name: String
}
interface IDepartmentItem {
    Did: number
    Name: string
}
class TemplateManagerClass {
    AuePath: string = "template/" //模板所在目录
    DataModes: ITplModeSimple[]
    //初始化
    Init() {
        WSConn.sendMsg(C2L.C2L_TPL_MODE_VIEW, {})
    }
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_TPL_MODE_VIEW, this.L2C_ModeView)
        Commond.Register(L2C.L2C_TPL_MODE_ADD, this.L2C_ModeAdd)
        Commond.Register(L2C.L2C_TPL_MODE_EDIT_NAME, this.L2C_ModeEditName)
        Commond.Register(L2C.L2C_TPL_MODE_DELETE, this.L2C_ModeDelete)
        Commond.Register(L2C.L2C_TPL_LINK_ADD, this.L2C_LinkAdd)
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_NAME, this.L2C_LinkEditName)
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_DID, this.L2C_LinkEditDid)
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_SORT, this.L2C_LinkEditSort)
        Commond.Register(L2C.L2C_TPL_LINK_DELETE, this.L2C_LinkDelete)
    }
    L2C_ModeView(data) {
        if (!data.Modes) {
            data.Modes = [];
        }
        var len = data.Modes.length
        for (var i = 0; i < len; i++) {
            var mode = data.Modes[i];
            if (!mode.Links) {
                mode.Links = []
            } else {
                mode.Links = TemplateManager.SortLink(mode.LinkSort, mode.Links)
            }
            delete mode.LinkSort;
        }
        TemplateManager.DataModes = data.Modes;
    }
    L2C_ModeAdd(data) {
        var modes = TemplateManager.DataModes;
        modes.push({
            Tmid: data.Tmid,
            Name: data.Name,
            Links: []
        })
    }
    L2C_ModeEditName(data) {
        var modes = TemplateManager.DataModes;
        var index = ArrayUtil.IndexOfAttr(modes, "Tmid", data.Tmid);
        if (index > -1) {
            var mode = modes[index].Name = data.Name
        }
    }
    L2C_ModeDelete(data) {
        var modes = TemplateManager.DataModes;
        var index = ArrayUtil.IndexOfAttr(modes, "Tmid", data.Tmid);
        if (index > -1) {
            //先如果删除的是正在编辑的,则关闭编辑流程列表面板
            if (TemplateManager.vue_editTplModeDetail && TemplateManager.vue_editTplModeDetail.mode.Tmid == modes[index].Tmid) {
                TemplateManager.RemoveEditTplModeDetail()
            }
            //
            modes.splice(index, 1)
        }
    }
    L2C_LinkAdd(data) {
        var modes = TemplateManager.DataModes;
        var index = ArrayUtil.IndexOfAttr(modes, "Tmid", data.Tmid);
        if (index > -1) {
            var mode = modes[index]
            mode.Links.push(data)
        }
        if (mode.Links.length > 10) {
            //滚动条滚动到底
            Vue.nextTick(() => {
                var scrollee = $(TemplateManager.vue_editTplModeDetail.$el).find('ul')
                console.log("[debug]", scrollee, "<-`scrollee`");
                scrollee.scrollTop(scrollee[0].scrollHeight);
            })
        }
    }
    L2C_LinkEditName(data) {
        var modes = TemplateManager.DataModes
        var len = modes.length
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            var index = ArrayUtil.IndexOfAttr(mode.Links, 'Tlid', data.Tlid);
            if (index > -1) {
                mode.Links[index].Name = data.Name;
                break;
            }
        }
    }
    L2C_LinkEditDid(data) {
        var modes = TemplateManager.DataModes
        var len = modes.length
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            var index = ArrayUtil.IndexOfAttr(mode.Links, 'Tlid', data.Tlid);
            if (index > -1) {
                mode.Links[index].Did = data.Did;
                break;
            }
        }
    }
    //link排序变化   // data.Tlid,data.Kind:操作方式 1: 上移   0:下移动
    L2C_LinkEditSort(data) {
        var modes = TemplateManager.DataModes;
        var index = ArrayUtil.IndexOfAttr(modes, "Tmid", data.Tmid);
        if (index > -1) {
            var mode = modes[index];
            mode.Links = TemplateManager.SortLink(data.LinkSort, mode.Links)
        }
    }
    L2C_LinkDelete(data) {
        var modes = TemplateManager.DataModes
        var len = modes.length
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            var index = ArrayUtil.IndexOfAttr(mode.Links, 'Tlid', data.Tlid);
            if (index > -1) {
                mode.Links.splice(index, 1)
            }
        }
    }
    //根据mode.LinkSort 排序 Links
    SortLink(LinkSort, Links) {
        var LinksNew = []
        var len = LinkSort.length
        for (var i = 0; i < len; i++) {
            var tlid = LinkSort[i];
            if (tlid) {
                var index = ArrayUtil.IndexOfAttr(Links, 'Tlid', tlid)
                if (index > -1) {
                    LinksNew.push(Links[index])
                }
            }
        }
        return LinksNew
    }
    //通过Tlid获得对应的 tpl mode
    GetModeByTlid(tlid) {
        var modes = TemplateManager.DataModes
        var len = modes.length
        for (var i = 0; i < len; i++) {
            var mode = modes[i]
            var index = ArrayUtil.IndexOfAttr(mode.Links, 'Tlid', tlid)
            if (index > -1) {
                return mode
            }
        }
        return null;
    }
    //绑定到select选择器
    vue_tplSelect: CombinedVueInstance1<{ modes: ITplModeSimple[] }>
    BindTplSelect(domId: string) {
        if (TemplateManager.vue_tplSelect == null) {
            Loader.LoadVueTemplate(TemplateManager.AuePath + "TplModeSelect", function (txt) {
                TemplateManager.vue_tplSelect = new Vue({
                    el: domId,
                    template: txt,
                    data: {
                        modes: TemplateManager.DataModes
                    }
                })
            })
        }
    }
    //编辑 模板-功能列表
    vue_editTplModeList: CombinedVueInstance1<{ modes: ITplModeSimple[], showTmid: number }>
    ShowEditTplModeList(e) {
        ProcessPanel.HideMenu()
        //真正执行显示面板的函数
        var show = function () {
            var pageX, pageY
            var editMode = $('#editMode')
            if (editMode.is(":visible")) {
                pageX = editMode.x() + editMode.width() + 5
                pageY = editMode.y()
            }
            if (!pageX) {
                pageX = e.pageX
            }
            if (!pageY) {
                pageY = e.pageY
            }
            var plan = $(TemplateManager.vue_editTplModeList.$el).xy(pageX, pageY).show().adjust(-5)
            /*  var plan = $(TemplateManager.vue_editTplModeList.$el).css({
                 left: pageX,
                 top: pageY
             }).show().adjust(-5) */
            plan.find('.close').unbind().click(function () {
                plan.fadeOut(Config.FadeTime)
                TemplateManager.RemoveEditTplModeDetail()
                ProcessPanel.HideMenu()
            })
        }
        //判断是否需要初始化: 加载模板
        if (TemplateManager.vue_editTplModeList == null) {
            Loader.LoadVueTemplate(TemplateManager.AuePath + "EditTplModeList", function (txt) {
                TemplateManager.vue_editTplModeList = new Vue({
                    template: txt,
                    data: {
                        newName: "",
                        modes: TemplateManager.DataModes,
                        showTmid: 0,
                    },
                    methods: {
                        onAdd(e) {
                            var modes = this.modes;
                            var newName = this.newName.toString().trim()
                            /*  if (newName == "") {
                                 Common.AlertFloatMsg("名称不能为空", e)
                                 return;
                             } */
                            WSConn.sendMsg(C2L.C2L_TPL_MODE_ADD, {
                                Name: newName
                            })
                            this.newName = ""
                        },
                        onEditName(e, Tmid) {
                            var modes = this.modes
                            var index = ArrayUtil.IndexOfAttr(modes, "Tmid", Tmid);
                            if (index > -1) {
                                var mode = modes[index]
                                var newName = ($('#editTplModeList_' + Tmid + '_name').val() as string).trim();
                                if (newName == '' || newName == mode.Name.toString()) {
                                    // Common.AlertFloatMsg("请输入新的名称", e)
                                    //input恢复成旧名称
                                    var oldName = mode.Name.toString();
                                    mode.Name = "temp_-=-=-=-=-=-=-=-"; //输入和旧的一样,不会刷新,所以要先赋值一个不一样的
                                    mode.Name = oldName;
                                } else {
                                    WSConn.sendMsg(C2L.C2L_TPL_MODE_EDIT_NAME, {
                                        Tmid: mode.Tmid,
                                        Name: newName
                                    })
                                }
                            } else {
                                return;
                            }
                        },
                        onEdit: TemplateManager.ShowEditTplModeDetail.bind(TemplateManager),
                        onDel(e, Tmid) {
                            Common.Warning(this.$el, e, function () {
                                WSConn.sendMsg(C2L.C2L_TPL_MODE_DELETE, {
                                    Tmid: Tmid
                                })
                            }, '删除后不可恢复，确认删除吗？')
                        }
                    }
                }).$mount()
                $('#dynamicDom').before(TemplateManager.vue_editTplModeList.$el)
                show()
            })
        } else {
            show()
        }
    }
    //===编辑 模板-功能中的流程
    vue_editTplModeDetail: CombinedVueInstance1<{ mode: ITplModeSimple, newName: string, newDid: number }>
    RemoveEditTplModeDetail() {
        if (this.vue_editTplModeList) {
            this.vue_editTplModeList.showTmid = 0
        }
        if (TemplateManager.vue_editTplModeDetail) {
            // plan.fadeOut(Config.FadeTime)
            $(TemplateManager.vue_editTplModeDetail.$el).remove()
            TemplateManager.vue_editTplModeDetail = null
        }
    }
    //显示编辑模版-功能-流程列表
    ShowEditTplModeDetail(e, showTmid) {
        TemplateManager.RemoveEditTplModeDetail()
        ProcessPanel.HideMenu()
        var modes = TemplateManager.vue_editTplModeList.modes;
        var mode;
        var index = ArrayUtil.IndexOfAttr(modes, "Tmid", showTmid);
        if (index > -1) {
            mode = modes[index]
        } else {
            return;
        }
        //
        this.vue_editTplModeList.showTmid = showTmid
        //真正执行显示面板的函数
        var show = () => {
            //为了和功能列表面板高度相同
            var pageX, pageY
            var tplModeList = $(TemplateManager.vue_editTplModeList.$el)
            if (tplModeList.isShow()) {
                pageX = tplModeList.x() + tplModeList.width() + 5
                if (index > -1) {
                    var btnEdit = tplModeList.find('.btnEdit').get(index)//放到编辑按钮下面
                    if (btnEdit) {
                        pageY = tplModeList.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2
                    } else {
                        pageY = tplModeList.y()
                    }
                } else {
                    pageY = tplModeList.y()
                }
            }
            if (!pageX) {
                pageX = e.pageX
            }
            if (!pageY) {
                pageY = e.pageY
            }
            var plan = $(TemplateManager.vue_editTplModeDetail.$el).xy(pageX, pageY).show().adjust(-5)
            plan.find('.close').unbind().click(function () {
                TemplateManager.RemoveEditTplModeDetail()
                // ProcessPanel.HideMenu()
            })
            //设置当前mode数据  
            //不在这里设置了,因为Detail每次都创建新的,所以在new Vue时设置,这样可以避免面板出现时就触发过渡效果
            // TemplateManager.vue_editTplModeDetail.mode = mode
        }
        //判断是否需要初始化: 加载模板
        Loader.LoadVueTemplate(TemplateManager.AuePath + "EditTplModeDetail", function (txt) {
            //读取顶级部门保存为字典
            var departmentDict = {};
            var len = Data.DepartmentLoop.length
            for (var i = 0; i < len; i++) {
                var dinfo = Data.DepartmentLoop[i].info;
                departmentDict[dinfo.Did] = dinfo
            }
            //
            TemplateManager.vue_editTplModeDetail = new Vue({
                template: txt,
                methods: {
                    onAdd(e) {
                        var newName = this.newName.toString().trim()
                        /* if (newName == "") {
                            Common.AlertFloatMsg("名称不能为空", e)
                            return;
                        } */
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_ADD, {
                            Tmid: TemplateManager.vue_editTplModeDetail.mode.Tmid,
                            Name: newName,
                            Did: parseInt(this.newDid.toString())
                        });
                        this.newName = ""
                    },
                    onEditName(e, Tlid) {
                        var index = ArrayUtil.IndexOfAttr(this.mode.Links, "Tlid", Tlid)
                        if (index > -1) {
                            var link = this.mode.Links[index]
                            var newName = ($('#editTplModeDetail_' + Tlid + '_name').val() as string).trim();
                            if (newName == '' || newName == link.Name.toString()) {
                                //input恢复成旧名称
                                var oldName = link.Name.toString();
                                link.Name = "temp_sdiohfndaoif"; //输入和旧的一样,不会刷新,所以要先赋值一个不一样的
                                link.Name = oldName;
                            } else {
                                WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_NAME, {
                                    Tlid: link.Tlid,
                                    Name: newName,
                                });
                            }
                        } else {
                            return;
                        }
                    },
                    onChangeDid(e, Tlid) {
                        TemplateManager.ShowMenuDepartment(e, function (newDid) {
                            if (Tlid == -1) {//这是新建 里的部门选择
                                TemplateManager.vue_editTplModeDetail.newDid = newDid
                            } else {
                                var index = ArrayUtil.IndexOfAttr(TemplateManager.vue_editTplModeDetail.mode.Links, "Tlid", Tlid)
                                if (index > -1) { //第一个不需要上移了
                                    TemplateManager.vue_editTplModeDetail.mode.Links[index].Did = newDid
                                    WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_DID, {
                                        Tlid: TemplateManager.vue_editTplModeDetail.mode.Links[index].Tlid,
                                        Did: newDid,
                                    });
                                }
                            }
                        });
                    },
                    onSortUp(e, Tlid) {
                        var index = ArrayUtil.IndexOfAttr(this.mode.Links, "Tlid", Tlid)
                        /*  if (index == 0) { //第一个挪到最下面
                             this.mode.Links.push(this.mode.Links.shift())
                         } else if (index > 0) {
                             var linkUp = this.mode.Links[index - 1]
                             var linkDown = this.mode.Links[index]
                             this.mode.Links.splice(index - 1, 2, linkDown, linkUp)
                         } */
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_SORT, {
                            Tlid: TemplateManager.vue_editTplModeDetail.mode.Links[index].Tlid,
                            Kind: 1,
                        });
                    },
                    onSortDown(e, Tlid) {
                        var index = ArrayUtil.IndexOfAttr(this.mode.Links, "Tlid", Tlid)
                        /* if (index == this.mode.Links.length - 1) { //最后一个就挪到最上面
                            this.mode.Links.unshift(this.mode.Links.pop())
                        } else if (index > -1 && index < this.mode.Links.length - 1) {
                            var linkUp = this.mode.Links[index]
                            var linkDown = this.mode.Links[index + 1]
                            this.mode.Links.splice(index, 2, linkDown, linkUp)
                        } */
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_SORT, {
                            Tlid: TemplateManager.vue_editTplModeDetail.mode.Links[index].Tlid,
                            Kind: 0,
                        });
                    },
                    onDel(e, Tlid) {
                        Common.Warning(this.$el, e, function () {
                            WSConn.sendMsg(C2L.C2L_TPL_LINK_DELETE, {
                                Tlid: Tlid
                            });
                        }, '删除后不可恢复，确认删除吗？')
                    }
                },
                filters: {
                    didName(Did) {
                        /* if(departmentDict[Did]){
                            return departmentDict[Did].Name
                        }else{
                            return departmentDict[1].Name //管理员Did=0 不属于任何部门，先用策划的
                        }  */
                        //简写成
                        return (departmentDict[Did] || departmentDict[1]).Name  //管理员Did=0 不属于任何部门，先用策划的
                    }
                },
                data: {
                    newName: "",
                    newDid: User.Did,
                    mode: mode
                }
            }).$mount()
            $('#dynamicDom').before(TemplateManager.vue_editTplModeDetail.$el)
            show()
        })
    }
    //选择部门的菜单
    vue_menuDepartment: CombinedVueInstance1<{ departments: IDepartmentItem[] }>
    ShowMenuDepartment_callback: Function
    ShowMenuDepartment(e, callback) {
        ProcessPanel.HideMenu()
        TemplateManager.ShowMenuDepartment_callback = callback
        //真正执行显示面板的函数
        var show = function () {
            $('#dynamicDom').before(TemplateManager.vue_menuDepartment.$el)//为了显示到其它界面上层
            PopManager.CancelMouseOut(TemplateManager.vue_menuDepartment.$el)
            var plan = $(TemplateManager.vue_menuDepartment.$el).css({
                left: e.pageX,
                top: e.pageY
            }).show().adjust(-5)
            PopManager.RegisterMouseOut(TemplateManager.vue_menuDepartment.$el, function () {
                $(TemplateManager.vue_menuDepartment.$el).hide()
                PopManager.CancelMouseOut(TemplateManager.vue_menuDepartment.$el)
            })
        }
        //判断是否需要初始化: 加载模板
        if (TemplateManager.vue_menuDepartment == null) {
            Loader.LoadVueTemplate(TemplateManager.AuePath + "MenuDepartment", function (txt) {
                //读取部门保存为数组
                var departments: IDepartmentItem[] = [];
                var len = Data.DepartmentLoop.length
                for (var i = 0; i < len; i++) {
                    var dinfo = Data.DepartmentLoop[i].info;
                    departments.push({
                        Did: dinfo.Did,
                        Name: dinfo.Name
                    })
                }
                TemplateManager.vue_menuDepartment = new Vue({
                    template: txt,
                    methods: {
                        onClick(Did) {
                            if (TemplateManager.ShowMenuDepartment_callback) {
                                TemplateManager.ShowMenuDepartment_callback(parseInt(Did.toString()))
                            }
                            ProcessPanel.HideMenu()
                        }
                    },
                    data: {
                        departments: departments
                    }
                }).$mount()
                show()
            })
        } else {
            show()
        }
    }
    Hide() {
        $("#editTplModeList,#menuDepartment").hide()
        TemplateManager.RemoveEditTplModeDetail()
    }
}
var TemplateManager = new TemplateManagerClass()