import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import TryOnLayout from "./TryOnLayout";
import Navbar from "./Navbar";

const JEWELLERY_ITEMS = [
  { name: "Gold Necklace", color: "#FFD700" },
  { name: "Silver Choker", color: "#C0C0C0" },
  { name: "Diamond Drop", color: "#E0F7FA" },
  { name: "Ruby Pendant", color: "#E0115F" },
  { name: "Emerald Studs", color: "#50C878" },
];

const OTHER_CATEGORIES = [
  { name: "Lipstick", path: "/lipsticks" },
  { name: "Foundation", path: "/foundation-shades" },
  { name: "Blush", path: "/blush" },
];

const Jewellery: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState(JEWELLERY_ITEMS[0]);

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // TODO: Implement Jewellery specific drawing logic here
    };

    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      processResults,
      () => {} // Empty draw function for now
    );

    startCamera(videoRef.current, faceMesh, cameraRef, (err) => {
      setCameraError(err.message || "Requested device not found");
      setIsLoading(false);
    });

    const videoElement = videoRef.current;
    videoElement.addEventListener("loadedmetadata", handleVideoMetadata);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadedmetadata", handleVideoMetadata);
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <TryOnLayout
        titleText="Jewellery"
        selectionTitle="Select Jewellery:"
        items={JEWELLERY_ITEMS}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        otherCategories={OTHER_CATEGORIES}
        renderItem={(item, isSelected) => (
          <div className={`p-[2px] rounded-full border-2 ${isSelected ? 'border-custom-blue' : 'border-transparent hover:border-gray-300'}`}>
             <div className="w-10 h-10 rounded-full shadow-inner border border-gray-100 flex items-center justify-center font-bold text-[10px] text-center" style={{ backgroundColor: item.color }} title={item.name}>
               {item.name.substring(0,2)}
             </div>
          </div>
        )}
      >
        <canvas ref={canvasRef} className="w-full h-full object-cover absolute top-0 left-0 rounded-2xl" />
        <video ref={videoRef} className="hidden" autoPlay muted playsInline />
        {isLoading && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-2xl z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue"></div>
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center z-30 rounded-2xl">
            <h3 className="text-xl text-gray-800 font-bold mb-2">Camera Access Needed</h3>
            <p className="text-sm text-gray-500 mb-6">We couldn't access your webcam.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-custom-blue text-white rounded-lg font-semibold">Try Again</button>
          </div>
        )}
      </TryOnLayout>
    </>
  );
};

export default Jewellery;
