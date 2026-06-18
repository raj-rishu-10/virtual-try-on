export const drawBlush = (results, canvas, canvasCtx, color) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        // Using landmarks 205 (Left Cheek) and 425 (Right Cheek)
        const leftCheekPt = landmarks[205] || landmarks[50];
        const rightCheekPt = landmarks[425] || landmarks[280];
        if (!leftCheekPt || !rightCheekPt)
            return;
        const width = canvas.width;
        const height = canvas.height;
        const leftX = leftCheekPt.x * width;
        const leftY = leftCheekPt.y * height;
        const rightX = rightCheekPt.x * width;
        const rightY = rightCheekPt.y * height;
        // Define the blush radius based on face size
        // Distance between cheeks is a good metric
        const faceWidth = Math.abs(rightX - leftX);
        const radiusX = faceWidth * 0.35;
        const radiusY = faceWidth * 0.20;
        canvasCtx.save();
        // Set blending mode
        canvasCtx.globalCompositeOperation = "multiply";
        canvasCtx.globalAlpha = 0.5;
        const drawSoftEllipse = (x, y, rX, rY) => {
            canvasCtx.beginPath();
            canvasCtx.ellipse(x, y, rX, rY, 0, 0, 2 * Math.PI);
            const gradient = canvasCtx.createRadialGradient(x, y, 0, x, y, Math.max(rX, rY));
            gradient.addColorStop(0, color || "#FFCBA4");
            gradient.addColorStop(0.5, (color || "#FFCBA4") + "80"); // 50% opacity
            gradient.addColorStop(1, "transparent");
            canvasCtx.fillStyle = gradient;
            canvasCtx.fill();
        };
        // Add a slight rotation to match cheekbones
        const angle = Math.atan2(rightY - leftY, rightX - leftX);
        // Left cheek
        canvasCtx.save();
        canvasCtx.translate(leftX, leftY);
        canvasCtx.rotate(angle + Math.PI / 8); // Tilted upwards
        canvasCtx.translate(-leftX, -leftY);
        drawSoftEllipse(leftX, leftY, radiusX, radiusY);
        canvasCtx.restore();
        // Right cheek
        canvasCtx.save();
        canvasCtx.translate(rightX, rightY);
        canvasCtx.rotate(angle - Math.PI / 8); // Tilted upwards
        canvasCtx.translate(-rightX, -rightY);
        drawSoftEllipse(rightX, rightY, radiusX, radiusY);
        canvasCtx.restore();
        // Add soft-light layer to make it pop
        canvasCtx.globalCompositeOperation = "soft-light";
        canvasCtx.globalAlpha = 0.3;
        canvasCtx.save();
        canvasCtx.translate(leftX, leftY);
        canvasCtx.rotate(angle + Math.PI / 8);
        canvasCtx.translate(-leftX, -leftY);
        drawSoftEllipse(leftX, leftY, radiusX, radiusY);
        canvasCtx.restore();
        canvasCtx.save();
        canvasCtx.translate(rightX, rightY);
        canvasCtx.rotate(angle - Math.PI / 8);
        canvasCtx.translate(-rightX, -rightY);
        drawSoftEllipse(rightX, rightY, radiusX, radiusY);
        canvasCtx.restore();
        canvasCtx.restore();
    }
};
