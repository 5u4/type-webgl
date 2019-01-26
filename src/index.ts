import { WebGLService } from "./services/WebGLService";
import { fshader } from "./shaders/fshader.js";
import { vshader } from "./shaders/vshader.js";

const init = () => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    const webGLService = new WebGLService(gl);

    webGLService.clearColor(1, 1, 1, 1);
    webGLService.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = webGLService.initShader(gl.VERTEX_SHADER, vshader);
    const fragmentShader = webGLService.initShader(gl.FRAGMENT_SHADER, fshader);

    webGLService.initProgram();
    webGLService.attachShaderToProgram(vertexShader);
    webGLService.attachShaderToProgram(fragmentShader);
    webGLService.linkProgram();

    const vertices = [
        0.0, 0.5, 1.0, 1.0, 0.0,
        -0.5, -0.5, 1.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 1.0,
    ];

    webGLService.initBuffer(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    webGLService.attribPointer("vertPosition", 2, gl.FLOAT, false, 5, 0);
    webGLService.attribPointer("vertColor", 3, gl.FLOAT, false, 5, 2);

    webGLService.useProgram();

    webGLService.drawArrays(gl.TRIANGLES, 0, 3);
};

init();
