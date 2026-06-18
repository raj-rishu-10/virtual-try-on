import React, { useEffect, useRef, useState } from "react";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import { drawSoulSerum } from "../utils/drawing/serum/drawSoulSerum";
const SoulSerumAR = ({ onResults }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cameraError, setCameraError] = useState(null);
    // For optional before/after slider, see your existing approach
    // or omit if you just want a single full-face effect.
    useEffect(() => {
        if (!videoRef.current || !canvasRef.current)
            return;
        const updateCanvasDimensions = () => {
            if (videoRef.current && canvasRef.current) {
                const videoWidth = videoRef.current.videoWidth || 640;
                const videoHeight = videoRef.current.videoHeight || 480;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
            }
        };
        const handleVideoMetadata = () => {
            updateCanvasDimensions();
            setIsLoading(false);
        };
        const processResults = (results) => {
            // call your drawing function
            if (!canvasRef.current || !videoRef.current)
                return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx)
                return;
            // Draw the live video first
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            // Then apply the watery glow effect
            drawSoulSerum(results, canvas, ctx);
            // If needed, pass results up to parent
            if (onResults)
                onResults(results);
        };
        // Build your Face Mesh detection pipeline
        const faceMesh = buildFaceMeshes(canvasRef.current, videoRef.current, processResults, drawSoulSerum, "" // no color param needed
        );
        // Start the camera
        startCamera(videoRef.current, faceMesh, cameraRef, (err) => {
            setCameraError(err.message || "Requested device not found");
            setIsLoading(false);
        });
        // Listen for video loaded
        videoRef.current.addEventListener("loadedmetadata", handleVideoMetadata);
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener("loadedmetadata", handleVideoMetadata);
            }
        };
    }, []);
    return (<div className="relative w-full h-[calc(100vh-80px)] max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">
        Soul Serum Watery Glow Try-On
      </h1>
      <div className="relative w-full h-full rounded overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" style={{ position: "absolute", top: 0, left: 0 }}/>
        <video ref={videoRef} className="hidden" autoPlay muted playsInline/>
        {isLoading && (<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>)}
        {cameraError && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 backdrop-blur-md text-white p-8 text-center rounded-2xl z-30 transition-all duration-500">
            <div className="bg-amber-500/10 p-5 rounded-full mb-6 border border-amber-500/30 animate-pulse">
              <svg className="w-10 h-10 text-[#C09D7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold tracking-wide text-amber-100 mb-3">Camera Access Needed</h3>
            <p className="text-sm text-stone-300 max-w-md mb-8 leading-relaxed">
              {cameraError === "Requested device not found" || cameraError.includes("device not found")
                ? "No camera device was detected on your system. Please connect a webcam or access this experience from a mobile device."
                : "We couldn't access your webcam. Please grant camera permission in your browser's address bar and close other apps using the camera."}
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#C09D7C] hover:bg-[#a88463] text-stone-900 font-bold uppercase tracking-wider text-xs rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Try Again
            </button>
          </div>)}
      </div>
    </div>);
};
export default SoulSerumAR;
