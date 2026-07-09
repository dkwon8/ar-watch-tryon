import React, { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * Procedurally generated 3D watch model using Three.js primitives.
 *
 * Composed of:
 *   - Case body (cylinder)
 *   - Bezel ring (torus)
 *   - Dial face (circle with hour markers)
 *   - Crown knob (small cylinder on the side)
 *   - Band segments (boxes extending from case)
 *   - Hour/minute hands
 */
export default function ProceduralWatch({ config, visible }) {
  const groupRef = useRef();

  const {
    case: caseConfig,
    bezel: bezelConfig,
    band: bandConfig,
    dial: dialConfig,
  } = config;

  // Generate hour marker positions (12 markers around the dial)
  const hourMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const r = caseConfig.radius * 0.78;
      markers.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        rotation: angle + Math.PI / 2,
        isQuarter: i % 3 === 0,
      });
    }
    return markers;
  }, [caseConfig.radius]);

  // Current time for hand positions
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const hourAngle = -((hours + minutes / 60) / 12) * Math.PI * 2 + Math.PI / 2;
  const minuteAngle = -(minutes / 60) * Math.PI * 2 + Math.PI / 2;

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Watch case body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[caseConfig.radius, caseConfig.radius, caseConfig.height, 64]}
        />
        <meshStandardMaterial
          color={caseConfig.color}
          metalness={caseConfig.metalness}
          roughness={caseConfig.roughness}
        />
      </mesh>

      {/* Bezel ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry
          args={[caseConfig.radius, caseConfig.height * 0.35, 16, 64]}
        />
        <meshStandardMaterial
          color={bezelConfig.color}
          metalness={bezelConfig.metalness}
          roughness={bezelConfig.roughness}
        />
      </mesh>

      {/* Dial face */}
      <mesh position={[0, 0, caseConfig.height / 2 + 0.001]}>
        <circleGeometry args={[caseConfig.radius * 0.88, 64]} />
        <meshStandardMaterial
          color={dialConfig.color}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Hour markers */}
      {hourMarkers.map((marker, i) => (
        <mesh
          key={i}
          position={[marker.x, marker.y, caseConfig.height / 2 + 0.003]}
          rotation={[0, 0, marker.rotation]}
        >
          <boxGeometry
            args={[
              marker.isQuarter ? 0.012 : 0.006,
              marker.isQuarter ? 0.035 : 0.02,
              0.003,
            ]}
          />
          <meshStandardMaterial
            color={dialConfig.markerColor}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Hour hand */}
      <mesh
        position={[
          Math.cos(hourAngle) * caseConfig.radius * 0.25,
          Math.sin(hourAngle) * caseConfig.radius * 0.25,
          caseConfig.height / 2 + 0.005,
        ]}
        rotation={[0, 0, hourAngle - Math.PI / 2]}
      >
        <boxGeometry args={[caseConfig.radius * 0.5, 0.012, 0.004]} />
        <meshStandardMaterial color={dialConfig.handColor} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Minute hand */}
      <mesh
        position={[
          Math.cos(minuteAngle) * caseConfig.radius * 0.33,
          Math.sin(minuteAngle) * caseConfig.radius * 0.33,
          caseConfig.height / 2 + 0.007,
        ]}
        rotation={[0, 0, minuteAngle - Math.PI / 2]}
      >
        <boxGeometry args={[caseConfig.radius * 0.66, 0.008, 0.003]} />
        <meshStandardMaterial color={dialConfig.handColor} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Center pin */}
      <mesh
        position={[0, 0, caseConfig.height / 2 + 0.009]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.008, 0.008, 0.005, 16]} />
        <meshStandardMaterial color={dialConfig.handColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Crown knob */}
      <mesh
        position={[caseConfig.radius + 0.02, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.015, 0.015, 0.025, 16]} />
        <meshStandardMaterial
          color={caseConfig.color}
          metalness={caseConfig.metalness}
          roughness={caseConfig.roughness}
        />
      </mesh>

      {/* Upper band segment */}
      <mesh position={[0, caseConfig.radius + 0.08, 0]}>
        <boxGeometry args={[bandConfig.width, 0.18, caseConfig.height * 0.6]} />
        <meshStandardMaterial
          color={bandConfig.color}
          metalness={bandConfig.material === "steel" ? 0.8 : 0.05}
          roughness={bandConfig.material === "steel" ? 0.2 : 0.9}
        />
      </mesh>

      {/* Lower band segment */}
      <mesh position={[0, -(caseConfig.radius + 0.08), 0]}>
        <boxGeometry args={[bandConfig.width, 0.18, caseConfig.height * 0.6]} />
        <meshStandardMaterial
          color={bandConfig.color}
          metalness={bandConfig.material === "steel" ? 0.8 : 0.05}
          roughness={bandConfig.material === "steel" ? 0.2 : 0.9}
        />
      </mesh>
    </group>
  );
}