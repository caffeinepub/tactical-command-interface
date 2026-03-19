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

// Brighter day side, cleaner terminator, better tactical contrast
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

  // Boost day side brightness significantly
  dayColor.rgb *= 2.0;
  // Clamp to avoid blown highlights
  dayColor.rgb = clamp(dayColor.rgb, 0.0, 1.0);
  // Add subtle blue tactical tint to lit side
  dayColor.rgb += vec3(0.0, 0.04, 0.10) * blend;

  // Subtle shimmer on lit surface
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
}

export default function PlanetSphere({
  dayTexture,
  nightTexture,
  onHover,
}: PlanetSphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const sunDir = new THREE.Vector3(5, 2, 3).normalize();

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = clock.elapsedTime;
    }
  });

  const handlePointerMove = (e: { uv?: THREE.Vector2 }) => {
    if (!onHover || !e.uv) return;
    const lat = (0.5 - e.uv.y) * 180;
    const lng = (e.uv.x - 0.5) * 360;
    onHover(lat, lng);
  };

  return (
    <mesh onPointerMove={handlePointerMove}>
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
