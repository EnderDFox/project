var MarkWebgl = /** @class */ (function () {
    function MarkWebgl() {
        this.poiArrList = [];
        /**render藏标记 ,确保每个frame仅render一次 */
        this.renderDirty = false;
    }
    MarkWebgl.prototype.init = function (canvas) {
        var _this = this;
        this.canvas = canvas;
        this.canvas.width = 800;
        this.canvas.height = 600;
        var gl = getWebGLContext(canvas);
        initShaders(gl, 'attribute vec4 a_Position;\n' +
            "void main() {\n              gl_Position = a_Position;\n            }", "void main() {\n              gl_FragColor = vec4(1.0, 0.0, 0.0, 0.62);\n            }");
        this.gl = gl;
        //
        var tick = function () {
            if (_this.renderDirty) {
                _this.renderDirty = false;
                _this.render();
            }
            requestAnimationFrame(tick);
        };
        tick();
    };
    MarkWebgl.prototype.getRandomNum = function () {
        return Math.random() * 2 - 1;
    };
    MarkWebgl.prototype.render = function () {
        // Write the positions of vertices to a vertex shader
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        //
        var len = this.poiArrList.length;
        for (var i = 0; i < len; i++) {
            var poiArr = this.poiArrList[i];
            if (poiArr.length > 1) {
                this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.initVertexBuffers(poiArr));
            }
        }
    };
    // Initialize shaders
    MarkWebgl.prototype.initVertexBuffers = function (poiArr) {
        var gl = this.gl;
        var vertixList = new Float32Array(poiArr);
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertixList, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(gl.program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        return vertixList.length / 2;
    };
    return MarkWebgl;
}());
//# sourceMappingURL=MarkWebgl.js.map