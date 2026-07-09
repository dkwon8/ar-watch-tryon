import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ProceduralWatch from "./components/ProceduralWatch.jsx";
import WATCH_CATALOG from "./data/watchCatalog.js";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const watch = WATCH_CATALOG[selectedIndex];

  return (
    <div style={{ height: "100vh" }}>
      <div style={{ padding: 16 }}>
        <h1>Phase 4: Watch Model Test</h1>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {WATCH_CATALOG.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setSelectedIndex(i)}
              style={{
                padding: "6px 12px",
                background: i === selectedIndex ? "#4a90d9" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 50 }}
        style={{ height: "calc(100vh - 100px)" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 5]} intensity={1.0} />
        <directionalLight position={[-2, -1, 3]} intensity={0.4} />
        <ProceduralWatch config={watch} visible={true} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}