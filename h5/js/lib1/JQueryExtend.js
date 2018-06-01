//扩展类
$.fn.extend({
    //获取css left 数字值
    x: function (vx) {
        if (vx == undefined || vx == null) {
            return this.position().left;
        }
        else {
            this.css('left', vx + "px");
            return this;
        }
    },
    y: function (vy) {
        if (vy == undefined || vy == null) {
            return this.position().top;
        }
        else {
            this.css('top', vy + "px");
            return this;
        }
    },
    xy: function (vx, vy) {
        if (vx == undefined || vx == null) {
            return { x: this.position().left, y: this.position().top };
        }
        else {
            this.css({ 'left': vx + 'px', 'top': vy + 'px' });
            return this;
        }
    },
    w: function (vw) {
        if (vw == undefined || vw == null) {
            return this.width();
        }
        else {
            return this.width(vw);
        }
    },
    h: function (vh) {
        if (vh == undefined || vh == null) {
            return this.height();
        }
        else {
            return this.height(vh);
        }
    },
    wh: function (vw, vh) {
        if (vw == undefined || vw == null) {
            return { x: this.width(), y: this.height() };
        }
        else {
            return this.width(vw).height(vh);
        }
    },
    isShow: function () {
        return this.is(":visible");
    },
    isVisible: function () {
        return this.is(":visible");
    },
    //修正位置
    adjust: function (number) {
        var eleW = this.outerWidth();
        var eleH = this.outerHeight();
        var maxL = this.offset().left + eleW;
        var maxT = this.offset().top + eleH;
        var winL = $(window).innerWidth() + $(window).scrollLeft();
        var winH = $(window).innerHeight() + $(window).scrollTop();
        if (maxL > winL) {
            var left = Math.min(maxL, winL) - eleW + number;
            this.css({ 'left': left });
        }
        if (maxT > winH) {
            var top = Math.min(maxT, winH) - eleH + number;
            this.css({ 'top': top });
        }
        return this;
    },
    //冻结窗口
    freezeTop: function () {
        //Fixed issue #按住shift滚动鼠标,会横向滚动表格,但标题(freezeTop)没有跟着滚动
        //注意:shift+鼠标滚动  仅chrome内核是横向滚动 ,其它浏览器都是翻页,
        //scroll事件太频繁,导致IE浏览器下很卡,chrome本身性能高,不卡但也有性能隐患, 所以需要setTimeout来处理
        //------
        var $dom = this;
        var win = $(window);
        //方案三
        var timeoutId = -1;
        var prevScrollX = win.scrollLeft();
        var resetFixed = function () {
            $dom.css({
                position: 'fixed',
                'left': -win.scrollLeft(),
                'top': 0
            });
        };
        win.unbind().scroll(function (e) {
            var currScrollX = win.scrollLeft();
            if (currScrollX != prevScrollX) {
                $dom.css({
                    'position': 'absolute',
                    'left': 0,
                    'top': win.scrollTop()
                });
                if (timeoutId >= 0) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(resetFixed, 1000);
            }
            else {
                if (timeoutId >= 0) {
                    clearTimeout(timeoutId);
                    timeoutId = -1;
                    resetFixed();
                }
            }
            prevScrollX = currScrollX;
        }).resize(function () {
            $dom.css({ 'left': -$(win).scrollLeft() });
        });
        //------
        ///*方案二 IE下拖动时反映不及时,感觉很不舒服,所以IE最好仍然用mousedown来做,判断IE比较麻烦,先不改了
        /*var timeoutId = -1
        $(window).unbind().scroll(function (e) {
            if (timeoutId > 0) {
                clearTimeout(timeoutId)
            }
            var timeoutId = setTimeout(function () {
                //window窗口滚动
                var left = -$(this).scrollLeft()
                // console.log("left:",left)
                $dom.css({'left': -$(this).scrollLeft()})
            }, 25)
        })*/
        //方案一
        /*$(window).unbind().mousedown(function(e){
            //检查
            if(e.target != document && e.target.localName != 'html'){
                return true
            }
            //上下滑块
            if(e.clientX > $(this).innerWidth()){

            }
            //左右滑块
            if(e.clientY + 10 > $(this).innerHeight()){
                $dom.css({'position':'absolute','left':0,'top':$(this).scrollTop()})
                $(this).mouseup(function(){
                    $dom.css({'position':'fixed','left':-$(this).scrollLeft(),'top':0})
                    $(this).unbind('mouseup')
                })
            }

        })*/
        /*  $(window).resize(function(){
             $dom.css({'left':-$(this).scrollLeft()})
         }) */
    }
});
//# sourceMappingURL=JQueryExtend.js.map