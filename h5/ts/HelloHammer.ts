class HelloHammer {
    logTxt: HTMLElement
    init() {
        Common.preventDragDefault()
        //
        this.logTxt = document.getElementById('logTxt')
        var dragTarget = document.getElementById('div1')
        var hammertime = new Hammer(dragTarget);
        hammertime.on('tap pinch rotato swipe press', (evt: HammerInput) => {
            this.log("[info]", evt, evt.type)
            // console.log("[log]",evt.direction,":[evt.direction]",evt.offsetDirection,":[evt.offsetDirection]",evt.deltaX,":[evt.deltaX]",evt.deltaY,evt.direction,":[evt.direction]")
            // this.log("[info]", evt.angle, ":[evt.angle]", evt.center, ":[evt.center]")
        })
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

    }
    log(...args: any[]) {
        console.log(args.join(' '))
        this.logTxt.innerHTML += args.join(' ') + '<br/>'
        this.logTxt.scrollTo({ left: 0, top: this.logTxt.scrollHeight })
    }
    clear(){
        // console.log("[info]",this,this.logTxt)
        // this.logTxt.innerHTML = ''
        location.reload()
    }
}

var helloHammer = new HelloHammer()