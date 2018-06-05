var HelloHammer = /** @class */ (function () {
    function HelloHammer() {
    }
    HelloHammer.prototype.init = function () {
        var _this = this;
        Common.preventDragDefault();
        //
        this.logTxt = document.getElementById('logTxt');
        var dragTarget = document.getElementById('div1');
        var hammertime = new Hammer(dragTarget);
        hammertime.on('tap pinch rotato swipe press', function (evt) {
            _this.log("[info]", evt, evt.type);
            // console.log("[log]",evt.direction,":[evt.direction]",evt.offsetDirection,":[evt.offsetDirection]",evt.deltaX,":[evt.deltaX]",evt.deltaY,evt.direction,":[evt.direction]")
            // this.log("[info]", evt.angle, ":[evt.angle]", evt.center, ":[evt.center]")
        });
        /* hammertime.on('pinch', (evt: HammerInput) => {
            this.log("[info]", 'pinch')
        })
        hammertime.on('press', (evt: HammerInput) => {
            this.log("[info]", 'press')
        })
        hammertime.on('rotate', (evt: HammerInput) => {
            this.log("[info]", 'rotate')
        })
        hammertime.on('swipe', (evt: HammerInput) => {
            this.log("[info]", 'swipe')
        })
        hammertime.on('tap', (evt: HammerInput) => {
            this.log("[info]", 'tap')
        }) */
    };
    HelloHammer.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log(args.join(' '));
        this.logTxt.innerHTML += args.join(' ') + '<br/>';
        this.logTxt.scrollTo({ left: 0, top: this.logTxt.scrollHeight });
    };
    HelloHammer.prototype.clear = function () {
        // console.log("[info]",this,this.logTxt)
        // this.logTxt.innerHTML = ''
        location.reload();
    };
    return HelloHammer;
}());
var helloHammer = new HelloHammer();
//# sourceMappingURL=HelloHammer.js.map