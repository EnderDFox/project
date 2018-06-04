interface ITreeItem {
    uuid?: number
    name?: string
    children?: ITreeItem[]
    isOpen?: boolean
    dest?: any[]
}
class PdfViewer {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    pdfjsLib: PDFJSStatic
    pdfDoc: PDFDocumentProxy
    pageRendering = false
    pageNumPending = null
    init() {
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
            this.ctx = this.canvas.getContext('2d')
            this.pdfjsLib.getDocument(pdfPath).then((pdfDoc_: PDFDocumentProxy) => {
                this.pdfDoc = pdfDoc_;
                this.initVueData()
                // Initial/first page rendering
                this._renderPage(this.vueDoc.pageNum);
            });
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
                var $dragTarget: JQuery
                var touchingCount = 0
                //for desktop
                var doMouseStart = (e: MouseEvent) => {
                    e.preventDefault()
                    doTouchOneStart({ x: e.screenX, y: e.screenY })
                }
                var onMouseMove = (e: MouseEvent) => {
                    e.preventDefault()
                    doTouchOneMove({ x: e.screenX, y: e.screenY })
                }
                //for mobile
                var doTouchStart = (e: TouchEvent) => {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 2) {
                                onCancel()
                                return
                            } else {
                                doTouchOneStart({ x: e.touches[0].screenX, y: e.touches[0].screenY })
                            }
                            break;
                        case 2:
                            if (touchingCount == 1) {
                                onCancel()
                                return
                            } else {
                                doTouchTwoStart({ x: e.touches[0].screenX, y: e.touches[0].screenY }, { x: e.touches[1].screenX, y: e.touches[1].screenY })
                            }
                            break;
                        default:
                            onCancel()
                            break;
                    }
                }
                var onTouchMove = (e: TouchEvent) => {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 1) {
                                doTouchOneMove({ x: e.touches[0].screenX, y: e.touches[0].screenY })
                            } else {
                                onCancel()
                            }
                            break;
                        case 2:
                            if (touchingCount == 2) {
                                doTouchTwoMove({ x: e.touches[0].screenX, y: e.touches[0].screenY }, { x: e.touches[1].screenX, y: e.touches[1].screenY })
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
                    $dragTarget = $((binding.value && binding.value()) || el)   //必须在start时再获取,bind时获取到的是vue修改之前的模板元素
                    p0 = _p0
                    toggleEventListeners(true)
                };
                var doTouchTwoStart = (_p0: IXY, _p1: IXY) => {
                    touchingCount = 2
                    $dragTarget = $((binding.value && binding.value()) || el)   //必须在start时再获取,bind时获取到的是vue修改之前的模板元素
                    p0 = _p0
                    p1 = _p1
                    toggleEventListeners(true)
                }
                var doTouchOneMove = (_p0: IXY) => {
                    $dragTarget.xy($dragTarget.x() + (_p0.x - p0.x), $dragTarget.y() + (_p0.y - p0.y))
                    p0 = _p0
                };
                var doTouchTwoMove = (_p0: IXY, _p1: IXY) => {
                    var dist = MathUtil.distance(p0, p1)
                    var _dist = MathUtil.distance(_p0, _p1)
                    //
                    var oldXY = $dragTarget.xy()
                    var oldWH = $dragTarget.wh()
                    var pinchCenter = Common.NewXY((p1.x + p0.x) / 2, (p1.y + p0.y) / 2)
                    var _pinchCenter = Common.NewXY((_p1.x + _p0.x) / 2, (_p1.y + _p0.y) / 2)
                    //
                    var gapX = Math.abs(_p1.x - _p0.x) - Math.abs(p1.x - p0.x)
                    var gapY = Math.abs(_p1.y - _p0.y) - Math.abs(p1.y - p0.y)
                    $dragTarget.xy(oldXY.x - gapX / 2 + (_pinchCenter.x - pinchCenter.x), oldXY.y - gapY / 2 + (_pinchCenter.y - pinchCenter.y))
                    //
                    var whRate = $dragTarget.h() / $dragTarget.w()
                    var gap = (gapX + gapY)
                    $dragTarget.wh(Math.max($dragTarget.w() + gap, 100), Math.max($dragTarget.h() + gap * whRate, 100 * whRate))
                    //
                    p0 = _p0
                    p1 = _p1
                }
                var onCancel = (e: Event = null) => {
                    toggleEventListeners(false)
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
                    el.addEventListener(EventName.mousedown, doMouseStart)
                } else {
                    el.addEventListener(EventName.touchstart, doTouchStart)
                }
            }
        });
        Vue.directive('touchTwo', {
            bind: (el: HTMLElement, binding: VNodeDirective) => {

            }
        })
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
            }
        })
        this.vueOutline = new Vue({
            data: {
                showOutline: true,
                treeData: [],
            },
            methods: {
                getDragTarget: function (this: Vue) {
                    return this.$el
                }
            }
        }).$mount('#outline')

    }
    vueDoc: CombinedVueInstance1<{ pageNum: number, pageTotal: number, pageScale: number, }>
    vueOutline: CombinedVueInstance1<{ showOutline: boolean, treeData: ITreeItem[], }>
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
        this.renderPage(this.vueDoc.pageNum);
    }
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
}