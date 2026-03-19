import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCombatState } from "./combat/useCombatState";
import AtmosphereGlow from "./globe/AtmosphereGlow";
import CloudLayer from "./globe/CloudLayer";
import PlanetSphere from "./globe/PlanetSphere";
import { getSectorName } from "./globe/SectorSystem";
import {
  buildCloudTexture,
  buildDayTexture,
  buildHexTexture,
  buildNightTexture,
} from "./globe/globeTextures";
import { generateTargetId, useTacticalStore } from "./useTacticalStore";

export const NODE_COUNT = 14;

export const NODE_POSITIONS: [number, number][] = [
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

export const NODE_IDS: string[] = NODE_POSITIONS.map(
  (_, i) => `NODE-${String(i + 1).padStart(2, "0")}`,
);

export function latLngToVec3(
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

function TargetReticle({ lat, lng }: { lat: number; lng: number }) {
  const pos = useMemo(() => latLngToVec3(lat, lng, 1.54), [lat, lng]);
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  const quat = useMemo(() => {
    const posVec = new THREE.Vector3(...pos).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), posVec);
    return q;
  }, [pos]);

  useFrame(({ clock }) => {
    if (outerRef.current) {
      outerRef.current.rotation.z = clock.elapsedTime * 1.8;
    }
    if (innerRef.current) {
      const s = 1 + 0.2 * Math.sin(clock.elapsedTime * 6);
      innerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={pos} quaternion={quat}>
      {/* Outer spinning ring */}
      <mesh ref={outerRef}>
        <ringGeometry args={[0.07, 0.095, 32]} />
        <meshBasicMaterial
          color="#ff3333"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner pulsing dot */}
      <mesh ref={innerRef}>
        <circleGeometry args={[0.018, 16]} />
        <meshBasicMaterial
          color="#ff6666"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Corner tick marks */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
        <mesh
          key={angle}
          position={[0.11 * Math.cos(angle), 0.11 * Math.sin(angle), 0]}
          rotation={[0, 0, angle]}
        >
          <planeGeometry args={[0.025, 0.004]} />
          <meshBasicMaterial
            color="#ff4444"
            transparent
            opacity={0.8}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
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
  const pushEventLog = useTacticalStore((s) => s.pushEventLog);
  const scanMode = useTacticalStore((s) => s.scanMode);
  const targetHitFlash = useCombatState((s) => s.targetHitFlash);
  const empStunnedNode = useCombatState((s) => s.empStunnedNode);
  const isSelected = selectedNode === id;
  const isHit = isSelected && targetHitFlash;
  const isStunned = empStunnedNode === id;

  const pos = useMemo(() => latLngToVec3(lat, lng, 1.53), [lat, lng]);

  const handleSelect = useCallback(() => {
    selectNode(id);
    pushEventLog({ msg: `TARGET LOCKED: ${id}`, type: "lock" });
  }, [id, selectNode, pushEventLog]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshBasicMaterial;

    if (isHit) {
      const flashPulse = Math.abs(Math.sin(clock.elapsedTime * 22));
      mesh.scale.setScalar(4.0 + flashPulse * 1.5);
      mat.color.set("#ffffff");
      mat.opacity = 0.9 + flashPulse * 0.1;
    } else if (isStunned) {
      const flicker = Math.abs(Math.sin(clock.elapsedTime * 14 + phase));
      mesh.scale.setScalar(2.0 + flicker * 0.8);
      mat.color.set("#ff8800");
      mat.opacity = 0.4 + flicker * 0.5;
    } else if (isSelected) {
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
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh
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
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const scanMode = useTacticalStore((s) => s.scanMode);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (mesh) {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (scanMode) {
        mat.opacity = 0.65 + 0.25 * Math.sin(clock.elapsedTime * 3);
      } else {
        mat.opacity = 0.65;
      }
    }
    const mesh2 = meshRef2.current;
    if (mesh2) {
      const mat2 = mesh2.material as THREE.MeshBasicMaterial;
      mat2.opacity = 0.14 + 0.1 * Math.sin(clock.elapsedTime * 2.1 + 1.0);
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.505, 64, 64]} />
        <meshBasicMaterial
          map={hexTexture}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={meshRef2}>
        <sphereGeometry args={[1.507, 64, 64]} />
        <meshBasicMaterial
          map={hexTexture}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function ScanSweep() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[1.51, 1.54, 2, 1, 0, Math.PI * 0.35]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PolarAccent() {
  const nRef = useRef<THREE.Mesh>(null!);
  const sRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mat1 = nRef.current?.material as THREE.MeshBasicMaterial;
    const mat2 = sRef.current?.material as THREE.MeshBasicMaterial;
    if (mat1) mat1.opacity = 0.35 + 0.15 * Math.sin(t * 1.1);
    if (mat2) mat2.opacity = 0.3 + 0.12 * Math.sin(t * 1.1 + 1.5);
  });
  return (
    <>
      <mesh ref={nRef} position={[0, 1.51, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial
          color="#00ccff"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={sRef} position={[0, -1.51, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.14, 32]} />
        <meshBasicMaterial
          color="#0088cc"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function EnergyHotspot() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.2 * Math.sin(clock.elapsedTime * 1.8);
      meshRef.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[0.3, 1.35, 0.6]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#00ccff" transparent opacity={0.7} />
      </mesh>
      <pointLight color="#00ddff" intensity={1.5} distance={2.0} />
    </group>
  );
}

export default function GlobeCore() {
  const setHoveredCoords = useTacticalStore((s) => s.setHoveredCoords);
  const setGlobeTarget = useTacticalStore((s) => s.setGlobeTarget);
  const selectNode = useTacticalStore((s) => s.selectNode);
  const pushEventLog = useTacticalStore((s) => s.pushEventLog);
  const globeTarget = useTacticalStore((s) => s.globeTarget);

  const dayTexture = useMemo(() => buildDayTexture(), []);
  const nightTexture = useMemo(() => buildNightTexture(), []);
  const cloudTexture = useMemo(() => buildCloudTexture(), []);
  const hexTexture = useMemo(() => buildHexTexture(), []);

  const handleHover = useCallback(
    (lat: number, lng: number) => {
      setHoveredCoords({ lat, lng, sector: getSectorName(lat, lng) });
    },
    [setHoveredCoords],
  );

  const handleLeave = useCallback(() => {
    setHoveredCoords(null);
  }, [setHoveredCoords]);

  const handleGlobeClick = useCallback(
    (lat: number, lng: number) => {
      const sector = getSectorName(lat, lng);
      const id = generateTargetId();
      const threatLevel = Math.floor(Math.random() * 5) + 1;
      setGlobeTarget({ lat, lng, sector, id, threatLevel });
      selectNode(id);
      pushEventLog({
        msg: `TARGET ACQUIRED: ${id} @ ${lat.toFixed(1)}° ${lng.toFixed(1)}°`,
        type: "lock",
      });
    },
    [setGlobeTarget, selectNode, pushEventLog],
  );

  return (
    <group onPointerLeave={handleLeave}>
      <PlanetSphere
        dayTexture={dayTexture}
        nightTexture={nightTexture}
        onHover={handleHover}
        onClick={handleGlobeClick}
      />
      <CloudLayer cloudTexture={cloudTexture} />
      <AtmosphereGlow />
      <HexShell hexTexture={hexTexture} />
      <PolarAccent />
      <ScanSweep />
      <EnergyHotspot />
      <NodeMarkers />
      {globeTarget && (
        <TargetReticle lat={globeTarget.lat} lng={globeTarget.lng} />
      )}
    </group>
  );
}
