class Util {
    static IsPC(): boolean {
        var userAgentInfo = navigator.userAgent
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false
                break
            }
        }
        return flag
    }
    static preventDragDefault()//阻止浏览器默认将图片打开的行为
    {
        document.addEventListener("dragleave", Util.preventDefault);//拖离
        document.addEventListener("drop", Util.preventDefault);//拖后放
        document.addEventListener("dragenter", Util.preventDefault);//拖进
        document.addEventListener("dragover", Util.preventDefault);//拖来拖去
        // document.addEventListener("touchmove", preventDefault);
        document.addEventListener("mousedown", Util.preventDefault);
        document.addEventListener("mouseup", Util.preventDefault);
        document.addEventListener("mousemove", Util.preventDefault);
        document.addEventListener("touchstart", Util.preventDefault);
        document.addEventListener("touchmove", Util.preventDefault);
        document.addEventListener("touchend", Util.preventDefault);
    }
    static preventDefault(e:Event) {
        e.preventDefault();
    }
}
interface IXY {
    x: number, y: number
}

class CanvasDraw {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    isDrawing = false
    startX: number
    startY: number
    prevX: number
    prevY: number
    canvasX: number
    canvasY: number
    txtLog: HTMLElement
    scale: number = 1
    isRemove: boolean = false
    testLine() {
        this.ctx.strokeStyle = this.colors[0]
        var ctx = this.ctx
        //画线
        ctx.beginPath();
        ctx.moveTo(30, 100)
        ctx.lineTo(60, 150)
        // ctx.stroke()
        //连续画线
        // ctx.beginPath();
        // ctx.moveTo(60, 150)
        ctx.lineTo(30, 250)
        // ctx.stroke()
        ctx.lineTo(130, 350)
        ctx.stroke()
        //闭合
        ctx.beginPath();
        ctx.moveTo(120, 120);
        ctx.lineTo(120, 300);
        ctx.lineTo(170, 300);
        ctx.closePath();
        ctx.stroke();
    }
    testBase64() {
        (document.getElementById('img1') as HTMLImageElement).src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAACLUlEQVQ4EX2Tz2sTQRiGn9mZ/ZFmk02ItlFp1bTWVg1thVKKil4Ee5DqSZCiJxG8iyAUBW+K+BcIgnjo3bsUpeKtIAgVwaaFWiwkGpuSmN2O7KYpsSxd+JhvZ/d75p33mxFdhR7N3kcYkD9H7tYLpNeD1rAdRuDTWP1K7f0rtksfMPwyIqgDAi272FYZZP8Uai8vfNcySWr8OraXQxstIBoaq0vU3j6BjUVkUPuvVPhVpF9FL83FQ0Uyj9N7GmmqSKXQEEZt/mUEFHuAnXTh/8bonGjnRqYPJ5NDCpBGK+rfPuEvf2Q/YKtexys1kgdxvDRC0vIT2Fp8h9Est9fdd4z1VCqbhG0S7iNsUtjJ5sYKImjsC2t/jIUaQpOQOlIqdv6Ulo0vBOj2TBvRORpo6cRvX9S3cIIGdsIkRITe5nqPs/49gfA3Oym7uVYpvO5BZqavxkN1fQPz7yauciOgacCpyQusLcwhY6DasDgxfJ7Xz2YZ7DsS3/1GpURQWSdlgmdB1oLR0TH6xy+D8qLDHkkUKjrT6VyBp/fvURw4imNb8UqDzZ+sf15gqDhM0rRxJFHcuH2HN39+sfplHppVjg1OMnNtmpGT/UyODiFCz9FIM+s+3jVmJxE6oFKuUZy4RHc2TdIUuEqQz7hMnB1jZa1KvSl5PvuQm1MXOTPQi21Z7WpE7N0P11NpDhWvcPfBI7qzHl0KXAVpE1IKfpSWGSkc5oBrYYadjFSGXME/Xf2hMPRq4CEAAAAASUVORK5CYII="
    }
    setDraggable($box: JQuery<HTMLElement>) {
        $box.on('mousedown touchstart', (event) => {
            //获取鼠标按下的时候左侧偏移量和上侧偏移量
            var old_left = event.pageX;//左侧偏移量
            var old_top = event.pageY;//竖直偏移量
            //获取鼠标的位置
            var old_position_left = $box.position().left;
            var old_position_top = $box.position().top;
            //鼠标移动
            $(document).on('mousemove touchmove', (event) => {
                event.preventDefault()
                event.stopPropagation()
                var new_left = event.pageX;//新的鼠标左侧偏移量
                var new_top = event.pageY;//新的鼠标竖直方向上的偏移量

                //计算发生改变的偏移量是多少
                var chang_x = new_left - old_left;
                var change_y = new_top - old_top;

                //计算出现在的位置是多少

                var new_position_left = old_position_left + chang_x;
                var new_position_top = old_position_top + change_y;
                //加上边界限制
                if (new_position_top < 0) {//当上边的偏移量小于0的时候，就是上边的临界点，就让新的位置为0
                    new_position_top = 0;
                }
                //如果向下的偏移量大于文档对象的高度减去自身的高度，就让它等于这个高度
                if (new_position_top > $(document).height() - $box.height()) {
                    new_position_top = $(document).height() - $box.height();
                }
                //右限制
                if (new_position_left > $(document).width() - $box.width()) {
                    new_position_left = $(document).width() - $box.width();
                }
                if (new_position_left < 0) {//左边的偏移量小于0的时候设置 左边的位置为0
                    new_position_left = 0;
                }
                $box.css({
                    left: new_position_left + 'px',
                    top: new_position_top + 'px'
                })
            });
        })
        $box.on('mouseup touchend', (e) => {
            e.stopPropagation()
            e.preventDefault()
            $(document).off("mousemove touchmove");
        })
    }
    init() {
        Util.preventDragDefault()
        //
        this.txtLog = document.getElementById('txtLog')
        // this.setDraggable($('#navbar'))
        //
        document.getElementById('txtVer').innerHTML = '2018-05-11 17:34:26'
        //
        this.testBase64()
        var iframe1: HTMLIFrameElement = document.getElementById('iframe1') as HTMLIFrameElement
        // iframe1.src = 'hello_indexdb.html'
        // iframe1.src = 'http://cn.vuejs.org'
        // iframe1.src = 'https://www.baidu.com/s?ie=utf8&oe=utf8&wd=go%20%E9%9A%8F%E6%9C%BA%E6%95%B0&tn=98010089_dg&ch=3'
        iframe1.src = 'pdfjs/web/viewer.html'
        //
        this.canvas = document.getElementById('canvas1') as HTMLCanvasElement
        this.div_canvas_onResize()
        var canvasRect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d')
        this.ctx.lineWidth = 12
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        // this.ctx.lineJoin='miter'
        this.ctx.miterLimit = 16;
        // this.ctx.globalAlpha = 0.1
        // this.ctx.globalCompositeOperation = 'source-over'
        // this.ctx.globalCompositeOperation = 'copy'
        // this.ctx.globalCompositeOperation = 'srouce-atop'
        // this.testLine()
        this.validatePan()
        //画矩形
        var gap = 0
        // this.ctx.fillRect(gap, gap, this.canvas.width - gap * 2, this.canvas.height - gap * 2);
        //矩形框的左上角坐标
        this.canvasX = canvasRect.left;
        this.canvasY = canvasRect.top;
        //---开始侦听事件
        //鼠标点击按下事件，画图准备
        if (Util.IsPC()) {
            this.canvas.onmousedown = (e: MouseEvent) => {
                e.preventDefault()
                this.onDrawStart(e.clientX, e.clientY)
            }
            this.canvas.ontouchstart = null
            //鼠标移动
            this.canvas.onmousemove = (e: MouseEvent) => {
                e.preventDefault()
                this.onDrawMove(e.clientX, e.clientY)
            }
            //鼠标没有按下了，画图结束
            this.canvas.onmouseup = (e: MouseEvent) => {
                e.preventDefault()
                this.onDrawEnd()
            }
        } else {
            this.canvas.ontouchstart = (e: TouchEvent) => {
                e.preventDefault()
                this.onDrawStart(e.touches[0].clientX, e.touches[0].clientY)
            }
            this.canvas.onmousedown = null
            //鼠标移动
            this.canvas.ontouchmove = (e: TouchEvent) => {
                e.preventDefault()
                this.onDrawMove(e.touches[0].clientX, e.touches[0].clientY)
            }
            //鼠标没有按下了，画图结束
            // this.canvas.ontouchend = 
            // this.canvas.ontouchcancel
            this.canvas.ontouchend = (e: TouchEvent) => {
                e.preventDefault()
                //此时 e.touches.length=0 
                this.onDrawEnd()
            }
        }
        //
        var imgDom = document.getElementById('img1') as HTMLImageElement
        imgDom.onload = this.onImgDomLoaded.bind(this)
    }
    validatePan() {
        // this.ctx.beginPath();
        if (this.isRemove == false) {
            // this.ctx.globalCompositeOperation = 'srouce-over'
            // this.ctx.globalCompositeOperation = 'srouce-atop'
            // this.log(this.ctx.globalCompositeOperation)
            this.ctx.strokeStyle = this.colors[0]
            this.ctx.fillStyle = this.ctx.strokeStyle;
            // this.ctx.save()
        } else {
            // this.ctx.globalCompositeOperation = 'destination-out'
            // this.ctx.strokeStyle = "rgba(0,0,255,1)"
            // this.ctx.beginPath();
        }
    }
    onDrawStart(x: number, y: number) {
        var xy = this.getCanvasXY(x, y)
        // this.log(this.ctx.globalCompositeOperation)
        this.log('onDrawStart', this.isDrawing, xy.x, xy.y)
        this.isDrawing = true
        //设置原点坐标
        this.startX = xy.x
        this.startY = xy.y
        this.prevX = xy.x
        this.prevY = xy.y
        if (this.isRemove == false) {
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
        } else {
            this.clearRect(xy.x, xy.y)
        }
    }
    onDrawMove(x: number, y: number) {
        if (this.isDrawing == false) return
        var xy = this.getCanvasXY(x, y)
        //当前坐标
        this.prevX = xy.x
        this.prevY = xy.y
        if (this.isRemove == false) {
            this.clearAll()
            if (this.currStepIndex > -1) {
                this.doDraw()
            }
            this.ctx.lineTo(xy.x, xy.y)
            this.ctx.stroke()
        } else {
            this.clearRect(xy.x, xy.y)
        }
    }
    onDrawEnd() {
        try {
            if (this.isDrawing == false) return
            var xy: IXY = { x: this.prevX, y: this.prevY }
            this.log('onDrawEnd', this.isDrawing, xy.x, xy.y, this.startX, this.startY)
            this.isDrawing = false
            if (xy.x == this.startX && xy.y == this.startY) {
                //只是点击
                if (this.isRemove == false) {
                    /* xy.x = this.startX + 2
                    xy.y = this.startY - 2
                    this.ctx.lineTo(xy.x, xy.y)
                    this.ctx.stroke() */
                    this.ctx.beginPath();
                    this.ctx.arc(xy.x, xy.y, Math.round(this.ctx.lineWidth / 2), 0, 360, false);
                    this.ctx.fill();//画实心圆
                    this.ctx.closePath();
                } else {
                    this.clearRect(xy.x, xy.y)
                }
            }
            //
            this.startX = NaN
            this.startY = NaN
            this.prevX = NaN
            this.prevY = NaN
            //
            // this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            // (document.getElementById('img1') as HTMLImageElement).src
            // this.ctx.drawImage(image, dstX, dstY)
            var imgDataUrl: string
            // this.log("imgDataUrl:",imgDataUrl)
            try {
                imgDataUrl = this.canvas.toDataURL("image/png")
            } catch (error) {
                this.log("error:", error)
            }
            // var imgData: ImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
            // console.log("[debug]","imgDataUrl:",imgDataUrl)
            // this.log("imgDataUrl:",imgDataUrl)
            // var imgDom = document.getElementById('img1') as HTMLImageElement
            // imgDom.src = imgData
            this.imgDatas.splice(this.currStepIndex + 1, this.imgDatas.length - this.currStepIndex)
            this.imgDatas.push(imgDataUrl)
            this.currStepIndex = this.imgDatas.length - 1
            //重绘到img,为了以后画线用
            this.isUnReDo = false
            this.redraw()
        } catch (error) {
            this.log("error:", error)
        }
    }
    clearRect(x: number, y: number): void {
        var size = 60
        this.ctx.clearRect(x - size / 2, y - size / 2, size, size)
    }
    clearAll(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    imgDatas: string[] = []
    _currStepIndex = -1
    get currStepIndex(): number {
        return this._currStepIndex
    }
    set currStepIndex(val: number) {
        this._currStepIndex = val
        // this.txtLog.innerHTML = val.toString()
        if (val < 0) {
            $('#btnUndo').css('color', '#999999')
        } else {
            $('#btnUndo').css('color', '#000000')
        }
        if (val >= this.imgDatas.length - 1) {
            $('#btnRedo').css('color', '#999999')
        } else {
            $('#btnRedo').css('color', '#000000')
        }
    }
    undo(): void {
        this.isUnReDo = true
        this.clearAll()
        this.currStepIndex--
        if (this.currStepIndex >= 0) {
            this.redraw()
        } else {
            this.currStepIndex = -1
        }
    }
    redo(): void {
        this.isUnReDo = true
        this.currStepIndex++
        if (this.currStepIndex <= this.imgDatas.length - 1) {
            this.clearAll()
            this.redraw()
        } else {
            this.currStepIndex = this.imgDatas.length - 1
        }
    }
    redraw(): void {
        var imgDataUrl: string = this.imgDatas[this.currStepIndex]
        var imgDom = document.getElementById('img1') as HTMLImageElement
        imgDom.src = imgDataUrl
    }
    onToggle(e) {
        this.log("onToggle")
        $(this.canvas).toggle()
    }
    isUnReDo: boolean = false
    onImgDomLoaded() {
        console.log("[info]", "onImgDomLoaded:", new Date().getTime())
        if (this.isUnReDo) {
            this.doDraw()
        }
    }
    doDraw() {
        var imgDom = document.getElementById('img1') as HTMLImageElement
        this.ctx.drawImage(imgDom, 0, 0)
    }
    getCanvasXY(x: number, y: number): IXY {
        var win = $(window)
        // this.log(win.scrollLeft(), win.scrollTop())
        return { x: x / this.scale + win.scrollLeft() - this.canvasX, y: y / this.scale + win.scrollTop() - this.canvasY }
    }
    log(...args) {
        if (this.txtLog.innerHTML.length > 200) {
            this.txtLog.innerHTML = ''
        }
        this.txtLog.innerHTML = args.join(',') + '<br/>' + this.txtLog.innerHTML
    }
    onScale(val: number) {
        this.scale += val
        // style="transform: scale(0.5,0.5) translate(-50%,-50%)"
        var scaleOffset: string = `${-(1 - this.scale) * 100}%`
        console.log("[debug]", scaleOffset, val)
        document.getElementById('content1').style.transform = `scale(${this.scale},${this.scale}) translate(${scaleOffset},${scaleOffset})`
    }
    alpha: string = '0.5'
    colors: string[] = [`rgba(255,0,0,${this.alpha})`, `rgba(0,255,0,${this.alpha})`, `rgba(0,0,255,${this.alpha})`, `rgba(255,0,255,${this.alpha})`, `rgba(0,255,255,${this.alpha})`, `rgba(255,255,0,${this.alpha})`]
    onColor(ci: number) {
        if (ci > 0) {
            this.colors.push(this.colors.shift())
        } else {
            this.colors.unshift(this.colors.pop())
        }
        this.ctx.strokeStyle = this.colors[0]
        this.ctx.fillStyle = this.ctx.strokeStyle;
    }
    onTest(e: Event, kind: string) {
        switch (kind) {
            case 'A':
                var imgDom = document.getElementById('img1') as HTMLImageElement
                this.ctx.drawImage(imgDom, 0, 0)
                break
            /*  // this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
             var ctx = this.ctx
             ctx.beginPath();
             ctx.moveTo(120, 120);
             ctx.lineTo(120, 300);
             ctx.lineTo(170, 300);
             // ctx.closePath()
             ctx.stroke();
             break; */
            case 'Undo':
                this.undo()
                break;
            case 'Redo':
                this.redo()
                break;
            case 'remove':
                this.isRemove = !this.isRemove
                $(e.target).text(`Remove:${this.isRemove}`)
                this.validatePan()
                break;
        }
    }
    save(): void {

    }
    div_canvas_onResize() {
        console.log("[debug]", $('#div_canvas').get(0).offsetWidth, $('#div_canvas').get(0).offsetHeight)
        this.canvas.width = $('#div_canvas').get(0).offsetWidth
        this.canvas.height = $('#div_canvas').get(0).offsetHeight

    }
}
var canvasDraw = new CanvasDraw()
