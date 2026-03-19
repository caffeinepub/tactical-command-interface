import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCombatState } from "./combat/useCombatState";
import { useWeaponsStore } from "./combat/useWeapons";
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
import { useTutorialStore } from "./tutorial/useTutorialStore";
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

  /**
   * Two-tap targeting/firing:
   *   Tap 1 — node NOT selected → acquire lock
   *   Tap 2 — node already selected → fire active weapon
   */
  const handleTap = useCallback(() => {
    const currentNode = useTacticalStore.getState().selectedNode;
    if (currentNode === id) {
      // Second tap on same target → fire
      useWeaponsStore.getState().fireSelected();
    } else {
      // First tap → lock target
      selectNode(id);
      pushEventLog({ msg: `TARGET LOCKED: ${id}`, type: "lock" });
      import("./tacticalLog/useTacticalLogStore").then(
        ({ useTacticalLogStore }) => {
          useTacticalLogStore.getState().addEntry({
            type: "combat",
            message: `TARGET LOCKED: ${id}`,
          });
        },
      );
    }
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
      onClick={handleTap}
      onPointerUp={handleTap}
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

/**
 * GlobeHitPulse — brief expanding ring when a hit is registered.
 * Reads targetHitFlash from combat state.
 */
function GlobeHitPulse() {
  const pulseHitFlash = useCombatState((s) => s.pulseHitFlash);
  const railHitFlash = useCombatState((s) => s.railHitFlash);
  const targetHitFlash = useCombatState((s) => s.targetHitFlash);
  const active = pulseHitFlash || railHitFlash || targetHitFlash;
  const ringRef = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const startTimeRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (active && startTimeRef.current === null) {
      startTimeRef.current = clock.elapsedTime;
    }
    if (!active) {
      startTimeRef.current = null;
    }
    const r = ringRef.current;
    const r2 = ring2Ref.current;
    if (!r || !r2) return;
    if (!active || startTimeRef.current === null) {
      r.visible = false;
      r2.visible = false;
      return;
    }
    const elapsed = clock.elapsedTime - startTimeRef.current;
    const t = Math.min(elapsed / 0.45, 1.0);
    const scale = 1.0 + t * 0.6;
    const opacity = (1.0 - t) * 0.55;
    r.visible = true;
    r2.visible = true;
    r.scale.setScalar(scale);
    r2.scale.setScalar(scale * 1.15);
    (r.material as THREE.MeshBasicMaterial).opacity = opacity;
    (r2.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
  });

  return (
    <>
      <mesh ref={ringRef}>
        <ringGeometry args={[1.51, 1.58, 64]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[1.58, 1.68, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/**
 * TutorialTargetHint — pulsing globe surface cue during the "target" step.
 * Makes it obvious where to tap on mobile.
 */
function TutorialTargetHint() {
  const tutorialActive = useTutorialStore((s) => s.tutorialActive);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const ringRef = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const visible = tutorialActive && currentStep === "target";

  useFrame(({ clock }) => {
    const r = ringRef.current;
    const r2 = ring2Ref.current;
    if (!r || !r2) return;
    if (!visible) {
      r.visible = false;
      r2.visible = false;
      return;
    }
    const t = clock.elapsedTime;
    r.visible = true;
    r2.visible = true;
    const pulse = 0.25 + 0.25 * Math.sin(t * 2.5);
    const scale = 1.0 + 0.04 * Math.sin(t * 1.8);
    r.scale.setScalar(scale);
    r2.scale.setScalar(scale * 1.05);
    (r.material as THREE.MeshBasicMaterial).opacity = pulse;
    (r2.material as THREE.MeshBasicMaterial).opacity = pulse * 0.4;
  });

  return (
    <>
      {/* Equatorial guide ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.52, 1.56, 64]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.56, 1.62, 64]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
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

  /**
   * Revised two-tap targeting on globe surface.
   *
   * FIX: The old logic fired whenever ANY node was selected (including
   * NODE-xx markers), so tapping a new location never updated globeTarget
   * and the red reticle stayed frozen at the old position.
   *
   * New rule:
   *   - Second-tap (fire) ONLY triggers when:
   *       • there is already a globeTarget
   *       • the selected node ID matches that globeTarget's id
   *       • the id is NOT a NODE-xx marker
   *       • the new tap is within 25° (or 35° during tutorial) of the existing target
   *   - Everything else → ALWAYS update globeTarget so the reticle moves.
   */
  const handleGlobeClick = useCallback(
    (lat: number, lng: number) => {
      const tutorialActive = useTutorialStore.getState().tutorialActive;
      const tutorialStep = useTutorialStore.getState().currentStep;

      // During tutorial "target" step: always set new target, never fire weapon.
      // Bypasses the isSecondTap guard (with its 35° radius) so ANY tap advances tutorial.
      if (tutorialActive && tutorialStep === "target") {
        const sector = getSectorName(lat, lng);
        const id = generateTargetId();
        setGlobeTarget({ lat, lng, sector, id, threatLevel: 1 });
        selectNode(id);
        useTutorialStore.getState().setTargetDetected();
        return;
      }

      const currentTarget = useTacticalStore.getState().globeTarget as {
        lat: number;
        lng: number;
        sector: string;
        id: string;
        threatLevel: number;
      } | null;
      const currentSelectedNode = useTacticalStore.getState().selectedNode;

      // Beginner assist: wider fire-confirm radius during tutorial
      const fireDegRadius = tutorialActive ? 35 : 25;

      const isSecondTap =
        currentTarget !== null &&
        currentSelectedNode === currentTarget.id &&
        !currentTarget.id.startsWith("NODE-") &&
        Math.abs(lat - currentTarget.lat) < fireDegRadius &&
        Math.abs(lng - currentTarget.lng) < fireDegRadius;

      if (isSecondTap) {
        useWeaponsStore.getState().fireSelected();
        return;
      }

      // Always update target so reticle follows the new tap
      const sector = getSectorName(lat, lng);
      const id = generateTargetId();
      const threatLevel = Math.floor(Math.random() * 5) + 1;
      setGlobeTarget({ lat, lng, sector, id, threatLevel });
      selectNode(id);

      // Signal tutorial (belt-and-suspenders)
      useTutorialStore.getState().setTargetDetected();

      pushEventLog({
        msg: `TARGET ACQUIRED: ${id} @ ${lat.toFixed(1)}° ${lng.toFixed(1)}°`,
        type: "lock",
      });
      import("./tacticalLog/useTacticalLogStore").then(
        ({ useTacticalLogStore }) => {
          useTacticalLogStore.getState().addEntry({
            type: "combat",
            message: `TARGET ACQUIRED: ${id} @ ${lat.toFixed(1)}° ${lng.toFixed(1)}°`,
          });
        },
      );
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
      <GlobeHitPulse />
      <TutorialTargetHint />
    </group>
  );
}
