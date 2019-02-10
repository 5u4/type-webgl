import { BACKGROUND_COLOR, BLUE, GREEN, RED } from "../constants/color";
import { GraphicService } from "../services/GraphicService";
import { fshader } from "../shaders/fshader";
import { vshader } from "../shaders/vshader";

export class SceneManager {
    private gl: WebGLRenderingContext;
    private graphic: GraphicService;
    private fps = 10;

    private constructor() { }

    static init() {
        const instance = new SceneManager();

        instance.initWebGL();

        instance.graphic = new GraphicService(instance.gl);

        instance.initProgram();

        return instance;
    }

    render() {
        this.startRender();
    }

    private initWebGL() {
        const canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.gl = canvas.getContext("webgl");
    }

    private initProgram() {
        this.graphic.clearColor(BACKGROUND_COLOR);
        this.graphic.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.graphic.initProgram();

        this.graphic.createShader(this.gl.VERTEX_SHADER, vshader);
        this.graphic.createShader(this.gl.FRAGMENT_SHADER, fshader);

        this.graphic.startProgram();
    }

    private startRender() {
        const frame = () => {
            setTimeout(() => {
                this.renderProcess(frame);
            }, this.calculateTimeout());
        };

        frame();
    }

    private renderProcess(frame: () => void) {
        this.graphic.clear(this.gl.COLOR_BUFFER_BIT);
        window.requestAnimationFrame(frame);

        this.draw();
    }

    private draw() {
        this.graphic.drawTriangleOutline(
            { x: 300, y: 110 },
            { x: 80, y: 490 },
            { x: 520, y: 490 },
            RED,
            GREEN,
            BLUE
        );
    }

    private calculateTimeout() {
        return 1000 / this.fps;
    }
}
