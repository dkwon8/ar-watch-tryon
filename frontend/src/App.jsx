import React, { useRef, useEffect, useState } from "react";
import { useHandTracking } from "./hooks/useHandTracking.js";

export default function App() {
  const videoRef = useRef(null);
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setVideoElement(videoRef.current);
      }
    }
    startCamera();
  }, []);

  const { landmarks, isReady, fps, latency, error } = useHandTracking(videoElement);

  return (
    <div style={{ background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh", padding: 20 }}>
      <h1>Phase 3: Hand Tracking Test</h1>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: 640, transform: "scaleX(-1)" }} />
      <div style={{ marginTop: 12, fontFamily: "monospace" }}>
        <p>Model Ready: {isReady ? "✅ Yes" : "⏳ Loading..."}</p>
        <p>FPS: {fps}</p>
        <p>Latency: {latency}ms</p>
        <p>Hand Detected: {landmarks ? "✅ Yes" : "❌ No"}</p>
        {landmarks && (
          <p>Wrist Position: x={landmarks[0].x.toFixed(3)}, y={landmarks[0].y.toFixed(3)}</p>
        )}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>
    </div>
  );
}