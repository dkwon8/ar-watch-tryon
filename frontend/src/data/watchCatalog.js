/**
 * Watch catalog with procedural rendering parameters.
 *
 * Phase 1 uses procedurally generated watches from Three.js primitives.
 * Phase 2 replaces these with GLTF models served from S3/CloudFront.
 *
 * Each entry defines the visual parameters for the ProceduralWatch component:
 *   - case: cylinder geometry for the watch body
 *   - bezel: torus geometry for the ring around the case
 *   - band: box geometry for the strap
 *   - dial: circular face with hour markers
 */

const WATCH_CATALOG = [
    {
      id: "classic-silver",
      name: "Classic Silver",
      brand: "Heritage",
      style: "Dress",
      case: {
        radius: 0.2,
        height: 0.06,
        color: "#c0c0c0",
        metalness: 0.9,
        roughness: 0.1,
      },
      bezel: {
        color: "#a8a8a8",
        metalness: 0.95,
        roughness: 0.05,
      },
      band: {
        width: 0.16,
        color: "#1a1a1a",
        material: "leather",
      },
      dial: {
        color: "#f5f5f5",
        markerColor: "#333333",
        handColor: "#111111",
      },
      description: "Minimalist silver dress watch with black leather strap.",
    },
    {
      id: "sport-black",
      name: "Sport Chronograph",
      brand: "Apex",
      style: "Sport",
      case: {
        radius: 0.23,
        height: 0.08,
        color: "#1a1a1a",
        metalness: 0.7,
        roughness: 0.3,
      },
      bezel: {
        color: "#333333",
        metalness: 0.8,
        roughness: 0.2,
      },
      band: {
        width: 0.18,
        color: "#2a2a2a",
        material: "rubber",
      },
      dial: {
        color: "#0a0a0a",
        markerColor: "#00ff88",
        handColor: "#ffffff",
      },
      description: "Bold sport chronograph with luminous green markers.",
    },
    {
      id: "rose-gold",
      name: "Rose Gold Elegant",
      brand: "Maison",
      style: "Luxury",
      case: {
        radius: 0.19,
        height: 0.055,
        color: "#b76e79",
        metalness: 0.95,
        roughness: 0.05,
      },
      bezel: {
        color: "#c78088",
        metalness: 0.97,
        roughness: 0.03,
      },
      band: {
        width: 0.15,
        color: "#4a2a2a",
        material: "leather",
      },
      dial: {
        color: "#fff5f0",
        markerColor: "#b76e79",
        handColor: "#8b5e68",
      },
      description: "Rose gold case with warm ivory dial and cordovan strap.",
    },
    {
      id: "diver-blue",
      name: "Deep Diver 300m",
      brand: "Nauticus",
      style: "Dive",
      case: {
        radius: 0.22,
        height: 0.09,
        color: "#4a4a5a",
        metalness: 0.85,
        roughness: 0.15,
      },
      bezel: {
        color: "#1a3a6a",
        metalness: 0.6,
        roughness: 0.4,
      },
      band: {
        width: 0.18,
        color: "#4a4a5a",
        material: "steel",
      },
      dial: {
        color: "#0a1a3a",
        markerColor: "#88ccff",
        handColor: "#ffffff",
      },
      description: "Professional dive watch with unidirectional ceramic bezel.",
    },
    {
      id: "pilot-khaki",
      name: "Pilot Navigator",
      brand: "Aero",
      style: "Pilot",
      case: {
        radius: 0.24,
        height: 0.07,
        color: "#555555",
        metalness: 0.6,
        roughness: 0.4,
      },
      bezel: {
        color: "#444444",
        metalness: 0.5,
        roughness: 0.5,
      },
      band: {
        width: 0.19,
        color: "#5a4a3a",
        material: "leather",
      },
      dial: {
        color: "#1a1a1a",
        markerColor: "#f0e8d0",
        handColor: "#f0e8d0",
      },
      description: "Oversized pilot watch with luminous cathedral hands.",
    },
  ];
  
  export default WATCH_CATALOG;