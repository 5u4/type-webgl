import { Color, COLOR_RANGE, WebGLColor } from "../types/Color";

export const colorToWebGLColor = (color: Color): WebGLColor => {
    return {
        R: color.R / COLOR_RANGE,
        G: color.G / COLOR_RANGE,
        B: color.B / COLOR_RANGE,
        A: color.A,
    };
};
