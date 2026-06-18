import * as StackBlur from 'stackblur-canvas';
export const createMask = (results, width, height) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        try {
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx)
                return null;
            maskCtx.fillStyle = 'white';
            maskCtx.beginPath();
            const upperLipOuter = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
            const upperLipInner = [308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78];
            const lowerLipOuter = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
            const lowerLipInner = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];
            const drawPath = (indices) => {
                indices.forEach((i, idx) => {
                    const pt = landmarks[i];
                    if (idx === 0)
                        maskCtx.moveTo(pt.x * width, pt.y * height);
                    else
                        maskCtx.lineTo(pt.x * width, pt.y * height);
                });
            };
            // Draw Upper Lip
            drawPath(upperLipOuter);
            drawPath(upperLipInner);
            maskCtx.closePath();
            maskCtx.fill();
            // Draw Lower Lip
            maskCtx.beginPath();
            drawPath(lowerLipOuter);
            drawPath(lowerLipInner);
            maskCtx.closePath();
            maskCtx.fill();
            // Apply blur to smooth edges
            const imageData = maskCtx.getImageData(0, 0, width, height);
            StackBlur.imageDataRGBA(imageData, 0, 0, width, height, 5);
            maskCtx.putImageData(imageData, 0, 0);
            return maskCanvas;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    return null;
};
