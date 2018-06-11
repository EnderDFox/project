/**弹出层的管理器*/
class PopManagerClass {
    mouseOutList: { selector: any, callback: Function }[] = [];
    Init() {
        $(document).on('click', (e:JQuery.Event) => {
            var len = this.mouseOutList.length
            for (var i = 0; i < len; i++) {
                var item = this.mouseOutList[i];
                if ($(e.target).closest(item.selector).length == 0) {
                    item.callback()
                }
            }
        })
    }
    /**注册外部点击事件*/
    RegisterMouseOut(selector, callback) {
        var oldIndxe = ArrayUtil.IndexOfAttr(this.mouseOutList, "selector", selector)
        if (oldIndxe == -1) {
            //延迟一下 避免刚取消就加进来了,因为冒泡会导致这里重复调用
            setTimeout(() => {
                this.mouseOutList.push({ "selector": selector, "callback": callback })
            }, 1);
        }
    }
    /**注销外部点击事件*/
    CancelMouseOut(selector) {
        var oldIndxe = ArrayUtil.IndexOfAttr(this.mouseOutList, "selector", selector)
        if (oldIndxe > -1) {
            this.mouseOutList.splice(oldIndxe, 1)
        }
    }
}
/**弹出层的管理器 实例*/
var PopManager = new PopManagerClass()