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
        var pdfPath = 'assets/Go in Action CN.pdf';
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';
        //
        this.preventDragDefault()
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

    preventDragDefault() {
        var _preventDefault = function (e) {
            e.preventDefault();
        };
        document.addEventListener("dragleave", _preventDefault); //拖离
        document.addEventListener("drop", _preventDefault); //拖后放
        document.addEventListener("dragenter", _preventDefault); //拖进
        document.addEventListener("dragover", _preventDefault); //拖来拖去
        // document.addEventListener("touchmove", preventDefault);
        document.addEventListener("mousedown", _preventDefault);
        document.addEventListener("mouseup", _preventDefault);
        document.addEventListener("mousemove", _preventDefault);
        document.addEventListener("touchstart", _preventDefault);
        document.addEventListener("touchmove", _preventDefault);
        document.addEventListener("touchend", _preventDefault);
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
                }
            }
        })
        //# 自定义指令: drag
        Vue.directive('drag', {
            bind: function (trigger, binding) {
                var onStart = (e) => {
                    var dragTarget = binding.value() || trigger
                    //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - dragTarget.offsetLeft;
                    let disY = e.clientY - dragTarget.offsetTop;
                    var onMove = (e) => {
                        //通过事件委托，计算移动的距离 
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        //移动当前元素  
                        dragTarget.style.left = l + 'px';
                        dragTarget.style.top = t + 'px';
                        //将此时的位置传出去
                        // binding.value({ x: e.pageX, y: e.pageY })
                    };
                    var onEnd = (e) => {
                        if (Common.IsPC()) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        } else {
                            document.ontouchmove = null;
                            document.ontouchend = null;

                        }
                    };
                    if (Common.IsPC()) {
                        document.onmousemove = onMove
                        document.onmouseup = onEnd
                    } else {
                        document.ontouchmove = onMove
                        document.ontouchend = onEnd
                    }
                };
                if (Common.IsPC()) {
                    trigger.onmousedown = onStart
                } else {
                    trigger.ontouchstart = onStart
                }
            }
        }
        );
        //#
        this.vueDoc = new Vue({
            el: '.doc',
            data: {
                pageNum: 1,
                pageTotal: 1,
                pageScale: 1,
            },
            methods: {
                getDragTarget: () => {
                    return this.vueDoc.$refs.canvas;
                },
                onPagePrev: this.onPagePrev.bind(this),
                onPageNext: this.onPageNext.bind(this),
                onZoomOut: this.onZoomOut.bind(this),
                onZoomIn: this.onZoomIn.bind(this),
            }
        })
        this.vueOutline = new Vue({
            el: '.outline',
            data: {
                showOutline: true,
                treeData: [],
            },
            methods: {
                getDragTarget: () => {
                    return this.vueOutline.$el
                }
            }
        })

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