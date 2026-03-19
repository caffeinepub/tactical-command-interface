import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Fresnel rim glow — soft cyan/blue atmospheric edge, no ring look
const VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = `
varying vec3 vNormal;
varying vec3 vViewDir;
uniform float time;
void main() {
  float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.8);
  float pulse = 1.0 + 0.05 * sin(time * 0.4);
  // Warm cyan with slight blue shift for premium sci-fi feel
  vec3 color = vec3(0.05, 0.65, 1.0);
  float alpha = fresnel * 0.85 * pulse;
  gl_FragColor = vec4(color * fresnel * pulse, alpha);
}
`;

export default function AtmosphereGlow() {
  const outerRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    if (outerRef.current) {
      outerRef.current.uniforms.time.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {/* Primary fresnel rim glow */}
      <mesh>
        <sphereGeometry args={[1.68, 48, 48]} />
        <shaderMaterial
          ref={outerRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{ time: { value: 0 } }}
        />
      </mesh>
      {/* Tight inner haze */}
      <mesh>
        <sphereGeometry args={[1.54, 48, 48]} />
        <meshBasicMaterial
          color="#0099ff"
          side={THREE.BackSide}
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
