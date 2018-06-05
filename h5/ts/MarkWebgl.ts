class MarkWebgl {
    canvas:HTMLCanvasElement
    gl: WebGLRenderingContext
    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.canvas.width = 800
        this.canvas.height = 600
        var gl = getWebGLContext(canvas);
        console.log("[info]", gl, ":[gl]")
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        if (!initShaders(gl, 'attribute vec4 a_Position;\n' +
        'void main() {\n' +
        '  gl_Position = a_Position;\n' +
        '}\n', 'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 0.0, 0.0, 0.62);\n' +
        '}\n')) {
            console.log('Failed to intialize shaders.');
            return;
        }
        // Write the positions of vertices to a vertex shader
        var n = this.initVertexBuffers(gl);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // Specify the color for clearing <canvas>
        gl.clearColor(0, 0, 0, 0);
        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Draw the rectangle
        gl.drawArrays(gl.LINE_STRIP, 0, n);
        //
        this.gl = gl
        //
    }
    // Initialize shaders
    initVertexBuffers(gl: WebGLRenderingContext) {
        var g1: WebGLRenderbuffer
        var vertices = new Float32Array([
            0, 0.5, -0.5, -0.5, 0.5, -0.5
        ]);
        var n = 3; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        return n;
    }
}