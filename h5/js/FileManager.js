var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    FileManager.prototype.onload = function () {
        $.get("/list", { currPath: "" }, this.onList.bind(this));
    };
    FileManager.prototype.onList = function (data) {
        var _this = this;
        console.log("[debug] onList => data:", data);
        if (this.vueAll == null) {
            this.vueAll = new Vue({
                data: {
                    msg: '',
                    error: '',
                    showRandom: true,
                    showChildren: true,
                    currPath: '',
                    canBackCurrPath: false,
                    randomItems: [],
                    childrenSelectedAll: true,
                    childItems: [],
                },
                methods: {
                    onBackCurrPath: function () {
                        var path = _this.vueAll.currPath.toString();
                        var pathArr = path.split('\\');
                        pathArr.pop();
                        $.get("list", { currPath: pathArr.join('\\') }, _this.onList.bind(_this), 'json');
                    },
                    onGo: function () {
                        $.get("list", { currPath: _this.vueAll.currPath }, _this.onList.bind(_this), 'json');
                    },
                    onRandomRefresh: function () {
                        $.get('getRandomFiles', { currPath: _this.vueAll.currPath.toString() }, function (data) {
                            _this.vueAll.randomItems = data.randomItems;
                        });
                    },
                    onRandomOpenFolder: function (e, item) {
                        $.get('openFolder', { folder: item.parent });
                    },
                    onRandomPlay: function (e, item) {
                        $.get('playFile', { fullname: _this.getFullname(item.parent, item.name) });
                    },
                    onChildrenSelectAll: function (e) {
                        _this.vueAll.childrenSelectedAll = !_this.vueAll.childrenSelectedAll;
                        var len = _this.vueAll.childItems.length;
                        for (var i = 0; i < len; i++) {
                            var item = _this.vueAll.childItems[i];
                            item.selected = _this.vueAll.childrenSelectedAll;
                        }
                    },
                    onChildrenItemSelect: function (e, item) {
                        item.selected = !item.selected;
                        //
                        var _selectAll = true;
                        var len = _this.vueAll.childItems.length;
                        for (var i = 0; i < len; i++) {
                            var item = _this.vueAll.childItems[i];
                            if (item.isDir == false && item.selected == false) {
                                _selectAll = item.selected;
                                break;
                            }
                        }
                        _this.vueAll.childrenSelectedAll = _selectAll;
                    },
                    onChildFilePlay: function (e, item) {
                        $.get('playFile', { fullname: _this.getFullname(item.parent, item.name) });
                    },
                    onChildFolderOpen: function (e, item) {
                        $.get('openFolder', { folder: item.isDir ? _this.getFullname(item.parent, item.name) : item.parent });
                    },
                    onChildFolderEnter: function (e, item) {
                        $.get("list", { currPath: _this.getFullname(item.parent, item.name) }, _this.onList.bind(_this), 'json');
                    },
                    onReset: this.onReset.bind(this),
                    onSubmit: this.onSubmit.bind(this),
                    onLower: this.onLower.bind(this),
                    onReplaceWithMiddleLine: this.onReplaceWithMiddleLine.bind(this),
                    onAddMiddleLine: this.onAddMiddleLine.bind(this),
                    onSwapSecond: this.onSwapSecond.bind(this),
                    onSwapFull: this.onSwapFull.bind(this),
                    onClick: function (e) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        console.log("[debug]", args);
                        switch (args[0]) {
                            case 1:
                                $.get("/get1", { a: "a1", b: "b1" }, function (data) { console.log("[debug] This is get1 success", data); });
                                break;
                            case 2:
                                $.post("/post1", { ac: "a2", bd: "b2" }, function (data) { console.log("[debug] This is post1 success", data); });
                                break;
                            default:
                                break;
                        }
                    },
                }
            }).$mount('#all');
        }
        //set data
        data.currPath = data.currPath.replace(/\//g, "\\");
        this.vueAll.msg = data.msg;
        this.vueAll.error = data.error;
        this.vueAll.currPath = data.currPath;
        this.vueAll.canBackCurrPath = data.currPath.indexOf('\\') > -1;
        this.vueAll.randomItems = data.randomItems;
        data.childItems.sort(function (a, b) {
            if (a.isDir && b.isDir == false) {
                return 1;
            }
            else if (a.isDir == false && b.isDir) {
                return -1;
            }
            return 0;
        });
        this.vueAll.childItems = data.childItems;
    };
    //===methods
    FileManager.prototype.onReset = function (e, item) {
        item.newName = item.name;
    };
    //找到所有selected的item并做些什么
    FileManager.prototype.forSelectedAll = function (next, e) {
        var len = this.vueAll.childItems.length;
        for (var i = 0; i < len; i++) {
            var item = this.vueAll.childItems[i];
            if (item.selected) {
                next(e, item);
            }
        }
    };
    FileManager.prototype.onSubmit = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onSubmit.bind(this), e);
            return;
        }
        if (item.name != item.newName) {
            $.get('rename', { fullname: this.getFullname(item.parent, item.name), newFullname: this.getFullname(item.parent, item.newName) }, function (newName) {
                item.name = item.newName;
            });
        }
    };
    FileManager.prototype.onLower = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onLower.bind(this), e);
            return;
        }
        item.newName = item.newName.toLowerCase();
    };
    FileManager.prototype.onReplaceWithMiddleLine = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onAddMiddleLine.bind(this), e);
            return;
        }
        var currName = item.newName.toString();
        currName = currName.replace(/[\s]+/g, '-');
        item.newName = currName;
    };
    FileManager.prototype.onAddMiddleLine = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onAddMiddleLine.bind(this), e);
            return;
        }
        var currName = item.newName.toString();
        currName = currName.replace(/\-/g, '');
        var reg = /[^0-9]+/g;
        var rs_unNum = reg.exec(currName);
        reg = /[0-9]+/g;
        var rs_num = reg.exec(currName);
        item.newName = (rs_unNum == undefined ? "" : rs_unNum) + "-" + (rs_num == undefined ? "" : rs_num);
    };
    FileManager.prototype.onSwapSecond = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onSwapSecond.bind(this), e);
            return;
        }
        var currName = item.newName.toString();
        var currNameSp = currName.split(/\-/g);
        if (currNameSp.length > 1) {
            var temp = currNameSp[1];
            currNameSp[1] = currNameSp[0];
            currNameSp[0] = temp;
            item.newName = currNameSp.join("-");
        }
    };
    FileManager.prototype.onSwapFull = function (e, item) {
        if (item == null) {
            this.forSelectedAll(this.onSwapFull.bind(this), e);
            return;
        }
        var currName = item.newName.toString();
        var currNameSp = currName.split(/\-/g);
        if (currNameSp.length > 1) {
            currNameSp.reverse();
            item.newName = currNameSp.join("-");
        }
    };
    FileManager.prototype.getFullname = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return path.resolve.apply(this, args);
    };
    return FileManager;
}());
var fileManager = new FileManager();
//# sourceMappingURL=FileManager.js.map