import { LinkProgramError } from "../exceptions/LinkProgramError";
import { ShaderCompileError } from "../exceptions/ShaderCompileError";
import { WebGLNotFoundError } from "../exceptions/WebGLNotFoundError";

export class WebGLService {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;

    constructor(gl: WebGLRenderingContext) {
        if (!gl) {
            throw new WebGLNotFoundError();
        }

        this.gl = gl;
    }

    clearColor(r: number, g: number, b: number, a: number) {
        this.gl.clearColor(r, g, b, a);
    }

    clear(mask: number) {
        this.gl.clear(mask);
    }

    initShader(type: GLenum, source: string) {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new ShaderCompileError();
        }

        return shader;
    }

    initProgram() {
        const program = this.gl.createProgram();

        this.program = program;

        return program;
    }

    attachShaderToProgram(shader: WebGLShader) {
        this.attachShader(this.program, shader);
    }

    attachShader(program: WebGLProgram, shader: WebGLShader) {
        this.gl.attachShader(program, shader);
    }

    linkProgram() {
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new LinkProgramError();
        }
    }

    initBuffer(target: number, data: number[], usage: number) {
        const buffer = this.createBuffer();
        this.bindBuffer(target, buffer);
        this.bufferData(target, data, usage);
        return buffer;
    }

    createBuffer() {
        return this.gl.createBuffer();
    }

    bindBuffer(target: number, buffer: WebGLBuffer) {
        this.gl.bindBuffer(target, buffer);
    }

    bufferData(target: number, data: number[], usage: number) {
        this.gl.bufferData(target, new Float32Array(data), usage);
    }

    /**
     * GetAttribLocation
     * vertexAttribPointer
     * EnableVertexAttribArray
     */
    attribPointer(
        name: string,
        size: number,
        type: number,
        normalized: boolean,
        stride: number,
        offset: number,
        isByByte = false
    ) {
        const index = this.getAttribLocation(name);
        this.vertexAttribPointer(index, size, type, normalized, stride, offset, isByByte);
        this.enableVertexAttribArray(index);
    }

    getAttribLocation(name: string) {
        return this.gl.getAttribLocation(this.program, name);
    }

    vertexAttribPointer(
        index: number,
        size: number,
        type: number,
        normalized: boolean,
        stride: number,
        offset: number,
        isByByte = false
    ) {
        if (isByByte === false) {
            stride *= Float32Array.BYTES_PER_ELEMENT;
            offset *= Float32Array.BYTES_PER_ELEMENT;
        }

        this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    }

    enableVertexAttribArray(index: number) {
        this.gl.enableVertexAttribArray(index);
    }

    useProgram(program?: WebGLProgram) {
        if (!program) {
            program = this.program;
        }

        this.gl.useProgram(program);
    }

    drawArrays(mode: number, first: number, count: number) {
        this.gl.drawArrays(mode, first, count);
    }
}
