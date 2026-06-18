import { createMask } from "./createMask";
import { applyLipstick } from "./applyLipstick";

export const drawLipstick = (
  results: { multiFaceLandmarks: any[][] },
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  color?: string
) => {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const maskCanvas = createMask(results, canvasCtx.canvas.width, canvasCtx.canvas.height);
    if (maskCanvas) {
      const lipstickCanvas = applyLipstick(
        maskCanvas,
        canvasCtx.canvas.width,
        canvasCtx.canvas.height,
        color || "#ff0000"
      );
      if (lipstickCanvas) {
        canvasCtx.globalCompositeOperation = "multiply";
        canvasCtx.globalAlpha = 0.55; 
        canvasCtx.drawImage(lipstickCanvas, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
        
        // Add a slight soft-light layer to bring back some highlights
        canvasCtx.globalCompositeOperation = "soft-light";
        canvasCtx.globalAlpha = 0.3;
        canvasCtx.drawImage(lipstickCanvas, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

        canvasCtx.globalCompositeOperation = "source-over";
        canvasCtx.globalAlpha = 1.0;
      }
    }
  }
};
