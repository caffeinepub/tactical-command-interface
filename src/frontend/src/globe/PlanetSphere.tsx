import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 sun = normalize(sunDirection);
  float dotNS = dot(vNormal, sun);
  float blend = smoothstep(-0.08, 0.28, dotNS);

  vec4 dayColor = texture2D(dayTexture, vUv);
  vec4 nightColor = texture2D(nightTexture, vUv);

  dayColor.rgb *= 2.0;
  dayColor.rgb = clamp(dayColor.rgb, 0.0, 1.0);
  dayColor.rgb += vec3(0.0, 0.04, 0.10) * blend;

  float shimmer = 0.025 * sin(time * 0.7 + vUv.x * 5.0) * blend;

  vec4 color = mix(nightColor, dayColor, blend);
  color.rgb += shimmer * vec3(0.0, 0.3, 0.6);

  gl_FragColor = color;
}
`;

interface PlanetSphereProps {
  dayTexture: THREE.CanvasTexture;
  nightTexture: THREE.CanvasTexture;
  onHover?: (lat: number, lng: number) => void;
  onClick?: (lat: number, lng: number) => void;
}

export default function PlanetSphere({
  dayTexture,
  nightTexture,
  onHover,
  onClick,
}: PlanetSphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const sunDir = new THREE.Vector3(5, 2, 3).normalize();
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.elapsedTime;
    }
  });

  const intersectToLatLng = (
    point: THREE.Vector3,
  ): { lat: number; lng: number } => {
    const r = point.length();
    const lat = 90 - Math.acos(point.y / r) * (180 / Math.PI);
    const lng = Math.atan2(point.z, -point.x) * (180 / Math.PI) - 180;
    const normalizedLng = ((lng + 540) % 360) - 180;
    return { lat, lng: normalizedLng };
  };

  const handlePointerMove = (e: { uv?: THREE.Vector2 }) => {
    if (!onHover || !e.uv) return;
    const lat = (0.5 - e.uv.y) * 180;
    const lng = (e.uv.x - 0.5) * 360;
    onHover(lat, lng);
  };

  const handlePointerDown = (e: { clientX?: number; clientY?: number }) => {
    pointerDownPos.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
  };

  const handleClick = (e: {
    point?: THREE.Vector3;
    clientX?: number;
    clientY?: number;
  }) => {
    if (!onClick) return;
    // Check if moved too much (drag vs click)
    if (pointerDownPos.current && e.clientX != null && e.clientY != null) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      if (dx * dx + dy * dy > 64) return; // 8px threshold
    }
    if (!e.point) return;
    const { lat, lng } = intersectToLatLng(e.point);
    onClick(lat, lng);
  };

  // onPointerUp — belt-and-suspenders for iOS Safari where onClick can be unreliable
  const handlePointerUp = (e: {
    point?: THREE.Vector3;
    clientX?: number;
    clientY?: number;
  }) => {
    if (!onClick) return;
    // Only fire if it was a short tap (not a drag)
    if (pointerDownPos.current && e.clientX != null && e.clientY != null) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      if (dx * dx + dy * dy > 64) return; // 8px threshold
    }
    if (!e.point) return;
    const { lat, lng } = intersectToLatLng(e.point);
    onClick(lat, lng);
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh — not a DOM element
    <mesh
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerUp={handlePointerUp}
    >
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          dayTexture: { value: dayTexture },
          nightTexture: { value: nightTexture },
          sunDirection: { value: sunDir },
          time: { value: 0 },
        }}
      />
    </mesh>
  );
}
