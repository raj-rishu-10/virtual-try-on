import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import { drawFoundation } from "../utils/drawing/foundationOverride/draw";
import logo from "../images/omnia_logo.png";
import droplets from "../images/droplets.png";
import productImage from "../images/soul_serum.png";
import { Check, Info, Sparkles, BookOpen } from "lucide-react";

interface FaceMeshProps {
  onResults?: (results: any) => void;
}

const SoulSerumAR: React.FC<FaceMeshProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const selectedColorRef = useRef("#E8BE93");
  const [isLoading, setIsLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderPositionRef = useRef(50);
  const [isDragging, setIsDragging] = useState(false);
  const resultsRef = useRef<any>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const dropletImageRef = useRef<HTMLImageElement | null>(null);
  const productImageRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const onResultsRef = useRef(onResults);

  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  // Product information - enhanced with more details from Pure Mana Hawaii
  const productInfo = {
    name: "Soul Serum",
    subtitle: "Illuminating Facial Serum",
    description:
      "A lightweight, hydrating formula that evens skin tone and provides a natural glow. Infused with Hawaiian botanicals and antioxidants.",
    fullDescription:
      "Our Soul Serum is a lightweight, illuminating facial serum formulated with Hawaiian-grown botanicals. This multi-tasking serum hydrates, brightens, and delivers powerful antioxidants to protect against environmental stressors.",
    benefits: [
      "Instant Natural Glow",
      "Even Skin Tone & Texture",
      "Deeply Hydrating Formula",
      "Hawaiian Botanical Ingredients",
      "Cruelty-Free & Vegan",
    ],
    ingredients:
      "Aqua, Aloe Barbadensis Leaf Juice*, Glycerin*, Niacinamide, Propanediol, Sodium Hyaluronate, Hawaiian Sandalwood Extract*, Kukui Nut Oil*, Hawaiian Honey*, Vitamin E...",
    howToUse:
      "Apply 2-3 drops to cleansed skin morning and night. Gently press into face, neck, and décolletage. Follow with moisturizer.",
    price: "$138.00",
    size: "30 ml / 1 fl oz",
    shopifyLink: "https://www.puremanahawaii.com/products/soul-serum",
  };



  // Preload all images
  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = logo;
    logoImage.onload = () => {
      logoImageRef.current = logoImage;
      checkImagesLoaded();
    };

    const dropletImage = new Image();
    dropletImage.src = droplets;
    dropletImage.onload = () => {
      dropletImageRef.current = dropletImage;
      checkImagesLoaded();
    };

    const productImg = new Image();
    productImg.src = productImage;
    productImg.onload = () => {
      productImageRef.current = productImg;
      checkImagesLoaded();
    };

    function checkImagesLoaded() {
      if (
        logoImageRef.current &&
        dropletImageRef.current &&
        productImageRef.current
      ) {
        setImagesLoaded(true);
      }
    }
  }, []);

  // Main drawing function
  const drawSplitCanvas = (results: { multiFaceLandmarks: any[][] }) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const splitPosition = (sliderPositionRef.current / 100) * canvas.width;

    // Clear the canvas and draw the video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Draw the serum effect (right side) using foundation logic
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitPosition, 0, canvas.width - splitPosition, canvas.height);
    ctx.clip();
    drawFoundation(results, canvas, ctx, selectedColorRef.current + "FF");
    ctx.restore();

    // Draw the before/after slider line
    ctx.beginPath();
    ctx.moveTo(splitPosition, 0);
    ctx.lineTo(splitPosition, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Draw handle with shadow for better visibility
    const handleRadius = Math.min(15, canvas.width * 0.025);
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.arc(splitPosition, canvas.height / 2, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F1C27D"; // Changed to match Soul Serum color
    ctx.stroke();

    // Draw slider arrows inside the handle
    ctx.beginPath();
    ctx.moveTo(splitPosition - 6, canvas.height / 2);
    ctx.lineTo(splitPosition - 2, canvas.height / 2 - 4);
    ctx.lineTo(splitPosition - 2, canvas.height / 2 + 4);
    ctx.moveTo(splitPosition + 6, canvas.height / 2);
    ctx.lineTo(splitPosition + 2, canvas.height / 2 - 4);
    ctx.lineTo(splitPosition + 2, canvas.height / 2 + 4);
    ctx.fillStyle = "#F1C27D"; // Changed to match Soul Serum color
    ctx.fill();

    // Draw responsive droplet watermark
    // if (dropletImageRef.current) {
    //   // More responsive sizing based on the smaller of width or height
    //   const minDimension = Math.min(canvas.width, canvas.height);
    //   const dropletSize = Math.max(minDimension * 0.1, 40); // Minimum size of 40px, scales with screen

    //   // Padding that scales with screen size, with minimum/maximum limits
    //   const padPercentage = 0.02; // 2% of canvas size
    //   const pad = Math.max(10, Math.min(20, canvas.width * padPercentage));

    //   ctx.save();
    //   ctx.globalAlpha = 0.85;
    //   ctx.drawImage(
    //     dropletImageRef.current,
    //     canvas.width - dropletSize - pad,
    //     pad,
    //     dropletSize,
    //     dropletSize
    //   );
    //   ctx.restore();
    // }
    // In your drawSplitCanvas function (foundationOverride.tsx or SoulSerumAR component)
    if (dropletImageRef.current) {
      const dropletSize = Math.min(canvas.width * 0.15, 120);
      const pad = Math.min(canvas.width * 0.02, 15);
      // Add an offset (e.g. 20px) to move the droplet image down
      const dropletYOffset = pad + 35;
      ctx.drawImage(
        dropletImageRef.current,
        canvas.width - dropletSize - pad,
        dropletYOffset,
        dropletSize,
        dropletSize
      );
    }
  };

  // Throttle slider updates with requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number | null = null;
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !canvasRef.current) return;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const newPos = Math.max(
          0,
          Math.min(100, ((clientX - rect.left) / rect.width) * 100)
        );
        sliderPositionRef.current = newPos;
        setSliderPosition(newPos);
        if (resultsRef.current) drawSplitCanvas(resultsRef.current);
        animationFrameId = null;
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("touchmove", handleMouseMove as any);
    const sliderEl = sliderRef.current;
    if (sliderEl) {
      sliderEl.addEventListener("mousedown", handleMouseDown);
      sliderEl.addEventListener("touchstart", handleMouseDown);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("touchmove", handleMouseMove as any);
      if (sliderEl) {
        sliderEl.removeEventListener("mousedown", handleMouseDown);
        sliderEl.removeEventListener("touchstart", handleMouseDown);
      }
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  // Set up video, canvas dimensions, and face mesh processing
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const handleMetadata = () => {
      if (!videoRef.current || !canvasRef.current) return;

      // Set canvas dimensions to match video dimensions exactly
      const vw = videoRef.current.videoWidth;
      const vh = videoRef.current.videoHeight;

      if (vw && vh) {
        canvasRef.current.width = vw;
        canvasRef.current.height = vh;

        // Update container styles to maintain aspect ratio
        updateCanvasContainerStyles(vw, vh);
        setVideoLoaded(true);
        setIsLoading(false);
      }
    };

    const processResults = (results: { multiFaceLandmarks: any[][] }) => {
      resultsRef.current = results;
      if (onResultsRef.current) onResultsRef.current(results);
      drawSplitCanvas(results);
    };

    // Listen for metadata to get video dimensions
    videoRef.current.addEventListener("loadedmetadata", handleMetadata);

    // Build face mesh
    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      processResults,
      drawFoundation,
      selectedColorRef.current
    );

    // Start camera
    const stopCamera = startCamera(videoRef.current, faceMesh, cameraRef, (err) => {
      setCameraError(err.message || "Requested device not found");
      setIsLoading(false);
    });

    const videoElement = videoRef.current;
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadedmetadata", handleMetadata);
      }
      if (stopCamera) {
        stopCamera();
      }
    };
  }, []);

  // Update canvas container styles to maintain video aspect ratio
  const updateCanvasContainerStyles = (
    videoWidth: number,
    videoHeight: number
  ) => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const container = canvasContainerRef.current;
    const containerWidth = container.clientWidth;

    // Calculate height based on video aspect ratio
    const aspectRatio = videoHeight / videoWidth;
    const heightValue = containerWidth * aspectRatio;

    // Set container height to maintain aspect ratio
    container.style.height = `${heightValue}px`;

    // Set canvas CSS dimensions to fill container while maintaining aspect ratio
    canvasRef.current.style.width = "100%";
    canvasRef.current.style.height = "100%";
    canvasRef.current.style.objectFit = "cover";
  };

  // Handle window resize responsively
  useEffect(() => {
    if (!videoLoaded) return;

    const handleResize = () => {
      if (
        videoRef.current &&
        videoRef.current.videoWidth &&
        videoRef.current.videoHeight
      ) {
        updateCanvasContainerStyles(
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        if (resultsRef.current) drawSplitCanvas(resultsRef.current);
      }
    };

    // Initial sizing
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [videoLoaded]);

  return (
    <div className="bg-white min-h-screen w-full py-4 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full items-stretch">
          {/* AR Card Section */}
          <div className="w-full lg:w-3/5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between relative border border-stone-100">
            <div
              ref={canvasContainerRef}
              className="relative w-full"
              style={{ aspectRatio: videoLoaded ? "auto" : "16/9" }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
              />
              {!cameraError && (
                <div
                  ref={sliderRef}
                  className="absolute top-0 bottom-0 w-8 z-10 cursor-ew-resize"
                  style={{
                    left: `calc(${sliderPosition}% - 16px)`,
                    touchAction: "none",
                  }}
                />
              )}
              {(isLoading || !imagesLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl z-20">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#C09D7C]"></div>
                </div>
              )}
              {!cameraError && (
                <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 flex justify-between z-20">
                  <div className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm md:text-base font-light tracking-wide">
                    Before
                  </div>
                  <div className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm md:text-base font-light tracking-wide">
                    After
                  </div>
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 backdrop-blur-md text-white p-8 text-center rounded-2xl z-30 transition-all duration-500">
                  <div className="bg-amber-500/10 p-5 rounded-full mb-6 border border-amber-500/30 animate-pulse">
                    <svg
                      className="w-10 h-10 text-[#C09D7C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-wide text-amber-100 mb-3">Camera Access Needed</h3>
                  <p className="text-sm text-stone-300 max-w-md mb-8 leading-relaxed">
                    {cameraError === "Requested device not found" || cameraError.includes("device not found")
                      ? "No camera device was detected on your system. Please connect a webcam or access this experience from a mobile device."
                      : "We couldn't access your webcam. Please grant camera permission in your browser's address bar and close other apps using the camera."}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-[#C09D7C] hover:bg-[#a88463] text-stone-900 font-bold uppercase tracking-wider text-xs rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Watermark overlay */}
            <div
              className="absolute bottom-2 left-2 z-40 flex items-center space-x-2 bg-white/55 px-2 py-1 rounded shadow-sm
                sm:px-3 sm:py-1 md:px-4 md:py-2"
            >
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800">
                Powered by
              </span>
              <img
                src={logo}
                alt="Omnia Logo"
                className="h-6 sm:h-8 md:h-10 object-contain"
              />
            </div>

            {/* Hidden video element */}
            <video
              ref={videoRef}
              className="hidden"
              autoPlay
              muted
              playsInline
              style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            />
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-2/5 flex flex-col justify-between bg-stone-50/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-stone-200/60 shadow-lg">
            <div>
              {/* Brand & Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#a88463]">Pure Mana Hawaii</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <Sparkles className="w-3 h-3 mr-1" /> Best Seller
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-1">
                {productInfo.name}
              </h1>
              <p className="text-xs italic text-stone-500 mb-6">{productInfo.subtitle}</p>

              {/* Price & Size */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl font-bold text-stone-900">{productInfo.price}</span>
                <span className="text-xs text-stone-400">/ {productInfo.size}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                {productInfo.description}
              </p>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">Key Benefits</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  {productInfo.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* tabs or accordion for How to Use / Ingredients */}
              <div className="border-t border-stone-200 pt-6 mt-6 space-y-4">
                <details className="group" open>
                  <summary className="flex justify-between items-center font-semibold text-sm text-stone-800 cursor-pointer list-none">
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#a88463]" /> How To Use</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed pl-6">
                    {productInfo.howToUse}
                  </p>
                </details>

                <details className="group border-t border-stone-100 pt-3">
                  <summary className="flex justify-between items-center font-semibold text-sm text-stone-800 cursor-pointer list-none">
                    <span className="flex items-center gap-2"><Info className="w-4 h-4 text-[#a88463]" /> Ingredients</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed pl-6 max-h-24 overflow-y-auto">
                    {productInfo.ingredients}
                  </p>
                </details>
              </div>
            </div>

            {/* Shop Button */}
            <div className="mt-8 border-t border-stone-200 pt-6">
              <a
                href={productInfo.shopifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#C09D7C] hover:bg-[#a88463] text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                Buy on Pure Mana Hawaii
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulSerumAR;
