var PdfViewer_page = /** @class */ (function () {
    function PdfViewer_page() {
        this.pageNum = 1;
        this.pageScale = 1.0;
        this.pageRendering = false;
        this.pageNumPending = null;
    }
    PdfViewer_page.prototype.init = function () {
        var _this = this;
        var pdfPath = 'assets/tracemonkey.pdf';
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
        document.getElementById('zoomout').addEventListener('click', this.onZoomout.bind(this));
        document.getElementById('zoomin').addEventListener('click', this.onZoomin.bind(this));
        /**
         * Asynchronously downloads PDF.
         */
        this.pdfjsLib.getDocument(pdfPath).then(function (pdfDoc_) {
            _this.pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = _this.pdfDoc.numPages.toString();
            // Initial/first page rendering
            _this.renderPage(_this.pageNum);
        });
    };
    PdfViewer_page.prototype.queueRenderPage = function (num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        }
        else {
            this.renderPage(num);
        }
    };
    /**
     * Displays previous page.
     */
    PdfViewer_page.prototype.onPrevPage = function () {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    };
    /**
     * Displays next page.
     */
    PdfViewer_page.prototype.onNextPage = function () {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    };
    PdfViewer_page.prototype.onZoomout = function () {
        this.renderScale(this.pageScale - 0.1);
    };
    PdfViewer_page.prototype.onZoomin = function () {
        this.renderScale(this.pageScale + 0.1);
    };
    PdfViewer_page.prototype.renderScale = function (val) {
        this.pageScale = val;
        this.viewport.fontScale = val;
        this.queueRenderPage(this.pageNum);
        document.getElementById('page_scale').textContent = val.toString();
    };
    PdfViewer_page.prototype.renderPage = function (num) {
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
                    _this.renderPage(_this.pageNumPending);
                    _this.pageNumPending = null;
                }
            });
        });
        // Update page counters
        document.getElementById('page_num').textContent = num.toString();
    };
    return PdfViewer_page;
}());
//# sourceMappingURL=PdfViewer_page.js.map