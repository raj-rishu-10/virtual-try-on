export const applyLipstick = (
  maskCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  color: string
) => {
  const lipstickCanvas = document.createElement('canvas');
  lipstickCanvas.width = width;
  lipstickCanvas.height = height;
  const ctx = lipstickCanvas.getContext('2d');
  if (!ctx) return null;

  // Fill the canvas with the lipstick color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Apply the mask
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0, width, height);

  return lipstickCanvas;
};
