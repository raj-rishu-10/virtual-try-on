// src/components/FaceMesh.tsx
import React, { useEffect, useRef } from "react";
const Camera = window.Camera;
import { getFaceMeshInstance } from "../utils/mediapipe";
const FaceMesh = ({ onResults }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    useEffect(() => {
        if (!videoRef.current || !canvasRef.current)
            return;
        const canvasCtx = canvasRef.current.getContext("2d");
        console.log("onResults");
        const faceMesh = buildFaceMeshes(onResults);
        // Initialize and start the camera
        startCamera(videoRef.current, faceMesh);
    }, [onResults]);
    const buildFaceMeshes = (onResults) => {
        return getFaceMeshInstance((results) => {
            if (!videoRef.current || !canvasRef.current)
                return;
            const canvasCtx = canvasRef.current.getContext("2d");
            if (canvasCtx && videoRef.current && canvasRef.current) {
                canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                // Draw the landmarks
                drawLandmarks(results, canvasRef.current, canvasCtx);
                if (onResults)
                    onResults(results);
            }
        });
    };
    const startCamera = (videoRef, faceMesh) => {
        const camera = new Camera(videoRef, {
            onFrame: async () => {
                await faceMesh.send({ image: videoRef });
            },
            width: 640,
            height: 480,
        });
        camera.start().catch((err) => {
            console.error("Camera failed to start in FaceLandmark:", err);
        });
        cameraRef.current = camera;
        return () => {
            camera.stop();
        };
    };
    const drawLandmarks = (results, canvasRef, canvasCtx) => {
        if (results.multiFaceLandmarks) {
            results.multiFaceLandmarks.forEach((landmarks) => {
                canvasCtx.fillStyle = "red";
                landmarks.forEach((landmark) => {
                    const x = landmark.x * canvasRef.width;
                    const y = landmark.y * canvasRef.height;
                    canvasCtx.beginPath();
                    canvasCtx.arc(x, y, 2, 0, 2 * Math.PI);
                    canvasCtx.fill();
                });
            });
        }
    };
    return (<div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video ref={videoRef} className="face-mesh-video" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }} autoPlay muted playsInline/>
      <canvas ref={canvasRef} className="face-mesh-canvas" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }} width="640" height="480"/>
    </div>);
};
export default FaceMesh;
