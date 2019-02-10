import { LinkProgramError } from "../exceptions/LinkProgramError";
import { ShaderComileError } from "../exceptions/ShaderComileError";
import { colorToWebGLColor } from "../transformers/color";
import { pointToWebGLPoint } from "../transformers/point";
import { Color, DEFAULT_COLOR_ALPHA } from "../types/Color";
import { Point } from "../types/Point";

export class GraphicService {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;

    static readonly CANVAS_WIDTH = 600;
    static readonly CANVAS_HEIGHT = 600;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    //#region WebGL Initializations

    clearColor(color: Color) {
        const webglColor = colorToWebGLColor(color);

        this.gl.clearColor(
            webglColor.R, webglColor.G, webglColor.B,
            webglColor.A || DEFAULT_COLOR_ALPHA
        );
    }

    clear(mask: GLbitfield) {
        this.gl.clear(mask);
    }

    createShader(type: GLenum, source: string) {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new ShaderComileError(this.gl.getShaderInfoLog(shader));
        }

        this.gl.attachShader(this.program, shader);
    }

    initProgram() {
        this.program = this.gl.createProgram();
    }

    startProgram() {
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new LinkProgramError(this.gl.getProgramInfoLog(this.program));
        }

        this.gl.useProgram(this.program);
    }

    //#endregion

    //#region Drawings

    drawLine(from: Point, to: Point, color: Color) {
        const webglColor = colorToWebGLColor(color);
        const webglFrom = pointToWebGLPoint(from);
        const webglTo = pointToWebGLPoint(to);

        const lineVerticies = [
            webglFrom.x, webglFrom.y, webglColor.R, webglColor.G, webglColor.B,
            webglTo.x, webglTo.y, webglColor.R, webglColor.G, webglColor.B,
        ];

        this.drawPrepare(lineVerticies);

        this.gl.drawArrays(this.gl.LINES, 0, 2);
    }

    drawTriangleOutline(p1: Point, p2: Point, p3: Point, c1: Color, c2 = c1, c3 = c2) {
        this.drawTrianglePrepare(p1, p2, p3, c1, c2, c3);

        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 3);
    }

    drawTriangle(p1: Point, p2: Point, p3: Point, c1: Color, c2 = c1, c3 = c2) {
        this.drawTrianglePrepare(p1, p2, p3, c1, c2, c3);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    //#endregion

    //#region Helpers

    private drawPrepare(vertices: number[]) {
        this.initBuffer(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        this.attribPointer("vertPosition", 2, 5, 0);
        this.attribPointer("vertColor", 3, 5, 2);
    }

    private drawTrianglePrepare(p1: Point, p2: Point, p3: Point, c1: Color, c2 = c1, c3 = c2) {
        const webglC1 = colorToWebGLColor(c1);
        const webglC2 = colorToWebGLColor(c2);
        const webglC3 = colorToWebGLColor(c3);

        const webglP1 = pointToWebGLPoint(p1);
        const webglP2 = pointToWebGLPoint(p2);
        const webglP3 = pointToWebGLPoint(p3);

        const verticies = [
            webglP1.x, webglP1.y, webglC1.R, webglC1.G, webglC1.B,
            webglP2.x, webglP2.y, webglC2.R, webglC2.G, webglC2.B,
            webglP3.x, webglP3.y, webglC3.R, webglC3.G, webglC3.B,
        ];

        this.drawPrepare(verticies);
    }

    private initBuffer(target: GLenum, data: number[], usage: GLenum) {
        const buffer = this.gl.createBuffer();

        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, new Float32Array(data), usage);

        return buffer;
    }

    private attribPointer(name: string, size: GLint, stride: GLsizei, offset: GLintptr) {
        const index = this.gl.getAttribLocation(this.program, name);

        stride *= Float32Array.BYTES_PER_ELEMENT;
        offset *= Float32Array.BYTES_PER_ELEMENT;

        this.gl.vertexAttribPointer(index, size, this.gl.FLOAT, false, stride, offset);

        this.gl.enableVertexAttribArray(index);
    }

    //#endregion
}
