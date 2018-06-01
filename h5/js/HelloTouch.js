var HelloTouch = /** @class */ (function () {
    function HelloTouch() {
        this.pList = [];
    }
    HelloTouch.prototype.init = function () {
        var _this = this;
        Common.preventDragDefault();
        //
        this.$div1 = $('#div1');
        // this.$div1.width(100).height(100)
        this.logTxt = document.getElementById('logTxt');
        //
        for (var i = 0; i < 3; i++) {
            var p = $('#p' + i);
            this.pList.push(p);
            // p.xy(100*i+160,80*i+120)
        }
        //
        var el = $('#div1').get(0);
        //
        var p0;
        var p1;
        var onStart = function (e) {
            p0 = Common.NewXY(e.touches[0].screenX, e.touches[0].screenY);
            p1 = Common.NewXY(e.touches[1].screenX, e.touches[1].screenY);
            _this.log("[info]onStart:", p0.x, p0.y, p1.x, p1.y);
            // this.log("[info]", "onStart")
            // this.pList[0].xy(x, y)
            if (Common.IsPC()) {
                document.onmousemove = function (e) {
                    e.preventDefault();
                    // onMove(e.clientX, e.clientY)
                };
                document.onmouseup = onEnd;
            }
            else {
                document.ontouchmove = function (e) {
                    onMove(e);
                    // this.log("ontouchmove", e.touches.length, ":[e.touches.length]")
                    // e.preventDefault()
                    // this.refreshPoisByTouchEvent(e)
                    /* if (e.touches.length == 1) {
                        onMove(e.touches[0].clientX, e.touches[0].clientY)
                    } else {
                        onCancel()
                    } */
                };
                document.ontouchend = onEnd;
            }
        };
        //
        // 
        var onMove = function (e) {
            // this.log("[info]","onMove")
            _this.refreshPoisByTouchEvent(e);
            var d = MathUtil.distance(p0, p1);
            var cp0 = Common.NewXY(e.touches[0].screenX, e.touches[0].screenY);
            var cp1 = Common.NewXY(e.touches[1].screenX, e.touches[1].screenY);
            var cd = MathUtil.distance(cp0, cp1);
            var gapX = Math.abs(cp1.x - cp0.x) - Math.abs(p1.x - p0.x);
            var gapY = Math.abs(cp1.y - cp0.y) - Math.abs(p1.y - p0.y);
            _this.log("move", gapX, ":[gapX]", gapY, ":[gapY]");
            _this.$div1.width(_this.$div1.width() + gapX).height(_this.$div1.height() + gapY);
            // this.log("move:", cd - d, cp0.x, cp0.y, cp1.x, cp1.y)
            p0 = cp0;
            p1 = cp1;
            return;
            var oldW = _this.$div1.width();
            var newW = oldW + (cd - d) / 10;
            newW = Math.max(newW, 100);
            _this.$div1.width(newW).height(_this.$div1.height() * (newW / oldW));
        };
        var onCancel = function (e) {
            if (e === void 0) { e = null; }
            // this.log("onCancel")
            if (Common.IsPC()) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
            else {
                document.ontouchmove = null;
                document.ontouchend = null;
            }
        };
        var onEnd = function (e) {
            if (e === void 0) { e = null; }
            // e.preventDefault()
            onCancel(e);
        };
        this.log("[info]", Common.IsPC(), ":[Common.IsPC()]");
        if (Common.IsPC()) {
            el.onmousedown = function (e) {
                e.preventDefault();
                _this.log("[info]", e);
                // onStart(e.clientX, e.clientY)
            };
        }
        else {
            el.ontouchstart = function (e) {
                e.preventDefault();
                // this.log("ontouchstart: ", e.touches.length, ":[e.touches.length]")
                if (e.touches.length == 2) {
                    onStart(e);
                }
                else {
                    onCancel();
                }
            };
        }
    };
    HelloTouch.prototype.refreshPoisByTouchEvent = function (e) {
        for (var i = 0; i < e.touches.length; i++) {
            var p = this.pList[i];
            p.xy(e.touches[i].clientX, e.touches[i].clientY);
        }
    };
    HelloTouch.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logTxt.innerHTML += args.join(' ') + '<br/>';
        this.logTxt.scrollTo({ left: 0, top: this.logTxt.scrollHeight });
    };
    HelloTouch.prototype.clear = function () {
        // this.log("[info]",this,this.logTxt)
        // this.logTxt.innerHTML = ''
        location.reload();
    };
    return HelloTouch;
}());
//
var helloTouch = new HelloTouch();
//# sourceMappingURL=HelloTouch.js.map