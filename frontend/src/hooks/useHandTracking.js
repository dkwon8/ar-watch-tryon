import { useEffect, useRef, useState, useCallback } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

/**
 * React hook that initializes MediaPipe HandLandmarker and runs
 * continuous detection on a video element.
 *
 * Returns the current landmarks, detection status, and performance metrics
 * (FPS, per-frame latency). The hook handles cleanup on unmount.
 */
export function useHandTracking(videoRef) {
  const [landmarks, setLandmarks] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);

  const handLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsIntervalRef = useRef(null);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Load the WASM runtime from Google's CDN
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (cancelled) return;

        // Load the hand landmark detection model
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (cancelled) {
          handLandmarker.close();
          return;
        }

        handLandmarkerRef.current = handLandmarker;
        setIsReady(true);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to initialize MediaPipe:", err);
          setError(err.message);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
        handLandmarkerRef.current = null;
      }
    };
  }, []);

  // FPS counter — updates every second
  useEffect(() => {
    fpsIntervalRef.current = setInterval(() => {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
    }, 1000);

    return () => clearInterval(fpsIntervalRef.current);
  }, []);

  // Detection loop — runs every animation frame (~60fps)
  const detect = useCallback(() => {
    const video = videoRef;
    const handLandmarker = handLandmarkerRef.current;

    if (
      !video ||
      !handLandmarker ||
      video.readyState < 2 ||
      video.videoWidth === 0
    ) {
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const now = performance.now();

    // MediaPipe requires strictly increasing timestamps
    if (now <= lastTimestampRef.current) {
      animationFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const startTime = performance.now();
    const result = handLandmarker.detectForVideo(video, now);
    const endTime = performance.now();

    lastTimestampRef.current = now;
    frameCountRef.current++;
    setLatency(Math.round(endTime - startTime));

    if (result.landmarks && result.landmarks.length > 0) {
      setLandmarks(result.landmarks[0]);
    } else {
      setLandmarks(null);
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  }, [videoRef]);

  // Start/stop detection loop when video and model are ready
  useEffect(() => {
    if (!isReady || !videoRef) return;

    animationFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReady, videoRef, detect]);

  return { landmarks, isReady, fps, latency, error };
}