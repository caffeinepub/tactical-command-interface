import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTacticalStore } from "./useTacticalStore";

export const NODE_COUNT = 14;

const NODE_POSITIONS: [number, number][] = [
  [45, -60],
  [30, 20],
  [60, 80],
  [-10, -30],
  [15, 110],
  [-30, 150],
  [50, -120],
  [20, -80],
  [-45, 60],
  [70, 30],
  [-20, -150],
  [35, 170],
  [-55, -90],
  [10, 50],
];

const NODE_IDS: string[] = NODE_POSITIONS.map(
  (_, i) => `NODE-${String(i + 1).padStart(2, "0")}`,
);

function usePlanetTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, size, size);

    const continents = [
      { x: 120, y: 200, rx: 80, ry: 60 },
      { x: 300, y: 180, rx: 90, ry: 70 },
      { x: 200, y: 340, rx: 70, ry: 50 },
      { x: 380, y: 300, rx: 60, ry: 55 },
      { x: 60, y: 360, rx: 50, ry: 40 },
    ];
    for (const c of continents) {
      const grad = ctx.createRadialGradient(
        c.x,
        c.y,
        0,
        c.x,
        c.y,
        Math.max(c.rx, c.ry),
      );
      grad.addColorStop(0, "rgba(18, 40, 60, 0.9)");
      grad.addColorStop(1, "rgba(10, 22, 40, 0)");
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    const fireGrad = ctx.createRadialGradient(40, 220, 0, 40, 220, 120);
    fireGrad.addColorStop(0, "rgba(200, 80, 20, 0.35)");
    fireGrad.addColorStop(0.5, "rgba(150, 40, 10, 0.15)");
    fireGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fireGrad;
    ctx.fillRect(0, 0, size, size);

    const lights: [number, number][] = [
      [130, 195],
      [145, 205],
      [310, 175],
      [295, 185],
      [205, 335],
      [215, 345],
      [385, 295],
      [375, 310],
      [70, 355],
      [55, 365],
      [250, 250],
      [260, 240],
      [180, 150],
      [400, 400],
      [100, 120],
    ];
    for (const [lx, ly] of lights) {
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 4);
      g.addColorStop(0, "rgba(255, 240, 180, 0.9)");
      g.addColorStop(1, "rgba(255, 220, 120, 0)");
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);
}

function useHexTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const size = 400;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    const hexSize = 18;
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    ctx.strokeStyle = "rgba(0,220,255,0.35)";
    ctx.lineWidth = 0.5;

    for (let row = -1; row < size / hexHeight + 2; row++) {
      for (let col = -1; col < size / hexWidth + 2; col++) {
        const x = col * hexWidth * 0.75;
        const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          const px = x + hexSize * Math.cos(angle);
          const py = y + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, []);
}

function latLngToVec3(
  lat: number,
  lng: number,
  r: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function NodeMarker({
  lat,
  lng,
  id,
  phase,
  index,
}: {
  lat: number;
  lng: number;
  id: string;
  phase: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const selectNode = useTacticalStore((s) => s.selectNode);
  const scanMode = useTacticalStore((s) => s.scanMode);
  const isSelected = selectedNode === id;

  const pos = useMemo(() => latLngToVec3(lat, lng, 1.53), [lat, lng]);

  const handleSelect = useCallback(() => {
    selectNode(id);
  }, [id, selectNode]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshBasicMaterial;

    if (isSelected) {
      const pulse = 1 + 0.3 * Math.sin(clock.elapsedTime * 4 + phase);
      mesh.scale.setScalar(2.5 * pulse);
      mat.color.set("#00ffff");
      mat.opacity = 1.0;
    } else if (hovered) {
      mesh.scale.setScalar(1.8);
      mat.color.set("#80dfff");
      mat.opacity = 0.9;
    } else {
      mesh.scale.setScalar(1.0);
      mat.color.set("#ffffff");
      const baseOpacity = scanMode ? 0.85 : 0.5;
      mat.opacity =
        baseOpacity +
        (scanMode ? 0.15 : 0.5) * Math.sin(clock.elapsedTime * 1.5 + phase);
    }
  });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh — not a DOM interactive element
    <mesh
      ref={meshRef}
      position={pos}
      onClick={handleSelect}
      onPointerUp={handleSelect}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      userData={{ nodeId: id, index }}
    >
      <sphereGeometry args={[0.022, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={1} />
    </mesh>
  );
}

function NodeMarkers() {
  const phases = useMemo(
    () => NODE_POSITIONS.map(() => Math.random() * Math.PI * 2),
    [],
  );

  return (
    <>
      {NODE_POSITIONS.map(([lat, lng], i) => (
        <NodeMarker
          key={NODE_IDS[i]}
          lat={lat}
          lng={lng}
          id={NODE_IDS[i]}
          phase={phases[i]}
          index={i}
        />
      ))}
    </>
  );
}

function HexShell({ hexTexture }: { hexTexture: THREE.CanvasTexture }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const scanMode = useTacticalStore((s) => s.scanMode);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshBasicMaterial;
    if (scanMode) {
      mat.opacity = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 3);
    } else {
      mat.opacity = 0.6;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.52, 64, 64]} />
      <meshBasicMaterial
        map={hexTexture}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

function EnergyHotspot() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.25 * Math.sin(clock.elapsedTime * 2.5);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[0, 1.45, 0.3]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.85} />
      </mesh>
      <pointLight color="#00ccff" intensity={2} distance={1.5} />
    </group>
  );
}

export default function GlobeCore() {
  const planetTexture = usePlanetTexture();
  const hexTexture = useHexTexture();

  return (
    <group>
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial
          map={planetTexture}
          color="#0d1f3c"
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      <Sphere args={[1.56, 32, 32]}>
        <meshBasicMaterial
          color="#2060ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      <Sphere args={[1.62, 32, 32]}>
        <meshBasicMaterial
          color="#1040cc"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      <HexShell hexTexture={hexTexture} />

      <EnergyHotspot />
      <NodeMarkers />
    </group>
  );
}
