//进度数据
var ProcessDataClass = /** @class */ (function () {
    function ProcessDataClass() {
        this.IsInit = false;
    }
    //数据初始化
    ProcessDataClass.prototype.Init = function (data) {
        var _this = this;
        this.IsInit = true;
        //初始化
        this.Project = data.Project;
        this.Project.ModeList = [];
        this.WorkMap = {};
        this.LinkMap = {};
        this.ModeMap = {};
        this.ScoreMap = {};
        this.LinkWorkMap = {};
        //过滤可用用户 key:UserSingle.Uid
        var checkUser = Data.DepartmentUserMap[ProjectNav.FilterDid];
        //过滤可用的link key:WorkSingle.Lid value:true
        var checkLink = {};
        //过滤可用流程 key:LinkSingle.Mid	value:true
        var checkMode = {};
        //是否需要过滤work
        var isFilterWork = ProcessFilter.Pack.WorkStatus.length > 0 || ProcessFilter.Pack.WorkFile.length > 0;
        //work过滤  通过判断的 会将work.Lid放入checkMode 没通过的则用`return true`跳过
        $.each(data.WorkList, function (k, work) {
            if (isFilterWork) {
                if (_this.CheckNumberArray(work.Status, ProcessFilter.Pack.WorkStatus) == false) {
                    return true;
                }
                //附件检查, filter要求有附件,但work却没有附件
                if (ProcessFilter.Pack.WorkFile.length > 0 && (!work.FileList || work.FileList.length == 0)) {
                    return true;
                }
            }
            checkLink[work.Lid] = true;
            return true;
        });
        //整理link列表
        var _linkDict = {};
        var _parentChildrenDict = {}; //key: ParentLid  item: children id 
        $.each(data.LinkList, function (k, link) {
            link.Children = [];
            _linkDict[link.Lid] = link;
            if (link.ParentLid) {
                if (!_parentChildrenDict[link.ParentLid]) {
                    _parentChildrenDict[link.ParentLid] = [];
                }
                _parentChildrenDict[link.ParentLid].push(link);
            }
        });
        //
        var _addLinkMap = function (link) {
            if (link.ParentLid) {
                var parentLink = _linkDict[link.ParentLid];
                if (!parentLink) {
                    //parent link 应该是被删除了,不是错误
                    // console.log("[error] can not find parentLink", link.ParentLid, ":[link.ParentLid]")
                }
                else {
                    _this.LinkMap[link.Lid] = link;
                    _this.LinkMap[link.ParentLid] = parentLink;
                    if (ArrayUtil.IndexOfAttr(parentLink.Children, FieldName.Lid, link.Lid) == -1) {
                        parentLink.Children.push(link);
                    }
                }
            }
            else {
                _this.LinkMap[link.Lid] = link;
                //children加进去
                var _children = _parentChildrenDict[link.Lid];
                if (_children) {
                    link.Children = [];
                    var len = _children.length;
                    for (var i = 0; i < len; i++) {
                        _this.LinkMap[_children[i].Lid] = _children[i];
                        link.Children.push(_children[i]);
                    }
                }
            }
        };
        //环节过滤  通过判断的 会将link.Mid放入checkMode 没通过的则用`return true`跳过
        $.each(data.LinkList, function (k, link) {
            //流程名查询
            if (_this.CheckStringArray(link.Name.toLowerCase(), ProcessFilter.Pack.LinkNameLower) == false) {
                return true;
            }
            //流程负责人查询
            if (_this.CheckStringArray(Data.GetUser(link.Uid).Name.toString(), ProcessFilter.Pack.LinkUserNameLower) == false) {
                return true;
            }
            //流程是否归档
            if (_this.CheckNumberArray(link.Status, ProcessFilter.Pack.LinkStatus) == false) {
                return true;
            }
            if (_this.CheckNumberArray(Data.GetUser(link.Uid).Did, ProcessFilter.Pack.LinkUserDid) == false) {
                return true;
            }
            //策划特例  策划仅显示自己部门负责的流程,因此要先checkUser再保存环节
            if (ProjectNav.FilterDid == DidField.DESIGN) {
                //用户检查			
                if (checkUser && !checkUser[link.Uid]) {
                    return true;
                }
                //环节保存
                if (isFilterWork) {
                    if (checkLink[link.Lid]) {
                        _addLinkMap(link);
                    }
                    else {
                        return true;
                    }
                }
                else {
                    _addLinkMap(link);
                }
            }
            else {
                //环节保存
                if (isFilterWork) {
                    if (checkLink[link.Lid]) {
                        _addLinkMap(link);
                    }
                    else {
                        return true;
                    }
                }
                else {
                    _addLinkMap(link);
                }
                //用户检查			
                if (checkUser && !checkUser[link.Uid]) {
                    return true;
                }
            }
            //过滤无效Link
            if (isFilterWork) { //没过滤work时就不要checkLink了, 因为checkLink仅包括了有work的link, 没有work的link会被弃掉
                if (!checkLink[link.Lid]) {
                    return true;
                }
            }
            //有效模块
            // if(!link.Children){
            // link.Children = []
            // }
            checkMode[link.Mid] = true;
            return true;
        });
        //模块过滤
        $.each(data.ModeList, function (k, mode) {
            //功能类型
            /*
            if(ProjectNav.FilterDid != DidValue.ALL && ProjectNav.FilterDid != v.Did){
                return true
            }
            */
            // if (ProjectNav.FilterDid == DidField.VERSION && DidField.VERSION != mode.Did) {//old
            if (ProjectNav.FilterDid == DidField.VERSION) { //改成显示有版本号的
                if (mode.Vid == 0) {
                    return true;
                }
            }
            if (ProjectNav.FilterDid == DidField.QA && DidField.QA != mode.Did) {
                return true;
            }
            //查看版本
            if (_this.CheckNumberArray(mode.Vid, ProcessFilter.Pack.Vid) == false) {
                return true;
            }
            //功能名查询
            if (_this.CheckStringArray(mode.Name.toLowerCase(), ProcessFilter.Pack.ModeNameLower) == false) {
                return true;
            }
            //是否归档
            if (_this.CheckNumberArray(mode.Status, ProcessFilter.Pack.ModeStatus) == false) {
                return true;
            }
            //过滤无效功能
            if (!checkMode[mode.Mid]) {
                return true;
            }
            mode.LinkList = [];
            _this.ModeMap[mode.Mid] = mode;
            _this.Project.ModeList.push(mode); //data.ModeList中的mode是服务器按照sort排序好的,所以这样加进来的也是正确的
            return true;
        });
        //把link放入mode.LinkList
        $.each(this.LinkMap, function (k, link) {
            if (link.ParentLid == 0) {
                var mode = _this.ModeMap[link.Mid];
                if (mode) {
                    mode.LinkList.push(link);
                }
            }
        });
        //排序LinkList
        $.each(this.ModeMap, function (k, mode) {
            mode.LinkList.sort(function (a, b) {
                if (a.Sort < b.Sort)
                    return -1;
                if (a.Sort > b.Sort)
                    return 1;
                return 0;
            });
            $.each(mode.LinkList, function (k, link) {
                if (link.Children) {
                    link.Children.sort(function (a, b) {
                        if (a.Sort < b.Sort)
                            return -1;
                        if (a.Sort > b.Sort)
                            return 1;
                        return 0;
                    });
                }
            });
        });
        //可用进度
        $.each(data.WorkList, function (k, work) {
            _this.WorkMap[work.Wid] = work;
            if (!_this.LinkWorkMap[work.Lid]) {
                _this.LinkWorkMap[work.Lid] = {};
            }
            _this.LinkWorkMap[work.Lid][work.Date] = work;
        });
        //评分
        $.each(data.ScoreList, function (k, v) {
            /*旧代码, 但没有score啊
             if(v.Score == 0){
                return true
            } */
            _this.ScoreMap[v.Wid] = v;
            return true;
        });
        //
        this.ParseVersionData(data.VersionList);
    };
    //处理版本数据
    ProcessDataClass.prototype.ParseVersionData = function (versionList) {
        var _this = this;
        if (versionList == null) {
            versionList = []; //没数据时 后端会传空数据过来
        }
        this.VersionList = [];
        this.VersionMap = {};
        this.VersionDateLineMap = {};
        //
        $.each(versionList, function (k, v) {
            _this.VersionList.push(v); //后端会直接用create_time排好序, 所以这里不再排序了
            _this.VersionMap[v.Vid] = v;
            if (!v.PublishList) {
                v.PublishList = [];
            }
            //补齐不足的genre数据
            {
                var _publishMap = {}; //key: genre
                v.PublishList.forEach(function (p) {
                    _publishMap[p.Genre] = p;
                });
                for (var genre = GenreField.BEGIN; genre <= GenreField.SUMMARY; genre++) {
                    var p;
                    p = _publishMap[genre];
                    if (!p) {
                        p = { Genre: genre, DateLine: '' };
                        v.PublishList.push(p);
                    }
                    else {
                        if (p.DateLine == '0000-00-00') {
                            p.DateLine = '';
                        }
                    }
                    p.Vid = v.Vid; //后端传来的都没有vid, 需要自己加上
                    p.ErrorMsg = '';
                    p.SubDayCount = 0;
                    if (p.DateLine) {
                        if (!_this.VersionDateLineMap[p.DateLine]) {
                            _this.VersionDateLineMap[p.DateLine] = [];
                        }
                        _this.VersionDateLineMap[p.DateLine].push(p);
                    }
                }
                v.PublishList.sort(function (a, b) {
                    if (a.Genre < b.Genre)
                        return -1;
                    if (a.Genre > b.Genre)
                        return 1;
                    return 0;
                });
            }
        });
    };
    ProcessDataClass.prototype.HasVersionDateLineMap = function (dateLine) {
        return this.VersionDateLineMap[dateLine] && this.VersionDateLineMap[dateLine].length > 0;
    };
    ProcessDataClass.prototype.DeleteVersionDateLineMap = function (pub) {
        if (this.HasVersionDateLineMap(pub.DateLine)) {
            var len = this.VersionDateLineMap[pub.DateLine].length;
            for (var i = 0; i < len; i++) {
                var p = this.VersionDateLineMap[pub.DateLine][i];
                if (p.Vid == pub.Vid && p.Genre == pub.Genre) {
                    this.VersionDateLineMap[pub.DateLine].splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * 检查 val 中是否符合 checkArr 的要求
     * @param val
     * @param checkArr:string[] 只要val包含其中一个值 就返回true
     */
    ProcessDataClass.prototype.CheckStringArray = function (val, checkArr) {
        if (checkArr.length == 0) {
            return true;
        }
        var len = checkArr.length;
        for (var i = 0; i < len; i++) {
            var check = checkArr[i];
            if (val.indexOf(check) > -1) {
                return true;
            }
        }
        return false;
    };
    ProcessDataClass.prototype.CheckNumberArray = function (val, checkArr) {
        if (checkArr.length == 0) {
            return true;
        }
        if (checkArr.indexOf(val) > -1) {
            return true;
        }
        return false;
    };
    return ProcessDataClass;
}());
var ProcessData = new ProcessDataClass();
//# sourceMappingURL=ProcessData.js.map