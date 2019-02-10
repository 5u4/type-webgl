import { GraphicService } from "../services/GraphicService";
import { Point, WebGLPoint } from "../types/Point";

export const transformPixelToWebGLPosition = (p: number, diminsion: number) => {
    return 2 * p / diminsion - 1;
};

export const pointToWebGLPoint = (
    point: Point,
    width = GraphicService.CANVAS_WIDTH,
    height = GraphicService.CANVAS_HEIGHT
): WebGLPoint => {
    return {
        x: transformPixelToWebGLPosition(point.x, width),
        y: - transformPixelToWebGLPosition(point.y, height),
    };
};
