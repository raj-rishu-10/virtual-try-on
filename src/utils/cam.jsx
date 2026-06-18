const Camera = window.Camera;
export const startCamera = (videoRef, faceMesh, cameraRef, onError) => {
    const camera = new Camera(videoRef, {
        onFrame: async () => {
            await faceMesh.send({ image: videoRef });
        },
        width: 640,
        height: 480,
    });
    try {
        camera.start().catch((error) => {
            console.error("Camera failed to start:", error);
            if (onError) {
                onError(error);
            }
        });
    }
    catch (error) {
        console.error("Synchronous error during camera start:", error);
        if (onError) {
            onError(error);
        }
    }
    cameraRef.current = camera;
    return () => {
        camera.stop();
    };
};
