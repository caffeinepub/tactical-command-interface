import * as THREE from "three";

export const SHIP_ORIGIN = new THREE.Vector3(0, 0.1, 2.4);

// ─── Pulse Bolt ─────────────────────────────────────────────────────────────────────────────
export function PulseBolt({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  const pos = new THREE.Vector3().lerpVectors(SHIP_ORIGIN, targetPos, progress);
  const fadeIn = Math.min(1, progress * 8);
  const fadeOut =
    progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) * 6.67) : 1;
  const opacity = fadeIn * fadeOut;

  const tailOffsets = [0.04, 0.09, 0.14];
  const tailData = tailOffsets.map((offset, i) => {
    const tp = Math.max(0, progress - offset);
    const tailPos = new THREE.Vector3().lerpVectors(SHIP_ORIGIN, targetPos, tp);
    const rel = tailPos.clone().sub(pos);
    return {
      rel,
      opacity: opacity * (0.38 - i * 0.1),
      radius: 0.028 - i * 0.005,
      key: `tail-${offset}`,
    };
  });

  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={opacity * 0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color="#aaffee"
          transparent
          opacity={opacity * 0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {tailData.map((t) => (
        <mesh key={t.key} position={t.rel}>
          <sphereGeometry args={[t.radius, 6, 6]} />
          <meshBasicMaterial
            color="#00ffaa"
            transparent
            opacity={t.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Rail Slug ────────────────────────────────────────────────────────────────────────────
export function RailSlug({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  const dir = new THREE.Vector3()
    .subVectors(targetPos, SHIP_ORIGIN)
    .normalize();
  const pos = new THREE.Vector3().lerpVectors(SHIP_ORIGIN, targetPos, progress);

  const quat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(dir.dot(up)) < 0.999) {
    quat.setFromUnitVectors(up, dir);
  }

  const fadeIn = Math.min(1, progress * 12);
  const fadeOut = progress > 0.5 ? Math.max(0, 1 - (progress - 0.5) * 4) : 1;
  const opacity = fadeIn * fadeOut;

  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <cylinderGeometry args={[0.022, 0.022, 0.35, 6]} />
        <meshBasicMaterial
          color="#2266cc"
          transparent
          opacity={opacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.006, 0.006, 0.35, 6]} />
        <meshBasicMaterial
          color="#aaddff"
          transparent
          opacity={opacity * 0.97}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── EMP Wave ─────────────────────────────────────────────────────────────────────────────
export function EMPWave({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  const maxRadius = 0.9;
  const radius = progress * maxRadius;
  const opacity = (1 - progress) ** 0.7 * 0.85;
  const ringThickness = 0.015 + progress * 0.01;

  const quat = new THREE.Quaternion();
  const normal = targetPos.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(normal.dot(up)) < 0.99) {
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }

  return (
    <group position={targetPos} quaternion={quat}>
      <mesh>
        <torusGeometry args={[radius, ringThickness, 8, 64]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.6, ringThickness * 0.5, 8, 48]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={opacity * 0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {progress < 0.25 && (
        <mesh>
          <sphereGeometry args={[(0.25 - progress) * 0.6, 12, 12]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={(0.25 - progress) * 4 * 0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Missile Tracer ──────────────────────────────────────────────────────────────────────
export function MissileTracer({
  targetPos,
  progress,
}: {
  targetPos: THREE.Vector3;
  progress: number;
}) {
  const dir = new THREE.Vector3()
    .subVectors(targetPos, SHIP_ORIGIN)
    .normalize();
  const pos = new THREE.Vector3().lerpVectors(SHIP_ORIGIN, targetPos, progress);

  const quat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(dir.dot(up)) < 0.999) {
    quat.setFromUnitVectors(up, dir);
  }

  const fadeIn = Math.min(1, progress * 10);
  const fadeOut = progress > 0.75 ? Math.max(0, 1 - (progress - 0.75) * 4) : 1;
  const opacity = fadeIn * fadeOut;

  // Exhaust trail particles (static offsets behind missile)
  const trailOffsets = [0.05, 0.11, 0.18, 0.26];
  const trailData = trailOffsets.map((offset, i) => {
    const tp = Math.max(0, progress - offset);
    const trailPos = new THREE.Vector3().lerpVectors(
      SHIP_ORIGIN,
      targetPos,
      tp,
    );
    const rel = trailPos.clone().sub(pos);
    return {
      rel,
      opacity: opacity * (0.6 - i * 0.12),
      radius: 0.025 - i * 0.004,
      key: `mtrail-${i}`,
    };
  });

  return (
    <group position={pos} quaternion={quat}>
      {/* Missile body glow */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.012, 0.22, 6]} />
        <meshBasicMaterial
          color="#ff6644"
          transparent
          opacity={opacity * 0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Hot tip */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer heat glow */}
      <mesh>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={opacity * 0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Exhaust trail */}
      {trailData.map((t) => (
        <mesh key={t.key} position={t.rel}>
          <sphereGeometry args={[t.radius, 6, 6]} />
          <meshBasicMaterial
            color="#ff8844"
            transparent
            opacity={t.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
