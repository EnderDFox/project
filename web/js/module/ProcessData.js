//进度数据
var ProcessDataClass = /** @class */ (function () {
    function ProcessDataClass() {
    }
    //数据初始化
    ProcessDataClass.prototype.Init = function (data) {
        var _this = this;
        //初始化
        this.Project = data.Project;
        this.WorkMap = {};
        this.LinkMap = {};
        this.ModeMap = {};
        this.ScoreMap = {};
        this.LinkWorkMap = {};
        //过滤可用流程 key:LinkSingle.Mid	item:LinkSingle
        var checkMode = {};
        //过滤可用用户 key:UserSingle.Uid
        var checkUser = Data.DepartmentUserMap[ProjectNav.FilterDid];
        //环节过滤
        $.each(data.LinkList, function (k, v) {
            //流程名查询
            if (v.Name.indexOf(ProcessFilter.Pack.LinkName) == -1) {
                return true;
            }
            //负责人查询
            if (Data.GetUser(v.Uid).Name.indexOf(ProcessFilter.Pack.LinkUserName) == -1) {
                return true;
            }
            //是否归档
            if (ProcessFilter.Pack.LinkStatus != -1 && v.Status != ProcessFilter.Pack.LinkStatus) {
                return true;
            }
            //策划特例
            if (ProjectNav.FilterDid == DidField.DESIGN) {
                //用户检查			
                if (checkUser && !checkUser[v.Uid]) {
                    return true;
                }
                //环节保存
                _this.LinkMap[v.Lid] = v;
            }
            else {
                //环节保存
                _this.LinkMap[v.Lid] = v;
                //用户检查			
                if (checkUser && !checkUser[v.Uid]) {
                    return true;
                }
            }
            //环节保存
            _this.LinkMap[v.Lid] = v;
            //用户检查			
            if (checkUser && !checkUser[v.Uid]) {
                return true;
            }
            //有效模块
            checkMode[v.Mid] = v.Mid;
            return true;
        });
        //模块过滤
        $.each(data.ModeList, function (k, v) {
            //功能类型
            /*
            if(ProjectNav.FilterDid != DidValue.ALL && ProjectNav.FilterDid != v.Did){
                return true
            }
            */
            //查看版本
            if (ProjectNav.FilterDid == DidField.VERSION && DidField.VERSION != v.Did) {
                return true;
            }
            if (ProjectNav.FilterDid == DidField.QA && DidField.QA != v.Did) {
                return true;
            }
            /* //版本号查询
            if (v.Ver.indexOf(ProcessFilter.Pack.Ver) == -1) {
                return true
            } */
            if (ProcessFilter.Pack.Vid && ProcessFilter.Pack.Vid != v.Vid) {
                return true;
            }
            //功能名查询
            if (v.Name.indexOf(ProcessFilter.Pack.ModeName) == -1) {
                return true;
            }
            //是否归档
            if (ProcessFilter.Pack.ModeStatus != -1 && v.Status != ProcessFilter.Pack.ModeStatus) {
                return true;
            }
            //过滤无效功能
            if (!checkMode[v.Mid]) {
                return true;
            }
            _this.ModeMap[v.Mid] = v;
            return true;
        });
        //进度
        $.each(data.WorkList, function (k, v) {
            _this.WorkMap[v.Wid] = v;
            if (!_this.LinkWorkMap[v.Lid]) {
                _this.LinkWorkMap[v.Lid] = {};
            }
            _this.LinkWorkMap[v.Lid][v.Date] = v;
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
                    if (p.DateLine) {
                        _this.VersionDateLineMap[p.DateLine] = p;
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
    return ProcessDataClass;
}());
var ProcessData = new ProcessDataClass();
//# sourceMappingURL=ProcessData.js.map