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
                },
            }
        });
        //# 自定义指令: drag
        Vue.directive('drag', {
            bind: function (el, binding) {
                var disX;
                var disY;
                var p0;
                var p1;
                var $dragTarget;
                var touchingCount = 0;
                //for desktop
                var doMouseStart = function (e) {
                    e.preventDefault();
                    doTouchOneStart({ x: e.screenX, y: e.screenY });
                };
                var onMouseMove = function (e) {
                    e.preventDefault();
                    doTouchOneMove({ x: e.screenX, y: e.screenY });
                };
                //for mobile
                var doTouchStart = function (e) {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 2) {
                                onCancel();
                                return;
                            }
                            else {
                                doTouchOneStart({ x: e.touches[0].screenX, y: e.touches[0].screenY });
                            }
                            break;
                        case 2:
                            if (touchingCount == 1) {
                                onCancel();
                                return;
                            }
                            else {
                                doTouchTwoStart({ x: e.touches[0].screenX, y: e.touches[0].screenY }, { x: e.touches[1].screenX, y: e.touches[1].screenY });
                            }
                            break;
                        default:
                            onCancel();
                            break;
                    }
                };
                var onTouchMove = function (e) {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 1) {
                                doTouchOneMove({ x: e.touches[0].screenX, y: e.touches[0].screenY });
                            }
                            else {
                                onCancel();
                            }
                            break;
                        case 2:
                            if (touchingCount == 2) {
                                doTouchTwoMove({ x: e.touches[0].screenX, y: e.touches[0].screenY }, { x: e.touches[1].screenX, y: e.touches[1].screenY });
                            }
                            else {
                                onCancel();
                            }
                            break;
                        default:
                            onCancel();
                            break;
                    }
                };
                var doTouchOneStart = function (_p0) {
                    touchingCount = 1;
                    $dragTarget = $((binding.value && binding.value()) || el); //必须在start时再获取,bind时获取到的是vue修改之前的模板元素
                    p0 = _p0;
                    toggleEventListeners(true);
                };
                var doTouchTwoStart = function (_p0, _p1) {
                    touchingCount = 2;
                    $dragTarget = $((binding.value && binding.value()) || el); //必须在start时再获取,bind时获取到的是vue修改之前的模板元素
                    p0 = _p0;
                    p1 = _p1;
                    toggleEventListeners(true);
                };
                var doTouchOneMove = function (_p0) {
                    $dragTarget.xy($dragTarget.x() + (_p0.x - p0.x), $dragTarget.y() + (_p0.y - p0.y));
                    p0 = _p0;
                };
                var doTouchTwoMove = function (_p0, _p1) {
                    var dist = MathUtil.distance(p0, p1);
                    var _dist = MathUtil.distance(_p0, _p1);
                    //
                    var oldXY = $dragTarget.xy();
                    var oldWH = $dragTarget.wh();
                    var pinchCenter = Common.NewXY((p1.x + p0.x) / 2, (p1.y + p0.y) / 2);
                    var _pinchCenter = Common.NewXY((_p1.x + _p0.x) / 2, (_p1.y + _p0.y) / 2);
                    //
                    var gapX = Math.abs(_p1.x - _p0.x) - Math.abs(p1.x - p0.x);
                    var gapY = Math.abs(_p1.y - _p0.y) - Math.abs(p1.y - p0.y);
                    $dragTarget.xy(oldXY.x - gapX / 2 + (_pinchCenter.x - pinchCenter.x), oldXY.y - gapY / 2 + (_pinchCenter.y - pinchCenter.y));
                    //
                    var whRate = $dragTarget.h() / $dragTarget.w();
                    var gap = (gapX + gapY);
                    $dragTarget.wh(Math.max($dragTarget.w() + gap, 100), Math.max($dragTarget.h() + gap * whRate, 100 * whRate));
                    //
                    p0 = _p0;
                    p1 = _p1;
                };
                var onCancel = function (e) {
                    if (e === void 0) { e = null; }
                    toggleEventListeners(false);
                };
                var onEnd = function (e) {
                    if (e === void 0) { e = null; }
                    onCancel(e);
                };
                //
                var toggleEventListeners = function (bl) {
                    if (bl) {
                        if (Common.IsDesktop()) {
                            document.addEventListener(EventName.mousemove, onMouseMove);
                            document.addEventListener(EventName.mouseup, onEnd);
                        }
                        else {
                            document.addEventListener(EventName.touchmove, onTouchMove);
                            document.addEventListener(EventName.touchend, onEnd);
                            document.addEventListener(EventName.touchcancel, onEnd);
                        }
                    }
                    else {
                        if (Common.IsDesktop()) {
                            document.removeEventListener(EventName.mousemove, onMouseMove);
                            document.removeEventListener(EventName.mouseup, onEnd);
                        }
                        else {
                            document.removeEventListener(EventName.touchmove, onTouchMove);
                            document.removeEventListener(EventName.touchend, onEnd);
                            document.removeEventListener(EventName.touchcancel, onEnd);
                        }
                    }
                };
                //
                if (Common.IsDesktop()) {
                    el.addEventListener(EventName.mousedown, doMouseStart);
                }
                else {
                    el.addEventListener(EventName.touchstart, doTouchStart);
                }
            }
        });
        Vue.directive('touchTwo', {
            bind: function (el, binding) {
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
                onMouseWheel: function (e) {
                    _this.renderScale(_this.vueDoc.pageScale - e.deltaY / 1000);
                },
            }
        });
        this.vueOutline = new Vue({
            data: {
                showOutline: true,
                treeData: [],
            },
            methods: {
                getDragTarget: function () {
                    return this.$el;
                }
            }
        }).$mount('#outline');
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
        val = Math.min(Math.max(val, 0.2), 5);
        if (this.vueDoc.pageScale == val) {
            return;
        }
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