var PdfViewer_page = /** @class */ (function () {
    function PdfViewer_page() {
        this.pageNum = 1;
        this.pageScale = 1.0;
        this.pageRendering = false;
        this.pageNumPending = null;
    }
    PdfViewer_page.prototype.init = function () {
        var _this = this;
        var pdfPath = 'assets/Go in Action CN.pdf';
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';
        this.canvas = document.getElementById('the-canvas');
        this.ctx = this.canvas.getContext('2d');
        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        document.getElementById('prev').addEventListener('click', this.onPrevPage.bind(this));
        document.getElementById('next').addEventListener('click', this.onNextPage.bind(this));
        document.getElementById('zoomOut').addEventListener('click', this.onZoomOut.bind(this));
        document.getElementById('zoomIn').addEventListener('click', this.onZoomIn.bind(this));
        document.getElementById('pageTo').addEventListener('click', this.onPageTo.bind(this));
        /**
         * Asynchronously downloads PDF.
         */
        this.pdfjsLib.getDocument(pdfPath).then(function (pdfDoc_) {
            _this.pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = _this.pdfDoc.numPages.toString();
            // Initial/first page rendering
            _this._renderPage(_this.pageNum);
        });
        this.initVue();
    };
    PdfViewer_page.prototype.initVue = function () {
        // demo数据
        var data = {
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
        };
        // 定义子级组件
        Vue.component('item', {
            template: '#item-template',
            props: {
                model: Object
            },
            data: function () {
                return {};
            },
            methods: {}
        });
        var demo = new Vue({
            el: '#demo',
            data: {
                treeData: data
            }
        });
    };
    PdfViewer_page.prototype.doRenderPage = function (num) {
        this.pageNum = num;
        if (this.pageRendering) {
            this.pageNumPending = num;
        }
        else {
            this._renderPage(num);
        }
    };
    /**
     * Displays previous page.
     */
    PdfViewer_page.prototype.onPrevPage = function () {
        if (this.pageNum <= 1) {
            return;
        }
        this.doRenderPage(this.pageNum - 1);
    };
    /**
     * Displays next page.
     */
    PdfViewer_page.prototype.onNextPage = function () {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.doRenderPage(this.pageNum + 1);
    };
    PdfViewer_page.prototype.onZoomOut = function () {
        this.renderScale(this.pageScale - 0.1);
    };
    PdfViewer_page.prototype.onZoomIn = function () {
        this.renderScale(this.pageScale + 0.1);
    };
    PdfViewer_page.prototype.onPageTo = function () {
        var _this = this;
        this.pdfDoc.getOutline().then(function (outline) {
            // console.log("[info] outline:",outline.length)
            var logItems = function (items, depth) {
                var len = items.length;
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    if (i == 5) {
                        // console.log("[log]",i,':',depth,"-",item.title,item)
                        _this.pdfDoc.getPageIndex(item.dest[0]).then(function (pageIndex) {
                            console.log("[info]", pageIndex, ":[pageIndex]");
                            _this.doRenderPage(pageIndex + 1);
                        });
                    }
                    if (item.items) {
                        // logItems(item.items,depth+1)
                    }
                }
            };
            logItems(outline, 0);
        });
    };
    PdfViewer_page.prototype.renderScale = function (val) {
        this.pageScale = val;
        this.viewport.fontScale = val;
        this.doRenderPage(this.pageNum);
        document.getElementById('page_scale').textContent = val.toString();
    };
    PdfViewer_page.prototype._renderPage = function (num) {
        var _this = this;
        this.pageRendering = true;
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(_this.pageScale);
            _this.viewport = viewport;
            _this.canvas.height = viewport.height;
            _this.canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: _this.ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            // Wait for rendering to finish
            renderTask.promise.then(function () {
                _this.pageRendering = false;
                if (_this.pageNumPending !== null) {
                    // New page rendering is pending
                    _this._renderPage(_this.pageNumPending);
                    _this.pageNumPending = null;
                }
            });
        });
        // Update page counters
        document.getElementById('page_num').textContent = num.toString();
    };
    return PdfViewer_page;
}());
//# sourceMappingURL=PdfViewer.js.map