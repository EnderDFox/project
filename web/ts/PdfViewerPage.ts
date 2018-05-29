class PdfViewer_page {
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
        var pdfPath = 'assets/tracemonkey.pdf';

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';


        this.canvas = document.getElementById('the-canvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')

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
        this.pdfjsLib.getDocument(pdfPath).then((pdfDoc_: PDFDocumentProxy) => {
            this.pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = this.pdfDoc.numPages.toString();

            // Initial/first page rendering
            this.renderPage(this.pageNum);
        });

    }
    queueRenderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        } else {
            this.renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    onPrevPage() {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    }
    /**
     * Displays next page.
     */
    onNextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    }
    onZoomout() {
        this.renderScale(this.pageScale - 0.1)
    }
    onZoomin() {
        this.renderScale(this.pageScale + 0.1)
    }
    renderScale(val: number) {
        this.pageScale = val
        this.viewport.fontScale = val
        this.queueRenderPage(this.pageNum);
        document.getElementById('page_scale').textContent = val.toString();
    }
    renderPage(num: number) {
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
                    this.renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                }
            });
        });

        // Update page counters
        document.getElementById('page_num').textContent = num.toString();
    }
}