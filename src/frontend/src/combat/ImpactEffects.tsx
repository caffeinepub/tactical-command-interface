import * as THREE from "three";

// Renders only when progress >= 0.75

const SPARK_ANGLES = [
  { angle: 0, key: "spark-0" },
  { angle: Math.PI * 0.55, key: "spark-1" },
  { angle: Math.PI * 1.1, key: "spark-2" },
];

// ─── Pulse Impact ─────────────────────────────────────────────────────────────
export function PulseImpact({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  if (progress < 0.75) return null;
  const local = (progress - 0.75) / 0.25;
  const flashOpacity = Math.max(0, 1 - local * 4);
  const ringRadius = local * 0.22;
  const ringOpacity = Math.max(0, 1 - local * 2.5);

  return (
    <group position={targetPos}>
      {/* Sphere flash */}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={flashOpacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial
          color="#00ddaa"
          transparent
          opacity={flashOpacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Ring burst */}
      <mesh>
        <torusGeometry args={[ringRadius, 0.01, 6, 32]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={ringOpacity * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Rail Impact ──────────────────────────────────────────────────────────────
export function RailImpact({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  if (progress < 0.75) return null;
  const local = (progress - 0.75) / 0.25;
  const flashOpacity = Math.max(0, 1 - local * 3.5);

  return (
    <group position={targetPos}>
      {/* Core burst */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial
          color="#aaddff"
          transparent
          opacity={flashOpacity * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.26, 8, 8]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={flashOpacity * 0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Spark lines radiating outward */}
      {SPARK_ANGLES.map(({ angle, key }) => (
        <mesh
          key={key}
          position={[
            Math.cos(angle) * local * 0.14,
            Math.sin(angle) * local * 0.14,
            0,
          ]}
          rotation={[0, 0, angle]}
        >
          <cylinderGeometry args={[0.004, 0.001, local * 0.18 + 0.04, 3]} />
          <meshBasicMaterial
            color="#aaddff"
            transparent
            opacity={flashOpacity * 0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── EMP Impact ───────────────────────────────────────────────────────────────
export function EMPImpact({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  if (progress < 0.75) return null;
  const local = (progress - 0.75) / 0.25;
  const flashOpacity = Math.max(0, 1 - local * 3);
  const pulseRadius = local * 0.28;

  return (
    <group position={targetPos}>
      {/* Orange glow sphere */}
      <mesh>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={flashOpacity * 0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Secondary pulse ring */}
      <mesh>
        <torusGeometry args={[pulseRadius, 0.012, 6, 32]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={Math.max(0, 1 - local * 2) * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
