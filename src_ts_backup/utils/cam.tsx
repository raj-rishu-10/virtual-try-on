import * as cam_utils from "@mediapipe/camera_utils";
import type { Camera as CameraType } from "@mediapipe/camera_utils";
const Camera = cam_utils.Camera || (window as any).Camera;
import React from "react";

export const startCamera = (videoRef: HTMLVideoElement, 
  faceMesh: { send: (arg0: { image: HTMLVideoElement; }) => any; },
  cameraRef: React.MutableRefObject<CameraType | null>,
  onError?: (error: any) => void
) => {

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
      } catch (error) {
        console.error("Synchronous error during camera start:", error);
        if (onError) {
          onError(error);
        }
      }
      
      cameraRef.current = camera;

      return () => {
        camera.stop();
      };
  }