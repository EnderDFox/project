
interface ITreeItem {
    uuid?: number
    name?: string
    children?: ITreeItem[]
    isOpen?: boolean
    dest?: any[]
}
enum TouchKind {
    START = 1,
    MOVE = 2,
    END = 3,
}
interface ITouchOption {
    dragTarget?: HTMLElement
    useTouchTwo?: boolean
    touchOneCallback?: (kind: TouchKind, poi: IXY) => void
    touchTwoCallback?: (kind: TouchKind, gapW: number, gapH: number) => void
}
class PdfViewer {
    mark: MarkWebgl
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    canvasMark: HTMLCanvasElement

    pdfjsLib: PDFJSStatic
    pdfDoc: PDFDocumentProxy
    pageRendering = false
    pageNumPending = null

    init() {
        //
        Common.preventDragDefault()
        //
        var pdfPath = 'assets/Go in Action CN.pdf';
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';
        //
        this.initVue()
        /**
         * Asynchronously downloads PDF.
         */
        Vue.nextTick(() => {
            this.canvas = this.vueDoc.$refs.canvas as HTMLCanvasElement
            this.canvasMark = this.vueDoc.$refs.canvasMark as HTMLCanvasElement
            this.ctx = this.canvas.getContext('2d')
            this.pdfjsLib.getDocument(pdfPath).then((pdfDoc_: PDFDocumentProxy) => {
                this.pdfDoc = pdfDoc_;
                this.initVueData()
                // Initial/first page rendering
                this._renderPage(this.vueDoc.pageNum);
            });
            //
            this.mark = new MarkWebgl()
            this.mark.init(this.canvasMark)
        });

    }

    initVue() {
        //# 定义子级组件
        Vue.component('item', {
            template: '#template_outline_item',
            props: {
                models: Array
            },
            data: function () {
                return {
                }
            },
            methods: {
                onLinkItem: (item: ITreeItem) => {
                    this.pdfDoc.getPageIndex(item.dest[0]).then((pageIndex) => {
                        // console.log("[info]", pageIndex, ":[pageIndex]")
                        this.renderPage(pageIndex + 1)
                    })
                },
                onToggleItem: (item: ITreeItem) => {
                    // console.log("[info]", item.isOpen, ":[toggleItem]", item)
                    item.isOpen = !item.isOpen
                },
            }
        })
        //# 自定义指令: drag
        Vue.directive('drag', {
            bind: (el: HTMLElement, binding: VNodeDirective) => {
                var disX: number
                var disY: number
                var p0: IXY
                var p1: IXY
                var touchOption: ITouchOption
                var $dragTarget: JQuery
                var touchingCount = 0
                //for desktop
                var initTouchOption = () => {
                    if (!touchOption) {
                        touchOption = (binding.value && binding.value() || {}) as ITouchOption
                        $dragTarget = $(touchOption.dragTarget ? touchOption.dragTarget : el)
                    }
                }
                var onMouseStart = (e: MouseEvent) => {
                    initTouchOption()
                    e.preventDefault()
                    doTouchOneStart({ x: e.clientX, y: e.clientY })
                }
                var onMouseMove = (e: MouseEvent) => {
                    e.preventDefault()
                    doTouchOneMove({ x: e.clientX, y: e.clientY })
                }
                //for mobile
                var onTouchStart = (e: TouchEvent) => {
                    initTouchOption()
                    onCancel()
                    switch (e.touches.length) {
                        case 1:
                            doTouchOneStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
                            break;
                        case 2:
                            if (touchOption.useTouchTwo) {
                                doTouchTwoStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY })
                            }
                            break;
                    }
                }
                var onTouchMove = (e: TouchEvent) => {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 1) {
                                doTouchOneMove({ x: e.touches[0].clientX, y: e.touches[0].clientY })
                            } else {
                                onCancel()
                            }
                            break;
                        case 2:
                            if (touchingCount == 2) {
                                doTouchTwoMove({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY })
                            } else {
                                onCancel()
                            }
                            break;
                        default:
                            onCancel()
                            break;
                    }
                }
                var doTouchOneStart = (_p0: IXY) => {
                    touchingCount = 1
                    p0 = _p0
                    toggleEventListeners(true)
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.START, p0)
                    }
                };
                var doTouchTwoStart = (_p0: IXY, _p1: IXY) => {
                    touchingCount = 2
                    p0 = _p0
                    p1 = _p1
                    toggleEventListeners(true)
                }
                var doTouchOneMove = (_p0: IXY) => {
                    p0 = _p0
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.MOVE, p0)
                    } else {
                        $dragTarget.xy($dragTarget.x() + (_p0.x - p0.x), $dragTarget.y() + (_p0.y - p0.y))
                    }
                };
                var doTouchTwoMove = (_p0: IXY, _p1: IXY) => {
                    var dist = MathUtil.distance(p0, p1)
                    var _dist = MathUtil.distance(_p0, _p1)
                    // this.log(dist, ":[dist]", _dist, ":[_dist]")
                    var oldXY = $dragTarget.xy()
                    var oldWH = $dragTarget.wh()
                    var pinchCenter = NewXY((p1.x + p0.x) / 2, (p1.y + p0.y) / 2)
                    var _pinchCenter = NewXY((_p1.x + _p0.x) / 2, (_p1.y + _p0.y) / 2)
                    // this.log(oldXY.x, oldXY.y, ":[oldXY]", oldWH.x, oldWH.y, ":[oldWH]")
                    // this.log(pinchCenter.x, pinchCenter.y, ":[pinchCenter]", _pinchCenter.x, _pinchCenter.y, ":[_pinchCenter]")
                    var gapX = Math.abs(_p1.x - _p0.x) - Math.abs(p1.x - p0.x)
                    var gapY = Math.abs(_p1.y - _p0.y) - Math.abs(p1.y - p0.y)
                    // this.log(gapX, ":[gapX]", gapY, ":[gapY]")
                    $dragTarget.xy(oldXY.x - gapX / 2 + (_pinchCenter.x - pinchCenter.x), oldXY.y - gapY / 2 + (_pinchCenter.y - pinchCenter.y))
                    //
                    var whRate = $dragTarget.h() / $dragTarget.w()
                    var gap = (gapX + gapY)
                    // this.log(whRate, ":[whRate]", gap, ":[gap]")
                    if (touchOption.touchTwoCallback) {
                        touchOption.touchTwoCallback(TouchKind.MOVE, gap, gap * whRate)
                    } else {
                        $dragTarget.wh(Math.max($dragTarget.w() + gap, 100), Math.max($dragTarget.h() + gap * whRate, 100 * whRate))
                    }
                    //
                    p0 = _p0
                    p1 = _p1
                }
                var onCancel = (e: Event = null) => {
                    toggleEventListeners(false)
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.END, null)
                    }
                }
                var onEnd = (e: Event = null) => {
                    onCancel(e)
                }
                //
                var toggleEventListeners = (bl: boolean) => {
                    if (bl) {
                        if (Common.IsDesktop()) {
                            document.addEventListener(EventName.mousemove, onMouseMove)
                            document.addEventListener(EventName.mouseup, onEnd)
                        } else {
                            document.addEventListener(EventName.touchmove, onTouchMove)
                            document.addEventListener(EventName.touchend, onEnd)
                            document.addEventListener(EventName.touchcancel, onEnd)
                        }
                    } else {
                        if (Common.IsDesktop()) {
                            document.removeEventListener(EventName.mousemove, onMouseMove)
                            document.removeEventListener(EventName.mouseup, onEnd)
                        } else {
                            document.removeEventListener(EventName.touchmove, onTouchMove)
                            document.removeEventListener(EventName.touchend, onEnd)
                            document.removeEventListener(EventName.touchcancel, onEnd)
                        }
                    }
                }
                //
                if (Common.IsDesktop()) {
                    el.addEventListener(EventName.mousedown, onMouseStart)
                } else {
                    el.addEventListener(EventName.touchstart, onTouchStart)
                }
            }
        });
        //#
        this.vueDoc = new Vue({
            el: '.doc',
            data: {
                pageNum: 1,
                pageTotal: 1,
                pageScale: 1,
            },
            methods: {
                onPagePrev: this.onPagePrev.bind(this),
                onPageNext: this.onPageNext.bind(this),
                onZoomOut: this.onZoomOut.bind(this),
                onZoomIn: this.onZoomIn.bind(this),
                onMouseWheel: (e: MouseWheelEvent) => {
                    this.renderScale(this.vueDoc.pageScale - e.deltaY / 1000)
                },
                getTouchOption: (): ITouchOption => {
                    return {
                        dragTarget: null,
                        useTouchTwo: true,
                        touchOneCallback: (kind: TouchKind, poi: IXY) => {
                            switch (kind) {
                                case TouchKind.START:
                                    var wp: IXY = this.countWebglXY(poi)
                                    this.mark.poiArrList.push(this.mark.currLine = [wp.x, wp.y])
                                    break;
                                case TouchKind.MOVE:
                                    var wp: IXY = this.countWebglXY(poi)
                                    this.mark.currLine.push(wp.x, wp.y)
                                    this.mark.renderDirty = true
                                    break;
                                case TouchKind.END:
                                    this.mark.currLine = null
                                    break;
                            }
                        },
                        touchTwoCallback: (kind: TouchKind, gapW: number, gapH: number) => {
                            $(this.canvas).xy($(this.canvasMark).xy())
                            var _w: number = $(this.canvas).w() + gapW
                            _w = Math.max(_w, 100)
                            this.renderScale(this.vueDoc.pageScale * (_w / $(this.canvas).w()))
                        },
                    }
                },
            }
        })
        this.vueOutline = new Vue({
            data: {
                showContent: false,
                treeData: [],
            },
            methods: {
                getTouchOption: function (): ITouchOption {
                    return {
                        dragTarget: this.$el,
                        useTouchTwo: false,
                        touchTwoCallback: null,
                    }
                },
            }
        }).$mount('.outline')
        this.vueLog = new Vue({
            data: {
                showContent: false,
                content: '',
            },
            methods: {
                getTouchOption: function (): ITouchOption {
                    return {
                        dragTarget: this.$el,
                        useTouchTwo: false,
                        touchTwoCallback: null,
                    }
                },
            }
        }).$mount('.log')
        this.log('init vue!')
    }
    vueDoc: CombinedVueInstance1<{ pageNum: number, pageTotal: number, pageScale: number, }>
    vueOutline: CombinedVueInstance1<{ showContent: boolean, treeData: ITreeItem[], }>
    vueLog: CombinedVueInstance1<{ showContent: boolean, content: string }>
    initVueData() {
        this.vueDoc.pageTotal = this.pdfDoc.numPages;
        // this.vueOutline 
        this.pdfDoc.getOutline().then((outline: PDFTreeNode[]) => {
            var uuid = 1
            // console.log("[info] outline:",outline.length)
            var logItems = (items: PDFTreeNode[], depth: number): ITreeItem[] => {
                var treeData: ITreeItem[] = []
                var len = items.length
                for (var i = 0; i < len; i++) {
                    var item = items[i]
                    // console.log("[log]", i, ':', depth, "-", item.title, item)
                    var dataSingle: ITreeItem = { uuid: uuid++, name: item.title, dest: item.dest, isOpen: false }
                    if (item.items && item.items.length > 0) {
                        dataSingle.children = logItems(item.items, depth + 1)
                    } else {
                        dataSingle.children = []
                    }
                    treeData.push(dataSingle)
                }
                return treeData
            }
            // console.log("[info]", logItems(outline, 0), ":[logItems(outline, 0)]")
            this.vueOutline.treeData = logItems(outline, 0)
        })
    }
    log(...args: any[]) {
        this.vueLog.content += args.join(' ') + '<br/>'
        if (this.vueLog.showContent) {
            var _content: HTMLElement = this.vueLog.$refs.content as HTMLElement
            _content.scrollTo({ left: 0, top: _content.scrollHeight })
        }
    }
    renderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this._renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    onPagePrev() {
        if (this.vueDoc.pageNum <= 1) {
            return;
        }
        this.renderPage(this.vueDoc.pageNum - 1);
    }
    /**
     * Displays next page.
     */
    onPageNext() {
        if (this.vueDoc.pageNum >= this.vueDoc.pageTotal) {
            return;
        }
        this.renderPage(this.vueDoc.pageNum + 1);
    }
    onZoomOut() {
        this.renderScale(this.vueDoc.pageScale - 0.1)
    }
    onZoomIn() {
        this.renderScale(this.vueDoc.pageScale + 0.1)
    }
    renderScale(val: number) {
        val = Math.round(val * 10) / 10
        val = Math.min(Math.max(val, 0.2), 5)
        if (this.vueDoc.pageScale == val) {
            return
        }
        this.vueDoc.pageScale = val
        $(this.canvas).wh(this.pageWHScale1.x * val, this.pageWHScale1.y * val)
        $(this.canvasMark).wh($(this.canvas).wh())
        this.delayRenderPage(this.vueDoc.pageNum);
    }
    delayRenderPageNum: number
    delayRenderPageId: number
    delayRenderPage(num: number) {
        this.delayRenderPageNum = num
        clearTimeout(this.delayRenderPageId)
        this.delayRenderPageId = setTimeout(this._delayRenderPage.bind(this), 3000);
    }
    _delayRenderPage() {
        this.renderPage(this.delayRenderPageNum)
    }

    pageWHScale1: IXY
    _renderPage(num: number) {
        this.vueDoc.pageNum = num
        this.pageRendering = true;
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then((page: PDFPageProxy) => {
            var viewport: PDFPageViewport = page.getViewport(this.vueDoc.pageScale);
            //
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderTask = page.render({
                canvasContext: this.ctx,
                viewport: viewport
            });
            // Wait for rendering to finish
            renderTask.promise.then(() => {
                this.initWhenRenderFirst()
                //render pending page
                this.pageRendering = false;
                if (this.pageNumPending !== null) {
                    // New page rendering is pending
                    this._renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                }
            });
        });
    }
    initWhenRenderFirst() {
        if (this.pageWHScale1) {
            //only run when first
            return
        }
        this.pageWHScale1 = $(this.canvas).wh()
        $(this.canvasMark).wh($(this.canvas).wh())
        $(this.canvasMark).xy($(this.canvas).xy())
        //

    }
    countWebglXY(clientXY: IXY): IXY {
        console.log("[info]", $(this.canvasMark).y(), ":[$(this.canvasMark).y()]")
        var xy = { x: clientXY.x - $(this.canvasMark).x(), y: clientXY.y - $(this.canvasMark).y() }
        xy.x = xy.x / $(this.canvasMark).w() * 2 - 1
        xy.y = -(xy.y / $(this.canvasMark).h() * 2 - 1)
        return xy
    }
}