import * as fm from '@mediapipe/face_mesh';
import type { FaceMesh as FaceMeshType } from '@mediapipe/face_mesh';
const FaceMesh = fm.FaceMesh || (window as any).FaceMesh;


let faceMeshInstance: FaceMeshType | null = null;

export const getFaceMeshInstance = (onResults: (results: any) => void): FaceMeshType => {
  if (!faceMeshInstance) {
    faceMeshInstance = new FaceMesh({
      locateFile: (file) => `https://mediapipe-spotkwik.s3.ap-south-1.amazonaws.com/mesh/${file}`,
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  // Update the results callback dynamically
  faceMeshInstance.onResults(onResults);

  return faceMeshInstance;
};
