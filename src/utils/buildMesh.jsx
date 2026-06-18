import { getFaceMeshInstance } from "../utils/mediapipe";
export const buildFaceMeshes = (canvasRef, videoRef, onResults, drawFunction, color) => {
    return getFaceMeshInstance((results) => {
        if (!videoRef || !canvasRef)
            return;
        const canvasCtx = canvasRef.getContext("2d");
        if (canvasCtx && videoRef && canvasRef) {
            canvasCtx.clearRect(0, 0, canvasRef.width, canvasRef.height);
            canvasCtx.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
            canvasCtx.fillStyle = "#8d1810";
            canvasCtx.strokeStyle = "#ffffff08";
            // ctx.globalCompositeOperation = "lighter";
            // canvasCtx.globalAlpha = 0.4;
            console.log(color);
            drawFunction(results, canvasRef, canvasCtx, color);
            if (onResults)
                onResults(results);
        }
    });
};
