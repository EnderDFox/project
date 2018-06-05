var TouchKind;
(function (TouchKind) {
    TouchKind[TouchKind["START"] = 1] = "START";
    TouchKind[TouchKind["MOVE"] = 2] = "MOVE";
    TouchKind[TouchKind["END"] = 3] = "END";
})(TouchKind || (TouchKind = {}));
var PdfViewer = /** @class */ (function () {
    function PdfViewer() {
        this.pageRendering = false;
        this.pageNumPending = null;
    }
    PdfViewer.prototype.init = function () {
        var _this = this;
        //
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
            _this.canvasMark = _this.vueDoc.$refs.canvasMark;
            _this.ctx = _this.canvas.getContext('2d');
            _this.pdfjsLib.getDocument(pdfPath).then(function (pdfDoc_) {
                _this.pdfDoc = pdfDoc_;
                _this.initVueData();
                // Initial/first page rendering
                _this._renderPage(_this.vueDoc.pageNum);
            });
            //
            _this.mark = new MarkWebgl();
            _this.mark.init(_this.canvasMark);
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
                var touchOption;
                var $dragTarget;
                var touchingCount = 0;
                //for desktop
                var initTouchOption = function () {
                    if (!touchOption) {
                        touchOption = (binding.value && binding.value() || {});
                        $dragTarget = $(touchOption.dragTarget ? touchOption.dragTarget : el);
                    }
                };
                var onMouseStart = function (e) {
                    initTouchOption();
                    e.preventDefault();
                    doTouchOneStart({ x: e.clientX, y: e.clientY });
                };
                var onMouseMove = function (e) {
                    e.preventDefault();
                    doTouchOneMove({ x: e.clientX, y: e.clientY });
                };
                //for mobile
                var onTouchStart = function (e) {
                    initTouchOption();
                    onCancel();
                    switch (e.touches.length) {
                        case 1:
                            doTouchOneStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                            break;
                        case 2:
                            if (touchOption.useTouchTwo) {
                                doTouchTwoStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY });
                            }
                            break;
                    }
                };
                var onTouchMove = function (e) {
                    switch (e.touches.length) {
                        case 1:
                            if (touchingCount == 1) {
                                doTouchOneMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                            }
                            else {
                                onCancel();
                            }
                            break;
                        case 2:
                            if (touchingCount == 2) {
                                doTouchTwoMove({ x: e.touches[0].clientX, y: e.touches[0].clientY }, { x: e.touches[1].clientX, y: e.touches[1].clientY });
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
                    p0 = _p0;
                    toggleEventListeners(true);
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.START, p0);
                    }
                };
                var doTouchTwoStart = function (_p0, _p1) {
                    touchingCount = 2;
                    p0 = _p0;
                    p1 = _p1;
                    toggleEventListeners(true);
                };
                var doTouchOneMove = function (_p0) {
                    p0 = _p0;
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.MOVE, p0);
                    }
                    else {
                        $dragTarget.xy($dragTarget.x() + (_p0.x - p0.x), $dragTarget.y() + (_p0.y - p0.y));
                    }
                };
                var doTouchTwoMove = function (_p0, _p1) {
                    var dist = MathUtil.distance(p0, p1);
                    var _dist = MathUtil.distance(_p0, _p1);
                    // this.log(dist, ":[dist]", _dist, ":[_dist]")
                    var oldXY = $dragTarget.xy();
                    var oldWH = $dragTarget.wh();
                    var pinchCenter = NewXY((p1.x + p0.x) / 2, (p1.y + p0.y) / 2);
                    var _pinchCenter = NewXY((_p1.x + _p0.x) / 2, (_p1.y + _p0.y) / 2);
                    // this.log(oldXY.x, oldXY.y, ":[oldXY]", oldWH.x, oldWH.y, ":[oldWH]")
                    // this.log(pinchCenter.x, pinchCenter.y, ":[pinchCenter]", _pinchCenter.x, _pinchCenter.y, ":[_pinchCenter]")
                    var gapX = Math.abs(_p1.x - _p0.x) - Math.abs(p1.x - p0.x);
                    var gapY = Math.abs(_p1.y - _p0.y) - Math.abs(p1.y - p0.y);
                    // this.log(gapX, ":[gapX]", gapY, ":[gapY]")
                    $dragTarget.xy(oldXY.x - gapX / 2 + (_pinchCenter.x - pinchCenter.x), oldXY.y - gapY / 2 + (_pinchCenter.y - pinchCenter.y));
                    //
                    var whRate = $dragTarget.h() / $dragTarget.w();
                    var gap = (gapX + gapY);
                    // this.log(whRate, ":[whRate]", gap, ":[gap]")
                    if (touchOption.touchTwoCallback) {
                        touchOption.touchTwoCallback(TouchKind.MOVE, gap, gap * whRate);
                    }
                    else {
                        $dragTarget.wh(Math.max($dragTarget.w() + gap, 100), Math.max($dragTarget.h() + gap * whRate, 100 * whRate));
                    }
                    //
                    p0 = _p0;
                    p1 = _p1;
                };
                var onCancel = function (e) {
                    if (e === void 0) { e = null; }
                    toggleEventListeners(false);
                    if (touchOption.touchOneCallback) {
                        touchOption.touchOneCallback(TouchKind.END, null);
                    }
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
                    el.addEventListener(EventName.mousedown, onMouseStart);
                }
                else {
                    el.addEventListener(EventName.touchstart, onTouchStart);
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
                onMouseWheel: function (e) {
                    _this.renderScale(_this.vueDoc.pageScale - e.deltaY / 1000);
                },
                getTouchOption: function () {
                    return {
                        dragTarget: null,
                        useTouchTwo: true,
                        touchOneCallback: function (kind, poi) {
                            switch (kind) {
                                case TouchKind.START:
                                    var wp = _this.countWebglXY(poi);
                                    _this.mark.poiArrList.push(_this.mark.currLine = [wp.x, wp.y]);
                                    break;
                                case TouchKind.MOVE:
                                    var wp = _this.countWebglXY(poi);
                                    _this.mark.currLine.push(wp.x, wp.y);
                                    _this.mark.renderDirty = true;
                                    break;
                                case TouchKind.END:
                                    _this.mark.currLine = null;
                                    break;
                            }
                        },
                        touchTwoCallback: function (kind, gapW, gapH) {
                            $(_this.canvas).xy($(_this.canvasMark).xy());
                            var _w = $(_this.canvas).w() + gapW;
                            _w = Math.max(_w, 100);
                            _this.renderScale(_this.vueDoc.pageScale * (_w / $(_this.canvas).w()));
                        },
                    };
                },
            }
        });
        this.vueOutline = new Vue({
            data: {
                showContent: false,
                treeData: [],
            },
            methods: {
                getTouchOption: function () {
                    return {
                        dragTarget: this.$el,
                        useTouchTwo: false,
                        touchTwoCallback: null,
                    };
                },
            }
        }).$mount('.outline');
        this.vueLog = new Vue({
            data: {
                showContent: false,
                content: '',
            },
            methods: {
                getTouchOption: function () {
                    return {
                        dragTarget: this.$el,
                        useTouchTwo: false,
                        touchTwoCallback: null,
                    };
                },
            }
        }).$mount('.log');
        this.log('init vue!');
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
    PdfViewer.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.vueLog.content += args.join(' ') + '<br/>';
        if (this.vueLog.showContent) {
            var _content = this.vueLog.$refs.content;
            _content.scrollTo({ left: 0, top: _content.scrollHeight });
        }
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
        $(this.canvas).wh(this.pageWHScale1.x * val, this.pageWHScale1.y * val);
        $(this.canvasMark).wh($(this.canvas).wh());
        this.delayRenderPage(this.vueDoc.pageNum);
    };
    PdfViewer.prototype.delayRenderPage = function (num) {
        this.delayRenderPageNum = num;
        clearTimeout(this.delayRenderPageId);
        this.delayRenderPageId = setTimeout(this._delayRenderPage.bind(this), 3000);
    };
    PdfViewer.prototype._delayRenderPage = function () {
        this.renderPage(this.delayRenderPageNum);
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
                _this.initWhenRenderFirst();
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
    PdfViewer.prototype.initWhenRenderFirst = function () {
        if (this.pageWHScale1) {
            //only run when first
            return;
        }
        this.pageWHScale1 = $(this.canvas).wh();
        $(this.canvasMark).wh($(this.canvas).wh());
        $(this.canvasMark).xy($(this.canvas).xy());
        //
    };
    PdfViewer.prototype.countWebglXY = function (clientXY) {
        console.log("[info]", $(this.canvasMark).y(), ":[$(this.canvasMark).y()]");
        var xy = { x: clientXY.x - $(this.canvasMark).x(), y: clientXY.y - $(this.canvasMark).y() };
        xy.x = xy.x / $(this.canvasMark).w() * 2 - 1;
        xy.y = -(xy.y / $(this.canvasMark).h() * 2 - 1);
        return xy;
    };
    return PdfViewer;
}());
//# sourceMappingURL=PdfViewer.js.map