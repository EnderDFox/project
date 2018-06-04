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
                var dragTarget: HTMLElement
                //for desktop
                var onMouseStart = (e: MouseEvent) => {
                    e.preventDefault()
                    onDragStart(e.clientX, e.clientY)
                }
                var onMouseMove = (e: MouseEvent) => {
                    e.preventDefault()
                    onDragMove(e.clientX, e.clientY)
                }
                var onTouchStart = (e: TouchEvent) => {
                    if (e.touches.length == 1) {
                        onDragStart(e.touches[0].clientX, e.touches[0].clientY)
                    } else {
                        onCancel()
                    }
                }
                var onTouchMove = (e: TouchEvent) => {
                    if (e.touches.length == 1) {
                        onDragMove(e.touches[0].clientX, e.touches[0].clientY)
                    } else {
                        onCancel()
                    }
                }
                //for mobile
                var onDragStart = (x: number, y: number) => {
                    dragTarget = (binding.value && binding.value()) || el   //必须在start时再获取,bind时获取到的是vue修改之前的模板元素
                    //鼠标按下，计算当前元素距离可视区的距离
                    disX = x - dragTarget.offsetLeft;
                    disY = y - dragTarget.offsetTop;
                    if (Common.IsDesktop()) {
                        document.addEventListener('mousemove', onMouseMove)
                        document.addEventListener('mouseup', onEnd)
                    } else {
                        document.addEventListener('touchmove', onTouchMove)
                        document.addEventListener('touchend', onEnd)
                    }
                };
                var onDragMove = (x: number, y: number) => {
                    dragTarget.style.left = x - disX + 'px';
                    dragTarget.style.top = y - disY + 'px';
                };
                var onCancel = (e: Event = null) => {
                    if (Common.IsDesktop()) {
                        document.removeEventListener('mousemove', onMouseMove)
                        document.removeEventListener('mouseup', onEnd)
                    } else {
                        document.removeEventListener('touchmove', onTouchMove)
                        document.removeEventListener('touchend', onEnd)
                    }
                }
                var onEnd = (e: Event = null) => {
                    onCancel(e)
                }
                if (Common.IsDesktop()) {
                    el.addEventListener('mousedown', onMouseStart)
                } else {
                    el.addEventListener('touchstart', onTouchStart)
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