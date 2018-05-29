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
    pageNum = 1
    pageScale = 1.0
    pageRendering = false
    pageNumPending = null
    viewport: PDFPageViewport

    init() {
        var pdfPath = 'assets/Go in Action CN.pdf';
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';
        //
        this.canvas = document.getElementById('the-canvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')
        //
        this.initVue()
        //
        document.getElementById('prev').addEventListener('click', this.onPrevPage.bind(this));
        document.getElementById('next').addEventListener('click', this.onNextPage.bind(this));
        document.getElementById('zoomOut').addEventListener('click', this.onZoomOut.bind(this));
        document.getElementById('zoomIn').addEventListener('click', this.onZoomIn.bind(this));
        //
        /**
         * Asynchronously downloads PDF.
         */
        this.pdfjsLib.getDocument(pdfPath).then((pdfDoc_: PDFDocumentProxy) => {
            this.pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = this.pdfDoc.numPages.toString();
            // Initial/first page rendering
            this._renderPage(this.pageNum);
            this.initOutline()
        });


    }

    initVue() {
        /* demo数据
        var treeData = {
            name: 'My Tree',
            children: [
                { name: 'hello' },
                { name: 'wat' },
                {
                    name: 'child folder',
                    children: [
                        {
                            name: 'child folder',
                            children: [
                                { name: 'hello' },
                                { name: 'wat' }
                            ]
                        },
                        { name: 'hello' },
                        { name: 'wat' },
                        {
                            name: 'child folder',
                            children: [
                                { name: 'hello' },
                                { name: 'wat' }
                            ]
                        }
                    ]
                }
            ]
        }
        */
        // 定义子级组件
        Vue.component('item', {
            template: '#item-template',
            props: {
                models: Array
            },
            data: function () {
                return {
                }
            },
            methods: {
                linkItem: (item: ITreeItem) => {
                    this.pdfDoc.getPageIndex(item.dest[0]).then((pageIndex) => {
                        // console.log("[info]", pageIndex, ":[pageIndex]")
                        this.doRenderPage(pageIndex + 1)
                    })
                },
                toggleItem: (item: ITreeItem) => {
                    // console.log("[info]", item.isOpen, ":[toggleItem]", item)
                    item.isOpen = !item.isOpen
                }
            }
        })
        //
        this.vueOutline = new Vue({
            el: '#outline',
            data: {
                treeData: []
            }
        })

    }
    vueOutline: CombinedVueInstance1<{ treeData: ITreeItem[] }>
    initOutline() {
        var uuid = 1
        // this.vueOutline 
        this.pdfDoc.getOutline().then((outline: PDFTreeNode[]) => {
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
    doRenderPage(num) {
        this.pageNum = num
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this._renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    onPrevPage() {
        if (this.pageNum <= 1) {
            return;
        }
        this.doRenderPage(this.pageNum - 1);
    }
    /**
     * Displays next page.
     */
    onNextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.doRenderPage(this.pageNum + 1);
    }
    onZoomOut() {
        this.renderScale(this.pageScale - 0.1)
    }
    onZoomIn() {
        this.renderScale(this.pageScale + 0.1)
    }
    renderScale(val: number) {
        this.pageScale = val
        this.viewport.fontScale = val
        this.doRenderPage(this.pageNum);
        document.getElementById('page_scale').textContent = val.toString();
    }
    _renderPage(num: number) {
        this.pageRendering = true;
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then((page: PDFPageProxy) => {
            var viewport = page.getViewport(this.pageScale);
            this.viewport = viewport

            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(() => {
                this.pageRendering = false;
                if (this.pageNumPending !== null) {
                    // New page rendering is pending
                    this._renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                }
            });
        });

        // Update page counters
        document.getElementById('page_num').textContent = num.toString();
    }
}