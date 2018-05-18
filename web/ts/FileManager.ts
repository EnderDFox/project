class FileManager {
    constructor() {
    }
    vueAll: CombinedVueInstance1<IVueData>
    onload(): void {
        $.get("list", null, this.onList.bind(this))
    }
    onList(data: IVueData): void {
        console.log("[debug] onList => data:", data)
        if (this.vueAll == null) {
            this.vueAll = new Vue({
                data: {
                    showRandom: true,
                    showChildren: true,
                    currPath: '',
                    canBackCurrPath: false,
                    randomItems: [],
                    childrenSelectedAll: true,
                    childItems: [],
                },
                methods: {
                    onBackCurrPath: () => {
                        var path: string = this.vueAll.currPath.toString()
                        var pathArr = path.split('\\')
                        pathArr.pop()
                        $.get("list", { currPath: pathArr.join('\\') }, this.onList.bind(this), 'json')
                    },
                    onGo: () => {
                        $.get("list", { currPath: this.vueAll.currPath }, this.onList.bind(this), 'json')
                    },
                    onRandomRefresh: () => {
                        $.get('getRandomFiles', { currPath: this.vueAll.currPath.toString() }, (data: IVueData) => {
                            this.vueAll.randomItems = data.randomItems
                        });
                    },
                    onRandomOpenFolder: (e: Event, item: IRandomFile) => {
                        $.get('openFolder', { folder: item.parent });
                    },
                    onRandomPlay: (e: Event, item: IRandomFile) => {
                        $.get('playFile', { fullname: this.getFullname(item.parent, item.name) });
                    },
                    onChildrenSelectAll: (e: Event) => {
                        this.vueAll.childrenSelectedAll = !this.vueAll.childrenSelectedAll;
                        var len = this.vueAll.childItems.length
                        for (var i = 0; i < len; i++) {
                            var item = this.vueAll.childItems[i]
                            item.selected = this.vueAll.childrenSelectedAll
                        }
                    },
                    onChildrenItemSelect: (e: Event, item: IChildFile) => {
                        item.selected = !item.selected
                        //
                        var _selectAll: boolean = true
                        var len = this.vueAll.childItems.length
                        for (var i = 0; i < len; i++) {
                            var item = this.vueAll.childItems[i]
                            if (item.isDir == false && item.selected == false) {
                                _selectAll = item.selected
                                break;
                            }
                        }
                        this.vueAll.childrenSelectedAll = _selectAll
                    },
                    onChildFilePlay: (e: Event, item: IChildFile) => {
                        $.get('playFile', { fullname: this.getFullname(item.parent, item.name) });
                    },
                    onChildFolderOpen: (e: Event, item: IChildFile) => {
                        $.get('openFolder', { folder: item.isDir ? this.getFullname(item.parent, item.name) : item.parent });
                    },
                    onChildFolderEnter: (e: Event, item: IChildFile) => {
                        $.get("list", { currPath: this.getFullname(item.parent, item.name) }, this.onList.bind(this), 'json')
                    },
                    onReset: this.onReset.bind(this),
                    onSubmit: this.onSubmit.bind(this),
                    onLower: this.onLower.bind(this),
                    onReplaceWithMiddleLine: this.onReplaceWithMiddleLine.bind(this),
                    onAddMiddleLine: this.onAddMiddleLine.bind(this),
                    onSwapSecond: this.onSwapSecond.bind(this),
                    onSwapFull: this.onSwapFull.bind(this),
                    onClick: (e, ...args) => {
                        console.log("[debug]", args);
                        switch (args[0]) {
                            case 1:
                                $.get("/get1", { a: "a1", b: "b1" }, (data: any) => { console.log("[debug] This is get1 success", data) })
                                break;
                            case 2:
                                $.post("/post1", { ac: "a2", bd: "b2" }, (data: any) => { console.log("[debug] This is post1 success", data) })
                                break;
                            default:
                                break;
                        }
                    },
                }
            }).$mount('#all')
        }
        //set data
        data.currPath = data.currPath.replace(/\//g, `\\`)
        this.vueAll.currPath = data.currPath
        this.vueAll.canBackCurrPath = data.currPath.indexOf('\\') > -1
        this.vueAll.randomItems = data.randomItems
        data.childItems.sort((a: IChildFile, b: IChildFile): number => {
            if (a.isDir && b.isDir == false) {
                return 1
            } else if (a.isDir == false && b.isDir) {
                return -1
            }
            return 0
        })
        this.vueAll.childItems = data.childItems
    }
    //===methods
    onReset(e: Event, item: IChildFile) {
        item.newName = item.name
    }
    //找到所有selected的item并做些什么
    forSelectedAll(next: Function, e: Event) {
        var len = this.vueAll.childItems.length
        for (var i = 0; i < len; i++) {
            var item = this.vueAll.childItems[i]
            if (item.selected) {
                next(e, item)
            }
        }
    }
    onSubmit(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onSubmit.bind(this), e)
            return;
        }
        if (item.name != item.newName) {
            $.get('rename', { fullname: this.getFullname(item.parent, item.name), newFullname: this.getFullname(item.parent, item.newName) }, (newName: string) => {
                item.name = item.newName
            })
        }
    }
    onLower(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onLower.bind(this), e)
            return;
        }
        item.newName = item.newName.toLowerCase()
    }
    onReplaceWithMiddleLine(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onAddMiddleLine.bind(this), e)
            return;
        }
        var currName = item.newName.toString()
        currName = currName.replace(/[\s]+/g, '-')
        item.newName = currName;
    }
    onAddMiddleLine(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onAddMiddleLine.bind(this), e)
            return;
        }
        var currName = item.newName.toString()
        currName = currName.replace(/\-/g, '')
        var reg = /[^0-9]+/g;
        var rs_unNum = reg.exec(currName);
        reg = /[0-9]+/g;
        var rs_num = reg.exec(currName);
        item.newName = (rs_unNum == undefined ? "" : rs_unNum) + "-" + (rs_num == undefined ? "" : rs_num);
    }
    onSwapSecond(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onSwapSecond.bind(this), e)
            return;
        }
        var currName = item.newName.toString()
        var currNameSp = currName.split(/\-/g);
        if (currNameSp.length > 1) {
            var temp = currNameSp[1];
            currNameSp[1] = currNameSp[0];
            currNameSp[0] = temp;
            item.newName = currNameSp.join("-");
        }
    }
    onSwapFull(e: Event, item: IChildFile) {
        if (item == null) {
            this.forSelectedAll(this.onSwapFull.bind(this), e)
            return;
        }
        var currName = item.newName.toString()
        var currNameSp = currName.split(/\-/g);
        if (currNameSp.length > 1) {
            currNameSp.reverse()
            item.newName = currNameSp.join("-");
        }
    }
    getFullname(...args:string[]):string {
        return path.resolve.apply(this, args)
    }
}

var fileManager = new FileManager()
