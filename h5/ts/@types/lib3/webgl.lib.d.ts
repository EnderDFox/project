declare function getWebGLContext(canvas:HTMLCanvasElement):WebGLRenderingContext
declare function initShaders(gl:WebGLRenderingContext, vshader:string, fshader:string):boolean


interface WebGLRenderingContext{
    program:WebGLProgram
}