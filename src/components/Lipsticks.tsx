import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import { drawLipstick } from "../utils/drawing/lipstickOverride/draw";

const LIPSTICK_SHADES = [
  { name: "Ruby Red", color: "#8d1810" },
  { name: "Soft Pink", color: "#d67c8b" },
  { name: "Deep Plum", color: "#4a1226" },
  { name: "Coral Reef", color: "#e36e5c" },
  { name: "Nude Peach", color: "#cca799" },
];

const Lipsticks: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedShade, setSelectedShade] = useState(LIPSTICK_SHADES[0]);

  // We use a ref to hold the current selected color, so the mediaPipe callback always gets the latest
  const colorRef = useRef(selectedShade.color);
  useEffect(() => {
    colorRef.current = selectedShade.color;
  }, [selectedShade]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

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

    const processResults = (results: { multiFaceLandmarks: any[][] }) => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the live video first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Then apply the lipstick effect using the current color from ref
      drawLipstick(results, canvas, ctx, colorRef.current);
    };

    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      processResults,
      (res, can, ctx) => drawLipstick(res, can, ctx, colorRef.current)
    );

    startCamera(videoRef.current, faceMesh, cameraRef, (err) => {
      setCameraError(err.message || "Requested device not found");
      setIsLoading(false);
    });

    videoRef.current.addEventListener("loadedmetadata", handleVideoMetadata);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoMetadata);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] max-w-6xl mx-auto flex flex-col md:flex-row">
      {/* Video Container */}
      <div className="relative flex-grow h-full rounded overflow-hidden shadow-lg border border-gray-100">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <video ref={videoRef} className="hidden" autoPlay muted playsInline />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 p-8 text-center z-30">
            <h3 className="text-2xl text-amber-100 mb-3">Camera Access Needed</h3>
            <p className="text-sm text-stone-300 max-w-md mb-8 leading-relaxed">
              We couldn't access your webcam.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#C09D7C] hover:bg-[#a88463] text-white rounded-full font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Shade Selector Sidebar */}
      <div className="w-full md:w-80 bg-white shadow-xl flex flex-col p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lipsticks</h2>
        <p className="text-gray-500 mb-8">Try our premium shades instantly</p>

        <div className="flex-1 space-y-4">
          {LIPSTICK_SHADES.map((shade) => (
            <button
              key={shade.name}
              onClick={() => setSelectedShade(shade)}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedShade.name === shade.name
                  ? "border-custom-blue bg-blue-50 shadow-md transform scale-105"
                  : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className="w-10 h-10 rounded-full shadow-inner border border-gray-200"
                style={{ backgroundColor: shade.color }}
              ></div>
              <span className="ml-4 font-semibold text-gray-700 text-lg">
                {shade.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lipsticks;
