import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function StarLayer({
  count,
  size,
  opacity,
  spread,
  driftSpeed,
}: {
  count: number;
  size: number;
  opacity: number;
  spread: number;
  driftSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on sphere surface for more even coverage
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = spread * (0.7 + Math.random() * 0.3);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, spread]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += driftSpeed;
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#d0e8ff"
          size={size}
          sizeAttenuation
          depthWrite={false}
          opacity={opacity}
        />
      </Points>
    </group>
  );
}

function BrightStars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 45 + Math.random() * 20;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        opacity={1.0}
      />
    </Points>
  );
}

function NebulaeHaze() {
  return (
    <>
      <mesh position={[3, 1.5, -14]} rotation={[0.1, 0.3, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshBasicMaterial
          color="#000d2a"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[-4, -2, -16]} rotation={[-0.05, -0.2, 0.1]}>
        <planeGeometry args={[20, 18]} />
        <meshBasicMaterial
          color="#00061a"
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[1, -3, -12]} rotation={[0.15, 0.1, -0.05]}>
        <planeGeometry args={[18, 14]} />
        <meshBasicMaterial
          color="#010818"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

export default function SpaceBackground() {
  return (
    <>
      {/* Far stars: 800, tiny, slow drift */}
      <StarLayer
        count={800}
        size={0.03}
        opacity={0.5}
        spread={60}
        driftSpeed={0.00008}
      />
      {/* Near stars: 600, slightly larger, faster */}
      <StarLayer
        count={600}
        size={0.06}
        opacity={0.8}
        spread={40}
        driftSpeed={0.00015}
      />
      {/* Bright sparse accent stars */}
      <BrightStars />
      {/* Nebula haze planes */}
      <NebulaeHaze />
    </>
  );
}
