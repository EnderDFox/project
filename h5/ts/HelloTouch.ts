class HelloTouch {
    pList: JQuery[] = []
    $div1: JQuery
    logTxt: HTMLElement
    init() {
        Common.preventDragDefault()
        //
        this.$div1 = $('#div1')
        // this.$div1.width(100).height(100)
        this.logTxt = document.getElementById('logTxt')
        //
        for (var i = 0; i < 3; i++) {
            var p: JQuery = $('#p' + i)
            this.pList.push(p)
            // p.xy(100*i+160,80*i+120)
        }
        //
        var el = $('#div1').get(0)
        //
        var p0: IXY
        var p1: IXY
        var onStart = (e: TouchEvent) => {
            p0 = Common.NewXY(e.touches[0].screenX, e.touches[0].screenY)
            p1 = Common.NewXY(e.touches[1].screenX, e.touches[1].screenY)
            this.log("[info]onStart:", p0.x, p0.y, p1.x, p1.y)
            // this.log("[info]", "onStart")
            // this.pList[0].xy(x, y)
            if (Common.IsPC()) {
                document.onmousemove = (e: MouseEvent) => {
                    e.preventDefault()
                    // onMove(e.clientX, e.clientY)
                }
                document.onmouseup = onEnd
            } else {
                document.ontouchmove = (e: TouchEvent) => {
                    onMove(e)
                    // this.log("ontouchmove", e.touches.length, ":[e.touches.length]")
                    // e.preventDefault()
                    // this.refreshPoisByTouchEvent(e)
                    /* if (e.touches.length == 1) {
                        onMove(e.touches[0].clientX, e.touches[0].clientY)
                    } else {
                        onCancel()
                    } */
                }
                document.ontouchend = onEnd
            }
        }
        //
        // 
        var onMove = (e: TouchEvent) => {
            // this.log("[info]","onMove")
            this.refreshPoisByTouchEvent(e)
            var d = MathUtil.distance(p0, p1)
            var cp0 = Common.NewXY(e.touches[0].screenX, e.touches[0].screenY)
            var cp1 = Common.NewXY(e.touches[1].screenX, e.touches[1].screenY)
            var cd = MathUtil.distance(cp0, cp1)
            // this.log("move:", cd - d, cp0.x, cp0.y, cp1.x, cp1.y)
            p0 = cp0
            p1 = cp1
            var oldW = this.$div1.width()
            var newW = oldW + (cd - d) / 10
            newW = Math.max(newW, 100)
            this.$div1.width(newW).height(this.$div1.height() * (newW / oldW))
        };
        var onCancel = (e: Event = null) => {
            // this.log("onCancel")
            if (Common.IsPC()) {
                document.onmousemove = null;
                document.onmouseup = null;
            } else {
                document.ontouchmove = null;
                document.ontouchend = null;
            }
        }
        var onEnd = (e: Event = null) => {
            // e.preventDefault()
            onCancel(e)
        }
        this.log("[info]", Common.IsPC(), ":[Common.IsPC()]")
        if (Common.IsPC()) {
            el.onmousedown = (e: MouseEvent) => {
                e.preventDefault()
                this.log("[info]", e)
                // onStart(e.clientX, e.clientY)
            }
        } else {
            el.ontouchstart = (e: TouchEvent) => {
                e.preventDefault()
                // this.log("ontouchstart: ", e.touches.length, ":[e.touches.length]")
                if (e.touches.length == 2) {
                    onStart(e)
                } else {
                    onCancel()
                }
            }
        }
    }
    refreshPoisByTouchEvent(e: TouchEvent) {
        for (var i = 0; i < e.touches.length; i++) {
            var p: JQuery = this.pList[i]
            p.xy(e.touches[i].clientX, e.touches[i].clientY)
        }
    }
    log(...args: any[]) {
        this.logTxt.innerHTML += args.join(' ') + '<br/>'
        this.logTxt.scrollTo({ left: 0, top: this.logTxt.scrollHeight })
    }
    clear() {
        // this.log("[info]",this,this.logTxt)
        // this.logTxt.innerHTML = ''
        location.reload()
    }
}
//
var helloTouch = new HelloTouch()