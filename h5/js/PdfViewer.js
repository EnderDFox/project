var PdfViewer = /** @class */ (function () {
    function PdfViewer() {
        this.pageRendering = false;
        this.pageNumPending = null;
    }
    PdfViewer.prototype.init = function () {
        var _this = this;
        Common.preventDragDefault();
        //
        var pdfPath = 'assets/Go in Action CN.pdf';
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdfjs/pdf.worker.js';
        //
        this.initVue();
        /**
         * Asynchronously downloads PDF.
         */
        Vue.nextTick(function () {
            _this.canvas = _this.vueDoc.$refs.canvas;
            _this.ctx = _this.canvas.getContext('2d');
            _this.pdfjsLib.getDocument(pdfPath).then(function (pdfDoc_) {
                _this.pdfDoc = pdfDoc_;
                _this.initVueData();
                // Initial/first page rendering
                _this._renderPage(_this.vueDoc.pageNum);
            });
        });
    };
    PdfViewer.prototype.initVue = function () {
        var _this = this;
        //# 定义子级组件
        Vue.component('item', {
            template: '#template_outline_item',
            props: {
                models: Array
            },
            data: function () {
                return {};
            },
            methods: {
                onLinkItem: function (item) {
                    _this.pdfDoc.getPageIndex(item.dest[0]).then(function (pageIndex) {
                        // console.log("[info]", pageIndex, ":[pageIndex]")
                        _this.renderPage(pageIndex + 1);
                    });
                },
                onToggleItem: function (item) {
                    // console.log("[info]", item.isOpen, ":[toggleItem]", item)
                    item.isOpen = !item.isOpen;
                }
            }
        });
        //# 自定义指令: drag
        Vue.directive('drag', {
            bind: function (trigger, binding) {
                var onStart = function (x, y) {
                    var dragTarget = binding.value() || trigger;
                    //鼠标按下，计算当前元素距离可视区的距离
                    var disX = x - dragTarget.offsetLeft;
                    var disY = y - dragTarget.offsetTop;
                    var onMove = function (x, y) {
                        //移动当前元素  
                        dragTarget.style.left = x - disX + 'px';
                        dragTarget.style.top = y - disY + 'px';
                        //将此时的位置传出去
                        // binding.value({ x: e.pageX, y: e.pageY })
                    };
                    var onEnd = function (e) {
                        // e.preventDefault()
                        if (Common.IsPC()) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        }
                        else {
                            document.ontouchmove = null;
                            document.ontouchend = null;
                        }
                    };
                    if (Common.IsPC()) {
                        document.onmousemove = function (e) {
                            e.preventDefault();
                            onMove(e.clientX, e.clientY);
                        };
                        document.onmouseup = onEnd;
                    }
                    else {
                        document.ontouchmove = function (e) {
                            // e.preventDefault()
                            onMove(e.touches[0].clientX, e.touches[0].clientY);
                        };
                        document.ontouchend = onEnd;
                    }
                };
                if (Common.IsPC()) {
                    trigger.onmousedown = function (e) {
                        e.preventDefault();
                        onStart(e.clientX, e.clientY);
                    };
                }
                else {
                    trigger.ontouchstart = function (e) {
                        e.preventDefault();
                        onStart(e.touches[0].clientX, e.touches[0].clientY);
                    };
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
                getDragTarget: function () {
                    return _this.vueDoc.$refs.canvas;
                },
                onPagePrev: this.onPagePrev.bind(this),
                onPageNext: this.onPageNext.bind(this),
                onZoomOut: this.onZoomOut.bind(this),
                onZoomIn: this.onZoomIn.bind(this),
            }
        });
        this.vueOutline = new Vue({
            el: '.outline',
            data: {
                showOutline: true,
                treeData: [],
            },
            methods: {
                getDragTarget: function () {
                    return _this.vueOutline.$el;
                }
            }
        });
    };
    PdfViewer.prototype.initVueData = function () {
        var _this = this;
        this.vueDoc.pageTotal = this.pdfDoc.numPages;
        // this.vueOutline 
        this.pdfDoc.getOutline().then(function (outline) {
            var uuid = 1;
            // console.log("[info] outline:",outline.length)
            var logItems = function (items, depth) {
                var treeData = [];
                var len = items.length;
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    // console.log("[log]", i, ':', depth, "-", item.title, item)
                    var dataSingle = { uuid: uuid++, name: item.title, dest: item.dest, isOpen: false };
                    if (item.items && item.items.length > 0) {
                        dataSingle.children = logItems(item.items, depth + 1);
                    }
                    else {
                        dataSingle.children = [];
                    }
                    treeData.push(dataSingle);
                }
                return treeData;
            };
            // console.log("[info]", logItems(outline, 0), ":[logItems(outline, 0)]")
            _this.vueOutline.treeData = logItems(outline, 0);
        });
    };
    PdfViewer.prototype.renderPage = function (num) {
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
    PdfViewer.prototype.onPagePrev = function () {
        if (this.vueDoc.pageNum <= 1) {
            return;
        }
        this.renderPage(this.vueDoc.pageNum - 1);
    };
    /**
     * Displays next page.
     */
    PdfViewer.prototype.onPageNext = function () {
        if (this.vueDoc.pageNum >= this.vueDoc.pageTotal) {
            return;
        }
        this.renderPage(this.vueDoc.pageNum + 1);
    };
    PdfViewer.prototype.onZoomOut = function () {
        this.renderScale(this.vueDoc.pageScale - 0.1);
    };
    PdfViewer.prototype.onZoomIn = function () {
        this.renderScale(this.vueDoc.pageScale + 0.1);
    };
    PdfViewer.prototype.renderScale = function (val) {
        val = Math.round(val * 10) / 10;
        this.vueDoc.pageScale = val;
        this.renderPage(this.vueDoc.pageNum);
    };
    PdfViewer.prototype._renderPage = function (num) {
        var _this = this;
        this.vueDoc.pageNum = num;
        this.pageRendering = true;
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(_this.vueDoc.pageScale);
            //
            _this.canvas.height = viewport.height;
            _this.canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderTask = page.render({
                canvasContext: _this.ctx,
                viewport: viewport
            });
            // Wait for rendering to finish
            renderTask.promise.then(function () {
                //render pending page
                _this.pageRendering = false;
                if (_this.pageNumPending !== null) {
                    // New page rendering is pending
                    _this._renderPage(_this.pageNumPending);
                    _this.pageNumPending = null;
                }
            });
        });
    };
    return PdfViewer;
}());
//# sourceMappingURL=PdfViewer.js.map