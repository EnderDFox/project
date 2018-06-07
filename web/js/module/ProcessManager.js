//进度管理
var ProcessManagerClass = /** @class */ (function () {
    function ProcessManagerClass() {
    }
    //注册函数
    ProcessManagerClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_PROCESS_VIEW, this.View.bind(this));
        Commond.Register(L2C.L2C_PROCESS_GRID_CHANGE, this.GridChange.bind(this));
        Commond.Register(L2C.L2C_PROCESS_GRID_CLEAR, this.GridClear.bind(this));
        Commond.Register(L2C.L2C_PROCESS_USER_CHANGE, this.UserChange.bind(this));
        Commond.Register(L2C.L2C_PROCESS_GRID_SWAP, this.GridSwap.bind(this));
        Commond.Register(L2C.L2C_PROCESS_GRID_ADD, this.GridAdd.bind(this));
        Commond.Register(L2C.L2C_PROCESS_LINK_DELETE, this.LinkDelete.bind(this));
        Commond.Register(L2C.L2C_PROCESS_LINK_EDIT, this.LinkEdit.bind(this));
        Commond.Register(L2C.L2C_PROCESS_WORK_EDIT, this.WorkEdit.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_EDIT, this.ModeEdit.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_ADD, this.ModeAdd.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_DELETE, this.ModeDelete.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_COLOR, this.ModeColor.bind(this));
        Commond.Register(L2C.L2C_PROCESS_LINK_COLOR, this.LinkColor.bind(this));
        Commond.Register(L2C.L2C_PROCESS_SCORE_EDIT, this.ScoreEdit.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_MOVE, this.ModeMove.bind(this));
        Commond.Register(L2C.L2C_PROCESS_MODE_STORE, this.ModeStore.bind(this));
        Commond.Register(L2C.L2C_PROCESS_LINK_STORE, this.LinkStore.bind(this));
        Commond.Register(L2C.L2C_PROCESS_PUBLISH_EDIT, this.PublishEdit.bind(this));
        Commond.Register(L2C.L2C_PROCESS_PUBLISH_DELETE, this.PublishDelete.bind(this));
    };
    //预览
    ProcessManagerClass.prototype.View = function (data) {
        ProcessData.Init(data);
        ProcessPanel.SetDateRange();
        ProcessPanel.CreateProcess();
        ProcessPanel.BindActions();
    };
    //改变工作
    ProcessManagerClass.prototype.GridChange = function (data) {
        this.WorkEdit(data);
        /*
        //数据变化
        ProcessData.WorkMap[data.Wid] = data
        $('#content tr[lid="'+data.Lid+'"] td').each(function(){
            var grid = $(this).data('grid')
            if(!grid){
                return true
            }
            if(data.Date == grid.s){
                $(this).removeClass().addClass('ss_'+data.Status)
                grid.wid = data.Wid
                return false
            }
        })
        */
    };
    //清空工作
    ProcessManagerClass.prototype.GridClear = function (data) {
        var work = ProcessData.WorkMap[data.Wid];
        $('#content tr[lid="' + work.Lid + '"] td').each(function (index, el) {
            var grid = $(el).data('grid');
            if (!grid) {
                return;
            }
            if (work.Date == grid.s) {
                $(el).removeClass().empty();
                if (grid.w >= 6) {
                    $(el).addClass('weekend');
                }
                grid.wid = 0;
                return false;
            }
            return;
        });
        //数据变化
        delete ProcessData.WorkMap[data.Wid];
    };
    //改变责任
    ProcessManagerClass.prototype.UserChange = function (data) {
        //数据变化
        ProcessData.LinkMap[data.Lid] = data;
        $('#content tr[lid="' + data.Lid + '"] td:eq(1)').html(Data.GetUser(data.Uid).Name);
    };
    //交换流程
    ProcessManagerClass.prototype.GridSwap = function (data) {
        //数据变化
        ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle;
        var A = $('#content tr[lid="' + data.Swap[0] + '"]');
        var B = $('#content tr[lid="' + data.Swap[1] + '"]');
        if (data.Dir == 'before') {
            A.before(B);
        }
        else {
            A.after(B);
        }
    };
    //新增流程
    ProcessManagerClass.prototype.GridAdd = function (data) {
        //数据变化
        ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle;
        ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle;
        var add = $(ProcessPanel.GetLinkHtml(data.LinkSingle.Lid));
        $('#content tr[lid="' + data.Lid + '"]').after(add);
        //绑定数据
        ProcessPanel.SetLinkData(data.LinkSingle.Lid, add.get(0));
    };
    //删除流程
    ProcessManagerClass.prototype.LinkDelete = function (data) {
        //数据变化
        ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle;
        delete ProcessData.LinkMap[data.Lid];
        $('#content tr[lid="' + data.Lid + '"]').remove();
    };
    //流程名字
    ProcessManagerClass.prototype.LinkEdit = function (data) {
        //数据变化
        ProcessData.LinkMap[data.Lid] = data;
        $('#content tr[lid="' + data.Lid + '"] .link').attr('class', 'link bg_' + data.Color).html(data.Name == '' ? '空' : data.Name);
    };
    //工作补充
    ProcessManagerClass.prototype.WorkEdit = function (data) {
        //数据变化
        ProcessData.WorkMap[data.Wid] = data;
        $('#content tr[lid="' + data.Lid + '"] td').each(function (index, el) {
            var grid = $(el).data('grid');
            if (!grid) {
                return;
            }
            if (data.Date == grid.s) {
                grid.wid = data.Wid;
                ProcessPanel.ShowWorkGrid(el, grid, data);
                return false;
            }
            return;
        });
    };
    //编辑功能
    ProcessManagerClass.prototype.ModeEdit = function (data) {
        //数据变化
        ProcessData.ModeMap[data.Mid] = data;
        $('#content .mode[mid="' + data.Mid + '"]').html(VersionManager.GetVersionVer(data.Vid) + (data.Name == '' ? '空' : data.Name));
    };
    //添加功能
    ProcessManagerClass.prototype.ModeAdd = function (data) {
        //数据变化
        ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle;
        // ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle
        var len = data.LinkList.length;
        for (var i = 0; i < len; i++) {
            var link = data.LinkList[i];
            ProcessData.LinkMap[link.Lid] = link;
        }
        var add = $(ProcessPanel.GetModeHtml(data.ModeSingle.Mid));
        $('#content .mode[mid="' + data.Mid + '"]').parent().next().after(add);
        //绑定流程数据
        add.find('.linkMap tr').each(function () {
            var lid = parseInt($(this).attr('lid'));
            ProcessPanel.SetLinkData(lid, this);
        });
        ProcessPanel.BindActions();
    };
    //删除功能
    ProcessManagerClass.prototype.ModeDelete = function (data) {
        //数据变化
        ProcessData.Project = data.ProjectSingle;
        var mode = ProcessData.ModeMap[data.Mid];
        if (!mode) {
            return;
        }
        $.each(mode.LinkSort, function (k, lidStr) {
            var lid = parseInt(lidStr);
            //删除工作
            $.each(ProcessData.WorkMap, function (k, v) {
                if (v.Lid != lid) {
                    return;
                }
                delete ProcessData.WorkMap[v.Wid];
            });
            //删除流程
            delete ProcessData.LinkMap[lid];
        });
        //删除功能
        delete ProcessData.ModeMap[data.Mid];
        var del = $('#content .mode[mid="' + data.Mid + '"]').parent();
        del.next().remove();
        del.remove();
    };
    //功能颜色
    ProcessManagerClass.prototype.ModeColor = function (data) {
        //数据变化
        ProcessData.ModeMap[data.Mid] = data;
        $('#content .mode[mid="' + data.Mid + '"]').removeClass().addClass('mode bg_' + data.Color);
    };
    //流程颜色
    ProcessManagerClass.prototype.LinkColor = function (data) {
        //数据变化
        ProcessData.LinkMap[data.Lid] = data;
        $('#content tr[lid="' + data.Lid + '"] .link').attr('class', 'link bg_' + data.Color).html(data.Name == '' ? '空' : data.Name);
    };
    //设置评分
    ProcessManagerClass.prototype.ScoreEdit = function (data) {
        //数据变化
        if (data.Score == 0) {
            delete ProcessData.ScoreMap[data.Wid];
        }
        else {
            ProcessData.ScoreMap[data.Wid] = data;
        }
        var work = ProcessData.WorkMap[data.Wid];
        this.WorkEdit(work);
        NoticeManager.ScoreEdit(data);
    };
    //功能交换
    ProcessManagerClass.prototype.ModeMove = function (data) {
        //数据变化
        ProcessData.Project = data.ProjectSingle;
        var A = $('#content .mode[mid="' + data.Swap[0] + '"]').parent();
        if (A.length == 0) {
            return false;
        }
        var AN = A.next();
        var B = $('#content .mode[mid="' + data.Swap[1] + '"]').parent();
        if (B.length == 0) {
            return false;
        }
        var BN = B.next();
        if (data.Dir == 'before') {
            A.before(B);
            A.before(AN);
        }
        else {
            A.after(B);
            B.before(BN);
        }
        return true;
    };
    //归档处理
    ProcessManagerClass.prototype.ModeStore = function (data) {
        //在进行状态中
        if (ProcessFilter.Pack.ModeStatus.length == 0) {
            var mode = ProcessData.ModeMap[data.Mid];
            $.each(mode.LinkSort, function (k, lidStr) {
                var lid = parseInt(lidStr);
                //删除工作
                $.each(ProcessData.WorkMap, function (k, v) {
                    if (v.Lid != lid) {
                        return;
                    }
                    delete ProcessData.WorkMap[v.Wid];
                });
                //删除流程
                delete ProcessData.LinkMap[lid];
            });
            delete ProcessData.ModeMap[data.Mid];
            var del = $('#content .mode[mid="' + data.Mid + '"]').parent();
            del.next().remove();
            del.remove();
        }
    };
    //归档处理
    ProcessManagerClass.prototype.LinkStore = function (data) {
        //在进行状态中
        if (ProcessFilter.Pack.LinkStatus.length == 0) {
            //数据变化
            delete ProcessData.LinkMap[data.Lid];
            $('#content tr[lid="' + data.Lid + '"]').remove();
        }
    };
    /**
     * @data PublishSingle
     */
    ProcessManagerClass.prototype.PublishEdit = function (data) {
        $.each(ProcessPanel.DateList.list, function (k, v) {
            if (data.DateLine != v.s) {
                return true;
            }
            var pub = $('#content .title td:eq(' + (k + 3) + ')');
            pub.find('.stroke').remove();
            pub.append('<div class="stroke sk_' + data.Genre + '" date_line="' + data.DateLine + '"></div>');
            return false;
        });
        //数据变化
        // ProcessData.VersionDateLineMap[data.DateLine] = data		//VersionManager中设置了 这里不需要了
    };
    /**
     * @dateLine PublishSingle.DateLine
     */
    ProcessManagerClass.prototype.PublishDelete = function (dateLine) {
        $.each(ProcessPanel.DateList.list, function (k, v) {
            if (dateLine != v.s) {
                return true;
            }
            $('#content .title td:eq(' + (k + 3) + ')').find('.stroke').remove();
            return false;
        });
        //数据变化
        // delete ProcessData.VersionDateLineMap[data.DateLine]
    };
    return ProcessManagerClass;
}());
var ProcessManager = new ProcessManagerClass();
//# sourceMappingURL=ProcessManager.js.map