//弹出层的管理器
var PopManagerClass = /** @class */ (function () {
    function PopManagerClass() {
        this.mouseOutList = [];
    }
    PopManagerClass.prototype.Init = function () {
        var _this = this;
        $(document).on('click', function (e) {
            var len = _this.mouseOutList.length;
            for (var i = 0; i < len; i++) {
                var item = _this.mouseOutList[i];
                if ($(e.target).closest(item.selector).length == 0) {
                    item.callback();
                }
            }
        });
    };
    //注册外部点击事件
    PopManagerClass.prototype.RegisterMouseOut = function (selector, callback) {
        var _this = this;
        var oldIndxe = ArrayUtil.IndexOfAttr(this.mouseOutList, "selector", selector);
        if (oldIndxe == -1) {
            //延迟一下 避免刚取消就加进来了,因为冒泡会导致这里重复调用
            setTimeout(function () {
                _this.mouseOutList.push({ "selector": selector, "callback": callback });
            }, 1);
        }
    };
    //注销外部点击事件
    PopManagerClass.prototype.CancelMouseOut = function (selector) {
        var oldIndxe = ArrayUtil.IndexOfAttr(this.mouseOutList, "selector", selector);
        if (oldIndxe > -1) {
            this.mouseOutList.splice(oldIndxe, 1);
        }
    };
    return PopManagerClass;
}());
var PopManager = new PopManagerClass();
//# sourceMappingURL=PopManager.js.map